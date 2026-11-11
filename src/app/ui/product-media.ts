import { Component, computed, inject, input, signal } from '@angular/core';
import { I18n } from '../core/i18n';
import { categoryBySlug, type Product } from '../data/catalog';
import { ProductVisual } from './product-visual';

/**
 * Фото товара с галереей. Если у товара нет фотографий (поле `images` пусто)
 * или файл не загрузился — показывается векторная иллюстрация категории.
 */
@Component({
  selector: 'app-product-media',
  imports: [ProductVisual],
  template: `
    <div class="main">
      @if (current(); as src) {
        <img [src]="src" [alt]="i18n.loc(p().name)" width="800" height="520" [attr.loading]="eager() ? 'eager' : 'lazy'" decoding="async" (error)="failed.set(true)" />
      } @else {
        <app-product-visual [glyph]="glyph()" [label]="i18n.loc(p().name)" />
      }
    </div>
    @if (withGallery() && photos().length > 1) {
      <div class="thumbs">
        @for (src of photos(); track src; let i = $index) {
          <button type="button" [class.on]="i === idx()" (click)="idx.set(i)" [attr.aria-label]="'Фото ' + (i + 1)">
            <img [src]="src" alt="" width="96" height="64" loading="lazy" />
          </button>
        }
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .main { aspect-ratio: 400/260; overflow: hidden; background: #0d1115; }
    .main img, .main app-product-visual { width: 100%; height: 100%; object-fit: cover; display: block; }
    .thumbs { display: flex; gap: 8px; padding: 10px; }
    .thumbs button { padding: 0; width: 80px; aspect-ratio: 3/2; border: 2px solid var(--line); border-radius: 10px; overflow: hidden; background: none; cursor: pointer; }
    .thumbs button.on { border-color: var(--accent); }
    .thumbs img { width: 100%; height: 100%; object-fit: cover; }
  `,
})
export class ProductMedia {
  protected readonly i18n = inject(I18n);
  readonly p = input.required<Product>();
  readonly eager = input(false);
  /** Показывать миниатюры (на странице товара). */
  readonly withGallery = input(false);

  protected readonly idx = signal(0);
  protected readonly failed = signal(false);
  protected readonly photos = computed(() => this.p().images ?? []);
  protected readonly current = computed(() => (this.failed() ? null : (this.photos()[this.idx()] ?? null)));
  protected readonly glyph = computed(() => categoryBySlug(this.p().category)?.glyph ?? 'gun');

}
