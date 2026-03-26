// Wilting grass fragment shader — golden-brown autumn gradient
// Color strategy: roots are dark brown (soil), tips are golden-amber (dying warmth)
// Translucent lighting stolen from al-ro grass WebGL
uniform vec3 uBaseColor;      // dark warm brown at roots
uniform vec3 uTipColor;       // golden-amber at tips
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform float uTranslucency;  // subsurface scattering amount (al-ro technique)
uniform float uFogDensity;
uniform vec3 uFogColor;

varying float vHeight;
varying vec3 vWorldPos;

void main() {
  // ─── Color gradient: dark roots → golden tips ───
  // Cubic interpolation for non-linear color shift (more gold at tips)
  float t = vHeight * vHeight * (3.0 - 2.0 * vHeight); // Hermite smoothstep
  vec3 bladeColor = mix(uBaseColor, uTipColor, t);

  // ─── Translucent lighting (stolen from al-ro grass WebGL) ───
  // Backlit grass glows amber when sun is behind
  vec3 lightDir = normalize(uSunDirection);
  float translucent = max(dot(-lightDir, vec3(0.0, 1.0, 0.0)), 0.0);
  translucent = pow(translucent, 2.0) * uTranslucency;
  vec3 transColor = uSunColor * bladeColor * translucent;

  // Simple ambient + directional
  float ambient = 0.3;
  float diffuse = max(dot(vec3(0.0, 1.0, 0.0), lightDir), 0.0) * 0.5;
  vec3 lit = bladeColor * (ambient + diffuse) * uSunColor + transColor;

  // ─── Distance fog (shared _fog-utils.glsl) ───
  float dist = length(vWorldPos - cameraPosition);
  lit = applyExpFog(lit, uFogColor, dist, uFogDensity);

  gl_FragColor = vec4(lit, 1.0);
}
