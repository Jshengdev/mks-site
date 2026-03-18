// Origami grass fragment shader — paper cutout lighting
// Adapted from lukysummer/7-Different-Shaders-Using-GLSL cel_shading_frag.glsl
// 4-band hardcoded thresholds for paper — more nuanced than 2-band
// + mayacoda/toon-shader smoothstep(0.0, 0.01) near-step for anti-aliasing

uniform vec3 uColor;        // cream lit face
uniform vec3 uShadowColor;  // darker cream shadow face
uniform vec3 uSunDirection;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = gl_FrontFacing ? normalize(vNormal) : -normalize(vNormal);
  vec3 lightDir = normalize(uSunDirection);

  // 4-band paper step lighting (lukysummer thresholds, adapted for cream paper)
  // Original: 0.01/0.17/0.55 → 0.15/0.30/0.60/0.95
  // Paper adaptation: fewer bands visible because color range is narrow
  float NdotL = dot(normal, lightDir);
  float lambertian;
  if (NdotL < 0.01) {
    lambertian = 0.55;       // deep fold shadow
  } else if (NdotL < 0.17) {
    lambertian = 0.70;       // angled shadow
  } else if (NdotL < 0.55) {
    lambertian = 0.85;       // midtone paper face
  } else {
    lambertian = 1.0;        // fully lit paper face
  }

  vec3 col = mix(uShadowColor, uColor, lambertian);

  // Silhouette edge detection (Manurocker95/Toon-Shading technique)
  // dot(Normal, ViewDir) near zero = silhouette edge of paper fold
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float silhouette = dot(viewDir, normal);
  // smoothstep(0.0, 0.01) = near-step with anti-aliasing (mayacoda trick)
  float edgeDarken = 1.0 - smoothstep(0.0, 0.15, abs(silhouette));
  col -= edgeDarken * 0.08;

  gl_FragColor = vec4(col, 1.0);
}
