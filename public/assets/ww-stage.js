// Weaselwonder TikTok portrait stage: lets a game draw its portrait slice into the session's portrait window.
// The window is opened from /streamer (window.wwStage there); games launched from /streamer reach it through
// window.opener. The game keeps checking, so it reconnects by itself if the window is closed and reopened.
//
//   WWStage.attach('zombierats', api => api.claim('zombierats').token)       // then write into .win / .doc
//   WWStage.attach('crazychess', api => api.load('crazychess', url).token)   // or load a page into the window
(function () {
  if (window.WWStage) return;
  let curApi = null, tok = null, mountFn = null, timer = null, stopped = false;
  function find() {
    for (const o of [window.opener, window]) {
      try { if (o && !o.closed && o.wwStage && !o.wwStage.closed && o.wwStage.wwStageApi) return o.wwStage.wwStageApi; } catch (e) {}
    }
    return null;
  }
  function tick() {
    if (stopped || !mountFn) return;
    const api = find();
    if (!api) { curApi = null; tok = null; return; }
    let owner = null; try { owner = api.owner(); } catch (e) {}
    if (api !== curApi || owner !== tok) { curApi = api; try { tok = mountFn(api); } catch (e) { console.warn("portrait stage", e); tok = null; } }
    else try { api.ping(tok); } catch (e) {}
  }
  function attach(slug, fn) { mountFn = fn; stopped = false; tick(); clearInterval(timer); timer = setInterval(tick, 1500); }
  function release() { stopped = true; clearInterval(timer); try { if (curApi && tok != null) curApi.release(tok); } catch (e) {} curApi = null; tok = null; }
  addEventListener("pagehide", release);
  window.WWStage = { attach, release, find, connected: () => !!curApi };
})();
