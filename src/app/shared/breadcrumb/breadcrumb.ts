import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

export interface Crumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="مسیر صفحه">
      <ol>
        <li><a routerLink="/"><app-icon name="home" /> خانه</a></li>
        @for (c of items(); track c.label) {
          <li>
            <app-icon name="chevron-left" class="sep" />
            @if (c.link) {
              <a [routerLink]="c.link">{{ c.label }}</a>
            } @else {
              <span aria-current="page">{{ c.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.82rem;
      color: var(--muted);
    }
    li {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      transition: color var(--dur) var(--ease);
      &:hover {
        color: var(--brand-text);
      }
    }
    app-icon {
      width: 15px;
      height: 15px;
    }
    .sep {
      width: 13px;
      opacity: 0.6;
    }
    span {
      color: var(--text);
      font-weight: 600;
    }
  `,
})
export class Breadcrumb {
  readonly items = input<Crumb[]>([]);
}
