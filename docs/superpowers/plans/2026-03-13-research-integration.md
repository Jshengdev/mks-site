# Research Integration Plan — Steal Everything

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate 12+ techniques from the 73-extraction research library into the meadow scene, transforming it from "good Three.js demo" to "cinema-grade WebGL experience." Every technique is stolen from a real GitHub repo — no original GLSL from scratch.

**Architecture:** Each integration is a focused modification to one subsystem. The AtmosphereController already drives all parameters — new systems plug into the same interpolation pipeline. New post-processing effects slot into the existing EffectComposer chain.

**Tech Stack:** Three.js (vanilla), GLSL shaders (stolen from repos), postprocessing (pmndrs), Web Audio API, Lenis scroll

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/meadow/shaders/grass.frag.glsl` | MODIFY | al-ro 5-component lighting + iquilez fog |
| `src/meadow/shaders/grass.vert.glsl` | MODIFY | Better wind with spatial Perlin variation |
| `src/meadow/shaders/filmGrain.frag.glsl` | CREATE | 2-layer simplex grain, luminance-aware |
| `src/meadow/FilmGrainEffect.js` | CREATE | Custom Effect wrapping stolen grain shader |
| `src/meadow/shaders/radialCA.frag.glsl` | CREATE | Center-outward chromatic dispersion |
| `src/meadow/RadialCAEffect.js` | CREATE | Custom Effect for radial CA |
| `src/meadow/shaders/godrays.frag.glsl` | CREATE | GPU Gems 3 radial blur |
| `src/meadow/GodRayPass.js` | CREATE | Occlusion render + composite |
| `src/meadow/ClothSolver.js` | CREATE | Verlet Jakobsen constraint solver |
| `src/meadow/ScoreSheetCloth.js` | REWRITE | Verlet cloth instead of billboard |
| `src/meadow/shaders/firefly.vert.glsl` | MODIFY | Phase fix + turbulence field |
| `src/meadow/shaders/firefly.frag.glsl` | MODIFY | Soft particle depth fade |
| `src/meadow/DustMotes.js` | CREATE | Floating dust/petal particle layer |
| `src/meadow/shaders/dustMote.vert.glsl` | CREATE | Turbulence-driven drift |
| `src/meadow/shaders/dustMote.frag.glsl` | CREATE | Soft glow with depth fade |
| `src/meadow/AudioReactive.js` | CREATE | FFT band extraction, beat detect |
| `src/meadow/CameraRig.js` | MODIFY | Add mouse parallax (ThreeDOF) |
| `src/meadow/shaders/motionBlur.frag.glsl` | CREATE | Camera-only velocity blur |
| `src/meadow/MotionBlurEffect.js` | CREATE | Matrix-delta motion blur |
| `src/meadow/PostProcessingStack.js` | MODIFY | Wire new effects into chain |
| `src/meadow/MeadowEngine.js` | MODIFY | Wire all new systems |
| `src/meadow/AtmosphereController.js` | MODIFY | Add params for new systems |

---

## Chunk 1: Grass Shader Overhaul (al-ro 5-Component Lighting)

### Task 1: Upgrade grass fragment shader to al-ro 5-component model

**Files:**
- Modify: `src/meadow/shaders/grass.frag.glsl`

**Source:** al-ro-grass extraction — 5-component lighting model (969 lines)

The current grass shader has basic translucent lighting. Replace with the full al-ro model:

- [ ] **Step 1: Read current grass.frag.glsl and understand structure**

- [ ] **Step 2: Replace lighting model with al-ro 5-component**

The 5 components (stolen from al-ro):
```glsl
// 1. Ambient — base illumination
vec3 ambient = uAmbientStrength * uBaseColor;

// 2. Diffuse — standard NdotL
float NdotL = max(dot(normal, sunDir), 0.0);
vec3 diffuse = NdotL * sunColor * grassColor;

// 3. Specular — tight highlight on blade tips (al-ro: power 100)
vec3 halfDir = normalize(sunDir + viewDir);
float spec = pow(max(dot(normal, halfDir), 0.0), 100.0);
vec3 specular = spec * sunColor * 0.3;

// 4. Diffuse translucency — light through blade body
float NdotL_back = max(dot(-normal, sunDir), 0.0);
vec3 diffuseTrans = NdotL_back * sunColor * grassColor * uTranslucencyStrength;

