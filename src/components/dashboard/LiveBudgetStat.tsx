"use client";

import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { StatCard } from "./StatCard";

export function LiveBudgetStat() {
  const { summary, isLoading } = useDashboardSummary();

  // Show a "loading" state while SWR fetches the first time
  if (isLoading || !summary) {
    return (
      <StatCard
        label="Monthly Budget"
        value="Calculating..."
        sublabel="Syncing data..."
        icon="account_balance_wallet"
        accent="tertiary"
      />
    );
  }

  // ✅ Use the data specifically from the summary object
  const { budget, totalSpent, currentBalance } = summary;
  
  // Calculate the percentage: (Spent / Budget) * 100
  const spentPercent = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0;

  return (
    <StatCard
      label="Monthly Budget"
      value={`${spentPercent}% used`} // This will now change when summary changes
      sublabel={`Spent ${totalSpent.toLocaleString()} · Remaining ${currentBalance.toLocaleString()}`}
      icon="account_balance_wallet"
      accent="tertiary"
    />
  );
}