import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SITE_CONFIG } from '../../core/config/site.config';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/icon/icon';
import { Logo } from '../../shared/logo/logo';
import { FaPipe } from '../../shared/pipes';

/** ورود با شماره موبایل و کد یکبارمصرف (فعلا فقط رابط کاربری) */
@Component({
  selector: 'app-login',
  imports: [RouterLink, Icon, Logo, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container wrap">
      <div class="card-login">
        <app-logo />
        @if (step() === 'phone') {
          <h1>ورود / ثبت‌نام</h1>
          <p>شماره موبایل خود را وارد کنید تا کد تایید برایتان ارسال شود.</p>
          <form (submit)="sendCode($event)">
            <div class="field">
              <label for="l-phone">شماره موبایل</label>
              <input
                id="l-phone"
                class="input ltr"
                inputmode="tel"
                autocomplete="tel"
                placeholder="09xxxxxxxxx"
                [value]="phone()"
                (input)="phone.set($any($event.target).value)"
                [class.invalid]="error()"
              />
              @if (error()) {
                <span class="error">شماره موبایل معتبر نیست.</span>
              }
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-block">دریافت کد تایید <app-icon name="arrow-left" /></button>
          </form>
        } @else {
          <h1>کد تایید</h1>
          <p>کد ۵ رقمی ارسال‌شده به <strong class="ltr">{{ phone() | fa }}</strong> را وارد کنید.</p>
          <form (submit)="verify($event)">
            <div class="otp">
              @for (i of [0, 1, 2, 3, 4]; track i) {
                <input
                  class="input"
                  inputmode="numeric"
                  maxlength="1"
                  [attr.aria-label]="'رقم ' + (i + 1)"
                  (input)="nextBox($event)"
                />
              }
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-block">ورود به حساب</button>
            <button type="button" class="btn btn-ghost btn-block" (click)="step.set('phone')">ویرایش شماره</button>
          </form>
        }
        <small class="terms">
          ورود شما به معنای پذیرش <a routerLink="/about">قوانین و حریم خصوصی</a> {{ config.name }} است.
        </small>
      </div>
      <div class="side" aria-hidden="true">
        <img src="/images/banners/set3.jpg" alt="" width="600" height="600" />
        <h2>به باشگاه مشتریان پویا خوش آمدید</h2>
        <p>با عضویت، از امتیاز خرید، تخفیف‌های اختصاصی و پیگیری آنلاین سفارش‌ها بهره‌مند شوید.</p>
      </div>
    </section>
  `,
  styles: `
    .wrap {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding-block: 2.5rem;
      align-items: stretch;
    }
    .card-login {
      display: grid;
      align-content: center;
      gap: 1rem;
      padding: clamp(1.5rem, 4vw, 3rem);
      border-radius: var(--radius-xl);
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      animation: rise var(--dur-slow) var(--ease);
      h1 {
        font-size: 1.6rem;
        margin-top: 1rem;
      }
      p {
        color: var(--muted);
      }
      form {
        display: grid;
        gap: 1rem;
      }
    }
    .otp {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      direction: ltr;
      input {
        text-align: center;
        font-size: 1.3rem;
        font-weight: 800;
        height: 58px;
        padding: 0;
      }
    }
    .terms {
      color: var(--muted);
      a {
        color: var(--brand-text);
        font-weight: 700;
      }
    }
    .side {
      display: grid;
      align-content: center;
      justify-items: center;
      text-align: center;
      gap: 1rem;
      padding: 2rem;
      border-radius: var(--radius-xl);
      background:
        radial-gradient(circle at 50% 30%, color-mix(in oklab, var(--brand) 40%, transparent), transparent 60%),
        #17140f;
      img {
        width: min(320px, 80%);
        animation: float 6s ease-in-out infinite;
      }
      h2 {
        color: #fff;
        font-size: 1.4rem;
      }
      p {
        color: #bdb3a3;
        max-width: 380px;
      }
    }
    @keyframes float {
      50% {
        transform: translateY(-12px);
      }
    }
    @media (max-width: 900px) {
      .wrap {
        grid-template-columns: 1fr;
      }
      .side {
        display: none;
      }
    }
  `,
})
export class Login {
  protected readonly config = inject(SITE_CONFIG);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  protected readonly step = signal<'phone' | 'code'>('phone');
  protected readonly phone = signal('');
  protected readonly error = signal(false);

  constructor() {
    inject(SeoService).update({ title: 'ورود / ثبت‌نام', path: '/login', noindex: true });
  }

  protected sendCode(e: Event) {
    e.preventDefault();
    const ok = /^09\d{9}$/.test(this.phone());
    this.error.set(!ok);
    if (ok) {
      this.step.set('code');
      this.toast.show('کد تایید ارسال شد (نسخه نمایشی: هر کدی قبول است)', 'mail');
    }
  }

  protected nextBox(e: Event) {
    const el = e.target as HTMLInputElement;
    if (el.value) (el.nextElementSibling as HTMLInputElement | null)?.focus();
  }

  protected verify(e: Event) {
    e.preventDefault();
    this.toast.show('با موفقیت وارد شدید', 'user');
    this.router.navigate(['/account']);
  }
}
