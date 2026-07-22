import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';
import { Shuffle } from 'lucide-react';
import Header from '@/components/Header';
import { generateRandomPalette, paletteToSlug, slugToPalette, getContrastColor } from '@/utils/colorUtils';

// Map an arbitrary palette to UI roles
const roles = (colors: string[]) => {
  const byLum = [...colors].sort((a, b) => chroma(a).luminance() - chroma(b).luminance());
  const bySat = [...colors].sort((a, b) => chroma(b).get('hsl.s') - chroma(a).get('hsl.s'));
  const bg = byLum[byLum.length - 1];
  const surface = byLum[byLum.length - 2] ?? bg;
  const text = byLum[0];
  const primary = bySat[0];
  const accent = bySat[1] ?? primary;
  return { bg, surface, text, primary, accent };
};

export default function Visualizer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const colors = useMemo(() => (slug ? slugToPalette(slug) : null) ?? generateRandomPalette(5), [slug]);
  const r = roles(colors);
  const muted = chroma(r.text).alpha(0.6).css();

  const shuffle = () => navigate(`/visualizer/${paletteToSlug(generateRandomPalette(5))}`);

  return (
    <div className="min-h-screen bg-zinc-950 pb-16 text-white">
      <Header />
      <div className="pt-24 px-4">
        <div className="mb-6 flex flex-col items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Palette Visualizer</h1>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-lg border border-white/10">
              {colors.map((c) => <div key={c} className="h-7 w-9" style={{ backgroundColor: c }} title={c} />)}
            </div>
            <button onClick={shuffle} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5">
              <Shuffle className="h-4 w-4" /> Shuffle
            </button>
            <button onClick={() => navigate(`/palette/${paletteToSlug(colors)}`)} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-950 hover:bg-white/90">
              Edit palette
            </button>
          </div>
        </div>

        {/* Mockup */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <div className="p-6 sm:p-10" style={{ backgroundColor: r.bg, color: r.text }}>
            {/* Nav */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <span className="inline-block h-6 w-6 rounded-md" style={{ backgroundColor: r.primary }} />
                Nimbus
              </div>
              <div className="hidden items-center gap-6 text-sm sm:flex" style={{ color: muted }}>
                <span>Product</span><span>Pricing</span><span>Docs</span>
                <span className="rounded-lg px-4 py-2 font-medium" style={{ backgroundColor: r.primary, color: getContrastColor(r.primary) }}>Sign up</span>
              </div>
            </div>

            {/* Hero */}
            <div className="py-14 text-center">
              <span className="inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: r.accent, color: getContrastColor(r.accent) }}>
                New · v2.0 is here
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                Ship your ideas at the speed of thought
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: muted }}>
                A calmer way to plan, build and launch — all in one place your whole team will actually enjoy using.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <span className="rounded-lg px-6 py-3 font-medium" style={{ backgroundColor: r.primary, color: getContrastColor(r.primary) }}>Get started</span>
                <span className="rounded-lg border px-6 py-3 font-medium" style={{ borderColor: muted }}>Live demo</span>
              </div>
            </div>

            {/* Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {['Automate', 'Collaborate', 'Analyze'].map((t, i) => (
                <div key={t} className="rounded-xl p-5" style={{ backgroundColor: r.surface, color: getContrastColor(r.surface) }}>
                  <div className="mb-3 h-9 w-9 rounded-lg" style={{ backgroundColor: i % 2 ? r.accent : r.primary }} />
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-1 text-sm" style={{ color: chroma(getContrastColor(r.surface)).alpha(0.6).css() }}>
                    Powerful building blocks that stay out of your way until you need them.
                  </p>
                </div>
              ))}
            </div>

            {/* Stat + chart */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl p-5" style={{ backgroundColor: r.surface, color: getContrastColor(r.surface) }}>
                <div className="flex items-end gap-2" style={{ height: 120 }}>
                  {[45, 70, 55, 90, 65, 80, 60].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: i === 3 ? r.primary : r.accent }} />
                  ))}
                </div>
                <p className="mt-3 text-sm font-medium">Weekly active users</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['12.4k', 'Signups'], ['98%', 'Uptime'], ['3.2s', 'Avg build'], ['4.9', 'Rating']].map(([v, l]) => (
                  <div key={l} className="flex flex-col justify-center rounded-xl p-5" style={{ backgroundColor: r.surface, color: getContrastColor(r.surface) }}>
                    <span className="text-2xl font-bold" style={{ color: r.primary }}>{v}</span>
                    <span className="text-sm" style={{ color: chroma(getContrastColor(r.surface)).alpha(0.6).css() }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
