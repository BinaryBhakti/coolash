import React, { useState } from 'react';
import chroma from 'chroma-js';
import { Lock, Unlock, Copy, Check, SlidersHorizontal, Layers, X, ArrowLeftRight, Info } from 'lucide-react';
import { ColorFormat, getColorInFormat, getContrastColor, getShades } from '@/utils/colorUtils';
import { nearestColorName } from '@/utils/colorNames';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/sonner';

interface ColorSwatchProps {
  color: string;
  displayColor?: string; // simulated (colorblind) color used for the visible fill
  locked: boolean;
  activeFormat: ColorFormat;
  canRemove: boolean;
  onToggleLock: () => void;
  onChange: (hex: string) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDrop: () => void;
}

// One round icon button in the vertical toolbar
const ToolBtn = React.forwardRef<HTMLButtonElement, {
  label: string; onClick?: () => void; children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>>(({ label, onClick, children, ...rest }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    aria-label={label}
    title={label}
    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/25 transition-colors"
    {...rest}
  >
    {children}
  </button>
));
ToolBtn.displayName = 'ToolBtn';

const ColorSwatch = ({
  color, displayColor, locked, activeFormat, canRemove,
  onToggleLock, onChange, onRemove, onDragStart, onDrop,
}: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);
  const fill = displayColor ?? color;
  const contrastColor = getContrastColor(fill);
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

  const cmyk = chroma(color).cmyk().map(v => Math.round(v * 100));

  return (
    <div
      className="group relative flex h-full w-full flex-col items-center justify-center transition-colors duration-500"
      style={{ backgroundColor: fill, color: contrastColor }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {/* Vertical toolbar — centered on the column (clear of the fixed header).
          Always visible on touch; reveals on hover on desktop. */}
      <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        {canRemove && (
          <ToolBtn label="Remove" onClick={onRemove}><X size={18} /></ToolBtn>
        )}

        {/* Shades */}
        <Popover>
          <PopoverTrigger asChild>
            <ToolBtn label="Shades"><Layers size={18} /></ToolBtn>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-40 p-2">
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

        <ToolBtn label="Copy" onClick={copyToClipboard}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </ToolBtn>

        {/* Adjust */}
        <Popover>
          <PopoverTrigger asChild>
            <ToolBtn label="Adjust"><SlidersHorizontal size={18} /></ToolBtn>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-64 space-y-4">
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

        {/* Drag to reorder */}
        <span
          draggable
          onDragStart={onDragStart}
          aria-label="Drag to reorder"
          title="Drag to reorder"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/25 transition-colors cursor-grab active:cursor-grabbing"
        >
          <ArrowLeftRight size={18} />
        </span>

        {/* Info / conversions */}
        <Popover>
          <PopoverTrigger asChild>
            <ToolBtn label="Info"><Info size={18} /></ToolBtn>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-56 space-y-2 text-sm">
            <p className="font-semibold">{nearestColorName(color)}</p>
            <dl className="space-y-1 font-mono text-xs">
              <div className="flex justify-between"><dt className="text-muted-foreground">HEX</dt><dd>{chroma(color).hex().toUpperCase()}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">RGB</dt><dd>{chroma(color).rgb().join(', ')}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">HSL</dt><dd>{chroma(color).hsl().slice(0, 3).map((v, i) => i === 0 ? Math.round(v || 0) : Math.round(v * 100) + '%').join(', ')}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">CMYK</dt><dd>{cmyk.join(', ')}</dd></div>
            </dl>
          </PopoverContent>
        </Popover>

        <ToolBtn label={locked ? 'Unlock' : 'Lock'} onClick={onToggleLock}>
          {locked ? <Lock size={18} /> : <Unlock size={18} />}
        </ToolBtn>
      </div>

      {/* Persistent lock indicator when the toolbar is hidden (desktop, not hovering) */}
      {locked && (
        <button
          onClick={onToggleLock}
          aria-label="Unlock color"
          className="absolute left-1/2 top-[62%] -translate-x-1/2 hidden h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-opacity md:flex md:group-hover:opacity-0"
        >
          <Lock size={20} />
        </button>
      )}

      {/* Value + name */}
      <button onClick={copyToClipboard} className="absolute bottom-[16%] left-1/2 -translate-x-1/2 text-center cursor-pointer">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{display}</h2>
        <p className="text-xs opacity-70">{nearestColorName(color)}</p>
      </button>
    </div>
  );
};

export default ColorSwatch;
