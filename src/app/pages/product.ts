import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../core/i18n';
import { RequestList } from '../core/request-list';
import { Seo } from '../core/seo.service';
import { SITE } from '../core/site.config';
import { PRODUCTS, categoryBySlug, productBySlug } from '../data/catalog';
import { LeadForm } from '../ui/lead-form';
import { ProductCard } from '../ui/product-card';
import { ProductMedia } from '../ui/product-media';
import { NotFound } from './not-found';

@Component({
  selector: 'app-product',
  imports: [RouterLink, LeadForm, ProductCard, ProductMedia, NotFound],
  template: `
    @if (product(); as p) {
      <div class="container page">
        <nav class="crumbs" aria-label="breadcrumb">
          <a [routerLink]="i18n.link()">{{ i18n.t('nav.home') }}</a> /
          <a [routerLink]="i18n.link('catalog')">{{ i18n.t('nav.catalog') }}</a> /
          @if (cat(); as c) {
            <a [routerLink]="i18n.link('catalog', c.slug)">{{ i18n.loc(c.name) }}</a> /
          }
          <span>{{ i18n.loc(p.name) }}</span>
        </nav>

        <div class="top">
          <div class="media card">
            <app-product-media [p]="p" [eager]="true" [withGallery]="true" />
          </div>

          <div class="info">
            <span class="eyebrow">{{ cat() ? i18n.loc(cat()!.name) : "" }}</span>
            <h1>{{ i18n.loc(p.name) }}</h1>
            <p class="short">{{ i18n.loc(p.short) }}</p>

            <div class="price card">
              <span class="price__label">{{ i18n.t('price.approx') }}</span>
              <strong>{{ i18n.money(p.priceFrom) }} – {{ i18n.money(p.priceTo) }}</strong>
              <small>{{ i18n.t('price.note') }}</small>
            </div>

            <div class="cta">
              <button type="button" class="btn btn--primary" (click)="quote(p.slug)">{{ i18n.t('cta.priceRequest') }}</button>
              <button type="button" class="btn" [class.btn--on]="inList()" (click)="list.toggle(p.slug)">
                {{ inList() ? i18n.t('cta.inRequest') + ' ✓' : i18n.t('cta.addRequest') }}
              </button>
              <button type="button" class="btn btn--ghost" [class.btn--on]="inCmp()" (click)="cmp(p.slug)">⇄ {{ i18n.t('cta.compare') }}</button>
            </div>

            <ul class="feat">
              @for (f of p.features; track $index) {
                <li>{{ i18n.loc(f) }}</li>
              }
            </ul>
          </div>
        </div>

        <div class="cols">
          <section class="card block">
            <h2>{{ i18n.t('product.specs') }}</h2>
            <table>
              <tbody>
                @for (s of p.specs; track $index) {
                  <tr>
                    <th scope="row">{{ i18n.loc(s.label) }}</th>
                    <td>{{ i18n.loc(s.value) }}</td>
                  </tr>
                }
                @if (p.brand) {
                  <tr>
                    <th scope="row">{{ i18n.t('product.brand') }}</th>
                    <td>{{ p.brand }}</td>
                  </tr>
                }
              </tbody>
            </table>
            <h2 class="desc-h">{{ i18n.loc(p.name) }}</h2>
            <p class="desc">{{ i18n.loc(p.description) }}</p>
          </section>

          <aside class="card block ask">
            <h2>{{ i18n.t('product.ask') }}</h2>
            <app-lead-form source="product" [productSlug]="p.slug" [compact]="true" [heading]="false" />
          </aside>
        </div>

        @if (related().length) {
          <h2 class="rel-h">{{ i18n.t('product.related') }}</h2>
          <div class="grid rel">
            @for (r of related(); track r.slug) {
              <app-product-card [p]="r" />
            }
          </div>
        }
      </div>
    } @else {
      <app-not-found />
    }
  `,
  styles: `
    .page { padding-block: 28px 80px; }
    .crumbs { color: var(--muted); font-size: .85rem; margin-bottom: 18px; }
    .crumbs a:hover { color: var(--accent-text); }
    .top { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(24px, 4vw, 56px); align-items: start; }
    .media { overflow: hidden; }
    h1 { font-size: clamp(1.7rem, 3.2vw, 2.5rem); }
    .short { color: var(--muted); font-size: 1.05rem; }
    .price { padding: 18px 20px; display: grid; gap: 4px; margin: 18px 0; }
    .price__label { font-size: .75rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
    .price strong { font-size: 1.7rem; color: var(--accent-text); letter-spacing: -.02em; }
    .price small { color: var(--muted); font-size: .8rem; }
    .cta { display: flex; flex-wrap: wrap; gap: 10px; }
    .feat { margin-top: 22px; display: grid; gap: 8px; }
    .feat li::before { content: '✔'; color: var(--accent); margin-right: 10px; }
    .cols { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; margin-top: 40px; align-items: start; }
    .block { padding: 26px; }
    .block h2 { font-size: 1.3rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 12px 0; border-bottom: 1px solid var(--line); vertical-align: top; }
    th { color: var(--muted); font-weight: 600; width: 42%; padding-right: 12px; }
    .desc-h { margin-top: 28px; }
    .desc { color: var(--muted); margin: 0; }
    .ask { position: sticky; top: 130px; }
    .rel-h { margin-top: 56px; }
    .rel { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    @media (max-width: 900px) { .top, .cols { grid-template-columns: 1fr; } .ask { position: static; } }
  `,
})
export class Product {
  protected readonly i18n = inject(I18n);
  protected readonly list = inject(RequestList);
  private readonly seo = inject(Seo);

  readonly slug = input.required<string>();

  protected readonly product = computed(() => productBySlug(this.slug()));
  protected readonly cat = computed(() => {
    const p = this.product();
    return p ? categoryBySlug(p.category) : undefined;
  });
  protected readonly related = computed(() => {
    const p = this.product();
    if (!p) return [];
    return PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);
  });
  protected readonly inList = computed(() => this.list.slugs().includes(this.slug()));
  protected readonly inCmp = computed(() => this.list.compareSlugs().includes(this.slug()));

  constructor() {
    effect(() => {
      const p = this.product();
      if (!p) return;
      const lang = this.i18n.lang();
      const url = `${SITE.url}/${lang}/product/${p.slug}`;
      this.seo.set({
        title: this.i18n.loc(p.name),
        description: this.i18n.loc(p.short) + ' ' + this.i18n.t('price.approx') + ': ' + this.i18n.money(p.priceFrom) + ' – ' + this.i18n.money(p.priceTo) + '.',
        path: `product/${p.slug}`,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: this.i18n.loc(p.name),
            description: this.i18n.loc(p.description),
            brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
            category: this.cat() ? this.i18n.loc(this.cat()!.name) : undefined,
            url,
            image: (p.images ?? []).map((i) => SITE.url + i),
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: SITE.currency,
              lowPrice: p.priceFrom,
              highPrice: p.priceTo,
              availability: 'https://schema.org/InStock',
              url,
              seller: { '@type': 'Organization', name: SITE.name },
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.url}/${lang}` },
              { '@type': 'ListItem', position: 2, name: this.i18n.t('nav.catalog'), item: `${SITE.url}/${lang}/catalog` },
              { '@type': 'ListItem', position: 3, name: this.i18n.loc(p.name) },
            ],
          },
        ],
      });
    });
  }

  protected quote(slug: string): void {
    this.list.add(slug);
    this.list.openDrawer();
  }

  protected cmp(slug: string): void {
    if (!this.list.toggleCompare(slug)) alert(this.i18n.t('compare.max'));
  }
}
