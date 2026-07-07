/* =========================================================
   Ik heb nog nooit… — spellogica
   Vanilla JS, geen framework. THEMES komt uit data/questions.js.
   ========================================================= */
(function () {
  "use strict";

  // ---------- Opslag (blijft op de telefoon bewaard) ----------
  var LS_LEVEL = "ihnn_level";
  var LS_CUSTOM = "ihnn_custom";

  function loadCustom() {
    try {
      var raw = localStorage.getItem(LS_CUSTOM);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveCustom(arr) {
    try { localStorage.setItem(LS_CUSTOM, JSON.stringify(arr)); } catch (e) {}
  }
  function loadLevel() {
    var v = parseInt(localStorage.getItem(LS_LEVEL), 10);
    return (v === 1 || v === 2 || v === 3) ? v : 2; // default: Pittig
  }
  function saveLevel(v) { try { localStorage.setItem(LS_LEVEL, String(v)); } catch (e) {} }

  // ---------- Thema's ----------
  var THEMES = window.THEMES || [];
  var eigenTheme = THEMES.filter(function (t) { return t.custom; })[0] || null;

  // Custom vragen in het eigen-thema stoppen zodat alles er automatisch mee werkt.
  function syncCustom() {
    if (eigenTheme) eigenTheme.questions = loadCustom();
  }

  // ---------- State ----------
  var state = {
    level: loadLevel(),      // 1 = netjes, 2 = pittig, 3 = alles
    themeIndex: 0,           // index in THEMES, of -1 voor combi
    list: [],                // huidige (geschudde) lijst items
    qIndex: 0,
    roundEnd: false,
    customLevel: 1
  };

  // ---------- Helpers ----------
  function $(id) { return document.getElementById(id); }

  function shuffle(a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = r[i]; r[i] = r[j]; r[j] = t;
    }
    return r;
  }

  // Vragen van een thema die passen bij het gekozen niveau.
  function filteredQuestions(theme) {
    return theme.questions.filter(function (q) { return q.level <= state.level; });
  }

  function countFor(theme) { return filteredQuestions(theme).length; }

  // Bouw de speel-lijst (met kleur/emoji/naam per item) en schud 'm.
  function buildList(themeIndex) {
    var items = [];
    var mk = function (theme) {
      return filteredQuestions(theme).map(function (q) {
        return { text: q.text, color: theme.color, emoji: theme.emoji, name: theme.name, level: q.level };
      });
    };
    if (themeIndex === -1) {
      THEMES.forEach(function (t) { items = items.concat(mk(t)); });
    } else {
      items = mk(THEMES[themeIndex]);
    }
    return shuffle(items);
  }

  // ---------- Views ----------
  function showView(name) {
    ["themes", "game", "custom"].forEach(function (v) {
      $("view-" + v).classList.toggle("is-active", v === name);
    });
    // Scroll van home/custom terug naar boven
    var active = document.querySelector(".view.is-active .scroll");
    if (active) active.scrollTop = 0;
    if (name === "themes") setAppBackground(null);
  }

  function setAppBackground(color) {
    var app = $("app");
    if (color) {
      app.style.background = color;
      app.style.setProperty("--theme-color", color);
      document.querySelector('meta[name="theme-color"]').setAttribute("content", color);
    } else {
      app.style.background = "";
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#FFF3E4");
    }
  }

  // ---------- Home: thema-grid ----------
  function renderThemeGrid() {
    syncCustom();
    var grid = $("theme-grid");
    grid.innerHTML = "";
    THEMES.forEach(function (theme, i) {
      var n = countFor(theme);
      var card = document.createElement("button");
      card.className = "theme-card" + (theme.custom ? " custom" : "") + (n === 0 && !theme.custom ? " empty" : "");
      card.style.background = theme.color;
      card.innerHTML =
        '<span class="theme-emoji">' + theme.emoji + "</span>" +
        '<span class="theme-name">' + theme.name + "</span>" +
        '<span class="theme-count">' + (theme.custom ? (n + " eigen") : (n + " vragen")) + "</span>";
      card.addEventListener("click", function () {
        if (theme.custom) { openCustom(); return; }
        if (n === 0) { flashHint(); return; }
        startGame(i);
      });
      grid.appendChild(card);
    });
  }

  function flashHint() {
    var hint = $("filter-hint");
    hint.textContent = "Geen vragen op dit niveau — kies pittiger.";
    setTimeout(function () { updateFilterHint(); }, 1800);
  }

  function updateFilterHint() {
    $("filter-hint").textContent = state.level === 3 ? "18+" : "";
  }

  // ---------- Niveau-filter ----------
  function renderFilter() {
    var segs = $("level-filter").querySelectorAll(".seg");
    segs.forEach(function (s) {
      s.classList.toggle("is-on", parseInt(s.dataset.level, 10) === state.level);
    });
    updateFilterHint();
  }

  function setLevel(v) {
    state.level = v;
    saveLevel(v);
    renderFilter();
    renderThemeGrid();
  }

  // ---------- Spel ----------
  function startGame(themeIndex) {
    state.themeIndex = themeIndex;
    state.list = buildList(themeIndex);
    state.qIndex = 0;
    state.roundEnd = false;
    if (state.list.length === 0) { flashHint(); showView("themes"); return; }
    showView("game");
    renderCard();
  }

  function newRound() {
    state.list = buildList(state.themeIndex);
    state.qIndex = 0;
    state.roundEnd = false;
    renderCard();
  }

  function next() {
    if (state.roundEnd) { newRound(); return; }
    if (state.qIndex < state.list.length - 1) {
      state.qIndex++;
      renderCard();
    } else {
      state.roundEnd = true;
      renderCard();
    }
  }

  function renderCard() {
    var card = $("card");
    var kicker = $("card-kicker");
    var q = $("card-question");
    var hint = document.querySelector(".card-hint");

    if (state.roundEnd) {
      var lastColor = state.list.length ? state.list[state.list.length - 1].color : "#FF3D77";
      setAppBackground(lastColor);
      kicker.textContent = "RONDE KLAAR";
      q.textContent = "Alle vragen gehad. Tik voor een nieuwe ronde. 🔄";
      hint.style.visibility = "hidden";
      card.classList.add("round-end");
      $("counter").textContent = state.list.length + " / " + state.list.length;
    } else {
      var item = state.list[state.qIndex];
      setAppBackground(item.color);
      // Combi toont per kaart het eigen thema; los thema toont vaste titel.
      $("game-emoji").textContent = state.themeIndex === -1 ? "🎲" : item.emoji;
      $("game-name").textContent = state.themeIndex === -1 ? "Willekeurig" : item.name;
      kicker.textContent = "Ik heb nog nooit";
      q.textContent = item.text;
      hint.style.visibility = "visible";
      card.classList.remove("round-end");
      $("counter").textContent = (state.qIndex + 1) + " / " + state.list.length;
    }
    playPop(card);
  }

  function playPop(el) {
    el.classList.remove("animate");
    void el.offsetWidth; // forceer reflow zodat de animatie opnieuw speelt
    el.classList.add("animate");
  }

  // ---------- Eigen vragen ----------
  function openCustom() {
    state.customLevel = 1;
    renderCustomLevel();
    renderCustomList();
    showView("custom");
  }

  function renderCustomLevel() {
    $("custom-level").querySelectorAll(".seg").forEach(function (s) {
      s.classList.toggle("is-on", parseInt(s.dataset.level, 10) === state.customLevel);
    });
  }

  function renderCustomList() {
    var arr = loadCustom();
    var wrap = $("custom-list");
    wrap.innerHTML = "";

    // Speel-knop bovenaan
    var play = document.createElement("button");
    play.className = "random-btn";
    play.style.marginBottom = "6px";
    play.textContent = "▶ Speel eigen vragen (" + arr.length + ")";
    play.disabled = arr.length === 0;
    if (arr.length === 0) { play.style.opacity = ".5"; }
    play.addEventListener("click", function () {
      if (arr.length === 0) return;
      var idx = THEMES.indexOf(eigenTheme);
      startGame(idx);
    });
    wrap.appendChild(play);

    if (arr.length === 0) {
      var empty = document.createElement("div");
      empty.className = "custom-empty";
      empty.textContent = "Nog geen eigen vragen. Voeg er hierboven een toe!";
      wrap.appendChild(empty);
      return;
    }

    var names = { 1: "Netjes", 2: "Pittig", 3: "Wild" };
    arr.forEach(function (q, i) {
      var row = document.createElement("div");
      row.className = "custom-item";
      row.innerHTML =
        '<div class="custom-item-text">' + escapeHtml(q.text) + "</div>" +
        '<span class="custom-item-lvl">' + (names[q.level] || "") + "</span>";
      var del = document.createElement("button");
      del.className = "custom-del";
      del.textContent = "×";
      del.setAttribute("aria-label", "Verwijderen");
      del.addEventListener("click", function () {
        var cur = loadCustom();
        cur.splice(i, 1);
        saveCustom(cur);
        syncCustom();
        renderCustomList();
      });
      row.appendChild(del);
      wrap.appendChild(row);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function addCustom() {
    var input = $("custom-input");
    var text = input.value.trim();
    if (!text) return;
    var arr = loadCustom();
    arr.unshift({ text: text, level: state.customLevel });
    saveCustom(arr);
    syncCustom();
    input.value = "";
    renderCustomList();
  }

  // ---------- Events ----------
  function wire() {
    // Niveau-filter (home)
    $("level-filter").addEventListener("click", function (e) {
      var b = e.target.closest(".seg");
      if (b) setLevel(parseInt(b.dataset.level, 10));
    });

    // Combi-modus
    $("random-btn").addEventListener("click", function () { startGame(-1); });

    // Spel
    $("next-btn").addEventListener("click", next);
    $("card").addEventListener("click", next);
    $("reshuffle-btn").addEventListener("click", newRound);
    $("back-btn").addEventListener("click", function () { showView("themes"); renderThemeGrid(); });

    // Eigen vragen
    $("custom-back-btn").addEventListener("click", function () { showView("themes"); renderThemeGrid(); });
    $("custom-level").addEventListener("click", function (e) {
      var b = e.target.closest(".seg");
      if (b) { state.customLevel = parseInt(b.dataset.level, 10); renderCustomLevel(); }
    });
    $("custom-form").addEventListener("submit", function (e) { e.preventDefault(); addCustom(); });
  }

  // ---------- Service worker (offline) ----------
  function registerSW() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./service-worker.js").catch(function () {});
      });
    }
  }

  // ---------- Start ----------
  function init() {
    syncCustom();
    renderFilter();
    renderThemeGrid();
    wire();
    registerSW();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
