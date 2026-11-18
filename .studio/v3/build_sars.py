"""Episode 007 — সারস (Grus antigone). Same engine as the শাপলা reel.

Design rules copied from episode 003/004/005 (বাঘ, মাছরাঙা, বাবুই):
  * every on-screen line is bound to a *measured* spoken onset (timing2), never
    to a blind fraction of the scene — that is what makes the type feel in sync;
  * text is drawn straight over the photograph with shadow + glow, on a soft
    cinematic scrim. No card plates, no glass boxes;
  * every scene fades from black (0.42 s) and back to black (0.52 s);
  * one visual per scene, heavy vignette (0.5–0.68) and real grain.
"""
from __future__ import annotations

import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(HERE)

import kinetic as K          # noqa: E402
import rbaudio as A          # noqa: E402
import rbtext as T           # noqa: E402
import rbvisual as V         # noqa: E402
import timing2 as TM         # noqa: E402

FPS = 30
W, H = 1080, 1920
ART = "../art_sars"
OUT = "../render11"
VO = "../vo_sars"


def _bl(txt, key, px, ink_top):
    return ink_top + T.baseline_offset(T.flow(txt, key, px))


def ktext(canvas, txt, key, px, xy, fill, e=1.0, **kw):
    kw.setdefault("center", xy[0] == 0)
    return K.text(canvas, txt, key, px, (xy[0], _bl(txt, key, px, xy[1])), fill, e,
                  anchor="baseline", **kw)


def kword(canvas, txt, key, px, xy, fill, t, **kw):
    return K.word_line(canvas, txt, key, px, (xy[0], _bl(txt, key, px, xy[1])), fill, t,
                       **kw)


C_GOLD = (255, 214, 122)
C_CREAM = (255, 246, 230)
C_MINT = (168, 245, 205)
C_TEAL = (124, 222, 236)
C_CORAL = (255, 132, 104)
C_SAND = (255, 226, 186)
C_WATER = (196, 236, 222)

# ---------------------------------------------------------------- the script --
# `cues` are fractions of the spoken span; resolve_cues() snaps each one to the
# nearest measured energy onset, so a line lands on the word being said.
SCENES = [
    dict(id="s01", art="a01_hook.png", amb="water", pre=0.55, post=0.85, kind="hook",
         fx=[("boom", 0.15, 0.7), ("drip", 0.60, 0.4)],
         cues={"open": 0.0, "two": 0.45, "name": 0.78}),
    dict(id="s02", art="a02_portrait.png", amb="still", pre=0.45, post=0.75, kind="portrait",
         fx=[("whoosh", 0.05, 0.45), ("chime", 0.35, 0.35)],
         cues={"name": 0.0, "en": 0.12, "sci": 0.26, "height": 0.55}),
    dict(id="s03", art="a05_scale.png", amb="wind", pre=0.45, post=0.75, kind="detail",
         fx=[("whoosh_down", 0.10, 0.4), ("tick", 0.50, 0.3)],
         cues={"body": 0.0, "head": 0.30, "legs": 0.70}),
    dict(id="s04", art="a03_pair.png", amb="wind", pre=0.45, post=0.80, kind="cycle",
         fx=[("chime", 0.15, 0.35), ("boom", 0.55, 0.35)],
         cues={"pair": 0.0, "call": 0.55}),
    dict(id="s05", art="a04_dance.png", amb="water", pre=0.45, post=0.80, kind="nation",
         fx=[("boom", 0.10, 0.55), ("whoosh", 0.45, 0.4)],
         cues={"dance": 0.0, "jump": 0.40}),
    dict(id="s06", art="a06_flight.png", amb="wind", pre=0.45, post=0.75, kind="home",
         fx=[("whoosh", 0.10, 0.45), ("chime", 0.55, 0.3)],
         cues={"fly": 0.0, "wings": 0.50}),
    dict(id="s07", art="a07_haor.png", amb="water", pre=0.45, post=0.80, kind="use",
         fx=[("drip", 0.10, 0.4), ("boom", 0.50, 0.4)],
         cues={"few": 0.0, "where": 0.35}),
    dict(id="s08", art="a08_nest.png", amb="water", pre=0.45, post=0.75, kind="role",
         fx=[("drip", 0.08, 0.4), ("chime", 0.50, 0.3)],
         cues={"nest": 0.0, "eggs": 0.40, "chick": 0.72}),
    dict(id="s09", art="a09_threat.png", amb="wind", pre=0.45, post=0.80, kind="threats",
         fx=[("tension", 0.10, 0.5), ("boom", 0.40, 0.5)],
         cues={"fill": 0.0, "wire": 0.42, "iucn": 0.62}),
    dict(id="s10", art="a10_poem.png", amb="still", pre=0.55, post=2.40, kind="outro",
         fx=[("chime", 0.20, 0.4), ("boom", 0.55, 0.4), ("whoosh", 0.85, 0.35)],
         cues={"poem": 0.0, "hope": 0.42, "logo": 0.62, "cta": 0.76, "url": 0.86}),
]

