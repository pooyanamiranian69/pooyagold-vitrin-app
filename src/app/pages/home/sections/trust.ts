import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Feature } from '../../../core/models';
import { Icon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-trust',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="trust">
      @for (f of features(); track f.title) {
        <li class="reveal">
          <span class="ic"><app-icon [name]="f.icon" /></span>
          <span>
            <strong>{{ f.title }}</strong>
            <small>{{ f.text }}</small>
          </span>
        </li>
      }
    </ul>
  `,
  styles: `
    .trust {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      padding: 1.1rem 1.2rem;
      border-radius: var(--radius-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      transition: transform var(--dur) var(--ease), border-color var(--dur) var(--ease);
      &:hover {
        transform: translateY(-3px);
        border-color: var(--brand-line);
        .ic {
          transform: rotate(-10deg) scale(1.06);
        }
      }
      > span:last-child {
        display: grid;
        line-height: 1.6;
      }
    }
    .ic {
      display: grid;
      place-items: center;
      flex: none;
      width: 50px;
      height: 50px;
      border-radius: var(--radius);
      background: var(--brand-soft);
      color: var(--brand-text);
      transition: transform var(--dur-slow) var(--ease-spring);
      app-icon {
        width: 24px;
        height: 24px;
      }
    }
    strong {
      font-size: 0.95rem;
    }
    small {
      font-size: 0.78rem;
      color: var(--muted);
    }
    @media (max-width: 1000px) {
      .trust {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 520px) {
      .trust {
        gap: 0.6rem;
      }
      li {
        flex-direction: column;
        text-align: center;
        padding: 1rem 0.6rem;
        gap: 0.5rem;
      }
      small {
        display: none;
      }
    }
  `,
})
export class Trust {
  readonly features = input.required<Feature[]>();
}
