import json, os

with open("sites/dayah-litworks/content/es.json") as f:
    content = json.load(f)

svg_dir = "web/public/images/dayah/covers"
svg_covers = [f.replace('.svg','') for f in os.listdir(svg_dir) if f.endswith('.svg')]

items = content["home"]["products"]["items"]
print(f"Current items: {len(items)}")
print(f"Available SVGs: {len(svg_covers)}")
print(f"SVG names: {svg_covers}")

for i, item in enumerate(items):
    name = item["name"]
    slug = name.lower().replace(" ", "-").replace("í","i").replace("ó","o").replace("ú","u").replace("á","a").replace("é","e")
    svg_match = f"{slug}.svg"
    if svg_match in os.listdir(svg_dir):
        item["image"] = f"/images/dayah/covers/{slug}.svg"
        print(f"  {name:30s} -> {slug}.svg (SVG)")
    else:
        # Try exact match ignoring case
        found = False
        for svg_name in os.listdir(svg_dir):
            if svg_name.lower() == svg_match.lower():
                item["image"] = f"/images/dayah/covers/{svg_name}"
                print(f"  {name:30s} -> {svg_name} (SVG match)")
                found = True
                break
        if not found:
            item["image"] = ""
            print(f"  {name:30s} -> NO IMAGE (available SVGs: {svg_covers})")

with open("sites/dayah-litworks/content/es.json", "w") as f:
    json.dump(content, f, indent=2, ensure_ascii=False)

print(f"\nProducts with images: {sum(1 for i in items if i.get('image'))}/{len(items)}")