CAMS = {}


def init_cams():
    for s in SCENES:
        if s["art"] not in CAMS:
            CAMS[s["art"]] = V.Cam(os.path.join(ART, s["art"]), scale=1.12)


def nearest_onset(onsets, target):
    if not onsets:
        return target
    return min(onsets, key=lambda o: abs(o - target))


def _regroup(segs, k):
    """Merge sentence windows into exactly k contiguous groups of similar length."""
    if len(segs) <= k:
        out = list(segs)
        while len(out) < k:                      # split the longest window
            i = max(range(len(out)), key=lambda j: out[j][1] - out[j][0])
            a, b = out[i]
            if b - a < 1.2:
                break
            m = (a + b) / 2
            out[i:i + 1] = [(a, m), (m, b)]
        return out[:k]
    # too many sentences: merge the two shortest neighbours until k remain
    out = list(segs)
    while len(out) > k:
        i = min(range(len(out) - 1), key=lambda j: (out[j][1] - out[j][0]) +
                (out[j + 1][1] - out[j + 1][0]))
        out[i:i + 2] = [(out[i][0], out[i + 1][1])]
    return out


def resolve_cues():
    for s in SCENES:
        wav = os.path.join(VO, s["id"] + ".wav")
        dur, onsets = TM.speech_beats(wav)
        s["vo"] = wav
        s["vodur"] = dur
        t0, t1 = (onsets[0] if onsets else 0.25), max(0.30, dur - 0.35)
        s["cue"] = {k: nearest_onset(onsets, t0 + (t1 - t0) * float(f))
                    for k, f in s["cues"].items()}
        segs = TM.sentences(wav)
        # Show exactly as many line-groups as the BEATS table asks for: the
        # sentence list is regrouped into k contiguous windows, so no written
        # line can silently fall off the end of a scene.
        _rows = layout_beats(s["id"])
        k = max((r[0] for r in _rows), default=0) + 1 if _rows else 1
        merged = _regroup(segs, k) if segs else [(t0, t1)]
        s["segs"] = merged
        s["dur"] = round(s["pre"] + dur + s["post"], 3)
    return SCENES


