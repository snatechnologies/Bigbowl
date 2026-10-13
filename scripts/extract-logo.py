"""
Extract the Bigbowl logo from the visiting card (VISTING CARD.png).

Produces:
  public/assets/bigbowl-logo.png   -> logo with transparent background
                                      (yellow card background removed, but the
                                      yellow "BIG DEALS BIG SAVINGS" tagline
                                      inside the red bowl is preserved)

Run from the repo root:
  python scripts/extract-logo.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "VISTING CARD.png"
OUT = ROOT / "public" / "assets" / "bigbowl-logo.png"

# Wide region of the front (top) card that surely contains the logo, but may
# also catch the red "ARAVIND" text / swoosh on the left panel — those get
# separated automatically by finding the empty column gap before the logo.
REGION = (620, 60, 1330, 490)  # (left, top, right, bottom)
PADDING = 16

BRAND_RED = np.array([166, 30, 34])
CARD_YELLOW_G = 205  # green channel of the card's yellow background


def red_mask(arr):
    r, g, b = arr[..., 0].astype(int), arr[..., 1].astype(int), arr[..., 2].astype(int)
    return (r > 110) & (g < 90) & (b < 90) & (r - g > 50) & (r - b > 50)


def yellow_mask(arr):
    r, g, b = arr[..., 0].astype(int), arr[..., 1].astype(int), arr[..., 2].astype(int)
    return (r > 150) & (g > 110) & (b < 130) & (r - b > 70)


def dilate(mask, radius=3):
    """Binary dilation using PIL's MaxFilter (size must be odd)."""
    img = Image.fromarray((mask * 255).astype("uint8"))
    img = img.filter(ImageFilter.MaxFilter(radius * 2 + 1))
    return np.array(img) > 0


def find_logo_column_range(mask):
    """Horizontal span of the logo, found via its solid red body (the bowl).

    Flood-fills the red pixels starting nearest the bottom-center of the
    region. The filled bowl is by far the largest connected red component
    (the handle posts merge into it); thin red elements like the card's
    decorative swoosh or name text are separate components and get dropped.
    Every other logo element (SAIAMBRO arch, BIG, TM, tagline) sits inside
    the bowl's horizontal span.
    """
    h, w = mask.shape
    ys, xs = np.nonzero(mask)
    # seed: red pixel nearest to the bottom-center (inside the bowl)
    i = ((xs - w // 2) ** 2 + (ys - int(h * 0.9)) ** 2).argmin()
    seen = np.zeros_like(mask)
    stack = [(ys[i], xs[i])]
    seen[ys[i], xs[i]] = True
    while stack:
        y, x = stack.pop()
        for ny in (y - 1, y, y + 1):
            for nx in (x - 1, x, x + 1):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    stack.append((ny, nx))
    cols = np.nonzero(seen.any(axis=0))[0]
    return cols.min(), cols.max()


def background_yellow(yellow):
    """Yellow pixels connected to the region border (the card background).

    Enclosed yellow pockets — the TM circle interior, letter counters — are
    part of the artwork and must survive.
    """
    h, w = yellow.shape
    bg = np.zeros_like(yellow)
    # seed every yellow pixel on the border
    border = np.zeros_like(yellow)
    border[0, :] = yellow[0, :]
    border[-1, :] = yellow[-1, :]
    border[:, 0] = yellow[:, 0]
    border[:, -1] = yellow[:, -1]
    ys, xs = np.nonzero(border)
    stack = list(zip(ys.tolist(), xs.tolist()))
    bg[border] = True
    while stack:
        y, x = stack.pop()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and yellow[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True
                stack.append((ny, nx))
    return bg


def main():
    im = Image.open(SRC).convert("RGB")
    region = np.array(im.crop(REGION))

    # 1) Logo pixels: the bowl component's column span defines the logo; any
    #    red outside that span (swoosh, name text) is not part of the logo.
    red = red_mask(region)
    col0, col1 = find_logo_column_range(red)
    in_span = np.zeros_like(red)
    in_span[:, col0 : col1 + 1] = True
    logo_red = red & in_span
    # the TM mark is very dark maroon, not brand red — detect it separately
    dark = (
        (region[..., 0] < 100)
        & (region[..., 1] < 100)
        & (region[..., 2] < 90)
        & in_span
    )
    logo_core = logo_red | dark
    ys, xs = np.nonzero(logo_core)
    if len(xs) == 0:
        raise SystemExit("No red logo pixels found — check REGION.")

    # 2) Opacity: keep pixels that are, or are close to, the logo artwork —
    #    this keeps the yellow outline baked into the artwork and the yellow
    #    tagline on the bowl — plus nearby whites (the "bowl" letters) and
    #    enclosed yellow pockets (TM interior, letter counters). Everything
    #    else (yellow card background, swoosh remnants) stays transparent.
    yellow = yellow_mask(region)
    near = dilate(logo_core, radius=4)
    whitish = (
        (region[..., 0] > 180) & (region[..., 1] > 180) & (region[..., 2] > 180)
    )
    keep = (
        near
        | (whitish & dilate(logo_core, radius=6))
        | (yellow & ~background_yellow(yellow))
    )

    rgba = np.zeros((*region.shape[:2], 4), dtype=np.uint8)
    rgba[..., :3] = region
    rgba[..., 3] = np.where(keep, 255, 0).astype(np.uint8)

    # 3) Decontaminate the anti-aliased fringe: leftover pixels that are
    #    neither clean artwork, nor clean white, nor clean yellow are blends
    #    over the yellow background. Recover coverage from the green channel
    #    and repaint them the pure brand color with partial alpha.
    fringe = keep & ~logo_core & ~whitish & ~yellow
    g = region[..., 1].astype(float)
    red_zone = dilate(logo_red, radius=6)
    blend_red = fringe & red_zone
    cov = np.clip((CARD_YELLOW_G - g) / (CARD_YELLOW_G - BRAND_RED[1]), 0, 1)
    rgba[blend_red, :3] = BRAND_RED
    rgba[blend_red, 3] = (cov[blend_red] * 255).astype(np.uint8)
    blend_dark = fringe & ~red_zone
    cov = np.clip((CARD_YELLOW_G - g) / (CARD_YELLOW_G - 25.0), 0, 1)
    rgba[blend_dark, :3] = np.array([34, 25, 2])
    rgba[blend_dark, 3] = (cov[blend_dark] * 255).astype(np.uint8)

    # 4) Crop to the logo bounding box (+padding) and feather the alpha edge.
    left = max(xs.min() - PADDING, 0)
    top = max(ys.min() - PADDING, 0)
    right = min(xs.max() + PADDING, region.shape[1] - 1)
    bottom = min(ys.max() + PADDING, region.shape[0] - 1)
    rgba = rgba[top : bottom + 1, left : right + 1]
    alpha = Image.fromarray(rgba[..., 3]).filter(ImageFilter.GaussianBlur(0.8))
    rgba[..., 3] = np.array(alpha)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba).save(OUT)
    print(f"Saved {OUT} ({rgba.shape[1]}x{rgba.shape[0]})")


if __name__ == "__main__":
    main()