// 5. Forward translucency — bright rim when looking toward sun (al-ro: pow 16)
float dotViewLight = max(dot(viewDir, -sunDir), 0.0);
vec3 forwardTrans = pow(dotViewLight, 16.0) * sunColor * uTranslucencyStrength * 0.5;
```

Key magic values from al-ro:
- Specular power: `100.0` (extremely tight, blade tip only)
- Forward translucency power: `16.0` (tight forward scatter)
- Forward translucency scale: `0.5` (half of translucency strength)

- [ ] **Step 3: Add iquilez height-based fog (stolen from al-ro)**

Replace the linear fog fade with iquilez exponential height fog:
```glsl
// iquilez fog — thickens near ground, tints toward sun
// Stolen from al-ro grass.frag.glsl
float fogAmount = 1.0 - exp(-dist * uFogFade);
// Height attenuation: more fog near ground
float heightFog = exp(-max(worldPos.y, 0.0) * 0.3);
fogAmount = mix(fogAmount, fogAmount * heightFog, 0.6);
// Sun tint in fog (look toward sun = warm, away = cool)
float sunFog = max(dot(viewDir, sunDir), 0.0);
vec3 fogTint = mix(fogColor, sunColor * 0.8, pow(sunFog, 8.0));
finalColor = mix(finalColor, fogTint, fogAmount);
```

Magic values:
- Height attenuation: `exp(-y * 0.3)` (from al-ro)
- Height fog blend: `0.6` (60% height influence)
- Sun fog power: `8.0` (tight sun tint in fog)

- [ ] **Step 4: Commit**

```bash
git add src/meadow/shaders/grass.frag.glsl
git commit -m "feat: upgrade grass to al-ro 5-component lighting + iquilez fog"
```

---

### Task 2: Improve grass vertex wind with Perlin spatial variation

**Files:**
- Modify: `src/meadow/shaders/grass.vert.glsl`

**Source:** grass-shader-glsl-nitash — 4-layer wind deform function

- [ ] **Step 1: Read current grass.vert.glsl**

- [ ] **Step 2: Add classic Perlin noise function (from Nitash)**

```glsl
// Classic 2D Perlin noise (stolen from Nitash grass-shader-glsl)
// Used for spatially-varying wind gusts
vec2 hash2D(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float perlin2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2D(i), f), dot(hash2D(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2D(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2D(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}
```

- [ ] **Step 3: Add spatial wind gust layer (Nitash layer 3)**

Currently wind is uniform sine waves. Add Perlin-driven gusts:
```glsl
// Layer 3: Perlin gusts — spatially varying (Nitash strongWind)
// Scale: 0.3 spatial, 0.2 temporal (from extraction magic values)
float gust = perlin2D(worldPos.xz * 0.3 + uTime * 0.2) * 0.65;
// Apply as additional bend, weighted by blade height
displacement.x += gust * heightFactor * uSpeed;
displacement.z += gust * heightFactor * uSpeed * 0.5;
```

Magic values from Nitash:
- Perlin spatial scale: `0.3`
- Perlin temporal scale: `0.2`
- Gust amplitude: `0.65`

- [ ] **Step 4: Commit**

```bash
git add src/meadow/shaders/grass.vert.glsl
git commit -m "feat: add Perlin spatial wind gusts to grass (Nitash layer 3)"
```

---

## Chunk 2: Film Stack Overhaul (Grain + Chromatic Aberration)

### Task 3: Create custom 2-layer film grain effect

**Files:**
- Create: `src/meadow/shaders/filmGrain.frag.glsl`
- Create: `src/meadow/FilmGrainEffect.js`

**Source:** glsl-film-grain (simplex 2-layer) + filmic-gl (luminance-aware suppression)

- [ ] **Step 1: Create the GLSL film grain shader**

```glsl
// src/meadow/shaders/filmGrain.frag.glsl
// Stolen from glsl-film-grain + filmic-gl
// 2-layer noise: simplex offset → periodic texture = film-like clumping

uniform float uTime;
uniform float uGrainSize;
uniform float uGrainIntensity;
uniform vec2 uResolution;

// Simplex 3D noise (stolen from glsl-film-grain)
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Periodic noise for fine grain texture (stolen from glsl-film-grain)
float pnoise(vec3 P, vec3 rep) {
  vec3 Pi0 = mod(floor(P), rep);
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = Pf0 * Pf0 * Pf0 * (Pf0 * (Pf0 * 6.0 - 15.0) + 10.0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

// Main grain function (stolen from glsl-film-grain)
float grain(vec2 texCoord, float frame, float multiplier) {
  vec2 mult = texCoord * uResolution;
  float offset = snoise(vec3(mult / multiplier, frame));
  float n1 = pnoise(vec3(mult, offset), vec3(1.0/texCoord * uResolution, 1.0));
  return n1 / 2.0 + 0.5;
}
```

- [ ] **Step 2: Create the Effect wrapper class**

```js
// src/meadow/FilmGrainEffect.js
// Custom 2-layer film grain (stolen from glsl-film-grain + filmic-gl)
import { Effect, BlendFunction } from 'postprocessing'
import fragmentShader from './shaders/filmGrain.frag.glsl?raw'

const mainImage = `
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // 54ms frame intervals = ~18.5fps (real film projector speed)
  // Stolen from glsl-film-grain extraction
  float frame = floor(uTime / 0.054);

  float g = grain(uv, frame, 2.5); // multiplier 2.5 from extraction

  // Luminance-aware suppression (stolen from filmic-gl)
  // pow(lum, 4.0) = grain strongest in shadows, absent in highlights
  float lum = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
  float response = 1.0 - pow(lum, 4.0);

  // Apply grain as overlay blend
  float grainValue = mix(0.5, g, uGrainIntensity * response);
  vec3 grainColor = vec3(grainValue);

  // Overlay blend mode (stolen from pmndrs NoiseEffect pattern)
  vec3 result = inputColor.rgb;
  result = mix(
    2.0 * result * grainColor,
    1.0 - 2.0 * (1.0 - result) * (1.0 - grainColor),
    step(0.5, result)
  );

  outputColor = vec4(result, inputColor.a);
}
`

export class FilmGrainEffect extends Effect {
  constructor({ grainSize = 1.5, grainIntensity = 0.08 } = {}) {
    super('FilmGrainEffect', fragmentShader + mainImage, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uTime', { value: 0 }],
        ['uGrainSize', { value: grainSize }],
        ['uGrainIntensity', { value: grainIntensity }],
        ['uResolution', { value: [window.innerWidth, window.innerHeight] }],
      ]),
    })
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('uTime').value += deltaTime
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/meadow/shaders/filmGrain.frag.glsl src/meadow/FilmGrainEffect.js
git commit -m "feat: add 2-layer film grain effect (stolen from glsl-film-grain + filmic-gl)"
```

---

### Task 4: Create radial chromatic aberration effect

**Files:**
- Create: `src/meadow/RadialCAEffect.js`

**Source:** filmic-gl — cubic lens distortion with chromatic dispersion

- [ ] **Step 1: Create the radial CA effect**

```js
// src/meadow/RadialCAEffect.js
// Radial chromatic aberration that increases toward edges
// Stolen from filmic-gl: cubic distortion + dispersion eta
import { Effect, BlendFunction } from 'postprocessing'

const fragmentShader = `
uniform float uIntensity;
uniform float uDistortion;

// Cubic lens distortion (stolen from filmic-gl)
// k = quadratic, kcube = cubic term
vec2 barrelDistort(vec2 coord, float k, float kcube) {
  float r2 = dot(coord, coord);
  float f = 1.0 + r2 * (k + kcube * sqrt(r2));
  return coord * f;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 center = uv - 0.5;

  // Chromatic dispersion per channel (stolen from filmic-gl)
  // eta = (1.009, 1.006, 1.003) — red shifts most
  float k = uDistortion * 0.05;
  float kcube = uDistortion * 0.1;

  float rR = texture2D(inputBuffer, 0.5 + barrelDistort(center * 1.009, k, kcube)).r;
  float rG = texture2D(inputBuffer, 0.5 + barrelDistort(center * 1.006, k, kcube)).g;
  float rB = texture2D(inputBuffer, 0.5 + barrelDistort(center * 1.003, k, kcube)).b;

  outputColor = vec4(rR, rG, rB, 1.0);
}
`

export class RadialCAEffect extends Effect {
  constructor({ intensity = 1.0, distortion = 0.5 } = {}) {
    super('RadialCAEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uIntensity', { value: intensity }],
        ['uDistortion', { value: distortion }],
      ]),
    })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/RadialCAEffect.js
git commit -m "feat: add radial chromatic aberration (stolen from filmic-gl lens distortion)"
```

---

## Chunk 3: God Rays (GPU Gems 3 Radial Blur)

### Task 5: Create screen-space god ray system

**Files:**
- Create: `src/meadow/GodRayPass.js`

**Source:** glsl-godrays (GPU Gems 3, Ch. 13) — 3-pass pipeline

- [ ] **Step 1: Create the god ray pass**

This uses the 3-pass pipeline from the extraction:
1. Render sun as white disk, scene as black → occlusion FBO (half-res)
2. Radial blur from sun screen position
3. Additive composite

```js
// src/meadow/GodRayPass.js
// Screen-space god rays — stolen from glsl-godrays (GPU Gems 3, Ch. 13)
// 3-pass: occlusion → radial blur → additive composite
import * as THREE from 'three'

const RADIAL_BLUR_FRAG = `
uniform sampler2D tOcclusion;
uniform vec2 uSunScreenPos;
uniform float uDensity;
uniform float uWeight;
uniform float uDecay;
uniform float uExposure;
uniform int uSamples;

varying vec2 vUv;

void main() {
  // Stolen from glsl-godrays extraction — GPU Gems 3 radial blur
  vec2 texCoord = vUv;
  vec2 deltaTexCoord = (texCoord - uSunScreenPos);
  deltaTexCoord *= (1.0 / float(uSamples)) * uDensity;

  float illuminationDecay = 1.0;
  vec3 fragColor = vec3(0.0);

  for (int i = 0; i < 100; i++) {
    if (i >= uSamples) break;
    texCoord -= deltaTexCoord;
    vec3 samp = texture2D(tOcclusion, texCoord).rgb;
    samp *= illuminationDecay * uWeight;
    fragColor += samp;
    illuminationDecay *= uDecay;
  }

  fragColor *= uExposure;
  gl_FragColor = vec4(fragColor, 1.0);
}
`

const COMPOSITE_FRAG = `
uniform sampler2D tScene;
uniform sampler2D tGodRays;
uniform float uBlendIntensity;
varying vec2 vUv;

void main() {
  vec3 scene = texture2D(tScene, vUv).rgb;
  vec3 rays = texture2D(tGodRays, vUv).rgb;
  gl_FragColor = vec4(scene + rays * uBlendIntensity, 1.0);
}
`

const SIMPLE_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default class GodRayPass {
  constructor(renderer, scene, camera, sunPosition) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.sunWorldPos = sunPosition.clone().multiplyScalar(500)
    this.enabled = true
    this.intensity = 0.6

    // Magic values from glsl-godrays extraction
    this.density = 1.0
    this.weight = 0.01
    this.decay = 0.97  // warm falloff
    this.exposure = 1.0
    this.samples = 50

    const w = window.innerWidth
    const h = window.innerHeight

    // Half-res occlusion FBO
    this._occlusionRT = new THREE.WebGLRenderTarget(w / 2, h / 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })

    // God ray FBO
    this._godRayRT = new THREE.WebGLRenderTarget(w / 2, h / 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })

    // Sun disk mesh (for occlusion pass)
    const sunGeo = new THREE.SphereGeometry(15, 16, 16)
    this._sunMesh = new THREE.Mesh(sunGeo, new THREE.MeshBasicMaterial({
      color: 0xffffff,
    }))
    this._sunMesh.position.copy(this.sunWorldPos)

    // Black override material for occlusion pass
    this._blackMat = new THREE.MeshBasicMaterial({ color: 0x000000 })

    // Fullscreen quad for radial blur
    this._blurMaterial = new THREE.ShaderMaterial({
      vertexShader: SIMPLE_VERT,
      fragmentShader: RADIAL_BLUR_FRAG,
      uniforms: {
        tOcclusion: { value: this._occlusionRT.texture },
        uSunScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
        uDensity: { value: this.density },
        uWeight: { value: this.weight },
        uDecay: { value: this.decay },
        uExposure: { value: this.exposure },
        uSamples: { value: this.samples },
      },
    })

    // Fullscreen quad geometry
    this._quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      this._blurMaterial
    )
    this._quadScene = new THREE.Scene()
    this._quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this._quadScene.add(this._quad)

    this._screenPos = new THREE.Vector3()
  }

  update(sunPosition) {
    if (!this.enabled) return

    // Update sun world position from atmosphere controller
    this.sunWorldPos.copy(sunPosition).multiplyScalar(500)
    this._sunMesh.position.copy(this.sunWorldPos)

    // Project sun to screen space
    this._screenPos.copy(this.sunWorldPos)
    this._screenPos.project(this.camera)
    const sx = (this._screenPos.x + 1) / 2
    const sy = (this._screenPos.y + 1) / 2
    this._blurMaterial.uniforms.uSunScreenPos.value.set(sx, sy)
  }

  render() {
    if (!this.enabled) return null

    const renderer = this.renderer

    // Pass 1: Render occlusion (sun white, everything else black)
    const origOverride = this.scene.overrideMaterial
    this.scene.overrideMaterial = this._blackMat
    this.scene.add(this._sunMesh)

    renderer.setRenderTarget(this._occlusionRT)
    renderer.render(this.scene, this.camera)

    this.scene.remove(this._sunMesh)
    this.scene.overrideMaterial = origOverride

    // Pass 2: Radial blur
    renderer.setRenderTarget(this._godRayRT)
    renderer.render(this._quadScene, this._quadCamera)

    renderer.setRenderTarget(null)

    return this._godRayRT.texture
  }

  setSize(width, height) {
    this._occlusionRT.setSize(width / 2, height / 2)
    this._godRayRT.setSize(width / 2, height / 2)
  }

  dispose() {
    this._occlusionRT.dispose()
    this._godRayRT.dispose()
    this._sunMesh.geometry.dispose()
    this._sunMesh.material.dispose()
    this._blackMat.dispose()
    this._blurMaterial.dispose()
    this._quad.geometry.dispose()
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/GodRayPass.js
git commit -m "feat: add screen-space god rays (stolen from GPU Gems 3 radial blur)"
```

---

## Chunk 4: Cloth Physics for Score Sheets

### Task 6: Create Verlet cloth solver and rewrite ScoreSheetCloth

**Files:**
- Create: `src/meadow/ClothSolver.js`
- Rewrite: `src/meadow/ScoreSheetCloth.js`

**Source:** cloth-simulation (Verlet Jakobsen) + three-simplecloth (force model)

- [ ] **Step 1: Create the Verlet cloth solver**

```js
// src/meadow/ClothSolver.js
// CPU Verlet Jakobsen constraint solver for floating score sheets
// Stolen from cloth-simulation + three-simplecloth extractions
import * as THREE from 'three'

export class ClothSolver {
  constructor(width, height, segW, segH) {
    this.width = width
    this.height = height
    this.segW = segW
    this.segH = segH
    this.particles = []
    this.constraints = []

    // Magic values from three-simplecloth extraction
    this.stiffness = 0.4    // paper is stiffer than cloth (0.3-0.5 range)
    this.dampening = 0.90   // more energy loss for paper (0.88-0.93)
    this.gravity = new THREE.Vector3(0, -1.5, 0) // light gravity for floating
    this.wind = new THREE.Vector3(0, 0, 0)

    this._initParticles()
    this._initConstraints()
  }

  _initParticles() {
    const stepX = this.width / this.segW
    const stepY = this.height / this.segH

    for (let j = 0; j <= this.segH; j++) {
      for (let i = 0; i <= this.segW; i++) {
        const x = (i - this.segW / 2) * stepX
        const y = (j - this.segH / 2) * stepY
        this.particles.push({
          pos: new THREE.Vector3(x, y, 0),
          prev: new THREE.Vector3(x, y, 0),
          accel: new THREE.Vector3(),
          mass: 1.0,
          pinned: false,
        })
      }
    }
  }

  _initConstraints() {
    const cols = this.segW + 1

    for (let j = 0; j <= this.segH; j++) {
      for (let i = 0; i <= this.segW; i++) {
        const idx = j * cols + i
        // Structural (horizontal + vertical)
        if (i < this.segW) this._addConstraint(idx, idx + 1)
        if (j < this.segH) this._addConstraint(idx, idx + cols)
        // Shear (diagonal)
        if (i < this.segW && j < this.segH) {
          this._addConstraint(idx, idx + cols + 1)
          this._addConstraint(idx + 1, idx + cols)
        }
        // Bend (skip one — prevents folding, from cloth-simulation playbook)
        if (i < this.segW - 1) this._addConstraint(idx, idx + 2)
        if (j < this.segH - 1) this._addConstraint(idx, idx + 2 * cols)
      }
    }
  }

  _addConstraint(a, b) {
    const restLen = this.particles[a].pos.distanceTo(this.particles[b].pos)
    this.constraints.push({ a, b, restLen })
  }

  // Apply multi-frequency wind (stolen from cloth-simulation: cos/sin periods)
  setWind(strength, time) {
    // Multiple frequency oscillation (periods from extraction: 12000/5000/8000ms)
    const wx = Math.cos(time * 1000 / 12000) * strength
    const wy = Math.sin(time * 1000 / 5000) * strength * 0.3
    const wz = Math.cos(time * 1000 / 8000) * strength * 0.7
    this.wind.set(wx, wy, wz)
  }

  step(dt) {
    const dtSq = dt * dt

    // Apply forces
    for (const p of this.particles) {
      if (p.pinned) continue
      p.accel.copy(this.gravity)
      p.accel.add(this.wind)
    }

    // Verlet integration
    for (const p of this.particles) {
      if (p.pinned) continue
      const temp = p.pos.clone()
      const vel = p.pos.clone().sub(p.prev)
      vel.multiplyScalar(this.dampening) // dampening from three-simplecloth
      p.pos.add(vel)
      p.pos.addScaledVector(p.accel, dtSq)
      p.prev.copy(temp)
    }

    // Jakobsen constraint solving — 15 iterations for paper (from extraction)
    for (let iter = 0; iter < 15; iter++) {
      for (const c of this.constraints) {
        const pa = this.particles[c.a]
        const pb = this.particles[c.b]
        const delta = pb.pos.clone().sub(pa.pos)
        const dist = delta.length()
        if (dist === 0) continue
        const diff = (dist - c.restLen) / dist * this.stiffness
        delta.multiplyScalar(diff * 0.5)
        if (!pa.pinned) pa.pos.add(delta)
        if (!pb.pinned) pb.pos.sub(delta)
      }
    }
  }

  // Write particle positions into a BufferGeometry
  updateGeometry(geometry) {
    const positions = geometry.attributes.position.array
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i].pos
      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
    }
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
  }
}
```

- [ ] **Step 2: Rewrite ScoreSheetCloth to use Verlet physics**

```js
// src/meadow/ScoreSheetCloth.js
// Wind-driven score sheets with Verlet cloth physics
// Uses ClothSolver (stolen from cloth-simulation + three-simplecloth)
import * as THREE from 'three'
import { ClothSolver } from './ClothSolver.js'

