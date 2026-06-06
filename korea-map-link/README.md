# Korea Map Link web pages

Static pages for App Store **Privacy Policy**, **Support**, and marketing.

## URLs (GitHub Pages)

Deployed under the Sparkish site:

| Page | URL |
|------|-----|
| Language chooser | `https://sparkish-xyz.github.io/korea-map-link/` |
| English landing | `https://sparkish-xyz.github.io/korea-map-link/en/` |
| Privacy | `https://sparkish-xyz.github.io/korea-map-link/privacy/` |
| Support | `https://sparkish-xyz.github.io/korea-map-link/support/` |

## Firebase Hosting (`korea-map-link.web.app`)

Deploy only this folder so App Store paths stay `/privacy/` and `/support/`:

```bash
cd korea-map-link
firebase deploy --only hosting
```

Point the Firebase site custom domain to `korea-map-link.web.app` and use the same paths in App Store Connect.

## Local preview

```bash
python3 -m http.server 8080
# http://127.0.0.1:8080/korea-map-link/en/
# http://127.0.0.1:8080/korea-map-link/privacy/
```