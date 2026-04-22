# Era Guide — The Additive→Subtractive Arc

The single most important design insight for generative UFO work: **the visual grammar has inverted twice.**

---

## The Three Eras

### Era 1: Classic (1947–1979) — ADDITIVE
**More = more alien.**

Hardware-forward. Chrome rivets. Spinning rim segments. Porthole windows. Tripod landing gear. Solid death-ray beams. The craft is a *thing* — you can see its parts.

Key touchpoints: Trent McMinnville (1950), Adamski scout (1952), *Earth vs. Flying Saucers* (1956), Gulf Breeze (1987).

**Design principle:** Layer detail until it reads as "not from here." Every surface should have a secondary surface. Lights should have casings. Casings should have rivets.

**Authenticity chain:** Kodachrome 400 grain simulation, dusk/magic-hour directional light, overhead powerline or rooftop for scale, slight motion blur from "handheld camera."

**Palette:**
```
#C8CCD0  — brushed aluminum
#E6E8EA  — polished chrome
#1F3A6B  — cobalt twilight sky
#F6E27A  — sodium rim glow
#D3212D  — port running light
#0E1116  — shadow black
```

---

### Era 2: Luminescent (1977–2000) — LIGHT AS OBJECT
**The craft IS the glow.**

Trumbull's *Close Encounters* mothership (1977) replaced hull detail with thousands of pin-lights in smoke-filled rooms on 65mm. The saucer itself became illegible — only its luminescent signature remained. This era established: craft = light source, hardware = secondary.

Key touchpoints: CE3K mothership (1977), E.T. organic scout (1982), *V* (1983), *Independence Day* (1996), *X-Files* (1993–2002).

**Design principle:** The hull is a light-delivery mechanism. Bloom should overwhelm silhouette. Layer 3–5 light sources at different intensities and temperatures.

**Authenticity chain:** VHS NTSC chroma bleed, forest volumetric fog for ABF-era, rain-slick surfaces for X-Files aesthetic.

**Palette:**
```
#FFF3D4  — neon warm white (point lights)
#FFB347  — sodium amber (underside glow)
#7EC8E3  — mercury cyan (CE3K spectral)
#B08A5B  — Devil's Tower ochre
#2A2D33  — smoke grey
#3E2A14  — dusk forest brown
```

---

### Era 3: Sensor (2004–present) — SUBTRACTIVE
**Featureless primitive + sensor chrome = maximum UAP.**

The strongest "UAP reads" come from *removing* physics, not adding detail. The Tic Tac has no wings, no exhaust, no sonic boom, no radar signature, no heat source. It's a ceramic-white capsule that does physically impossible things. The FLIR frame around it — crosshair, telemetry strings, lock box, greyscale IR — is the aesthetic.

Key touchpoints: Nimitz FLIR1 (2004), GIMBAL (2015), GO FAST (2015), USS Omaha orbs (2019), Iraq Jellyfish (2018), House Oversight Hearings (2023).

**Design principle:** Strip the primitive until it's almost nothing. Then break the physics. No wings. No exhaust. No shadow. No water ripple. No inertial coupling. The wrongness is the content.

**Authenticity chain:** 640×480 or lower greyscale MPEG-2, ATFLIR radiometric quantization, fixed-pattern column noise, mode text (WHT HOT / BLK HOT), crosshair reticle at center, range/bearing telemetry strings at frame edges, discrete zoom-step rescales.

**Palette:**
```
#EDEDE9  — sensor-era UAP body (ceramic white)
#9A9A94  — FLIR mid-grey ambient
#1A1A1A  — black-hot background
#F2F2F2  — white-hot foreground
#6CFF00  — HUD green telemetry
#FFB000  — HUD amber mode text
#101418  — void background
```

---

## Cross-Era Mixing

The three eras can be mixed as style weights (same pattern as `crop_circles` style_weights):

```json
"era_weights": {
  "classic_additive": 0.8,
  "luminescent": 0.4,
  "sensor_subtractive": 0.1
}
```

A `classic_additive: 1.0, luminescent: 0.0` craft gets full rivets + porthole grammar.
A `sensor_subtractive: 1.0` craft gets featureless capsule + FLIR overlay.
Mixed weights produce hybrid aesthetics — e.g. a chrome saucer in FLIR context.

---

## Authenticity Chains (Post-Processing Recipes)

| Era | Grain | Color | Artifacts |
|-----|-------|-------|-----------|
| Classic 1950s | Kodachrome 400 | Saturated, slight cyan shift | Halation on bright edges |
| Classic 1960s-70s | Ektachrome 64 | Warm, slight yellow | Vignette, chromatic aberration |
| 1980s witness | VHS NTSC | Chroma bleed, desaturated | Horizontal scan dropout, field interlace |
| 1990s witness | 640×480 MPEG-2 | Muted, block artifacts | Macro-block squares at edges |
| Sensor 2004+ | ATFLIR | 8-bit grayscale LUT | Fixed-pattern noise, autotrack box |
| Sensor 2015+ | WESCAM IR | 10-bit→8-bit quantized | HUD overlay, mode text |
