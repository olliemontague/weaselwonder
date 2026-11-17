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
