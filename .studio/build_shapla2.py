"""Episode 006 — শাপলা (Nymphaea nouchali, Water Lily). 1080x1920 9:16 reel.

Layout rule: exactly ONE text card on screen at a time. Each card enters,
holds, then leaves before the next one starts (see `CARD_GAP`).
"""
import os
import sys

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(HERE)

import kinetic as K          # noqa: E402
import rbaudio as A          # noqa: E402
import rbtext as T           # noqa: E402
import rbvisual as V         # noqa: E402
import timing2 as TT         # noqa: E402
from rbvisual import W, H    # noqa: E402

ART = "art6"
OUT = "render9"
VO = "vo7_converted"
FPS = 30

GOLD = (255, 206, 106)
LIME = (200, 232, 158)
CREAM = (255, 250, 242)
MUTED = (226, 232, 214)
CORAL = (255, 148, 118)
CARD_GAP = 0.14          # seconds of empty space between cards

# ---------------------------------------------------------------------------
# scenes: every card is a list of items plus the VO fraction range it occupies
# ---------------------------------------------------------------------------
SCENES = [
    dict(id="s01", art="f01_hook.png", amb="water", pre=0.60, post=0.95, kind="hook",
         fx=[("boom", 0.05), ("drip", 0.58)],
         cards=[
             dict(f=(0.00, 0.32), cy=0.36, items=[
                 ("chip", ("sans-semi", 30, "ভোরের পুকুর", GOLD)),
                 ("title", ("serif-bold", 92, "জলের বুকে", CREAM))]),
             dict(f=(0.34, 0.66), cy=0.36, items=[
                 ("title", ("serif-bold", 92, "একটি ফুল", GOLD))]),
             dict(f=(0.70, 0.99), cy=0.64, align="left", x=108, plate_alpha=0.72, items=[
                 ("eyebrow", ("sans-semi", 32, "দিনের ছন্দ", LIME)),
                 ("sub", ("sans-semi", 40, "ভোরে ফোটে,", CREAM)),
                 ("sub", ("sans-semi", 40, "দুপুরে বন্ধ হয়ে যায়", GOLD))]),
         ]),
    dict(id="s02", art="f02_flower.png", amb="still", pre=0.55, post=0.80, kind="portrait",
         fx=[("whoosh", 0.05), ("tick", 0.30)],
         cards=[
             dict(f=(0.00, 0.34), cy=0.33, align="left", x=104, items=[
                 ("eyebrow", ("sans-semi", 32, "পরিচয়", LIME)),
                 ("title", ("serif-bold", 88, "শাপলা", CREAM)),
                 ("sub", ("sans-semi", 34, "Water Lily", GOLD))]),
             dict(f=(0.40, 0.72), cy=0.70, items=[
                 ("attr", ("sans-semi", 34, "বৈজ্ঞানিক নাম", MUTED)),
                 ("sub", ("serif", 48, "Nymphaea nouchali", CREAM))]),
             dict(f=(0.78, 0.99), cy=0.50, items=[
                 ("sub", ("serif-bold", 50, "অন্য নাম — সাদা শাপলা", GOLD))]),
         ]),
    dict(id="s03", art="f03_leaf.png", amb="water", pre=0.55, post=0.80, kind="size",
         fx=[("whoosh_down", 0.06), ("drip", 0.42)],
         cards=[
             dict(f=(0.02, 0.36), cy=0.32, align="left", x=108, items=[
                 ("eyebrow", ("sans-semi", 32, "পাতা", GOLD)),
                 ("title", ("serif-bold", 92, "২০–৩০ সেমি", CREAM)),
                 ("sub", ("sans-semi", 36, "চওড়া, গোলাকার", MUTED))]),
             dict(f=(0.40, 0.68), cy=0.70, items=[
                 ("chip", ("sans-semi", 30, "দুই পিঠ দুই রকম", LIME)),
                 ("sub", ("sans-semi", 40, "ওপরে চকচকে সবুজ", CREAM)),
                 ("sub", ("sans-semi", 40, "নিচে বেগুনি-লালচে", GOLD))]),
             dict(f=(0.74, 0.99), cy=0.30, items=[
                 ("title", ("serif-bold", 62, "জলে ভাসে, ভেজে না", CREAM))]),
         ]),
    dict(id="s04", art="f06_close.png", amb="still", pre=0.55, post=0.80, kind="detail",
         fx=[("tick", 0.08), ("chime", 0.55)],
         cards=[
             dict(f=(0.00, 0.34), cy=0.32, align="left", x=108, items=[
                 ("eyebrow", ("sans-semi", 32, "ফুলের গঠন", LIME)),
                 ("title", ("serif-bold", 84, "৪টি বৃতি", CREAM)),
                 ("sub", ("sans-semi", 36, "ভেতরে ১২–৩০ পাপড়ি", GOLD))]),
             dict(f=(0.38, 0.70), cy=0.72, align="left", x=108, plate_alpha=0.70, items=[
                 ("sub", ("sans-semi", 40, "সর্পিলভাবে সাজানো", CREAM)),
                 ("sub", ("sans-semi", 40, "মাঝে সোনালি পরাগকেশর", GOLD))]),
             dict(f=(0.76, 0.99), cy=0.30, items=[
                 ("title", ("serif-bold", 60, "একটি একটি করে খোলে", CREAM))]),
         ]),
    dict(id="s05", art="f05_colour.png", amb="wind", pre=0.55, post=0.85, kind="nation",
         fx=[("boom", 0.06), ("chime", 0.50)],
         cards=[
             dict(f=(0.00, 0.32), cy=0.30, align="left", x=108, items=[
                 ("eyebrow", ("sans-semi", 32, "রঙের বৈচিত্র্য", GOLD)),
                 ("title", ("serif-bold", 78, "সাদা · গোলাপি", CREAM)),
                 ("title", ("serif-bold", 78, "লাল · নীলচে", GOLD))]),
             dict(f=(0.38, 0.66), cy=0.72, items=[
                 ("sub", ("sans-semi", 40, "রঙ যাই হোক", MUTED))]),
             dict(f=(0.70, 0.99), cy=0.70, items=[
                 ("chip", ("sans-semi", 30, "জাতীয় ফুল", GOLD)),
                 ("title", ("serif-bold", 64, "বাংলাদেশের", CREAM))]),
         ]),
    dict(id="s06", art="f04_dawn.png", amb="wind", pre=0.55, post=0.80, kind="grow",
         fx=[("whoosh", 0.08), ("drip", 0.45)],
         cards=[
             dict(f=(0.00, 0.38), cy=0.32, align="left", x=108, items=[
                 ("eyebrow", ("sans-semi", 32, "বেড়ে ওঠা", LIME)),
                 ("title", ("serif-bold", 82, "অগভীর জলে", CREAM)),
                 ("sub", ("sans-semi", 36, "ধারা-ধারি", GOLD))]),
             dict(f=(0.42, 0.72), cy=0.70, align="left", x=108, plate_alpha=0.70, items=[
                 ("sub", ("sans-semi", 40, "জল নামলে কাদায় পড়েও", CREAM)),
                 ("sub", ("sans-semi", 40, "কিছু দিন টিকে থাকে", GOLD))]),
             dict(f=(0.78, 0.99), cy=0.30, items=[
                 ("title", ("serif-bold", 58, "শিকড় কাদায়, মুখ জলে", CREAM))]),
         ]),
    dict(id="s07", art="f07_haor.png", amb="water", pre=0.55, post=0.80, kind="haor",
         fx=[("whoosh", 0.06), ("wing", 0.60)],
         cards=[
             dict(f=(0.00, 0.34), cy=0.30, align="left", x=108, items=[
                 ("eyebrow", ("sans-semi", 32, "বাংলাদেশে বিস্তৃতি", GOLD)),
                 ("title", ("serif-bold", 74, "হাওর · বিল · পুকুর", CREAM))]),
             dict(f=(0.38, 0.70), cy=0.70, align="left", x=108, plate_alpha=0.72, items=[
                 ("sub", ("sans-semi", 38, "সিলেট-সুনামগঞ্জের হাওর,", CREAM)),
                 ("sub", ("sans-semi", 38, "চলনবিল, নেত্রকোণার বিল —", CREAM))]),
             dict(f=(0.76, 0.99), cy=0.34, items=[
                 ("title", ("serif-bold", 64, "সারা দেশে", GOLD))]),
         ]),
    dict(id="s08", art="f08_bee.png", amb="still", pre=0.55, post=0.80, kind="pollinate",
         fx=[("tick", 0.10), ("chime", 0.55)],
         cards=[
             dict(f=(0.00, 0.34), cy=0.30, align="left", x=108, items=[
                 ("eyebrow", ("sans-semi", 32, "প্রজনন", LIME)),
                 ("title", ("serif-bold", 80, "১–২ দিন", CREAM)),
                 ("sub", ("sans-semi", 36, "ততক্ষণই খোলা থাকে ফুল", MUTED))]),
             dict(f=(0.38, 0.68), cy=0.70, items=[
                 ("chip", ("sans-semi", 30, "পরাগায়ন", GOLD)),
                 ("sub", ("sans-semi", 40, "গুবরে পোকা ও মৌমাছি", CREAM)),
                 ("sub", ("sans-semi", 40, "মধু ও পরাগ খেতে আসে", MUTED))]),
             dict(f=(0.74, 0.99), cy=0.32, align="left", x=108, items=[
                 ("sub", ("serif-bold", 52, "ফল পাকে জলের নিচে", GOLD))]),
         ]),
    dict(id="s09", art="f09_fish.png", amb="water", pre=0.55, post=0.80, kind="role",
         fx=[("drip", 0.10), ("boom", 0.55)],
         cards=[
             dict(f=(0.00, 0.34), cy=0.30, align="left", x=108, items=[
                 ("eyebrow", ("sans-semi", 32, "প্রকৃতিতে ভূমিকা", GOLD)),
                 ("title", ("serif-bold", 86, "ছায়া, ঠান্ডা জল", CREAM))]),
             dict(f=(0.38, 0.70), cy=0.70, align="left", x=108, plate_alpha=0.72, items=[
                 ("sub", ("sans-semi", 38, "পাতা ছায়া দেয়, শৈবাল ঠেকায়", CREAM)),
                 ("sub", ("sans-semi", 38, "জল পরিষ্কার রাখে", CREAM))]),
             dict(f=(0.74, 0.99), cy=0.32, align="left", x=108, items=[
                 ("sub", ("serif-bold", 50, "আশ্রয় পায় মাছ ও ব্যাঙাচি", GOLD))]),
         ]),
    dict(id="s10", art="f10_shaluk.png", amb="wind", pre=0.55, post=0.85, kind="use",
         fx=[("whoosh", 0.08), ("tick", 0.40)],
         cards=[
             dict(f=(0.00, 0.36), cy=0.30, align="left", x=108, items=[
                 ("eyebrow", ("sans-semi", 32, "মানুষের জীবনে", LIME)),
                 ("title", ("serif-bold", 82, "শালুকের ডাঁটা", CREAM)),
                 ("sub", ("sans-semi", 36, "আর বীজ", GOLD))]),
             dict(f=(0.40, 0.72), cy=0.70, align="left", x=108, plate_alpha=0.72, items=[
                 ("sub", ("sans-semi", 40, "গ্রামে সবজি হিসেবে খাওয়া হয়", CREAM)),
                 ("sub", ("sans-semi", 40, "শুকিয়ে সংরক্ষণও করা হয়", MUTED))]),
             dict(f=(0.78, 0.99), cy=0.32, items=[
                 ("title", ("serif-bold", 56, "নকশি কাঁথা ও আলপনায় শাপলা", GOLD))]),
         ]),
    dict(id="s11", art="f12_threat.png", amb="wind", pre=0.55, post=0.80, kind="threats",
         fx=[("tension", 0.06), ("boom", 0.30)],
         cards=[
             dict(f=(0.00, 0.36), cy=0.30, align="left", x=112, plate_alpha=0.80, items=[
                 ("eyebrow", ("sans-semi", 32, "হুমকি", CORAL)),
                 ("title", ("serif-bold", 72, "জলাশয় ভরাট", CREAM)),
                 ("sub", ("sans-semi", 36, "দূষণ · আগাছানাশক", MUTED))]),
             dict(f=(0.44, 0.74), cy=0.68, align="left", x=112, plate_alpha=0.80, items=[
                 ("eyebrow", ("sans-semi", 32, "তবু", LIME)),
                 ("title", ("serif-bold", 54, "IUCN তালিকায়", CREAM)),
                 ("sub", ("serif-bold", 54, "কম ঝুঁকিতে", GOLD))]),
             dict(f=(0.80, 0.99), cy=0.34, align="left", x=112, items=[
                 ("title", ("serif-bold", 58, "পুকুর ভরাট হলে", CREAM)),
                 ("sub", ("serif-bold", 58, "কোথায় ফুটবে?", GOLD))]),
         ]),
    # ---- কবির কথা ----
    dict(id="s12", art="f11_poem.png", amb="still", pre=0.55, post=0.80, kind="poem",
         fx=[("chime", 0.10), ("tick", 0.45)],
         cards=[
             dict(f=(0.02, 0.30), cy=0.42, plate=False, items=[
                 ("attr", ("sans-semi", 30, "কাজী নজরুল ইসলাম", GOLD)),
                 ("quote", ("serif", 56, "শাপলা শালুকে সাজাইয়া সাজি", CREAM))]),
             dict(f=(0.34, 0.62), cy=0.42, plate=False, items=[
                 ("quote", ("serif", 56, "শরতে শিশিরে নাহিয়া", CREAM))]),
             dict(f=(0.66, 0.99), cy=0.46, plate=False, items=[
                 ("attr", ("sans-semi", 30, "কাজী নজরুল ইসলাম", GOLD)),
                 ("quote", ("serif", 54, "পদ্মকুলের আমি পদ্মিনী-বধূ", CREAM)),
                 ("quote", ("serif-bold", 54, "এনেছি শাপলা-পদ্মের মধু", GOLD))]),
         ]),
    dict(id="s13", art="f07_haor.png", amb="still", pre=0.70, post=6.40, kind="outro",
         fx=[("boom", 0.04), ("chime", 0.30), ("whoosh", 0.62)],
         cards=[
             dict(f=(0.02, 0.40), cy=0.26, plate=False, items=[
                 ("sub", ("serif-bold", 48, "পুকুরটা বাঁচলে", CREAM)),
                 ("sub", ("serif-bold", 48, "শাপলা বাঁচবে", GOLD))]),
         ]),
]


