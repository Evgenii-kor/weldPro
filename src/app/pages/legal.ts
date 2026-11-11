import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18n } from '../core/i18n';
import { legalText, type LegalKind } from '../core/legal-texts';
import { Seo } from '../core/seo.service';
import { SITE } from '../core/site.config';

@Component({
  selector: 'app-legal',
  imports: [RouterLink],
  template: `
    <article class="container legal">
      <h1>{{ i18n.t(kind === 'privacy' ? 'legal.privacy' : 'legal.consent') }}</h1>
      <p class="legal__meta">{{ i18n.t('legal.updated') }} {{ site.legalVersion }} · {{ i18n.t('legal.operator') }}: {{ site.legalName }}</p>
      @for (s of sections(); track $index) {
        @if (s.h) {
          <h2>{{ s.h }}</h2>
        }
        @for (para of s.p; track $index) {
          <p>{{ para }}</p>
        }
      }
      <p class="legal__links">
        <a [routerLink]="i18n.link(kind === 'privacy' ? 'consent' : 'privacy')">{{
          i18n.t(kind === 'privacy' ? 'legal.consent' : 'legal.privacy')
        }}</a>
      </p>
    </article>
  `,
  styles: `
    .legal { max-width: 820px; padding-block: 48px 90px; }
    .legal__meta { color: var(--muted); font-size: .9rem; }
    h2 { font-size: 1.15rem; margin: 28px 0 8px; }
    p { color: var(--muted); line-height: 1.7; }
    .legal__links a { color: var(--accent-text); font-weight: 600; }
  `,
})
export class Legal implements OnInit {
  protected readonly i18n = inject(I18n);
  private readonly seo = inject(Seo);
  protected readonly site = SITE;
  protected readonly kind = inject(ActivatedRoute).snapshot.data['kind'] as LegalKind;
  protected readonly sections = computed(() => legalText(this.kind, this.i18n.lang()));

  ngOnInit(): void {
    this.seo.set({
      title: this.i18n.t(`seo.${this.kind}.title` as const),
      description: this.i18n.t(`seo.${this.kind}.desc` as const),
      path: this.kind,
    });
  }
}
