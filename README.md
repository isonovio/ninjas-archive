# Ninjas Archive

## Credits:
- SVGs: [Windmill](https://www.svgrepo.com/svg/336146/windmill), [External Link](https://www.svgrepo.com/svg/423732/link-external)
- Fonts: [Alegreya Sans](https://www.huertatipografica.com/en/fonts/alegreya-sans-ht), [Maple Mono](https://font.subf.dev/)
- Deployment: CDN, DNS, and static file hosting: [Bunny.net](https://bunny.net/)

## Todos:
- UI
    - [ ] Change main from from Alegreya Sans to Signika
    - [ ] `Map` should take `URLS` instead of `URL`; `STREAMS` need a different `svg`
    - [ ] `h1` title of each page
- Filter
    - [ ] make filter logic more scalable when more genres & more dimensions to filter on are added. extra logic (including `displayPlayers`) into `timeline_filter.ts`
    - [ ] in player filter section, add links to specific pages of the player
- Search
    - [ ] add a search section above filter section
    - [ ] add a `search_name" field to every timeline item to allow text-based searching
- Code
    - [ ] organize components in folder structure. Delegate logic of showing links to related ppl in separate genres
    - [ ] extract reusable components: e.g., Filter Box
- Content
    - [ ] Why? Page
    - [ ] Credits Page

## Howtos

### Deploy
- build: `npm run build`
- upload static files to Bunny Storage
- optional: purge Bunny CDN cache

### Deploy: Setup
- set 404 redirection to `/404.html`
- set CNAME DNS record to CDN
