// SOURCE: https://www.maya-ndljk.com/blog/threejs-basic-toon-shader
// Three.js Custom Toon Shader - Complete Implementation
// Translates toon shader principles from Unity into Three.js

// ============================================================
// JAVASCRIPT SETUP
// ============================================================
//
// const toonShaderMaterial = new THREE.ShaderMaterial({
//   lights: true,
//   uniforms: {
//     ...THREE.UniformsLib.lights,
//     uColor: { value: new THREE.Color('#6495ED') },
//     uGlossiness: { value: 32 }
//   },
//   vertexShader: toonVertexShader,
//   fragmentShader: toonFragmentShader,
// })
//
// // Shadow setup:
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 4096;
// directionalLight.shadow.mapSize.height = 4096;

// ============================================================
// VERTEX SHADER (toon.vert) - FINAL VERSION WITH SHADOWS
// ============================================================

// #include <common>
// #include <shadowmap_pars_vertex>
//
// varying vec3 vNormal;
// varying vec3 vViewDir;
//
// void main() {
//   #include <beginnormal_vertex>
//   #include <defaultnormal_vertex>
//   #include <begin_vertex>
//   #include <worldpos_vertex>
//   #include <shadowmap_vertex>
//
//   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//   vec4 viewPosition = viewMatrix * modelPosition;
//   vec4 clipPosition = projectionMatrix * viewPosition;
//
//   vNormal = normalize(normalMatrix * normal);
//   vViewDir = normalize(-viewPosition.xyz);
//
//   gl_Position = clipPosition;
// }

// ============================================================
// FRAGMENT SHADER (toon.frag) - FINAL VERSION WITH ALL FEATURES
// ============================================================

// #include <common>
// #include <packing>
// #include <lights_pars_begin>
// #include <shadowmap_pars_fragment>
// #include <shadowmask_pars_fragment>
//
// uniform vec3 uColor;
// uniform float uGlossiness;
//
// varying vec3 vNormal;
// varying vec3 vViewDir;
//
// void main() {
//   // === SHADOW RECEPTION ===
//   DirectionalLightShadow directionalShadow = directionalLightShadows[0];
//
//   float shadow = getShadow(
//     directionalShadowMap[0],
//     directionalShadow.shadowMapSize,
//     directionalShadow.shadowBias,
//     directionalShadow.shadowRadius,
//     vDirectionalShadowCoord[0]
//   );
//
//   // === CORE SHADOW (NdotL with sharp cutoff) ===
//   float NdotL = dot(vNormal, directionalLights[0].direction);
//   float lightIntensity = smoothstep(0.0, 0.01, NdotL * shadow);
//   vec3 directionalLight = directionalLights[0].color * lightIntensity;
//
//   // === SPECULAR (Blinn-Phong with toon cutoff) ===
//   vec3 halfVector = normalize(directionalLights[0].direction + vViewDir);
//   float NdotH = dot(vNormal, halfVector);
//
//   float specularIntensity = pow(NdotH * lightIntensity, 1000.0 / uGlossiness);
//   float specularIntensitySmooth = smoothstep(0.05, 0.1, specularIntensity);
//   vec3 specular = specularIntensitySmooth * directionalLights[0].color;
//
//   // === RIM LIGHTING ===
//   float rimDot = 1.0 - dot(vViewDir, vNormal);
//   float rimAmount = 0.6;
//   float rimThreshold = 0.2;
//   float rimIntensity = rimDot * pow(NdotL, rimThreshold);
//   rimIntensity = smoothstep(rimAmount - 0.01, rimAmount + 0.01, rimIntensity);
//   vec3 rim = rimIntensity * directionalLights[0].color;
//
//   // === FINAL COLOR ===
//   gl_FragColor = vec4(uColor * (ambientLightColor + directionalLight + specular + rim), 1.0);
// }

// ============================================================
// KEY TECHNIQUES EXPLAINED
// ============================================================
//
// 1. SHARP SHADOW CUTOFF: smoothstep(0.0, 0.01, NdotL) creates a near-binary
//    transition between lit and unlit areas (the hallmark of toon shading)
//
// 2. BLINN-PHONG SPECULAR: Uses half-vector between light and view direction.
//    The pow() with 1000/glossiness controls highlight size. smoothstep()
//    then makes it a hard cutoff.
//
// 3. RIM LIGHTING: 1.0 - dot(viewDir, normal) peaks when surface faces away
//    from camera. Combined with NdotL to only show rim on lit side.
//
// 4. THREE.JS SHADOW INTEGRATION: Uses built-in includes for shadow maps.
//    getShadow() samples the shadow map and returns 0 (shadowed) or 1 (lit).
//    Shadow value multiplied with NdotL feeds into lightIntensity.
//
// 5. AMBIENT: ambientLightColor comes free from #include <lights_pars_begin>
//    and ensures fully shadowed areas aren't pure black.
