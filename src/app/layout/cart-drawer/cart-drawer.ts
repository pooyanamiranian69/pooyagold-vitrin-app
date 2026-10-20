import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { UiService } from '../../core/services/ui.service';
import { Icon } from '../../shared/icon/icon';
import { FaPipe, TomanPipe } from '../../shared/pipes';

@Component({
  selector: 'app-cart-drawer',
  imports: [RouterLink, Icon, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" (click)="ui.cartOpen.set(false)"></div>
    <aside class="drawer end" role="dialog" aria-modal="true" aria-label="سبد خرید">
      <div class="drawer-head">
        <h3>سبد خرید <span class="muted">({{ cart.count() | fa }})</span></h3>
        <button type="button" class="icon-btn" (click)="ui.cartOpen.set(false)" aria-label="بستن">
          <app-icon name="x" />
        </button>
      </div>

      @if (cart.lines().length) {
        <ul class="lines">
          @for (l of cart.lines(); track l.slug) {
            <li>
              <a [routerLink]="['/product', l.slug]" class="thumb">
                <img [src]="l.image" [alt]="l.title" width="80" height="80" />
              </a>
              <div class="info">
                <a [routerLink]="['/product', l.slug]" class="title">{{ l.title }}</a>
                <span class="muted">{{ l.weight | fa }} گرم</span>
                <span class="price">{{ l.price * l.qty | toman }} <small>تومان</small></span>
              </div>
              <div class="qty">
                <button type="button" (click)="cart.setQty(l.slug, l.qty + 1)" aria-label="افزایش">
                  <app-icon name="plus" />
                </button>
                <span>{{ l.qty | fa }}</span>
                <button type="button" (click)="cart.setQty(l.slug, l.qty - 1)" aria-label="کاهش">
                  <app-icon [name]="l.qty === 1 ? 'trash' : 'minus'" />
                </button>
              </div>
            </li>
          }
        </ul>
        <div class="summary">
          <div class="row"><span>وزن کل طلا</span><strong>{{ cart.weight() | fa }} گرم</strong></div>
          <div class="row"><span>هزینه ارسال</span><strong class="ok">رایگان</strong></div>
          <div class="row total">
            <span>جمع کل</span>
            <strong>{{ cart.total() | toman }} <small>تومان</small></strong>
          </div>
          <button type="button" class="btn btn-primary btn-lg btn-block" (click)="checkout()">
            <app-icon name="lock" /> ادامه و تسویه حساب
          </button>
          <p class="note"><app-icon name="info" /> قیمت نهایی بر اساس نرخ لحظه پرداخت محاسبه می‌شود.</p>
        </div>
      } @else {
        <div class="empty">
          <span class="empty-icon"><app-icon name="bag" /></span>
          <h3>سبد خرید شما خالی است</h3>
          <p>از میان صدها طرح زیبا، محصول دلخواه خود را انتخاب کنید.</p>
          <a routerLink="/shop" class="btn btn-primary">مشاهده فروشگاه</a>
        </div>
      }
    </aside>
  `,
  styles: `
    .lines {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 1.25rem;
      li {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: 0.9rem;
        align-items: center;
        padding-block: 0.9rem;
        border-bottom: 1px solid var(--border);
        animation: rise var(--dur-slow) var(--ease) both;
      }
    }
    .thumb img {
      width: 80px;
      height: 80px;
      border-radius: var(--radius);
      background: var(--surface-2);
      padding: 6px;
    }
    .info {
      display: grid;
      gap: 0.15rem;
      min-width: 0;
      font-size: 0.82rem;
      .title {
        font-weight: 700;
        font-size: 0.92rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .qty {
      display: grid;
      justify-items: center;
      gap: 0.15rem;
      padding: 0.25rem;
      border-radius: var(--radius-pill);
      border: 1px solid var(--border);
      font-weight: 800;
      font-size: 0.88rem;
      button {
        display: grid;
        place-items: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: var(--text-2);
        &:hover {
          background: var(--surface-2);
        }
      }
      app-icon {
        width: 15px;
        height: 15px;
      }
    }
    .summary {
      padding: 1.25rem;
      border-top: 1px solid var(--border);
      background: var(--bg-soft);
      display: grid;
      gap: 0.6rem;
    }
    .row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--text-2);
      .ok {
        color: var(--success);
      }
      &.total {
        font-size: 1.05rem;
        color: var(--text);
        padding-top: 0.5rem;
        border-top: 1px dashed var(--border-strong);
        margin-bottom: 0.5rem;
        small {
          color: var(--muted);
          font-weight: 500;
        }
      }
    }
    .note {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      color: var(--muted);
      app-icon {
        width: 15px;
        height: 15px;
      }
    }
    .empty {
      flex: 1;
      align-content: center;
    }
  `,
})
export class CartDrawer {
  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);

  protected checkout() {
    this.toast.show('مرحله پرداخت به‌زودی فعال می‌شود', 'info');
  }
}
