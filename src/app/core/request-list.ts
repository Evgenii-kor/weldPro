import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, afterNextRender, computed, effect, inject, signal } from '@angular/core';
import { PRODUCTS, productBySlug } from '../data/catalog';

const REQ_KEY = 'weldpro.request';
const CMP_KEY = 'weldpro.compare';
export const MAX_COMPARE = 3;

function load(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((s) => typeof s === 'string' && productBySlug(s)) : [];
  } catch {
    return [];
  }
}

function save(key: string, value: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* хранилище недоступно — состояние живёт только в памяти */
  }
}

/** Список позиций «Моя заявка» и сравнение. Состояние сохраняется в браузере. */
@Injectable({ providedIn: 'root' })
export class RequestList {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly slugs = signal<string[]>([]);
  readonly compareSlugs = signal<string[]>([]);
  readonly drawerOpen = signal(false);

  readonly items = computed(() =>
    this.slugs()
      .map((s) => PRODUCTS.find((p) => p.slug === s))
      .filter((p): p is (typeof PRODUCTS)[number] => !!p),
  );
  readonly compareItems = computed(() =>
    this.compareSlugs()
      .map((s) => PRODUCTS.find((p) => p.slug === s))
      .filter((p): p is (typeof PRODUCTS)[number] => !!p),
  );

  constructor() {
    if (this.browser) {
      // Читаем хранилище после гидратации, чтобы не ломать совпадение с серверной разметкой
      let loaded = false;
      afterNextRender(() => {
        this.slugs.set(load(REQ_KEY));
        this.compareSlugs.set(load(CMP_KEY));
        loaded = true;
      });
      effect(() => {
        const v = this.slugs();
        if (loaded) save(REQ_KEY, v);
      });
      effect(() => {
        const v = this.compareSlugs();
        if (loaded) save(CMP_KEY, v);
      });
    }
  }

  has(slug: string): boolean {
    return this.slugs().includes(slug);
  }

  toggle(slug: string): void {
    this.slugs.update((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug]));
  }

  add(slug: string): void {
    if (!this.has(slug)) this.slugs.update((l) => [...l, slug]);
  }

  remove(slug: string): void {
    this.slugs.update((l) => l.filter((s) => s !== slug));
  }

  clear(): void {
    this.slugs.set([]);
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  inCompare(slug: string): boolean {
    return this.compareSlugs().includes(slug);
  }

  /** @returns false, если лимит сравнения исчерпан */
  toggleCompare(slug: string): boolean {
    if (this.inCompare(slug)) {
      this.compareSlugs.update((l) => l.filter((s) => s !== slug));
      return true;
    }
    if (this.compareSlugs().length >= MAX_COMPARE) return false;
    this.compareSlugs.update((l) => [...l, slug]);
    return true;
  }

  clearCompare(): void {
    this.compareSlugs.set([]);
  }
}
