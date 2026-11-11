import { Component, inject, OnInit } from '@angular/core';
import { I18n, type I18nKey } from '../core/i18n';
import { Seo } from '../core/seo.service';
import { LeadForm } from '../ui/lead-form';

@Component({
  selector: 'app-delivery',
  imports: [LeadForm],
  template: `
    <div class="container page">
      <div>
        <h1>{{ i18n.t('delivery.title') }}</h1>
        <p class="lead">{{ i18n.t('delivery.lead') }}</p>
        <div class="grid blocks">
          @for (b of blocks; track b) {
            <section class="card block">
              <h3>{{ i18n.t(t(b)) }}</h3>
              <p>{{ i18n.t(d(b)) }}</p>
            </section>
          }
        </div>
        <p class="note">{{ i18n.t('delivery.note') }}</p>
      </div>
      <div class="card form"><app-lead-form source="delivery" [compact]="true" /></div>
    </div>
  `,
  styles: `
    .page { padding-block: 48px 90px; display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: start; }
    .lead { color: var(--muted); font-size: 1.1rem; }
    .blocks { grid-template-columns: 1fr 1fr; margin-top: 24px; }
    .block { padding: 22px; } .block h3 { color: var(--accent-text); } .block p { color: var(--muted); margin: 0; }
    .note { margin-top: 20px; font-size: .8rem; color: var(--muted); border-left: 2px solid var(--accent); padding-left: 12px; }
    .form { padding: 26px; position: sticky; top: 130px; }
    @media (max-width: 900px) { .page { grid-template-columns: 1fr; } .blocks { grid-template-columns: 1fr; } .form { position: static; } }
  `,
})
export class Delivery implements OnInit {
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(Seo);
  protected readonly blocks = ['pay', 'ship', 'docs', 'service'] as const;
  protected t = (b: string) => `delivery.${b}.t` as I18nKey;
  protected d = (b: string) => `delivery.${b}.d` as I18nKey;

  ngOnInit(): void {
    this.seo.set({ title: this.i18n.t('seo.delivery.title'), description: this.i18n.t('seo.delivery.desc'), path: 'delivery' });
  }
}
