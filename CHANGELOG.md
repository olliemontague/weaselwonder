# Changelog

## r7 · 2026-11-17
- New Zombuild home page. Offline: "Play the latest tutorial". Live: join box. Discord, TikTok and Twitch links.
- Tutorial at /tutorial/: stages 1 to 13 (collecting to winning the game) plus stage 14, Free play (Easy, Medium, Hard).
- Site now deployed from GitHub via Cloudflare Workers Builds (static assets). /weasel and /play still serve the r6 live game.
- Rollback: r6 page and worker saved in KV under snapshots/2026-11-17-*.

## r8 · 2026-11-17
- Stream mode: weaselwonder.com/stream/ (host layout for OBS at 1920x1080). Left: rules, live vote with tallies, wave and town status, top citizens. Centre: portrait game. Right: cam frame with WEASELWONDER nameplate and merged chat.
- Chat: Twitch (anonymous, read-only) and TikTok via tik.tools (username and API key stored only in the host's browser).
- "join" makes a citizen mouse with a name tag. Votes 1 to 5 every 4 minutes pause the game for 60 s. Points: 1 per vote, 1 per comment (30 s cooldown), 2 per gift coin. Top 5 get roles (Mayor badger, Sheriff fox, Treasurer mole, Secretary frog, Councillor hare) with hats. Miss 3 votes and you become an outcast who wanders north and gets eaten.
- Weaselwonder settings (S): chat connections, test chat, difficulty, vote timing, points, outcast rule, max mice on screen, call or end a vote, restart.
- Tutorial: respawns cap at 20; harder end-game stream.

## r9 · 2026-11-17
- Portrait view (what TikTok sees): big VOTE NOW card with explanations and a live percentage chart, top 5 citizens panel top left, small "PLAY WITH ME · www.weaselwonder.com" plug. Top citizens removed from the landscape column.
- End vote button on the vote card (or press E).
- Five permanent helper mice named after the top 5 citizens (Mayor, Sheriff, Treasurer, Secretary, Councillor; "vacant" until someone earns it). Other citizens get ordinary named mice.
- Stream production is winner-takes-all: the town hall only builds the vote winner and saves up bodies when short. Votes typed between windows still set a viewer's choice.

## r10 · 2026-11-17
- Waves grow with the audience: +1 rat per citizen active in the last 5 minutes (shown on the stream status).
- Stream defaults: vote every 180 s for 45 s, Medium difficulty (website stays Easy). End vote button (or E) on the vote card.
- Outcasts: only citizens who have held a top-5 title can be cast out for missing 3 votes.
- Mobile: tap the left thumb to drop what you carry.

## r11 · 2026-11-17 (step 5: website players)
- Weasel goes live from the stream page: Settings (S) → Website players → host password → "Go live". The home page then shows live and the join box.
- weaselwonder.com/play/ (and the home page join box): website players join as mice (10 slots, more queue and watch). Drag left side or WASD to move, stand still on a body to pick it up, stand still by the pile to drop it, tap left or Q to let go.
- Each player sees only their own points, rank among players, potion progress and squirrel timer.
- 10 rats to the pile earns a potion: the highest-scoring mouse with a potion becomes a squirrel (3 slots). Squirrels shoot rats by themselves. Once all 3 slots are full every squirrel runs on a timer: 60 s, +5 s per kill, 3 min cap; then back to a mouse.
- All of it is adjustable live in Settings: max players, squirrel slots, rats per potion, squirrel timer numbers. Kick any website player from the list.
- Server: host config (max players), private messages to one player, broadcasts, player actions. /play now serves the new player page; /weasel still serves the old r6 game.

## r12 · 2026-11-17
- Corpse Crafter moved to weaselwonder.com/corpsecrafter (host: /corpsecrafter/weasel) with its own game room, so it can never collide with Zombuild players. /weasel redirects there.
- "I am Weasel" button removed from the home page.
- /stream is password protected (STREAM_PASSWORD secret in Cloudflare; 30-day login cookie).
- Player page: waits on a slowly turning town view with "Waiting for weaselwonder's town" until the stream game sends its first frame.

## r13 · 2026-11-17
- Player screens: your own mouse moves instantly (predicted locally) and others glide smoothly; phones render lighter (1x pixels, no shadows, no outlines); 12 updates a second.
- Drag anywhere on the screen to move; tap anywhere (or Q) to let go. Instructions panel at the bottom folds down to a one-line points summary.
- Vote dialog on player screens with the five options and live percentages; tap to vote (website players count as citizens).
- Rats hunt every mouse (website players and the town's helper mice) as readily as the squirrel. A caught mouse leaves a body worth 3 rats to a rat, or 2 respawns if carried to the med tent. Mice come back at the med tent, using a respawn.
- Mice use gates, sandbags, turrets, traps and wire like the squirrel.
- Free play / stream: rats can no longer walk into town. They stop at the fence and gnaw it (town fence = 10,000 hp, 100 sandbags). Sandbags now take damage too.
- Universal repair: stand still next to anything damaged (sandbags, wire, traps, turrets, the town fence, the outpost) and it mends with a "Repairing…" progress line. No resources. Website players repair too.
- Pause shows "PAUSED" on players' screens. Weaselwonder settings: Pause, Restart, and End game & log out (players see "Game ended" and go back to the home page; players also go home if weasel is offline for 20 s).

## r14 · 2026-11-17
- Game log: the stream page uploads a timestamped log every minute and on End game (KV logs/DATE/, kept 14 days): joins, deliveries, deaths, potions, votes, waves, host frame rate; phone errors are sent to it too.
- Player screens: no more host aim cone, aim line or goal arrow; the corpse pile shows its bodies; "+1 rat for the town" confirmation; anywhere on the pile counts.

## r15 · 2026-11-17
- Player screens draw dead mice as fallen mice with a medic cross (they showed as giant dead rats).
