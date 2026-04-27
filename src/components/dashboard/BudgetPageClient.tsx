"use client";

import { useState, useMemo } from "react";
import { NewTransactionModal } from "./NewTransactionModal";
import { useToast } from "../ui/ToastProvider";
import { Trash2 } from "lucide-react";

type Transaction = {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note?: string;
  description?: string;
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
  const [list, setList] = useState<Transaction[]>(initialTransactions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const { showToast } = useToast();

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let income = 0;
    let expenses = 0;

    for (const tx of list) {
      const d = new Date(tx.date);
      if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) continue;

      if (tx.type === "income") income += tx.amount;
      if (tx.type === "expense") expenses += tx.amount;
    }

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [list]);


  const handleCreated = (tx: Transaction) => {
    setList((prev) => [tx, ...prev]);
  };

  const handleUpdated = (tx: Transaction) => {
    setList((prev) =>
      prev.map((t) => (t._id === tx._id ? tx : t))
    );
  };

  const handleDelete = async (id: string) => {
    // if (!confirm("Delete this transaction?")) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data?.message || "Failed to delete transaction.", "error");
        return;
      }

      showToast("Transaction deleted.");
      setList((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

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
          description: t.description,
        }));

        setList(txs);
      }
    } catch (error) {
      console.error("Failed to reload transactions", error);
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Income */}
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">
            Income (this month)
          </p>
          <p className="text-2xl font-headline font-bold text-on-surface">
            {totalIncome.toLocaleString()} FCFA
          </p>
          <p className="text-[11px] text-on-surface-variant mt-1">
            Money coming into your student budget.
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">
            Expenses (this month)
          </p>
          <p className="text-2xl font-headline font-bold text-error">
            {totalExpenses.toLocaleString()} FCFA
          </p>
          <p className="text-[11px] text-on-surface-variant mt-1">
            What you&apos;ve already spent on fees, transport, etc.
          </p>
        </div>

        {/* Net balance */}
        <div className="bg-primary-container rounded-2xl p-4 border border-outline-variant/30 text-on-primary-container">
          <p className="text-[11px] font-bold uppercase tracking-widest">
            Remaining balance
          </p>
          <p
            className={`text-2xl font-headline font-bold ${balance >= 0 ? "text-on-primary-container" : "text-error"
              }`}
          >
            {balance.toLocaleString()} FCFA
          </p>
          <p className="text-[11px] text-on-primary-container/80 mt-1">
            Positive means you&apos;re safe; negative means overspending.
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

        {list.length === 0 && (
          <p className="text-xs text-outline">
            No transactions yet. Add your first income or expense.
          </p>
        )}

        {list.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              {/* ... */}
              <tbody>
                {list.map((tx) => (
                  <tr key={tx._id} className="border-b border-outline-variant/20">
                    <td className="py-2">
                      {tx.date ? new Date(tx.date).toLocaleDateString() : ""}
                    </td>
                    <td className="py-2">{tx.type}</td>
                    <td className="py-2">{tx.category}</td>
                    <td className="py-2 hidden md:table-cell text-on-surface-variant">
                      {tx.description}
                    </td>
                    <td className="py-2 text-right">
                      {tx.type === "expense" ? "-" : "+"}
                      {tx.amount.toLocaleString()}
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditing(tx)}
                          className="text-[11px] text-on-surface-variant hover:text-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tx._id)}
                          className="text-[11px] text-error hover:text-error/80"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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