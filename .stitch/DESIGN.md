---
name: DevLog Minimalist Editorial
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#454655'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#757687'
  outline-variant: '#c6c5d8'
  surface-tint: '#3c4ae0'
  primary: '#1c2ac8'
  on-primary: '#ffffff'
  primary-container: '#3b49df'
  on-primary-container: '#d2d4ff'
  inverse-primary: '#bdc2ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#004b6d'
  on-tertiary: '#ffffff'
  tertiary-container: '#006490'
  on-tertiary-container: '#b1ddff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000668'
  on-primary-fixed-variant: '#1d2cc9'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  canvas-subtle: '#F5F5F5'
  text-muted: '#717171'
  code-surface: '#0F172A'
  code-border: '#1E293B'
  accent-success: '#10B981'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: 22px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an editorial, high-clarity publication environment built for software engineers, technical architects, and developer-writers. The aesthetic balances modernist Swiss functionalism with modern developer culture: rigorous typographic rhythm, thoughtful whitespace, structural slate neutrals, and a refined indigo focus accent derived from developer community traditions.

Key personality traits:
- **Focused & Uncluttered**: Content-first hierarchy where technical writing, architecture diagrams, and syntax-highlighted code blocks take visual priority over heavy chrome.
- **Engineered Precision**: Crisp geometry softened by calculated border radii (`rounded-xl` containers), subtle hairline divides, and quiet ambient elevation.
- **Multilingual Readability**: Specifically tuned for deep technical prose in both English and Vietnamese, preventing diacritic collisions through generous line heights and balanced vertical metrics.

## Colors

The palette establishes an intentional contrast hierarchy between technical code surfaces and editorial copy:
- **Primary (`#3B49DF`)**: A high-energy indigo blue honoring developer publication heritage, deployed for primary interactions, active tab states, and linked code references.
- **Secondary (`#4F46E5`)**: A complementary deep indigo utilized for interactive hover states, active badges, and focus rings.
- **Tertiary (`#0EA5E9`)**: A vivid sky cyan dedicated to interactive tags, inline metadata highlights, and secondary calls to action.
- **Neutral (`#171717`)**: Near-black foundational tone ensuring razor-sharp contrast for article body text and primary container boundaries.
- **Named Colors**:
  - `canvas-subtle` (`#F5F5F5`): Canvas grounding tone providing soft optical separation against pure white content cards.
  - `text-muted` (`#717171`): Accessible intermediate tone for timestamps, reading estimates, and bylines.
  - `code-surface` (`#0F172A`) & `code-border` (`#1E293B`): Dark slate tones maintaining terminal-like contrast for syntax highlighting across both light and dark operational modes.

## Typography

The typographic hierarchy accommodates long-form technical engineering essays, code documentation, and Vietnamese diacritical marks:
- **Headings (Plus Jakarta Sans)**: Contemporary, balanced geometry with tight negative tracking for high-impact titles and technical section dividers.
- **Reading Body (Inter)**: Set with an expanded line-height ratio (~1.65 on long-form body) to ensure that Vietnamese tone marks (dấu hỏi, ngã, nặng, sắc, huyền) never collide with preceding or succeeding ascenders and descenders.
- **Code & Metadata (JetBrains Mono)**: Monospaced fidelity for snippet blocks, inline identifiers, commit hashes, reading times, and tag chips. Ligatures should be preserved for common programmatic glyphs (`=>`, `===`, `!=`).

## Layout & Spacing

The layout employs a content-centric grid designed around distraction-free reading widths and modular companion sidebars:
- **Reading Canvas**: Long-form editorial content is constrained to an optimal maximum measure of `680px` to `760px` (~65-75 characters per line) to maintain typographic flow.
- **Desktop Grid (12 Columns)**: 
  - 2-3 columns dedicated to author profile, article index/outline, or series navigation.
  - 6-7 columns dedicated to the primary editorial article body.
  - 2-3 columns dedicated to sticky Table of Contents (TOC) and article reactions.
- **Tablet / Responsive**: Reflows into a single primary column with sticky floating bottom navigation for reactions and outline jump anchors.
- **Spacing Rhythm**: Governed by an 8pt base unit. Vertical margin between distinct prose paragraphs is fixed to `1.25rem` (`space-md` + `space-xs`), while major technical section headings mandate `space-xl` separation above.

## Elevation & Depth

This system avoids heavy drop shadows, instead utilizing layered tonal depth combined with refined ambient occlusion:
- **Level 0 (Canvas Base)**: Surface tone `#F5F5F5` (or dark mode equivalent `#0A0F1D`).
- **Level 1 (Card & Article Surfaces)**: Crisp `#FFFFFF` surface bordered by a subtle 1px structural hairline (`rgba(0, 0, 0, 0.06)` or `rgba(255, 255, 255, 0.08)` in dark mode). Layered with an ambient shadow: `0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.03)`.
- **Level 2 (Hovered Cards & Dropdowns)**: Ambient shadow blooms to `0 12px 32px -4px rgba(59, 73, 223, 0.08)`, introducing a faint indigo tint that signals interactivity.
- **Level 3 (Modals & Sticky Dock Overlays)**: Surface elevation with `0 24px 48px -12px rgba(15, 23, 42, 0.18)` coupled with an ultra-thin border stroke.

## Shapes

The geometry uses a balanced modern curvature that prevents a boxy aesthetic while maintaining an organized, technical feel:
- **Standard Surfaces**: Primary containers, article cards, and syntax code blocks leverage `rounded-xl` (1.5rem / 24px) for outer perimeter boundaries.
- **Interactive Controls**: Buttons, inputs, and search dialogs use standard `rounded` (0.5rem / 8px).
- **Metadata & Micro-components**: Category chips, tag pills, and author avatars adopt full pill rounding (`rounded-full`) or soft-quarter curves (`0.375rem`) for compact tags.

## Components

- **Buttons**:
  - *Primary*: `#3B49DF` background, pure white bold text, 0.5rem radius, subtle inset highlight on top edge. Hover shifts to `#4F46E5`.
  - *Ghost / Editorial*: Transparent background, `#171717` text, subtle slate background shift (`rgba(0,0,0,0.05)`) on hover.
  - *Monospace Action*: Used for copying code snippets, displaying keyboard shortcuts (`Cmd + K`), and branching; uses JetBrains Mono `label-sm`.
- **Code Blocks & Syntax Windows**:
  - Encased in `rounded-xl` slate container (`#0F172A`).
  - Header ribbon includes file name indicator in `JetBrains Mono`, language badge, and a persistent "Copy Code" action with instant state transition feedback.
  - Integrated horizontal overflow handling with fade cues.
- **Article & Publication Cards**:
  - Clean white containers resting on `#F5F5F5` canvas with 1px border.
  - Title hierarchy leverages `headline-md` in Plus Jakarta Sans. Includes read-time tag, published date in Vietnamese localized format, and author badge.
- **Chips & Tags**:
  - Prefixed with `#` symbol in JetBrains Mono.
  - Resting background is transparent with a soft hairline outline; hover activates subtle indigo-tinted fill with colored text (`#3B49DF`).
- **Inputs & Search Bars**:
  - Clean input fields with 1px border (`#E5E7EB`), expanding into a glowing focus ring in primary indigo (`box-shadow: 0 0 0 3px rgba(59, 73, 223, 0.15)`).
- **Table of Contents (Sticky Widget)**:
  - Minimal list with left-hand vertical active track indicator that animates smoothly between section offsets as the reader scrolls through technical content.