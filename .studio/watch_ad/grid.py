import sys
from PIL import Image, ImageDraw
SRC="/home/user/ruposhibangla/.studio/watch_ad/src/"
name, out = sys.argv[1], sys.argv[2]
im=Image.open(SRC+name).convert("RGB"); im.thumbnail((680,900))
d=ImageDraw.Draw(im); w,h=im.size
for i in range(1,20):
    x=w*i/20; y=h*i/20
    d.line([x,0,x,h],fill=(0,255,0),width=1)
    d.line([0,y,w,y],fill=(0,255,0),width=1)
    if i%2==0:
        d.text((x+2,4),f"{i/20:.2f}",fill=(255,0,255))
        d.text((3,y+1),f"{i/20:.2f}",fill=(255,0,255))
im.save(out,quality=90)
