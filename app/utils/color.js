// Color utilities shared across client and server

export const hexToRgb = (hex) => {
  if (!hex) return { r: 255, g: 255, b: 255 }
  const v = hex.replace('#', '')
  const r = parseInt(v.substr(0, 2), 16)
  const g = parseInt(v.substr(2, 2), 16)
  const b = parseInt(v.substr(4, 2), 16)
  return { r, g, b }
}

export const hslToHex = (h, s, l) => {
  // h in degrees, s/l as percentage (0..100)
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export const hexToHsl = (hex) => {
  if (!hex) hex = '#000000'
  const v = hex.replace('#', '')
  const r = parseInt(v.substr(0, 2), 16) / 255
  const g = parseInt(v.substr(2, 2), 16) / 255
  const b = parseInt(v.substr(4, 2), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { hue: h * 360, saturation: s || 0, brightness: l, alpha: 1 }
}

export const hexToHslInit = (hex) => hexToHsl(hex)

export const extractColorValue = (value, defaultValue) => {
  if (value == null) return defaultValue
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    if (
      value.hue !== undefined &&
      value.saturation !== undefined &&
      value.brightness !== undefined
    ) {
      const h = value.hue
      const s = value.saturation * 100
      const l = value.brightness * 100
      return hslToHex(h, s, l)
    }
    return value.hex || value.value || value.color || defaultValue
  }
  return String(value) || defaultValue
}


