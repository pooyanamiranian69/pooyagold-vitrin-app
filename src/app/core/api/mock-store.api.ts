import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ABOUT_CONTENT,
  ADDRESSES,
  CATEGORIES,
  FAQS,
  GOLD_RATES,
  HOME_CONTENT,
  ORDERS,
  PRODUCTS,
  USER_PROFILE,
} from '../data/mock-data';
import { GENDER_LABELS, METAL_LABELS, STONE_LABELS } from '../data/labels';
import {
  Category,
  Facets,
  FacetOption,
  Order,
  PricedProduct,
  ProductPage,
  ProductQuery,
} from '../models';
import { priceProduct } from '../utils/pricing';
import { StoreApi } from './store.api';

const normalize = (s: string) =>
  s
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/‌/g, ' ')
    .toLowerCase()
    .trim();

function facet<T extends string>(
  items: PricedProduct[],
  key: (p: PricedProduct) => T,
  labels?: Record<string, string>,
): FacetOption<T>[] {
  const counts = new Map<T, number>();
  for (const p of items) counts.set(key(p), (counts.get(key(p)) ?? 0) + 1);
  return [...counts.entries()].map(([value, count]) => ({
    value,
    count,
    label: labels?.[value] ?? value,
  }));
}

function range(values: number[]): [number, number] {
  return values.length ? [Math.min(...values), Math.max(...values)] : [0, 0];
}

@Injectable()
export class MockStoreApi extends StoreApi {
  private readonly rate18 = GOLD_RATES.find((r) => r.id === 'g18')!.price;
  private readonly priced: PricedProduct[] = PRODUCTS.map((p) => ({
    ...p,
    price: priceProduct(p, this.rate18),
  }));

  goldRates() {
    return of(GOLD_RATES);
  }

  categories() {
    return of([...CATEGORIES].sort((a, b) => a.order - b.order));
  }

  category(slug: string): Observable<Category | undefined> {
    return of(CATEGORIES.find((c) => c.slug === slug));
  }

  products(query: ProductQuery = {}): Observable<ProductPage> {
    const base = query.category
      ? this.priced.filter((p) => p.categorySlug === query.category)
      : this.priced;

    const q = query.q ? normalize(query.q) : '';
    let items = base.filter(
      (p) =>
        (!q || normalize(`${p.title} ${p.brand} ${p.description}`).includes(q)) &&
        (!query.genders?.length || query.genders.includes(p.gender)) &&
        (!query.metals?.length || query.metals.includes(p.metal)) &&
        (!query.stones?.length || query.stones.includes(p.stone)) &&
        (!query.brands?.length || query.brands.includes(p.brand)) &&
        (query.minPrice == null || p.price.total >= query.minPrice) &&
        (query.maxPrice == null || p.price.total <= query.maxPrice) &&
        (query.minWeight == null || p.weight >= query.minWeight) &&
        (query.maxWeight == null || p.weight <= query.maxWeight) &&
        (query.maxWage == null || p.wagePercent <= query.maxWage) &&
        (!query.inStock || p.stock > 0) &&
        (!query.discounted || p.discountPercent > 0) &&
        (!query.featured || p.featured) &&
        (!query.badge || p.badges.includes(query.badge)),
    );

    const sorters: Record<string, (a: PricedProduct, b: PricedProduct) => number> = {
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
      popular: (a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount,
      bestseller: (a, b) => b.soldCount - a.soldCount,
      'price-asc': (a, b) => a.price.total - b.price.total,
      'price-desc': (a, b) => b.price.total - a.price.total,
      'weight-asc': (a, b) => a.weight - b.weight,
      'weight-desc': (a, b) => b.weight - a.weight,
      'wage-asc': (a, b) => a.wagePercent - b.wagePercent,
    };
    if (query.sort) items = [...items].sort(sorters[query.sort]);

    const pageSize = query.pageSize ?? 12;
    const page = Math.max(1, query.page ?? 1);
    const facets: Facets = {
      price: range(base.map((p) => p.price.total)),
      weight: range(base.map((p) => p.weight)),
      wage: range(base.map((p) => p.wagePercent)),
      genders: facet(base, (p) => p.gender, GENDER_LABELS),
      metals: facet(base, (p) => p.metal, METAL_LABELS),
      stones: facet(base, (p) => p.stone, STONE_LABELS),
      brands: facet(base, (p) => p.brand),
    };

    return of({
      items: items.slice((page - 1) * pageSize, page * pageSize),
      total: items.length,
      page,
      pageSize,
      facets,
    });
  }

  product(slug: string) {
    return of(this.priced.find((p) => p.slug === slug));
  }

  productsBySlugs(slugs: string[]) {
    return of(slugs.map((s) => this.priced.find((p) => p.slug === s)).filter((p) => p !== undefined));
  }

  related(product: PricedProduct, limit = 8) {
    const score = (p: PricedProduct) =>
      (p.categorySlug === product.categorySlug ? 4 : 0) +
      (p.metal === product.metal ? 2 : 0) +
      (p.gender === product.gender ? 1 : 0) +
      (p.brand === product.brand ? 1 : 0);
    return of(
      this.priced
        .filter((p) => p.id !== product.id)
        .sort((a, b) => score(b) - score(a) || b.soldCount - a.soldCount)
        .slice(0, limit),
    );
  }

  search(term: string, limit = 6) {
    const q = normalize(term);
    if (!q) return of([]);
    return of(
      this.priced
        .filter((p) => normalize(`${p.title} ${p.brand}`).includes(q))
        .slice(0, limit),
    );
  }

  productSlugs() {
    return of(PRODUCTS.map((p) => p.slug));
  }

  categorySlugs() {
    return of(CATEGORIES.map((c) => c.slug));
  }

  home() {
    return of(HOME_CONTENT);
  }

  about() {
    return of(ABOUT_CONTENT);
  }

  faqs() {
    return of(FAQS);
  }

  profile() {
    return of(USER_PROFILE);
  }

  orders(): Observable<Order[]> {
    return of(
      ORDERS.map((o) => {
        const items = o.items.map((it) => ({
          ...it,
          price: this.priced.find((p) => p.slug === it.productSlug)!.price.total,
        }));
        return { ...o, items, total: items.reduce((s, it) => s + it.price * it.qty, 0) };
      }),
    );
  }

  addresses() {
    return of(ADDRESSES);
  }
}
