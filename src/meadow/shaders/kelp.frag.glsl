// Kelp fragment shader — dark green base to translucent lighter tips
// Lighting: simplified al-ro translucency model for underwater
// Fog: teal-blue murk (underwater cathedral atmosphere)

uniform vec3 uBaseColor;       // dark kelp green [0.02, 0.08, 0.04]
uniform vec3 uTipColor;        // lighter green tips [0.05, 0.18, 0.08]
uniform vec3 uWaterFogColor;   // teal-blue murk [0.02, 0.08, 0.12]
uniform float uFogDensity;     // 0.015 — thick underwater visibility
uniform vec3 uLightDir;        // sun direction (filtered through water)
uniform vec3 uLightColor;      // deep blue sunlight [0.15, 0.35, 0.55]
uniform float uAmbientStrength; // 0.08 — very low underwater

varying float vElevation;
varying vec3  vWorldPos;
varying vec3  vNormal;

void main() {
  // Base-to-tip gradient — smooth kelp color transition
  float gradient = smoothstep(0.1, 0.9, vElevation);
  vec3 baseColor = mix(uBaseColor, uTipColor, gradient);

  // Directional light (filtered sunlight from above)
  vec3 normal = gl_FrontFacing ? vNormal : -vNormal;
  float diff = max(dot(normal, normalize(uLightDir)), 0.0);
  vec3 diffuse = diff * uLightColor * baseColor;

  // Ambient (very low — underwater darkness)
  vec3 ambient = uAmbientStrength * baseColor;

  // Translucency — light passing through thin kelp fronds
  // (al-ro/Eddie Lee 2010 technique, adapted for underwater)
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float dotVL = dot(-normalize(uLightDir), viewDir);
  vec3 translucency = vec3(0.0);
  if (dot(normal, normalize(uLightDir)) <= 0.0 && dotVL > 0.0) {
    translucency = uLightColor * baseColor * 1.2 * pow(dotVL, 8.0);
  }

  // Tip glow — faint bioluminescent edge at tips
  float tipGlow = smoothstep(0.7, 1.0, vElevation) * 0.15;
  vec3 glowColor = vec3(0.1, 0.4, 0.25) * tipGlow;

  vec3 col = diffuse + ambient + translucency + glowColor;

  // Root shadow — darken toward base (al-ro technique)
  col = mix(0.3 * uBaseColor, col, smoothstep(0.0, 0.25, vElevation));

  // Underwater exponential fog
  float dist = length(vWorldPos - cameraPosition);
  float fogAmount = 1.0 - exp(-dist * uFogDensity);
  col = mix(col, uWaterFogColor, fogAmount);

  gl_FragColor = vec4(col, 1.0);
}
