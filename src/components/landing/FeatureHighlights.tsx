export function FeatureHighlights() {
  return (
    <div className="hidden md:grid grid-cols-2 gap-4">
      <div className="p-6 rounded-xl bg-surface-container-low">
        <span className="material-symbols-outlined text-primary mb-3">
          auto_graph
        </span>
        <h3 className="font-headline font-bold text-inverse-on-surface">Habit Flux</h3>
        <p className="text-xs text-outline mt-1 font-medium">
          Automatic routine tracking
        </p>
      </div>

      <div className="p-6 rounded-xl bg-surface-container-low">
        <span className="material-symbols-outlined text-secondary mb-3">
          account_balance_wallet
        </span>
        <h3 className="font-headline font-bold text-inverse-on-surface">Smart Budget</h3>
        <p className="text-xs text-outline mt-1 font-medium">
          AI-powered student finances
        </p>
      </div>
    </div>
  );
}