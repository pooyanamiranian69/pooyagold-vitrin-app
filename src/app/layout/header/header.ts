import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { StoreApi } from '../../core/api/store.api';
import { SITE_CONFIG } from '../../core/config/site.config';
import { CartService } from '../../core/services/cart.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { ThemeService } from '../../core/services/theme.service';
import { UiService } from '../../core/services/ui.service';
import { Icon } from '../../shared/icon/icon';
import { Logo } from '../../shared/logo/logo';
import { FaPipe, TomanPipe } from '../../shared/pipes';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, Logo, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: { '(window:scroll)': 'onScroll()', '(document:keydown)': 'onKey($event)' },
})
export class Header {
  protected readonly config = inject(SITE_CONFIG);
  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
  protected readonly favorites = inject(FavoritesService);
  protected readonly theme = inject(ThemeService);
  private readonly api = inject(StoreApi);

  protected readonly rates = toSignal(this.api.goldRates(), { initialValue: [] });
  protected readonly categories = toSignal(this.api.categories(), { initialValue: [] });
  protected readonly scrolled = signal(false);
  protected readonly openMenu = signal<string | null>(null);

  constructor() {
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.openMenu.set(null);
        this.ui.closeAll();
      });
  }

  protected onKey(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(target.tagName)) {
      e.preventDefault();
      this.ui.searchOpen.set(true);
    }
    if (e.key === 'Escape') this.ui.closeAll();
  }

  protected onScroll() {
    this.scrolled.set(window.scrollY > 24);
  }
}
