import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import Header from '@/components/Header';
import { paletteToSlug, getContrastColor } from '@/utils/colorUtils';
import { toast } from 'sonner';

// ponytail: a static seed of well-liked palettes. Upgrade path: swap for a fetched
// trending feed if a backend ever exists.
const PALETTES: { name: string; colors: string[] }[] = [
  { name: 'Sunset', colors: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'] },
  { name: 'Berry', colors: ['#590d22', '#800f2f', '#a4133c', '#c9184a', '#ff4d6d'] },
  { name: 'Forest', colors: ['#081c15', '#1b4332', '#2d6a4f', '#40916c', '#74c69d'] },
  { name: 'Ocean', colors: ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'] },
  { name: 'Mocha', colors: ['#3c2a21', '#5c4033', '#967259', '#c8b6a6', '#e7d8c9'] },
  { name: 'Neon', colors: ['#2b2d42', '#8d99ae', '#ef233c', '#d90429', '#edf2f4'] },
  { name: 'Pastel', colors: ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'] },
  { name: 'Earth', colors: ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'] },
  { name: 'Grape', colors: ['#10002b', '#240046', '#3c096c', '#7b2cbf', '#c77dff'] },
  { name: 'Coral', colors: ['#ff6392', '#ffb5a7', '#fcd5ce', '#f8edeb', '#83c5be'] },
  { name: 'Slate', colors: ['#f8f9fa', '#dee2e6', '#adb5bd', '#495057', '#212529'] },
  { name: 'Citrus', colors: ['#f6bd60', '#f7ede2', '#f5cac3', '#84a59d', '#f28482'] },
  { name: 'Midnight', colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'] },
  { name: 'Rose Gold', colors: ['#eaac8b', '#e88c7d', '#e56b6f', '#b56576', '#6d597a'] },
  { name: 'Mint', colors: ['#004b23', '#006400', '#007200', '#38b000', '#9ef01a'] },
  { name: 'Dune', colors: ['#e9edc9', '#ccd5ae', '#fefae0', '#faedcd', '#d4a373'] },
  { name: 'Vapor', colors: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96'] },
  { name: 'Autumn', colors: ['#582f0e', '#7f4f24', '#936639', '#a68a64', '#b6ad90'] },
  { name: 'Cobalt', colors: ['#012a4a', '#013a63', '#01497c', '#2a6f97', '#468faf'] },
  { name: 'Blush', colors: ['#ffcbf2', '#f3c4fb', '#ecbcfd', '#e5b3fe', '#e2afff'] },
];

export default function Explore() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (colors: string[], i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(colors.join(', '));
    setCopied(i);
    toast.success('Palette copied');
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-16 text-white">
      <Header />
      <div className="pt-24 px-4">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight">Explore palettes</h1>
        <p className="mb-8 text-center text-sm text-white/40">Tap any palette to open and refine it in the generator.</p>

        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PALETTES.map((p, i) => (
            <motion.button
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.05 }}
              onClick={() => navigate(`/palette/${paletteToSlug(p.colors)}`)}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] text-left transition-colors hover:border-white/25"
            >
              <div className="flex h-28">
                {p.colors.map((c) => <div key={c} className="flex-1 transition-all group-hover:flex-[1.15]" style={{ backgroundColor: c }} />)}
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium">{p.name}</span>
                <span onClick={(e) => copy(p.colors, i, e)} className="rounded-md p-1.5 text-white/40 hover:bg-white/10 hover:text-white" role="button" aria-label="Copy palette">
                  {copied === i ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
