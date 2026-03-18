// Ice spike fragment shader — Fresnel rim + subsurface scattering
// Stolen from Three.js SubsurfaceScatteringShader (GDC 2011 Dice/Frostbite approx)
// + Schlick Fresnel (Epic SIGGRAPH '13 optimization)
// Ice F0 = 0.02 (IOR 1.31)
uniform float uBrightness;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uIceColor;
uniform vec3 uSSSColor;
uniform float uFresnelPower;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying float vHeightFraction;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPosition);
  vec3 L = normalize(uSunDirection);

  // ─── Fresnel rim (Schlick approximation) ───
  // F0=0.02 for ice (IOR 1.31), pow(1-NdotV, power) for edge glow
  float NdotV = max(dot(N, V), 0.0);
  float fresnel = 0.02 + 0.98 * pow(1.0 - NdotV, uFresnelPower);

  // ─── Subsurface scattering (GDC 2011 Dice technique) ───
  // thicknessDistortion=0.1 (crystal structure), thicknessPower=2.0,
  // thicknessScale=10.0, thicknessAmbient=0.15
  vec3 scatteringHalf = normalize(L + N * 0.1);
  float scatteringDot = pow(max(dot(V, -scatteringHalf), 0.0), 2.0) * 10.0;
  float sss = scatteringDot + 0.15;

  // ─── Diffuse — very subtle (ice is mostly specular/translucent) ───
  float diffuse = max(dot(N, L), 0.0) * 0.12;

  // ─── Compose ───
  // Height gradient: base darker/denser, tips brighter/airier
  vec3 baseColor = mix(uIceColor * 0.5, uIceColor, vHeightFraction);

  vec3 color = baseColor * (diffuse + 0.08); // base diffuse + ambient
  color += uSSSColor * sss * 0.35;           // SSS blue-purple glow
  color += vec3(0.5, 0.7, 1.0) * fresnel * 0.6; // Fresnel rim — cold blue edge

  // Semi-transparent: base more opaque, tips more transparent
  float alpha = mix(0.65, 0.30, vHeightFraction);
  alpha += fresnel * 0.25; // edges glow slightly brighter

  gl_FragColor = vec4(color * uBrightness, alpha * clamp(uBrightness, 0.0, 1.0));
}
