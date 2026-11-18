import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_shapla3 as B
from PIL import Image
os.makedirs("/tmp/qa3", exist_ok=True)
B.init_cams()
tiles=[]
for s in B.resolve_cues():
    segs=s["segs"]
    rows=B.layout_beats(s["id"])
    # pick the beat index with the most lines
    from collections import Counter
    cnt=Counter(r[0] for r in rows)
    idx=max(cnt, key=lambda k: (cnt[k], k))
    if idx >= len(segs): idx = len(segs)-1
    a,b=segs[idx]
    t = s["pre"] + (a+b)/2
    p = t/s["dur"]
    img=B.render_frame(s, p, t)
    img.save(f"/tmp/qa3/{s['id']}.png")
    tiles.append(img.resize((270,480), Image.LANCZOS))
sheet=Image.new("RGB",(270*6,480*2),(8,8,8))
for i,im in enumerate(tiles):
    sheet.paste(im,((i%6)*270,(i//6)*480))
sheet.save("/tmp/qa3/sheet.jpg", quality=88)
print("ok", len(tiles))