CAMS = {}


# --------------------------------------------------------------------- camera ---
def scene_frame(s, p, t):
    """One visual per scene; the grade carries the mood and stays warm."""
    cam = CAMS[s["art"]]
    k = s["kind"]
    if k == "hook":
        img = cam.frame(zoom=1.05 + 0.11 * K.eo(p), pan=(0.0, 0.02 - 0.03 * p))
        img = V.film_grade(img, warm=0.46, contrast=1.07, sat=1.05, bloom=0.15,
                           vignette=0.40, grain=0.012, t=t)
        img = V.light_sweep(img, 0.1 + p * 0.4, 0.36, 0.7)
        img = V.scrim(img, 540, 1120, 0.26)
    elif k == "portrait":
        img = cam.frame(zoom=1.16 - 0.12 * K.eio(p), pan=(0.008 - 0.016 * p, 0.006))
        img = V.film_grade(img, warm=0.44, contrast=1.06, sat=1.04, bloom=0.14,
                           vignette=0.38, grain=0.011, t=t)
        img = V.scrim(img, 560, 1160, 0.20)
    elif k == "size":
        img = cam.frame(zoom=1.10 - 0.07 * p, pan=(-0.015 + 0.03 * p, 0.008))
        img = V.film_grade(img, warm=0.50, contrast=1.06, sat=1.06, bloom=0.14,
                           vignette=0.38, grain=0.011, t=t)
        img = V.scrim(img, 520, 1120, 0.22)
    elif k == "detail":
        img = cam.frame(zoom=1.20 - 0.13 * K.eio(p), pan=(0.012 - 0.024 * p, 0.0))
        img = V.film_grade(img, warm=0.52, contrast=1.07, sat=1.05, bloom=0.15,
                           vignette=0.40, grain=0.011, t=t)
        img = V.spotlight(img, W * 0.5, H * 0.5, W * 0.72, 0.16)
        img = V.scrim(img, 520, 1120, 0.22)
    elif k == "nation":
        img = cam.frame(zoom=1.15 - 0.10 * K.eio(p), pan=(0.0, 0.01 - 0.02 * p))
        img = V.film_grade(img, warm=0.54, contrast=1.07, sat=1.08, bloom=0.16,
                           vignette=0.40, grain=0.012, t=t)
        img = V.light_sweep(img, 0.15 + p * 0.5, 0.40, 0.6)
        img = V.scrim(img, 500, 1140, 0.24)
    elif k == "grow":
        img = cam.frame(zoom=1.08 + 0.08 * p, pan=(0.0, 0.03 - 0.05 * p))
        img = V.film_grade(img, warm=0.48, contrast=1.06, sat=1.05, bloom=0.15,
                           vignette=0.38, grain=0.011, t=t)
        img = V.blend_mist(img, p, density=0.09)
        img = V.scrim(img, 520, 1120, 0.22)
    elif k == "haor":
        img = cam.frame(zoom=1.18 - 0.13 * K.eio(p), pan=(-0.02 + 0.04 * p, 0.01))
        img = V.film_grade(img, warm=0.50, contrast=1.06, sat=1.05, bloom=0.16,
                           vignette=0.38, grain=0.011, t=t)
        img = V.light_sweep(img, p * 0.6, 0.34, 0.75)
        img = V.scrim(img, 500, 1140, 0.26)
    elif k == "pollinate":
        img = cam.frame(zoom=1.16 - 0.11 * K.eio(p), pan=(0.0, -0.012))
        img = V.film_grade(img, warm=0.56, contrast=1.06, sat=1.06, bloom=0.16,
                           vignette=0.40, grain=0.011, t=t)
        img = V.spotlight(img, W * 0.5, H * 0.50, W * 0.70, 0.18)
        img = V.scrim(img, 500, 1140, 0.22)
    elif k == "role":
        img = cam.frame(zoom=1.10 + 0.07 * p, pan=(0.015 - 0.03 * p, 0.008))
        img = V.film_grade(img, warm=0.36, cool=0.14, contrast=1.07, sat=1.04,
                           bloom=0.14, vignette=0.40, grain=0.012, t=t)
        img = V.blend_mist(img, p, density=0.08)
        img = V.scrim(img, 520, 1140, 0.24)
    elif k == "use":
        img = cam.frame(zoom=1.14 - 0.09 * K.eio(p), pan=(-0.015 + 0.03 * p, 0.008))
        img = V.film_grade(img, warm=0.54, contrast=1.06, sat=1.06, bloom=0.15,
                           vignette=0.38, grain=0.011, t=t)
        img = V.scrim(img, 500, 1140, 0.24)
    elif k == "poem":
        img = cam.frame(zoom=1.06 + 0.06 * p, pan=(0.0, 0.02 - 0.03 * p))
        img = V.film_grade(img, warm=0.34, cool=0.10, contrast=1.10, sat=1.06,
                           bloom=0.14, vignette=0.42, grain=0.011, t=t)
        img = V.light_sweep(img, 0.10 + p * 0.25, 0.30, 0.45)
    elif k == "threats":
        img = cam.frame(zoom=1.16 - 0.10 * p, pan=(-0.012 + 0.024 * p, 0.006),
                        shake=(0.6 * np.sin(p * 15), 0.45 * np.cos(p * 12)))
        img = V.film_grade(img, cool=0.34, contrast=1.06, sat=1.00, bloom=0.08,
                           vignette=0.50, grain=0.013, t=t)
        img = V.scrim(img, 0, 560, 0.30)
    else:  # outro
        img = cam.frame(zoom=1.10 - 0.04 * K.eio(p), pan=(0.008, -0.015))
        img = V.film_grade(img, warm=0.52, contrast=1.05, sat=1.05, bloom=0.17,
                           vignette=0.42, grain=0.011, t=t)
        img = V.scrim(img, 0, 900, 0.30)
    return V.top_fade(img, 430, 0.42)


