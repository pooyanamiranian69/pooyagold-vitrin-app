import { ChangeDetectionStrategy, Component, RESPONSE_INIT, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container nf">
      <img src="/images/products/ring1.jpeg" alt="" width="600" height="600" />
      <h1><span class="gold-text">۴۰۴</span></h1>
      <h2>صفحه مورد نظر پیدا نشد</h2>
      <p>شاید این جواهر جای دیگری می‌درخشد! از صفحه اصلی یا فروشگاه دوباره جستجو کنید.</p>
      <div class="ctas">
        <a routerLink="/" class="btn btn-primary btn-lg"><app-icon name="home" /> صفحه اصلی</a>
        <a routerLink="/shop" class="btn btn-outline btn-lg">فروشگاه</a>
      </div>
    </section>
  `,
  styles: `
    .nf {
      display: grid;
      justify-items: center;
      text-align: center;
      gap: 0.75rem;
      padding-block: 3rem;
    }
    img {
      width: 220px;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 50%;
      animation: float 5s ease-in-out infinite;
    }
    @keyframes float {
      50% {
        transform: translateY(-12px) rotate(-4deg);
      }
    }
    h1 {
      font-size: clamp(4rem, 12vw, 7rem);
      line-height: 1;
      font-weight: 900;
    }
    p {
      color: var(--muted);
      max-width: 460px;
    }
    .ctas {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
  `,
})
export class NotFound {
  constructor() {
    const res = inject(RESPONSE_INIT, { optional: true });
    if (res) res.status = 404;
    inject(SeoService).update({ title: 'صفحه پیدا نشد', path: '/404', noindex: true });
  }
}
