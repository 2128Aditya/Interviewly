import express from "express";
import Interview from "../models/Interview.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();
router.use(requireAuth);

const allowedRounds = new Set(["Warm Up", "Coding", "Role Related", "Behavioral", "Technical Interview", "HR Interview", "Mixed Interview"]);
const clean = (value, max = 12000) => String(value || "").trim().slice(0, max);

async function askGroq(messages, { json = false } = {}) {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    const error = new Error("AI interviews are not configured yet. Add GROQ_API_KEY to backend/.env and restart the backend.");
    error.status = 503;
    throw error;
  }
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      temperature: 0.35,
      max_tokens: 1600,
      ...(json ? { response_format: { type: "json_object" } } : {}),
      messages,
    }),
    signal: AbortSignal.timeout(35000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error?.message || "The AI service could not complete this request. Please try again.");
    error.status = response.status === 429 ? 429 : 502;
    throw error;
  }
  return data.choices?.[0]?.message?.content || "";
}

function contextFor(interview) {
  return `Role: ${interview.role}\nInterview type: ${interview.round}\nDifficulty: ${interview.difficulty}\nJob description: ${interview.jobDescription || "Not provided"}\nResume text: ${interview.resumeText || "Not provided"}`;
}

// Keep the Cartesia credential on the server; the browser receives audio bytes only.
router.post("/tts", async (req, res) => {
  try {
    const transcript = clean(req.body?.text, 3000);
    if (!transcript) return res.status(400).json({ message: "Text is required for speech generation." });
    const apiKey = process.env.CARTESIA_API_KEY?.trim();
    if (!apiKey) return res.status(503).json({ message: "Cartesia is not configured. Add CARTESIA_API_KEY to backend/.env." });
    const voiceId = process.env.CARTESIA_VOICE_ID?.trim() || "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4";
    const response = await fetch("https://api.cartesia.ai/tts/bytes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Cartesia-Version": "2026-03-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: process.env.CARTESIA_MODEL?.trim() || "sonic-3.5",
        transcript,
        voice: { mode: "id", id: voiceId },
        output_format: { container: "wav", encoding: "pcm_s16le", sample_rate: 44100 },
        generation_config: { volume: 1, speed: 0.94 },
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[CARTESIA TTS]", response.status, detail.slice(0, 500));
      return res.status(502).json({ message: "Cartesia could not generate audio. Check your API key, voice ID, and account credits." });
    }
    const audio = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(audio);
  } catch (error) {
    console.error("[CARTESIA TTS]", error.message);
    return res.status(502).json({ message: "Voice generation failed. Please retry or use browser voice." });
  }
});

router.post("/start", async (req, res) => {
  let createdInterviewId = null;
  try {
    const role = clean(req.body?.role, 120);
    const round = clean(req.body?.round || "Role Related", 80);
    const difficulty = ["Beginner", "Intermediate", "Advanced"].includes(req.body?.difficulty) ? req.body.difficulty : "Intermediate";
    if (!role) return res.status(400).json({ message: "Please provide a job role." });
    if (!allowedRounds.has(round)) return res.status(400).json({ message: "Please choose a valid interview type." });
    const jobDescription = clean(req.body?.jobDescription, 12000);
    const resumeText = clean(req.body?.resumeText, 16000);
    const maxDurationMinutes = req.user.plan === "premium" ? 30 : req.user.plan === "pro" ? 15 : 5;
    const requestedDurationMinutes = Number(req.body?.durationMinutes ?? 5);
    if (![5, 15, 30].includes(requestedDurationMinutes)) {
      return res.status(400).json({ message: "Choose a supported interview duration: 5, 15, or 30 minutes." });
    }
    if (requestedDurationMinutes > maxDurationMinutes) {
      return res.status(403).json({ message: `Your current plan allows interviews up to ${maxDurationMinutes} minutes. Choose a shorter duration or upgrade your plan.` });
    }
    const durationSeconds = requestedDurationMinutes * 60;
    const interview = await Interview.create({ user: req.user._id, role, round, difficulty, jobDescription, resumeText, durationSeconds });
    createdInterviewId = interview._id;
    const content = await askGroq([
      { role: "system", content: "You are a professional, supportive interviewer. Return exactly one concise, role-relevant opening interview question in English, with no numbering, preamble, or answer. Ask one question only. Use the supplied resume and job description when available. Do not invent facts about the candidate." },
      { role: "user", content: contextFor(interview) },
    ]);
    interview.answers.push({ question: clean(content, 1000) || `Tell me about your experience relevant to ${role}.` });
    interview.startedAt = new Date();
    await interview.save();
    return res.status(201).json({ interviewId: interview._id, question: interview.answers[0].question, durationSeconds });
  } catch (error) {
    if (createdInterviewId) await Interview.deleteOne({ _id: createdInterviewId, user: req.user._id }).catch(() => {});
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("[INTERVIEW START]", error.message);
    return res.status(500).json({ message: "Could not start the interview. Please try again." });
  }
});

