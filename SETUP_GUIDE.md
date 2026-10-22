# Interviewly setup guide (Windows / Node.js)

## 1. Configure backend

1. Open `interviewly/backend` in PowerShell.
2. Copy `.env.example` to `.env`.
3. Configure the following values:
   - `PORT=5100`
   - `MONGODB_URI=mongodb://127.0.0.1:27017/interviewly` or your MongoDB Atlas URI.
   - `CLIENT_URL=http://localhost:5173` (match the URL printed by Vite).
   - `EMAIL_USER` and `EMAIL_APP_PASSWORD` for verification/reset emails.
   - `JWT_SECRET` — a new random secret of at least 32 characters.
   - `GROQ_API_KEY` — required for AI interview generation and reports.
   - `UPI_ID` — your actual receiving UPI ID (e.g. `business@upi`).
   - `UPI_NAME=Interviewly` or your payee name.
   - `ADMIN_EMAIL` — exact email of the verified account allowed to review payments and manage sessions.
4. Run `npm install`, then `npm run dev`.

## 2. Configure frontend

1. Open `interviewly/frontend` in a second PowerShell window.
2. Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:5100`.
3. Run `npm install`, then `npm run dev`.
4. Open the URL printed by Vite.

## 3. Manual UPI payment workflow

1. Sign in and open Plans.
2. Select Pro or Premium and the billing period.
3. Scan the amount-prefilled QR using your UPI app, or pay the displayed UPI ID.
4. Submit the actual UTR/reference number from the UPI transaction details.
5. The request appears in `/admin` for the configured admin email. The admin must verify the transaction against the bank/UPI statement before approving or rejecting it.
6. Approving activates the plan; rejection requires a reason. The user checkout page polls status and displays the result.

Prices are selected by the backend: Pro ₹199/month or ₹1,500/year; Premium ₹499/month or ₹3,999/year. Never trust a screenshot as proof of payment. Do not approve a request until the transaction is confirmed in the receiving account.

## 4. Test checklist

- Verify signup/email verification/sign-in and password reset.
- Confirm that a login from a second device invalidates the first session on protected APIs.
- Start a mock interview on Free, Pro and Premium accounts and confirm server-enforced 5/15/30 minute limits.
- Test a manual payment with a controlled transaction and check the UTR in the bank/UPI app before admin approval.
- Test rejected payments and confirm the reason is visible to the user.
- Verify admin routes are forbidden for non-admin accounts.
- Test coding editor sample runs with correct, incorrect, infinite-loop and runtime-error examples. These are browser-worker samples only; a server-side secure judge is still required for hidden-test submissions.
- Confirm dashboard, daily challenge, roadmap and bookmark/solved progress persist after signing out and back in.

## Limitations

This archive is source code, not a production certification. Real email delivery, MongoDB connectivity, Groq API, UPI transfer and admin bank reconciliation depend on your configuration. PDF/DOCX resume extraction is not configured; paste resume text or use TXT/MD. The sample coding runner is not a trusted grading environment; hidden tests and server-side sandboxing must be added before claiming LeetCode-equivalent judging.

## Recent fixes: duration, admin password, and Cartesia voice

- Interview duration is now taken from the duration selected in the setup modal. Free accounts can select 5 minutes; Pro accounts can select 5 or 15 minutes; Premium accounts can select 5, 15, or 30 minutes. The backend validates the selected duration independently.
- The admin dashboard requires the configured admin email account plus `ADMIN_PASSWORD`. After a correct password, the backend issues a short-lived (30-minute) admin token for admin APIs.
- Optional Cartesia TTS generates the AI interviewer's spoken questions. If Cartesia is not configured or the API fails, the browser speech voice remains as a fallback.
- The default Groq model was updated to `openai/gpt-oss-120b` because the previous `llama-3.3-70b-versatile` model ID was retired for the developer tier.

### Add these values to `backend/.env`

```env
GROQ_MODEL=openai/gpt-oss-120b
CARTESIA_API_KEY=your_cartesia_api_key
CARTESIA_MODEL=sonic-3.5
CARTESIA_VOICE_ID=db6b0ed5-d5d3-463d-ae85-518a07d3c2b4
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=choose-a-long-unique-password
```

Keep these secrets in the backend `.env` only. Never put `CARTESIA_API_KEY` or `ADMIN_PASSWORD` in frontend environment variables or commit the `.env` file. Restart the backend after updating it.
