import { inject } from '@angular/core';
import { type CanActivateFn, type Routes } from '@angular/router';
import { I18n, LANGS, type Lang } from './core/i18n';

/** Устанавливает язык интерфейса по языковому префиксу URL (/ru, /en). */
const lang =
  (l: Lang): CanActivateFn =>
  () => {
    inject(I18n).set(l);
    return true;
  };

const pages: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'catalog', loadComponent: () => import('./pages/catalog').then((m) => m.Catalog) },
  { path: 'catalog/:category', loadComponent: () => import('./pages/catalog').then((m) => m.Catalog) },
  { path: 'product/:slug', loadComponent: () => import('./pages/product').then((m) => m.Product) },
  { path: 'compare', loadComponent: () => import('./pages/compare').then((m) => m.Compare) },
  { path: 'selector', loadComponent: () => import('./pages/selector').then((m) => m.Selector) },
  { path: 'delivery', loadComponent: () => import('./pages/delivery').then((m) => m.Delivery) },
  { path: 'privacy', data: { kind: 'privacy' }, loadComponent: () => import('./pages/legal').then((m) => m.Legal) },
  { path: 'consent', data: { kind: 'consent' }, loadComponent: () => import('./pages/legal').then((m) => m.Legal) },
  { path: 'about', loadComponent: () => import('./pages/about').then((m) => m.About) },
  { path: 'contacts', loadComponent: () => import('./pages/contacts').then((m) => m.Contacts) },
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ru' },
  { path: 'ru', canActivate: [lang('ru')], children: pages },
  ...(LANGS.includes('en') ? [{ path: 'en', canActivate: [lang('en')], children: pages }] : []),
  { path: '**', canActivate: [lang('ru')], loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
