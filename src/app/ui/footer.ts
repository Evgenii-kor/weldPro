import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsent } from '../core/cookie-consent';
import { I18n } from '../core/i18n';
import { SITE } from '../core/site.config';
import { CATEGORIES } from '../data/catalog';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="ft on-dark">
      <div class="container ft__grid">
        <div>
          <p class="ft__brand">{{ site.name }}</p>
          <p class="ft__muted">{{ i18n.t('footer.desc') }}</p>
        </div>
        <div>
          <h4>{{ i18n.t('footer.catalog') }}</h4>
          <ul>
            @for (c of cats; track c.slug) {
              <li><a [routerLink]="i18n.link('catalog', c.slug)">{{ i18n.loc(c.name) }}</a></li>
            }
          </ul>
        </div>
        <div>
          <h4>{{ i18n.t('footer.company') }}</h4>
          <ul>
            <li><a [routerLink]="i18n.link('selector')">{{ i18n.t('nav.selector') }}</a></li>
            <li><a [routerLink]="i18n.link('delivery')">{{ i18n.t('nav.delivery') }}</a></li>
            <li><a [routerLink]="i18n.link('about')">{{ i18n.t('nav.about') }}</a></li>
            <li><a [routerLink]="i18n.link('compare')">{{ i18n.t('nav.compare') }}</a></li>
            <li><a [routerLink]="i18n.link('contacts')">{{ i18n.t('nav.contacts') }}</a></li>
          </ul>
        </div>
        <div>
          <h4>{{ i18n.t('footer.contacts') }}</h4>
          <ul>
            <li><a [href]="'tel:' + site.phoneRaw">{{ site.phone }}</a></li>
            <li><a [href]="'mailto:' + site.email">{{ site.email }}</a></li>
            <li><a [href]="site.telegram" target="_blank" rel="noopener">Telegram</a></li>
            @if (i18n.lang() === 'ru') {
              <li><a [href]="site.max" target="_blank" rel="noopener">MAX</a></li>
            } @else {
              <li><a [href]="site.whatsapp" target="_blank" rel="noopener">WhatsApp</a></li>
            }
          </ul>
        </div>
      </div>
      <div class="container ft__bottom">
        <span>© {{ year }} {{ site.legalName }}. {{ i18n.t('footer.rights') }}</span>
        <span>{{ i18n.t('footer.disclaimer') }}</span>
        <span class="ft__legal">
          <a [routerLink]="i18n.link('privacy')">{{ i18n.t('legal.privacy') }}</a>
          <a [routerLink]="i18n.link('consent')">{{ i18n.t('legal.consent') }}</a>
          <button type="button" (click)="cookies.reopen()">{{ i18n.t('cookie.settings') }}</button>
        </span>
      </div>
    </footer>
  `,
  styles: `
    .ft { border-top: 1px solid var(--line); background: var(--deep); padding-top: 56px; margin-top: auto; }
    .ft__grid { display: grid; grid-template-columns: 1.4fr 1.2fr 1fr 1fr; gap: 32px; padding-bottom: 40px; }
    .ft__brand { font-weight: 800; font-size: 1.4rem; margin: 0 0 8px; }
    .ft__muted { color: var(--muted); max-width: 36ch; }
    h4 { font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-text); }
    li { margin-bottom: 8px; } li a { color: var(--muted); } li a:hover { color: var(--text); }
    .ft__bottom { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-block: 20px; border-top: 1px solid var(--line); color: var(--muted); font-size: .82rem; }
    .ft__legal { display: flex; gap: 16px; flex-wrap: wrap; width: 100%; }
    .ft__legal a, .ft__legal button { color: var(--muted); text-decoration: underline; background: none; border: 0; padding: 0; font: inherit; cursor: pointer; }
    .ft__legal a:hover, .ft__legal button:hover { color: var(--text); }
    @media (max-width: 860px) { .ft__grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 520px) { .ft__grid { grid-template-columns: 1fr; } }
  `,
})
export class Footer {
  protected readonly i18n = inject(I18n);
  protected readonly site = SITE;
  protected readonly cookies = inject(CookieConsent);
  protected readonly cats = CATEGORIES;
  protected readonly year = new Date().getFullYear();
}
