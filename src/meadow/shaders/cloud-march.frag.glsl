// cloud-march.frag.glsl — Volumetric cumulus cloud ray-marching (GLSL3)
// Stolen from takram/three-clouds + Schneider GDC 2015
// Winner: volumetric-cumulus-3d-noise (49/70)
// Beer-Lambert extinction, dual-lobe Henyey-Greenstein, multi-scatter (Oz Volumes)
precision highp float;
precision highp sampler3D;

in vec2 vUv;
in vec3 vRayDir;

// Cloud layer geometry
uniform float uCloudBottom;     // 3.0 — layer base height
uniform float uCloudTop;        // 18.0 — layer ceiling
uniform float uCoverage;        // 0.75 — sky coverage fraction
uniform float uDensityScale;    // 0.6 — overall density multiplier

// Lighting
uniform vec3 uSunDirection;     // normalized sun direction
uniform vec3 uSunColor;         // sun light color
uniform vec3 uAmbientColor;     // sky ambient color

// Camera
uniform vec3 uCameraPosition;
uniform float uTime;

// 3D noise texture (128^3 Perlin-Worley)
uniform sampler3D uNoiseTexture;

out vec4 fragColor;

#define MAX_STEPS 48
#define LIGHT_STEPS 6
#define PI 3.14159265359

// ─── Henyey-Greenstein phase function (dual-lobe) ───
// g1=0.7 forward, g2=-0.2 back, 50/50 blend (from extraction)
float hgPhase(float cosTheta, float g) {
  float g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
}

float dualLobePhase(float cosTheta) {
  return mix(hgPhase(cosTheta, -0.2), hgPhase(cosTheta, 0.7), 0.5);
}

// ─── Height profile — flat base, rounded top (cumulus shape) ───
float heightProfile(float h) {
  // h is 0 at cloud bottom, 1 at cloud top
  return smoothstep(0.0, 0.15, h) * smoothstep(1.0, 0.65, h);
}

// ─── Sample cloud density at world position ───
float sampleDensity(vec3 pos) {
  float h = clamp((pos.y - uCloudBottom) / (uCloudTop - uCloudBottom), 0.0, 1.0);
  float profile = heightProfile(h);

  // Sample 3D noise texture (R = Perlin-Worley shape)
  vec3 uvw = pos * 0.03 + vec3(uTime * 0.002, 0.0, uTime * 0.001);
  vec4 noise = texture(uNoiseTexture, uvw);

  float shape = noise.r;

  // Erosion from detail channels (more erosion at base)
  float erosionWeight = mix(0.6, 0.2, h);
  float detail = noise.b * 0.5 + noise.a * 0.5;
  shape -= detail * erosionWeight;

  // Apply coverage and height profile
  float coverageBoost = 1.0 + 0.3 * profile;
  float density = shape * profile * coverageBoost;

  // Coverage threshold (from winner: coverage=0.75)
  density = smoothstep(1.0 - uCoverage, 1.0 - uCoverage + 0.6, density);

  return max(0.0, density * uDensityScale);
}

// ─── Light march — accumulate extinction toward sun ───
float lightMarch(vec3 pos) {
  float stepSize = (uCloudTop - pos.y) / float(LIGHT_STEPS);
  float totalDensity = 0.0;

  for (int i = 0; i < LIGHT_STEPS; i++) {
    pos += uSunDirection * stepSize;
    if (pos.y < uCloudBottom || pos.y > uCloudTop) break;
    totalDensity += sampleDensity(pos) * stepSize;
  }

  return totalDensity;
}

// ─── Ray-sphere intersection for cloud layer ───
float intersectLayer(vec3 ro, vec3 rd, float height) {
  // Horizontal plane intersection
  if (abs(rd.y) < 0.0001) return -1.0;
  float t = (height - ro.y) / rd.y;
  return t > 0.0 ? t : -1.0;
}

void main() {
  vec3 rd = normalize(vRayDir);

  // Skip if looking below horizon (clouds are above)
  if (rd.y < 0.01) {
    fragColor = vec4(0.0);
    return;
  }

  // Find entry/exit of cloud layer
  float tBottom = intersectLayer(uCameraPosition, rd, uCloudBottom);
  float tTop = intersectLayer(uCameraPosition, rd, uCloudTop);

  float tEntry, tExit;
  if (uCameraPosition.y < uCloudBottom) {
    tEntry = tBottom;
    tExit = tTop;
  } else if (uCameraPosition.y > uCloudTop) {
    tEntry = tTop;
    tExit = tBottom;
  } else {
    // Inside cloud layer
    tEntry = 0.0;
    tExit = max(tBottom, tTop);
  }

  if (tEntry < 0.0 || tExit < 0.0 || tEntry >= tExit) {
    fragColor = vec4(0.0);
    return;
  }

  // ─── Ray march through cloud layer ───
  float stepSize = (tExit - tEntry) / float(MAX_STEPS);
  vec3 pos = uCameraPosition + rd * tEntry;
  vec3 step = rd * stepSize;

  vec3 radiance = vec3(0.0);
  float transmittance = 1.0;

  // Phase function — cosine of angle between view and sun
  float cosTheta = dot(rd, uSunDirection);
  float phase = dualLobePhase(cosTheta);

  for (int i = 0; i < MAX_STEPS; i++) {
    if (transmittance < 0.01) break;

    float density = sampleDensity(pos);

    if (density > 0.001) {
      // Beer-Lambert extinction
      float extinction = density;
      float sampleTransmittance = exp(-extinction * stepSize);

      // Light march toward sun
      float lightDensity = lightMarch(pos);
      float lightTransmittance = exp(-lightDensity * 2.0);

      // Beer-Powder effect (from extraction: scale=0.8, exponent=150)
      float powder = 1.0 - 0.8 * exp(-density * 150.0);
      float lightEnergy = lightTransmittance * powder;

      // Multi-scatter approximation (8 octaves, Oz Volumes)
      vec3 scatter = vec3(0.0);
      float scatterAttenuation = 0.5;
      float scatterPhase = phase;
      for (int o = 0; o < 8; o++) {
        scatter += vec3(lightEnergy * scatterPhase) * scatterAttenuation;
        scatterAttenuation *= 0.5;
        scatterPhase = mix(scatterPhase, 0.25 / PI, 0.3);
        lightEnergy *= 0.7;
      }

      vec3 cloudColor = uSunColor * scatter;

      // Height-dependent ambient (top brighter) + ground bounce
      float h = clamp((pos.y - uCloudBottom) / (uCloudTop - uCloudBottom), 0.0, 1.0);
      vec3 ambient = uAmbientColor * (0.3 + 0.7 * h);
      vec3 groundBounce = vec3(0.05, 0.04, 0.03) * (1.0 - h) * 0.3;
      cloudColor += (ambient + groundBounce) * density;

      // Energy-conserving integration (from extraction)
      float clampedExtinction = max(extinction, 1e-7);
      vec3 scatteringIntegral = (cloudColor - cloudColor * sampleTransmittance) / clampedExtinction;
      radiance += transmittance * scatteringIntegral;
      transmittance *= sampleTransmittance;
    }

    pos += step;
  }

  // Atmospheric perspective fade on distant clouds
  float dist = length(pos - uCameraPosition);
  float atmosphereFade = exp(-dist * 0.005);
  radiance *= atmosphereFade;

  // Output: premultiplied alpha (alpha = 1 - transmittance = cloud opacity)
  float alpha = 1.0 - transmittance;
  fragColor = vec4(radiance, alpha);
}
