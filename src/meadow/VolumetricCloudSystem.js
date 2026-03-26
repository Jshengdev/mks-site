// VolumetricCloudSystem.js — Half-res ray-marched volumetric cumulus clouds
// Winner: volumetric-cumulus-3d-noise (49/70) from takram/three-clouds + Schneider GDC 2015
// Renders to half-res FBO, composited via CloudCompositeEffect in PostProcessingStack
import * as THREE from 'three'
import { generate3DNoiseTexture } from './NoiseGenerator3D.js'
import cloudVertSrc from './shaders/cloud-march.vert.glsl?raw'
import cloudFragSrc from './shaders/cloud-march.frag.glsl?raw'

// Reusable matrix objects — no per-frame allocations
const _invProjection = new THREE.Matrix4()
const _invView = new THREE.Matrix4()

export default class VolumetricCloudSystem {
  constructor(renderer, camera, config = {}) {
    this.renderer = renderer
    this.camera = camera

    // Winner magic values (from volumetric-cumulus-3d-noise.md)
    this.cloudBottom = config.cloudBottom ?? 3.0
    this.cloudTop = config.cloudTop ?? 18.0
    this.coverage = config.coverage ?? 0.75
    this.densityScale = config.densityScale ?? 0.6

    // Generate 3D noise texture (128^3 — ~3-5s one-time cost)
    this.noiseTexture = generate3DNoiseTexture(128)

    // Half-res cloud FBO (4x fewer fragments for ray-marching)
    const size = renderer.getSize(new THREE.Vector2())
    const halfW = Math.floor(size.x * 0.5)
    const halfH = Math.floor(size.y * 0.5)
    this.cloudFBO = new THREE.WebGLRenderTarget(halfW, halfH, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })

    // Fullscreen quad scene for cloud rendering
    this.cloudScene = new THREE.Scene()
    this.fsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: cloudVertSrc,
      fragmentShader: cloudFragSrc,
      uniforms: {
        uNoiseTexture: { value: this.noiseTexture },
        uCloudBottom: { value: this.cloudBottom },
        uCloudTop: { value: this.cloudTop },
        uCoverage: { value: this.coverage },
        uDensityScale: { value: this.densityScale },
        uSunDirection: { value: new THREE.Vector3(0.3, 0.5, -0.4).normalize() },
        uSunColor: { value: new THREE.Color(0.25, 0.25, 0.30) },
        uAmbientColor: { value: new THREE.Color(0.06, 0.06, 0.08) },
        uCameraPosition: { value: new THREE.Vector3() },
        uTime: { value: 0 },
        uInvProjection: { value: new THREE.Matrix4() },
        uInvView: { value: new THREE.Matrix4() },
      },
      depthWrite: false,
      depthTest: false,
    })

    this.quadGeometry = new THREE.PlaneGeometry(2, 2)
    const quad = new THREE.Mesh(this.quadGeometry, this.material)
    quad.frustumCulled = false
    this.cloudScene.add(quad)
  }

  // ─── Atmosphere-driven setters ───
  setCoverage(v) { this.material.uniforms.uCoverage.value = v }
  setDensityScale(v) { this.material.uniforms.uDensityScale.value = v }
  setCloudBottom(v) { this.material.uniforms.uCloudBottom.value = v }
  setCloudTop(v) { this.material.uniforms.uCloudTop.value = v }
  setSunDirection(dir) { this.material.uniforms.uSunDirection.value.copy(dir).normalize() }
  setSunColor(r, g, b) { this.material.uniforms.uSunColor.value.setRGB(r, g, b) }
  setAmbientColor(r, g, b) { this.material.uniforms.uAmbientColor.value.setRGB(r, g, b) }

  // Render clouds to half-res FBO. Returns the FBO texture for compositing.
  render(elapsed) {
    const u = this.material.uniforms
    u.uTime.value = elapsed
    u.uCameraPosition.value.copy(this.camera.position)

    // Update inverse matrices for ray reconstruction
    _invProjection.copy(this.camera.projectionMatrix).invert()
    _invView.copy(this.camera.matrixWorld)
    u.uInvProjection.value.copy(_invProjection)
    u.uInvView.value.copy(_invView)

    // Render to half-res FBO
    const prevTarget = this.renderer.getRenderTarget()
    this.renderer.setRenderTarget(this.cloudFBO)
    this.renderer.clear()
    this.renderer.render(this.cloudScene, this.fsCamera)
    this.renderer.setRenderTarget(prevTarget)

    return this.cloudFBO.texture
  }

  setSize(width, height) {
    const halfW = Math.floor(width * 0.5)
    const halfH = Math.floor(height * 0.5)
    this.cloudFBO.setSize(halfW, halfH)
  }

  dispose() {
    if (this.quadGeometry) this.quadGeometry.dispose()
    this.cloudFBO.dispose()
    this.noiseTexture.dispose()
    this.material.dispose()
  }
}
