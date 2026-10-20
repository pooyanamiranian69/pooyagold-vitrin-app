import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { Icon } from '../icon/icon';

/** اسلایدر افقی سبک با scroll-snap (بدون کتابخانه) */
@Component({
  selector: 'app-rail',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="track" #track>
      <ng-content />
    </div>
    <button type="button" class="nav prev" (click)="scroll(1)" aria-label="قبلی">
      <app-icon name="chevron-right" />
    </button>
    <button type="button" class="nav next" (click)="scroll(-1)" aria-label="بعدی">
      <app-icon name="chevron-left" />
    </button>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      --item: clamp(190px, 23%, 290px);
    }
    .track {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: var(--item);
      gap: clamp(12px, 2vw, 20px);
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: 2px;
      padding: 6px 2px 14px;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      > ::ng-deep * {
        scroll-snap-align: start;
      }
    }
    .nav {
      position: absolute;
      top: 40%;
      display: grid;
      place-items: center;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      color: var(--text);
      opacity: 0;
      transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
      &:hover {
        transform: scale(1.08);
        color: var(--brand-text);
      }
    }
    .prev {
      inset-inline-start: -18px;
    }
    .next {
      inset-inline-end: -18px;
    }
    :host(:hover) .nav {
      opacity: 1;
    }
    @media (max-width: 900px) {
      :host {
        --item: 44%;
      }
      .nav {
        display: none;
      }
    }
    @media (max-width: 560px) {
      :host {
        --item: 64%;
      }
    }
  `,
})
export class Rail {
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  scroll(dir: 1 | -1) {
    const el = this.track().nativeElement;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }
}
