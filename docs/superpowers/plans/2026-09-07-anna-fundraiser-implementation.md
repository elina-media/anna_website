# Anna's Fundraiser Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild https://heelpanna.tilda.ws/ as a Next.js + TypeScript + Tailwind site with the same content, a mobile-frame-on-any-screen layout, and a `/pay` + `/requisites` donation flow modeled on aminahelp.kz, ready to be wired to a real Kaspi payment API later.

**Architecture:** Single Next.js App Router project. All copy lives in one typed data module (`content/site.ts`); presentational components read from it. Payment-link generation is isolated behind one function (`lib/payment.ts`) so the eventual real API integration touches nothing else. See `docs/superpowers/specs/2026-09-07-anna-fundraiser-design.md` for the full approved design and source content.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS v4 (CSS-first `@theme` config), Vitest + jsdom (unit tests for `lib/` and `content/` only — no component testing framework, per spec).

## Global Constraints

- All visible UI copy is Russian text copied verbatim from `docs/superpowers/specs/2026-09-07-anna-fundraiser-design.md` — do not paraphrase or "improve" wording.
- Every page's content lives inside `<MobileFrame>`: a centered column, `max-width: 430px`, matching the source site's mobile-only design. Desktop just centers this column — no separate desktop layout.
- No copy, amounts, or contact details are hardcoded directly in JSX — everything comes from `content/site.ts`.
- `lib/payment.ts`'s `createKaspiPayLink` is a stub that always resolves to `null` in this phase. Never call a real network endpoint from it.
- Automated tests are Vitest unit tests for pure functions in `lib/` and a sanity test for `content/site.ts` only. Components/pages are verified manually via `npm run dev` in a browser — do not add React Testing Library or similar.
- Media files referenced below are the only ones needed; do not invent or guess additional asset URLs (see Task 3).

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create (via `create-next-app`, moved to repo root): `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `public/`, `.gitignore`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: an installed Next.js + TypeScript + Tailwind v4 project at the repo root, plus Vitest wired up via `npm test`, that later tasks build on.

- [ ] **Step 1: Scaffold into a temp subdirectory (repo root already has `.git` and `docs/`, so we can't run `create-next-app` directly on `.`)**

```bash
npx --yes create-next-app@latest _scaffold_tmp \
  --typescript --eslint --tailwind --app \
  --src-dir=false --import-alias "@/*" \
  --use-npm --turbopack --yes
