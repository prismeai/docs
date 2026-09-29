/* Lecteur de tutoriels multilingue — une vidéo (captures seules), une voix par langue, textes en HTML.
 *
 * Tout vient de manifest.json (produit par package_player.py) : langues, médias, pistes JSON, textes
 * d'interface, charte. La vidéo n'a pas de son : c'est l'horloge. La voix de la langue choisie est jouée par
 * le Web Audio, relancée exactement à la position de la vidéo à chaque lecture / déplacement / changement de
 * langue ou de vitesse — jamais recalée pendant la lecture, ce qui la couperait. Aux vitesses ≠ 1, on joue une
 * version pré-étirée (ffmpeg atempo) : la hauteur de la voix ne change pas.
 *
 * Utilisable comme page autonome (index.html) OU comme script global d'un site de doc (Mintlify charge tout
 * .js du dépôt sur toutes les pages) : sans élément .pv-host, il ne fait rien ; il charge Video.js à la
 * demande, suit la navigation sans rechargement (MutationObserver), ne démarre jamais deux fois le même hôte
 * et libère le lecteur quand son hôte quitte la page.
 */
(() => {
  "use strict";
  if (window.__pvTutorialPlayer) return;           // script inclus deux fois : une seule instance
  window.__pvTutorialPlayer = true;

  // Video.js figé et vérifié (SRI) : ce script peut tourner sur toutes les pages d'un site de doc
  const VIDEOJS = "https://cdn.jsdelivr.net/npm/video.js@8.24.1/dist/";
  const SRI = { js: "sha384-9LtdENn4aCK5YUSBEw9zQT/tT1eCah4K4BlWimkvqqCaURKD4rBN00ZHMe26ny2O",
                css: "sha384-xfG5I3MEODgvS2hsikP3bkQWFgJNS4uI4dJQt7PoOmActllz5+bPWPywC/ow2KWd" };
  // Textes d'interface par défaut ; manifest.ui[lang] les complète ou les remplace.
  const UI = {
    en: { languages: "Voice language", subtitles: "Subtitles", ccSame: "Same as voice", ccOff: "Off", footer: "", unavailable: "Tutorial unavailable" },
    fr: { languages: "Langue de la voix", subtitles: "Sous-titres", ccSame: "Comme la voix", ccOff: "Désactivés", footer: "", unavailable: "Tutoriel indisponible" },
    es: { languages: "Idioma de la voz", subtitles: "Subtítulos", ccSame: "Como la voz", ccOff: "Desactivados", footer: "", unavailable: "Tutorial no disponible" },
    de: { languages: "Sprache der Stimme", subtitles: "Untertitel", ccSame: "Wie die Stimme", ccOff: "Aus", footer: "", unavailable: "Tutorial nicht verfügbar" },
    it: { languages: "Lingua della voce", subtitles: "Sottotitoli", ccSame: "Come la voce", ccOff: "Disattivati", footer: "", unavailable: "Tutorial non disponibile" },
  };
  const NAMES = { en: "English", fr: "Français", es: "Español", de: "Deutsch", it: "Italiano" };
  const COLOR_VARS = { primary: "--pv-primary", ink: "--pv-ink", muted: "--pv-muted", border: "--pv-border", surface: "--pv-surface",
    page_bg: "--pv-page", cover_bg: "--pv-cover", cover_eyebrow: "--pv-cover-eyebrow", cover_subtitle: "--pv-cover-sub",
    cover_pill_bg: "--pv-pill-bg", cover_pill_text: "--pv-pill-text" };
  const STAGE_H = 56.25;                           // scène 16:9 en unités --u (100 de large)

  const store = {
    get(k) { try { return localStorage.getItem("pv-" + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem("pv-" + k, v); } catch (e) { /* stockage indisponible : sans mémoire */ } },
  };
  // Construction DOM sans innerHTML pour tout texte venu du manifeste.
  function el(tag, cls, children) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    (children || []).forEach((c) => e.appendChild(c));
    return e;
  }
  const at = (list, t) => list.find((c) => t >= c.start && t < c.end) || null;
  const lastStarted = (list, t) => list.reduce((cur, c) => (c.start <= t ? c : cur), list[0] || null);

  let videojsReady = null;
  function loadVideojs() {
    if (window.videojs) return Promise.resolve(window.videojs);
    if (!videojsReady) {
      videojsReady = new Promise((ok, ko) => {
        if (!document.querySelector(`link[href="${VIDEOJS}video-js.min.css"]`)) {
          const css = document.createElement("link"); css.rel = "stylesheet"; css.href = VIDEOJS + "video-js.min.css";
          css.integrity = SRI.css; css.crossOrigin = "anonymous";
          document.head.appendChild(css);
        }
        const js = document.createElement("script"); js.src = VIDEOJS + "video.min.js";
        js.integrity = SRI.js; js.crossOrigin = "anonymous";
        js.onload = () => ok(window.videojs); js.onerror = () => ko(new Error("Video.js"));
        document.head.appendChild(js);
      });
    }
    return videojsReady;
  }

  // ------------------------------------------------------------------ voix (Web Audio)
  class Voices {
    constructor(manifest, base) {
      this.m = manifest; this.base = base;
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = AC ? new AC() : null;             // sans Web Audio : vidéo et textes seulement
      if (this.ctx) { this.gain = this.ctx.createGain(); this.gain.connect(this.ctx.destination); }
      this.buffers = {}; this.pending = {}; this.src = null; this.token = 0;
      this.lang = null; this.video = null;
    }
    key(rate) { const v = (this.m.voices || {})[this.lang] || {}; return v[String(rate)] ? String(rate) : "1"; }
    load(lang, key) {
      const id = lang + "@" + key, url = ((this.m.voices || {})[lang] || {})[key];
      if (!this.ctx || !url) return Promise.reject(new Error("voix absente : " + id));
      if (!this.pending[id]) {
        this.pending[id] = fetch(new URL(url, this.base)).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
          .then((b) => new Promise((ok, ko) => this.ctx.decodeAudioData(b, ok, ko)))
          .then((buf) => (this.buffers[id] = buf))
          .catch((e) => { delete this.pending[id]; throw e; });
      }
      return this.pending[id];
    }
    unlock() {
      if (!this.ctx) return;
      // iPhone en mode silencieux : le Web Audio suit le bouton silence sauf en session « playback »
      if (navigator.audioSession && navigator.audioSession.type !== "playback") { try { navigator.audioSession.type = "playback"; } catch (e) { /* non supporté */ } }
      if (this.ctx.state === "suspended") this.ctx.resume();
    }
    // mémoire : un tampon décodé pèse ~0,2 Mo/s ; on ne garde que la voix courante et sa vitesse 1
    purge(keep) {
      Object.keys(this.buffers).forEach((id) => { if (!keep.includes(id)) { delete this.buffers[id]; delete this.pending[id]; } });
    }
    stop() {
      this.token++;                                // annule une relance en attente de chargement
      if (this.src) { try { this.src.stop(); } catch (e) { /* déjà arrêtée */ } this.src.disconnect(); this.src = null; }
    }
    restart() {
      this.stop();
      const v = this.video, token = this.token;
      if (!this.ctx || !v || v.paused || v.ended || !this.lang) return;
      let key = this.key(v.playbackRate), buf = this.buffers[this.lang + "@" + key];
      this.purge([this.lang + "@1", this.lang + "@" + key]);
      if (!buf) {
        // variante pas encore là : on la charge et on bascule dès qu'elle arrive ; en attendant, la voix de
        // base accélérée (hauteur modifiée) plutôt qu'un silence
        this.load(this.lang, key).then(() => { if (token === this.token) this.restart(); }, () => {});
        if (key === "1" || !this.buffers[this.lang + "@1"]) return;
        key = "1"; buf = this.buffers[this.lang + "@1"];
      }
      this.unlock();
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      // voix de base à une vitesse ≠ 1 : on l'accélère (hauteur modifiée) plutôt que de la désynchroniser
      const stretched = key !== "1";
      src.playbackRate.value = stretched ? 1 : v.playbackRate;
      src.connect(this.gain);
      const offset = v.currentTime / (stretched ? Number(key) : 1);
      this.startedAt = v.currentTime; this.startedCtx = this.ctx.currentTime; this.speed = v.playbackRate;
      if (offset < buf.duration) { src.start(0, offset); this.src = src; } else src.disconnect();
    }
    volume() { if (this.ctx && this.video) this.gain.gain.value = this.video.muted ? 0 : this.video.volume; }
    // garde-fou : si l'horloge audio et la vidéo divergent (onglet en arrière-plan…), on relance
    watchdog() {
      if (!this.src || !this.video || this.video.paused) return;
      const expected = this.startedAt + (this.ctx.currentTime - this.startedCtx) * this.speed;
      if (Math.abs(expected - this.video.currentTime) > 0.25) this.restart();
    }
    dispose() { this.stop(); if (this.ctx) this.ctx.close().catch(() => {}); }
  }

  // ------------------------------------------------------------------ lecteur
  class TutorialPlayer {
    constructor(host, manifest, base) {
      this.host = host; this.m = manifest; this.base = base;
      this.langs = manifest.langs;
      this.ui = Object.fromEntries(this.langs.map((l) => [l, { ...(UI[l] || UI.en), ...((manifest.ui || {})[l] || {}) }]));
      this.lang = this.initialLang();
      this.cc = store.get("cc") || "auto";
      if (this.cc !== "auto" && this.cc !== "off" && !this.langs.includes(this.cc)) this.cc = "auto";
      this.tracks = {};                            // lang → {chapters, subs}
      this.voices = new Voices(manifest, base);
      this.timers = [];
      this.build();
    }

    initialLang() {
      const q = new URLSearchParams(location.search).get("lang");
      const nav = (navigator.language || "").slice(0, 2);
      return [q, store.get("lang"), nav, this.m.default_lang, this.langs[0]].find((l) => l && this.langs.includes(l));
    }
    label(l) { return (this.m.labels || {})[l] || NAMES[l] || l.toUpperCase(); }
    url(p) { return new URL(p, this.base).href; }

    build() {
      const m = this.m, video = document.createElement("video");
      video.className = "video-js pv vjs-big-play-centered";
      video.setAttribute("playsinline", ""); video.setAttribute("preload", "metadata");   // rien de lourd tant qu'on ne lit pas
      this.host.appendChild(video);
      this.player = window.videojs(video, {
        controls: true, fill: true, preferFullWindow: true,
        playbackRates: [...new Set([1, ...(m.rates || [])])].sort((a, b) => a - b),
        controlBar: { pictureInPictureToggle: false, subsCapsButton: false, subtitlesButton: false, captionsButton: false,
                      chaptersButton: false, descriptionsButton: false, audioTrackButton: false },
        sources: [{ src: this.url(m.video.src), type: "video/mp4" }],
      });
      this.root = this.player.el();
      this.applyBrand();
      this.layout();
      this.overlay();
      this.player.ready(() => this.wire());
    }

    applyBrand() {
      const b = this.m.brand || {}, s = this.root.style;
      Object.entries(b.colors || {}).forEach(([k, v]) => COLOR_VARS[k] && s.setProperty(COLOR_VARS[k], v));
      if (b.title_font && window.FontFace) {
        const f = new FontFace("PvTitle", `url(${JSON.stringify(this.url(b.title_font))})`, { weight: "700" });
        f.load().then((ff) => { document.fonts.add(ff); s.setProperty("--pv-title-font", "PvTitle"); }, () => {});
      }
    }

    // géométrie de la fenêtre de navigateur, en unités de scène, selon le format des captures
    layout() {
      const ar = this.m.video.width / this.m.video.height, maxW = 64, maxH = 42;
      let sh = maxH, sw = sh * ar;
      if (sw > maxW) { sw = maxW; sh = sw / ar; }
      const fx = 100 - 3.5 - sw, fy = (STAGE_H - 4.6 - (sh + 2.4)) / 2 + 1.2;
      [["--sw", sw], ["--sh", sh], ["--fx", fx], ["--fy", fy]].forEach(([k, v]) => this.root.style.setProperty(k, v.toFixed(3)));
    }

    overlay() {
      const b = this.m.brand || {};
      const img = (src, cls) => { if (!src) return null; const i = document.createElement("img"); i.className = cls; i.src = this.url(src); i.alt = ""; return i; };
      const text = (tag, cls) => el(tag, cls);
      const bar = el("div", "pv-bar", [el("i"), el("i"), el("i"), (this.$url = text("span"))]);
      this.$frame = el("div", "pv-frame", [bar]);
      this.$panel = el("div", "pv-panel", [img(b.logo_color, "pv-logo"), (this.$eyebrow = text("div", "pv-eyebrow")),
        (this.$title = text("h1")), (this.$sub = text("p")), (this.$toc = text("ol", "pv-toc")), (this.$foot = text("div", "pv-foot"))].filter(Boolean));
      const coverText = el("div", "", [img(b.logo_white, "pv-logo"), (this.$cEyebrow = text("div", "pv-eyebrow")),
        (this.$cTitle = text("h1")), (this.$cSub = text("p")), (this.$cPill = text("b"))].filter(Boolean));
      this.$cover = el("div", "pv-cover", [img(b.mark_light_blue, "pv-mark"), coverText].filter(Boolean));
      this.$cover.addEventListener("click", (e) => { e.stopPropagation(); this.voices.unlock(); this.player.play(); });
      this.$subs = el("div", "pv-subs", [(this.$subsText = text("span"))]);

      this.$tools = el("div", "pv-tools");
      this.$tools.setAttribute("role", "group");
      if (this.langs.length > 1) {
        this.langs.forEach((l) => {
          const btn = el("button"); btn.type = "button"; btn.dataset.lang = l; btn.lang = l; btn.textContent = this.label(l);
          btn.addEventListener("click", (e) => { e.stopPropagation(); this.voices.unlock(); this.setLang(l); });
          this.$tools.appendChild(btn);
        });
      }
      this.$cc = el("button", "pv-cc"); this.$cc.type = "button";
      this.$cc.setAttribute("aria-haspopup", "menu"); this.$cc.setAttribute("aria-expanded", "false");
      this.$menu = el("ul", "pv-ccmenu"); this.$menu.setAttribute("role", "menu"); this.$menu.hidden = true;
      this.$tools.appendChild(el("span", "pv-ccwrap", [this.$cc, this.$menu]));

      const tech = this.root.querySelector(".vjs-tech");
      [this.$subs, this.$panel, this.$frame].forEach((n) => this.root.insertBefore(n, tech.nextSibling));
      this.root.appendChild(this.$cover);
      this.root.appendChild(this.$tools);
    }

    loadTracks(l) {
      if (!this.tracks[l] && this.m.tracks && this.m.tracks[l]) this.tracks[l] = { ...this.m.tracks[l], loaded: true };   // pistes incluses
      if (!this.tracks[l]) {
        const get = (p) => fetch(this.url(p)).then((r) => (r.ok ? r.json() : [])).catch(() => []);
        this.tracks[l] = { chapters: [], subs: [] };
        Promise.all([get(this.m.chapters[l]), get(this.m.subtitles[l])]).then(([chapters, subs]) => {
          this.tracks[l] = { chapters, subs, loaded: true };
          this.render(true);
        });
      }
      return this.tracks[l];
    }

    wire() {
      const p = this.player, v = (this.voices.video = p.tech(true).el());
      v.muted = false;                             // la vidéo n'a pas de son : son volume règle la voix
      const restart = () => this.voices.restart(), stop = () => this.voices.stop();
      ["play", "playing", "seeked", "ratechange"].forEach((e) => p.on(e, restart));
      ["pause", "waiting", "seeking", "ended"].forEach((e) => p.on(e, stop));
      p.on("volumechange", () => this.voices.volume());
      p.on("timeupdate", () => this.render());
      this.timers.push(setInterval(() => this.voices.watchdog(), 1000));
      // l'audio ne démarre qu'après un geste de l'utilisateur : déverrouillé au premier clic / touche
      const first = () => { this.voices.unlock(); if (!this.started) { this.started = true; this.voices.load(this.lang, "1").catch(() => {}); } };
      ["pointerdown", "keydown"].forEach((e) => this.root.addEventListener(e, first, true));
      p.on("play", first);

      this.$cc.addEventListener("click", (e) => {
        e.stopPropagation(); this.renderCcMenu(); this.$menu.hidden = !this.$menu.hidden;
        this.$cc.setAttribute("aria-expanded", String(!this.$menu.hidden));
        if (!this.$menu.hidden) (this.$menu.querySelector("[aria-checked=true]") || this.$menu.querySelector("[role=menuitemradio]")).focus();
      });
      this.root.addEventListener("click", () => this.closeCc());
      this.root.addEventListener("keydown", (e) => { if (e.key === "Escape" && !this.$menu.hidden) { this.closeCc(); this.$cc.focus(); } });
      this.$menu.addEventListener("focusout", (e) => { if (!this.$tools.contains(e.relatedTarget)) this.closeCc(); });
      this.langs.forEach((l) => this.loadTracks(l));
      this.setLang(this.lang);
    }

    setLang(l) {
      this.lang = this.voices.lang = l;
      store.set("lang", l);
      this.root.lang = l;
      this.$tools.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
      this.$tools.setAttribute("aria-label", this.ui[l].languages);
      if (this.started) this.voices.load(l, "1").catch(() => {});
      this.voices.volume();
      this.voices.restart();
      this.render(true);
    }

    ccLang() { return this.cc === "auto" ? this.lang : this.cc; }
    renderCcMenu() {
      const ui = this.ui[this.lang];
      const items = [["auto", ui.ccSame], ["off", ui.ccOff], ["-"], ...this.langs.map((l) => [l, this.label(l)])];
      this.$menu.textContent = "";
      items.forEach(([value, label]) => {
        const li = el("li");
        if (value === "-") { li.className = "sep"; li.setAttribute("role", "separator"); this.$menu.appendChild(li); return; }
        li.textContent = label; li.tabIndex = -1;
        li.setAttribute("role", "menuitemradio"); li.setAttribute("aria-checked", String(value === this.cc));
        const pick = (e) => { e.stopPropagation(); this.cc = value; store.set("cc", value); this.closeCc(); this.$cc.focus(); this.render(); };
        li.addEventListener("click", pick);
        li.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(e); }
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const all = [...this.$menu.querySelectorAll("[role=menuitemradio]")], i = all.indexOf(li);
            all[(i + (e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length].focus();
          }
        });
        this.$menu.appendChild(li);
      });
    }
    closeCc() { if (!this.$menu.hidden) { this.$menu.hidden = true; this.$cc.setAttribute("aria-expanded", "false"); } }

    // textes : panneau, sommaire (sections), barre d'adresse, couverture, sous-titres, pied de page
    render(full) {
      if (this.disposed) return;
      const l = this.lang, ui = this.ui[l], cover = (this.m.cover || {})[l] || {};
      const { chapters } = this.loadTracks(l), t = this.player.currentTime();
      const cur = lastStarted(chapters, t);

      const sections = [];
      chapters.forEach((c) => { if (c.kind === "step" && !sections.some((s) => s.title === c.section)) sections.push({ title: c.section, start: c.start }); });
      if (full || this.$toc.children.length !== sections.length || this.$toc.dataset.lang !== l) {
        this.$toc.dataset.lang = l; this.$toc.textContent = "";
        sections.forEach((s, k) => {
          const n = el("span", "n"); n.textContent = k + 1;
          const name = el("span"); name.textContent = s.title;
          const btn = el("button", "", [n, name]); btn.type = "button";
          btn.addEventListener("click", (e) => { e.stopPropagation(); this.voices.unlock(); this.player.currentTime(s.start + 0.01); this.player.play(); });
          this.$toc.appendChild(el("li", "", [btn]));
        });
      }
      if (cur) {
        this.$eyebrow.textContent = cur.kind === "cover" ? cover.eyebrow || "" : `${cur.section} · ${cur.step} / ${cur.steps}`;
        this.$title.textContent = cur.title || cover.title || "";
        this.$sub.textContent = cur.kind === "cover" ? cur.sub || cover.sub || "" : cur.sub || "";
        this.$url.textContent = cur.url || "";
        [...this.$toc.children].forEach((li, k) => li.classList.toggle("on", cur.kind === "step" && sections[k].title === cur.section));
      }
      this.$foot.textContent = ui.footer || "";
      this.$cEyebrow.textContent = cover.eyebrow || "";
      this.$cTitle.textContent = cover.title || "";
      this.$cSub.textContent = cover.sub || "";
      this.$cPill.textContent = cover.pill || ""; this.$cPill.hidden = !cover.pill;

      const cl = this.ccLang(), sub = this.cc === "off" ? null : at(this.loadTracks(cl).subs, t);
      this.$subs.hidden = this.cc === "off";
      this.$subs.lang = cl;
      this.$subsText.textContent = sub ? sub.text : "";
      this.$cc.textContent = (this.cc === "off" ? "CC" : "CC " + cl.toUpperCase()) + " ▾";
      this.$cc.title = ui.subtitles; this.$cc.setAttribute("aria-label", ui.subtitles);
      if (full && this.host.dataset.standalone != null && cover.title) document.title = cover.title;
    }

    dispose() {
      this.disposed = true;
      this.timers.forEach(clearInterval);
      this.voices.dispose();
      try { this.player.dispose(); } catch (e) { /* déjà détruit */ }
    }
  }

  // ------------------------------------------------------------------ démarrage
  const players = new Map();
  // Manifeste : intégré à la page (data-tutorial = JSON en base64, pistes comprises — pour les sites qui ne
  // servent pas de .json, comme Mintlify), sinon data-manifest / ?manifest= / manifest.json à côté de la page.
  function decode(b64) { return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)))); }
  function boot(host) {
    if (host.dataset.pvState) return;
    host.dataset.pvState = "loading";
    const inline = host.dataset.tutorial;
    const src = inline ? host.dataset.base || "./" : host.dataset.manifest || new URLSearchParams(location.search).get("manifest") || "manifest.json";
    const base = new URL(src, location.href);
    if (base.origin !== location.origin) {                 // pas de contenu tiers affiché sous notre domaine
      host.dataset.pvState = "error"; host.textContent = "Tutorial unavailable (media must be same-origin)"; return;
    }
    const manifest = inline ? Promise.resolve().then(() => decode(inline))
      : fetch(base).then((r) => { if (!r.ok) throw new Error(r.status + " " + base.pathname); return r.json(); });
    Promise.all([manifest, loadVideojs()])
      .then(([m]) => { if (!host.isConnected) return; players.set(host, new TutorialPlayer(host, m, base)); host.dataset.pvState = "ready"; })
      .catch((e) => { host.dataset.pvState = "error"; host.textContent = (UI[(navigator.language || "en").slice(0, 2)] || UI.en).unavailable + " (" + e.message + ")"; });
  }
  function scan() {
    document.querySelectorAll(".pv-host").forEach(boot);
    players.forEach((p, host) => { if (!host.isConnected) { p.dispose(); players.delete(host); } });
  }
  function start() {
    if (document.body.dataset.pvStandalone != null && window.self !== window.top) document.body.classList.add("pv-embed");
    scan();
    // sites à navigation sans rechargement (Mintlify…) : l'hôte peut apparaître ou disparaître plus tard
    new MutationObserver((records) => {
      if (records.every((r) => r.target.closest && r.target.closest(".pv-host"))) return;   // nos propres mises à jour
      clearTimeout(start.t); start.t = setTimeout(scan, 100);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
