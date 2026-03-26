// src/meadow/ScoreSheetCloth.js
// "The score flying through the sky. The music unbound from the page, liberated."
// Wind-driven score sheets with Verlet cloth physics
// Stolen from cloth-simulation + three-simplecloth
import * as THREE from 'three'
import { ClothSolver } from './ClothSolver.js'

export default class ScoreSheetCloth {
  constructor(scene, count = 3) {
    this.sheets = []
    this.scene = scene
    this._windStrength = 1.0

    // Placeholder off-white texture
    this.dataTexture = new THREE.DataTexture(
      new Uint8Array([255, 255, 240, 255]), 1, 1
    )
    this.dataTexture.needsUpdate = true

    for (let i = 0; i < count; i++) {
      // 8x6 grid cloth
      const solver = new ClothSolver(1.8, 1.3, 8, 6)
      const geometry = new THREE.PlaneGeometry(1.8, 1.3, 8, 6)
      const material = new THREE.MeshStandardMaterial({
        map: this.dataTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        roughness: 0.8,
        metalness: 0.0,
      })

      const mesh = new THREE.Mesh(geometry, material)
      // Airborne — "liberated into the vastness" — visible from camera path
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        2.0 + Math.random() * 2.5,   // 2.0-4.5m — above grass, visible from cam (~1.5m)
        -15 - i * 25
      )
      mesh.rotation.y = Math.random() * Math.PI * 2

      const drift = {
        phaseOffset: Math.random() * Math.PI * 2,
        driftSpeed: 0.4 + Math.random() * 0.6,  // faster — caught in wind
        baseY: mesh.position.y,
        baseX: mesh.position.x,
      }

      scene.add(mesh)
      this.sheets.push({ mesh, solver, drift })
    }
  }

  setTexture(texture) {
    for (const { mesh } of this.sheets) {
      mesh.material.map = texture
      mesh.material.needsUpdate = true
    }
  }

  update(elapsed) {
    const dt = 1 / 60
    for (const { mesh, solver, drift } of this.sheets) {
      const t = elapsed + drift.phaseOffset
      solver.setWind(this._windStrength, elapsed)
      solver.step(dt)
      solver.updateGeometry(mesh.geometry)
      // Wider lateral drift + more vertical bob = truly airborne
      mesh.position.x = drift.baseX + Math.sin(t * 0.3) * 1.2 * this._windStrength
      mesh.position.y = drift.baseY + Math.sin(t * drift.driftSpeed) * 0.8
      mesh.rotation.y += 0.003 * this._windStrength
    }
  }

  setWindStrength(strength) {
    this._windStrength = strength
  }

  dispose() {
    if (this.dataTexture) this.dataTexture.dispose()
    for (const { mesh } of this.sheets) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
  }
}
