import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { StoreApi } from '../../core/api/store.api';
import { FavoritesService } from '../../core/services/favorites.service';
import { Icon } from '../../shared/icon/icon';
import { FaPipe } from '../../shared/pipes';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, Icon, ProductCard, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">
      <h1>علاقه‌مندی‌ها <small class="muted">({{ favorites.count() | fa }})</small></h1>
      @if (products().length) {
        <div class="product-grid">
          @for (p of products(); track p.id) {
            <app-product-card [product]="p" />
          }
        </div>
      } @else {
        <div class="empty">
          <span class="empty-icon"><app-icon name="heart" /></span>
          <h3>هنوز محصولی را نپسندیده‌اید</h3>
          <p>با زدن روی آیکون قلب، محصولات دلخواه را اینجا نگه دارید.</p>
          <a routerLink="/shop" class="btn btn-primary">گشتی در فروشگاه</a>
        </div>
      }
    </div>
  `,
  styles: `
    h1 {
      font-size: 1.3rem;
      margin-bottom: 1.25rem;
    }
    .product-grid {
      grid-template-columns: repeat(auto-fill, minmax(min(210px, 46%), 1fr));
    }
  `,
})
export class Favorites {
  private readonly api = inject(StoreApi);
  protected readonly favorites = inject(FavoritesService);
  protected readonly products = toSignal(
    toObservable(this.favorites.slugs).pipe(switchMap((s) => this.api.productsBySlugs(s))),
    { initialValue: [] },
  );
}
