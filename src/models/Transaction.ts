import { Schema, model, models, Types } from "mongoose";

export interface ITransaction {
  userId: Types.ObjectId;
  type: "income" | "expense";
  amount: number;
  category: string;
  note?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  models.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;