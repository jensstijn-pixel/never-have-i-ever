# Handoff: "Ik heb nog nooit…" (Never Have I Ever) — mobiele app

## Overview
A cheerful, playful mobile party game (18+) in Dutch. The user picks a theme (or a "surprise me" mix of all themes), then swipes through "Ik heb nog nooit…" (Never Have I Ever) statements one at a time, tapping **Volgende** to advance. Background color shifts per question; each card animates in. Two primary views: **theme selection** and **game**.

## About the Design Files
The file in this bundle (`Never Have I Ever.dc.html`) is a **design reference created in HTML** — a working prototype demonstrating the intended look, layout, copy, and interactions. It is **not production code to copy directly**. The `.dc.html` format is a proprietary streaming-component wrapper; ignore the wrapper mechanics.

Your task is to **recreate this design in the target codebase's environment** using its established patterns and libraries (React Native, Flutter, SwiftUI, plain React web, etc.). If no environment exists yet, choose the most appropriate framework for a small single-screen mobile game and implement there. All layout/logic is described below so you can build from the README alone.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all specified. Recreate the UI pixel-accurately using the codebase's own component/styling system. The HTML uses a fixed 390×844 phone frame purely for preview; in a real app these are full-screen views.

## Screens / Views

### 1. Theme Selection (`view = 'themes'`)
- **Purpose**: Player chooses a category to play, or a random mix of everything.
- **Layout** (top → bottom, vertically scrollable):
  1. Status bar row: `9:41` left, signal dots right. Padding `15px 28px 0`. Text `#2A1F32`, weight 800, 14px.
  2. Header block, padding `38px 26px 20px`, `position:relative`:
     - Kicker: "HET SPEL" — 13px, weight 800, letter-spacing 3px, uppercase, color `#C0492F`.
     - Title: "Ik heb\nnog nooit…" — Fredoka 700, 46px, line-height .96, color `#2A1F32`, letter-spacing -1px.
     - Subtitle: "Kies een thema, geef de telefoon door en drink als het waar is. 🍹" — 16px, weight 700, color `#7A6B62`, max-width 230px.
     - Two decorative floating circles (top-right): 44px `#FFD84D` and 20px `#FF3D77`, each with a gentle `floaty` bob animation.
  3. Theme grid: 2 columns, `gap:12px`, padding `6px 20px 8px`. 8 theme cards (see below).
  4. Random button: full-width, padding `19px`, radius `26px`, background `#2A1F32`, white Fredoka 600 19px, text "🎲 Verras me — alle thema's", shadow `0 12px 24px -10px rgba(42,31,50,.6)`. Padding wrapper `12px 20px 32px`.
- **Screen background**: `#FFF3E4` (warm cream).

**Theme card component** (×8):
- `border-radius:24px`, padding `16px 15px`, `min-height:104px`, flex column, content bottom-aligned (`justify-content:flex-end`), left-aligned text, white text, cursor pointer.
- Shadow: `0 10px 20px -8px rgba(42,31,50,.4)`.
- Contents: emoji (32px, margin-bottom 6px) → name (Fredoka 600, 19px) → count line ("N vragen", 12px, weight 800, opacity .82).
- Active/press: brief `scale(.94)` bounce (`press` keyframe, .25s).
- The 8 themes (name / emoji / background hex / question count):
  - Party / 🎉 / `#FF3D77` / 7
  - Vrienden / 👯 / `#12B5A5` / 6
  - Relaties / 💘 / `#8A5CF6` / 6
  - Pittig / 🌶️ / `#F1502F` / 6
  - Reizen / ✈️ / `#2196C9` / 6
  - Werk / 💼 / `#E08A00` / 6
  - Dronken / 🍻 / `#2FB350` / 6
  - Gênant / 😳 / `#D6399E` / 6

### 2. Game (`view = 'game'`)
- **Purpose**: Show one statement at a time; advance through the (shuffled) list.
- **Layout**: full-height flex column; **screen background = the current question's theme color** with `transition:background .45s ease`.
  1. Status bar row (white text version).
  2. Top bar, padding `22px 22px 6px`, white, space-between:
     - Back button: 44px circle, `background:rgba(255,255,255,.22)`, `‹` glyph 22px → returns to theme selection.
     - Center: theme emoji + name (Fredoka 600, 18px). For random mode shows `🎲 Willekeurig`.
     - Counter: right-aligned, weight 800, 15px, opacity .9, format `"{n} / {total}"`.
  3. Card area: `flex:1`, centered, padding `14px 24px 8px`. The card:
     - `background:#fff`, `border-radius:34px`, padding `40px 30px 44px`, shadow `0 26px 46px -18px rgba(20,10,30,.5)`, cursor pointer, flex column.
     - Entrance animation `popIn` .5s `cubic-bezier(.34,1.56,.64,1)` — replays on every question change (in HTML this is forced by resetting the CSS animation on update).
     - Kicker: "Ik heb nog nooit" — 13px, weight 800, letter-spacing 3px, uppercase, color = current theme color.
     - Question: Fredoka 600, 33px, line-height 1.12, color `#2A1F32`, letter-spacing -.5px, `text-wrap:balance`, margin-top 16px.
     - Footer hint: "Was het waar? Neem een slok. 🍸" — 14px, weight 800, color `#C9BEB4`, margin-top 26px.
     - Tapping the card advances (when `tapToAdvance` on).
  4. Bottom controls, padding `6px 24px 40px`, `gap:12px`, flex row:
     - Reshuffle button: 64px wide, radius 26px, `background:rgba(255,255,255,.22)`, `↺` 24px white → reshuffles list and resets to index 0.
     - Volgende button: `flex:1`, padding 20px, radius 26px, `background:#fff`, text color = current theme color, Fredoka 600 21px, shadow `0 14px 26px -12px rgba(20,10,30,.5)`, label "Volgende →". Advances to next question.

