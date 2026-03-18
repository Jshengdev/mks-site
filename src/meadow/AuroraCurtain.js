// AuroraCurtain — Flowing aurora borealis on dome mesh
// Adapted from nimitz "Auroras" (Shadertoy XtGGRt), CC BY-NC-SA 3.0
// triNoise2d curtain technique on curved PlaneGeometry
// Positioned at y=100 above scene, additive blending for sky glow
import * as THREE from 'three'
import vertexShader from './shaders/aurora.vert.glsl?raw'
import fragmentShader from './shaders/aurora.frag.glsl?raw'

export default class AuroraCurtain {
  constructor(scene, config = {}) {
    const width = 500
    const depth = 300
    const height = config.height ?? 100
    const speed = config.speed ?? 0.06
    const intensity = config.intensity ?? 1.8
    const colorBase = config.colorBase ?? [2.15, -0.5, 1.2]
    const colorShift = config.colorShift ?? 0.043

    // Large plane with enough segments for smooth dome curvature
    const geometry = new THREE.PlaneGeometry(width, depth, 64, 32)
    // Rotate so it faces downward (visible from below)
    geometry.rotateX(Math.PI / 2)

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uBrightness: { value: intensity },
        uSpeed: { value: speed },
        uColorBase: { value: new THREE.Vector3(...colorBase) },
        uColorShift: { value: colorShift },
        uWaveAmplitude: { value: 3.0 },
      },
      vertexShader,
      fragmentShader,
    })

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.y = height
    this.mesh.renderOrder = -50 // behind most things, in front of stars
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(value) {
    this.material.uniforms.uBrightness.value = value
    this.mesh.visible = value > 0.01
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
