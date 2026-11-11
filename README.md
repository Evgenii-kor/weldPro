# WeldPro — запчасти Lincoln Electric (DC-400, Innershield, STT) и редукторы Concoa (Angular 22 + SSR)

## Запуск
    npm install
    npm start                                      # разработка, http://localhost:4200
    npm run build && npm run serve:ssr:weld-shop   # прод, порт 4000

## Что заменить перед запуском
- `src/app/core/site.config.ts` — название, домен, телефон, мессенджеры, адрес
- `src/app/data/catalog.ts` — товары, описания, характеристики, ценовые диапазоны (сейчас ЗАГЛУШКИ, заменить реальными данными)
- `src/app/ui/product-visual.ts` — векторные заглушки вместо фото
- `angular.json` → `security.allowedHosts` и переменная `ALLOWED_HOSTS` — боевой домен

## Переменные окружения сервера
SITE_URL, ALLOWED_HOSTS, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, LEAD_WEBHOOK_URL, LEADS_DIR, PORT.
Заявки пишутся в `data/leads.jsonl` и уходят менеджеру в Telegram или вебхук.

## Запуск с настройками (Telegram и т. д.)
    cp .env.example .env     # заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
    npm run build && npm run start:prod
Chat ID: напишите боту любое сообщение, затем откройте
`https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найдите `"chat":{"id":...}`.
