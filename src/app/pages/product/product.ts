import {
  ChangeDetectionStrategy,
  Component,
  RESPONSE_INIT,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import { StoreApi } from '../../core/api/store.api';
import { SITE_CONFIG } from '../../core/config/site.config';
import { BADGE_LABELS, METAL_LABELS, STONE_LABELS } from '../../core/data/labels';
import { PricedProduct } from '../../core/models';
import { CartService } from '../../core/services/cart.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb';
import { Icon } from '../../shared/icon/icon';
import { FaPipe, TomanPipe, faDigits } from '../../shared/pipes';
import { ProductCard } from '../../shared/product-card/product-card';
import { Rail } from '../../shared/rail/rail';

interface ProductView {
  product?: PricedProduct;
  related: PricedProduct[];
  categoryTitle?: string;
}

@Component({
  selector: 'app-product-page',
  imports: [RouterLink, Breadcrumb, Icon, ProductCard, Rail, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class ProductPage {
  private readonly api = inject(StoreApi);
  private readonly seo = inject(SeoService);
  private readonly config = inject(SITE_CONFIG);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  protected readonly cart = inject(CartService);
  protected readonly favorites = inject(FavoritesService);
  private readonly toast = inject(ToastService);

  protected readonly badgeLabels = BADGE_LABELS;
  protected readonly metalLabels = METAL_LABELS;
  protected readonly stoneLabels = STONE_LABELS;
  protected readonly rates = toSignal(this.api.goldRates(), { initialValue: [] });

  /** پارامتر مسیر به‌صورت Observable خوانده می‌شود؛ با داده همگام، محتوا در اولین رندر (SSR و hydration) آماده است */
  protected readonly view = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map((p) => p.get('slug') ?? ''),
      switchMap((slug) => this.api.product(slug)),
      switchMap((product) =>
        product
          ? this.api.related(product, 10).pipe(
              switchMap((related) =>
                this.api.category(product.categorySlug).pipe(
                  map((c) => ({ product, related, categoryTitle: c?.title }) as ProductView),
                ),
              ),
            )
          : of({ related: [] } as ProductView),
      ),
      tap((v) => this.updateSeo(v)),
    ),
  );

  protected readonly activeImage = linkedSignal({
    source: () => this.view()?.product?.slug,
    computation: () => 0,
  });
  protected readonly qty = linkedSignal({ source: () => this.view()?.product?.slug, computation: () => 1 });
  protected readonly size = linkedSignal<string | undefined, string>({
    source: () => this.view()?.product?.slug,
    computation: () => '54',
  });
  protected readonly tab = signal<'desc' | 'specs' | 'reviews'>('desc');
  protected readonly showBreakdown = signal(false);
  protected readonly zoom = signal<{ x: number; y: number } | null>(null);

  protected readonly sizes = ['48', '50', '52', '54', '56', '58', '60', '62'];

  protected readonly isFav = computed(() => {
    const p = this.view()?.product;
    return !!p && this.favorites.slugs().includes(p.slug);
  });

  protected readonly discountPct = computed(() => {
    const p = this.view()?.product?.price;
    return p && p.totalBeforeDiscount > p.total
      ? Math.round((1 - p.total / p.totalBeforeDiscount) * 100)
      : 0;
  });

  protected readonly reviews = computed(() => {
    const p = this.view()?.product;
    if (!p) return [];
    return [
      { name: 'مهسا ر.', date: '۱۴۰۵/۰۷/۰۲', rating: 5, text: `${p.title} دقیقا مثل عکس‌ها بود. ظرافت ساخت عالیه و بسته‌بندی خیلی شیک بود.` },
      { name: 'حمید ک.', date: '۱۴۰۵/۰۶/۱۸', rating: 5, text: 'برای هدیه گرفتم، فاکتور و شناسنامه همراهش بود. ارسال هم سریع انجام شد.' },
      { name: 'زهرا م.', date: '۱۴۰۵/۰۵/۲۹', rating: 4, text: 'کیفیت خوب و قیمت منصفانه. فقط کاش رنگ‌بندی بیشتری داشت.' },
    ];
  });

  protected readonly ratingBars = computed(() => {
    const p = this.view()?.product;
    const base = p ? Math.round(p.rating * 20) : 0;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      pct: star === 5 ? base : star === 4 ? Math.round((100 - base) * 0.7) : Math.round((100 - base) * 0.1),
    }));
  });

  protected onZoom(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    this.zoom.set({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }

  protected addToCart(p: PricedProduct) {
    this.cart.add(p, this.qty());
  }

  protected async share(p: PricedProduct) {
    const url = `${this.config.url}/product/${p.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: p.title, url });
      else {
        await navigator.clipboard.writeText(url);
        this.toast.show('لینک محصول کپی شد', 'share');
      }
    } catch {
      /* لغو اشتراک‌گذاری */
    }
  }

  private updateSeo(v: ProductView) {
    const p = v.product;
    if (!p) {
      if (this.responseInit) this.responseInit.status = 404;
      this.seo.update({ title: 'محصول پیدا نشد', path: '/404', noindex: true });
      return;
    }
    const path = `/product/${p.slug}`;
    this.seo.update({
      title: faDigits(`${p.title} | ${p.weight} گرم طلای ${p.karat} عیار`),
      description: faDigits(`${p.description} وزن ${p.weight} گرم، اجرت ${p.wagePercent}٪، طلای ${METAL_LABELS[p.metal]} ${p.karat} عیار با ضمانت اصالت.`),
      path,
      image: p.images[0],
      type: 'product',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.title,
          image: p.images.map((i) => this.config.url + i),
          description: p.description,
          sku: p.specs[0]?.value,
          brand: { '@type': 'Brand', name: p.brand },
          material: `طلای ${p.karat} عیار`,
          weight: { '@type': 'QuantitativeValue', value: p.weight, unitCode: 'GRM' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewCount },
          offers: {
            '@type': 'Offer',
            url: this.config.url + path,
            priceCurrency: 'IRR',
            price: p.price.total * 10,
            availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        },
        this.seo.breadcrumbs([
          { name: 'خانه', path: '/' },
          { name: v.categoryTitle ?? 'فروشگاه', path: `/shop/${p.categorySlug}` },
          { name: p.title, path },
        ]),
      ],
    });
  }
}
