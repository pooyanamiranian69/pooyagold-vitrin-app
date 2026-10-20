import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { StoreApi } from '../../core/api/store.api';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/icon/icon';
import { FaPipe } from '../../shared/pipes';

@Component({
  selector: 'app-addresses',
  imports: [Icon, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">
      <div class="head">
        <h1>آدرس‌های من</h1>
        <button type="button" class="btn btn-primary btn-sm" (click)="toast.show('افزودن آدرس به‌زودی فعال می‌شود', 'pin')">
          <app-icon name="plus" /> آدرس جدید
        </button>
      </div>
      <div class="grid">
        @for (a of addresses(); track a.id) {
          <article class="addr" [class.default]="a.isDefault">
            <div class="a-head">
              <strong><app-icon name="pin" /> {{ a.title }}</strong>
              @if (a.isDefault) {
                <span class="badge badge-brand">پیش‌فرض</span>
              }
            </div>
            <p>{{ a.city }}، {{ a.line }}</p>
            <dl>
              <div><dt>گیرنده</dt><dd>{{ a.recipient }}</dd></div>
              <div><dt>موبایل</dt><dd class="ltr">{{ a.phone | fa }}</dd></div>
              <div><dt>کد پستی</dt><dd class="ltr">{{ a.postalCode | fa }}</dd></div>
            </dl>
            <div class="a-actions">
              <button type="button" class="btn btn-ghost btn-sm"><app-icon name="edit" /> ویرایش</button>
              <button type="button" class="btn btn-ghost btn-sm danger"><app-icon name="trash" /> حذف</button>
            </div>
          </article>
        }
      </div>
    </div>
  `,
  styles: `
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      h1 {
        font-size: 1.3rem;
      }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .addr {
      display: grid;
      gap: 0.7rem;
      padding: 1.1rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      transition: border-color var(--dur) var(--ease);
      &.default {
        border-color: var(--brand-line);
        background: var(--brand-softer);
      }
      p {
        color: var(--text-2);
        font-size: 0.9rem;
      }
    }
    .a-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      strong {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      app-icon {
        color: var(--brand-text);
      }
    }
    dl {
      margin: 0;
      display: grid;
      gap: 0.3rem;
      div {
        display: flex;
        justify-content: space-between;
        font-size: 0.84rem;
      }
      dt {
        color: var(--muted);
      }
      dd {
        margin: 0;
        font-weight: 700;
      }
    }
    .a-actions {
      display: flex;
      gap: 0.25rem;
      border-top: 1px solid var(--border);
      padding-top: 0.6rem;
      .danger {
        color: var(--danger);
      }
    }
  `,
})
export class Addresses {
  protected readonly toast = inject(ToastService);
  protected readonly addresses = toSignal(inject(StoreApi).addresses(), { initialValue: [] });
}
