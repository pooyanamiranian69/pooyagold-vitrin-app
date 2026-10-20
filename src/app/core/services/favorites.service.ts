import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

const KEY = 'pg-favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);
  readonly slugs = signal<string[]>([]);
  readonly count = computed(() => this.slugs().length);

  constructor() {
    // بعد از hydration خوانده می‌شود تا HTML سرور و کلاینت یکسان بماند
    afterNextRender(() => this.slugs.set(this.storage.get<string[]>(KEY, [])));
  }

  has(slug: string) {
    return this.slugs().includes(slug);
  }

  toggle(slug: string, title?: string) {
    const exists = this.has(slug);
    this.slugs.update((list) => (exists ? list.filter((s) => s !== slug) : [slug, ...list]));
    this.storage.set(KEY, this.slugs());
    this.toast.show(
      exists ? 'از علاقه‌مندی‌ها حذف شد' : `${title ?? 'محصول'} به علاقه‌مندی‌ها اضافه شد`,
      'heart',
      exists ? undefined : { label: 'مشاهده', link: '/account/favorites' },
    );
  }
}
