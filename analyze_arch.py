import json, os, re

print("=== ARCHITECTURE MAP ===\n")

os.chdir("/tmp/pab-work")

# 1. SECTION COMPONENTS
print("1. SECTION COMPONENTS")
sections = sorted(os.listdir("web/components/sections/"))
print(f"   {len(sections)} categories:", sections)

all_sections = []
for cat in sections:
    for f in sorted(os.listdir(f"web/components/sections/{cat}")):
        if f.endswith(".tsx") or f.endswith(".ts"):
            all_sections.append(f"{cat}/{f}")
print(f"   {len(all_sections)} total section files")
for s in all_sections:
    print(f"     {s}")

# 2. SECTION REGISTRY
with open("web/lib/engine/section-registry.ts") as f:
    reg = f.read()

# Find all section catalog entries
catalog_entries = re.findall(r"'([^']+)':\s*\{[^}]*id:\s*'([^']+)'[^}]*defaultVariant:\s*'([^']+)'[^}]*variants:\s*\[([^\]]+)\]", reg)
print(f"\n2. SECTION CATALOG: {len(catalog_entries)} entries")
for name, sid, dv, variants in catalog_entries[:15]:
    print(f"   {name:25s} -> id={sid:20s} dv={dv:10s} variants=[{variants.strip()}]")

# 3. DAYAH THEME
with open("sites/dayah-litworks/tokens.json") as f:
    tokens = json.load(f)
colors = tokens["palettes"]["default"]["colors"]
print(f"\n3. DAYAH THEME COLORS")
for k, v in colors.items():
    print(f"   --{k:20s}: {v}")

# 4. THE PROBLEM QUANTIFIED
bg = int(colors['background'][1:], 16)
surface = int(colors['surface'][1:], 16)
surface_light = int(colors['surfaceLight'][1:], 16)
text = int(colors['text'][1:], 16)
text_muted = int(colors['textMuted'][1:], 16)

print(f"\n4. CONTRAST ANALYSIS")
print(f"   bg ({colors['background']:#>10s}) base")
print(f"   surface ({colors['surface']:#>9s}) delta = {surface - bg:+d}")
print(f"   surfaceLight ({colors['surfaceLight']:#>6s}) delta = {surface_light - bg:+d}")
print(f"   text ({colors['text']:#>13s}) from bg delta = {text - bg:+d}")
print(f"   textMuted ({colors['textMuted']:#>8s}) from bg delta = {text_muted - bg:+d}")
print(f"   textMuted from text delta = {text_muted - text:+d}")

# 5. HOME LAYOUT
with open("sites/dayah-litworks/pages/home.json") as f:
    home = json.load(f)
print(f"\n5. HOME PAGE LAYOUT ({len(home['sections'])} sections)")
for i, s in enumerate(home["sections"]):
    st = s.get("styling", {})
    bg_type = st.get("background", "alternates")
    print(f"   [{i:2d}] {s['id']:25s} v={str(s.get('variant','')):12s} bg={bg_type}")

# 6. FOOTER STRUCTURE
with open("sites/dayah-litworks/content/es.json") as f:
    content = json.load(f)
footer = content.get("footer", {})
print(f"\n6. FOOTER")
print(f"   Keys: {list(footer.keys())}")
for k, v in footer.items():
    if isinstance(v, str):
        print(f"   {k}: {v[:80]}")

# 7. PROCESS STEPS
process = content.get("home", {}).get("process", {}).get("steps", [])
print(f"\n7. PROCESS ({len(process)} steps)")
for s in process:
    if isinstance(s, dict):
        print(f"   - {s.get('title','')}: {str(s.get('description',''))[:70]}")

print("\n=== DONE ===")
