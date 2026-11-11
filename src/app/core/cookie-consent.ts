import { Injectable, afterNextRender, signal } from '@angular/core';

export type CookieChoice = 'unset' | 'all' | 'necessary';
const KEY = 'weldpro.cookies';

/**
 * Выбор посетителя по cookie. Аналитика (Яндекс.Метрика) подключается только при 'all'.
 * Пока выбор не сделан ('unset'), аналитика не грузится.
 */
@Injectable({ providedIn: 'root' })
export class CookieConsent {
  readonly choice = signal<CookieChoice>('unset');
  /** Баннер показан (первый визит или пользователь открыл «Настройки cookie»). */
  readonly open = signal(false);

  constructor() {
    afterNextRender(() => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(KEY);
      } catch {
        /* хранилище недоступно */
      }
      if (saved === 'all' || saved === 'necessary') this.choice.set(saved);
      else this.open.set(true);
    });
  }

  set(c: 'all' | 'necessary'): void {
    this.choice.set(c);
    this.open.set(false);
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* хранилище недоступно */
    }
  }

  reopen(): void {
    this.open.set(true);
  }
}