export default class ScoreSheetCloth {
  constructor(scene, count = 3) {
    this.sheets = []
    this.scene = scene
    this._windStrength = 1.0

    // Placeholder off-white texture
    const placeholder = new THREE.DataTexture(
      new Uint8Array([255, 255, 240, 255]), 1, 1
    )
    placeholder.needsUpdate = true

    for (let i = 0; i < count; i++) {
      // 8x6 grid cloth (from extraction playbook: 8x10 for full sheet)
      const solver = new ClothSolver(1.2, 0.85, 8, 6)

      // PlaneGeometry must match solver grid
      const geometry = new THREE.PlaneGeometry(1.2, 0.85, 8, 6)
      const material = new THREE.MeshStandardMaterial({
        map: placeholder,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        roughness: 0.8,
        metalness: 0.0,
      })

      const mesh = new THREE.Mesh(geometry, material)

      // Position along the camera path
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        2.0 + Math.random() * 2.0,
        -30 - i * 25
      )
      mesh.rotation.y = Math.random() * Math.PI * 2

      // Per-sheet drift animation
      const drift = {
        phaseOffset: Math.random() * Math.PI * 2,
        driftSpeed: 0.3 + Math.random() * 0.5,
        baseY: mesh.position.y,
        baseX: mesh.position.x,
      }

      scene.add(mesh)
      this.sheets.push({ mesh, solver, drift, geometry })
    }
  }

  setTexture(texture) {
    for (const { mesh } of this.sheets) {
      mesh.material.map = texture
      mesh.material.needsUpdate = true
    }
  }

  update(elapsed) {
    const dt = 1 / 60 // fixed timestep for physics stability

    for (const { mesh, solver, drift, geometry } of this.sheets) {
      const t = elapsed + drift.phaseOffset

      // Multi-frequency wind (from extraction)
      solver.setWind(this._windStrength, elapsed)

      // Step physics
      solver.step(dt)
      solver.updateGeometry(geometry)

      // Gentle world-space drift
      mesh.position.x = drift.baseX + Math.sin(t * 0.3) * 0.5 * this._windStrength
      mesh.position.y = drift.baseY + Math.sin(t * drift.driftSpeed) * 0.4
      mesh.rotation.y += 0.002
    }
  }

  setWindStrength(strength) {
    this._windStrength = strength
  }

  dispose() {
    for (const { mesh } of this.sheets) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/meadow/ClothSolver.js src/meadow/ScoreSheetCloth.js
git commit -m "feat: rewrite ScoreSheetCloth with Verlet cloth physics (stolen from cloth-sim + three-simplecloth)"
```

---

## Chunk 5: Particle Upgrades + Dust Motes

### Task 7: Fix firefly phase aliasing + add turbulence

**Files:**
- Modify: `src/meadow/shaders/firefly.vert.glsl`

**Source:** L16 particle systems — phase aliasing fix + turbulence

- [ ] **Step 1: Fix phase aliasing and add turbulence to firefly vertex shader**

Current: `sin(time + modelPosition.x * 100.0)` — all particles at same X bob identically.

Fix from L16: add `+ aScale * 6.28` for per-particle randomness.

Add turbulence field: 4D simplex fBM applied as positional offset.

```glsl
// src/meadow/shaders/firefly.vert.glsl
// Upgraded from Alex-DG — phase fix + turbulence (stolen from L16)
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

// Simple hash for turbulence (stolen from L16 fBM pattern)
float hash(float n) { return fract(sin(n) * 43758.5453); }

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 157.0 + 113.0 * i.z;
  return mix(
    mix(mix(hash(n), hash(n + 1.0), f.x),
        mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
        mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y),
    f.z
  );
}

