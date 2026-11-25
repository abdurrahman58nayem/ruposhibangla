# 3-watch combo ad (৳1,099) — build notes

Light/cream treatment. Sources in `src/` (real photos, per user instruction).
Nothing is cut out — the phone photos have cluttered backgrounds, so products appear
as rounded photo panels / circles on a cream stage, tight-cropped to the dial+case.

## Files
- `adkit_w.py` — palette (navy type, caramel accent, cream stage), `highkey()` grade,
  `panel()` / `circle_photo()` place-holders with soft lifted shadows, `txt()` / `chip()`
  (HarfBuzz-shaped Bengali via `../v3/rbtext.py`), `glare()` for crystal reflections.
- `stills.py` — the four layout stills (1080×1920) → `stills/s01..s04.jpg` + contact sheet.
- `grid.py` — overlay a 0.05 grid on a source photo to pick crop fractions.

## Crop boxes (fractions of the source frame, square where circles are used)
BOX_OLEVS_A (0.235,0.300,0.725,0.677) · BOX_OLEVS_B (0.175,0.317,0.635,0.663)
BOX_RUBBER  (0.130,0.207,0.860,0.754) · BOX_NICK (0.090,0.240,0.870,0.830)
BOX_T4G     (0.140,0.320,0.820,0.830)

## Payment / claim rules
Claims limited to: butterfly lock, waterproof, colour guarantee, water-resistant
leather strap, ৳1,099 for three. T4G's shield badge (reads like TAG Heuer) is covered
with a natural elliptical crystal glare — user chose crop/cover, product stays whole.
Nickies is called "spider dial" only; no comic/franchise reference.

## Confirmed by user
Third item = the black rubber-strap octagon (Royal-Oak style) = "স্পোর্টস ঘড়ি".
Combo = fixed set: OLEVS (A or B) + Nickies/T4G + sports watch = ৳1,099.
Audio = Bengali VO + music, one voice, even loudness.
