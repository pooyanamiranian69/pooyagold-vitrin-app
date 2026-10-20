import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { StoreApi } from '../../../core/api/store.api';
import { Link, ProductQuery } from '../../../core/models';
import { Icon } from '../../../shared/icon/icon';
import { ProductCard } from '../../../shared/product-card/product-card';
import { Rail } from '../../../shared/rail/rail';

@Component({
  selector: 'app-product-rail',
  imports: [RouterLink, Icon, ProductCard, Rail],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-head">
      <div>
        <span class="eyebrow">کالکشن</span>
        <h2>{{ title() }}</h2>
        <p>{{ subtitle() }}</p>
      </div>
      @if (link(); as l) {
        <a [routerLink]="l.link" [queryParams]="l.queryParams" class="link">{{ l.label }} <app-icon name="arrow-left" /></a>
      }
    </div>
    <app-rail>
      @for (p of products(); track p.id) {
        <app-product-card [product]="p" />
      }
    </app-rail>
  `,
})
export class ProductRail {
  private readonly api = inject(StoreApi);
  readonly title = input('');
  readonly subtitle = input('');
  readonly query = input<ProductQuery>({});
  readonly link = input<Link>();

  protected readonly products = toSignal(
    toObservable(computed(() => this.query())).pipe(
      switchMap((q) => this.api.products(q)),
      map((r) => r.items),
    ),
    { initialValue: [] },
  );
}
