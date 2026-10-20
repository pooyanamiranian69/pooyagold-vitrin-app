import { ParamMap, Params } from '@angular/router';
import { Gender, Metal, ProductQuery, SortKey, Stone } from '../../core/models';

export interface ShopState {
  q: string;
  genders: Gender[];
  metals: Metal[];
  stones: Stone[];
  brands: string[];
  price: [number, number] | null;
  weight: [number, number] | null;
  maxWage: number | null;
  inStock: boolean;
  discounted: boolean;
  sort: SortKey;
  page: number;
}

export const DEFAULT_STATE: ShopState = {
  q: '',
  genders: [],
  metals: [],
  stones: [],
  brands: [],
  price: null,
  weight: null,
  maxWage: null,
  inStock: false,
  discounted: false,
  sort: 'popular',
  page: 1,
};

export const PAGE_SIZE = 12;

const list = <T extends string>(v: string | null) => (v ? (v.split(',') as T[]) : []);
const pair = (v: string | null): [number, number] | null => {
  const m = v?.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  return m ? [+m[1], +m[2]] : null;
};

/** وضعیت فیلترها از Query String (قابل اشتراک‌گذاری و قابل ایندکس) */
export function parseState(p: ParamMap): ShopState {
  return {
    q: p.get('q') ?? '',
    genders: list<Gender>(p.get('gender')),
    metals: list<Metal>(p.get('metal')),
    stones: list<Stone>(p.get('stone')),
    brands: list(p.get('brand')),
    price: pair(p.get('price')),
    weight: pair(p.get('weight')),
    maxWage: p.get('wage') ? +p.get('wage')! : null,
    inStock: p.get('stock') === '1',
    discounted: p.get('discounted') === '1',
    sort: (p.get('sort') as SortKey) ?? 'popular',
    page: Math.max(1, +(p.get('page') ?? 1) || 1),
  };
}

export function toParams(s: ShopState): Params {
  const join = (a: string[]) => (a.length ? a.join(',') : null);
  return {
    q: s.q || null,
    gender: join(s.genders),
    metal: join(s.metals),
    stone: join(s.stones),
    brand: join(s.brands),
    price: s.price ? s.price.join('-') : null,
    weight: s.weight ? s.weight.join('-') : null,
    wage: s.maxWage,
    stock: s.inStock ? 1 : null,
    discounted: s.discounted ? 1 : null,
    sort: s.sort === 'popular' ? null : s.sort,
    page: s.page > 1 ? s.page : null,
  };
}

export function toQuery(s: ShopState, category?: string): ProductQuery {
  return {
    category,
    q: s.q || undefined,
    genders: s.genders,
    metals: s.metals,
    stones: s.stones,
    brands: s.brands,
    minPrice: s.price?.[0],
    maxPrice: s.price?.[1],
    minWeight: s.weight?.[0],
    maxWeight: s.weight?.[1],
    maxWage: s.maxWage ?? undefined,
    inStock: s.inStock,
    discounted: s.discounted,
    sort: s.sort,
    page: s.page,
    pageSize: PAGE_SIZE,
  };
}