router.post("/:id/answer", async (req, res) => {
  try {
    const answer = clean(req.body?.answer, 10000);
    if (!answer) return res.status(400).json({ message: "Please record or enter an answer before submitting." });
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id, status: "in_progress" });
    if (!interview) return res.status(404).json({ message: "Interview not found or already completed." });
    if (Date.now() >= new Date(interview.startedAt).getTime() + (Number(interview.durationSeconds) || 300) * 1000) return res.status(410).json({ message: "This interview session has reached its time limit. Finish the session to view your report." });
    const current = interview.answers[interview.answers.length - 1];
    if (!current || current.answeredAt) return res.status(409).json({ message: "This question has already been answered." });
    const evaluationText = await askGroq([
      { role: "system", content: `Evaluate only the answer actually provided. Be fair and evidence-grounded; never claim to measure facial expressions or body language. Respond as JSON with keys: score (0-100 number), verdict (short string), strengths (array of strings), improvements (array of strings), missingPoints (array of strings), improvedAnswer (string), followUpQuestion (string). If the answer is empty or unclear, say so. Ask a relevant follow-up only when useful; otherwise followUpQuestion can be empty. English only.` },
      { role: "user", content: `${contextFor(interview)}\nQuestion: ${current.question}\nCandidate answer: ${answer}` },
    ], { json: true });
    let evaluation;
    try { evaluation = JSON.parse(evaluationText); } catch { throw new Error("The AI returned an unreadable evaluation. Please submit again."); }
    evaluation.score = Math.max(0, Math.min(100, Number(evaluation.score) || 0));
    current.answer = answer;
    current.evaluation = evaluation;
    current.answeredAt = new Date();
    const answeredCount = interview.answers.filter((item) => item.answer).length;
    const canAskFollowUp = Boolean(clean(evaluation.followUpQuestion, 800)) && answeredCount < 4;
    let nextQuestion = "";
    if (canAskFollowUp) nextQuestion = clean(evaluation.followUpQuestion, 800);
    else if (answeredCount < 5) {
      nextQuestion = clean(await askGroq([
        { role: "system", content: "Write exactly one next interview question in English. Do not answer it, number it, or include commentary. It must be relevant to the role and interview context, different from prior questions, and match the chosen difficulty." },
        { role: "user", content: `${contextFor(interview)}\nQuestions already asked: ${interview.answers.map((item) => item.question).join("\n- ")}\nLast answer: ${answer}\nEvaluation: ${JSON.stringify(evaluation)}` },
      ]), 1000);
    }
    if (nextQuestion) interview.answers.push({ question: nextQuestion });
    await interview.save();
    return res.json({ evaluation, nextQuestion, answeredCount, complete: !nextQuestion });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("[INTERVIEW ANSWER]", error.message);
    return res.status(502).json({ message: error.message || "Could not evaluate this answer. Please try again." });
  }
});

