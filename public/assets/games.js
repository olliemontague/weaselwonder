// weaselwonder.com game list. One entry per game: the home cards, game pages
// and the /streamer launcher are all built from this file.
// To add a game: add an entry here and copy games/<any>/index.html to games/<slug>/.
window.WW_GAMES = [
  {
    slug: "zombierats",
    title: "ZombieRats",
    tagline: "Hold the town against the zombie rats.",
    blurb: "A close-up 3D survival game. Weasel hunts and lures zombie rats out of their nests while chat's mice collect the bodies and fetch wire, sandbags, traps and turrets. Clear the nests to win.",
    art: "zombierats.svg", card: "zombierats-shot.jpg",
    accent: "#7fbf3f",
    status: "live",            // live | playtest | retired | soon
    version: "v1.3",
    versionDate: "20 Nov 2026",
    offline: [
      { label: "Play the tutorial", url: "/tutorial/", primary: true, note: "13 stages, about 20 minutes, works on phones" },
      { label: "Free play (Easy, Medium, Hard)", url: "/tutorial/?stage=14", note: "Stage 14 of the tutorial, single player with bot mice" }
    ],
    join: { label: "Comment in chat to join", url: null, note: "Your first comment drops your mouse into weasel's town. Type 1 to 4 to fetch what he needs" },
    stream: { label: "ZombieRats streamer view", url: "/zombierats/" },
    how: [
      ["Comment", "Your first comment drops your mouse into weasel's town. It collects dead rats for the pile."],
      ["Fetch", "Type 1 wire, 2 sandbags, 3 trap or 4 turret and your mouse fetches it for weasel."],
      ["Help weasel", "Bring what weasel asks for: +3 points. The top 5 get titles. Follow +5, gifts +2 a coin."],
      ["Clear the nests", "Weasel hunts and lures the rats. Rats near a nest drag bodies home, so take the nests out to win."]
    ],
    shots: [
      ["Live: red alert, a rat eats a body and grows to size 3", "zombierats-shot.jpg"],
      ["Squirrel with crossbow holding the wire line", "zombierats.svg"],
      ["Outpost level 1 with the conveyor home", "zombierats.svg"]
    ],
    vods: []
  },
  {
    slug: "crazychess",
    title: "CrazyChess",
    tagline: "Chat plays chess. Everyone moves at once.",
    blurb: "Two games in one: Crazy Chess (real chess pieces, Knight beats Bishop beats Rook beats Knight) and Navy Chess (Battleship beats Destroyer beats Sub). Every viewer crews a piece, all moves land at the same time.",
    art: "crazychess.svg", card: "crazychess-shot.jpg",
    accent: "#4aa3e8",
    status: "live",
    version: "v1.4",
    versionDate: "20 Nov 2026",
    variants: ["Crazy Chess (chess pieces)", "Navy Chess (ships)"],
    offline: [
      { label: "Playtest: you vs the AI", url: null, primary: true, note: "Coming soon: phone friendly" }
    ],
    join: { label: "Join from your browser", url: "/crazychess/play/", note: "Or comment red or blue in chat, then type a direction like n, ne or e5" },
    stream: { label: "CrazyChess stream mode", url: "/crazychess/" },
    how: [
      ["Pick a side", "Comment red or blue (or join from the website). You get your own piece or ship."],
      ["Type a direction", "Compass words: n, ne, e, se, s, sw, w, nw, plus squares (e5). Knights jump with nne, een and so on. hold stays put."],
      ["Who beats who", "Crazy Chess: Knight beats Bishop beats Rook beats Knight. Navy Chess: Battleship beats Destroyer beats Sub beats Battleship."],
      ["Win", "Capture the King (Crazy) or sink every enemy ship (Navy), or be ahead when the turns run out."]
    ],
    shots: [
      ["Fleet Chess: turn 15, 8 ships left against 9", "crazychess-shot.jpg"],
      ["Navy Chess, 6x9 board", "crazychess.svg"],
      ["Crazy Chess", "crazychess.svg"]
    ],
    vods: []
  },
  {
    slug: "zombie-empire",
    title: "Zombie Empire",
    tagline: "We are the zombies. The army is coming.",
    blurb: "Soldiers and mechs attack by day. Chat fires, throws grenades and rushes in through smoke. At dusk the fallen are dragged to the Lab and rise as your crew.",
    art: "zombie-empire.svg", card: "zombie-empire-shot.jpg",
    accent: "#c8392b",
    status: "soon",
    version: "Prototype stage 2",
    versionDate: "18 Nov 2026",
    offline: [
      { label: "Playtest the prototype", url: null, primary: true, note: "Coming soon: simulated chat, desktop recommended" }
    ],
    join: { label: "Comment to enlist", url: null, note: "Your first comment puts you in the army. Die, and you rise as a zombie" },
    stream: { label: "Zombie Empire stream mode", url: null },
    how: [
      ["Enlist", "Your first comment makes you a named soldier in the army attacking us."],
      ["Get turned", "Fall in battle and a zombie drags you to the Lab. You rise as a named zombie in weasel's crew."],
      ["Fight by chat", "By day type 1 to fire a burst, 2 for a grenade, 3 to smoke and rush. Built for stream delay."],
      ["Build by night", "Mechs become parts. Sandbags, guns and spawns push the line north to the Command Post."]
    ],
    shots: [
      ["Squad behind the sandbags, named after chat (A1 art mock-up)", "zombie-empire-shot.jpg"],
      ["How it looks on TikTok LIVE (mock-up)", "zombie-empire-tiktok.jpg"],
      ["Dusk harvest into the Lab", "zombie-empire.svg"]
    ],
    vods: []
  },
  {
    slug: "corpse-crafter",
    title: "Corpse Crafter",
    tagline: "The one that started it.",
    blurb: "The original frozen-front zombie defence. Harvest corpses, build sandbags and flamer towers, and push spawn points to the front line. Gifts spawn zombies.",
    art: "corpse-crafter.svg", card: "cc-shot-game.jpg",
    accent: "#8fd3ff",
    status: "retired",
    version: "r6",
    versionDate: "15 Nov 2026",
    offline: [
      { label: "Watch the first live stream", url: "https://www.youtube.com/watch?v=1PxTvglmg_o&t=5240s", primary: true, note: "2h 56m, 15 Nov 2026" }
    ],
    join: { label: "Join as a survivor", url: "/corpsecrafter/", note: "5 survivors, everyone else spectates and queues" },
    stream: { label: "Corpse Crafter host", url: "/corpsecrafter/weasel" },
    how: [
      ["Harvest", "Zombies drop corpses. Carry them to a spawn point to turn them into mass, beams, chem and metal."],
      ["Fortify", "Sandbags, wire, turrets and flamer towers. Research unlocks squad weapons like the shotgun and sniper."],
      ["Survive the night", "Fog of war, scouts, and new zombie types: Super, Archer, Bomber and the body-stealing Smart."],
      ["Gift = zombie", "Every coin gifted spawns a zombie named after the gifter, straight at weasel's squad."]
    ],
    shots: [
      ["Live on 15 Nov: wave 13, squad of 5 behind the sandbags", "cc-shot-game.jpg"],
      ["Night with fog of war", "corpse-crafter.svg"],
      ["Gift zombies streaming in", "corpse-crafter.svg"]
    ],
    vods: [
      { title: "First Corpse Crafter LIVE", date: "15 Nov 2026", length: "2h 56m", url: "https://www.youtube.com/watch?v=1PxTvglmg_o", thumb: "stream-poster.jpg" }
    ]
  }
];

window.WW_LINKS = {
  discord: "https://discord.gg/zaRU7kAeU",
  tiktok: "https://www.tiktok.com/@weaselwonder",
  twitch: "https://www.twitch.tv/weaselwonder",
  youtube: "https://www.youtube.com/@weaselwonder"
};

// Home page background video. The page uses the self-hosted clip if it exists
// (smallest and smoothest), otherwise the YouTube embed (real site only).
window.WW_HERO = {
  mp4: "assets/video/hero.mp4",          // 30 s seamless loop, gameplay + cam only (554x402), no audio
  poster: "assets/art/stream-poster-v.jpg",
  youtube: { id: "1PxTvglmg_o", start: 5240, end: 5270 }   // 1:27:20 to 1:27:50
};
