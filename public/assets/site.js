/* weaselwonder.com site script: header, footer, live state and every page.
   Pages are plain static files under public/; each sets <body data-page data-root [data-game]>. */
(function () {
  const G = window.WW_GAMES || [], L = window.WW_LINKS || {};
  const B = document.body, ROOT = B.dataset.root || "/";
  const REAL = /(^|\.)weaselwonder\.com$/.test(location.hostname);
  const PROTO = !REAL;                       // prototype / artifact preview
  if (PROTO) B.classList.add("proto");
  const byslug = s => G.find(g => g.slug === s);
  const abs = u => new URL(u, location.href).href;   // url() inside CSS variables resolves against the stylesheet, so pass absolute URLs
  const art = g => abs(ROOT + "assets/art/" + (g.card || g.art));
  const page = s => ROOT + "games/" + s + "/" + (PROTO ? "index.html" : "");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Paths that already exist on the live site open there from the prototype.
  const LIVE_PATHS = ["/tutorial/", "/play/", "/zombierats/", "/corpsecrafter/"];
  function href(u) {
    if (!u) return null;
    if (u.startsWith("#") || /^https?:/.test(u)) return u;
    if (REAL) return u;
    return LIVE_PATHS.some(p => u.startsWith(p)) ? "https://weaselwonder.com" + u : "#todo:" + u;
  }

  // ---------- live state ----------
  // Real site: GET /api/live -> {live:true|false, game:"zombierats", since:ISO}
  let live = { live: false, game: null };
  function mockGet() {
    const q = new URLSearchParams(location.search).get("live");
    if (q !== null) return q;
    const def = window.WW_PREVIEW_DEFAULT || "";
    try { const v = sessionStorage.getItem("ww_live"); return v === null ? def : v; } catch (e) { return window.__wwLive != null ? window.__wwLive : def; }
  }
  function mockSet(v) { try { sessionStorage.setItem("ww_live", v); } catch (e) { window.__wwLive = v; } }
  async function readLive() {
    if (PROTO) { const s = mockGet(); return { live: !!byslug(s), game: byslug(s) ? s : null }; }
    try { const r = await fetch("/api/live", { cache: "no-store" }); if (r.ok) return await r.json(); } catch (e) {}
    return { live: false, game: null };
  }

  // ---------- chrome ----------
  function chrome() {
    const top = document.createElement("div");
    top.innerHTML = `
      <div class="livebar"><div class="wrap"><span class="pill on"><i></i>Live</span>
        <span id="lb-text">Weasel is live</span><a class="btn" id="lb-go" href="#">Watch and join</a></div></div>
      <header class="top"><div class="wrap">
        <a class="brand" href="${ROOT}${PROTO ? "index.html" : ""}">weaselwonder</a>
        <span class="pill" id="st"><i></i><span>Offline</span></span>
        <nav><a class="hide-s" href="${ROOT}${PROTO ? "index.html" : ""}#games">Games</a>
          <a class="hide-s" href="${L.tiktok}" target="_blank" rel="noopener">TikTok</a>
          <a class="hide-s" href="${L.twitch}" target="_blank" rel="noopener">Twitch</a>
          <a class="btn discord" style="padding:9px 14px;font-size:14px" href="${L.discord}" target="_blank" rel="noopener">Discord</a></nav>
      </div></header>`;
    B.prepend(...top.children);
    if (B.dataset.page !== "home") {
      const here = B.dataset.page === "game" ? byslug(B.dataset.game) : null;
      const idx = here ? G.indexOf(here) : -1, next = idx >= 0 ? G[(idx + 1) % G.length] : null;
      const crumb = document.createElement("div");
      crumb.className = "crumbs";
      crumb.innerHTML = `<div class="wrap"><button class="back" id="back" aria-label="Back"><span>‹</span> Back</button>
        <nav class="trail"><a href="${ROOT}${PROTO ? "index.html" : ""}">Home</a><i>/</i>${here ? `<a href="${ROOT}${PROTO ? "index.html" : ""}#games">Games</a><i>/</i><b>${esc(here.title)}</b>` : `<b>${B.dataset.page === "streamer" ? "Streamer" : esc(document.title.split(" ·")[0])}</b>`}</nav>
        ${next ? `<a class="next" href="${page(next.slug)}">${esc(next.title)} <span>›</span></a>` : ""}</div>`;
      document.querySelector("header.top").after(crumb);
      document.getElementById("back").onclick = () => {
        let same = false; try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
        if (same && history.length > 1) history.back(); else location.href = ROOT + (PROTO ? "index.html" : "") + (here ? "#games" : "");
      };
    }
    const f = document.createElement("footer");
    f.innerHTML = `<div class="wrap row" style="justify-content:space-between">
      <span>weaselwonder · games you play with the stream</span>
      <span class="row"><a href="${L.tiktok}">TikTok</a><a href="${L.twitch}">Twitch</a><a href="${L.youtube}">YouTube</a><a href="${L.discord}">Discord</a></span></div>`;
    B.append(f);
  }

  function applyLive() {
    const g = live.live && byslug(live.game);
    B.classList.toggle("is-live", !!g);
    B.classList.toggle("live-here", !!g && B.dataset.game === g.slug);
    const st = document.getElementById("st");
    st.classList.toggle("on", !!g);
    st.querySelector("span").textContent = g ? "Weasel is live" : "Weasel is offline";
    if (g) {
      document.getElementById("lb-text").textContent = `Weasel is live with ${g.title} right now`;
      document.getElementById("lb-go").href = page(g.slug);
    }
    document.querySelectorAll("[data-when]").forEach(el => {
      const w = el.dataset.when; el.hidden = (w === "live") ? !g : (w === "offline") ? !!g : false;
    });
    if (renderers[B.dataset.page + "Live"]) renderers[B.dataset.page + "Live"](g);
  }

  // ---------- pages ----------
  const statusBadge = g => ({ live: '<span class="badge new">Playable</span>', soon: '<span class="badge">Playtest</span>',
    retired: '<span class="badge">Classic</span>', playtest: '<span class="badge">Playtest</span>' }[g.status] || "");

  const renderers = {
    home() {
      const m = document.getElementById("main");
      m.innerHTML = `
      <section class="hero has-video" style="--hero-img:url(${abs(ROOT + ((window.WW_HERO||{}).poster || "assets/art/hero.jpg"))})">
        <div class="hero-media" id="hero-media" aria-hidden="true"></div><div class="hero-shade"></div><div class="wrap">
        <span class="pill" id="hero-pill"><i></i><span>Weasel is offline</span></span>
        <h1 class="logo">Play with<br>the stream</h1>
        <p class="lede" data-when="offline">Games you play from TikTok and Twitch chat, or right here in your browser. Weasel is offline, so try one solo and be ready for the next stream.</p>
        <p class="lede" data-when="live" hidden>Weasel is live right now. Jump into the game from your phone, or type in chat to play.</p>
        <div class="featured" id="featured"></div>
        <div class="row" data-when="offline" style="margin-top:6px">
          <a class="btn big" href="#games">Pick a game</a>
          <a class="btn big discord" href="${L.discord}" target="_blank" rel="noopener">Join the Discord</a></div>
      </div></section>
      <section class="sec" id="games"><div class="wrap">
        <h2 class="t">Games</h2><p class="sub">Every game weasel streams. Play the offline versions any time.</p>
        <div class="grid">${G.map(g => `
          <a class="gcard" href="${page(g.slug)}" data-slug="${g.slug}" style="--card-img:url(${art(g)})">
            <span class="badge-slot">${statusBadge(g)}</span>
            <div class="body"><h3>${esc(g.title)}</h3><p>${esc(g.tagline)} ${esc(g.blurb)}</p>
              <span class="btn">Play</span></div></a>`).join("")}</div>
      </div></section>
      <section class="sec"><div class="wrap"><div class="band">
        <div><h3>Join the Discord</h3><p>Stream alerts, playtest builds first, and a say in what gets built next.</p></div>
        <a class="btn discord big" href="${L.discord}" target="_blank" rel="noopener">Open Discord</a></div></div></section>`;
    },
    heroVideo() {
      const H = window.WW_HERO, box = document.getElementById("hero-media");
      if (!H || !box) return;
      const calm = matchMedia("(prefers-reduced-motion: reduce)").matches || (navigator.connection && navigator.connection.saveData);
      if (calm) return;                                   // poster only
      const v = document.createElement("video");
      Object.assign(v, { muted: true, loop: true, autoplay: true, playsInline: true, preload: "auto", poster: ROOT + H.poster });
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.oncanplay = () => { box.classList.add("on"); v.play().catch(() => {}); };
      v.onerror = () => { v.remove(); if (REAL && H.youtube) yt(); };
      const src = document.createElement("source"); src.src = ROOT + H.mp4; src.type = "video/mp4";
      src.onerror = v.onerror; v.append(src); box.append(v);
      function yt() {
        const y = H.youtube, f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${y.id}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&start=${y.start}&end=${y.end}&loop=1&playlist=${y.id}`;
        f.allow = "autoplay; encrypted-media"; f.tabIndex = -1; f.title = "background";
        f.onload = () => setTimeout(() => box.classList.add("on"), 1200);   // hide YouTube's title flash
        box.append(f);
      }
    },
    homeLive(g) {
      const hp = document.getElementById("hero-pill");
      hp.classList.toggle("on", !!g); hp.querySelector("span").textContent = g ? "Weasel is live" : "Weasel is offline";
      const f = document.getElementById("featured");
      if (g) {
        const j = g.join || {}, jh = href(j.url) || L.tiktok;
        f.innerHTML = `<a class="art" href="${page(g.slug)}" style="background-image:url(${art(g)})"><span class="pill on"><i></i>Live now</span></a>
          <div class="info"><div class="kicker">Weasel is playing</div><h2>${esc(g.title)}</h2><p>${esc(g.tagline)} ${esc(j.note || "")}</p>
          <div class="row"><a class="btn live big" href="${esc(jh)}" ${/^https?:/.test(jh) ? 'target="_blank" rel="noopener"' : ""}>${esc(j.url ? j.label : "Watch and type in chat")}</a>
          <a class="btn ghost" href="${page(g.slug)}">How to play</a></div></div>`;
      }
      document.querySelectorAll(".gcard").forEach(c => {
        const s = c.querySelector(".badge-slot"), gg = byslug(c.dataset.slug);
        s.innerHTML = (g && g.slug === gg.slug) ? '<span class="badge live">Live now</span>' : statusBadge(gg);
      });
    },

    game() {
      const g = byslug(B.dataset.game); if (!g) return;
      document.title = g.title + " · weaselwonder";
      const join = g.join || {};
      const m = document.getElementById("main");
      const cta = g.offline.map(o => {
        if (!o.url) return `<div class="cta-row"><span class="btn ${o.primary ? "big" : "ghost"} soon" aria-disabled="true">${esc(o.label)} <em>Soon</em></span>
          ${o.note ? `<small>${esc(o.note)}</small>` : ""}</div>`;
        const h = href(o.url);
        return `<div class="cta-row"><a class="btn ${o.primary ? "big" : "ghost"}" href="${esc(h)}" ${/^https?:/.test(h) ? 'target="_blank" rel="noopener"' : ""}>${esc(o.label)}</a>
          ${o.note ? `<small>${esc(o.note)}</small>` : ""}</div>`;
      }).join("");
      const vods = (g.vods || []).length ? g.vods.map(v => `
          <a class="vod" href="${esc(v.url || "#todo:vod")}" target="_blank" rel="noopener">${v.thumb ? `<span class="thumb" style="background-image:url(${ROOT}assets/art/${v.thumb})"><span class="play">▶</span></span>` : '<span class="play">▶</span>'}
          <span><b>${esc(v.title)}</b><br><small>${esc(v.date)} · ${esc(v.length)}${v.url ? "" : " · link to add"}</small></span></a>`).join("")
        : `<p class="empty">No past streams yet. Follow on <a href="${L.tiktok}">TikTok</a> or <a href="${L.twitch}">Twitch</a> to catch the first one.</p>`;
      m.innerHTML = `
      <div class="gtop"><div class="wrap"><span class="pill on" style="background:#0003"><i></i>Live</span>
        <b>Weasel is live with ${esc(g.title)} now</b>
        <a class="btn" href="${esc(href(join.url) || L.tiktok)}" target="_blank" rel="noopener">${esc(join.url ? join.label : "Watch and type in chat")}</a></div></div>
      <section class="ghero" style="--hero-img:url(${art(g)})"><div class="wrap">
        <h1 class="logo">${esc(g.title)}</h1>
        <p class="lede">${esc(g.tagline)} ${esc(g.blurb)}</p>
        ${g.variants ? `<div class="variants">${g.variants.map(v => `<span class="badge">${esc(v)}</span>`).join("")}</div>` : ""}
        <div class="ctas">${cta}</div>
        <div class="live-cta"><a class="btn live big" href="${esc(href(join.url) || L.tiktok)}" target="_blank" rel="noopener">${esc(join.url ? join.label : "Watch and type in chat")}</a>
          <small>Weasel is live with ${esc(g.title)} right now. ${esc(join.note || "")}</small></div>
        <div class="meta">${statusBadge(g)}<span class="badge">Latest build ${esc(g.version)} · ${esc(g.versionDate)}</span></div>
        <div class="devnote">Prototype: buttons for pages not built yet show where they will go after the push.</div>
      </div></section>
      <section class="sec"><div class="wrap"><h2 class="t">How it works</h2>
        <p class="sub">${esc(join.note || "")}</p>
        <div class="how">${g.how.map((h, i) => `<div><b><span>${i + 1}</span>${esc(h[0])}</b><p>${esc(h[1])}</p></div>`).join("")}</div></div></section>
      <section class="sec"><div class="wrap"><h2 class="t">In game</h2>
        <div class="shots">${g.shots.map(s => `<figure class="shot"><div style="background-image:url(${ROOT}assets/art/${s[1]})"></div><figcaption>${esc(s[0])}</figcaption></figure>`).join("")}</div>
        <div class="devnote">Screenshot slots: real in-game captures go in assets/shots/${g.slug}/ before launch.</div></div></section>
      <section class="sec" id="vods"><div class="wrap"><h2 class="t">Past streams</h2><div class="vods">${vods}</div></div></section>`;
    },

    streamer() {
      const m = document.getElementById("main");
      const pick = () => {
        m.innerHTML = `<section class="sec"><div class="wrap">
          <div class="row" style="justify-content:space-between"><div><div class="kicker">Streamer mode</div>
          <h1 class="logo" style="font-size:52px;margin:6px 0">Pick tonight's game</h1></div>
          <div class="row"><span class="pill" id="sp"><i></i><span>Offline</span></span>
          <button class="btn ghost" id="go-off">Go offline</button>
          <a class="btn ghost" href="${PROTO ? "#" : "/api/stream-logout"}">Log out</a></div></div>
          <p class="sub">"Go live and open" puts the game on the home page for viewers and opens its streamer view in a new tab (use that tab as the OBS browser source, 1920x1080). Come back here and press "Go offline" when you finish.</p>
          <div class="slist">${G.map(g => `
            <div class="srow" data-slug="${g.slug}"><div class="img" style="background-image:url(${art(g)})"></div>
              <div><h3>${esc(g.title)}</h3><small>${esc(g.version)} · ${esc(g.versionDate)} · ${g.stream && g.stream.url ? esc(g.stream.url) : "no stream mode yet"}</small></div>
              <div class="acts">${g.stream && g.stream.url
                ? `<a class="btn live" data-go="${g.slug}" href="${esc(href(g.stream.url))}" target="_blank" rel="noopener">Go live and open</a>`
                : `<span class="btn soon" aria-disabled="true">Go live <em>Soon</em></span>`}</div></div>`).join("")}</div>
          <div class="chatset"><h2 class="t" style="font-size:24px">Chat connections</h2>
            <p class="sub">Used by every game's streamer view (ZombieRats and Corpse Crafter). Saved in this browser only. Reload the game tab after saving.</p>
            <form id="chatform" class="cform">
              <label>Twitch channel<input name="twitch" autocomplete="off" placeholder="weaselwonder"></label>
              <label>TikTok username<input name="ttUser" autocomplete="off" placeholder="weaselwonder"></label>
              <label>tik.tools API key<input name="ttKey" type="password" autocomplete="off" placeholder="from your tik.tools account"></label>
              <div class="row"><button class="btn">Save</button><button type="button" class="btn ghost" id="showkey">Show key</button><span id="chatmsg" class="sub" style="margin:0"></span></div>
            </form>
            <p class="sub" style="font-size:14px">TikTok chat and gifts come through tik.tools while you are live on TikTok. Twitch chat needs no key.</p></div>
          <div class="devnote">Prototype: Go live here flips the mock state, so open the home page to see the live view.</div>
        </div></section>`;
        // Opens the game's host view in a new tab (so it is never popup-blocked) and marks the site live at the same moment.
        m.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => setLive(b.dataset.go)));
        document.getElementById("go-off").onclick = () => setLive("");
        const cf = document.getElementById("chatform");
        if (cf && window.WWChat) {
          const v = WWChat.get(); cf.twitch.value = v.twitch; cf.ttUser.value = v.ttUser; cf.ttKey.value = v.ttKey;
          cf.onsubmit = e => { e.preventDefault();
            const ok = WWChat.set({ twitch: cf.twitch.value.trim().replace(/^#/, ""), ttUser: cf.ttUser.value.trim(), ttKey: cf.ttKey.value.trim() });
            document.getElementById("chatmsg").textContent = ok ? (cf.ttKey.value.trim() ? "Saved. TikTok and Twitch ready." : "Saved. Add the tik.tools key for TikTok.") : "Could not save in this browser."; };
          document.getElementById("showkey").onclick = e => { cf.ttKey.type = cf.ttKey.type === "password" ? "text" : "password"; e.target.textContent = cf.ttKey.type === "password" ? "Show key" : "Hide key"; };
        }
        renderers.streamerLive(live.live && byslug(live.game));
      };
      if (PROTO) {
        m.innerHTML = `<form class="login" id="lg"><div class="kicker">weaselwonder</div><h2 style="font-family:var(--head);font-weight:400;font-size:32px;margin:8px 0 0">Streamer</h2>
          <input type="password" placeholder="Password" autofocus><button class="btn big" style="width:100%">Enter</button>
          <div class="devnote">Prototype: any password works. On the real site the server checks it before this page loads.</div></form>`;
        document.getElementById("lg").onsubmit = e => { e.preventDefault(); pick(); };
      } else pick();
    },
    streamerLive(g) {
      document.querySelectorAll(".srow").forEach(r => {
        const on = g && r.dataset.slug === g.slug; r.classList.toggle("active", !!on);
        const b = r.querySelector("[data-go]"); if (b) b.textContent = on ? "Live now: reopen" : "Go live and open";
      });
      const sp = document.getElementById("sp");
      if (sp) { sp.classList.toggle("on", !!g); sp.querySelector("span").textContent = g ? "Live: " + g.title : "Offline"; }
    }
  };

  async function setLive(slug) {
    if (PROTO) { mockSet(slug); }
    else {
      await fetch("/api/live", { method: "POST", keepalive: true, headers: { "content-type": "application/json" }, body: JSON.stringify({ game: slug || null }) }).catch(() => {});
    }
    live = await readLive(); applyLive(); devbar();
  }

  // prototype toggle bar
  function devbar() {
    if (!PROTO) return;
    let d = document.getElementById("devbar");
    if (!d) { d = document.createElement("div"); d.id = "devbar"; d.className = "devbar"; B.append(d); }
    const cur = live.live ? live.game : "";
    d.innerHTML = `<span>Preview:</span><select id="dv-live" aria-label="Preview live state">
        <option value="">Weasel is offline</option>${G.map(g => `<option value="${g.slug}" ${cur === g.slug ? "selected" : ""}>Live with ${esc(g.title)}</option>`).join("")}</select>
      <button data-nav="home">Home</button><button data-nav="game">Live game page</button><button data-nav="streamer">/streamer</button>`;
    d.querySelector("#dv-live").value = cur;
    d.querySelector("#dv-live").onchange = e => setLive(e.target.value);
    d.querySelectorAll("[data-nav]").forEach(b => b.onclick = () => {
      const n = b.dataset.nav, slug = live.live ? live.game : G[0].slug;
      location.href = ROOT + (n === "home" ? "index.html" : n === "game" ? "games/" + slug + "/index.html" : n === "notes" ? "notes.html" : "streamer/index.html");
    });
  }

  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#todo:"]');
    if (a) { e.preventDefault(); toast("Not built yet. After the push this opens " + a.getAttribute("href").slice(6)); }
  });

  function toast(t) {
    let el = document.getElementById("ww-toast");
    if (!el) { el = document.createElement("div"); el.id = "ww-toast"; el.style.cssText = "position:fixed;left:50%;top:80px;transform:translateX(-50%);z-index:100;background:#000e;border:1px solid var(--gold);color:var(--gold2);padding:12px 16px;border-radius:12px;font:600 14px Inter,sans-serif;max-width:90vw;text-align:center"; B.append(el); }
    el.textContent = t; el.hidden = false; clearTimeout(el._t); el._t = setTimeout(() => el.hidden = true, 3500);
  }
  chrome();
  (renderers[B.dataset.page] || (() => {}))();
  if (B.dataset.page === "home") renderers.heroVideo();
  readLive().then(v => { live = v; applyLive(); devbar(); });
  if (REAL) setInterval(async () => { const v = await readLive(); if (v.live !== live.live || v.game !== live.game) { live = v; applyLive(); } }, 20000);
})();
