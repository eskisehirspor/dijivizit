"""Original music bed for the promo film, synthesised from scratch (no samples,
no licensing): warm pad, sub bass, soft drums, a plucked arpeggio, and a bell
accent on the moment the card touches the phone (frame 243, 8.1 s).

python3 marketing/film/music.py OUT.wav
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, lfilter

SR = 48000
DUR = 22.0
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
TAP = 243 / 30  # contact frame in render/film.py
END = 550 / 30  # end card
N = int(SR * DUR)
t_all = np.arange(N) / SR
rng = np.random.default_rng(7)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def env(n, a, d, s, r, hold):
    """ADSR envelope of n samples (times in seconds)."""
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    hold = max(int(hold * SR), a + d)
    e = np.zeros(n)
    e[:a] = np.linspace(0, 1, a, endpoint=False) if a else 0
    e[a:a + d] = np.linspace(1, s, d, endpoint=False)
    e[a + d:hold] = s
    e[hold:hold + r] = np.linspace(s, 0, min(r, max(0, n - hold)))[: max(0, min(r, n - hold))]
    return e


def lowpass(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), "low")
    return lfilter(b, a, x)


def highpass(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), "high")
    return lfilter(b, a, x)


def place(buf, start, sig):
    i = int(start * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def reverb(x, mix=0.25):
    """Small Schroeder reverb."""
    out = np.zeros_like(x)
    for d, g in ((1557, 0.82), (1617, 0.81), (1491, 0.8), (1422, 0.79)):
        a = np.zeros(d + 1)
        a[0], a[d] = 1, -g
        out += lfilter([1], a, x)
    out /= 4
    for d, g in ((225, 0.7), (556, 0.7)):
        b = np.zeros(d + 1)
        b[0], b[d] = -g, 1
        a = np.zeros(d + 1)
        a[0], a[d] = 1, -g
        out = lfilter(b, a, out)
    return (1 - mix) * x + mix * lowpass(out, 6000)


# Fmaj7 - Am7 - Dm9 - Bbmaj7, twice, then Fmaj9 to the end
CHORDS = [
    [53, 57, 60, 64],
    [57, 60, 64, 67],
    [50, 57, 60, 64],
    [46, 53, 57, 62],
] * 2 + [[53, 57, 60, 64, 67]]

L = np.zeros(N)
R = np.zeros(N)

# Pad: detuned saws, slow attack, lowpassed
pad = np.zeros(N)
for i, ch in enumerate(CHORDS):
    start = i * BAR
    length = (DUR - start) if i == len(CHORDS) - 1 else BAR + 0.4
    n = int(length * SR)
    tt = np.arange(n) / SR
    s = np.zeros(n)
    for m in ch:
        for det in (-0.08, 0.0, 0.08):
            f = hz(m + det)
            s += 2 * ((tt * f) % 1) - 1
    s = lowpass(s, 1400 if i < 8 else 1100) * env(n, 0.6, 0.4, 0.8, 0.5, length - 0.4)
    place(pad, start, s * 0.018)
L += pad
R += np.roll(pad, 240)

# Sub bass on beats 1 and 3 from bar 2
bass = np.zeros(N)
for i, ch in enumerate(CHORDS[:8]):
    if i < 1:
        continue
    for b in (0, 2):
        start = i * BAR + b * BEAT
        n = int(BEAT * 1.9 * SR)
        tt = np.arange(n) / SR
        s = np.sin(2 * np.pi * hz(ch[0] - 12) * tt) + 0.2 * np.sin(2 * np.pi * hz(ch[0]) * tt)
        place(bass, start, s * env(n, 0.01, 0.2, 0.6, 0.2, BEAT * 1.6) * 0.16)
L += bass
R += bass

# Drums from bar 2 until the end card
drums = np.zeros(N)
drum_start = BAR
for k in range(int((END - drum_start) / BEAT)):
    tb = drum_start + k * BEAT
    if k % 4 in (0, 2):  # soft kick
        n = int(0.35 * SR)
        tt = np.arange(n) / SR
        f = 48 + 90 * np.exp(-tt * 30)
        kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
        place(drums, tb, kick * 0.32)
    if k % 4 in (1, 3):  # rim / clap: filtered noise
        n = int(0.18 * SR)
        nz = highpass(rng.standard_normal(n), 1800) * np.exp(-np.arange(n) / SR * 28)
        place(drums, tb, nz * 0.05)
    n = int(0.05 * SR)  # offbeat hat
    hat = highpass(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR * 90)
    place(drums, tb + BEAT / 2, hat * 0.035)
L += drums
R += drums

# Plucked arpeggio (eighths), ping-pong delayed, from bar 3
pl_l = np.zeros(N)
pl_r = np.zeros(N)
for i, ch in enumerate(CHORDS[:8]):
    if i < 2:
        continue
    notes = [m + 12 for m in ch] + [ch[1] + 24]
    for e in range(8):
        start = i * BAR + e * BEAT / 2
        m = notes[[0, 2, 1, 3, 4, 3, 2, 1][e] % len(notes)]
        n = int(0.6 * SR)
        tt = np.arange(n) / SR
        s = (np.sin(2 * np.pi * hz(m) * tt) + 0.35 * np.sin(4 * np.pi * hz(m) * tt)) * np.exp(-tt * 7)
        target = pl_l if e % 2 == 0 else pl_r
        place(target, start, s * 0.05)
delay = int(BEAT * 0.75 * SR)
L += pl_l + 0.35 * np.roll(pl_r, delay)
R += pl_r + 0.35 * np.roll(pl_l, delay)


def bell(m, amp, decay=2.2):
    n = int(3.0 * SR)
    tt = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * hz(m) * r * tt) for r, a in ((1, 1), (2.0, 0.4), (2.76, 0.25), (5.4, 0.08)))
    return s * np.exp(-tt * decay) * amp


# Riser into the tap, then the bell on contact
n = int(0.9 * SR)
riser = highpass(rng.standard_normal(n), 3000) * np.linspace(0, 1, n) ** 3 * 0.04
place(L, TAP - 0.9, riser)
place(R, TAP - 0.9, riser)
place(L, TAP, bell(84, 0.12))
place(R, TAP + 0.012, bell(84, 0.12))
place(L, TAP + BEAT / 2, bell(91, 0.06))
place(R, TAP + BEAT / 2 + 0.012, bell(91, 0.06))

# End card: a soft resolving bell
place(L, END, bell(77, 0.09, 1.4))
place(R, END + 0.015, bell(81, 0.08, 1.4))

L = reverb(L, 0.28)
R = reverb(R, 0.28)

# Fade in a touch, fade out over the last 1.8 s, normalise to -1 dBFS
fade = np.ones(N)
fi = int(0.05 * SR)
fade[:fi] = np.linspace(0, 1, fi)
fo = int(1.8 * SR)
fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
g = 10 ** (-1 / 20) / peak
stereo = np.stack([L * g, R * g], axis=1)

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype("<i2").tobytes())
print("music", sys.argv[1], f"{DUR}s")
