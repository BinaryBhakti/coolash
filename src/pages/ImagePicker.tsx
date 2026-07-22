import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';
import { CopyIcon, CheckIcon } from '../components/Icons';
import { ArrowRight, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { getContrastColor, paletteToSlug } from '@/utils/colorUtils';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const DEFAULT_MARKERS = [0.15, 0.32, 0.5, 0.68, 0.85].map((x) => ({ x, y: 0.5 }));

export default function ImagePicker() {
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [markers, setMarkers] = useState(DEFAULT_MARKERS);
  const [colors, setColors] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);

  const sampleAt = useCallback((nx: number, ny: number): string => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return '#000000';
    const x = clamp(Math.floor(nx * canvas.width), 0, canvas.width - 1);
    const y = clamp(Math.floor(ny * canvas.height), 0, canvas.height - 1);
    const d = ctx.getImageData(x, y, 1, 1).data;
    return chroma(d[0], d[1], d[2]).hex();
  }, []);

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;
    const canvas = canvasRef.current ?? document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d', { willReadFrequently: true })?.drawImage(img, 0, 0);
    setColors(markers.map((m) => sampleAt(m.x, m.y)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleAt]);

  const loadFile = (file?: File) => {
    if (!file) return;
    if (!file.type.match('image.*')) { toast.error('Please choose an image file'); return; }
    const reader = new FileReader();
    reader.onload = (e) => { setMarkers(DEFAULT_MARKERS); setImageUrl(e.target?.result as string); };
    reader.readAsDataURL(file);
  };

  // Drag a marker across the image
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const i = dragging.current;
      const box = boxRef.current;
      if (i === null || !box) return;
      const r = box.getBoundingClientRect();
      const nx = clamp((e.clientX - r.left) / r.width, 0, 1);
      const ny = clamp((e.clientY - r.top) / r.height, 0, 1);
      setMarkers((prev) => prev.map((m, idx) => (idx === i ? { x: nx, y: ny } : m)));
      setColors((prev) => prev.map((c, idx) => (idx === i ? sampleAt(nx, ny) : c)));
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, [sampleAt]);

  const navigate = useNavigate();
  const copy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    toast.success('Color copied');
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-16 text-white">
      <Header />

      <div className="pt-24 px-4">
        <motion.h1
          className="mb-2 text-center text-2xl font-semibold tracking-tight"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        >
          Image Color Picker
        </motion.h1>
        <p className="mb-8 text-center text-sm text-white/40">Drag the points to sample colors anywhere on your image.</p>

        <div className="mx-auto max-w-4xl">
          {!imageUrl ? (
            <div
              className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-colors ${
                isDragging ? 'border-white/40 bg-white/[0.04]' : 'border-white/15 bg-white/[0.02] hover:border-white/25'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); loadFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Upload className="h-7 w-7 text-white/70" />
              </div>
              <p className="mb-1 text-base font-medium">Drop your image here, or click to select</p>
              <p className="text-sm text-white/40">PNG, JPG or GIF</p>
              <input type="file" ref={fileInputRef} onChange={(e) => loadFile(e.target.files?.[0])} accept="image/*" className="hidden" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image with draggable eyedroppers */}
              <div ref={boxRef} className="relative select-none overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Uploaded"
                  className="max-h-[60vh] w-full object-contain"
                  onLoad={handleImageLoad}
                  crossOrigin="anonymous"
                  draggable={false}
                />
                {markers.map((m, i) => (
                  <button
                    key={i}
                    onPointerDown={() => { dragging.current = i; }}
                    className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white shadow-lg active:cursor-grabbing"
                    style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%`, backgroundColor: colors[i] ?? '#000' }}
                    aria-label={`Sample point ${i + 1}`}
                  />
                ))}
              </div>

              {/* Extracted palette */}
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="flex h-20">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => copy(c, i)}
                      className="flex flex-1 items-center justify-center font-mono text-xs transition-transform hover:scale-y-105"
                      style={{ backgroundColor: c, color: getContrastColor(c) }}
                    >
                      {copiedIndex === i ? <CheckIcon className="h-4 w-4" /> : <span className="flex items-center gap-1"><CopyIcon className="h-3.5 w-3.5" />{c.toUpperCase()}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/palette/${paletteToSlug(colors)}`)}
                  className="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-white/90"
                >
                  Open as palette <ArrowRight className="ml-1.5 h-4 w-4" />
                </button>
                <button
                  onClick={() => { setImageUrl(null); setColors([]); }}
                  className="inline-flex items-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  New image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
