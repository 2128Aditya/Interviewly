
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { fileURLToPath } from "node:url";

import User from "../models/User.js";
import requireAuth from "../middleware/requireAuth.js";
import PendingSignup from "../models/PendingSignup.js";

const router = express.Router();

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailLogoPath = fileURLToPath(new URL("../assets/logo.png", import.meta.url));

function brandedEmail({ heading, intro, buttonLabel, actionUrl, expiry, footer }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f2efeb;font-family:Arial,Helvetica,sans-serif;color:#38332f">
    <div style="max-width:600px;margin:28px auto;padding:0 14px">
      <div style="background:#eeeae6;border:1px solid #e4ddd5;border-radius:22px;overflow:hidden;box-shadow:0 8px 28px rgba(56,51,47,.08)">
        <div style="padding:26px 28px 20px;text-align:center;background:#f7f5f2;border-bottom:1px solid #e7e0d8">
          <img src="cid:interviewly-logo" alt="Interviewly" width="170" style="display:block;width:170px;max-width:80%;height:auto;margin:0 auto 10px" />
          <div style="font-size:11px;letter-spacing:2px;font-weight:700;color:#8b4dff">YOUR NEXT OPPORTUNITY STARTS HERE</div>
        </div>
        <div style="padding:30px 28px 26px">
          <h1 style="font-size:24px;line-height:1.3;margin:0 0 14px;color:#38332f">${heading}</h1>
          <p style="font-size:15px;line-height:1.8;margin:0 0 20px;color:#71685f">${intro}</p>
          <div style="text-align:center;margin:26px 0 22px"><a href="${actionUrl}" style="display:inline-block;background:#8b4dff;color:#fff;padding:14px 24px;text-decoration:none;border-radius:12px;font-size:14px;font-weight:700;letter-spacing:.2px">${buttonLabel}</a></div>
          <p style="font-size:13px;line-height:1.7;color:#81786f;margin:0 0 12px">${expiry}</p>
          <div style="background:#f7f5f2;border:1px solid #e7e0d8;border-radius:12px;padding:13px 15px;word-break:break-word;font-size:12px;line-height:1.6;color:#81786f">If the button does not work, copy this link into your browser:<br><a href="${actionUrl}" style="color:#7c5ce7">${actionUrl}</a></div>
          <p style="font-size:13px;line-height:1.7;color:#81786f;margin:20px 0 0">${footer}</p>
        </div>
        <div style="padding:17px 25px;text-align:center;background:#f7f5f2;border-top:1px solid #e7e0d8;font-size:11px;line-height:1.7;color:#91877e">Interviewly · Practice with purpose. Grow with confidence.<br>This is an automated email; please do not reply.</div>
      </div>
    </div>
  </body></html>`;
}

const logoAttachment = () => [{ filename: "interviewly-logo.png", path: emailLogoPath, cid: "interviewly-logo" }];

function createEmailTransporter() {
  const emailUser = String(process.env.EMAIL_USER || "").trim();
  const emailPassword = String(
    process.env.EMAIL_APP_PASSWORD || ""
  ).replace(/\s/g, "");

  if (!emailUser || !emailPassword) {
    throw new Error("Email credentials are missing in backend/.env");
  }

  return {
    emailUser,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    }),
  };
}

// STEP 1: SIGNUP
router.post("/signup", async (req, res) => {
  let verificationToken;

  try {
    console.log("[SIGNUP] Request received");

    const {
      firstName,
      lastName,
      name,
      email,
      password,
      confirmPassword,
    } = req.body || {};

    const fullName = String(name || "").trim();

    const resolvedFirstName = String(
      firstName || fullName.split(/\s+/)[0] || ""
    ).trim();

    const resolvedLastName = String(
      lastName ||
        fullName.split(/\s+/).slice(1).join(" ") ||
        ""
    ).trim();

    const normalizedEmail = normalizeEmail(email);

    if (!resolvedFirstName || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "First name, email and password are required.",
      });
    }

    if (
      !emailPattern.test(normalizedEmail) ||
      normalizedEmail.length > 254
    ) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (
      resolvedFirstName.length > 50 ||
      resolvedLastName.length > 50
    ) {
      return res.status(400).json({
        message: "Names must be 50 characters or fewer.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        message: "Password must be between 8 and 128 characters.",
      });
    }

    if (
      confirmPassword !== undefined &&
      password !== confirmPassword
    ) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    if (!process.env.CLIENT_URL?.trim()) {
      return res.status(500).json({
        message: "CLIENT_URL is missing from backend/.env.",
      });
    }

    // Configure email at request time so environment variables
    // are read after the backend has loaded its .env file.
    let emailUser;
    let transporter;

    try {
      ({ emailUser, transporter } = createEmailTransporter());
    } catch (configError) {
      console.error("[SIGNUP] Email configuration error:", configError.message);

      return res.status(500).json({
        message: "Email service is not configured correctly.",
      });
    }

    console.log("[SIGNUP] Database:", User.db.name);
    console.log("[SIGNUP] Checking existing account");

    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("_id emailVerified");

    if (existingUser) {
      if (existingUser.emailVerified === true) {
        return res.status(409).json({
          message: "An account with this email already exists. Please sign in.",
        });
      }

      // Remove only an unverified user record.
      // Verified accounts are never deleted by signup.
      await User.deleteOne({
        _id: existingUser._id,
        emailVerified: { $ne: true },
      });

      console.log("[SIGNUP] Cleaned up old unverified user record");
    }

    // Remove expired pending signups and any older pending
    // signup for this same email.
    await PendingSignup.deleteMany({
      $or: [
        { email: normalizedEmail },
        { expiresAt: { $lte: new Date() } },
      ],
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    verificationToken = crypto.randomBytes(32).toString("hex");

    await PendingSignup.create({
      firstName: resolvedFirstName,
      lastName: resolvedLastName,
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const clientUrl = process.env.CLIENT_URL.trim().replace(/\/+$/, "");

    const verificationUrl =
      `${clientUrl}/verify-email?token=${verificationToken}`;

    console.log("[SIGNUP] Sending verification email");

    try {
      await transporter.sendMail({
        from: `"Interviewly" <${emailUser}>`,
        to: normalizedEmail,
        subject: "Verify your Interviewly email",
        text: `Welcome to Interviewly!\n\nThanks for creating an account. Verify your email within 15 minutes to activate your account:\n${verificationUrl}\n\nIf you did not request this account, you can safely ignore this email.`,
        html: brandedEmail({
          heading: "Welcome to Interviewly!",
          intro: "Thanks for joining us. One quick step remains before you can start practising for your next interview: verify that this email address belongs to you.",
          buttonLabel: "VERIFY MY EMAIL",
          actionUrl: verificationUrl,
          expiry: "For your security, this verification link expires in 15 minutes.",
          footer: "If you did not create an Interviewly account, you can safely ignore this message. No account will be activated without verification.",
        }),
        attachments: logoAttachment(),
      });
    } catch (emailError) {
      console.error(
        "[SIGNUP] Email send failed:",
        emailError.code || "",
        emailError.message
      );

      await PendingSignup.deleteOne({ verificationToken });
      verificationToken = undefined;

      return res.status(502).json({
        message:
          "Verification email could not be sent. Check the Gmail App Password and SMTP connection.",
      });
    }

    console.log("[SIGNUP] Verification email sent");

    return res.status(200).json({
      message:
        "Verification email sent successfully. Please check your inbox and spam folder.",
    });
  } catch (error) {
    console.error("[SIGNUP] Error:", error.message);

    if (verificationToken) {
      try {
        await PendingSignup.deleteOne({ verificationToken });
      } catch (cleanupError) {
        console.error("[SIGNUP] Cleanup failed:", cleanupError.message);
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "An account or pending signup already exists. Please try again.",
      });
    }

    return res.status(500).json({
      message: "Unable to complete signup. Please try again.",
    });
  }
});

// STEP 2: VERIFY EMAIL
router.get("/verify-email", async (req, res) => {
  try {
    const token = String(req.query.token || "");

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        message: "Invalid verification link.",
      });
    }

    const pendingSignup = await PendingSignup.findOne({
      verificationToken: token,
      expiresAt: { $gt: new Date() },
    });

    if (!pendingSignup) {
      return res.status(400).json({
        message:
          "Verification link is invalid or expired. Please sign up again.",
      });
    }

    const normalizedEmail = normalizeEmail(pendingSignup.email);

    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("_id emailVerified");

    if (existingUser?.emailVerified === true) {
      await PendingSignup.deleteOne({ _id: pendingSignup._id });

      return res.status(409).json({
        message: "This email is already verified. Please sign in.",
      });
    }

    // Clean up an older unverified record, if one exists.
    if (existingUser) {
      await User.deleteOne({
        _id: existingUser._id,
        emailVerified: { $ne: true },
      });
    }

    await User.create({
      firstName: pendingSignup.firstName,
      lastName: pendingSignup.lastName,
      email: normalizedEmail,
      password: pendingSignup.password,
      emailVerified: true,
    });

    await PendingSignup.deleteOne({ _id: pendingSignup._id });

    console.log("[VERIFY EMAIL] Account verified");

    return res.status(200).json({
      message: "Email verified successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("[VERIFY EMAIL] Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered. Please sign in.",
      });
    }

    return res.status(500).json({
      message: "Unable to verify email. Please try again.",
    });
  }
});

// STEP 3: SIGN IN
router.post("/signin", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    if (!email || typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const user = await User.findOne({ email }).select("+password +activeSessionId +securityEvents");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.emailVerified !== true) {
      return res.status(403).json({
        message: "Please verify your email before signing in.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret || jwtSecret.length < 32) {
      console.error("[SIGNIN] JWT_SECRET is missing or too short.");

      return res.status(500).json({
        message: "Authentication is not configured correctly.",
      });
    }

    const sessionId = crypto.randomUUID();
    const replacedExisting = Boolean(user.activeSessionId);
    user.activeSessionId = sessionId;
    user.lastLoginAt = new Date();
    user.securityEvents = [...(user.securityEvents || []),
      ...(replacedExisting ? [{ type: "session_replaced", at: new Date(), detail: "Previous active session revoked by a new login." }] : []),
      { type: "login", at: new Date(), detail: "Successful login." },
    ].slice(-30);
    await user.save();
    const token = jwt.sign(
      { userId: user._id.toString(), sessionId },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Signed in successfully.",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[SIGNIN] Error:", error.message);

    return res.status(500).json({
      message: "Unable to sign in. Please try again.",
    });
  }
});


// STEP 4: REQUEST PASSWORD RESET
router.post("/forgot-password", async (req, res) => {
  const genericMessage =
    "If an account exists for this email, a password reset link has been sent.";

  try {
    const email = normalizeEmail(req.body?.email);

    if (!email || !emailPattern.test(email) || email.length > 254) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const user = await User.findOne({ email, emailVerified: true });

    // Keep the response identical for known and unknown emails.
    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }

    const { emailUser, transporter } = createEmailTransporter();
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpiresAt = expiresAt;
    await user.save();

    const clientUrl = String(process.env.CLIENT_URL || "").trim().replace(/\/+$/, "");
    const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`;

    try {
      await transporter.sendMail({
        from: `"Interviewly" <${emailUser}>`,
        to: user.email,
        subject: "Reset your Interviewly password",
        text: `You requested a password reset for your Interviewly account. Use this secure link within 15 minutes:\n${resetUrl}\n\nIf you did not request this change, ignore this email. Your password will remain unchanged.`,
        html: brandedEmail({
          heading: "Reset your password",
          intro: "We received a request to change the password for your Interviewly account. Use the secure button below to choose a new password.",
          buttonLabel: "RESET PASSWORD",
          actionUrl: resetUrl,
          expiry: "This one-time link expires in 15 minutes and can only be used once.",
          footer: "If you did not request a password reset, you can safely ignore this email. Your password will not change unless the link is used.",
        }),
        attachments: logoAttachment(),
      });
    } catch (emailError) {
      console.error("[FORGOT PASSWORD] Email send failed:", emailError.code || "", emailError.message);
      user.passwordResetTokenHash = null;
      user.passwordResetExpiresAt = null;
      await user.save();
      // Do not reveal whether an account exists.
    }

    return res.status(200).json({ message: genericMessage });
  } catch (error) {
    console.error("[FORGOT PASSWORD] Error:", error.message);
    return res.status(500).json({ message: "Unable to process the request right now. Please try again." });
  }
});

// STEP 5: RESET PASSWORD USING A ONE-TIME TOKEN
router.post("/reset-password", async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    const password = req.body?.password;
    const confirmPassword = req.body?.confirmPassword;

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ message: "This password reset link is invalid or expired. Request a new link." });
    }

    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 8 and 128 characters." });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
      emailVerified: true,
    }).select("+passwordResetTokenHash +passwordResetExpiresAt");

    if (!user) {
      return res.status(400).json({ message: "This password reset link is invalid or expired. Request a new link." });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully. You can now sign in with your new password." });
  } catch (error) {
    console.error("[RESET PASSWORD] Error:", error.message);
    return res.status(500).json({ message: "Unable to reset your password. Please try again." });
  }
});


router.post("/logout", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+activeSessionId +securityEvents");
    if (user) { user.activeSessionId = ""; user.securityEvents = [...(user.securityEvents || []), { type: "logout", at: new Date(), detail: "User signed out." }].slice(-30); await user.save(); }
    return res.json({ message: "Signed out successfully." });
  } catch { return res.status(500).json({ message: "Could not record sign out." }); }
});

export default router;
