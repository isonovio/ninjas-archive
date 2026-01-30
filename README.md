# Ninjas Archive

## Credits:
- SVGs: [Windmill](https://www.svgrepo.com/svg/336146/windmill), [External Link](https://www.svgrepo.com/svg/423732/link-external), [Video Streaming](https://www.svgrepo.com/svg/383581/online-movie-streaming-player-video)
- Fonts: [Signika](https://github.com/googlefonts/Signika), [Maple Mono](https://font.subf.dev/)
- Deployment: CDN, DNS, and static file hosting: [Bunny.net](https://bunny.net/)

## Todos:
- Rework Data API
    - [ ] use arrays instead of maps
        - [ ] `participants: {shorthand: slug, roster: slug}`
        - [ ] all plural `urls`: rename to `links`; do not use `map`, but `array` instead: `links: [{name, url}]`
        - [ ] `MatchMap` should take `links` instead of a single `url`; 
    - [ ] use `zod` as a single source of truth
        - [ ] validate json input
        - [ ] generate Raw types
        - [ ] generate json schemas
- UI
    - [ ] Everything clickable need to have hover color change
    - [ ] add hover texts to clickables
    - [ ] `h1` title of each page
- Timeline Match UI
    - [ ] show player nicknames under teamnames
    - [ ] if has note, show under the match/map
    - [ ] map URL: show on map slug
    - [ ] match URL: show on the last item of bracket
    - [ ] event URLs: show next to event name
    - [ ] MAYBE: separate events as a separate genre from matches | Color Code: Brown
    - [ ] MAYBE: show match slug on the left, just like map slug
- Filter
    - [ ] make filter logic more scalable when more genres & more dimensions to filter on are added. extra logic (including `displayPlayers`) into `timeline_filter.ts`
    - [ ] in player filter section, add links to specific pages of the player
    - [ ] UI: allow search in player filter sections | `searchterm.tolowercase`, show player name if slug.substring(searchterm) or player is in filter
    - [ ] player filter: can be ANY mode or OR mode
- Search
    - [ ] add a search section above filter section
    - [ ] add a `search_name" field to every timeline item to allow text-based searching
    - [ ] filter: item => streamterm.toWords.map(toLower).all(isSubstring of item.search_name)
- Code
    - [ ] organize components in folder structure
    - [ ] delegate logic of showing links to related ppl in separate genres
    - [ ] extract reusable components: e.g., Filter Box
- Content
    - [ ] Why? Page
    - [ ] Credits Page
    - [ ] Streams as a Genre in Timeline | Color Code: Purple
    - [ ] Event Pages
    - [ ] Add a team type independent of roster
    - [ ] Editorial Page: Articles Written by me
    - [ ] `wynd` mode: show something related to me only

## Todos: Long-Term
- Summary Mode: can show more items on the timeline
- Dynamic UI
    - Filter/Search sidebar only show in full when hovered 
- Narrow-Screen UI
- Advanced Searching/Filtering: Allows complex logic AND and OR
- structured timeline: date -> genre -> (if genre == match) event -> item
- `involves` takes not only `player`s but everything that inherits `entity`, including matches, events, teams, etc. 
    - Make filterable but date something of involves. A match involves its event, but not an independent event field

## Howtos:

### Deploy
- build: `npm run build`
- upload static files to Bunny Storage
- optional: purge Bunny CDN cache

### Deploy: Setup
- set 404 redirection to `/404.html`
- set CNAME DNS record to CDN
