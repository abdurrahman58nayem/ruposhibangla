"""VO measurement + cue derivation."""
import wave

import numpy as np

BN_DIGITS = "০১২৩৪৫৬৭৮৯"


def wav_dur(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


def speech_beats(path, min_gap=0.16, thresh=0.10):
    """Return (duration, [word-ish onset times]) from the energy envelope."""
    with wave.open(path) as w:
        n = w.getnframes()
        sr = w.getframerate()
        raw = w.readframes(n)
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    dur = n / sr
    hop = int(sr * 0.01)
    frames = len(x) // hop
    if frames == 0:
        return dur, []
    env = np.abs(x[: frames * hop]).reshape(frames, hop).mean(axis=1)
    env = env / (env.max() + 1e-9)
    on = env > thresh
    beats = []
    for i in range(1, len(on)):
        if on[i] and not on[i - 1]:
            at = i * 0.01
            if not beats or at - beats[-1] >= min_gap:
                beats.append(round(at, 3))
    return dur, beats


def bn(n):
    s = str(int(n))
    return "".join(BN_DIGITS[int(c)] if c.isdigit() else c for c in s)
