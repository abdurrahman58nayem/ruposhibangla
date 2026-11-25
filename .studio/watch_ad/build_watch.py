"""Renderer for the 3-watch combo ad (৳1,099).

Frames are drawn procedurally from the cut-out product sprites; the audio bed is
synthesised, the voiceover comes from `vo/*.mp3`.

    python build_watch.py samples      # 3 sample frames per scene -> /tmp/wsamp
    python build_watch.py frames       # full frame sequence -> build/frames
    python build_watch.py audio        # build/mix.wav + build/voice.wav
    python build_watch.py encode       # 4k + 1080x1920 + 15s cut

Scene vocabulary is fixed (see SCENES) so the stills and the film stay in sync.
"""
from __future__ import annotations
import os, sys, math, subprocess, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "v3"))

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import adkit_w as K
import rbtext as T
import rbaudio as AU

W, H = K.W, K.H                     # 2160 x 3840  (SCALE = 2)
FPS = 30
OUT = os.path.join(HERE, "build")
CUT = os.path.join(HERE, "cut3")
VO = os.path.join(HERE, "vo")
FFMPEG = "/home/user/venv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v9.0.2"

NAVY, NAVY_SOFT = K.NAVY, K.NAVY_SOFT
CARAMEL, CARAMEL_LT = K.CARAMEL, K.CARAMEL_LT
CREAM, CREAM_HI, SAND, WHITE = K.CREAM, K.CREAM_HI, K.SAND, K.WHITE
txt, chip, hairline, dot, ss = K.txt, K.chip, K.hairline, K.dot, K.ss

# All scene geometry below is authored in 1080x1920 design units; the canvas is
# 2160x3840, so every position, size and text pixel is multiplied by S on the
# way in. Text is therefore rasterised at the full 4K resolution.
S = 2


def pl(text, key, px):
    return T.line(text, key, px * S)


def pp(canvas, mask, xy, fill, alpha=1.0):
    T.paint(canvas, mask, (xy[0] * S, xy[1] * S), fill, alpha=alpha)


def tt(canvas, text, key, px, xy, fill=NAVY, align="left", alpha=1.0):
    return txt(canvas, text, key, px * S, (xy[0] * S, xy[1] * S), fill,
               alpha=alpha, align="center" if align == "center" else "left")


def hl(canvas, x0, x1, y, colour=CARAMEL, w=2, alpha=255):
    return hairline(canvas, x0 * S, x1 * S, y * S, colour, max(1, int(round(w * S))), alpha)


def ch(canvas, text, key, px, xy, **kw):
    xy = (xy[0] * S, xy[1] * S)
    kw["pad_x"] = kw.get("pad_x", 26) * S
    kw["pad_y"] = kw.get("pad_y", 12) * S
    return chip(canvas, text, key, px * S, xy, **kw)

# --------------------------------------------------------------------- scenes --
# (id, seconds, voice clip, offset)
SCENES = [
    dict(id="A", dur=6.35, vo="A", off=0.12),   # hook
    dict(id="B", dur=7.15, vo="B", off=0.12),   # OLEVS, two designs
    dict(id="C", dur=6.12, vo="C", off=0.12),   # NICKIES
    dict(id="D", dur=3.35, vo="D", off=0.40),   # chrono alternative
    dict(id="E", dur=5.24, vo="E", off=0.12),   # sports
    dict(id="F", dur=3.95, vo="F", off=0.20),   # how the combo works
    dict(id="G", dur=6.42, vo="G", off=0.14),   # close / CTA
]
TOTAL = sum(s["dur"] for s in SCENES)

_S = {}
def sprites():
    if not _S:
        for k in ("w_olevs_a", "w_olevs_b", "w_spider", "w_spider_big", "w_t4g",
                  "w_sport"):
            _S[k] = Image.open(os.path.join(CUT, k + ".png")).convert("RGBA")
    return _S


