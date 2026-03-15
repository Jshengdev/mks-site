// Anemone tentacle fragment shader
// Translucent subsurface scattering look — light passes through tentacle flesh
//
// Stolen from:
//   al-ro/grass — translucent lighting model (light shining through grass)
//   daniel-ilett/toon-shader — 3-band step lighting adapted for organic tissue
//
// Key insight: sea anemone tentacles are TRANSLUCENT. Light from above
// passes through them, creating a warm glow on the side facing away from
// the light. This is the same translucent lighting model used for grass
// but with higher translucency (tentacles are fleshy, not leafy).

precision highp float;

uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform float uBrightness;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vWorldPos;
varying float vBrightness;

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(-uSunDirection);  // light from above

  // --- Diffuse lighting with translucency ---
  float NdotL = dot(N, L);
  // Front lighting (standard diffuse)
  float diffuse = max(NdotL, 0.0);

  // Translucent back-lighting (al-ro technique)
  // Light passes through tentacle flesh from behind
  // Higher at tips (thinner tissue), lower at base (thicker)
  float translucency = 2.5 * (0.5 + 0.5 * vElevation);  // tips glow more
  float backLight = max(-NdotL, 0.0) * translucency;

  // --- 3-band toon shading (daniel-ilett) ---
  // Soft bands for organic feel (not hard cel-shading)
  float totalLight = diffuse + backLight;
  float band = smoothstep(0.0, 0.15, totalLight) * 0.3
             + smoothstep(0.15, 0.45, totalLight) * 0.35
             + smoothstep(0.45, 1.0, totalLight) * 0.35;

  // Ambient — underwater ambient is slightly stronger (scattered light)
  float ambient = 0.25;

  // --- Color variation along tentacle ---
  // Tips are slightly lighter/more saturated (thinner tissue, more light)
  vec3 baseColor = vColor;
  vec3 tipColor = vColor * 1.3 + vec3(0.05, 0.08, 0.05);  // brighter, slight green shift
  vec3 tentacleColor = mix(baseColor, tipColor, vElevation);

  // Final color
  vec3 lit = tentacleColor * (band + ambient) * uSunColor;

  // Atmosphere brightness control
  lit *= vBrightness;

  // Slight rim light for definition against underwater haze
  float rim = 1.0 - max(dot(N, normalize(-vWorldPos)), 0.0);
  rim = pow(rim, 3.0) * 0.15;
  lit += vec3(0.2, 0.4, 0.5) * rim;  // teal rim

  gl_FragColor = vec4(lit, 1.0);
}
