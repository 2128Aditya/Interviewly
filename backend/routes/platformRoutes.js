import express from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Interview from "../models/Interview.js";
import PaymentOrder from "../models/PaymentOrder.js";
import AdminAudit from "../models/AdminAudit.js";
import UserProgress from "../models/UserProgress.js";
import requireAuth from "../middleware/requireAuth.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Normalize email addresses consistently for admin checks.
const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

router.get("/progress", requireAuth, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      user: req.user._id,
    }).lean();

    res.json({
      progress: progress || {
        solvedProblems: [],
        bookmarkedProblems: [],
        completedChallenges: [],
        roadmapSteps: [],
      },
    });
  } catch {
    res.status(500).json({
      message: "Could not load your practice progress.",
    });
  }
});

router.patch("/progress", requireAuth, async (req, res) => {
  try {
    const allowed = [
      "solvedProblems",
      "bookmarkedProblems",
      "completedChallenges",
      "roadmapSteps",
    ];

    const update = {};

    for (const key of allowed) {
      if (!Array.isArray(req.body?.[key])) continue;

      const source = req.body[key];

      update[key] =
        key === "completedChallenges"
          ? [
              ...new Set(
                source.filter(
                  (x) => typeof x === "string" && x.length <= 20
                )
              ),
            ].slice(-400)
          : [
              ...new Set(
                source.filter(
                  (x) =>
                    Number.isInteger(x) &&
                    x >= 0 &&
                    x <= 10000
                )
              ),
            ].slice(0, 500);
    }

    const progress = await UserProgress.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: update,
        $setOnInsert: { user: req.user._id },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({ progress });
  } catch {
    res.status(500).json({
      message: "Could not save your practice progress.",
    });
  }
});

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const [
      user,
      progress,
      completedInterviews,
      interviewTotals,
      recentInterviews,
    ] = await Promise.all([
      User.findById(req.user._id)
        .select(
          "firstName lastName email plan billing subscriptionStartedAt subscriptionExpiresAt createdAt lastLoginAt emailVerified"
        )
        .lean(),

      UserProgress.findOne({
        user: req.user._id,
      }).lean(),

      Interview.countDocuments({
        user: req.user._id,
        status: "completed",
      }),

      Interview.aggregate([
        {
          $match: {
            user: req.user._id,
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalSeconds: { $sum: "$durationSeconds" },
          },
        },
      ]),

      Interview.find({
        user: req.user._id,
        status: "completed",
      })
        .sort({ completedAt: -1 })
        .limit(5)
        .select(
          "role round difficulty completedAt durationSeconds report.overallScore"
        )
        .lean(),
    ]);

    const solved = Array.isArray(progress?.solvedProblems)
      ? [...new Set(progress.solvedProblems)]
      : [];

    res.json({
      user,
      stats: {
        completedInterviews,
        codingProblemsSolved: solved.length,
        bookmarkedProblems:
          progress?.bookmarkedProblems?.length || 0,
        totalInterviewMinutes: Math.round(
          (interviewTotals[0]?.totalSeconds || 0) / 60
        ),
        generatedQuestions:
          progress?.generatedProblems?.length || 0,
      },
      recentInterviews: recentInterviews.map((i) => ({
        id: String(i._id),
        role: i.role,
        round: i.round,
        difficulty: i.difficulty,
        completedAt: i.completedAt,
        durationSeconds: i.durationSeconds,
        score: i.report?.overallScore ?? null,
      })),
    });
  } catch (error) {
    console.error("[PROFILE]", error.message);

    res.status(500).json({
      message: "Could not load your profile.",
    });
  }
});

router.get("/coding-questions", requireAuth, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      user: req.user._id,
    })
      .select("generatedProblems")
      .lean();

    res.json({
      questions: progress?.generatedProblems || [],
    });
  } catch {
    res.status(500).json({
      message: "Could not load your generated coding questions.",
    });
  }
});

