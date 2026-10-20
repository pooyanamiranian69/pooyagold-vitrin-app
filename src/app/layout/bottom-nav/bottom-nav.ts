import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { UiService } from '../../core/services/ui.service';
import { Icon } from '../../shared/icon/icon';
import { FaPipe } from '../../shared/pipes';

/** نوار ناوبری پایین در موبایل (حس اپلیکیشن در PWA) */
@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, Icon, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="ناوبری سریع">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <app-icon name="home" /><span>خانه</span>
      </a>
      <a routerLink="/shop" routerLinkActive="active"><app-icon name="gem" /><span>فروشگاه</span></a>
      <button type="button" (click)="ui.searchOpen.set(true)"><app-icon name="search" /><span>جستجو</span></button>
      <button type="button" (click)="ui.cartOpen.set(true)">
        <span class="ic">
          <app-icon name="bag" />
          @if (cart.count()) {
            <span class="count-badge">{{ cart.count() | fa }}</span>
          }
        </span>
        <span>سبد</span>
      </button>
      <a routerLink="/account" routerLinkActive="active"><app-icon name="user" /><span>حساب</span></a>
    </nav>
  `,
  styles: `
    :host {
      display: none;
    }
    @media (max-width: 900px) {
      :host {
        display: block;
        position: fixed;
        z-index: 60;
        inset-inline: 10px;
        bottom: calc(10px + env(safe-area-inset-bottom));
      }
    }
    nav {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      height: 64px;
      padding-inline: 4px;
      border-radius: 22px;
      background: var(--glass);
      backdrop-filter: saturate(1.6) blur(18px);
      -webkit-backdrop-filter: saturate(1.6) blur(18px);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
    }
    a,
    button {
      position: relative;
      display: grid;
      justify-items: center;
      align-content: center;
      gap: 2px;
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--muted);
      transition: color var(--dur) var(--ease);
      app-icon {
        width: 22px;
        height: 22px;
        transition: transform var(--dur) var(--ease-spring);
      }
      &.active {
        color: var(--brand-text);
        app-icon {
          transform: translateY(-2px);
        }
        &::before {
          content: '';
          position: absolute;
          top: 6px;
          width: 34px;
          height: 34px;
          border-radius: 12px;
          background: var(--brand-soft);
          z-index: -1;
        }
      }
    }
    .ic {
      position: relative;
      .count-badge {
        top: -6px;
        inset-inline-end: -10px;
      }
    }
  `,
})
export class BottomNav {
  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
}
