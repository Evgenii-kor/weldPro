import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n, type I18nKey } from '../core/i18n';
import { Seo } from '../core/seo.service';
import { SITE } from '../core/site.config';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { LeadForm } from '../ui/lead-form';
import { ProductCard } from '../ui/product-card';
import { ProductVisual } from '../ui/product-visual';
import { Counter, Reveal, Tilt } from '../ui/motion';
import { WeldScene } from '../ui/weld-scene';
import { SystemMap } from '../ui/system-map';

@Component({
  selector: 'app-home',
  imports: [RouterLink, LeadForm, ProductCard, ProductVisual, WeldScene, SystemMap, Reveal, Tilt, Counter],
  template: `
    <section class="hero on-dark">
      @if (site.heroVideo) {
        <video class="hero__video" autoplay muted loop playsinline preload="metadata" [attr.poster]="site.heroPoster || null">
          <source [src]="site.heroVideo" type="video/mp4" />
        </video>
      }
      <app-weld-scene />
      <div class="container hero__in">
        <div class="hero__copy">
          <span class="eyebrow" style="--i:0">{{ i18n.t('hero.eyebrow') }}</span>
          <h1 style="--i:1">{{ i18n.t('hero.title') }}</h1>
          <p class="hero__sub" style="--i:2">{{ i18n.t('hero.sub') }}</p>
          <ul class="hero__pts" style="--i:3">
            <li>{{ i18n.t('hero.p1') }}</li>
            <li>{{ i18n.t('hero.p2') }}</li>
            <li>{{ i18n.t('hero.p3') }}</li>
          </ul>
          <div class="hero__cta" style="--i:4">
            <a class="btn btn--primary" href="#lead">{{ i18n.t('hero.cta1') }}</a>
            <a class="btn" [routerLink]="i18n.link('selector')">{{ i18n.t('nav.selector') }}</a>
            <a class="btn btn--ghost" [routerLink]="i18n.link('catalog')">{{ i18n.t('hero.cta2') }}</a>
          </div>
        </div>
        <div class="hero__form card" id="lead" style="--i:3">
          <app-lead-form source="home-hero" [compact]="true" />
        </div>
      </div>
    </section>

    <div class="ticker on-dark" aria-hidden="true">
      <div class="ticker__track">
        @for (r of [1, 2]; track r) {
          @for (c of cats; track c.slug) {
            <span>{{ i18n.loc(c.name) }}</span><i>◆</i>
          }
        }
      </div>
    </div>

    <section class="stats">
      <div class="container stats__in">
        @for (n of [1, 2, 3, 4]; track n) {
          <div [reveal]="n * 90">
            <strong><app-counter [to]="num(n)" [suffix]="suf(n)" /></strong>
            <span>{{ i18n.t(statL(n)) }}</span>
          </div>
        }
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head" reveal>
          <div>
            <h2>{{ i18n.t('map.title') }}</h2>
            <p>{{ i18n.t('map.sub') }}</p>
          </div>
        </div>
        <app-system-map reveal />
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head" reveal>
          <div>
            <h2>{{ i18n.t('home.cats.title') }}</h2>
            <p>{{ i18n.t('home.cats.sub') }}</p>
          </div>
        </div>
        <div class="grid cats">
          @for (c of cats; track c.slug; let i = $index) {
            <a class="cat" tilt [reveal]="i * 70" [routerLink]="i18n.link('catalog', c.slug)">
              <app-product-visual [glyph]="c.glyph" [label]="i18n.loc(c.name)" />
              <div class="cat__txt">
                <h3>{{ i18n.loc(c.name) }}</h3>
                <p>{{ i18n.loc(c.desc) }}</p>
                <span class="cat__go">{{ i18n.t('cta.details') }} →</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head" reveal>
          <div>
            <h2>{{ i18n.t('home.popular.title') }}</h2>
            <p>{{ i18n.t('home.popular.sub') }}</p>
          </div>
          <a class="btn btn--sm" [routerLink]="i18n.link('catalog')">{{ i18n.t('home.all') }} →</a>
        </div>
        <div class="grid products">
          @for (p of featured; track p.slug; let i = $index) {
            <app-product-card [p]="p" [reveal]="i * 80" />
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head" reveal><h2>{{ i18n.t('how.title') }}</h2></div>
        <ul class="grid steps">
          @for (n of [1, 2, 3]; track n) {
            <li class="card step" tilt [reveal]="n * 120">
              <span class="step__n">{{ n }}</span>
              <h3>{{ i18n.t(howT(n)) }}</h3>
              <p>{{ i18n.t(howD(n)) }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head" reveal><h2>{{ i18n.t('why.title') }}</h2></div>
        <div class="grid why">
          @for (n of [1, 2, 3, 4]; track n) {
            <div class="why__item" [reveal]="n * 100">
              <h3>{{ i18n.t(whyT(n)) }}</h3>
              <p>{{ i18n.t(whyD(n)) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container faq-wrap">
        <h2>{{ i18n.t('faq.title') }}</h2>
        <div class="faq">
          @for (n of [1, 2, 3, 4, 5]; track n) {
            <details [reveal]="n * 70">
              <summary>{{ i18n.t(faqQ(n)) }}</summary>
              <p>{{ i18n.t(faqA(n)) }}</p>
            </details>
          }
        </div>
      </div>
    </section>

    <section class="band on-dark">
      <div class="container band__in">
        <div>
          <h2>{{ i18n.t('band.title') }}</h2>
          <p>{{ i18n.t('band.sub') }}</p>
        </div>
        <div class="card band__form" reveal><app-lead-form source="home-band" [compact]="true" [heading]="false" /></div>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; overflow: hidden; padding-block: clamp(48px, 8vw, 110px);
      background:
        radial-gradient(900px 500px at 78% 0%, rgb(var(--accent-rgb) / .22), transparent 60%),
        radial-gradient(700px 400px at 0% 100%, rgb(var(--accent2-rgb) / .08), transparent 60%),
        var(--bg); }
    .hero::after { content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: linear-gradient(rgb(255 255 255 / .03) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .03) 1px, transparent 1px);
      background-size: 48px 48px; mask-image: radial-gradient(ellipse at 50% 30%, #000, transparent 75%); }
    .hero__in { position: relative; z-index: 1; display: grid; grid-template-columns: 1.15fr .85fr; gap: clamp(24px, 4vw, 56px); align-items: center; }
    .hero h1 { background: linear-gradient(180deg, #fff, #c7d0da); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .hero__sub { color: var(--muted); font-size: 1.12rem; max-width: 56ch; }
    .hero__pts { display: flex; flex-wrap: wrap; gap: 8px 20px; margin: 18px 0 28px; color: var(--text); font-weight: 600; font-size: .95rem; }
    .hero__pts li::before { content: '▸'; color: var(--accent); margin-right: 8px; }
    .hero__cta { display: flex; flex-wrap: wrap; gap: 12px; }
    .hero__form { padding: 24px; box-shadow: var(--shadow), var(--glow); scroll-margin-top: 120px; }
    @media (max-width: 920px) { .hero__in { grid-template-columns: 1fr; } }

    .hero { min-height: min(92vh, 880px); padding-bottom: clamp(230px, 30vh, 320px); }
    .hero__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .28; }
    .hero__copy > *, .hero__form { animation: up .9s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i, 0) * 110ms + 100ms); }
    .hero h1 { background: linear-gradient(100deg, #fff 18%, var(--accent-2) 40%, var(--accent) 50%, var(--accent-2) 60%, #c7d0da 82%); background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: up .9s cubic-bezier(.2,.8,.2,1) both, shine 7s linear 1s infinite; animation-delay: calc(var(--i, 0) * 110ms + 100ms), 1s; }
    @keyframes up { from { opacity: 0; transform: translateY(26px); } }
    @keyframes shine { to { background-position: -260% 0; } }

    .ticker { overflow: hidden; border-block: 1px solid var(--line); background: var(--deep); padding-block: 14px; }
    .ticker__track { display: flex; gap: 28px; width: max-content; animation: marquee 48s linear infinite; font-weight: 800; font-size: 1.05rem; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
    .ticker__track i { color: var(--accent); font-style: normal; font-size: .7rem; align-self: center; }
    .ticker:hover .ticker__track { animation-play-state: paused; }
    @keyframes marquee { to { transform: translateX(-50%); } }

    .stats { border-block: 1px solid var(--line); background: var(--bg-2); }
    .stats__in { display: grid; grid-template-columns: repeat(4, 1fr); }
    .stats__in div { padding: 24px 20px; display: grid; gap: 2px; border-right: 1px solid var(--line); }
    .stats__in div:last-child { border-right: 0; }
    .stats strong { font-size: 1.9rem; letter-spacing: -.02em; color: var(--accent-text); }
    .stats span { color: var(--muted); font-size: .88rem; }
    @media (max-width: 760px) { .stats__in { grid-template-columns: 1fr 1fr; } .stats__in div:nth-child(2) { border-right: 0; } .stats__in div:nth-child(-n+2) { border-bottom: 1px solid var(--line); } }

    .cats { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    .cat { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; background: var(--surface); transition: .25s; }
    .cat { will-change: transform; position: relative; }
    .cat::after { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .25s; background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent2-rgb) / .18), transparent 60%); }
    .cat:hover::after { opacity: 1; }
    .cat:hover { transform: translateY(-4px); border-color: rgb(var(--accent-rgb) / .55); box-shadow: var(--shadow); }
    .cat app-product-visual { aspect-ratio: 400/200; }
    .cat__txt { padding: 18px; display: grid; gap: 6px; flex: 1; }
    .cat__txt h3 { margin: 0; } .cat__txt p { margin: 0; color: var(--muted); font-size: .92rem; }
    .cat__go { color: var(--accent-text); font-weight: 700; font-size: .9rem; margin-top: 4px; }

    .products { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

    .steps { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); counter-reset: s; }
    .step { padding: 26px; position: relative; }
    .step__n { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; font-weight: 800; color: var(--accent-ink); background: linear-gradient(135deg, var(--accent), var(--accent-2)); margin-bottom: 14px; }
    .step p { color: var(--muted); margin: 0; }

    .why { grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
    .why__item { padding: 4px 0 4px 18px; border-left: 2px solid var(--accent); }
    .why__item p { color: var(--muted); margin: 0; }

    .faq-wrap { max-width: 860px; }
    .faq { display: grid; gap: 10px; }
    details { border: 1px solid var(--line); border-radius: 16px; background: var(--surface); padding: 0 20px; transition: border-color .2s; }
    details[open] { border-color: rgb(var(--accent-rgb) / .5); }
    summary { cursor: pointer; padding: 18px 0; font-weight: 700; list-style: none; display: flex; justify-content: space-between; gap: 12px; }
    summary::after { content: '+'; color: var(--accent); font-size: 1.4rem; line-height: 1; }
    details[open] summary::after { content: '–'; }
    summary::-webkit-details-marker { display: none; }
    details p { color: var(--muted); padding-bottom: 18px; margin: 0; }

    .band { padding-block: clamp(48px, 7vw, 90px); background:
      radial-gradient(700px 360px at 90% 50%, rgb(var(--accent-rgb) / .22), transparent 60%), var(--bg-2); border-top: 1px solid var(--line); }
    .band__in { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
    .band p { color: var(--muted); }
    .band__form { padding: 24px; }
    @media (max-width: 860px) { .band__in { grid-template-columns: 1fr; } }
  `,
})
export class Home implements OnInit {
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(Seo);