router.post("/:id/finish", async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) return res.status(404).json({ message: "Interview not found." });
    if (interview.status === "completed" && interview.report) return res.json({ report: interview.report });
    const answered = interview.answers.filter((item) => item.answer);
    let report;
    if (!answered.length) {
      report = { overallScore: 0, verdict: "No answers were submitted, so a performance score cannot be calculated.", strengths: [], weaknesses: ["No answer was recorded."], categoryScores: { technicalKnowledge: 0, communication: 0, relevance: 0 }, improvementPlan: ["Complete a practice interview and submit spoken or typed answers to receive evidence-based feedback."], questions: interview.answers.map((item) => ({ question: item.question, answer: item.answer || "No answer submitted", score: null, strengths: [], improvements: ["No answer was submitted."], missingPoints: [], improvedAnswer: "" })) };
    } else {
      const reportText = await askGroq([
        { role: "system", content: "Create a detailed English interview report as valid JSON only. Analyze only the supplied candidate answers and per-answer evaluations; do not invent candidate experience or claim body-language analysis. Required keys: overallScore (0-100), verdict, categoryScores {technicalKnowledge, communication, relevance} each 0-100, strengths (array), weaknesses (array), improvementPlan (array of actionable steps), level (Beginner|Intermediate|Advanced), questions (array matching each input answer with question, answer, score, strengths, improvements, missingPoints, improvedAnswer). Distinguish missing answers. Scores must be consistent with the evidence. If evidence is insufficient, say so." },
        { role: "user", content: `${contextFor(interview)}\nInterview answers and evaluations:\n${JSON.stringify(interview.answers.map((item) => ({ question: item.question, answer: item.answer || "", evaluation: item.evaluation })))}` },
      ], { json: true });
      report = JSON.parse(reportText);
      report.overallScore = Math.max(0, Math.min(100, Number(report.overallScore) || 0));
      report.questions = interview.answers.map((item, index) => {
        const fromAi = Array.isArray(report.questions) ? report.questions[index] || {} : {};
        return { question: item.question, answer: item.answer || "No answer submitted", score: item.evaluation?.score ?? fromAi.score ?? null, strengths: fromAi.strengths || item.evaluation?.strengths || [], improvements: fromAi.improvements || item.evaluation?.improvements || [], missingPoints: fromAi.missingPoints || item.evaluation?.missingPoints || [], improvedAnswer: fromAi.improvedAnswer || item.evaluation?.improvedAnswer || "" };
      });
    }
    interview.status = "completed";
    interview.completedAt = new Date();
    interview.report = report;
    await interview.save();
    return res.json({ report, interview: { id: interview._id, role: interview.role, round: interview.round, difficulty: interview.difficulty, startedAt: interview.startedAt, completedAt: interview.completedAt, durationSeconds: Math.floor((interview.completedAt - interview.startedAt) / 1000) } });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("[INTERVIEW FINISH]", error.message);
    return res.status(502).json({ message: "Could not generate the report. Please try finishing again." });
  }
});

router.get("/history", async (req, res) => {
  try {
    const items = await Interview.find({ user: req.user._id, status: "completed" }).sort({ completedAt: -1 }).select("role round difficulty startedAt completedAt durationSeconds report createdAt").limit(100).lean();
    res.json({ interviews: items.map((item) => ({ id: item._id, role: item.role, round: item.round, difficulty: item.difficulty, startedAt: item.startedAt, completedAt: item.completedAt, durationSeconds: item.durationSeconds, overallScore: item.report?.overallScore ?? 0, verdict: item.report?.verdict ?? "Report unavailable" })) });
  } catch (error) { res.status(500).json({ message: "Could not load interview history." }); }
});

router.get("/:id", async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id, status: "completed" }).lean();
    if (!interview) return res.status(404).json({ message: "Report not found." });
    res.json({ interview: { id: interview._id, role: interview.role, round: interview.round, difficulty: interview.difficulty, startedAt: interview.startedAt, completedAt: interview.completedAt, durationSeconds: interview.durationSeconds }, report: interview.report });
  } catch { res.status(400).json({ message: "Invalid interview ID." }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Interview.deleteOne({ _id: req.params.id, user: req.user._id });
    if (!result.deletedCount) return res.status(404).json({ message: "Interview not found." });
    res.json({ message: "Interview and its saved transcript/report were deleted." });
  } catch { res.status(400).json({ message: "Could not delete this interview." }); }
});

router.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  return res.status(error.status || 500).json({ message: error.message || "Interview service error." });
});

export default router;
