# Anna's Fundraiser Site — Design Spec

Date: 2026-09-07

## Purpose

Rebuild the existing Tilda mobile-only fundraiser page (https://heelpanna.tilda.ws/) as a
Next.js site with real code, preserving content and structure, adding a desktop-safe
"mobile frame centered" layout, and a donation flow modeled on
https://aminahelp.kz/ (`/pay?amount=N` + `/requisites`) that is ready to be wired to a
custom Kaspi payment API ("API PAY") the user will provide after deploy.

The cause: Anna runs an informal animal shelter in Kazakhstan. Her house and cat shelter
burned down (arson, twice). She's raising 7,000,000 tenge to buy fencing/enclosures/
utilities on a 5-hectare plot to rebuild the shelter properly.

## Content Source of Truth

Reference screenshots captured during research live in `docs/reference/`:
- `docs/reference/tilda/` — full scroll-through of the source site (mobile emulated,
  390x844 viewport), files `scroll_0.png` through `scroll_7.png`, plus `tilda_full.png`
  (full-page capture).
- `docs/reference/aminahelp/` — payment flow reference (`ref_pay.png`,
  `ref_kaspi_redirect.png`, `ref_requisites.png`).

Full page copy (Russian), section by section, top to bottom:

### 1. Hero
- Photo: Anna standing in front of the burned house.
- Headline: "ПОДОЖГЛИ МОЙ ДОМ" (orange) / "СГОРЕЛО 13 ЖИВОТНЫХ" (white)
- Subtext: "Впереди зима – без тёплого дома другие животные могут погибнуть от холода"
- Progress card: "СОБРАНО: 838 394₸" (top-right date "26.08.2026"), "ЦЕЛЬ: 7 000 000₸",
  progress bar, caption "Каждый человек может повлиять чтобы эта шкала заполнилась. Это
  шансы на жизнь питомцев"
- Quick-amount pills: 3000₸ / 5000₸ / 10 000₸
- CTA button: "ПОМОЧЬ ЧЕРЕЗ KASPI ♥"

### 2. Обо мне
- Photo: Anna in pink cap with a black dog.
- Blue card "КОГДА-ТО ВСЁ НАЧАЛОСЬ...": "с бездомных кошек. Я просто не могла пройти
  мимо голодного, больного или брошенного животного. Потом в моей жизни появились и
  собаки. Так шаг за шагом спасение животных стало не просто частью моей жизни — оно
  стало самой жизнью."
- Photo: Anna in beanie holding a puppy, vet clinic backdrop.
- White card "ЗА ЭТИ ГОДЫ УДАЛОСЬ НАЙТИ...": "дом более чем 500 кошкам и собакам. Было
  стерилизовано более 350 животных. Сегодня под моей опекой находятся 54 кошки, 56 собак
  и ещё 11 собак на передержках. Многие из них пережили жестокость людей, голод, болезни
  и предательство. У каждого своя непростая история, но каждый из них заслуживает
  счастливой жизни."

### 3. Новость о пожаре
- Embedded video 1 (news clip): overlay text "У волонтера Анны / Сгорел дом",
  watermark `@dom_perederzhka`. File: `vid-20260730-wa0315_.mp4`
  (`https://static.tildacdn.pro/vide6263-6337-4666-a632-356238386331/vid-20260730-wa0315_.mp4`)
- Orange card "К СОЖАЛЕНИЮ, НАША ЖИЗНЬ...": "изменилась после страшного пожара. Сгорел
  мой дом и домик для кошек, который мы своими руками оборудовали и утеплили на чердаке
  с отдельным выходом на улицу. Мы потеряли не просто стены — мы потеряли место, где
  животные были в безопасности.\n\nВпереди зима. Без тёплого дома животным будет очень
  тяжело пережить морозы. Несмотря на всё это, я не перестала спасать. Потому что не могу
  иначе. Каждый день появляются новые животные, которым нужна помощь."
- Photo: Anna in front of the burned brick wall (close-up).
- Card "СЕЙЧАС НАМ ЖИЗНЕННО НЕОБХОДИМА...": "поддержка, чтобы восстановить дом для нас и
  наших животных, а также построить вольеры для собак. Это позволит принять больше
  спасённых животных и уберечь их от отлова, где для многих бездомных собак всё
  заканчивается гибелью.\n\nСпасибо каждому, кто рядом, кто помогает, поддерживает,
  делает репосты, переводит любую посильную сумму или просто не остаётся равнодушным.
  Именно благодаря вам у этих животных появляется надежда."

### 4. Новый приют
- Section heading "НОВЫЙ ПРИЮТ" with paw-print decoration.
- Photo: sunset over an empty field (the new plot).
- Embedded video 2: `4-video_wG446RF1.mp4`
  (`https://static.tildacdn.pro/vide3931-3438-4631-a339-343338306161/4-video_wG446RF1.mp4`)
- Blue card "МЫ НАЧИНАЕМ ВСЁ С НУЛЯ. НАМ НУЖНА ВАША ПОМОЩЬ ❤️": "Нас дважды поджигали.
  Наших собак и кошек травили. Соседи жаловались в акимат и просили вызвать отлов, убить
  собак.\n\nМы поняли, что больше не можем оставаться там, где каждый день существует
  угроза для животных. Поэтому приняли очень тяжёлое решение — взяли в рассрочку землю в
  чистом поле площадью 5 гектаров и начали всё заново.\n\nТеперь у нас есть земля. Но
  пока это просто пустое поле."
- White card "НАМ НУЖНО ПОСТРОИТЬ НАСТОЯЩИЙ ПРИЮТ, ГДЕ СПАСЁННЫЕ ЖИВОТНЫЕ БУДУТ В
  БЕЗОПАСНОСТИ:" — bullet list (with emoji icons):
  - 🐕 установить крепкие заборы;
  - 🐕 построить просторные вольеры;
  - 🐕 сделать отдельные зоны для выгула;
  - 💡 провести электричество на участок;
  - 💧 пробурить скважину и провести воду;
  - 🏠 оборудовать необходимые помещения;
  - ❄️ установить холодильники для хранения кормов и необходимых препаратов.

  "На всё это нам необходимо собрать **7 000 000 тенге**"
- Orange card (continues): "Это возможность спасать новых собак с улиц, забирать
  животных из отлова, лечить их и давать им шанс на жизнь.\n\nМы не смогли закрыть глаза
  на тех, кому больше некому помочь. И сейчас мы снова просим помощи — уже для создания
  места, которое станет для них настоящим домом и безопасностью.\n\n🙏 Помогите нам
  построить приют.\n\nДаже небольшое пожертвование имеет значение.\n1000, 2000, 5000
  тенге — каждая сумма приближает нас к цели.\n\nНам нужно собрать 7 000 000 ₸. Давайте
  вместе построим место, где больше не будут бояться, травить и убивать. Где спасённые
  животные получат шанс на новую жизнь. ❤️🐾"

### 5. На что нужны средства
- Section heading "НА ЧТО НУЖНЫ СРЕДСТВА".
- Blue card "СБОР НА ВОССТАНОВЛЕНИЕ ДОМА И ПРИЮТА ПОСЛЕ ПОЖАРА": "Общая сумма сбора —
  **7 000 000 тенге**.\n\nСредства необходимы на:\n• восстановление жилого дома, так как
  после пожара нам негде жить, и сейчас мы вынуждены жить в неотапливаемой летней кухне
  без света и тепла\n• строительство тёплого помещения для кошек, чтобы они не замерзли
  зимой;\n• строительство вольеров для спасенных собак и щенков, которых мы забрали с
  улиц и из отлова;\n• приобретение строительных материалов и проведение основных
  строительных работ.\n\nКаждый вклад, независимо от суммы, приближает нас к
  восстановлению дома и созданию безопасных условий для животных.\n\nСпасибо всем, кто
  помогает нам начать жизнь заново."

### 6. Контакты и реквизиты
- Section heading "НАШИ КОНТАКТЫ И РЕКВИЗИТЫ".
- Card: "Контакт ответственный" / "АННА", buttons: WhatsApp `87071065131`, Instagram
  `@pom_jivotnim._rezerv`.
- Bold line: "ЗАЩИТА ОТ МОШЕННИКОВ: ВИДЕОЗВОНОК, ДОКУМЕНТЫ, ГЕОЛОКАЦИЯ – ВСЁ ОТКРЫТО.
  ОТВЕЧАЕМ 24/7"
- Orange card: "МЫ ПОНИМАЕМ ВАШИ СОМНЕНИЯ, ПОЭТОМУ НЕ ПРЯЧЕМСЯ – ЗВОНИТЕ, ПИШИТЕ,
  ВЫХОДИТЕ НА СВЯЗЬ ПО ВИДЕО, СМОТРИТЕ ДОКУМЕНТЫ. КАЖДЫЙ ПЕРЕВОД – ЭТО ШАНС НА ЖИЗНЬ
  ПИТОМЦЕВ."
- Requisites rows (each with a copy icon): `Halyk: 4003035152865437`,
  `BEREKE МИР: 4402560017926014`, `Телефон: 87071065131`.
- Final CTA: "ПОМОЧЬ ЧЕРЕЗ KASPI ♥"

## Payment Flow (modeled on aminahelp.kz)

Studied live at https://aminahelp.kz/pay?amount=5000 and
https://aminahelp.kz/requisites:

- `/pay?amount=N`: card with recipient photo/name/description, a 2x2 grid of preset
  amounts + a custom-amount input, and a primary button "Помочь на N ₸". On the
  reference site this button calls their backend, which returns a
  `https://pay.kaspi.kz/pay/<token>` link (an official Kaspi one-time payment link), and
  the browser is redirected there. Below the button: "Нет Kaspi? Перевести по
  реквизитам" linking to `/requisites`.
- `/requisites`: card number, phone (Kaspi bank), recipient name, bank name, each with a
  one-tap copy button. (The reference site also shows a supporting-documents carousel;
  we skip that — no equivalent documents were provided for this project.)

For this project, the token-generating backend ("API PAY") does not exist yet — the user
will provide it after deploy. Until then `/pay` must still work end-to-end for visitors:
the amount picker and UI are fully real, but the final "generate Kaspi link" call is
stubbed behind a single function so swapping in the real API later doesn't touch any UI
code.

## Architecture

- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Hosting:** Vercel.
- **Routes:**
  - `/` — the fundraiser landing page (all 6 sections above).
  - `/pay` — reads `?amount=` search param, lets the visitor confirm/change the amount,
    triggers the pay-link flow.
  - `/requisites` — bank details with copy-to-clipboard.
- **Layout:** a root layout renders a centered column, `max-width: 430px` (matches the
  original mobile design width), on a full-bleed background that matches whatever
  section is behind it. On viewports wider than the column, the page background fills
  the remaining space; the column itself never grows past mobile width. This is the
  "mobile mockup centered on any screen" pattern the user asked for.
- **Content:** all copy from the section above lives in one typed data file,
  `content/site.ts` (headings, paragraphs, stats, needs list, contact info, requisites,
  media file names). Components read from it — no copy hardcoded in JSX.
- **Media:** hero/story photos and the two video clips are downloaded from the Tilda CDN
  into `public/images/` and `public/videos/`. Source assets identified on the live page
  (`https://heelpanna.tilda.ws/`):
  - Photos (served via `optim.tildacdn.pro` with `/-/resize/` or `/-/cover/` params —
    strip those params or request a larger width to get full resolution):
    `tild3335-3064-4132-a539-323634393161/3.png` (Anna in front of burned house, hero),
    `tild3635-3564-4737-b039-633337393431/photo.png` (Anna in pink cap with black dog),
    `tild3266-6565-4065-a261-316439656638/_0_1.png` (Anna with puppy at vet clinic),
    `tild6130-3936-4264-b230-663833303332/ed.png` (sunset over empty field),
    `tild3035-6634-4664-b162-343961323966/magnific_img1_s7geFS.png` (close-up at burned
    wall), `tild3037-3163-4937-a633-626530636639/32.png`,
    `tild3564-3062-4934-a231-393365366338/IMG-20260730-WA0187.jpg`.
  - Videos (full quality, `static.tildacdn.pro`):
    `vide6263-6337-4666-a632-356238386331/vid-20260730-wa0315_.mp4` (news clip about the
    fire), `vide3931-3438-4631-a339-343338306161/4-video_wG446RF1.mp4` (second clip, new
    plot).
  - If any of these don't resolve at full quality, re-scrape the live site rather than
    guessing — Tilda's asset hashes are opaque and not guessable.
- **Payment integration seam:** `lib/payment.ts` exports
  `createKaspiPayLink(amountTenge: number): Promise<string | null>`. Current
  implementation is a stub that returns `null` (not configured). The `/pay` page calls
  it; if it returns `null`, the UI falls back to prominently showing the
  "Перевести по реквизитам" link instead of erroring. Once the user provides the real
  API PAY, only this one function's body changes.

## Components (rough breakdown)

- `Hero` — photo, headline, progress card, quick-amount pills, CTA.
- `StoryCard` — reusable colored card (blue/orange/white variants) with heading + body
  paragraphs, used across "Обо мне", the fire news section, "Новый приют", and "На что
  нужны средства".
- `NeedsList` — bulleted list with emoji icons.
- `ContactsSection` — WhatsApp/Instagram buttons, anti-fraud note, requisites rows,
  final CTA.
- `CopyField` — label + value + copy-to-clipboard button, used on `/requisites` and in
  `ContactsSection`.
- `AmountPicker` — the 2x2 preset grid + custom input, used on `/pay`.
- `MobileFrame` — the centered max-width layout wrapper used in the root layout.

## Error Handling

- `createKaspiPayLink` stub: never throws to the UI — returns `null` on "not
  configured", and the `/pay` page handles that by showing the requisites fallback link
  instead of a broken button.
- Copy-to-clipboard: if `navigator.clipboard` is unavailable, fall back to a
  `document.execCommand('copy')` shim or just visibly select the text — no hard failure.
- No forms submit user data anywhere in this phase (no backend/database), so there's no
  server-side validation surface yet.

## Testing

Content site, no business logic worth unit testing. Verification is manual:
- `next build` for type/compile correctness.
- Visual check in browser at mobile width (~390px) and at a wide desktop width to
  confirm the centered-frame layout holds.
- Click through `/pay` (all preset amounts + custom amount) and `/requisites` (copy
  buttons) to confirm the stubbed flow behaves sensibly with no real API behind it.

## Out of Scope (for this phase)

- The real Kaspi payment-link API integration (user will provide after deploy).
- A CMS or admin UI for editing content — content is edited by hand in
  `content/site.ts`.
- Desktop-specific redesign — desktop just centers the mobile layout, per user's
  explicit choice.
- Automated tests.
