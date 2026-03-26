// TransitionRenderer — GLSL shader dissolve between environment worlds
// Adapted from gl-transitions/gl-transitions pattern (MIT license)
// Renders current + target to FBOs, blends via transition shader
import * as THREE from 'three'
import vertexShader from './shaders/transition.vert.glsl?raw'
import fragmentShader from './shaders/transition.frag.glsl?raw'

// Transition type mapping per route pair
// Key format: 'from-id:to-id' → type index
// PRD: Meadow→Ocean (fog), Meadow→Night (darkness), Meadow→Ghibli (brush),
//      Meadow→Storm (flash), Any→Meadow (reverse)
const TRANSITION_TYPES = {
  'golden-meadow:ocean-cliff': 0,     // fade through fog (white → teal)
  'golden-meadow:night-meadow': 1,    // fade through darkness
  'golden-meadow:ghibli-painterly': 2, // brush stroke dissolve
  'golden-meadow:storm-field': 3,     // lightning flash
  'ocean-cliff:golden-meadow': 0,     // reverse fog
  'night-meadow:golden-meadow': 1,    // reverse darkness
  'ghibli-painterly:golden-meadow': 2, // reverse brush
  'storm-field:golden-meadow': 3,     // reverse flash
}

// Transition colors (fog color used as intermediate)
const TRANSITION_COLORS = {
  0: new THREE.Color(0.4, 0.5, 0.6),   // fog white-teal
  1: new THREE.Color(0.02, 0.02, 0.04), // darkness
  2: new THREE.Color(0.2, 0.25, 0.18),  // painterly green
  3: new THREE.Color(1.0, 1.0, 1.0),    // lightning white
  4: new THREE.Color(0.1, 0.1, 0.1),    // default dark
}

export default class TransitionRenderer {
  constructor(renderer) {
    this.renderer = renderer
    this.isTransitioning = false
    this.progress = 0
    this.duration = 1.5 // seconds
    this._onComplete = null

    const w = window.innerWidth
    const h = window.innerHeight

    // FBOs for from/to scenes
    this.fboFrom = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
    })
    this.fboTo = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
    })

    // Full-screen quad for transition
    this._scene = new THREE.Scene()
    this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    this._material = new THREE.ShaderMaterial({
      uniforms: {
        tFrom: { value: this.fboFrom.texture },
        tTo: { value: this.fboTo.texture },
        uProgress: { value: 0 },
        uType: { value: 4 }, // default crossfade
        uColor: { value: new THREE.Color(0.1, 0.1, 0.1) },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    })

    this._quadGeometry = new THREE.PlaneGeometry(2, 2)
    const quad = new THREE.Mesh(this._quadGeometry, this._material)
    this._scene.add(quad)
  }

  // Start a transition between two environment IDs
  // fromEngine/toEngine are WorldEngine instances
  start(fromId, toId, fromEngine, toEngine, onComplete) {
    this.isTransitioning = true
    this.progress = 0
    this._fromEngine = fromEngine
    this._toEngine = toEngine
    this._onComplete = onComplete

    // Determine transition type
    const key = `${fromId}:${toId}`
    const type = TRANSITION_TYPES[key] ?? 4 // fallback to crossfade
    this._material.uniforms.uType.value = type
    this._material.uniforms.uColor.value.copy(
      TRANSITION_COLORS[type] ?? TRANSITION_COLORS[4]
    )
  }

  update(delta) {
    if (!this.isTransitioning) return false

    this.progress += delta / this.duration
    this._material.uniforms.uProgress.value = Math.min(1, this.progress)

    // Render from scene to FBO A
    if (this._fromEngine) {
      this.renderer.setRenderTarget(this.fboFrom)
      this._fromEngine.postProcessing.render(delta)
    }

    // Render to scene to FBO B
    if (this._toEngine) {
      this.renderer.setRenderTarget(this.fboTo)
      this._toEngine.postProcessing.render(delta)
    }

    // Render transition quad to screen
    this.renderer.setRenderTarget(null)
    this.renderer.render(this._scene, this._camera)

    if (this.progress >= 1) {
      this.isTransitioning = false
      this._onComplete?.()
      this._fromEngine = null
      this._toEngine = null
    }

    return true // consumed the frame
  }

  setSize(width, height) {
    this.fboFrom.setSize(width, height)
    this.fboTo.setSize(width, height)
  }

  dispose() {
    if (this._quadGeometry) this._quadGeometry.dispose()
    this.fboFrom.dispose()
    this.fboTo.dispose()
    this._material.dispose()
  }
}
