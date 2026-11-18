"""Cue sheet: when each spoken word lands on the timeline.

Because the editor (and the viewer) must see *exactly* the thing being said, we
measure the voice track itself instead of guessing: energy-based syllable
segmentation gives the onset of every spoken "beat" inside a scene, and each
scene's cues are bound to those beats (or to explicit word fractions when the
sentence is long).
"""
from __future__ import annotations

import json
import wave

import numpy as np

SR = 48000


def read(path):
    with wave.open(path) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float32) / 32767
    return a


def speech_beats(path, min_gap=0.10, rel=0.06):
    """Return (duration, [onset times of syllable-ish energy bursts])."""
    a = read(path)
    dur = len(a) / SR
    # envelope at 10 ms hop, 20 ms window
    hop, win = int(0.01 * SR), int(0.02 * SR)
    n = len(a) // hop
    env = np.array([np.sqrt(np.mean(a[i * hop:i * hop + win] ** 2) + 1e-12) for i in range(n)])
    env = np.convolve(env, np.ones(5) / 5, mode="same")
    thr = max(env.max() * rel, 0.008)
    on = env > thr
    onsets, last = [], -1e9
    for i in range(n):
        if on[i] and not (on[i - 1] if i else False):
            t = i * hop / SR
            if t - last > min_gap:
                onsets.append(round(t, 3))
                last = t
    return dur, onsets


def pick(onsets, fraction, tol=0.10):
    """Nearest measured onset to a target fraction of the speech."""
    dur = onsets[-1] if onsets else 1.0
    return onsets


def cues_from_beats(path, beats_index, starts):
    """beats_index: list of (key, index) or ('frac', f). Returns list of times."""
    dur, onsets = speech_beats(path)
    out = []
    for spec in beats_index:
        if isinstance(spec, tuple) and spec[0] == "frac":
            out.append(round(dur * spec[1], 3))
        else:
            i = int(spec)
            out.append(onsets[i] if i < len(onsets) else dur)
    return dur, out, onsets


if __name__ == "__main__":
    plan = json.load(open("production/cues2.json", encoding="utf-8"))
    for sid, spec in plan.items():
        path = f"vo2_converted/{sid}.wav"
        dur, onsets = speech_beats(path)
        print(sid, "dur", round(dur, 2), "onsets", len(onsets))
        for name, idx in spec["cues"].items():
            print("   ", name, "->", onsets[idx] if isinstance(idx, int) else idx)


def sentences(path, min_gap=0.26, rel=0.05):
    """Return [(start, end)] of every spoken sentence (split on real pauses).

    The reels change their on-screen line at each sentence, so this is what the
    overlay rides on — not a blind fraction of the scene.
    """
    a = read(path)
    sr = SR
    hop = int(0.01 * sr)
    n = len(a) // hop
    env = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2) + 1e-12)
                    for i in range(n)])
    env = np.convolve(env, np.ones(5) / 5, mode="same")
    thr = max(env.max() * rel, 0.005)
    on = env > thr
    segs, start = [], None
    gap = int(min_gap / 0.01)
    quiet = 0
    for i in range(n):
        if on[i]:
            if start is None:
                start = i
            quiet = 0
        elif start is not None:
            quiet += 1
            if quiet >= gap:
                segs.append((start * hop / sr, (i - quiet) * hop / sr))
                start = None
    if start is not None:
        segs.append((start * hop / sr, n * hop / sr))
    return [(round(s, 3), round(e, 3)) for s, e in segs if e - s > 0.18]
