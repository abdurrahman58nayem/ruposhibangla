"""data/seed/media-licenses.ts তৈরি করে — public/seed-এর প্রতিটি ফাইলের জন্য একটি লাইসেন্স রেকর্ড।

গুরুত্ব: কোনো মিডিয়ার উৎস/লাইসেন্স যাচাই না করে “যাচাইকৃত” দেখানো যাবে না।
যে রেকর্ড যাচাই করা যায়নি তা verified: false থাকবে এবং /credits পেজে
“প্রকাশের আগে প্রতিস্থাপন/যাচাই প্রয়োজন” হিসেবে দেখানো হবে।
"""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# প্রজাতির তালিকা: আগে /tmp/species.json খোঁজা হয়, না থাকলে চালু সার্ভারের API থেকে আনা হয়
if os.path.exists('/tmp/species.json'):
    species = json.load(open('/tmp/species.json'))
else:
    api = os.environ.get('SPECIES_API', 'http://localhost:3000/api/species?limit=300')
    try:
        species = json.load(urllib.request.urlopen(api, timeout=30))
    except Exception as e:  # noqa
        print('প্রজাতির তালিকা আনা যায়নি:', e, file=sys.stderr)
        sys.exit(1)

by_image = {}
for s in species:
    img = (s.get('image') or '').strip()
    if img:
        by_image[img] = s

rows = []
for dirpath, _dirnames, filenames in os.walk(os.path.join(ROOT, 'public/seed')):
    for fn in sorted(filenames):
        if not fn.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.mp4')):
            continue
        full = os.path.join(dirpath, fn)
        rel = '/seed' + full.split('/public/seed')[1]
        sp = by_image.get(rel) or by_image.get(rel.replace('sundarbans', 'sundarban'))
        subject = sp['nameBn'] if sp else ('গ্রামবাংলা — সাধারণ দৃশ্য' if '/village/' in rel else '—')
        slug = sp['slug'] if sp else ''
        kind = 'image' if not fn.lower().endswith('.mp4') else 'video'
        rows.append((rel, subject, slug, kind))

rows.sort()

out = []
out.append("""/**
 * মিডিয়া লাইসেন্স রেকর্ড (§12) — প্রকাশের আগে প্রতিটি ছবি/ভিডিওর উৎস, লেখক ও লাইসেন্স যাচাই করা বাধ্যতামূলক।
 *
 * বর্তমান অবস্থা: public/seed-এ থাকা ছবিগুলো ডেভেলপমেন্ট/ডেমোর জন্য রাখা হয়েছে এবং
 * এদের উৎস-লাইসেন্স এখনো যাচাই করা হয়নি (verified: false)। প্রোডাকশনে যাওয়ার আগে
 * প্রতিটি ফাইলের উৎস (URL), লেখক (credit) ও লাইসেন্স যোগ করে verified: true করতে হবে,
 * অথবা ফাইলটি নিজস্ব/লাইসেন্সকৃত ছবি দিয়ে প্রতিস্থাপন করতে হবে।
 *
 * কোনোভাবেই ভুল ক্রেডিট বা ভুল লাইসেন্স দেখানো যাবে না — সন্দেহ থাকলে রেকর্ডটি
 * “যাচাই বাকি” রেখেই দেখানো হবে।
 */""")
out.append("export type MediaLicense = {")
out.append("  /** public/ ফোল্ডারের সাপেক্ষে পথ */")
out.append("  file: string")
out.append("  /** ছবির বিষয় — প্রজাতির বাংলা নাম বা দৃশ্য */")
out.append("  subject: string")
out.append("  /** প্রজাতির স্লাগ (থাকলে) */")
out.append("  slug: string")
out.append("  kind: 'image' | 'video'")
out.append("  /** মূল লেখক/ফটোগ্রাফার */")
out.append("  credit: string")
out.append("  /** উৎসের লিংক */")
out.append("  source: string")
out.append("  /** লাইসেন্সের নাম */")
out.append("  license: string")
out.append("  /** উৎস ও লাইসেন্স যাচাই হয়েছে কি না */")
out.append("  verified: boolean")
out.append("  note: string")
out.append("}")
out.append("")
out.append("export const MEDIA_LICENSES: MediaLicense[] = [")
for rel, subject, slug, kind in rows:
    out.append("  {")
    out.append("    file: '%s'," % rel)
    out.append("    subject: '%s'," % subject.replace("'", "\\'"))
    out.append("    slug: '%s'," % slug)
    out.append("    kind: '%s'," % kind)
    out.append("    credit: '',")
    out.append("    source: '',")
    out.append("    license: 'যাচাই বাকি',")
    out.append("    verified: false,")
    out.append("    note: 'প্রকাশের আগে উৎস, লেখক ও লাইসেন্স যাচাই করতে হবে অথবা ছবিটি প্রতিস্থাপন করতে হবে',")
    out.append("  },")
out.append("]")
out.append("")
out.append("export function licenseFor(file: string): MediaLicense | undefined {")
out.append("  if (!file) return undefined")
out.append("  const clean = file.split('?')[0]")
out.append("  return MEDIA_LICENSES.find((m) => m.file === clean)")
out.append("}")
out.append("")

path = os.path.join(ROOT, 'data/seed/media-licenses.ts')
open(path, 'w').write('\n'.join(out))
print('wrote', path, len(rows), 'records')
