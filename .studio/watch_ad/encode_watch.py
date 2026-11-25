"""Encode step for the watch ad.

    python encode_watch.py master   # build/master-4k.mp4   (2160x3840)
    python encode_watch.py hd       # build/master-1080.mp4  (1080x1920)
    python encode_watch.py cut      # build/cut-15s.mp4
    python encode_watch.py all
"""
import os, sys, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(HERE, "build")
FF = "/home/user/venv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v9.0.2"
FPS = 30
# scene starts (must match build_watch.SCENES)
STARTS = {"A": 0.00, "B": 6.35, "C": 13.50, "D": 19.62, "E": 22.97,
          "F": 28.21, "G": 32.16}
TOTAL = 38.58


def run(args):
    print(" ".join(args[-6:]), flush=True)
    subprocess.run(args, check=True)


def master():
    """4K, encoded scene by scene: a single 1156-frame 2160x3840 pass runs the
    box out of memory, and each scene is a clean cut anyway."""
    import json
    segs = [("A", 6.35), ("B", 7.15), ("C", 6.12), ("D", 3.35), ("E", 5.24),
            ("F", 3.95), ("G", 6.42)]
    tmp, start = [], 0
    for name, dur in segs:
        n = int(round(dur * FPS))
        f = os.path.join(B, f"_s4k_{name}.mp4")
        s0 = STARTS[name]
        run([FF, "-y", "-v", "error", "-framerate", str(FPS),
             "-start_number", str(start), "-t", f"{dur + 0.04:.3f}",
             "-i", os.path.join(B, "frames", "%05d.jpg"),
             "-ss", f"{s0:.3f}", "-t", f"{dur + 0.04:.3f}",
             "-i", os.path.join(B, "mix.wav"),
             "-vf", "scale=in_range=full:out_range=limited",
             "-c:v", "libx264", "-preset", "medium", "-crf", "18",
             "-threads", "2", "-pix_fmt", "yuv420p", "-profile:v", "high",
             "-level", "5.1", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
             f])
        tmp.append(f)
        start += n
    lst = os.path.join(B, "_c4k.txt")
    with open(lst, "w") as fh:
        for f in tmp:
            fh.write(f"file '{f}'\n")
    run([FF, "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst,
         "-c", "copy", "-movflags", "+faststart",
         os.path.join(B, "master-4k.mp4")])
    for f in tmp:
        os.remove(f)
    os.remove(lst)


def hd():
    run([FF, "-y", "-v", "error", "-i", os.path.join(B, "master-4k.mp4"),
         "-vf", "scale=1080:1920:flags=lanczos",
         "-c:v", "libx264", "-preset", "medium", "-crf", "19",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
         os.path.join(B, "master-1080.mp4")])


def cut():
    """14.8 s cut: hook -> OLEVS -> close, cut on scene boundaries."""
    segs = [(STARTS["A"], 4.20), (STARTS["B"], 4.25), (STARTS["G"], 6.42)]
    tmp = []
    for i, (s, d) in enumerate(segs):
        f = os.path.join(B, f"_seg{i}.mp4")
        run([FF, "-y", "-v", "error", "-ss", f"{s:.2f}", "-t", f"{d:.2f}",
             "-i", os.path.join(B, "master-1080.mp4"),
             "-af", f"afade=t=in:st=0:d=0.12,afade=t=out:st={d-0.25:.2f}:d=0.25",
             "-c:v", "libx264", "-preset", "medium", "-crf", "19",
             "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
             f])
        tmp.append(f)
    lst = os.path.join(B, "_concat.txt")
    with open(lst, "w") as fh:
        for f in tmp:
            fh.write(f"file '{f}'\n")
    run([FF, "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst,
         "-c", "copy", "-movflags", "+faststart",
         os.path.join(B, "cut-15s.mp4")])
    for f in tmp:
        os.remove(f)
    os.remove(lst)


def thumb():
    """Thumbnail from the close frame (price + trio)."""
    f = os.path.join(B, "_thumb.png")
    run([FF, "-y", "-v", "error", "-ss", f"{STARTS['G'] + 5.6:.2f}",
         "-i", os.path.join(B, "master-4k.mp4"), "-frames:v", "1", f])
    from PIL import Image
    im = Image.open(f).convert("RGB")
    im.resize((1080, 1920), Image.LANCZOS).save(os.path.join(B, "thumb-1080.jpg"),
                                                quality=94)
    im.crop((0, int(im.height * 0.11), im.width, int(im.height * 0.11) + im.width)) \
        .resize((1080, 1080), Image.LANCZOS).save(os.path.join(B, "thumb-square.jpg"),
                                                  quality=94)
    os.remove(f)


if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    if what in ("master", "all"):
        master()
    if what in ("hd", "all"):
        hd()
    if what in ("cut", "all"):
        cut()
    if what in ("thumb", "all"):
        thumb()
    print("done", what, flush=True)
