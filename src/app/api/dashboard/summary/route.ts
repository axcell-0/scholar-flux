import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction"; // Ensure you have this model
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
// ... existing imports

export async function GET() {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        const payload = verifyAuthToken(token);
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = payload.userId;
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

        // ✅ 1. Correct Promise.all: One fetch per resource
        const [userData, allTransactions, recentTransactions] = await Promise.all([
            User.findById(userId).select("monthlyBudget").lean(),
            Transaction.find({ userId, date: { $gte: firstDay } }).lean(),
            Transaction.find({ userId }).sort({ date: -1 }).limit(3).lean() 
        ]);

        // ✅ 2. Handle missing user gracefully
        if (!userData) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let totalIncome = 0;
        let totalSpent = 0;

        allTransactions.forEach(t => {
            if (t.type === 'income') totalIncome += t.amount;
            else if (t.type === 'expense') totalSpent += t.amount;
        });

        // ✅ 3. Use the budget from the first fetch (don't re-fetch here)
        const budget = userData.monthlyBudget || 0;

        return NextResponse.json({
            success: true,
            budget,
            totalIncome,
            totalSpent,
            // currentBalance usually represents your real wallet (Income - Spent)
            // If you want "Remaining Budget", use (Budget - Spent)
            currentBalance: budget - totalSpent, 
            recentTransactions 
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}