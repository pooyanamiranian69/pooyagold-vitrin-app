import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PromoBanner } from '../../../core/models';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-banner',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="banner reveal" [routerLink]="banner().cta.link" [queryParams]="banner().cta.queryParams" [attr.data-tone]="banner().tone">
      <div class="copy">
        <span class="eyebrow">{{ banner().eyebrow }}</span>
        <h3>{{ banner().title }}</h3>
        <p>{{ banner().description }}</p>
        <span class="btn btn-primary">{{ banner().cta.label }} <app-icon name="arrow-left" /></span>
      </div>
      <div class="art">
        <img [src]="banner().image" [alt]="banner().title" width="600" height="600" loading="lazy" />
      </div>
    </a>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .banner {
      --tone: #d4a64a;
      position: relative;
      height: 100%;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      align-items: center;
      gap: 1rem;
      padding: clamp(24px, 4vw, 56px);
      border-radius: var(--radius-xl);
      overflow: hidden;
      isolation: isolate;
      color: #f4efe7;
      background:
        radial-gradient(circle at 18% 50%, color-mix(in oklab, var(--tone) 55%, transparent), transparent 55%),
        radial-gradient(circle at 100% 100%, color-mix(in oklab, var(--tone) 30%, transparent), transparent 50%),
        #15120e;
      &[data-tone='night'] {
        --tone: #6b64c4;
      }
      &[data-tone='sapphire'] {
        --tone: #3a64c9;
      }
      &[data-tone='rose'] {
        --tone: #d98b78;
      }
      &[data-tone='emerald'] {
        --tone: #1f9a74;
      }
      &::after {
        content: '';
        position: absolute;
        inset: 12px;
        border-radius: calc(var(--radius-xl) - 10px);
        border: 1px solid rgb(255 255 255 / 0.08);
        pointer-events: none;
      }
      &:hover img {
        transform: scale(1.08) rotate(-6deg);
      }
    }
    .copy {
      display: grid;
      gap: 0.8rem;
      justify-items: start;
      position: relative;
      z-index: 1;
    }
    .eyebrow {
      font-size: 0.85rem;
      font-weight: 700;
      color: color-mix(in oklab, var(--tone) 50%, #fff);
      letter-spacing: 0;
    }
    h3 {
      color: #fff;
      font-size: clamp(1.4rem, 3vw, 2.3rem);
      font-weight: 900;
    }
    p {
      color: #c9bfae;
      max-width: 440px;
      font-size: 0.95rem;
      line-height: 2;
    }
    .btn {
      margin-top: 0.5rem;
    }
    .art {
      display: grid;
      place-items: center;
      img {
        width: min(100%, 360px);
        filter: drop-shadow(0 24px 40px rgb(0 0 0 / 0.5));
        transition: transform 900ms var(--ease);
      }
      img[src$='.jpg'] {
        aspect-ratio: 4 / 5;
        object-fit: cover;
        border-radius: var(--radius-lg);
        border: 1px solid rgb(255 255 255 / 0.12);
        filter: none;
        box-shadow: 0 24px 50px -16px rgb(0 0 0 / 0.7);
      }
    }
    .banner:hover img[src$='.jpg'] {
      transform: scale(1.04) rotate(-2deg);
    }
    :host(.compact) {
      .banner {
        grid-template-columns: 1fr 0.8fr;
        padding: clamp(22px, 3vw, 36px);
      }
      h3 {
        font-size: clamp(1.2rem, 2.2vw, 1.6rem);
      }
      p {
        font-size: 0.86rem;
      }
    }
    @media (max-width: 640px) {
      .banner {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .copy {
        justify-items: center;
      }
      .art {
        order: -1;
        img {
          width: 200px;
        }
      }
      :host(.compact) .banner {
        grid-template-columns: 1fr 110px;
        text-align: start;
        .copy {
          justify-items: start;
        }
        .art {
          order: 0;
          img {
            width: 110px;
          }
        }
        p {
          display: none;
        }
      }
    }
  `,
})
export class Banner {
  readonly banner = input.required<PromoBanner>();
}
