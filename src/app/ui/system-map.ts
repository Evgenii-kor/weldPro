import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../core/i18n';
import { CATEGORIES, PRODUCTS, categoryBySlug } from '../data/catalog';

interface Spot {
  n: number;
  cat: string;
  x: number;
  y: number;
}

/** Точки на схеме → категории каталога. */
const SPOTS: Spot[] = [
  { n: 1, cat: 'dc400-boards', x: 345, y: 100 },
  { n: 2, cat: 'interfaces', x: 610, y: 78 },
  { n: 3, cat: 'innershield-hoses', x: 770, y: 232 },
  { n: 4, cat: 'stt-hoses', x: 470, y: 345 },
  { n: 5, cat: 'concoa-regulators', x: 95, y: 168 },
  { n: 6, cat: 'contact-tips', x: 936, y: 372 },
  { n: 7, cat: 'nozzles', x: 936, y: 326 },
  { n: 8, cat: 'gun-parts', x: 858, y: 214 },
];

/**
 * Интерактивная схема сварочного поста: источник DC-400 → интерфейс → подающее → рукав → пистолет.
 * Наведите курсор (или нажмите) на точку — справа описание узла и ссылка на раздел каталога.
 */
@Component({
  selector: 'app-system-map',
  imports: [RouterLink],
  template: `
    <div class="map on-dark">
      <div class="map__stage">
        <svg viewBox="0 0 980 440" role="img" [attr.aria-label]="i18n.t('map.title')">
          <defs>
            <pattern id="sm-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0H0V28" fill="none" stroke="#fff" stroke-opacity=".05" />
            </pattern>
            <linearGradient id="sm-steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#9aa7b5" /><stop offset=".5" stop-color="#d3dbe3" /><stop offset="1" stop-color="#64717f" />
            </linearGradient>
            <radialGradient id="sm-arc" cx=".5" cy=".5" r=".5">
              <stop offset="0" stop-color="#fff6dc" /><stop offset=".25" stop-color="#ffc400" stop-opacity=".8" /><stop offset="1" stop-color="#ff8a00" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="980" height="440" fill="url(#sm-grid)" />

          <!-- газовая линия -->
          <path d="M130 190H520V250H560" class="gas" />
          <!-- сигнал источник → интерфейс → подающее -->
          <path d="M500 78H560M660 78H710V200" class="sig" />
          <!-- силовой кабель и обратная связь -->
          <path d="M390 180V345H560" class="pwr" />
          <path d="M450 180V412H760" class="pwr pwr--work" />
          <!-- рукав: подающее → пистолет -->
          <path d="M710 265C790 265 770 205 840 205" class="hose" />
          <path d="M710 265C790 265 770 205 840 205" class="wire" />

          <!-- баллон и редуктор -->
          <rect x="62" y="206" width="66" height="200" rx="24" fill="#26323f" stroke="#5b6773" stroke-width="3" />
          <rect x="82" y="192" width="26" height="18" rx="4" fill="url(#sm-steel)" />
          <rect x="70" y="150" width="50" height="44" rx="9" fill="url(#sm-steel)" />
          <circle cx="95" cy="172" r="13" fill="#0d1115" stroke="#c9d2db" stroke-width="3" /><path d="M95 172l7-7" stroke="#ff8a00" stroke-width="2.5" stroke-linecap="round" />
          <text x="95" y="430" text-anchor="middle" class="lbl">Ar / CO₂</text>

          <!-- DC-400 -->
          <rect x="280" y="40" width="220" height="140" rx="12" fill="#1b2430" stroke="#5b6773" stroke-width="3" />
          <text x="390" y="62" text-anchor="middle" class="lbl lbl--b">DC-400</text>
          <rect x="302" y="74" width="92" height="62" rx="6" fill="#14463a" stroke="#2f8a6e" stroke-width="2" />
          <path d="M312 90h28v14h30M312 118h20v8h40" fill="none" stroke="#ffc400" stroke-width="2" />
          <rect x="344" y="92" width="26" height="18" rx="3" fill="#0d1115" stroke="#9aa7b5" />
          <circle cx="440" cy="100" r="22" fill="#0d1115" stroke="#9aa7b5" stroke-width="3" /><path d="M440 100l11-11" stroke="#ffc400" stroke-width="3" stroke-linecap="round" />
          <rect x="414" y="136" width="52" height="14" rx="3" fill="#0d1115" /><circle cx="424" cy="143" r="3" fill="#27d07f" class="led" />

          <!-- интерфейс -->
          <rect x="560" y="50" width="100" height="56" rx="8" fill="#26323f" stroke="#5b6773" stroke-width="3" />
          <circle cx="580" cy="66" r="4" fill="#ff8a00" class="led" /><circle cx="596" cy="66" r="4" fill="#27d07f" class="led led--2" />
          <path d="M576 84h68M576 94h44" stroke="#5b6773" stroke-width="3" stroke-linecap="round" />

          <!-- подающее устройство -->
          <rect x="560" y="200" width="150" height="130" rx="12" fill="#1b2430" stroke="#5b6773" stroke-width="3" />
          <circle cx="620" cy="265" r="42" fill="#0d1115" stroke="#9aa7b5" stroke-width="3" />
          <circle cx="620" cy="265" r="30" fill="none" stroke="#ffc400" stroke-width="7" stroke-dasharray="10 5" class="spool" />
          <circle cx="620" cy="265" r="8" fill="#9aa7b5" />
          <rect x="676" y="248" width="32" height="34" rx="5" fill="url(#sm-steel)" />

          <!-- пистолет -->
          <path d="M836 196l46 8 10 30-44 4z" fill="#26323f" stroke="#5b6773" stroke-width="3" />
          <path d="M880 204l12 22" stroke="#ffc400" stroke-width="7" stroke-linecap="round" />
          <path d="M888 232L912 300" stroke="#8a97a5" stroke-width="16" stroke-linecap="round" />
          <rect x="893" y="296" width="42" height="38" rx="6" transform="rotate(-18 914 315)" fill="url(#sm-steel)" stroke="#5b6773" stroke-width="2" />
          <path d="M912 332l8 22" stroke="#d3dbe3" stroke-width="5" stroke-linecap="round" />

          <!-- изделие и дуга -->
          <rect x="700" y="372" width="260" height="34" rx="4" fill="url(#sm-steel)" />
          <path d="M700 389h260" stroke="#26323f" stroke-width="1.5" opacity=".6" />
          <circle class="arc" cx="924" cy="372" r="34" fill="url(#sm-arc)" />
          <circle cx="924" cy="368" r="4" fill="#fff6dc" />
          <g class="sparks" stroke="#ffc400" stroke-width="2" stroke-linecap="round">
            <path d="M924 366l-14-16M924 366l4-22M924 366l20-14M924 366l-24-4M924 366l30 0" />
          </g>
          <path d="M640 345H560" stroke="none" />

          <!-- подписи узлов -->
          <text x="545" y="30" text-anchor="middle" class="lbl lbl--s">{{ i18n.t('map.l.if') }}</text>
          <text x="635" y="352" text-anchor="middle" class="lbl lbl--s">{{ i18n.t('map.l.feed') }}</text>
          <text x="820" y="176" text-anchor="end" class="lbl lbl--s">{{ i18n.t('map.l.gun') }}</text>

          <!-- точки -->
          @for (s of spots; track s.n) {
            <g
              class="spot"
              [class.spot--on]="active() === s.cat"
              tabindex="0"
              role="button"
              [attr.aria-label]="s.n + '. ' + i18n.loc(cat(s.cat).name)"
              [attr.transform]="'translate(' + s.x + ' ' + s.y + ')'"
              (mouseenter)="active.set(s.cat)"
              (focus)="active.set(s.cat)"
              (click)="active.set(s.cat)"
              (keydown.enter)="active.set(s.cat)"
            >
              <circle class="spot__hit" r="28" />
              <circle class="spot__ring" r="18" />
              <circle class="spot__dot" r="14" />
              <text class="spot__n" y="5" text-anchor="middle">{{ s.n }}</text>
            </g>
          }
        </svg>
        <p class="map__hint">{{ i18n.t('map.hint') }}</p>
      </div>

      <aside class="map__panel">
        <ul class="chips" role="tablist">
          @for (s of spots; track s.n) {
            <li>
              <button type="button" class="chip" [class.chip--on]="active() === s.cat" (click)="active.set(s.cat)">
                <b>{{ s.n }}</b> {{ i18n.loc(cat(s.cat).name) }}
              </button>
            </li>
          }
        </ul>
        <div class="info" aria-live="polite">
          <h3>{{ i18n.loc(current().name) }}</h3>
          <p>{{ i18n.loc(current().desc) }}</p>
          <p class="info__n">{{ i18n.t('map.items') }}: {{ count() }}</p>
          <a class="btn btn--primary btn--sm" [routerLink]="i18n.link('catalog', current().slug)">{{ i18n.t('map.go') }} →</a>
        </div>
      </aside>
    </div>
  `,
  styles: `
    :host { display: block; }
    .map {
      display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(280px, 1fr); gap: 0;
      border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--line);
      background: radial-gradient(800px 380px at 30% 0%, rgb(var(--accent-rgb) / .12), transparent 60%), var(--bg);
      box-shadow: var(--shadow);
    }
    @media (max-width: 960px) { .map { grid-template-columns: 1fr; } }
    .map__stage { padding: 14px 14px 6px; min-width: 0; }
    svg { width: 100%; height: auto; display: block; }
    .map__hint { margin: 0; padding: 4px 10px 10px; color: var(--muted); font-size: .82rem; }

    .lbl { fill: #a3afc2; font: 600 12px/1 Inter, system-ui, sans-serif; letter-spacing: .06em; text-transform: uppercase; }
    .lbl--b { fill: #eef2f8; font-size: 14px; font-weight: 800; }
    .lbl--s { fill: #7e8da1; font-size: 11px; }

    path.gas, path.sig, path.pwr, path.hose, path.wire { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .gas { stroke: #6cc4ff; stroke-width: 3; stroke-dasharray: 3 9; animation: flow 1.4s linear infinite; }
    .sig { stroke: #27d07f; stroke-width: 3; stroke-dasharray: 2 10; animation: flow .9s linear infinite; }
    .pwr { stroke: #5b6773; stroke-width: 7; }
    .pwr--work { stroke: #46525f; }
    .hose { stroke: #0d1115; stroke-width: 18; }
    .wire { stroke: #ffc400; stroke-width: 3; stroke-dasharray: 8 12; animation: flow .55s linear infinite; }
    @keyframes flow { to { stroke-dashoffset: -24; } }

    .spool { transform-origin: 620px 265px; animation: spin 3s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .led { animation: blink 1.6s steps(1) infinite; } .led--2 { animation-delay: .8s; }
    @keyframes blink { 50% { opacity: .25; } }
    .arc { transform-origin: 924px 372px; animation: arc .18s steps(1) infinite alternate; }
    @keyframes arc { 0% { transform: scale(.85); opacity: .85; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(.95); opacity: .75; } }
    .sparks { animation: arc .22s steps(1) infinite alternate; transform-origin: 924px 366px; }

    .spot { cursor: pointer; outline: none; }
    .spot__hit { fill: transparent; }
    .spot__ring { fill: none; stroke: var(--accent); stroke-width: 2; opacity: .8; transform-box: fill-box; transform-origin: center; animation: ping 2.2s ease-out infinite; }
    .spot__dot { fill: var(--accent); stroke: #0d1115; stroke-width: 2; transition: transform .2s, fill .2s; transform-box: fill-box; transform-origin: center; }
    .spot__n { fill: var(--accent-ink); font: 800 13px Inter, system-ui, sans-serif; pointer-events: none; }
    .spot--on .spot__dot, .spot:focus-visible .spot__dot { fill: #fff; transform: scale(1.25); }
    .spot:hover .spot__dot { transform: scale(1.2); }
    @keyframes ping { from { transform: scale(.8); opacity: .9; } to { transform: scale(1.6); opacity: 0; } }

    .map__panel { padding: 22px; border-left: 1px solid var(--line); background: var(--surface); display: grid; gap: 18px; align-content: start; }
    @media (max-width: 960px) { .map__panel { border-left: 0; border-top: 1px solid var(--line); } }
    .chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { display: inline-flex; gap: 6px; align-items: center; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--muted); font: inherit; font-size: .82rem; font-weight: 600; cursor: pointer; transition: .2s; }
    .chip b { display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--accent); color: var(--accent-ink); font-size: .72rem; }
    .chip:hover { border-color: var(--accent); color: var(--text); }
    .chip--on { border-color: var(--accent); color: var(--text); background: rgb(var(--accent-rgb) / .14); }
    .info h3 { margin: 0 0 8px; font-size: 1.35rem; }
    .info p { margin: 0 0 10px; color: var(--muted); }
    .info .info__n { color: var(--accent-text); font-weight: 700; font-size: .9rem; }

    @media (prefers-reduced-motion: reduce) {
      .gas, .sig, .wire, .spool, .led, .arc, .sparks, .spot__ring { animation: none; }
    }
  `,
})
export class SystemMap {
  protected readonly i18n = inject(I18n);
  protected readonly spots = SPOTS;
  protected readonly active = signal(SPOTS[0].cat);

  protected readonly current = computed(() => categoryBySlug(this.active()) ?? CATEGORIES[0]);
  protected readonly count = computed(() => PRODUCTS.filter((p) => p.category === this.active()).length);

  protected cat(slug: string) {
    return categoryBySlug(slug) ?? CATEGORIES[0];
  }
}
