import { Component, input } from '@angular/core';
import type { Glyph } from '../data/catalog';

/**
 * Векторная иллюстрация-заглушка категории оборудования.
 * Замените на реальные фотографии товаров (NgOptimizedImage) после получения материалов.
 */
@Component({
  selector: 'app-product-visual',
  template: `
    <svg viewBox="0 0 400 260" role="img" [attr.aria-label]="label()" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pv-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1b232d" />
          <stop offset="1" stop-color="#0d1115" />
        </linearGradient>
        <linearGradient id="pv-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8d9aa8" />
          <stop offset="0.5" stop-color="#c9d2db" />
          <stop offset="1" stop-color="#5d6a78" />
        </linearGradient>
        <radialGradient id="pv-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style="stop-color:var(--accent-2)" stop-opacity="0.95" />
          <stop offset="0.4" style="stop-color:var(--accent)" stop-opacity="0.45" />
          <stop offset="1" style="stop-color:var(--accent)" stop-opacity="0" />
        </radialGradient>
        <pattern id="pv-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#ffffff" stroke-opacity="0.04" />
        </pattern>
      </defs>
      <rect width="400" height="260" fill="url(#pv-bg)" />
      <rect width="400" height="260" fill="url(#pv-grid)" />
      <circle class="glow" cx="200" cy="130" r="120" fill="url(#pv-glow)" opacity="0.55" />
      <path class="arcline" d="M0 220 C 100 200, 300 240, 400 215" fill="none" stroke="var(--accent)" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 10" />

      @switch (glyph()) {
        @case ('board') {
          <rect x="70" y="56" width="260" height="150" rx="10" fill="#14463a" stroke="#2f8a6e" stroke-width="3" />
          <path d="M92 82h70v28h50M92 132h40v34h90M250 82v44h50M252 166h48M120 188h120" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" />
          <rect x="176" y="96" width="62" height="44" rx="4" fill="#0e1216" stroke="#8d9aa8" stroke-width="2" />
          <path d="M184 96v-8M196 96v-8M208 96v-8M220 96v-8M232 96v-8M184 140v8M196 140v8M208 140v8M220 140v8M232 140v8" stroke="#c9d2db" stroke-width="3" />
          <rect x="262" y="140" width="38" height="22" rx="3" fill="#2b3541" stroke="#8d9aa8" stroke-width="2" />
          <rect x="96" y="150" width="26" height="14" rx="3" fill="var(--accent-2)" />
          <circle cx="84" cy="70" r="5" fill="#0d1115" /><circle cx="316" cy="70" r="5" fill="#0d1115" /><circle cx="84" cy="192" r="5" fill="#0d1115" /><circle cx="316" cy="192" r="5" fill="#0d1115" />
          <path d="M70 120h-24M70 140h-24M330 120h24M330 140h24" stroke="#c9d2db" stroke-width="5" stroke-linecap="round" />
        }
        @case ('hose') {
          <path d="M40 190c70 0 60-110 130-110s60 110 130 110" fill="none" stroke="#0d1115" stroke-width="22" stroke-linecap="round" />
          <path d="M40 190c70 0 60-110 130-110s60 110 130 110" fill="none" stroke="#6b7886" stroke-width="16" stroke-linecap="round" stroke-dasharray="4 5" />
          <path d="M40 190c70 0 60-110 130-110s60 110 130 110" fill="none" stroke="var(--accent)" stroke-opacity=".6" stroke-width="3" stroke-linecap="round" />
          <rect x="22" y="176" width="34" height="28" rx="6" fill="url(#pv-steel)" />
          <rect x="298" y="176" width="46" height="28" rx="6" fill="url(#pv-steel)" /><rect x="344" y="182" width="26" height="16" rx="4" fill="var(--accent)" />
        }
        @case ('stt') {
          <path d="M30 196h340" stroke="#5b6773" stroke-width="2" stroke-dasharray="4 6" />
          <path class="wave" d="M30 190h50l8-84 22 84h30l8-84 22 84h30l8-84 22 84h30l8-84 22 84h30" fill="none" stroke="var(--accent-2)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" />
          <path d="M30 100c60 0 60 40 120 40" fill="none" stroke="#c9d2db" stroke-width="7" stroke-linecap="round" />
          <circle cx="30" cy="100" r="9" fill="var(--accent)" />
          <text x="236" y="76" fill="#c9d2db" font-family="monospace" font-size="22" font-weight="700" opacity=".85">STT</text>
        }
        @case ('regulator') {
          <rect x="150" y="140" width="100" height="70" rx="10" fill="url(#pv-steel)" />
          <rect x="176" y="102" width="48" height="44" rx="8" fill="#2b3541" stroke="#5b6773" stroke-width="3" />
          <circle cx="130" cy="108" r="36" fill="#0d1115" stroke="#c9d2db" stroke-width="5" /><circle cx="130" cy="108" r="28" fill="#1b232d" />
          <path d="M130 108l16-16" stroke="var(--accent-2)" stroke-width="4" stroke-linecap="round" /><circle cx="130" cy="108" r="4" fill="#c9d2db" />
          <circle cx="270" cy="108" r="36" fill="#0d1115" stroke="#c9d2db" stroke-width="5" /><circle cx="270" cy="108" r="28" fill="#1b232d" />
          <path d="M270 108l-14 14" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" /><circle cx="270" cy="108" r="4" fill="#c9d2db" />
          <rect x="190" y="62" width="20" height="44" rx="6" fill="var(--accent)" />
          <path d="M250 190h70v24" fill="none" stroke="#c9d2db" stroke-width="8" stroke-linecap="round" />
        }
        @case ('interface') {
          <rect x="110" y="76" width="180" height="108" rx="12" fill="#2b3541" stroke="#5b6773" stroke-width="3" />
          <rect x="128" y="94" width="144" height="22" rx="5" fill="#0d1115" />
          <circle cx="146" cy="105" r="5" fill="var(--accent-2)" /><circle cx="166" cy="105" r="5" fill="var(--accent)" /><circle cx="186" cy="105" r="5" fill="#5b6773" />
          <path d="M128 140h144M128 160h96" stroke="#5b6773" stroke-width="4" stroke-linecap="round" />
          <path d="M110 130H60M110 150H60M290 130h50M290 150h50" stroke="#c9d2db" stroke-width="6" stroke-linecap="round" />
          <rect x="30" y="118" width="32" height="44" rx="6" fill="url(#pv-steel)" /><rect x="338" y="118" width="32" height="44" rx="6" fill="url(#pv-steel)" />
        }
        @case ('tip') {
          <path d="M96 112h120l70 18-70 18H96z" fill="url(#pv-steel)" />
          <path d="M96 112v36" stroke="#2b3541" stroke-width="3" />
          <path d="M104 112v36M116 112v36M128 112v36M140 112v36" stroke="#2b3541" stroke-width="2" opacity=".55" />
          <path d="M286 130h40" stroke="var(--accent-2)" stroke-width="4" stroke-linecap="round" />
          <circle cx="332" cy="130" r="7" fill="#fff6dc" /><path d="M332 130l24-14M332 130l26 4M332 130l18 20" stroke="var(--accent-2)" stroke-width="3" stroke-linecap="round" />
          <circle cx="286" cy="130" r="4" fill="#0d1115" />
        }
        @case ('nozzle') {
          <path d="M96 94h100l68 18v36l-68 18H96z" fill="url(#pv-steel)" />
          <path d="M96 94v72" stroke="#2b3541" stroke-width="4" />
          <path d="M120 130h150" stroke="var(--accent)" stroke-width="10" stroke-linecap="round" />
          <path d="M270 112c40-10 70-4 90-24M270 130h90M270 148c40 10 70 4 90 24" fill="none" stroke="var(--accent-2)" stroke-opacity=".7" stroke-width="3" stroke-dasharray="6 8" stroke-linecap="round" />
        }
        @case ('gun') {
          <path d="M84 150h110l30-26h70" fill="none" stroke="#2b3541" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M84 150h110l30-26h70" fill="none" stroke="#8d9aa8" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M150 156l-14 52c-2 8 4 14 12 14h18c8 0 12-5 14-12l14-54z" fill="#2b3541" stroke="#5b6773" stroke-width="3" />
          <path d="M182 150l14 22" stroke="var(--accent)" stroke-width="8" stroke-linecap="round" />
          <rect x="292" y="108" width="50" height="32" rx="6" fill="url(#pv-steel)" />
          <path d="M342 124h26" stroke="var(--accent-2)" stroke-width="4" stroke-linecap="round" /><circle cx="376" cy="124" r="6" fill="#fff6dc" />
          <path d="M84 150H44" stroke="#c9d2db" stroke-width="10" stroke-linecap="round" />
        }
      }
    </svg>
  `,
  styles: `
    :host { display: block; overflow: hidden; }
    svg { width: 100%; height: 100%; }
    .glow { transform-origin: 200px 130px; animation: glow 3.2s ease-in-out infinite; }
    .arcline { animation: dash 2.4s linear infinite; }
    .wave { stroke-dasharray: 14 10; animation: dash 1.6s linear infinite; }
    :host-context(.pc:hover) .glow, :host-context(.cat:hover) .glow { animation-duration: 1.2s; }
    @keyframes glow { 0%,100% { opacity: .35; transform: scale(.94); } 50% { opacity: .75; transform: scale(1.06); } }
    @keyframes dash { to { stroke-dashoffset: -64; } }
  `,
})
export class ProductVisual {
  readonly glyph = input<Glyph>('gun');
  readonly label = input('');
}
