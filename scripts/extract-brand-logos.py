"""
Crop the nine partner-brand logos from the back of the visiting card
(VISTING CARD.png) into individual transparent PNGs:

  public/assets/brands/reliance.png
  public/assets/brands/campa.png
  public/assets/brands/hindustan-coca-cola.png
  public/assets/brands/sure-water.png
  public/assets/brands/pg.png
  public/assets/brands/mondelez.png
  public/assets/brands/4700bc.png
  public/assets/brands/hershey.png
  public/assets/brands/rico.png

Each logo sits on the white panel of the card's back, so the white
background is converted to transparency and the artwork is trimmed to
its bounding box (with a small padding).

Run from the repo root:
  python scripts/extract-brand-logos.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "VISTING CARD.png"
OUT_DIR = ROOT / "public" / "assets" / "brands"

PADDING = 10

# Generous crop boxes around each logo on the card back (1536x1024 image).
# White margin around each logo is removed automatically afterwards.
BOXES = {
    "reliance": (390, 775, 540, 870),
    "campa": (610, 775, 740, 870),
    "hindustan-coca-cola": (815, 775, 960, 885),
    "sure-water": (1035, 780, 1165, 865),
    "pg": (355, 890, 485, 960),
    "mondelez": (505, 890, 675, 960),
    "4700bc": (725, 890, 855, 965),
    "hershey": (910, 885, 1045, 965),
    "rico": (1085, 895, 1195, 960),
}


def main():
    img = Image.open(SRC).convert("RGB")
    arr_full = np.array(img)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for name, (left, top, right, bottom) in BOXES.items():
        region = arr_full[top:bottom, left:right].copy()
        r = region[..., 0].astype(int)
        g = region[..., 1].astype(int)
        b = region[..., 2].astype(int)

        # white-ish pixels become transparent
        whitish = (r > 235) & (g > 235) & (b > 235)
        keep = ~whitish

        ys, xs = np.nonzero(keep)
        if len(xs) == 0:
            print(f"!! no artwork found for {name}")
            continue

        rgba = np.zeros((*region.shape[:2], 4), dtype=np.uint8)
        rgba[..., :3] = region
        # soften the white fringe: partial alpha for near-white pixels
        whiteness = np.clip(
            (np.minimum(np.minimum(r, g), b) - 200) / 35.0, 0, 1
        )
        alpha = (255 * (1 - whiteness)).astype(np.uint8)
        rgba[..., 3] = np.where(keep, np.maximum(alpha, 40), 0)

        t = max(ys.min() - PADDING, 0)
        l = max(xs.min() - PADDING, 0)
        bo = min(ys.max() + PADDING, region.shape[0] - 1)
        ri = min(xs.max() + PADDING, region.shape[1] - 1)
        rgba = rgba[t : bo + 1, l : ri + 1]

        out = OUT_DIR / f"{name}.png"
        Image.fromarray(rgba).save(out)
        print(f"Saved {out} ({rgba.shape[1]}x{rgba.shape[0]})")


if __name__ == "__main__":
    main()
