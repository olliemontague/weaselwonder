/* Corpse Crafter host: Twitch layout standard (claude/dual-stream-specs.md), wide game.
   On with ?layout=v2 (or window.CC_LAYOUT_V2 = true before this runs). Must load in <head>, before the game boots:
   it sets window.CC_WIDE, which the patched engine reads to render the host view at 16:9 (1707x960 world units, map
   centred, forest beyond both edges) and to keep its own HUD inside the clear centre column (x 434..1273 of 1707 =
   screen 488..1432). Phone players are untouched: they never set CC_WIDE. */
(function () {
  const on = window.CC_LAYOUT_V2 || /[?&]layout=v2\b/.test(location.search);
  if (!on) return;
  window.CC_WIDE = { x: 434, w: 839 };
  // 1920x1080 design units -> viewport units (the stream window is 16:9)
  const X = px => (px / 19.2).toFixed(3) + "vw", Y = px => (px / 10.8).toFixed(3) + "vh";
  const box = (x, y, w, h) => `left:${X(x)};top:${Y(y)};width:${X(w)};height:${Y(h)};`;
  const glass = "position:absolute;box-sizing:border-box;background:rgba(22,18,14,.58);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:2px solid rgba(232,195,122,.35);border-radius:16px;overflow:hidden;z-index:5;";
  const css = `
body[data-mode=host] #host{display:block!important;background:#070906}
#centre{position:absolute!important;inset:0!important;width:100vw!important;height:100vh!important;aspect-ratio:auto!important;box-shadow:none!important;z-index:1}
#right{display:none!important}
#left{display:contents!important}
#left:before{display:none!important}
#left > .hlogo{${glass}${box(24, 24, 440, 112)}padding:${Y(14)} ${X(20)};margin:0;font-size:${Y(44)};line-height:1}
#left > .hlogo .sub{font-size:${Y(13)};margin-top:${Y(8)}}
#left > .stats{${glass}${box(24, 160, 440, 200)}padding:${Y(16)} ${X(16)};margin:0;display:grid;grid-template-columns:1fr 1fr;gap:${Y(10)};align-content:center}
#left > .stats .stat{background:rgba(0,0,0,.25);border-radius:12px}
#left > .hcard:not(.join):not(.chatcard){${glass}${box(24, 384, 440, 272)}margin:0;padding:${Y(16)} ${X(18)}}
#left > .hcard.join{${glass}${box(24, 680, 440, 376)}margin:0;padding:${Y(18)} ${X(18)};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Y(14)};text-align:center}
#left > .hcard.join .qr{width:${Y(200)};height:${Y(200)}}
#left > .hcard.join .qr svg{width:100%;height:100%}
#left > .hcard.chatcard{${glass}${box(1456, 176, 440, 560)}margin:0;padding:${Y(16)} ${X(18)};display:flex;flex-direction:column}
#left > .hcard.chatcard .feed{flex:1;min-height:0;overflow:hidden}
#cc2e{${glass}${box(1456, 24, 440, 128)}padding:${Y(14)} ${X(18)};color:#f3ead8;font:600 ${Y(17)}/1.35 system-ui}
#cc2e b{color:#e8c37a;font-size:${Y(13)};letter-spacing:.08em;display:block;margin-bottom:${Y(6)}}
#cc2cam{position:absolute;${box(1456, 760, 440, 248)}box-sizing:border-box;border:4px solid #e8c37a;border-radius:18px;box-shadow:0 0 0 3px rgba(0,0,0,.6),0 10px 30px rgba(0,0,0,.5);z-index:5;pointer-events:none}
#cc2cam .name{position:absolute;left:50%;bottom:-${Y(18)};transform:translateX(-50%);padding:${Y(4)} ${X(18)};border-radius:10px;border:2px solid #000;background:#e8c37a;color:#1b140c;font:900 ${Y(20)} system-ui;letter-spacing:.06em;white-space:nowrap;z-index:2}
#hint{z-index:30}
`;
  const st = document.createElement("style"); st.id = "cc-layout-v2"; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function build() {
    const host = document.getElementById("host"); if (!host || document.getElementById("cc2cam")) return;
    const e = document.createElement("div"); e.id = "cc2e";
    e.innerHTML = "<b>HOW TO HELP</b>Haul bodies to a gold flag · stand still to build · gifts spawn zombies";
    const cam = document.createElement("div"); cam.id = "cc2cam"; cam.innerHTML = '<div class="name">WEASELWONDER</div>';
    host.appendChild(e); host.appendChild(cam);
    if (window.WWCamBg) WWCamBg.attach(cam, { game: "corpse-crafter" });
    dispatchEvent(new Event("resize"));   // the game re-measures its canvases
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
