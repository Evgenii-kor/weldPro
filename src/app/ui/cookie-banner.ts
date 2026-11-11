import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsent } from '../core/cookie-consent';
import { I18n } from '../core/i18n';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink],
  template: `
    @if (cookies.open()) {
      <div class="cb" role="dialog" aria-live="polite" [attr.aria-label]="i18n.t('cookie.settings')">
        <p>
          {{ i18n.t('cookie.text') }}
          <a [routerLink]="i18n.link('privacy')">{{ i18n.t('cookie.more') }}</a>
        </p>
        <div class="cb__btns">
          <button type="button" class="btn btn--sm" (click)="cookies.set('necessary')">{{ i18n.t('cookie.necessary') }}</button>
          <button type="button" class="btn btn--primary btn--sm" (click)="cookies.set('all')">{{ i18n.t('cookie.all') }}</button>
        </div>
      </div>
    }
  `,
  styles: `
    .cb {
      position: fixed; z-index: 140; left: 16px; right: 16px; bottom: 16px; max-width: 760px; margin-inline: auto;
      display: flex; gap: 16px; align-items: center; justify-content: space-between; flex-wrap: wrap;
      padding: 16px 20px; border-radius: var(--radius-lg); background: var(--surface); color: var(--text);
      border: 1px solid var(--line); box-shadow: var(--shadow);
    }
    p { margin: 0; font-size: .88rem; flex: 1 1 320px; color: var(--muted); }
    p a { color: var(--accent-text); font-weight: 600; text-decoration: underline; }
    .cb__btns { display: flex; gap: 8px; flex-wrap: wrap; }
  `,
})
export class CookieBanner {
  protected readonly i18n = inject(I18n);
  protected readonly cookies = inject(CookieConsent);
}
