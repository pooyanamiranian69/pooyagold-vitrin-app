import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-toasts',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stack" role="status" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast">
          <span class="ic"><app-icon [name]="t.icon" /></span>
          <span class="text">{{ t.text }}</span>
          @if (t.action) {
            <a [routerLink]="t.action.link" (click)="toast.dismiss(t.id)">{{ t.action.label }}</a>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .stack {
      position: fixed;
      z-index: 100;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: grid;
      gap: 0.5rem;
      width: min(420px, calc(100vw - 32px));
      pointer-events: none;
    }
    @media (max-width: 900px) {
      .stack {
        bottom: calc(90px + env(safe-area-inset-bottom));
      }
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 0.8rem;
      border-radius: var(--radius);
      background: #1c1915;
      color: #f4efe7;
      box-shadow: var(--shadow-lg);
      font-size: 0.88rem;
      pointer-events: auto;
      animation: toast-in var(--dur-slow) var(--ease-spring);
    }
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.96);
      }
    }
    .ic {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      flex: none;
      border-radius: 50%;
      background: var(--brand);
      color: var(--on-brand);
      app-icon {
        width: 17px;
        height: 17px;
      }
    }
    .text {
      flex: 1;
    }
    a {
      font-weight: 800;
      color: var(--brand);
      padding-inline: 0.4rem;
    }
  `,
})
export class Toasts {
  protected readonly toast = inject(ToastService);
}
