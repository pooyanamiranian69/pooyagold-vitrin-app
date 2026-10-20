/**
 * داده‌های نمونه (Mock).
 * همه اجزای سایت از طریق CatalogApi / ContentApi به این داده‌ها دسترسی دارند؛
 * با اتصال به API واقعی کافی است پیاده‌سازی آن سرویس‌ها عوض شود.
 */
import {
  AboutContent,
  Address,
  Category,
  Faq,
  Gender,
  GoldRate,
  HomeContent,
  Metal,
  Order,
  Product,
  ProductBadge,
  Stone,
  UserProfile,
} from '../models';
import { GENDER_LABELS, METAL_LABELS, STONE_LABELS } from './labels';

/** عکس محصول (نام کامل فایل در public/images/products) */
const photo = (file: string) => `/images/products/${file}`;
/** عکس‌های سرویس کامل برای اسلایدر و بنرها (نام کامل فایل در public/images/banners) */
const banner = (file: string) => `/images/banners/${file}`;

export const CATEGORIES: Category[] = [
  { id: 'c1', slug: 'ring', title: 'انگشتر', subtitle: 'ظرافت در هر لمس', image: photo('ring1.jpeg'), icon: 'ring', order: 1 },
  { id: 'c2', slug: 'necklace', title: 'گردنبند', subtitle: 'درخشش نزدیک قلب', image: photo('necklace2.jpg'), icon: 'necklace', order: 2 },
  { id: 'c3', slug: 'earring', title: 'گوشواره', subtitle: 'نورِ کنار نگاه', image: photo('earring2.jpeg'), icon: 'earring', order: 3 },
  { id: 'c4', slug: 'bracelet', title: 'دستبند', subtitle: 'همراه هر حرکت', image: photo('bracelet2.jpg'), icon: 'bracelet', order: 4 },
  { id: 'c5', slug: 'bangle', title: 'النگو', subtitle: 'اصالت ماندگار', image: photo('bangle9.jpeg'), icon: 'bangle', order: 5 },
  { id: 'c6', slug: 'pendant', title: 'آویز', subtitle: 'نشانی از خاطره', image: photo('pendant2.jpeg'), icon: 'pendant', order: 6 },
  { id: 'c7', slug: 'set', title: 'سرویس و نیم‌ست', subtitle: 'برای لحظه‌های خاص', image: banner('set7.jpg'), icon: 'jewelry-set', order: 7 },
  { id: 'c8', slug: 'coin', title: 'سکه و شمش', subtitle: 'سرمایه‌ای از جنس طلا', image: photo('coin.jpeg'), icon: 'gold-bars', order: 8 },
];

const FEATURES_BY_CATEGORY: Record<string, string[]> = {
  ring: ['قابل سفارش در سایزهای ۴۸ تا ۶۲', 'پرداخت دستی و براق', 'جعبه هدیه اختصاصی'],
  necklace: ['زنجیر قابل تنظیم ۴۵ تا ۵۰ سانتی‌متر', 'قفل ایمن طرح ایتالیایی', 'جعبه هدیه اختصاصی'],
  earring: ['قفل پروانه‌ای ایمن', 'مناسب استفاده روزمره', 'سبک و راحت'],
  bracelet: ['طول قابل تنظیم', 'قفل دوبل ایمنی', 'مناسب استفاده روزمره'],
  bangle: ['ساخت یکپارچه و مقاوم', 'سایزبندی ۵۸ تا ۶۴', 'پرداخت آینه‌ای'],
  pendant: ['قابل استفاده با هر زنجیر', 'حلقه اتصال مقاوم', 'جعبه هدیه اختصاصی'],
  set: ['شامل گردنبند و گوشواره', 'طراحی هماهنگ و یکپارچه', 'جعبه مخمل اختصاصی'],
  coin: ['دارای بسته‌بندی پلمپ و کارت اصالت', 'عیار تضمینی', 'قابلیت بازخرید'],
};

interface Seed {
  title: string;
  slug: string;
  cat: string;
  /** نام فایل‌های عکس در public/images/products */
  photos: string[];
  metal: Metal;
  stone?: Stone;
  weight: number;
  wage: number;
  gender?: Gender;
  karat?: 18 | 21 | 24;
  stonePrice?: number;
  brand?: string;
  badges?: ProductBadge[];
  discount?: number;
  stock?: number;
  rating?: number;
  reviews?: number;
  sold?: number;
  date: string;
  featured?: boolean;
  text: string;
}

