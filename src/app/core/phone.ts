/**
 * Телефоны и e-mail: общая логика для формы (браузер) и сервера.
 * Российские номера маскируются как +7 (XXX) XXX-XX-XX; номера других стран
 * («+44…», «+49…») вводятся свободно в международном формате.
 */

const isInternational = (raw: string): boolean => {
  const t = raw.trim();
  return t.startsWith('+') && t.length > 1 && t[1] !== '7';
};

/** Приводит ввод к маске. Принимает 8…, 7…, +7…, 9… (без кода страны). */
export function formatPhone(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  if (t === '+') return '+';
  if (isInternational(t)) return '+' + t.replace(/\D/g, '').slice(0, 15);

  let d = t.replace(/\D/g, '');
  if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1);
  const n = d.slice(0, 10);

  let out = '+7';
  if (n.length > 0) out += ' (' + n.slice(0, 3);
  if (n.length >= 3) out += ')';
  if (n.length > 3) out += ' ' + n.slice(3, 6);
  if (n.length > 6) out += '-' + n.slice(6, 8);
  if (n.length > 8) out += '-' + n.slice(8, 10);
  return out;
}

/** Российский номер: 10 цифр после +7, код 3xx/4xx/8xx/9xx. Иностранный: 8–15 цифр. */
export function isValidPhone(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  const digits = v.replace(/\D/g, '');
  if (isInternational(v)) return digits.length >= 8 && digits.length <= 15;
  const national = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
  return national.length === 10 && /^[3489]/.test(national);
}

/** +79991234567 — для CRM, звонков и мессенджеров. */
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (isInternational(value)) return '+' + digits;
  const national = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
  return '+7' + national;
}

/** Поддерживает кириллические домены (.рф), требует домен 2+ уровня и зону от 2 букв. */
const EMAIL_RE = /^[\p{L}\p{N}._%+\-]+@(?:[\p{L}\p{N}](?:[\p{L}\p{N}\-]*[\p{L}\p{N}])?\.)+[\p{L}]{2,}$/u;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length <= 254 && !v.includes('..') && !v.startsWith('.') && EMAIL_RE.test(v);
}
