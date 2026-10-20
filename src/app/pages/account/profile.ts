import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { StoreApi } from '../../core/api/store.api';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/icon/icon';
import { FaPipe } from '../../shared/pipes';

@Component({
  selector: 'app-profile',
  imports: [Icon, FaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="panel" (submit)="save($event)">
      <h1>اطلاعات حساب کاربری</h1>
      @if (profile(); as u) {
        <div class="grid">
          <div class="field"><label for="p-fn">نام</label><input id="p-fn" class="input" [value]="u.firstName" /></div>
          <div class="field"><label for="p-ln">نام خانوادگی</label><input id="p-ln" class="input" [value]="u.lastName" /></div>
          <div class="field">
            <label for="p-ph">شماره موبایل</label>
            <input id="p-ph" class="input ltr" [value]="u.phone" disabled />
            <span class="hint">برای تغییر شماره با پشتیبانی تماس بگیرید.</span>
          </div>
          <div class="field"><label for="p-em">ایمیل</label><input id="p-em" class="input ltr" type="email" [value]="u.email" /></div>
          <div class="field"><label for="p-ni">کد ملی</label><input id="p-ni" class="input ltr" [value]="u.nationalId" inputmode="numeric" /></div>
          <div class="field"><label for="p-bd">تاریخ تولد</label><input id="p-bd" class="input ltr" [value]="u.birthDate" /></div>
        </div>
        <div class="foot">
          <span class="muted">عضو از {{ u.memberSince | fa }}</span>
          <button type="submit" class="btn btn-primary"><app-icon name="check" /> ذخیره تغییرات</button>
        </div>
      }
    </form>
  `,
  styles: `
    h1 {
      font-size: 1.3rem;
      margin-bottom: 1.25rem;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem 1.25rem;
    }
    .input:disabled {
      opacity: 0.6;
    }
    .foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.86rem;
    }
    @media (max-width: 640px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Profile {
  private readonly toast = inject(ToastService);
  protected readonly profile = toSignal(inject(StoreApi).profile());

  protected save(e: Event) {
    e.preventDefault();
    this.toast.show('اطلاعات حساب ذخیره شد', 'check');
  }
}
