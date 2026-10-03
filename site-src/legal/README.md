# Project-hosted support and legal documents

`npm run generate` renders the documents from this directory through
`tools/render-legal.cjs`. The resulting HTML is committed alongside the existing
landing pages and works on the project's GitHub Pages host without JavaScript,
an API, ChatGPT Sites, or a GitHub wiki.

## Editing

- `documents.json` declares each app, its original document languages, titles,
  and content files. Document routes follow the app's existing locale routes.
- `content/<app>/<document>-<language>.html` holds the authored body. Keep policy
  clauses and their effective/version dates explicit. The renderer supplies the
  page heading, navigation, section anchors, language links, and print layout.
  Store internal references as the current root-relative document URLs. Each
  document footer links to the same app's policies/support in its available language.
- `provenance.json` records the migration sources and original response hashes,
  checked on October 1, 2026. It is an audit reference, not a live dependency.
- `../templates/legal/assets/legal.css` is the shared document stylesheet. It
  uses the existing studio and product tokens.

After editing, run `npm run generate`, `npm run check`, and `npm test`.
`verify:generated` covers these rendered pages as well as snapshot templates.
When adding/removing document languages, update `../routes.json` and the
corresponding sitemap entries in `../templates/sitemap.xml`.

## Routes and language coverage

The index is `/legal/` (English), `/legal/ko/`, and `/legal/ja/`.

| App | Documents | Authored languages |
| --- | --- | --- |
| AquaTick | `/aquatick/privacy/` | Original English policy |
| AquaTick | `/aquatick/{en,ko,ja}/support/` | English, Korean, Japanese |
| AquaTick | `/aquatick/{en,ko,ja}/terms/` | Localized Apple Standard EULA information |
| KINETTO | `/kinetto/{privacy,terms,support}/` | English |
| KINETTO | `/kinetto/{ko,ja}/{privacy,terms,support}/` | Korean, Japanese |
| AlarmCrew | `/alarmcrew/{privacy,terms,support}/` | Original Korean documents |
| AlarmCrew | `/alarmcrew/delete-account/` | Korean and English instructions |

The index labels documents available only in a different language. Unsupported
languages link to the original, rather than creating new legal translations.
AquaTick's existing Apple Standard EULA remains the authoritative license on
Apple's official website; the internal terms page links to it. Third-party
service privacy links also remain at the provider's official websites.

## Migration decisions

The existing published documents were imported in full, including data-processing
details, account-deletion scope, diagnostic retention, and effective dates.
KINETTO's public server HTML was used rather than a potentially newer, unpublished
local implementation. Its published support email is `qkwl4678@naver.com`.

AlarmCrew's published policy clauses match its local legal sources. Its older
published contact (`byunghak.kr@gmail.com`) was updated to the latest local
legal-source address, `alarmcrew.support@gmail.com`, consistently across privacy,
terms, support, and Korean/English deletion instructions.

The account-deletion page provides instructions and an email link. It does not
perform deletion or send mail. Fulfillment still follows account-ownership
verification by the operator. Existing app-bundled URLs, App Store / Google Play
metadata, and former-host redirects are outside this website repository; they
must be changed in their owning projects when retiring those hosts.

## AquaTick policy update — October 3, 2026

AquaTick’s privacy document now matches the app repository’s `PRIVACY.md` dated
October 3, 2026, including JSON backups, optional Pro CloudKit synchronization,
and the Amplitude integration and its collection limits. The support address
remains `qkwl4678@naver.com`; the localized terms pages still link to Apple’s
Standard EULA. The original migration hashes in `provenance.json` remain an
audit of the October 1 import.
