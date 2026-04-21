from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def _try_font(*names: str, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except Exception:
            continue
    return ImageFont.load_default()


def _save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, format="PNG", optimize=True)


def main() -> None:
    root = Path("web/public")
    root.mkdir(parents=True, exist_ok=True)

    # Colors (aligned with current OG gradient vibe)
    navy = (26, 26, 46)
    indigo = (99, 102, 241)
    pink = (236, 72, 153)
    white = (255, 255, 255)

    # --- logo-mark.png (512x512) ---
    mark = Image.new("RGBA", (512, 512), navy + (255,))
    d = ImageDraw.Draw(mark)

    # Diagonal gradient strokes
    for i in range(512):
        t = i / 511
        r = int(indigo[0] * (1 - t) + pink[0] * t)
        g = int(indigo[1] * (1 - t) + pink[1] * t)
        b = int(indigo[2] * (1 - t) + pink[2] * t)
        d.line([(0, i), (i, 0)], fill=(r, g, b, 220), width=6)

    font_ai = _try_font("arialbd.ttf", "arial.ttf", size=180)
    text = "AI"
    bbox = d.textbbox((0, 0), text, font=font_ai)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((512 - tw) / 2, (512 - th) / 2 - 10), text, font=font_ai, fill=white)
    _save_png(mark, root / "logo-mark.png")

    # --- logo.png (1024x256) ---
    logo = Image.new("RGBA", (1024, 256), (0, 0, 0, 0))
    icon = mark.resize((200, 200), Image.Resampling.LANCZOS)
    logo.alpha_composite(icon, (28, 28))

    pill = Image.new("RGBA", (760, 200), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pill)
    pd.rounded_rectangle((0, 0, 760, 200), radius=40, fill=(22, 33, 62, 255))

    font_word = _try_font("arialbd.ttf", "arial.ttf", size=120)
    x = 48
    pd.text((x, 38), "Paragu", font=font_word, fill=white)
    try:
        w_paragu = pd.textlength("Paragu", font=font_word)
    except Exception:
        w_paragu = 360
    pd.text((x + w_paragu, 38), "AI", font=font_word, fill=(167, 139, 250, 255))

    logo.alpha_composite(pill, (260, 28))
    _save_png(logo, root / "logo.png")

    # --- favicon pngs ---
    _save_png(mark.resize((16, 16), Image.Resampling.LANCZOS), root / "favicon-16x16.png")
    _save_png(mark.resize((32, 32), Image.Resampling.LANCZOS), root / "favicon-32x32.png")

    # --- apple touch + android icons ---
    _save_png(mark.resize((180, 180), Image.Resampling.LANCZOS), root / "apple-touch-icon.png")
    _save_png(mark.resize((192, 192), Image.Resampling.LANCZOS), root / "android-chrome-192x192.png")
    _save_png(mark.resize((512, 512), Image.Resampling.LANCZOS), root / "android-chrome-512x512.png")

    # --- og-default.png (1200x630) ---
    og = Image.new("RGBA", (1200, 630), navy + (255,))
    od = ImageDraw.Draw(og)
    for x in range(1200):
        t = x / 1199
        r = int(26 * (1 - t) + 15 * t)
        g = int(26 * (1 - t) + 52 * t)
        b = int(46 * (1 - t) + 96 * t)
        od.line([(x, 0), (x, 629)], fill=(r, g, b, 255))

    for i in range(0, 240):
        alpha = max(0, 140 - i)
        od.ellipse(
            (860 - i, 80 - i, 860 + 220 + i, 80 + 220 + i),
            outline=(99, 102, 241, alpha),
            width=4,
        )

    og.alpha_composite(mark.resize((140, 140), Image.Resampling.LANCZOS), (80, 70))

    f1 = _try_font("arialbd.ttf", "arial.ttf", size=78)
    f2 = _try_font("arial.ttf", "arialbd.ttf", size=34)
    f3 = _try_font("arial.ttf", "arialbd.ttf", size=28)
    od.text((250, 80), "ParaguAI Builder", font=f1, fill=white)
    od.text((250, 175), "Sitios web profesionales en 48 horas", font=f2, fill=(203, 213, 225, 255))
    od.text((250, 225), "Todo incluido: diseño, dominio .com.py, SEO y WhatsApp", font=f2, fill=(148, 163, 184, 255))
    od.text((80, 570), "paragu-ai.com", font=f3, fill=(148, 163, 184, 255))
    _save_png(og, root / "og-default.png")

    # --- favicon.ico ---
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    imgs = [mark.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
    imgs[0].save(root / "favicon.ico", format="ICO", sizes=ico_sizes)

    print("Generated platform assets into web/public")


if __name__ == "__main__":
    main()