const seeds: Seed[] = [
  { title: 'انگشتر سولیتر الماس', slug: 'solitaire-diamond-ring', photos: ['ring1.jpeg'], cat: 'ring', metal: 'yellow', stone: 'diamond', weight: 2.85, wage: 22, stonePrice: 18_500_000, brand: 'پویا', badges: ['bestseller'], rating: 4.9, reviews: 128, sold: 340, date: '2026-05-02', featured: true, text: 'نگین برلیان تراش درخشان روی رکاب کلاسیک چهار پنجه؛ نمادی جاودانه برای لحظه‌های ماندگار.' },
  { title: 'انگشتر طرح کادنزا', slug: 'cadenza-ring', photos: ['ring4.jpeg'], cat: 'ring', metal: 'yellow', weight: 3.7, wage: 18, brand: 'کژال', rating: 4.6, reviews: 54, sold: 190, date: '2026-03-18', text: 'رکاب پهن با حکاکی ظریف دستی که نور را در هر زاویه به بازی می‌گیرد.' },
  { title: 'انگشتر رزگلد اطلسی', slug: 'atlasi-rose-ring', photos: ['ring3.jpeg'], cat: 'ring', metal: 'rose', stone: 'zircon', weight: 1.2, wage: 25, stonePrice: 900_000, brand: 'مانلی', discount: 20, rating: 4.7, reviews: 76, sold: 260, date: '2026-07-11', text: 'دو رکاب درهم‌تنیده رزگلد با نگین زیرکن؛ سبک، مینیمال و مناسب استفاده روزانه.' },
  { title: 'انگشتر یاقوت سرخ', slug: 'ruby-ring', photos: ['ring5.jpeg'], cat: 'ring', metal: 'rose', stone: 'ruby', weight: 2.4, wage: 20, stonePrice: 5_600_000, brand: 'رزا', badges: ['new'], rating: 4.8, reviews: 19, sold: 37, date: '2026-09-28', text: 'یاقوت سرخ پرتب و تاب روی رکاب رزگلد؛ گرم، جسور و فراموش‌نشدنی.' },
  { title: 'انگشتر طلای سفید پیچک', slug: 'white-ivy-ring', photos: ['ring2.jpeg'], cat: 'ring', metal: 'white', stone: 'diamond', weight: 1.79, wage: 26, stonePrice: 7_200_000, brand: 'آوین', discount: 15, rating: 4.5, reviews: 22, sold: 58, date: '2026-04-09', text: 'رکاب پیچک طلای سفید با ریزنگین‌های برلیان؛ ظریف و مدرن.' },

  { title: 'گردنبند اشک', slug: 'teardrop-necklace', photos: ['necklace2.jpg'], cat: 'necklace', metal: 'white', weight: 6.8, wage: 19, brand: 'مانلی', badges: ['bestseller'], rating: 4.8, reviews: 87, sold: 300, date: '2026-03-03', featured: true, text: 'پلاک قطره‌ای براق روی زنجیر ظریف ونیزی؛ امضای همیشگی سبک کلاسیک.' },
  { title: 'گردنبند مروارید نگار', slug: 'negar-pearl-necklace', photos: ['necklace1.jpeg'], cat: 'necklace', metal: 'white', stone: 'pearl', weight: 5.2, wage: 21, stonePrice: 3_800_000, brand: 'آوین', badges: ['new'], rating: 4.6, reviews: 12, sold: 28, date: '2026-10-01', text: 'مروارید پرورشی درخشان در قاب طلای سفید؛ لطیف و اشرافی.' },
  { title: 'گردنبند الماس رویا', slug: 'roya-diamond-necklace', photos: ['necklace4.jpg'], cat: 'necklace', metal: 'rose', stone: 'diamond', weight: 4.6, wage: 23, stonePrice: 21_000_000, brand: 'پویا', badges: ['exclusive'], rating: 5, reviews: 18, sold: 22, date: '2026-08-05', featured: true, text: 'برلیان تک‌نگین با تراش درخشان روی زنجیر رزگلد؛ انتخابی برای شب‌های خاص.' },
  { title: 'گردنبند ماهور', slug: 'mahoor-necklace', photos: ['necklace3.jpeg'], cat: 'necklace', metal: 'yellow', weight: 8.9, wage: 16, brand: 'کژال', discount: 25, rating: 4.4, reviews: 39, sold: 120, date: '2026-05-25', text: 'زنجیر گوی‌دار با ریتم منظم؛ تلفیقی از سادگی و شکوه.' },

  { title: 'گوشواره اشکی کژال', slug: 'kajal-drop-earring', photos: ['earring.jpeg'], cat: 'earring', metal: 'yellow', stone: 'zircon', weight: 3.4, wage: 22, stonePrice: 1_200_000, brand: 'کژال', rating: 4.7, reviews: 66, sold: 180, date: '2026-04-27', featured: true, text: 'آویز قطره‌ای با نگین زیرکن که با هر حرکت می‌درخشد.' },
  { title: 'گوشواره حلقه‌ای رزگلد', slug: 'rose-hoop-earring', photos: ['earring2.jpeg'], cat: 'earring', metal: 'rose', weight: 2.6, wage: 18, brand: 'رزا', badges: ['bestseller'], discount: 10, rating: 4.8, reviews: 143, sold: 510, date: '2026-02-02', text: 'حلقه‌های رزگلد سبک و همه‌کاره؛ از صبح تا شب همراه شما.' },
  { title: 'گوشواره میخی برلیان', slug: 'diamond-stud-earring', photos: ['earring3.jpeg'], cat: 'earring', metal: 'white', stone: 'diamond', weight: 1.4, wage: 26, stonePrice: 9_500_000, brand: 'پویا', badges: ['new'], rating: 4.9, reviews: 24, sold: 40, date: '2026-09-15', text: 'جفت برلیان میخی روی طلای سفید؛ درخششی کلاسیک و بی‌زمان.' },
  { title: 'گوشواره مروارید آوا', slug: 'ava-pearl-earring', photos: ['earring9.jpeg'], cat: 'earring', metal: 'white', stone: 'pearl', weight: 2.2, wage: 20, stonePrice: 2_400_000, brand: 'آوین', rating: 4.5, reviews: 15, sold: 47, date: '2026-06-12', text: 'مروارید آویز روی طلای سفید؛ لطافتی بی‌نظیر برای مجالس رسمی.' },

  { title: 'دستبند طرح پولکی', slug: 'sequin-bracelet', photos: ['bracelet2.jpg'], cat: 'bracelet', metal: 'yellow', weight: 3.25, wage: 17, brand: 'مانلی', rating: 4.6, reviews: 58, sold: 170, date: '2026-03-27', text: 'حلقه‌های ریز پولکی که نور را به‌زیبایی بازتاب می‌دهند.' },
  { title: 'دستبند تنیسی زمرد', slug: 'emerald-tennis-bracelet', photos: ['bracelet4.jpg'], cat: 'bracelet', metal: 'yellow', stone: 'emerald', weight: 7.6, wage: 24, stonePrice: 16_000_000, brand: 'پویا', badges: ['exclusive'], rating: 5, reviews: 9, sold: 14, date: '2026-09-02', featured: true, text: 'ردیف زمردهای طبیعی روی دستبند تنیسی؛ شاهکاری برای مچ دست.' },
  { title: 'دستبند مردانه زنجیری', slug: 'chain-men-bracelet', photos: ['bracelet3.jpeg'], cat: 'bracelet', metal: 'white', weight: 12.4, wage: 12, gender: 'men', brand: 'کژال', badges: ['bestseller'], rating: 4.7, reviews: 71, sold: 240, date: '2026-01-29', featured: true, text: 'زنجیر کارتیه سنگین طلای سفید؛ مردانه، مقاوم و خوش‌دست.' },
  { title: 'دستبند گوی ونیزی', slug: 'venetian-ball-bracelet', photos: ['bracelet.jpeg'], cat: 'bracelet', metal: 'rose', weight: 4.1, wage: 19, brand: 'رزا', badges: ['new'], rating: 4.6, reviews: 11, sold: 31, date: '2026-10-05', text: 'گوی‌های براق رزگلد در کنار هم؛ ظریف، جوان و پرانرژی.' },
  { title: 'دستبند مردانه کارتیه', slug: 'cartier-men-bracelet', photos: ['bracelet5.jpeg'], cat: 'bracelet', metal: 'yellow', weight: 14.8, wage: 11, gender: 'men', brand: 'پویا', discount: 20, rating: 4.8, reviews: 34, sold: 88, date: '2026-05-08', text: 'دستبند مردانه با طراحی کلاسیک و وزن مناسب سرمایه‌گذاری.' },

  { title: 'النگو بی‌نهایت', slug: 'infinity-bangle', photos: ['bangle6.jpeg'], cat: 'bangle', metal: 'yellow', weight: 9.2, wage: 9, brand: 'پویا', badges: ['bestseller'], rating: 4.7, reviews: 95, sold: 330, date: '2026-02-21', featured: true, text: 'جفت النگوی براق با اجرت پایین؛ انتخاب هوشمند برای زینت و سرمایه.' },
  { title: 'النگو نگین‌دار ساحل', slug: 'sahel-bangle', photos: ['bangle8.jpeg'], cat: 'bangle', metal: 'yellow', stone: 'zircon', weight: 11.6, wage: 13, stonePrice: 1_800_000, brand: 'کژال', rating: 4.5, reviews: 27, sold: 64, date: '2026-07-19', text: 'النگوی تکی با ردیف نگین‌های درخشان؛ مجلسی و چشم‌نواز.' },
  { title: 'النگو تاج رزگلد', slug: 'taj-rose-bangle', photos: ['bangle.jpg'], cat: 'bangle', metal: 'rose', weight: 10.3, wage: 11, brand: 'رزا', badges: ['new'], rating: 4.6, reviews: 8, sold: 19, date: '2026-09-23', text: 'النگوی تابدار رزگلد با بافت طنابی؛ تلفیق سنت و مدرنیته.' },

  { title: 'آویز طرح موج', slug: 'wave-pendant', photos: ['pendant5.jpeg'], cat: 'pendant', metal: 'yellow', weight: 10.24, wage: 15, brand: 'مانلی', rating: 4.5, reviews: 21, sold: 52, date: '2026-04-03', text: 'مدال گرد با نقش موج و گل؛ الهام‌گرفته از هنر ایرانی.' },
  { title: 'آویز قلب یاقوت', slug: 'ruby-heart-pendant', photos: ['pendant2.jpeg'], cat: 'pendant', metal: 'rose', stone: 'ruby', weight: 2.9, wage: 22, stonePrice: 3_200_000, brand: 'رزا', badges: ['new'], rating: 4.9, reviews: 33, sold: 76, date: '2026-09-30', featured: true, text: 'قلب رزگلد با یاقوت سرخ؛ هدیه‌ای عاشقانه که همیشه به یاد می‌ماند.' },
  { title: 'آویز ستاره درخشان', slug: 'shining-star-pendant', photos: ['pendant4.jpeg'], cat: 'pendant', metal: 'white', stone: 'diamond', weight: 2.1, wage: 24, stonePrice: 6_500_000, brand: 'آوین', discount: 10, rating: 4.7, reviews: 17, sold: 39, date: '2026-06-22', text: 'ستاره طلای سفید با برلیان مرکزی؛ نشانی از امید و درخشش.' },
  { title: 'پلاک کودک ماه و ستاره', slug: 'kids-moon-pendant', photos: ['pendant1.jpeg'], cat: 'pendant', metal: 'yellow', weight: 1.6, wage: 20, gender: 'kids', brand: 'پویا', rating: 4.8, reviews: 44, sold: 150, date: '2026-03-12', text: 'پلاک سبک و ایمن برای کودکان؛ هدیه‌ای ماندگار برای تولد.' },

  { title: 'نیم‌ست اشک کژال', slug: 'kajal-drop-set', photos: ['set7.jpg'], cat: 'set', metal: 'yellow', stone: 'zircon', weight: 9.8, wage: 21, stonePrice: 2_600_000, brand: 'کژال', badges: ['exclusive'], rating: 4.8, reviews: 29, sold: 61, date: '2026-08-14', featured: true, text: 'گردنبند و گوشواره هماهنگ با نگین‌های زیرکن؛ کامل‌کننده استایل مجلسی.' },
  { title: 'سرویس عروس مهتاب', slug: 'mahtab-bridal-set', photos: ['set3.jpeg'], cat: 'set', metal: 'white', stone: 'diamond', weight: 24.5, wage: 20, stonePrice: 48_000_000, brand: 'پویا', badges: ['limited'], stock: 2, rating: 5, reviews: 6, sold: 7, date: '2026-07-01', text: 'سرویس کامل طلای سفید و برلیان؛ رویایی‌ترین انتخاب برای روز خاص شما.' },
  { title: 'نیم‌ست رزگلد آیلین', slug: 'aylin-rose-set', photos: ['set1.jpg'], cat: 'set', metal: 'rose', stone: 'pearl', weight: 7.3, wage: 22, stonePrice: 4_200_000, brand: 'رزا', badges: ['new'], discount: 15, rating: 4.6, reviews: 10, sold: 23, date: '2026-10-08', text: 'ترکیب لطیف رزگلد و مروارید در یک نیم‌ست هماهنگ.' },

  { title: 'سکه پارسیان ۱ گرمی', slug: 'parsian-coin-1g', photos: ['coin.jpeg'], cat: 'coin', metal: 'yellow', weight: 1, wage: 4, gender: 'unisex', brand: 'پارسیان', badges: ['bestseller'], rating: 4.9, reviews: 210, sold: 1200, date: '2026-01-05', text: 'سکه پارسیان یک گرمی با بسته‌بندی پلمپ؛ هدیه‌ای ارزشمند و سرمایه‌ای مطمئن.' },
  { title: 'شمش طلای ۵ گرمی ۲۴ عیار', slug: 'gold-bar-5g', photos: ['shemsh.jpeg'], cat: 'coin', metal: 'yellow', weight: 5, wage: 2, karat: 24, gender: 'unisex', brand: 'پویا', badges: ['exclusive'], rating: 5, reviews: 47, sold: 160, date: '2026-06-01', featured: true, text: 'شمش طلای خالص ۲۴ عیار با گواهی عیارسنجی و بسته‌بندی ایمن.' },
];

