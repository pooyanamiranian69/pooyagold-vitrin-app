import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface Toast {
  id: number;
  text: string;
  icon: string;
  action?: { label: string; link: string };
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly storage = inject(StorageService);
  private seq = 0;
  readonly toasts = signal<Toast[]>([]);

  show(text: string, icon = 'check', action?: Toast['action']) {
    const toast = { id: ++this.seq, text, icon, action };
    this.toasts.update((list) => [...list.slice(-2), toast]);
    if (this.storage.isBrowser) setTimeout(() => this.dismiss(toast.id), 3200);
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
