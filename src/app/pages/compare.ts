import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../core/i18n';
import { RequestList } from '../core/request-list';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-compare',
  imports: [RouterLink],
  template: `
    <div class="container page">
      <div class="head">
        <h1>{{ i18n.t('compare.title') }}</h1>
        @if (list.compareItems().length) {
          <button type="button" class="btn btn--sm" (click)="list.clearCompare()">{{ i18n.t('compare.clear') }}</button>
        }
      </div>

      @if (list.compareItems().length) {
        <div class="wrap card">
          <table>
            <thead>
              <tr>
                <th>{{ i18n.t('compare.param') }}</th>
                @for (p of list.compareItems(); track p.slug) {
                  <th>
                    <a [routerLink]="i18n.link('product', p.slug)">{{ i18n.loc(p.name) }}</a>
                    <button type="button" class="rm" (click)="list.toggleCompare(p.slug)" [attr.aria-label]="i18n.t('drawer.remove')">✕</button>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{{ i18n.t('price.approx') }}</th>
                @for (p of list.compareItems(); track p.slug) {
                  <td class="price">{{ i18n.money(p.priceFrom) }} – {{ i18n.money(p.priceTo) }}</td>
                }
              </tr>
              @for (row of rows(); track row.key) {
                <tr>
                  <th scope="row">{{ row.label }}</th>
                  @for (v of row.values; track $index) {
                    <td>{{ v || '—' }}</td>
                  }
                </tr>
              }
              <tr>
                <th scope="row"></th>
                @for (p of list.compareItems(); track p.slug) {
                  <td><button type="button" class="btn btn--primary btn--sm" (click)="quote(p.slug)">{{ i18n.t('cta.priceRequest') }}</button></td>
                }
              </tr>
            </tbody>
          </table>
        </div>
      } @else {
        <p class="empty">{{ i18n.t('compare.empty') }}</p>
        <a class="btn btn--primary" [routerLink]="i18n.link('catalog')">{{ i18n.t('nav.catalog') }}</a>
      }
    </div>
  `,
  styles: `
    .page { padding-block: 32px 90px; }
    .head { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .empty { color: var(--muted); max-width: 52ch; }
    .wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 640px; }
    th, td { text-align: left; padding: 14px 18px; border-bottom: 1px solid var(--line); vertical-align: top; }
    thead th { position: relative; font-size: 1rem; }
    thead th a:hover { color: var(--accent-text); }
    tbody th { color: var(--muted); font-weight: 600; width: 22%; }
    .price { color: var(--accent-text); font-weight: 800; }
    .rm { position: absolute; top: 8px; right: 8px; background: none; border: 0; color: var(--muted); cursor: pointer; }
    .rm:hover { color: var(--danger); }
  `,
})
export class Compare implements OnInit {
  protected readonly i18n = inject(I18n);
  protected readonly list = inject(RequestList);
  private readonly seo = inject(Seo);

  /** Объединение всех характеристик выбранных товаров в строки таблицы. */
  protected readonly rows = computed(() => {
    const items = this.list.compareItems();
    const keys = new Map<string, string>();
    for (const p of items) for (const s of p.specs) if (!keys.has(s.label.en)) keys.set(s.label.en, s.label[this.i18n.lang()]);
    return [...keys.entries()].map(([key, label]) => ({
      key,
      label,
      values: items.map((p) => {
        const s = p.specs.find((x) => x.label.en === key);
        return s ? s.value[this.i18n.lang()] : '';
      }),
    }));
  });

  ngOnInit(): void {
    this.seo.set({ title: this.i18n.t('seo.compare.title'), description: this.i18n.t('seo.catalog.desc'), path: 'compare', noindex: true });
  }

  protected quote(slug: string): void {
    this.list.add(slug);
    this.list.openDrawer();
  }
}
