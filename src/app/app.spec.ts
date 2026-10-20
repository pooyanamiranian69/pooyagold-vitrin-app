import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { MockStoreApi } from './core/api/mock-store.api';
import { StoreApi } from './core/api/store.api';
import { PRODUCTS } from './core/data/mock-data';
import { priceProduct } from './core/utils/pricing';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), { provide: StoreApi, useClass: MockStoreApi }],
    }).compileComponents();
  });

  it('should create the app shell with header and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-header')).toBeTruthy();
    expect(el.querySelector('app-footer')).toBeTruthy();
  });
});

describe('priceProduct', () => {
  it('applies wage discount and keeps total below the undiscounted price', () => {
    const p = PRODUCTS.find((x) => x.discountPercent > 0)!;
    const price = priceProduct(p, 15_000_000);
    expect(price.wageDiscount).toBeGreaterThan(0);
    expect(price.total).toBeLessThan(price.totalBeforeDiscount);
  });

  it('adds gold value, net wage, profit, tax and stone', () => {
    const p = { ...PRODUCTS[0], weight: 1, karat: 18 as const, wagePercent: 10, profitPercent: 10, discountPercent: 0, stonePrice: 0 };
    const price = priceProduct(p, 10_000_000);
    // طلا ۱۰م + اجرت ۱م + سود ۱.۱م + مالیات ۰.۲۱م
    expect(price.total).toBe(12_310_000);
  });
});
