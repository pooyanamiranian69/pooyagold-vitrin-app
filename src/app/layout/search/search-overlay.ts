import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs';
import { StoreApi } from '../../core/api/store.api';
import { UiService } from '../../core/services/ui.service';
import { Icon } from '../../shared/icon/icon';
import { FaPipe, TomanPipe } from '../../shared/pipes';

@Component({
  selector: 'app-search-overlay',
  imports: [RouterLink, Icon, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" (click)="ui.searchOpen.set(false)"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-label="جستجو">
      <form class="container bar" (submit)="submit($event)">
        <app-icon name="search" />
        <input
          #input
          type="search"
          placeholder="نام محصول، برند یا نوع جواهر را بنویسید..."
          [value]="term()"
          (input)="term.set(input.value)"
          enterkeyhint="search"
          aria-label="عبارت جستجو"
        />
        <button type="button" class="icon-btn" (click)="ui.searchOpen.set(false)" aria-label="بستن">
          <app-icon name="x" />
        </button>
      </form>

      <div class="container content">
        @if (term().trim()) {
          @if (results().length) {
            <ul class="results">
              @for (p of results(); track p.id) {
                <li>
                  <a [routerLink]="['/product', p.slug]">
                    <img [src]="p.images[0]" [alt]="p.title" width="64" height="64" />
                    <span class="r-title">{{ p.title }}</span>
                    <span class="r-meta">{{ p.weight | fa }} گرم</span>
                    <span class="r-price">{{ p.price.total | toman }} <small>تومان</small></span>
                  </a>
                </li>
              }
            </ul>
            <button type="button" class="btn btn-soft btn-block" (click)="submit()">
              مشاهده همه نتایج «{{ term() }}»
              <app-icon name="arrow-left" />
            </button>
          } @else {
            <p class="none">نتیجه‌ای برای «{{ term() }}» پیدا نشد.</p>
          }
        } @else {
          <h4>جستجوهای پرطرفدار</h4>
          <div class="chips">
            @for (s of popular; track s) {
              <button type="button" class="chip" (click)="term.set(s)">{{ s }}</button>
            }
          </div>
          <h4>دسته‌بندی‌ها</h4>
          <div class="chips">
            @for (c of categories(); track c.id) {
              <a class="chip" [routerLink]="['/shop', c.slug]">{{ c.title }}</a>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .sheet {
      position: fixed;
      z-index: 95;
      inset: 0 0 auto;
      max-height: 85dvh;
      overflow-y: auto;
      background: var(--surface);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
      box-shadow: var(--shadow-lg);
      padding-bottom: 1.5rem;
      animation: drop var(--dur-slow) var(--ease);
    }
    @keyframes drop {
      from {
        transform: translateY(-30px);
        opacity: 0;
      }
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      height: 80px;
      border-bottom: 1px solid var(--border);
      > app-icon {
        width: 24px;
        height: 24px;
        color: var(--brand-text);
      }
      input {
        flex: 1;
        min-width: 0;
        height: 100%;
        border: 0;
        background: none;
        font-size: 1.15rem;
        outline: none;
        &::-webkit-search-cancel-button {
          display: none;
        }
      }
    }
    .content {
      padding-top: 1.25rem;
      display: grid;
      gap: 0.75rem;
    }
    h4 {
      font-size: 0.85rem;
      color: var(--muted);
      font-weight: 700;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 0.5rem;
      a {
        display: grid;
        grid-template-columns: 64px 1fr auto;
        grid-template-rows: auto auto;
        column-gap: 0.85rem;
        align-items: center;
        padding: 0.5rem;
        border-radius: var(--radius);
        transition: background-color var(--dur) var(--ease);
        animation: rise var(--dur-slow) var(--ease) both;
        &:hover {
          background: var(--surface-2);
        }
      }
      img {
        grid-row: span 2;
        width: 64px;
        height: 64px;
        border-radius: var(--radius-sm);
        background: var(--surface-2);
        padding: 4px;
      }
      .r-title {
        font-weight: 700;
        font-size: 0.92rem;
      }
      .r-meta {
        grid-column: 2;
        font-size: 0.78rem;
        color: var(--muted);
      }
      .r-price {
        grid-column: 3;
        grid-row: 1 / span 2;
        font-weight: 800;
        font-size: 0.88rem;
        small {
          color: var(--muted);
          font-weight: 500;
        }
      }
    }
    .none {
      color: var(--muted);
      padding: 1.5rem 0;
      text-align: center;
    }
  `,
})
export class SearchOverlay {
  protected readonly ui = inject(UiService);
  private readonly api = inject(StoreApi);
  private readonly router = inject(Router);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected readonly popular = ['انگشتر', 'گردنبند', 'رزگلد', 'برلیان', 'سکه', 'مردانه'];
  protected readonly term = signal('');
  protected readonly categories = toSignal(this.api.categories(), { initialValue: [] });
  protected readonly results = toSignal(
    toObservable(this.term).pipe(
      debounceTime(120),
      switchMap((t) => this.api.search(t, 8)),
    ),
    { initialValue: [] },
  );

  constructor() {
    afterNextRender(() => this.input().nativeElement.focus());
  }

  protected submit(e?: Event) {
    e?.preventDefault();
    const q = this.term().trim();
    if (!q) return;
    this.ui.searchOpen.set(false);
    this.router.navigate(['/shop'], { queryParams: { q } });
  }
}