void main() {
  float time = uTime * 0.001;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Phase fix: add aScale * 6.28 so each particle bobs differently
  // (stolen from L16: "add + aScale * 6.28 for more per-particle randomness")
  modelPosition.y += sin(time + modelPosition.x * 100.0 + aScale * 6.28) * aScale * 0.2;

  // Turbulence field — slow 3D noise drift (stolen from L16 fBM pattern)
  // Frequency doubles per octave, amplitude halves
  float turb = noise3D(modelPosition.xyz * 0.05 + time * 0.1) * 0.4
             + noise3D(modelPosition.xyz * 0.1 + time * 0.15) * 0.2;
  modelPosition.x += turb * aScale;
  modelPosition.z += turb * aScale * 0.7;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  gl_PointSize = uSize * aScale * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/shaders/firefly.vert.glsl
git commit -m "feat: fix firefly phase aliasing + add turbulence field (stolen from L16)"
```

---

### Task 8: Create dust mote / petal particle layer

**Files:**
- Create: `src/meadow/DustMotes.js`
- Create: `src/meadow/shaders/dustMote.vert.glsl`
- Create: `src/meadow/shaders/dustMote.frag.glsl`

**Source:** L16 particles + webxr-flowers (Alex-DG)

- [ ] **Step 1: Create dust mote shaders**

```glsl
// src/meadow/shaders/dustMote.vert.glsl
// Slow drifting particles catching sunlight (stolen from L16 patterns)
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;

float hash(float n) { return fract(sin(n) * 43758.5453); }

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 157.0 + 113.0 * i.z;
  return mix(
    mix(mix(hash(n), hash(n+1.0), f.x), mix(hash(n+157.0), hash(n+158.0), f.x), f.y),
    mix(mix(hash(n+113.0), hash(n+114.0), f.x), mix(hash(n+270.0), hash(n+271.0), f.x), f.y),
    f.z
  );
}

