import { Pipe, PipeTransform } from '@angular/core';

export const faDigits = (s: string) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
const intFormat = new Intl.NumberFormat('fa-IR');
const decFormat = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 });

/** نمایش اعداد و رشته‌ها با ارقام فارسی */
@Pipe({ name: 'fa' })
export class FaPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value == null) return '';
    if (typeof value === 'number') return decFormat.format(value);
    return faDigits(value);
  }
}

/** قیمت به تومان با جداکننده هزارگان */
@Pipe({ name: 'toman' })
export class TomanPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return value == null ? '' : intFormat.format(Math.round(value));
  }
}
