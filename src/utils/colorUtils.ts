import chroma from 'chroma-js';

// Generate a random hex color
export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// ponytail: heuristic "designer" generator — random base hue + a color-theory
// scheme with pleasing saturation and a light→dark lightness spread, so palettes
// look intentional instead of noise. Upgrade path: curated seed set / trained model.
const SCHEMES = ['analogous', 'monochrome', 'complement', 'triad', 'spread'] as const;

export const generateHarmoniousPalette = (count: number): string[] => {
  const baseHue = Math.random() * 360;
  const scheme = SCHEMES[Math.floor(Math.random() * SCHEMES.length)];
  const baseSat = 0.45 + Math.random() * 0.35; // 0.45–0.80

  const hueFor = (i: number): number => {
    switch (scheme) {
      case 'analogous': return baseHue + (i - (count - 1) / 2) * 25;
      case 'monochrome': return baseHue;
      case 'complement': return baseHue + (i % 2) * 180;
      case 'triad': return baseHue + (i % 3) * 120;
      default: return baseHue + (360 / count) * i; // spread
    }
  };

  return Array.from({ length: count }, (_, i) => {
    const h = ((hueFor(i) % 360) + 360) % 360;
    const s = Math.min(1, Math.max(0.15, baseSat + (Math.random() - 0.5) * 0.1));
    const l = Math.min(0.92, Math.max(0.1, 0.28 + (0.5 * (i + 0.5)) / count + (Math.random() - 0.5) * 0.08));
    return chroma.hsl(h, s, l).hex();
  });
};

// Generate an array of harmonious colors (all callers get designed palettes)
export const generateRandomPalette = (count: number): string[] => {
  return generateHarmoniousPalette(count);
};

// Encode / decode a palette in a URL slug: "#264653","#2a9d8f" -> "264653-2a9d8f"
export const paletteToSlug = (colors: string[]): string =>
  colors.map(c => c.replace('#', '').toLowerCase()).join('-');

export const slugToPalette = (slug: string): string[] | null => {
  const colors = slug.split('-').map(p => '#' + p);
  if (colors.length >= 1 && colors.every(c => chroma.valid(c))) {
    return colors.map(c => chroma(c).hex());
  }
  return null;
};

// Nine tints→shades of a color (light to dark), for the per-color shades strip
export const getShades = (color: string): string[] =>
  Array.from({ length: 9 }, (_, i) => chroma(color).set('hsl.l', (i + 1) / 10).hex());

// Convert hex to RGB
export const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

// Convert hex to HSL
export const hexToHsl = (hex: string): string => {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find min and max RGB values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

// Calculate contrast color (black or white) based on background color
export const getContrastColor = (hexColor: string): string => {
  // Remove the # if present
  const hex = hexColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Format types enum
export enum ColorFormat {
  HEX = 'HEX',
  RGB = 'RGB',
  HSL = 'HSL',
}

// Get color in specified format
export const getColorInFormat = (color: string, format: ColorFormat): string => {
  switch (format) {
    case ColorFormat.HEX:
      return color;
    case ColorFormat.RGB:
      return hexToRgb(color);
    case ColorFormat.HSL:
      return hexToHsl(color);
    default:
      return color;
  }
};
