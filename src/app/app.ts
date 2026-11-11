import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Analytics } from './core/analytics';
import { CookieBanner } from './ui/cookie-banner';
import { FloatContact } from './ui/float-contact';
import { Footer } from './ui/footer';
import { Header } from './ui/header';
import { RequestDrawer } from './ui/request-drawer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, RequestDrawer, FloatContact, CookieBanner],
  host: { '(window:scroll)': 'onScroll()' },
  template: `
    <div class="progress" [style.transform]="'scaleX(' + progress() + ')'"></div>
      <a class="skip visually-hidden" href="#main">Skip to content</a>
    <app-header />
    <main id="main"><router-outlet /></main>
    <app-footer />
    <app-request-drawer />
    <app-float-contact />
    <app-cookie-banner />
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
    .progress { position: fixed; z-index: 120; top: 0; left: 0; right: 0; height: 3px; transform-origin: 0 50%; transform: scaleX(0); background: linear-gradient(90deg, var(--accent), var(--accent-2)); box-shadow: 0 0 12px var(--accent); pointer-events: none; }
    .skip:focus { position: fixed; z-index: 100; left: 16px; top: 16px; width: auto; height: auto; clip: auto; padding: 10px 16px; background: var(--accent); color: var(--accent-ink); border-radius: 10px; }
  `,
})
export class App {
  protected readonly progress = signal(0);
  /** Создаём сервис сразу: он ждёт согласия на cookie и только потом подключает Метрику. */
  private readonly analytics = inject(Analytics);
  protected onScroll(): void {
    const max = document.documentElement.scrollHeight - innerHeight;
    this.progress.set(max > 0 ? Math.min(1, scrollY / max) : 0);
  }
}
