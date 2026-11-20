// weaselwonder.com game list. One entry per game: the home cards, game pages
// and the /streamer launcher are all built from this file.
// To add a game: add an entry here and copy games/<any>/index.html to games/<slug>/.
window.WW_GAMES = [
  {
    slug: "zombierats",
    title: "ZombieRats",
    tagline: "Hold the town against the zombie rats.",
    blurb: "A close-up 3D survival game. Collect rat bodies, turn them into crossbows, wire and turrets, and push outposts north until you take the woods.",
    art: "zombierats.svg", card: "zombierats-shot.jpg",
    accent: "#7fbf3f",
    status: "live",            // live | playtest | retired | soon
    version: "r17",
    versionDate: "17 Nov 2026",
    offline: [
      { label: "Play the tutorial", url: "/tutorial/", primary: true, note: "13 stages, about 20 minutes, works on phones" },
      { label: "Free play (Easy, Medium, Hard)", url: "/tutorial/?stage=14", note: "Stage 14 of the tutorial, single player with bot mice" }
    ],
    join: { label: "Join weasel's town", url: "/play/", note: "Up to 10 mice, then ghost rats" },
    stream: { label: "ZombieRats stream mode", url: "/stream/" },
    how: [
      ["Collect", "Every rat that dies leaves a body. Carry bodies to the corpse pile: they are the town's only resource."],
      ["Build", "The factory turns bodies into crossbows, barbed wire, sandbags, traps and turrets. Chat votes on what it makes next."],
      ["Breed", "Rats grow by eating the dead. Lure a big one into a trap and it is worth several bodies. Get it wrong and it eats you."],
      ["Push north", "Carry outpost boxes up the map, link them home with conveyor belts and build an outpost in the end zone to win."]
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
    blurb: "Rock, paper, scissors on a chess board. Every viewer crews a piece and types a direction; all moves land at the same time.",
    art: "crazychess.svg", card: "crazychess-shot.jpg",
    accent: "#4aa3e8",
    status: "soon",
    version: "Fleet Chess mobile u3",
    versionDate: "19 Nov 2026",
    variants: ["Fleet Chess (naval)", "Front Line (air and armour)", "Zombie Chess (humans vs zombies)"],
    offline: [
      { label: "Playtest: you vs the AI", url: null, primary: true, note: "Coming soon: Fleet Chess, 3 to 12 ships a side, phone friendly" }
    ],
    join: { label: "Type a direction in chat", url: null, note: "Played from TikTok or Twitch chat: up, down, left, right" },
    stream: { label: "CrazyChess stream mode", url: null },
    how: [
      ["Pick a side", "Comment once to join the smaller team. You crew a ship (or share one when chat is busy)."],
      ["Type a direction", "up, down, left, right or hold. Moves stay hidden until the turn plays out."],
      ["Who beats who", "Battleship beats Destroyer, Destroyer beats Submarine, Submarine beats Battleship. Same type bounces."],
      ["Win", "Sink every enemy ship, or have the most left after 20 turns. Sunk? You jump into another ship."]
    ],
    shots: [
      ["Fleet Chess: turn 15, 8 ships left against 9", "crazychess-shot.jpg"],
      ["Mobile build, 6x9 board", "crazychess.svg"],
      ["Front Line skin", "crazychess.svg"]
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
