// Bioluminescent plankton fragment shader
// Adapted from Alex-DG firefly.frag.glsl
// Changed from warm amber to multi-color bioluminescent palette
//
// Bioluminescence colors:
//   0 = cyan (most common marine bioluminescence)
//   1 = blue-violet (deep sea)
//   2 = green (dinoflagellates)
//   3 = deep purple (rare, alien)

uniform float uBrightness;

// Color palette as uniforms (set from config)
uniform vec3 uColor0;  // cyan
uniform vec3 uColor1;  // blue-violet
uniform vec3 uColor2;  // green
uniform vec3 uColor3;  // deep purple

varying float vPulse;
varying float vColorIndex;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));

  // Softer glow than fireflies — bioluminescence is more diffuse
  // Inverse distance with wider falloff
  float strength = 0.04 / distanceToCenter - 0.08;
  if (strength < 0.01) discard;

  // Select color based on index (rounded to nearest int)
  int idx = int(floor(vColorIndex + 0.5));
  vec3 color;
  if (idx == 0) color = uColor0;
  else if (idx == 1) color = uColor1;
  else if (idx == 2) color = uColor2;
  else color = uColor3;

  // Apply pulse and brightness
  gl_FragColor = vec4(color, strength * vPulse);
}
