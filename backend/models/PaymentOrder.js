import mongoose from "mongoose";

const paymentOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  plan: { type: String, enum: ["pro", "premium"], required: true },
  billing: { type: String, enum: ["monthly", "yearly"], required: true },
  amountRupees: { type: Number, required: true },
  amountPaise: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["pending", "submitted", "paid", "rejected", "failed", "expired", "cancelled"], default: "pending", index: true },
  gatewayPaymentId: { type: String, default: "" },
  utr: { type: String, default: "" },
  submittedAt: { type: Date, default: null },
  reviewedAt: { type: Date, default: null },
  reviewedBy: { type: String, default: "" },
  reviewReason: { type: String, default: "" },
  paidAt: { type: Date, default: null },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed, default: undefined },
}, { timestamps: true });

export default mongoose.model("PaymentOrder", paymentOrderSchema);