export const PRODUCTS: Product[] = seeds.map((s, i) => {
  const stone = s.stone ?? 'none';
  const gender = s.gender ?? 'women';
  const karat = s.karat ?? 18;
  const code = `PG-${(1001 + i).toString()}`;
  return {
    id: `p${i + 1}`,
    slug: s.slug,
    title: s.title,
    categorySlug: s.cat,
    gender,
    karat,
    weight: s.weight,
    wagePercent: s.wage,
    profitPercent: s.cat === 'coin' ? 3 : 7,
    metal: s.metal,
    stone,
    stonePrice: s.stonePrice ?? 0,
    brand: s.brand ?? 'پویا',
    images: s.photos.map(photo),
    badges: s.badges ?? [],
    discountPercent: s.discount ?? 0,
    stock: s.stock ?? 3 + ((i * 7) % 12),
    rating: s.rating ?? 4.5,
    reviewCount: s.reviews ?? 0,
    soldCount: s.sold ?? 0,
    createdAt: s.date,
    featured: s.featured ?? false,
    description: s.text,
    features: FEATURES_BY_CATEGORY[s.cat] ?? [],
    specs: [
      { label: 'کد محصول', value: code },
      { label: 'عیار', value: `${karat} عیار` },
      { label: 'وزن', value: `${s.weight} گرم` },
      { label: 'رنگ طلا', value: METAL_LABELS[s.metal] },
      { label: 'نوع سنگ', value: STONE_LABELS[stone] },
      { label: 'مناسب برای', value: GENDER_LABELS[gender] },
      { label: 'برند', value: s.brand ?? 'پویا' },
      { label: 'ضمانت', value: 'ضمانت اصالت و بازخرید' },
    ],
  };
});

