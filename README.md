# Ninjas Archive

## Credits
- SVGs: [Windmill](https://www.svgrepo.com/svg/336146/windmill), [External Link](https://www.svgrepo.com/svg/423732/link-external), [Video Streaming](https://www.svgrepo.com/svg/383581/online-movie-streaming-player-video)
- Fonts: [Signika](https://github.com/googlefonts/Signika), [Kode Mono](https://github.com/isaozler/kode-mono)
- Deployment: CDN, DNS, and static file hosting: [Bunny.net](https://bunny.net/)

## Roadmap
- [Planned Features](TODO.md)

## Deployment

### On Push
- build: `npm run build`
- upload static files to Bunny Storage
- purge Bunny CDN cache

### Setup
- set 404 redirection to `/404.html`
- set CNAME DNS record to CDN
