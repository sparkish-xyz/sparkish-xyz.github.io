# AlarmCrew asset provenance

- `app-icon.png`: unchanged copy of `AlarmCrew/ios/Projects/App/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon.png`.
- `{ko,en,ja}/{alarm,crew,friends}.png`: unchanged real iOS release captures from `AlarmCrew/release/screenshots/localized-20260928/raw/{locale}/iphone/{02-alarm,03-crew,04-friends}.png`. Crew names and wake-up data come from the test scenario; the page labels these as example records. The PNG links show full-size originals.
- `*-440.webp`, `*-660.webp` and `app-icon-*.webp`: responsive derivatives of those originals. Only format/size changed; screenshot content was not retouched or synthesized.
- `morning-friends.png`: decorative hero artwork created on 2026-10-01 with the built-in Imagegen tool. Source: `/Users/byunghak/.codex/generated_images/01a0f7b0-ba99-7200-aa99-f99321fb9fcc/exec-cc96d459-96d7-48f2-b3e8-86e548721f98.png`. The two WebP derivatives preserve transparency. This artwork is not a product screenshot.

## Final illustration prompt

Use case: stylized-concept. Decorative hero illustration for AlarmCrew, a friends' morning alarm app. A warm, premium handmade clay illustration of three young adult friends starting their morning together, in a small asymmetric sculptural composition. One friend in charcoal pajamas with orange cuffs stretches both arms, one wearing a warm ivory sweatshirt waves hello, and one friend in burnt orange loungewear holds a ceramic coffee mug. A charming small orange twin-bell alarm clock anchors the foreground; simple clock hands point approximately to seven o'clock, no digits. The friends are different heights, distinct poses, dark hair, casually kind expressions with simple sculpted features, understated Korean character-design sensibility.

Tactile matte clay miniature, softly sculpted forms, beautiful material detail, editorial consumer-app illustration. Sophisticated and friendly, not corporate flat-vector people, not Pixar or glossy plastic. Three people only; natural human proportions, believable hands. Square artwork; three friends and clock form one grounded cohesive group with generous empty transparent margin, asymmetric silhouette and gently overlapping figures. All people fully visible, no text. Designed to sit on very dark warm charcoal website background. Soft amber morning rim light, restrained shadows. Warm charcoal, toasted orange, pale cream, natural skin tones. Transparent background. No words, logos, numbers, phones, screens, app UI, extra floating objects, watermarks, badges or decorative stars; no blue, purple, pink gradients or neon glow.

## Morning Edition — 2026-10-10

`preview/{crew,home}.png` are unchanged copies of the real Korean iOS captures
`AlarmCrew/release/verification/morning-design-20261010/ios-{crew,home}.png`.
The native repository identifies these as authenticated QA captures with temporary
test accounts that were subsequently deleted. They show the 1.1.0 update, not a
claim that the update is already publicly available. The Korean landing retains these original captures. English and Japanese now use
the localized captures described below; existing release screens remain below.

`preview/*-800.webp` are width-800, quality-88 WebP conversions of the originals.
No screenshot UI is reconstructed or retouched. CSS presents a cropped view of the
Crew summary and the next-alarm card; the original PNG is always linked. The home
original includes a test advertising banner, while the feature crop focuses on the
next-alarm card. The page continues to disclose that the app contains ads.

The October 1 illustration is retained as an asset but is not used on this design.

## Localized update previews — 2026-10-10

`preview/{en,ja}/{home,crew}.png` are real, unretouched captures from the existing
AlarmCrew iOS 1.1.0 (23) Debug simulator app at
`/tmp/AlarmCrewMorningApp/Build/Products/Debug-iphonesimulator/App.app`.
They were captured on a task-created iPhone 17 Pro / iOS 27 simulator using the
app's existing `ALARMCREW_SCREENSHOTS`, `ALARMCREW_QA_ROUTE`, and session entry
points, with `app_language_override`, AppleLanguages and AppleLocale set to the
page's language. The app source and binary were not modified.

Two disposable authenticated QA users shared one 07:00 weekday alarm. Alarm
titles and participant nicknames were set in English or Japanese before each
capture. The system alarm permission was accepted on the task simulator. The
Japanese capture followed a clean reinstall after the simulator rejected a
renamed existing alarm; error/permission screens were excluded.

The accounts, their fixture data and the task simulator were removed afterwards.
Home originals include a standard test advertisement. Web pages focus on the
next-alarm card via CSS and still disclose ads.

`*-800.webp` are quality-88, width-800 format/size derivatives. The original PNG
and matching WebP are used together in the hero, Crew walkthrough and next-alarm
story for each page locale. Hashes are in `provenance.json`.
