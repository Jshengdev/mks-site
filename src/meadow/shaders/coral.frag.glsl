// Coral fragment shader — warm bioluminescent colors with depth-glow
// Adapted from daniel-ilett toon lighting (3-band + rim)
// + yomboprime/coral-growth emissive approach

uniform vec3 uCoralColor;        // per-type warm color (orange, pink, red)
uniform vec3 uGlowColor;         // bioluminescent glow tint
uniform float uGlowIntensity;    // 0.3-0.6 per type
uniform vec3 uWaterFogColor;     // teal-blue murk
uniform float uFogDensity;       // 0.015
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform float uAmbientStrength;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vHeight;

void main() {
  vec3 normal = gl_FrontFacing ? vNormal : -vNormal;
  vec3 lightDir = normalize(uLightDir);
  vec3 viewDir = normalize(cameraPosition - vWorldPos);

  // 3-band toon diffuse (daniel-ilett technique)
  float dotNL = dot(normal, lightDir);
  float brightness = max(dotNL, 0.0);
  float toonBand;
  if (brightness > 0.5) {
    toonBand = 1.0;
  } else if (brightness > 0.2) {
    toonBand = 0.7;
  } else {
    toonBand = 0.4;
  }

  vec3 diffuse = uCoralColor * toonBand * uLightColor;
  vec3 ambient = uAmbientStrength * uCoralColor;

  // Rim light for edge glow (shared _rim-light.glsl)
  float rim = fresnelRim(normal, viewDir, 1.0);
  rim = smoothstep(0.4, 1.0, rim);
  vec3 rimColor = uGlowColor * rim * 0.5;

  // Bioluminescent emission — coral GLOWS in the dark
  // Intensity increases with depth (distance from surface)
  float depthGlow = smoothstep(5.0, 40.0, 45.0 - vWorldPos.y);  // surface at y=45
  vec3 emission = uGlowColor * uGlowIntensity * (0.5 + 0.5 * depthGlow);

  // Branch tip brightening — tips catch more light
  float tipBrighten = smoothstep(1.0, 3.0, vHeight) * 0.15;

  vec3 col = diffuse + ambient + rimColor + emission + tipBrighten * uCoralColor;

  // Underwater exponential fog (shared _fog-utils.glsl)
  float dist = length(vWorldPos - cameraPosition);
  col = applyExpFog(col, uWaterFogColor, dist, uFogDensity);

  gl_FragColor = vec4(col, 1.0);
}
