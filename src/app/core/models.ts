export type Metal = 'yellow' | 'rose' | 'white';
export type Gender = 'women' | 'men' | 'unisex' | 'kids';
export type Stone =
  | 'none'
  | 'diamond'
  | 'emerald'
  | 'ruby'
  | 'sapphire'
  | 'pearl'
  | 'zircon'
  | 'turquoise';
export type ProductBadge = 'new' | 'bestseller' | 'exclusive' | 'limited';
export type Tone = 'warm' | 'rose' | 'emerald' | 'night' | 'sapphire';

export interface Category {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  /** نام آیکون در app-icon */
  icon: string;
  order: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  gender: Gender;
  karat: 18 | 21 | 24;
  /** وزن به گرم */
  weight: number;
  /** درصد اجرت ساخت */
  wagePercent: number;
  /** درصد سود فروشنده */
  profitPercent: number;
  metal: Metal;
  stone: Stone;
  /** قیمت سنگ به تومان (جدا از طلا) */
  stonePrice: number;
  brand: string;
  images: string[];
  badges: ProductBadge[];
  /** تخفیف روی اجرت (درصد) */
  discountPercent: number;
  stock: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  featured: boolean;
  description: string;
  features: string[];
  specs: ProductSpec[];
}

export interface PriceBreakdown {
  goldValue: number;
  wage: number;
  wageDiscount: number;
  profit: number;
  tax: number;
  stonePrice: number;
  total: number;
  totalBeforeDiscount: number;
}

export interface PricedProduct extends Product {
  price: PriceBreakdown;
}

export interface GoldRate {
  id: string;
  title: string;
  unit: string;
  price: number;
  changePercent: number;
}

export type SortKey =
  | 'newest'
  | 'popular'
  | 'bestseller'
  | 'price-asc'
  | 'price-desc'
  | 'weight-asc'
  | 'weight-desc'
  | 'wage-asc';

export interface ProductQuery {
  category?: string;
  q?: string;
  genders?: Gender[];
  metals?: Metal[];
  stones?: Stone[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minWeight?: number;
  maxWeight?: number;
  maxWage?: number;
  inStock?: boolean;
  discounted?: boolean;
  featured?: boolean;
  badge?: ProductBadge;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface FacetOption<T = string> {
  value: T;
  label: string;
  count: number;
}

export interface Facets {
  price: [number, number];
  weight: [number, number];
  wage: [number, number];
  genders: FacetOption<Gender>[];
  metals: FacetOption<Metal>[];
  stones: FacetOption<Stone>[];
  brands: FacetOption[];
}

export interface ProductPage {
  items: PricedProduct[];
  total: number;
  page: number;
  pageSize: number;
  facets: Facets;
}

export interface Link {
  label: string;
  link: string;
  queryParams?: Record<string, string>;
}

export interface NavItem extends Link {
  icon?: string;
  children?: { title: string; items: Link[] }[];
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta: Link;
  secondaryCta?: Link;
  image: string;
  tone: Tone;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: Link;
  image: string;
  tone: Tone;
}

export interface Feature {
  icon: string;
  title: string;
  text: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
}

export type HomeSection =
  | { type: 'hero' }
  | { type: 'trust' }
  | { type: 'categories'; title: string; subtitle: string }
  | {
      type: 'product-tabs';
      title: string;
      subtitle: string;
      tabs: { label: string; query: ProductQuery }[];
    }
  | { type: 'banner'; bannerId: string }
  | { type: 'banner-pair'; bannerIds: [string, string] }
  | { type: 'product-rail'; title: string; subtitle: string; query: ProductQuery; link: Link }
  | { type: 'testimonials'; title: string; subtitle: string }
  | { type: 'brands'; title: string };

export interface HomeContent {
  slides: HeroSlide[];
  banners: PromoBanner[];
  features: Feature[];
  testimonials: Testimonial[];
  brands: string[];
  sections: HomeSection[];
}

export interface Branch {
  title: string;
  address: string;
  phone: string;
  hours: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface AboutContent {
  title: string;
  lead: string;
  images: string[];
  story: string[];
  stats: { value: number; suffix: string; label: string }[];
  values: Feature[];
  timeline: { year: string; title: string; text: string }[];
}

export interface OrderItem {
  productSlug: string;
  title: string;
  image: string;
  weight: number;
  qty: number;
  price: number;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

export interface Address {
  id: string;
  title: string;
  recipient: string;
  phone: string;
  city: string;
  line: string;
  postalCode: string;
  isDefault: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalId: string;
  birthDate: string;
  memberSince: string;
  clubPoints: number;
  tier: string;
}
