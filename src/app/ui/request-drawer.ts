import { Component, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { I18n } from '../core/i18n';
import { RequestList } from '../core/request-list';
import { LeadForm } from './lead-form';

@Component({
  selector: 'app-request-drawer',
  imports: [LeadForm],
  host: { '(document:keydown.escape)': 'list.closeDrawer()' },
  template: `
    @if (list.drawerOpen()) {
      <div class="scrim" (click)="list.closeDrawer()"></div>
      <aside class="drawer" role="dialog" aria-modal="true" [attr.aria-label]="i18n.t('drawer.title')">
        <header class="drawer__head">
          <h2>{{ i18n.t('drawer.title') }}</h2>
          <button type="button" class="x" (click)="list.closeDrawer()" [attr.aria-label]="i18n.t('drawer.close')">✕</button>
        </header>

        <div class="drawer__body">
          @if (list.items().length) {
            <ul class="items">
              @for (it of list.items(); track it.slug) {
                <li>
                  <div>
                    <b>{{ i18n.loc(it.name) }}</b>
                    <small>{{ i18n.t('price.approx') }}: {{ i18n.money(it.priceFrom) }} – {{ i18n.money(it.priceTo) }}</small>
                  </div>
                  <button type="button" class="rm" (click)="list.remove(it.slug)">{{ i18n.t('drawer.remove') }}</button>
                </li>
              }
            </ul>
          } @else {
            <p class="empty">{{ i18n.t('drawer.empty') }}</p>
          }

          <app-lead-form source="drawer" [heading]="false" [attachList]="true" />
        </div>
      </aside>
    }
  `,
  styles: `
    .scrim { position: fixed; inset: 0; background: rgb(0 0 0 / .6); backdrop-filter: blur(3px); z-index: 80; animation: fade .2s; }
    .drawer {
      position: fixed; top: 0; right: 0; bottom: 0; width: min(100%, 460px); z-index: 90;
      background: var(--surface); border-left: 1px solid var(--line); display: flex; flex-direction: column;
      animation: slide .28s cubic-bezier(.2,.8,.2,1); box-shadow: var(--shadow);
    }
    .drawer__head { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid var(--line); }
    .drawer__head h2 { margin: 0; font-size: 1.3rem; }
    .x { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--line); background: none; color: var(--text); cursor: pointer; }
    .x:hover { border-color: var(--accent); }
    .drawer__body { padding: 20px 22px 28px; overflow-y: auto; display: grid; gap: 22px; align-content: start; }
    .items { display: grid; gap: 10px; }
    .items li { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 12px 14px; border: 1px solid var(--line); border-radius: 14px; background: var(--bg); }
    .items b { display: block; font-size: .95rem; } .items small { color: var(--accent-text); }
    .rm { background: none; border: 0; color: var(--muted); cursor: pointer; font: inherit; font-size: .82rem; text-decoration: underline; }
    .rm:hover { color: var(--danger); }
    .empty { color: var(--muted); margin: 0; }
    @keyframes fade { from { opacity: 0; } }
    @keyframes slide { from { transform: translateX(100%); } }
  `,
})
export class RequestDrawer {
  protected readonly i18n = inject(I18n);
  protected readonly list = inject(RequestList);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    // Блокируем прокрутку страницы, пока открыта панель
    effect(() => {
      this.doc.body.style.overflow = this.list.drawerOpen() ? 'hidden' : '';
    });
  }
}
