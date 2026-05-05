"use client";

import { useDashboardSummary } from "@/hooks/useDashboardSummary";

export function LiveBudgetPanel() {
  const { summary, isLoading } = useDashboardSummary();

  if (isLoading || !summary) return <div className="h-64 animate-pulse bg-slate-100 rounded-2xl" />;

  const { budget, totalSpent, currentBalance, topCategories = [] } = summary;

  // ✅ Recalculate this inside the component body so it's "live"
  const spentPercent = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0;

  return (
    <div className="bg-surface-container-low rounded-2xl p-4 md:p-5 border border-outline-variant/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-headline font-semibold">Monthly Budget</h2>
        {/* ✅ This percentage will now update */}
        <span className="text-[11px] font-semibold text-outline uppercase tracking-widest">
          {spentPercent}% used
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Spent</span>
            <span>{totalSpent.toLocaleString()} FCFA</span>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
            {/* ✅ The Width property here is what moves the bar */}
            <div
              className="h-full bg-primary rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${spentPercent}%` }}
            />
          </div>
          
          <p className="text-[11px] text-outline mt-1">
            Remaining: {currentBalance.toLocaleString()} FCFA
          </p>
        </div>
        
        {/* ... Categories mapping ... */}
      </div>
    </div>
  );
}