export const GOLD_RATES: GoldRate[] = [
  { id: 'g18', title: 'طلای ۱۸ عیار', unit: 'گرم', price: 15_850_000, changePercent: 0.82 },
  { id: 'mesghal', title: 'مثقال طلا', unit: 'مثقال', price: 68_660_000, changePercent: 0.79 },
  { id: 'emami', title: 'سکه امامی', unit: 'عدد', price: 162_500_000, changePercent: -0.34 },
  { id: 'nim', title: 'نیم سکه', unit: 'عدد', price: 89_000_000, changePercent: 0.12 },
  { id: 'rob', title: 'ربع سکه', unit: 'عدد', price: 52_300_000, changePercent: -0.21 },
  { id: 'g24', title: 'طلای ۲۴ عیار', unit: 'گرم', price: 21_130_000, changePercent: 0.85 },
];

export const HOME_CONTENT: HomeContent = {
  slides: [
    {
      id: 's1',
      eyebrow: 'کالکشن پاییزه ۱۴۰۵',
      title: 'درخشش ابدی',
      highlight: 'در هر نگاه',
      description:
        'انگشترها و گردنبندهای برلیان با طراحی اختصاصی؛ ساخته‌شده برای لحظه‌هایی که می‌خواهید همیشه به یاد بمانند.',
      cta: { label: 'مشاهده کالکشن', link: '/shop/ring' },
      secondaryCta: { label: 'همه محصولات', link: '/shop' },
      image: banner('set1.jpg'),
      tone: 'warm',
    },
    {
      id: 's2',
      eyebrow: 'رزگلد، رنگ سال',
      title: 'لطافت رزگلد',
      highlight: 'برای هر روز',
      description: 'گوشواره‌ها، دستبندها و آویزهای رزگلد؛ سبک، مدرن و هماهنگ با استایل روزمره شما.',
      cta: { label: 'خرید رزگلد', link: '/shop', queryParams: { metal: 'rose' } },
      secondaryCta: { label: 'گوشواره‌ها', link: '/shop/earring' },
      image: banner('set7.jpg'),
      tone: 'rose',
    },
    {
      id: 's3',
      eyebrow: 'سنگ‌های قیمتی',
      title: 'رازهای نهفته',
      highlight: 'در دل سنگ',
      description: 'زمرد، یاقوت و مروارید طبیعی در قاب طلای ۱۸ عیار؛ هر قطعه با شناسنامه و ضمانت اصالت.',
      cta: { label: 'کشف کنید', link: '/shop', queryParams: { stone: 'emerald' } },
      secondaryCta: { label: 'سرویس‌ها', link: '/shop/set' },
      image: banner('set4.jpg'),
      tone: 'emerald',
    },
  ],
  banners: [
    {
      id: 'bridal',
      eyebrow: 'شکوه ست‌های جدید',
      title: 'اوج زیبایی در مجالس باشکوه',
      description:
        'سرویس‌ها و نیم‌ست‌های عروس با طراحی هماهنگ؛ از گردنبند تا گوشواره، همه در یک نگاه.',
      cta: { label: 'مشاهده سرویس‌ها', link: '/shop/set' },
      image: banner('set2.jpg'),
      tone: 'night',
    },
    {
      id: 'men',
      eyebrow: 'مردانه',
      title: 'اقتدار در جزئیات',
      description: 'انگشترها و دستبندهای مردانه با طراحی مینیمال.',
      cta: { label: 'خرید مردانه', link: '/shop', queryParams: { gender: 'men' } },
      image: photo('bangle7.jpeg'),
      tone: 'sapphire',
    },
    {
      id: 'coin',
      eyebrow: 'سرمایه‌گذاری',
      title: 'سکه و شمش اصل',
      description: 'با کمترین اجرت و قابلیت بازخرید.',
      cta: { label: 'خرید سکه', link: '/shop/coin' },
      image: photo('shemsh.jpeg'),
      tone: 'warm',
    },
  ],
  features: [
    { icon: 'shield', title: 'ضمانت اصالت', text: 'فاکتور رسمی و شناسنامه برای هر محصول' },
    { icon: 'truck', title: 'ارسال بیمه‌شده', text: 'ارسال رایگان و ایمن به سراسر کشور' },
    { icon: 'refresh', title: '۷ روز بازگشت', text: 'امکان مرجوعی بدون دردسر' },
    { icon: 'headset', title: 'مشاوره تخصصی', text: 'پاسخ‌گویی کارشناسان، هر روز هفته' },
  ],
  testimonials: [
    { id: 't1', name: 'سارا محمدی', city: 'تهران', rating: 5, text: 'کیفیت ساخت انگشتر فوق‌العاده بود و دقیقا مثل تصاویر سایت. بسته‌بندی هم خیلی شیک بود.' },
    { id: 't2', name: 'علی رضایی', city: 'مشهد', rating: 5, text: 'شفافیت در فاکتور و نمایش اجرت و سود باعث شد با خیال راحت خرید کنم. ممنون از پشتیبانی.' },
    { id: 't3', name: 'نگار احمدی', city: 'اصفهان', rating: 4, text: 'ارسال سریع بود و مشاوره قبل از خرید خیلی کمکم کرد سایز درست را انتخاب کنم.' },
    { id: 't4', name: 'مهدی کریمی', city: 'شیراز', rating: 5, text: 'برای هدیه سالگرد سرویس گرفتم؛ همسرم عاشقش شد. قیمت‌ها هم منصفانه است.' },
    { id: 't5', name: 'مریم حسینی', city: 'تبریز', rating: 5, text: 'تنوع طرح‌ها عالیه و فیلترها کمک می‌کنه سریع چیزی که می‌خوام رو پیدا کنم.' },
  ],
  brands: ['پویا', 'کژال', 'مانلی', 'رزا', 'آوین', 'پارسیان'],
  sections: [
    { type: 'hero' },
    { type: 'trust' },
    { type: 'categories', title: 'دسته‌بندی محصولات', subtitle: 'هر آنچه برای درخشیدن نیاز دارید' },
    {
      type: 'product-tabs',
      title: 'منتخب گالری',
      subtitle: 'گلچینی از محبوب‌ترین طرح‌های این فصل',
      tabs: [
        { label: 'ویژه', query: { featured: true, pageSize: 8 } },
        { label: 'جدیدترین', query: { sort: 'newest', pageSize: 8 } },
        { label: 'پرفروش', query: { sort: 'bestseller', pageSize: 8 } },
        { label: 'تخفیف‌دار', query: { discounted: true, pageSize: 8 } },
      ],
    },
    { type: 'banner', bannerId: 'bridal' },
    {
      type: 'product-rail',
      title: 'انگشترهای زنانه',
      subtitle: 'از سولیتر کلاسیک تا طرح‌های مینیمال',
      query: { category: 'ring', genders: ['women'], pageSize: 10 },
      link: { label: 'مشاهده همه', link: '/shop/ring', queryParams: { gender: 'women' } },
    },
    { type: 'banner-pair', bannerIds: ['men', 'coin'] },
    {
      type: 'product-rail',
      title: 'گوشواره و آویز',
      subtitle: 'ظرافتی که دیده می‌شود',
      query: { category: 'earring', pageSize: 10 },
      link: { label: 'مشاهده همه', link: '/shop/earring' },
    },
    { type: 'testimonials', title: 'مشتریان درباره ما', subtitle: 'اعتماد شما، ارزشمندترین سرمایه ماست' },
    { type: 'brands', title: 'برندهای همکار' },
  ],
};

