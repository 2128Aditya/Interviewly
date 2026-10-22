import jwt from "jsonwebtoken";
import requireAuth from "./requireAuth.js";

export default function requireAdmin(req, res, next) {
  return requireAuth(req, res, () => {
    const configuredEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (!configuredEmail) return res.status(503).json({ message: "Admin access is not configured. Set ADMIN_EMAIL in backend/.env." });
    if (String(req.user.email || "").trim().toLowerCase() !== configuredEmail) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const adminToken = String(req.headers["x-admin-token"] || "").trim();
    if (!adminToken) return res.status(403).json({ message: "Enter the admin password to unlock this dashboard." });
    try {
      const payload = jwt.verify(adminToken, process.env.JWT_SECRET);
      if (payload.role !== "admin" || String(payload.userId) !== String(req.user._id)) {
        return res.status(403).json({ message: "Admin unlock is invalid. Enter the admin password again." });
      }
      req.adminSession = payload;
      return next();
    } catch {
      return res.status(403).json({ message: "Admin unlock expired. Enter the admin password again." });
    }
  });
}
