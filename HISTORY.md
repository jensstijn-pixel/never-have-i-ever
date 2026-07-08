# HISTORY — Ik heb nog nooit… (Never Have I Ever PWA)

Nieuwste bovenaan. Projectgeheugen: keuzes, wat gedaan is, next steps, hoe het draait.

## 2026-07-07 — Eerste bouw: werkende PWA

**Wat het is:** een "Ik heb nog nooit…" drankspel als **PWA** (web-app die je op je
telefoon-beginscherm zet, draait offline & fullscreen). Gemaakt op basis van het bestaande
design (`Never Have I Ever.dc.html` + `README.md`-spec). Gebouwd in **vanilla HTML/CSS/JS**,
geen framework, geen build-stap — expres, want dat is het makkelijkst te hosten op GitHub
Pages en te begrijpen.

**Keuzes (met Jens afgestemd):**
- Distributie: **PWA op GitHub Pages** (geen app store). Delen = link/QR sturen.
- Pikantheid: **gemengd met niveau-filter** (Netjes / Pittig / Alles). Elke vraag heeft een
  `level` (1 = netjes/collega-safe, 2 = pittig, 3 = wild/18+). Filter default = Pittig.
- Extra's: **geen herhaling per ronde** + **eigen vragen toevoegen** (localStorage).

**Thema's (11):** Party, Vrienden, Relaties, Pittig, Reizen, Werk, Dronken, Gênant +
2 nieuwe (**Vroeger** 🧸, **Foute boel** 😈) + **Eigen vragen** ✏️ (custom, leeg tot je
zelf toevoegt). ~45 vragen per thema, ~450 totaal. De 8 originele thema's + hun eerste
vragen zijn verbatim overgenomen uit het design.

**Combi-modus:** "🎲 Verras me — alle thema's" mixt alles (incl. eigen vragen), respecteert
het niveau-filter; per kaart wisselt kleur/emoji/naam.

**Bestanden:**
- `index.html` — shell + 3 views (thema-selectie, spel, eigen vragen)
- `styles.css` — design tokens als CSS-variabelen + alle styling
- `app.js` — state, spellogica, filter, eigen vragen, SW-registratie
- `data/questions.js` — alle thema's + vragen (`window.THEMES`). **Hier voeg je vragen toe.**
- `manifest.webmanifest` + `service-worker.js` — PWA/offline (cache `ihnn-v1`)
- `fonts/` — Fredoka + Nunito **lokaal** (self-hosted woff2) zodat het offline mooi blijft
- `icons/` — martiniglas-icoon (180/192/512), gegenereerd met een pure-Python PNG-scriptje
- Origineel design (`Never Have I Ever.dc.html`, `screenshots/`) blijft staan als referentie

**Hoe draaien (lokaal testen):**
```
cd ~/Projects/NeverEver-game
python3 -m http.server 8000
# open http://localhost:8000
```
(Direct het `index.html` openen via `file://` werkt niet i.v.m. de service worker — gebruik
een servertje.)

**Vragen toevoegen/wijzigen:** open `data/questions.js`, kopieer een regel
`{ text: "…", level: 1 }` bij het juiste thema. Geen build nodig; herladen is genoeg.
Bump daarna `CACHE = "ihnn-vX"` in `service-worker.js` zodat telefoons de update pakken.

**Online (gedaan):** repo + GitHub Pages staan live.
- Repo: https://github.com/jensstijn-pixel/never-have-i-ever (public)
- Live app: **https://jensstijn-pixel.github.io/never-have-i-ever/**
- Gedeployd via `gh` (account `jensstijn-pixel`). Getest online: laadt goed, service worker
  registreert op het subpad, manifest + fonts HTTP 200.
- **Updaten na wijzigingen:** `git add -A && git commit && git push` — Pages bouwt vanzelf
  opnieuw. Bump wel `CACHE` in `service-worker.js` zodat telefoons de nieuwe versie pakken.

### Next steps / openstaand
- Echte install op iPhone/Android door Jens nog te testen (kan ik niet zelf) — link openen en
  "Zet op beginscherm".
- Mogelijk later: deel-knop/QR in de app, meer vragen, geluid/animatie-extra's.
- Git-identiteit staat **lokaal** in deze repo (Jens / jens.stijn@gmail.com); globaal is niks
  ingesteld.
