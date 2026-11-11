import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { I18n } from './i18n';

export type ContactMethod = 'phone' | 'telegram' | 'max' | 'whatsapp' | 'email';

export interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  method: ContactMethod;
  message: string;
  consent: boolean;
  /** Необязательное согласие на рассылку (отдельный флажок). */
  marketing: boolean;
  /** Версия текстов политики/согласия на момент отправки. */
  consentVersion: string;
  /** Антиспам-приманка: у людей остаётся пустой. */
  website: string;
  items: string[];
  source: string;
  page: string;
  lang: string;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(I18n);

  async send(data: Omit<LeadPayload, 'lang' | 'page'>): Promise<void> {
    const page = typeof location !== 'undefined' ? location.pathname + location.search : '';
    const body: LeadPayload = { ...data, page, lang: this.i18n.lang() };
    await firstValueFrom(this.http.post('/api/leads', body));
  }
}
