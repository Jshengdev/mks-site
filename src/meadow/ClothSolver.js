// src/meadow/ClothSolver.js
// CPU Verlet Jakobsen constraint solver
// Stolen from cloth-simulation + three-simplecloth extractions
import * as THREE from 'three'

export class ClothSolver {
  constructor(width, height, segW, segH) {
    this.width = width
    this.height = height
    this.segW = segW
    this.segH = segH
    this.particles = []
    this.constraints = []
    this.stiffness = 0.4     // paper stiffer than cloth (extraction: 0.3-0.5)
    this.dampening = 0.90    // more energy loss for paper (extraction: 0.88-0.93)
    this.gravity = new THREE.Vector3(0, -1.5, 0)
    this.wind = new THREE.Vector3()
    this._initParticles()
    this._initConstraints()
  }

  _initParticles() {
    const stepX = this.width / this.segW
    const stepY = this.height / this.segH
    for (let j = 0; j <= this.segH; j++) {
      for (let i = 0; i <= this.segW; i++) {
        const x = (i - this.segW / 2) * stepX
        const y = (j - this.segH / 2) * stepY
        this.particles.push({
          pos: new THREE.Vector3(x, y, 0),
          prev: new THREE.Vector3(x, y, 0),
          pinned: false,
        })
      }
    }
  }

  _initConstraints() {
    const cols = this.segW + 1
    for (let j = 0; j <= this.segH; j++) {
      for (let i = 0; i <= this.segW; i++) {
        const idx = j * cols + i
        // Structural
        if (i < this.segW) this._addConstraint(idx, idx + 1)
        if (j < this.segH) this._addConstraint(idx, idx + cols)
        // Shear
        if (i < this.segW && j < this.segH) {
          this._addConstraint(idx, idx + cols + 1)
          this._addConstraint(idx + 1, idx + cols)
        }
        // Bend (skip one — prevents folding)
        if (i < this.segW - 1) this._addConstraint(idx, idx + 2)
        if (j < this.segH - 1) this._addConstraint(idx, idx + 2 * cols)
      }
    }
  }

  _addConstraint(a, b) {
    const restLen = this.particles[a].pos.distanceTo(this.particles[b].pos)
    this.constraints.push({ a, b, restLen })
  }

  setWind(strength, time) {
    // Multi-frequency oscillation (periods from extraction: 12000/5000/8000ms)
    const t = time * 1000
    this.wind.set(
      Math.cos(t / 12000) * strength,
      Math.sin(t / 5000) * strength * 0.3,
      Math.cos(t / 8000) * strength * 0.7
    )
  }

  step(dt) {
    const dtSq = dt * dt
    // Verlet integration
    for (const p of this.particles) {
      if (p.pinned) continue
      const temp = p.pos.clone()
      const vel = p.pos.clone().sub(p.prev).multiplyScalar(this.dampening)
      p.pos.add(vel)
      p.pos.addScaledVector(this.gravity, dtSq)
      p.pos.addScaledVector(this.wind, dtSq)
      p.prev.copy(temp)
    }
    // Jakobsen constraint solving — 15 iterations for paper
    for (let iter = 0; iter < 15; iter++) {
      for (const c of this.constraints) {
        const pa = this.particles[c.a]
        const pb = this.particles[c.b]
        const delta = pb.pos.clone().sub(pa.pos)
        const dist = delta.length()
        if (dist === 0) continue
        const diff = (dist - c.restLen) / dist * this.stiffness
        delta.multiplyScalar(diff * 0.5)
        if (!pa.pinned) pa.pos.add(delta)
        if (!pb.pinned) pb.pos.sub(delta)
      }
    }
  }

  updateGeometry(geometry) {
    const positions = geometry.attributes.position.array
    for (let i = 0; i < this.particles.length; i++) {
      positions[i * 3] = this.particles[i].pos.x
      positions[i * 3 + 1] = this.particles[i].pos.y
      positions[i * 3 + 2] = this.particles[i].pos.z
    }
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
  }
}
