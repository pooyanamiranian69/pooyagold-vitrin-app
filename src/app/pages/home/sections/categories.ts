import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-category-grid',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-head">
      <div>
        <span class="eyebrow">کالکشن‌ها</span>
        <h2>{{ title() }}</h2>
        <p>{{ subtitle() }}</p>
      </div>
      <a routerLink="/shop" class="link">همه محصولات <app-icon name="arrow-left" /></a>
    </div>
    <div class="grid">
      @for (c of categories(); track c.id; let i = $index) {
        <a [routerLink]="['/shop', c.slug]" class="cat reveal" [style.--i]="i">
          <span class="media">
            <img [src]="c.image" [alt]="c.title" width="600" height="600" loading="lazy" />
          </span>
          <span class="txt">
            <strong>{{ c.title }}</strong>
            <small>{{ c.subtitle }}</small>
          </span>
          <span class="go"><app-icon name="arrow-left" /></span>
        </a>
      }
    </div>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: clamp(10px, 1.6vw, 18px);
    }
    .cat {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 0.9rem;
      padding: 0.75rem;
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      overflow: hidden;
      transition: all var(--dur) var(--ease);
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 85% 50%, var(--brand-soft), transparent 60%);
        opacity: 0;
        transition: opacity var(--dur) var(--ease);
      }
      &:hover {
        border-color: var(--brand-line);
        box-shadow: var(--shadow);
        transform: translateY(-3px);
        &::before {
          opacity: 1;
        }
        img {
          transform: scale(1.12) rotate(-8deg);
        }
        .go {
          background: var(--brand);
          color: var(--on-brand);
          transform: translateX(-3px);
        }
      }
    }
    .media {
      position: relative;
      display: grid;
      place-items: center;
      width: 76px;
      height: 76px;
      border-radius: var(--radius);
      background: var(--surface-2);
      img {
        width: 88%;
        height: 88%;
        transition: transform var(--dur-slow) var(--ease);
      }
    }
    .txt {
      position: relative;
      display: grid;
      line-height: 1.6;
      strong {
        font-size: 1rem;
      }
      small {
        font-size: 0.78rem;
        color: var(--muted);
      }
    }
    .go {
      position: relative;
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--surface-2);
      color: var(--text-2);
      transition: all var(--dur) var(--ease);
      app-icon {
        width: 17px;
        height: 17px;
      }
    }
    @media (max-width: 1000px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 560px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      .cat {
        grid-template-columns: 1fr;
        justify-items: center;
        text-align: center;
        padding: 0.5rem 0.25rem 0.6rem;
        gap: 0.35rem;
      }
      .media {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
      }
      .txt strong {
        font-size: 0.78rem;
      }
      .txt small,
      .go {
        display: none;
      }
    }
  `,
})
export class CategoryGrid {
  readonly categories = input.required<Category[]>();
  readonly title = input('');
  readonly subtitle = input('');
}
