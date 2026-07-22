import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import chroma from 'chroma-js';
import { CopyIcon, CheckIcon } from '../components/Icons';
import { toast } from 'sonner';
import Header from '@/components/Header';

interface ColorFormat {
  format: string;
  value: string;
}

export default function ColorPicker() {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState<string | null>(null);
  const [colorFormats, setColorFormats] = useState<ColorFormat[]>([]);

  useEffect(() => {
    try {
      const chromaColor = chroma(color);
      setColorFormats([
        { format: 'HEX', value: chromaColor.hex() },
        { format: 'RGB', value: chromaColor.css() },
        { format: 'HSL', value: chromaColor.css('hsl') }
      ]);
    } catch (error) {
      console.error('Invalid color', error);
    }
  }, [color]);

  const handleCopy = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
    setCopied(format);
    toast.success(`${format} copied to clipboard`);
    setTimeout(() => setCopied(null), 1500);
  };

  // Calculate text color (black or white) based on background luminance
  const textColor = chroma(color).luminance() > 0.5 ? '#000000' : '#ffffff';

  return (
    <div className="min-h-screen bg-zinc-950 pb-16 text-white">
      <Header />

      <div className="pt-24 px-4">
        <motion.h1
          className="mb-8 text-center text-2xl font-semibold tracking-tight"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Color Picker
        </motion.h1>

        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Color Picker */}
              <div className="flex flex-col items-center gap-4">
                <HexColorPicker
                  color={color}
                  onChange={setColor}
                  className="w-full max-w-[280px]"
                />

                {/* Manual Input */}
                <div className="mt-6 w-full max-w-[280px]">
                  <label className="block text-sm font-medium text-white/60 mb-2">Color Value</label>
                  <div className="relative">
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full ring-1 ring-white/20"
                      style={{ backgroundColor: color }}
                    ></div>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        try {
                          chroma(e.target.value);
                          setColor(e.target.value);
                        } catch (error) {
                          // Invalid color, don't update
                        }
                      }}
                      className="w-full rounded-lg border border-white/10 bg-white/5 pl-12 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview and Formats */}
              <div className="flex flex-col gap-6">
                {/* Color Preview */}
                <div
                  className="flex h-44 items-center justify-center rounded-xl border border-white/10 relative"
                  style={{ backgroundColor: color }}
                >
                  <p className="text-2xl font-semibold" style={{ color: textColor }}>
                    Preview Text
                  </p>
                  <div className="absolute bottom-3 right-3 text-xs rounded-full px-2 py-1 bg-black/30 backdrop-blur-md text-white">
                    {color}
                  </div>
                </div>

                {/* Color Formats */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-white mb-3">Color Formats</h3>
                  {colorFormats.map((format) => (
                    <div
                      key={format.format}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:border-white/20 transition-colors"
                    >
                      <span className="font-medium text-white/60">{format.format}</span>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-black/40 px-3 py-2 font-mono text-sm text-white/80">
                          {format.value}
                        </code>
                        <button
                          onClick={() => handleCopy(format.value, format.format)}
                          className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white focus:outline-none transition-colors"
                        >
                          {copied === format.format ? (
                            <CheckIcon className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <CopyIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Color Shades */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-base font-semibold text-white">Color Shades</h2>
            <div className="grid grid-cols-5 gap-3 md:grid-cols-10">
              {Array.from({ length: 10 }).map((_, i) => {
                const shade = chroma(color).set('hsl.l', i / 10);
                return (
                  <div
                    key={i}
                    className="flex h-14 cursor-pointer items-center justify-center rounded-md border border-white/10 transition-transform hover:scale-105 md:h-16"
                    style={{ backgroundColor: shade.hex() }}
                    onClick={() => setColor(shade.hex())}
                  >
                    <span
                      className="text-xs font-medium md:text-sm"
                      style={{ color: shade.luminance() > 0.5 ? '#000' : '#fff' }}
                    >
                      {i * 10}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Harmony */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-6 text-base font-semibold text-white">Color Harmonies</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Complementary', colors: [color, chroma(color).set('hsl.h', (chroma(color).get('hsl.h') + 180) % 360).hex()] },
                { name: 'Triadic', colors: [
                  color,
                  chroma(color).set('hsl.h', (chroma(color).get('hsl.h') + 120) % 360).hex(),
                  chroma(color).set('hsl.h', (chroma(color).get('hsl.h') + 240) % 360).hex()
                ]},
                { name: 'Analogous', colors: [
                  chroma(color).set('hsl.h', (chroma(color).get('hsl.h') - 30 + 360) % 360).hex(),
                  color,
                  chroma(color).set('hsl.h', (chroma(color).get('hsl.h') + 30) % 360).hex()
                ]},
                { name: 'Monochromatic', colors: [
                  chroma(color).brighten(1.5).hex(),
                  color,
                  chroma(color).darken(1.5).hex()
                ]}
              ].map((harmony) => (
                <div key={harmony.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="mb-3 text-sm font-medium text-white/70">{harmony.name}</h3>
                  <div className="flex overflow-hidden rounded-lg">
                    {harmony.colors.map((harmonyColor, i) => (
                      <div
                        key={i}
                        className="h-16 flex-1 cursor-pointer hover:scale-y-110 transition-transform"
                        style={{ backgroundColor: harmonyColor }}
                        onClick={() => setColor(harmonyColor)}
                        title={harmonyColor}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