# ------------------------------------------------------------------- helpers --
def sprite(canvas, key, cx, cy, hgt, shadow=0.55, tilt=0.0, alpha=1.0):
    sp = sprites()[key]
    cx, cy, hgt = cx * S, cy * S, hgt * S
    hh = int(hgt)
    ww = max(2, int(sp.width * hh / sp.height))
    sp = sp.resize((ww, hh), Image.LANCZOS)
    if tilt:
        sp = sp.rotate(tilt, resample=Image.BICUBIC, expand=True)
    # contact shadow
    if shadow > 0:
        sh = Image.new("L", canvas.size, 0)
        ImageDraw.Draw(sh).ellipse(
            [cx - sp.width * 0.30, cy + hh * 0.45 - hh * 0.03,
             cx + sp.width * 0.30, cy + hh * 0.45 + hh * 0.045],
            fill=int(150 * shadow))
        sh = sh.filter(ImageFilter.GaussianBlur(max(2, hh * 0.045)))
        canvas.paste(Image.new("RGB", canvas.size, (146, 124, 92)), (0, 0), sh)
    if alpha < 1.0:
        sp = sp.copy()
        sp.putalpha(sp.split()[3].point(lambda v: int(v * alpha)))
    canvas.paste(sp, (int(cx - sp.width / 2), int(cy - sp.height / 2)), sp)
    return sp.width, sp.height


def ease_out(p, k=3.0):
    return 1 - (1 - min(1.0, max(0.0, p))) ** k


def rise(canvas, mask, xy, fill, p, dist=40, t0=0.0, t1=0.34, alpha=1.0):
    """Text that lifts into place over [t0,t1] of the scene (design units)."""
    e = ease_out((p - t0) / max(1e-6, t1 - t0))
    if e <= 0.002:
        return
    T.paint(canvas, mask, ((xy[0]) * S, (xy[1] + (1 - e) * dist) * S), fill,
            alpha=e * alpha)


def frame_fade(img, p, dur, fi=5, fo=6):
    f = fi / FPS / dur
    g = fo / FPS / dur
    a = min(1.0, p / f, (1 - p) / g) if f > 0 else 1.0
    if a >= 0.999:
        return img
    arr = np.asarray(img, np.float32) * max(0.0, a)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def cam(canvas, key, cx, cy, hgt, p, push=0.06, shadow=0.55, t0=0.0):
    """Slow push-in: keeps stills from looking frozen."""
    e = ease_out((p - t0) / max(1e-6, 1.0 - t0), 2.0)
    return sprite(canvas, key, cx, cy - e * hgt * 0.008,
                  hgt * (1 + push * e), shadow=shadow)


def at(bg, mask, x, y, fill, alpha=1.0):
    """Paint a mask at design-space (x, y) top-left."""
    T.paint(bg, mask, (x * S, y * S), fill, alpha=alpha)


def ctr(bg, mask, y, fill, alpha=1.0):
    """Paint a mask horizontally centred at design-space y."""
    T.paint(bg, mask, ((540 - mask.width / S / 2) * S, y * S), fill, alpha=alpha)


def mid(mask, y):
    return ((W / S - mask.width / S) / 2, y)


def footer(bg, alpha=1.0):
    """No brand line — the shop name is not to be printed on the artwork.
    A single hairline just seats the frame."""
    hl(bg, 430, 650, 1800, CARAMEL, 1.5, int(80 * alpha))


def kicker(bg, s, y=150, col=CARAMEL, px=34):
    txt(bg, s, "sans-bold", px, (84, y), col)


# --------------------------------------------------------------------- scenes --
# authored in 1080x1920 design units
def scene_A(p):
    """Hook: one watch, price lands hard."""
    bg = K.stage(W, H)
    m1, _ = pl("স্পেশাল অফার", "sans-bold", 34)
    rise(bg, m1, ((540 - m1.width / S / 2), 116), CARAMEL, p, dist=20, t0=0.02, t1=0.26)
    m2, _ = pl("তিনটা ঘড়ি · একসাথে", "serif-bold", 92)
    rise(bg, m2, ((540 - m2.width / S / 2), 162), NAVY, p, dist=28, t0=0.10, t1=0.38)
    for i, k in enumerate(("w_olevs_a", "w_spider_big", "w_sport")):
        e = ease_out((p - 0.06 - i * 0.06) / 0.34, 2.6)
        if e <= 0.002:
            continue
        sprite(bg, k, 232 + i * 308, 1150 - (1 - e) * 56,
               700 * (0.93 + 0.07 * e), shadow=0.42, alpha=e)
    e = ease_out((p - 0.32) / 0.22)
    if e > 0.002:
        m3, _ = pl("মাত্র ৳১,০৯৯", "serif-bold", 128)
        ctr(bg, m3, 356 + (1 - e) * 34, CARAMEL, e)
    e2 = ease_out((p - 0.55) / 0.25)
    if e2 > 0.002:
        m4, _ = pl("OLEVS · NICKIES · স্পোর্টস", "sans-semi", 26)
        ctr(bg, m4, 1700, NAVY_SOFT, e2)
        hl(bg, 150, 930, 1660, CARAMEL, 2, int(120 * e2))
    footer(bg)
    return frame_fade(bg, p, SCENES[0]["dur"])


