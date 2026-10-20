import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONFIG } from '../../core/config/site.config';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/icon/icon';
import { Logo } from '../../shared/logo/logo';
import { FaPipe } from '../../shared/pipes';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon, Logo, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly config = inject(SITE_CONFIG);
  private readonly toast = inject(ToastService);
  protected readonly email = signal('');
  protected readonly year = '۱۴۰۵';

  protected subscribe(e: Event) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(this.email())) {
      this.toast.show('لطفا یک ایمیل معتبر وارد کنید', 'info');
      return;
    }
    this.email.set('');
    this.toast.show('عضویت شما در خبرنامه با موفقیت انجام شد', 'mail');
  }

  protected toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
