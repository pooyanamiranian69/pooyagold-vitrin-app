import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { PricedProduct } from '../models';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { UiService } from './ui.service';

export interface CartLine {
  slug: string;
  title: string;
  image: string;
  weight: number;
  price: number;
  qty: number;
}

const KEY = 'pg-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);
  private readonly ui = inject(UiService);

  readonly lines = signal<CartLine[]>([]);
  readonly count = computed(() => this.lines().reduce((s, l) => s + l.qty, 0));
  readonly total = computed(() => this.lines().reduce((s, l) => s + l.qty * l.price, 0));
  readonly weight = computed(() => this.lines().reduce((s, l) => s + l.qty * l.weight, 0));

  constructor() {
    afterNextRender(() => this.lines.set(this.storage.get<CartLine[]>(KEY, [])));
  }

  add(p: PricedProduct, qty = 1) {
    this.lines.update((lines) => {
      const found = lines.find((l) => l.slug === p.slug);
      if (found) return lines.map((l) => (l === found ? { ...l, qty: l.qty + qty } : l));
      return [
        ...lines,
        { slug: p.slug, title: p.title, image: p.images[0], weight: p.weight, price: p.price.total, qty },
      ];
    });
    this.persist();
    this.toast.show(`${p.title} به سبد خرید اضافه شد`, 'bag');
    this.ui.cartOpen.set(true);
  }

  setQty(slug: string, qty: number) {
    if (qty < 1) return this.remove(slug);
    this.lines.update((lines) => lines.map((l) => (l.slug === slug ? { ...l, qty } : l)));
    this.persist();
  }

  remove(slug: string) {
    this.lines.update((lines) => lines.filter((l) => l.slug !== slug));
    this.persist();
  }

  private persist() {
    this.storage.set(KEY, this.lines());
  }
}
