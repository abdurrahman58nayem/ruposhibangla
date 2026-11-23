import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_babui as B
from PIL import Image
from collections import Counter
os.makedirs("/tmp/qa_babui", exist_ok=True)
B.init_cams()
tiles=[]
for s in B.resolve_cues():
    rows=B.layout_beats(s["id"]); cnt=Counter(r[0] for r in rows)
    idx=max(cnt, key=lambda k:(cnt[k],k)); idx=min(idx, len(s["segs"])-1)
    a,b=s["segs"][idx]
    t=s["pre"]+(a+b)/2; p=t/s["dur"]
    img=B.render_frame(s,p,t)
    img.save(f"/tmp/qa_babui/{s['id']}.png")
    tiles.append(img.resize((270,480), Image.LANCZOS))
sheet=Image.new("RGB",(270*5,480*2),(8,8,8))
for i,im in enumerate(tiles): sheet.paste(im,((i%5)*270,(i//5)*480))
sheet.save("/tmp/qa_babui/sheet.jpg", quality=90)
print("ok", len(tiles))
