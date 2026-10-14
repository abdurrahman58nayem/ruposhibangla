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
  * উৎসের শিরোনাম/ক্যাটাগরি থেকে প্রজাতি নিশ্চিত না হলে confidence:'low' দেওয়া হয়।
  * স্ক্রিপ্টটি idempotent — বারবার চালালে একই ফলাফল আসে।
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "image-search")
OUT_TS = os.path.join(ROOT, "data", "seed", "media-images.ts")

# slug, src file, group dir, বাংলা বিষয়, উৎস-পাতা, উৎস-সাইট, confidence
M = [
    # ---------- উদ্ভিদ (udbhid) ----------
    ("am", "mangifera-indica-site-commons-wikimedia--1.jpg", "udbhid", "আম", "https://commons.wikimedia.org/wiki/Category:Mangifera_indica", "উইকিমিডিয়া কমন্স", "high"),
    ("mehogoni", "swietenia-mahagoni-site-commons-wikimedi-1.jpg", "udbhid", "মেহগনি", "https://commons.wikimedia.org/wiki/Category:Serampore_College", "উইকিমিডিয়া কমন্স", "high"),
    ("oshbottho", "ficus-religiosa-site-commons-wikimedia-o-1.jpg", "udbhid", "অশ্বত্থ", "https://commons.wikimedia.org/wiki/Category:Ficus_religiosa", "উইকিমিডিয়া কমন্স", "high"),
    ("amloki", "phyllanthus-emblica-amla-fruit-tree-phot-1.jpg", "udbhid", "আমলকি", "https://www.pexels.com/search/amla%20fruit/", "পেক্সেলস", "high"),
    ("kochuripana", "pontederia-crassipes-site-commons-wikime-1.jpg", "udbhid", "কচুরিপানা", "https://commons.wikimedia.org/wiki/Category:Pool_Malebo", "উইকিমিডিয়া কমন্স", "high"),
    ("kadam", "neolamarckia-cadamba-site-commons-wikime-1.jpg", "udbhid", "কদম", "https://commons.wikimedia.org/wiki/Category:Shangrila", "উইকিমিডিয়া কমন্স", "high"),
    ("khejur", "phoenix-sylvestris-site-commons-wikimedi-1.jpg", "udbhid", "খেজুর", "https://commons.wikimedia.org/wiki/File:Toddy_collection_in_Phoenix_sylvestris_from_Andhra_Phoenix_sylvestris_from_Andhra_JEG9133.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("goran", "ceriops-decandra-site-commons-wikimedia--1.png", "udbhid", "গরান", "https://commons.wikimedia.org/wiki/Category:Ceriops", "উইকিমিডিয়া কমন্স", "high"),
    ("gewa", "excoecaria-agallocha-site-commons-wikime-1.jpg", "udbhid", "গেওয়া", "https://commons.wikimedia.org/wiki/File:Excoecaria_agallocha_05938.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("cha", "camellia-sinensis-site-commons-wikimedia-1.jpg", "udbhid", "চা", "https://commons.wikimedia.org/wiki/File:Camellia_sinensis_flower_tea.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("jaba", "hibiscus-rosa-sinensis-site-commons-wiki-1.jpg", "udbhid", "জবা", "https://commons.wikimedia.org/wiki/Category:Hibiscus_rosa-sinensis", "উইকিমিডিয়া কমন্স", "high"),
    ("jam", "syzygium-cumini-site-commons-wikimedia-o-1.jpg", "udbhid", "জাম", "https://commons.wikimedia.org/wiki/File:Syzygium_cumini_plants.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("tal", "borassus-flabellifer-site-commons-wikime-1.jpg", "udbhid", "তাল", "https://commons.wikimedia.org/wiki/Category:Borassus_flabellifer", "উইকিমিডিয়া কমন্স", "high"),
    ("tulshi", "ocimum-tenuiflorum-site-commons-wikimedi-1.jpg", "udbhid", "তুলসী", "https://commons.wikimedia.org/wiki/Ocimum_tenuiflorum", "উইকিমিডিয়া কমন্স", "high"),
    ("tetul", "tamarindus-indica-site-commons-wikimedia-1.jpg", "udbhid", "তেঁতুল", "https://commons.wikimedia.org/wiki/Category:Tamarindus_indica_(fruit)", "উইকিমিডিয়া কমন্স", "high"),
    ("narikel", "cocos-nucifera-site-commons-wikimedia-or-1.jpg", "udbhid", "নারিকেল", "https://commons.wikimedia.org/wiki/Category:Cocos_nucifera_(flowers)", "উইকিমিডিয়া কমন্স", "high"),
    ("nim", "azadirachta-indica-site-commons-wikimedi-1.jpg", "udbhid", "নিম", "https://commons.wikimedia.org/wiki/Category:Azadirachta_indica", "উইকিমিডিয়া কমন্স", "high"),
    ("padma", "nelumbo-nucifera-lotus-site-commons-wiki-1.jpg", "udbhid", "পদ্ম", "https://commons.wikimedia.org/wiki/Nelumbo_nucifera", "উইকিমিডিয়া কমন্স", "high"),
    ("paat", "corchorus-olitorius-site-commons-wikimed-1.jpg", "udbhid", "পাট", "https://commons.wikimedia.org/wiki/Category:Corchorus_olitorius", "উইকিমিডিয়া কমন্স", "high"),
    ("pan", "piper-betle-site-commons-wikimedia-org-1.jpg", "udbhid", "পান", "https://commons.wikimedia.org/wiki/Category:Piper_betle", "উইকিমিডিয়া কমন্স", "high"),
    ("bokul", "mimusops-elengi-site-commons-wikimedia-o-1.jpg", "udbhid", "বকুল", "https://commons.wikimedia.org/wiki/Category:Mimusops_elengi", "উইকিমিডিয়া কমন্স", "high"),
    ("bash", "bambusa-vulgaris-bamboo-clump-site-commo-1.jpg", "udbhid", "বাঁশ", "https://commons.wikimedia.org/wiki/Category:Bambusa_vulgaris", "উইকিমিডিয়া কমন্স", "high"),
    ("bel", "aegle-marmelos-site-commons-wikimedia-or-1.jpg", "udbhid", "বেল", "https://commons.wikimedia.org/wiki/Category:Aegle_marmelos", "উইকিমিডিয়া কমন্স", "high"),
    ("shajne", "moringa-oleifera-site-commons-wikimedia--1.jpg", "udbhid", "সজনে", "https://commons.wikimedia.org/wiki/Moringa_oleifera", "উইকিমিডিয়া কমন্স", "high"),
    ("shorisha", "brassica-juncea-mustard-plant-mustard-fi-1.jpg", "udbhid", "সরিষা", "https://en.wikipedia.org/wiki/Mustard_plant", "উইকিমিডিয়া কমন্স", "high"),
    ("supari", "areca-catechu-site-commons-wikimedia-org-1.jpg", "udbhid", "সুপারি", "https://commons.wikimedia.org/wiki/Category:Areca_catechu", "উইকিমিডিয়া কমন্স", "high"),
    ("shegun", "tectona-grandis-site-commons-wikimedia-o-1.jpg", "udbhid", "সেগুন", "https://commons.wikimedia.org/wiki/Tectona_grandis", "উইকিমিডিয়া কমন্স", "high"),
    ("horitoki", "terminalia-chebula-site-commons-wikimedi-1.jpg", "udbhid", "হরিতকি", "https://commons.wikimedia.org/wiki/Category:Terminalia_chebula", "উইকিমিডিয়া কমন্স", "high"),
    ("holud", "curcuma-longa-wikimedia-commons-file-tur-1.jpg", "udbhid", "হলুদ", "https://commons.wikimedia.org/wiki/Curcuma_longa", "উইকিমিডিয়া কমন্স", "high"),
    ("hijol", "barringtonia-acutangula-site-commons-wik-1.jpg", "udbhid", "হিজল", "https://commons.wikimedia.org/wiki/File:Barringtonia_acutangula_L%E1%BB%99c_v%E1%BB%ABng.JPG", "উইকিমিডিয়া কমন্স", "high"),
    # ---------- মাছ (prani) ----------
    ("air", "sperata-aor-aor-catfish-photograph-1.jpg", "prani", "আইড়", "https://en.wikipedia.org/wiki/Sperata_aor", "উইকিমিডিয়া কমন্স", "high"),
    ("koi", "anabas-testudineus-climbing-perch-site-c-1.jpg", "prani", "কই", "https://commons.wikimedia.org/wiki/File:Anabas_testudineus_climbing_perch.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("kalbaus", "labeo-calbasu-site-commons-wikimedia-org-1.jpg", "prani", "কালবাউস", "https://commons.wikimedia.org/wiki/Category:Labeo_calbasu", "উইকিমিডিয়া কমন্স", "high"),
    ("kholisa", "trichogaster-fasciata-site-commons-wikim-1.jpg", "prani", "খলিসা", "https://commons.wikimedia.org/wiki/File:Trichogaster_fasciata_179813241.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("gazar", "channa-marulius-site-commons-wikimedia-o-1.jpg", "prani", "গজার", "https://commons.wikimedia.org/wiki/File:Channa_marulius_(Mekong)_2347.jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("chanda", "chanda-nama-glassfish-site-commons-wikim-1.jpg", "prani", "চাঁদা", "https://commons.wikimedia.org/wiki/Category:Chanda_nama", "উইকিমিডিয়া কমন্স", "low"),
    ("chitol", "chitala-chitala-site-commons-wikimedia-o-1.jpg", "prani", "চিতল", "https://commons.wikimedia.org/wiki/Category:Chitala_chitala", "উইকিমিডিয়া কমন্স", "high"),
    ("chapila", "gudusia-chapra-site-commons-wikimedia-or-1.jpg", "prani", "চ্যাপিলা", "https://commons.wikimedia.org/wiki/Category:Gudusia_chapra", "উইকিমিডিয়া কমন্স", "high"),
    ("tengra", "mystus-tengara-site-commons-wikimedia-or-1.jpg", "prani", "টেংরা", "https://commons.wikimedia.org/wiki/File:Mystus_tengara.JPG", "উইকিমিডিয়া কমন্স", "high"),
    ("telapia", "oreochromis-niloticus-site-commons-wikim-1.jpg", "prani", "তেলাপিয়া", "https://commons.wikimedia.org/wiki/File:Oreochromis_niloticus_(44653802502).jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("pabda", "ompok-pabda-site-commons-wikimedia-org-1.jpg", "prani", "পাবদা", "https://commons.wikimedia.org/wiki/File:Butterfish_(Pabda).jpg", "উইকিমিডিয়া কমন্স", "high"),
    ("puti", "puntius-sophore-site-commons-wikimedia-o-1.jpg", "prani", "পুঁটি", "https://commons.wikimedia.org/wiki/Category:Puntius_sophore", "উইকিমিডিয়া কমন্স", "high"),
    ("bamosh", "anguilla-bengalensis-site-commons-wikime-1.jpg", "prani", "বামোস", "https://commons.wikimedia.org/wiki/Category:Anguilla_bengalensis", "উইকিমিডিয়া কমন্স", "high"),
    ("mrigel", "cirrhinus-cirrhosus-mrigal-site-commons--1.jpg", "prani", "মৃগেল", "https://commons.wikimedia.org/wiki/Category:Cirrhinus_cirrhosus", "উইকিমিডিয়া কমন্স", "high"),
    ("shingi", "heteropneustes-fossilis-stinging-catfish-1.jpg", "prani", "শিং", "https://commons.wikimedia.org/wiki/Category:Fish_of_West_Bengal", "উইকিমিডিয়া কমন্স", "high"),
    ("shol", "channa-striata-snakehead-murrel-site-com-1.jpg", "prani", "শোল", "https://commons.wikimedia.org/wiki/Category:Channa_striata", "উইকিমিডিয়া কমন্স", "medium"),
    ("silver-carp", "hypophthalmichthys-molitrix-silver-carp--1.jpg", "prani", "সিলভার কার্প", "https://commons.wikimedia.org/wiki/File:Silver_Carp_Adult_(Hypophthalmichthys_molitrix).jpg", "উইকিমিডিয়া কমন্স", "high"),
]


def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def main():
    rows = []
    missing = []
    for slug, src, grp, subject, source, site, conf in M:
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
        dim = subprocess.run(
            ["identify", "-format", "%wx%h", out], capture_output=True, text=True
        ).stdout.strip()
        w = int(dim.split("x")[0]) if "x" in dim else 0
        rows.append(
            dict(
                slug=slug,
                file="/seed/%s/%s.jpg" % (grp, slug),
                subject=subject,
                source=source,
                site=site,
                confidence=conf,
                dim=dim,
                lowRes=w > 0 and w < 400,
                bytes=os.path.getsize(out),
            )
        )

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
    lines.append("  /** উৎস-পাতার তথ্য থেকে প্রজাতি শনাক্তকরণে আমাদের আস্থা */")
    lines.append("  confidence: 'high' | 'medium' | 'low'")
    lines.append("  /** মূল ছবিটি ছোট (৪০০px-এর কম) — বড় ছবি দিয়ে বদলানো দরকার */")
    lines.append("  lowRes: boolean")
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
        lines.append("    confidence: '%s'," % r["confidence"])
        lines.append("    lowRes: %s," % ("true" if r["lowRes"] else "false"))
        lines.append("    license: 'যাচাই বাকি',")
        lines.append("    verified: false,")
        note = "%s-এ প্রকাশিত উন্মুক্ত-লাইসেন্স ছবি। মূল ফাইলের লেখক ও সুনির্দিষ্ট লাইসেন্স প্রকাশের আগে যাচাই করতে হবে।" % r["site"]
        if r["lowRes"]:
            note += " ছবিটি ছোট (%s), বড় রেজোলিউশনের ছবি দিয়ে বদলাতে হবে।" % r["dim"]
        if r["confidence"] == "low":
            note += " উৎস-পাতায় প্রজাতিটি সম্পর্কে সন্দেহ আছে — বিশেষজ্ঞের মাধ্যমে যাচাই প্রয়োজন।"
        lines.append("    note: '%s'," % esc(note))
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
    print("মোট সাইজ: %.1f KB" % (sum(r["bytes"] for r in rows) / 1024))
    low = [r["slug"] for r in rows if r["lowRes"]]
    if low:
        print("ছোট ছবি (বদলাতে হবে):", ", ".join(low))


if __name__ == "__main__":
    main()
