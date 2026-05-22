#!/usr/bin/env python3
"""
Migrate site configurations from file system to Supabase.
Reads site.json and locale-specific files from sites/ directory
and uploads to Supabase site_content table.

Usage: python scripts/migrate_to_supabase.py <tenant_slug>
Example: python scripts/migrate_to_supabase.py nexa-paraguay
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
import requests

# Load .env if present (development convenience)
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k, v)

# Environment variables or defaults
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://qyvokpribmbrosafntqa.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Headers for Supabase REST API
HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=minimal"
}

def read_json_file(path: Path) -> dict:
    """Read and parse a JSON file."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return {}

def insert_content(tenant_slug: str, locale: str, key_path: str, content: dict):
    """Insert or update content in Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/site_content?on_conflict=tenant_slug,locale,key_path"
    data = {
        "tenant_slug": tenant_slug,
        "locale": locale,
        "key_path": key_path,
        "content": content,
        "updated_at": datetime.utcnow().isoformat()
    }

    try:
        response = requests.post(url, json=data, headers=HEADERS)
        if response.status_code in [200, 201]:
            print(f"  ✓ {key_path}")
            return True
        else:
            print(f"  ✗ {key_path}: {response.status_code} - {response.text[:100]}")
            return False
    except Exception as e:
        print(f"  ✗ {key_path}: {e}")
        return False

def migrate_tenant(tenant_slug: str, sites_dir: Path):
    """Migrate a single tenant's configuration."""
    tenant_dir = sites_dir / tenant_slug
    if not tenant_dir.exists():
        print(f"Tenant directory not found: {tenant_dir}")
        return

    site_json_path = tenant_dir / "site.json"
    if not site_json_path.exists():
        print(f"site.json not found: {site_json_path}")
        return

    site_config = read_json_file(site_json_path)
    primary_locale = site_config.get("defaultLocale", "es")
    locales = site_config.get("locales", [primary_locale])

    print(f"\nMigrating: {tenant_slug}")
    print(f"  Locales: {', '.join(locales)}")
    print(f"  Primary: {primary_locale}")

    # Migrate site.json config as special keys
    config_mapping = {
        "vertical": "vertical",
        "domain": "domain",
        "brandName": "brand_name",
        "description": "description",
        "social": "social_links",
        "contact": "contact_info",
        "features": "features",
        "pricing": "pricing",
        "testimonials": "testimonials",
        "faq": "faq"
    }

    for json_key, config_key in config_mapping.items():
        if json_key in site_config and site_config[json_key] is not None:
            for locale in locales:
                insert_content(tenant_slug, locale, f"__config__.{config_key}", site_config[json_key])

    # Migrate page and content files from root-level dirs (backup structure)
    # Structure: content/es.json, pages/home.json, images.json, tokens.json
    content_count = 0
    primary = primary_locale

    # Migrate pages/ directory
    pages_dir = tenant_dir / "pages"
    if pages_dir.exists():
        for json_file in sorted(pages_dir.glob("*.json")):
            key = f"page.{json_file.stem}"
            content = read_json_file(json_file)
            if content:
                for locale in locales:
                    if insert_content(tenant_slug, locale, key, content):
                        content_count += 1

    # Migrate content/ directory
    content_dir = tenant_dir / "content"
    if content_dir.exists():
        for json_file in sorted(content_dir.glob("*.json")):
            key = f"content.{json_file.stem}"
            content = read_json_file(json_file)
            if content:
                insert_content(tenant_slug, primary, key, content)
                content_count += 1

    # Migrate blog index if it exists
    blog_dir = tenant_dir / "content" / "blog"
    if blog_dir.exists():
        for json_file in sorted(blog_dir.glob("*.json")):
            key = f"content.blog.{json_file.stem}"
            content = read_json_file(json_file)
            if content:
                insert_content(tenant_slug, primary, key, content)
                content_count += 1

    # Migrate images.json at root
    images_path = tenant_dir / "images.json"
    if images_path.exists():
        content = read_json_file(images_path)
        if content:
            for locale in locales:
                if insert_content(tenant_slug, locale, "images", content):
                    content_count += 1

    # Migrate tokens.json at root
    tokens_path = tenant_dir / "tokens.json"
    if tokens_path.exists():
        content = read_json_file(tokens_path)
        if content:
            for locale in locales:
                if insert_content(tenant_slug, locale, "tokens", content):
                    content_count += 1

    # Also try locale-specific dirs (original structure, for compatibility)
    for locale in locales:
        locale_dir = tenant_dir / locale
        if locale_dir.exists():
            for json_file in locale_dir.glob("*.json"):
                key = json_file.stem.replace("-", ".")
                content = read_json_file(json_file)
                if content:
                    if insert_content(tenant_slug, locale, key, content):
                        content_count += 1

    print(f"\n✓ Migration completed for {tenant_slug}")
    print(f"  Config keys: {len(config_mapping)}")
    print(f"  Content items migrated: {content_count}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/migrate_to_supabase.py <tenant_slug>")
        print("Example: python scripts/migrate_to_supabase.py nexa-paraguay")
        sys.exit(1)

    tenant_slug = sys.argv[1]

    # Find sites directory
    script_dir = Path(__file__).parent.parent
    backup_dir = script_dir / ".backup" / "sites-configs"
    sites_dir = backup_dir  # Read from backup after deletion

    if not sites_dir.exists():
        print(f"Backup directory not found: {sites_dir}")
        print("Cannot migrate - site configs already deleted or moved")
        sys.exit(1)

    # Check if tenant exists in backup
    tenant_dir = sites_dir / tenant_slug
    if not tenant_dir.exists():
        print(f"Tenant not found in backup: {tenant_dir}")
        print(f"Available tenants: {[d.name for d in sites_dir.iterdir() if d.is_dir()]}")
        sys.exit(1)

    print(f"Supabase URL: {SUPABASE_URL}")
    print(f"Service key: {SUPABASE_SERVICE_KEY[:20]}...{SUPABASE_SERVICE_KEY[-10:]}")

    # Test connection
    test_url = f"{SUPABASE_URL}/rest/v1/site_content?select=count&limit=1"
    try:
        response = requests.get(test_url, headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
        })
        if response.status_code != 200:
            print(f"Connection failed: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            sys.exit(1)
        print("✓ Supabase connection successful")
    except Exception as e:
        print(f"Connection error: {e}")
        sys.exit(1)

    # Migrate the tenant
    migrate_tenant(tenant_slug, sites_dir)

if __name__ == "__main__":
    main()