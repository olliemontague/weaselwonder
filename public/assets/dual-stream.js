/* weaselwonder dual stream: the main window stays landscape (Twitch), and a portrait
   pop-up shows the same live game view cropped to 9:16 (TikTok). Specs: project doc
   claude/dual-stream-specs.md. Loaded on host views only (Corpse Crafter host, ZombieRats /stream).
   The pop-up gets live video of the game's canvases via canvas.captureStream(), so it costs
   no extra game rendering and always shows exactly what the main window shows. */
(function () {
  if (window.WWDual) return;
  const PATH = location.pathname;
  const isHost = PATH.startsWith("/corpsecrafter/weasel");   // ZombieRats and CrazyChess draw their own portrait (ww-stage.js)
  if (!isHost) return;
  const PREFERRED = PATH.startsWith("/corpsecrafter") ? "#hgl" : null;   // Corpse Crafter host game canvas
  let popup = null, timer = null;

  // Every canvas on the page, including canvases inside same-origin iframes (ZombieRats /zombierats/ runs the game in an
  // iframe). Each entry knows its rectangle in this window's coordinates, allowing for a scaled stage around the iframe.
  function entries() {
    const out = [...document.querySelectorAll("canvas")].map(c => ({ c, rect: () => c.getBoundingClientRect() }));
    for (const f of document.querySelectorAll("iframe")) {
      let d = null; try { d = f.contentDocument; } catch (e) {}
      if (!d) continue;
      for (const c of d.querySelectorAll("canvas")) out.push({ c, rect: () => {
        const a = f.getBoundingClientRect(), sx = a.width / (f.offsetWidth || 1), sy = a.height / (f.offsetHeight || 1), b = c.getBoundingClientRect();
        const left = a.left + (f.clientLeft + b.left) * sx, top = a.top + (f.clientTop + b.top) * sy, width = b.width * sx, height = b.height * sy;
        return { left, top, width, height, right: left + width, bottom: top + height };
      } });
    }
    return out;
  }
  const vis = e => { const c = e.c, w = c.ownerDocument.defaultView; return c.offsetWidth > 60 && c.offsetHeight > 60 && w.getComputedStyle(c).visibility !== "hidden" && w.getComputedStyle(c).display !== "none"; };
  function mainCanvas() {
    const all = entries().filter(vis);
    const p = PREFERRED && all.find(e => e.c.matches(PREFERRED));
    if (p) return p;
    // otherwise the biggest portrait-shaped canvas on the page (the TikTok game column)
    return all.map(e => ({ e, r: e.rect() }))
      .sort((a, b) => ((b.r.height > b.r.width) - (a.r.height > a.r.width)) || (b.r.width * b.r.height - a.r.width * a.r.height))
      .map(x => x.e)[0] || null;
  }
  function layers(main) {
    const box = main.rect();
    const inside = r => { const ix = Math.max(0, Math.min(r.right, box.right) - Math.max(r.left, box.left)), iy = Math.max(0, Math.min(r.bottom, box.bottom) - Math.max(r.top, box.top)); return (ix * iy) / Math.max(1, r.width * r.height); };
    const list = entries().filter(e => vis(e) && inside(e.rect()) > 0.8);
    return { box, list: list.length ? list : [main] };
  }

  function attach(win) {
    const main = mainCanvas();
    const stage = win.document.getElementById("stage"), msg = win.document.getElementById("msg");
    if (!main) { msg.textContent = "No game view found. Start the game in the main window, then press R here."; return; }
    msg.textContent = "";
    stage.innerHTML = "";
    const { list } = layers(main);
    const vids = list.map(e => {
      const v = win.document.createElement("video");
      v.muted = true; v.autoplay = true; v.playsInline = true;
      try { v.srcObject = e.c.captureStream(30); } catch (err) { msg.textContent = "This browser cannot share the game view (" + err.message + ")"; }
      v.play().catch(() => {});
      stage.append(v);
      return { e, v };
    });
    clearInterval(timer);
    const place = () => {
      if (!win || win.closed) { clearInterval(timer); return; }
      const { box } = layers(main), W = win.innerWidth, H = win.innerHeight;
      const s = Math.max(W / box.width, H / box.height);          // fill the 9:16 window, crop the overflow
      // Corpse Crafter wide view: centre the 9:16 slice on Weasel (the engine reports his screen x as CC_PX, 0..1)
      const fx = typeof window.CC_PX === "number" ? Math.max(0, Math.min(1, window.CC_PX)) : 0.5;
      const ox = Math.max(W - box.width * s, Math.min(0, W / 2 - box.width * s * fx)), oy = (H - box.height * s) / 2;
      vids.forEach(({ e, v }) => {
        const r = e.rect();
        Object.assign(v.style, { left: ox + (r.left - box.left) * s + "px", top: oy + (r.top - box.top) * s + "px", width: r.width * s + "px", height: r.height * s + "px" });
      });
    };
    place(); timer = setInterval(place, typeof window.CC_WIDE === "object" && window.CC_WIDE ? 33 : 1000); win.addEventListener("resize", place);
  }

  // The session's TikTok portrait window (opened from /streamer) gets a frame we fill with the live game video.
  const FRAME = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;background:#000;overflow:hidden;font:600 15px system-ui,sans-serif;color:#cfd8d8}#stage{position:fixed;inset:0;overflow:hidden}#stage video{position:absolute;object-fit:fill;pointer-events:none}#msg{position:fixed;inset:auto 16px 16px 16px;text-align:center;text-shadow:0 1px 4px #000}</style></head><body><div id="stage"></div><div id="msg">Connecting to the game...</div></body></html>';
  function mount(api) {
    const c = api.claim(PATH.startsWith("/corpsecrafter") ? "corpse-crafter" : "game");
    c.doc.open(); c.doc.write(FRAME); c.doc.close();
    const go = () => attach(c.win); if (mainCanvas()) go(); else setTimeout(go, 1500);
    return c.token;
  }
  window.WWDual = { attach };
  function start() {
    if (window.WWStage) return WWStage.attach("dual", mount);
    const sc = document.createElement("script"); sc.src = "/assets/ww-stage.js"; sc.onload = () => WWStage.attach("dual", mount); document.head.appendChild(sc);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
