import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField, form, required, submit, validate } from '@angular/forms/signals';
import { I18n } from '../core/i18n';
import { LeadService, type ContactMethod } from '../core/lead.service';
import { Analytics } from '../core/analytics';
import { formatPhone, isValidEmail, isValidPhone, normalizePhone } from '../core/phone';
import { SITE } from '../core/site.config';
import { RequestList } from '../core/request-list';

let nextId = 0;

@Component({
  selector: 'app-lead-form',
  imports: [FormField, RouterLink],
  template: `
    @if (done()) {
      <div class="done" role="status">
        <div class="done__icon" aria-hidden="true">✓</div>
        <h3>{{ i18n.t('lead.ok.title') }}</h3>
        <p>{{ i18n.t('lead.ok.text') }}</p>
        <button type="button" class="btn btn--sm" (click)="reset()">{{ i18n.t('lead.ok.again') }}</button>
      </div>
    } @else {
      <form class="lf" (submit)="onSubmit($event)" novalidate>
        @if (heading()) {
          <h3 class="lf__title">{{ i18n.t('lead.title') }}</h3>
        }

        @if (attachList() && list.items().length) {
          <p class="lf__items">
            <span>{{ i18n.t('lead.items') }}:</span>
            @for (it of list.items(); track it.slug) {
              <span class="tag">{{ i18n.loc(it.name) }}</span>
            }
          </p>
        }

        <div class="lf__row">
          <div class="field">
            <label [for]="id + '-name'">{{ i18n.t('lead.name') }}</label>
            <input type="text" autocomplete="name" [id]="id + '-name'" [formField]="f.name" />
            <span class="error" aria-live="polite">@if (f.name().touched() && f.name().invalid()) { {{ i18n.t('lead.err.name') }} }</span>
          </div>
          <div class="field">
            <label [for]="id + '-phone'">{{ i18n.t('lead.phone') }}</label>
            <input type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" [id]="id + '-phone'" [formField]="f.phone" (input)="onPhone($event)" />
            <span class="error" aria-live="polite">@if (f.phone().touched() && f.phone().invalid()) { {{ i18n.t('lead.err.phone') }} }</span>
          </div>
        </div>

        @if (!compact() || f.method().value() === 'email') {
          <div class="field">
            <label [for]="id + '-email'">{{ f.method().value() === 'email' ? i18n.t('lead.emailReq') : i18n.t('lead.email') }}</label>
            <input type="email" inputmode="email" autocomplete="email" placeholder="name@company.ru" [id]="id + '-email'" [formField]="f.email" />
            <span class="error" aria-live="polite">@if (f.email().touched() && f.email().invalid()) { {{ f.email().value().trim() ? i18n.t('lead.err.email') : i18n.t('lead.err.emailRequired') }} }</span>
          </div>
        }

        <div class="field" role="group" [attr.aria-label]="i18n.t('lead.method')">
          <span class="label">{{ i18n.t('lead.method') }}</span>
          <div class="methods">
            @for (m of methods(); track m) {
              <button
                type="button"
                class="method"
                [class.method--on]="f.method().value() === m"
                [attr.aria-pressed]="f.method().value() === m"
                (click)="f.method().value.set(m)"
              >
                {{ methodLabel(m) }}
              </button>
            }
          </div>
        </div>

        <div class="field">
          <label [for]="id + '-msg'">{{ i18n.t('lead.message') }}</label>
          <textarea [id]="id + '-msg'" [formField]="f.message"></textarea>
        </div>

        <!-- honeypot: скрыто от людей, боты его заполняют -->
        <div class="hp" aria-hidden="true">
          <input type="text" tabindex="-1" autocomplete="off" [formField]="f.website" />
        </div>

        <label class="consent">
          <input type="checkbox" [formField]="f.consent" />
          <span>
            {{ i18n.t('lead.consent.a') }}
            <a [routerLink]="i18n.link('consent')" target="_blank">{{ i18n.t('lead.consent.link') }}</a>
            {{ i18n.t('lead.consent.b') }}
            <a [routerLink]="i18n.link('privacy')" target="_blank">{{ i18n.t('lead.consent.policy') }}</a>
          </span>
        </label>
        <span class="error" aria-live="polite">@if (f.consent().touched() && f.consent().invalid()) { {{ i18n.t('lead.err.consent') }} }</span>

        <label class="consent">
          <input type="checkbox" [formField]="f.marketing" />
          <span>{{ i18n.t('lead.marketing') }}</span>
        </label>

        @if (failed()) {
          <p class="error" role="alert">{{ i18n.t('lead.err') }}</p>
        }

        <button type="submit" class="btn btn--primary btn--block" [disabled]="sending()">
          {{ sending() ? i18n.t('lead.sending') : i18n.t('lead.submit') }}
        </button>
      </form>
    }
  `,
  styles: `
    :host { display: block; }
    .lf { display: grid; gap: 10px; }
    .lf__title { margin: 0; font-size: 1.3rem; }
    .lf__row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0 12px; align-items: start; }
    @media (max-width: 560px) { .lf__row { grid-template-columns: 1fr; } }
    .lf__items { margin: 0; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: .85rem; color: var(--muted); }
    .methods { display: flex; flex-wrap: wrap; gap: 8px; }
    .method {
      min-height: 38px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--line);
      background: var(--bg); color: var(--muted); font: inherit; font-weight: 600; cursor: pointer;
      transition: .2s;
    }
    .method:hover { border-color: var(--accent); color: var(--text); }
    .method--on { background: rgb(var(--accent-rgb) / .15); border-color: var(--accent); color: var(--accent-text); }
    .consent { display: flex; align-items: flex-start; gap: 10px; font-size: .85rem; color: var(--muted); cursor: pointer; }
    .consent input { flex: none; margin: 2px 0 0; accent-color: var(--accent); width: 18px; height: 18px; }
    .consent a { color: var(--accent-text); text-decoration: underline; }
    .error { display: block; color: var(--danger); font-size: .8rem; line-height: 1.2; min-height: 1.2em; margin: 0; }
    .lf > .error { margin: 0; }
    .field { min-width: 0; }
    .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
    .done { text-align: center; display: grid; gap: 8px; justify-items: center; padding: 16px 0; }
    .done__icon {
      width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center;
      font-size: 1.6rem; color: var(--accent-ink); background: linear-gradient(135deg, var(--ok), #9bf3c9);
    }
    .done h3 { margin: 4px 0 0; } .done p { color: var(--muted); margin: 0 0 8px; }
  `,
})
export class LeadForm {
  protected readonly i18n = inject(I18n);
  protected readonly list = inject(RequestList);
  private readonly leads = inject(LeadService);
  private readonly analytics = inject(Analytics);

