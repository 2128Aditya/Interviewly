
import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import paymentRoutes, { youpiWebhook } from "./routes/paymentRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL.trim().replace(/\/+$/, "")] : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
  })
);

// YOUPI signs the exact raw webhook bytes; this route must run before JSON parsing.
app.post("/api/payments/webhook", express.raw({ type: "application/json", limit: "100kb" }), youpiWebhook);

app.use(express.json({ limit: "40kb" }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Interviewly API is running!",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/platform", platformRoutes);

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request.",
    });
  }

  if (err.message?.startsWith("CORS blocked origin:")) {
    return res.status(403).json({
      message: "Origin not allowed by CORS.",
    });
  }

  console.error("Server middleware error:", err.message);

  return res.status(500).json({
    message: "Internal server error.",
  });
});

const PORT = process.env.PORT || 5100;

async function startServer() {
  try {
    // Validate environment variables without printing secrets
    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPassword = process.env.EMAIL_APP_PASSWORD?.trim();
    const jwtSecret = process.env.JWT_SECRET;
    const clientUrl = process.env.CLIENT_URL?.trim();
    const groqKeyLoaded = Boolean(process.env.GROQ_API_KEY?.trim());

    console.log("Environment checks:", {
      mongodbUriLoaded: Boolean(process.env.MONGODB_URI?.trim()),
      emailUserLoaded: Boolean(emailUser),
      emailAppPasswordLoaded: Boolean(emailPassword),
      jwtSecretLoaded: Boolean(jwtSecret && jwtSecret.length >= 32),
      clientUrlLoaded: Boolean(clientUrl),
      groqApiKeyLoaded: groqKeyLoaded,
      manualUpiIdLoaded: Boolean(process.env.UPI_ID?.trim()),
      adminEmailLoaded: Boolean(process.env.ADMIN_EMAIL?.trim()),
      adminPasswordLoaded: Boolean(process.env.ADMIN_PASSWORD?.trim()),
      cartesiaApiKeyLoaded: Boolean(process.env.CARTESIA_API_KEY?.trim()),
    });

    if (!process.env.MONGODB_URI?.trim()) {
      throw new Error("MONGODB_URI is missing from backend/.env");
    }

    if (!emailUser || !emailPassword) {
      throw new Error(
        "EMAIL_USER or EMAIL_APP_PASSWORD is missing from backend/.env"
      );
    }

    if (!jwtSecret || jwtSecret.length < 32) {
      throw new Error(
        "JWT_SECRET must contain at least 32 characters."
      );
    }

    if (!clientUrl) {
      throw new Error("CLIENT_URL is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Interviewly backend running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
