import { Schema, model, models, Model } from "mongoose";

export interface INote {
  userId: string; // reference to the User who owns it
  title: string;
  course?: string;
  content: string;
  pinned?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    course: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

const Note =
  (models.Note as Model<INote>) || model<INote>("Note", NoteSchema);

export default Note;