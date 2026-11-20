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

  function button() {
    const b = document.createElement("button");
    b.id = "ww-dual-btn"; b.type = "button"; b.title = "Open the portrait TikTok window (key T)";
    b.textContent = "TikTok window (T)";
    b.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:2147483000;font:700 13px system-ui,sans-serif;padding:8px 12px;border-radius:10px;border:1px solid #25f4ee;background:#0b1214e6;color:#e8fbfc;cursor:pointer;opacity:.75";
    b.onmouseenter = () => b.style.opacity = "1"; b.onmouseleave = () => b.style.opacity = ".75";
    b.onclick = open;
    document.body.append(b);
    addEventListener("keydown", e => {
      if ((e.key === "t" || e.key === "T") && !/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ""))) open();
      if (e.key === "b" && e.altKey) b.hidden = !b.hidden;   // Alt+B hides the button for clean captures
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", button); else button();
})();
