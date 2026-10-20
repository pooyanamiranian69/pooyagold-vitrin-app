import { Injectable, signal } from '@angular/core';

/** وضعیت پنل‌ها و لایه‌های سراسری رابط کاربری */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly menuOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly cartOpen = signal(false);
  /** پس از اولین رندر کامل در مرورگر (پایان hydration) true می‌شود */
  readonly hydrated = signal(false);

  closeAll() {
    this.menuOpen.set(false);
    this.searchOpen.set(false);
    this.cartOpen.set(false);
  }
}
