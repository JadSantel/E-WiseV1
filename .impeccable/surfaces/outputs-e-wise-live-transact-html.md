---
version: 1
slug: "outputs-e-wise-live-transact-html"
primary_target: "outputs/e-wise-live/transact.html"
related_targets: ["outputs/e-wise-live/routing.html"]
---

# Transact — evaluation flow extension

Mode: Operate. The user requested the Transact mockup after Routing. This is an interactive local prototype, with no publication, payment, bidding service, provider search, or booking backend.

## Direction contract

THESIS: Carry a chosen route into an editable listing or request, then let its owner review the result before completing a clearly labeled demo.

OWN-WORLD: Preserve Figtree, near-white ground, black primary controls, lime progress, white 16px panels, green sample prices, and the existing device placeholder. Classification remains distinct from the selected action.

STORY: The sample iPhone 13 and camera fault travel from Routing. The owner edits a title, description and preferences, adds optional local photos, reviews the details, and completes a demo without publishing or submitting anything.

FIRST VIEWPORT: The familiar four-step header marks Transact active. A 64px uppercase heading leads into a broad editing column and a 336px live device/listing preview. Listing details lead; price or request preferences follow. One clear review action ends the form. Mobile stacks the form and preview, with a visible step count.

FORM: Code-led scoped extension of the established Evaluate → Classify → Route → Transact sequence. No concept seed or comp round applies to this precise flow extension. The signature interaction is the route-aware editor and live preview becoming a review and demo-completion state.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Keep resale and salvage estimates illustrative. No invented fees, providers, ratings, availability, or transaction guarantees. Preserve existing screens; add an obvious Continue to Transact link on Routing. Selection must survive standalone and embedded-board navigation. Optional photo previews stay in browser memory. No global design change or new raster asset is required.

## Implementation and verification - 2026-11-18

Implemented `outputs/e-wise-live/transact.html` and `transact.js` as the fourth evaluation step. Routing's "Continue to Transact" link carries the chosen route and selling method into an editable listing or request. Resell and salvage each support fixed-price and bidding previews; repair/reuse and disposal/recycling use request preferences without a price or provider claim. The sample iPhone 13, Resellable classification, and camera fault remain visible independently of the chosen action. Title, description, price or sample area, handover preference, and optional photos feed a live preview, followed by review, return-to-edit, and explicitly labeled demo completion. Nothing is published, booked, paid, or sent to a provider.

`preview-navigation.js` validates route/method values and passes selection between recognized board frames; standalone links carry query parameters. The back-to-Routing link restores the selection. Transact is included in both the editable live board and portable board. `work/sync_mockup.py` embeds the page's scripts and local Figtree font in the portable export. This is an ordinary code-led extension of the existing world; no global visual-system change is introduced.

System comparison checked `PRODUCT.md`, `DESIGN.md`, Transact, Routing, the existing verdict source, board navigation, and the export synchronizer. The implementation inherits near-white ground (#FAFAFA), white panels, black ink/actions (#0B0B0B), lime progress (#E5F77A), green illustrative amounts (#0A6B38), Figtree 400-800, and the 64px/800 uppercase desktop heading. It retains the 16px panel corners, soft resting shadow, 8px action corners, and 52px minimum text-field/primary-action height. The local type ramp uses 22px section headings, 20px preview titles, 16-18px body copy, and 13-15px hints/controls. The broad editor plus 336px preview, 32px desktop gap, and 1050/800/520px responsive changes are scoped composition choices. Existing rules remain: distinguish classification from action, disclose illustrative values, preserve the known fault, and use black primary controls with lime progress. These observations do not add global tokens or prohibitions.

Recorded finish evidence supplied by the implementation/review pass: independent reviewer disposition **ship**, with no material fixes. Chrome execution of `work/test-transact-browser.cjs` passed all six meaningful route/method variants (resell fixed/bidding, salvage fixed/bidding, repair, disposal); native required-field, whitespace-only input, price, and required-confirmation validation; optional-photo add/remove and invalid/corrupt-image rejection; live preview; review/edit/demo completion; query fallback; and selection round-trips through standalone pages, the live board, and the portable board. No horizontal overflow at 320, 390, 800, 900, 1280, or 1440px; no JavaScript page errors. Shared navigation tests passed sender checks, route/method validation, browse-value validation, frame resizing, and standalone behavior. The documentation pass reran `node work/test-preview-navigation.cjs` successfully and checked source without opening a browser.

Fourteen retained review captures: `.impeccable/review/transact/{desktop,mobile,mobile-320,review,completion,resell-bidding,salvage-fixed,salvage-bidding,repair-fixed,dispose-fixed,validation,mobile-review}.png` and `.impeccable/review/routing/{desktop,mobile}.png`. Detector findings: `[]`. The earlier missing-source image finding was resolved by creating preview image DOM only when a valid selected photo exists; no detector suppression was added. No new shipping raster asset was introduced. Optional source photos remain browser-memory previews, and review screenshots are verification evidence rather than product assets.

Pre-existing documentation drift is recorded without repair: `DESIGN.md` retains its legacy section structure without token frontmatter and older browser/mobile verification limitations; `.impeccable/design.json` is absent; `PRODUCT.md` still names the original two-screen evidence and earlier scope. This bounded extension preserves those global files and does not canonize that drift. The current local checks establish prototype behavior only; they do not establish publication, booking, payments, live bidding, verified valuations, or provider data.
