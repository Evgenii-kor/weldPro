import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../core/i18n';
import { RequestList } from '../core/request-list';
import { categoryBySlug, type Product } from '../data/catalog';
import { ProductMedia } from './product-media';
import { Tilt } from './motion';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, ProductMedia, Tilt],
  template: `
    <article class="pc" tilt>
      <a class="pc__media" [routerLink]="i18n.link('product', p().slug)">
        <app-product-media [p]="p()" />
        @if (p().brand) {
          <span class="pc__brand">{{ p().brand }}</span>
        }
        <span class="pc__avail" [class.pc__avail--on]="p().availability === 'stock'">{{ i18n.t(p().availability === 'stock' ? 'avail.stock' : 'avail.order') }}</span>
      </a>
      <div class="pc__body">
        <h3 class="pc__title">
          <a [routerLink]="i18n.link('product', p().slug)">{{ i18n.loc(p().name) }}</a>
        </h3>
        <p class="pc__short">{{ i18n.loc(p().short) }}</p>
        <div class="pc__price">
          <span class="pc__price-label">{{ i18n.t('price.approx') }}</span>
          <strong>{{ i18n.money(p().priceFrom) }} – {{ i18n.money(p().priceTo) }}</strong>
        </div>
        <div class="pc__actions">
          <button
            type="button"
            class="btn btn--sm"
            [class.btn--primary]="!inList()"
            [class.btn--on]="inList()"
            [attr.aria-pressed]="inList()"
            (click)="toggleRequest()"
          >
            {{ inList() ? i18n.t('cta.inRequest') + ' ✓' : i18n.t('cta.addRequest') }}
          </button>
          <button
            type="button"
            class="btn btn--sm btn--ghost"
            [class.btn--on]="cmp()"
            [attr.aria-pressed]="cmp()"
            [title]="i18n.t('cta.compare')"
            (click)="toggleCompare()"
          >
            ⇄ {{ i18n.t('cta.compare') }}
          </button>
        </div>
      </div>
    </article>
  `,
  styles: `
    .pc {
      display: flex; flex-direction: column; height: 100%;
      background: linear-gradient(180deg, var(--surface), var(--bg-2));
      border: 1px solid var(--line); border-radius: var(--radius-lg);
      overflow: hidden; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
    }
    .pc { position: relative; will-change: transform; }
    .pc::after { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .25s; background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent2-rgb) / .16), transparent 60%); }
    .pc:hover::after { opacity: 1; }
    .pc:hover { transform: translateY(-4px); border-color: rgb(var(--accent-rgb) / .55); box-shadow: var(--shadow); }
    .pc__media { position: relative; display: block; aspect-ratio: 400/260; }
    .pc__media app-product-media { height: 100%; }
    .pc__brand {
      position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 999px;
      background: rgb(var(--bg-rgb) / .75); backdrop-filter: blur(6px); border: 1px solid var(--line);
      font-size: .72rem; font-weight: 700; letter-spacing: .06em;
    }
    .pc__avail { position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 999px; background: rgb(var(--bg-rgb) / .75); border: 1px solid var(--line); font-size: .72rem; font-weight: 700; color: var(--muted); }
    .pc__avail--on { color: var(--ok); border-color: var(--ok); }
    .pc__body { display: flex; flex-direction: column; gap: 10px; padding: 18px; flex: 1; }
    .pc__title { margin: 0; font-size: 1.05rem; }
    .pc__title a:hover { color: var(--accent-text); }
    .pc__short { margin: 0; color: var(--muted); font-size: .92rem; flex: 1; }
    .pc__price { display: grid; gap: 2px; }
    .pc__price-label { font-size: .72rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
    .pc__price strong { font-size: 1.05rem; color: var(--accent-text); }
    .pc__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
  `,
})
export class ProductCard {
  protected readonly i18n = inject(I18n);
  protected readonly list = inject(RequestList);

  readonly p = input.required<Product>();

  protected readonly glyph = computed(() => categoryBySlug(this.p().category)?.glyph ?? 'gun');
  protected readonly inList = computed(() => this.list.slugs().includes(this.p().slug));
  protected readonly cmp = computed(() => this.list.compareSlugs().includes(this.p().slug));

  protected toggleRequest(): void {
    this.list.toggle(this.p().slug);
    if (this.inList()) this.list.openDrawer();
  }

  protected toggleCompare(): void {
    if (!this.list.toggleCompare(this.p().slug)) {
      alert(this.i18n.t('compare.max'));
    }
  }
}