```

- [ ] **Step 2: Move the scaffolded files into the repo root, without its nested `.git`**

```bash
rm -rf _scaffold_tmp/.git
mv _scaffold_tmp/* _scaffold_tmp/.gitignore .
rmdir _scaffold_tmp
ls
```

Expected: `package.json`, `app/`, `public/`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `node_modules/` all now at repo root, alongside the existing `docs/`.

- [ ] **Step 3: Verify the scaffold builds**

Run: `npm run build`
Expected: build completes with `✓ Compiled successfully` and no errors.

- [ ] **Step 4: Add Vitest + jsdom for the `lib/`-level unit tests used starting Task 4**

```bash
npm install -D vitest jsdom
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
```

- [ ] **Step 5: Add a `test` script**

Edit `package.json`, inside `"scripts"`, add:

```json
"test": "vitest run"
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js + TypeScript + Tailwind project with Vitest"
```

---

### Task 2: Brand theme, fonts, and the mobile-frame layout

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `components/MobileFrame.tsx`

**Interfaces:**
- Produces: `MobileFrame({ children }: { children: React.ReactNode })` — wraps any page content in the centered mobile column. Every page (Task 11 onward) renders inside this via the root layout, so page components themselves never re-wrap in it.
- Produces: Tailwind utility classes `bg-brand-blue`, `bg-brand-orange`, `bg-brand-cream`, `text-brand-blue`, `font-heading`, `font-body`, available globally from the `@theme` block in `app/globals.css`.

- [ ] **Step 1: Add brand color and font tokens to `app/globals.css`**

Open `app/globals.css`. It starts with `@import "tailwindcss";` (from the Tailwind v4 scaffold). Right after that import, add:

```css
@theme {
  --color-brand-blue: #15328f;
  --color-brand-orange: #f2833c;
  --color-brand-cream: #f6efda;
  --font-heading: var(--font-oswald);
  --font-body: var(--font-nunito);
}

body {
  background-color: #d9d9d9;
}
```

(The `#d9d9d9` outer body color is the neutral backdrop visible on wide screens around the centered mobile column — not a content color, just what shows outside the frame.)

- [ ] **Step 2: Create `components/MobileFrame.tsx`**

```tsx
export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-brand-cream shadow-2xl">
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Wire fonts and `MobileFrame` into `app/layout.tsx`**

Replace the contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next';
import { Oswald, Nunito } from 'next/font/google';
import './globals.css';
import { MobileFrame } from '@/components/MobileFrame';

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700'],
  variable: '--font-oswald',
});

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Анна — сбор на восстановление приюта для животных',
  description:
    'Благотворительный сбор на восстановление дома и приюта для животных после пожара.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${oswald.variable} ${nunito.variable} font-body`}>
        <MobileFrame>{children}</MobileFrame>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: the default scaffold page renders inside a narrow (430px) cream-colored column, centered on the page, with gray showing on either side at a wide window width. Resize the browser window narrower than 430px — the column should fill the width edge-to-edge with no gray visible.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add brand theme tokens, fonts, and centered mobile-frame layout"
```

---

### Task 3: Download and verify media assets

**Files:**
- Create: `public/images/hero-burned-house.jpg`, `public/images/anna-pink-cap-dog.jpg`, `public/images/anna-puppy-vetclinic.jpg`, `public/videos/fire-news-clip.mp4`, `public/videos/new-shelter-clip.mp4`

**Interfaces:**
- Produces: the exact five media file paths under `public/` that `content/site.ts` (Task 7) references by path.

These five URLs were already fetched and their content visually confirmed during design (see the design spec's Media Assets note) — no further asset hunting is needed, just download them to the right paths with the right names.

- [ ] **Step 1: Create the target directories**

```bash
mkdir -p public/images public/videos
```

- [ ] **Step 2: Download all five files**

```bash
UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"

curl -sL -A "$UA" -o public/images/hero-burned-house.jpg \
  "https://static.tildacdn.pro/tild3035-6634-4664-b162-343961323966/magnific_img1_s7geFS.png"

curl -sL -A "$UA" -o public/images/anna-pink-cap-dog.jpg \
  "https://static.tildacdn.pro/tild3564-3062-4934-a231-393365366338/IMG-20260730-WA0187.jpg"

curl -sL -A "$UA" -o public/images/anna-puppy-vetclinic.jpg \
  "https://static.tildacdn.pro/tild3037-3163-4937-a633-626530636639/32.png"

curl -sL -A "$UA" -o public/videos/fire-news-clip.mp4 \
  "https://static.tildacdn.pro/vide6263-6337-4666-a632-356238386331/vid-20260730-wa0315_.mp4"

curl -sL -A "$UA" -o public/videos/new-shelter-clip.mp4 \
  "https://static.tildacdn.pro/vide3931-3438-4631-a339-343338306161/4-video_wG446RF1.mp4"
```

Note: the first three are saved with a `.jpg` extension for consistency even though two of the source URLs end in `.png` — the bytes are actually JPEG/PNG as fetched; the browser and `next/image` both sniff content by data, not extension, so this is safe. If you'd rather keep accurate extensions, name them `.png` instead — just make sure `content/site.ts` in Task 7 uses the same paths you chose here.

- [ ] **Step 3: Verify all five files downloaded correctly**

```bash
file public/images/*.jpg public/videos/*.mp4
```

Expected output (sizes/format, not exact bytes):
```
public/images/hero-burned-house.jpg:      PNG image data, 1024 x 1024, ...
public/images/anna-pink-cap-dog.jpg:      JPEG image data, ... 1080x1379 ...
public/images/anna-puppy-vetclinic.jpg:   PNG image data, 738 x 738, ...
public/videos/fire-news-clip.mp4:         ISO Media, MP4 Base Media v1 ...
public/videos/new-shelter-clip.mp4:       ISO Media, MP4 Base Media v1 ...
```

If any command instead downloaded an HTML error page (check with `file`, it'll say something like "HTML document" instead of image/video), the CDN URL has changed — re-scrape `https://heelpanna.tilda.ws/` (mobile user agent) for the current asset hash rather than guessing a new one.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add fundraiser photos and videos downloaded from the source site"
```

---

### Task 4: `lib/format.ts` — tenge amount formatting

**Files:**
- Create: `lib/format.ts`
- Test: `lib/format.test.ts`

**Interfaces:**
- Produces: `formatTenge(amount: number): string` — used by `Hero` (Task 10), `PayForm` (Task 14), `content/site.ts` is NOT responsible for formatting (it stores raw numbers).

- [ ] **Step 1: Write the failing test**

Create `lib/format.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatTenge } from './format';

describe('formatTenge', () => {
  it('groups thousands with a space', () => {
    expect(formatTenge(838394)).toBe('838 394');
    expect(formatTenge(7000000)).toBe('7 000 000');
    expect(formatTenge(5000)).toBe('5 000');
  });

  it('leaves numbers under 1000 unchanged', () => {
    expect(formatTenge(100)).toBe('100');
    expect(formatTenge(0)).toBe('0');
  });

  it('rounds non-integer amounts before formatting', () => {
    expect(formatTenge(1999.6)).toBe('2 000');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/format.test.ts`
Expected: FAIL — `Cannot find module './format'` (the file doesn't exist yet).

- [ ] **Step 3: Implement `lib/format.ts`**

```ts
export function formatTenge(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/format.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/format.ts lib/format.test.ts
git commit -m "Add formatTenge helper for displaying donation amounts"
```

---

### Task 5: `lib/clipboard.ts` — copy-to-clipboard with fallback

**Files:**
- Create: `lib/clipboard.ts`
- Test: `lib/clipboard.test.ts`

**Interfaces:**
- Produces: `copyToClipboard(text: string): Promise<boolean>` — used by `CopyField` (Task 8).

- [ ] **Step 1: Write the failing test**

Create `lib/clipboard.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { copyToClipboard } from './clipboard';

afterEach(() => {
  vi.unstubAllGlobals();
  // @ts-expect-error -- restoring a possibly-deleted property between tests
  delete navigator.clipboard;
});

describe('copyToClipboard', () => {
  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const result = await copyToClipboard('hello');

    expect(writeText).toHaveBeenCalledWith('hello');
    expect(result).toBe(true);
  });

  it('falls back to document.execCommand when the Clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    const result = await copyToClipboard('fallback text');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(result).toBe(true);
  });

  it('returns false when the fallback also fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(false);

    const result = await copyToClipboard('nope');

    expect(result).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/clipboard.test.ts`
Expected: FAIL — `Cannot find module './clipboard'`.

- [ ] **Step 3: Implement `lib/clipboard.ts`**

```ts
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Some browsers expose the API but reject without user activation —
      // fall through to the legacy textarea approach below.
    }
  }

  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch {
    succeeded = false;
  }
  document.body.removeChild(textarea);
  return succeeded;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/clipboard.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/clipboard.ts lib/clipboard.test.ts
git commit -m "Add copyToClipboard helper with legacy fallback"
```

---

### Task 6: `lib/payment.ts` — Kaspi pay-link stub

**Files:**
- Create: `lib/payment.ts`
- Test: `lib/payment.test.ts`

**Interfaces:**
- Produces: `createKaspiPayLink(amountTenge: number): Promise<string | null>` — used by `PayForm` (Task 14). Always resolves `null` in this phase (not configured); throws `RangeError` for a non-positive or non-integer amount.

- [ ] **Step 1: Write the failing test**

Create `lib/payment.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { createKaspiPayLink } from './payment';

describe('createKaspiPayLink', () => {
  it('resolves to null because the real Kaspi API is not configured yet', async () => {
    await expect(createKaspiPayLink(5000)).resolves.toBeNull();
  });

  it('rejects non-positive amounts', async () => {
    await expect(createKaspiPayLink(0)).rejects.toThrow(RangeError);
    await expect(createKaspiPayLink(-100)).rejects.toThrow(RangeError);
  });

  it('rejects non-integer amounts', async () => {
    await expect(createKaspiPayLink(1500.5)).rejects.toThrow(RangeError);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/payment.test.ts`
Expected: FAIL — `Cannot find module './payment'`.

- [ ] **Step 3: Implement `lib/payment.ts`**

```ts
/**
 * Generates a one-time Kaspi payment link for the given amount.
 *
 * Not implemented yet: the real integration (Kaspi's payment-link API,
 * "API PAY") will be wired in here once available. Until then this always
 * resolves to `null`, and callers must fall back to showing bank requisites
 * instead (see components/PayForm.tsx).
 */
