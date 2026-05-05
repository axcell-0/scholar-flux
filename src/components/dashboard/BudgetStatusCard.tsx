"use client";

import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { Wallet } from "lucide-react";

export function BudgetStatusCard() {
  const { summary, isLoading, isError } = useDashboardSummary();

  if (isLoading) return <div className="animate-pulse bg-white p-6 rounded-2xl h-32" />;
  if (isError) return null;

  // ... (imports and hook usage from previous step)

  const { budget, totalSpent, currentBalance } = summary;
  
  // Calculate percentage of the budget consumed by expenses
  const percentUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <Wallet className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Monthly Budget
            </p>
            <h3 className="text-2xl font-black text-slate-800">
              {percentUsed}% used
            </h3>
          </div>
        </div>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full transition-all duration-700 ${
            percentUsed > 90 ? 'bg-red-500' : 'bg-indigo-600'
          }`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs font-bold text-slate-500">
          Spent: <span className="text-slate-900">{totalSpent.toLocaleString()} FCFA</span>
        </p>
        <p className="text-xs font-bold text-slate-500">
          Remaining: <span className={currentBalance < 0 ? "text-red-500" : "text-emerald-600"}>
            {currentBalance.toLocaleString()} FCFA
          </span>
        </p>
      </div>
    </div>
  );
}