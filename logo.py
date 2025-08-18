# Create SVG assets for the Emberly logo per the client's specs.
# Colors from theme: Dusty Terracotta (#d9a58b) for symbol, Deep Umber (#5a524c) for wordmark.
# Provide: primary (transparent), dark and light background samples, symbol-only, wordmark-only, and app icon variants.
import zipfile, os, textwrap, json

os.makedirs("../mnt/data/emberly_logo", exist_ok=True)

TERRACOTTA = "#d9a58b"  # Dusty Terracotta
UMBER = "#5a524c"       # Deep Umber
LIGHT_BG = "#f8f6f4"    # theme.css light subtle background
DARK_BG = "#2d2520"     # theme.css dark subtle background
print(f"Using colors: {TERRACOTTA}, {UMBER}, {LIGHT_BG}, {DARK_BG}")
# Embrace symbol paths:
# - central "spark": circle
# - two embracing "arms": symmetric smooth organic shapes built with cubic beziers
# Dimensions: viewBox 0 0 256 256 for consistency
symbol_svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Emberly Embrace Symbol -->
  <g>
    <!-- Spark -->
    <circle cx="128" cy="76" r="26" fill="{TERRACOTTA}"/>
    <!-- Left arm -->
    <path d="M129 112
             C 98 112, 72 134, 63 163
             C 56 186, 63 209, 81 223
             C 97 235, 121 236, 142 226
             C 120 214, 106 197, 103 178
             C 100 160, 108 142, 129 129 Z"
          fill="{TERRACOTTA}"/>
    <!-- Right arm -->
    <path d="M127 112
             C 158 112, 184 134, 193 163
             C 200 186, 193 209, 175 223
             C 159 235, 135 236, 114 226
             C 136 214, 150 197, 153 178
             C 156 160, 148 142, 127 129 Z"
          fill="{TERRACOTTA}"/>
  </g>
</svg>
"""

# Wordmark (font stack; editable). Using baseline alignment to pair with symbol.
# We'll create the primary lockup: symbol + wordmark horizontally spaced.
def make_primary_svg(bg=None):
    bg_rect = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ''
    # Overall canvas large enough for spacing
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="400" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
  {bg_rect}
  <!-- Symbol -->
  <g transform="translate(70,72) scale(1.15)">
    <circle cx="128" cy="76" r="26" fill="{TERRACOTTA}"/>
    <path d="M129 112 C 98 112, 72 134, 63 163 C 56 186, 63 209, 81 223 C 97 235, 121 236, 142 226 C 120 214, 106 197, 103 178 C 100 160, 108 142, 129 129 Z"
          fill="{TERRACOTTA}"/>
    <path d="M127 112 C 158 112, 184 134, 193 163 C 200 186, 193 209, 175 223 C 159 235, 135 236, 114 226 C 136 214, 150 197, 153 178 C 156 160, 148 142, 127 129 Z"
          fill="{TERRACOTTA}"/>
  </g>
  <!-- Wordmark -->
  <text x="360" y="250" font-size="170" font-weight="700" letter-spacing="0"
        font-family="Nunito, Poppins, 'Circular Std', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        fill="{UMBER}">Emberly</text>
</svg>
'''
    return svg

wordmark_svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg width="1000" height="300" viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="210" font-size="170" font-weight="700" letter-spacing="0"
        font-family="Nunito, Poppins, 'Circular Std', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        fill="{UMBER}">Emberly</text>
</svg>
"""

# App icon variants: symbol centered on square with background
def make_app_icon_svg(bg):
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="56" ry="56" fill="{bg}"/>
  <g transform="translate(0,0)">
    <circle cx="128" cy="76" r="26" fill="{TERRACOTTA}"/>
    <path d="M129 112 C 98 112, 72 134, 63 163 C 56 186, 63 209, 81 223 C 97 235, 121 236, 142 226 C 120 214, 106 197, 103 178 C 100 160, 108 142, 129 129 Z"
          fill="{TERRACOTTA}"/>
    <path d="M127 112 C 158 112, 184 134, 193 163 C 200 186, 193 209, 175 223 C 159 235, 135 236, 114 226 C 136 214, 150 197, 153 178 C 156 160, 148 142, 127 129 Z"
          fill="{TERRACOTTA}"/>
  </g>
</svg>
"""

files = {
    "emberly-symbol.svg": symbol_svg,
    "emberly-wordmark.svg": wordmark_svg,
    "emberly-logo-primary.svg": make_primary_svg(bg=None),
    "emberly-logo-light-bg.svg": make_primary_svg(bg=LIGHT_BG),
    "emberly-logo-dark-bg.svg": make_primary_svg(bg=DARK_BG),
    "emberly-app-icon-light.svg": make_app_icon_svg(bg=LIGHT_BG),
    "emberly-app-icon-dark.svg": make_app_icon_svg(bg=DARK_BG),
}

for name, content in files.items():
    with open(f"/mnt/data/emberly_logo/{name}", "w", encoding="utf-8") as f:
        f.write(content)

# Zip everything
zip_path = "/mnt/data/emberly_logo/emberly-logo-suite.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for name in files.keys():
        z.write(f"/mnt/data/emberly_logo/{name}", arcname=name)

zip_path, list(files.keys())
