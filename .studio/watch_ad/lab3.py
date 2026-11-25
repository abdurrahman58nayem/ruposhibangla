import numpy as np
from PIL import Image, ImageDraw, ImageFilter
SRC="/home/user/ruposhibangla/.studio/watch_ad/src/"
CREAM=(248,243,233)

def highkey(im, expo=1.28, white=0.90, sat=0.85):
    a=np.asarray(im,np.float32)/255.0
    a=np.clip(a*expo,0,1)
    # soft shoulder toward pure white
    a=1-(1-a)**1.55
    a=np.clip(a/white,0,1)**0.92
    # desaturate
    g=a.mean(axis=2,keepdims=True)
    a=np.clip(g+(a-g)*sat,0,1)
    a[...,0]=np.clip(a[...,0]*1.01,0,1); a[...,2]=np.clip(a[...,2]*0.99,0,1)
    return Image.fromarray((a*255).astype(np.uint8),"RGB")

def pill(name, box, w, h, r=0.16):
    im=Image.open(SRC+name).convert("RGB"); iw,ih=im.size
    x0,y0,x1,y1=box
    im=im.crop((int(x0*iw),int(y0*ih),int(x1*iw),int(y1*ih)))
    im=highkey(im)
    f=max(w/im.width,h/im.height)
    im=im.resize((max(w,int(im.width*f)),max(h,int(im.height*f))),Image.LANCZOS)
    cx,cy=(im.width-w)//2,(im.height-h)//2
    im=im.crop((cx,cy,cx+w,cy+h))
    m=Image.new("L",(w*3,h*3),0)
    ImageDraw.Draw(m).rounded_rectangle([0,0,w*3-1,h*3-1],radius=int(w*3*r),fill=255)
    m=m.resize((w,h),Image.LANCZOS)
    return im,m

def stage(w,h):
    yy=np.linspace(0,1,h)[:,None]
    a=np.zeros((h,w,3),np.float32)
    for c,(t,b) in enumerate(zip((253,250,244),(236,228,212))):
        a[...,c]=t*(1-yy)+b*yy
    return Image.fromarray(a.astype(np.uint8),"RGB")

W,H=1200,900
bg=stage(W,H)
for name,box,pos in [("IMG20261125185442.jpg",(0.30,0.16,0.68,0.86),(70,80)),
                     ("IMG-20261125-WA0032(1).jpg",(0.10,0.20,0.83,0.85),(500,80)),
                     ("IMG20261125102505.jpg",(0.14,0.15,0.85,0.82),(920,80))]:
    pass
im1,m1=pill("IMG20261125185442.jpg",(0.30,0.15,0.70,0.88),330,740)
im2,m2=pill("IMG-20261125-WA0032(1).jpg",(0.10,0.22,0.85,0.88),330,740)
im3,m3=pill("IMG20261125102505.jpg",(0.13,0.15,0.86,0.85),330,740)
sh=Image.new("L",(W,H),0); d=ImageDraw.Draw(sh)
for x in (60,435,810): d.rounded_rectangle([x+10,95,x+340,845],radius=52,fill=90)
sh=sh.filter(ImageFilter.GaussianBlur(22))
bg.paste(Image.new("RGB",(W,H),(152,133,100)),(0,0),sh)
for im,m,x in ((im1,m1,60),(im2,m2,435),(im3,m3,810)):
    bg.paste(im,(x,80),m)
bg.save("/tmp/lab3.jpg",quality=92)
print("ok")
