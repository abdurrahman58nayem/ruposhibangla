"""Assemble build_shapla2.py from the accepted বাবুই renderer.

Same engine, same colours, same card choreography — only the scene table and
the per-kind camera grade are শাপলা's.
"""
import io
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, "ref_v4", "build_babui.py"), encoding="utf-8").read()

# ---------------------------------------------------------------- header ----
src = src.replace('"""Episode 005 — বাবুই (Baya Weaver). 1080x1920 9:16 reel.',
                  '"""Episode 006 — শাপলা (Nymphaea nouchali, Water Lily). 1080x1920 9:16 reel.')
src = src.replace('ART = "art5"\nOUT = "render6"\nVO = "vo5_converted"',
                  'ART = "art6"\nOUT = "render9"\nVO = "vo7_converted"')
assert 'ART = "art6"' in src

# ----------------------------------------------------------------- scenes ---
SCENES = '''
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
             dict(f=(0.02, 0.30), cy=0.46, plate=False, items=[
                 ("attr", ("sans-semi", 30, "কাজী নজরুল ইসলাম", GOLD)),
                 ("quote", ("serif", 56, "শাপলা শালুকে সাজাইয়া সাজি", CREAM))]),
             dict(f=(0.34, 0.62), cy=0.46, plate=False, items=[
                 ("quote", ("serif", 56, "শরতে শিশিরে নাহিয়া", CREAM))]),
             dict(f=(0.66, 0.99), cy=0.52, plate=False, items=[
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
'''

start = src.index("SCENES = [")
end = src.index("CAMS = {}")
src = src[:start] + SCENES.lstrip("\n") + "\n\n" + src[end:]
assert "f12_threat.png" in src and "m14" not in src

# ------------------------------------------------------------- scene_frame --
GRADE = '''def scene_frame(s, p, t):
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
        img = V.film_grade(img, warm=0.34, cool=0.16, contrast=1.04, sat=0.99,
                           bloom=0.16, vignette=0.38, grain=0.011, t=t)
        img = V.blend_mist(img, p, density=0.10)
        img = V.scrim(img, 470, 1340, 0.34, feather=360)
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


'''

fs = src.index("def scene_frame(s, p, t):")
fe = src.index("# -------------------------------------------------------------------- overlay ---")
src = src[:fs] + GRADE + src[fe:]
assert src.count("def scene_frame") == 1

# outro placement tweak for the 9:16 CTA under the logo burst
src = src.replace('K.logo_burst(img, (W * 0.5, 520), min(1.0, e0), size=228,',
                  'K.logo_burst(img, (W * 0.5, 560), min(1.0, e0), size=232,')
src = src.replace('K.cta_card(img, (70, 1330), ec,', 'K.cta_card(img, (70, 1268), ec,')

# --------------------------------------------------- split audio from render --
src = src.replace('''    for fi in range(n_frames):
        frame_at(fi).save(os.path.join(OUT, "frames", f"{fi:05d}.jpg"), quality=93)
        if fi % 150 == 0:
            print("frame", fi, flush=True)

    # audio: separate beds from voice, duck the beds, then sum with SFX''',
'''    if os.environ.get("RB_AUDIO_ONLY"):
        build_audio(total)
        return

    for fi in range(n_frames):
        frame_at(fi).save(os.path.join(OUT, "frames", f"{fi:05d}.jpg"), quality=93)
        if fi % 150 == 0:
            print("frame", fi, flush=True)
    return


def build_audio(total):
    # audio: separate beds from voice, duck the beds, then sum with SFX''')
assert "def build_audio(total)" in src

open(os.path.join(HERE, "build_shapla2.py"), "w", encoding="utf-8").write(src)
print("written", len(src))