void main() {
  float time = uTime * 0.0003; // very slow
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Slow turbulent drift
  float turb = noise3D(modelPosition.xyz * 0.03 + time + aPhase) * 1.5;
  modelPosition.x += turb;
  modelPosition.y += sin(time * 500.0 + aPhase) * 0.3 * aScale; // gentle float
  modelPosition.z += noise3D(modelPosition.zxy * 0.04 + time * 0.7) * 1.0;

  // Alpha fade based on height (more visible in mid-air)
  vAlpha = smoothstep(0.0, 0.5, modelPosition.y) * smoothstep(4.0, 2.5, modelPosition.y);

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uSize * aScale * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
```

```glsl
// src/meadow/shaders/dustMote.frag.glsl
// Soft glow particles catching golden light
uniform float uBrightness;

varying float vAlpha;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));

  // Softer falloff than fireflies — more like dust catching light
  float strength = smoothstep(0.5, 0.1, dist);
  if (strength < 0.01) discard;

  // Warm white-gold color (dust in golden hour light)
  vec3 color = vec3(1.0, 0.95, 0.8);
  gl_FragColor = vec4(color, strength * vAlpha * uBrightness * 0.4);
}
```

- [ ] **Step 2: Create DustMotes.js**

```js
// src/meadow/DustMotes.js
// Floating dust / petal particles catching sunlight
// Stolen from L16 particle patterns + Alex-DG firefly approach
import * as THREE from 'three'
import vertexShader from './shaders/dustMote.vert.glsl?raw'
import fragmentShader from './shaders/dustMote.frag.glsl?raw'

