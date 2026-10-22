import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  solvedProblems: { type: [Number], default: [] },
  bookmarkedProblems: { type: [Number], default: [] },
  completedChallenges: { type: [String], default: [] },
  roadmapSteps: { type: [Number], default: [] },
  generatedProblems: { type: [mongoose.Schema.Types.Mixed], default: [] },
  lastQuestionGenerationAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("UserProgress", schema);
