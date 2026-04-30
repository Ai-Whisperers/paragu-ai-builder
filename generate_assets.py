#!/usr/bin/env python3
"""Generate high-quality SVG book cover placeholders for Dayah LitWorks."""
import os

COVERS_DIR = "/tmp/pab-work/web/public/images/dayah/covers"
os.makedirs(COVERS_DIR, exist_ok=True)

def make_cover_svg(filename, title, subtitle, gradient_from, gradient_to, accent, text_color="#ffffff", genre=""):
    """Generate a professional-looking book cover SVG."""
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{gradient_from};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{gradient_to};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glow" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" style="stop-color:{accent};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:{accent};stop-opacity:0" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="2" dy="4" stdDeviation="6" flood-opacity="0.4" flood-color="#000"/>
    </filter>
    <filter id="innerGlow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background gradient -->
  <rect width="600" height="900" fill="url(#bg)" rx="8"/>

  <!-- Decorative overlay -->
  <rect width="600" height="900" fill="url(#glow)" rx="8"/>

  <!-- Subtle texture lines -->
  <g opacity="0.04">
    {chr(10).join(f'    <line x1="0" y1="{y}" x2="600" y2="{y}" stroke="#fff" stroke-width="0.5"/>' for y in range(0, 901, 30))}
  </g>

  <!-- Border frame -->
  <rect x="20" y="20" width="560" height="860" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" rx="4"/>
  <rect x="30" y="30" width="540" height="840" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" rx="3"/>

  <!-- Decorative top element -->
  <ellipse cx="300" cy="250" rx="200" ry="120" fill="{accent}" opacity="0.08"/>
  <ellipse cx="300" cy="550" rx="180" ry="100" fill="{accent}" opacity="0.05"/>

  <!-- Genre badge -->
  <rect x="220" y="420" width="160" height="28" rx="14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
  <text x="300" y="439" text-anchor="middle" font-family="'Inter',sans-serif" font-size="11" font-weight="600" letter-spacing="3" fill="rgba(255,255,255,0.7)" text-transform="uppercase">{genre}</text>

  <!-- Title -->
  <text x="300" y="510" text-anchor="middle" font-family="'Playfair Display','Georgia',serif" font-size="36" font-weight="700" fill="{text_color}" filter="url(#shadow)">{title}</text>

  <!-- Subtitle / author -->
  <text x="300" y="550" text-anchor="middle" font-family="'Inter',sans-serif" font-size="14" font-weight="400" fill="rgba(255,255,255,0.5)" letter-spacing="2">{subtitle}</text>

  <!-- Bottom decorative line -->
  <line x1="200" y1="575" x2="400" y2="575" stroke="{accent}" stroke-width="1" opacity="0.3"/>

  <!-- Price badge -->
  <rect x="250" y="620" width="100" height="32" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <text x="300" y="641" text-anchor="middle" font-family="'Inter',sans-serif" font-size="12" font-weight="500" fill="rgba(255,255,255,0.6)">{genre} PREMADE</text>

  <!-- Dayah watermark -->
  <text x="300" y="860" text-anchor="middle" font-family="'Inter',sans-serif" font-size="9" font-weight="300" fill="rgba(255,255,255,0.2)" letter-spacing="4">DAYAH LITWORKS</text>
</svg>'''
    path = os.path.join(COVERS_DIR, filename)
    with open(path, "w") as f:
        f.write(svg)
    print(f"  Created {filename}")

print("Generating 6 premade catalog covers...")

covers = [
    ("susurros-del-bosque.svg", "Susurros del Bosque", "Una novela de", "#2d1b4e", "#1a0f2e", "#d4a847", "#f0e6d3", "FANTASÍA ROMANCE"),
    ("corazon-de-cenizas.svg", "Corazón de Cenizas", "Una novela de", "#1a0505", "#0d0202", "#8b0000", "#e8c4c4", "DARK ROMANCE"),
    ("el-ultimo-codigo.svg", "El Último Código", "Una novela de", "#0a1628", "#040a14", "#00bcd4", "#b0e0e6", "THRILLER"),
    ("galaxia-interior.svg", "Galaxia Interior", "Una novela de", "#0d0d2b", "#05051a", "#7c3aed", "#c4b5fd", "CIENCIA FICCIÓN"),
    ("sombras-en-el-espejo.svg", "Sombras en el Espejo", "Una novela de", "#0d1a0d", "#050d05", "#4a0000", "#a0a0a0", "HORROR"),
    ("alas-de-cristal.svg", "Alas de Cristal", "Una novela de", "#2d1b3e", "#1a0f2e", "#e879f9", "#f3e8ff", "FANTASÍA JUVENIL"),
]

for fname, title, subtitle, g1, g2, accent, text, genre in covers:
    make_cover_svg(fname, title, subtitle, g1, g2, accent, text, genre)

print("\nGenerating hero background...")
hero_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a14;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#11132a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a14;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="40%" r="40%">
      <stop offset="0%" style="stop-color:#d43d5e;stop-opacity:0.15" />
      <stop offset="50%" style="stop-color:#94abd6;stop-opacity:0.05" />
      <stop offset="100%" style="stop-color:transparent" />
    </radialGradient>
    <radialGradient id="glow2" cx="30%" cy="60%" r="30%">
      <stop offset="0%" style="stop-color:#94abd6;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:transparent" />
    </radialGradient>
    <filter id="goldenGlow">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <rect width="1920" height="1080" fill="url(#glow1)"/>
  <rect width="1920" height="1080" fill="url(#glow2)"/>

  <!-- Golden light rays from center -->
  <g opacity="0.04">
    <line x1="960" y1="1080" x2="0" y2="0" stroke="#d4a847" stroke-width="60"/>
    <line x1="960" y1="1080" x2="300" y2="0" stroke="#d4a847" stroke-width="40"/>
    <line x1="960" y1="1080" x2="600" y2="0" stroke="#d4a847" stroke-width="50"/>
    <line x1="960" y1="1080" x2="960" y2="0" stroke="#d4a847" stroke-width="30"/>
    <line x1="960" y1="1080" x2="1320" y2="0" stroke="#d4a847" stroke-width="40"/>
    <line x1="960" y1="1080" x2="1620" y2="0" stroke="#d4a847" stroke-width="50"/>
    <line x1="960" y1="1080" x2="1920" y2="0" stroke="#d4a847" stroke-width="60"/>
  </g>

  <!-- Center golden glow -->
  <ellipse cx="960" cy="540" rx="200" ry="200" fill="#d4a847" opacity="0.06" filter="url(#goldenGlow)"/>
  <ellipse cx="960" cy="540" rx="80" ry="80" fill="#ffd700" opacity="0.08"/>

  <!-- Floating particles -->
  <circle cx="300" cy="200" r="2" fill="#94abd6" opacity="0.3"/>
  <circle cx="1500" cy="300" r="1.5" fill="#d43d5e" opacity="0.25"/>
  <circle cx="600" cy="800" r="1" fill="#94abd6" opacity="0.2"/>
  <circle cx="1300" cy="700" r="2" fill="#d43d5e" opacity="0.3"/>
  <circle cx="400" cy="400" r="1.5" fill="rgba(255,255,255,0.15)"/>
  <circle cx="1600" cy="500" r="1" fill="rgba(255,255,255,0.2)"/>
  <circle cx="800" cy="200" r="1" fill="#d4a847" opacity="0.3"/>
  <circle cx="1100" cy="850" r="2" fill="#94abd6" opacity="0.15"/>
  <circle cx="200" cy="650" r="1" fill="rgba(255,255,255,0.1)"/>
  <circle cx="1700" cy="150" r="1.5" fill="#d4a847" opacity="0.2"/>
</svg>'''

