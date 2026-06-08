Back
The challenge with the web
A family of components
How it works
Making it work everywhere
The future

Building Glass for the Web

In June last year Apple announced Liquid Glass at WWDC, a fresh design language built around the physics of light bending through curved glass. It was a bold move that immediately captured the imagination of designers and developers alike.

We felt inspired to bring that same magic to our apps, starting by bringing our own version of the effect to our Aave App for iOS and Android, which we call Aave Glass.

This quickly became a defining part of the Aave App experience, making our interfaces feel more alive and tactile.

We want to bring this same feeling to the experiences we build on the web.
The challenge with the web
In the months that followed WWDC, we saw a wave of interest from others who also felt inspired to recreate the effect for the web. Most of the demos and experiments that surfaced only ran in Chromium browsers. They leaned on either an SVG backdrop-filter approach or the experimental HTML-in-Canvas API hidden behind a flag, and neither holds up in other browsers.

Before building our own, we worked through the approaches already going around.

Approach	Chromium	Safari	Firefox
SVG backdrop-filter	✓	✕	✕
HTML-in-Canvas API	Behind flag	✕	✕
Our technique	✓	✓	✓
Our technique runs in every modern browser, on desktop and on mobile, with no flags to turn on and no fallbacks to maintain. It just works.

A family of components
Building a cross-browser effect that works on any content was only the first step. We wanted to make sure it could be used in real interfaces, and that it could bring the same sense of delight to our web experiences as it does in our mobile apps.

So we built a family of components that use the glass as a core part of their experience.

Even with a small component like this switch, the glass effect adds a sense of depth and tactility.

Mobile apps rely on switches for binary choices, and glass suits them well. The thumb of the switch is a small lens that creates a moving highlight as you toggle.

The content renders normally and stays visible everywhere outside the lens, the whole ideology behind our technique is that it refracts live HTML, the real rendered content.

To achieve the glass effect on the handle we give our glass component a copy of the track's fill that sits on its own layer and gets bent by the glass. The fill registers as a moving highlight that gives the switch a sense of depth and tactility.

<Glass
  lens={{ lensW: 90, lensH: 60, borderRadius: 30 }}
  x={progress} // lens acts as the thumb (0–1 across the track)
>
  <SwitchTrack />
</Glass>
Native <input type='range' /> elements are back-synced with our custom component.

A slider is also a natural home for the effect. The glass travels along the track, refracting the fill beneath it as it goes, and the value you're setting stays visible right through the glass.

Dragging is cheap to animate. As the handle moves, only the filter's region shifts along the track while the displacement map stays the same, so the motion holds a steady frame rate even on a phone. The map is regenerated only when the glass changes shape, never when it simply changes place.

The slider leans on a gentler bend than the switch, a fraction of the refraction strength, since the fill underneath has to stay readable as a value rather than just register as a moving highlight.

// Same refractionTarget trick, a softer bend, the handle drives the lens.
<Glass
  lens={{ lensW: 90, lensH: 60, borderRadius: 30 }}
  x={handlePosition}
  refractionTarget={<TrackFill progress={progress} />}
>
  <SliderTrack />
</Glass>
The glass effect helps visually highlight the selected option.

The toggle group uses the glass itself as the selection indicator, gliding between options and easing towards the one you pick.

As with the switch, the glass refracts a highlighted pill rather than the buttons behind it, so the selected option stays legible whichever label sits underneath. It eases between options with a spring rather than a straight slide, so the selection settles into place instead of snapping.

// The glass is the selection indicator. It bends a highlighted copy of
// the options and springs to the one you pick.
<Glass
  lens={selectionLens}
  x={selectedOptionPosition}
  refractionTarget={<HighlightedOptions />}
>
  <ToggleGroup options={options} />
</Glass>
The switch, slider, and toggle group all lean on the same technique.

For a more complex effect that still feels at home on the web, we built a QR code component that wraps the code in a glass effect, bending the pixels of the code when tapped to create a satisfying tactile response. The refraction adds a sense of depth and physicality to the interaction.

The QR code is fully interactive. Click the Aave logo to see the glass effect in action.

The QR is painted to its own canvas, so there's no live DOM here for an SVG filter to bend. We generate the same displacement map the rest of the family uses and hand it to a WebGL shader that refracts the code's own pixels. The technique is identical, only the surface it runs on changes.

// No live DOM to filter, so the same displacement map drives a WebGL
// shader that bends the canvas-drawn code on tap.
const { map, scale, chromaAmount } = generateLensMap(lens);
qrCanvas.setDisplacement({ map, scale, chromaAmount });
The glass effect can be applied to complex, interactive content like this video player.

The video player wraps each control in its own small glass effect, bending the live video underneath. The effect keeps the controls legible while preserving the sense that they're part of the video itself.

