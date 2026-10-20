import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import {
  ACCENT_PRESETS,
  FontScale,
  RadiusMode,
  ThemeMode,
  ThemeService,
} from '../../core/services/theme.service';
import { Icon } from '../../shared/icon/icon';

/** صفحه انتخاب دستی تم: حالت روز/شب، رنگ اصلی (پالت آماده یا دلخواه)، گوشه‌ها، اندازه متن و انیمیشن */
@Component({
  selector: 'app-settings',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  protected readonly theme = inject(ThemeService);
  private readonly toast = inject(ToastService);
  protected readonly accents = ACCENT_PRESETS;

  protected readonly modes: { value: ThemeMode; label: string; icon: string; hint: string }[] = [
    { value: 'light', label: 'روز', icon: 'sun', hint: 'پس‌زمینه روشن و عاجی' },
    { value: 'dark', label: 'شب', icon: 'moon', hint: 'تیره و مخملی، مناسب شب' },
    { value: 'system', label: 'خودکار', icon: 'monitor', hint: 'هماهنگ با سیستم‌عامل' },
  ];
  protected readonly radii: { value: RadiusMode; label: string }[] = [
    { value: 'sharp', label: 'تیز' },
    { value: 'soft', label: 'متعادل' },
    { value: 'round', label: 'گرد' },
  ];
  protected readonly fonts: { value: FontScale; label: string }[] = [
    { value: 'sm', label: 'کوچک' },
    { value: 'md', label: 'معمولی' },
    { value: 'lg', label: 'بزرگ' },
  ];

  protected setCustom(color: string) {
    if (/^#[0-9a-f]{6}$/i.test(color)) this.theme.update({ accent: 'custom', custom: color });
  }

  protected reset() {
    this.theme.reset();
    this.toast.show('تنظیمات ظاهری به حالت پیش‌فرض برگشت', 'refresh');
  }
}