# --------------------------------------------------------------------- camera --
def scene_frame(s, p, t):
    cam = CAMS[s["art"]]
    kind = s["kind"]
    if kind == "hook":
        z = 1.05 + 0.13 * K.eo(p * 1.15)
        img = cam.frame(zoom=z, pan=(0, 0.014 - 0.024 * p),
                        shake=(0.5 * np.sin(p * 7), 0.4 * np.cos(p * 6)))
        img = V.apply_grade(img, warm=0.38, cool=0.04, contrast=1.07,
                            vignette=0.34, grain=0.014, gamma=0.90, sat=1.10, t=t)
        img = V.spotlight(img, W * 0.48, H * 0.44, W * 0.78, 0.22)
        img = V.light_sweep(img, p * 0.5, 0.34, 0.7)
    elif kind == "portrait":
        z = 1.24 - 0.16 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0.02 - 0.03 * p, 0.012))
        img = V.apply_grade(img, warm=0.40, contrast=1.06, vignette=0.28, grain=0.013, gamma=0.90, sat=1.10, t=t)
        img = V.light_sweep(img, p * 0.45, 0.38, 0.8)
    elif kind == "leaf":
        z = 1.32 - 0.20 * K.eio(p)
        img = cam.frame(zoom=z, pan=(-0.05 + 0.09 * p, 0.03 - 0.04 * p),
                        rot=0.9 * np.sin(p * 1.9))
        img = V.apply_grade(img, warm=0.36, cool=0.05, contrast=1.07,
                            vignette=0.32, grain=0.014, gamma=0.90, sat=1.10, t=t)
        img = V.spotlight(img, W * 0.5, H * 0.52, W * 0.72, 0.20)
    elif kind == "detail":
        z = 1.30 - 0.15 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0.0, 0.02 - 0.03 * p))
        img = V.apply_grade(img, warm=0.38, contrast=1.06, vignette=0.28, grain=0.013, gamma=0.90, sat=1.10, t=t)
        img = V.spotlight(img, W * 0.5, H * 0.5, W * 0.6, 0.28)
    elif kind == "nation":
        z = 1.12 + 0.10 * p
        img = cam.frame(zoom=z, pan=(-0.02 + 0.04 * p, 0.01))
        img = V.apply_grade(img, warm=0.42, cool=0.02, contrast=1.06,
                            vignette=0.30, grain=0.013, gamma=0.89, sat=1.12, t=t)
        img = V.light_sweep(img, p * 0.6, 0.30, 0.85)
    elif kind == "home":
        z = 1.20 - 0.16 * K.eio(p)
        img = cam.frame(zoom=z, pan=(-0.03 + 0.06 * p, 0.02))
        img = V.apply_grade(img, warm=0.44, contrast=1.05, vignette=0.26, grain=0.012, gamma=0.89, sat=1.10, t=t)
        img = V.blend_mist(img, p * 1.1, density=0.15)
        img = V.light_sweep(img, p * 0.5, 0.35, 0.8)
    elif kind == "cycle":
        z = 1.24 - 0.14 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0.015 - 0.03 * p, -0.01))
        img = V.apply_grade(img, warm=0.42, contrast=1.06, vignette=0.28, grain=0.013, gamma=0.90, sat=1.10, t=t)
        img = V.spotlight(img, W * 0.52, H * 0.48, W * 0.7, 0.22)
    elif kind == "role":
        z = 1.18 - 0.10 * p
        img = cam.frame(zoom=z, pan=(0.02 - 0.04 * p, 0.01))
        img = V.apply_grade(img, cool=0.10, warm=0.22, contrast=1.06,
                            vignette=0.26, grain=0.012, gamma=0.92, sat=1.06, t=t)
        img = V.blend_mist(img, p * 1.6, density=0.20)
    elif kind == "use":
        z = 1.14 + 0.08 * p
        img = cam.frame(zoom=z, pan=(0.02 - 0.03 * p, 0.008))
        img = V.apply_grade(img, warm=0.40, contrast=1.05, vignette=0.26, grain=0.012, gamma=0.90, sat=1.10, t=t)
    elif kind == "threats":
        z = 1.22 - 0.13 * p
        img = cam.frame(zoom=z, pan=(-0.02 + 0.05 * p, 0.02),
                        shake=(0.9 * np.sin(p * 18), 0.7 * np.cos(p * 15)))
        img = V.apply_grade(img, cool=0.14, warm=0.14, contrast=1.06, vignette=0.28, grain=0.013, gamma=0.92, sat=1.14, t=t)
    elif kind == "poem":
        z = 1.10 + 0.07 * p
        img = cam.frame(zoom=z, pan=(0.0, 0.02 - 0.03 * p))
        img = V.apply_grade(img, warm=0.34, cool=0.06, contrast=1.07,
                            vignette=0.34, grain=0.013, gamma=0.92, sat=1.06, t=t)
        img = V.light_sweep(img, 0.10 + p * 0.25, 0.28, 0.5)
    elif kind == "outro":
        z = 1.14 - 0.06 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0, -0.015))
        img = V.apply_grade(img, warm=0.42, cool=0.02, contrast=1.05,
                            vignette=0.30, grain=0.012, gamma=0.90, sat=1.10, t=t)
    else:
        z = 1.06 + 0.12 * K.eo(p)
        img = cam.frame(zoom=z, pan=(0, 0.01))
        img = V.apply_grade(img, warm=0.38, contrast=1.05, vignette=0.30, grain=0.012, gamma=0.90, sat=1.10, t=t)
    return img


