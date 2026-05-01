import { Schema, model, models, Model } from "mongoose";

export interface IPendingUser {
    fullName: string;
    email: string;
    passwordHash: string;
    verificationCode: string;
    createdAt?: Date;
    updatedAt?: Date;
    expireAt: Date; // TTL index field
}

const PendingUserSchema = new Schema<IPendingUser>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        passwordHash: {
            type: String,
            required: [true, "PasswordHash is required"],
        },
        verificationCode: {
            type: String,
            required: [true, "Email verification code is required"],
        },
        expireAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // TTL index, document will be removed after this time
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt fields
    }
);

const PendingUser =
    (models.PendingUser as Model<IPendingUser>) ||
    model<IPendingUser>("PendingUser", PendingUserSchema);

export default PendingUser;