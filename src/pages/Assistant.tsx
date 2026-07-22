import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';
import { Send, Sparkles, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { paletteToSlug, getContrastColor } from '@/utils/colorUtils';

// ponytail: deterministic mood→palette, no external API. Keyword table seeds a hue +
// scheme; unknown prompts hash to a hue. Upgrade path: swap generate() for a real
// model call if a backend/key is added.
type Seed = { hue: number; sat: number; scheme: 'analogous' | 'complement' | 'triad' | 'spread'; light?: 'light' | 'dark' };
const KEYWORDS: [RegExp, Seed][] = [
  [/ocean|sea|water|beach|marine/, { hue: 200, sat: 0.6, scheme: 'analogous' }],
  [/fire|flame|hot|lava|spicy/, { hue: 12, sat: 0.85, scheme: 'analogous' }],
  [/forest|nature|leaf|jungle|plant/, { hue: 130, sat: 0.5, scheme: 'analogous' }],
  [/sunset|dusk|evening/, { hue: 25, sat: 0.75, scheme: 'spread' }],
  [/calm|serene|soft|zen|peace/, { hue: 210, sat: 0.35, scheme: 'analogous', light: 'light' }],
  [/energetic|vibrant|bold|pop|party/, { hue: 330, sat: 0.9, scheme: 'triad' }],
  [/luxury|gold|royal|elegant|premium/, { hue: 45, sat: 0.55, scheme: 'complement', light: 'dark' }],
  [/retro|vintage|70s|80s/, { hue: 30, sat: 0.6, scheme: 'triad' }],
  [/pastel|cute|candy|sweet/, { hue: 300, sat: 0.45, scheme: 'spread', light: 'light' }],
  [/night|dark|midnight|space|galaxy/, { hue: 250, sat: 0.5, scheme: 'analogous', light: 'dark' }],
  [/coffee|earth|wood|autumn|fall/, { hue: 28, sat: 0.4, scheme: 'analogous' }],
  [/spring|fresh|mint|garden/, { hue: 150, sat: 0.5, scheme: 'analogous', light: 'light' }],
  [/love|romance|rose|pink/, { hue: 340, sat: 0.6, scheme: 'complement' }],
  [/tech|cyber|neon|future/, { hue: 190, sat: 0.85, scheme: 'triad', light: 'dark' }],
];

const hashHue = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
};

const generate = (prompt: string): string[] => {
  const p = prompt.toLowerCase();
  const match = KEYWORDS.find(([re]) => re.test(p));
  const seed: Seed = match ? match[1] : { hue: hashHue(p), sat: 0.55, scheme: 'analogous' };
  const count = 5;
  const hueFor = (i: number) => seed.scheme === 'complement' ? seed.hue + (i % 2) * 180
    : seed.scheme === 'triad' ? seed.hue + (i % 3) * 120
    : seed.scheme === 'spread' ? seed.hue + (360 / count) * i
    : seed.hue + (i - (count - 1) / 2) * 24; // analogous
  const lBase = seed.light === 'light' ? 0.5 : seed.light === 'dark' ? 0.18 : 0.28;
  return Array.from({ length: count }, (_, i) => {
    const h = ((hueFor(i) % 360) + 360) % 360;
    const l = Math.min(0.9, Math.max(0.12, lBase + (0.5 * (i + 0.5)) / count));
    return chroma.hsl(h, seed.sat, l).hex();
  });
};

const reply = (prompt: string) => {
  const known = KEYWORDS.some(([re]) => re.test(prompt.toLowerCase()));
  return known
    ? `Here's a palette inspired by "${prompt.trim()}". Tap it to refine in the generator.`
    : `I riffed on "${prompt.trim()}" — here's a scheme to start from. Tap to open it.`;
};

type Msg = { role: 'user' | 'bot'; text: string; colors?: string[] };

export default function Assistant() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: 'Describe a mood, theme or vibe — "calm ocean", "retro sunset", "luxury brand" — and I\'ll suggest a palette.' },
  ]);

  const submit = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const colors = generate(q);
    setMessages((m) => [...m, { role: 'user', text: q }, { role: 'bot', text: reply(q), colors }]);
    setInput('');
  };

  const suggestions = ['calm ocean', 'retro sunset', 'luxury brand', 'cyber neon', 'cozy coffee'];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <Header />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-24 pb-32">
        <div className="mb-6 flex items-center justify-center gap-2 text-center">
          <Sparkles className="h-5 w-5 text-white/60" />
          <h1 className="text-2xl font-semibold tracking-tight">Color Assistant</h1>
        </div>

        <div className="flex-1 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-white text-zinc-950' : 'border border-white/10 bg-white/[0.03]'}`}>
                <p>{m.text}</p>
                {m.colors && (
                  <button
                    onClick={() => navigate(`/palette/${paletteToSlug(m.colors!)}`)}
                    className="mt-3 block w-full overflow-hidden rounded-lg border border-white/10"
                  >
                    <div className="flex h-16">
                      {m.colors.map((c) => (
                        <div key={c} className="flex flex-1 items-center justify-center font-mono text-[10px]" style={{ backgroundColor: c, color: getContrastColor(c) }}>
                          {c.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-1 py-1.5 text-xs text-white/60">
                      Open in generator <ArrowRight className="h-3 w-3" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {messages.length <= 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => submit(s)} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="mx-auto flex max-w-2xl gap-2 p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a vibe…"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm focus:border-white/30 focus:outline-none"
          />
          <button type="submit" className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 hover:bg-white/90">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
