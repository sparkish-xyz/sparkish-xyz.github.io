# AlarmCrew animation runtime

`gsap.min.js` and `ScrollTrigger.min.js` are unchanged copies from the existing
`gsap@3.14.2` dependency's `dist/` directory. They are served locally and retain
their upstream license notices. See https://gsap.com/standard-license/ .

The product's authored behavior lives in
`site-src/templates/alarmcrew/assets/alarmcrew.js`; `npm run generate` copies it
to the public route. Vendor files are covered by the static asset directory
contract and are not concatenated with another product's runtime.
