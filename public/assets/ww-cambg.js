// Weaselwonder camera background (Twitch landscape only).
// Paints a backdrop inside a game's gold camera frame, behind the OBS webcam (which needs background removal).
// One choice per session, saved in this browser (localStorage "ww_cambg"), picked on /streamer and mirrored in each game's settings.
// Changing it anywhere updates every open game tab straight away (storage event + BroadcastChannel "ww-session").
//
//   WWCamBg.attach(frameEl, {game:'zombierats'})   paint the backdrop inside the frame (call once)
//   WWCamBg.select({game:'zombierats'})            returns a <select> wired to the shared choice
//   WWCamBg.get() / WWCamBg.set(id)                read / change the choice ('auto' = the game's own backdrop)
(function () {
  if (window.WWCamBg) return;
  const BASE = location.protocol === 'file:' ? 'https://weaselwonder.com' : '';
  const LIST = [
    {id: 'auto', name: 'Match the game'},
    {id: 'none', name: 'None (transparent)'},
    {id: 'chess', name: 'Chess study'},
    {id: 'zombierats', name: 'ZombieRats cabin'},
    {id: 'corpse', name: 'Corpse Crafter dugout'},
    {id: 'sub-red', name: 'Submarine: red ops room'},
    {id: 'sub-ww2', name: 'Submarine: WW2 control room'},
  ];
  // the backdrop each game uses on "Match the game"
  const GAME = {zombierats: 'zombierats', crazychess: 'chess', navychess: 'sub-red', 'corpse-crafter': 'corpse'};
  const KEY = 'ww_cambg', frames = [], selects = [];
  const url = id => `${BASE}/assets/cambg/${id}.webp`;
  const get = () => { try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; } };
  const resolve = (id, game) => id === 'auto' ? (GAME[game] || 'none') : id;
  let bc = null; try { bc = new BroadcastChannel('ww-session'); } catch (e) {}
  function refresh() {
    const id = get();
    for (const f of frames) {
      const r = resolve(id, f.game());
      f.bg.style.backgroundImage = r === 'none' ? 'none' : `url("${url(r)}")`;
      f.bg.style.display = r === 'none' ? 'none' : 'block';
    }
    for (let i = selects.length - 1; i >= 0; i--) { const s = selects[i]; if (!s.isConnected && s.__seen) { selects.splice(i, 1); continue; } if (s.isConnected) s.__seen = true; if (s.value !== id) s.value = id; }
  }
  function set(id) {
    if (!LIST.some(x => x.id === id)) id = 'auto';
    try { localStorage.setItem(KEY, id); } catch (e) {}
    refresh(); if (bc) try { bc.postMessage({t: 'cambg', id}); } catch (e) {}
  }
  function attach(frame, opts) {
    if (!frame || frame.__wwcambg) return; frame.__wwcambg = true; opts = opts || {};
    const bg = document.createElement('div'); bg.className = 'ww-cambg';
    // sits inside the 4px gold border, follows its rounding, edges softened into the frame
    bg.style.cssText = 'position:absolute;inset:0;border-radius:14px;overflow:hidden;z-index:0;pointer-events:none;' +
      'background:#120e0a center/cover no-repeat;box-shadow:inset 0 0 24px 6px rgba(0,0,0,.55);filter:brightness(.88) saturate(.95)';
    if (getComputedStyle(frame).position === 'static') frame.style.position = 'relative';
    frame.insertBefore(bg, frame.firstChild);
    for (const c of frame.children) if (c !== bg && !c.style.zIndex) { if (getComputedStyle(c).position === 'static') c.style.position = 'relative'; c.style.zIndex = '1'; }
    if (opts.radius != null) bg.style.borderRadius = opts.radius;
    const game = typeof opts.game === 'function' ? opts.game : () => opts.game;
    frames.push({frame, bg, game}); refresh();
    return {refresh};
  }
  function select(opts) {
    opts = opts || {}; const s = document.createElement('select'); s.className = 'ww-cambg-select';
    const game = typeof opts.game === 'function' ? opts.game() : opts.game;
    for (const x of LIST) { const o = document.createElement('option'); o.value = x.id;
      o.textContent = x.id === 'auto' && game ? `Match the game (${(LIST.find(y => y.id === resolve('auto', game)) || {name: 'none'}).name})` : x.name; s.appendChild(o); }
    s.value = get(); s.onchange = () => set(s.value); s.onkeydown = e => e.stopPropagation();
    selects.push(s); return s;
  }
  window.addEventListener('storage', e => { if (e.key === KEY) refresh(); });
  if (bc) bc.addEventListener('message', e => { if (e.data && e.data.t === 'cambg') refresh(); });
  window.WWCamBg = {LIST, GAME, get, set, attach, select, url, refresh};
})();
