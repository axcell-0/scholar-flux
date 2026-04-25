import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyAuthToken } from "@/lib/auth";
import { StatCard } from "@/components/dashboard/StatCard";
import { TasksPanel } from "@/components/dashboard/TasksPanel";
import { HabitsPanel } from "@/components/dashboard/HabitsPanel";
import Transaction from "@/models/Transaction";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let tasks: any[] = [];
  let transactions: any[] = [];

  const now = new Date();

  if (token) {
    const payload = verifyAuthToken(token);
    if (payload) {
      await dbConnect();

      // Tasks
      tasks = await Task.find({ userId: payload.userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      // Transactions for current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      transactions = await Transaction.find({
        userId: payload.userId,
        date: { $gte: startOfMonth, $lt: endOfMonth },
      })
        .sort({ date: -1 })
        .lean();
    }
  }

  const tasksForClient = tasks.map((task: any) => ({
    _id: task._id.toString(),
    title: task.title,
    course: task.course,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toString(),
  }));

  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const completedTasks = tasks.filter(
    (t) => t.status === "completed"
  ).length;

  // Budget calculations based on transactions
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBudget = 60000; // you can make this configurable later
  const spent = totalExpense;
  const remaining = monthlyBudget - spent;

  const spentPercent = Math.min(
    100,
    monthlyBudget > 0 ? Math.round((spent / monthlyBudget) * 100) : 0
  );

  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount;
    });

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, amount]) => ({ name, amount }));

  // habits and rest of component...

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Today’s Tasks"
          value={`${tasks.length}`}
          sublabel={`${pendingTasks} pending · ${inProgressTasks} in-progress · ${completedTasks} completed`}
          icon="checklist"
          accent="primary"
        />
        <StatCard
          label="Habit Streak"
          value="6 days"
          sublabel="Best streak: Morning revision"
          icon="auto_graph"
          accent="secondary"
        />
        <StatCard
          label="Monthly Budget"
          value={`${spentPercent}% used`}
          sublabel={`Spent ${spent.toLocaleString()} · Remaining ${remaining.toLocaleString()}`}
          icon="account_balance_wallet"
          accent="tertiary"
        />
      </section>

      {/* Middle grid: Tasks + Habits */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tasks */}
        <div className="lg:col-span-2">
          <TasksPanel tasks={tasksForClient} />
        </div>

        {/* Habits */}
        <HabitsPanel />
      </section>

      {/* Bottom: Budget */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-4 md:p-5 border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm md:text-base font-headline font-semibold text-on-surface">
                Monthly Budget
              </h2>
              <p className="text-xs text-outline">
                {now.toLocaleString("default", { month: "long", year: "numeric" })}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-outline uppercase tracking-widest">
              {spentPercent}% used
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 text-outline">
                <span>Spent</span>
                <span>{spent.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-outline mt-1">
                Remaining: {remaining.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-2">
                Top Categories
              </p>
              <div className="space-y-2">
                {topCategories.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-xs bg-white/60 rounded-lg px-3 py-2 border border-outline-variant/30"
                  >
                    <span className="font-medium text-on-surface">
                      {cat.name}
                    </span>
                    <span className="text-outline">
                      {cat.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Notes & Intentions panel stays the same */}
      </section>
    </div>
  );
}