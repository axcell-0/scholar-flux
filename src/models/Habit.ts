import { Schema, model, models, Types } from "mongoose";

export interface IHabit {
  userId: Types.ObjectId;
  name: string;
  targetFrequency: "daily" | "weekly";
  createdAt?: Date;
  updatedAt?: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
    },
    targetFrequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
  },
  {
    timestamps: true,
  }
);

const Habit = models.Habit || model<IHabit>("Habit", HabitSchema);

export default Habit;