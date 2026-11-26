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

## r16 · 2026-11-17
- Player menu (☰ top right on phones): Leave the game (back to the home page), How to play, Sound on/off.
- Ghost rats: players beyond the mouse slots join as see-through "👻" rats, float around and lure grazing rats (into towers, traps, the crossbow). First come, first served: the longest-waiting ghost gets the next mouse slot.
- Stream page: "Mouse slots (players who can level up)" setting; the Go live button becomes a red "Go offline" when live (players are told the game ended, the town keeps running); settings button shows ● LIVE / ○ offline.
- Play-test fixes (local copy, 12 simulated players + phone): website players no longer get a second citizen mouse; helper mice leave fresh bodies (10 s) and bodies near players to the players; grazing rats only lunge at mice within 4 m; only wave rats damage the fence; a few more grazers per player; helper mice respawn free; players with no respawns left still come back after 15 s; potion now needs 5 rats (settings default, adjustable).
- Network check: ~11 updates a second per player at about 1.3 KB each; host held ~60 fps with 10 players and 3 ghosts.

## r17 · 2026-11-17
- Portrait view: cam frame bottom right of the game column (gold border, dark frosted backdrop, LIVE tag, WEASELWONDER nameplate), just above the "PLAY WITH ME" plug. Place the camera over it in TikTok LIVE Studio or OBS.
- Toggle it in weaselwonder settings (Layout) or press C on the stream page. On by default.

## r18 · 2026-11-20 (new site)
- New home page: offline shows game cards (ZombieRats, CrazyChess, Zombie Empire, Corpse Crafter) and Discord over a 30 s background loop from the first Corpse Crafter stream; live shows a featured card for the game weasel is playing.
- Game pages at /games/<slug>/: back bar, offline play buttons (CrazyChess and Zombie Empire show "Soon" placeholders), how it works, screenshots, past streams, sticky LIVE bar when weasel is live with that game.
- /streamer/: password protected (same login as /stream). Pick the game, Go live, Launch.
- /api/live: GET returns {live, game}; POST (stream login only) sets or clears it, expires after 12 hours. Pages check it every 20 s.
- Game list lives in public/assets/games.js. Unchanged: /tutorial/, /play/, /stream/, /corpsecrafter/.

## r19 · 2026-11-20 (streamer flow and dual stream)
- /streamer: one button per game, "Go live and open": marks the site live and opens the host view in a new tab. Go offline on the same page.
- Dual stream: host views get a "TikTok window (T)" button that opens /streamer/portrait.html, a 9:16 pop-up showing the live game canvases (canvas.captureStream). Corpse Crafter host and ZombieRats /stream. Spec: project doc claude/dual-stream-specs.md.
- Corpse Crafter host (/corpsecrafter/weasel) signs in with the /streamer login (new /api/stream-check); the old host password still works. The Corpse Crafter socket now sets the host flag from the login cookie only, so a faked header can no longer claim host.
- Home page live card: direct Join button plus How to play. Game pages hide the offline buttons and show Join while weasel is live with that game.
- /stream is now /zombierats (old /stream links redirect). Every streamer view needs the streamer login: /streamer/, /zombierats/, /corpsecrafter/weasel and the TikTok pop-up. Logging in returns you to the page you asked for.
- ZombieRats pages (/zombierats, /play, /tutorial) renamed from Zombuild to ZombieRats.
- /streamer: Chat connections card (Twitch channel, TikTok username, tik.tools API key), saved in the browser and shared by ZombieRats and Corpse Crafter.
- Corpse Crafter host reads TikTok chat and gifts straight from tik.tools (no local relay needed) when the key is saved on /streamer. Its settings drawer (H) gets an "Open TikTok portrait window" button (the T shortcut is gone: too easy to hit by accident).

