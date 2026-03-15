// Water surface fragment shader — the "sky" of the Tide Pool, viewed from below
// The surface is translucent with Fresnel-based opacity:
//   - Looking straight up = more transparent (see the world above)
//   - Looking at an angle = more reflective (internal reflection)
// Caustic light patterns originate from here — the rippling surface
// acts as a lens, focusing and defocusing sunlight.
//
// Stolen from:
//   Catlike Coding "Looking Through Water" — Fresnel-based transparency
//   thaslle/stylized-water — procedural surface patterns

precision highp float;

uniform vec3 uSurfaceColor;     // bright teal-white from above
uniform float uTime;
uniform float uBrightness;      // atmosphere-driven

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;

void main() {
  vec3 N = normalize(vNormal);

  // View direction (looking up at surface from below)
  vec3 viewDir = normalize(cameraPosition - vWorldPos);

  // Fresnel — Schlick approximation
  // Looking straight up: low Fresnel → more transparent → bright (see sky)
  // Looking at angle: high Fresnel → more reflective → dimmer
  float fresnel = pow(1.0 - max(dot(N, viewDir), 0.0), 3.0);

  // Surface brightness — brightest where you look straight up
  // This creates the bright "window" effect looking up from underwater
  float directBright = max(dot(N, vec3(0.0, -1.0, 0.0)), 0.0);
  directBright = pow(directBright, 0.5) * 0.8 + 0.2;

  // Ripple caustic highlight on the surface itself
  // (Secondary: the main caustics are projected onto terrain by CausticProjector)
  float surfaceHighlight = pow(max(dot(N, vec3(0.0, -1.0, 0.0)), 0.0), 8.0);

  vec3 color = uSurfaceColor * directBright;
  color += vec3(0.8, 0.9, 1.0) * surfaceHighlight * 0.3;  // bright highlight spots

  // Alpha: semi-transparent, more opaque at edges (Fresnel)
  float alpha = mix(0.25, 0.65, fresnel);

  color *= uBrightness;

  gl_FragColor = vec4(color, alpha);
}
