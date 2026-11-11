import { Component, inject, signal } from '@angular/core';
import { I18n } from '../core/i18n';
import { RequestList } from '../core/request-list';
import { SITE } from '../core/site.config';

/** Плавающая кнопка быстрой связи: звонок, мессенджеры, обратный звонок. */
@Component({
  selector: 'app-float-contact',
  template: `
    <div class="fc">
      @if (open()) {
        <div class="fc__menu">
          <a [href]="'tel:' + site.phoneRaw">📞 {{ site.phone }}</a>
          <a [href]="site.telegram" target="_blank" rel="noopener">✈️ Telegram</a>
          @if (i18n.lang() === 'ru') {
            <a [href]="site.max" target="_blank" rel="noopener">💬 MAX</a>
          } @else {
            <a [href]="site.whatsapp" target="_blank" rel="noopener">💬 WhatsApp</a>
          }
          <button type="button" (click)="callback()">↩ {{ i18n.t('cta.call') }}</button>
        </div>
      }
      <button
        type="button"
        class="fc__btn"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="i18n.t('float.title')"
        (click)="open.set(!open())"
      >
        {{ open() ? '✕' : '☎' }}
      </button>
    </div>
  `,
  styles: `
    .fc { position: fixed; right: 20px; bottom: 20px; z-index: 40; display: grid; gap: 10px; justify-items: end; }
    .fc__btn {
      width: 58px; height: 58px; border-radius: 50%; border: 0; cursor: pointer; font-size: 1.5rem;
      background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: var(--accent-ink);
      box-shadow: var(--glow); animation: pulse 2.6s infinite;
    }
    .fc__menu { display: grid; gap: 4px; padding: 8px; background: var(--surface); border: 1px solid var(--line); border-radius: 18px; box-shadow: var(--shadow); }
    .fc__menu a, .fc__menu button {
      padding: 10px 14px; border-radius: 12px; background: none; border: 0; color: var(--text);
      font: inherit; font-weight: 600; text-align: left; cursor: pointer; white-space: nowrap;
    }
    .fc__menu a:hover, .fc__menu button:hover { background: var(--panel); }
    @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgb(var(--accent-rgb) / .5), var(--glow); } 50% { box-shadow: 0 0 0 14px rgb(var(--accent-rgb) / 0), var(--glow); } }
  `,
})
export class FloatContact {
  protected readonly i18n = inject(I18n);
  private readonly list = inject(RequestList);
  protected readonly site = SITE;
  protected readonly open = signal(false);

  protected callback(): void {
    this.open.set(false);
    this.list.openDrawer();
  }
}
