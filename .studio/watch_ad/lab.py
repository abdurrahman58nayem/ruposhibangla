import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = "/home/user/ruposhibangla/.studio/watch_ad/src/"

def crop(name, box):
    im = Image.open(SRC + name).convert("RGB")
    w, h = im.size
    x0, y0, x1, y1 = box
    return im.crop((int(x0*w), int(y0*h), int(x1*w), int(y1*h)))

def brighten(im, gain=1.10, lift=0.03, warm=1.0):
    a = np.asarray(im, np.float32)/255.0
    a = np.clip(a*gain + lift, 0, 1)
    a[...,2] *= (1/1.0)  # warm handled below
    return a

def spotlight(im, out_w, out_h, feather=0.26, y_bias=0.0, cream=(246,241,231)):
    """Scale im to cover out box, then feather edges into cream."""
    iw, ih = im.size
    f = max(out_w/iw, out_h/ih)
    im = im.resize((int(iw*f), int(ih*f)), Image.LANCZOS)
    cx, cy = (im.width-out_w)//2, int((im.height-out_h)//2 + y_bias*out_h)
    im = im.crop((cx, cy, cx+out_w, cy+out_h))
    # bright, slightly warm grade
    a = np.asarray(im, np.float32)/255.0
    a = np.clip((a-0.5)*1.06 + 0.56, 0, 1)
    a[...,0] *= 1.015; a[...,2] *= 0.985
    a = np.clip(a, 0, 1)
    im = Image.fromarray((a*255).astype(np.uint8), "RGB")
    # feathered ellipse mask
    yy, xx = np.mgrid[0:out_h, 0:out_w].astype(np.float32)
    nx = (xx/out_w - 0.5)/0.5
    ny = (yy/out_h - 0.5)/0.5
    r = np.sqrt(nx**2 + ny**2)
    m = np.clip((1.0 - r)/(feather), 0, 1)**1.4
    m = (m*255).astype(np.uint8)
    mask = Image.fromarray(m, "L").filter(ImageFilter.GaussianBlur(out_w*0.012))
    base = Image.new("RGB", (out_w, out_h), cream)
    base.paste(im, (0,0), mask)
    return base

CREAM = (247, 242, 232)

def stage(w, h):
    a = np.zeros((h, w, 3), np.float32)
    yy = np.linspace(0, 1, h)[:, None]
    for c, (t, b) in enumerate(zip((252,249,242), (238,231,216))):
        a[..., c] = t*(1-yy) + b*yy
    return Image.fromarray(a.astype(np.uint8), "RGB")

if __name__ == "__main__":
    W, H = 900, 1200
    bg = stage(W, H)
    # OLEVS A
    a = crop("IMG20261125102340.jpg", (0.13, 0.20, 0.82, 0.68))
    pa = spotlight(a, 760, 760, feather=0.30)
    bg.paste(pa, (70, 150))
    bg.save("/tmp/lab_a.jpg", quality=92)
    # rubber
    b = crop("IMG20261125102505.jpg", (0.14, 0.18, 0.86, 0.72))
    bg2 = stage(W, H)
    pb = spotlight(b, 760, 760, feather=0.30)
    bg2.paste(pb, (70, 150))
    bg2.save("/tmp/lab_b.jpg", quality=92)
    # nickies
    c = crop("IMG20261125185442.jpg", (0.08, 0.16, 0.92, 0.72))
    bg3 = stage(W, H)
    pc = spotlight(c, 760, 760, feather=0.30)
    bg3.paste(pc, (70, 150))
    bg3.save("/tmp/lab_c.jpg", quality=92)
    print("ok")
