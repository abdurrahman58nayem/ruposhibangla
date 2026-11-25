import numpy as np
from PIL import Image, ImageDraw, ImageFilter
SRC="/home/user/ruposhibangla/.studio/watch_ad/src/"
CREAM=(248,243,233)

def grade(im, contrast=1.04, lift=0.035, warm=1.0):
    a=np.asarray(im,np.float32)/255.0
    a=np.clip((a-0.5)*contrast+0.5+lift,0,1)
    a[...,0]=np.clip(a[...,0]*1.012,0,1); a[...,2]=np.clip(a[...,2]*0.988,0,1)
    return Image.fromarray((a*255).astype(np.uint8),"RGB")

def circle(name, box, size, ring=True):
    im=Image.open(SRC+name).convert("RGB"); w,h=im.size
    x0,y0,x1,y1=box
    im=im.crop((int(x0*w),int(y0*h),int(x1*w),int(y1*h)))
    im=im.resize((size,size),Image.LANCZOS); im=grade(im)
    m=Image.new("L",(size*4,size*4),0)
    ImageDraw.Draw(m).ellipse([0,0,size*4-1,size*4-1],fill=255)
    m=m.resize((size,size),Image.LANCZOS)
    sh=Image.new("L",(size,size),0)
    d=ImageDraw.Draw(sh); d.ellipse([0,0,size-1,size-1],fill=255)
    return im,m

def stage(w,h):
    yy=np.linspace(0,1,h)[:,None]
    a=np.zeros((h,w,3),np.float32)
    for c,(t,b) in enumerate(zip((252,249,243),(237,229,213))):
        a[...,c]=t*(1-yy)+b*yy
    return Image.fromarray(a.astype(np.uint8),"RGB")

W,H=900,1200
bg=stage(W,H)
size=520
im,m=circle("IMG20261125102340.jpg",(0.245,0.235,0.705,0.545),size)
# soft shadow
sh=Image.new("L",(W,H),0); ImageDraw.Draw(sh).ellipse([190,300,190+size,300+size],fill=110)
sh=sh.filter(ImageFilter.GaussianBlur(18))
bg.paste(Image.new("RGB",(W,H),(150,132,102)),(0,0),sh)
bg.paste(im,(190,300),m)
# ring
ring=Image.new("RGBA",(size+16,size+16),(0,0,0,0))
ImageDraw.Draw(ring).ellipse([2,2,size+13,size+13],outline=(190,158,96,220),width=4)
bg.paste(ring,(182,292),ring)
bg.save("/tmp/lab2.jpg",quality=92)
print("ok")
