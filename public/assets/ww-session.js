/* weaselwonder stream session bus (r22). Shared by /streamer and every game's streamer view.
   Spec: project docs claude/stream-session-plan-2026-11-20.md and claude/dual-stream-specs.md.

   Games:     WWSession.game({ slug, title, onEnd })   announces the game, sends a heartbeat every second,
              ends itself when the dashboard (or its own End game button) asks. onEnd may return a promise:
              use it to tell website players and close sockets. Afterwards the tab shows /streamer/ended.html.
              WWSession.end()                          ends this game now (the game's own End game button).
   Dashboard: WWSession.watch(fn)                      fn({ slug, title, alive }) whenever a game's status changes.
              WWSession.endGame(slug)                  asks that game's tab to end.
   Messages on BroadcastChannel "ww-session": hello, beat, bye (game) and end (dashboard). */
(function () {
  if (window.WWSession) return;
  let bc = null;
  try { bc = new BroadcastChannel("ww-session"); } catch (e) {}
  const post = m => { try { bc && bc.postMessage(m); } catch (e) {} };
  const listeners = [];
  if (bc) bc.onmessage = e => { const m = e.data || {}; listeners.forEach(f => { try { f(m); } catch (er) {} }); };
  const on = f => listeners.push(f);

  // ---------- game side ----------
  let me = null, beat = null, ending = false;
  function game(opts) {
    if (me) return;
    me = { slug: opts.slug, title: opts.title || opts.slug, onEnd: opts.onEnd || null };
    const hello = () => post({ t: "hello", slug: me.slug, title: me.title });
    hello();
    beat = setInterval(() => post({ t: "beat", slug: me.slug, title: me.title }), 1000);
    on(m => {
      if (m.t === "who") hello();
      if (m.t === "end" && (!m.slug || m.slug === me.slug)) end();
    });
    addEventListener("pagehide", () => { if (me) post({ t: "bye", slug: me.slug }); });
  }
  async function end() {
    if (!me || ending) return;
    ending = true;
    try { if (me.onEnd) await Promise.race([Promise.resolve(me.onEnd()), new Promise(r => setTimeout(r, 4000))]); } catch (e) {}
    clearInterval(beat);
    post({ t: "bye", slug: me.slug, ended: true });
    // the site stops showing this game as live (only if it still is: never clears another game)
    try {
      const v = await (await fetch("/api/live", { cache: "no-store" })).json();
      if (v && v.game === me.slug) await fetch("/api/live", { method: "POST", keepalive: true, headers: { "content-type": "application/json" }, body: JSON.stringify({ game: null }) });
    } catch (e) {}
    location.replace("/streamer/ended.html?game=" + encodeURIComponent(me.title));
  }

  // ---------- dashboard side ----------
  const seen = new Map();          // slug -> { title, at }
  function watch(fn) {
    const emit = slug => { const s = seen.get(slug); fn({ slug, title: s ? s.title : slug, alive: !!(s && performance.now() - s.at < 3500) }); };
    on(m => {
      if (!m.slug) return;
      if (m.t === "hello" || m.t === "beat") { const was = seen.get(m.slug); seen.set(m.slug, { title: m.title, at: performance.now() }); if (!was || performance.now() - was.at > 3500) emit(m.slug); }
      if (m.t === "bye") { seen.delete(m.slug); emit(m.slug); }
    });
    setInterval(() => { for (const [slug, s] of seen) if (performance.now() - s.at > 3500) { seen.delete(slug); emit(slug); } }, 1000);
    post({ t: "who" });
  }
  const alive = slug => { const s = seen.get(slug); return !!(s && performance.now() - s.at < 3500); };
  const endGame = slug => post({ t: "end", slug });

  window.WWSession = { game, end, watch, alive, endGame };
})();
