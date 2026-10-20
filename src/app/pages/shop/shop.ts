import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { StoreApi } from '../../core/api/store.api';
import { GENDER_LABELS, METAL_LABELS, SORT_OPTIONS, STONE_LABELS } from '../../core/data/labels';
import { SortKey } from '../../core/models';
import { SeoService } from '../../core/services/seo.service';
import { StorageService } from '../../core/services/storage.service';
import { UiService } from '../../core/services/ui.service';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb';
import { Icon } from '../../shared/icon/icon';
import { FaPipe } from '../../shared/pipes';
import { ProductCard } from '../../shared/product-card/product-card';
import { ShopFilters } from './shop-filters';
import { DEFAULT_STATE, PAGE_SIZE, ShopState, parseState, toParams, toQuery } from './shop-state';

@Component({
  selector: 'app-shop',
  imports: [RouterLink, Breadcrumb, Icon, ProductCard, ShopFilters, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop {
  /** پارامتر مسیر /shop/:category */
  readonly category = input<string>();

  private readonly api = inject(StoreApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ui = inject(UiService);
  private readonly storage = inject(StorageService);
  private readonly seo = inject(SeoService);

  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly state = signal<ShopState>(DEFAULT_STATE);
  protected readonly view = signal<'grid' | 'list'>('grid');
  protected readonly filtersOpen = signal(false);

  protected readonly categories = toSignal(this.api.categories(), { initialValue: [] });
  protected readonly current = computed(() =>
    this.categories().find((c) => c.slug === this.category()),
  );
  protected readonly unknownCategory = computed(() => !!this.category() && !this.current());

  private readonly query = computed(() => toQuery(this.state(), this.category()));
  protected readonly result = toSignal(
    toObservable(this.query).pipe(switchMap((q) => this.api.products(q))),
  );

  protected readonly pages = computed(() => {
    const total = this.result()?.total ?? 0;
    return Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, i) => i + 1);
  });

  /** چیپ‌های فیلترهای فعال */
  protected readonly activeFilters = computed(() => {
    const s = this.state();
    const chips: { label: string; patch: Partial<ShopState> }[] = [];
    if (s.q) chips.push({ label: `جستجو: ${s.q}`, patch: { q: '' } });
    s.genders.forEach((g) => chips.push({ label: GENDER_LABELS[g], patch: { genders: s.genders.filter((x) => x !== g) } }));
    s.metals.forEach((m) => chips.push({ label: `طلای ${METAL_LABELS[m]}`, patch: { metals: s.metals.filter((x) => x !== m) } }));
    s.stones.forEach((st) => chips.push({ label: STONE_LABELS[st], patch: { stones: s.stones.filter((x) => x !== st) } }));
    s.brands.forEach((b) => chips.push({ label: `برند ${b}`, patch: { brands: s.brands.filter((x) => x !== b) } }));
    if (s.price) chips.push({ label: 'محدوده قیمت', patch: { price: null } });
    if (s.weight) chips.push({ label: 'محدوده وزن', patch: { weight: null } });
    if (s.maxWage != null) chips.push({ label: `اجرت تا ${s.maxWage}٪`, patch: { maxWage: null } });
    if (s.inStock) chips.push({ label: 'فقط موجود', patch: { inStock: false } });
    if (s.discounted) chips.push({ label: 'تخفیف‌دار', patch: { discounted: false } });
    return chips;
  });

  constructor() {
    // فیلترهای Query String بعد از hydration اعمال می‌شوند تا HTML پیش‌رندر شده با کلاینت یکسان بماند
    const destroyRef = inject(DestroyRef);
    const listen = () => {
      const sub = this.route.queryParamMap.subscribe((p) => this.state.set(parseState(p)));
      destroyRef.onDestroy(() => sub.unsubscribe());
      this.view.set(this.storage.get<'grid' | 'list'>('pg-view', 'grid'));
    };
    if (this.ui.hydrated()) listen();
    else afterNextRender(listen);

    effect(() => {
      const c = this.current();
      const slug = this.category();
      untracked(() => this.updateSeo(slug, c?.title, c?.subtitle));
    });
  }

  protected apply(patch: Partial<ShopState>, keepPage = false) {
    const next = { ...this.state(), ...patch, ...(keepPage ? {} : { page: 1 }) };
    this.state.set(next);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: toParams(next),
      replaceUrl: true,
    });
  }

  protected setSort(sort: string) {
    this.apply({ sort: sort as SortKey });
  }

  protected goPage(page: number) {
    this.apply({ page }, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected clearAll() {
    this.apply({ ...DEFAULT_STATE, sort: this.state().sort });
  }

  protected setView(v: 'grid' | 'list') {
    this.view.set(v);
    this.storage.set('pg-view', v);
  }

  private updateSeo(slug?: string, title?: string, subtitle?: string) {
    const path = slug ? `/shop/${slug}` : '/shop';
    const name = title ? `خرید ${title} طلا` : 'فروشگاه طلا و جواهر';
    this.seo.update({
      title: name,
      description: title
        ? `خرید آنلاین ${title} طلا ۱۸ عیار؛ ${subtitle}. مشاهده قیمت لحظه‌ای، وزن و اجرت، با ضمانت اصالت و ارسال بیمه‌شده.`
        : undefined,
      path,
      jsonLd: this.seo.breadcrumbs([
        { name: 'خانه', path: '/' },
        { name: 'فروشگاه', path: '/shop' },
        ...(title ? [{ name: title, path }] : []),
      ]),
    });
  }
}
