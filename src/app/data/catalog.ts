export interface Localized {
  ru: string;
  en: string;
}

export type Glyph = 'board' | 'hose' | 'stt' | 'regulator' | 'interface' | 'tip' | 'nozzle' | 'gun';

/** Система, к которой относится позиция (используется в подборе по системе). */
export type System = 'dc400' | 'innershield' | 'stt' | 'concoa';
export const SYSTEMS: System[] = ['dc400', 'innershield', 'stt', 'concoa'];

export interface Category {
  slug: string;
  glyph: Glyph;
  name: Localized;
  desc: Localized;
}

export interface Spec {
  label: Localized;
  value: Localized;
}

export interface Product {
  slug: string;
  category: string;
  /** Бренд. Пустая строка — не показывать. */
  brand: string;
  name: Localized;
  short: Localized;
  description: Localized;
  features: Localized[];
  specs: Spec[];
  /** Системы, с которыми совместима позиция. */
  systems: System[];
  /** Ориентировочный диапазон цены, ₽ (пересчёт из USD по курсу ЦБ РФ 82,13 на 08.11.2026). ЗАГЛУШКИ — заменить реальными данными. */
  priceFrom: number;
  priceTo: number;
  featured?: boolean;
  tags: string[];
  /** Пути к фото в public/, например '/images/products/dc400-board.jpg'. Пусто — иллюстрация-заглушка. */
  images?: string[];
  /** 'stock' — в наличии, по умолчанию «под заказ». */
  availability?: 'stock' | 'order';
}

const L = (ru: string, en: string): Localized => ({ ru, en });
const S = (lr: string, le: string, vr: string, ve: string): Spec => ({ label: L(lr, le), value: L(vr, ve) });

const LE = 'Lincoln Electric';
const CONCOA = 'Concoa';
/** Общая строка спецификации: артикул подбирается менеджером по модели и серийному номеру. */
const PN = S('Артикул', 'Part number', 'Подбираем по модели и серийному номеру', 'Matched by model and serial number');
const MADE = S('Исполнение', 'Version', 'Оригинал или совместимый аналог', 'Original or compatible equivalent');

export const CATEGORIES: Category[] = [
  {
    slug: 'dc400-boards',
    glyph: 'board',
    name: L('Платы управления DC-400', 'DC-400 control boards'),
    desc: L(
      'Платы управления, поджига и защиты для источников Lincoln Electric DC-400.',
      'Control, firing and protection boards for Lincoln Electric DC-400 power sources.',
    ),
  },
  {
    slug: 'innershield-hoses',
    glyph: 'hose',
    name: L('Рукава Innershield', 'Innershield gun cables'),
    desc: L(
      'Рукава (кабель-шланги) в сборе и каналы для пистолетов под самозащитную проволоку Innershield.',
      'Gun cable assemblies and liners for Innershield self-shielded wire guns.',
    ),
  },
  {
    slug: 'stt-hoses',
    glyph: 'stt',
    name: L('Рукава и кабели STT', 'STT hoses & cables'),
    desc: L(
      'Рукава пистолета, кабели обратной связи и силовые кабели для процесса STT.',
      'Gun cable assemblies, feedback leads and power cables for the STT process.',
    ),
  },
  {
    slug: 'concoa-regulators',
    glyph: 'regulator',
    name: L('Редукторы Concoa', 'Concoa regulators'),
    desc: L(
      'Газовые редукторы, расходомеры и фитинги Concoa для защитных газов.',
      'Concoa gas regulators, flowmeters and fittings for shielding gases.',
    ),
  },
  {
    slug: 'interfaces',
    glyph: 'interface',
    name: L('Интерфейсы', 'Interfaces'),
    desc: L(
      'Интерфейсные модули и кабели между источником, подающим устройством и пультом.',
      'Interface modules and cables between power source, wire feeder and remote.',
    ),
  },
  {
    slug: 'contact-tips',
    glyph: 'tip',
    name: L('Наконечники', 'Contact tips'),
    desc: L(
      'Контактные наконечники для Innershield и STT под нужный диаметр проволоки.',
      'Contact tips for Innershield and STT in the wire diameter you need.',
    ),
  },
  {
    slug: 'nozzles',
    glyph: 'nozzle',
    name: L('Сопла', 'Nozzles'),
    desc: L(
      'Сопла, изоляторы и удлинённые направляющие для пистолетов Innershield и STT.',
      'Nozzles, insulators and extension guides for Innershield and STT guns.',
    ),
  },
  {
    slug: 'gun-parts',
    glyph: 'gun',
    name: L('Запчасти для Innershield и STT', 'Innershield & STT parts'),
    desc: L(
      'Рукоятки, курки, диффузоры, подающие ролики и всё остальное для пистолетов и подающих.',
      'Handles, triggers, diffusers, drive rolls and everything else for guns and feeders.',
    ),
  },
];

