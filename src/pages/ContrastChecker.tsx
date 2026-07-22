import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import chroma from 'chroma-js';
import { CopyIcon, CheckIcon } from '../components/Icons';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { CvdType, CVD_TYPES, simulate } from '@/utils/colorblind';

interface ContrastResult {
  ratio: number;
  AA: boolean;
  AAA: boolean;
  AAALarge: boolean;
  AALarge: boolean;
}

export default function ContrastChecker() {
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#121212');
  const [activeTab, setActiveTab] = useState<'text' | 'background'>('text');
  const [contrastResult, setContrastResult] = useState<ContrastResult>({
    ratio: 0,
    AA: false,
    AAA: false,
    AAALarge: false,
    AALarge: false,
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [cvd, setCvd] = useState<CvdType>('none');
  const previewText = simulate(textColor, cvd);
  const previewBg = simulate(bgColor, cvd);

  // Calculate contrast ratio and compliance whenever colors change
  useEffect(() => {
    try {
      const ratio = chroma.contrast(textColor, bgColor);

      setContrastResult({
        ratio: Math.round(ratio * 100) / 100,
        AA: ratio >= 4.5,
        AAA: ratio >= 7,
        AALarge: ratio >= 3,
        AAALarge: ratio >= 4.5,
      });
    } catch (error) {
      console.error('Invalid colors', error);
    }
  }, [textColor, bgColor]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('CSS copied to clipboard');
    setTimeout(() => setCopied(false), 1500);
  };

  const swapColors = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  // Generate CSS for the current color combination
  const generateCSS = () => {
    return `color: ${textColor};\nbackground-color: ${bgColor};`;
  };

  const activeColor = activeTab === 'text' ? textColor : bgColor;
  const setActiveColor = activeTab === 'text' ? setTextColor : setBgColor;

  const badges = [
    { label: 'AA Standard', pass: contrastResult.AA, note: 'Normal Text (4.5:1)' },
    { label: 'AAA Enhanced', pass: contrastResult.AAA, note: 'Normal Text (7:1)' },
    { label: 'AA Large', pass: contrastResult.AALarge, note: 'Large Text (3:1)' },
    { label: 'AAA Large', pass: contrastResult.AAALarge, note: 'Large Text (4.5:1)' },
  ];

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
          Contrast Checker
        </motion.h1>

        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Color Pickers */}
              <div className="space-y-6">
                <h2 className="text-base font-semibold text-white">Select Colors</h2>

                {/* Tabs */}
                <div className="flex rounded-lg border border-white/10 p-1">
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'text'
                        ? 'bg-white text-zinc-950'
                        : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    Text Color
                  </button>
                  <button
                    onClick={() => setActiveTab('background')}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'background'
                        ? 'bg-white text-zinc-950'
                        : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    Background Color
                  </button>
                </div>

                {/* Active Color Picker */}
                <div className="flex flex-col items-center">
                  <p className="text-white/60 mb-3 text-sm">
                    Current {activeTab} color: <span className="font-mono text-white">{activeColor}</span>
                  </p>
                  <HexColorPicker
                    color={activeColor}
                    onChange={setActiveColor}
                    className="w-full max-w-[260px]"
                  />
                  <div className="mt-4 w-full max-w-[260px]">
                    <div className="relative">
                      <div
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full ring-1 ring-white/20"
                        style={{ backgroundColor: activeColor }}
                      ></div>
                      <input
                        type="text"
                        value={activeColor}
                        onChange={(e) => {
                          try {
                            chroma(e.target.value);
                            setActiveColor(e.target.value);
                          } catch (error) {
                            // Invalid color, don't update
                          }
                        }}
                        className="w-full rounded-lg border border-white/10 bg-white/5 pl-12 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Swap Colors Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapColors}
                    className="flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                    </svg>
                    Swap Colors
                  </button>
                </div>
              </div>

              {/* Preview and Results */}
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-white">Preview &amp; Results</h2>
                  <select
                    value={cvd}
                    onChange={(e) => setCvd(e.target.value as CvdType)}
                    aria-label="Simulate color vision"
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white focus:border-white/30 focus:outline-none"
                  >
                    {CVD_TYPES.map((t) => (
                      <option key={t.id} value={t.id} className="bg-zinc-900">{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Preview (colors simulated for the selected vision type) */}
                <div
                  className="flex flex-col items-center justify-center rounded-xl border border-white/10 p-6 h-48"
                  style={{ backgroundColor: previewBg }}
                >
                  <p className="text-2xl font-semibold mb-2" style={{ color: previewText }}>
                    Preview Text
                  </p>
                  <p className="text-base" style={{ color: previewText }}>
                    This is how your text will look
                  </p>
                  <p className="text-sm mt-1" style={{ color: previewText }}>
                    Check if it's readable across different text sizes
                  </p>
                </div>

                {/* Contrast Ratio */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-medium text-white">Contrast Ratio</h3>
                    <div className={`text-right ${
                      contrastResult.ratio >= 7
                        ? 'text-emerald-400'
                        : contrastResult.ratio >= 4.5
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}>
                      <span className="block text-2xl font-bold">
                        {contrastResult.ratio}:1
                      </span>
                      <span className="text-xs uppercase tracking-wider">
                        {contrastResult.ratio >= 7
                          ? 'Excellent'
                          : contrastResult.ratio >= 4.5
                          ? 'Good'
                          : 'Poor'}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        contrastResult.ratio >= 7
                          ? 'bg-emerald-400'
                          : contrastResult.ratio >= 4.5
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.min(100, (contrastResult.ratio / 21) * 100)}%` }}
                    ></div>
                  </div>

                  {/* WCAG Compliance Badges */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {badges.map((b) => (
                      <div
                        key={b.label}
                        className={`rounded-xl border p-3 ${
                          b.pass
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{b.label}</span>
                          <span className="rounded-full px-2 py-1 text-xs font-bold uppercase tracking-wider bg-black/20">
                            {b.pass ? 'Pass' : 'Fail'}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-white/40">{b.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CSS Code */}
            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-medium text-white">CSS Code</h3>
                <button
                  onClick={() => handleCopy(generateCSS())}
                  className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white focus:outline-none transition-colors"
                >
                  {copied ? (
                    <CheckIcon className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <CopyIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <pre className="rounded-lg bg-black/40 p-4 font-mono text-sm text-white/70 overflow-x-auto">
                {generateCSS()}
              </pre>
            </div>
          </div>

          {/* Accessibility Tips */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-6 text-base font-semibold text-white">Accessibility Tips</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: 'WCAG Standards', body: 'WCAG 2.1 requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.' },
                { title: 'Large Text', body: 'Large text is defined as 18pt (24px) or 14pt (18.5px) if bold. These have a lower contrast requirement.' },
                { title: 'Best Practice', body: 'Aim for AAA compliance (7:1) whenever possible for better readability and inclusivity.' },
              ].map((tip) => (
                <div key={tip.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium text-white">{tip.title}</h3>
                  <p className="mt-2 text-sm text-white/50">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