export default class DustMotes {
  constructor(scene, count = 300) {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 35 },
        uBrightness: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across meadow, concentrated in the mid-range camera path
      positions[i * 3] = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = Math.random() * 3.5 + 0.5  // 0.5–4m height
      positions[i * 3 + 2] = -Math.random() * 160  // along Z path
      scales[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    this.points = new THREE.Points(geometry, this.material)
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 1000
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/meadow/DustMotes.js src/meadow/shaders/dustMote.vert.glsl src/meadow/shaders/dustMote.frag.glsl
git commit -m "feat: add dust mote particles (stolen from L16 + Alex-DG patterns)"
```

---

## Chunk 6: Audio-Reactive System

### Task 9: Create FFT audio-reactive coupling

**Files:**
- Create: `src/meadow/AudioReactive.js`

**Source:** L17 audio-reactive + interactive-particles-music-visualizer

- [ ] **Step 1: Create the audio-reactive system**

```js
// src/meadow/AudioReactive.js
// FFT frequency-to-shader coupling + beat detection
// Stolen from L17 + interactive-particles-music-visualizer extractions
export default class AudioReactive {
  constructor() {
    this.audioCtx = null
    this.analyser = null
    this.source = null
    this.dataArray = null

    // Band outputs (0-1 normalized)
    this.bass = 0
    this.mid = 0
    this.high = 0

    // Beat detection (stolen from L17: adaptive peak detection)
    this._beatHistory = new Array(30).fill(0) // 30-frame rolling average
    this._historyIdx = 0
    this.beat = false
    this._beatCooldown = 0
    this.peakSensitivity = 1.1 // fire when current > average * 1.1

    // FFT config (stolen from L17)
    this.fftSize = 2048 // 1024 frequency bins
    this.smoothing = 0.7
  }

  // Connect to an existing AudioContext and source
  connectSource(audioCtx, sourceNode) {
    this.audioCtx = audioCtx
    this.analyser = audioCtx.createAnalyser()
    this.analyser.fftSize = this.fftSize
    this.analyser.smoothingTimeConstant = this.smoothing
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    sourceNode.connect(this.analyser)
    this.source = sourceNode
  }

  // Connect from an audio element
  connectElement(audioElement) {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.fftSize = this.fftSize
    this.analyser.smoothingTimeConstant = this.smoothing
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    this.source = this.audioCtx.createMediaElementSource(audioElement)
    this.source.connect(this.analyser)
    this.analyser.connect(this.audioCtx.destination)
  }

  update(deltaTime) {
    if (!this.analyser) return

    this.analyser.getByteFrequencyData(this.dataArray)
    const sampleRate = this.audioCtx.sampleRate

    // Band extraction (stolen from L17)
    // bin = Math.round(freq * fftSize / sampleRate)
    const bassEnd = Math.round(250 * this.fftSize / sampleRate)
    const midStart = Math.round(150 * this.fftSize / sampleRate)
    const midEnd = Math.round(2000 * this.fftSize / sampleRate)
    const highStart = Math.round(2000 * this.fftSize / sampleRate)
    const highEnd = Math.round(6000 * this.fftSize / sampleRate)

    this.bass = this._avgBand(0, bassEnd)
    this.mid = this._avgBand(midStart, midEnd)
    this.high = this._avgBand(highStart, highEnd)

    // Beat detection (stolen from L17: adaptive peak)
    const energy = this.bass // beat detection on bass
    this._beatHistory[this._historyIdx] = energy
    this._historyIdx = (this._historyIdx + 1) % this._beatHistory.length

    const avg = this._beatHistory.reduce((a, b) => a + b) / this._beatHistory.length
    this._beatCooldown = Math.max(0, this._beatCooldown - deltaTime)

    if (energy > avg * this.peakSensitivity && this._beatCooldown <= 0) {
      this.beat = true
      this._beatCooldown = 0.2 // 200ms cooldown (from L17)
    } else {
      this.beat = false
    }
  }

  _avgBand(start, end) {
    let sum = 0
    const count = end - start
    if (count <= 0) return 0
    for (let i = start; i < end; i++) {
      sum += this.dataArray[i]
    }
    return sum / count / 256 // normalize 0-1
  }

  // Get uniforms suitable for passing to shaders
  getUniforms() {
    return {
      uBass: this.bass,
      uMid: this.mid,
      uHigh: this.high,
      uBeat: this.beat ? 1.0 : 0.0,
    }
  }

  dispose() {
    if (this.analyser) this.analyser.disconnect()
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/AudioReactive.js
git commit -m "feat: add AudioReactive FFT band extraction + beat detection (stolen from L17)"
```

---

## Chunk 7: Camera Parallax + Motion Blur

### Task 10: Add mouse parallax to CameraRig

**Files:**
- Modify: `src/meadow/CameraRig.js`

**Source:** L14 scroll-camera-transitions — ThreeDOF mouse parallax

- [ ] **Step 1: Read current CameraRig.js and add mouse tracking**

Add mouse-driven offset to camera look direction:
```js
// ThreeDOF mouse parallax (stolen from L14: NYT pattern "Eyes" layer)
// panFactor = PI/20 = ~9 degrees max offset
constructor() {
  // ... existing ...
  this._mouseTarget = new THREE.Vector2()
  this._mouseCurrent = new THREE.Vector2()
  this._mouseOffset = new THREE.Vector3()
  this._panFactor = Math.PI / 20 // from L14 extraction

  window.addEventListener('mousemove', (e) => {
    this._mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
    this._mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1
  })
}

// In update():
// Damped mouse lerp
this._mouseCurrent.lerp(this._mouseTarget, 0.05)
// Apply offset to camera look direction
this._mouseOffset.set(
  this._mouseCurrent.x * this._panFactor,
  this._mouseCurrent.y * this._panFactor * 0.5,
  0
)
// Add to camera quaternion as slight rotation offset
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/CameraRig.js
git commit -m "feat: add mouse parallax to camera (stolen from L14 ThreeDOF)"
```

---

### Task 11: Create camera-only motion blur

**Files:**
- Create: `src/meadow/MotionBlurEffect.js`

**Source:** L10 motion blur + realism-effects (Wagner approach: camera-only)

- [ ] **Step 1: Create the motion blur effect**

Uses the simplified Wagner approach: skip velocity pass, use camera matrix delta as global uniform.

```js
// src/meadow/MotionBlurEffect.js
// Camera-only motion blur using matrix delta
// Stolen from L10 + realism-effects (Wagner simplified approach)
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const fragmentShader = `
uniform mat4 uPrevViewProj;
uniform mat4 uCurrViewProjInv;
uniform float uIntensity;
uniform int uSamples;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Reconstruct world position from depth (approximate with UV)
  vec4 clipPos = vec4(uv * 2.0 - 1.0, 0.5, 1.0);
  vec4 worldPos = uCurrViewProjInv * clipPos;
  worldPos /= worldPos.w;

  // Project to previous frame
  vec4 prevClip = uPrevViewProj * worldPos;
  prevClip /= prevClip.w;
  vec2 prevUV = prevClip.xy * 0.5 + 0.5;

  // Velocity
  vec2 velocity = (uv - prevUV) * uIntensity;

  // Skip if velocity is negligible (stolen from realism-effects: threshold 1e-10)
  float velMag = dot(velocity, velocity);
  if (velMag < 1e-10) {
    outputColor = inputColor;
    return;
  }

  // John Chapman centered sampling (stolen from L10)
  vec2 startUv = uv - velocity * 0.5;
  vec2 endUv = uv + velocity * 0.5;
  vec2 stepUv = (endUv - startUv) / float(uSamples);

  vec4 result = vec4(0.0);
  vec2 sampleUv = startUv;
  for (int i = 0; i < 16; i++) {
    if (i >= uSamples) break;
    result += texture2D(inputBuffer, sampleUv);
    sampleUv += stepUv;
  }
  result /= float(uSamples);

  outputColor = result;
}
`

export class MotionBlurEffect extends Effect {
  constructor({ intensity = 1.0, samples = 8 } = {}) {
    super('MotionBlurEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uPrevViewProj', { value: new THREE.Matrix4() }],
        ['uCurrViewProjInv', { value: new THREE.Matrix4() }],
        ['uIntensity', { value: intensity }],
        ['uSamples', { value: samples }],
      ]),
    })
    this._prevViewProj = new THREE.Matrix4()
    this._currViewProj = new THREE.Matrix4()
    this._tempMat = new THREE.Matrix4()
  }

