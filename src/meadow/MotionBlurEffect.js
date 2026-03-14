// src/meadow/MotionBlurEffect.js
// Camera-only motion blur — matrix delta approach
// Stolen from L10 + realism-effects (Wagner simplified)
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const fragment = `
uniform mat4 uPrevViewProj;
uniform mat4 uCurrViewProjInv;
uniform float uVelocityScale;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Reconstruct approximate world position from UV + assumed depth
  vec4 clipPos = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
  vec4 worldPos = uCurrViewProjInv * clipPos;
  worldPos /= worldPos.w;

  // Reproject to previous frame
  vec4 prevClip = uPrevViewProj * worldPos;
  prevClip /= prevClip.w;
  vec2 prevUV = prevClip.xy * 0.5 + 0.5;

  // Screen-space velocity
  vec2 velocity = (uv - prevUV) * uVelocityScale;

  // Skip if static (stolen from realism-effects: threshold 1e-10)
  if (dot(velocity, velocity) < 1e-10) {
    outputColor = inputColor;
    return;
  }

  // John Chapman centered sampling (stolen from L10)
  // 8 samples along motion direction
  vec4 result = vec4(0.0);
  vec2 startUv = uv - velocity * 0.5;
  vec2 stepUv = velocity / 8.0;
  for (int i = 0; i < 8; i++) {
    result += texture2D(inputBuffer, startUv + stepUv * float(i));
  }
  outputColor = result / 8.0;
}
`

export class MotionBlurEffect extends Effect {
  constructor() {
    super('MotionBlurEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uPrevViewProj', { value: new THREE.Matrix4() }],
        ['uCurrViewProjInv', { value: new THREE.Matrix4() }],
        ['uVelocityScale', { value: 1.0 }],
      ]),
    })
    this._prevViewProj = new THREE.Matrix4()
    this._currViewProj = new THREE.Matrix4()
    this._hasPrevFrame = false
  }

  update(renderer, inputBuffer, deltaTime) {
    const camera = renderer._camera || this.camera
    if (!camera) return

    // Copy previous frame's matrix into uniform
    this.uniforms.get('uPrevViewProj').value.copy(this._prevViewProj)

    // Compute current view-projection
    this._currViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)

    // Inverse for world reconstruction
    this.uniforms.get('uCurrViewProjInv').value.copy(this._currViewProj).invert()

    // Cache for next frame
    this._prevViewProj.copy(this._currViewProj)

    // Frame-speed normalization (stolen from L10: (1/100) / deltaTime)
    // Zero on first frame since there's no previous matrix yet
    if (this._hasPrevFrame) {
      const frameSpeed = Math.min((1 / 100) / Math.max(deltaTime, 0.001), 3.0)
      this.uniforms.get('uVelocityScale').value = frameSpeed * 0.5
    } else {
      this.uniforms.get('uVelocityScale').value = 0.0
      this._hasPrevFrame = true
    }
  }
}
