import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { isValidEmail, isValidPhone, normalizePhone } from './app/core/phone';
import { SITE } from './app/core/site.config';
import { CATEGORIES, PRODUCTS } from './app/data/catalog';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
// Допустимые хосты (защита от подмены Host). Для боевого домена задайте ALLOWED_HOSTS="shop.ru,www.shop.ru"
const extraHosts = (process.env['ALLOWED_HOSTS'] ?? '').split(',').map((h) => h.trim()).filter(Boolean);
const angularApp = new AngularNodeAppEngine(extraHosts.length ? { allowedHosts: extraHosts } : undefined);

app.set('trust proxy', true);
app.use(express.json({ limit: '32kb' }));

const siteUrl = (process.env['SITE_URL'] ?? SITE.url).replace(/\/$/, '');
const LANGS = ['ru'] as const; // добавьте 'en', чтобы вернуть английскую версию

/* ------------------------------------------------------------------ */
/*  Заявки (лиды)                                                      */
/* ------------------------------------------------------------------ */

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clip = (v: unknown, n: number): string => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const METHODS = new Set(['phone', 'telegram', 'max', 'whatsapp', 'email']);

async function notify(chatText: string, hookText: string): Promise<void> {
  const token = process.env['TELEGRAM_BOT_TOKEN'];
  const chat = process.env['TELEGRAM_CHAT_ID'];
  if (token && chat) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: chatText }),
    });
  }
  const hook = process.env['LEAD_WEBHOOK_URL'];
  if (hook) {
    await fetch(hook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: hookText }),
    });
  }
}

app.post('/api/leads', async (req, res) => {
  const b = req.body ?? {};

  // Ловушка для ботов: поле заполнено — делаем вид, что всё принято.
  if (clip(b.website, 100)) {
    res.json({ ok: true });
    return;
  }
  if (rateLimited(req.ip ?? 'unknown')) {
    res.status(429).json({ ok: false, error: 'rate_limited' });
    return;
  }

  const lead = {
    receivedAt: new Date().toISOString(),
    name: clip(b.name, 120),
    phone: isValidPhone(clip(b.phone, 40)) ? normalizePhone(clip(b.phone, 40)) : '',
    email: clip(b.email, 160),
    method: METHODS.has(b.method) ? b.method : 'phone',
    message: clip(b.message, 2000),
    items: Array.isArray(b.items) ? b.items.slice(0, 20).map((s: unknown) => clip(s, 120)) : [],
    source: clip(b.source, 60),
    page: clip(b.page, 300),
    lang: b.lang === 'en' ? 'en' : 'ru',
    // Журнал согласий (152-ФЗ): когда, на какой версии текстов и из какой формы дано согласие.
    // IP-адрес намеренно не сохраняем — это тоже персональные данные, а для цели он не нужен.
    consent: {
      given: b.consent === true,
      at: new Date().toISOString(),
      version: clip(b.consentVersion, 20),
      form: clip(b.source, 60),
      marketing: b.marketing === true,
    },
  };

  const emailBad = lead.email ? !isValidEmail(lead.email) : lead.method === 'email';
  if (lead.name.length < 2 || !lead.phone || emailBad || !lead.consent.given) {
    res.status(400).json({ ok: false, error: 'invalid' });
    return;
  }

  try {
    const dir = process.env['LEADS_DIR'] ?? join(process.cwd(), 'data');
    await mkdir(dir, { recursive: true });
    await appendFile(join(dir, 'leads.jsonl'), JSON.stringify(lead) + '\n');
  } catch (e) {
    console.error('Не удалось сохранить заявку', e);
    res.status(500).json({ ok: false, error: 'storage' });
    return;
  }

  // Уведомление менеджеру не блокирует ответ клиенту.
  // В мессенджер (Telegram — иностранный сервис) уходит ТОЛЬКО факт новой заявки без имени, телефона и почты:
  // персональные данные остаются на российском сервере в data/leads.jsonl.
  const alert = [
    '🔥 Новая заявка',
    `Время: ${lead.receivedAt}`,
    `Способ связи: ${lead.method}`,
    lead.items.length && `Позиций: ${lead.items.length}`,
    `Источник: ${lead.source} (${lead.lang})`,
    'Данные клиента — в журнале заявок на сервере.',
  ]
    .filter(Boolean)
    .join('\n');
  // Полный текст — только в вебхук, и только если вы явно включили LEAD_WEBHOOK_FULL=1
  // (например, это ваша CRM на российском хостинге).
  const full = [
    alert,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email && `E-mail: ${lead.email}`,
    lead.items.length && `Позиции: ${lead.items.join(', ')}`,
    lead.message && `Сообщение: ${lead.message}`,
    `Страница: ${lead.page}`,
  ]
    .filter(Boolean)
    .join('\n');
  void notify(alert, process.env['LEAD_WEBHOOK_FULL'] === '1' ? full : alert).catch((e) =>
    console.error('Уведомление не отправлено', e),
  );

  res.json({ ok: true });
});

/* ------------------------------------------------------------------ */
/*  SEO: robots.txt, sitemap.xml, редирект с корня по языку браузера   */
/* ------------------------------------------------------------------ */

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    ['User-agent: *', 'Allow: /', 'Disallow: /api/', 'Disallow: /*?q=', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n'),
  );
});

app.get('/sitemap.xml', (_req, res) => {
  const paths = [
    '',
    'catalog',
    'selector',
    'delivery',
    'about',
    'contacts',
    'privacy',
    'consent',
    ...CATEGORIES.map((c) => `catalog/${c.slug}`),
    ...PRODUCTS.map((p) => `product/${p.slug}`),
  ];
  const url = (l: string, p: string) => `${siteUrl}/${l}${p ? '/' + p : ''}`;
  const body = paths
    .flatMap((p) =>
      LANGS.map(
        (l) =>
          `<url><loc>${url(l, p)}</loc>` +
          LANGS.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${url(a, p)}"/>`).join('') +
          `<xhtml:link rel="alternate" hreflang="x-default" href="${url('ru', p)}"/></url>`,
      ),
    )
    .join('');
  res
    .type('application/xml')
    .send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${body}</urlset>`,
    );
});

// Русский язык — основной: корень всегда ведёт на /ru (английская версия — по переключателю)
app.get('/', (_req, res) => {
  res.redirect(301, '/ru');
});

/* ------------------------------------------------------------------ */

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
