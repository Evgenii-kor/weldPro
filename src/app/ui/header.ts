import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { I18n, LANGS, type Lang } from '../core/i18n';
import { RequestList } from '../core/request-list';
import { SITE } from '../core/site.config';
import { PRODUCTS } from '../data/catalog';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="top on-dark">
      <div class="container top__in">
        <span class="top__hours">{{ i18n.loc(site.hours) }}</span>
        <div class="top__right">
          <a [href]="'tel:' + site.phoneRaw" class="top__phone">{{ site.phone }}</a>
          @if (langs.length > 1) {
          <nav class="lang" [attr.aria-label]="i18n.t('lang.switch')">
            @for (l of langs; track l) {
              <a
                [routerLink]="langUrl(l)"
                [class.lang--on]="i18n.lang() === l"
                [attr.hreflang]="l"
                [attr.lang]="l"
                [attr.aria-current]="i18n.lang() === l ? 'true' : null"
                >{{ l.toUpperCase() }}</a
              >
            }
          </nav>
          }
        </div>
      </div>
    </div>

    <header class="bar">
      <div class="container bar__in">
        <a class="logo" [routerLink]="i18n.link()" aria-label="{{ site.name }}">
          <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#ff6a1a" /><stop offset="1" stop-color="#ffb347" />
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="11" fill="url(#lg)" />
            <path d="M10 12l5 17 5-11 5 11 5-17" fill="none" stroke="#1a0b00" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ site.name }}</span>
        </a>

        <nav class="nav" [class.nav--open]="menu()" [attr.aria-label]="i18n.t('nav.menu')">
          <a [routerLink]="i18n.link('catalog')" routerLinkActive="on" (click)="menu.set(false)">{{ i18n.t('nav.catalog') }}</a>
          <a [routerLink]="i18n.link('selector')" routerLinkActive="on" (click)="menu.set(false)">{{ i18n.t('nav.selector') }}</a>
          <a [routerLink]="i18n.link('delivery')" routerLinkActive="on" (click)="menu.set(false)">{{ i18n.t('nav.delivery') }}</a>
          <a [routerLink]="i18n.link('about')" routerLinkActive="on" (click)="menu.set(false)">{{ i18n.t('nav.about') }}</a>
          <a [routerLink]="i18n.link('contacts')" routerLinkActive="on" (click)="menu.set(false)">{{ i18n.t('nav.contacts') }}</a>
        </nav>

        <div class="search">
          <input
            type="search"
            [placeholder]="i18n.t('search.placeholder')"
            [attr.aria-label]="i18n.t('catalog.search')"
            [value]="q()"
            (input)="q.set($any($event.target).value)"
            (keydown.enter)="go()"
            (keydown.escape)="q.set('')"
            autocomplete="off"
          />
          @if (q().trim().length > 1) {
            <div class="suggest" role="listbox">
              @for (p of results(); track p.slug) {
                <a [routerLink]="i18n.link('product', p.slug)" (click)="q.set('')" role="option">
                  <b>{{ i18n.loc(p.name) }}</b>
                  <small>{{ i18n.money(p.priceFrom) }} – {{ i18n.money(p.priceTo) }}</small>
                </a>
              } @empty {
                <span class="suggest__empty">{{ i18n.t('search.empty') }}</span>
              }
              @if (results().length) {
                <button type="button" class="suggest__all" (click)="go()">{{ i18n.t('search.all') }} →</button>
              }
            </div>
          }
        </div>

        <div class="actions">
          <a class="icon-btn" [routerLink]="i18n.link('compare')" [attr.aria-label]="i18n.t('nav.compare')" [title]="i18n.t('nav.compare')">
            ⇄
            @if (list.compareSlugs().length) {
              <span class="badge">{{ list.compareSlugs().length }}</span>
            }
          </a>
          <button type="button" class="btn btn--primary btn--sm" (click)="list.openDrawer()">
            {{ i18n.t('nav.request') }}
            @if (list.slugs().length) {
              <span class="badge badge--dark">{{ list.slugs().length }}</span>
            }
          </button>
          <button
            type="button"
            class="burger"
            [attr.aria-expanded]="menu()"
            [attr.aria-label]="i18n.t('nav.menu')"
            (click)="menu.set(!menu())"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; position: sticky; top: 0; z-index: 50; }
    .top { background: var(--deep); border-bottom: 1px solid var(--line); font-size: .82rem; color: var(--muted); }
    .top__in { display: flex; justify-content: space-between; align-items: center; min-height: 36px; gap: 16px; }
    .top__right { display: flex; align-items: center; gap: 18px; }
    .top__phone { color: var(--text); font-weight: 700; }
    .top__phone:hover { color: var(--accent-text); }
    .lang { display: flex; border: 1px solid var(--line); border-radius: 999px; overflow: hidden; }
    .lang a { padding: 2px 10px; font-weight: 700; font-size: .75rem; }
    .lang a:hover { color: var(--text); }
    .lang .lang--on { background: var(--accent); color: var(--accent-ink); }
    @media (max-width: 640px) { .top__hours { display: none; } .top__in { justify-content: flex-end; } }

    .bar { background: rgb(var(--bg-rgb) / .86); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
    .bar__in { display: flex; align-items: center; gap: 14px; min-height: 68px; }
    .logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.25rem; letter-spacing: -.02em; }
    .nav { display: flex; gap: 6px; }
    .nav a { padding: 8px 9px; font-size: .92rem; white-space: nowrap; border-radius: 10px; color: var(--muted); font-weight: 600; transition: .2s; }
    .nav a:hover, .nav a.on { color: var(--text); background: var(--panel); }

    .search { position: relative; flex: 1; min-width: 230px; max-width: 420px; margin-left: auto; }
    .search input {
      width: 100%; min-height: 42px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line);
      background: var(--bg); color: var(--text); font: inherit; font-size: .9rem;
    }
    .search input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .18); }
    .suggest {
      position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: var(--surface);
      border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--shadow); overflow: hidden; display: grid;
    }
    .suggest a { display: grid; padding: 10px 16px; border-bottom: 1px solid var(--line); }
    .suggest a:hover { background: var(--panel); }
    .suggest small { color: var(--accent-text); }
    .suggest__empty { padding: 14px 16px; color: var(--muted); font-size: .9rem; }
    .suggest__all { padding: 12px; background: none; border: 0; color: var(--accent-text); font: inherit; font-weight: 700; cursor: pointer; }

    .actions { display: flex; align-items: center; gap: 10px; }
    .icon-btn {
      position: relative; width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%;
      border: 1px solid var(--line); font-size: 1.1rem; transition: .2s;
    }
    .icon-btn:hover { border-color: var(--accent); }
    .badge {
      position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px;
      background: var(--accent); color: var(--accent-ink); font-size: .7rem; font-weight: 800; display: grid; place-items: center;
    }
    .badge--dark { position: static; background: var(--accent-ink); color: var(--accent-text); margin-left: 4px; }

    .burger { display: none; width: 42px; height: 42px; border-radius: 12px; border: 1px solid var(--line); background: none; cursor: pointer; padding: 11px 10px; flex-direction: column; justify-content: space-between; }
    .burger span { display: block; height: 2px; background: var(--text); border-radius: 2px; }

    @media (max-width: 1180px) {
      .bar__in { flex-wrap: wrap; gap: 10px 12px; padding-block: 10px; }
      .search { order: 5; flex-basis: 100%; max-width: none; margin: 0; }
      .actions { margin-left: auto; }
      .burger { display: flex; }
      .nav {
        display: none; order: 6; flex-basis: 100%; flex-direction: column;
        background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 8px;
      }
      .nav--open { display: flex; }
    }
  `,
})
export class Header {
  protected readonly i18n = inject(I18n);
  protected readonly list = inject(RequestList);
  private readonly router = inject(Router);

  protected readonly site = SITE;
  protected readonly langs = LANGS;
  protected readonly menu = signal(false);
  protected readonly q = signal('');

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly results = computed(() => {
    const q = this.q().trim().toLowerCase();
    if (q.length < 2) return [];
    return PRODUCTS.filter((p) =>
      [p.name.ru, p.name.en, p.brand, p.short.ru, p.short.en, ...p.tags].some((s) => s.toLowerCase().includes(q)),
    ).slice(0, 5);
  });

  protected langUrl(l: Lang): string {
    const u = this.url();
    return u.replace(/^\/(ru|en)(?=\/|\?|#|$)/, '/' + l);
  }

  protected go(): void {
    const q = this.q().trim();
    this.q.set('');
    this.menu.set(false);
    void this.router.navigate(this.i18n.link('catalog'), { queryParams: q ? { q } : {} });
  }
}
