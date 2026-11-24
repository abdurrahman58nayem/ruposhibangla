/**
 * sitemap-এর ভাগ-বণ্টনের হিসাব — UI না, শুধু সংখ্যা।
 *
 * Google-এর সীমা এক sitemap-ফাইলে ৫০,০০০ URL। কিন্তু ১,৯০০+ প্রজাতির প্রতিটি
 * এন্ট্রিতে `lastModified` থাকায় এক ফাইলই ~৩০০KB+ হয়ে যায় এবং প্রতিবার
 * পুরোটা তৈরি করতে হয়। তাই ছোট ছোট অংশে ভাগ করা হয়।
 *
 * ভাগ বদলালে ক্রলার নতুন `/sitemap/N.xml` পাবে — sitemap-index নিজেই Next.js
 * তৈরি করে, তাই old URL ভাঙে না।
 */

/** একটি sitemap-ফাইলে সর্বোচ্চ কতটি রেকর্ড */
export const SITEMAP_CHUNK = 500

/** নিরাপত্তা-সীমা — ভুল করে কোটি-রেকর্ডেও হাজার ফাইল তৈরি না হয় */
export const SITEMAP_MAX_CHUNKS = 100

/** মোট রেকর্ড থেকে কতটি অংশ লাগবে (কমপক্ষে ১) */
export function sitemapChunkCount(total: number): number {
  if (!Number.isFinite(total) || total <= 0) return 1
  return Math.max(1, Math.min(SITEMAP_MAX_CHUNKS, Math.ceil(total / SITEMAP_CHUNK)))
}
