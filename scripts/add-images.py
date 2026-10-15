#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
নতুন ছবি যোগ — media-images.ts-তে **অ্যাপেন্ড** (রিজেনারেট নয়)।

import-images.py সব সারি নতুন করে লেখে (source ফাইল না পেলে সারি বাদ যায়) —
তাই সেটি আবার চালালে পুরনো ২৫৪টি ছবির রেকর্ড হারিয়ে যায়। এই স্ক্রিপ্ট
শুধু নতুন সারি যোগ করে, আগের সব রেকর্ড অক্ষত রাখে।

ব্যবহার:
  python3 scripts/add-images.py /tmp/rows.tsv

rows.tsv এর কলাম (TAB দিয়ে আলাদা):
  slug  dir  subject  srcfile  source_url  site  confidence

  dir: prani | udbhid | sthan | sahitto | village  (public/seed/<dir>/<slug>.jpg)
  srcfile: image-search/-এ থাকা ডাউনলোডকৃত ফাইলের নাম
  confidence: high | medium | low

নিয়ম (§12):
  * ছবি ≥৪০০px না হলে স্কিপ + সতর্কতা (ভুল ছবি বসবে না)।
  * slug আগে থেকেই থাকলে ডুপ্লিকেট সারি বাদ।
  * মিথ্যা ক্রেডিট নয় — license 'যাচাই বাকি', verified:false।
  * আইডেমপটেন্ট — একাধিকবার চালালেও একই ফলাফল।
"""
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "image-search")
TS = os.path.join(ROOT, "data", "seed", "media-images.ts")

MIN_W = 400


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def existing_slugs(text: str) -> set:
    return set(re.findall(r"slug: '([^']*)'", text))


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    rows_path = sys.argv[1]
    with open(TS, encoding="utf-8") as fh:
        text = fh.read()
    have = existing_slugs(text)

    added, skipped_dup, skipped_missing, skipped_small = [], [], [], []
    blocks = []
    with open(rows_path, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line.strip() or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) != 7:
                print("ভুল সারি (৭টি কলাম লাগে):", line[:120], file=sys.stderr)
                continue
            slug, d, subject, src, source, site, conf = parts
            if slug in have:
                skipped_dup.append(slug)
                continue
            sp = os.path.join(SRC, src)
            if not os.path.exists(sp):
                skipped_missing.append((slug, src))
                continue
            outdir = os.path.join(ROOT, "public", "seed", d)
            os.makedirs(outdir, exist_ok=True)
            out = os.path.join(outdir, slug + ".jpg")
            try:
                subprocess.run(
                    ["convert", sp, "-strip", "-resize", "1400x1400>", "-quality", "82", out],
                    check=True,
                    capture_output=True,
                )
            except subprocess.CalledProcessError as e:
                skipped_missing.append((slug, "convert-fail: " + e.stderr.decode(errors="ignore")[:80]))
                if os.path.exists(out):
                    os.remove(out)
                continue
            dim = subprocess.run(
                ["identify", "-format", "%wx%h", out], capture_output=True, text=True
            ).stdout.strip()
            try:
                w = int(dim.split("x")[0])
            except ValueError:
                w = 0
            if w < MIN_W:
                skipped_small.append((slug, dim))
                os.remove(out)
                continue
            low = w < 400  # ইতিমধ্যে MIN_W পাস করেছে, তাই False-ই থাকবে
            have.add(slug)
            added.append(slug)
            note = "%s-এ প্রকাশিত উন্মুক্ত-লাইসেন্স ছবি। মূল ফাইলের লেখক ও সুনির্দিষ্ট লাইসেন্স প্রকাশের আগে যাচাই করতে হবে।" % site
            if conf == "low":
                note += " উৎস-পাতায় প্রজাতিটি সম্পর্কে সন্দেহ আছে — বিশেষজ্ঞের মাধ্যমে যাচাই প্রয়োজন।"
            blocks.append(
                "  {\n"
                "    slug: '%s',\n"
                "    file: '/seed/%s/%s.jpg',\n"
                "    subject: '%s',\n"
                "    source: '%s',\n"
                "    site: '%s',\n"
                "    confidence: '%s',\n"
                "    lowRes: %s,\n"
                "    license: 'যাচাই বাকি',\n"
                "    verified: false,\n"
                "    note: '%s',\n"
                "  },\n" % (esc(slug), d, esc(slug), esc(subject), esc(source), esc(site), conf,
                            "true" if low else "false", esc(note))
            )

    marker = "\n]\n\nexport const SEED_IMAGE_BY_SLUG"
    if blocks:
        if marker not in text:
            print("media-images.ts-এ অ্যাপেন্ড-পয়েন্ট পাওয়া যায়নি!", file=sys.stderr)
            sys.exit(2)
        text = text.replace(marker, "\n" + "".join(blocks) + marker, 1)
        with open(TS, "w", encoding="utf-8") as fh:
            fh.write(text)

    print("যোগ হলো:", len(added), ("(" + ", ".join(added) + ")") if added else "")
    if skipped_dup:
        print("আগে থেকেই ছিল:", len(skipped_dup))
    if skipped_missing:
        print("সোর্স পাওয়া যায়নি:", skipped_missing, file=sys.stderr)
    if skipped_small:
        print("খুব ছোট (≥%dpx লাগে) — বাতিল:" % MIN_W, skipped_small, file=sys.stderr)


if __name__ == "__main__":
    main()