export const ABOUT_CONTENT: AboutContent = {
  title: 'سه نسل اعتماد، یک امضای درخشان',
  images: [banner('set5.jpg'), banner('set8.jpg'), banner('set6.jpg')],
  lead: 'گالری طلای پویا از سال ۱۳۷۲ با تکیه بر هنر زرگری ایرانی و استانداردهای روز، جواهراتی می‌سازد که قرار است نسل به نسل بمانند.',
  story: [
    'داستان ما از یک کارگاه کوچک در بازار تهران آغاز شد؛ جایی که استاد پویا، با دستانی که طلا را مثل ابریشم شکل می‌داد، اولین قطعه‌هایش را ساخت. امروز همان دقت و وسواس، در هر محصول گالری دیده می‌شود.',
    'ما باور داریم خرید طلا باید شفاف باشد. به همین دلیل در فروشگاه آنلاین پویا، قیمت هر محصول با جزئیات کامل — ارزش طلا، اجرت ساخت، سود و مالیات — بر اساس نرخ لحظه‌ای نمایش داده می‌شود.',
    'هر قطعه پیش از ارسال توسط کارشناسان ما عیارسنجی شده و با شناسنامه، فاکتور رسمی و بسته‌بندی اختصاصی به دست شما می‌رسد.',
  ],
  stats: [
    { value: 33, suffix: '+', label: 'سال تجربه' },
    { value: 48, suffix: 'K', label: 'مشتری راضی' },
    { value: 1200, suffix: '+', label: 'طرح اختصاصی' },
    { value: 2, suffix: '', label: 'شعبه حضوری' },
  ],
  values: [
    { icon: 'shield', title: 'اصالت تضمینی', text: 'عیارسنجی تک‌تک قطعات و صدور شناسنامه معتبر.' },
    { icon: 'eye', title: 'شفافیت کامل', text: 'نمایش ریز قیمت شامل اجرت، سود و مالیات.' },
    { icon: 'sparkles', title: 'طراحی اختصاصی', text: 'تیم طراحی داخلی با الهام از هنر ایرانی.' },
    { icon: 'heart', title: 'همراهی همیشگی', text: 'خدمات پس از فروش، تعمیر و بازخرید.' },
  ],
  timeline: [
    { year: '۱۳۷۲', title: 'آغاز راه', text: 'تاسیس کارگاه زرگری پویا در بازار بزرگ تهران.' },
    { year: '۱۳۸۵', title: 'اولین گالری', text: 'افتتاح گالری فروش مستقیم در خیابان ولیعصر.' },
    { year: '۱۳۹۸', title: 'شعبه مشهد', text: 'گسترش فعالیت و افتتاح شعبه دوم در مشهد.' },
    { year: '۱۴۰۵', title: 'فروشگاه آنلاین', text: 'راه‌اندازی ویترین آنلاین با قیمت‌گذاری لحظه‌ای.' },
  ],
};