def scene_B(p):
    """OLEVS: hero + the two designs."""
    bg = K.stage(W, H)
    m1, _ = pl("প্রিমিয়াম", "sans-bold", 27)
    rise(bg, m1, (52, 80), CARAMEL, p, dist=16, t0=0.02, t1=0.24)
    m2, _ = pl("OLEVS", "serif-bold", 108)
    rise(bg, m2, (46, 114), NAVY, p, dist=26, t0=0.06, t1=0.32)
    m3, _ = pl("প্রিমিয়াম ফিনিশ · ওয়াটারপ্রুফ", "sans-semi", 28)
    rise(bg, m3, (52, 262), NAVY_SOFT, p, dist=18, t0=0.16, t1=0.42)
    cam(bg, "w_olevs_a", 545, 620, 790, p, push=0.05)
    # two designs
    m4, _ = pl("দুই ডিজাইন", "sans-bold", 27)
    rise(bg, m4, (56, 1038), CARAMEL, p, dist=14, t0=0.30, t1=0.50)
    m5, _ = pl("যেটা ভালো লাগে সেটাই", "sans", 22)
    rise(bg, m5, (56, 1078), NAVY_SOFT, p, dist=12, t0=0.36, t1=0.56)
    for j, (k, tag) in enumerate((("w_olevs_a", "A"), ("w_olevs_b", "B"))):
        e = ease_out((p - 0.32 - j * 0.07) / 0.30)
        if e <= 0.002:
            continue
        cx = 355 + j * 350
        sprite(bg, k, cx, 1268 - (1 - e) * 46, 390 * (0.92 + 0.08 * e),
               shadow=0.40, alpha=e)
        mt, _ = pl(tag, "serif-bold", 32)
        at(bg, mt, cx - mt.width / S / 2, 1476, NAVY, e)
    e3 = ease_out((p - 0.52) / 0.30)
    if e3 > 0.002:
        hl(bg, 84, 996, 1540, CARAMEL, 2, int(110 * e3))
        for i, f in enumerate(["ওয়াটারপ্রুফ", "কালার গ্যারান্টি", "প্রিমিয়াম ফিনিশ"]):
            m, _ = pl(f, "sans-semi", 23)
            at(bg, m, 215 + i * 325 - m.width / S / 2, 1566, NAVY, e3)
        ch(bg, "কম্বোর দাম ৳১,০৯৯", "sans-semi", 27, (540, 1640),
           fill=CARAMEL, fg=WHITE, pad_x=30, pad_y=16, align="center", alpha=e3)
    footer(bg)
    return frame_fade(bg, p, SCENES[1]["dur"])


def _single(p, idx, key, kick, title, sub, foot, hero_h=820, cy=900, push=0.05):
    bg = K.stage(W, H)
    m1, _ = pl(kick, "sans-bold", 27)
    rise(bg, m1, ((540 - m1.width / S / 2), 92), CARAMEL, p, dist=16, t0=0.02, t1=0.26)
    m2, _ = pl(title, "serif-bold", 74)
    rise(bg, m2, ((540 - m2.width / S / 2), 130), NAVY, p, dist=28, t0=0.08, t1=0.36)
    m3, _ = pl(sub, "sans-semi", 28)
    rise(bg, m3, ((540 - m3.width / S / 2), 246), NAVY_SOFT, p, dist=18, t0=0.16, t1=0.44)
    cam(bg, key, 540, cy, hero_h, p, push=push)
    e = ease_out((p - 0.40) / 0.30)
    if e > 0.002:
        hl(bg, 110, 970, 1584, CARAMEL, 2, int(110 * e))
        m, _ = pl(foot, "sans-semi", 27)
        ctr(bg, m, 1608, NAVY, e)
        m2, _ = pl("কম্বোতে মাত্র ১টি", "sans", 23)
        ctr(bg, m2, 1662, CARAMEL, e)
    footer(bg)
    return frame_fade(bg, p, SCENES[idx]["dur"])


