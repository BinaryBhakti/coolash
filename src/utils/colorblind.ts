import chroma from 'chroma-js';

// ponytail: classic approximate CVD matrices applied in sRGB. Good enough for a
// "how will this read" preview. Upgrade path: Machado/Brettel in linear light if
// clinical accuracy is ever needed.
export type CvdType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

const MATRICES: Record<Exclude<CvdType, 'none' | 'achromatopsia'>, number[][]> = {
  protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
  deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
  tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
};

export const CVD_TYPES: { id: CvdType; label: string }[] = [
  { id: 'none', label: 'Normal vision' },
  { id: 'protanopia', label: 'Protanopia (red-blind)' },
  { id: 'deuteranopia', label: 'Deuteranopia (green-blind)' },
  { id: 'tritanopia', label: 'Tritanopia (blue-blind)' },
  { id: 'achromatopsia', label: 'Achromatopsia (no color)' },
];

export const simulate = (hex: string, type: CvdType): string => {
  if (type === 'none') return hex;
  const [r, g, b] = chroma(hex).rgb();

  if (type === 'achromatopsia') {
    const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    return chroma(y, y, y).hex();
  }

  const m = MATRICES[type];
  const out = m.map(row =>
    Math.min(255, Math.max(0, Math.round(row[0] * r + row[1] * g + row[2] * b)))
  );
  return chroma(out[0], out[1], out[2]).hex();
};
