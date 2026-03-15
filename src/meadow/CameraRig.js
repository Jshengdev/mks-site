// CameraRig — Spline camera path driven by scroll progress
// Accepts config from environment definitions for per-world camera behavior
import * as THREE from 'three'
import { getTerrainHeight as defaultGetTerrainHeight } from './TerrainPlane.js'

// Default control points (golden meadow S-curve)
const DEFAULT_CONTROL_POINTS = [
  [0, 0, 0],
  [6, 0, -25],
  [-4, 0, -50],
  [8, 0, -75],
  [-6, 0, -100],
  [4, 0, -130],
  [0, 0, -160],
]

export default class CameraRig {
  constructor(camera, config = {}, getTerrainHeight) {
    this.camera = camera
    this.currentT = 0
    this.targetT = 0
    this.heightOffset = config.heightOffset ?? 1.5
    this.lerpFactor = 1 / (20 * (config.dampingFactor ?? 2)) // lower damping = faster response
    this.baseFov = config.fov ?? camera.fov
    this.currentFov = this.baseFov
    camera.fov = this.baseFov
    camera.updateProjectionMatrix()
    this.fovMaxBoost = 20
    this.fovLerpBack = 0.04

    // Per-world terrain height function
    this._getTerrainHeight = getTerrainHeight ?? defaultGetTerrainHeight

    // Camera shake (storm field etc)
    this._shake = config.shake ?? null

    this._cachedPos = new THREE.Vector3()
    this._lookTarget = new THREE.Vector3()

    // Mouse parallax (ThreeDOF "Eyes" layer from L14)
    this._mouseTarget = { x: 0, y: 0 }
    this._mouseCurrent = { x: 0, y: 0 }
    this._panFactor = Math.PI / 20
    this._onMouseMove = (e) => {
      this._mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
      this._mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', this._onMouseMove)

    // Build spline from config control points (Y computed dynamically from terrain)
    const points = config.controlPoints ?? DEFAULT_CONTROL_POINTS
    this.curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(p[0], p[1], p[2]))
    )
  }

  update(scrollProgress, scrollVelocity = 0) {
    this.targetT = scrollProgress
    this.currentT += (this.targetT - this.currentT) * this.lerpFactor

    this.curve.getPoint(this.currentT, this._cachedPos)
    this._cachedPos.y = this._getTerrainHeight(this._cachedPos.x, this._cachedPos.z) + this.heightOffset

    this.curve.getPoint(Math.min(this.currentT + 0.01, 1.0), this._lookTarget)
    this._lookTarget.y = this._getTerrainHeight(this._lookTarget.x, this._lookTarget.z) + this.heightOffset

    this.camera.position.copy(this._cachedPos)
    this.camera.lookAt(this._lookTarget)

    this._mouseCurrent.x += (this._mouseTarget.x - this._mouseCurrent.x) * 0.05
    this._mouseCurrent.y += (this._mouseTarget.y - this._mouseCurrent.y) * 0.05
    this.camera.rotation.y += this._mouseCurrent.x * this._panFactor
    this.camera.rotation.x += this._mouseCurrent.y * this._panFactor * 0.5

    // Camera shake (storm field etc)
    if (this._shake?.enabled) {
      const t = performance.now() * 0.001
      const amp = this._shake.amplitude * Math.min(1, Math.abs(scrollVelocity) * 2 + 0.3)
      this.camera.rotation.z += Math.sin(t * this._shake.frequency) * amp
      this.camera.rotation.x += Math.cos(t * this._shake.frequency * 0.7) * amp * 0.5
    }

    const speed = Math.abs(scrollVelocity)
    const targetFov = this.baseFov + Math.min(speed * 8, this.fovMaxBoost)
    this.currentFov += (targetFov - this.currentFov) * this.fovLerpBack
    this.camera.fov = this.currentFov
    this.camera.updateProjectionMatrix()
  }

  getPosition() {
    return this._cachedPos
  }

  getCurrentT() {
    return this.currentT
  }

  dispose() {
    window.removeEventListener('mousemove', this._onMouseMove)
  }
}