def scene_C(p):
    return _single(p, 2, "w_spider_big", "চামড়ার স্ট্র্যাপ", "NICKIES",
                   "স্পাইডার ডায়াল · সিলভার কেস",
                   "water-resistant চামড়ার স্ট্র্যাপ", hero_h=930, cy=930)


def scene_D(p):
    return _single(p, 3, "w_t4g", "অথবা", "ক্রোনোগ্রাফ",
                   "৩ সাব-ডায়াল · রেড অ্যাকসেন্ট",
                   "একই দামে · একই কম্বোতে", hero_h=850, cy=930, push=0.06)


def scene_E(p):
    return _single(p, 4, "w_sport", "রোজকার ঘড়ি", "স্পোর্টস",
                   "অষ্টভুজ কেস · রাবার স্ট্র্যাপ",
                   "টেকসই · স্পোর্টি লুক", hero_h=1020, cy=930, push=0.055)


def scene_F(p):
    """How the combo works: three slots, one pick in each."""
    bg = K.stage(W, H)
    m1, _ = pl("কম্বো যেভাবে", "serif-bold", 76)
    rise(bg, m1, ((540 - m1.width / S / 2), 82), NAVY, p, dist=24, t0=0.02, t1=0.28)
    m2, _ = pl("৩টা স্লট — প্রতিটায় একটা", "sans-semi", 29)
    rise(bg, m2, ((540 - m2.width / S / 2), 186), NAVY_SOFT, p, dist=16, t0=0.10, t1=0.36)
    rows = [("OLEVS", ["w_olevs_a", "w_olevs_b"]),
            ("চামড়ার স্ট্র্যাপ", ["w_spider", "w_t4g"]),
            ("স্পোর্টস", ["w_sport"])]
    y = 300
    for i, (name, keys) in enumerate(rows):
        e = ease_out((p - 0.14 - i * 0.10) / 0.30)
        if e > 0.002:
            m, _ = pl(name, "sans-bold", 32)
            at(bg, m, 62, y + 20, NAVY, e)
            n = len(keys)
            sw = 200
            x0 = 1064 - n * sw
            for j, k in enumerate(keys):
                sprite(bg, k, x0 + sw / 2 + j * sw, y + 66, 172 * (0.9 + 0.1 * e),
                       shadow=0.32, alpha=e)
            hl(bg, 62, 1018, y + 172, CARAMEL, 1.5, int(70 * e))
        y += 232
    e3 = ease_out((p - 0.55) / 0.30)
    if e3 > 0.002:
        m, _ = pl("মোট ৩টা · ৳১,০৯৯", "serif-bold", 70)
        ctr(bg, m, 1062, CARAMEL, e3)
    e4 = ease_out((p - 0.66) / 0.26)
    if e4 > 0.002:
        m, _ = pl("যেমন", "sans-bold", 24)
        ctr(bg, m, 1168, CARAMEL, e4)
        examples = (("w_olevs_a", "w_spider", "w_sport"),
                    ("w_olevs_b", "w_t4g", "w_sport"))
        for r, trio in enumerate(examples):
            for j, k in enumerate(trio):
                sprite(bg, k, 300 + j * 240, 1290 + r * 210,
                       150 * (0.94 + 0.06 * e4), shadow=0.30, alpha=e4)
                if j < 2:
                    mp, _ = pl("+", "sans-bold", 34)
                    at(bg, mp, 300 + j * 240 + 120 - mp.width / S / 2,
                       1276 + r * 210, CARAMEL, e4)
    footer(bg)
    return frame_fade(bg, p, SCENES[5]["dur"])


