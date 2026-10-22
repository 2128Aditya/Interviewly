import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export default async function requireAuth(req, res, next) {
  try {
    const header = String(req.headers.authorization || "");
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (!token) return res.status(401).json({ message: "Please sign in to continue." });
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) return res.status(500).json({ message: "Authentication is not configured correctly." });
    const payload = jwt.verify(token, secret);
    if (!mongoose.isValidObjectId(payload.userId)) return res.status(401).json({ message: "Your session is invalid. Please sign in again." });
    const user = await User.findById(payload.userId).select("firstName lastName email emailVerified plan billing subscriptionStartedAt subscriptionExpiresAt +activeSessionId");
    if (!user || !user.emailVerified) return res.status(401).json({ message: "Your session is no longer valid. Please sign in again." });
    if (!payload.sessionId || !user.activeSessionId || payload.sessionId !== user.activeSessionId) return res.status(401).json({ message: "Your session was replaced by a login on another device. Please sign in again." });
    if (user.plan !== "free" && (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) <= new Date())) {
      user.plan = "free";
      user.billing = undefined;
      user.subscriptionStartedAt = null;
      user.subscriptionExpiresAt = null;
      await user.save();
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
}
