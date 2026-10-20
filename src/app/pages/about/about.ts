import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { StoreApi } from '../../core/api/store.api';
import { SITE_CONFIG } from '../../core/config/site.config';
import { SeoService } from '../../core/services/seo.service';
import { Breadcrumb } from '../../shared/breadcrumb/breadcrumb';
import { Icon } from '../../shared/icon/icon';
import { FaPipe } from '../../shared/pipes';

@Component({
  selector: 'app-about',
  imports: [RouterLink, Breadcrumb, Icon, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (about(); as a) {
      <section class="hero">
        <div class="container">
          <app-breadcrumb [items]="[{ label: 'درباره ما' }]" />
          <div class="hero-grid">
            <div class="copy">
              <span class="eyebrow"><app-icon name="sparkles" /> درباره {{ config.name }}</span>
              <h1>{{ a.title }}</h1>
              <p class="lead">{{ a.lead }}</p>
              <div class="ctas">
                <a routerLink="/shop" class="btn btn-primary btn-lg">مشاهده محصولات <app-icon name="arrow-left" /></a>
                <a routerLink="/contact" class="btn btn-outline btn-lg">تماس با ما</a>
              </div>
            </div>
            <div class="art">
              @for (src of a.images; track src; let i = $index) {
                <div [class]="'art-card c' + (i + 1)"><img [src]="src" alt="" width="600" height="600" /></div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="container stats">
        @for (s of a.stats; track s.label) {
          <div class="stat reveal">
            <strong><span class="gold-text">{{ s.value | fa }}</span>{{ s.suffix }}</strong>
            <span>{{ s.label }}</span>
          </div>
        }
      </section>

      <section class="container section story">
        <div class="section-head">
          <div>
            <span class="eyebrow">داستان ما</span>
            <h2>از کارگاهی کوچک تا ویترینی آنلاین</h2>
          </div>
        </div>
        <div class="story-grid">
          <div class="text">
            @for (p of a.story; track $index) {
              <p class="reveal">{{ p }}</p>
            }
          </div>
          <ol class="timeline">
            @for (t of a.timeline; track t.year) {
              <li class="reveal">
                <span class="year">{{ t.year }}</span>
                <div>
                  <strong>{{ t.title }}</strong>
                  <p>{{ t.text }}</p>
                </div>
              </li>
            }
          </ol>
        </div>
      </section>

      <section class="container section">
        <div class="section-head">
          <div>
            <span class="eyebrow">ارزش‌های ما</span>
            <h2>چرا گالری پویا؟</h2>
          </div>
        </div>
        <div class="values">
          @for (v of a.values; track v.title) {
            <div class="value reveal">
              <span class="ic"><app-icon [name]="v.icon" /></span>
              <h3>{{ v.title }}</h3>
              <p>{{ v.text }}</p>
            </div>
          }
        </div>
      </section>

      <section class="container">
        <div class="cta reveal">
          <div>
            <h2>از نزدیک ببینید، با خیال راحت انتخاب کنید</h2>
            <p>در شعبه‌های حضوری گالری پویا، کارشناسان ما آماده مشاوره و ارائه طرح‌های اختصاصی هستند.</p>
          </div>
          <a routerLink="/contact" class="btn btn-primary btn-lg"><app-icon name="pin" /> آدرس شعبه‌ها</a>
        </div>
      </section>
    }
  `,
  styleUrl: './about.scss',
})
export class About {
  protected readonly config = inject(SITE_CONFIG);
  protected readonly about = toSignal(inject(StoreApi).about());

  constructor() {
    inject(SeoService).update({
      title: 'درباره ما',
      description: 'داستان گالری طلای پویا؛ بیش از سه دهه تجربه در ساخت و فروش طلا و جواهرات با ضمانت اصالت.',
      path: '/about',
    });
  }
}
