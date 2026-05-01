import { Schema, model, models, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  fullName: string;
  email: string;
  department?: string;
  level?: string;
  createdAt?: Date;
  updatedAt?: Date;
  emailVerified?: boolean;
  emailVerificationCode?: string;
  emailVerificationCodeExpires?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  passwordHash?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "HASHED_PASSWORD_IS_MISSING"],
      minlength: 6,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationCodeExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    level: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.passwordHash!);
};

const User =
  (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

export default User;