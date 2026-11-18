---
version: 1
slug: "outputs-e-wise-live-marketplace-html"
primary_target: "outputs/e-wise-live/marketplace.html"
related_targets: []
---

# Marketplace browsing — left-filter extension

Mode: Operate. The user requested a marketplace browsing page, using two attached Back Market screenshots as layout references, and explicitly placed filters on the left. Build in parallel with the Transact prototype while preserving all other pages.

## Direction contract

THESIS: Let a buyer narrow a varied sample device catalog without losing the result list or the meaning of each device's condition.

OWN-WORLD: Preserve E-wise's local Figtree font, near-white ground, black controls, lime accent, white 12px cards, green PHP prices, and distinct classification tags. Reuse the incumbent abstract device placeholders rather than importing another company's product photography or promises.

STORY: Search the catalog, combine left-side category, brand, condition, classification, price and sale-type filters, sort the results, then open an inline sample listing. Active-filter chips, live counts and an empty-result recovery make every refinement visible.

FIRST VIEWPORT: Wordmark, broad search field and Evaluate action above a compact device-category navigation. A clear marketplace title and sample-data note introduce a 224px left filter column and three-column listing grid. Result count and sort sit immediately above the products. Mobile uses one product column and an accessible, in-flow filter disclosure.

FORM: Code-led scoped extension, with the requested left-sidebar layout and incumbent marketplace card language fixed by the user and existing screens. No concept tournament applies. The signature interaction is a synchronized search/filter/catalog state, with chips that remove exactly one constraint.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

All listings and values are illustrative. No ratings, commercial guarantees, provider claims, real shopping cart or purchase/bid action. Native details disclose listing specifics. Preserve global PRODUCT.md and DESIGN.md; record this page's responsive behavior locally.

## Implementation and verification — 2026-11-18

Implemented in `outputs/e-wise-live/marketplace.html` and `marketplace.js`: 12 illustrative devices; six left-side filter groups (category, PHP price range, listing type, brand, physical condition, classification); all-word search; contextual facet counts; sorting; active chips with individual removal and focus recovery; clear/reset; invalid-price feedback and empty-result recovery; native inline listing details; URL query and `ewise:browse` presets. Mobile filters expand in normal document flow.

System comparison: the shipped source retains local Figtree, near-white/white surfaces, black controls, lime accents, green PHP prices, distinct classification tags, incumbent abstract device placeholders, and white 12px cards. This surface uses a 44px heading, 17px card titles, 25px prices and 13–16px supporting text; the narrow layout uses 32px/19px/28px respectively. Its local composition is a 1200px maximum container, 224px sidebar, 28px gap and three-column grid; at 1050px it becomes a 200px sidebar/two-column grid, at 760px filters collapse into a disclosure, and at 520px products form one column. These are page-specific observations, not new global rules. `PRODUCT.md`, `DESIGN.md`, and the design sidecar are preserved; pre-existing documentation drift is neither repaired nor canonized by this extension.

Build verification reports `work/test-marketplace-browser.cjs` passing filter combinations, contextual counts, chip/reset behavior, text-safe search, sorting, price/error states, empty recovery, keyboard details/disclosure, native/event presets, and no horizontal overflow or page errors at 320/390/760/800/1024/1280/1440px. `work/test-marketplace-integration.cjs` passes native and embedded live/portable-board handoffs (home → marketplace, Verdict iPhone query → three results, marketplace → Evaluate), with all six frames and no page errors; the parent integration pass also reports synchronized portable output and passing shared unit/regression checks. Final captures are `.impeccable/review/marketplace/{desktop,mobile,mobile-320,mobile-filters,filtered,empty,price-error,listing-open}.png`. Independent finish review: **ship**, with no material fixes. The detector's cramped results-toolbar padding finding was corrected with an explicit 8px vertical inset; final captures were refreshed and no suppressions added. No new raster assets or commerce backend were introduced; review PNGs are browser captures of this prototype, not generated shipping imagery.
