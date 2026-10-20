import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Testimonial } from '../../../core/models';
import { Icon } from '../../../shared/icon/icon';
import { Rail } from '../../../shared/rail/rail';

@Component({
  selector: 'app-testimonials',
  imports: [Icon, Rail],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-head">
      <div>
        <span class="eyebrow">نظرات مشتریان</span>
        <h2>{{ title() }}</h2>
        <p>{{ subtitle() }}</p>
      </div>
    </div>
    <app-rail>
      @for (t of items(); track t.id) {
        <figure class="t">
          <app-icon name="quote" class="q" />
          <div class="stars" [attr.aria-label]="t.rating + ' ستاره'">
            @for (s of [1, 2, 3, 4, 5]; track s) {
              <app-icon name="star" [filled]="s <= t.rating" [class.off]="s > t.rating" />
            }
          </div>
          <blockquote>{{ t.text }}</blockquote>
          <figcaption>
            <span class="avatar">{{ t.name.charAt(0) }}</span>
            <span>
              <strong>{{ t.name }}</strong>
              <small>{{ t.city }}</small>
            </span>
          </figcaption>
        </figure>
      }
    </app-rail>
  `,
  styles: `
    app-rail {
      --item: clamp(260px, 32%, 400px);
    }
    .t {
      position: relative;
      margin: 0;
      height: 100%;
      display: grid;
      align-content: start;
      gap: 0.9rem;
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      transition: border-color var(--dur) var(--ease);
      &:hover {
        border-color: var(--brand-line);
      }
    }
    .q {
      position: absolute;
      top: 1.2rem;
      left: 1.2rem;
      width: 38px;
      height: 38px;
      color: var(--brand-soft);
    }
    .stars {
      display: flex;
      gap: 2px;
      app-icon {
        width: 16px;
        height: 16px;
        color: #f0b437;
        &.off {
          color: var(--surface-3);
        }
      }
    }
    blockquote {
      margin: 0;
      color: var(--text-2);
      line-height: 2;
      font-size: 0.93rem;
    }
    figcaption {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      margin-top: auto;
      span:last-child {
        display: grid;
        line-height: 1.5;
      }
      small {
        color: var(--muted);
        font-size: 0.78rem;
      }
    }
    .avatar {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--brand-gradient);
      color: var(--on-brand);
      font-weight: 800;
    }
    @media (max-width: 560px) {
      app-rail {
        --item: 84%;
      }
    }
  `,
})
export class Testimonials {
  readonly title = input('');
  readonly subtitle = input('');
  readonly items = input.required<Testimonial[]>();
}
