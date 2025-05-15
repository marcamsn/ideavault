# IdeaVault Style Guide

## Overall Aesthetic

* **Mood & Palette**: Soft, dreamy pastel gradients (pinks, lavenders, very light blues). Backgrounds fade subtly from one hue to another.
* **Depth & Lighting**: Glass-like "frosted" cards floating above the background, achieved via semi-transparent fills, heavy backdrop blur, and gentle inner/outer shadows.
* **Neumorphism Touches**: Icons and containers have very soft, extruded edges—no hard lines—giving a tactile, pillowy feel.

## Layout & Spacing

* **Grid**: Consistent 2 × 2 (or variable) card grid, with ample white/blurred space between cards.
* **Margins & Padding**:
  * Outer screen padding ~24px.
  * Card padding ~16px inside.
  * Spacing between cards ~12–16px.
* **Alignment**: Center-aligned for primary elements; icons centered within their cards.

## Cards

* **Shape**: Rounded rectangles, border-radius ~20px (2rem).
* **Size**: Uniform size (around 120 × 100dp on mobile), scalable for different screen widths.
* **Background**:
  * White with 10–20% opacity, or a pastel tint matching the overall gradient.
  * Heavy Gaussian blur on backdrop (e.g. `backdrop-filter: blur(20px)`).
* **Shadows**:
  * Subtle outer shadow (e.g. `0px 10px 30px rgba(0,0,0,0.05)`).
  * Very faint inner highlight on top edge for floating effect.
* **Icon & Label**:
  * Icon weight: medium stroke, monochromatic dark grey.
  * Label: centered below icon, font-size ~14px, font-weight 500, color #333.

## Header & Cards Container

* **Greeting ("Good afternoon, Alexander")**:
  * Font-size ~24px, weight 600.
  * Color #222 on light background.
* **Account Summary Card**:
  * Full-width pill shape (border-radius ~30px), gradient fill matching main palette.
  * Inner text: account mask + balance in bold 18–20px, white or very dark grey depending on contrast.
* **Buttons ("Frequents" / "New")**:
  * Pill-shaped toggles: 1px border, white fill at 90% opacity, soft shadow.
  * Active state: slight color fill, icon + text in bold.

## Typography

* **Font Family**: Sans-serif (e.g. Inter, SF Pro).
* **Weights**:
  * Headings: 600
  * Body: 400–500
* **Sizes**:
  * XL titles: ~24px
  * Card labels: ~14px
  * Button text: ~16px

## Icons

* **Style**: Simple outline vector icons, uniform stroke width.
* **Color**: Single-tone #555 for default, #222 for high-priority elements.

## Interaction States

* **Hover / Press**:
  * Slight scale up (1.02×) and shadow intensification.
  * Pressed: background opacity increases, subtle inset shadow.
* **Disabled**:
  * Lower opacity (50%), no shadow.

## CSS Implementation Examples

```css
/* Example Card Styling */
.card {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: scale(1.02);
  box-shadow: 0px 12px 35px rgba(0, 0, 0, 0.08);
}

/* Example Gradient Background */
.app-background {
  background: linear-gradient(135deg, #f5e6fa 0%, #e6f0ff 50%, #f0e6ff 100%);
  min-height: 100vh;
}

/* Example Typography */
.title {
  font-size: 24px;
  font-weight: 600;
  color: #222;
}

.card-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: center;
}
```

## Tailwind Implementation

```javascript
// Example tailwind classes for cards
// card: "bg-white/15 backdrop-blur-xl rounded-3xl p-4 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"

// Example tailwind classes for gradient background
// bg-gradient: "bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50"
```
