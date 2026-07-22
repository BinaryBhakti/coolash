import React, { useState } from 'react';
import chroma from 'chroma-js';
import { Lock, Unlock, Copy, Check, SlidersHorizontal, Layers, X, GripVertical } from 'lucide-react';
import { ColorFormat, getColorInFormat, getContrastColor, getShades } from '@/utils/colorUtils';
import { nearestColorName } from '@/utils/colorNames';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';

interface ColorSwatchProps {
  color: string;
  locked: boolean;
  activeFormat: ColorFormat;
  canRemove: boolean;
  onToggleLock: () => void;
  onChange: (hex: string) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDrop: () => void;
}

const IconButton = ({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="p-2 rounded-full hover:bg-white/25 transition-colors"
  >
    {children}
  </button>
);

const ColorSwatch = ({
  color, locked, activeFormat, canRemove,
  onToggleLock, onChange, onRemove, onDragStart, onDrop,
}: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);
  const contrastColor = getContrastColor(color);
  const display = activeFormat === ColorFormat.HEX
    ? getColorInFormat(color, activeFormat).toUpperCase()
    : getColorInFormat(color, activeFormat);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getColorInFormat(color, activeFormat));
    setCopied(true);
    toast.success(`${display} copied!`);
    setTimeout(() => setCopied(false), 1500);
  };

  const hsl = chroma(color).hsl();
  const h = Number.isNaN(hsl[0]) ? 0 : hsl[0];
  const s = hsl[1];
  const l = hsl[2];
  const setHsl = (nh: number, ns: number, nl: number) => onChange(chroma.hsl(nh, ns, nl).hex());

  return (
    <div
      className="group relative flex h-full w-full flex-col items-center justify-center transition-colors duration-500"
      style={{ backgroundColor: color, color: contrastColor }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {/* Toolbar — always faintly visible on touch, full on hover */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-60 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <span
          draggable
          onDragStart={onDragStart}
          aria-label="Drag to reorder"
          className="p-2 rounded-full hover:bg-white/25 transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </span>

        <IconButton label="Copy" onClick={copyToClipboard}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </IconButton>

        {/* Adjust */}
        <Popover>
          <PopoverTrigger asChild>
            <button aria-label="Adjust color" className="p-2 rounded-full hover:bg-white/25 transition-colors">
              <SlidersHorizontal size={18} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 space-y-4" align="center">
            <div className="space-y-3">
              <label className="text-xs font-medium flex justify-between"><span>Hue</span><span>{Math.round(h)}°</span></label>
              <Slider value={[h]} min={0} max={360} step={1} onValueChange={([v]) => setHsl(v, s, l)} />
              <label className="text-xs font-medium flex justify-between"><span>Saturation</span><span>{Math.round(s * 100)}%</span></label>
              <Slider value={[s * 100]} min={0} max={100} step={1} onValueChange={([v]) => setHsl(h, v / 100, l)} />
              <label className="text-xs font-medium flex justify-between"><span>Lightness</span><span>{Math.round(l * 100)}%</span></label>
              <Slider value={[l * 100]} min={0} max={100} step={1} onValueChange={([v]) => setHsl(h, s, v / 100)} />
            </div>
            <input
              value={chroma(color).hex().toUpperCase()}
              onChange={(e) => { if (chroma.valid(e.target.value)) onChange(chroma(e.target.value).hex()); }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            />
          </PopoverContent>
        </Popover>

        {/* Shades */}
        <Popover>
          <PopoverTrigger asChild>
            <button aria-label="Shades" className="p-2 rounded-full hover:bg-white/25 transition-colors">
              <Layers size={18} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="center">
            <div className="flex flex-col overflow-hidden rounded-md">
              {getShades(color).map((shade) => (
                <button
                  key={shade}
                  onClick={() => onChange(shade)}
                  className="flex h-8 items-center justify-center text-[11px] font-mono transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: shade, color: getContrastColor(shade) }}
                >
                  {shade.toUpperCase()}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {canRemove && (
          <IconButton label="Remove color" onClick={onRemove}>
            <X size={18} />
          </IconButton>
        )}
      </div>

      {/* Value + name */}
      <button onClick={copyToClipboard} className="text-center cursor-pointer">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{display}</h2>
        <p className="text-xs opacity-70">{nearestColorName(color)}</p>
      </button>

      {/* Lock */}
      <button
        onClick={onToggleLock}
        aria-label={locked ? 'Unlock color' : 'Lock color'}
        className={`absolute left-1/2 -translate-x-1/2 bottom-[18%] p-3 rounded-full backdrop-blur-sm transition-all
          ${locked ? 'bg-white/30 opacity-100' : 'bg-white/10 opacity-60 md:opacity-0 md:group-hover:opacity-100'}`}
      >
        {locked ? <Lock size={22} /> : <Unlock size={22} />}
      </button>
    </div>
  );
};

export default ColorSwatch;
