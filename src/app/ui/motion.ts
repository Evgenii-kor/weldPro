import { Directive, ElementRef, Component, afterNextRender, inject, input, signal } from '@angular/core';

const inView = (el: HTMLElement): boolean => {
  const r = el.getBoundingClientRect();
  return r.top < innerHeight * 0.95 && r.bottom > 0;
};

/**
 * Плавное появление блока при прокрутке. В серверной разметке блок виден,
 * скрывается только после загрузки скриптов (класс js-reveal) — поисковики и
 * пользователи без JS видят весь контент.
 */
@Directive({
  selector: '[reveal]',
  host: { class: 'reveal', '[style.--d]': '(reveal() || 0) + "ms"' },
})
export class Reveal {
  readonly reveal = input<number | ''>(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || inView(el)) {
        el.classList.add('in');
      }
      document.documentElement.classList.add('js-reveal');
      if (el.classList.contains('in')) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            el.classList.add('in');
            io.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      io.observe(el);
    });
  }
}

/** 3D-наклон элемента за курсором (только мышь, без prefers-reduced-motion). */
@Directive({
  selector: '[tilt]',
  host: { '(pointermove)': 'move($event)', '(pointerleave)': 'leave()' },
})
export class Tilt {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly off = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected move(e: PointerEvent): void {
    if (this.off || e.pointerType !== 'mouse') return;
    const r = this.el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    this.el.style.transition = 'transform .1s ease-out';
    this.el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
    this.el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(0)}%`);
    this.el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(0)}%`);
  }

  protected leave(): void {
    this.el.style.transition = '';
    this.el.style.transform = '';
  }
}

/** Число, которое «набегает» от нуля при появлении в поле зрения. */
@Component({
  selector: 'app-counter',
  template: `{{ shown() ?? to() }}{{ suffix() }}`,
})
export class Counter {
  readonly to = input.required<number>();
  readonly suffix = input('');
  protected readonly shown = signal<number | null>(null);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const to = this.to();
        const step = (now: number) => {
          const k = Math.min(1, (now - start) / 1400);
          this.shown.set(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      io.observe(el);
    });
  }
}
