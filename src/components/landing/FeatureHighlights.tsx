export function FeatureHighlights() {
  return (
    <div className="hidden md:grid grid-cols-2 gap-4">
      <div className="p-6 rounded-xl bg-[#eff4ff]">
        <span className="material-symbols-outlined text-[#3525cd] mb-3">
          auto_graph
        </span>
        <h3 className="font-headline font-bold text-[#eaf1ff]">Habit Flux</h3>
        <p className="text-xs text-[#777587] mt-1 font-medium">
          Automatic routine tracking
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#eff4ff]">
        <span className="material-symbols-outlined text-[#006c49] mb-3">
          account_balance_wallet
        </span>
        <h3 className="font-headline font-bold text-[#eaf1ff]">Smart Budget</h3>
        <p className="text-xs text-[#777587] mt-1 font-medium">
          AI-powered student finances
        </p>
      </div>
    </div>
  );
}