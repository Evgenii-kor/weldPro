import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { I18n, LANGS } from './i18n';
import { SITE } from './site.config';

export interface PageMeta {
  title: string;
  description: string;
  /** Путь без языкового префикса, например '' или 'catalog/internal-welding'. */
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = inject(I18n);

  set(page: PageMeta): void {
    const lang = this.i18n.lang();
    const full = `${page.title} | ${SITE.name}`;
    const url = this.url(lang, page.path);
    const image = page.image ?? `${SITE.url}/og-cover.svg`;

    this.title.setTitle(full);
    this.doc.documentElement.lang = lang;

    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'robots', content: page.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large' });
    this.meta.updateTag({ property: 'og:title', content: full });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: lang === 'ru' ? 'ru_RU' : 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE.name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.link('canonical', url);
    this.alternates(page.path);

    this.setJsonLd(page.jsonLd);
  }

  url(lang: string, path: string): string {
    return `${SITE.url}/${lang}${path ? '/' + path : ''}`;
  }

  private link(rel: string, href: string, hreflang?: string): void {
    const sel = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;
    let el = this.doc.head.querySelector<HTMLLinkElement>(sel);
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('rel', rel);
      if (hreflang) el.setAttribute('hreflang', hreflang);
      this.doc.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  private alternates(path: string): void {
    for (const l of LANGS) this.link('alternate', this.url(l, path), l);
    this.link('alternate', this.url('ru', path), 'x-default');
  }

  private setJsonLd(data?: object | object[]): void {
    this.doc.head.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove());
    if (!data) return;
    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
      const s = this.doc.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo-jsonld', '');
      s.textContent = JSON.stringify(item).replace(/</g, '\\u003c');
      this.doc.head.appendChild(s);
    }
  }
}