  /** Метка места отправки формы — попадает в уведомление менеджеру. */
  readonly source = input('site');
  readonly compact = input(false);
  readonly heading = input(true);
  /** Прикладывать позиции из «Моей заявки». */
  readonly attachList = input(false);
  /** Позиция, из карточки которой отправлена форма. */
  readonly productSlug = input<string | null>(null);
  /** Служебный контекст (например, ответы подбора) — добавляется к сообщению менеджеру. */
  readonly context = input('');

  protected readonly id = `lf${nextId++}`;
  /** В России WhatsApp заблокирован — в русской версии вместо него MAX. */
  protected readonly methods = computed<ContactMethod[]>(() =>
    this.i18n.lang() === 'ru' ? ['phone', 'telegram', 'max', 'email'] : ['phone', 'telegram', 'whatsapp', 'email'],
  );

  protected readonly model = signal({
    name: '',
    phone: '',
    email: '',
    method: 'phone' as ContactMethod,
    message: '',
    consent: false,
    marketing: false,
    website: '',
  });

  protected readonly f = form(this.model, (p) => {
    validate(p.name, ({ value }) => (value().trim().length >= 2 ? undefined : { kind: 'name' }));
    validate(p.phone, ({ value }) => (isValidPhone(value()) ? undefined : { kind: 'phone' }));
    validate(p.email, ({ value }) => {
      const v = value().trim();
      // e-mail обязателен, если клиент выбрал связь по почте; иначе — только корректность
      if (!v) return this.model().method === 'email' ? { kind: 'email' } : undefined;
      return isValidEmail(v) ? undefined : { kind: 'email' };
    });
    validate(p.consent, ({ value }) => (value() ? undefined : { kind: 'consent' }));
  });

  private lastPhone = '';
  protected readonly sending = signal(false);
  protected readonly done = signal(false);
  protected readonly failed = signal(false);

  protected readonly items = computed(() => {
    const slugs = this.attachList() ? [...this.list.slugs()] : [];
    const own = this.productSlug();
    if (own && !slugs.includes(own)) slugs.push(own);
    return slugs;
  });

  protected methodLabel(m: ContactMethod): string {
    return this.i18n.t(`lead.method.${m}` as const);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.failed.set(false);
    void submit(this.f, async () => {
      this.sending.set(true);
      try {
        const m = { ...this.model(), phone: normalizePhone(this.model().phone), email: this.model().email.trim() };
        const message = [this.context(), m.message].filter(Boolean).join('\n');
        await this.leads.send({ ...m, message, consentVersion: SITE.legalVersion, items: this.items(), source: this.source() });
        this.analytics.goal('lead', { source: this.source() });
        if (this.attachList()) this.list.clear();
        this.done.set(true);
      } catch {
        this.failed.set(true);
      } finally {
        this.sending.set(false);
      }
      return undefined;
    });
  }

  /** Маска телефона: форматируем на лету, Backspace удаляет цифру, а не символ маски. */
  protected onPhone(event: Event): void {
    const el = event.target as HTMLInputElement;
    // formField уже мог обновить модель сырым значением, поэтому помним своё последнее отформатированное
    const prev = this.lastPhone;
    const deleting = (event as InputEvent).inputType?.startsWith('delete') ?? false;
    let next = formatPhone(el.value);
    if (deleting) {
      // удалили только символ маски — убираем последнюю цифру; «+7» стирается целиком
      if (next === prev && prev) next = formatPhone(prev.replace(/\d(?=\D*$)/, ''));
      if (next === '+7' || next === '+') next = '';
    }
    el.value = next;
    this.lastPhone = next;
    this.f.phone().value.set(next);
  }

  protected reset(): void {
    this.model.set({ name: '', phone: '', email: '', method: 'phone', message: '', consent: false, marketing: false, website: '' });
    this.lastPhone = '';
    this.f().reset();
    this.done.set(false);
  }
}
