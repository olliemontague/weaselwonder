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
