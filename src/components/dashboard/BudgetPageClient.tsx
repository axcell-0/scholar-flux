"use client";

import { useState } from "react";
import { NewTransactionModal } from "./NewTransactionModal";

type Transaction = {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note?: string;
};

type BudgetPageClientProps = {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
};

export function BudgetPageClient({
  transactions: initialTransactions,
  totalIncome: initialIncome,
  totalExpense: initialExpense,
}: BudgetPageClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [totalIncome, setTotalIncome] = useState(initialIncome);
  const [totalExpense, setTotalExpense] = useState(initialExpense);
  const [modalOpen, setModalOpen] = useState(false);

  const reloadFromServer = async () => {
    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      const res = await fetch(`/api/transactions?month=${month}`);
      const data = await res.json();

      if (res.ok && data.success) {
        const txs: Transaction[] = (data.transactions || []).map((t: any) => ({
          _id: t._id,
          amount: t.amount,
          type: t.type,
          category: t.category,
          date: t.date,
          note: t.note,
        }));

        const inc = txs
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const exp = txs
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        setTransactions(txs);
        setTotalIncome(inc);
        setTotalExpense(exp);
      }
    } catch (error) {
      console.error("Failed to reload transactions", error);
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">
            Income
          </p>
          <p className="text-xl font-headline font-bold text-on-surface">
            {totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">
            Expenses
          </p>
          <p className="text-xl font-headline font-bold text-on-surface">
            {totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">
            Net
          </p>
          <p
            className={`text-xl font-headline font-bold ${
              totalIncome - totalExpense >= 0
                ? "text-secondary"
                : "text-error"
            }`}
          >
            {(totalIncome - totalExpense).toLocaleString()}
          </p>
        </div>
      </section>

      <section className="bg-surface-container-low rounded-2xl p-4 md:p-5 border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm md:text-base font-headline font-semibold text-on-surface">
            This Month&apos;s Transactions
          </h2>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Transaction
          </button>
        </div>

        {transactions.length === 0 && (
          <p className="text-xs text-outline">
            No transactions yet. Add your first income or expense.
          </p>
        )}

        {transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-[11px] text-outline border-b border-outline-variant/30">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Note</th>
                  <th className="py-2 pr-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-outline-variant/20"
                  >
                    <td className="py-2 pr-4">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
                          t.type === "income"
                            ? "bg-secondary/10 text-secondary"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{t.category}</td>
                    <td className="py-2 pr-4">{t.note}</td>
                    <td className="py-2 pr-4 text-right">
                      {t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <NewTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={reloadFromServer}
      />
    </>
  );
}