export const PRODUCTS: Product[] = [
  /* ---------- Платы управления DC-400 ---------- */
  {
    slug: 'dc400-control-board',
    category: 'dc400-boards',
    brand: LE,
    name: L('Плата управления DC-400 (Control PC Board)', 'DC-400 Control PC Board'),
    short: L('Главная плата управления источником: регулирует ток и обрабатывает обратную связь.', 'Main control board of the power source: regulates current and handles feedback.'),
    description: L(
      'Плата управления — «мозг» источника DC-400. При сбоях тока, нестабильной дуге или отсутствии отклика на регулятор причина часто в ней. Подберём плату по модели и серийному номеру аппарата.',
      'The control board is the brain of the DC-400. Current faults, an unstable arc or no response from the dial often trace back to it. We match the board to your machine model and serial number.',
    ),
    features: [
      L('Подбор по серийному номеру аппарата', 'Matched by machine serial number'),
      L('Оригинал или совместимый аналог', 'Original or compatible equivalent'),
      L('Помощь с диагностикой по описанию неисправности', 'Fault diagnosis help from your description'),
    ],
    specs: [S('Источник', 'Power source', 'Lincoln Electric DC-400', 'Lincoln Electric DC-400'), PN, MADE],
    systems: ['dc400'], priceFrom: 20500, priceTo: 74000, featured: true, tags: ['dc-400', 'dc400', 'pcb', 'control', 'плата'],
  },
  {
    slug: 'dc400-firing-board',
    category: 'dc400-boards',
    brand: LE,
    name: L('Плата поджига тиристоров DC-400', 'DC-400 SCR firing board'),
    short: L('Формирует импульсы управления силовыми тиристорами выпрямителя.', 'Generates the gate pulses for the rectifier SCRs.'),
    description: L(
      'Плата отвечает за запуск силовых тиристоров. Выход её из строя проявляется пропаданием выходного напряжения или перекосом по фазам. Уточните симптомы — менеджер подскажет, какие платы нужны.',
      'This board triggers the power SCRs. Failure shows up as lost output or phase imbalance. Describe the symptoms and the manager will tell you which boards you need.',
    ),
    features: [
      L('Для ремонта силового блока', 'For power-section repair'),
      L('Подбор по ревизии платы', 'Matched by board revision'),
    ],
    specs: [S('Источник', 'Power source', 'Lincoln Electric DC-400', 'Lincoln Electric DC-400'), PN, MADE],
    systems: ['dc400'], priceFrom: 16500, priceTo: 61500, tags: ['dc-400', 'firing', 'scr', 'тиристор', 'плата'],
  },
  {
    slug: 'dc400-protection-board',
    category: 'dc400-boards',
    brand: LE,
    name: L('Платы защиты и демпфирования DC-400', 'DC-400 snubber and protection boards'),
    short: L('Гасят выбросы напряжения и защищают силовые элементы источника.', 'Suppress voltage spikes and protect the power components.'),
    description: L(
      'Демпфирующие и защитные платы продлевают жизнь тиристорам и диодам. Рекомендуем менять комплектом при ремонте силовой части.',
      'Snubber and protection boards extend the life of SCRs and diodes. We recommend replacing them as a set when repairing the power section.',
    ),
    features: [L('Продаются поштучно и комплектом', 'Sold singly or as a set'), L('Подбор по модели', 'Matched by model')],
    specs: [S('Источник', 'Power source', 'Lincoln Electric DC-400', 'Lincoln Electric DC-400'), PN],
    systems: ['dc400'], priceFrom: 7400, priceTo: 33000, tags: ['dc-400', 'snubber', 'protection', 'плата'],
  },

  /* ---------- Рукава Innershield ---------- */
  {
    slug: 'innershield-gun-cable',
    category: 'innershield-hoses',
    brand: LE,
    name: L('Рукав пистолета Innershield в сборе', 'Innershield gun cable assembly'),
    short: L('Кабель-шланг с каналом и разъёмами для пистолетов под самозащитную проволоку.', 'Cable with liner and connectors for self-shielded wire guns.'),
    description: L(
      'Рукав — самая изнашиваемая часть пистолета: перегибы, абразив проволоки, нагрев. Поставляем рукава Innershield разной длины, подбираем под модель пистолета и диаметр проволоки.',
      'The gun cable is the most worn part of any gun: kinks, wire abrasion, heat. We supply Innershield cable assemblies in several lengths, matched to your gun model and wire diameter.',
    ),
    features: [
      L('Длины 3 м и 4,5 м, другие по запросу', 'Lengths of 3 m and 4.5 m, others on request'),
      L('Канал под ваш диаметр проволоки', 'Liner for your wire diameter'),
      L('Совместимость уточняем по модели пистолета', 'Compatibility checked against your gun model'),
    ],
    specs: [
      S('Процесс', 'Process', 'FCAW-S (Innershield)', 'FCAW-S (Innershield)'),
      S('Длина', 'Length', '3 м / 4,5 м', '3 m / 4.5 m'),
      S('Охлаждение', 'Cooling', 'Воздушное', 'Air-cooled'),
      PN,
    ],
    systems: ['innershield'], priceFrom: 9900, priceTo: 34500, featured: true, tags: ['innershield', 'иннершилд', 'энершилд', 'рукав', 'hose', 'cable'],
  },
  {
    slug: 'innershield-gun',
    category: 'innershield-hoses',
    brand: LE,
    name: L('Пистолет Innershield в сборе', 'Innershield gun, complete'),
    short: L('Готовый пистолет: рукав, рукоятка, курок, наконечник и сопло.', 'A ready gun: cable, handle, trigger, tip and nozzle.'),
    description: L(
      'Если рукав и узлы пистолета изношены вместе, проще заменить пистолет целиком. Подберём модель по току и диаметру проволоки.',
      'If the cable and the gun parts are worn together, it is simpler to replace the whole gun. We match the model to current rating and wire diameter.',
    ),
    features: [L('Готов к подключению', 'Ready to connect'), L('Подбор по току и проволоке', 'Matched to current and wire')],
    specs: [S('Процесс', 'Process', 'FCAW-S (Innershield)', 'FCAW-S (Innershield)'), S('Ток', 'Rating', 'До 350 А (по модели)', 'Up to 350 A (by model)'), PN],
    systems: ['innershield'], priceFrom: 20500, priceTo: 57500, tags: ['innershield', 'gun', 'пистолет', 'k126'],
  },
  {
    slug: 'innershield-liner',
    category: 'innershield-hoses',
    brand: LE,
    name: L('Канал (спираль) для рукава Innershield', 'Innershield cable liner'),
    short: L('Направляющий канал проволоки — меняется чаще самого рукава.', 'The wire guide liner — replaced more often than the cable itself.'),
    description: L(
      'Забитый или изношенный канал вызывает «жевание» проволоки и нестабильную подачу. Меняется отдельно, без замены всего рукава.',
      'A clogged or worn liner causes wire chewing and unstable feed. It can be replaced on its own without changing the whole cable.',
    ),
    features: [L('Под диаметр проволоки', 'Sized to wire diameter'), L('Расходная часть', 'Wear item')],
    specs: [S('Процесс', 'Process', 'FCAW-S', 'FCAW-S'), S('Диаметр проволоки', 'Wire diameter', 'Указываете в заявке', 'State in your request')],
    systems: ['innershield'], priceFrom: 800, priceTo: 4900, tags: ['innershield', 'liner', 'канал', 'спираль'],
  },

  /* ---------- Рукава и кабели STT ---------- */
  {
    slug: 'stt-gun-cable',
    category: 'stt-hoses',
    brand: LE,
    name: L('Рукав пистолета для STT в сборе', 'STT gun cable assembly'),
    short: L('Рукав для процесса Surface Tension Transfer: подача проволоки и газ в одной сборке.', 'Cable for the Surface Tension Transfer process: wire feed and gas in one assembly.'),
    description: L(
      'STT требует стабильной подачи тонкой проволоки и точной обратной связи по напряжению. Подбираем рукав под ваш подающий механизм и длину трассы.',
      'STT needs stable thin-wire feeding and accurate voltage feedback. We match the cable to your feeder and run length.',
    ),
    features: [L('Под тонкую проволоку', 'For thin wire'), L('Подбор длины под трассу', 'Length matched to your run')],
    specs: [S('Процесс', 'Process', 'STT (Surface Tension Transfer)', 'STT (Surface Tension Transfer)'), S('Охлаждение', 'Cooling', 'Воздушное', 'Air-cooled'), PN],
    systems: ['stt'], priceFrom: 11500, priceTo: 39500, featured: true, tags: ['stt', 'рукав', 'gun', 'cable'],
  },
  {
    slug: 'stt-feedback-lead',
    category: 'stt-hoses',
    brand: LE,
    name: L('Кабель обратной связи STT (sense lead)', 'STT voltage-sense lead'),
    short: L('Сигнальный кабель, по которому источник «видит» напряжение на дуге.', 'The signal lead that lets the power source see the arc voltage.'),
    description: L(
      'Без исправного кабеля обратной связи форма тока STT нестабильна. Поставляем кабели разной длины и с нужными разъёмами.',
      'Without a healthy sense lead the STT waveform is unstable. We supply leads in several lengths with the connectors you need.',
    ),
    features: [L('Разные длины', 'Several lengths'), L('Нужные разъёмы', 'Matching connectors')],
    specs: [S('Процесс', 'Process', 'STT', 'STT'), S('Назначение', 'Purpose', 'Сигнал обратной связи', 'Feedback signal'), PN],
    systems: ['stt'], priceFrom: 3300, priceTo: 15000, tags: ['stt', 'sense', 'кабель', 'обратная связь'],
  },
  {
    slug: 'stt-power-cable',
    category: 'stt-hoses',
    brand: LE,
    name: L('Силовые кабели для STT', 'STT power cables'),
    short: L('Кабели от источника до подающего устройства и до изделия.', 'Cables from the power source to the feeder and to the work.'),
    description: L(
      'Сечение и длина силовых кабелей влияют на индуктивность цепи, а для STT это критично. Подберём комплект под вашу трассу.',
      'Cable gauge and length affect circuit inductance, which is critical for STT. We pick a set for your layout.',
    ),
    features: [L('Комплект под трассу', 'Set matched to your layout'), L('Любая длина по запросу', 'Any length on request')],
    specs: [S('Процесс', 'Process', 'STT', 'STT'), PN],
    systems: ['stt'], priceFrom: 6600, priceTo: 28500, tags: ['stt', 'power', 'кабель', 'силовой'],
  },

  /* ---------- Редукторы Concoa ---------- */
  {
    slug: 'concoa-single-stage-regulator',
    category: 'concoa-regulators',
    brand: CONCOA,
    name: L('Редуктор Concoa одноступенчатый', 'Concoa single-stage regulator'),
    short: L('Базовый редуктор для защитных газов в цеховой линии.', 'A basic regulator for shielding gases on a shop line.'),
    description: L(
      'Одноступенчатые редукторы Concoa подходят для стабильных постов, где давление в баллоне меняется медленно. Подберём под газ (аргон, CO₂, смеси) и диапазон давления.',
      'Concoa single-stage regulators suit stable stations where cylinder pressure changes slowly. We match them to the gas (argon, CO₂, mixes) and pressure range.',
    ),
    features: [L('Для аргона, CO₂ и смесей', 'For argon, CO₂ and mixes'), L('Подбор по давлению', 'Matched to pressure range')],
    specs: [S('Тип', 'Type', 'Одноступенчатый', 'Single-stage'), S('Газы', 'Gases', 'Ar, CO₂, смеси', 'Ar, CO₂, mixes')],
    systems: ['concoa', 'stt'], priceFrom: 9900, priceTo: 33000, tags: ['concoa', 'регулятор', 'редуктор', 'regulator'],
  },
  {
    slug: 'concoa-two-stage-regulator',
    category: 'concoa-regulators',
    brand: CONCOA,
    name: L('Редуктор Concoa двухступенчатый', 'Concoa two-stage regulator'),
    short: L('Держит стабильное давление, пока баллон опорожняется.', 'Holds a steady outlet pressure as the cylinder empties.'),
    description: L(
      'Двухступенчатая схема убирает «просадку» давления по мере расхода газа — важно для STT и ответственных швов, где расход защитного газа влияет на качество.',
      'The two-stage design removes outlet-pressure droop as the cylinder drains — important for STT and critical welds where shielding-gas flow affects quality.',
    ),
    features: [L('Стабильный выход', 'Steady outlet'), L('Для ответственных швов и STT', 'For critical welds and STT')],
    specs: [S('Тип', 'Type', 'Двухступенчатый', 'Two-stage'), S('Газы', 'Gases', 'Ar, CO₂, смеси', 'Ar, CO₂, mixes')],
    systems: ['concoa', 'stt'], priceFrom: 18000, priceTo: 53500, featured: true, tags: ['concoa', 'two-stage', 'редуктор', 'regulator'],
  },
  {
    slug: 'concoa-flowmeter-regulator',
    category: 'concoa-regulators',
    brand: CONCOA,
    name: L('Редуктор-расходомер Concoa', 'Concoa flowmeter regulator'),
    short: L('Редуктор с шкалой расхода в л/мин — сразу видно, сколько газа идёт в шов.', 'A regulator with an L/min flow scale — see at a glance how much gas goes to the weld.'),
    description: L(
      'Расходомер на выходе избавляет от подбора «на глаз». Удобно при настройке защитного газа для STT и других процессов.',
      'The built-in flowmeter ends guesswork. Handy when setting shielding gas for STT and other processes.',
    ),
    features: [L('Шкала расхода', 'Flow scale'), L('Для постоянной настройки режима', 'For repeatable settings')],
    specs: [S('Тип', 'Type', 'С расходомером', 'With flowmeter'), S('Газы', 'Gases', 'Ar, CO₂, смеси', 'Ar, CO₂, mixes')],
    systems: ['concoa', 'stt'], priceFrom: 13000, priceTo: 42500, tags: ['concoa', 'flowmeter', 'расходомер', 'регулятор'],
  },
  {
    slug: 'concoa-fittings',
    category: 'concoa-regulators',
    brand: CONCOA,
    name: L('Газовые шланги и фитинги', 'Gas hoses and fittings'),
    short: L('Шланги, штуцеры и переходники для газовой линии от баллона до подающего.', 'Hoses, fittings and adapters from the cylinder to the feeder.'),
    description: L(
      'Негерметичные штуцеры — частая причина пор в шве. Подберём шланги и фитинги под вашу резьбу и газ.',
      'Leaking fittings are a common cause of porosity. We choose hoses and fittings for your thread and gas.',
    ),
    features: [L('Под вашу резьбу', 'To your thread standard'), L('Герметично', 'Leak-tight')],
    specs: [S('Назначение', 'Purpose', 'Газовая линия', 'Gas line')],
    systems: ['concoa', 'stt', 'innershield'], priceFrom: 800, priceTo: 9900, tags: ['concoa', 'fittings', 'шланг', 'фитинг', 'газ'],
  },

  /* ---------- Интерфейсы ---------- */
  {
    slug: 'stt-interface-module',
    category: 'interfaces',
    brand: LE,
    name: L('Интерфейс STT (модуль согласования)', 'STT interface module'),
    short: L('Связывает источник, подающее устройство и пульт в системе STT.', 'Links power source, feeder and remote in an STT system.'),
    description: L(
      'Интерфейсный модуль передаёт сигналы управления между узлами. При его отказе система не стартует или теряет режим. Подберём по модели источника и подающего.',
      'The interface module passes control signals between units. If it fails the system will not start or loses its settings. We match it to your power source and feeder.',
    ),
    features: [L('Подбор по модели источника', 'Matched to power source model'), L('Оригинал или аналог', 'Original or equivalent')],
    specs: [S('Процесс', 'Process', 'STT', 'STT'), PN, MADE],
    systems: ['stt'], priceFrom: 15000, priceTo: 65500, featured: true, tags: ['interface', 'интерфейс', 'stt', 'модуль'],
  },
  {
    slug: 'feeder-control-cable',
    category: 'interfaces',
    brand: LE,
    name: L('Интерфейсный кабель источник — подающее устройство', 'Power source to feeder control cable'),
    short: L('Многожильный кабель управления с разъёмами, разные длины.', 'Multi-conductor control cable with connectors, several lengths.'),
    description: L(
      'Кабель управления часто выходит из строя из-за перегибов и износа разъёмов. Поставляем кабели нужной длины под ваш источник.',
      'Control cables often fail from kinking and connector wear. We supply the length you need for your power source.',
    ),
    features: [L('Разные длины', 'Several lengths'), L('С разъёмами под вашу модель', 'Connectors for your model')],
    specs: [S('Назначение', 'Purpose', 'Управление и питание подающего', 'Control and feeder power'), PN],
    systems: ['dc400', 'innershield', 'stt'], priceFrom: 4900, priceTo: 23000, tags: ['interface', 'интерфейс', 'control cable', 'кабель управления'],
  },
  {
    slug: 'dc400-remote-interface',
    category: 'interfaces',
    brand: LE,
    name: L('Интерфейс дистанционного управления DC-400', 'DC-400 remote control interface'),
    short: L('Пульт и разъём дистанционной регулировки тока и напряжения.', 'Remote and receptacle for remote current and voltage adjustment.'),
    description: L(
      'Позволяет регулировать режим с места работы. Подберём пульт или переходник под вашу конфигурацию.',
      'Lets the operator adjust settings at the point of work. We pick a remote or adapter for your configuration.',
    ),
    features: [L('Регулировка с рабочего места', 'Adjust from the work area'), L('Подбор по конфигурации', 'Matched to your setup')],
    specs: [S('Источник', 'Power source', 'Lincoln Electric DC-400', 'Lincoln Electric DC-400'), PN],
    systems: ['dc400'], priceFrom: 5700, priceTo: 29500, tags: ['remote', 'пульт', 'interface', 'dc-400'],
  },

  /* ---------- Наконечники ---------- */
  {
    slug: 'innershield-contact-tips',
    category: 'contact-tips',
    brand: LE,
    name: L('Контактные наконечники Innershield', 'Innershield contact tips'),
    short: L('Подвод тока к проволоке: расходник, который меняют первым.', 'Delivers current to the wire — the first consumable to change.'),
    description: L(
      'Изношенный наконечник даёт нестабильную дугу и разбрызгивание. Поставляем упаковками под нужный диаметр проволоки, возможна регулярная отгрузка.',
      'A worn tip gives an unstable arc and spatter. Supplied in packs for your wire diameter, with regular shipments possible.',
    ),
    features: [L('Упаковки от 10 шт.', 'Packs from 10 pcs'), L('Под ваш диаметр проволоки', 'For your wire diameter'), L('Регулярные поставки', 'Standing orders')],
    specs: [S('Процесс', 'Process', 'FCAW-S (Innershield)', 'FCAW-S (Innershield)'), S('Диаметр проволоки', 'Wire diameter', 'Указываете в заявке', 'State in your request'), PN],
    systems: ['innershield'], priceFrom: 250, priceTo: 1200, featured: true, availability: 'stock', tags: ['innershield', 'contact tip', 'наконечник', 'контактный'],
  },
  {
    slug: 'stt-contact-tips',
    category: 'contact-tips',
    brand: LE,
    name: L('Контактные наконечники для STT', 'STT contact tips'),
    short: L('Для тонкой проволоки и точной подачи в процессе STT.', 'For thin wire and precise feeding in the STT process.'),
    description: L(
      'В STT состояние наконечника напрямую влияет на форму тока и качество корня шва. Рекомендуем держать запас.',
      'In STT the condition of the tip directly affects the waveform and root quality. We recommend keeping a spare stock.',
    ),
    features: [L('Упаковки от 10 шт.', 'Packs from 10 pcs'), L('Под тонкую проволоку', 'For thin wire')],
    specs: [S('Процесс', 'Process', 'STT', 'STT'), S('Диаметр проволоки', 'Wire diameter', 'Указываете в заявке', 'State in your request'), PN],
    systems: ['stt'], priceFrom: 250, priceTo: 1500, availability: 'stock', tags: ['stt', 'contact tip', 'наконечник'],
  },

  /* ---------- Сопла ---------- */
  {
    slug: 'innershield-nozzles',
    category: 'nozzles',
    brand: LE,
    name: L('Сопла и изоляторы Innershield', 'Innershield nozzles and insulators'),
    short: L('Защищают рукав и изолируют наконечник; бывают стандартные и удлинённые.', 'Protect the gun and insulate the tip; standard and extended lengths.'),
    description: L(
      'У самозащитной проволоки нет газа, поэтому «сопло» здесь — это изолятор и удлинитель вылета. Подбираем под длину вылета и модель пистолета.',
      'Self-shielded wire uses no gas, so the nozzle here is an insulator and stick-out extension. We match it to stick-out length and gun model.',
    ),
    features: [L('Стандартные и удлинённые', 'Standard and extended'), L('Под модель пистолета', 'For your gun model')],
    specs: [S('Процесс', 'Process', 'FCAW-S (Innershield)', 'FCAW-S (Innershield)'), PN],
    systems: ['innershield'], priceFrom: 500, priceTo: 3300, availability: 'stock', tags: ['innershield', 'nozzle', 'сопло', 'изолятор'],
  },
  {
    slug: 'stt-gas-nozzles',
    category: 'nozzles',
    brand: LE,
    name: L('Газовые сопла для STT', 'STT gas nozzles'),
    short: L('Формируют защитный газовый поток вокруг дуги.', 'Shape the shielding-gas flow around the arc.'),
    description: L(
      'От формы и чистоты сопла зависят покрытие шва газом и пористость. Меняйте при налипании брызг.',
      'Nozzle shape and cleanliness drive gas coverage and porosity. Replace when spatter builds up.',
    ),
    features: [L('Разные диаметры', 'Several bore sizes'), L('Под модель пистолета', 'For your gun model')],
    specs: [S('Процесс', 'Process', 'STT', 'STT'), PN],
    systems: ['stt'], priceFrom: 500, priceTo: 3700, availability: 'stock', tags: ['stt', 'nozzle', 'сопло', 'газовое'],
  },

  /* ---------- Запчасти для Innershield и STT ---------- */
  {
    slug: 'gun-handle-trigger',
    category: 'gun-parts',
    brand: LE,
    name: L('Рукоятки, курки и выключатели пистолета', 'Gun handles, triggers and switches'),
    short: L('Узлы управления на пистолете: меняются без замены рукава.', 'Control parts on the gun — replaced without changing the cable.'),
    description: L(
      'Сломанный курок или рукоятка не повод менять пистолет целиком. Подберём детали по модели.',
      'A broken trigger or handle is no reason to replace the whole gun. We pick the parts by model.',
    ),
    features: [L('Поштучно', 'Sold singly'), L('Подбор по модели', 'Matched by model')],
    specs: [S('Системы', 'Systems', 'Innershield, STT', 'Innershield, STT'), PN],
    systems: ['innershield', 'stt'], priceFrom: 650, priceTo: 6600, tags: ['handle', 'trigger', 'рукоятка', 'курок'],
  },
  {
    slug: 'gun-diffuser-tip-holder',
    category: 'gun-parts',
    brand: LE,
    name: L('Диффузоры и держатели наконечников', 'Diffusers and tip holders'),
    short: L('Удерживают наконечник и распределяют газ.', 'Hold the tip and distribute gas.'),
    description: L(
      'Диффузор — деталь, которую часто забывают менять вместе с наконечником. Изношенная резьба даёт плохой контакт и перегрев.',
      'The diffuser is often forgotten when changing the tip. Worn threads cause poor contact and overheating.',
    ),
    features: [L('Под тип наконечника', 'To suit your tip type'), L('Расходная часть', 'Wear item')],
    specs: [S('Системы', 'Systems', 'Innershield, STT', 'Innershield, STT'), PN],
    systems: ['innershield', 'stt'], priceFrom: 400, priceTo: 3300, availability: 'stock', tags: ['diffuser', 'tip holder', 'диффузор', 'держатель'],
  },
  {
    slug: 'feed-rolls-drive',
    category: 'gun-parts',
    brand: LE,
    name: L('Подающие и прижимные ролики', 'Drive and pressure rolls'),
    short: L('Протаскивают проволоку по рукаву; важны для порошковой и тонкой проволоки.', 'Pull the wire through the cable; critical for flux-cored and thin wire.'),
    description: L(
      'Профиль ролика зависит от типа проволоки: порошковая требует рифлёного, тонкая — гладкого. Подскажем при заказе.',
      'Roll profile depends on the wire: flux-cored needs knurled, thin wire needs smooth. We will advise when you order.',
    ),
    features: [L('Под тип и диаметр проволоки', 'For wire type and diameter'), L('Парами и комплектами', 'Pairs and sets')],
    specs: [S('Системы', 'Systems', 'Innershield, STT', 'Innershield, STT'), PN],
    systems: ['innershield', 'stt'], priceFrom: 1000, priceTo: 7400, tags: ['feed roll', 'drive roll', 'ролики', 'подающие'],
  },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
