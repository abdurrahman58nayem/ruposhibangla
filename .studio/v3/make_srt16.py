"""Subtitles straight from the rendered beat windows (one cue per on-screen line)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_grass as B

def tc(x):
    h = int(x // 3600); x -= h * 3600
    m = int(x // 60); x -= m * 60
    s = int(x); ms = int(round((x - s) * 1000))
    if ms == 1000: s, ms = s + 1, 0
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

scenes = B.resolve_cues()
pos, cues = 0.0, []
for s in scenes:
    segs = s.get("segs") or []
    for idx, style, txt, colour, y, align in B.BEATS.get(s["id"], []):
        if idx >= len(segs):
            continue
        a, b = segs[idx]
        t0 = pos + s["pre"] + a
        t1 = pos + s["pre"] + b
        if style == "chip" and cues and cues[-1][0] == round(t0, 2):
            cues[-1] = (round(t0, 2), cues[-1][1], cues[-1][2] + " · " + txt)
            continue
        cues.append((round(t0, 2), round(t1, 2), txt))
    pos += s["dur"]

# merge near-identical duplicate windows (chip rides with the first line)
out, prev = [], None
for t0, t1, txt in cues:
    if prev and abs(prev[0] - t0) < 0.05 and abs(prev[1] - t1) < 0.05:
        prev[2] += " · " + txt
        continue
    if prev:
        out.append(prev)
    prev = [t0, t1, txt]
if prev:
    out.append(prev)

lines = []
for i, (t0, t1, txt) in enumerate(out, 1):
    lines.append(f"{i}\n{tc(t0)} --> {tc(max(t1, t0 + 0.9))}\n{txt}\n")
open("../deliver15/04-subtitles.srt", "w", encoding="utf-8").write("\n".join(lines))
print("cues", len(out), "end", tc(out[-1][1]))
