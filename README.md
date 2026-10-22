# Interviewly

Interviewly is a React + Vite frontend with a Node.js + Express + MongoDB backend. Existing pages and the soft neumorphic visual theme are preserved. The navbar includes direct **Home**, **Coding Practice**, and **My Profile** navigation.

## Quick setup

1. Copy `backend/.env.example` to `backend/.env` and set MongoDB, Gmail SMTP/App Password, `CLIENT_URL`, a random `JWT_SECRET` (32+ characters), `GROQ_API_KEY`, `UPI_ID`, `UPI_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. For natural interviewer audio, also set `CARTESIA_API_KEY` (optional: `CARTESIA_MODEL` and `CARTESIA_VOICE_ID`).
2. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=http://localhost:5100`.
3. In one terminal: `cd backend && npm install && npm run dev`.
4. In another terminal: `cd frontend && npm install && npm run dev`.
5. Open the Vite URL shown in your terminal.

Never put `GROQ_API_KEY`, `JWT_SECRET`, `UPI_ID`, or admin configuration in frontend environment variables. Do not commit `backend/.env`.

## New features

- Coding Practice: starter problem bank plus on-demand AI-generated questions through Groq (five per generation, saved per account, topic/difficulty filters), JavaScript editor, hints, bookmarks and saved solved progress. Generated questions are limited to 50 saved per account and can be removed.
- Daily Coding Challenge: daily challenge notes and completion tracking.
- Personalized Learning Roadmap: track roadmap progress and use saved interview history as context.
- Resume-Based Interview: paste resume text or upload `.txt`/`.md` and optionally provide a job description.
- Profile page: account details, current plan and subscription dates, completed interviews, total interview minutes, saved AI questions and coding questions solved.
- Smart Usage Dashboard: plan/expiry details, interview history, payment status updates and security activity.
- Admin Audit & Analytics: user/payment metrics, manual payment review queue, audit log and active-session revocation.
- One active session per account: a successful login replaces the previous session; protected APIs reject the old session.
- Interview duration is enforced by the backend: Free 5 minutes, Pro 15 minutes, Premium 30 minutes.

## Manual UPI payments

The backend sets the amount from its server-side plan price table (Pro ₹199/month or ₹1,500/year; Premium ₹499/month or ₹3,999/year). Checkout displays a QR with a prefilled amount and the configured `UPI_ID`. The user submits the UTR/reference after paying. The payment remains pending until an admin verifies the transaction against the actual bank/UPI statement and approves it. Only approval activates the subscription; rejection requires a reason. The 5-minute waiting indicator is informational and does not approve or expire a payment.

Set these in `backend/.env`:

- `UPI_ID=your-business@upi` — replace with your actual receiving UPI ID.
- `UPI_NAME=Interviewly` — payee display name.
- `ADMIN_EMAIL=the-verified-admin-account@example.com` — the exact account allowed to access `/admin` and approve payments.

The QR image is served by a third-party QR rendering endpoint; use it only if your environment permits that network request. Verify UTRs in your actual banking app. A screenshot alone is not proof of payment.

## Important limitations before production

- The Coding Practice page includes a starter problem set and per-user AI-generated questions. `Run Code` runs sample tests in a temporary browser Worker; it is not a trusted judge. The `Submit` button intentionally does not issue an Accepted verdict until a server-side isolated judge is configured (CPU/memory/time limits, restricted network/filesystem, and hidden tests). Do not treat browser-run results as authoritative.
- Resume file parsing supports plain `.txt`/`.md`; paste extracted text from PDF/DOCX for now.
- The roadmap and daily challenge use a starter content set. AI question generation requires a working Groq API key and can fail due to provider limits or malformed AI output.
- Email delivery, MongoDB, Groq, manual bank verification, real UPI transfers, and multi-device revocation must be tested with your own configuration before deployment.
- Manual UPI verification is an operational workflow, not a payment gateway. Admin must verify each payment independently. Consider legal/compliance obligations before accepting real customer payments.

## Local ports

- Interviewly backend: `http://localhost:5100`
- Interviewly frontend: usually `http://localhost:5173`
- MongoDB: your configured local/Atlas connection

For AI interview questions and reports, configure a valid `GROQ_API_KEY`. Camera preview and speech support depend on the user's browser permissions and capabilities.
