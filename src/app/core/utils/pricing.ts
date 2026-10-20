import { PriceBreakdown, Product } from '../models';

/** نرخ مالیات بر ارزش افزوده (روی اجرت و سود) */
export const VAT_RATE = 0.1;

const round = (n: number) => Math.round(n / 1000) * 1000;

/**
 * محاسبه قیمت نهایی طلا بر اساس فرمول رایج بازار:
 * (وزن × نرخ روز) + اجرت − تخفیف اجرت + سود + مالیات (اجرت و سود) + سنگ
 */
export function priceProduct(p: Product, rate18: number): PriceBreakdown {
  const goldValue = p.weight * rate18 * (p.karat / 18);
  const calc = (discountPercent: number) => {
    const wage = goldValue * (p.wagePercent / 100);
    const wageDiscount = wage * (discountPercent / 100);
    const netWage = wage - wageDiscount;
    const profit = (goldValue + netWage) * (p.profitPercent / 100);
    const tax = (netWage + profit) * VAT_RATE;
    return { wage, wageDiscount, profit, tax, total: goldValue + netWage + profit + tax + p.stonePrice };
  };
  const now = calc(p.discountPercent);
  const before = calc(0);
  return {
    goldValue: round(goldValue),
    wage: round(now.wage),
    wageDiscount: round(now.wageDiscount),
    profit: round(now.profit),
    tax: round(now.tax),
    stonePrice: p.stonePrice,
    total: round(now.total),
    totalBeforeDiscount: round(before.total),
  };
}
