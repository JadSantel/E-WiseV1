---
version: 1
slug: "outputs-e-wise-live-buyer-html"
primary_target: "outputs/e-wise-live/buyer.html"
related_targets: ["outputs/e-wise-live/marketplace.html"]
---

# Buyer offer and bid — marketplace flow extension

Mode: Operate. The user requested a buyer flow for making an offer or placing a bid. Extend the existing local prototype, preserving the left-filter marketplace and seller flow.

## Direction contract

THESIS: A buyer chooses a sample listing, enters an amount, reviews the known condition and their proposal, then completes a clearly labeled demo.

OWN-WORLD: Inherit Figtree, near-white ground, black controls, lime progress and confirmation, white 16px panels, green PHP prices, distinct classification tags, and the workspace's existing device visuals.

STORY: Make an offer on a fixed-price or parts listing, or place a demo bid on a bidding listing. Amount validation precedes review; editing preserves the draft; completion explains the next real-world step without contacting a seller, taking payment, or claiming a win.

FIRST VIEWPORT: Familiar wordmark and marketplace navigation above a 64px uppercase heading. A three-stage Enter → Review → Demo complete indicator introduces a broad form and a 336px listing summary. Asking/starting price and known faults remain visible. Mobile stacks the same content without clipping.

FORM: Code-led scoped extension of the existing marketplace and transaction workflow. No seed or comp round applies to this precisely requested flow extension. The signature interaction is one selected listing driving offer/bid copy, amount validation, review, and confirmation together.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Share the authored sample catalog between marketplace and buyer so prices and faults agree. Direct links and board navigation must carry the listing identity. Unknown listing IDs show recovery instead of substituting a different device. Demo offers accept positive whole PHP amounts; demo bids meet the sample starting price. This is a visible demo rule, not an approved production auction policy. No live bidder history, countdown, fees, acceptance, checkout, or payment. Preserve global product/design documents and use no new shipping raster assets.

During verification, concurrent workspace edits expanded the sample catalog to 18 entries, added vector device visuals, and changed homepage featured listings. Preserve those edits and test the buyer flow against the current catalog; this buyer extension does not author or approve a new global imagery system.

## Implementation and verification record — 2026-11-18

### Shipped surface and inherited system

The buyer extension is implemented in `outputs/e-wise-live/buyer.html` and `buyer.js`, with listing handoffs from `marketplace.js`, the shared `catalog.js`, and `preview-navigation.js`. It is an ordinary code-led extension of the incumbent system. `PRODUCT.md`, `DESIGN.md`, and existing product/design sidecars are preserved; this record does not regenerate or approve global design rules. No `.impeccable/design.json` was present when this record was written, and this scoped extension does not create one.

Source inspection confirms the inherited near-white page (`#FAFAFA`), white panels, black ink/actions (`#0B0B0B`), secondary text (`#4A4A4A`), lime completed steps/confirmation (`#E5F77A`), green PHP amounts (`#0A6B38`), and separate classification tag colors. Figtree remains the sole type family. The buyer display uses 64px/800 with .95 line-height and -.04em tracking, reducing to 48px below 800px and 40px below 520px; panel headings use 26px/600 and body/control text uses the incumbent 13–18px range. The 1200px container, 24px gutters, 16px white panels, restrained resting shadow, 8px action corners, 10px field corners, 52px controls, and visible keyboard focus all derive from existing patterns. The desktop form/336px summary split stacks below 800px. These are surface inheritance observations, not new project-wide tokens.

The selected listing drives the form, disclosed condition, price, review, and completion together. The form now names the device and listing type in `#form-listing` before the amount input at every width and for fixed-price, bidding, and parts modes. Review and completion retain listing identity and known faults; editing keeps the draft. Unknown IDs produce a recovery screen rather than silently selecting another listing. Optional seller messages are rendered as text, and bidding hides and disables that optional field.

The concurrent catalog expansion, `device-visuals.js` SVG mock devices, homepage featured-card changes, and the associated `DESIGN.md` update belong to the separate workspace edit. This task preserves and consumes them without claiming authorship or global approval. The 18 current listings were included in buyer verification. Device visuals are decorative; condition text remains the disclosure. No new shipping raster was added by this buyer extension.

### Finish review and evidence

The initial finish review found one material issue: mobile users reached the amount field before seeing the selected device name and listing type. Adding `#form-listing` resolved that finding across widths and listing modes. The same reviewer rechecked the scored fix, found no visible regression, and returned **PASS — ship** for that fix. The prior full review otherwise had no material findings; the recheck is not represented as a second full review of every surface.

The session's final `work/test-buyer-browser.cjs` run passed against all 18 sample listings. Reported coverage includes listing identity/price/fault bindings; offer, bid, and parts forms; invalid, fractional, empty, negative, and excessive amounts; required condition acknowledgement; the sample minimum bid; review/edit/demo completion; unknown-listing recovery; safe optional-message rendering; keyboard submission; and no horizontal overflow from 320–1440px. The selected-listing-before-amount assertion passed across those widths. Native page links, homepage entry points, the live board, and the portable board retained listing identity. No page errors or network writes were observed by that run. This documentation pass inspected the implementation and test source; it did not rerun browser tests or perform an additional visual review.

Shared navigation unit checks and the updated marketplace browser/integration checks also passed in this session. Seller Transact/Routing regression checks passed earlier in the turn, before the concurrent visual changes; that earlier result does not establish the latest visual state of those seller surfaces. The portable board was synchronized with all seven editable pages, with catalog and device-visual JavaScript embedded by `work/sync_mockup.py`.

The 14 final capture files are present and nonempty under `.impeccable/review/buyer/`: `desktop.png`, `mobile.png`, `mobile-320.png`, `bid-desktop.png`, `offer-review.png`, `offer-complete.png`, `bid-review.png`, `bid-complete.png`, `parts-review.png`, `amount-error.png`, `not-found.png`, `mobile-review.png`, `mobile-bid-review.png`, and `marketplace-desktop.png`. These are review evidence, not shipping imagery.

The detector ran once and reported an aphoristic-cadence warning. Header, handover, and review copy were rewritten in response, without suppressions. No second detector scan was run, so a clean rescan is not claimed.

### Product boundary and drift not canonized

This is a local demo: no live offer or bid is submitted, no seller response or auction result is produced, and no payment, checkout, authentication backend, reservation, or device award is implemented. Offers accept positive whole-peso demo amounts; bids accept whole pesos at or above the sample starting price; both cap the amount at PHP 9,999,999. Those explicit prototype limits do not establish approved production offer or auction policy.

The existing global design document contains historical observations that do not fully describe the current responsive and vector-visual implementation. This surface record preserves that document and records the buyer's current inheritance without canonizing the drift or repairing another task's global documentation. No new visual prohibition, global imagery rule, or detector exception is introduced.
