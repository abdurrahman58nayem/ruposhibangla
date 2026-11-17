"""Bengali text shaping + rasterising (uharfbuzz + freetype).

Every Layout carries `.baseline` (distance from its top edge to the text
baseline) so callers anchor text by baseline, never by ink top — lines can
never drift or collapse into one another.
"""
import os

import freetype
import numpy as np
import uharfbuzz as hb
from PIL import Image, ImageFilter

FDIR = os.environ.get("RB_FONTS", "/home/user/fonts")
FONTS = {
    "sans": f"{FDIR}/NotoSansBengali_400Regular.ttf",
    "sans-semi": f"{FDIR}/NotoSansBengali_600SemiBold.ttf",
    "sans-bold": f"{FDIR}/NotoSansBengali_700Bold.ttf",
    "serif": f"{FDIR}/NotoSerifBengali_500Medium.ttf",
    "serif-bold": f"{FDIR}/NotoSerifBengali_700Bold.ttf",
}
_cache = {}


def _font(key):
    if key not in _cache:
        path = FONTS[key]
        if not os.path.exists(path):
            raise FileNotFoundError(path)
        blob = hb.Blob.from_file_path(path)
        face_hb = hb.Face(blob)
        font_hb = hb.Font(face_hb)
        face_ft = freetype.Face(path)
        _cache[key] = (font_hb, face_ft, face_hb.upem)
    return _cache[key]


class _P:
    __slots__ = ("x_advance", "y_advance", "x_offset", "y_offset")

    def __init__(self, xa, ya, xo, yo):
        self.x_advance = xa
        self.y_advance = ya
        self.x_offset = xo
        self.y_offset = yo


class Shaper:
    def __init__(self, key, px):
        self.key = key
        self.px = px
        self.font, self.face, self.upem = _font(key)

    def glyphs(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.font, buf, {"kern": True, "liga": True})
        # materialise at once: hb positions are views into the buffer
        infos = [i.codepoint for i in buf.glyph_infos]
        pos = [_P(p.x_advance, p.y_advance, p.x_offset, p.y_offset)
               for p in buf.glyph_positions]
        self._keep = buf
        return infos, pos

    def advance(self, text):
        _, pos = self.glyphs(text)
        return sum(p.x_advance for p in pos) * self.px / self.upem


class Layout:
    def __init__(self, image, baseline, ink_top, ink_bottom, advance):
        self.image = image
        self.baseline = baseline
        self.ink_top = ink_top
        self.ink_bottom = ink_bottom
        self.advance = advance

    @property
    def width(self):
        return self.image.width

    @property
    def height(self):
        return self.image.height


def flow(text, key, px, pad=None):
    """Shape one line; the layout covers the full ink box (nothing clipped)."""
    sh = Shaper(key, px)
    gids, pos = sh.glyphs(text)
    scale = px / sh.upem
    face = sh.face
    face.set_pixel_sizes(0, px)
    pad = pad if pad is not None else max(6, int(px * 0.26))

    pen_x = 0.0
    pen_y = 0.0
    boxes = []
    for gid, p in zip(gids, pos):
        boxes.append((gid, pen_x + p.x_offset * scale, pen_y + p.y_offset * scale))
        pen_x += p.x_advance * scale
        pen_y += p.y_advance * scale
    adv = pen_x

    metrics = []
    for gid, gx, gy in boxes:
        try:
            face.load_glyph(gid, freetype.FT_LOAD_RENDER | freetype.FT_LOAD_NO_HINTING)
        except Exception:
            continue
        bm = face.glyph.bitmap
        if bm.width == 0 or bm.rows == 0:
            continue
        left = gx + face.glyph.bitmap_left
        top = -gy - face.glyph.bitmap_top
        metrics.append((left, top, bm.width, bm.rows, bm.pitch, bm.buffer))

    if metrics:
        minx = min(m[0] for m in metrics)
        miny = min(m[1] for m in metrics)
        maxx = max(m[0] + m[2] for m in metrics)
        maxy = max(m[1] + m[3] for m in metrics)
    else:
        minx = miny = 0.0
        maxx = max(adv, 1.0)
        maxy = px

    w = int(np.ceil(maxx - minx)) + 2 * pad
    h = int(np.ceil(maxy - miny)) + 2 * pad
    mask = Image.new("L", (max(w, 1), max(h, 1)), 0)
    baseline = pad - miny

    for left, top, bw, bh, pitch, buf in metrics:
        arr = np.array(buf, dtype=np.uint8)
        if arr.size == bh * abs(pitch) and abs(pitch) != bw:
            arr = arr.reshape(bh, abs(pitch))[:, :bw]
        else:
            arr = arr.reshape(bh, bw)
        g = Image.fromarray(arr.copy(), "L")
        mask.paste(g, (int(round(pad + left - minx)), int(round(pad + top - miny))), g)

    return Layout(mask, baseline, pad - miny, pad + (maxy - miny), adv)


def block(lines, key, px, max_w):
    out = []
    for para in lines:
        cur = ""
        for w in para.split():
            trial = (cur + " " + w).strip()
            if Shaper(key, px).advance(trial) <= max_w or not cur:
                cur = trial
            else:
                out.append(flow(cur, key, px))
                cur = w
        if cur:
            out.append(flow(cur, key, px))
    return out


def paint(dst, lay, xy, fill, alpha=1.0, glow=None, shadow=None, baseline=False,
          anchor="left"):
    if alpha <= 0.002:
        return
    x, y = xy
    if anchor == "center":
        x = x - lay.width / 2
    elif anchor == "right":
        x = x - lay.width
    if baseline:
        y = y - lay.baseline
    x, y = int(round(x)), int(round(y))
    a = np.asarray(lay.image, dtype=np.float32) / 255.0 * float(alpha)
    if glow is not None:
        gr, ga = glow
        if gr > 0 and ga > 0:
            halo = lay.image.filter(ImageFilter.GaussianBlur(gr))
            ha = np.asarray(halo, dtype=np.float32) / 255.0 * float(ga) * float(alpha)
            _comp(dst, ha, (x, y), fill)
    if shadow is not None:
        sr, sa, soff = shadow
        sh = lay.image.filter(ImageFilter.GaussianBlur(sr))
        ha = np.asarray(sh, dtype=np.float32) / 255.0 * float(sa) * float(alpha)
        _comp(dst, ha, (x + soff[0], y + soff[1]), (0, 0, 0))
    _comp(dst, a, (x, y), fill)


def _comp(dst, alpha, xy, fill):
    x, y = xy
    W, H = dst.size
    aw, ah = alpha.shape[1], alpha.shape[0]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W, x + aw), min(H, y + ah)
    if x1 <= x0 or y1 <= y0:
        return
    sub = alpha[y0 - y:y1 - y, x0 - x:x1 - x]
    box = np.asarray(dst.crop((x0, y0, x1, y1)), dtype=np.float32)
    f = np.array(fill[:3], dtype=np.float32)
    a = sub[:, :, None]
    dst.paste(Image.fromarray(np.clip(box * (1 - a) + f * a, 0, 255).astype(np.uint8),
                              "RGB"), (x0, y0))


def measure(text, key, px):
    return Shaper(key, px).advance(text)
