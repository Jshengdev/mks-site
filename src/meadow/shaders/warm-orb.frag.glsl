// Warm light orb fragment shader — Stemkoski fresnel glow
// Adapted from stemkoski/Shader-Glow.html
// Magic values: c=0.2, p=1.4 for warm orb (from Stemkoski research)
// Combined with core brightness for solid warm presence
uniform vec3 uGlowColor;
uniform float uIntensity;
uniform float uFresnelC;
uniform float uFresnelP;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);

  // Stemkoski fresnel glow — bright at edges, creating halo
  float NdotV = max(dot(normal, viewDir), 0.0);
  float fresnel = pow(uFresnelC + (1.0 - uFresnelC) * (1.0 - NdotV), uFresnelP);

  // Core brightness — center of orb has warm presence too
  float core = smoothstep(0.0, 0.6, NdotV) * 0.6;

  float intensity = (fresnel + core) * uIntensity;

  gl_FragColor = vec4(uGlowColor * intensity, intensity * 0.8);
}