export const FAQS: Faq[] = [
  { q: 'قیمت محصولات چگونه محاسبه می‌شود؟', a: 'قیمت هر محصول بر اساس وزن × نرخ لحظه‌ای طلا، به‌علاوه اجرت ساخت، سود فروشنده (۷٪) و مالیات بر ارزش افزوده (۱۰٪ از اجرت و سود) محاسبه می‌شود. جزئیات کامل در صفحه هر محصول نمایش داده شده است.' },
  { q: 'آیا امکان مرجوع کردن کالا وجود دارد؟', a: 'بله؛ تا ۷ روز پس از تحویل، در صورت سالم بودن کالا و پلمپ، امکان بازگشت وجه بر اساس نرخ روز وجود دارد.' },
  { q: 'زمان ارسال سفارش چقدر است؟', a: 'سفارش‌های تهران در همان روز و سایر شهرها طی ۲ تا ۳ روز کاری با پست بیمه‌شده ارسال می‌شوند.' },
  { q: 'آیا محصولات شناسنامه و ضمانت دارند؟', a: 'تمامی محصولات دارای فاکتور رسمی، کد رهگیری و ضمانت اصالت هستند.' },
  { q: 'امکان سفارش سایز یا طرح خاص وجود دارد؟', a: 'بله؛ از طریق فرم تماس یا تماس تلفنی می‌توانید سفارش اختصاصی ثبت کنید.' },
];

