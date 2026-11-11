import { Component, inject, OnInit } from '@angular/core';
import { I18n } from '../core/i18n';
import { Seo } from '../core/seo.service';
import { LeadForm } from '../ui/lead-form';

@Component({
  selector: 'app-about',
  imports: [LeadForm],
  template: `
    <div class="container page">
      <div class="txt">
        <span class="eyebrow">{{ i18n.t('nav.about') }}</span>
        <h1>{{ i18n.t('about.title') }}</h1>
        <p class="lead">{{ i18n.t('about.lead') }}</p>
        <p>{{ i18n.t('about.p1') }}</p>
        <p>{{ i18n.t('about.p2') }}</p>
      </div>
      <div class="card form"><app-lead-form source="about" [compact]="true" /></div>
    </div>
  `,
  styles: `
    .page { padding-block: 48px 90px; display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: start; }
    .lead { font-size: 1.2rem; color: var(--text); }
    .txt p { color: var(--muted); }
    .form { padding: 26px; }
    @media (max-width: 860px) { .page { grid-template-columns: 1fr; } }
  `,
})
export class About implements OnInit {
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(Seo);

  ngOnInit(): void {
    this.seo.set({ title: this.i18n.t('seo.about.title'), description: this.i18n.t('seo.about.desc'), path: 'about' });
  }
}
