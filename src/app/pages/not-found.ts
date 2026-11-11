import { Component, inject, OnInit, RESPONSE_INIT } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../core/i18n';
import { Seo } from '../core/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="container nf">
      <p class="nf__code">404</p>
      <h1>{{ i18n.t('notfound.title') }}</h1>
      <p>{{ i18n.t('notfound.text') }}</p>
      <div class="nf__cta">
        <a class="btn btn--primary" [routerLink]="i18n.link()">{{ i18n.t('notfound.home') }}</a>
        <a class="btn" [routerLink]="i18n.link('catalog')">{{ i18n.t('nav.catalog') }}</a>
      </div>
    </div>
  `,
  styles: `
    .nf { padding-block: 100px; text-align: center; display: grid; justify-items: center; }
    .nf__code { font-size: clamp(5rem, 16vw, 10rem); font-weight: 800; line-height: 1; margin: 0;
      background: linear-gradient(135deg, var(--accent), var(--accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .nf p { color: var(--muted); max-width: 48ch; }
    .nf__cta { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  `,
})
export class NotFound implements OnInit {
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(Seo);
  private readonly response = inject(RESPONSE_INIT, { optional: true });

  ngOnInit(): void {
    // На сервере отдаём настоящий HTTP 404, чтобы поисковики не индексировали пустые адреса.
    if (this.response) this.response.status = 404;
    this.seo.set({ title: this.i18n.t('notfound.title'), description: this.i18n.t('notfound.text'), path: '', noindex: true });
  }
}
