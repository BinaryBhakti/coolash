import chroma from 'chroma-js';

// ponytail: curated name set (~90 well-spaced colors) matched by perceptual deltaE.
// Good enough for a friendly label under each swatch. Upgrade path: swap in a full
// color-name dataset (e.g. the ~30k "color-name-list") if precise names matter.
const NAMES: [string, string][] = [
  ['Black', '#000000'], ['Charcoal', '#36454f'], ['Dim Gray', '#696969'],
  ['Gray', '#808080'], ['Silver', '#c0c0c0'], ['Gainsboro', '#dcdcdc'],
  ['White Smoke', '#f5f5f5'], ['White', '#ffffff'],
  ['Maroon', '#800000'], ['Dark Red', '#8b0000'], ['Firebrick', '#b22222'],
  ['Red', '#ff0000'], ['Crimson', '#dc143c'], ['Tomato', '#ff6347'],
  ['Salmon', '#fa8072'], ['Coral', '#ff7f50'], ['Indian Red', '#cd5c5c'],
  ['Chocolate', '#d2691e'], ['Sienna', '#a0522d'], ['Saddle Brown', '#8b4513'],
  ['Brown', '#a52a2a'], ['Peru', '#cd853f'], ['Tan', '#d2b48c'],
  ['Sandy Brown', '#f4a460'], ['Burlywood', '#deb887'], ['Wheat', '#f5deb3'],
  ['Dark Orange', '#ff8c00'], ['Orange', '#ffa500'], ['Goldenrod', '#daa520'],
  ['Gold', '#ffd700'], ['Khaki', '#f0e68c'], ['Dark Khaki', '#bdb76b'],
  ['Yellow', '#ffff00'], ['Olive', '#808000'], ['Olive Drab', '#6b8e23'],
  ['Yellow Green', '#9acd32'], ['Lawn Green', '#7cfc00'], ['Chartreuse', '#7fff00'],
  ['Green Yellow', '#adff2f'], ['Dark Green', '#006400'], ['Green', '#008000'],
  ['Forest Green', '#228b22'], ['Lime Green', '#32cd32'], ['Lime', '#00ff00'],
  ['Pale Green', '#98fb98'], ['Sea Green', '#2e8b57'], ['Medium Sea Green', '#3cb371'],
  ['Spring Green', '#00ff7f'], ['Mint', '#aaf0d1'], ['Teal', '#008080'],
  ['Dark Cyan', '#008b8b'], ['Light Sea Green', '#20b2aa'], ['Turquoise', '#40e0d0'],
  ['Aquamarine', '#7fffd4'], ['Cyan', '#00ffff'], ['Pale Turquoise', '#afeeee'],
  ['Cadet Blue', '#5f9ea0'], ['Steel Blue', '#4682b4'], ['Sky Blue', '#87ceeb'],
  ['Light Blue', '#add8e6'], ['Deep Sky Blue', '#00bfff'], ['Dodger Blue', '#1e90ff'],
  ['Cornflower Blue', '#6495ed'], ['Royal Blue', '#4169e1'], ['Blue', '#0000ff'],
  ['Medium Blue', '#0000cd'], ['Dark Blue', '#00008b'], ['Navy', '#000080'],
  ['Midnight Blue', '#191970'], ['Slate Blue', '#6a5acd'], ['Slate Gray', '#708090'],
  ['Indigo', '#4b0082'], ['Dark Violet', '#9400d3'], ['Blue Violet', '#8a2be2'],
  ['Medium Purple', '#9370db'], ['Purple', '#800080'], ['Dark Magenta', '#8b008b'],
  ['Magenta', '#ff00ff'], ['Orchid', '#da70d6'], ['Violet', '#ee82ee'],
  ['Plum', '#dda0dd'], ['Thistle', '#d8bfd8'], ['Lavender', '#e6e6fa'],
  ['Hot Pink', '#ff69b4'], ['Deep Pink', '#ff1493'], ['Pink', '#ffc0cb'],
  ['Light Pink', '#ffb6c1'], ['Pale Violet Red', '#db7093'], ['Rosy Brown', '#bc8f8f'],
  ['Beige', '#f5f5dc'], ['Ivory', '#fffff0'], ['Cornsilk', '#fff8dc'],
  ['Papaya Whip', '#ffefd5'], ['Misty Rose', '#ffe4e1'], ['Azure', '#f0ffff'],
];

const cache = new Map<string, string>();

export const nearestColorName = (hex: string): string => {
  const cached = cache.get(hex);
  if (cached) return cached;

  let best = NAMES[0][0];
  let bestD = Infinity;
  for (const [name, ref] of NAMES) {
    const d = chroma.deltaE(hex, ref);
    if (d < bestD) {
      bestD = d;
      best = name;
    }
  }
  cache.set(hex, best);
  return best;
};
