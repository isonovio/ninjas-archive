# Ninjas Archive

## Credits:
- SVGs: [Windmill](https://www.svgrepo.com/svg/336146/windmill), [External Link](https://www.svgrepo.com/svg/423732/link-external)
- Fonts: [Alegreya Sans](https://www.huertatipografica.com/en/fonts/alegreya-sans-ht), [Maple Mono](https://font.subf.dev/)
- Deployment: CDN, DNS, and static file hosting: [Bunny.net](https://bunny.net/)

## Todos:
- Rework Data API
    - [ ] use arrays instead of maps
        - [ ] `participants: {shorthand: slug, roster: slug}`
        - [ ] all plural `urls`: rename to `links`; do not use `map`, but `array` instead: `links: [{name, url}]`
    - [ ] `stream: {streamer, language, urls, tags}; links: {name (e.g., VOD, Part1, Part 2), url (add starting time to url), duration (do not show on webpage)}`
        - [ ] UI: `STREAMS` need a different `svg`
    - [ ] `MatchMap` should take `links` instead of a single `url`; 
- UI
    - [ ] Change main font from Alegreya Sans to Signika
    - [ ] `h1` title of each page
- Filter
    - [ ] make filter logic more scalable when more genres & more dimensions to filter on are added. extra logic (including `displayPlayers`) into `timeline_filter.ts`
    - [ ] in player filter section, add links to specific pages of the player
    - [ ] UI: reorder: date -> genre -> player
    - [ ] UI: allow search in player filter sections | `searchterm.tolowercase`, show player name if slug.substring(searchterm) or player is in filter
    - [ ] player filter: can be ANY mode or OR mode
- Search
    - [ ] add a search section above filter section
    - [ ] add a `search_name" field to every timeline item to allow text-based searching
- Code
    - [ ] organize components in folder structure
    - [ ] delegate logic of showing links to related ppl in separate genres
    - [ ] extract reusable components: e.g., Filter Box
- Content
    - [ ] Why? Page
    - [ ] Credits Page

## Todos: Long-Term
- Advanced Searching/Filtering: Allows complex logic AND and OR

## Howtos

### Deploy
- build: `npm run build`
- upload static files to Bunny Storage
- optional: purge Bunny CDN cache

### Deploy: Setup
- set 404 redirection to `/404.html`
- set CNAME DNS record to CDN