router.post(
  "/coding-questions/generate",
  requireAuth,
  async (req, res) => {
    try {
      const key = process.env.GROQ_API_KEY?.trim();

      if (!key) {
        return res.status(503).json({
          message:
            "AI question generation is not configured. Add GROQ_API_KEY to backend/.env.",
        });
      }

      const topic = String(
        req.body?.topic || "Mixed DSA"
      )
        .trim()
        .slice(0, 60);

      const difficulty = [
        "Easy",
        "Medium",
        "Hard",
      ].includes(req.body?.difficulty)
        ? req.body.difficulty
        : "Mixed";

      const count = Math.min(
        5,
        Math.max(
          1,
          Number.parseInt(req.body?.count, 10) || 5
        )
      );

      const progress = await UserProgress.findOneAndUpdate(
        { user: req.user._id },
        {
          $setOnInsert: {
            user: req.user._id,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      const existing = Array.isArray(
        progress.generatedProblems
      )
        ? progress.generatedProblems
        : [];

      if (existing.length >= 50) {
        return res.status(429).json({
          message:
            "You have reached the 50 saved AI-question limit. Remove some generated questions or continue with the existing question bank.",
        });
      }

      if (
        progress.lastQuestionGenerationAt &&
        Date.now() -
          new Date(
            progress.lastQuestionGenerationAt
          ).getTime() <
          30000
      ) {
        return res.status(429).json({
          message:
            "Please wait 30 seconds before generating another set.",
        });
      }

      const allowedCount = Math.min(
        count,
        50 - existing.length
      );

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model:
              process.env.GROQ_MODEL ||
              "openai/gpt-oss-120b",
            temperature: 0.75,
            max_tokens: 7000,
            response_format: {
              type: "json_object",
            },
            messages: [
              {
                role: "system",
                content: `Create ${allowedCount} original coding practice problems for an interview preparation website. Return valid JSON only: {"questions":[...]}. Each question must have title (unique, <=80 chars), topic (one of Arrays, Strings, Hash Map, Two Pointers, Stack, Queue, Linked Lists, Trees, Graphs, Recursion, Dynamic Programming, Sorting, Searching, SQL, JavaScript), difficulty (Easy/Medium/Hard), time (e.g. "15 min"), description (clear standalone problem statement), examples (2 objects with input and output strings), starter (valid JavaScript function skeleton), functionName (must exactly match the function in starter), hint (one concise hint), tests (2-4 objects with args array and expected value). Tests must be deterministic and simple JSON-compatible values. Use function signatures suitable for plain JavaScript and avoid custom classes/linked-list nodes. Avoid duplicates among this set and common textbook prompts when possible. Do not include solutions or explanations. Use the requested difficulty and topic. Keep each problem independently solvable.`,
              },
              {
                role: "user",
                content: `Topic: ${topic}\nDifficulty: ${difficulty}\nCount: ${allowedCount}\nAvoid titles already saved: ${
                  existing
                    .map((p) => p.title)
                    .filter(Boolean)
                    .slice(-50)
                    .join("; ") || "none"
                }`,
              },
            ],
          }),
          signal: AbortSignal.timeout(40000),
        }
      );

      const payload = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        return res
          .status(response.status === 429 ? 429 : 502)
          .json({
            message:
              payload.error?.message ||
              "The AI could not generate questions. Please retry.",
          });
      }

      const content =
        payload.choices?.[0]?.message?.content || "";

      let parsed;

      try {
        parsed = JSON.parse(content);
      } catch {
        return res.status(502).json({
          message:
            "The AI returned an invalid question set. Please retry.",
        });
      }

      const raw = Array.isArray(parsed.questions)
        ? parsed.questions
        : [];

      const existingTitles = new Set(
        existing.map((p) =>
          String(p.title || "").toLowerCase()
        )
      );

      let nextId =
        Math.max(
          999,
          ...existing.map((p) => Number(p.id) || 0)
        ) + 1;

      const cleaned = [];

      for (const q of raw.slice(0, allowedCount)) {
        if (
          !q ||
          typeof q.title !== "string" ||
          typeof q.description !== "string" ||
          typeof q.starter !== "string" ||
          typeof q.functionName !== "string"
        ) {
          continue;
        }

        const title = q.title.trim().slice(0, 80);

        if (
          !title ||
          existingTitles.has(title.toLowerCase())
        ) {
          continue;
        }

        const examples = Array.isArray(q.examples)
          ? q.examples.slice(0, 3).map((e) => ({
              input: String(e?.input || "").slice(0, 500),
              output: String(e?.output || "").slice(0, 300),
            }))
          : [];

        const tests = Array.isArray(q.tests)
          ? q.tests
              .slice(0, 4)
              .filter(
                (t) =>
                  Array.isArray(t?.args) &&
                  Object.prototype.hasOwnProperty.call(
                    t,
                    "expected"
                  )
              )
              .map((t) => ({
                args: t.args,
                expected: t.expected,
              }))
          : [];

        if (!examples.length || !tests.length) {
          continue;
        }

        const question = {
          id: nextId++,
          title,
          topic: String(q.topic || topic).slice(0, 60),
          difficulty: [
            "Easy",
            "Medium",
            "Hard",
          ].includes(q.difficulty)
            ? q.difficulty
            : difficulty === "Mixed"
              ? "Medium"
              : difficulty,
          time: String(q.time || "15 min").slice(0, 20),
          description: q.description.slice(0, 1800),
          examples,
          starter: q.starter.slice(0, 5000),
          functionName: q.functionName
            .replace(/[^a-zA-Z0-9_$]/g, "")
            .slice(0, 80),
          hint: String(
            q.hint ||
              "Break the problem into smaller steps."
          ).slice(0, 500),
          tests,
          generated: true,
        };

        if (
          !question.functionName ||
          !new RegExp(
            `function\\s+${question.functionName}\\s*\\(|(?:const|let|var)\\s+${question.functionName}\\s*=|${question.functionName}\\s*=`
          ).test(question.starter)
        ) {
          continue;
        }

        cleaned.push(question);
        existingTitles.add(title.toLowerCase());
      }

      if (!cleaned.length) {
        return res.status(502).json({
          message:
            "The AI did not return usable questions. Please try again.",
        });
      }

      progress.generatedProblems = [
        ...existing,
        ...cleaned,
      ].slice(-50);

      progress.lastQuestionGenerationAt = new Date();

      await progress.save();

      res.status(201).json({
        questions: cleaned,
        totalSaved: progress.generatedProblems.length,
      });
    } catch (error) {
      console.error(
        "[CODING QUESTION GENERATION]",
        error.message
      );

      res
        .status(
          error.name === "TimeoutError" ? 504 : 500
        )
        .json({
          message:
            "Could not generate coding questions right now. Please try again.",
        });
    }
  }
);

