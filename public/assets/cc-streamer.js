/* Corpse Crafter host page: if the browser is signed in at /streamer, sign in as weasel
   automatically. Runs before the game script (synchronous, in <head>). The server checks the
   streamer login cookie itself; the stored value only tells the page to connect as host. */
(function () {
  if (!location.pathname.startsWith("/corpsecrafter/weasel")) return;
  try {
    if (localStorage.getItem("ww_host_pw")) return;
    const x = new XMLHttpRequest();
    x.open("GET", "/api/stream-check", false);
    x.send();
    if (x.status === 200 && JSON.parse(x.responseText).ok) localStorage.setItem("ww_host_pw", "streamer-login");
  } catch (e) {}
})();

/* TikTok chat for Corpse Crafter without the local relay: when the relay address is "tiktools://",
   connect to tik.tools with the username and key saved on /streamer, and hand the page messages in
   the relay's own format ({type:"chat"|"gift"|"status", ...}). */
(function () {
  if (!location.pathname.startsWith("/corpsecrafter/weasel")) return;
  const Real = window.WebSocket;
  function TikTools(url) {
    const fake = { readyState: 0, onopen: null, onmessage: null, onclose: null, onerror: null, close() { closed = true; try { ws && ws.close(); } catch (e) {} } };
    let ws = null, closed = false;
    const emit = o => { try { fake.onmessage && fake.onmessage({ data: JSON.stringify(o) }); } catch (e) {} };
    let z = {}; try { z = JSON.parse(localStorage.getItem("zb_stream_settings") || "{}"); } catch (e) {}
    const user = String(z.ttUser || "").replace(/^@/, ""), key = z.ttKey || "";
    setTimeout(() => {
      if (!user || !key) { emit({ type: "status", text: "add your TikTok name and tik.tools key on /streamer" }); fake.onclose && fake.onclose({}); return; }
      ws = new Real("wss://api.tik.tools?uniqueId=" + encodeURIComponent(user) + "&apiKey=" + encodeURIComponent(key));
      ws.onopen = () => { fake.readyState = 1; fake.onopen && fake.onopen({}); emit({ type: "status", text: "TikTok @" + user + " via tik.tools" }); };
      ws.onmessage = e => {
        let m; try { m = JSON.parse(e.data); } catch (err) { return; }
        const ev = m.event || m.type, d = m.data || {}, u = d.user || {};
        const name = u.nickname || u.uniqueId || d.user_unique_id || d.uniqueId || "viewer";
        if (ev === "chat") emit({ type: "chat", user: name, text: d.comment || "" });
        else if (ev === "gift") {
          if (d.giftType === 1 && !d.repeatEnd) return;
          const n = d.repeatCount || 1;
          emit({ type: "gift", user: name, gift: d.giftName || "gift", count: n, coins: (d.diamondCount || 1) * n });
        } else if (m.error || ev === "error") emit({ type: "status", text: "TikTok: " + (m.error || d.message || "error") });
      };
      ws.onclose = () => { fake.readyState = 3; if (!closed) fake.onclose && fake.onclose({}); };
      ws.onerror = () => {};
    }, 0);
    return fake;
  }
  window.WebSocket = function (url, p) { return String(url).startsWith("tiktools://") ? TikTools(url) : (p === undefined ? new Real(url) : new Real(url, p)); };
  window.WebSocket.prototype = Real.prototype;
  ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach((k, i) => window.WebSocket[k] = i);
  try { const z = JSON.parse(localStorage.getItem("zb_stream_settings") || "{}"); if (z.ttKey && !/^tiktools:/.test(localStorage.getItem("cc-tt") || "")) localStorage.setItem("cc-tt", "tiktools://"); } catch (e) {}
})();

/* Stream session (r22): Corpse Crafter announces itself to /streamer, and gets an End game button in its settings
   drawer (H), under the TikTok window button. End game shows "Game ended" in this tab; /streamer unlocks the next game. */
(function () {
  if (!location.pathname.startsWith("/corpsecrafter/weasel")) return;
  const s = document.createElement("script");
  s.src = "/assets/ww-session.js";
  s.onload = () => { if (window.WWSession) WWSession.game({ slug: "corpse-crafter", title: "Corpse Crafter" }); };
  (document.head || document.documentElement).appendChild(s);
  const end = () => {
    if (!confirm("End Corpse Crafter? Chat closes and you pick the next game on /streamer.")) return;
    if (window.WWSession) WWSession.end(); else location.replace("/streamer/ended.html?game=Corpse%20Crafter");
  };
  let n = 0;
  const iv = setInterval(() => {
    if (document.getElementById("ccEnd")) return clearInterval(iv);
    const anchor = document.getElementById("dTikTok") || document.getElementById("dFull");
    if (anchor) {
      const b = document.createElement("button"); b.type = "button"; b.id = "ccEnd"; b.textContent = "⏹ End game";
      b.style.cssText = "display:block;width:100%;margin:8px 0 2px;padding:10px 14px;border:0;border-radius:12px;cursor:pointer;font:800 15px system-ui,sans-serif;color:#fff;background:#a8322a";
      b.onclick = end;
      (anchor.id === "dTikTok" ? anchor : (anchor.closest(".grid") || anchor)).after(b);
      return clearInterval(iv);
    }
    if (++n > 40) clearInterval(iv);
  }, 500);
})();

/* Camera background (Twitch only): the backdrop picked on /streamer, painted inside the cam frame, with a picker in the Stream settings. */
(function () {
  if (!location.pathname.startsWith("/corpsecrafter/weasel")) return;
  function go() {
    const v2 = document.getElementById("cc2cam"), f = v2 || document.querySelector(".camframe"); if (!f || !window.WWCamBg) return;
    WWCamBg.attach(f, v2 ? { game: "corpse-crafter" } : { game: "corpse-crafter", radius: "10px" });
    const grid = document.getElementById("dFrame") && document.getElementById("dFrame").parentElement;
    if (grid && !document.getElementById("dCamBg")) {
      const w = document.createElement("label"); w.id = "dCamBg"; w.style.cssText = "grid-column:1/-1;display:flex;gap:8px;align-items:center;font-size:13px";
      w.textContent = "Camera background "; const sel = WWCamBg.select({ game: "corpse-crafter" }); sel.style.flex = "1"; w.appendChild(sel); grid.appendChild(w);
    }
  }
  function load() {
    if (window.WWCamBg) return go();
    const s = document.createElement("script"); s.src = "/assets/ww-cambg.js"; s.onload = go; document.head.appendChild(s);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load); else load();
})();
