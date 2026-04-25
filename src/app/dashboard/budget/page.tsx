import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/auth";
import Transaction from "@/models/Transaction";
import { BudgetPageClient } from "@/components/dashboard/BudgetPageClient";

export default async function BudgetPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const payload = verifyAuthToken(token);
  if (!payload) redirect("/");

  await dbConnect();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const transactionsRaw = await Transaction.find({
    userId: payload.userId,
    date: { $gte: startOfMonth, $lt: endOfMonth },
  })
    .sort({ date: -1 })
    .lean();

  const transactions = transactionsRaw.map((t: any) => ({
    _id: t._id.toString(),
    amount: t.amount,
    type: t.type,
    category: t.category,
    date: t.date,
    note: t.note,
  }));

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-headline font-bold text-on-surface">
            Budget & Transactions
          </h1>
          <p className="text-xs md:text-sm text-outline">
            See how your income and expenses look this month.
          </p>
        </div>
      </header>

      <BudgetPageClient
        transactions={transactions}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />
    </div>
  );
}