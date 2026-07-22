import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, Image, FileCode } from 'lucide-react';
import chroma from 'chroma-js';
import { paletteToSlug } from '@/utils/colorUtils';
import { nearestColorName } from '@/utils/colorNames';
import { toast } from '@/components/ui/sonner';

interface ExportPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  colors: string[];
}

type Fmt = 'URL' | 'CSS' | 'SCSS' | 'Tailwind' | 'JSON' | 'Array';
const FORMATS: Fmt[] = ['URL', 'CSS', 'SCSS', 'Tailwind', 'JSON', 'Array'];

const slugName = (hex: string, i: number) =>
  nearestColorName(hex).toLowerCase().replace(/\s+/g, '-') + '-' + (i + 1);

const build = (colors: string[], fmt: Fmt): string => {
  const hexes = colors.map(c => chroma(c).hex());
  switch (fmt) {
    case 'URL':
      return `${window.location.origin}/palette/${paletteToSlug(hexes)}`;
    case 'CSS':
      return `:root {\n${hexes.map((c, i) => `  --${slugName(c, i)}: ${c};`).join('\n')}\n}`;
    case 'SCSS':
      return hexes.map((c, i) => `$${slugName(c, i)}: ${c};`).join('\n');
    case 'Tailwind':
      return `// tailwind.config — theme.extend.colors\n{\n${hexes.map((c, i) => `  '${slugName(c, i)}': '${c}',`).join('\n')}\n}`;
    case 'JSON':
      return JSON.stringify(hexes, null, 2);
    case 'Array':
      return `[${hexes.map(c => `"${c}"`).join(', ')}]`;
  }
};

const download = (name: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const ExportPalette = ({ open, setOpen, colors }: ExportPaletteProps) => {
  const [fmt, setFmt] = useState<Fmt>('CSS');
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => (colors.length ? build(colors, fmt) : ''), [colors, fmt]);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`Copied as ${fmt}`);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadPng = () => {
    const w = 1200, h = 400;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cw = w / colors.length;
    colors.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(i * cw, 0, Math.ceil(cw), h); });
    canvas.toBlob((blob) => { if (blob) download('coolash-palette.png', blob); toast.success('PNG downloaded'); });
  };

  const downloadSvg = () => {
    const w = 1200, h = 400;
    const cw = w / colors.length;
    const rects = colors.map((c, i) => `<rect x="${i * cw}" y="0" width="${cw}" height="${h}" fill="${chroma(c).hex()}"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${rects}</svg>`;
    download('coolash-palette.svg', new Blob([svg], { type: 'image/svg+xml' }));
    toast.success('SVG downloaded');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export palette</DialogTitle>
          <DialogDescription>Copy in any format, or download an image.</DialogDescription>
        </DialogHeader>

        {/* Preview */}
        <div className="flex h-12 overflow-hidden rounded-lg border">
          {colors.map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c }} title={chroma(c).hex()} />
          ))}
        </div>

        {/* Format tabs */}
        <div className="flex flex-wrap gap-1.5">
          {FORMATS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={fmt === f ? 'default' : 'outline'}
              onClick={() => setFmt(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Code */}
        <div className="relative">
          <pre className="max-h-56 overflow-auto rounded-lg bg-muted p-4 pr-12 font-mono text-xs leading-relaxed">{code}</pre>
          <button
            onClick={copy}
            aria-label="Copy"
            className="absolute right-2 top-2 rounded-md border bg-background p-2 hover:bg-accent"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Downloads */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={downloadPng}>
            <Image className="mr-2 h-4 w-4" /> PNG
          </Button>
          <Button variant="outline" className="flex-1" onClick={downloadSvg}>
            <FileCode className="mr-2 h-4 w-4" /> SVG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPalette;
