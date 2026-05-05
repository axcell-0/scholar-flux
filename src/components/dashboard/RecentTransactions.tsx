"use client";

import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { ArrowUpRight, ArrowDownLeft, ReceiptText } from "lucide-react";

export function RecentTransactions() {
  const { summary, isLoading } = useDashboardSummary();

  if (isLoading) return <div className="h-40 bg-slate-50 animate-pulse rounded-3xl" />;
  
  const transactions = summary?.recentTransactions || [];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-indigo-500" />
          Recent Activity
        </h3>
        <button className="text-xs font-bold text-indigo-600 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No recent transactions.</p>
        ) : (
          transactions.map((t: any) => (
            <div key={t._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${
                  t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.description || t.category}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                    {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-black ${
                t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
              }`}>
                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} FCFA
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}