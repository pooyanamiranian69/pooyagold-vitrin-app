import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { firstValueFrom } from 'rxjs';
import { StoreApi } from './core/api/store.api';

/**
 * استراتژی رندر هر مسیر:
 * - صفحه اصلی: SSR (رندر سمت سرور در هر درخواست؛ قیمت‌ها همیشه به‌روز)
 * - بقیه صفحات: Prerender (HTML ایستا در زمان build برای بهترین سئو و سرعت)
 * - محصول/دسته جدیدی که بعد از build اضافه شود با SSR رندر می‌شود (fallback)
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'shop', renderMode: RenderMode.Prerender },
  {
    path: 'shop/:category',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      const slugs = await firstValueFrom(inject(StoreApi).categorySlugs());
      return slugs.map((category) => ({ category }));
    },
  },
  {
    path: 'product/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      const slugs = await firstValueFrom(inject(StoreApi).productSlugs());
      return slugs.map((slug) => ({ slug }));
    },
  },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'account', renderMode: RenderMode.Prerender },
  ...['orders', 'favorites', 'addresses', 'profile', 'settings'].map((child) => ({
    path: `account/${child}`,
    renderMode: RenderMode.Prerender as const,
  })),
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
