import Link from "next/link";

export const metadata = {
  title: "Design System Demo",
  description: "Tailwind design system sample page with burgundy brand colors.",
};

const cards = [
  {
    title: "Product story",
    description: "Use thoughtful spacing, subtle shadows, and concise copy to let products breathe in a refined layout.",
    tag: "Brand",
  },
  {
    title: "Flexible CTA",
    description: "Primary and secondary action styles coexist with consistent rounding and smooth hover transitions.",
    tag: "Interaction",
  },
  {
    title: "Content cards",
    description: "Card surfaces remain soft and approachable while providing strong visual hierarchy and clarity.",
    tag: "Layout",
  },
];

export default function DesignDemoPage() {
  return (
    <div className="min-h-screen bg-offWhite text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight text-primary-700">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-primary-100 text-primary-700 shadow-soft-sm">B</span>
              Burgundy UI
            </Link>
            <p className="mt-1 text-sm text-slate-500">Clean component examples built with Tailwind utility classes.</p>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Link href="#hero" className="hover:text-primary-700 transition">Overview</Link>
            <Link href="#buttons" className="hover:text-primary-700 transition">Buttons</Link>
            <Link href="#cards" className="hover:text-primary-700 transition">Cards</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-16">
        <section id="hero" className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)] items-start">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/90 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-700">
              Design system preview
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">A modern burgundy-first UI with warm off-white surfaces.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                This sample page shows responsive navigation, button styles, cards, and typographic hierarchy using Tailwind CSS and a custom design system.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="#cards" className="btn-primary">Explore cards</Link>
              <Link href="#buttons" className="btn-secondary">View button styles</Link>
            </div>
          </div>

          <div className="card-surface">
            <h2 className="text-xl font-semibold text-slate-950">Brand tokens</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Primary burgundy and warm off-white colors create a rich modern palette while maintaining strong contrast.</p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-primary-200/90 bg-primary-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-primary-700">Primary</p>
                <p className="mt-3 text-2xl font-semibold text-primary-900">Burgundy</p>
                <p className="mt-1 text-sm text-slate-500">#9c3568</p>
              </div>
              <div className="rounded-3xl border border-slate-200/90 bg-offWhite p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Background</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">Off-white</p>
                <p className="mt-1 text-sm text-slate-500">#f9f4f2</p>
              </div>
            </div>
          </div>
        </section>

        <section id="buttons" className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Buttons</p>
            <h2 className="text-3xl font-semibold text-slate-950">Consistent CTA styles for polished interactions.</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-surface">
              <h3 className="text-lg font-semibold text-slate-950">Primary action</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Use this style for the main action on a page or within a card.</p>
              <button className="btn-primary mt-6 w-full">Continue purchase</button>
            </div>
            <div className="card-surface">
              <h3 className="text-lg font-semibold text-slate-950">Secondary action</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Use for lower-priority actions that still need prominent treatment.</p>
              <button className="btn-secondary mt-6 w-full">Learn more</button>
            </div>
            <div className="card-surface">
              <h3 className="text-lg font-semibold text-slate-950">Text button</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Use expressive text-style links for inline navigation and micro-copy.</p>
              <button className="mt-6 w-full rounded-3xl border border-slate-200/80 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Read details</button>
            </div>
          </div>
        </section>

        <section id="cards" className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Cards</p>
            <h2 className="text-3xl font-semibold text-slate-950">Structured surfaces with calm spacing.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {cards.map((card) => (
              <article key={card.title} className="card-surface group transition duration-300 hover:-translate-y-1">
                <span className="inline-flex rounded-2xl bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary-700">
                  {card.tag}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                <button className="btn-secondary mt-7">View example</button>
              </article>
            ))}
          </div>
        </section>

        <section className="card-surface">
          <div className="grid gap-8 lg:grid-cols-[0.6fr_0.4fr] lg:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Typography</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Readable text that feels elevated.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Headings, body text, and supporting copy should appear calm, measured, and easy to scan. A serif display font for titles pairs nicely with a neutral sans-serif base.</p>
            </div>
            <div className="space-y-4 rounded-[2rem] border border-slate-200/80 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Examples</p>
              <div className="space-y-3">
                <p className="text-xl font-semibold text-slate-950 text-display">Display heading</p>
                <p className="text-lg font-semibold text-slate-900">Section headline</p>
                <p className="text-base leading-7 text-slate-600">Paragraph text should be comfortable to read in long form with a smooth line height and neutral tone.</p>
                <p className="text-sm leading-6 text-slate-500">Caption or helper text lives beneath headings and cards with subtle clarity.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