  protected readonly cats = CATEGORIES;
  protected readonly featured = PRODUCTS.filter((p) => p.featured).slice(0, 6);
  protected readonly site = SITE;

  protected statV = (n: number) => `stats.${n}v` as I18nKey;
  protected num = (n: number) => parseInt(this.i18n.t(this.statV(n)), 10) || 0;
  protected suf = (n: number) => this.i18n.t(this.statV(n)).replace(/^\d+/, '');
  protected statL = (n: number) => `stats.${n}l` as I18nKey;
  protected howT = (n: number) => `how.${n}.t` as I18nKey;
  protected howD = (n: number) => `how.${n}.d` as I18nKey;
  protected whyT = (n: number) => `why.${n}.t` as I18nKey;
  protected whyD = (n: number) => `why.${n}.d` as I18nKey;
  protected faqQ = (n: number) => `faq.${n}.q` as I18nKey;
  protected faqA = (n: number) => `faq.${n}.a` as I18nKey;

  ngOnInit(): void {
    const t = (k: I18nKey) => this.i18n.t(k);
    this.seo.set({
      title: t('seo.home.title'),
      description: t('seo.home.desc'),
      path: '',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE.name,
          legalName: SITE.legalName,
          url: SITE.url,
          email: SITE.email,
          telephone: SITE.phoneRaw,
          address: { '@type': 'PostalAddress', streetAddress: SITE.address.en },
          sameAs: [SITE.telegram],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE.name,
          url: SITE.url,
          inLanguage: this.i18n.lang(),
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE.url}/${this.i18n.lang()}/catalog?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [1, 2, 3, 4, 5].map((n) => ({
            '@type': 'Question',
            name: t(this.faqQ(n)),
            acceptedAnswer: { '@type': 'Answer', text: t(this.faqA(n)) },
          })),
        },
      ],
    });
  }
}