export async function createKaspiPayLink(
  amountTenge: number
): Promise<string | null> {
  if (!Number.isInteger(amountTenge) || amountTenge <= 0) {
    throw new RangeError('amountTenge must be a positive integer');
  }

  return null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/payment.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/payment.ts lib/payment.test.ts
git commit -m "Add createKaspiPayLink stub as the future payment API integration seam"
```

---

### Task 7: `content/site.ts` — all site copy

**Files:**
- Create: `content/site.ts`
- Test: `content/site.test.ts`

**Interfaces:**
- Consumes: nothing (pure data module).
- Produces: `siteContent` (typed const, structure below) and the exported types `StoryCardVariant`, `StoryCardData`, `NeedItem`, `RequisiteRow`. Every component from Task 8 onward reads from `siteContent`.

This is the full text content from the design spec, structured as data. Copy it exactly — do not paraphrase.

- [ ] **Step 1: Write the failing sanity test**

Create `content/site.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { siteContent } from './site';

describe('siteContent', () => {
  it('has hero copy and a positive fundraising goal', () => {
    expect(siteContent.hero.headline).toBeTruthy();
    expect(siteContent.hero.goalTenge).toBeGreaterThan(0);
    expect(siteContent.hero.raisedTenge).toBeGreaterThanOrEqual(0);
  });

  it('has at least one requisite row shared by contacts and the requisites page', () => {
    expect(siteContent.contacts.requisites.length).toBeGreaterThan(0);
    expect(siteContent.requisitesPage.rows).toBe(siteContent.contacts.requisites);
  });

  it('has needs list entries for the new shelter section', () => {
    expect(siteContent.newShelter.needs.length).toBeGreaterThan(0);
  });

  it('has at least one preset donation amount for the pay page', () => {
    expect(siteContent.pay.presetAmounts.length).toBeGreaterThan(0);
    expect(siteContent.pay.defaultAmount).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run content/site.test.ts`
Expected: FAIL — `Cannot find module './site'`.

- [ ] **Step 3: Implement `content/site.ts`**

```ts
export type StoryCardVariant = 'blue' | 'orange' | 'white';

export interface StoryCardData {
  variant: StoryCardVariant;
  heading?: string;
  paragraphs: string[];
}

export interface NeedItem {
  icon: string;
  text: string;
}

export interface RequisiteRow {
  label: string;
  value: string;
}

const requisites: RequisiteRow[] = [
  { label: 'Halyk', value: '4003035152865437' },
  { label: 'BEREKE МИР', value: '4402560017926014' },
  { label: 'Телефон', value: '87071065131' },
];

export const siteContent = {
  hero: {
    photo: '/images/hero-burned-house.jpg',
    kicker: 'ПОДОЖГЛИ МОЙ ДОМ',
    headline: 'СГОРЕЛО 13 ЖИВОТНЫХ',
    subtext:
      'Впереди зима – без тёплого дома другие животные могут погибнуть от холода',
    raisedTenge: 838394,
    goalTenge: 7000000,
    date: '26.08.2026',
    progressCaption:
      'Каждый человек может повлиять чтобы эта шкала заполнилась. Это шансы на жизнь питомцев',
    quickAmounts: [3000, 5000, 10000],
    ctaLabel: 'ПОМОЧЬ ЧЕРЕЗ KASPI',
  },

  about: {
    photo1: '/images/anna-pink-cap-dog.jpg',
    card1: {
      variant: 'blue',
      heading: 'КОГДА-ТО ВСЁ НАЧАЛОСЬ...',
      paragraphs: [
        'с бездомных кошек. Я просто не могла пройти мимо голодного, больного или брошенного животного. Потом в моей жизни появились и собаки. Так шаг за шагом спасение животных стало не просто частью моей жизни — оно стало самой жизнью.',
      ],
    } satisfies StoryCardData,
    photo2: '/images/anna-puppy-vetclinic.jpg',
    card2: {
      variant: 'white',
      heading: 'ЗА ЭТИ ГОДЫ УДАЛОСЬ НАЙТИ...',
      paragraphs: [
        'дом более чем 500 кошкам и собакам. Было стерилизовано более 350 животных. Сегодня под моей опекой находятся 54 кошки, 56 собак и ещё 11 собак на передержках. Многие из них пережили жестокость людей, голод, болезни и предательство. У каждого своя непростая история, но каждый из них заслуживает счастливой жизни.',
      ],
    } satisfies StoryCardData,
  },

  fireNews: {
    video: '/videos/fire-news-clip.mp4',
    card1: {
      variant: 'orange',
      heading: 'К СОЖАЛЕНИЮ, НАША ЖИЗНЬ...',
      paragraphs: [
        'изменилась после страшного пожара. Сгорел мой дом и домик для кошек, который мы своими руками оборудовали и утеплили на чердаке с отдельным выходом на улицу. Мы потеряли не просто стены — мы потеряли место, где животные были в безопасности.',
        'Впереди зима. Без тёплого дома животным будет очень тяжело пережить морозы. Несмотря на всё это, я не перестала спасать. Потому что не могу иначе. Каждый день появляются новые животные, которым нужна помощь.',
      ],
    } satisfies StoryCardData,
    photo: '/images/hero-burned-house.jpg',
    card2: {
      variant: 'blue',
      heading: 'СЕЙЧАС НАМ ЖИЗНЕННО НЕОБХОДИМА...',
      paragraphs: [
        'поддержка, чтобы восстановить дом для нас и наших животных, а также построить вольеры для собак. Это позволит принять больше спасённых животных и уберечь их от отлова, где для многих бездомных собак всё заканчивается гибелью.',
        'Спасибо каждому, кто рядом, кто помогает, поддерживает, делает репосты, переводит любую посильную сумму или просто не остаётся равнодушным. Именно благодаря вам у этих животных появляется надежда.',
      ],
    } satisfies StoryCardData,
  },

  newShelter: {
    heading: 'НОВЫЙ ПРИЮТ',
    video: '/videos/new-shelter-clip.mp4',
    card1: {
      variant: 'blue',
      heading: 'МЫ НАЧИНАЕМ ВСЁ С НУЛЯ. НАМ НУЖНА ВАША ПОМОЩЬ ❤️',
      paragraphs: [
        'Нас дважды поджигали. Наших собак и кошек травили. Соседи жаловались в акимат и просили вызвать отлов, убить собак.',
        'Мы поняли, что больше не можем оставаться там, где каждый день существует угроза для животных. Поэтому приняли очень тяжёлое решение — взяли в рассрочку землю в чистом поле площадью 5 гектаров и начали всё заново.',
        'Теперь у нас есть земля. Но пока это просто пустое поле.',
      ],
    } satisfies StoryCardData,
    needsHeading:
      'НАМ НУЖНО ПОСТРОИТЬ НАСТОЯЩИЙ ПРИЮТ, ГДЕ СПАСЁННЫЕ ЖИВОТНЫЕ БУДУТ В БЕЗОПАСНОСТИ:',
    needs: [
      { icon: '🐕', text: 'установить крепкие заборы;' },
      { icon: '🐕', text: 'построить просторные вольеры;' },
      { icon: '🐕', text: 'сделать отдельные зоны для выгула;' },
      { icon: '💡', text: 'провести электричество на участок;' },
      { icon: '💧', text: 'пробурить скважину и провести воду;' },
      { icon: '🏠', text: 'оборудовать необходимые помещения;' },
      {
        icon: '❄️',
        text: 'установить холодильники для хранения кормов и необходимых препаратов.',
      },
    ] as NeedItem[],
    needsGoalText: 'На всё это нам необходимо собрать 7 000 000 тенге',
    card2: {
      variant: 'orange',
      paragraphs: [
        'Это возможность спасать новых собак с улиц, забирать животных из отлова, лечить их и давать им шанс на жизнь.',
        'Мы не смогли закрыть глаза на тех, кому больше некому помочь. И сейчас мы снова просим помощи — уже для создания места, которое станет для них настоящим домом и безопасностью.',
        '🙏 Помогите нам построить приют.',
        'Даже небольшое пожертвование имеет значение.\n1000, 2000, 5000 тенге — каждая сумма приближает нас к цели.',
        'Нам нужно собрать 7 000 000 ₸. Давайте вместе построим место, где больше не будут бояться, травить и убивать. Где спасённые животные получат шанс на новую жизнь. ❤️🐾',
      ],
    } satisfies StoryCardData,
  },

  fundsBreakdown: {
    heading: 'НА ЧТО НУЖНЫ СРЕДСТВА',
    card: {
      variant: 'blue',
      heading: 'СБОР НА ВОССТАНОВЛЕНИЕ ДОМА И ПРИЮТА ПОСЛЕ ПОЖАРА',
      paragraphs: [
        'Общая сумма сбора — 7 000 000 тенге.',
        'Средства необходимы на:\n• восстановление жилого дома, так как после пожара нам негде жить, и сейчас мы вынуждены жить в неотапливаемой летней кухне без света и тепла\n• строительство тёплого помещения для кошек, чтобы они не замерзли зимой;\n• строительство вольеров для спасенных собак и щенков, которых мы забрали с улиц и из отлова;\n• приобретение строительных материалов и проведение основных строительных работ.',
        'Каждый вклад, независимо от суммы, приближает нас к восстановлению дома и созданию безопасных условий для животных.',
        'Спасибо всем, кто помогает нам начать жизнь заново.',
      ],
    } satisfies StoryCardData,
  },

  contacts: {
    heading: 'НАШИ КОНТАКТЫ И РЕКВИЗИТЫ',
    responsibleLabel: 'Контакт ответственный',
    responsibleName: 'АННА',
    whatsapp: {
      label: 'WhatsApp',
      value: '87071065131',
      href: 'https://wa.me/87071065131',
    },
    instagram: {
      label: 'Instagram',
      value: '@pom_jivotnim._rezerv',
      href: 'https://instagram.com/pom_jivotnim._rezerv',
    },
    antiFraudNote:
      'ЗАЩИТА ОТ МОШЕННИКОВ: ВИДЕОЗВОНОК, ДОКУМЕНТЫ, ГЕОЛОКАЦИЯ – ВСЁ ОТКРЫТО. ОТВЕЧАЕМ 24/7',
    trustNote:
      'МЫ ПОНИМАЕМ ВАШИ СОМНЕНИЯ, ПОЭТОМУ НЕ ПРЯЧЕМСЯ – ЗВОНИТЕ, ПИШИТЕ, ВЫХОДИТЕ НА СВЯЗЬ ПО ВИДЕО, СМОТРИТЕ ДОКУМЕНТЫ. КАЖДЫЙ ПЕРЕВОД – ЭТО ШАНС НА ЖИЗНЬ ПИТОМЦЕВ.',
    requisites,
    finalCtaLabel: 'ПОМОЧЬ ЧЕРЕЗ KASPI',
  },

  pay: {
    recipientPhoto: '/images/hero-burned-house.jpg',
    recipientName: 'Анне',
    description:
      'Благотворительный сбор на восстановление дома и приюта для животных после пожара',
    presetAmounts: [1000, 5000, 10000, 25000],
    defaultAmount: 5000,
    noKaspiText: 'Нет Kaspi? Перевести по реквизитам',
  },

  requisitesPage: {
    heading: 'РЕКВИЗИТЫ ДЛЯ ПЕРЕВОДА',
    subheading: 'Сделайте перевод через Kaspi или другой банк',
    rows: requisites,
  },
} as const;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run content/site.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Type-check the whole project**

Run: `npx tsc --noEmit`
Expected: no errors. (This mainly confirms the `satisfies StoryCardData` annotations line up and `as const` didn't break anything downstream — there's nothing downstream yet, but it's a cheap check now before six components start depending on this file's shape.)

- [ ] **Step 6: Commit**

```bash
git add content/site.ts content/site.test.ts
git commit -m "Add site content data module with all fundraiser copy"
```

---

### Task 8: `CopyField` component

**Files:**
- Create: `components/CopyField.tsx`

**Interfaces:**
- Consumes: `copyToClipboard(text: string): Promise<boolean>` from `lib/clipboard.ts` (Task 5).
- Produces: `CopyField({ label, value }: { label: string; value: string })` — used in `ContactsSection` (Task 13) and the `/requisites` page (Task 15).

- [ ] **Step 1: Implement `components/CopyField.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/clipboard';

export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-brand-blue">
      <div>
        <div className="text-sm opacity-70">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full bg-brand-blue px-3 py-2 text-sm text-white"
        aria-label={`Скопировать ${label}`}
      >
        {copied ? 'Скопировано' : 'Копировать'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

There's no page rendering it yet, so verify with a scratch render: temporarily add `<CopyField label="Halyk" value="4003035152865437" />` to `app/page.tsx`, run `npm run dev`, open `http://localhost:3000`, click "Копировать", confirm the button label flips to "Скопировано" for ~2 seconds and pasting elsewhere yields `4003035152865437`. Then revert `app/page.tsx` back to its scaffold placeholder (Task 11 replaces it for real).

- [ ] **Step 3: Commit**

```bash
git add components/CopyField.tsx
git commit -m "Add CopyField component for one-tap requisite copying"
```

---

### Task 9: `StoryCard` and `NeedsList` components

**Files:**
- Create: `components/StoryCard.tsx`, `components/NeedsList.tsx`

**Interfaces:**
- Consumes: `StoryCardVariant`, `StoryCardData`, `NeedItem` types from `content/site.ts` (Task 7).
- Produces: `StoryCard({ variant, heading, paragraphs }: StoryCardData)` and `NeedsList({ items }: { items: NeedItem[] })` — both used throughout the home page (Tasks 11–13).

- [ ] **Step 1: Implement `components/StoryCard.tsx`**

```tsx
import type { StoryCardVariant } from '@/content/site';

const variantClasses: Record<StoryCardVariant, string> = {
  blue: 'bg-brand-blue text-white',
  orange: 'bg-brand-orange text-white',
  white: 'bg-white text-brand-blue',
};

export function StoryCard({
  variant,
  heading,
  paragraphs,
}: {
  variant: StoryCardVariant;
  heading?: string;
  paragraphs: string[];
}) {
  return (
    <div className={`rounded-3xl p-6 ${variantClasses[variant]}`}>
      {heading ? (
        <h3 className="mb-3 font-heading text-2xl uppercase leading-tight">
          {heading}
        </h3>
      ) : null}
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="mb-3 whitespace-pre-line text-base leading-relaxed last:mb-0"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Implement `components/NeedsList.tsx`**

```tsx
import type { NeedItem } from '@/content/site';

export function NeedsList({ items }: { items: NeedItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2 text-base leading-relaxed">
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Verify manually**

Temporarily render both in `app/page.tsx` with data pulled from `siteContent` (e.g. `<StoryCard {...siteContent.about.card1} />` and `<NeedsList items={siteContent.newShelter.needs} />`), `npm run dev`, confirm the blue card renders with white text and the needs list shows emoji + text pairs. Revert the temporary edit.

- [ ] **Step 4: Commit**

```bash
git add components/StoryCard.tsx components/NeedsList.tsx
git commit -m "Add StoryCard and NeedsList components"
```

---

### Task 10: `Hero` component

**Files:**
- Create: `components/Hero.tsx`

**Interfaces:**
- Consumes: `siteContent.hero` from `content/site.ts` (Task 7), `formatTenge` from `lib/format.ts` (Task 4).
- Produces: `Hero()` — used in `app/page.tsx` (Task 11).

- [ ] **Step 1: Implement `components/Hero.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { formatTenge } from '@/lib/format';

export function Hero() {
  const { hero } = siteContent;
  const progressPercent = Math.min(
    100,
    Math.round((hero.raisedTenge / hero.goalTenge) * 100)
  );

  return (
    <section className="bg-brand-blue px-4 pb-8 pt-6 text-white">
      <div className="overflow-hidden rounded-3xl">
        <Image
          src={hero.photo}
          alt="Анна на фоне сгоревшего дома"
          width={430}
          height={430}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <h1 className="mt-6 font-heading text-3xl uppercase leading-tight text-brand-orange">
        {hero.kicker}
      </h1>
      <p className="font-heading text-3xl uppercase leading-tight text-white">
        {hero.headline}
      </p>
      <p className="mt-3 text-base leading-relaxed">{hero.subtext}</p>

      <div className="mt-6 rounded-3xl bg-white p-4 text-brand-blue">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm uppercase opacity-70">Собрано</div>
            <div className="font-heading text-xl">
              {formatTenge(hero.raisedTenge)}₸
            </div>
          </div>
          <div className="text-sm opacity-70">{hero.date}</div>
        </div>
        <div className="mt-2 text-sm uppercase opacity-70">
          Цель: {formatTenge(hero.goalTenge)}₸
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-brand-cream">
          <div
            className="h-full rounded-full bg-brand-orange"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed">{hero.progressCaption}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {hero.quickAmounts.map((amount) => (
          <Link
            key={amount}
            href={`/pay?amount=${amount}`}
            className="rounded-full border-2 border-white px-2 py-3 text-center font-semibold"
          >
            {formatTenge(amount)}₸
          </Link>
        ))}
      </div>

      <Link
        href="/pay"
        className="mt-4 block rounded-full bg-brand-orange px-4 py-4 text-center font-heading text-lg uppercase text-white"
      >
        {hero.ctaLabel}
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Verify manually**

Temporarily render `<Hero />` alone in `app/page.tsx`, `npm run dev`, open `http://localhost:3000`. Confirm: photo loads, orange/white two-line headline, progress bar fills to roughly 12% (838394 / 7000000), three quick-amount pills each link to `/pay?amount=3000` etc. (hover to check the URL), and the big CTA links to `/pay`. Revert the temporary edit — Task 11 assembles the real page.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "Add Hero component with progress bar and quick-donate links"
```

---

### Task 11: Home page — hero, about, and fire-news sections

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 10), `StoryCard` (Task 9), `siteContent.about`, `siteContent.fireNews` (Task 7).
- Produces: the first half of the real home page. Task 12 appends the rest to the same file.

- [ ] **Step 1: Replace `app/page.tsx` with the hero + about + fire-news sections**

```tsx
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { StoryCard } from '@/components/StoryCard';
import { siteContent } from '@/content/site';

export default function HomePage() {
  const { about, fireNews } = siteContent;

  return (
    <main>
      <Hero />

      <section className="space-y-6 bg-brand-cream px-4 py-8">
        <h2 className="text-center font-heading text-2xl uppercase text-brand-blue">
          Обо мне
        </h2>
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={about.photo1}
            alt="Анна с чёрной собакой"
            width={430}
            height={430}
            className="h-auto w-full object-cover"
          />
        </div>
        <StoryCard {...about.card1} />
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={about.photo2}
            alt="Анна со щенком в ветклинике"
            width={430}
            height={430}
            className="h-auto w-full object-cover"
          />
        </div>
        <StoryCard {...about.card2} />
      </section>

      <section className="space-y-6 bg-brand-cream px-4 py-8">
        <video
          className="w-full rounded-3xl"
          controls
          playsInline
          src={fireNews.video}
        />
        <StoryCard {...fireNews.card1} />
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={fireNews.photo}
            alt="Анна на фоне сгоревшей стены"
            width={430}
            height={430}
            className="h-auto w-full object-cover"
          />
        </div>
        <StoryCard {...fireNews.card2} />
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm run dev`, open `http://localhost:3000`. Scroll through: hero, "Обо мне" heading, dog photo, blue card, puppy photo, white card, video player (click play — confirm it actually plays with sound/controls), orange card, burned-wall photo (same image as the hero photo — expected, see Task 3 note), blue card.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Assemble home page: hero, about, and fire-news sections"
```

---

### Task 12: Home page — new shelter and funds-breakdown sections

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `StoryCard` (Task 9), `NeedsList` (Task 9), `siteContent.newShelter`, `siteContent.fundsBreakdown` (Task 7).

- [ ] **Step 1: Add the two sections to `app/page.tsx`, importing `NeedsList` and destructuring the extra content**

Change the import line:

```tsx
import { NeedsList } from '@/components/NeedsList';
```

Change the destructuring line inside `HomePage`:

```tsx
const { about, fireNews, newShelter, fundsBreakdown } = siteContent;
```

Then insert these two sections right after the fire-news `</section>` and before the closing `</main>`:

```tsx
      <section className="space-y-6 bg-brand-cream px-4 py-8">
        <h2 className="text-center font-heading text-2xl uppercase text-brand-blue">
          {newShelter.heading}
        </h2>
        <video
          className="w-full rounded-3xl"
          controls
          playsInline
          src={newShelter.video}
        />
        <StoryCard {...newShelter.card1} />
        <div className="rounded-3xl bg-white p-6 text-brand-blue">
          <h3 className="mb-3 font-heading text-xl uppercase leading-tight">
            {newShelter.needsHeading}
          </h3>
          <NeedsList items={newShelter.needs} />
          <p className="mt-4 font-semibold">{newShelter.needsGoalText}</p>
        </div>
        <StoryCard {...newShelter.card2} />
      </section>

      <section className="space-y-6 bg-brand-cream px-4 py-8">
        <h2 className="text-center font-heading text-2xl uppercase text-brand-blue">
          {fundsBreakdown.heading}
        </h2>
        <StoryCard {...fundsBreakdown.card} />
      </section>
```

- [ ] **Step 2: Verify manually**

`npm run dev`, scroll past the fire-news section: "НОВЫЙ ПРИЮТ" heading, second video (its first frame should look like a sunset over an empty field — confirming the Task 3 note was correct), blue card, white needs card with 7 bullet lines (fence/enclosures/exercise-zones/electricity/water/rooms/fridges) each with an emoji, bold goal line, orange continuation card, then "НА ЧТО НУЖНЫ СРЕДСТВА" heading and the funds-breakdown blue card with the bulleted "•" text rendering on its own lines (confirms `whitespace-pre-line` in `StoryCard` is working).

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Add new-shelter and funds-breakdown sections to home page"
```

---

### Task 13: `ContactsSection` component and finishing the home page

**Files:**
- Create: `components/ContactsSection.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `CopyField` (Task 8), `siteContent.contacts` (Task 7).
- Produces: `ContactsSection()` — appended to the home page, completing it.

- [ ] **Step 1: Implement `components/ContactsSection.tsx`**

```tsx
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { CopyField } from '@/components/CopyField';

export function ContactsSection() {
  const { contacts } = siteContent;

  return (
    <section className="space-y-6 bg-brand-blue px-4 py-10 text-white">
      <h2 className="text-center font-heading text-2xl uppercase">
        {contacts.heading}
      </h2>

      <div className="space-y-4 rounded-3xl bg-white p-6 text-brand-blue">
        <div className="text-center">
          <div className="text-sm opacity-70">{contacts.responsibleLabel}</div>
          <div className="font-heading text-2xl">{contacts.responsibleName}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={contacts.whatsapp.href}
            className="rounded-2xl bg-brand-blue px-3 py-4 text-center text-white"
          >
            <div className="font-semibold">{contacts.whatsapp.label}</div>
            <div className="text-sm opacity-90">{contacts.whatsapp.value}</div>
          </a>
          <a
            href={contacts.instagram.href}
            className="rounded-2xl bg-brand-blue px-3 py-4 text-center text-white"
          >
            <div className="font-semibold">{contacts.instagram.label}</div>
            <div className="text-sm opacity-90">{contacts.instagram.value}</div>
          </a>
        </div>
        <p className="text-center text-sm font-semibold uppercase leading-relaxed">
          {contacts.antiFraudNote}
        </p>
      </div>

      <div className="rounded-3xl bg-brand-orange p-6 text-center font-heading uppercase leading-relaxed">
        {contacts.trustNote}
      </div>

      <div className="space-y-3">
        {contacts.requisites.map((row) => (
          <CopyField key={row.label} label={row.label} value={row.value} />
        ))}
      </div>

      <Link
        href="/pay"
        className="block rounded-full bg-brand-orange px-4 py-4 text-center font-heading text-lg uppercase"
      >
        {contacts.finalCtaLabel}
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Append it to the home page**

In `app/page.tsx`, add the import:

```tsx
import { ContactsSection } from '@/components/ContactsSection';
```

And add `<ContactsSection />` right before the closing `</main>` tag.

- [ ] **Step 3: Verify manually**

`npm run dev`, scroll to the bottom: dark blue "НАШИ КОНТАКТЫ И РЕКВИЗИТЫ" section, white card with "АННА" + WhatsApp/Instagram tiles (both are real links — hover to confirm `https://wa.me/87071065131` and the Instagram profile URL), anti-fraud note, orange trust note, three `CopyField` rows (Halyk, BEREKE МИР, Телефон) — click each "Копировать" and confirm it flips to "Скопировано", final orange CTA linking to `/pay`.

- [ ] **Step 4: Commit**

```bash
git add components/ContactsSection.tsx app/page.tsx
git commit -m "Add ContactsSection component, completing the home page"
```

---

### Task 14: `PayForm` component and the `/pay` page

**Files:**
- Create: `components/PayForm.tsx`, `app/pay/page.tsx`

**Interfaces:**
- Consumes: `formatTenge` (Task 4), `createKaspiPayLink` (Task 6), `siteContent.pay` (Task 7).
- Produces: `PayForm({ initialAmount }: { initialAmount: number })`, and the `/pay` route.

- [ ] **Step 1: Implement `components/PayForm.tsx`**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteContent } from '@/content/site';
import { formatTenge } from '@/lib/format';
import { createKaspiPayLink } from '@/lib/payment';

export function PayForm({ initialAmount }: { initialAmount: number }) {
  const [amount, setAmount] = useState(initialAmount);
  const [customValue, setCustomValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function handlePreset(preset: number) {
    setAmount(preset);
    setCustomValue('');
    setNotice(null);
  }

  function handleCustomChange(value: string) {
    setCustomValue(value);
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      setAmount(Math.round(parsed));
      setNotice(null);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setNotice(null);
    try {
      const url = await createKaspiPayLink(amount);
      if (url) {
        window.location.href = url;
        return;
      }
      setNotice(
        'Оплата через Kaspi пока настраивается. Переведите, пожалуйста, по реквизитам ниже.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm font-semibold uppercase opacity-70">
        Сумма пожертвования
      </p>
      <div className="grid grid-cols-2 gap-3">
        {siteContent.pay.presetAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handlePreset(preset)}
            className={`rounded-2xl border-2 px-3 py-4 text-center font-semibold ${
              amount === preset && customValue === ''
                ? 'border-brand-orange bg-brand-orange text-white'
                : 'border-brand-blue/20 text-brand-blue'
            }`}
          >
            {formatTenge(preset)}₸
          </button>
        ))}
      </div>
      <input
        type="number"
        min={100}
        inputMode="numeric"
        placeholder="Другая сумма"
        value={customValue}
        onChange={(event) => handleCustomChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border-2 border-brand-blue/20 px-4 py-3 text-brand-blue"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || amount <= 0}
        className="mt-4 w-full rounded-full bg-brand-orange px-4 py-4 text-center font-heading text-lg uppercase text-white disabled:opacity-60"
      >
        Помочь на {formatTenge(amount)}₸
      </button>
      {notice ? (
        <p className="mt-3 text-sm leading-relaxed text-brand-blue">{notice}</p>
      ) : null}
      <Link
        href="/requisites"
        className="mt-3 block text-center text-sm font-semibold text-brand-blue underline"
      >
        {siteContent.pay.noKaspiText}
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Implement `app/pay/page.tsx`**

```tsx
import Image from 'next/image';
import { siteContent } from '@/content/site';
import { PayForm } from '@/components/PayForm';

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const { amount } = await searchParams;
  const parsedAmount = Number(amount);
  const initialAmount =
    Number.isFinite(parsedAmount) && parsedAmount > 0
      ? Math.round(parsedAmount)
      : siteContent.pay.defaultAmount;

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="rounded-3xl bg-white p-6 text-brand-blue">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={siteContent.pay.recipientPhoto}
              alt={siteContent.pay.recipientName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-heading text-xl uppercase">
              Помочь {siteContent.pay.recipientName}
            </h1>
            <p className="text-sm leading-snug opacity-70">
              {siteContent.pay.description}
            </p>
          </div>
        </div>
        <hr className="my-4 border-brand-cream" />
        <PayForm initialAmount={initialAmount} />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify manually**

`npm run dev`, open `http://localhost:3000/pay?amount=5000` — confirm the "5 000₸" preset is pre-selected (orange). Click "10 000₸" — confirm it switches. Type "12345" in "Другая сумма" — confirm the submit button updates to "Помочь на 12 345₸" and no preset stays highlighted. Click "Помочь на ...₸" — since `createKaspiPayLink` always returns `null` right now, confirm the notice text appears ("Оплата через Kaspi пока настраивается...") instead of a crash or silent no-op. Click "Нет Kaspi? Перевести по реквизитам" — confirm it navigates to `/requisites` (404 is expected until Task 15).

- [ ] **Step 4: Commit**

```bash
git add components/PayForm.tsx app/pay/page.tsx
git commit -m "Add /pay page with amount picker and stubbed Kaspi payment flow"
```

---

### Task 15: `/requisites` page

**Files:**
- Create: `app/requisites/page.tsx`

**Interfaces:**
- Consumes: `CopyField` (Task 8), `siteContent.requisitesPage` (Task 7).

- [ ] **Step 1: Implement `app/requisites/page.tsx`**

```tsx
import { siteContent } from '@/content/site';
import { CopyField } from '@/components/CopyField';

export default function RequisitesPage() {
  const { requisitesPage } = siteContent;

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="rounded-3xl bg-white p-6 text-brand-blue">
        <h1 className="text-center font-heading text-2xl uppercase">
          {requisitesPage.heading}
        </h1>
        <p className="mt-2 text-center text-sm opacity-70">
          {requisitesPage.subheading}
        </p>
        <div className="mt-6 space-y-3">
          {requisitesPage.rows.map((row) => (
            <CopyField key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify manually**

`npm run dev`, open `http://localhost:3000/requisites` directly, and also navigate to it via the "Нет Kaspi?" link from `/pay`. Confirm the three requisite rows render and each "Копировать" button works.

- [ ] **Step 3: Commit**

```bash
git add app/requisites/page.tsx
git commit -m "Add /requisites page with bank transfer details"
```

---

### Task 16: Final verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Full unit test suite**

Run: `npm test`
Expected: all `lib/*.test.ts` and `content/site.test.ts` tests pass (13 tests total across Tasks 4–7).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, and the route list shows `/`, `/pay`, `/requisites` as generated routes.

- [ ] **Step 4: Manual click-through at mobile width**

`npm run dev`, open the browser dev tools device toolbar at ~390px width, open `http://localhost:3000`, and scroll the entire page top to bottom confirming every section from Tasks 11–13 renders as expected (re-check the list in Task 12/13's manual verification steps if anything looks off).

- [ ] **Step 5: Manual check at desktop width**

Resize the browser to at least 1200px wide (or exit device toolbar mode). Confirm the whole site still renders as a single centered column no wider than 430px, with the neutral `#d9d9d9` background visible on both sides, and nothing overflows horizontally.

- [ ] **Step 6: Full payment flow click-through**

From the home page: click a quick-amount pill (e.g. 5000₸) → lands on `/pay?amount=5000` with that preset selected → click "Помочь на 5 000₸" → confirm the "оплата пока настраивается" notice appears → click "Нет Kaspi? Перевести по реквизитам" → lands on `/requisites` → copy each field → confirm "Скопировано" feedback. Then go back to the home page and click the bottom "ПОМОЧЬ ЧЕРЕЗ KASPI" CTA in `ContactsSection` → confirm it lands on `/pay` with the default preset (5000₸) selected.

- [ ] **Step 7: Final commit**

If any fixes were made during verification:

```bash
git add -A
git commit -m "Fix issues found during final verification pass"
```

If nothing needed fixing, no commit is needed for this task.

---

## What's Explicitly Not Included

Per the design spec's "Out of Scope" section: no real Kaspi API integration (the user will provide it after deploy — only `lib/payment.ts`'s function body will need to change), no CMS, no desktop-specific redesign, no automated component/E2E tests, no Vercel deploy (do that as an explicit follow-up step with the user, not as part of this plan).
