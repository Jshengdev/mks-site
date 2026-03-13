// SEUS-style color grading — 6-technique pipeline
// Sources: SEUS Renewed v1.0.1, BSL v7.1.05, Complementary Reimagined
// Operates on post-tonemapped display values (0-1 sRGB)

// Cone overlap (SEUS Renewed final.fsh)
uniform float uContrast;         // 0.2 — S-curve blend strength
uniform vec3 uLift;              // vec3(0.02, 0.01, 0.0) — shadow push
uniform vec3 uGamma;             // vec3(1.0, 0.98, 0.95) — midtone shift
uniform vec3 uGain;              // vec3(1.05, 1.0, 0.92) — highlight scale
uniform vec3 uWarmColor;         // vec3(0.925, 0.706, 0.518) — BSL evening sun
uniform vec3 uCoolColor;         // vec3(0.831, 0.769, 0.894) — BSL evening ambient
uniform float uSplitIntensity;   // 0.15
uniform float uVibrance;         // 1.15
uniform float uDarkDesat;        // 0.2

// SEUS cone overlap matrix (simulates eye cone response crosstalk)
const mat3 coneOverlap = mat3(
    1.0,   0.01,  0.001,
    0.01,  1.0,   0.004,
    0.001, 0.01,  1.0
);
// Precomputed inverse (Cramer's rule on the above)
const mat3 coneOverlapInv = mat3(
    1.000089, -0.009996, -0.000910,
    -0.009996, 1.000085, -0.003906,
    -0.000910, -0.009996, 1.000089
);

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Color grade expects tonemapped display values (0-1).
    // Clamp as safety net in case upstream tonemapping is misconfigured.
    vec3 color = clamp(inputColor.rgb, 0.0, 1.0);

    // 1. Cone overlap — warm channel bleed (SEUS signature)
    color = coneOverlap * color;

    // 2. Filmic S-curve contrast (SEUS PTGI E3)
    // Hermite smoothstep S-curve blended at uContrast strength
    color = mix(color, color * color * (3.0 - 2.0 * color), uContrast);

    // 3. Lift/Gamma/Gain (SEUS variant — lift blends shadows toward 1.0)
    color = uGain * (color + uLift * (1.0 - color));
    color = pow(max(color, 0.001), 1.0 / uGamma);

    // 4. Split toning — warm highlights + cool shadows (BSL evening palette)
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 warm = mix(color, color * uWarmColor, smoothstep(0.5, 1.0, luma) * uSplitIntensity);
    vec3 cool = mix(color, color * uCoolColor, smoothstep(0.5, 0.0, luma) * uSplitIntensity);
    color = warm + cool - color;

    // 5. Vibrance — luminance-aware saturation (BSL ColorSaturation)
    float mn = min(color.r, min(color.g, color.b));
    float mx = max(color.r, max(color.g, color.b));
    const float grayVibrance = 1.0;
    float grayV = (color.r + color.g + color.b) / 3.0;
    float sat = (1.0 - (mx - mn)) * (1.0 - mx) * grayV * 5.0;
    vec3 lightness = vec3((mn + mx) * 0.5);
    color = mix(color, mix(color, lightness, 1.0 - uVibrance), sat);

    // 6. Dark desaturation (Complementary Reimagined)
    float lumaPost = dot(color, vec3(0.2126, 0.7152, 0.0722));
    float desatPath = smoothstep(0.1, 0.0, lumaPost);
    color = mix(color, vec3(lumaPost), desatPath * uDarkDesat);

    // Restore channel independence
    color = coneOverlapInv * color;

    outputColor = vec4(clamp(color, 0.0, 1.0), inputColor.a);
}
