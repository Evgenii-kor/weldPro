import { SITE } from './site.config';
import type { Lang } from './i18n';

export type LegalKind = 'privacy' | 'consent';
export interface LegalSection {
  h?: string;
  p: string[];
}

/**
 * Типовые тексты политики и согласия (152-ФЗ). Это ШАБЛОН: реквизиты берутся из site.config.ts,
 * итоговую редакцию перед запуском должен проверить юрист.
 */
export function legalText(kind: LegalKind, lang: Lang): LegalSection[] {
  const op = `${SITE.legalName}, ИНН ${SITE.inn}, ОГРН ${SITE.ogrn}, ${SITE.legalAddress}`;
  const opEn = `${SITE.legalName}, TIN ${SITE.inn}, PSRN ${SITE.ogrn}, ${SITE.legalAddress}`;
  const mail = SITE.privacyEmail;

  if (kind === 'privacy' && lang === 'ru') {
    return [
      {
        h: '1. Общие положения',
        p: [
          `Настоящая политика определяет, как оператор — ${op} (далее — Оператор) — обрабатывает и защищает персональные данные посетителей сайта ${SITE.url} (далее — Сайт) в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».`,
          'Используя Сайт и отправляя заявку, вы подтверждаете, что ознакомились с политикой.',
        ],
      },
      {
        h: '2. Какие данные мы собираем',
        p: [
          'Имя, номер телефона, адрес электронной почты (если указан), выбранный способ связи, текст сообщения и перечень выбранных позиций каталога — то, что вы сами вводите в форме заявки.',
          'Технические данные: тип браузера и устройства, адрес страницы, время визита, а при вашем согласии на аналитические cookie — обезличенные данные Яндекс.Метрики.',
          'Мы не собираем специальные категории персональных данных и не требуем данных, не нужных для обработки заявки.',
        ],
      },
      {
        h: '3. Цели и основания обработки',
        p: [
          'Связаться с вами по заявке, подобрать оборудование и запчасти, подготовить расчёт и коммерческое предложение, заключить и исполнить договор поставки.',
          'Если вы отметили необязательное согласие на рассылку — отправлять новости и предложения. Это согласие можно отозвать в любой момент.',
          'Основание: ваше согласие (ст. 6 ч. 1 п. 1 152-ФЗ), а для исполнения договора — ст. 6 ч. 1 п. 5.',
        ],
      },
      {
        h: '4. Где и как долго хранятся данные',
        p: [
          'Персональные данные граждан Российской Федерации записываются, систематизируются и хранятся в базах данных на территории Российской Федерации.',
          'Заявки хранятся не дольше, чем необходимо для достижения целей обработки, и не более 3 лет с даты последнего контакта, если иной срок не требуется законом или договором. После этого данные удаляются или обезличиваются.',
          'Данные о заявке передаются менеджерам в служебных уведомлениях без указания имени и телефона; сами данные доступны только уполномоченным сотрудникам.',
        ],
      },
      {
        h: '5. Передача третьим лицам',
        p: [
          'Мы не продаём персональные данные. Передача возможна только исполнителям, которые обеспечивают работу Сайта (хостинг, аналитика, связь), на основании договора и в объёме, необходимом для их услуг, а также государственным органам по их законному требованию.',
          'Трансграничная передача данных не осуществляется. Если она потребуется, Оператор заранее уведомит Роскомнадзор и обновит эту политику.',
        ],
      },
      {
        h: '6. Cookie и аналитика',
        p: [
          'Необходимые cookie и локальное хранилище нужны для работы Сайта: язык, список «Моя заявка», выбранный вариант cookie. Их нельзя отключить.',
          'Аналитические cookie (Яндекс.Метрика) включаются только после нажатия «Принять все». Выбор «Только необходимые» отключает аналитику. Изменить выбор можно в любой момент по ссылке «Настройки cookie» внизу страницы.',
        ],
      },
      {
        h: '7. Ваши права',
        p: [
          'Вы вправе получить сведения об обработке своих данных, потребовать их уточнения, блокирования или удаления, отозвать согласие и обжаловать действия Оператора в Роскомнадзоре или в суде.',
          `Для этого напишите на ${mail} с указанием имени и телефона из заявки. Ответ — в срок, установленный законом (как правило, до 10 рабочих дней).`,
        ],
      },
      {
        h: '8. Защита данных',
        p: [
          'Оператор применяет правовые, организационные и технические меры: ограничение доступа, шифрование соединения (HTTPS), защиту от спама и перебора, резервное копирование.',
          'О выявленной утечке персональных данных Оператор уведомляет Роскомнадзор в сроки, установленные законом (в течение 24 часов, результаты внутреннего расследования — в течение 72 часов).',
        ],
      },
      {
        h: '9. Изменение политики',
        p: [
          'Оператор вправе изменять политику. Актуальная редакция всегда опубликована на этой странице; дата редакции указана вверху.',
        ],
      },
    ];
  }

  if (kind === 'privacy') {
    return [
      {
        h: '1. General',
        p: [
          `This policy describes how the operator — ${opEn} (the “Operator”) — processes and protects personal data of visitors to ${SITE.url} (the “Site”) in accordance with Russian Federal Law No. 152-FZ “On Personal Data”.`,
          'By using the Site and submitting a request you confirm that you have read this policy.',
        ],
      },
      {
        h: '2. Data we collect',
        p: [
          'Your name, phone number, e-mail (if provided), preferred contact method, message text and the catalog items you selected — what you enter in the request form.',
          'Technical data: browser and device type, page address, visit time and, if you accept analytics cookies, anonymised Yandex Metrica data.',
          'We do not collect special categories of personal data.',
        ],
      },
      {
        h: '3. Purposes and legal basis',
        p: [
          'To contact you about your request, select equipment and spare parts, prepare a quote, and conclude and perform a supply contract.',
          'If you tick the optional marketing box — to send news and offers. You can withdraw it at any time.',
          'Legal basis: your consent (Art. 6(1)(1) of 152-FZ) and, for contract performance, Art. 6(1)(5).',
        ],
      },
      {
        h: '4. Storage and retention',
        p: [
          'Personal data of Russian citizens is recorded and stored in databases located in the Russian Federation.',
          'Requests are kept no longer than needed for the purposes above and no more than 3 years after the last contact unless the law or a contract requires otherwise; then they are deleted or anonymised.',
          'Managers receive service notifications without your name and phone number; the data itself is available only to authorised staff.',
        ],
      },
      {
        h: '5. Disclosure to third parties',
        p: [
          'We do not sell personal data. It may be shared only with providers that keep the Site running (hosting, analytics, communications) under a contract and to the extent necessary, and with public authorities on a lawful demand.',
          'No cross-border transfer is made. If one becomes necessary, the Operator will notify Roskomnadzor in advance and update this policy.',
        ],
      },
      {
        h: '6. Cookies and analytics',
        p: [
          'Necessary cookies and local storage keep the Site working (language, “My request” list, your cookie choice). They cannot be switched off.',
          'Analytics cookies (Yandex Metrica) are enabled only after you press “Accept all”. “Necessary only” keeps analytics off. You can change the choice at any time via “Cookie settings” at the bottom of the page.',
        ],
      },
      {
        h: '7. Your rights',
        p: [
          'You may request information about the processing of your data, ask for correction, blocking or deletion, withdraw consent and complain to Roskomnadzor or a court.',
          `Write to ${mail} stating the name and phone number from your request. We reply within the period set by law (normally up to 10 business days).`,
        ],
      },
      {
        h: '8. Data protection',
        p: [
          'The Operator applies legal, organisational and technical measures: access control, HTTPS, spam and brute-force protection, backups.',
          'In case of a data breach the Operator notifies Roskomnadzor within the statutory periods (24 hours; results of the internal investigation within 72 hours).',
        ],
      },
      { h: '9. Changes', p: ['The Operator may update this policy. The current version is always published on this page; its date is shown at the top.'] },
    ];
  }

  if (lang === 'ru') {
    return [
      {
        p: [
          `Я, действуя свободно, своей волей и в своём интересе, даю ${op} (далее — Оператор) согласие на обработку моих персональных данных на следующих условиях.`,
        ],
      },
      { h: 'Данные', p: ['Имя, номер телефона, адрес электронной почты (если указан), выбранный способ связи, текст сообщения, перечень выбранных позиций каталога.'] },
      { h: 'Цель', p: ['Обработка моей заявки: связь со мной, подбор оборудования и запчастей, подготовка расчёта и коммерческого предложения, заключение и исполнение договора.'] },
      {
        h: 'Действия с данными',
        p: ['Сбор, запись, систематизация, накопление, хранение, уточнение, использование, передача уполномоченным сотрудникам и исполнителям Оператора на основании договора, блокирование, удаление, уничтожение — с использованием средств автоматизации и без них.'],
      },
      { h: 'Срок', p: ['Согласие действует до достижения цели обработки, но не более 3 лет с даты последнего контакта, либо до его отзыва.'] },
      {
        h: 'Отзыв',
        p: [`Согласие можно отозвать в любой момент, направив заявление на ${SITE.privacyEmail}. Отзыв не влияет на законность обработки до момента отзыва. После отзыва Оператор прекращает обработку и удаляет данные, если нет иных законных оснований для их хранения.`],
      },
      {
        h: 'Рассылка',
        p: ['Согласие на получение новостей и предложений даётся отдельным необязательным флажком и не требуется для обработки заявки.'],
      },
      { h: 'Дополнительно', p: ['Подробности — в Политике обработки персональных данных на Сайте.'] },
    ];
  }
  return [
    { p: [`Acting freely, of my own will and in my own interest, I give ${opEn} (the “Operator”) my consent to the processing of my personal data on the following terms.`] },
    { h: 'Data', p: ['Name, phone number, e-mail (if provided), preferred contact method, message text, selected catalog items.'] },
    { h: 'Purpose', p: ['Handling my request: contacting me, selecting equipment and parts, preparing a quote and offer, concluding and performing a contract.'] },
    {
      h: 'Actions',
      p: ['Collection, recording, systematisation, accumulation, storage, clarification, use, transfer to authorised staff and contractors of the Operator under a contract, blocking, deletion, destruction — with and without automation.'],
    },
    { h: 'Term', p: ['Valid until the purpose is achieved, but no more than 3 years after the last contact, or until withdrawn.'] },
    {
      h: 'Withdrawal',
      p: [`I may withdraw consent at any time by writing to ${SITE.privacyEmail}. Withdrawal does not affect the lawfulness of prior processing. After withdrawal the Operator stops processing and deletes the data unless another lawful basis requires keeping it.`],
    },
    { h: 'Marketing', p: ['Consent to news and offers is given by a separate optional checkbox and is not required to process the request.'] },
    { h: 'More', p: ['Details are in the Personal Data Processing Policy on the Site.'] },
  ];
}
