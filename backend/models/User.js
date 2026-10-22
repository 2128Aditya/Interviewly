
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    passwordResetTokenHash: {
      type: String,
      default: undefined,
      select: false,
    },

    passwordResetExpiresAt: {
      type: Date,
      default: undefined,
      select: false,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
      index: true,
    },
    billing: {
      type: String,
      enum: ["monthly", "yearly"],
      default: undefined,
    },
    subscriptionStartedAt: { type: Date, default: null },
    subscriptionExpiresAt: { type: Date, default: null, index: true },
    processedPaymentOrders: { type: [String], default: [], select: false },
    activeSessionId: { type: String, default: "", select: false },
    lastLoginAt: { type: Date, default: null },
    securityEvents: { type: [{ type: { type: String }, at: { type: Date, default: Date.now }, detail: { type: String, default: "" } }], default: [], select: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
