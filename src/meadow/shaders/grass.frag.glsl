// src/meadow/shaders/grass.frag.glsl
// Combines: Nitash-Biswas (gradient), al-ro (lighting, fog, ACES),
// James-Smyth (cloud shadows), spacejack/terra (color palette)

uniform vec3 uBaseColor;    // (0.45, 0.46, 0.19) — spacejack GRASS_COLOR
uniform vec3 uTipColor;     // (0.77, 0.76, 0.59) — warm BotW tip
uniform vec3 uSunDirection; // normalized
uniform vec3 uSunColor;     // (1.0, 1.0, 0.99)
uniform float uAmbientStrength;       // 0.7
uniform float uTranslucencyStrength;  // 1.5
uniform float uFogFade;               // 0.005
uniform sampler2D uCloudTexture;

varying float vElevation;
varying float vSideGradient;
varying vec3 vNormal;
varying vec3 vFakeNormal;
varying vec3 vPosition;
varying vec2 vCloudUV;

// ACES Film tonemapping (from al-ro)
vec3 ACESFilm(vec3 x) {
  float a = 2.51; float b = 0.03;
  float c = 2.43; float d = 0.59; float e = 0.14;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

// iquilez height-dependent fog (from al-ro)
vec3 applyFog(vec3 rgb, vec3 rayDir, vec3 sunDir) {
  float dist = length(vPosition - cameraPosition);
  float rd = rayDir.y;
  if (abs(rd) < 0.0001) rd = 0.0001;
  float fogAmount = exp(-cameraPosition.y * uFogFade)
    * (1.0 - exp(-dist * rd * uFogFade)) / rd;
  float sunAmount = max(dot(rayDir, sunDir), 0.0);
  // Near-sun haze warm, far-sun haze cool (from al-ro)
  vec3 fogColor = mix(vec3(0.35, 0.5, 0.9), vec3(1.0, 1.0, 0.75), pow(sunAmount, 16.0));
  return mix(rgb, fogColor, clamp(fogAmount, 0.0, 1.0));
}

void main() {
  // Base-to-tip color gradient (Nitash-Biswas)
  float gradient = smoothstep(0.2, 1.0, vElevation);
  vec3 baseColor = mix(uBaseColor, uTipColor, gradient);

  // Normal handling (Nitash-Biswas fake curved normals)
  vec3 normal = gl_FrontFacing ? vFakeNormal : -vFakeNormal;
  vec3 viewDir = normalize(cameraPosition - vPosition);
  vec3 lightDir = normalize(uSunDirection);

  // Directional light
  float dotNL = dot(normal, lightDir);
  float diff = max(dotNL, 0.0);
  vec3 diffuse = diff * uSunColor * baseColor;

  // Ambient
  vec3 ambient = uAmbientStrength * baseColor;

  // Sky light (from al-ro)
  float sky = max(dot(normal, vec3(0.0, 1.0, 0.0)), 0.0);
  vec3 skyLight = sky * vec3(0.12, 0.29, 0.55);

  // Translucent lighting (from al-ro — Eddie Lee 2010 technique)
  vec3 diffuseTranslucency = vec3(0.0);
  vec3 forwardTranslucency = vec3(0.0);
  float dotVL = dot(-lightDir, viewDir);
  if (dotNL <= 0.0) {
    diffuseTranslucency = uSunColor * baseColor * uTranslucencyStrength * -dotNL;
    if (dotVL > 0.0) {
      forwardTranslucency = uSunColor * baseColor * uTranslucencyStrength * pow(dotVL, 16.0);
    }
  }

  // Cloud shadows (James-Smyth UV scrolling)
  vec3 cloudSample = texture2D(uCloudTexture, vCloudUV).rgb;
  float shadowFactor = mix(0.7, 1.0, cloudSample.r);

  // Combine all lighting
  vec3 col = (0.3 * skyLight * baseColor + ambient + diffuse
    + diffuseTranslucency + forwardTranslucency) * shadowFactor;

  // Root shadow (from al-ro: darken towards base)
  col = mix(0.35 * uBaseColor, col, smoothstep(0.0, 0.3, vElevation));

  // Fog (iquilez height-dependent, from al-ro)
  vec3 rayDir = normalize(vPosition - cameraPosition);
  col = applyFog(col, rayDir, lightDir);

  // ACES tonemapping (from al-ro)
  col = ACESFilm(col);

  // Gamma correction
  col = pow(col, vec3(0.4545));

  gl_FragColor = vec4(col, 1.0);
}
