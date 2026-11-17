"""Image pipeline: camera, filmic grade, atmosphere."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 1920


def _np(img):
    return np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0


def _pil(a):
    return Image.fromarray(np.clip(a * 255.0, 0, 255).astype(np.uint8), "RGB")


class Cam:
    def __init__(self, path, scale=1.06):
        self.src = Image.open(path).convert("RGB")
        self.base = self.src.resize((int(W * scale), int(H * scale)), Image.LANCZOS)

    def frame(self, zoom=1.0, pan=(0.0, 0.0), shake=(0.0, 0.0)):
        bw, bh = self.base.size
        cw, ch = min(int(W * zoom), bw), min(int(H * zoom), bh)
        cx = (bw - cw) / 2 + pan[0] * cw * 0.5 + shake[0]
        cy = (bh - ch) / 2 + pan[1] * ch * 0.5 + shake[1]
        cx = max(0, min(bw - cw, cx))
        cy = max(0, min(bh - ch, cy))
        out = self.base.crop((int(cx), int(cy), int(cx) + cw, int(cy) + ch))
        return out.resize((W, H), Image.LANCZOS) if out.size != (W, H) else out


_VIG = None
_GRAIN = None


def _vignette():
    global _VIG
    if _VIG is None:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.sqrt(((xx - W / 2) / (W / 1.45)) ** 2 + ((yy - H / 2) / (H / 1.30)) ** 2)
        _VIG = np.clip(r - 0.55, 0, 1) ** 1.2
    return _VIG


def _grain():
    global _GRAIN
    if _GRAIN is None:
        _GRAIN = np.random.default_rng(7).normal(0, 1, (H, W)).astype(np.float32)
    return _GRAIN


def film_grade(img, warm=0.0, cool=0.0, contrast=1.08, sat=1.06, bloom=0.16,
               vignette=0.35, grain=0.010, lift=0.012, t=0.0):
    """Filmic grade: soft S-curve, split tone, gentle bloom, light vignette."""
    a = _np(img)
    # split tone: warm highlights / cool shadows (or inverted for cool looks)
    lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    hi = np.clip((lum - 0.45) / 0.55, 0, 1)[:, :, None]
    sh = np.clip((0.45 - lum) / 0.45, 0, 1)[:, :, None]
    if warm:
        a += hi * np.array([0.085, 0.030, -0.045], dtype=np.float32) * warm
        a += sh * np.array([-0.010, 0.004, 0.030], dtype=np.float32) * warm * 0.6
    if cool:
        a += hi * np.array([-0.045, 0.005, 0.070], dtype=np.float32) * cool
        a += sh * np.array([-0.020, -0.004, 0.045], dtype=np.float32) * cool * 0.8
    # filmic S-curve around 0.46
    x = np.clip(a, 0, 1) - 0.46
    a = 0.46 + x * contrast + x * np.abs(x) * (1.35 - contrast) * 0.85
    a = lift + a * (1 - lift)
    # saturation
    g = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    a = g[:, :, None] + (a - g[:, :, None]) * sat
    # bloom
    if bloom > 0:
        bright = np.clip(a - 0.72, 0, 1)
        bl = Image.fromarray((bright * 255).astype(np.uint8), "RGB")
        bl = bl.filter(ImageFilter.GaussianBlur(26))
        a = a + np.asarray(bl, dtype=np.float32) / 255.0 * bloom * 1.6
    if vignette:
        a *= (1 - vignette * _vignette())[:, :, None]
    if grain:
        gy = np.roll(_grain(), int(t * 41) % H, axis=0)
        a += gy[:, :, None] * grain
    return _pil(a)


def apply_grade(img, warm=0.0, cool=0.0, contrast=1.0, vignette=0.0, grain=0.0, t=0.0):
    return film_grade(img, warm=warm, cool=cool, contrast=contrast, vignette=vignette,
                      grain=grain, t=t)


def scrim(img, y0, y1, strength, feather=150):
    a = _np(img)
    y = np.arange(a.shape[0], dtype=np.float32)
    up = np.clip((y - (y0 - feather)) / (2 * feather), 0, 1)
    dn = np.clip((y - (y1 - feather)) / (2 * feather), 0, 1)
    m = up * (1 - dn)
    a *= (1 - strength * m)[:, None, None]
    return _pil(a)


vgrad = scrim


def band_scrim(img, x0f, x1f, strength, feather=120):
    a = _np(img)
    x = np.arange(W, dtype=np.float32)
    up = np.clip((x - (x0f * W - feather)) / (2 * feather), 0, 1)
    dn = np.clip((x - (x1f * W - 2 * feather)) / (2 * feather), 0, 1)
    a *= (1 - strength * (up * (1 - dn)))[None, :, None]
    return _pil(a)


def top_fade(img, height=520, strength=0.45):
    """Even falloff at the top so the brand lockup always reads."""
    a = _np(img)
    y = np.arange(H, dtype=np.float32)
    m = np.clip(1 - y / height, 0, 1) ** 1.4
    a *= (1 - strength * m)[:, None, None]
    return _pil(a)


def spotlight(img, cx, cy, radius, strength=0.25):
    a = _np(img)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / radius
    m = np.clip(r - 0.55, 0, 1) ** 1.2
    a *= (1 - strength * m)[:, :, None]
    return _pil(a)


def light_sweep(img, p, width=0.34, strength=0.5):
    a = _np(img)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    pos = -0.4 + 1.8 * (p % 1.0)
    d = (xx / W) + (yy / H) * 0.35 - pos
    beam = np.clip(1 - np.abs(d) / width, 0, 1) ** 2
    a += beam[:, :, None] * (0.10 * strength)
    return _pil(a)


def mist_layer():
    rng = np.random.default_rng(3)
    n = rng.normal(0, 1, (H // 6, W // 6)).astype(np.float32)
    m = Image.fromarray(((n - n.min()) / (np.ptp(n) + 1e-6) * 255).astype(np.uint8), "L")
    return m.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(28))


def blend_mist(img, p, density=0.10):
    m = mist_layer()
    m = Image.fromarray(np.roll(np.asarray(m), int(p * 220) % H, axis=0), "L")
    ma = (np.asarray(m, dtype=np.float32) / 255.0) ** 1.6 * density
    a = _np(img)
    a = a * (1 - ma[:, :, None]) + 0.88 * ma[:, :, None]
    return _pil(a)


def zoom_rings(img, cx, cy, p, count=2, colour=(255, 220, 160), alpha=0.3):
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    for i in range(count):
        q = (p + i / count) % 1.0
        r = 60 + q * 420
        d.ellipse([cx - r, cy - r, cx + r, cy + r],
                  outline=colour + (int(alpha * 255 * (1 - q) ** 1.5),),
                  width=max(2, int(6 * (1 - q)) + 1))
    return Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")
