import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { UiService } from './core/services/ui.service';
import { BottomNav } from './layout/bottom-nav/bottom-nav';
import { CartDrawer } from './layout/cart-drawer/cart-drawer';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { MobileMenu } from './layout/mobile-menu/mobile-menu';
import { SearchOverlay } from './layout/search/search-overlay';
import { Toasts } from './layout/toasts/toasts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, BottomNav, Toasts, MobileMenu, SearchOverlay, CartDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#main">رفتن به محتوای اصلی</a>
    <app-header />
    <main id="main">
      <router-outlet />
    </main>
    <app-footer />
    <app-bottom-nav />
    <app-toasts />

    @if (ui.menuOpen()) {
      <app-mobile-menu />
    }
    @if (ui.searchOpen()) {
      <app-search-overlay />
    }
    @if (ui.cartOpen()) {
      <app-cart-drawer />
    }
  `,
  styles: `
    main {
      min-height: 60vh;
    }
    .skip {
      position: absolute;
      top: -100px;
      inset-inline-start: 1rem;
      z-index: 200;
      padding: 0.6rem 1rem;
      border-radius: var(--radius-sm);
      background: var(--brand);
      color: var(--on-brand);
      font-weight: 700;
      &:focus {
        top: 1rem;
      }
    }
  `,
})
export class App {
  protected readonly ui = inject(UiService);
  // تم ذخیره‌شده از همان ابتدا اعمال شود
  private readonly theme = inject(ThemeService);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => this.ui.hydrated.set(true));
    // جلوگیری از اسکرول صفحه زیر پنل‌های باز
    effect(() => {
      const locked = this.ui.menuOpen() || this.ui.cartOpen() || this.ui.searchOpen();
      this.doc.body.style.overflow = locked ? 'hidden' : '';
    });
  }
}
