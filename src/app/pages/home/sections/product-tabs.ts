import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { StoreApi } from '../../../core/api/store.api';
import { ProductQuery } from '../../../core/models';
import { Icon } from '../../../shared/icon/icon';
import { ProductCard } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-product-tabs',
  imports: [RouterLink, Icon, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-head">
      <div>
        <span class="eyebrow">پیشنهاد ما</span>
        <h2>{{ title() }}</h2>
        <p>{{ subtitle() }}</p>
      </div>
      <div class="tabs" role="tablist">
        @for (t of tabs(); track t.label; let i = $index) {
          <button type="button" role="tab" [class.active]="i === active()" [attr.aria-selected]="i === active()" (click)="active.set(i)">
            {{ t.label }}
          </button>
        }
      </div>
    </div>
    <div class="product-grid" role="tabpanel">
      @for (p of products(); track p.id; let i = $index) {
        <app-product-card [product]="p" class="item" [style.animation-delay.ms]="i * 50" />
      }
    </div>
    <div class="more">
      <a class="btn btn-outline" routerLink="/shop" [queryParams]="moreParams()">
        مشاهده همه محصولات <app-icon name="arrow-left" />
      </a>
    </div>
  `,
  styles: `
    .section-head {
      flex-wrap: wrap;
    }
    .item {
      animation: rise var(--dur-slow) var(--ease) both;
    }
    .more {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }
  `,
})
export class ProductTabs {
  private readonly api = inject(StoreApi);
  readonly title = input('');
  readonly subtitle = input('');
  readonly tabs = input.required<{ label: string; query: ProductQuery }[]>();
  protected readonly active = signal(0);

  private readonly query = computed(() => this.tabs()[this.active()]?.query ?? {});
  protected readonly products = toSignal(
    toObservable(this.query).pipe(
      switchMap((q) => this.api.products(q)),
      map((r) => r.items),
    ),
    { initialValue: [] },
  );
  protected readonly moreParams = computed(() => {
    const q = this.query();
    return {
      sort: q.sort ?? null,
      discounted: q.discounted ? 1 : null,
    };
  });
}