with open(os.path.join(COVERS_DIR, "hero-bg.svg"), "w") as f:
    f.write(hero_svg)
print("  Created hero-bg.svg")

print("\nGenerating 4 service card images...")
services = [
    ("svc-ebook.svg", "Diseño de Portada eBook", "Portada personalizada para libro electrónico", "#1a1a3e", "#0a0a2e", "#94abd6"),
    ("svc-paperback.svg", "Diseño de Tapa Blanda", "Portada completa frente + lomo + contra", "#2d1b3e", "#1a0f2e", "#d43d5e"),
    ("svc-3dmockup.svg", "Mockup 3D Estático", "Render realista de tu libro en 3D", "#0a0a14", "#1a1a3e", "#6691c8"),
    ("svc-video.svg", "Video Mockup 3D", "Animación de 5-10 segundos para redes", "#1a0f2e", "#0a0a14", "#d43d5e"),
]

for fname, title, desc, g1, g2, accent in services:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{g1};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:{g2};stop-opacity:1"/>
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:{accent};stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:{accent};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#bg)" rx="12"/>
  <rect x="20" y="20" width="560" height="760" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" rx="8"/>
  <rect x="40" y="60" width="520" height="400" fill="rgba(255,255,255,0.03)" rx="8"/>
  <rect x="60" y="80" width="200" height="300" fill="rgba(255,255,255,0.04)" rx="4"/>
  <line x1="280" y1="80" x2="280" y2="380" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="300" y="100" width="240" height="8" rx="4" fill="url(#bar)"/>
  <rect x="300" y="120" width="180" height="8" rx="4" fill="rgba(255,255,255,0.04)"/>
  <rect x="300" y="140" width="200" height="8" rx="4" fill="rgba(255,255,255,0.03)"/>
  <rect x="300" y="170" width="240" height="8" rx="4" fill="url(#bar)"/>
  <rect x="300" y="190" width="160" height="8" rx="4" fill="rgba(255,255,255,0.04)"/>
  <rect x="300" y="210" width="200" height="8" rx="4" fill="rgba(255,255,255,0.03)"/>
  <text x="300" y="520" text-anchor="middle" font-family="'Playfair Display','Georgia',serif" font-size="28" font-weight="700" fill="#ffffff">{title}</text>
  <text x="300" y="555" text-anchor="middle" font-family="'Inter',sans-serif" font-size="14" font-weight="400" fill="rgba(255,255,255,0.5)">{desc}</text>
  <rect x="200" y="600" width="200" height="44" rx="22" fill="{accent}" opacity="0.2" stroke="{accent}" stroke-width="0.5" opacity="0.3"/>
  <text x="300" y="627" text-anchor="middle" font-family="'Inter',sans-serif" font-size="12" font-weight="600" fill="{accent}" letter-spacing="2">DESDE USD 15</text>
  <text x="300" y="770" text-anchor="middle" font-family="'Inter',sans-serif" font-size="9" font-weight="300" fill="rgba(255,255,255,0.15)">DAYAH LITWORKS · DISEÑO DE PORTADAS</text>
</svg>'''
    with open(os.path.join(COVERS_DIR, fname), "w") as f:
        f.write(svg)
    print(f"  Created {fname}")

print(f"\nAll images generated in {COVERS_DIR}")
