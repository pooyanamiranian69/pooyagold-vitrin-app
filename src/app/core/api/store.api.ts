import { Observable } from 'rxjs';
import {
  AboutContent,
  Address,
  Category,
  Faq,
  GoldRate,
  HomeContent,
  Order,
  PricedProduct,
  ProductPage,
  ProductQuery,
  UserProfile,
} from '../models';

/**
 * قرارداد دسترسی به داده‌های فروشگاه.
 * کامپوننت‌ها فقط به این کلاس انتزاعی وابسته‌اند؛ پیاده‌سازی فعلی Mock است
 * و برای اتصال به بک‌اند کافی است یک HttpStoreApi با همین متدها ساخته و در app.config جایگزین شود.
 */
export abstract class StoreApi {
  abstract goldRates(): Observable<GoldRate[]>;
  abstract categories(): Observable<Category[]>;
  abstract category(slug: string): Observable<Category | undefined>;
  abstract products(query?: ProductQuery): Observable<ProductPage>;
  abstract product(slug: string): Observable<PricedProduct | undefined>;
  abstract productsBySlugs(slugs: string[]): Observable<PricedProduct[]>;
  abstract related(product: PricedProduct, limit?: number): Observable<PricedProduct[]>;
  abstract search(term: string, limit?: number): Observable<PricedProduct[]>;
  abstract productSlugs(): Observable<string[]>;
  abstract categorySlugs(): Observable<string[]>;

  abstract home(): Observable<HomeContent>;
  abstract about(): Observable<AboutContent>;
  abstract faqs(): Observable<Faq[]>;

  abstract profile(): Observable<UserProfile>;
  abstract orders(): Observable<Order[]>;
  abstract addresses(): Observable<Address[]>;
}