def scene_G(p):
    """Close: the trio, the price, the CTA."""
    bg = K.stage(W, H)
    m1, _ = pl("বেছে নিন আপনার কম্বো", "serif-bold", 62)
    rise(bg, m1, ((540 - m1.width / S / 2), 84), NAVY, p, dist=26, t0=0.02, t1=0.30)
    trio = ["w_olevs_a", "w_spider_big", "w_sport"]
    for i, k in enumerate(trio):
        e = ease_out((p - 0.12 - i * 0.08) / 0.32)
        if e <= 0.002:
            continue
        sprite(bg, k, 200 + i * 340, 470 - (1 - e) * 56, 470 * (0.9 + 0.1 * e),
               shadow=0.40, alpha=e)
    e2 = ease_out((p - 0.38) / 0.26)
    if e2 > 0.002:
        m, _ = pl("মোট ৳১,০৯৯", "serif-bold", 118)
        ctr(bg, m, 790, CARAMEL, e2)
    rows = ["OLEVS — ২ ডিজাইনের যেকোনো ১টি",
            "NICKIES বা ক্রোনোগ্রাফ — যেকোনো ১টি",
            "স্পোর্টস ঘড়ি — ১টি"]
    for i, r in enumerate(rows):
        e = ease_out((p - 0.50 - i * 0.06) / 0.24)
        if e <= 0.002:
            continue
        dot(bg, 95 * S, (1000 + i * 66 + 16) * S, 5 * S, CARAMEL, int(210 * e))
        m, _ = pl(r, "sans-semi", 29)
        at(bg, m, 122, 1000 + i * 66, NAVY, e)
    e3 = ease_out((p - 0.72) / 0.24)
    if e3 > 0.002:
        m, _ = pl("স্পেশাল অফার · সীমিত স্টক", "sans-semi", 27)
        ctr(bg, m, 1272, NAVY, e3)
        ch(bg, "এখনই মেসেজ করুন", "sans-bold", 34, (540, 1330),
           fill=CARAMEL, fg=WHITE, pad_x=34, pad_y=19, align="center", alpha=e3)
        m2, _ = pl("ডেলিভারি সারা বাংলাদেশে", "sans", 23)
        ctr(bg, m2, 1452, NAVY_SOFT, e3)
    footer(bg)
    return frame_fade(bg, p, SCENES[6]["dur"])


DRAW = {"A": scene_A, "B": scene_B, "C": scene_C, "D": scene_D,
        "E": scene_E, "F": scene_F, "G": scene_G}


def draw_scene(s, p):
    return DRAW[s["id"]](p)


# -------------------------------------------------------------------- audio ---
def _read(path):
    import wave
    w = wave.open(path)
    a = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float32) / 32768
    if w.getnchannels() > 1:
        a = a.reshape(-1, w.getnchannels()).mean(1)
    return a


def _mp3_to_wav(src, dst):
    subprocess.run([FFMPEG, "-y", "-v", "error", "-i", src, "-ar", "48000",
                    "-ac", "1", dst], check=True)


def _pluck(f, dur, decay):
    tt = AU.t(dur)
    x = (np.sin(2 * np.pi * f * tt) * 0.62
         + np.sin(2 * np.pi * f * 2.01 * tt) * 0.22
         + np.sin(2 * np.pi * f * 3.02 * tt) * 0.09)
    env = np.exp(-tt * decay * 6.0) * (1 - np.exp(-tt * 220))
    return (x * env).astype(np.float32)


def _shaker(dur):
    n = int(dur * AU.SR)
    x = AU.noise(n) * np.exp(-AU.t(dur) * 55)
    return AU.highpass_fast(x, 5200, 1).astype(np.float32)


