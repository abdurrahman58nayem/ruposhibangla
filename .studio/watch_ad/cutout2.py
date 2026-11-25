"""Key the white-background plates (gen2) into RGBA sprites.

Background is pure studio white; the product is darker/saturated. A pixel is
background when it is bright AND low-saturation AND connected to the border.
"""
import os, glob
import numpy as np
from PIL import Image, ImageFilter
from collections import deque

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "gen2")
OUT = os.path.join(HERE, "cut3")
os.makedirs(OUT, exist_ok=True)


def key(path, dark_tol=30, sat_tol=16):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im, np.float32)
    h, w = a.shape[:2]
    mn = a.min(axis=2); mx = a.max(axis=2)
    sat = mx - mn
    bgish = (mn > 255 - dark_tol) & (sat < sat_tol)
    vis = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bgish[y, x] and not vis[y, x]:
                vis[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if bgish[y, x] and not vis[y, x]:
                vis[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and bgish[ny, nx] and not vis[ny, nx]:
                vis[ny, nx] = True; q.append((ny, nx))
    alpha = (~vis).astype(np.float32)
    am = Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.1))
    alpha = np.clip((np.asarray(am, np.float32) / 255.0 - 0.16) / 0.68, 0, 1)
    # de-fringe: pull background white out of semi-transparent edge pixels
    rgb = a.copy()
    for c in range(3):
        rgb[..., c] = a[..., c] * alpha + 255 * (1 - alpha)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")
    bb = img.split()[3].getbbox()
    if bb:
        img = img.crop(bb)
    return img


EXTRA = {"w_spider_big": "w_spider_big.jpg"}

if __name__ == "__main__":
    for p in sorted(glob.glob(os.path.join(SRC, "*.jpg"))):
        img = key(p)
        n = os.path.splitext(os.path.basename(p))[0] + ".png"
        img.save(os.path.join(OUT, n))
        print(f"{n:24s} {img.size}")
