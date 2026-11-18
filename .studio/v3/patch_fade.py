"""Re-render only the frames touched by a code change, in place.

The dissolve fix only affects the first/last 0.6 s of each scene, so there is
no reason to burn another hour re-rendering everything. This reads the scene
table, works out which frame numbers each affected window covers, renders just
those, and writes them over the existing JPEGs.
"""
import os
import sys
import multiprocessing as mp

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(HERE)

import build_agni as B


def _job(args):
    sid, start, n, p0, p1 = args
    B.init_cams()
    s = [x for x in B.resolve_cues() if x["id"] == sid][0]
    frames = os.path.join(B.OUT, "frames")
    k0 = int(p0 * n)
    k1 = int(p1 * n) + 2
    done = []
    for k in range(max(0, k0), min(n, k1)):
        p = k / max(1, n - 1)
        img = B.render_frame(s, p, (start + k) / B.FPS)
        path = os.path.join(frames, f"{start + k:05d}.jpg")
        img.save(path, quality=94)
        done.append(start + k)
    return sid, done


def main():
    scenes = B.resolve_cues()
    B.init_cams()
    starts, idx = {}, 0
    for s in scenes:
        starts[s["id"]] = idx
        idx += int(round(s["dur"] * B.FPS))
    jobs = []
    for s in scenes:
        n = int(round(s["dur"] * B.FPS))
        st = starts[s["id"]]
        jobs.append((s["id"], st, n, 0.0, 0.05))
        jobs.append((s["id"], st, n, 0.95, 1.0))
    with mp.get_context("fork").Pool(2) as pool:
        for sid, done in pool.imap_unordered(_job, jobs):
            print(" fixed", sid, len(done), "frames", flush=True)
    print("done")


if __name__ == "__main__":
    main()
