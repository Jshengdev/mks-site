// Copper leaf fragment — metallic PBR-ish with subsurface backlight
// Base color from physicallybased.info copper: (0.955, 0.638, 0.538)
// Metallic specular: spec color = base color (not white)
uniform vec3 uColor;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(uSunDirection);
  vec3 V = normalize(cameraPosition - vPosition);
  vec3 H = normalize(L + V);

  // Diffuse — slightly more than pure metal (leaf has oxidation patina)
  float NdotL = max(dot(N, L), 0.0);
  vec3 diffuse = uColor * uSunColor * NdotL * 0.3;

  // Metallic specular — moderately sharp
  float NdotH = max(dot(N, H), 0.0);
  float spec = pow(NdotH, 64.0);
  vec3 specular = uColor * uSunColor * spec * 1.5;

  // Fresnel rim
  float fresnel = pow(1.0 - max(dot(V, N), 0.0), 3.0);
  vec3 rim = uColor * fresnel * 0.25;

  // Subsurface hint — thin metal leaf backlit by sun
  float backlight = max(dot(-N, L), 0.0) * 0.15;
  vec3 subsurface = uColor * backlight;

  vec3 ambient = uColor * 0.10;

  gl_FragColor = vec4(ambient + diffuse + specular + rim + subsurface, 1.0);
}
