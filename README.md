# $PUMPFONE — pumpfone.wtf

Статический одностраничник под мемкоин **$PUMPFONE** (капсула, которая не может оторваться от телефона).
Концепция: инструкция по применению из аптечной пачки + интерактивный блистер.

## Как запустить локально
Открыть `index.html` в браузере, либо: `python3 -m http.server` в этой папке → http://localhost:8000

## Как задеплоить
GitHub (загрузить эти файлы в репозиторий) → Vercel → Import Git Repository → Deploy.
Сборка не нужна, это чистая статика (framework preset: Other).

## Что вписать при запуске токена
Всё в начале `script.js`, объект `CONFIG`:
- `CA` — контракт (включает копирование адреса и live-статы с DexScreener)
- `CHART_URL`, `BUY_URL`, `X_URL`, `TELEGRAM_URL` — ссылки кнопок (пустые = тост "coming soon")

Также в `index.html` заменить относительные `og:image` / `twitter:image` на абсолютный URL после деплоя.

## Файлы
- `index.html` — разметка и все тексты
- `style.css` — стили
- `script.js` — CONFIG, летающие таблетки (canvas), блистер, статы, звук
- `assets/mascot-pumpfone.png` — маскот с вырезанным фоном
- `assets/mascot-pumpfone.jpg` — исходник от Олега