# -------------------------------------------------------------------- overlay ---
def overlay(s, p, img):
    t = p * s["dur"]
    v = t - s["pre"]            # time inside the VO
    vo = s["vo"]
    kind = s["kind"]

    # brand first, so no card plate can ever land on top of it
    if kind != "outro":
        be = K.ss(0.45, 1.10, t)
        if be > 0:
            K.brand_lockup(img, (W - 250, 54), be * 0.92, size=50, name_px=24)

    for c in s["cards"]:
        a, b = c["f"]
        e = K.ss(a * vo, a * vo + 0.42, v)
        if e <= 0.004:
            continue
        exit_p = K.ss(b * vo, b * vo + 0.22, v)
        out = 1.0 - exit_p
        if out <= 0.01:
            continue
        K.card(img, c, min(1.0, e + 0.0), out)

    if kind == "outro":
        e0 = K.ss(0.34 * vo, 0.34 * vo + 1.5, v)
        if e0 > 0:
            K.logo_burst(img, (W * 0.5, 560), min(1.0, e0), size=232,
                         payoff="রূপসী বাংলা", sub="প্রকৃতি · জীববৈচিত্র্য · বাংলাদেশ")
        ec = K.ss(0.55 * vo, 0.55 * vo + 0.6, v)
        eu = K.ss(0.70 * vo, 0.70 * vo + 0.6, v)
        if ec > 0:
            K.cta_card(img, (70, 1268), ec,
                       title="বাংলাদেশের প্রাণী ও উদ্ভিদ সম্পর্কে জানতে",
                       url="ruposhibangla.vercel.app", e_url=eu)
    return img


