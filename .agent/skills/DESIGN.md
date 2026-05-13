---
name: Arena Optimizer
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c6ae'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907b'
  outline-variant: '#4d4635'
  surface-tint: '#e8c33d'
  primary: '#ffe9a7'
  on-primary: '#3b2f00'
  primary-container: '#f0cb44'
  on-primary-container: '#695500'
  inverse-primary: '#725c00'
  secondary: '#ddfcff'
  on-secondary: '#00363a'
  secondary-container: '#00f1fe'
  on-secondary-container: '#006a70'
  tertiary: '#f1e6ff'
  on-tertiary: '#3d008f'
  tertiary-container: '#d8c5ff'
  on-tertiary-container: '#6a24de'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe07d'
  primary-fixed-dim: '#e8c33d'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#564500'
  secondary-fixed: '#74f5ff'
  secondary-fixed-dim: '#00dbe7'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#24005b'
  on-tertiary-fixed-variant: '#5800c8'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-xs:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 48px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for the competitive Magic: The Gathering Arena player. It prioritizes data density and tactical clarity, bridging the gap between a high-stakes gaming environment and a professional financial tool. The personality is authoritative, precise, and sophisticated.

We utilize a **Gaming-Tech** aesthetic—a hybrid of **Modern Corporate** efficiency and **Glassmorphism**. This approach uses semi-transparent surfaces and vibrant accents to maintain a "live" feel, while strict alignment and clean typography ensure that complex wildcard mathematics and deck lists are processed with zero cognitive friction. The interface should feel like a premium command center for deck optimization.

## Colors
The palette is rooted in a "Void" charcoal base to allow data and card art to pop. 
- **Primary (Mythic Gold):** Reserved for "Crafting," "Importing," and final calls to action. It evokes the prestige of Mythic Rare wildcards.
- **Secondary (Neon Cyan):** Used for predictions, trends, and future-state data. It represents the "tech" and "prediction" aspect of the tool.
- **Tertiary (Arena Purple):** Used for structural brand elements, headers, and UI depth, grounding the tool in the MTG Arena ecosystem.
- **Surface Neutrals:** A series of sleek charcoals (#1E1E1E, #2A2A2A) provide the container hierarchy without relying on heavy borders.

## Typography
We utilize **Inter** across the entire system for its exceptional legibility in data-heavy environments. 
- **Headlines:** Use tight letter-spacing and bold weights to command attention, similar to high-tier gaming HUDs.
- **Data Labels:** Small, all-caps labels are used for card counts (e.g., "4x"), rarity identifiers, and mana costs to maximize space.
- **Numbers:** Tabular lining should be enabled for all numerical data to ensure wildcard counts and prices align perfectly in columns.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop. 
- **Information Density:** We favor a compact 8px spacing rhythm to ensure that entire deck lists (60-100 cards) can be viewed with minimal scrolling.
- **Sidebars:** Use a fixed-width left sidebar (280px) for navigation and filters, while the main content area (Deck List & Budgeting) remains fluid.
- **Mobile:** Elements reflow into a single column, with cards shifting to a horizontal "row" format to preserve legibility of card names and wildcard costs.

## Elevation & Depth
Depth is created through **Backdrop Blurs** and **Tonal Layering** rather than traditional drop shadows.
- **Level 0 (Background):** Deep charcoal (#121212).
- **Level 1 (Cards/Panels):** Semi-transparent charcoal (#1E1E1E at 80% opacity) with a `12px` backdrop blur.
- **Level 2 (Modals/Popovers):** Lighter grey (#2A2A2A) with a subtle 1px inner border in a low-opacity white to simulate a glass edge.
- **Glow Effects:** Critical alerts or "Mythic" status updates use a soft, primary-colored outer glow (bloom effect) instead of a shadow to maintain the gaming-tech vibe.

## Shapes
The shape language is **Rounded (0.5rem base)**. This softens the "technical" nature of the tool, making it feel modern and approachable. 
- **Buttons:** Fully rounded (pill) for secondary actions, but 0.5rem rounded for primary "Craft" buttons to maintain a sense of stability.
- **Card Sleeves:** Images of cards within the UI should mirror the in-game Arena clipping, using a slightly tighter corner radius (4px) to feel authentic to the source material.

## Components
- **Primary Action Buttons:** High-gloss Gold (#F0CB44) with black text. On hover, a slight "shimmer" gradient effect should pass over the button.
- **Wildcard Chips:** Small, high-contrast badges that mirror the shape of Arena wildcards (Common, Uncommon, Rare, Mythic) with the specific rarity color.
- **Deck List Rows:** Interactive rows that highlight on hover with a Neon Cyan left-border accent. Must include quantity adjusters and rarity indicators.
- **Progress Bars:** Used for "Wildcard Completion." Background is a dark track, while the fill is a Neon Cyan gradient to show progress toward a finished deck.
- **Input Fields:** Dark backgrounds with 1px Cyan borders that "activate" (glow) when focused.
- **Data Cards:** Glassmorphic containers for "Predicted Cost" or "Wildcards Needed," featuring large numerical headlines.