export const USER_PROFILE: UserProfile = {
  firstName: 'نیلوفر',
  lastName: 'کاظمی',
  phone: '09121234567',
  email: 'niloofar@example.com',
  nationalId: '0012345678',
  birthDate: '1372/06/14',
  memberSince: '1402/03/01',
  clubPoints: 2450,
  tier: 'طلایی',
};

const orderItem = (slug: string, qty = 1) => {
  const p = PRODUCTS.find((x) => x.slug === slug)!;
  return { productSlug: p.slug, title: p.title, image: p.images[0], weight: p.weight, qty, price: 0 };
};

export const ORDERS: Order[] = [
  { id: '140507-2381', date: '1405/07/18', status: 'processing', total: 0, items: [orderItem('ruby-heart-pendant'), orderItem('rose-hoop-earring')] },
  { id: '140506-1904', date: '1405/06/02', status: 'shipped', total: 0, items: [orderItem('teardrop-necklace')] },
  { id: '140503-0877', date: '1405/03/11', status: 'delivered', total: 0, items: [orderItem('parsian-coin-1g', 2), orderItem('sequin-bracelet')] },
  { id: '140411-0412', date: '1404/11/25', status: 'cancelled', total: 0, items: [orderItem('cadenza-ring')] },
];

export const ADDRESSES: Address[] = [
  { id: 'a1', title: 'منزل', recipient: 'نیلوفر کاظمی', phone: '09121234567', city: 'تهران', line: 'سعادت‌آباد، بلوار پاکنژاد، کوچه نهم، پلاک ۱۲، واحد ۴', postalCode: '1998765432', isDefault: true },
  { id: 'a2', title: 'محل کار', recipient: 'نیلوفر کاظمی', phone: '09121234567', city: 'تهران', line: 'خیابان ونک، برج نگار، طبقه ۸', postalCode: '1994512345', isDefault: false },
];
