// CameraRig — S-curve spline camera path driven by scroll progress
// Taste principle: Choreographed Camera Dance (CatmullRomCurve3 with lookAt ahead)
import * as THREE from 'three'
import { getTerrainHeight } from './TerrainPlane.js'

const CAM_HEIGHT_ABOVE_TERRAIN = 1.5

export default class CameraRig {
  constructor(camera) {
    this.camera = camera
    this.currentT = 0
    this.targetT = 0
    this.lerpFactor = 0.05 // heavy damping (floaty contemplativeness)

    // S-curve control points (world space, Z is forward into the meadow)
    // Y values are offsets above terrain — actual Y computed dynamically
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(6, 0, -25),
      new THREE.Vector3(-4, 0, -50),
      new THREE.Vector3(8, 0, -75),
      new THREE.Vector3(-6, 0, -100),
      new THREE.Vector3(4, 0, -130),
      new THREE.Vector3(0, 0, -160),
    ])
  }

  update(scrollProgress) {
    this.targetT = scrollProgress
    this.currentT += (this.targetT - this.currentT) * this.lerpFactor

    const pos = this.curve.getPoint(this.currentT)
    pos.y = getTerrainHeight(pos.x, pos.z) + CAM_HEIGHT_ABOVE_TERRAIN

    const lookTarget = this.curve.getPoint(Math.min(this.currentT + 0.01, 1.0))
    lookTarget.y = getTerrainHeight(lookTarget.x, lookTarget.z) + CAM_HEIGHT_ABOVE_TERRAIN

    this.camera.position.copy(pos)
    this.camera.lookAt(lookTarget)
  }

  getPosition() {
    const pos = this.curve.getPoint(this.currentT)
    pos.y = getTerrainHeight(pos.x, pos.z) + CAM_HEIGHT_ABOVE_TERRAIN
    return pos
  }

  getCurrentT() {
    return this.currentT
  }
}
