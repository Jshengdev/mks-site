// src/meadow/GodRayPass.js
// Screen-space god rays — stolen from glsl-godrays (GPU Gems 3, Ch. 13)
import * as THREE from 'three'

const FULLSCREEN_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const RADIAL_BLUR_FRAG = `
uniform sampler2D tOcclusion;
uniform vec2 uSunScreenPos;
uniform float uDensity;
uniform float uWeight;
uniform float uDecay;
uniform float uExposure;

varying vec2 vUv;

void main() {
  // GPU Gems 3 radial blur — stolen from glsl-godrays extraction
  vec2 texCoord = vUv;
  vec2 deltaTexCoord = (texCoord - uSunScreenPos);
  // 50 samples (from extraction magic values)
  deltaTexCoord *= (1.0 / 50.0) * uDensity;

  float illuminationDecay = 1.0;
  vec3 fragColor = vec3(0.0);

  for (int i = 0; i < 50; i++) {
    texCoord -= deltaTexCoord;
    vec3 samp = texture2D(tOcclusion, clamp(texCoord, 0.0, 1.0)).rgb;
    samp *= illuminationDecay * uWeight;
    fragColor += samp;
    illuminationDecay *= uDecay;
  }

  fragColor *= uExposure;
  gl_FragColor = vec4(fragColor, 1.0);
}
`

const COMPOSITE_FRAG = `
uniform sampler2D tScene;
uniform sampler2D tGodRays;
uniform float uIntensity;

varying vec2 vUv;

void main() {
  vec3 scene = texture2D(tScene, vUv).rgb;
  vec3 rays = texture2D(tGodRays, vUv).rgb;
  gl_FragColor = vec4(scene + rays * uIntensity, 1.0);
}
`

export default class GodRayPass {
  constructor(renderer, scene, camera, sunWorldPosition) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.enabled = true
    this.intensity = 0.6

    // Magic values from glsl-godrays extraction
    this._density = 1.0
    this._weight = 0.01
    this._decay = 0.97   // warm falloff
    this._exposure = 1.0

    const w = renderer.domElement.width
    const h = renderer.domElement.height

    // Half-res FBOs (from extraction: fboScale = 0.5, 75% fill-rate savings)
    this._occlusionRT = new THREE.WebGLRenderTarget(w >> 1, h >> 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })
    this._godRayRT = new THREE.WebGLRenderTarget(w >> 1, h >> 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })

    // Sun disk for occlusion pass
    this._sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(12, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    this._sunMesh.position.copy(sunWorldPosition).multiplyScalar(400)

    // Black override material
    this._blackMat = new THREE.MeshBasicMaterial({ color: 0x000000 })

    // Fullscreen quad scene
    this._quadGeo = new THREE.PlaneGeometry(2, 2)
    this._blurMat = new THREE.ShaderMaterial({
      vertexShader: FULLSCREEN_VERT,
      fragmentShader: RADIAL_BLUR_FRAG,
      uniforms: {
        tOcclusion: { value: this._occlusionRT.texture },
        uSunScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
        uDensity: { value: this._density },
        uWeight: { value: this._weight },
        uDecay: { value: this._decay },
        uExposure: { value: this._exposure },
      },
    })
    this._blurQuad = new THREE.Mesh(this._quadGeo, this._blurMat)
    this._quadScene = new THREE.Scene()
    this._quadScene.add(this._blurQuad)
    this._quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    this._screenPos = new THREE.Vector3()
  }

  updateSunPosition(sunDir) {
    // sunDir is a unit vector from AtmosphereController
    this._sunMesh.position.copy(sunDir).multiplyScalar(400)

    // Project to screen space
    this._screenPos.copy(this._sunMesh.position).project(this.camera)
    this._blurMat.uniforms.uSunScreenPos.value.set(
      (this._screenPos.x + 1) * 0.5,
      (this._screenPos.y + 1) * 0.5
    )
  }

  render() {
    if (!this.enabled || this.intensity < 0.01) return null

    const renderer = this.renderer

    // Pass 1: Occlusion — sun white, scene black
    const origOverride = this.scene.overrideMaterial
    this.scene.overrideMaterial = this._blackMat
    this.scene.add(this._sunMesh)

    renderer.setRenderTarget(this._occlusionRT)
    renderer.clear()
    renderer.render(this.scene, this.camera)

    this.scene.remove(this._sunMesh)
    this.scene.overrideMaterial = origOverride

    // Pass 2: Radial blur
    renderer.setRenderTarget(this._godRayRT)
    renderer.clear()
    renderer.render(this._quadScene, this._quadCamera)

    renderer.setRenderTarget(null)
    return this._godRayRT.texture
  }

  setSize(w, h) {
    this._occlusionRT.setSize(w >> 1, h >> 1)
    this._godRayRT.setSize(w >> 1, h >> 1)
  }

  dispose() {
    this._occlusionRT.dispose()
    this._godRayRT.dispose()
    this._sunMesh.geometry.dispose()
    this._sunMesh.material.dispose()
    this._blackMat.dispose()
    this._blurMat.dispose()
    this._quadGeo.dispose()
  }
}