router.delete(
  "/coding-questions/:id",
  requireAuth,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          message: "Invalid question ID.",
        });
      }

      const progress = await UserProgress.findOne({
        user: req.user._id,
      });

      if (!progress) {
        return res.status(404).json({
          message: "Generated question not found.",
        });
      }

      const before =
        progress.generatedProblems?.length || 0;

      progress.generatedProblems = (
        progress.generatedProblems || []
      ).filter((q) => Number(q.id) !== id);

      if (
        progress.generatedProblems.length === before
      ) {
        return res.status(404).json({
          message: "Generated question not found.",
        });
      }

      await progress.save();

      res.json({
        message: "Generated question removed.",
        questions: progress.generatedProblems,
      });
    } catch {
      res.status(500).json({
        message:
          "Could not remove the generated question.",
      });
    }
  }
);

// Admin password unlock
router.post(
  "/admin/unlock",
  requireAuth,
  async (req, res) => {
    try {
      const configuredEmail = normalizeEmail(
        process.env.ADMIN_EMAIL
      );

      const configuredPassword = String(
        process.env.ADMIN_PASSWORD || ""
      );

      if (!configuredEmail || !configuredPassword) {
        return res.status(503).json({
          message:
            "Admin password is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env.",
        });
      }

      // FIX: Normalize both email addresses before comparison.
      if (
        normalizeEmail(req.user.email) !== configuredEmail
      ) {
        return res.status(403).json({
          message:
            "This account is not authorized as the admin.",
        });
      }

      const supplied = Buffer.from(
        String(req.body?.password || "")
      );

      const expected = Buffer.from(configuredPassword);

      const matches =
        supplied.length === expected.length &&
        crypto.timingSafeEqual(supplied, expected);

      if (!matches) {
        return res.status(403).json({
          message: "Incorrect admin password.",
        });
      }

      const token = jwt.sign(
        {
          userId: String(req.user._id),
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m",
          issuer: "interviewly-admin",
        }
      );

      return res.json({
        token,
        expiresInSeconds: 1800,
        message:
          "Admin dashboard unlocked for 30 minutes.",
      });
    } catch (error) {
      console.error(
        "[ADMIN UNLOCK]",
        error.message
      );

      return res.status(500).json({
        message: "Could not unlock admin access.",
      });
    }
  }
);

