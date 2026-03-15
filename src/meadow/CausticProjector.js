// CausticProjector — Animated caustic light patterns projected onto pool surfaces
// Technique: Full-screen quad with additive blending, using world-space XZ projection.
// The caustic shader reads depth from the water surface and dims with absorption.
//
// Stolen from:
//   martinRenou/threejs-caustics — projection concept
//   Shadertoy MdlXz8 (Dave_Hoskins) — tileable caustic noise pattern
//   pabennett/WaterCaustics — inverse area brightness (pow sharpening)
//
// Integration: rendered as a second pass over terrain geometry with additive blending.
// AtmosphereController drives uIntensity for scroll-driven caustic fade.
import * as THREE from 'three'
import vertexShader from './shaders/caustic.vert.glsl?raw'
import fragmentShader from './shaders/caustic.frag.glsl?raw'

export default class CausticProjector {
  constructor(scene, config = {}) {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: config.frequency ?? 8.0 },
        uSpeed: { value: config.speed ?? 0.3 },
        uIntensity: { value: config.intensity ?? 0.7 },
        uSharpness: { value: config.sharpness ?? 3.0 },
        uDepthFade: { value: config.depthFade ?? 0.12 },
        uCausticColor: { value: new THREE.Vector3(
          ...(config.color ?? [0.6, 0.85, 0.95])
        )},
        uSurfaceHeight: { value: config.surfaceHeight ?? 8.0 },
        uAbsorption: { value: new THREE.Vector3(
          config.absorptionRed ?? 0.15,
          config.absorptionGreen ?? 0.06,
          config.absorptionBlue ?? 0.02,
        )},
      },
      vertexShader,
      fragmentShader,
    })

    // The caustic projection plane covers the pool floor and walls.
    // It's a duplicate of the terrain geometry rendered with additive blending.
    // We don't create geometry here — WorldEngine will clone terrain mesh
    // and apply this material to it.
    this.scene = scene
    this.mesh = null
  }

  // Called by WorldEngine after terrain is created — clone terrain for caustic overlay
  setTerrainGeometry(terrainGeometry) {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
    }
    this.mesh = new THREE.Mesh(terrainGeometry.clone(), this.material)
    // Slight Y offset to prevent z-fighting
    this.mesh.position.y += 0.01
    this.mesh.renderOrder = 10  // render after terrain
    this.scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setIntensity(v) {
    this.material.uniforms.uIntensity.value = v
  }

  setDepthFade(v) {
    this.material.uniforms.uDepthFade.value = v
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
    }
    this.material.dispose()
  }
}
