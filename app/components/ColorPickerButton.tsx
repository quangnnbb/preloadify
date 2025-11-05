import { useState } from "react";
import ColorPickerModal from "./ColorPickerModal";

// Helper function to extract color value from Polaris ColorPicker
const extractColorValue = (value, defaultValue) => {
  if (!value) return defaultValue;
  
  // If it's already a string, return it
  if (typeof value === 'string') return value;
  
  // If it's an object (from Polaris ColorPicker), convert HSL to hex
  if (typeof value === 'object' && value !== null) {
    // Check if it has HSL properties (Polaris ColorPicker format)
    if (value.hue !== undefined && value.saturation !== undefined && value.brightness !== undefined) {
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

export default function ColorPickerButton({ 
  title, 
  color, 
  onChange
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentColor = extractColorValue(color, '#ffffff');
  const borderColor = currentColor === '#ffffff' ? '#8c9196' : currentColor;

  return (
    <>
      <s-stack gap="small-200">
        <s-text>{title}</s-text>
        <div
          style={{
            width: '36px',
            height: '36px',
            border: `2px dashed ${borderColor}`,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: currentColor
          }}
          onClick={() => setIsModalOpen(true)}
        >
          {currentColor == '#ffffff' && (
            <s-icon type="color"/>
          )}
        </div>
      </s-stack>

      <ColorPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        color={color}
        onChange={onChange}
        title={title}
      />
    </>
  );
}
