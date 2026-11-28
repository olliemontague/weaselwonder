// SubIn "I'm live" modal for weaselwonder.com (SubIn streamer-site embed, v1).
// SubIn Studio -> subin.live -> signed POST to /api/subin-hook -> KV subin.json -> this script shows the modal.
// Live streams now happen on subin.live/streamers/weaselwonder; the old on-site live features are archived.
(() => {
  const WATCH = "https://subin.live/streamers/weaselwonder";
  const KEY = "ww_subin_dismissed";
  const mark = '<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 41V8l-9 10" stroke="#FF6B35"/><path d="M30 7v33l9-10" stroke="#FF4F8B"/></g></svg>';
  const mono = '<svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 41V8l-9 10"/><path d="M30 7v33l9-10"/></g></svg>';
  const css = `
  .si-scrim{position:fixed;inset:0;z-index:9999;background:rgba(20,20,43,.62);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px}
  .si-card{width:100%;max-width:560px;background:#F7F7FB;color:#14142B;border-radius:24px;overflow:hidden;box-shadow:0 30px 80px rgba(20,20,43,.35);font:16px/1.5 Inter,system-ui,sans-serif;animation:si-rise .35s ease-out both}
  .si-top{display:flex;align-items:center;gap:8px;padding:14px 16px}
  .si-logo{display:flex;align-items:center;gap:5px;font:600 21px 'Space Grotesk',Inter,sans-serif;letter-spacing:-.8px}
  .si-live{height:24px;padding:0 8px;border-radius:6px;background:#FF4F8B;color:#14142B;font-size:11px;font-weight:700;display:flex;align-items:center;gap:5px}
  .si-live i{width:6px;height:6px;border-radius:3px;background:#14142B;animation:si-p 1.4s infinite}
  .si-x{margin-left:auto;width:36px;height:36px;border-radius:10px;border:1px solid #E2E3EC;background:#fff;color:#14142B;font-size:18px;cursor:pointer}
  .si-media{position:relative;margin:0 16px;border-radius:16px;overflow:hidden;aspect-ratio:16/9;background:#1F1F3D}
  .si-media video,.si-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .si-tag{position:absolute;left:10px;top:10px;height:24px;padding:0 8px;border-radius:6px;background:rgba(20,20,43,.8);color:#F6F4EF;font-size:11px;font-weight:600;display:flex;align-items:center}
  .si-body{padding:18px 20px 20px;display:flex;flex-direction:column;gap:12px}
  .si-h{font:600 32px/1.1 'Space Grotesk',Inter,sans-serif;letter-spacing:-.8px;margin:0}
  .si-p{margin:0;font-size:15px;color:#3A3C58}
  .si-cta{height:56px;border-radius:16px;background:#FF6B35;color:#14142B!important;font:600 20px 'Space Grotesk',Inter,sans-serif;display:flex;align-items:center;justify-content:center;gap:9px;text-decoration:none}
  .si-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:13px;color:#5E6078}
  .si-foot button{border:0;background:none;color:#5E6078;font-weight:600;font-size:13px;cursor:pointer;padding:6px 0}
  .si-bar{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:10px 16px;background:#14142B;color:#F6F4EF!important;font:600 14px Inter,sans-serif;text-decoration:none}
  .si-bar em{font-style:normal;color:#FF8A5C}
  @media(max-width:600px){.si-scrim{align-items:flex-end;padding:0}.si-card{border-radius:24px 24px 0 0}.si-h{font-size:26px}.si-cta{font-size:18px}}
  @keyframes si-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
  @keyframes si-p{50%{opacity:.35}}`;
  const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let shownFor = null, bar = null, scrim = null;

  function clear() { if (bar) bar.remove(); if (scrim) scrim.remove(); bar = scrim = null; }
  function showBar(s) {
    if (bar) return;
    bar = document.createElement("a"); bar.className = "si-bar"; bar.href = s.watch || WATCH;
    bar.innerHTML = `<span class="si-live"><i></i>LIVE</span>weasel is live on SubIn${s.gameTitle ? " with " + esc(s.gameTitle) : ""}<em>Watch and SubIn &rarr;</em>`;
    document.body.prepend(bar);
  }
  function showModal(s) {
    const media = s.clip ? (/\.(mp4|webm)(\?|$)/i.test(s.clip) ? `<video src="${esc(s.clip)}" autoplay muted loop playsinline></video>` : `<img src="${esc(s.clip)}" alt="">`) : `<img src="/assets/art/stream-poster.jpg" alt="">`;
    scrim = document.createElement("div"); scrim.className = "si-scrim";
    scrim.innerHTML = `<div class="si-card" role="dialog" aria-modal="true" aria-label="weaselwonder is live on SubIn">
      <div class="si-top"><span class="si-logo">SubIn${mark}</span><span class="si-live"><i></i>LIVE NOW</span><button class="si-x" type="button" aria-label="Close">&times;</button></div>
      <div class="si-media">${media}<span class="si-tag">Preview clip</span></div>
      <div class="si-body"><h2 class="si-h">Weaselwonder is live now on SubIn.live</h2>
        <p class="si-p">${s.gameTitle ? "Playing " + esc(s.gameTitle) + ". " : ""}Watch the stream, type in chat, and take a seat in the game.</p>
        <a class="si-cta" href="${esc(s.watch || WATCH)}">Watch the Stream and SubIn${mono}</a>
        <div class="si-foot"><span>Opens subin.live/streamers/weaselwonder</span><button type="button" class="si-not">Not now</button></div></div></div>`;
    const close = () => { try { sessionStorage.setItem(KEY, s.since || "1"); } catch (e) {} scrim.remove(); scrim = null; showBar(s); };
    scrim.querySelector(".si-x").onclick = close; scrim.querySelector(".si-not").onclick = close;
    scrim.addEventListener("click", e => { if (e.target === scrim) close(); });
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape" && scrim) { close(); document.removeEventListener("keydown", k); } });
    document.body.append(scrim);
    scrim.querySelector(".si-cta").focus({ preventScroll: true });
  }
  async function poll() {
    let s = null;
    const q = new URLSearchParams(location.search).get("subinlive"); // preview: ?subinlive=corpse-crafter
    if (q) s = { live: true, game: q, gameTitle: q.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), since: "preview", watch: WATCH };
    else { try { const r = await fetch("/api/subin-live", { cache: "no-store" }); if (r.ok) s = await r.json(); } catch (e) {} }
    if (!s || !s.live) { shownFor = null; clear(); return; }
    if (shownFor === (s.since || "1")) return;
    clear(); shownFor = s.since || "1";
    let dismissed = null; try { dismissed = sessionStorage.getItem(KEY); } catch (e) {}
    if (dismissed === shownFor) showBar(s); else showModal(s);
  }
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);
  if (!document.querySelector('link[href*="Space+Grotesk"]')) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&display=swap"; document.head.append(l); }
  poll(); setInterval(poll, 30000);
})();
