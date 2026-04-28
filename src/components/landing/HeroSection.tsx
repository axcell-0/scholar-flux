export function HeroSection() {
  return (
    <section className="flex-1 space-y-8 max-w-md">
      <header>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 signature-gradient rounded-xl flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-primary font-headline">
            Sanctuary
          </span>
        </div>

        <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-[#556483] editorial-spacing leading-tight">
          Your focus is <span className="text-primary">sacred.</span>
        </h1>

        <p className="mt-6 text-lg text-outline font-medium leading-relaxed">
          A calm space designed for the deep work that matters. Join 12,000+
          students reclaiming their cognitive flow.
        </p>
      </header>
    </section>
  );
}