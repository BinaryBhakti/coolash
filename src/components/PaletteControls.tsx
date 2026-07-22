import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle, Download, Share2, Undo2, Redo2, SlidersHorizontal, Eye, RotateCcw } from 'lucide-react';
import chroma from 'chroma-js';
import { ColorFormat } from '@/utils/colorUtils';
import { CvdType, CVD_TYPES } from '@/utils/colorblind';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';

interface PaletteControlsProps {
  colors: string[];
  onGenerate: () => void;
  onExport: () => void;
  activeFormat: ColorFormat;
  setActiveFormat: (format: ColorFormat) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onColorsChange: (next: string[]) => void;
  cvd: CvdType;
  setCvd: (t: CvdType) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Adjust the whole palette relative to a base captured when the panel opens
const AdjustAll = ({ colors, onColorsChange }: { colors: string[]; onColorsChange: (n: string[]) => void }) => {
  const [base, setBase] = useState<string[]>(colors);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(100);
  const [light, setLight] = useState(0);
  const [temp, setTemp] = useState(0);

  const apply = (h: number, s: number, l: number, t: number) => {
    const next = base.map((c) => {
      let x = chroma(c);
      const bh = x.get('hsl.h');
      if (!Number.isNaN(bh)) x = x.set('hsl.h', ((bh + h) % 360 + 360) % 360);
      x = x.set('hsl.s', clamp(x.get('hsl.s') * (s / 100), 0, 1));
      x = x.set('hsl.l', clamp(x.get('hsl.l') + l / 100, 0, 1));
      if (t > 0) x = chroma.mix(x, '#ff9500', (t / 100) * 0.3, 'lab');
      else if (t < 0) x = chroma.mix(x, '#0a84ff', (-t / 100) * 0.3, 'lab');
      return x.hex();
    });
    onColorsChange(next);
  };

  const reset = () => { setHue(0); setSat(100); setLight(0); setTemp(0); onColorsChange(base); };

  const row = (label: string, value: number, val: number, min: number, max: number, set: (n: number) => void, fmt: (n: number) => string) => (
    <div className="space-y-2">
      <label className="text-xs font-medium flex justify-between"><span>{label}</span><span>{fmt(val)}</span></label>
      <Slider value={[value]} min={min} max={max} step={1} onValueChange={([v]) => set(v)} />
    </div>
  );

  return (
    <Popover onOpenChange={(o) => { if (o) { setBase(colors); setHue(0); setSat(100); setLight(0); setTemp(0); } }}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-white/20 whitespace-nowrap">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Adjust</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-72 space-y-4">
        {row('Hue', hue, hue, -180, 180, (v) => { setHue(v); apply(v, sat, light, temp); }, (n) => `${n > 0 ? '+' : ''}${n}°`)}
        {row('Saturation', sat, sat, 0, 200, (v) => { setSat(v); apply(hue, v, light, temp); }, (n) => `${n}%`)}
        {row('Brightness', light, light, -100, 100, (v) => { setLight(v); apply(hue, sat, v, temp); }, (n) => `${n > 0 ? '+' : ''}${n}`)}
        {row('Temperature', temp, temp, -100, 100, (v) => { setTemp(v); apply(hue, sat, light, v); }, (n) => n > 0 ? `warm ${n}` : n < 0 ? `cool ${-n}` : '0')}
        <Button variant="outline" size="sm" className="w-full" onClick={reset}>
          <RotateCcw className="mr-2 h-3.5 w-3.5" /> Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const PaletteControls = ({
  colors, onGenerate, onExport, activeFormat, setActiveFormat,
  onUndo, onRedo, canUndo, canRedo, onColorsChange, cvd, setCvd,
}: PaletteControlsProps) => {
  const isMobile = useIsMobile();

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Palette link copied!');
  };

  const Divider = () => <div className="h-6 w-px bg-white/20 shrink-0" />;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-950/70 backdrop-blur-md border border-white/10 text-white rounded-full px-3 sm:px-5 py-2.5 flex items-center gap-1.5 sm:gap-3 z-10 max-w-[96vw] overflow-x-auto">
      <Button variant="ghost" size={isMobile ? 'icon' : 'sm'} onClick={onGenerate} className="flex items-center gap-2 hover:bg-white/20 whitespace-nowrap">
        <Shuffle className="h-4 w-4" />
        <span className={isMobile ? 'sr-only' : ''}>Generate</span>
        {!isMobile && <kbd className="bg-black/30 px-2 py-0.5 text-xs rounded">Space</kbd>}
      </Button>

      <Divider />

      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} aria-label="Undo" className="hover:bg-white/20 disabled:opacity-30">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} aria-label="Redo" className="hover:bg-white/20 disabled:opacity-30">
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      <Divider />

      <div className="flex gap-1 text-xs">
        {[ColorFormat.HEX, ColorFormat.RGB, ColorFormat.HSL].map((f) => (
          <Button
            key={f}
            variant="ghost"
            size="sm"
            className={activeFormat === f ? 'bg-white text-black hover:bg-white' : 'hover:bg-white/20'}
            onClick={() => setActiveFormat(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <Divider />

      <AdjustAll colors={colors} onColorsChange={onColorsChange} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={isMobile ? 'icon' : 'sm'} className={`flex items-center gap-2 hover:bg-white/20 whitespace-nowrap ${cvd !== 'none' ? 'text-emerald-300' : ''}`}>
            <Eye className="h-4 w-4" />
            <span className={isMobile ? 'sr-only' : ''}>Vision</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top">
          <DropdownMenuRadioGroup value={cvd} onValueChange={(v) => setCvd(v as CvdType)}>
            {CVD_TYPES.map((t) => (
              <DropdownMenuRadioItem key={t.id} value={t.id}>{t.label}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      <Button variant="ghost" size={isMobile ? 'icon' : 'sm'} onClick={onExport} className="flex items-center gap-2 hover:bg-white/20 whitespace-nowrap">
        <Download className="h-4 w-4" />
        <span className={isMobile ? 'sr-only' : ''}>Export</span>
      </Button>

      <Button variant="ghost" size={isMobile ? 'icon' : 'sm'} onClick={share} className="flex items-center gap-2 hover:bg-white/20 whitespace-nowrap">
        <Share2 className="h-4 w-4" />
        <span className={isMobile ? 'sr-only' : ''}>Share</span>
      </Button>
    </div>
  );
};

export default PaletteControls;
