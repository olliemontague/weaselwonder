/* Shared chat settings for every streamer view, saved in this browser only.
   ZombieRats reads zb_stream_settings (twCh, ttUser, ttKey). Corpse Crafter reads cc-tw and cc-tt;
   cc-tt = "tiktools://" tells its page to use tik.tools directly (see cc-streamer.js). */
window.WWChat = (function () {
  const ZK = "zb_stream_settings";
  const rd = () => { try { return JSON.parse(localStorage.getItem(ZK) || "{}"); } catch (e) { return {}; } };
  function get() { const z = rd(); return { twitch: z.twCh || "weaselwonder", ttUser: z.ttUser || "weaselwonder", ttKey: z.ttKey || "" }; }
  function set(v) {
    try {
      const z = rd(); z.twCh = v.twitch; z.ttUser = v.ttUser.replace(/^@/, ""); z.ttKey = v.ttKey;
      localStorage.setItem(ZK, JSON.stringify(z));
      localStorage.setItem("cc-tw", v.twitch);
      if (v.ttKey) localStorage.setItem("cc-tt", "tiktools://"); else if (localStorage.getItem("cc-tt") === "tiktools://") localStorage.removeItem("cc-tt");
      return true;
    } catch (e) { return false; }
  }
  return { get, set };
})();
