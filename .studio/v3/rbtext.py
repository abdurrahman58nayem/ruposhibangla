"""Bengali/Arabic-script aware text shaping + rasterising for the reel renderer.

Pillow in this sandbox is built WITHOUT libraqm, so complex-script shaping must be
done by hand. We use HarfBuzz (uharfbuzz) for shaping + FreeType (freetype-py) for
rasterising, which gives correct Bengali conjuncts, reph, i-kar placement etc.
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache

import freetype
import numpy as np
import uharfbuzz as hb
from PIL import Image

FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
FONTS = {
    "sans": "HindSiliguri-Regular.ttf",
    "sans-semi": "HindSiliguri-SemiBold.ttf",
    "sans-bold": "HindSiliguri-Bold.ttf",
    "serif-bold": "NotoSerifBengali-Bold.ttf",
    "serif-semi": "NotoSerifBengali-SemiBold.ttf",
}


def font_path(key: str) -> str:
    return os.path.join(FONT_DIR, FONTS[key])


# ---------------------------------------------------------------- shaping ----
class Shaper:
    def __init__(self, key: str, px: int):
        self.key = key
        self.px = px
        self.path = font_path(key)
        blob = hb.Blob.from_file_path(self.path)
        self.hb_face = hb.Face(blob)
        self.hb_font = hb.Font(self.hb_face)
        self.hb_font.scale = (px * 64, px * 64)
        # FreeType in 26.6 fixed point matching px
        self.ft = freetype.Face(self.path)
        self.ft.set_char_size(px * 64)

    # Mixed copy ("Hawkins ২ লিটার · মোট ৳১,৫৫০") in ONE buffer made HarfBuzz
    # guess the segment from the first strong character — Latin — so Bengali's
    # GSUB never ran and ো fell back to the precomposed bnmO glyph, which in
    # this font is drawn as a DOTTED CIRCLE. Shaping must be done per script
    # run, each with its own script/direction.
    @staticmethod
    def _runs(text: str):
        def sc(ch):
            o = ord(ch)
            if 0x0980 <= o <= 0x09FF:
                return "Beng"
            if ch.isdigit() or ch.isalpha():
                return "Latn"
            return None
        out, cur, key = [], "", None
        for ch in text:
            k = sc(ch)
            if k is None:
                k = key if key else "Latn"
            if key is None or k == key:
                cur += ch
            else:
                out.append((key, cur))
                cur = ch
            key = k
        if cur:
            out.append((key, cur))
        return out

    def shape(self, text: str):
        infos_all, pos_all = [], []
        for script, chunk in self._runs(text):
            buf = hb.Buffer()
            buf.add_str(chunk)
            buf.direction = "ltr"
            buf.script = script or "Latn"
            buf.language = "bn" if script == "Beng" else "en"
            hb.shape(self.hb_font, buf)
            infos_all.extend(buf.glyph_infos)
            pos_all.extend(buf.glyph_positions)
        return infos_all, pos_all

    def advance(self, text: str) -> float:
        infos, pos = self.shape(text)
        return sum(p.x_advance for p in pos) / 64.0


@lru_cache(maxsize=256)
def shaper(key: str, px: int) -> Shaper:
    return Shaper(key, px)


@lru_cache(maxsize=8192)
def _glyph_bitmap(key: str, px: int, gid: int):
    """Rasterise one glyph -> (array, left, top)."""
    s = shaper(key, px)
    s.ft.load_glyph(gid, freetype.FT_LOAD_RENDER | freetype.FT_LOAD_NO_HINTING)
    g = s.ft.glyph
    bmp = g.bitmap
    if bmp.width == 0 or bmp.rows == 0:
        return None, 0, 0
    arr = np.frombuffer(bytes(bmp.buffer), dtype=np.uint8).reshape(bmp.rows, bmp.width)
    # freetype gives top-down rows; PIL/np coordinate origin is top-left already
    return arr.copy(), g.bitmap_left, g.bitmap_top


def baseline_offset(layer: "TextLayer") -> int:
    """Distance from the top of the cropped ink box down to the text baseline."""
    return int(layer.baseline - layer.ink_offset[1])


def line(text: str, key: str, px: int):
    """(alpha mask, offset from mask top to baseline) — use to align lines."""
    lay = flow(text, key, px)
    return lay.image, baseline_offset(lay)


@dataclass
class TextLayer:
    image: Image.Image  # L mode alpha mask, trimmed to ink
    ink_offset: tuple[int, int]  # offset of ink origin inside the untrimmed box
    baseline: int
    width: float
    height: int


def flow(text: str, key: str, px: int) -> TextLayer:
    """Rasterise a single line (no wrapping) into an alpha mask."""
    s = shaper(key, px)
    infos, pos = s.shape(text)
    total = sum(p.x_advance for p in pos) / 64.0
    pad = px
    W = int(total + pad * 2)
    H = int(px * 2.6)
    canvas = np.zeros((H, W), dtype=np.uint8)
    pen_x = float(pad)
    baseline = int(px * 1.75)
    pen_y = float(baseline)
    for info, p in zip(infos, pos):
        arr, left, top = _glyph_bitmap(key, px, info.codepoint)
        if arr is not None:
            x = int(round(pen_x + left))
            y = int(round(pen_y - top))
            h, w = arr.shape
            x0, y0 = max(0, x), max(0, y)
            x1, y1 = min(W, x + w), min(H, y + h)
            if x1 > x0 and y1 > y0:
                src = arr[y0 - y:y1 - y, x0 - x:x1 - x]
                dst = canvas[y0:y1, x0:x1]
                np.maximum(dst, src, out=dst)
        pen_x += p.x_advance / 64.0
        pen_y -= p.y_advance / 64.0
    img = Image.fromarray(canvas, "L")
    bbox = img.getbbox()
    if bbox is None:
        return TextLayer(Image.new("L", (1, 1), 0), (0, 0), baseline, 0.0, 0)
    return TextLayer(img.crop(bbox), (bbox[0], bbox[1]), baseline, total, bbox[3] - bbox[1])


def wrap(text: str, key: str, px: int, max_w: int, max_lines: int | None = None):
    """Greedy wrap on spaces/danda; returns list of line strings."""
    words = text.split(" ")
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if shaper(key, px).advance(trial) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = lines[-1].rstrip(" ।,") + "…"
    return lines


def block(text: str, key: str, px: int, max_w: int, leading: float = 1.32,
          align: str = "center") -> Image.Image:
    """Multi-line alpha mask, tightly cropped, with consistent line spacing."""
    lines = wrap(text, key, px, max_w)
    layers = [flow(ln, key, px) for ln in lines]
    W = int(max(max_w, max(l.width for l in layers)) + px)
    line_h = int(px * leading)
    H = line_h * len(lines) + px
    out = np.zeros((H, W), dtype=np.uint8)
    for i, lay in enumerate(layers):
        a = np.array(lay.image)
        x = int((W - a.shape[1]) / 2) if align == "center" else int(px)
        y = int(px * 0.4 + i * line_h)
        out[y:y + a.shape[0], x:x + a.shape[1]] = np.maximum(
            out[y:y + a.shape[0], x:x + a.shape[1]], a)
    img = Image.fromarray(out, "L")
    bbox = img.getbbox() or (0, 0, 1, 1)
    return img.crop(bbox)


# -------------------------------------------------------------- compositing ---
def paint(canvas: Image.Image, mask: Image.Image, xy, fill, alpha: float = 1.0,
          shadow: tuple[int, int, int, float] | None = None, glow=None):
    """Paste a text mask onto an RGB/RGBA canvas with colour, alpha and shadow."""
    if alpha <= 0.003 or mask.width <= 1:
        return canvas
    x, y = int(xy[0]), int(xy[1])
    m = mask if alpha >= 0.999 else mask.point(lambda v: int(v * alpha))
    color = Image.new("RGB", mask.size, tuple(fill)[:3])

    if shadow is not None:
        sx, sy, soff = shadow[0], shadow[1], shadow[2]
        s_alpha = shadow[3] if len(shadow) > 3 else 0.55
        sm = mask.point(lambda v: int(v * s_alpha * alpha))
        s_col = Image.new("RGB", mask.size, tuple(soff))
        canvas.paste(s_col, (x + int(sx), y + int(sy)), sm)

    if glow is not None:
        radius, g_alpha = glow
        blur = mask.filter(_gauss(radius)).point(lambda v: int(v * g_alpha * alpha))
        g_col = Image.new("RGB", mask.size, tuple(fill)[:3])
        canvas.paste(g_col, (x, y), blur)

    canvas.paste(color, (x, y), m)
    return canvas


def _gauss(radius: float):
    from PIL import ImageFilter
    return ImageFilter.GaussianBlur(radius)


def gradient_mask(w: int, h: int, top=(255, 255, 255), bottom=(255, 220, 120)) -> Image.Image:
    """Vertical gradient colour image of size (w,h) for title fills."""
    t = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for c in range(3):
        arr[:, :, c] = (top[c] * (1 - t) + bottom[c] * t).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def paint_gradient(canvas: Image.Image, mask: Image.Image, xy, top, bottom, alpha=1.0):
    x, y = int(xy[0]), int(xy[1])
    grad = gradient_mask(mask.width, mask.height, top, bottom)
    m = mask if alpha >= 0.999 else mask.point(lambda v: int(v * alpha))
    canvas.paste(grad, (x, y), m)
    return canvas
