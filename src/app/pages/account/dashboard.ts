import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { StoreApi } from '../../core/api/store.api';
import { ORDER_STATUS } from '../../core/data/labels';
import { CartService } from '../../core/services/cart.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Icon } from '../../shared/icon/icon';
import { FaPipe, TomanPipe } from '../../shared/pipes';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Icon, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="welcome panel">
      <div>
        <h1>سلام {{ profile()?.firstName }}، خوش آمدید 👋</h1>
        <p class="muted">از اینجا سفارش‌ها، علاقه‌مندی‌ها و تنظیمات ظاهری سایت را مدیریت کنید.</p>
      </div>
      <a routerLink="/account/settings" class="btn btn-soft"><app-icon name="palette" /> شخصی‌سازی ظاهر</a>
    </div>

    <div class="stats">
      @for (s of stats(); track s.label) {
        <a class="stat" [routerLink]="s.link">
          <span class="ic"><app-icon [name]="s.icon" /></span>
          <span>
            <strong>{{ s.value | fa }}</strong>
            <small>{{ s.label }}</small>
          </span>
        </a>
      }
    </div>

    <div class="panel">
      <div class="p-head">
        <h2>آخرین سفارش‌ها</h2>
        <a routerLink="/account/orders" class="link">همه سفارش‌ها <app-icon name="arrow-left" /></a>
      </div>
      <div class="table">
        @for (o of orders().slice(0, 3); track o.id) {
          <a class="tr" routerLink="/account/orders">
            <span class="thumbs">
              @for (it of o.items.slice(0, 2); track it.productSlug) {
                <img [src]="it.image" [alt]="it.title" width="44" height="44" />
              }
            </span>
            <span><small>شماره</small>{{ o.id | fa }}</span>
            <span><small>تاریخ</small>{{ o.date | fa }}</span>
            <span><small>مبلغ</small>{{ o.total | toman }} ت</span>
            <span class="status {{ status[o.status].tone }}">{{ status[o.status].label }}</span>
          </a>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      gap: 1.25rem;
    }
    .welcome {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      background: linear-gradient(135deg, var(--brand-softer), var(--surface));
      h1 {
        font-size: 1.35rem;
      }
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1.1rem;
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      transition: all var(--dur) var(--ease);
      &:hover {
        border-color: var(--brand-line);
        transform: translateY(-3px);
      }
      > span:last-child {
        display: grid;
        line-height: 1.4;
      }
      strong {
        font-size: 1.35rem;
        font-weight: 900;
      }
      small {
        color: var(--muted);
        font-size: 0.8rem;
      }
    }
    .ic {
      display: grid;
      place-items: center;
      width: 46px;
      height: 46px;
      border-radius: var(--radius);
      background: var(--brand-soft);
      color: var(--brand-text);
    }
    .p-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      h2 {
        font-size: 1.1rem;
      }
      .link {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.86rem;
        font-weight: 700;
        color: var(--brand-text);
        app-icon {
          width: 17px;
        }
      }
    }
    .table {
      display: grid;
      gap: 0.5rem;
    }
    .tr {
      display: grid;
      grid-template-columns: 100px repeat(3, 1fr) auto;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      font-size: 0.88rem;
      font-weight: 700;
      transition: background-color var(--dur) var(--ease);
      &:hover {
        background: var(--surface-2);
      }
      span {
        display: grid;
      }
      small {
        font-weight: 500;
        color: var(--muted);
        font-size: 0.74rem;
      }
    }
    .thumbs {
      display: flex !important;
      img {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: var(--surface-2);
        border: 2px solid var(--surface);
        padding: 3px;
        & + img {
          margin-inline-start: -14px;
        }
      }
    }
    @media (max-width: 800px) {
      .stats {
        grid-template-columns: repeat(2, 1fr);
      }
      .tr {
        grid-template-columns: auto 1fr auto;
        span:nth-child(3) {
          display: none;
        }
        span:nth-child(4) {
          display: none;
        }
      }
    }
  `,
})
export class Dashboard {
  private readonly api = inject(StoreApi);
  private readonly favorites = inject(FavoritesService);
  private readonly cart = inject(CartService);
  protected readonly status = ORDER_STATUS;
  protected readonly profile = toSignal(this.api.profile());
  protected readonly orders = toSignal(this.api.orders(), { initialValue: [] });
  protected readonly stats = computed(() => [
    { label: 'سفارش‌ها', value: this.orders().length, icon: 'package', link: '/account/orders' },
    { label: 'علاقه‌مندی', value: this.favorites.count(), icon: 'heart', link: '/account/favorites' },
    { label: 'در سبد خرید', value: this.cart.count(), icon: 'bag', link: '/shop' },
    { label: 'امتیاز باشگاه', value: this.profile()?.clubPoints ?? 0, icon: 'award', link: '/account/profile' },
  ]);
}