Each control carries its own glass, and all of them read from the same playing video underneath. Moving footage is the hard case for legibility, so the controls lean on their highlight and rim light to stay crisp against whatever frame happens to be behind them.

A live <video> is the one surface Safari refuses to apply an SVG filter to. It composites the video on the GPU and never hands those pixels to the filter pipeline, a long-standing WebKit limitation. So the video player runs the same refraction in WebGL instead. One renderer reads the playing video as a texture and draws every control's lens from it, each with its own displacement map.

// Safari won't filter a live <video>, so every control's lens runs the
// same pipeline in WebGL, all reading from the one playing video.
const renderer = initRefraction(canvas, video);
renderer.setLenses([playButton, skipBack, skipForward, scrubBar]);
How it works
Our glass works directly on whatever you put inside it. The content renders normally, exactly as the browser would display it, and the glass bends those very pixels to recreate what light does through curved glass.

Because it works on the real rendered content rather than a copy of it, the glass can go on anything made of live DOM: text, images, cards, buttons, whole layouts.

The effect rests on a single SVG filter primitive, feDisplacementMap. It takes two inputs, the painted content and a map we generate, and for each pixel of the content it reads the matching pixel of the map and uses that color to decide which way to push. Nothing is sampled from underneath the glass. The content's own pixels are the ones moving, which is why text under the lens stays selectable and links stay clickable.

The map is a small PNG we build on the fly from the glass's shape and size. Its red and green channels say how far each pixel bends horizontally and vertically, and everywhere outside the lens it sits at a neutral value that leaves those pixels alone, so only the region under the glass moves. A few more passes finish the look, a faint color fringe along the edges and a specular highlight that keeps the glass legible, but the displacement is the heart of it.

On the left is the refracted result, on the right the map that drives it.
Width
70
Height
60
BorderRadius
28
Scale
0.100
Depth
10
Curvature
40
Splay
1.00
Chroma
0.20
Blur
0.0
Glow
0.10
Edge Highlight
0.25
Specular Angle
45
The displacement map is the portable part. On ordinary DOM it drives an SVG filter, and the content underneath stays selectable, scrollable, and clickable on the same compositor as the rest of the page.

When there's no live DOM to bend, like a canvas-drawn QR code or a video Safari won't filter, the same map feeds a WebGL shader instead. The renderer changes with the medium, the refraction stays the same.

Making it work everywhere
This is where most of the work went, and where the Chromium-only demos fall down. Getting the same glass to render correctly in Safari, on desktop and on iOS, meant working through a string of quirks that surface nowhere else.

Refreshing the filter cleanly
Safari caches SVG filter output by its filter ID. When we change the displacement map but keep the same ID, Safari keeps serving the old output and the glass freezes mid-motion. To fix this, we give the filter a fresh ID on every update, forcing Safari to read the new map.

Computing a quarter of the map
We regenerate the displacement map on every frame of a squish or resize, so computing it has to be cheap. Since the displacement map is essentially a rounded rectangle, it has four-fold symmetry. We compute only the top-left quadrant and write each pixel into all four, negating the X displacement across the vertical axis and the Y displacement across the horizontal one. That cuts the per-pixel work to a quarter, which is what keeps map generation inside the frame budget.

Watching our footprint on Safari
Safari has a ceiling on the size of the source graphic a filter can process, which is the input itself for the SVG filter. Past that size, Safari breaks the effect into mismatched blocks or drops it entirely, both on desktop and mobile. This limit varies between browser versions and platforms, so we stay conservative with the size and complexity of the DOM we refract.

Spending less on Safari's highlight
The specular highlight runs as a separate pass in the filter, and by default that pass covers the entire filter region, not just the lens, so its cost scales with the whole area. Restricting it to just the lens is cheaper, but on Chromium browsers it produces sub-pixel artifacts that flicker along the lens's edge. Since Safari doesn't show those artifacts, we choose to read only a small lens-sized region, producing the same result at a fraction of the cost.

The future
Now that we have the glass effect on the web, we're excited to explore how it can enhance more of our interfaces and bring a sense of delight to our users.

Our next step is to build out a wider family of components that use the glass as a core part of their experience and bring our web apps closer to the look and feel of Aave Glass.

Wherever someone meets Aave, the same glass effect helps the components feel like they belong to one family, and that family is unmistakably Aave.

Acknowledgements
Thanks to 
Abhijeet Singh
 for leading the research and development of this project, 
Lochie Axon
 for writing this article, and 
Alex Vanderzon
 and 
Ana Howard
 for their design direction. Special thanks to the whole team at Aave Labs for their contributions, and to everyone who helped test, refine, and bring this project to life.

Aave Labs is hiring
We care about the details most people don't notice.

If that sounds like you, come build with us.

See Open Roles
