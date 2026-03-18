// Metallic PBR-ish shader — copper/brass values from physicallybased.info
// Blinn-Phong specular with metallic tint + Fresnel rim
// Adapted from: physicallybased.info (copper 0.955/0.638/0.538, brass 0.910/0.778/0.423)
uniform vec3 uColor;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform float uRoughness;
uniform float uMetalness;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(uSunDirection);
  vec3 V = normalize(cameraPosition - vPosition);
  vec3 H = normalize(L + V);

  // Diffuse — reduced for metals (metals absorb, don't scatter)
  float NdotL = max(dot(N, L), 0.0);
  vec3 diffuse = uColor * uSunColor * NdotL * (1.0 - uMetalness * 0.85);

  // Specular — metallic: specular color = base color (not white)
  float NdotH = max(dot(N, H), 0.0);
  float specPower = mix(16.0, 256.0, 1.0 - uRoughness);
  float spec = pow(NdotH, specPower);
  vec3 F0 = mix(vec3(0.04), uColor, uMetalness);
  vec3 specular = F0 * uSunColor * spec * 2.0;

  // Fresnel rim — warm metallic edge glow
  float fresnel = pow(1.0 - max(dot(V, N), 0.0), 4.0);
  vec3 rim = F0 * fresnel * 0.4;

  // Ambient — slightly warm to match steam-lit environment
  vec3 ambient = uColor * 0.12;

  gl_FragColor = vec4(ambient + diffuse + specular + rim, 1.0);
}
