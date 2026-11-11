import { Component, computed, effect, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { I18n } from '../core/i18n';
import { Seo } from '../core/seo.service';
import { SITE } from '../core/site.config';
import { CATEGORIES, PRODUCTS, categoryBySlug } from '../data/catalog';
import { LeadForm } from '../ui/lead-form';
import { ProductCard } from '../ui/product-card';
import { NotFound } from './not-found';

type Sort = 'popular' | 'priceAsc' | 'priceDesc' | 'name';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, ProductCard, LeadForm, NotFound],
  template: `
    @if (badCategory()) {
      <app-not-found />
    } @else {
    <div class="container page">
      <nav class="crumbs" aria-label="breadcrumb">
        <a [routerLink]="i18n.link()">{{ i18n.t('nav.home') }}</a> /
        <a [routerLink]="i18n.link('catalog')">{{ i18n.t('nav.catalog') }}</a>
        @if (cat(); as c) {
          / <span>{{ i18n.loc(c.name) }}</span>
        }
      </nav>

      <h1>{{ cat() ? i18n.loc(cat()!.name) : i18n.t('catalog.title') }}</h1>
      @if (cat(); as c) {
        <p class="lead">{{ i18n.loc(c.desc) }}</p>
      }

      <div class="layout">
        <aside class="filters card">
          <div class="field">
            <label for="cq">{{ i18n.t('catalog.search') }}</label>
            <input id="cq" type="search" [value]="q()" (input)="setParam('q', $any($event.target).value)" />
          </div>
          <div class="field">
            <label for="cs">{{ i18n.t('catalog.sort') }}</label>
            <select id="cs" [value]="sort()" (change)="setParam('sort', $any($event.target).value)">
              @for (s of sorts; track s) {
                <option [value]="s" [selected]="sort() === s">{{ i18n.t(sortKey(s)) }}</option>
              }
            </select>
          </div>
          <div class="cats">
            <a [routerLink]="i18n.link('catalog')" [class.on]="!cat()" queryParamsHandling="preserve">{{ i18n.t('catalog.all') }}</a>
            @for (c of categories; track c.slug) {
              <a [routerLink]="i18n.link('catalog', c.slug)" [class.on]="cat()?.slug === c.slug" queryParamsHandling="preserve">
                {{ i18n.loc(c.name) }}
              </a>
            }
          </div>
        </aside>

        <section>
          <p class="count">{{ i18n.t('catalog.found') }}: <b>{{ items().length }}</b></p>
          @if (items().length) {
            <div class="grid list">
              @for (p of items(); track p.slug) {
                <app-product-card [p]="p" />
              }
            </div>
          } @else {
            <div class="card empty">
              <h2>{{ i18n.t('catalog.empty') }}</h2>
              <p>{{ i18n.t('catalog.emptyText') }}</p>
              <app-lead-form source="catalog-empty" [compact]="true" [heading]="false" />
            </div>
          }
        </section>
      </div>
    </div>
    }
  `,
  styles: `
    .page { padding-block: 28px 80px; }
    .crumbs { color: var(--muted); font-size: .85rem; margin-bottom: 14px; }
    .crumbs a:hover { color: var(--accent-text); }
    .lead { color: var(--muted); max-width: 70ch; }
    .layout { display: grid; grid-template-columns: 280px 1fr; gap: 28px; align-items: start; margin-top: 24px; }
    .filters { padding: 20px; display: grid; gap: 18px; position: sticky; top: 130px; }
    .cats { display: grid; gap: 2px; }
    .cats a { padding: 9px 12px; border-radius: 10px; color: var(--muted); font-weight: 600; font-size: .92rem; }
    .cats a:hover { background: var(--panel); color: var(--text); }
    .cats a.on { background: rgb(var(--accent-rgb) / .14); color: var(--accent-text); }
    .count { color: var(--muted); margin-bottom: 14px; }
    .list { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .empty { padding: 28px; display: grid; gap: 8px; max-width: 520px; }
    .empty p { color: var(--muted); }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .filters { position: static; } }
  `,
})
export class Catalog {
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(Seo);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Параметр маршрута (через withComponentInputBinding). */
  readonly category = input<string | undefined>();

  protected readonly categories = CATEGORIES;
  protected readonly sorts: Sort[] = ['popular', 'priceAsc', 'priceDesc', 'name'];

  private readonly params = toSignal(this.route.queryParamMap.pipe(map((m) => ({ q: m.get('q') ?? '', sort: (m.get('sort') ?? 'popular') as Sort }))), {
    initialValue: { q: '', sort: 'popular' as Sort },
  });
  protected readonly q = computed(() => this.params().q);
  protected readonly sort = computed(() => this.params().sort);

  protected readonly cat = computed(() => (this.category() ? categoryBySlug(this.category()!) : undefined));

  protected readonly badCategory = computed(() => !!this.category() && !this.cat());

  protected readonly items = computed(() => {
    const q = this.q().trim().toLowerCase();
    const c = this.cat();
    let list = PRODUCTS.filter((p) => !c || p.category === c.slug);
    if (q) {
      list = list.filter((p) =>
        [p.name.ru, p.name.en, p.brand, p.short.ru, p.short.en, ...p.tags].some((s) => s.toLowerCase().includes(q)),
      );
    }
    switch (this.sort()) {
      case 'priceAsc': return [...list].sort((a, b) => a.priceFrom - b.priceFrom);
      case 'priceDesc': return [...list].sort((a, b) => b.priceFrom - a.priceFrom);
      case 'name': return [...list].sort((a, b) => a.name[this.i18n.lang()].localeCompare(b.name[this.i18n.lang()]));
      default: return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
  });

  constructor() {
    effect(() => {
      if (this.badCategory()) return;
      const c = this.cat();
      const title = c ? this.i18n.loc(c.name) : this.i18n.t('seo.catalog.title');
      this.seo.set({
        title,
        description: c ? this.i18n.loc(c.desc) : this.i18n.t('seo.catalog.desc'),
        path: c ? `catalog/${c.slug}` : 'catalog',
        // страницы с поисковым запросом не индексируем, чтобы не плодить дубли
        noindex: !!this.q(),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.url}/${this.i18n.lang()}` },
            { '@type': 'ListItem', position: 2, name: this.i18n.t('nav.catalog'), item: `${SITE.url}/${this.i18n.lang()}/catalog` },
            ...(c ? [{ '@type': 'ListItem', position: 3, name: this.i18n.loc(c.name) }] : []),
          ],
        },
      });
    });
  }

  protected sortKey(s: Sort) {
    return `sort.${s === 'popular' ? 'popular' : s}` as 'sort.popular' | 'sort.priceAsc' | 'sort.priceDesc' | 'sort.name';
  }

  protected setParam(key: 'q' | 'sort', value: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