## Interactions & Behavior
- **Select theme** → build the question list for that theme, go to game, index 0.
- **Verras me / random** → merge all themes' questions into one list; each item keeps its own theme color/emoji/name, so background + kicker color change per card.
- **Volgende / tap card** → index +1. On reaching the end, wrap to 0 and (if shuffle on) reshuffle.
- **Reshuffle (↺)** → shuffle current list, reset to index 0.
- **Back (‹)** → return to theme selection (list is rebuilt fresh next time a theme is chosen).
- **Animations**: card `popIn` (scale .85→1 with slight rotate overshoot) replays on every question change; background color crossfades .45s; buttons/cards do a `press` scale-bounce on tap; header circles bob with `floaty` (3.2s / 4s infinite).
- Shuffle uses Fisher–Yates.

## State Management
- `view`: `'themes' | 'game'`.
- `theme`: index into themes array, or `-1` for random mix.
- `qIndex`: current position in the active list.
- `list`: array of `{ text, color, emoji, name }` for the active session (built on start, mutated on shuffle/wrap).
- Config flags (see Tweaks): `shuffleQuestions` (default true), `tapToAdvance` (default true), `showCounter` (default true).

## Configurable options (were "Tweaks" in prototype)
- **shuffleQuestions** (bool, default true) — randomize order and reshuffle on wrap; if false, sequential.
- **tapToAdvance** (bool, default true) — tapping the card advances (in addition to the Volgende button).
- **showCounter** (bool, default true) — show/hide the "n / total" counter.

## Design Tokens
Colors:
- Screen cream `#FFF3E4`
- Ink / primary text `#2A1F32`
- Muted text `#7A6B62`, card footer `#C9BEB4`
- Kicker red `#C0492F`
- Dark pill / random button `#2A1F32`
- Decoration `#FFD84D`, `#FF3D77`
- Theme colors: `#FF3D77`, `#12B5A5`, `#8A5CF6`, `#F1502F`, `#2196C9`, `#E08A00`, `#2FB350`, `#D6399E`
- White `#FFFFFF`; translucent white overlays `rgba(255,255,255,.22)`

Radius: cards 34px, theme cards 24px, buttons/pills 26px, phone screen 40px, circles 50%.

Typography:
- Display/UI headings: **Fredoka** (500/600/700) — Google Fonts.
- Body/UI: **Nunito** (600/700/800) — Google Fonts.
- Sizes: title 46px, question 33px, theme name 19px, button 19–21px, subtitle 16px, counter 15px, kicker 13px, meta 12–14px.

Shadows:
- Theme card `0 10px 20px -8px rgba(42,31,50,.4)`
- Random button `0 12px 24px -10px rgba(42,31,50,.6)`
- Question card `0 26px 46px -18px rgba(20,10,30,.5)`
- Volgende button `0 14px 26px -12px rgba(20,10,30,.5)`

Keyframes:
- `popIn`: 0% `scale(.85) rotate(-2deg)` opacity 0 → 60% `scale(1.03) rotate(.6deg)` opacity 1 → 100% `scale(1) rotate(0)`.
- `floaty`: translateY 0 → -8px → 0.
- `press`: scale 1 → .94 → 1.

## Assets
None external. Icons are emoji; glyphs `‹`, `↺`, `→` are plain text. Fonts load from Google Fonts (Fredoka, Nunito).

## Content
All ~49 statements (Dutch, 18+ mix) live in the `themes` array inside `Never Have I Ever.dc.html` — copy them verbatim. Each statement completes the phrase "Ik heb nog nooit …". Organized by the 8 themes listed above.

## Screenshots
See `screenshots/`:
- `01-theme-selection.png` — theme grid view
- `02-game-card.png` — game view, card popping in on a theme color
- `03-game-next.png` — game view after tapping Volgende (next question)

## Files
- `Never Have I Ever.dc.html` — full prototype (template markup + logic class). The `themes` array (with all questions), state model, and inline styles are the source of truth for copy and exact values.
