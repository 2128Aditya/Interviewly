import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  evaluation: { type: mongoose.Schema.Types.Mixed, default: null },
  askedAt: { type: Date, default: Date.now },
  answeredAt: { type: Date, default: null },
}, { _id: true });

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  role: { type: String, required: true, maxlength: 120 },
  round: { type: String, default: "Role Related", maxlength: 80 },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
  jobDescription: { type: String, default: "", maxlength: 12000 },
  resumeText: { type: String, default: "", maxlength: 16000 },
  durationSeconds: { type: Number, default: 300 },
  status: { type: String, enum: ["in_progress", "completed"], default: "in_progress", index: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  answers: { type: [answerSchema], default: [] },
  report: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);
