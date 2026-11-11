import { Component, inject, OnInit } from '@angular/core';
import { I18n } from '../core/i18n';
import { Seo } from '../core/seo.service';
import { SITE } from '../core/site.config';
import { LeadForm } from '../ui/lead-form';

@Component({
  selector: 'app-contacts',
  imports: [LeadForm],
  template: `
    <div class="container page">
      <div>
        <h1>{{ i18n.t('contacts.title') }}</h1>
        <dl class="card info">
          <div><dt>{{ i18n.t('contacts.phone') }}</dt><dd><a [href]="'tel:' + site.phoneRaw">{{ site.phone }}</a></dd></div>
          <div><dt>{{ i18n.t('contacts.email') }}</dt><dd><a [href]="'mailto:' + site.email">{{ site.email }}</a></dd></div>
          <div><dt>Telegram</dt><dd><a [href]="site.telegram" target="_blank" rel="noopener">{{ site.telegram }}</a></dd></div>
          @if (i18n.lang() === 'ru') {
            <div><dt>MAX</dt><dd><a [href]="site.max" target="_blank" rel="noopener">{{ site.max }}</a></dd></div>
          } @else {
            <div><dt>WhatsApp</dt><dd><a [href]="site.whatsapp" target="_blank" rel="noopener">{{ site.phone }}</a></dd></div>
          }
          <div><dt>{{ i18n.t('contacts.address') }}</dt><dd>{{ i18n.loc(site.address) }}</dd></div>
          <div><dt>{{ i18n.t('contacts.hours') }}</dt><dd>{{ i18n.loc(site.hours) }}</dd></div>
        </dl>
      </div>
      <div class="card form">
        <h2>{{ i18n.t('contacts.write') }}</h2>
        <app-lead-form source="contacts" [heading]="false" />
      </div>
    </div>
  `,
  styles: `
    .page { padding-block: 48px 90px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
    .info { padding: 8px 24px; margin: 0; }
    .info div { display: grid; grid-template-columns: 140px 1fr; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--line); }
    .info div:last-child { border: 0; }
    dt { color: var(--muted); font-weight: 600; } dd { margin: 0; font-weight: 600; }
    dd a:hover { color: var(--accent-text); }
    .form { padding: 26px; } .form h2 { font-size: 1.4rem; }
    @media (max-width: 860px) { .page { grid-template-columns: 1fr; } .info div { grid-template-columns: 1fr; gap: 2px; } }
  `,
})
export class Contacts implements OnInit {
  protected readonly i18n = inject(I18n);
  protected readonly site = SITE;
  private readonly seo = inject(Seo);

  ngOnInit(): void {
    this.seo.set({
      title: this.i18n.t('seo.contacts.title'),
      description: this.i18n.t('seo.contacts.desc'),
      path: 'contacts',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: this.i18n.t('contacts.title'),
        url: this.seo.url(this.i18n.lang(), 'contacts'),
      },
    });
  }
}
