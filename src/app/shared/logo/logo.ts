import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONFIG } from '../../core/config/site.config';

/** لوگوی سایت؛ رنگ آن از رنگ تم انتخابی (accent) پیروی می‌کند */
@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/" class="logo" [attr.aria-label]="config.name">
      <span class="mark">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" style="stop-color: color-mix(in oklab, var(--brand) 45%, #fff)" />
              <stop offset=".5" style="stop-color: var(--brand)" />
              <stop offset="1" style="stop-color: var(--brand-strong)" />
            </linearGradient>
          </defs>
          <polygon points="10,18 17,9 31,9 38,18 24,40" fill="url(#logo-g)" />
          <path
            d="M10 18h28M17 9l3 9 4 22M31 9l-3 9-4 22M20 18l4-9 4 9"
            fill="none"
            stroke="#fff"
            stroke-opacity=".6"
            stroke-width="1"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      @if (!compact()) {
        <span class="text">
          <strong>{{ config.shortName }}</strong>
          <small>{{ config.tagline }}</small>
        </span>
      }
    </a>
  `,
  styles: `
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
    }
    .mark {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      background: radial-gradient(circle at 50% 30%, color-mix(in oklab, var(--brand) 22%, var(--surface)), var(--surface-2));
      border: 1px solid var(--brand-line);
      transition: transform var(--dur-slow) var(--ease-spring);
      svg {
        width: 30px;
        height: 30px;
      }
    }
    .logo:hover .mark {
      transform: rotate(-8deg) scale(1.05);
    }
    .text {
      display: grid;
      line-height: 1.25;
      strong {
        font-size: 1.2rem;
        font-weight: 900;
        letter-spacing: -0.01em;
      }
      small {
        font-size: 0.7rem;
        color: var(--muted);
        font-weight: 500;
      }
    }
  `,
})
export class Logo {
  readonly compact = input(false);
  protected readonly config = inject(SITE_CONFIG);
}