  update(renderer, inputBuffer, deltaTime) {
    const camera = this.camera || renderer._camera
    if (!camera) return

    // Save previous
    this.uniforms.get('uPrevViewProj').value.copy(this._prevViewProj)

    // Compute current viewProjection
    this._currViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)

    // Inverse for reconstruction
    this._tempMat.copy(this._currViewProj).invert()
    this.uniforms.get('uCurrViewProjInv').value.copy(this._tempMat)

    // Cache for next frame
    this._prevViewProj.copy(this._currViewProj)

    // Frame-speed normalization (stolen from L10: (1/100) / deltaTime)
    const frameSpeed = (1 / 100) / Math.max(deltaTime, 0.001)
    this.uniforms.get('uIntensity').value = frameSpeed * 0.5
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/MotionBlurEffect.js
git commit -m "feat: add camera-only motion blur (stolen from L10 + realism-effects Wagner)"
```

---

## Chunk 8: Wire Everything Into Engine

### Task 12: Update PostProcessingStack with new effects

**Files:**
- Modify: `src/meadow/PostProcessingStack.js`

- [ ] **Step 1: Replace pmndrs NoiseEffect + CA with custom effects**

Import and wire:
- `FilmGrainEffect` replaces `NoiseEffect`
- `RadialCAEffect` replaces `ChromaticAberrationEffect`
- `MotionBlurEffect` added to chain
- `GodRayPass` wired as pre-pass (additive on scene render)

Stack order (from LAYERS-INDEX.md):
```
RenderPass
  → SSAO
  → Bloom
  → Motion Blur (new)
  → ToneMapping
  → FogDepth
  → ColorGrade
  → Radial CA (new, replaces flat CA)
  → Vignette
  → DOF
  → Film Grain (new, replaces NoiseEffect)
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/PostProcessingStack.js
git commit -m "feat: wire FilmGrainEffect, RadialCAEffect, MotionBlurEffect into post stack"
```

---

### Task 13: Wire DustMotes, AudioReactive, GodRays into MeadowEngine

**Files:**
- Modify: `src/meadow/MeadowEngine.js`
- Modify: `src/meadow/AtmosphereController.js`

- [ ] **Step 1: Add new system imports and construction**

```js
import DustMotes from './DustMotes.js'
import AudioReactive from './AudioReactive.js'
import GodRayPass from './GodRayPass.js'
```

- [ ] **Step 2: Add dust mote brightness to AtmosphereController keyframes**

New params per keyframe:
- `dustMoteBrightness`: 0.0 (Stillness) → 0.3 (Awakening) → 0.8 (Alive) → 1.0 (Deepening) → 0.5 (Quieting)
- `godRayIntensity`: 0.0 → 0.2 → 0.6 → 0.8 → 0.3

- [ ] **Step 3: Wire into _tick()**

```js
this.dustMotes.update(animElapsed)
this.dustMotes.material.uniforms.uBrightness.value = this.atmosphere.current.dustMoteBrightness
// God rays: update sun position, render pre-pass
this.godRays.update(this.atmosphere._sunPos)
this.godRays.intensity = this.atmosphere.current.godRayIntensity
```

- [ ] **Step 4: Commit**

```bash
git add src/meadow/MeadowEngine.js src/meadow/AtmosphereController.js
git commit -m "feat: wire DustMotes, AudioReactive, GodRayPass into engine + atmosphere"
```

---

## Human-Seeded Decisions Required

These are divergent (Type A/B) decisions that need the user's input:

1. **Score sheet texture** — Do you have a photograph of a handwritten score? Or should we generate a placeholder?
2. **MKS photo cutout** — Alpha-masked PNG of Michael. Do you have this asset?
3. **Audio file for MusicTrigger** — Which MKS track snippet (30-60s)?
4. **LUT color grading** — You have S-Log3 .cube LUTs. Which LUT do you want per atmospheric zone? Or should we use the programmatic ColorGradeEffect for now?
5. **Volumetric clouds** — The research has full volumetric cloud raymarching. It's expensive (2-5ms). Add it or skip for V1?

---

## Summary

| Chunk | Tasks | Source Repos Stolen From |
|-------|-------|-------------------------|
| 1: Grass | 1-2 | al-ro-grass, grass-shader-glsl-nitash |
| 2: Film Stack | 3-4 | glsl-film-grain, filmic-gl |
| 3: God Rays | 5 | glsl-godrays (GPU Gems 3) |
| 4: Cloth Physics | 6 | cloth-simulation, three-simplecloth |
| 5: Particles | 7-8 | L16, Alex-DG webxr-flowers |
| 6: Audio | 9 | L17, interactive-particles-music-visualizer |
| 7: Camera | 10-11 | L14 (NYT), L10 + realism-effects |
| 8: Wiring | 12-13 | Everything |

**13 tasks, 8 chunks. ~22 files touched. 12 repo techniques integrated.**
