import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_CONFIG } from '../config/site.config';

export interface SeoData {
  title?: string;
  description?: string;
  /** مسیر صفحه، مثل /shop/ring */
  path: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  jsonLd?: object | object[];
}

/** مدیریت تگ‌های سئو؛ در Prerender/SSR داخل HTML نهایی نوشته می‌شوند */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(SITE_CONFIG);

  update(data: SeoData) {
    const fullTitle = data.title ? `${data.title} | ${this.config.name}` : `${this.config.name} | ${this.config.tagline}`;
    const description = data.description ?? this.config.description;
    const url = this.config.url + data.path;
    const image = this.config.url + (data.image ?? '/icons/icon-512.png');

    this.title.setTitle(fullTitle);
    const tags: Record<string, string> = {
      description,
      robots: data.noindex ? 'noindex, nofollow' : 'index, follow',
      'og:title': fullTitle,
      'og:description': description,
      'og:url': url,
      'og:image': image,
      'og:type': data.type ?? 'website',
      'og:site_name': this.config.name,
      'og:locale': 'fa_IR',
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': image,
    };
    for (const [key, content] of Object.entries(tags)) {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }

    let canonical = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.doc.createElement('link');
      canonical.rel = 'canonical';
      this.doc.head.appendChild(canonical);
    }
    canonical.href = url;

    this.doc.getElementById('ld-json')?.remove();
    if (data.jsonLd) {
      const script = this.doc.createElement('script');
      script.id = 'ld-json';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data.jsonLd);
      this.doc.head.appendChild(script);
    }
  }

  organization() {
    const c = this.config;
    return {
      '@context': 'https://schema.org',
      '@type': 'JewelryStore',
      name: c.name,
      url: c.url,
      logo: `${c.url}/icons/icon-512.png`,
      telephone: c.phone,
      email: c.email,
      address: { '@type': 'PostalAddress', streetAddress: c.address, addressCountry: 'IR' },
      openingHours: 'Sa-Th 10:00-21:00',
    };
  }

  breadcrumbs(items: { name: string; path: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        item: this.config.url + it.path,
      })),
    };
  }
}
