"""Sound design: layered realistic beds + physical one-shots."""
import numpy as np

SR = 48000
RNG = np.random.default_rng(2026)


def _t(dur):
    return np.arange(int(dur * SR), dtype=np.float32) / SR


def _fft_filter(x, lo=None, hi=None, slope=1.0):
    """Smooth band-pass / low-pass / high-pass in the frequency domain."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.ones_like(f, dtype=np.float32)
    if hi is not None:
        g *= 1.0 / (1.0 + (f / hi) ** (2 * slope))
    if lo is not None:
        g *= (f / lo) ** (2 * slope) / (1.0 + (f / lo) ** (2 * slope))
    return np.fft.irfft(X * g, n).astype(np.float32)


def _norm(x):
    m = np.abs(x).max()
    return x / m if m > 1e-9 else x


def _noise(dur, seed=1):
    return RNG.normal(0, 1, int(dur * SR)).astype(np.float32)


def _env_ad(n, attack=0.25, decay=0.5):
    """attack/decay envelope with a smooth swell."""
    i = np.arange(n, dtype=np.float32) / n
    return (np.clip(i / max(attack, 1e-3), 0, 1) ** 1.2) * np.clip(
        (1 - i) / max(decay, 1e-3), 0, 1) ** 0.8


# ------------------------------------------------------------------ ambience ---
def amb_wind(dur, level=0.055):
    t = _t(dur)
    # two decorrelated layers: rumble + leaf rustle
    rumble = _fft_filter(_noise(dur, 1), hi=420, slope=1.2)
    rustle = _fft_filter(_noise(dur, 2), lo=900, hi=5200, slope=0.7)
    gust = 0.45 + 0.55 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.055 * t + 1.1)) \
        * (0.6 + 0.4 * np.sin(2 * np.pi * 0.017 * t))
    leaves = 0.35 + 0.65 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t + 0.3)) ** 3
    x = _norm(rumble) * gust * 0.8 + _norm(rustle) * leaves * 0.42
    return (x * level).astype(np.float32)


def amb_forest(dur, level=0.05):
    t = _t(dur)
    bed = _fft_filter(_noise(dur, 3), hi=1100, slope=1.0)
    bed = _norm(bed) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.03 * t))
    calls = np.zeros(int(dur * SR), dtype=np.float32)
    # distant birds: frequency-varying chirp clusters
    for _ in range(int(dur * 3.4)):
        s = int(RNG.integers(0, max(1, calls.size - int(0.4 * SR))))
        ln = int(RNG.uniform(0.04, 0.13) * SR)
        tt = np.arange(ln, dtype=np.float32) / SR
        f0 = RNG.uniform(2200, 4600)
        f1 = f0 * RNG.uniform(0.62, 1.45)
        ph = 2 * np.pi * np.cumsum(np.linspace(f0, f1, ln)) / SR
        c = np.sin(ph) * np.hanning(ln) ** 1.4
        calls[s:s + ln] += c.astype(np.float32) * RNG.uniform(0.1, 0.34)
    calls = _fft_filter(calls, lo=1400, hi=6500, slope=0.8)
    return ((bed * 0.55 + _norm(calls) * 0.45) * level).astype(np.float32)


def amb_still(dur, level=0.04):
    return (amb_wind(dur, level * 0.55) + amb_forest(dur, level * 0.35)).astype(np.float32)


def amb_water(dur, level=0.055):
    t = _t(dur)
    x = _fft_filter(_noise(dur, 4), lo=300, hi=2600, slope=0.8)
    lap = 0.5 + 0.5 * np.sin(2 * np.pi * 0.23 * t) * np.sin(2 * np.pi * 0.07 * t + 0.9)
    return (_norm(x) * (0.35 + 0.65 * lap) * level).astype(np.float32)


# ------------------------------------------------------------------- one-shots ---
def sfx_whoosh(dur=1.25, up=True, level=0.34):
    """Air pass: band-swept noise with a swell, no tonal whistle."""
    n = int(dur * SR)
    base = _noise(dur, 5)
    out = np.zeros(n, dtype=np.float32)
    seg = 32
    idx = np.linspace(0, n - 1, seg).astype(int)
    for i in range(seg - 1):
        a = i / (seg - 1)
        c = (320 + 2800 * a) if up else (3000 - 2500 * a)
        out[idx[i]:idx[i + 1]] = _fft_filter(base[idx[i]:idx[i + 1]], lo=c * 0.35, hi=c, slope=0.8)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.7
    return (_norm(out) * env * level).astype(np.float32)


def sfx_boom(dur=1.9, level=0.42):
    """Low impact: pitch-dropping sine + soft sub thud + air."""
    t = _t(dur)
    f = 78 * np.exp(-2.4 * t) + 32
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-3.0 * t)
    sub = _fft_filter(_noise(dur, 6), hi=110, slope=1.4) * np.exp(-6.5 * t) * 0.9
    air = _fft_filter(_noise(dur, 7), lo=400, hi=2400, slope=0.9) * np.exp(-9 * t) * 0.16
    return ((body + _norm(sub) * 0.8 + _norm(air) * 0.3) * level).astype(np.float32)


def sfx_tick(dur=0.18, level=0.14):
    """UI tick for a text card landing."""
    t = _t(dur)
    a = np.sin(2 * np.pi * 1240 * t) * np.exp(-38 * t)
    b = _fft_filter(_noise(dur, 8), lo=2000, hi=7000, slope=0.9) * np.exp(-55 * t) * 0.5
    return ((a + b) * level).astype(np.float32)


def sfx_drip(level=0.16):
    dur = 0.7
    t = _t(dur)
    f = 1150 * np.exp(-13 * t) + 380
    a = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-15 * t)
    tail = _fft_filter(_noise(dur, 9), lo=700, hi=4200, slope=1.0) * np.exp(-22 * t) * 0.18
    return ((a + _norm(tail)) * level).astype(np.float32)


def sfx_wing(dur=1.1, level=0.2):
    """Soft wing-beats: amplitude-modulated filtered noise."""
    t = _t(dur)
    n = _norm(_fft_filter(_noise(dur, 10), lo=280, hi=1500, slope=0.8))
    beat = (0.5 + 0.5 * np.sin(2 * np.pi * 7.4 * t)) ** 2.2
    env = np.sin(np.linspace(0, np.pi, len(t))) ** 0.9
    return (n * beat * env * level).astype(np.float32)


def sfx_tension(dur=3.0, level=0.24):
    """Low swell for the threat beat — no obvious musical pitch."""
    t = _t(dur)
    drone = _norm(_fft_filter(_noise(dur, 11), hi=190, slope=1.5))
    sub = np.sin(2 * np.pi * 43 * t) * 0.5
    env = np.clip(t / 0.9, 0, 1) * np.clip((dur - t) / 1.2, 0, 1)
    return ((drone * 0.9 + sub * 0.5) * env * level).astype(np.float32)


def sfx_chime(dur=2.2, level=0.16):
    """Warm resolution chord for the logo / CTA (soft, low-pass, sine only)."""
    t = _t(dur)
    out = np.zeros_like(t)
    for f, a in ((261.6, 0.5), (392.0, 0.32), (523.3, 0.24), (784.0, 0.10)):
        out += np.sin(2 * np.pi * f * t + 0.4) * a * np.exp(-1.6 * t)
    out = _norm(out)
    env = np.clip(t / 0.06, 0, 1) * np.clip((dur - t) / 0.9, 0, 1)
    return (out * env * level).astype(np.float32)


FX = {
    "whoosh": lambda: sfx_whoosh(),
    "whoosh_down": lambda: sfx_whoosh(up=False),
    "boom": lambda: sfx_boom(),
    "tick": lambda: sfx_tick(),
    "drip": lambda: sfx_drip(),
    "wing": lambda: sfx_wing(),
    "tension": lambda: sfx_tension(),
    "chime": lambda: sfx_chime(),
}

BEDS = {
    "wind": amb_wind,
    "forest": amb_forest,
    "still": amb_still,
    "water": amb_water,
}


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i < 0:
        sig = sig[-i:]
        i = 0
    n = min(len(sig), len(buf) - i)
    if n > 0:
        buf[i:i + n] += sig[:n] * gain


def write_wav(path, mono):
    import wave
    pcm = (np.clip(mono, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def read_wav(path):
    import wave
    with wave.open(path) as w:
        n, ch = w.getnframes(), w.getnchannels()
        raw = w.readframes(n)
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    return x.reshape(-1, ch).mean(axis=1) if ch > 1 else x