## r20 · 2026-11-20 (ZombieRats v1.3 test build at /zombierats/next/, portrait pop-up fix)
- New page only: weaselwonder.com/zombierats/next/ (streamer login). Nothing else on the site changes; /zombierats/, /play/ and /tutorial/ still run r17. Models load from /tutorial/models/.
- Game: no rat waves (hunt and lure), nests, colonies and loners, pin melee, burrow, heat and scout rats, raids, rats prefer corpses, automatic bones and meat economy with belts, baby mice respawns, chat mice that collect bodies and fetch items by number, need-based top 5, win by clearing the nests. Two unnamed town mice help when fewer than 2 viewers have mice.
- Landscape (this window, Twitch / TikTok landscape): full-width game, see-through windows at the edges (status, needs, top crew, how to play, chat, camera frame), middle strip kept clear.
- Portrait (TikTok): Host panel (H) → Open portrait window. Drawn by the same game (second renderer), so it needs no canvas capture. Full-height game, status and top crew cards top left, camera card bottom right with LIVE and WEASELWONDER, PLAY WITH ME line.
- Chat: simulated (off / quiet / typical / busy, with follows, roses and a delay), Twitch, TikTok via tik.tools (uses the Chat connections saved on /streamer) or TikFinity. ?clean hides host-only controls.
- Balance (v1.3): rats near a living nest drag bodies into the nest instead of eating them, so nests don't grow as you attack them. Towers weaker: 8 m range, 8 s reload.
- Fix for the live /zombierats/ TikTok pop-up ("No game view found"): dual-stream.js now also finds game canvases inside same-origin iframes and allows for the scaled stage around them. Only canvases are copied, so the page's HTML panels still don't appear in the pop-up.

## r21 · 2026-11-20
- CrazyChess v1.3 stream preview live: streamer view at /crazychess/ (streamer login, same as /streamer), website players at /crazychess/play/ (public). Crazy Chess and Navy Chess in one page; control panel with H.
- Live room: website players on their own phones join the streamer's game through the server (Durable Object instance "crazychess"). Only a browser with the streamer login can be the game window; a second game window replaces the first. Players can only move their own piece; a closed phone drops out after 20 s.
- On the site, simulated viewers are off by default (switch them on in the Chat tab).
- games.js: CrazyChess marked live, Join from your browser, stream mode link.

## r22 · 2026-11-20 (stream session step 1, ZombieRats v1.3 live)
- ZombieRats v1.3 is now the live ZombieRats at /zombierats/ (streamer login), launched by Go live on /streamer. Viewers join by commenting (no website players in v1.3). /zombierats/next/ redirects to /zombierats/.
- Old ZombieRats r17 streamer view archived at /zombierats/r17/ (unchanged, not linked). /play/ and /tutorial/ still run r17.
- ZombieRats portrait (TikTok) window: camera card (LIVE / WEASELWONDER box) removed; Oliver's camera covers the bottom of the frame. PLAY WITH ME moved above the camera band. Landscape camera frame keeps the WEASELWONDER tag, LIVE pill removed.
- New /assets/ww-session.js: each game's streamer view tells /streamer it is running (heartbeat) and ends itself when asked. Ended tabs show /streamer/ended.html.
- /streamer: games open in one reused tab ("ww_game"), so a reopen never makes a second copy. While a game is live the other games show "End <game> first". Live row: Running / Game tab not open, Live now: show tab (focuses it, no reload), End game. "Go offline" is now "End stream" and also ends the game.
- End game in every game: ZombieRats host panel (H), CrazyChess control panel top bar (tap twice), Corpse Crafter settings drawer (H). Ending from inside a game also clears the site's live state. No log out inside games.
- CrazyChess: the old End game (back to the lobby) is now End match.
- Navy Chess: the Battleship is longer and wider with three big triple-barrel turrets (two forward, one aft), so it no longer looks like the Destroyer.
- Navy Chess: fleets start spread out over their deployment zone (the 3 rows nearest each side: bottom 3 Red, top 3 Blue), split evenly over the rows, spaced across the width and staggered, with types alternating. Blue mirrors Red.
- CrazyChess (both games): new "Last turn (finish game)" button next to End turn now. The current turn becomes the last one, then the game is scored as if the turns ran out.
- Navy Chess: the streamer's ship is a random free Red ship, like everyone else's.
- CrazyChess is now v1.4: G:\My Drive\Weaselwonder\Game builds\Crazy chess\v1.4 stream preview (src/ builds to exactly public/crazychess/index.html).

## r22.1 · 2026-11-20
- /streamer and game pages: CrazyChess labelled v1.4.

