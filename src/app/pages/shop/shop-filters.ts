import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { METAL_SWATCH } from '../../core/data/labels';
import { Facets } from '../../core/models';
import { FaPipe, TomanPipe } from '../../shared/pipes';
import { RangeSlider } from '../../shared/range-slider/range-slider';
import { ShopState } from './shop-state';

@Component({
  selector: 'app-shop-filters',
  imports: [RangeSlider, FaPipe, TomanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let s = state();
    @let f = facets();
    <div class="group toggles">
      <label class="toggle">
        <span>فقط کالاهای موجود</span>
        <input type="checkbox" class="switch" [checked]="s.inStock" (change)="patch.emit({ inStock: !s.inStock })" />
      </label>
      <label class="toggle">
        <span>فقط تخفیف‌دارها</span>
        <input type="checkbox" class="switch" [checked]="s.discounted" (change)="patch.emit({ discounted: !s.discounted })" />
      </label>
    </div>

    <details class="group" open>
      <summary>محدوده قیمت <small>(تومان)</small></summary>
      <div class="range-box">
        <app-range-slider
          [min]="f.price[0]"
          [max]="f.price[1]"
          [step]="100000"
          label="قیمت"
          [(value)]="price"
          (committed)="patch.emit({ price: $event })"
        />
        <div class="range-values">
          <span><small>از</small> {{ price()[0] | toman }}</span>
          <span><small>تا</small> {{ price()[1] | toman }}</span>
        </div>
      </div>
    </details>

    <details class="group" open>
      <summary>وزن <small>(گرم)</small></summary>
      <div class="range-box">
        <app-range-slider
          [min]="f.weight[0]"
          [max]="f.weight[1]"
          [step]="0.1"
          label="وزن"
          [(value)]="weight"
          (committed)="patch.emit({ weight: $event })"
        />
        <div class="range-values">
          <span><small>از</small> {{ weight()[0] | fa }} گرم</span>
          <span><small>تا</small> {{ weight()[1] | fa }} گرم</span>
        </div>
      </div>
    </details>

    <details class="group" open>
      <summary>حداکثر اجرت</summary>
      <div class="chips">
        @for (w of wageSteps; track w) {
          @if (w >= f.wage[0]) {
            <button type="button" class="chip" [class.active]="s.maxWage === w" (click)="patch.emit({ maxWage: s.maxWage === w ? null : w })">
              تا {{ w | fa }}٪
            </button>
          }
        }
      </div>
    </details>

    <details class="group" open>
      <summary>رنگ طلا</summary>
      <div class="swatches">
        @for (m of f.metals; track m.value) {
          <button
            type="button"
            class="swatch"
            [class.active]="s.metals.includes(m.value)"
            (click)="patch.emit({ metals: toggle(s.metals, m.value) })"
          >
            <span class="sw" [style.background]="swatch[m.value]"></span>
            {{ m.label }}
            <small>{{ m.count | fa }}</small>
          </button>
        }
      </div>
    </details>

    @if (f.genders.length > 1) {
      <details class="group" open>
        <summary>مناسب برای</summary>
        @for (g of f.genders; track g.value) {
          <label class="check">
            <input type="checkbox" [checked]="s.genders.includes(g.value)" (change)="patch.emit({ genders: toggle(s.genders, g.value) })" />
            {{ g.label }}
            <span class="count">{{ g.count | fa }}</span>
          </label>
        }
      </details>
    }

    <details class="group" open>
      <summary>نوع سنگ</summary>
      @for (st of f.stones; track st.value) {
        <label class="check">
          <input type="checkbox" [checked]="s.stones.includes(st.value)" (change)="patch.emit({ stones: toggle(s.stones, st.value) })" />
          {{ st.label }}
          <span class="count">{{ st.count | fa }}</span>
        </label>
      }
    </details>

    <details class="group">
      <summary>برند</summary>
      @for (b of f.brands; track b.value) {
        <label class="check">
          <input type="checkbox" [checked]="s.brands.includes(b.value)" (change)="patch.emit({ brands: toggle(s.brands, b.value) })" />
          {{ b.label }}
          <span class="count">{{ b.count | fa }}</span>
        </label>
      }
    </details>
  `,
  styles: `
    :host {
      display: grid;
      gap: 0.25rem;
    }
    .group {
      padding-block: 0.9rem;
      border-bottom: 1px solid var(--border);
      &:last-child {
        border-bottom: 0;
      }
    }
    summary {
      list-style: none;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 800;
      font-size: 0.92rem;
      cursor: pointer;
      margin-bottom: 0.4rem;
      &::-webkit-details-marker {
        display: none;
      }
      &::after {
        content: '';
        margin-inline-start: auto;
        width: 7px;
        height: 7px;
        border-inline-start: 2px solid var(--muted);
        border-bottom: 2px solid var(--muted);
        transform: rotate(-45deg);
        transition: transform var(--dur) var(--ease);
      }
      small {
        font-weight: 500;
        color: var(--muted);
      }
    }
    details[open] summary::after {
      transform: rotate(135deg);
    }
    details:not([open]) summary {
      margin-bottom: 0;
    }
    .toggles {
      display: grid;
      gap: 0.6rem;
      padding-top: 0;
    }
    .toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
    }
    .range-box {
      padding-top: 0.5rem;
    }
    .range-values {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      margin-top: 0.5rem;
      span {
        flex: 1;
        padding: 0.35rem 0.6rem;
        border-radius: var(--radius-sm);
        background: var(--surface-2);
        font-size: 0.8rem;
        font-weight: 700;
        text-align: center;
      }
      small {
        color: var(--muted);
        font-weight: 500;
      }
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding-top: 0.25rem;
      .chip {
        height: 32px;
        font-size: 0.8rem;
      }
    }
    .swatches {
      display: grid;
      gap: 0.4rem;
    }
    .swatch {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.6rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-2);
      transition: all var(--dur) var(--ease);
      small {
        margin-inline-start: auto;
        color: var(--muted);
      }
      &:hover {
        border-color: var(--brand-line);
      }
      &.active {
        border-color: var(--brand);
        background: var(--brand-softer);
        color: var(--text);
        .sw {
          box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--brand);
        }
      }
    }
    .sw {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid rgb(0 0 0 / 0.08);
      transition: box-shadow var(--dur) var(--ease);
    }
  `,
})
export class ShopFilters {
  readonly state = input.required<ShopState>();
  readonly facets = input.required<Facets>();
  readonly patch = output<Partial<ShopState>>();

  protected readonly swatch = METAL_SWATCH;
  protected readonly wageSteps = [5, 10, 15, 20, 25];

  protected readonly price = linkedSignal<[number, number]>(
    () => this.state().price ?? this.facets().price,
  );
  protected readonly weight = linkedSignal<[number, number]>(
    () => this.state().weight ?? this.facets().weight,
  );

  protected toggle<T>(list: T[], v: T): T[] {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }
}

