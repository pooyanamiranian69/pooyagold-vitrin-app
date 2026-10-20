import { Gender, Metal, OrderStatus, ProductBadge, SortKey, Stone } from '../models';

export const METAL_LABELS: Record<Metal, string> = {
  yellow: 'زرد',
  rose: 'رزگلد',
  white: 'سفید',
};

export const METAL_SWATCH: Record<Metal, string> = {
  yellow: 'linear-gradient(135deg,#f6d77d,#c8962e)',
  rose: 'linear-gradient(135deg,#ffd7c9,#c47c6a)',
  white: 'linear-gradient(135deg,#ffffff,#b9bec4)',
};

export const STONE_LABELS: Record<Stone, string> = {
  none: 'بدون سنگ',
  diamond: 'برلیان',
  emerald: 'زمرد',
  ruby: 'یاقوت',
  sapphire: 'یاقوت کبود',
  pearl: 'مروارید',
  zircon: 'زیرکن',
  turquoise: 'فیروزه',
};

export const GENDER_LABELS: Record<Gender, string> = {
  women: 'زنانه',
  men: 'مردانه',
  unisex: 'اسپرت (هر دو)',
  kids: 'بچگانه',
};

export const BADGE_LABELS: Record<ProductBadge, string> = {
  new: 'جدید',
  bestseller: 'پرفروش',
  exclusive: 'اختصاصی',
  limited: 'محدود',
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'bestseller', label: 'پرفروش‌ترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'weight-asc', label: 'سبک‌ترین' },
  { value: 'weight-desc', label: 'سنگین‌ترین' },
  { value: 'wage-asc', label: 'کمترین اجرت' },
];

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  processing: { label: 'در حال پردازش', tone: 'warning' },
  shipped: { label: 'ارسال شده', tone: 'info' },
  delivered: { label: 'تحویل شده', tone: 'success' },
  cancelled: { label: 'لغو شده', tone: 'danger' },
};
