import type { UserRole } from '@/lib/types'

/**
 * ভূমিকা-ভিত্তিক অনুমতি — এক জায়গায়, যাতে রুট বদলালে কোনো জায়গা বাদ না পড়ে।
 *
 * বাস্তবে দেখা গিয়েছিল: সাইটের অন্য সব অ্যাডমিন রুট `['admin','super_admin']`
 * মানে, কিন্তু ব্যবহারকারী-ব্যবস্থাপনা (`/api/admin/users`) শুধু `'admin'` —
 * ফলে `super_admin` নিজের প্যানেল থেকেই ব্লু টিক দিতে পারতেন না।
 */

export function isAdminRole(role?: UserRole | string | null): boolean {
  return role === 'admin' || role === 'super_admin'
}

/** সম্পাদনা/মডারেশন — ভূমিকা বদলানো বা অ্যাকাউন্ট মোছার ক্ষমতা নয় */
export function isStaffRole(role?: UserRole | string | null): boolean {
  return isAdminRole(role) || role === 'editor'
}

/**
 * এই ব্যবহারকারীকে যাচাই (নীল টিক) দেওয়ার ক্ষমতা আছে কি না।
 * লেখক নিজেকে টিক দিতে পারবেন না; সম্পাদক পারবেন না — শুধু অ্যাডমিন।
 */
export function canReviewVerification(role?: UserRole | string | null): boolean {
  return isAdminRole(role)
}
