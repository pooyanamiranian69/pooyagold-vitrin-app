import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StoreApi } from '../../core/api/store.api';
import { SITE_CONFIG } from '../../core/config/site.config';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb';
import { Icon } from '../../shared/icon/icon';
import { FaPipe } from '../../shared/pipes';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Breadcrumb, Icon, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly config = inject(SITE_CONFIG);
  private readonly toast = inject(ToastService);
  protected readonly faqs = toSignal(inject(StoreApi).faqs(), { initialValue: [] });
  protected readonly sending = signal(false);
  protected readonly subjects = ['مشاوره خرید', 'سفارش اختصاصی', 'پیگیری سفارش', 'خدمات پس از فروش', 'سایر موارد'];

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    subject: ['مشاوره خرید'],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    const route = inject(ActivatedRoute);
    inject(SeoService).update({
      title: 'تماس با ما',
      description: `راه‌های ارتباط با ${this.config.name}: تلفن ${this.config.phone}، آدرس شعبه‌ها، ساعات کاری و پاسخ به سوالات متداول.`,
      path: '/contact',
    });
    afterNextRender(() => {
      if (route.snapshot.queryParamMap.get('tab') === 'faq') {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  protected invalid(name: keyof typeof this.form.controls) {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    setTimeout(() => {
      this.sending.set(false);
      this.form.reset();
      this.toast.show('پیام شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم', 'check');
    }, 700);
  }
}
