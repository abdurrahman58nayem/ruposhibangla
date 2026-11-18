"""Episode 006 — শাপলা (Nymphaea nouchali). Built on the মেছো বিড়াল renderer.

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
ART = "../art6"
OUT = "../render10"
VO = "../vo8"


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
    dict(id="s01", art="f01_hook.png", amb="water", pre=0.55, post=0.80, kind="hook",
         fx=[("boom", 0.15, 0.8), ("drip", 0.60, 0.45)],
         cues={"open": 0.0, "shut": 0.72}),
    dict(id="s02", art="f02_flower.png", amb="still", pre=0.45, post=0.75, kind="portrait",
         fx=[("whoosh", 0.05, 0.5), ("chime", 0.30, 0.4)],
         cues={"label": 0.0, "en": 0.18, "sci": 0.38}),
    dict(id="s03", art="f03_leaf.png", amb="water", pre=0.45, post=0.75, kind="leaf",
         fx=[("whoosh_down", 0.10, 0.45), ("drip", 0.42, 0.4)],
         cues={"size": 0.30, "top": 0.52, "under": 0.82}),
    dict(id="s04", art="f06_close.png", amb="still", pre=0.45, post=0.75, kind="detail",
         fx=[("tick", 0.08, 0.35), ("chime", 0.55, 0.35)],
         cues={"part": 0.0, "open": 0.70}),
    dict(id="s05", art="f05_colour.png", amb="wind", pre=0.45, post=0.80, kind="nation",
         fx=[("boom", 0.06, 0.6), ("chime", 0.50, 0.4)],
         cues={"colour": 0.0, "same": 0.55, "flag": 0.78}),
    dict(id="s06", art="f07_haor.png", amb="water", pre=0.45, post=0.75, kind="home",
         fx=[("whoosh", 0.20, 0.4), ("boom", 1.20, 0.4)],
         cues={"places": 0.0, "where": 0.40}),
    dict(id="s07", art="f08_bee.png", amb="still", pre=0.45, post=0.75, kind="cycle",
         fx=[("tick", 0.15, 0.35), ("whoosh_down", 0.55, 0.4)],
         cues={"days": 0.0, "poll": 0.36, "fruit": 0.62}),
    dict(id="s08", art="f09_fish.png", amb="water", pre=0.45, post=0.75, kind="role",
         fx=[("drip", 0.10, 0.4), ("boom", 0.55, 0.45)],
         cues={"shade": 0.0, "clear": 0.30, "nursery": 0.62}),
    dict(id="s09", art="f10_shaluk.png", amb="wind", pre=0.45, post=0.80, kind="use",
         fx=[("whoosh", 0.08, 0.4), ("drip", 0.45, 0.35)],
         cues={"food": 0.0, "art": 0.55}),
    dict(id="s10", art="f12_threat.png", amb="wind", pre=0.45, post=0.80, kind="threats",
         fx=[("tension", 0.10, 0.5), ("boom", 0.35, 0.5)],
         cues={"t1": 0.0, "t2": 0.18, "t3": 0.36, "iucn": 0.58}),
    dict(id="s11", art="f11_poem.png", amb="still", pre=0.50, post=0.90, kind="poem",
         fx=[("chime", 0.15, 0.4), ("tick", 0.50, 0.3)],
         cues={"q1": 0.0, "q2": 0.48}),
    dict(id="s12", art="f07_haor.png", amb="still", pre=0.55, post=2.60, kind="outro",
         fx=[("boom", 0.05, 0.5), ("chime", 0.30, 0.4), ("whoosh", 0.52, 0.4)],
         cues={"hope": 0.0, "logo": 0.55, "cta": 0.68, "url": 0.80}),
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
        # merge neighbouring sentences so a line stays up for ~2.5 s: one-second
        # flashes read as jitter, not motion.
        merged, cur = [], None
        for a, b in segs:
            cur = (a, b) if cur is None else (cur[0], b)
            if cur[1] - cur[0] >= 2.4:
                merged.append(cur)
                cur = None
        if cur:
            if merged and cur[1] - cur[0] < 1.3:
                merged[-1] = (merged[-1][0], cur[1])
            else:
                merged.append(cur)
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
        img = V.apply_grade(img, warm=0.30, cool=0.10, contrast=1.13,
                            vignette=0.60, grain=0.022, t=t)
        img = V.spotlight(img, W * 0.48, H * 0.44, W * 0.78, 0.22)
        img = V.light_sweep(img, p * 0.5, 0.34, 0.7)
    elif kind == "portrait":
        z = 1.24 - 0.16 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0.02 - 0.03 * p, 0.012))
        img = V.apply_grade(img, warm=0.34, contrast=1.10, vignette=0.52, grain=0.020, t=t)
        img = V.light_sweep(img, p * 0.45, 0.38, 0.8)
    elif kind == "leaf":
        z = 1.32 - 0.20 * K.eio(p)
        img = cam.frame(zoom=z, pan=(-0.05 + 0.09 * p, 0.03 - 0.04 * p),
                        rot=0.9 * np.sin(p * 1.9))
        img = V.apply_grade(img, warm=0.26, cool=0.12, contrast=1.16,
                            vignette=0.60, grain=0.024, t=t)
        img = V.spotlight(img, W * 0.5, H * 0.52, W * 0.72, 0.20)
    elif kind == "detail":
        z = 1.30 - 0.15 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0.0, 0.02 - 0.03 * p))
        img = V.apply_grade(img, warm=0.28, contrast=1.15, vignette=0.58, grain=0.023, t=t)
        img = V.spotlight(img, W * 0.5, H * 0.5, W * 0.6, 0.28)
    elif kind == "nation":
        z = 1.12 + 0.10 * p
        img = cam.frame(zoom=z, pan=(-0.02 + 0.04 * p, 0.01))
        img = V.apply_grade(img, warm=0.30, cool=0.08, contrast=1.12,
                            vignette=0.56, grain=0.022, t=t)
        img = V.light_sweep(img, p * 0.6, 0.30, 0.85)
    elif kind == "home":
        z = 1.20 - 0.16 * K.eio(p)
        img = cam.frame(zoom=z, pan=(-0.03 + 0.06 * p, 0.02))
        img = V.apply_grade(img, warm=0.34, contrast=1.09, vignette=0.46, grain=0.018, t=t)
        img = V.blend_mist(img, p * 1.1, density=0.15)
        img = V.light_sweep(img, p * 0.5, 0.35, 0.8)
    elif kind == "cycle":
        z = 1.24 - 0.14 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0.015 - 0.03 * p, -0.01))
        img = V.apply_grade(img, warm=0.30, contrast=1.12, vignette=0.58, grain=0.021, t=t)
        img = V.spotlight(img, W * 0.52, H * 0.48, W * 0.7, 0.22)
    elif kind == "role":
        z = 1.18 - 0.10 * p
        img = cam.frame(zoom=z, pan=(0.02 - 0.04 * p, 0.01))
        img = V.apply_grade(img, cool=0.18, warm=0.10, contrast=1.12,
                            vignette=0.54, grain=0.021, t=t)
        img = V.blend_mist(img, p * 1.6, density=0.20)
    elif kind == "use":
        z = 1.14 + 0.08 * p
        img = cam.frame(zoom=z, pan=(0.02 - 0.03 * p, 0.008))
        img = V.apply_grade(img, warm=0.30, contrast=1.08, vignette=0.52, grain=0.019, t=t)
    elif kind == "threats":
        z = 1.22 - 0.13 * p
        img = cam.frame(zoom=z, pan=(-0.02 + 0.05 * p, 0.02),
                        shake=(0.9 * np.sin(p * 18), 0.7 * np.cos(p * 15)))
        img = V.apply_grade(img, cool=0.34, contrast=1.15, vignette=0.68, grain=0.028, t=t)
    elif kind == "poem":
        z = 1.10 + 0.07 * p
        img = cam.frame(zoom=z, pan=(0.0, 0.02 - 0.03 * p))
        img = V.apply_grade(img, warm=0.26, cool=0.14, contrast=1.12,
                            vignette=0.62, grain=0.022, t=t)
        img = V.light_sweep(img, 0.10 + p * 0.25, 0.28, 0.5)
    elif kind == "outro":
        z = 1.14 - 0.06 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0, -0.015))
        img = V.apply_grade(img, warm=0.28, cool=0.10, contrast=1.08,
                            vignette=0.60, grain=0.018, t=t)
    else:
        z = 1.06 + 0.12 * K.eo(p)
        img = cam.frame(zoom=z, pan=(0, 0.01))
        img = V.apply_grade(img, warm=0.2, contrast=1.1, vignette=0.6, grain=0.02, t=t)
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
        (0, "chip", "ভোরের পুকুর", C_MINT, 296, "left"),
        (0, "title", "জলের বুকে", C_CREAM, 360, "left"),
        (1, "title", "কুয়াশা সরে যাচ্ছে", C_CREAM, 380, "left"),
        (1, "title", "জলের ওপর সাদা ফুল", C_GOLD, 500, "left"),
        (2, "title", "সূর্য উঠলেই বন্ধ", C_GOLD, 1150, "left"),
    ],
    "s02": [
        (0, "chip", "পরিচয়", C_MINT, 296, "left"),
        (0, "title", "শাপলা", C_CREAM, 360, "left"),
        (1, "attr", "বৈজ্ঞানিক নাম", C_MINT, 1160, "left"),
        (1, "title", "Nymphaea nouchali", C_CREAM, 1206, "left"),
        (2, "title", "জাতীয় ফুল", C_GOLD, 1340, "left"),
    ],
    "s03": [
        (0, "chip", "পাতা", C_SAND, 296, "left"),
        (0, "title", "লম্বা ডাঁটা", C_CREAM, 360, "left"),
        (1, "num", "২০–৩০ সেন্টিমিটার", C_GOLD, 420, "left"),
        (2, "title", "ওপরের পিঠ চকচকে", C_CREAM, 1080, "left"),
        (3, "title", "নিচের পিঠ বেগুনি", C_GOLD, 1180, "left"),
    ],
    "s04": [
        (0, "chip", "ফুলের গঠন", C_MINT, 296, "left"),
        (0, "sub", "চারটি বৃতি", C_CREAM, 360, "left"),
        (1, "num", "১২–৩০টি পাপড়ি", C_GOLD, 420, "left"),
        (2, "title", "সোনালি পরাগকেশর", C_MINT, 1120, "left"),
        (3, "title", "একটা একটা করে খোলে", C_GOLD, 1230, "left"),
    ],
    "s05": [
        (0, "chip", "রঙের বৈচিত্র্য", C_SAND, 296, "left"),
        (0, "title", "সাদা · গোলাপি", C_CREAM, 360, "left"),
        (1, "title", "লাল · নীলচে", C_CREAM, 470, "left"),
        (2, "sub", "এই ফুলটাই", C_CREAM, 1120, "left"),
        (2, "title", "জাতীয় ফুল", C_GOLD, 1170, "left"),
    ],
    "s06": [
        (0, "chip", "বাংলাদেশে বিস্তৃতি", C_SAND, 296, "left"),
        (0, "title", "হাওর · বিল", C_CREAM, 360, "left"),
        (1, "title", "পুকুর · খাল", C_CREAM, 470, "left"),
        (2, "sub", "অগভীর জল যেখানে", C_CREAM, 1088, "left"),
        (2, "title", "সেখানেই", C_GOLD, 1140, "left"),
        (3, "sub", "সিলেট-সুনামগঞ্জের হাওর", C_CREAM, 1290, "left"),
        (3, "title", "সারা দেশে", C_GOLD, 1360, "left"),
    ],
    "s07": [
        (0, "chip", "প্রজনন", C_MINT, 296, "left"),
        (0, "num", "১–২ দিন", C_GOLD, 356, "left"),
        (0, "sub", "ততক্ষণই খোলা", C_CREAM, 500, "left"),
        (1, "title", "পরাগ ছড়ায়", C_MINT, 1120, "left"),
        (1, "sub", "গুবরে পোকা ও মৌমাছি", C_CREAM, 1250, "left"),
        (2, "title", "ফল পাকে জলের নিচে", C_GOLD, 1380, "left"),
    ],
    "s08": [
        (0, "chip", "প্রকৃতিতে ভূমিকা", C_TEAL, 296, "left"),
        (0, "title", "জল থাকে ঠান্ডা", C_GOLD, 360, "left"),
        (1, "title", "শৈবাল বাড়ে না", C_CREAM, 1120, "left"),
        (1, "sub", "জল থাকে পরিষ্কার", C_MINT, 1240, "left"),
        (2, "sub", "আশ্রয় পায় মাছ, ব্যাঙাচি", C_CREAM, 1350, "left"),
    ],
    "s09": [
        (0, "chip", "মানুষের জীবনে", C_SAND, 296, "left"),
        (0, "title", "শালুকের ডাঁটা", C_CREAM, 360, "left"),
        (1, "sub", "গ্রামে এটা সবজি", C_GOLD, 496, "left"),
        (2, "title", "নকশি কাঁথায় শাপলা", C_CREAM, 1120, "left"),
        (3, "title", "আলপনার রেখায়", C_GOLD, 1250, "left"),
    ],
    "s10": [
        (0, "chip", "হুমকি", C_CORAL, 296, "left"),
        (0, "title", "পুকুর ভরাট হচ্ছে", C_CREAM, 360, "left"),
        (1, "title", "জল হচ্ছে দূষিত", C_SAND, 1150, "left"),
        (2, "title", "আগাছানাশক আসছে", C_CORAL, 1270, "left"),
    ],
    "s11": [
        (0, "chip", "কবির কথা", C_GOLD, 296, "left"),
        (0, "attr", "কাজী নজরুল ইসলাম", C_MINT, 358, "left"),
        (0, "quote", "শাপলা শালুকে সাজাইয়া সাজি", C_CREAM, 418, "left"),
        (1, "quote", "শরতে শিশিরে নাহিয়া", C_CREAM, 1120, "left"),
        (2, "quote", "এনেছি শাপলা-পদ্মের মধু", C_GOLD, 1260, "left"),
    ],
    "s12": [
        (0, "title", "পুকুরটা বাঁচলে", C_CREAM, 300, "mid"),
        (0, "title", "শাপলা বাঁচবে", C_GOLD, 408, "mid"),
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
    if anim == "word":
        lay = T.flow(txt, key, px)
        base = y + lay.baseline
        K.word_line(img, txt, key, px, (x0, base), colour, min(1.0, e * 1.4),
                    stagger=0.15, dur=0.34, rise=30, center_x=center, x0=x0)
    else:
        lay = T.flow(txt, key, px)
        xx = (W - lay.width) / 2 if center else x0
        yy = y + 18 * (1 - K.eo(e))
        T.paint(img, lay.image, (int(xx), int(yy)), colour, min(1.0, e * 1.5),
                shadow=(5, 6, (0, 0, 0), 0.70), glow=(6.0, 0.16))

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


def overlay(s, p, img):
    """Draw the lines that belong to the sentence being spoken right now."""
    t = p * s["dur"]
    v = t - s["pre"]
    fade_all = 1.0 - K.ss(s["dur"] - 0.34, s["dur"] - 0.02, t)
    segs = s.get("segs") or []
    kind = s["kind"]

    for idx, style, txt, colour, y, align in BEATS.get(s["id"], []):
        if idx >= len(segs):
            continue
        a0, b0 = segs[idx]
        e_in = K.ss(a0 - 0.08, a0 + 0.34, v)
        e_out = 1.0 if idx + 1 >= len(segs) or style in ("chip", "attr") \
            else 1.0 - K.ss(b0 + 0.04, b0 + 0.40, v)
        draw_beat(img, style, txt, colour, y, align, e_in * e_out * fade_all)

    if kind == "outro":
        cue = s["cue"]
        e0 = K.ss(max(cue["logo"] + 0.2, 1.4), max(cue["logo"] + 0.2, 1.4) + 1.3, v)
        if e0 > 0:
            K.logo_burst(img, (W * 0.5, 700), min(1.0, e0), size=232,
                         payoff="রূপসী বাংলা",
                         sub="প্রকৃতি · জীববৈচিত্র্য · বাংলাদেশ")
        ec = K.ss(cue["cta"] + 0.4, cue["cta"] + 1.0, v)
        eu = K.ss(cue["url"] + 0.6, cue["url"] + 1.2, v)
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
    img = V.scrim(img, top=0.34, bottom=0.40)
    img = V.head_scrim(img, 0.18, 0.42)
    if s["kind"] == "poem":
        img = band_scrim(img, 0.14, 0.36, 0.30, 0.10)
        img = band_scrim(img, 0.58, 0.74, 0.28, 0.10)
    img = overlay(s, p, img)
    img = dissolve_in(img, p, 0.42 / s["dur"])
    img = dissolve_out(img, p, 0.52 / s["dur"])
    img = V.apply_grade(img, contrast=1.02, lift=0.003, t=t_global)
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


def main(fast=False):
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
    for s in scenes:
        print("  cue", s["id"], {k: round(x, 2) for k, x in s["cue"].items()}, flush=True)
    idx = 0
    for s in scenes:
        n = int(round(s["dur"] * FPS))
        for k in range(n):
            p = k / max(1, n - 1)
            img = render_frame(s, p, idx / FPS)
            if fast:
                img = img.resize((W // 2, H // 2), Image.LANCZOS)
            img.save(os.path.join(frames, f"{idx:05d}.jpg"), quality=93)
            idx += 1
        print(" scene", s["id"], "frames", idx, flush=True)
    print("total frames", idx)


if __name__ == "__main__":
    main("--fast" in sys.argv)
