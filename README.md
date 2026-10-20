# ویترین آنلاین طلای پویا (Pooya Gold Vitrin)

فروشگاه آنلاین طلا و جواهر با Angular 21. فعلا فقط فرانت و UI است و داده‌ها Mock هستند.

## اجرا

```bash
npm start                      # حالت توسعه: http://localhost:4200
npm run build                  # بیلد پروداکشن + Prerender همه صفحات
npm run serve:ssr:pooyagold-vitrin-app   # اجرای سرور SSR: http://localhost:4000
npm test
```

برای دامنه‌های واقعی، `security.allowedHosts` در `angular.json` یا متغیر `NG_ALLOWED_HOSTS` را تنظیم کنید.

## استراتژی رندر (سئو)

`src/app/app.routes.server.ts`:

- **صفحه اصلی:** SSR در هر درخواست (قیمت‌ها همیشه به‌روزند)
- **فروشگاه، دسته‌ها، تک‌تک محصولات، درباره ما، تماس، حساب کاربری:** Prerender در زمان بیلد
- محصول یا دسته‌ای که بعد از بیلد اضافه شود به‌صورت خودکار با SSR رندر می‌شود
- مسیر ناموجود: کد وضعیت واقعی ۴۰۴
- `/sitemap.xml` سمت سرور ساخته می‌شود (`src/server.ts`). `robots.txt` و متاتگ‌های OG و canonical و JSON-LD هم پیاده‌سازی شده‌اند (Product، Breadcrumb، JewelryStore)

## داده‌محور بودن

- همه داده‌ها از کلاس انتزاعی `StoreApi` می‌آیند (`src/app/core/api/store.api.ts`)
- پیاده‌سازی فعلی `MockStoreApi` است. برای اتصال به بک‌اند، یک `HttpStoreApi` بسازید و در `app.config.ts` جایگزین کنید
- چیدمان صفحه اصلی (ترتیب و نوع بخش‌ها، بنرها و اسلایدها) از `HomeContent.sections` خوانده می‌شود
- منوها، فوتر، شعبه‌ها و اطلاعات تماس در `src/app/core/config/site.config.ts` هستند

## چند فروشگاهی (هویت اختصاصی هر مشتری)

برای هر مشتری این موارد عوض می‌شود:

1. `site.config.ts`: نام، رنگ و تم پیش‌فرض، منوها و اطلاعات تماس
2. `public/manifest.webmanifest` و آیکون‌های `public/icons/*`، `favicon.svg` و `favicon.ico`
3. رنگ‌ها: همه رنگ‌ها از متغیر `--accent` مشتق می‌شوند (`src/styles/_tokens.scss`). پالت‌های آماده در `ACCENT_PRESETS` هستند

## تم

- حالت روز، شب و خودکار، با انیمیشن دایره‌ای هنگام تغییر
- صفحه **تنظیمات ظاهری** (`/account/settings`) شامل:
  - ۹ رنگ آماده
  - رنگ دلخواه با Color Picker
  - گردی گوشه‌ها
  - اندازه متن
  - کاهش انیمیشن
- تنظیمات در `localStorage` ذخیره می‌شوند. یک اسکریپت کوچک در `index.html` تنظیمات را قبل از اولین رنگ‌آمیزی صفحه اعمال می‌کند تا رنگ صفحه نپرد

## PWA

`@angular/service-worker` (فایل `ngsw-config.json`) همراه manifest فارسی و راست‌چین، shortcutها و آیکون maskable. فونت وزیرمتن از داخل خود پروژه بارگذاری می‌شود و به CDN خارجی وابسته نیست.

## ساختار

```
src/app/
  core/       models, api, data (mock), services (theme, cart, favorites, seo, ...), config
  shared/     icon, product-card, rail, range-slider, breadcrumb, logo, pipes
  layout/     header, footer, mobile-menu, bottom-nav, search, cart-drawer, toasts
  pages/      home, shop, product, about, contact, login, account/*, not-found
```

تصاویر محصولات در `public/images/products` با نام slug محصول (`<slug>.jpg`) قرار می‌گیرند و از طریق فیلد `photos` در `mock-data.ts` وصل می‌شوند؛ محصولاتی که هنوز عکس ندارند SVG نمایشی نشان می‌دهند. عکس‌های سرویس کامل برای اسلایدر و بنرها در `public/images/banners` هستند.
