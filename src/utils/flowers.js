// src/utils/flowers.js

const FLOWER_TYPES = [
  { name: 'daisy',      petalCount: [10, 14], petalLen: [12, 18], petalWid: [3, 5],   hueRange: [45, 55],   sat: [5, 15],  light: [88, 96] },
  { name: 'cornflower', petalCount: [6, 8],   petalLen: [14, 20], petalWid: [5, 8],   hueRange: [220, 240], sat: [55, 75], light: [55, 70] },
  { name: 'marigold',   petalCount: [12, 18], petalLen: [8, 14],  petalWid: [4, 7],   hueRange: [30, 45],   sat: [80, 95], light: [55, 65] },
  { name: 'poppy',      petalCount: [4, 6],   petalLen: [16, 22], petalWid: [10, 15], hueRange: [5, 15],    sat: [70, 85], light: [50, 60] },
  { name: 'buttercup',  petalCount: [5, 6],   petalLen: [10, 14], petalWid: [6, 9],   hueRange: [48, 56],   sat: [85, 95], light: [58, 68] },
  { name: 'wildgrass',  petalCount: [0, 0],   petalLen: [0, 0],   petalWid: [0, 0],   hueRange: [90, 130],  sat: [30, 50], light: [35, 50] },
]

function rand(min, max) { return min + Math.random() * (max - min) }
function randInt(min, max) { return Math.floor(rand(min, max + 1)) }

export function createFlower(x, y, depthLayer) {
  const type = FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)]
  const scale = depthLayer === 0 ? rand(0.9, 1.3) :
                depthLayer === 1 ? rand(0.5, 0.8) : rand(0.2, 0.45)

  const petalCount = type.name === 'wildgrass' ? 0 : randInt(type.petalCount[0], type.petalCount[1])
  const hue = rand(type.hueRange[0], type.hueRange[1])
  const sat = rand(type.sat[0], type.sat[1])
  const light = rand(type.light[0], type.light[1])

  const petals = []
  for (let i = 0; i < petalCount; i++) {
    petals.push({
      angle: (i / petalCount) * Math.PI * 2 + rand(-0.1, 0.1),
      length: rand(type.petalLen[0], type.petalLen[1]) * scale,
      width: rand(type.petalWid[0], type.petalWid[1]) * scale,
      curve: rand(-0.2, 0.2),
    })
  }

  return {
    x, y, type: type.name, depthLayer, scale,
    hue, sat, light, petalCount, petals,
    stemHeight: rand(20, 50) * scale,
    stemCurve: rand(-0.3, 0.3),
    rotation: rand(-0.15, 0.15),
    swayPhase: rand(0, Math.PI * 2),
    swaySpeed: rand(0.3, 0.8),
    bloomState: 0, bloomTarget: 0,
    bloomDelay: 0, bloomStartTime: 0,
  }
}

export function drawFlower(ctx, flower, time, energy) {
  const { x, y, type, scale, hue, sat, light, petals,
          stemHeight, stemCurve, rotation, swayPhase, swaySpeed, bloomState } = flower

  if (bloomState < 0.01) return

  const sway = Math.sin(time * swaySpeed + swayPhase) * (3 + energy * 8) * scale
  const headX = x + sway
  const headY = y - stemHeight * bloomState

  ctx.save()

  // Stem
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.quadraticCurveTo(
    x + stemCurve * 20 * scale + sway * 0.5,
    y - stemHeight * 0.5 * bloomState,
    headX, headY
  )
  ctx.strokeStyle = `hsla(100, 40%, 30%, ${0.5 * bloomState})`
  ctx.lineWidth = Math.max(1, 1.5 * scale)
  ctx.stroke()

  if (type === 'wildgrass') {
    ctx.beginPath()
    ctx.moveTo(headX - 2 * scale, headY)
    ctx.lineTo(headX, headY - 4 * scale)
    ctx.lineTo(headX + 2 * scale, headY)
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${0.6 * bloomState})`
    ctx.fill()
    ctx.restore()
    return
  }

  ctx.translate(headX, headY)
  ctx.rotate(rotation + sway * 0.02)

  const openAmount = bloomState
  for (const petal of petals) {
    ctx.save()
    ctx.rotate(petal.angle)
    const len = petal.length * openAmount
    const wid = petal.width * openAmount
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(-wid*0.6 + petal.curve*wid, -len*0.4, -wid*0.3, -len*0.9, 0, -len)
    ctx.bezierCurveTo(wid*0.3, -len*0.9, wid*0.6 - petal.curve*wid, -len*0.4, 0, 0)
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light + energy*10}%, ${0.85 * bloomState})`
    ctx.fill()
    ctx.restore()
  }

  // Center pistil
  const centerR = Math.max(1, 3 * scale * openAmount)
  ctx.beginPath()
  ctx.arc(0, 0, centerR, 0, Math.PI * 2)
  ctx.fillStyle = `hsla(${hue + 20}, ${Math.max(0, sat - 10)}%, ${Math.min(90, light + 20)}%, ${bloomState})`
  ctx.fill()

  // Glow
  if (bloomState > 0.5) {
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, centerR * 3)
    glow.addColorStop(0, `hsla(${hue}, ${sat}%, ${light + 20}%, ${0.2 * bloomState})`)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(-centerR * 3, -centerR * 3, centerR * 6, centerR * 6)
  }

  ctx.restore()
}

export function generateFlowerField(width, height, count) {
  const flowers = []
  const distribution = [
    { layer: 0, count: Math.floor(count * 0.6), yMin: 0.55, yMax: 0.98 },
    { layer: 1, count: Math.floor(count * 0.25), yMin: 0.35, yMax: 0.65 },
    { layer: 2, count: Math.floor(count * 0.15), yMin: 0.2, yMax: 0.45 },
  ]
  for (const { layer, count: n, yMin, yMax } of distribution) {
    for (let i = 0; i < n; i++) {
      flowers.push(createFlower(rand(0, width), rand(yMin * height, yMax * height), layer))
    }
  }
  flowers.sort((a, b) => a.y - b.y)
  return flowers
}
