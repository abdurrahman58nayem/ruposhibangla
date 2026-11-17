"""Thumbnails for episode 006 — শাপলা (Water Lily)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); os.chdir(HERE)
from PIL import Image, ImageDraw
import kinetic as K
import rbtext as T
import rbvisual as V
from rbvisual import W, H

GOLD = (255, 206, 106); LIME = (198, 240, 150); CREAM = (255, 250, 238)
OUT = "deliver9"

def base(path, warm=0.40, cool=0.10, sat=1.03):
    im = Image.open(path).convert("RGB")
    s = max(W / im.width, H / im.height)
    im = im.resize((int(im.width * s + 1), int(im.height * s + 1)), Image.LANCZOS)
    x = (im.width - W) // 2; y = (im.height - H) // 2
    im = im.crop((x, y, x + W, y + H))
    im = V.film_grade(im, warm=warm, cool=cool, contrast=1.05, sat=sat,
                      bloom=0.12, vignette=0.34, grain=0.008, t=0)
    return V.scrim(im, 0, 620, 0.34)

def line(img, txt, key, px, y, fill, a=1.0, center=True, x=0):
    lay = T.flow(txt, key, px)
    T.paint(img, lay, (x if not center else W // 2, y), fill, a,
            glow=(8.0, 0.30), shadow=(6, 0.68, (0, 4)), baseline=True,
            anchor="center" if center else "left")

def build(src, name, chip, t1, t2, sub, out):
    img = base(src)
    K.chip(img, chip, (96, 236), 1.0, px=30, colour=LIME, slide=0)
    line(img, t1, "serif-bold", 92, 470, CREAM)
    line(img, t2, "serif-bold", 92, 580, GOLD)
    K.underline(img, W / 2 - 150, 620, 300, 1.0)
    line(img, sub, "sans-semi", 38, 1420, (222, 240, 210))
    K.brand_lockup(img, (W - 250, 54), 1.0, size=50, name_px=24)
    img.save(out, quality=92)
    print("wrote", out)

build("art6/f02_flower.png", "flower", "জাতীয় ফুল", "জলের বুকে", "সাদা শাপলা",
      "Nymphaea nouchali · Water Lily", f"{OUT}/06b-thumbnail-flower.jpg")
build("art6/f07_haor.png", "haor", "হাওরের ভোর", "শাপলা", "ফোটে যেখানে",
      "সিলেট-সুনামগঞ্জের হাওর · চলনবিল", f"{OUT}/06c-thumbnail-haor.jpg")
build("art6/f08_bee.png", "bee", "পরাগায়ন", "মৌমাছি", "আর শাপলা",
      "গুবরে পোকা ও মৌমাছি পরাগায়ন করে", f"{OUT}/06d-thumbnail-bee.jpg")

# 16:9
im = Image.open("art6/f07_haor.png").convert("RGB")
im = im.resize((1280, 720), Image.LANCZOS)
im = V.film_grade(im, warm=0.34, contrast=1.05, sat=1.03, bloom=0.12,
                  vignette=0.0, grain=0.0, t=0)
im = V.scrim(im, 0, 380, 0.30)
K.chip(im, "বাংলাদেশের জাতীয় ফুল", (60, 60), 1.0, px=26, colour=LIME, slide=0)
lay = T.flow("শাপলা", "serif-bold", 110)
T.paint(im, lay, (60, 200), GOLD, 1.0, glow=(9, 0.34), shadow=(6, 0.7, (0, 5)), baseline=True)
lay2 = T.flow("Nymphaea nouchali · Water Lily", "sans-semi", 34)
T.paint(im, lay2, (62, 250), CREAM, 1.0, shadow=(4, 0.6, (0, 3)), baseline=True)
K.brand_lockup(im, (1280 - 250, 40), 1.0, size=46, name_px=22)
im.save(f"{OUT}/06e-thumbnail-16x9.jpg", quality=92)
print("wrote 16x9")
