# AGENTS.md — Instructions for AI Agents

> Read this first. Always.

## What This Repo Is

A **data library + creative coding lab** for UFO/UAP craft visual typology. Two kinds of output: structured JSON reference data, and working GLSL/p5.js creative code. No application framework, no build system.

## Rules

### Stack
- **No npm, no bundler, no build step.** Static files only.
- **No React, Vue, or any SPA framework.** Vanilla JS in sketches.
- **p5.js CDN only:** `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js`
- **All paths relative.** Deploys to GitHub Pages.

### JSON files
- `craft/` files: **strict JSON**, no comments, no trailing commas. Must pass `node validate.js`.
- `cases/` files: same — strict JSON only.
- `docs/ufo-schema.jsonc`: JSONC (comments allowed). For human reading only. Do NOT auto-generate from it.
- `id` field MUST match filename without `.json`.
- Every `cases/` file MUST have a `craft_type_ref` that matches a valid `craft/` filename id.

### File naming
- Craft files: `[slug].json` — descriptive, lowercase, underscores. e.g. `black_triangle.json`
- Case files: `[location_or_name]_[year].json` — e.g. `nimitz_2004.json`
- Shader files: `[craft_slug].frag` + `[craft_slug]_demo.html`
- Sketch files: `[name].js` + `[name]_standalone.html`

### Palette (ALWAYS use these)
```
--ufo-green:    #39FF14   /* little_green_men crossover color */
--ufo-black:    #000000   /* void black background */
--ufo-amber:    #FFA62B   /* triangle lights, classic beacon */
--ufo-chrome:   #C8CCD0   /* classic saucer surface */
--ufo-white:    #EDEDE9   /* sensor-era UAP body */
--ufo-cyan:     #7EC8E3   /* CE3K/Trumbull luminescence */
--ufo-plasma:   #2BA6FF   /* portal/Cherenkov blue */
--ufo-red:      #C1272D   /* center triangle light */
```

### Typography
- `'Chakra Petch'` — headers, labels
- `'Share Tech Mono'` — data readouts, telemetry strings, HUD text

### Design rules
- Background ALWAYS `#000000`
- Border-radius ALWAYS `0`
- UI chrome should feel like a military sensor display when applicable

### Shader rules
- All shaders MUST use `uniform float iTime` and `uniform vec2 iResolution`
- Demo HTML files inline the shader source — do NOT load external .frag files via fetch
- Use `_webgl_template.html` as base for all new demo files

### Sketch rules
- All standalone HTMLs use `_p5_template.html` as base
- Canvas fills full viewport — use `windowWidth, windowHeight` not fixed px
- `saucer_dance.js` is the canonical cross-repo sketch — do not rename or restructure it

### When adding a new craft type
1. Create `craft/[id].json` — pass `node validate.js [id].json`
2. Add entry to `index.json` under `craft`
3. Increment `index.json` → `meta.craft_count`
4. Update README table
5. Optionally create matching shader + demo

### When adding a new case
1. Create `cases/[id].json` — pass `node validate.js cases/[id].json`
2. `craft_type_ref` must match existing craft id
3. Add entry to `index.json` under `cases`
4. Increment `index.json` → `meta.case_count`
5. Update README

### DO NOT
- ❌ Add application code, SPA frameworks, or server-side anything
- ❌ Use JSONC in craft/ or cases/ files
- ❌ Change `validate.js` logic without testing all existing files
- ❌ Add border-radius to any UI element
- ❌ Rename `saucer_dance.js` — it's the cross-repo integration sketch
- ❌ Invent sighting data — all cases must be documented
