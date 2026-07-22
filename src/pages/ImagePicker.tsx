import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import ColorThief from 'colorthief';
import chroma from 'chroma-js';
import { CopyIcon, CheckIcon } from '../components/Icons';
import { toast } from 'sonner';
import Header from '@/components/Header';

interface ExtractedColor {
  hex: string;
  rgb: string;
}

export default function ImagePicker() {
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = useCallback(() => {
    if (!imageRef.current) return;

    try {
      setLoading(true);
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(imageRef.current, 8);

      const colors = palette.map((color: number[]) => {
        const [r, g, b] = color;
        const chromaColor = chroma(r, g, b);
        return {
          hex: chromaColor.hex(),
          rgb: `rgb(${r}, ${g}, ${b})`
        };
      });

      setExtractedColors(colors);
      setLoading(false);
    } catch (error) {
      console.error('Error extracting colors:', error);
      toast.error('Error extracting colors. Please try another image.');
      setLoading(false);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please drop an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    toast.success('Color copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 1500);
  };

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
          Image Color Picker
        </motion.h1>

        <div className="mx-auto max-w-4xl">
          {/* Upload Area */}
          <div className="mb-8">
            <div
              className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-colors ${
                isDragging
                  ? 'border-white/40 bg-white/[0.04]'
                  : 'border-white/15 bg-white/[0.02] hover:border-white/25'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <p className="mb-2 text-center text-base font-medium text-white">
                Drop your image here, or click to select
              </p>
              <p className="text-center text-sm text-white/40">
                PNG, JPG, or GIF (max 10MB)
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Image Preview and Extracted Colors */}
          {imageUrl && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Image Preview */}
                <div>
                  <h2 className="mb-4 text-base font-semibold text-white">Uploaded Image</h2>
                  <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/20">
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Uploaded"
                      className="h-full w-full object-contain"
                      onLoad={handleImageLoad}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                {/* Extracted Colors */}
                <div>
                  <h2 className="mb-4 text-base font-semibold text-white">Extracted Colors</h2>

                  {loading ? (
                    <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-6">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                      <span className="ml-3 text-white/60">Extracting colors...</span>
                    </div>
                  ) : extractedColors.length > 0 ? (
                    <div className="space-y-3">
                      {extractedColors.map((color, index) => (
                        <div
                          key={index}
                          className="group flex items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20"
                        >
                          <div
                            className="h-14 w-14 shrink-0 transition-all duration-300 group-hover:w-16"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <div className="flex flex-1 items-center justify-between p-3">
                            <code className="font-mono text-sm text-white/70">{color.hex}</code>
                            <button
                              onClick={() => handleCopy(color.hex, index)}
                              className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white focus:outline-none transition-colors"
                            >
                              {copiedIndex === index ? (
                                <CheckIcon className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <CopyIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-6 text-white/40">
                      Upload an image to extract colors
                    </div>
                  )}
                </div>
              </div>

              {/* Color Palette Preview */}
              {extractedColors.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 text-base font-semibold text-white">Complete Palette</h2>
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <div className="flex h-24">
                      {extractedColors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 cursor-pointer transition-transform hover:scale-y-110"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => handleCopy(color.hex, index)}
                          title={color.hex}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Helpful Tips */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-base font-semibold text-white">Tips</h2>
            <ul className="space-y-3 text-white/60">
              {[
                'Upload high-quality images for the best color extraction results',
                'Click on any color to copy its HEX code to your clipboard',
                'Try images with distinct colors to create interesting palettes'
              ].map((tip) => (
                <li key={tip} className="flex items-start">
                  <svg className="mr-2 h-5 w-5 mt-0.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
