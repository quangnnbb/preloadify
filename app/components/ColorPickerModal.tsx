import { useEffect, useRef } from "react";

// Helper function to convert hex to HSL
const hexToHsl = (hex) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    hue: h * 360,
    saturation: s,
    brightness: l,
    alpha: 1
  };
};

// Helper function to convert HSL to hex
const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Helper function to extract color value from Polaris ColorPicker
const extractColorValue = (value, defaultValue) => {
  if (!value) return defaultValue;
  
  // If it's already a string, return it
  if (typeof value === 'string') return value;
  
  // If it's an object (from Polaris ColorPicker), convert HSL to hex
  if (typeof value === 'object' && value !== null) {
    // Check if it has HSL properties (Polaris ColorPicker format)
    if (value.hue !== undefined && value.saturation !== undefined && value.brightness !== undefined) {
      const h = value.hue;
      const s = value.saturation * 100; // Convert to percentage
      const l = value.brightness * 100; // Convert to percentage
      return hslToHex(h, s, l);
    }
    
    // Fallback to other possible properties
    return value.hex || value.value || value.color || defaultValue;
  }
  
  // Fallback to string conversion
  return String(value) || defaultValue;
};

export default function ColorPickerModal({ 
  isOpen, 
  onClose, 
  color, 
  onChange, 
  title = "Color" 
}) {
  if (!isOpen) return null;

  const colorPickerRef = useRef(null);
  const textFieldRef = useRef(null);
  const modalRef = useRef(null);

  // Define a web component for the modal shell (overlay + container)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (customElements.get('sht-color-modal')) return;
    class ShtColorModal extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }
      connectedCallback() {
        this.render();
      }
      render() {
        const padding = this.getAttribute('padding') || '16px';
        const maxWidth = this.getAttribute('max-width') || '224px';
        this.shadowRoot.innerHTML = `
          <div class="sht-overlay">
            <div class="color-picker-modal" part="container">
              <slot></slot>
            </div>
          </div>
          <style>
            :host { position: absolute; }
            .sht-overlay {
              position: fixed;
              inset: 0;
              background-color: rgba(0,0,0,.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .color-picker-modal {
              background-color: white;
              border-radius: 8px;
              padding: ${padding};
              max-width: ${maxWidth};
              width: 90%;
            }
          </style>
        `;
        const overlay = this.shadowRoot.querySelector('.sht-overlay');
        if (overlay) {
          overlay.addEventListener('click', (e) => {
            // emit overlayclick when clicking outside container
            const container = this.shadowRoot.querySelector('.color-picker-modal');
            if (e.composedPath && !e.composedPath().includes(container)) {
              this.dispatchEvent(new CustomEvent('overlayclick', { bubbles: true, composed: true }));
            }
          });
        }
      }
    }
    customElements.define('sht-color-modal', ShtColorModal);
  }, []);

  // Keep the underlying web components' values in sync when color changes
  useEffect(() => {
    if (!isOpen) return;
    const picker = colorPickerRef.current;
    const input = textFieldRef.current;
    const hex = extractColorValue(color, '#ffffff');
    if (picker) {
      try { picker.value = hex; } catch {}
    }
    if (input) {
      try { input.value = hex; } catch {}
    }
  }, [isOpen, color]);

  // Bridge web component events to React handlers
  useEffect(() => {
    if (!isOpen) return;
    const picker = colorPickerRef.current;
    const input = textFieldRef.current;
    if (!picker && !input) return;

    const handlePickerChange = (e) => {
      const next = e?.currentTarget?.value ?? e?.target?.value ?? e?.detail?.value ?? e?.detail;
      if (typeof next === 'string') {
        // Reflect picker -> text field
        if (input && input.value !== next) {
          try { input.value = next; } catch {}
        }
        if (/^#[0-9A-Fa-f]{6}$/.test(next)) {
          onChange(hexToHsl(next));
        }
      }
    };

    const handleTextChange = (e) => {
      const next = e?.detail?.value ?? e?.currentTarget?.value ?? e?.target?.value;
      if (typeof next === 'string') {
        // Reflect text field -> picker
        if (picker && picker.value !== next) {
          try { picker.value = next; } catch {}
        }
        if (/^#[0-9A-Fa-f]{6}$/.test(next)) {
          onChange(hexToHsl(next));
        }
      }
    };

    picker?.addEventListener('change', handlePickerChange);
    picker?.addEventListener('input', handlePickerChange);
    input?.addEventListener('change', handleTextChange);
    input?.addEventListener('input', handleTextChange);

    return () => {
      picker?.removeEventListener('change', handlePickerChange);
      picker?.removeEventListener('input', handlePickerChange);
      input?.removeEventListener('change', handleTextChange);
      input?.removeEventListener('input', handleTextChange);
    };
  }, [isOpen, onChange]);

  // Close on overlay click from the web component
  useEffect(() => {
    if (!isOpen) return;
    const modalEl = modalRef.current;
    if (!modalEl) return;
    const handler = () => onClose();
    modalEl.addEventListener('overlayclick', handler);
    return () => modalEl.removeEventListener('overlayclick', handler);
  }, [isOpen, onClose]);

  return (
    <sht-color-modal ref={modalRef} padding="16px" max-width="224px">
      <s-stack gap="large">
        <s-color-picker ref={colorPickerRef} alpha />
        <s-text-field ref={textFieldRef} type="text" placeholder="#000000" />
      </s-stack>
    </sht-color-modal>
  );
}
