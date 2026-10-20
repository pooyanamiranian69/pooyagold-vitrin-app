import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoldRate, HeroSlide } from '../../../core/models';
import { Icon } from '../../../shared/icon/icon';
import { FaPipe, TomanPipe } from '../../../shared/pipes';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, Icon, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="hero"
      [attr.data-tone]="slides()[active()]?.tone"
      (mouseenter)="paused.set(true)"
      (mouseleave)="paused.set(false)"
      aria-roledescription="carousel"
      aria-label="پیشنهادهای ویژه"
    >
      <div class="glow"></div>
      @for (s of slides(); track s.id; let i = $index) {
        <div class="slide" [class.active]="i === active()" [attr.aria-hidden]="i !== active()">
          <div class="copy">
            <span class="eyebrow"><app-icon name="sparkles" /> {{ s.eyebrow }}</span>
            @if (i === 0) {
              <h1>{{ s.title }} <span class="gold-text">{{ s.highlight }}</span></h1>
            } @else {
              <h2 class="h1">{{ s.title }} <span class="gold-text">{{ s.highlight }}</span></h2>
            }
            <p>{{ s.description }}</p>
            <div class="ctas">
              <a class="btn btn-primary btn-lg" [routerLink]="s.cta.link" [queryParams]="s.cta.queryParams" [tabindex]="i === active() ? 0 : -1">
                {{ s.cta.label }} <app-icon name="arrow-left" />
              </a>
              @if (s.secondaryCta; as c) {
                <a class="btn btn-outline btn-lg" [routerLink]="c.link" [queryParams]="c.queryParams" [tabindex]="i === active() ? 0 : -1">
                  {{ c.label }}
                </a>
              }
            </div>
          </div>
          <div class="art">
            <span class="ring r1"></span>
            <span class="ring r2"></span>
            <img
              [src]="s.image"
              [alt]="s.title + ' ' + s.highlight"
              width="600"
              height="600"
              [attr.fetchpriority]="i === 0 ? 'high' : null"
              [attr.loading]="i === 0 ? 'eager' : 'lazy'"
            />
          </div>
        </div>
      }

      @if (rate(); as r) {
        <div class="float-card rate">
          <span class="fc-icon"><app-icon name="trend-up" /></span>
          <span>
            <small>{{ r.title }} (هر گرم)</small>
            <strong>{{ r.price | toman }} <small>تومان</small></strong>
          </span>
        </div>
      }
      <div class="float-card ship">
        <span class="fc-icon"><app-icon name="truck" /></span>
        <span>
          <small>ارسال بیمه‌شده</small>
          <strong>رایگان به سراسر ایران</strong>
        </span>
      </div>

      <div class="controls">
        <button type="button" class="arrow" (click)="go(active() - 1)" aria-label="اسلاید قبلی">
          <app-icon name="chevron-right" />
        </button>
        <div class="dots">
          @for (s of slides(); track s.id; let i = $index) {
            <button
              type="button"
              [class.active]="i === active()"
              (click)="go(i)"
              [attr.aria-label]="'اسلاید ' + (i + 1 | fa)"
            >
              <span [class.run]="i === active() && !paused()"></span>
            </button>
          }
        </div>
        <button type="button" class="arrow" (click)="go(active() + 1)" aria-label="اسلاید بعدی">
          <app-icon name="chevron-left" />
        </button>
      </div>
    </section>
  `,
  styleUrl: './hero.scss',
})
export class Hero {
  readonly slides = input.required<HeroSlide[]>();
  readonly rate = input<GoldRate>();
  protected readonly active = signal(0);
  protected readonly paused = signal(false);
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    // تایمر فقط در مرورگر اجرا می‌شود تا SSR منتظر نماند
    afterNextRender(() => {
      this.timer = setInterval(() => {
        if (!this.paused() && !document.hidden) this.go(this.active() + 1);
      }, 6500);
    });
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected go(i: number) {
    const n = this.slides().length;
    this.active.set((i + n) % n);
  }
}
