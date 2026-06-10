# GLASS.md

## Glass for the Web

This document defines a practical way to build a convincing glass component for the web. The target is not a blurry translucent box. The target is a **material** that feels like curved glass.

The mistake most implementations make is obvious: they use too much transparency and too little structure. Realistic glass needs controlled opacity, refraction, edge lighting, shadow, and a subtle tint.

## What glass should feel like

A good glass component should do all of this at once:

* distort the content behind it
* hide the background enough to preserve contrast
* create a sense of thickness
* catch light at the edges
* float above the page with depth
* stay readable and usable in real UI

If people can read everything behind the panel too easily, it stops feeling like glass and starts feeling like clear plastic.

## The core principle

The center of the system is a **displacement map**.

A displacement map is a generated image that tells the renderer how to bend pixels.

* **red channel** controls horizontal shift
* **green channel** controls vertical shift
* **neutral value** means no movement

The renderer does not fake the scene. It bends the real content already on the page.

## The mental model

Think of a lens over live content.

* the center bends lightly
* the edges bend more
* the panel itself has tint and thickness
* the background is visible, but not dominant
* the glass feels like a physical layer, not a transparent overlay

That balance is what makes the UI feel deliberate instead of unfinished.

## Rendering paths

There are two main rendering paths.

### DOM path

Use SVG filters, especially `feDisplacementMap`, to refract live DOM content.

This is best for:

* text
* menus
* cards
* switches
* sliders
* toggle groups
* overlays

### WebGL path

Use WebGL when SVG filters cannot handle the surface correctly.

This is useful for:

* canvas-drawn content
* QR codes
* video
* browser-specific limitations, especially Safari

## Why transparency alone fails

A transparent panel with blur is not enough.

If the background is too visible:

* contrast drops
* text behind the glass competes with the foreground
* the panel feels flat
* the surface loses materiality

The fix is not more blur. The fix is **better material design**.

That means:

* a stronger tint
* a controlled blur
* an edge highlight
* a shadow underneath
* enough opacity to separate layers

## Visual layers that matter

### 1. Tint

A very light neutral or white tint helps the panel feel like its own surface.

### 2. Blur

Blur softens the background, but should never be the only effect.

### 3. Border

A thin border gives the glass a clear edge and helps define thickness.

### 4. Inner highlight

A subtle top or top-left highlight makes the surface feel curved.

### 5. Shadow

A shadow pulls the panel away from the background and adds depth.

### 6. Chromatic aberration

A tiny color separation near the edges makes the material feel more physical.

## The implementation flow

1. Render the content normally.
2. Generate a lens-shaped displacement map.
3. Apply the map to the live content.
4. Add tint, highlight, rim lighting, and shadow.
5. Keep the panel readable.

The effect should bend the real content, not a screenshot.

## Displacement map generation

The displacement map can be generated on a canvas.

The logic is simple:

* strong distortion near the curved edges
* weaker distortion near the center
* neutral values outside the lens

### Pseudocode

```ts
function generateLensMap(width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const maxDistance = Math.min(cx, cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.max(0, 1 - distance / maxDistance);

      const offsetX = dx * strength * 0.5;
      const offsetY = dy * strength * 0.5;

      // R = 128 + offsetX
      // G = 128 + offsetY
      // B can stay neutral
    }
  }
}
```

## SVG implementation

For live DOM, SVG is the cleanest path.

```jsx
<svg width="0" height="0" aria-hidden="true">
  <filter id="glass">
    <feImage href={mapUrl} result="map" />
    <feDisplacementMap
      in="SourceGraphic"
      in2="map"
      scale="20"
      xChannelSelector="R"
      yChannelSelector="G"
    />
  </filter>
</svg>
```

Apply it to the component:

```css
.glass {
  filter: url(#glass);
}
```

## React component skeleton

```tsx
import React, { useMemo } from "react";

type GlassProps = {
  children: React.ReactNode;
  className?: string;
};

export function Glass({ children, className = "" }: GlassProps) {
  const mapUrl = useMemo(() => generateLensMap(100, 100), []);

  return (
    <>
      <svg width="0" height="0" aria-hidden="true">
        <filter id="glass">
          <feImage href={mapUrl} result="map" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className={`glass ${className}`}>
        {children}
      </div>
    </>
  );
}
```

## A better glass recipe

A convincing glass panel usually needs this combination:

* medium opacity, not near-transparent
* soft blur, not heavy blur
* slight white or neutral tint
* thin border or rim light
* subtle inner highlight
* shadow beneath the panel
* slight refraction in the center

This is the difference between a polished material and a weak frosted rectangle.

## Suggested CSS direction

A starting point might look like this:

```css
.glass {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(22px) saturate(170%);
  -webkit-backdrop-filter: blur(22px) saturate(170%);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08);
  border-radius: 28px;
}
```

This is not the final design. It is just the minimum direction the panel should follow.

## Interaction patterns

The same glass system can power multiple components.

### Switch

The thumb can behave like a small moving lens.

### Slider

The handle can refract the fill beneath it while moving along the track.

### Toggle group

The selection indicator can be a glass pill that slides between options.

### Menu panel

The panel can float over the page without looking detached.

### QR code

Use WebGL if the QR is drawn to canvas and needs refraction.

### Video controls

Use WebGL if the browser refuses to filter the video surface correctly.

## Performance rules

A good effect must stay fast.

### Recompute only when needed

Generate the map only when the lens size or shape changes.

Do not regenerate it every time the panel moves.

### Use symmetry

If the lens shape is symmetric, compute one quadrant and mirror it.

That reduces work and helps keep animation smooth.

### Respect Safari quirks

Safari can behave differently from Chromium.

Practical implementation should account for:

* filter caching by ID
* large filter regions causing issues
* video surfaces not passing through the SVG pipeline reliably

## WebGL fallback

When SVG filters are not enough, use WebGL.

The same displacement logic can be applied in a fragment shader.

```glsl
vec2 offset = (texture(mapTex, uv).rg - 0.5) * scale;
vec4 color = texture(sceneTex, uv + offset);
gl_FragColor = color;
```

The rendering backend changes.
The lens logic stays the same.

## Design rule

Do not start with blur.

Start with these questions:

* how much of the background should be visible?
* where should the highlight sit?
* how much contrast do the foreground elements need?
* does the panel feel like a material?
* does it separate cleanly from the page?

That is how you get closer to Apple-style glass.

## Suggested API

```tsx
<Glass
  lens={{
    width: 90,
    height: 60,
    radius: 30,
    depth: 10,
    curvature: 40,
    chroma: 0.2,
  }}
>
  {children}
</Glass>
```

## Final takeaway

A real glass component is a rendering system, not a CSS trick.

The formula is:

* live content
* displacement map
* controlled opacity
* tint
* highlight
* shadow
* slight chromatic aberration
* WebGL fallback when required
* Safari-safe handling

That is how you build glass that feels like a material instead of a transparent box.
