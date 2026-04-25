import { Schema, model, models, Types } from "mongoose";

export interface ITask {
  userId: Types.ObjectId;
  title: string;
  course: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

const Task = models.Task || model<ITask>("Task", TaskSchema);

export default Task;