def setup():
    for s in SCENES:
        if s["art"] not in CAMS:
            CAMS[s["art"]] = V.Cam(os.path.join(ART, s["art"]), scale=1.28)


def resolve_cues():
    total = 0.0
    for s in SCENES:
        wav = os.path.join(VO, s["id"] + ".wav")
        if not os.path.exists(wav):
            raise SystemExit("missing VO: " + wav)
        dur, _ = TT.speech_beats(wav)
        s["vo"] = dur
        s["dur"] = s["pre"] + dur + s["post"]
        s["start"] = total
        total += s["dur"]
    return total


def scene_at(t):
    for sc in SCENES:
        if sc["start"] <= t < sc["start"] + sc["dur"]:
            return sc
    return SCENES[-1]


def frame_at(fi):
    t = fi / FPS
    s = scene_at(t)
    p = min(1.0, (t - s["start"]) / s["dur"])
    return overlay(s, p, scene_frame(s, p, t))


def build_audio(total):
    """VO is the backbone; beds sit low; SFX land in the gaps, not over speech."""
    buf = np.zeros(int(total * A.SR) + A.SR, dtype=np.float32)
    for s in SCENES:
        # ambience, gently ducked under the voice later
        A.place(buf, A.BEDS[s["amb"]](s["dur"] + 1.2), s["start"], 0.85)
        for name, frac in s["fx"]:
            A.place(buf, A.FX[name](), s["start"] + s["pre"] + frac * s["vo"], 0.55)
        A.place(buf, A.read_wav(os.path.join(VO, s["id"] + ".wav")),
                s["start"] + s["pre"], 1.0)
    return buf[: int(total * A.SR)]