## r23 · 2026-11-20
- ZombieRats: windows moved to the Twitch layout standard (chat 1456,176 440×560; camera 1456,760 440×248; how-to bottom left with the PLAY WITH ME bar). Host buttons hidden on stream by default (?noclean shows them).
- ZombieRats: simulated chat never runs on weaselwonder.com; the settings show it as off.
- ZombieRats: Twitch status reads "connected & reading #channel" once the channel join is confirmed, "disconnected" if it drops.

## r24 · 2026-11-20
- Camera backgrounds (Twitch only): pick one on /streamer under "Camera background" or in any game's settings; it shows inside the camera frame behind the OBS webcam (needs background removal on the webcam). "Match the game" uses chess study (CrazyChess), red submarine (Navy Chess), log cabin (ZombieRats), dugout (Corpse Crafter). Also: none, WW2 submarine. Shared code: /assets/ww-cambg.js, images in /assets/cambg/.
- CrazyChess v1.5: full-screen Twitch layout with Flow backgrounds (study for chess, ops room for naval), standard windows, camera background.
- Corpse Crafter wide Twitch layout, off by default: /corpsecrafter/weasel?layout=v2. The worker patches the r6 engine on the way out (tools/cc-wide/wide_patches.json, all gated on window.CC_WIDE, so normal play and phone players are unchanged): host view 16:9, camera follows Weasel and pulls back 20%, forest and snow beyond both map edges, game HUD kept in the centre column. /assets/cc-layout-v2.js moves the panels into the standard windows with chat and camera (with camera background) on the right.
- TikTok portrait window, one per session: "Open TikTok portrait window" on /streamer (above Chat connections; press again to reopen or bring it forward). Shows a "Weasel is changing game" hold screen, and every game launched from /streamer shows its portrait slice in it: ZombieRats (its portrait camera and cards), CrazyChess / Navy Chess (its portrait view), Corpse Crafter (the game video, following Weasel in the wide view). Reconnects by itself after the window is reopened or /streamer reloads. In-game portrait/TikTok buttons removed (ZombieRats O key and host button, CrazyChess control button, Corpse Crafter drawer button). Shared code: /assets/ww-stage.js, /streamer/portrait.html.
- ZombieRats factory: outpost box first and rebuilt as soon as one is used; then a fixed menu in random order, 3 barbed wire, 2 sandbags, 1 trap, 1 turret, until every item has twice its share; then it tops up whichever grid is emptiest.

## r24.1 · 2026-11-20 (live fixes during stream)
- CrazyChess: typing red or blue after joining switches team (old ship goes to a bot, a ship is crewed on the new side; once every 2 turns).
- CrazyChess: Twitch chat (and TikTok via tik.tools, if a key is saved on /streamer) connects by itself when the game opens and reconnects if it drops. Add ?nochat to skip.
- CrazyChess: the game keeps running and feeding the TikTok portrait window when its own window is covered or minimised (worker timer fallback when Chrome pauses animation frames).

## r25 · 2026-11-20
- CrazyChess and ZombieRats on weaselwonder.com connect Twitch and TikTok (tik.tools) from the /streamer chat settings as soon as they open. If tik.tools closes the link (not live on TikTok yet, or key refused) they retry every 10 s and say why in the status line. Chat can no longer come in doubled: one Twitch and one TikTok link at a time, and both games drop any message whose id they have already shown (CrazyChess and ZombieRats).
- Built on r24.1 (pushed from another session during the stream): its team switching, chat auto-connect/reconnect and covered-window timer are kept in the CrazyChess source; this adds the message-id de-duplication and the reason in the TikTok status line, and fixes the CrazyChess control panel being stuck on "Connecting to the game window" in r24.1 (it was sent the live chat sockets, which cannot be copied between windows).


## r26 · 2026-11-26
- New /live page (Backseat MVP 0): phone-first viewer page. Low-lag WebRTC video (WHEP from Cloudflare Stream) on top, the live game's player view underneath ("Join the game"), installable from the browser (manifest).
- The video address lives in public/live/stream.json. Live status still comes from /api/live (set by Backseat Studio's Go live).
- No worker changes.
