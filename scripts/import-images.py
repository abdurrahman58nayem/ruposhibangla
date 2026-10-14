#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
§12 — ছবি সংগ্রহ পাইপলাইন।

image_search দিয়ে ডাউনলোড হওয়া ফাইলগুলো (image-search/) ঠিকমতো রিসাইজ করে
public/seed/<গ্রুপ>/<slug>.jpg-এ বসায় এবং data/seed/media-images.ts-এ
প্রতিটি ছবির উৎস-প্রমাণ (source page + লাইসেন্স অবস্থা) লিখে রাখে।

নিয়ম:
  * শুধু উন্মুক্ত/ফ্রি-লাইসেন্স উৎস (উইকিমিডিয়া কমন্স, পেক্সেলস) গ্রহণযোগ্য।
  * লেখক/লাইসেন্স না জানলে কখনোই মিথ্যা ক্রেডিট লেখা হয় না — verified:false রেখে
    "যাচাই বাকি" দেখানো হয় (§12: ভুল ক্রেডিট/অ্যাট্রিবিউশন কখনোই চলবে না)।
  * স্ক্রিপ্টটি idempotent — বারবার চালালে একই ফলাফল আসে।
"""
import json, os, subprocess, sys, hashlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "image-search")
OUT_TS = os.path.join(ROOT, "data", "seed", "media-images.ts")

# slug, src file, group dir, বাংলা বিষয়, উৎস-পাতা, উৎস-সাইট, লাইসেন্স-নোট
M = [
 ("am","mangifera-indica-site-commons-wikimedia--1.jpg","udbhid","আম","https://commons.wikimedia.org/wiki/Category:Mangifera_indica","উইকিমিডিয়া কমন্স"),
 ("mehogoni","swietenia-mahagoni-site-commons-wikimedi-1.jpg","udbhid","মেহগনি","https://commons.wikimedia.org/wiki/Category:Serampore_College","উইকিমিডিয়া কমন্স"),
 ("oshbottho","ficus-religiosa-site-commons-wikimedia-o-1.jpg","udbhid","অশ্বত্থ","https://commons.wikimedia.org/wiki/Category:Ficus_religiosa","উইকিমিডিয়া কমন্স"),
 ("amloki","phyllanthus-emblica-amla-fruit-tree-phot-1.jpg","udbhid","আমলকি","https://www.pexels.com/search/amla%20fruit/","পেক্সেলস (Pexels License)"),
 ("kochuripana","pontederia-crassipes-site-commons-wikime-1.jpg","udbhid","কচুরিপানা","https://commons.wikimedia.org/wiki/Category:Pool_Malebo","উইকিমিডিয়া কমন্স"),
 ("kadam","neolamarckia-cadamba-site-commons-wikime-1.jpg","udbhid","কদম","https://commons.wikimedia.org/wiki/Category:Shangrila","উইকিমিডিয়া কমন্স"),
 ("khejur","phoenix-sylvestris-site-commons-wikimedi-1.jpg","udbhid","খেজুর","https://commons.wikimedia.org/wiki/File:Toddy_collection_in_Phoenix_sylvestris_from_Andhra_Phoenix_sylvestris_from_Andhra_JEG9133.JPG","উইকিমিডিয়া কমন্স"),
 ("goran","ceriops-decandra-site-commons-wikimedia--1.png","udbhid","গরান","https://commons.wikimedia.org/wiki/Category:Ceriops","উইকিমিডিয়া কমন্স"),
 ("gewa","excoecaria-agallocha-site-commons-wikime-1.jpg","udbhid","গেওয়া","https://commons.wikimedia.org/wiki/File:Excoecaria_agallocha_05938.JPG","উইকিমিডিয়া কমন্স"),
 ("cha","camellia-sinensis-site-commons-wikimedia-1.jpg","udbhid","চা","https://commons.wikimedia.org/wiki/File:Camellia_sinensis_flower_tea.JPG","উইকিমিডিয়া কমন্স"),
 ("jaba","hibiscus-rosa-sinensis-site-commons-wiki-1.jpg","udbhid","জবা","https://commons.wikimedia.org/wiki/Category:Hibiscus_rosa-sinensis","উইকিমিডিয়া কমন্স"),
 ("jam","syzygium-cumini-site-commons-wikimedia-o-1.jpg","udbhid","জাম","https://commons.wikimedia.org/wiki/File:Syzygium_cumini_plants.jpg","উইকিমিডিয়া কমন্স"),
 ("tal","borassus-flabellifer-site-commons-wikime-1.jpg","udbhid","তাল","https://commons.wikimedia.org/wiki/Category:Borassus_flabellifer","উইকিমিডিয়া কমন্স"),
 ("tulshi","ocimum-tenuiflorum-site-commons-wikimedi-1.jpg","udbhid","তুলসী","https://commons.wikimedia.org/wiki/Ocimum_tenuiflorum","উইকিমিডিয়া কমন্স"),
 ("tetul","tamarindus-indica-site-commons-wikimedia-1.jpg","udbhid","তেঁতুল","https://commons.wikimedia.org/wiki/Category:Tamarindus_indica_(fruit)","উইকিমিডিয়া কমন্স"),
 ("narikel","cocos-nucifera-site-commons-wikimedia-or-1.jpg","udbhid","নারিকেল","https://commons.wikimedia.org/wiki/Category:Cocos_nucifera_(flowers)","উইকিমিডিয়া কমন্স"),
 ("nim","azadirachta-indica-site-commons-wikimedi-1.jpg","udbhid","নিম","https://commons.wikimedia.org/wiki/Category:Azadirachta_indica","উইকিমিডিয়া কমন্স"),
 ("padma","nelumbo-nucifera-lotus-site-commons-wiki-1.jpg","udbhid","পদ্ম","https://commons.wikimedia.org/wiki/Nelumbo_nucifera","উইকিমিডিয়া কমন্স"),
 ("paat","corchorus-olitorius-site-commons-wikimed-1.jpg","udbhid","পাট","https://commons.wikimedia.org/wiki/Category:Corchorus_olitorius","উইকিমিডিয়া কমন্স"),
 ("pan","piper-betle-site-commons-wikimedia-org-1.jpg","udbhid","পান","https://commons.wikimedia.org/wiki/Category:Piper_betle","উইকিমিডিয়া কমন্স"),
 ("bokul","mimusops-elengi-site-commons-wikimedia-o-1.jpg","udbhid","বকুল","https://commons.wikimedia.org/wiki/Category:Mimusops_elengi","উইকিমিডিয়া কমন্স"),
 ("bash","bambusa-vulgaris-bamboo-clump-site-commo-1.jpg","udbhid","বাঁশ","https://commons.wikimedia.org/wiki/Category:Bambusa_vulgaris","উইকিমিডিয়া কমন্স"),
 ("bel","aegle-marmelos-site-commons-wikimedia-or-1.jpg","udbhid","বেল","https://commons.wikimedia.org/wiki/Category:Aegle_marmelos","উইকিমিডিয়া কমন্স"),
 ("shajne","moringa-oleifera-site-commons-wikimedia--1.jpg","udbhid","সজনে","https://commons.wikimedia.org/wiki/Moringa_oleifera","উইকিমিডিয়া কমন্স"),
 ("shorisha","brassica-juncea-mustard-plant-mustard-fi-1.jpg","udbhid","সরিষা","https://en.wikipedia.org/wiki/Mustard_plant","উইকিমিডিয়া কমন্স"),
 ("supari","areca-catechu-site-commons-wikimedia-org-1.jpg","udbhid","সুপারি","https://commons.wikimedia.org/wiki/Category:Areca_catechu","উইকিমিডিয়া কমন্স"),
 ("shegun","tectona-grandis-site-commons-wikimedia-o-1.jpg","udbhid","সেগুন","https://commons.wikimedia.org/wiki/Tectona_grandis","উইকিমিডিয়া কমন্স"),
 ("horitoki","terminalia-chebula-site-commons-wikimedi-1.jpg","udbhid","হরিতকি","https://commons.wikimedia.org/wiki/Category:Terminalia_chebula","উইকিমিডিয়া কমন্স"),
 ("holud","curcuma-longa-wikimedia-commons-file-tur-1.jpg","udbhid","হলুদ","https://commons.wikimedia.org/wiki/Curcuma_longa","উইকিমিডিয়া কমন্স"),
 ("hijol","barringtonia-acutangula-site-commons-wik-1.jpg","udbhid","হিজল","https://commons.wikimedia.org/wiki/File:Barringtonia_acutangula_L%E1%BB%99c_v%E1%BB%ABng.JPG","উইকিমিডিয়া কমন্স"),
]


def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def main():
    rows = []
    missing = []
    for slug, src, grp, subject, source, site in M:
        sp = os.path.join(SRC, src)
        if not os.path.exists(sp):
            missing.append((slug, src))
            continue
        outdir = os.path.join(ROOT, "public", "seed", grp)
        os.makedirs(outdir, exist_ok=True)
        out = os.path.join(outdir, slug + ".jpg")
        subprocess.run(
            ["convert", sp, "-strip", "-resize", "1400x1400>", "-quality", "82", out],
            check=True,
        )
        dim = subprocess.run(["identify", "-format", "%wx%h", out],
                             capture_output=True, text=True).stdout.strip()
        size = os.path.getsize(out)
        rows.append(dict(slug=slug, file="/seed/%s/%s.jpg" % (grp, slug),
                         subject=subject, source=source, site=site,
                         dim=dim, bytes=size))

    if missing:
        print("পাওয়া যায়নি:", missing, file=sys.stderr)

    lines = []
    lines.append("/**")
    lines.append(" * §12 — জ্ঞানভান্ডারের ছবির উৎস-প্রমাণ।")
    lines.append(" *")
    lines.append(" * এই ফাইলটি স্ক্রিপ্ট দিয়ে তৈরি: `python3 scripts/import-images.py` — হাতে সম্পাদনা করবেন না।")
    lines.append(" * প্রতিটি ছবি এসেছে উন্মুক্ত উৎস (উইকিমিডিয়া কমন্স / পেক্সেলস) থেকে।")
    lines.append(" * সতর্কতা: লেখকের নাম ও সঠিক লাইসেন্স এখনো প্রতি-ফাইল যাচাই করা হয়নি,")
    lines.append(" * তাই কোনো মিথ্যা ক্রেডিট দেওয়া হয়নি — সব রেকর্ড verified:false।")
    lines.append(" */")
    lines.append("export type SeedImage = {")
    lines.append("  slug: string")
    lines.append("  file: string")
    lines.append("  subject: string")
    lines.append("  source: string")
    lines.append("  site: string")
    lines.append("  license: string")
    lines.append("  verified: boolean")
    lines.append("  note: string")
    lines.append("}")
    lines.append("")
    lines.append("export const SEED_IMAGES: SeedImage[] = [")
    for r in rows:
        lines.append("  {")
        lines.append("    slug: '%s'," % esc(r["slug"]))
        lines.append("    file: '%s'," % esc(r["file"]))
        lines.append("    subject: '%s'," % esc(r["subject"]))
        lines.append("    source: '%s'," % esc(r["source"]))
        lines.append("    site: '%s'," % esc(r["site"]))
        lines.append("    license: 'যাচাই বাকি',")
        lines.append("    verified: false,")
        lines.append("    note: '" + esc(r["site"]) +
                   "-এ প্রকাশিত উন্মুক্ত-লাইসেন্স ছবি। মূল ফাইলের লেখক ও সুনির্দিষ্ট লাইসেন্স "
                   "প্রকাশের আগে যাচাই করতে হবে।',")
        lines.append("  },")
    lines.append("]")
    lines.append("")
    lines.append("export const SEED_IMAGE_BY_SLUG: Record<string, string> = Object.fromEntries(")
    lines.append("  SEED_IMAGES.map((i) => [i.slug, i.file]),")
    lines.append(")")
    lines.append("")

    with open(OUT_TS, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    print("প্রক্রিয়াকৃত ছবি:", len(rows))
    total = sum(r["bytes"] for r in rows)
    print("মোট সাইজ: %.1f KB" % (total / 1024))


if __name__ == "__main__":
    main()