// Dashboard
router.get(
  "/dashboard",
  requireAuth,
  async (req, res) => {
    try {
      const [
        payments,
        interviews,
        account,
      ] = await Promise.all([
        PaymentOrder.find({
          user: req.user._id,
        })
          .sort({ createdAt: -1 })
          .limit(30)
          .select(
            "orderId plan billing amountRupees status utr createdAt updatedAt paidAt reviewedAt reviewReason"
          )
          .lean(),

        Interview.countDocuments({
          user: req.user._id,
          status: "completed",
        }),

        User.findById(req.user._id)
          .select("+securityEvents lastLoginAt")
          .lean(),
      ]);

      res.json({
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          plan: req.user.plan,
          billing: req.user.billing,
          subscriptionStartedAt:
            req.user.subscriptionStartedAt,
          subscriptionExpiresAt:
            req.user.subscriptionExpiresAt,
          lastLoginAt: account?.lastLoginAt,
          securityEvents:
            account?.securityEvents || [],
        },

        // FIX: Use the same email normalization here too.
        isAdmin: Boolean(
          normalizeEmail(process.env.ADMIN_EMAIL) &&
            normalizeEmail(req.user.email) ===
              normalizeEmail(process.env.ADMIN_EMAIL)
        ),

        completedInterviews: interviews,
        payments,
      });
    } catch {
      res.status(500).json({
        message: "Could not load your dashboard.",
      });
    }
  }
);

// Revoke a user's active session
router.post(
  "/admin/users/:userId/revoke-session",
  requireAdmin,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.params.userId
      ).select(
        "email +activeSessionId +securityEvents"
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      user.activeSessionId = "";

      user.securityEvents = [
        ...(user.securityEvents || []),
        {
          type: "admin_session_revoked",
          at: new Date(),
          detail: `Session revoked by admin ${req.user.email}.`,
        },
      ].slice(-30);

      await user.save();

      await AdminAudit.create({
        actorEmail: req.user.email,
        action: "session.revoked",
        targetId: String(user._id),
        details: `Revoked active session for ${user.email}`,
        ip: String(
          req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            ""
        ).slice(0, 100),
      });

      res.json({
        message:
          "Active session revoked. The user must sign in again.",
      });
    } catch {
      res.status(500).json({
        message: "Could not revoke the session.",
      });
    }
  }
);

// Admin user management
router.get(
  "/admin/users",
  requireAdmin,
  async (req, res) => {
    try {
      const users = await User.find()
        .sort({ createdAt: -1 })
        .limit(300)
        .select(
          "firstName lastName email plan subscriptionExpiresAt lastLoginAt activeSessionId +activeSessionId"
        )
        .lean();

      res.json({
        users: users.map((u) => ({
          id: String(u._id),
          name: `${u.firstName} ${u.lastName}`.trim(),
          email: u.email,
          plan: u.plan,
          subscriptionExpiresAt:
            u.subscriptionExpiresAt,
          lastLoginAt: u.lastLoginAt,
          hasActiveSession: Boolean(
            u.activeSessionId
          ),
        })),
      });
    } catch {
      res.status(500).json({
        message: "Could not load user management.",
      });
    }
  }
);

// Admin analytics
router.get(
  "/admin/analytics",
  requireAdmin,
  async (req, res) => {
    try {
      const [
        totalUsers,
        premiumUsers,
        pendingPayments,
        paidOrders,
        recentOrders,
        events,
      ] = await Promise.all([
        User.countDocuments(),

        User.countDocuments({
          plan: { $in: ["pro", "premium"] },
          subscriptionExpiresAt: {
            $gt: new Date(),
          },
        }),

        PaymentOrder.countDocuments({
          status: "submitted",
        }),

        PaymentOrder.find({
          status: "paid",
        })
          .select("amountRupees")
          .lean(),

        PaymentOrder.find()
          .sort({ createdAt: -1 })
          .limit(100)
          .populate(
            "user",
            "firstName lastName email"
          )
          .lean(),

        AdminAudit.find()
          .sort({ createdAt: -1 })
          .limit(100)
          .lean(),
      ]);

      const revenue = paidOrders.reduce(
        (sum, payment) =>
          sum + (Number(payment.amountRupees) || 0),
        0
      );

      res.json({
        stats: {
          totalUsers,
          premiumUsers,
          pendingPayments,
          paidOrders: paidOrders.length,
          verifiedRevenue: revenue,
        },

        payments: recentOrders.map((p) => ({
          orderId: p.orderId,
          user: p.user
            ? `${p.user.firstName} ${p.user.lastName}`.trim()
            : "Deleted user",
          email: p.user?.email || "",
          plan: p.plan,
          billing: p.billing,
          amountRupees: p.amountRupees,
          status: p.status,
          utr: p.utr,
          createdAt: p.createdAt,
          reviewReason: p.reviewReason || "",
        })),

        audit: events,
      });
    } catch (error) {
      res.status(500).json({
        message: "Could not load admin analytics.",
      });
    }
  }
);

export default router;