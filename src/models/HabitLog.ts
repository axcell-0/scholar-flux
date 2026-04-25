import { Schema, model, models, Types } from "mongoose";

export interface IHabitLog {
  habitId: Types.ObjectId;
  userId: Types.ObjectId;
  date: Date;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const HabitLogSchema = new Schema<IHabitLog>(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

const HabitLog = models.HabitLog || model<IHabitLog>("HabitLog", HabitLogSchema);

export default HabitLog;