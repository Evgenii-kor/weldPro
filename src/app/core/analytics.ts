import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject } from '@angular/core';
import { CookieConsent } from './cookie-consent';
import { SITE } from './site.config';

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

/** Яндекс.Метрика: подключается, только если задан metrikaId и посетитель принял аналитические cookie. */
@Injectable({ providedIn: 'root' })
export class Analytics {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly doc = inject(DOCUMENT);

  private readonly cookies = inject(CookieConsent);
  private loaded = false;

  constructor() {
    // Метрика грузится только после явного согласия «Принять все» (152-ФЗ, cookie).
    effect(() => {
      if (this.browser && SITE.metrikaId && this.cookies.choice() === 'all' && !this.loaded) {
        this.loaded = true;
        const id = Number(SITE.metrikaId);
        const s = this.doc.createElement('script');
        s.async = true;
        s.src = 'https://mc.yandex.ru/metrika/tag.js';
        s.onload = () => window.ym?.(id, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
        this.doc.head.appendChild(s);
      }
    });
  }

  /** Достижение цели (отправка заявки и т. п.). */
  goal(name: string, params?: Record<string, unknown>): void {
    if (this.loaded) window.ym?.(Number(SITE.metrikaId), 'reachGoal', name, params);
  }
}
