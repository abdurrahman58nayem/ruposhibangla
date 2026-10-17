/**
 * §12 — যেসব প্রজাতির কোনো মুক্ত-লাইসেন্স ছবি এখনো পাওয়া যায়নি।
 *
 * রূপসী বাংলায় কোনো প্রজাতির পাতায় ভুয়া/অসম্পর্কিত ছবি বসানো হয় না। বিশেষ করে
 * বিস্তার-মানচিত্র (range/distribution map), ডায়াগ্রাম বা অন্য প্রজাতির ছবি কখনোই
 * “প্রজাতির ছবি” হিসেবে দেখানো যাবে না। নিচের প্রজাতিগুলোর ক্ষেত্রে উইকিমিডিয়া
 * কমন্সে এখন পর্যন্ত শুধু মানচিত্র/অন্য প্রজাতির নমুনা-ছবি পাওয়া গেছে, তাই এখন
 * স্মার্ট প্লেসহোল্ডার (নামসহ গ্র্যাডিয়েন্ট কার্ড) দেখানো হচ্ছে।
 *
 * এই তালিকা স্বচ্ছতার জন্য রাখা হয়েছে — কোনো প্রজাতির ছবি পাওয়া গেলে
 * `scripts/link-commons-images.py`-এর ROWS-এ যোগ করলেই ছবিটি প্রজাতির পাতায়
 * চলে আসবে (আর স্লাগটি এই তালিকা থেকে সরিয়ে দিতে হবে)।
 *
 * `npm test`-এ এই তালিকার বাইরের যেকোনো “ছবিহীন” প্রজাতি ব্যর্থতা হিসেবে ধরা পড়বে,
 * অর্থাৎ নতুন কোনো প্রজাতি ছবি ছাড়া ঢুকলে সেটি ধরা পড়বে।
 */
export type SpeciesImageGap = {
  /** প্রজাতির স্লাগ */
  slug: string
  /** বাংলা নাম */
  nameBn: string
  /** বৈজ্ঞানিক নাম */
  scientificName: string
  /** কেন ছবি নেই — সাইটেও দেখানো যায় */
  reason: string
}

export const SPECIES_IMAGE_GAPS: SpeciesImageGap[] = [
  {
    slug: 'lomshomukhi-badur',
    nameBn: 'লোমশমুখী বাদুড়',
    scientificName: 'Myotis annectans',
    reason:
      'উইকিমিডিয়া কমন্সে এই বাদুড়ের শুধু বিস্তার-মানচিত্র আছে, কোনো মুক্ত-লাইসেন্স ছবি নেই। মানচিত্রকে প্রজাতির ছবি হিসেবে দেখানো হয় না।',
  },
  {
    slug: 'moru-holud-badur',
    nameBn: 'মরু হলুদ বাদুড়',
    scientificName: 'Scotoecus pallidus',
    reason:
      'উইকিমিডিয়া কমন্সে এই প্রজাতির কোনো ছবি নেই (কেবল অন্য প্রজাতির খুলির নমুনা-ছবি আছে)।',
  },
  {
    slug: 'dormers-pipistrelle',
    nameBn: 'ডরমার্স পিপিস্ট্রেল',
    scientificName: 'Scotozous dormeri',
    reason:
      'উইকিমিডিয়া কমন্সে এই বাদুড়ের কোনো মুক্ত-লাইসেন্স ছবি পাওয়া যায়নি।',
  },
]

export const SPECIES_IMAGE_GAP_SLUGS: string[] = SPECIES_IMAGE_GAPS.map((g) => g.slug)

export function imageGapFor(slug: string): SpeciesImageGap | undefined {
  return SPECIES_IMAGE_GAPS.find((g) => g.slug === slug)
}
