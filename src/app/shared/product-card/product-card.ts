import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BADGE_LABELS, METAL_LABELS, STONE_LABELS } from '../../core/data/labels';
import { PricedProduct } from '../../core/models';
import { CartService } from '../../core/services/cart.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Icon } from '../icon/icon';
import { FaPipe, TomanPipe } from '../pipes';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, Icon, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  host: { '[class.list]': "layout() === 'list'" },
})
export class ProductCard {
  readonly product = input.required<PricedProduct>();
  readonly layout = input<'grid' | 'list'>('grid');
  readonly priority = input(false);

  protected readonly cart = inject(CartService);
  protected readonly favorites = inject(FavoritesService);
  protected readonly badgeLabels = BADGE_LABELS;
  protected readonly metalLabels = METAL_LABELS;
  protected readonly stoneLabels = STONE_LABELS;

  protected readonly isFav = computed(() => this.favorites.slugs().includes(this.product().slug));
  protected readonly discount = computed(() => {
    const p = this.product().price;
    return p.totalBeforeDiscount > p.total
      ? Math.round((1 - p.total / p.totalBeforeDiscount) * 100)
      : 0;
  });
}
