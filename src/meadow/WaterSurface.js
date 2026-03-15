// WaterSurface — The "sky" of the Tide Pool world
// A large plane positioned ABOVE the camera that represents the water surface
// viewed from below. It ripples, refracts light, and creates the overhead
// caustic projection patterns.
//
// Architecture follows StylizedOcean pattern:
//   - ShaderMaterial on PlaneGeometry
//   - Time-driven animation in update()
//   - Atmosphere-driven brightness
import * as THREE from 'three'
import vertexShader from './shaders/water-surface.vert.glsl?raw'
import fragmentShader from './shaders/water-surface.frag.glsl?raw'

export default class WaterSurface {
  constructor(scene, config = {}) {
    const size = 300  // large — covers the whole pool from above
    const surfaceHeight = config.surfaceHeight ?? 8.0

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uRippleFrequency: { value: config.rippleFrequency ?? 3.5 },
        uRippleSpeed: { value: config.rippleSpeed ?? 0.4 },
        uRippleAmplitude: { value: config.rippleAmplitude ?? 0.15 },
        uSurfaceColor: { value: new THREE.Color(
          ...(config.surfaceColor ?? [0.35, 0.55, 0.65])
        )},
        uBrightness: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    })

    // PlaneGeometry facing DOWN (rotated so normals point downward toward camera)
    const geometry = new THREE.PlaneGeometry(size, size, 64, 64)
    geometry.rotateX(Math.PI / 2)  // horizontal plane

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.y = surfaceHeight
    this.mesh.renderOrder = 20  // render after terrain + caustics
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(v) {
    this.material.uniforms.uBrightness.value = v
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
