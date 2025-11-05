import { useEffect } from "react"
import { loaderDefinitions } from "../shared/loaderDefinitions"
import { hexToRgb, extractColorValue } from "../utils/color"

type HslLike = { hue: number; saturation: number; brightness: number; alpha: number }
type ColorValue = string | HslLike | { hex?: string; value?: string; color?: string } | Record<string, any>
type ColorSettings = {
  background?: ColorValue
  primary?: ColorValue
  secondary?: ColorValue
}

type LoaderMap = typeof loaderDefinitions
type LoaderKey = keyof LoaderMap
const isLoaderKey = (k: string): k is LoaderKey => Object.prototype.hasOwnProperty.call(loaderDefinitions, k)

interface LoaderPreviewProps {
  type: string
  colorSettings?: ColorSettings
  speed?: "slow" | "medium" | "fast"
}

export default function LoaderPreview({
  type,
  colorSettings = {},
  speed = "medium",
}: LoaderPreviewProps) {
  const backgroundHex = extractColorValue(colorSettings.background, '#ffffff')
  const primaryHex = extractColorValue(colorSettings.primary, '#000000')
  const secondaryHex = extractColorValue(colorSettings.secondary, '#ffffff')

  const backgroundRgb = hexToRgb(backgroundHex)
  const primaryRgb = hexToRgb(primaryHex)
  const secondaryRgb = hexToRgb(secondaryHex)

  useEffect(() => {
    if (typeof window !== 'undefined' && !customElements.get('loader-preview')) {
      class LoaderPreviewComponent extends HTMLElement {
        constructor() {
          super()
          this.attachShadow({ mode: 'open' })
        }
        static get observedAttributes() {
          return ['type', 'background-r', 'background-g', 'background-b', 'primary-r', 'primary-g', 'primary-b', 'secondary-r', 'secondary-g', 'secondary-b', 'data-speed']
        }
        connectedCallback() { this.render() }
        attributeChangedCallback() { this.render() }
        render() {
          const type = this.getAttribute('type') || 'spinner'
          const backgroundR = parseInt(this.getAttribute('background-r') ?? '255') || 255
          const backgroundG = parseInt(this.getAttribute('background-g') ?? '255') || 255
          const backgroundB = parseInt(this.getAttribute('background-b') ?? '255') || 255
          const primaryR = parseInt(this.getAttribute('primary-r') ?? '0') || 0
          const primaryG = parseInt(this.getAttribute('primary-g') ?? '0') || 0
          const primaryB = parseInt(this.getAttribute('primary-b') ?? '0') || 0
          const secondaryR = parseInt(this.getAttribute('secondary-r') ?? '255') || 255
          const secondaryG = parseInt(this.getAttribute('secondary-g') ?? '255') || 255
          const secondaryB = parseInt(this.getAttribute('secondary-b') ?? '255') || 255

          const loader = (loaderDefinitions as any)[type]
          if (!loader) {
            if (!this.shadowRoot) return
            this.shadowRoot.innerHTML = '<div>Loader not found</div>'
            return
          }
          let customizedCSS = loader.css
          const primaryColor = `rgb(${primaryR}, ${primaryG}, ${primaryB})`
          const secondaryColor = `rgb(${secondaryR}, ${secondaryG}, ${secondaryB})`
          customizedCSS = customizedCSS.replace(/#000/g, primaryColor)
          customizedCSS = customizedCSS.replace(/#0070f3/g, primaryColor)
          customizedCSS = customizedCSS.replace(/#f3f3f3/g, secondaryColor)

          const speed = this.getAttribute('data-speed') || 'medium'
          const speedValue = speed === 'slow' ? '1.2s' : speed === 'fast' ? '.8s' : '1s'
          if (!this.shadowRoot) return
          this.shadowRoot.innerHTML = `
            <div class="preview-container">${loader.html}</div>
            <style>
              :host {
                display: block;
                --r: ${backgroundR};
                --g: ${backgroundG};
                --b: ${backgroundB};
                --p-r: ${primaryR};
                --p-g: ${primaryG};
                --p-b: ${primaryB};
                --s-r: ${secondaryR};
                --s-g: ${secondaryG};
                --s-b: ${secondaryB};
                --background: rgb(var(--r), var(--g), var(--b));
                --primary: rgb(var(--p-r), var(--p-g), var(--p-b));
                --secondary: rgb(var(--s-r), var(--s-g), var(--s-b));
                --speed: ${speedValue};
                padding: 5px;
              }
              .preview-container {
                padding: 20px;
                border-radius: 4px;
                min-height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgb(var(--r), var(--g), var(--b));
              }
              ${customizedCSS}
            </style>
          `
        }
      }
      customElements.define('loader-preview', LoaderPreviewComponent)
    }
  }, [])

  const safeKey: LoaderKey = isLoaderKey(type) ? type : 'pulseOrbit'
  const loader = loaderDefinitions[safeKey]

  return (
    <loader-preview
      type={safeKey}
      background-r={backgroundRgb.r}
      background-g={backgroundRgb.g}
      background-b={backgroundRgb.b}
      primary-r={primaryRgb.r}
      primary-g={primaryRgb.g}
      primary-b={primaryRgb.b}
      secondary-r={secondaryRgb.r}
      secondary-g={secondaryRgb.g}
      secondary-b={secondaryRgb.b}
      data-speed={speed}
    />
  )
}


