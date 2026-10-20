import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { StoreApi } from '../../core/api/store.api';
import { SeoService } from '../../core/services/seo.service';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb';
import { Icon } from '../../shared/icon/icon';
import { FaPipe } from '../../shared/pipes';

@Component({
  selector: 'app-account-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Breadcrumb, Icon, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <app-breadcrumb [items]="[{ label: 'حساب کاربری', link: '/account' }, { label: title() }]" />
      <div class="layout">
        <aside class="side">
          @if (profile(); as u) {
            <div class="user">
              <span class="avatar">{{ u.firstName.charAt(0) }}</span>
              <div>
                <strong>{{ u.firstName }} {{ u.lastName }}</strong>
                <small class="ltr">{{ u.phone | fa }}</small>
              </div>
            </div>
            <div class="club">
              <app-icon name="award" />
              <span>
                <small>باشگاه مشتریان · سطح {{ u.tier }}</small>
                <strong>{{ u.clubPoints | fa }} امتیاز</strong>
              </span>
            </div>
          }
          <nav>
            @for (l of links; track l.link) {
              <a [routerLink]="l.link" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: l.link === '/account' }">
                <app-icon [name]="l.icon" /> {{ l.label }}
              </a>
            }
            <a routerLink="/login" class="logout"><app-icon name="logout" /> خروج از حساب</a>
          </nav>
        </aside>
        <section class="content">
          <router-outlet />
        </section>
      </div>
    </div>
  `,
  styles: `
    .page {
      padding-top: 1.25rem;
    }
    .layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.5rem;
      margin-top: 1.25rem;
      align-items: start;
    }
    .side {
      position: sticky;
      top: calc(var(--header-h) + 66px);
      display: grid;
      gap: 1rem;
      padding: 1.1rem;
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
    }
    .user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      div {
        display: grid;
        line-height: 1.6;
      }
      small {
        color: var(--muted);
      }
    }
    .avatar {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--brand-gradient);
      color: var(--on-brand);
      font-size: 1.3rem;
      font-weight: 900;
    }
    .club {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem;
      border-radius: var(--radius);
      background:
        radial-gradient(circle at 0 0, color-mix(in oklab, var(--brand) 45%, transparent), transparent 70%),
        #17140f;
      color: #f4efe7;
      app-icon {
        color: var(--brand);
        width: 28px;
        height: 28px;
      }
      span {
        display: grid;
        line-height: 1.5;
      }
      small {
        color: #bdb3a3;
        font-size: 0.74rem;
      }
    }
    nav {
      display: grid;
      gap: 0.15rem;
      a {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.7rem 0.8rem;
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: 0.92rem;
        color: var(--text-2);
        transition: all var(--dur) var(--ease);
        app-icon {
          width: 19px;
          height: 19px;
          color: var(--muted);
        }
        &:hover {
          background: var(--surface-2);
          color: var(--text);
        }
        &.active {
          background: var(--brand-soft);
          color: var(--brand-text);
          app-icon {
            color: var(--brand-text);
          }
        }
      }
      .logout {
        margin-top: 0.4rem;
        border-top: 1px solid var(--border);
        border-radius: 0;
        color: var(--danger);
        app-icon {
          color: var(--danger);
        }
      }
    }
    .content {
      min-width: 0;
      animation: rise var(--dur-slow) var(--ease);
    }
    @media (max-width: 1000px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .side {
        position: static;
      }
      nav {
        display: flex;
        overflow-x: auto;
        scrollbar-width: none;
        a {
          flex: none;
          white-space: nowrap;
        }
        .logout {
          margin: 0;
          border: 0;
        }
      }
    }
  `,
})
export class AccountLayout {
  protected readonly profile = toSignal(inject(StoreApi).profile());
  protected readonly links = [
    { label: 'داشبورد', link: '/account', icon: 'dashboard' },
    { label: 'سفارش‌ها', link: '/account/orders', icon: 'package' },
    { label: 'علاقه‌مندی‌ها', link: '/account/favorites', icon: 'heart' },
    { label: 'آدرس‌ها', link: '/account/addresses', icon: 'pin' },
    { label: 'اطلاعات حساب', link: '/account/profile', icon: 'user' },
    { label: 'تنظیمات ظاهری', link: '/account/settings', icon: 'palette' },
  ];

  private readonly router = inject(Router);
  protected readonly title = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let r: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
        while (r.firstChild) r = r.firstChild;
        return (r.data['title'] as string) ?? 'داشبورد';
      }),
    ),
    { initialValue: 'داشبورد' },
  );

  constructor() {
    const seo = inject(SeoService);
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd), startWith(null)).subscribe(() => {
      seo.update({ title: this.title() + ' | حساب کاربری', path: this.router.url.split('?')[0], noindex: true });
    });
  }
}
