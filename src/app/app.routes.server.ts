import { RenderMode, type ServerRoute } from '@angular/ssr';
import { CATEGORIES, PRODUCTS } from './data/catalog';
import { LANGS } from './core/i18n';

const langs: string[] = LANGS;
const each = <T extends Record<string, string>>(items: T[]) =>
  langs.flatMap((lang) => items.map((i) => ({ lang, ...i })));

/**
 * Статические страницы (главная, каталог, товары) пререндерятся при сборке —
 * быстрый TTFB и полностью готовый HTML для поисковых роботов.
 */
export const serverRoutes: ServerRoute[] = [
  { path: ':lang', renderMode: RenderMode.Prerender, getPrerenderParams: async () => each([{}]) },
  { path: ':lang/catalog', renderMode: RenderMode.Prerender, getPrerenderParams: async () => each([{}]) },
  {
    path: ':lang/catalog/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => each(CATEGORIES.map((c) => ({ category: c.slug }))),
  },
  {
    path: ':lang/product/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => each(PRODUCTS.map((p) => ({ slug: p.slug }))),
  },
  { path: ':lang/selector', renderMode: RenderMode.Prerender, getPrerenderParams: async () => each([{}]) },
  { path: ':lang/delivery', renderMode: RenderMode.Prerender, getPrerenderParams: async () => each([{}]) },
  { path: ':lang/about', renderMode: RenderMode.Prerender, getPrerenderParams: async () => each([{}]) },
  { path: ':lang/contacts', renderMode: RenderMode.Prerender, getPrerenderParams: async () => each([{}]) },
  { path: ':lang/privacy', renderMode: RenderMode.Prerender, getPrerenderParams: async () => each([{}]) },
  { path: ':lang/consent', renderMode: RenderMode.Prerender, getPrerenderParams: async () => each([{}]) },
  { path: ':lang/compare', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
