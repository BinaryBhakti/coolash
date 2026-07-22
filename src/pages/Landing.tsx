import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PaletteIcon, GradientIcon, ColorPickerIcon, ImagePickerIcon, ContrastIcon } from '../components/Icons';

interface ToolCardProps {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  accent: string;
  index: number;
}

const ToolCard = ({ title, description, path, icon, accent, index }: ToolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={path}
        className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.04]"
      >
        <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-white/50">{description}</p>
        <span className="mt-4 inline-flex items-center text-sm font-medium text-white/40 transition-colors group-hover:text-white">
          Open <span className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </Link>
    </motion.div>
  );
};

export default function Landing() {
  const tools = [
    {
      title: "Palette Generator",
      description: "Create harmonious color palettes with one click.",
      path: "/palette",
      icon: <PaletteIcon className="h-5 w-5 text-violet-300" />,
      accent: "bg-violet-500/15"
    },
    {
      title: "Gradient Maker",
      description: "Design smooth gradients with unlimited color stops.",
      path: "/gradient",
      icon: <GradientIcon className="h-5 w-5 text-sky-300" />,
      accent: "bg-sky-500/15"
    },
    {
      title: "Color Picker",
      description: "Select precise colors across HEX, RGB and HSL.",
      path: "/color-picker",
      icon: <ColorPickerIcon className="h-5 w-5 text-rose-300" />,
      accent: "bg-rose-500/15"
    },
    {
      title: "Image Color Picker",
      description: "Extract palettes straight from your images.",
      path: "/image-picker",
      icon: <ImagePickerIcon className="h-5 w-5 text-amber-300" />,
      accent: "bg-amber-500/15"
    },
    {
      title: "Contrast Checker",
      description: "Verify accessibility against WCAG contrast ratios.",
      path: "/contrast",
      icon: <ContrastIcon className="h-5 w-5 text-emerald-300" />,
      accent: "bg-emerald-500/15"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 pt-28 pb-16 text-center">
        {/* single soft accent, low opacity */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 mx-auto h-64 max-w-2xl bg-gradient-to-b from-violet-500/10 to-transparent blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/60">
            Color tools for designers &amp; developers
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
            Coolash
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/50">
            A minimal toolkit to create, explore and refine color. Fast, keyboard-friendly, and built for real work.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/palette"
              className="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white/90"
            >
              Get started <span className="ml-1.5">→</span>
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
            >
              Browse tools
            </a>
          </div>
        </motion.div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <ToolCard key={tool.title} {...tool} index={index} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-sm text-white/40">
          <span>Coolash</span>
          <a
            href="https://github.com/BinaryBhakti/coolash"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