def band_scrim(img, y0, y1, strength=0.7, feather=0.12):
    a = np.asarray(img, dtype=np.float32)
    y = np.linspace(0, 1, a.shape[0], dtype=np.float32)
    up = np.clip((y - (y0 - feather)) / (2 * feather), 0, 1)
    dn = np.clip((y - (y1 - feather)) / (2 * feather), 0, 1)
    m = up * (1 - dn)
    a *= (1 - strength * m)[:, None, None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")


def rows(img, x, y, items, e, gap=126, bar=True):
    """Stacked label/sub rows that slide in one after another."""
    for i, (label, sub, col) in enumerate(items):
        ee = K.ss(i * 0.24, i * 0.24 + 0.36, e)
        if ee <= 0.005:
            continue
        yy = y + i * gap
        if bar:
            d = ImageDraw.Draw(img, "RGBA")
            d.rounded_rectangle([x - 26, yy + 6, x - 18, yy + 66], radius=4,
                                fill=col + (int(210 * ee),))
        lay = T.flow(label, "sans-semi", 38)
        T.paint(img, lay.image, (int(x + (1 - K.eo(ee)) * 44), yy), col, ee,
                shadow=(3, 4, (0, 0, 0), 0.68), glow=(6.0, 0.14))
        if sub:
            s2 = T.flow(sub, "sans", 28)
            T.paint(img, s2.image, (int(x + (1 - K.eo(ee)) * 44), yy + 54),
                    C_WATER, ee * 0.92, shadow=(2, 3, (0, 0, 0), 0.55))



def panel(img, x, y, lines, e, alpha=0.46, padx=34, pady=26, gap=14):
    """Bottom note block: a glass box sized to the text, text left-aligned.

    Mirrors the reference reels (বাবুই / মেছো বিড়াল): the panel hugs the type
    instead of being centred on the frame, so it reads as a caption card, not a
    floating grey rectangle.
    """
    if e <= 0.01:
        return
    specs = []
    for txt, key, px, col, delay in lines:
        lay = T.flow(txt, key, px)
        specs.append((lay, col, delay))
    wmax = max(l.width for l, _, _ in specs)
    htot = sum(l.height for l, _, _ in specs) + gap * (len(specs) - 1)
    box_w = int(min(W - 2 * 40, wmax + padx * 2))
    # Feathered scrim, not a box: the dark area melts into the photograph so it
    # never reads as a pasted rectangle (that was called out on the first pass).
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    grow = K.eo(min(1.0, e * 1.25))
    gx = (1 - grow) * 26
    d.rounded_rectangle([x - padx + gx, y - pady + gx * 0.5,
                         x - padx + box_w - gx, y + htot + pady - gx * 0.5],
                        radius=34, fill=(8, 12, 10, int(235 * min(1.0, alpha * 2.05) * e)))
    blur = ov.filter(ImageFilter.GaussianBlur(26))
    img.paste(Image.alpha_composite(img.convert("RGBA"), blur).convert("RGB"), (0, 0))
    yy = y
    for lay, col, delay in specs:
        ee = K.ss(delay, delay + 0.40, e)
        if ee > 0.004:
            T.paint(img, lay.image, (int(x + (1 - K.eo(ee)) * 30),
                                     int(yy + 12 * (1 - K.eo(ee)))),
                    col, ee, shadow=(4, 5, (0, 0, 0), 0.66))
        yy += lay.height + gap




# ---------------------------------------------------------- beat-synced lines --
# (sentence index inside the VO, style, text, colour, ink-top y, align)
# Each entry appears on the first syllable of its own sentence and leaves when
# that sentence ends — that is what keeps the frame moving with the voice.
BEATS = {
    "s01": [
        (0, "chip", "হাওরের ভোর", C_MINT, 296, "left"),
        (0, "title", "কুয়াশা সরে যাচ্ছে", C_CREAM, 366, "left"),
        (1, "title", "অগভীর জলে দুটো পাখি", C_CREAM, 370, "left"),
        (1, "sub", "মানুষের সমান উঁচু", C_GOLD, 502, "left"),
        (2, "title", "এরা সারস", C_GOLD, 1150, "left"),
    ],
    "s02": [
        (0, "chip", "পরিচয়", C_MINT, 296, "left"),
        (0, "title", "সারস", C_CREAM, 366, "left"),
        (1, "attr", "ইংরেজিতে Sarus Crane", C_MINT, 1150, "left"),
        (2, "attr", "Grus antigone", C_MINT, 1256, "left"),
        (3, "num", "১৮০ সেন্টিমিটার", C_GOLD, 1370, "left"),
    ],
    "s03": [
        (0, "chip", "শরীরের গঠন", C_SAND, 296, "left"),
        (0, "title", "ধূসর শরীর", C_CREAM, 366, "left"),
        (1, "title", "মাথা ও গলা টকটকে লাল", C_GOLD, 1150, "left"),
        (1, "sub", "পালকহীন চামড়া", C_CREAM, 1284, "left"),
        (2, "title", "পা লম্বা, হালকা গোলাপি", C_CREAM, 1400, "left"),
    ],
    "s04": [
        (0, "chip", "জোড়া", C_MINT, 296, "left"),
        (0, "title", "সারা জীবন একসাথে", C_CREAM, 366, "left"),
        (1, "title", "দুজনে মিলে ডাকে", C_GOLD, 1150, "left"),
        (1, "sub", "একজনের ডাক অন্যজন ধরে", C_CREAM, 1284, "left"),
    ],
    "s05": [
        (0, "chip", "প্রণয়", C_CORAL, 296, "left"),
        (0, "title", "নাচে", C_GOLD, 366, "left"),
        (1, "title", "ডানা মেলে লাফ", C_CREAM, 1150, "left"),
        (1, "sub", "হাওরের জল ছিটকে ওঠে", C_MINT, 1284, "left"),
    ],
    "s06": [
        (0, "chip", "উড়ান", C_TEAL, 296, "left"),
        (0, "title", "গলা সোজা, পা পেছনে", C_CREAM, 366, "left"),
        (1, "title", "বড় ডানার ধীর ছন্দ", C_GOLD, 1150, "left"),
    ],
    "s07": [
        (0, "chip", "বাংলাদেশে", C_SAND, 296, "left"),
        (0, "num", "হাতে গোনা কয়েক জোড়া", C_CORAL, 366, "left"),
        (1, "title", "টাঙ্গুয়ার হাওর", C_CREAM, 1150, "left"),
        (1, "sub", "আর হাকালুকি", C_GOLD, 1284, "left"),
    ],
    "s08": [
        (0, "chip", "বাসা ও ছানা", C_MINT, 296, "left"),
        (0, "title", "অগভীর জলে বাসা", C_CREAM, 366, "left"),
        (1, "num", "দুটো ডিম", C_GOLD, 1150, "left"),
        (1, "sub", "এক মাসের বেশি তা দেয়", C_CREAM, 1290, "left"),
        (2, "title", "ছানা ওড়ে দুই মাসে", C_MINT, 1390, "left"),
    ],
    "s09": [
        (0, "chip", "হুমকি", C_CORAL, 296, "left"),
        (0, "title", "হাওর ভরাট হচ্ছে", C_CREAM, 366, "left"),
        (1, "title", "জালে, তারে মরছে", C_CORAL, 1150, "left"),
        (2, "title", "বাংলাদেশে মহাবিপন্ন", C_GOLD, 1270, "left"),
    ],
    "s10": [
        (0, "chip", "কবির চোখে", C_GOLD, 296, "left"),
        (0, "attr", "রবীন্দ্রনাথ · বলাকা (১৯১৬)", C_MINT, 380, "left"),
        (0, "quote", "থেমে থাকা নয়, এগিয়ে চলা", C_CREAM, 470, "left"),
        (1, "title", "হাওর বাঁচলে সারস বাঁচবে", C_CREAM, 1150, "left"),
        (2, "title", "সারস বাঁচলে হাওর বাঁচবে", C_GOLD, 1270, "left"),
    ],
}

STYLE = {
    "chip":  ("sans-semi", 34, "chip"),
    "title": ("serif-bold", 92, "word"),
    "num":   ("serif-bold", 96, "word"),
    "sub":   ("sans-semi", 46, "rise"),
    "attr":  ("sans-semi", 34, "rise"),
    "quote": ("serif-bold", 60, "word"),
}


def draw_beat(img, style, txt, colour, y, align, e, x0=110):
    if e <= 0.004:
        return
    key, px, anim = STYLE[style]
    if style == "chip":
        K.chip(img, txt, (x0, y), e, px=30, colour=colour, icon="dot", slide=40)
        return
    center = align == "mid"
    lay = T.flow(txt, key, px)
    # glyph-shaped soft shadow: keeps white type legible on white petals
    # without the pasted-on rectangle the user rejected.
    xx = (W - lay.width) / 2 if center else x0
    V.text_backing(img, lay.image, (int(xx), y),
                   strength=0.88 if style in ("title", "num", "quote") else 0.74,
                   blur=12 + px // 16, offset=(3, 7))
    if anim == "word":
        # `y` is the ink TOP, same as the rise path: word_line takes a baseline
        base = y + T.baseline_offset(lay)
        K.word_line(img, txt, key, px, (x0, base), colour, min(1.0, e * 1.4),
                    stagger=0.15, dur=0.34, rise=30, center_x=center, x0=x0)
    else:
        yy = y + 18 * (1 - K.eo(e))
        T.paint(img, lay.image, (int(xx), int(yy)), colour, min(1.0, e * 1.5),
                shadow=(4, 5, (0, 0, 0), 0.88), glow=(7.0, 0.18))

# ------------------------------------------------------------------- overlays --
def dissolve_out(img, p, dur=0.30):
    k = min(1.0, max(0.0, (1.0 - p) / max(dur, 1e-6)))
    if k >= 1:
        return img
    a = np.asarray(img, dtype=np.float32) * k
    return Image.fromarray(a.astype(np.uint8), "RGB")


def dissolve_in(img, p, dur=0.28):
    k = min(1.0, p / max(dur, 1e-6)) if dur > 0 else 1.0
    if k >= 1:
        return img
    a = np.asarray(img, dtype=np.float32) * k
    return Image.fromarray(a.astype(np.uint8), "RGB")


INK_PAD = {"chip": 74, "title": 118, "num": 122, "sub": 62, "quote": 84, "attr": 48}
GAP = 18


def layout_beats(scene_id):
    """Stack the lines of one beat so they can never sit on top of each other.

    The BEATS table states intent (which line belongs to which spoken sentence,
    roughly where it should sit); this resolves it into real y positions, one
    below the other, inside the safe area.
    """
    rows = BEATS.get(scene_id, [])
    out, by_idx = [], {}
    for idx, style, txt, colour, y, align in rows:
        by_idx.setdefault(idx, []).append([y, style, txt, colour, align])
    for idx in sorted(by_idx):
        stack = sorted(by_idx[idx], key=lambda r: r[0])
        prev_bottom = -999
        for row in stack:
            y, style, txt, colour, align = row
            if y < prev_bottom + GAP:
                y = prev_bottom + GAP
            # real ink height of this line (shape it once), not a guess
            key_, px_, _ = STYLE.get(style, ("sans-semi", 40, "rise"))
            try:
                h = T.flow(txt, key_, px_).image.height + 12
            except Exception:
                h = INK_PAD.get(style, 80)
            prev_bottom = y + h
            out.append((idx, style, txt, colour, int(y), align))
    return out


def overlay(s, p, img):
    """Draw the lines that belong to the sentence being spoken right now."""
    t = p * s["dur"]
    v = t - s["pre"]
    fade_all = 1.0 - K.ss(s["dur"] - 0.34, s["dur"] - 0.02, t)
    segs = s.get("segs") or []
    kind = s["kind"]

    for idx, style, txt, colour, y, align in layout_beats(s["id"]):
        if idx >= len(segs):
            continue
        a0, b0 = segs[idx]
        e_in = K.ss(a0 - 0.08, a0 + 0.34, v)
        e_out = 1.0 if idx + 1 >= len(segs) or style in ("chip", "attr") \
            else 1.0 - K.ss(b0 + 0.04, b0 + 0.40, v)
        draw_beat(img, style, txt, colour, y, align, e_in * e_out * fade_all)

    if kind == "outro":
        cue = s["cue"]
        e0 = K.ss(max(cue.get("logo", 1.0) + 0.2, 1.4), max(cue.get("logo", 1.0) + 0.2, 1.4) + 1.3, v)
        if e0 > 0:
            K.logo_burst(img, (W * 0.5, 700), min(1.0, e0), size=232,
                         payoff="রূপসী বাংলা",
                         sub="প্রকৃতি · জীববৈচিত্র্য · বাংলাদেশ")
        ec = K.ss(cue.get("cta", 2.0) + 0.4, cue.get("cta", 2.0) + 1.0, v)
        eu = K.ss(cue.get("url", 2.4) + 0.6, cue.get("url", 2.4) + 1.2, v)
        if ec > 0 or eu > 0:
            K.cta_card(img, (70, 1300), ec * fade_all,
                       title="বাংলাদেশের প্রাণী ও উদ্ভিদ সম্পর্কে জানতে",
                       url="ruposhibangla.vercel.app", e_url=eu * fade_all)

    if kind != "outro":
        be = K.ss(0.55, 1.25, t) * fade_all
        if be > 0:
            K.brand_lockup(img, (W - 250, 62), be, size=54, name_px=26)
    return img


def render_frame(s, p, t_global):
    img = scene_frame(s, p, t_global)
    img = V.scrim(img, top=0.14, bottom=0.18)
    img = V.head_scrim(img, 0.08, 0.26)
    if s["kind"] == "poem":
        img = band_scrim(img, 0.12, 0.34, 0.14, 0.14)
        img = band_scrim(img, 0.58, 0.76, 0.13, 0.14)
    # exposure / saturation / crispness are settled on the clean plate, BEFORE
    # the type goes on: matching after the dissolve used to re-lift black frames
    # and made the cuts flash.
    img = V.finish_fast(img, target=108.0, sat=1.28, sharp=1.05)
    img = overlay(s, p, img)
    img = dissolve_in(img, p, 0.42 / s["dur"])
    img = dissolve_out(img, p, 0.52 / s["dur"])
    return img


# ----------------------------------------------------------------------- build --
def build_audio(scenes):
    total = sum(s["dur"] for s in scenes) + 0.6
    n = int(total * A.SR)
    music = np.zeros(n, dtype=np.float32)
    amb = np.zeros(n, dtype=np.float32)
    sfx = np.zeros(n, dtype=np.float32)
    voice = np.zeros(n, dtype=np.float32)

    chords = [(73.42, [220.0, 261.63, 329.63]), (73.42, [174.61, 220.0, 261.63]),
              (98.0, [196.0, 246.94, 293.66]), (65.41, [196.0, 261.63, 329.63])]
    pos, i = 0.0, 0
    while pos < total:
        root, notes = chords[i % len(chords)]
        d = min(7.0, total - pos)
        music = A.place(music, A.pad_chord([root] + notes, d, 0.1, 1.5, 1.9) * 0.46, pos)
        pos += d
        i += 1
    music = A.lowpass_fast(music, 2400, 1)
    music = A.fade(music, 1.0, 2.4)

    pos = 0.0
    for s in scenes:
        d = s["dur"] + 0.8
        if s["amb"] == "water":
            base = A.water(d) * 0.8
            base = A.place(base, A.creek_drips(d, 14), 0.2, 0.9)
        elif s["amb"] == "forest":
            base = A.forest(d) * 0.62
            base = A.place(base, A.birdsong(d, 8, 2300, 1100), 0.35, 1.0)
        elif s["amb"] == "wind":
            base = A.wind(d, 620) * 0.78
        else:
            base = A.wind(d, 360) * 0.34
        amb = A.place(amb, A.norm(base, 0.5), pos, gain=0.5)
        for fx in s.get("fx", []):
            kind, at_, gain = fx
            t0 = pos + s["pre"] + at_
            if kind == "boom":
                sfx = A.place(sfx, A.sub_boom(), t0, gain)
            elif kind == "whoosh":
                sfx = A.place(sfx, A.whoosh(0.9), t0, gain)
            elif kind == "whoosh_down":
                sfx = A.place(sfx, A.whoosh(1.0, "down"), t0, gain)
            elif kind == "tension":
                sfx = A.place(sfx, A.tension_bed(min(8.5, s["dur"])), t0, gain)
            elif kind == "drip":
                sfx = A.place(sfx, A.creek_drips(1.4, 5), t0, gain)
            elif kind == "chime":
                sfx = A.place(sfx, A.pad_chord([1046.5, 1318.5, 1568.0], 1.6, 0.05, 0.02, 1.4),
                              t0, gain * 0.5)
            elif kind == "tick":
                sfx = A.place(sfx, A.whoosh(0.25), t0, gain * 0.6)
            elif kind == "wing":
                sfx = A.place(sfx, A.whoosh(0.7, "down"), t0, gain)
        v = TM.read(s["vo"])
        a0 = int((pos + s["pre"]) * A.SR)
        seg = v[: max(0, min(len(v), len(voice) - a0))]
        voice[a0:a0 + len(seg)] += seg
        pos += s["dur"]

    env = np.convolve(np.abs(voice), np.ones(4800) / 4800, mode="same")
    duck = 1.0 - 0.58 * np.clip(env / (np.max(env) + 1e-6) * 3.4, 0, 1)
    mix = (music * 0.6 + amb * 0.8 + sfx * 0.95) * duck * 0.85
    final = np.clip(voice * 1.0 + mix, -1, 1)
    peak = float(np.max(np.abs(final))) or 1.0
    os.makedirs(OUT, exist_ok=True)
    A.write_wav(os.path.join(OUT, "mix_raw.wav"), (final / peak * 0.94).astype(np.float32))
    return total


def _scene_job(job):
    """Render one scene's frames. Runs in a worker process."""
    scene, start, fast = job
    init_cams()
    frames = os.path.join(OUT, "frames")
    os.makedirs(frames, exist_ok=True)
    n = int(round(scene["dur"] * FPS))
    for k in range(n):
        p = k / max(1, n - 1)
        img = render_frame(scene, p, (start + k) / FPS)
        if fast:
            img = img.resize((W // 2, H // 2), Image.LANCZOS)
        img.save(os.path.join(frames, f"{start + k:05d}.jpg"), quality=92)
    return scene["id"], start, n


def main(fast=False, workers=None):
    scenes = resolve_cues()
    only = os.environ.get("RB_ONLY")
    if only:
        keep = set(only.split(","))
        scenes = [s for s in scenes if s["id"] in keep]
    init_cams()
    total = build_audio(scenes)
    frames = os.path.join(OUT, "frames")
    os.makedirs(frames, exist_ok=True)
    print("scenes", [(s["id"], round(s["dur"], 2)) for s in scenes],
          "total", round(total, 2), flush=True)

    starts, idx = [], 0
    for s in scenes:
        starts.append(idx)
        idx += int(round(s["dur"] * FPS))
    total_frames = idx

    if workers is None:
        workers = int(os.environ.get("RB_WORKERS", os.cpu_count() or 1))
    workers = max(1, min(workers, len(scenes)))

    if workers == 1:
        for s, st in zip(scenes, starts):
            _scene_job((s, st, fast))
            print(" scene", s["id"], "frames", st + int(round(s["dur"] * FPS)), flush=True)
    else:
        # scenes are independent and write disjoint frame numbers, so handing a
        # whole scene to each worker keeps every core busy with no sync cost
        import multiprocessing as mp
        with mp.get_context("fork").Pool(workers) as pool:
            for sid, st, n in pool.imap_unordered(
                    _scene_job, [(s, st, fast) for s, st in zip(scenes, starts)]):
                print(" scene", sid, "done", n, "frames from", st, flush=True)
    print("total frames", total_frames)


if __name__ == "__main__":
    main("--fast" in sys.argv)
