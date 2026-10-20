import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StoreApi } from '../../core/api/store.api';
import { SITE_CONFIG } from '../../core/config/site.config';
import { ThemeService } from '../../core/services/theme.service';
import { UiService } from '../../core/services/ui.service';
import { Icon } from '../../shared/icon/icon';
import { Logo } from '../../shared/logo/logo';
import { FaPipe } from '../../shared/pipes';

@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink, RouterLinkActive, Icon, Logo, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" (click)="ui.menuOpen.set(false)"></div>
    <aside class="drawer start" role="dialog" aria-modal="true" aria-label="منو">
      <div class="drawer-head">
        <app-logo />
        <button type="button" class="icon-btn" (click)="ui.menuOpen.set(false)" aria-label="بستن">
          <app-icon name="x" />
        </button>
      </div>

      <nav class="links">
        @for (item of config.nav; track item.link) {
          @if (item.children) {
            <button type="button" class="link" (click)="shopOpen.set(!shopOpen())" [attr.aria-expanded]="shopOpen()">
              <app-icon [name]="item.icon ?? 'gem'" /> {{ item.label }}
              <app-icon name="chevron-down" class="caret" />
            </button>
            @if (shopOpen()) {
              <div class="cats">
                @for (c of categories(); track c.id) {
                  <a [routerLink]="['/shop', c.slug]" class="cat">
                    <img [src]="c.image" [alt]="c.title" width="48" height="48" loading="lazy" />
                    {{ c.title }}
                  </a>
                }
              </div>
            }
          } @else {
            <a
              class="link"
              [routerLink]="item.link"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.link === '/' }"
            >
              <app-icon [name]="item.icon ?? 'gem'" /> {{ item.label }}
            </a>
          }
        }
        <a class="link" routerLink="/account" routerLinkActive="active"><app-icon name="user" /> حساب کاربری</a>
        <a class="link" routerLink="/account/settings" routerLinkActive="active"><app-icon name="palette" /> تنظیمات ظاهری</a>
      </nav>

      <div class="foot">
        <div class="mode">
          @for (m of modes; track m.value) {
            <button
              type="button"
              [class.active]="theme.settings().mode === m.value"
              (click)="theme.update({ mode: m.value })"
            >
              <app-icon [name]="m.icon" /> {{ m.label }}
            </button>
          }
        </div>
        <a [href]="'tel:' + config.phone" class="call">
          <app-icon name="phone" />
          <span>
            <small>مشاوره و خرید تلفنی</small>
            <strong class="ltr">{{ config.phone | fa }}</strong>
          </span>
        </a>
      </div>
    </aside>
  `,
  styles: `
    .links {
      flex: 1;
      overflow-y: auto;
      padding: 0.75rem;
      display: grid;
      align-content: start;
      gap: 0.15rem;
    }
    .link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.8rem 0.9rem;
      border-radius: var(--radius);
      font-weight: 600;
      color: var(--text-2);
      transition: background-color var(--dur) var(--ease);
      app-icon {
        color: var(--brand-text);
      }
      &.active,
      &:hover {
        background: var(--surface-2);
        color: var(--text);
      }
      .caret {
        margin-inline-start: auto;
        color: var(--muted);
        transition: transform var(--dur) var(--ease);
      }
      &[aria-expanded='true'] .caret {
        transform: rotate(180deg);
      }
    }
    .cats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      padding: 0.25rem 0.5rem 0.75rem;
      animation: rise var(--dur) var(--ease);
    }
    .cat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem;
      border-radius: var(--radius-sm);
      background: var(--surface-2);
      font-size: 0.86rem;
      font-weight: 600;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .foot {
      padding: 1rem;
      border-top: 1px solid var(--border);
      display: grid;
      gap: 0.75rem;
    }
    .mode {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 0.25rem;
      border-radius: var(--radius-pill);
      background: var(--surface-2);
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        height: 38px;
        border-radius: var(--radius-pill);
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--muted);
        app-icon {
          width: 16px;
          height: 16px;
        }
        &.active {
          background: var(--surface);
          color: var(--text);
          box-shadow: var(--shadow-sm);
        }
      }
    }
    .call {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--radius);
      background: var(--brand-soft);
      > app-icon {
        color: var(--brand-text);
      }
      span {
        display: grid;
        line-height: 1.4;
      }
      small {
        color: var(--muted);
        font-size: 0.75rem;
      }
    }
  `,
})
export class MobileMenu {
  protected readonly config = inject(SITE_CONFIG);
  protected readonly ui = inject(UiService);
  protected readonly theme = inject(ThemeService);
  protected readonly categories = toSignal(inject(StoreApi).categories(), { initialValue: [] });
  protected readonly shopOpen = signal(true);
  protected readonly modes = [
    { value: 'light' as const, label: 'روز', icon: 'sun' },
    { value: 'dark' as const, label: 'شب', icon: 'moon' },
    { value: 'system' as const, label: 'خودکار', icon: 'monitor' },
  ];
}
