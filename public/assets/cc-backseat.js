/* Corpse Crafter: game-only mode for Backseat Studio (build 0001-gameonly).

   Turns the all-in-one host page (game plus stream overlay) into just the game:
   - landscape, filling the whole window (the engine's wide mode: 1707 x 960 world units, map centred);
   - the game's own overlay cards (title, squad, join QR, chat, camera frame, cam background) are hidden,
     because Backseat Studio draws its own overlays on top and lets the streamer configure them;
   - the in-game HUD stays inside the centre column that a 9:16 portrait slice keeps, so the same game
     works for Twitch (landscape) and TikTok (Studio crops the portrait slice);
   - the game tells Studio what the overlays need (title, squad, slots, how to help, join link) through
     the Backseat SDK v1 (window.Backseat), and obeys Studio's pause command.

   Turns on when the page runs inside Backseat Studio (window.Backseat present) or with ?backseat=1.
   Must run before the game boots (in <head>), because the engine reads window.CC_WIDE once at start.
   Safe to load twice: the second copy does nothing. */
(function () {
  if (window.__ccBackseat) return;
  const inStudio = !!(window.Backseat && window.Backseat.inStudio);
  const on = inStudio || /[?&]backseat=1\b/.test(location.search);
  if (!on) return;
  window.__ccBackseat = { build: '0001-gameonly' };

  // 1. Wide engine mode with the HUD in the portrait-safe centre column.
  //    World is 1707 wide; a 9:16 slice of a 16:9 frame is 540 of those units, centred: x 583.5 to 1123.5.
  const WORLD_W = 1707, SAFE_W = 540;
  const wide = { x: Math.round((WORLD_W - SAFE_W) / 2), w: SAFE_W };
  try { if (!window.CC_WIDE) window.CC_WIDE = wide; } catch (_) { /* Studio may already have provided it */ }

  // 2. Hide the page's own overlay and let the game canvas fill the window.
  //    The left column is moved off screen rather than removed: it still holds the squad list we read below.
  const css = `
body[data-mode=host] #host{display:block!important;background:#000!important}
#centre{position:absolute!important;inset:0!important;width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;min-width:0!important;margin:0!important;transform:none!important;aspect-ratio:auto!important;box-shadow:none!important;border:0!important;border-radius:0!important;z-index:1}
#right,#cc2e,#cc2cam,.camframe{display:none!important}
#left{position:fixed!important;left:-20000px!important;top:0!important;width:440px!important;height:auto!important;pointer-events:none!important}
html,body{background:#000!important;overflow:hidden!important}
`;
  const st = document.createElement('style'); st.id = 'cc-backseat'; st.textContent = css;
  // Studio can run this before the page has any elements yet; then add the style as soon as it does.
  const addStyle = () => { const root = document.head || document.documentElement; if (root && !st.isConnected) root.appendChild(st); return !!root; };
  if (!addStyle()) {
    const mo = new MutationObserver(() => { if (addStyle()) mo.disconnect(); });
    mo.observe(document, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', addStyle);
  }
  // Studio may run this after the page has loaded, so "when loaded" also means "now, if already loaded".
  const whenLoaded = fn => { if (document.readyState === 'complete') fn(); else addEventListener('load', fn); };
  const nudge = () => dispatchEvent(new Event('resize'));   // the game re-measures its canvases
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', nudge); else nudge();
  whenLoaded(nudge);

  if (!window.Backseat) return; // ?backseat=1 in a normal browser: game-only view, nothing to report to

  // 3. Report to Studio. The squad and stats still live in the (hidden) host cards, so read them from there.
  //    Later builds will send these straight from the engine instead of reading the page.
  const B = window.Backseat;
  B.hello({ game: 'corpse-crafter', version: '0001-gameonly', sdk: '1.0' });

  const text = el => (el && (el.innerText || el.textContent) || '').replace(/\s+\n/g, '\n').trim();
  const ROLE = /^(HOST|PLAYING|WAITING|AFK|SCOUT|GUNNER|BUILDER|MEDIC)$/i;
  function readSquad() {
    const cards = [...document.querySelectorAll('#left .hcard')].filter(c => !c.classList.contains('join') && !c.classList.contains('chatcard'));
    const card = cards.find(c => /squad/i.test(text(c))) || cards[0];
    if (!card) return null;
    // Every innermost piece of text in the card, in order ("SQUAD", "2/5", "WEASEL", "HOST", ...).
    const lines = [];
    const walk = el => {
      const kids = [...el.children];
      if (!kids.length) { const t = (el.textContent || '').trim(); if (t) lines.push(t); return; }
      for (const n of el.childNodes) {
        if (n.nodeType === 3) { const t = n.textContent.trim(); if (t) lines.push(t); }
        else if (n.nodeType === 1) walk(n);
      }
    };
    walk(card);
    let count = null, slotsLine = '';
    const members = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/^squad$/i.test(l)) continue;
      const m = l.match(/^(\d+)\s*\/\s*(\d+)$/);
      if (m) { count = { now: +m[1], max: +m[2] }; continue; }
      if (/open slot|join at|nobody/i.test(l)) { slotsLine = l; continue; }
      if (ROLE.test(l)) { if (members.length) members[members.length - 1].role = l.toUpperCase(); continue; }
      members.push({ name: l, role: '' });
    }
    return { count, members: members.slice(0, 12), note: slotsLine };
  }
  function readJoin() {
    const card = document.querySelector('#left .hcard.join');
    const t = text(card);
    const m = t.match(/[a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?/i);
    return m ? m[0] : '';
  }
  function readTitle() {
    const logo = document.querySelector('#left .hlogo');
    const t = text(logo).split('\n').map(s => s.trim()).filter(Boolean);
    return { title: t[0] || 'Corpse Crafter', sub: (t[1] || '').replace(/[•●]\s*LIVE/i, '').trim() };
  }
  const HOWTO = 'Haul bodies to a gold flag. Stand still to build. Gifts spawn zombies.';
  let last = '';
  function report() {
    const t = readTitle();
    const state = { title: t.title, subtitle: t.sub, squad: readSquad(), join: readJoin(), howto: HOWTO };
    const s = JSON.stringify(state);
    if (s !== last) { last = s; B.event('state', state); }
  }
  whenLoaded(() => { report(); setInterval(report, 1000); B.ready(); });

  // 4. Studio commands. Pause/resume is the game's own P key.
  B.on(msg => {
    if (!msg || msg.type !== 'command') return;
    if (msg.name === 'pause') {
      const ev = o => new KeyboardEvent(o, { key: 'p', code: 'KeyP', keyCode: 80, which: 80, bubbles: true });
      // One press, sent where a real key press would land; it bubbles up to document and window listeners.
      const t = document.activeElement || document.body || document.documentElement;
      t.dispatchEvent(ev('keydown')); t.dispatchEvent(ev('keyup'));
    }
  });
})();
