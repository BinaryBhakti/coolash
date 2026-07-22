import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import chroma from 'chroma-js';
import ColorSwatch from '@/components/ColorSwatch';
import PaletteControls from '@/components/PaletteControls';
import Header from '@/components/Header';
import ExportPalette from '@/components/ExportPalette';
import { ColorFormat, generateRandomPalette, paletteToSlug, slugToPalette } from '@/utils/colorUtils';

const DEFAULT_SIZE = 5;
const MIN = 2;
const MAX = 10;

const Index = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [colors, setColors] = useState<string[]>([]);
  const [locked, setLocked] = useState<boolean[]>([]);
  const [activeFormat, setActiveFormat] = useState<ColorFormat>(ColorFormat.HEX);
  const [exportOpen, setExportOpen] = useState(false);
  const history = useRef<{ colors: string[]; locked: boolean[] }[]>([]);
  const dragIndex = useRef<number | null>(null);

  // Init from URL slug, else generate a fresh palette
  useEffect(() => {
    const fromUrl = slug ? slugToPalette(slug) : null;
    const initial = fromUrl ?? generateRandomPalette(DEFAULT_SIZE);
    setColors(initial);
    setLocked(Array(initial.length).fill(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync so palettes are shareable / refresh-safe
  useEffect(() => {
    if (colors.length) navigate(`/palette/${paletteToSlug(colors)}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  const snapshot = () => history.current.push({ colors, locked });

  const generate = useCallback(() => {
    history.current.push({ colors, locked });
    const fresh = generateRandomPalette(colors.length);
    setColors(colors.map((c, i) => (locked[i] ? c : fresh[i])));
  }, [colors, locked]);

  const undo = useCallback(() => {
    const prev = history.current.pop();
    if (prev) { setColors(prev.colors); setLocked(prev.locked); }
  }, []);

  const toggleLock = (i: number) =>
    setLocked(prev => prev.map((v, idx) => (idx === i ? !v : v)));

  const setColorAt = (i: number, hex: string) => {
    snapshot();
    setColors(prev => prev.map((c, idx) => (idx === i ? hex : c)));
  };

  const removeColor = (i: number) => {
    if (colors.length <= MIN) return;
    snapshot();
    setColors(prev => prev.filter((_, idx) => idx !== i));
    setLocked(prev => prev.filter((_, idx) => idx !== i));
  };

  const addColor = (afterIndex: number) => {
    if (colors.length >= MAX) return;
    snapshot();
    const a = colors[afterIndex];
    const b = colors[afterIndex + 1] ?? colors[afterIndex];
    const mixed = chroma.mix(a, b, 0.5, 'lab').hex();
    setColors(prev => [...prev.slice(0, afterIndex + 1), mixed, ...prev.slice(afterIndex + 1)]);
    setLocked(prev => [...prev.slice(0, afterIndex + 1), false, ...prev.slice(afterIndex + 1)]);
  };

  const reorder = (to: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === to) return;
    const move = <T,>(arr: T[]) => {
      const next = [...arr];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    };
    setColors(move);
    setLocked(move);
  };

  // Keyboard: Space = generate, Ctrl/Cmd+Z = undo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.code === 'Space') { e.preventDefault(); generate(); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [generate, undo]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 flex-col pt-16 md:flex-row md:pt-0">
        {colors.map((color, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className="relative z-20 md:w-0">
                <button
                  onClick={() => addColor(index - 1)}
                  aria-label="Add color"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-zinc-900 shadow-lg transition-opacity hover:scale-105 opacity-100 md:opacity-0 md:hover:opacity-100 md:focus:opacity-100"
                >
                  <Plus size={18} />
                </button>
              </div>
            )}
            <div className="relative flex-1">
              <ColorSwatch
                color={color}
                locked={locked[index]}
                activeFormat={activeFormat}
                canRemove={colors.length > MIN}
                onToggleLock={() => toggleLock(index)}
                onChange={(hex) => setColorAt(index, hex)}
                onRemove={() => removeColor(index)}
                onDragStart={() => { dragIndex.current = index; }}
                onDrop={() => reorder(index)}
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      <PaletteControls
        onGenerate={generate}
        onExport={() => setExportOpen(true)}
        activeFormat={activeFormat}
        setActiveFormat={setActiveFormat}
      />

      <ExportPalette open={exportOpen} setOpen={setExportOpen} colors={colors} />
    </div>
  );
};

export default Index;
