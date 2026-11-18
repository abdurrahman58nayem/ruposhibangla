"""Procedural cinematic sound design (royalty-free, generated from scratch).

Everything here is synthesised or shaped from noise/oscillators, so the reel needs
no licensed music or SFX. Output: 48 kHz mono WAV per scene + a global music bed.
"""
from __future__ import annotations

import numpy as np
import wave

SR = 48000
RNG = np.random.default_rng(20261116)


# ------------------------------------------------------------------ helpers ---
def t(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR), dtype=np.float32) / SR


def noise(n: int) -> np.ndarray:
    return RNG.standard_normal(n).astype(np.float32)


def lowpass(x, cutoff, order=2):
    """Simple one-pole cascade low-pass."""
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = x.copy()
    for _ in range(order):
        out = np.empty_like(y)
        acc = 0.0
        # vectorised IIR via lfilter-less trick: use scipy-free loop in coarse blocks
        out[0] = (1 - a) * y[0]
        for i in range(1, len(y)):
            out[i] = (1 - a) * y[i] + a * out[i - 1]
        y = out
    return y


def lowpass_fast(x, cutoff, order=2):
    """FFT-domain low-pass (fast, good enough for ambience)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    H = 1.0 / (1.0 + (f / cutoff) ** (2 * order))
    return np.fft.irfft(X * H, n=len(x)).astype(np.float32)


def highpass_fast(x, cutoff, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    H = 1.0 - 1.0 / (1.0 + (f / cutoff) ** (2 * order))
    return np.fft.irfft(X * H, n=len(x)).astype(np.float32)


def env_adsr(n, a=0.05, d=0.1, s=0.7, r=0.3):
    e = np.ones(n, dtype=np.float32) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na, nd, nr = min(na, n), min(nd, max(0, n - na)), min(nr, n)
    if na:
        e[:na] = np.linspace(0, 1, na) ** 0.7
    if nd:
        e[na:na + nd] = np.linspace(1, s, nd)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e


def fade(x, fin=0.05, fout=0.3):
    n = len(x)
    ni, no = int(fin * SR), int(fout * SR)
    if ni:
        x[:ni] *= np.linspace(0, 1, ni)
    if no:
        x[-no:] *= np.linspace(1, 0, no) ** 1.3
    return x


def norm(x, peak=0.9):
    m = float(np.max(np.abs(x))) or 1.0
    return (x / m * peak).astype(np.float32)


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    pcm = (x * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ------------------------------------------------------------------ ambience --
def wind(dur, cutoff=600, gust=0.35):
    n = int(dur * SR)
    base = lowpass_fast(noise(n), cutoff, 2)
    lfo = 1 + gust * np.sin(2 * np.pi * 0.07 * t(dur) + 1.2) * np.sin(2 * np.pi * 0.013 * t(dur))
    return norm(base * lfo, 0.5)


def water(dur, cutoff=1200):
    n = int(dur * SR)
    b = highpass_fast(lowpass_fast(noise(n), cutoff, 2), 180, 1)
    # slow bubbling modulation
    mod = 0.75 + 0.25 * np.sin(2 * np.pi * 0.23 * t(dur)) * np.sin(2 * np.pi * 0.05 * t(dur) + 2)
    return norm(b * mod, 0.45)


def forest(dur):
    n = int(dur * SR)
    base = lowpass_fast(noise(n), 2200, 2) * 0.35
    # insects: band-limited noise pulsing
    ins = highpass_fast(lowpass_fast(noise(n), 6500, 2), 4200, 2)
    pulse = (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 11 * t(dur)))) ** 2
    return norm(base + ins * pulse * 0.22, 0.45)


def creek_drips(dur, count=14):
    n = int(dur * SR)
    out = np.zeros(n, dtype=np.float32)
    for _ in range(count):
        at = RNG.uniform(0, dur - 0.3)
        f0 = RNG.uniform(700, 2200)
        d = RNG.uniform(0.05, 0.16)
        tt = t(d)
        chirp = np.sin(2 * np.pi * (f0 * tt - 900 * tt ** 2)) * np.exp(-tt * 24)
        i = int(at * SR)
        out[i:i + len(chirp)] += chirp[: max(0, min(len(chirp), n - i))] * RNG.uniform(0.15, 0.5)
    return out


def birdsong(dur, count=8, base=2400, spread=1400):
    n = int(dur * SR)
    out = np.zeros(n, dtype=np.float32)
    for _ in range(count):
        at = RNG.uniform(0.3, max(0.4, dur - 0.5))
        d = RNG.uniform(0.12, 0.3)
        tt = t(d)
        f = base + RNG.uniform(-spread, spread) * 0.3
        vib = 1 + 0.08 * np.sin(2 * np.pi * RNG.uniform(18, 34) * tt)
        chirp = np.sin(2 * np.pi * f * tt * vib)
        chirp *= np.exp(-((tt - d * 0.4) ** 2) / (2 * (d * 0.28) ** 2))
        i = int(at * SR)
        seg = chirp[: max(0, min(len(chirp), n - i))]
        out[i:i + len(seg)] += seg * RNG.uniform(0.1, 0.32)
    return out


# --------------------------------------------------------------------- music -
def pad_chord(freqs, dur, detune=0.15, attack=1.2, release=1.4):
    n = int(dur * SR)
    tt = t(dur)
    sig = np.zeros(n, dtype=np.float32)
    for f in freqs:
        for k in (-detune, 0.0, detune):
            sig += np.sin(2 * np.pi * (f + k) * tt + RNG.uniform(0, 6.28)) / 3
        sig += 0.18 * np.sin(2 * np.pi * 2 * f * tt)
    e = np.ones(n, dtype=np.float32)
    na, nr = min(int(attack * SR), n), min(int(release * SR), n)
    if na:
        e[:na] = np.linspace(0, 1, na) ** 1.3
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 1.4
    return norm(sig * e, 0.7)


def sub_boom(dur=1.4, f0=52, f1=30):
    tt = t(dur)
    f = np.linspace(f0, f1, len(tt))
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
    click = noise(len(tt)) * np.exp(-tt * 60) * 0.3
    return norm(sig + click, 0.85)


def whoosh(dur=0.9, direction="up"):
    n = int(dur * SR)
    tt = t(dur)
    nz = noise(n)
    if direction == "up":
        sweep = highpass_fast(nz, 300, 1)
        mod = np.linspace(0.15, 1, n)
    else:
        sweep = lowpass_fast(nz, 900, 1)
        mod = np.linspace(1, 0.1, n)
    body = sweep * mod
    return fade(norm(body, 0.55), 0.15, 0.25)


def roar(dur=2.6):
    """Stylised big-cat roar: growl formants + gravel noise (not a real recording)."""
    n = int(dur * SR)
    tt = t(dur)
    base = 78 + 12 * np.sin(2 * np.pi * 3.1 * tt) - 18 * (tt / dur)
    phase = 2 * np.pi * np.cumsum(base) / SR
    sig = np.sin(phase) + 0.6 * np.sin(2 * phase) + 0.35 * np.sin(3 * phase)
    sig += 0.5 * lowpass_fast(noise(n), 900, 2)
    # formant sweep gives the "growl" texture
    form = 1 + 0.35 * np.sin(2 * np.pi * 26 * tt)
    sig = sig * form
    e = np.minimum(1, tt / 0.35) * np.exp(-np.maximum(0, tt - dur * 0.45) * 2.2)
    return norm(sig * e, 0.9)


def heartbeat(dur=2.0, bpm=64):
    n = int(dur * SR)
    out = np.zeros(n, dtype=np.float32)
    beat = 60 / bpm
    k = 0
    while k * beat < dur:
        for off, amp in ((0.0, 1.0), (0.28, 0.62)):
            at = k * beat + off
            if at >= dur:
                continue
            d = 0.22
            tt = t(d)
            thump = np.sin(2 * np.pi * 44 * tt) * np.exp(-tt * 22) * amp
            i = int(at * SR)
            seg = thump[: max(0, min(len(thump), n - i))]
            out[i:i + len(seg)] += seg
        k += 1
    return norm(out, 0.7)


def tension_bed(dur, root=55):
    """Low pulsing bed for the threat sequence."""
    n = int(dur * SR)
    tt = t(dur)
    drone = np.sin(2 * np.pi * root * tt) + 0.5 * np.sin(2 * np.pi * root * 1.5 * tt)
    pulse = 0.6 + 0.4 * (0.5 + 0.5 * np.sin(2 * np.pi * 1.15 * tt))
    shimmer = 0.12 * np.sin(2 * np.pi * root * 8 * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * tt))
    return fade(norm((drone + shimmer) * pulse, 0.55), 0.6, 1.2)


def place(bed, sound, at, gain=1.0):
    i = int(at * SR)
    seg = sound[: max(0, min(len(sound), len(bed) - i))]
    bed[i:i + len(seg)] += seg * gain
    return bed


def reverb(x, decay=0.35, mix=0.25):
    ir_n = int(1.8 * SR)
    tt = np.arange(ir_n) / SR
    ir = noise(ir_n) * np.exp(-tt / decay)
    ir = lowpass_fast(ir, 3200, 1)
    ir /= np.abs(ir).sum() ** 0.5
    wet = np.convolve(x, ir)[: len(x)].astype(np.float32)
    return norm(x * (1 - mix) + wet * mix * 2.2, 0.85)