def build_audio(mix_path=None):
    SR = AU.SR
    n = int((TOTAL + 0.4) * SR)
    voice = np.zeros(n, np.float32)
    music = np.zeros(n, np.float32)
    os.makedirs(OUT, exist_ok=True)

    # bed: 104 bpm, bright major sevenths — light, not moody
    chords = [(174.61, [349.23, 440.00, 523.25]),
              (196.00, [392.00, 493.88, 587.33]),
              (130.81, [261.63, 329.63, 392.00]),
              (146.83, [293.66, 369.99, 440.00])]
    beat = 60.0 / 104.0
    pos, i = 0.0, 0
    while pos < TOTAL:
        root, tri = chords[i % 4]
        for bar in range(2):
            for k, f in enumerate([root * 2] + tri):
                t0 = pos + bar * 4 * beat + k * beat * 0.5
                if t0 > TOTAL:
                    break
                music = AU.place(music, _pluck(f, 1.0, 0.30), t0,
                                 0.10 if k else 0.13)
            for k in range(4):
                music = AU.place(music, _shaker(0.06),
                                 pos + bar * 4 * beat + (k + 0.5) * beat, 0.05)
        music = AU.place(music, AU.norm(np.sin(2 * np.pi * root / 2 * AU.t(2.0))
                                        * np.exp(-AU.t(2.0) * 1.7), 0.5), pos, 0.19)
        pos += 8 * beat
        i += 1
    music = AU.lowpass_fast(music, 5600, 1)
    music = AU.fade(music, 0.6, 1.8)

    # voice
    st = 0.0
    voice_spans = []
    for s in SCENES:
        src = os.path.join(VO, s["vo"] + ".mp3")
        wav = os.path.join(OUT, "vo_" + s["vo"] + ".wav")
        if not os.path.exists(wav):
            _mp3_to_wav(src, wav)
        v = _read(wav)
        r = np.sort(np.abs(v))[-max(1, len(v) // 4):]
        lvl = float(np.sqrt(np.mean(r ** 2))) or 1.0
        v = v * float(np.clip(0.104 / lvl, 0.5, 2.5))
        start = st + s["off"]
        room = int((st + s["dur"] - 0.06) * SR) - int(start * SR)
        if len(v) > room:
            print(f"  ! {s['id']}: trimmed {len(v)/SR - room/SR:.2f}s", flush=True)
            v = AU.fade(v[:room], 0.01, 0.12)
        a0 = int(start * SR)
        voice[a0:a0 + len(v)] += v
        voice_spans.append((start, start + len(v) / SR))
        st += s["dur"]
    vpk = float(np.max(np.abs(voice))) or 1.0
    voice = voice / vpk * 0.90
    voice = np.tanh(voice * 1.05) / 1.05

    # duck the bed under the voice
    env = np.convolve(np.abs(voice), np.ones(2400) / 2400, mode="same")
    env /= (env.max() + 1e-9)
    g = np.ones_like(env)
    cur, prev = 1.0, 0.0
    for j in range(0, len(env), 8):
        e = env[j]
        a = 0.055 if e > prev else 0.0035
        cur += (e - cur) * a
        prev = e
        g[j:j + 8] = 1.0 - 0.58 * np.clip(cur * 1.7, 0, 1)
    final = np.clip(voice + music * 0.225 * g, -1, 1)
    final = final / (float(np.max(np.abs(final))) or 1.0) * 0.93
    AU.write_wav(mix_path or os.path.join(OUT, "mix.wav"), final.astype(np.float32))
    AU.write_wav(os.path.join(OUT, "voice.wav"),
                 (voice / (np.max(np.abs(voice)) or 1.0) * 0.92).astype(np.float32))
    print("audio ok", round(TOTAL, 2), flush=True)


# ------------------------------------------------------------------- render ---
def _job(arg):
    s, start, fi = arg
    nf = int(round(s["dur"] * FPS))
    out = []
    for i in range(fi, nf, STEP):
        p = i / max(1, nf - 1)
        draw_scene(s, p).save(os.path.join(OUT, "frames", "%05d.jpg" % (start + i)),
                              quality=93, subsampling=0)
        out.append(start + i)
    return s["id"], fi, len(out)


STEP = 1


def render_frames():
    global STEP
    os.makedirs(os.path.join(OUT, "frames"), exist_ok=True)
    import multiprocessing as mp
    jobs = []
    start = 0
    for s in SCENES:
        nf = int(round(s["dur"] * FPS))
        jobs.append((s, start, 0))
        start += nf
    # split each scene into two interleaved streams so both cores stay busy
    W_ = int(os.environ.get("WORKERS", "2"))
    STEP = W_
    jobs = [(s, st, k) for (s, st, _) in jobs for k in range(W_)]
    with mp.get_context("fork").Pool(W_) as pool:
        for r in pool.imap_unordered(_job, jobs):
            print(" chunk", r, flush=True)
    print("frames", start, flush=True)


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "samples"
    if mode == "samples":
        os.makedirs("/tmp/wsamp", exist_ok=True)
        for s in SCENES:
            for k in range(4):
                p = (k + 0.5) / 4
                draw_scene(s, p).resize((W // 3, H // 3), Image.LANCZOS).save(
                    f"/tmp/wsamp/{s['id']}_{k}.jpg", quality=90)
        print("samples ok")
    elif mode == "frames":
        render_frames()
    elif mode == "audio":
        build_audio()
    elif mode == "only":
        ids = sys.argv[2].split(",")
        os.makedirs(os.path.join(OUT, "frames"), exist_ok=True)
        start = 0
        for s in SCENES:
            nf = int(round(s["dur"] * FPS))
            if s["id"] in ids:
                for i in range(nf):
                    p = i / max(1, nf - 1)
                    draw_scene(s, p).save(
                        os.path.join(OUT, "frames", "%05d.jpg" % (start + i)),
                        quality=93, subsampling=0)
                print(" scene", s["id"], start, nf, flush=True)
            start += nf
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