def duck(amb_buf, vo_buf, depth=0.55, smooth=0.25):
    """Side-chain style ducker driven by the VO envelope."""
    n = min(len(amb_buf), len(vo_buf))
    hop = int(A.SR * 0.02)
    env = np.abs(vo_buf[: (n // hop) * hop]).reshape(-1, hop).max(axis=1)
    env = env / (env.max() + 1e-9)
    env = np.convolve(env, np.ones(int(smooth / 0.02)) / max(1, int(smooth / 0.02)), "same")
    gain = 1.0 - depth * np.clip(env, 0, 1)
    g = np.repeat(gain, hop)
    if len(g) < n:                      # tail shorter than a hop
        g = np.concatenate([g, np.full(n - len(g), g[-1] if len(g) else 1.0)])
    return amb_buf[:n] * g[:n]


def render():
    total = resolve_cues()
    setup()
    os.makedirs(os.path.join(OUT, "frames"), exist_ok=True)
    n_frames = int(round(total * FPS))
    print("total frames", n_frames, "duration", round(total, 2), flush=True)
    for s in SCENES:
        print(f"  {s['id']} dur={s['dur']:.2f} vo={s['vo']:.2f}", flush=True)

    if os.environ.get("RB_AUDIO_ONLY"):
        build_audio(total)
        return

    for fi in range(n_frames):
        frame_at(fi).save(os.path.join(OUT, "frames", f"{fi:05d}.jpg"), quality=93)
        if fi % 150 == 0:
            print("frame", fi, flush=True)
    return


def build_audio(total):
    # audio: separate beds from voice, duck the beds, then sum with SFX
    beds = np.zeros(int(total * A.SR), dtype=np.float32)
    voice = np.zeros(int(total * A.SR), dtype=np.float32)
    sfx = np.zeros(int(total * A.SR), dtype=np.float32)
    for s in SCENES:
        A.place(beds, A.BEDS[s["amb"]](s["dur"] + 1.2), s["start"], 1.0)
        for name, frac in s["fx"]:
            A.place(sfx, A.FX[name](), s["start"] + s["pre"] + frac * s["vo"], 1.0)
        A.place(voice, A.read_wav(os.path.join(VO, s["id"] + ".wav")),
                s["start"] + s["pre"], 1.0)
    beds = duck(beds, voice, depth=0.62)
    mix = beds * 0.30 + sfx * 0.34 + voice * 1.0
    A.write_wav(os.path.join(OUT, "mix_raw.wav"), mix)
    print("audio written", round(len(mix) / A.SR, 2), flush=True)


if __name__ == "__main__":
    render()
