import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { I18n, type I18nKey } from '../core/i18n';
import { Analytics } from '../core/analytics';
import { Seo } from '../core/seo.service';
import { CATEGORIES, PRODUCTS, SYSTEMS, categoryBySlug, type System } from '../data/catalog';
import { LeadForm } from '../ui/lead-form';
import { ProductCard } from '../ui/product-card';

const URGENCY = ['urgent', 'week', 'plan'] as const;

/** Подбор по системе: система → что нужно → срочность → подборка и готовая заявка менеджеру. */
@Component({
  selector: 'app-selector',
  imports: [LeadForm, ProductCard],
  template: `
    <div class="container page">
      <h1>{{ i18n.t('selector.title') }}</h1>
      <p class="sub">{{ i18n.t('selector.sub') }}</p>

      @if (step() < 3) {
        <div class="card box">
          <div class="progress" aria-hidden="true"><i [style.width.%]="((step() + 1) / 3) * 100"></i></div>
          <p class="step">{{ i18n.t('selector.step') }} {{ step() + 1 }} {{ i18n.t('selector.of') }} 3</p>
          <h2>{{ i18n.t(question()) }}</h2>

          <div class="opts">
            @switch (step()) {
              @case (0) {
                @for (sy of systems; track sy) {
                  <button type="button" class="opt" (click)="pick(sy)">{{ i18n.t(sKey(sy)) }}</button>
                }
                <button type="button" class="opt" (click)="pick('any')">{{ i18n.t('selector.any') }}</button>
              }
              @case (1) {
                @for (c of stepCats(); track c.slug) {
                  <button type="button" class="opt" (click)="pick(c.slug)">{{ i18n.loc(c.name) }}</button>
                }
                <button type="button" class="opt" (click)="pick('any')">{{ i18n.t('selector.any') }}</button>
              }
              @case (2) {
                @for (u of urgency; track u) {
                  <button type="button" class="opt" (click)="pick(u)">{{ i18n.t(uKey(u)) }}</button>
                }
              }
            }
          </div>

          @if (step() > 0) {
            <button type="button" class="btn btn--sm btn--ghost back" (click)="back()">← {{ i18n.t('selector.back') }}</button>
          }
        </div>
      } @else {
        <h2 class="res-h">{{ i18n.t('selector.result') }}</h2>
        <p class="sub">{{ i18n.t('selector.result.sub') }}</p>
        <div class="grid res">
          @for (p of recommended(); track p.slug) {
            <app-product-card [p]="p" />
          }
        </div>
        <div class="card box form">
          <app-lead-form source="selector" [context]="summary()" [compact]="true" />
        </div>
        <button type="button" class="btn btn--sm" (click)="restart()">{{ i18n.t('selector.restart') }}</button>
      }
    </div>
  `,
  styles: `
    .page { padding-block: 40px 90px; max-width: 980px; }
    .sub { color: var(--muted); max-width: 64ch; }
    .box { padding: 28px; margin-block: 24px; }
    .progress { height: 6px; border-radius: 6px; background: var(--line); overflow: hidden; margin-bottom: 14px; }
    .progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transition: width .3s; }
    .step { color: var(--accent-text); font-weight: 700; font-size: .85rem; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 6px; }
    .opts { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin: 18px 0; }
    .opt { text-align: left; padding: 18px 20px; border-radius: 16px; border: 1px solid var(--line); background: var(--bg); color: var(--text); font: inherit; font-weight: 600; cursor: pointer; transition: .2s; }
    .opt:hover { border-color: var(--accent); background: rgb(var(--accent-rgb) / .08); transform: translateY(-2px); }
    .res-h { margin-top: 28px; }
    .res { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); margin-block: 20px; }
    .form { max-width: 560px; }
  `,
})
export class Selector implements OnInit {
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(Seo);
  private readonly analytics = inject(Analytics);

  protected readonly systems = SYSTEMS;
  protected readonly urgency = URGENCY;

  protected readonly step = signal(0);
  private readonly answers = signal<string[]>([]);

  protected readonly question = computed(() => `selector.q${this.step() + 1}` as I18nKey);

  /** Категории, в которых есть позиции выбранной системы. */
  protected readonly stepCats = computed(() => {
    const sys = this.answers()[0];
    return CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c.slug && (sys === 'any' || p.systems.includes(sys as System))));
  });

  protected readonly recommended = computed(() => {
    const [sys, cat] = this.answers();
    const bySys = PRODUCTS.filter((p) => !sys || sys === 'any' || p.systems.includes(sys as System));
    const byCat = cat && cat !== 'any' ? bySys.filter((p) => p.category === cat) : bySys;
    return (byCat.length ? byCat : bySys).slice(0, 9);
  });

  /** Текст для менеджера: что выбрал клиент. */
  protected readonly summary = computed(() => {
    const [sys, cat, urg] = this.answers();
    if (!sys) return '';
    const sysName: Record<string, string> = { dc400: 'DC-400', innershield: 'Innershield', stt: 'STT', concoa: 'Concoa', any: 'не знаю' };
    const catName = cat && cat !== 'any' ? categoryBySlug(cat)?.name.ru : 'не знаю';
    return `[Подбор] Система: ${sysName[sys]}; нужно: ${catName}; срочность: ${urg}`;
  });

  protected sKey = (s: string) => `selector.s.${s}` as I18nKey;
  protected uKey = (u: string) => `selector.u.${u}` as I18nKey;

  ngOnInit(): void {
    this.seo.set({ title: this.i18n.t('seo.selector.title'), description: this.i18n.t('seo.selector.desc'), path: 'selector' });
  }

  protected pick(value: string): void {
    this.answers.update((a) => [...a.slice(0, this.step()), value]);
    this.step.update((s) => s + 1);
    if (this.step() === 3) this.analytics.goal('selector_done');
  }

  protected back(): void {
    this.step.update((s) => Math.max(0, s - 1));
  }

  protected restart(): void {
    this.answers.set([]);
    this.step.set(0);
  }
}
