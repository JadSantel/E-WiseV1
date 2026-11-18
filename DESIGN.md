# E-wise — incumbent design baseline

Source: the supplied HTML board, preserved in `outputs/E-wise-design-baseline.html`. These are observations from its embedded HTML/CSS, not a redesign or newly approved design choices. Preserve the current screens until the user specifies an edit.

## Visual identity

Near-white background, black typography and primary actions, lime accent, restrained pastel surfaces, rounded corners, and generous spacing. Figtree is the existing typeface, using weights 400–800. Large uppercase display headlines anchor the screens; supporting text and controls use sentence case.

## Colors

| Role | Existing value |
| --- | --- |
| Page / surface | #FAFAFA / #FFFFFF |
| Ink / secondary text | #0B0B0B / #4A4A4A |
| Divider / neutral fill | #E4E4E4 / #EDEDED |
| Accent | #E5F77A |
| Lavender | #E7DDFB |
| Value text | #0A6B38 |
| Homepage active marketplace link | #C0182B |
| Resellable tag background / text | #B9F2C9 / #064B24 |
| Repairable tag background / text | #CFE6F7 / #0B3A5C |
| Salvageable tag background / text | #F7E2B5 / #5C3A00 |
| Disposable tag background / text | #E4E4E4 / #262626 |

Preserve the distinction between classification tags and action tiles: Sell uses lime, Repair blue, Salvage amber, and Recycle lavender. The homepage also uses blue for “For parts” and amber for “Open for bids”; those are existing treatments, not a universal status mapping.

## Typography and layout

- Homepage container: 1120px maximum, 24px horizontal padding. Hero: 104px, weight 800, line-height .92, letter-spacing -.045em; 56px below 900px.
- Evaluate container: 1200px maximum, 24px horizontal padding. Display heading: 64px, weight 800, line-height .95, letter-spacing -.04em.
- Homepage section titles: 24px/600. Evaluate section titles: 22px/600. Body/control text generally 14–18px.
- Homepage: centered hero/device cluster, four outcome tiles, marketplace cards, promise tiles, two promotional tiles, black footer.
- Evaluate: four-step header, five numbered form sections, a 380px sticky estimate sidebar, and 32px column gap. Form sections use 28px padding and 20px vertical gaps.
- Existing breakpoint at 900px: homepage grids become two columns and category navigation disappears; Evaluate stacks its columns, hides the header step list, and removes sidebar stickiness.
- The board embeds fixed 1360px-wide desktop frames. Phone layouts have not been verified or approved.

## Components

- Primary actions: black fill, white type, 8px radius, 48px homepage / 52px Evaluate minimum height.
- Marketplace outline actions: 1.5px black border, 6px radius, 48px minimum height; invert on hover.
- Search and filter pills: fully rounded, neutral fill; marketplace selected tab lavender. Evaluate selected chips black with white text.
- Marketplace cards: white, 12px radius, 16px padding. Tags: 4px radius, 13px/600 text.
- Evaluate sections and estimate panel: white, 16px radius. Inputs: 10px radius, 1.5px #D4D4D4 border, 52px minimum height.
- Condition options: 12px radius; selected option uses a 2px black border and near-white fill.
- Resting shadow: 0 2px 10px rgba(0,0,0,.06). Homepage card hover: 0 14px 32px rgba(0,0,0,.12).
- Existing device imagery uses simple dark gradient shapes. Preserve placeholders until imagery work is requested.

## Motion and future edit guardrails

The baseline includes gentle device floating, small button/card lifts, tile scaling, and an estimate indicator pulse. Continue the established motion language and fully respect reduced-motion preferences in future edits.

Reuse existing colors, typography, spacing, controls, and terminology. Preserve user-approved copy and behavior outside the requested scope. Keep classifications distinct from actions. Do not introduce invented prices, operating statistics, ratings, or working transaction claims.

The user subsequently requested mock device names, condition, storage, age, prices, and estimated values. Illustrative listings and evaluation values are now authorized and labeled as samples. They use PHP (₱) in the current prototype; they are not verified market valuations. The accepted live edit removed the homepage's “Choose what to do with it” section. Editable pages live in `outputs/e-wise-live/`; the single-file board is synchronized to those pages. The original unmodified attachment is archived in `work/original-design-baseline.html`.

## Verification boundary

Current homepage header starts with the wordmark/search row; the user removed the lime promo strip and utility row. The black footer now contains the wordmark and short product description, About E-wise / Services / Support link groups, and a bottom copyright/legal row. Footer links use muted white text, lime hover/focus states, and responsive columns. These are mock informational links; no new destination pages were requested.

Hero evaluator: the user's image is a layout reference, not a visual specification to copy. Keep Figtree, black primary actions (#0B0B0B), neutral control fills (#EDEDED), 8px control corners, and the existing 12px card surface. The hero now pairs a device-type dropdown with “Evaluate”; the group stacks on narrow screens. The user removed the four classification tags beneath the hero devices and the complete E-wise Promise section. Keep classification tags on marketplace cards. Do not copy the reference's green button or typography into this system.

The original archived board matched the attachment's SHA-256 before subsequent user-requested edits. The current board includes those edits. The current browser tools could not display the local file, so source checks do not claim rendered visual QA, mobile readiness, or working transaction behavior. Perform visual verification when a permitted preview is available.
