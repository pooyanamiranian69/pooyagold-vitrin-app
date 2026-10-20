import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

/** اسلایدر دوطرفه برای بازه (قیمت، وزن، اجرت) */
@Component({
  selector: 'app-range-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="track" [style.--lo.%]="loPct()" [style.--hi.%]="hiPct()">
      <span class="fill"></span>
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()[0]"
        (input)="setLo($any($event.target).valueAsNumber)"
        (change)="committed.emit(value())"
        [attr.aria-label]="label() + ' حداقل'"
      />
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()[1]"
        (input)="setHi($any($event.target).valueAsNumber)"
        (change)="committed.emit(value())"
        [attr.aria-label]="label() + ' حداکثر'"
      />
    </div>
  `,
  styles: `
    .track {
      position: relative;
      height: 28px;
      margin-inline: 10px;
      &::before {
        content: '';
        position: absolute;
        inset-inline: 0;
        top: 12px;
        height: 4px;
        border-radius: 99px;
        background: var(--surface-3);
      }
    }
    .fill {
      position: absolute;
      top: 12px;
      height: 4px;
      border-radius: 99px;
      background: var(--brand);
      inset-inline-start: var(--lo);
      inset-inline-end: calc(100% - var(--hi));
    }
    input {
      position: absolute;
      inset: 0;
      width: 100%;
      margin: 0;
      appearance: none;
      background: none;
      pointer-events: none;
      direction: rtl;
      &::-webkit-slider-thumb {
        appearance: none;
        pointer-events: auto;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--surface);
        border: 5px solid var(--brand);
        box-shadow: var(--shadow);
        cursor: grab;
        transition: transform var(--dur-fast) var(--ease);
      }
      &::-webkit-slider-thumb:active {
        transform: scale(1.15);
        cursor: grabbing;
      }
      &::-moz-range-thumb {
        pointer-events: auto;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--surface);
        border: 5px solid var(--brand);
        cursor: grab;
      }
    }
  `,
})
export class RangeSlider {
  readonly min = input.required<number>();
  readonly max = input.required<number>();
  readonly step = input(1);
  readonly label = input('');
  readonly value = model.required<[number, number]>();
  /** پس از رها کردن دستگیره */
  readonly committed = output<[number, number]>();

  protected readonly loPct = computed(() => this.pct(this.value()[0]));
  protected readonly hiPct = computed(() => this.pct(this.value()[1]));

  private pct(v: number) {
    const span = this.max() - this.min() || 1;
    return ((v - this.min()) / span) * 100;
  }

  protected setLo(v: number) {
    this.value.update(([, hi]) => [Math.min(v, hi), hi]);
  }

  protected setHi(v: number) {
    this.value.update(([lo]) => [lo, Math.max(v, lo)]);
  }
}
