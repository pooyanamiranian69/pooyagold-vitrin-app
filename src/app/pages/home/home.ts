import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { StoreApi } from '../../core/api/store.api';
import { PromoBanner } from '../../core/models';
import { SeoService } from '../../core/services/seo.service';
import { Banner } from './sections/banner';
import { CategoryGrid } from './sections/categories';
import { Hero } from './sections/hero';
import { ProductRail } from './sections/product-rail';
import { ProductTabs } from './sections/product-tabs';
import { Testimonials } from './sections/testimonials';
import { Trust } from './sections/trust';

/**
 * صفحه اصلی کاملا داده‌محور است: ترتیب و نوع بخش‌ها از HomeContent.sections می‌آید
 * و با تغییر داده (یا پاسخ API) بدون تغییر کد، چیدمان صفحه عوض می‌شود.
 */
@Component({
  selector: 'app-home',
  imports: [Hero, Trust, CategoryGrid, ProductTabs, Banner, ProductRail, Testimonials],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (content(); as c) {
      @for (s of c.sections; track $index) {
        @switch (s.type) {
          @case ('hero') {
            <div class="container hero-wrap">
              <app-hero [slides]="c.slides" [rate]="rates()[0]" />
            </div>
          }
          @case ('trust') {
            <section class="container trust-wrap" aria-label="مزایای خرید">
              <app-trust [features]="c.features" />
            </section>
          }
          @case ('categories') {
            <section class="container section">
              <app-category-grid [categories]="categories()" [title]="s.title" [subtitle]="s.subtitle" />
            </section>
          }
          @case ('product-tabs') {
            <section class="container section">
              <app-product-tabs [title]="s.title" [subtitle]="s.subtitle" [tabs]="s.tabs" />
            </section>
          }
          @case ('banner') {
            @if (banner(s.bannerId); as b) {
              <section class="container section-sm">
                <app-banner [banner]="b" />
              </section>
            }
          }
          @case ('banner-pair') {
            <section class="container section-sm pair">
              @for (id of s.bannerIds; track id) {
                @if (banner(id); as b) {
                  <app-banner [banner]="b" class="compact" />
                }
              }
            </section>
          }
          @case ('product-rail') {
            <section class="container section">
              <app-product-rail [title]="s.title" [subtitle]="s.subtitle" [query]="s.query" [link]="s.link" />
            </section>
          }
          @case ('testimonials') {
            <section class="testimonials section">
              <div class="container">
                <app-testimonials [title]="s.title" [subtitle]="s.subtitle" [items]="c.testimonials" />
              </div>
            </section>
          }
          @case ('brands') {
            <section class="container brands" [attr.aria-label]="s.title">
              <span class="b-title">{{ s.title }}</span>
              <ul>
                @for (b of c.brands; track b) {
                  <li>{{ b }}</li>
                }
              </ul>
            </section>
          }
        }
      }
    }
  `,
  styles: `
    .hero-wrap {
      padding-top: clamp(14px, 2.5vw, 28px);
    }
    .trust-wrap {
      padding-top: clamp(16px, 2.5vw, 28px);
    }
    .section-sm {
      padding-block: clamp(16px, 3vw, 32px);
    }
    .pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: clamp(12px, 2vw, 22px);
    }
    .testimonials {
      background: linear-gradient(180deg, transparent, var(--brand-softer) 30%, var(--brand-softer) 70%, transparent);
    }
    .brands {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding-block: 1.5rem 0;
      .b-title {
        flex: none;
        font-weight: 800;
        color: var(--muted);
        font-size: 0.88rem;
      }
      ul {
        flex: 1;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        gap: 1.5rem;
      }
      li {
        font-size: clamp(1.1rem, 2vw, 1.5rem);
        font-weight: 900;
        color: var(--muted);
        opacity: 0.55;
        transition: all var(--dur) var(--ease);
        &:hover {
          opacity: 1;
          color: var(--brand-text);
        }
      }
    }
    @media (max-width: 800px) {
      .pair {
        grid-template-columns: 1fr;
      }
      .brands {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `,
})
export class Home {
  private readonly api = inject(StoreApi);
  protected readonly content = toSignal(this.api.home());
  protected readonly categories = toSignal(this.api.categories(), { initialValue: [] });
  protected readonly rates = toSignal(this.api.goldRates(), { initialValue: [] });
  private readonly banners = computed(
    () => new Map((this.content()?.banners ?? []).map((b) => [b.id, b] as const)),
  );

  constructor() {
    const seo = inject(SeoService);
    seo.update({ path: '/', jsonLd: seo.organization() });
  }

  protected banner(id: string): PromoBanner | undefined {
    return this.banners().get(id);
  }
}
