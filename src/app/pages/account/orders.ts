import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { StoreApi } from '../../core/api/store.api';
import { ORDER_STATUS } from '../../core/data/labels';
import { OrderStatus } from '../../core/models';
import { Icon } from '../../shared/icon/icon';
import { FaPipe, TomanPipe } from '../../shared/pipes';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, Icon, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">
      <div class="head">
        <h1>سفارش‌های من</h1>
        <div class="tabs">
          <button type="button" [class.active]="!filter()" (click)="filter.set(null)">همه</button>
          @for (s of statuses; track s) {
            <button type="button" [class.active]="filter() === s" (click)="filter.set(s)">{{ status[s].label }}</button>
          }
        </div>
      </div>

      <div class="list">
        @for (o of visible(); track o.id) {
          <details class="order">
            <summary>
              <span class="ic"><app-icon name="package" /></span>
              <span class="meta">
                <strong>سفارش {{ o.id | fa }}</strong>
                <small>{{ o.date | fa }} · {{ o.items.length | fa }} کالا</small>
              </span>
              <span class="status {{ status[o.status].tone }}">{{ status[o.status].label }}</span>
              <strong class="total">{{ o.total | toman }} <small>تومان</small></strong>
              <app-icon name="chevron-down" class="caret" />
            </summary>
            <div class="items">
              @for (it of o.items; track it.productSlug) {
                <a [routerLink]="['/product', it.productSlug]" class="item">
                  <img [src]="it.image" [alt]="it.title" width="64" height="64" />
                  <span>
                    <strong>{{ it.title }}</strong>
                    <small>{{ it.weight | fa }} گرم · {{ it.qty | fa }} عدد</small>
                  </span>
                  <span class="price">{{ it.price * it.qty | toman }} ت</span>
                </a>
              }
              <div class="steps">
                @for (st of steps; track st.key; let i = $index) {
                  <span class="step" [class.done]="stepIndex(o.status) >= i" [class.cancel]="o.status === 'cancelled'">
                    <i></i>{{ st.label }}
                  </span>
                }
              </div>
            </div>
          </details>
        } @empty {
          <div class="empty">
            <span class="empty-icon"><app-icon name="package" /></span>
            <h3>سفارشی در این وضعیت ندارید</h3>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.25rem;
      h1 {
        font-size: 1.3rem;
      }
    }
    .list {
      display: grid;
      gap: 0.75rem;
    }
    .order {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      transition: border-color var(--dur) var(--ease);
      &[open] {
        border-color: var(--brand-line);
        .caret {
          transform: rotate(180deg);
        }
      }
    }
    summary {
      list-style: none;
      display: grid;
      grid-template-columns: auto 1fr auto auto auto;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      cursor: pointer;
      &::-webkit-details-marker {
        display: none;
      }
    }
    .ic {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius);
      background: var(--surface-2);
      color: var(--brand-text);
    }
    .meta {
      display: grid;
      small {
        color: var(--muted);
      }
    }
    .total small {
      color: var(--muted);
      font-weight: 500;
    }
    .caret {
      color: var(--muted);
      transition: transform var(--dur) var(--ease);
    }
    .items {
      padding: 0 1rem 1rem;
      display: grid;
      gap: 0.5rem;
      animation: rise var(--dur) var(--ease);
    }
    .item {
      display: grid;
      grid-template-columns: 64px 1fr auto;
      align-items: center;
      gap: 0.8rem;
      padding: 0.5rem;
      border-radius: var(--radius);
      background: var(--surface-2);
      img {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-sm);
        background: var(--surface);
        padding: 4px;
      }
      span {
        display: grid;
      }
      small {
        color: var(--muted);
      }
      .price {
        font-weight: 800;
      }
    }
    .steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin-top: 0.75rem;
    }
    .step {
      position: relative;
      display: grid;
      justify-items: center;
      gap: 0.4rem;
      font-size: 0.76rem;
      color: var(--muted);
      text-align: center;
      i {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--surface-3);
        z-index: 1;
      }
      &::before {
        content: '';
        position: absolute;
        top: 6px;
        right: 50%;
        width: 100%;
        height: 2px;
        background: var(--surface-3);
      }
      &:first-child::before {
        display: none;
      }
      &.done {
        color: var(--text);
        font-weight: 700;
        i,
        &::before {
          background: var(--success);
        }
      }
      &.cancel.done {
        i,
        &::before {
          background: var(--danger);
        }
      }
    }
    @media (max-width: 700px) {
      summary {
        grid-template-columns: auto 1fr auto;
        .total,
        .caret {
          display: none;
        }
      }
    }
  `,
})
export class Orders {
  protected readonly status = ORDER_STATUS;
  protected readonly statuses = Object.keys(ORDER_STATUS) as OrderStatus[];
  protected readonly filter = signal<OrderStatus | null>(null);
  private readonly orders = toSignal(inject(StoreApi).orders(), { initialValue: [] });
  protected readonly visible = computed(() =>
    this.orders().filter((o) => !this.filter() || o.status === this.filter()),
  );
  protected readonly steps = [
    { key: 'placed', label: 'ثبت سفارش' },
    { key: 'processing', label: 'آماده‌سازی' },
    { key: 'shipped', label: 'ارسال' },
    { key: 'delivered', label: 'تحویل' },
  ];

  protected stepIndex(s: OrderStatus) {
    return { cancelled: 0, processing: 1, shipped: 2, delivered: 3 }[s];
  }
}
