import { InjectionToken } from '@angular/core';
import { Branch, Link, NavItem } from '../models';

/**
 * تنظیمات هویتی هر فروشگاه (Tenant).
 * برای راه‌اندازی یک فروشگاه جدید کافی است این فایل، فایل manifest و آیکون‌های public/icons عوض شوند.
 */
export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  defaultTheme: {
    mode: 'light' | 'dark' | 'system';
    accent: string;
    radius: 'sharp' | 'soft' | 'round';
  };
  nav: NavItem[];
  footer: { title: string; links: Link[] }[];
  socials: { icon: string; label: string; url: string }[];
  branches: Branch[];
  trustSeals: string[];
}

const productMenu: NonNullable<NavItem['children']> = [
  {
    title: 'زنانه',
    items: [
      { label: 'انگشتر', link: '/shop/ring', queryParams: { gender: 'women' } },
      { label: 'گردنبند', link: '/shop/necklace' },
      { label: 'گوشواره', link: '/shop/earring' },
      { label: 'دستبند', link: '/shop/bracelet', queryParams: { gender: 'women' } },
      { label: 'النگو', link: '/shop/bangle' },
      { label: 'آویز', link: '/shop/pendant' },
    ],
  },
  {
    title: 'مردانه',
    items: [
      { label: 'انگشتر مردانه', link: '/shop/ring', queryParams: { gender: 'men' } },
      { label: 'دستبند مردانه', link: '/shop/bracelet', queryParams: { gender: 'men' } },
      { label: 'همه محصولات مردانه', link: '/shop', queryParams: { gender: 'men' } },
    ],
  },
  {
    title: 'ویژه',
    items: [
      { label: 'سرویس و نیم‌ست', link: '/shop/set' },
      { label: 'سکه و شمش', link: '/shop/coin' },
      { label: 'محصولات تخفیف‌دار', link: '/shop', queryParams: { discounted: '1' } },
      { label: 'جدیدترین‌ها', link: '/shop', queryParams: { sort: 'newest' } },
    ],
  },
];

export const SITE_CONFIG_DEFAULT: SiteConfig = {
  name: 'گالری طلای پویا',
  shortName: 'پویا گلد',
  tagline: 'طلا و جواهر با اصالت',
  description:
    'گالری طلای پویا؛ خرید آنلاین طلا و جواهرات ۱۸ عیار با قیمت لحظه‌ای، فاکتور رسمی و ضمانت اصالت. انگشتر، گردنبند، دستبند، گوشواره و سرویس طلا.',
  url: 'https://pooyagold.ir',
  phone: '021-88776655',
  whatsapp: '09121234567',
  email: 'info@pooyagold.ir',
  address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، مجتمع طلای پویا، طبقه همکف',
  workingHours: 'شنبه تا پنجشنبه ۱۰ الی ۲۱',
  defaultTheme: { mode: 'system', accent: 'gold', radius: 'soft' },
  nav: [
    { label: 'صفحه اصلی', link: '/', icon: 'home' },
    { label: 'فروشگاه', link: '/shop', icon: 'gem', children: productMenu },
    { label: 'سرویس‌ها', link: '/shop/set', icon: 'sparkles' },
    { label: 'سکه و شمش', link: '/shop/coin', icon: 'award' },
    { label: 'درباره ما', link: '/about', icon: 'info' },
    { label: 'تماس با ما', link: '/contact', icon: 'phone' },
  ],
  footer: [
    {
      title: 'دسترسی سریع',
      links: [
        { label: 'فروشگاه', link: '/shop' },
        { label: 'جدیدترین محصولات', link: '/shop', queryParams: { sort: 'newest' } },
        { label: 'پرفروش‌ترین‌ها', link: '/shop', queryParams: { sort: 'bestseller' } },
        { label: 'سرویس و نیم‌ست', link: '/shop/set' },
        { label: 'سکه و شمش', link: '/shop/coin' },
      ],
    },
    {
      title: 'خدمات مشتریان',
      links: [
        { label: 'حساب کاربری', link: '/account' },
        { label: 'پیگیری سفارش', link: '/account/orders' },
        { label: 'علاقه‌مندی‌ها', link: '/account/favorites' },
        { label: 'تنظیمات ظاهری', link: '/account/settings' },
      ],
    },
    {
      title: 'گالری پویا',
      links: [
        { label: 'درباره ما', link: '/about' },
        { label: 'تماس با ما', link: '/contact' },
        { label: 'سوالات متداول', link: '/contact', queryParams: { tab: 'faq' } },
      ],
    },
  ],
  socials: [
    { icon: 'instagram', label: 'اینستاگرام', url: 'https://instagram.com/' },
    { icon: 'send', label: 'تلگرام', url: 'https://t.me/' },
    { icon: 'message', label: 'واتساپ', url: 'https://wa.me/' },
    { icon: 'play', label: 'آپارات', url: 'https://aparat.com/' },
  ],
  branches: [
    {
      title: 'شعبه مرکزی تهران',
      address: 'خیابان ولیعصر، بالاتر از پارک ساعی، مجتمع طلای پویا',
      phone: '021-88776655',
      hours: 'شنبه تا پنجشنبه ۱۰ الی ۲۱',
    },
    {
      title: 'شعبه مشهد',
      address: 'بلوار احمدآباد، احمدآباد ۱۳، ساختمان الماس، واحد ۵',
      phone: '051-38445566',
      hours: 'شنبه تا پنجشنبه ۱۰ الی ۲۰',
    },
  ],
  trustSeals: ['نماد اعتماد', 'اتحادیه طلا', 'ساماندهی'],
};

export const SITE_CONFIG = new InjectionToken<SiteConfig>('SITE_CONFIG', {
  providedIn: 'root',
  factory: () => SITE_CONFIG_DEFAULT,
});
