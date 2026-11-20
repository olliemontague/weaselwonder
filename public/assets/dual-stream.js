/* weaselwonder dual stream: the main window stays landscape (Twitch), and a portrait
   pop-up shows the same live game view cropped to 9:16 (TikTok). Specs: project doc
   claude/dual-stream-specs.md. Loaded on host views only (Corpse Crafter host, ZombieRats /stream).
   The pop-up gets live video of the game's canvases via canvas.captureStream(), so it costs
   no extra game rendering and always shows exactly what the main window shows. */
(function () {
  if (window.WWDual) return;
  const PATH = location.pathname;
  const isHost = PATH.startsWith("/corpsecrafter/weasel") || PATH.startsWith("/zombierats");
  if (!isHost) return;
  const PREFERRED = PATH.startsWith("/corpsecrafter") ? "#hgl" : null;   // Corpse Crafter host game canvas
  let popup = null, timer = null;

  const vis = c => c.offsetWidth > 60 && c.offsetHeight > 60 && getComputedStyle(c).visibility !== "hidden";
  function mainCanvas() {
    const p = PREFERRED && document.querySelector(PREFERRED);
    if (p && vis(p)) return p;
    // otherwise the biggest portrait-shaped canvas on the page (the TikTok game column)
    return [...document.querySelectorAll("canvas")].filter(vis)
      .map(c => ({ c, r: c.getBoundingClientRect() }))
      .sort((a, b) => ((b.r.height > b.r.width) - (a.r.height > a.r.width)) || (b.r.width * b.r.height - a.r.width * a.r.height))
      .map(x => x.c)[0] || null;
  }
  function layers(main) {
    const box = main.getBoundingClientRect();
    const inside = r => { const ix = Math.max(0, Math.min(r.right, box.right) - Math.max(r.left, box.left)), iy = Math.max(0, Math.min(r.bottom, box.bottom) - Math.max(r.top, box.top)); return (ix * iy) / Math.max(1, r.width * r.height); };
    const list = [...document.querySelectorAll("canvas")].filter(c => vis(c) && inside(c.getBoundingClientRect()) > 0.8);
    return { box, list: list.length ? list : [main] };
  }

  function attach(win) {
    const main = mainCanvas();
    const stage = win.document.getElementById("stage"), msg = win.document.getElementById("msg");
    if (!main) { msg.textContent = "No game view found. Start the game in the main window, then press R here."; return; }
    msg.textContent = "";
    stage.innerHTML = "";
    const { list } = layers(main);
    const vids = list.map(c => {
      const v = win.document.createElement("video");
      v.muted = true; v.autoplay = true; v.playsInline = true;
      try { v.srcObject = c.captureStream(30); } catch (e) { msg.textContent = "This browser cannot share the game view (" + e.message + ")"; }
      v.play().catch(() => {});
      stage.append(v);
      return { c, v };
    });
    clearInterval(timer);
    const place = () => {
      if (!win || win.closed) { clearInterval(timer); return; }
      const { box } = layers(main), W = win.innerWidth, H = win.innerHeight;
      const s = Math.max(W / box.width, H / box.height);          // fill the 9:16 window, crop the overflow
      const ox = (W - box.width * s) / 2, oy = (H - box.height * s) / 2;
      vids.forEach(({ c, v }) => {
        const r = c.getBoundingClientRect();
        Object.assign(v.style, { left: ox + (r.left - box.left) * s + "px", top: oy + (r.top - box.top) * s + "px", width: r.width * s + "px", height: r.height * s + "px" });
      });
    };
    place(); timer = setInterval(place, 1000); win.addEventListener("resize", place);
  }

  function open() {
    if (popup && !popup.closed) { popup.focus(); return; }
    popup = window.open("/streamer/portrait.html", "ww_tiktok_portrait", "popup,width=540,height=960");
    if (!popup) { alert("Allow pop-ups for weaselwonder.com to open the TikTok window."); return; }
  }
  window.WWDual = { attach, open };

  const JUICY = "display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin:8px 0 2px;padding:12px 14px;border:0;border-radius:12px;cursor:pointer;" +
    "font:800 15px system-ui,sans-serif;color:#fff;background:linear-gradient(90deg,#25f4ee,#fe2c55);text-shadow:0 1px 2px #0006;" +
    "box-shadow:0 4px 0 #8a1830,0 8px 18px #fe2c5555";
  function makeBtn(id) {
    const b = document.createElement("button"); b.type = "button"; b.id = id;
    b.innerHTML = "&#9654;&#xFE0E; Open TikTok portrait window"; b.style.cssText = JUICY; b.onclick = open; return b;
  }
  function button() {
    // Corpse Crafter: inside the settings drawer (H), above the Stream buttons.
    const place = () => {
      if (document.getElementById("dTikTok")) return true;
      const full = document.getElementById("dFull"); if (!full) return false;
      const grid = full.closest(".grid") || full;
      grid.before(makeBtn("dTikTok")); return true;
    };
    if (place()) return;
    let n = 0;
    const iv = setInterval(() => {
      if (place()) return clearInterval(iv);
      if (++n > 10) {                       // pages without that drawer (ZombieRats): a corner button, Alt+B hides it
        clearInterval(iv);
        const f = makeBtn("ww-dual-btn");
        f.style.cssText += ";position:fixed;left:12px;bottom:12px;width:auto;z-index:2147483000;opacity:.85";
        document.body.append(f);
        addEventListener("keydown", e => { if (e.key === "b" && e.altKey) f.hidden = !f.hidden; });
      }
    }, 300);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", button); else button();
})();
