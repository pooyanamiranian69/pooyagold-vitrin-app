import { DOCUMENT } from '@angular/common';
import { Injectable, afterNextRender, computed, effect, inject, signal } from '@angular/core';
import { SITE_CONFIG } from '../config/site.config';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark' | 'system';
export type RadiusMode = 'sharp' | 'soft' | 'round';
export type FontScale = 'sm' | 'md' | 'lg';

export interface AccentPreset {
  id: string;
  name: string;
  color: string;
  onColor: string;
}

export interface ThemeSettings {
  mode: ThemeMode;
  accent: string;
  /** رنگ دلخواه کاربر وقتی accent === 'custom' */
  custom: string;
  radius: RadiusMode;
  fontScale: FontScale;
  reduceMotion: boolean;
}

/** کلید ذخیره‌سازی؛ با اسکریپت ابتدایی index.html یکی است */
export const THEME_STORAGE_KEY = 'pg-theme';

/** پالت‌های آماده (با [data-accent] در src/styles/_tokens.scss هماهنگ است) */
export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'gold', name: 'طلایی کلاسیک', color: '#b8892f', onColor: '#1b1408' },
  { id: 'champagne', name: 'شامپاینی', color: '#c4a57a', onColor: '#1e170d' },
  { id: 'rose', name: 'رزگلد', color: '#b9705f', onColor: '#ffffff' },
  { id: 'ruby', name: 'یاقوتی', color: '#b3263e', onColor: '#ffffff' },
  { id: 'amethyst', name: 'آمتیست', color: '#7b4fc4', onColor: '#ffffff' },
  { id: 'sapphire', name: 'سافایر', color: '#2b59c3', onColor: '#ffffff' },
  { id: 'turquoise', name: 'فیروزه‌ای', color: '#11898f', onColor: '#ffffff' },
  { id: 'emerald', name: 'زمردی', color: '#13795b', onColor: '#ffffff' },
  { id: 'onyx', name: 'اونیکس', color: '#5d6573', onColor: '#ffffff' },
];

/** رنگ متن مناسب روی یک رنگ دلخواه بر اساس روشنایی نسبی */
export function contrastColor(hex: string): string {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return '#ffffff';
  const [r, g, b] = m.map((x) => {
    const c = parseInt(x, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#17130b' : '#ffffff';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly storage = inject(StorageService);
  private readonly config = inject(SITE_CONFIG);

  readonly defaults: ThemeSettings = {
    mode: this.config.defaultTheme.mode,
    accent: this.config.defaultTheme.accent,
    custom: '#c08a3e',
    radius: this.config.defaultTheme.radius,
    fontScale: 'md',
    reduceMotion: false,
  };

  readonly settings = signal<ThemeSettings>(this.defaults);
  private readonly systemDark = signal(false);
  private loaded = false;

  readonly isDark = computed(() => {
    const mode = this.settings().mode;
    return mode === 'dark' || (mode === 'system' && this.systemDark());
  });

  readonly accentColor = computed(() => {
    const s = this.settings();
    return s.accent === 'custom'
      ? s.custom
      : (ACCENT_PRESETS.find((a) => a.id === s.accent)?.color ?? ACCENT_PRESETS[0].color);
  });

  constructor() {
    afterNextRender(() => {
      const media = matchMedia('(prefers-color-scheme: dark)');
      this.systemDark.set(media.matches);
      media.addEventListener('change', (e) => this.systemDark.set(e.matches));
      this.settings.set({ ...this.defaults, ...this.storage.get(THEME_STORAGE_KEY, {}) });
      this.loaded = true;
    });

    effect(() => {
      const s = this.settings();
      const dark = this.isDark();
      if (!this.loaded) return;
      this.apply(s, dark);
      this.storage.set(THEME_STORAGE_KEY, s);
    });
  }

  update(patch: Partial<ThemeSettings>) {
    this.settings.update((s) => ({ ...s, ...patch }));
  }

  reset() {
    this.settings.set(this.defaults);
  }

  /** تغییر روز/شب با انیمیشن دایره‌ای (View Transitions) در مرورگرهای پشتیبان */
  toggleMode(origin?: MouseEvent) {
    const next: ThemeMode = this.isDark() ? 'light' : 'dark';
    const doc = this.doc as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition || this.settings().reduceMotion || !origin) {
      this.update({ mode: next });
      return;
    }
    const root = this.doc.documentElement;
    root.style.setProperty('--vt-x', `${origin.clientX}px`);
    root.style.setProperty('--vt-y', `${origin.clientY}px`);
    root.classList.add('theme-vt');
    const vt = doc.startViewTransition(() => {
      this.update({ mode: next });
      this.apply(this.settings(), this.isDark());
    });
    vt.ready.finally(() => setTimeout(() => root.classList.remove('theme-vt'), 600));
  }

  private apply(s: ThemeSettings, dark: boolean) {
    const root = this.doc.documentElement;
    root.dataset['theme'] = dark ? 'dark' : 'light';
    root.dataset['accent'] = s.accent;
    root.dataset['radius'] = s.radius;
    root.dataset['font'] = s.fontScale;
    root.dataset['motion'] = s.reduceMotion ? 'reduce' : 'full';
    if (s.accent === 'custom') {
      root.style.setProperty('--accent', s.custom);
      root.style.setProperty('--on-accent', contrastColor(s.custom));
    } else {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--on-accent');
    }
    const meta = this.doc.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', dark ? '#0f0e0c' : '#faf7f2');
  }
}
