# Interviewly feature integration report

## Integrated into this source bundle
- Added a single `Coding Practice` navbar item. Existing navbar options, colors, layout and styling were preserved.
- Added problem list, topic/difficulty filters, JavaScript editor, hints, sample examples, saved bookmarks and solved progress.
- Added Daily Coding Challenge, Learning Roadmap, Resume-Based Interview, Smart Usage Dashboard and Admin Audit & Analytics pages.
- Added persistent user practice progress in MongoDB.
- Switched Interviewly checkout to manual UPI: server-priced plan, amount-prefilled QR, UTR submission, duplicate UTR claim, admin approval/rejection with reason, subscription activation only after approval, and status polling.
- Added single-active-session login behavior, login/session-replacement/logout events, admin session revocation and audit events.
- Enforced mock interview time limits server-side: Free 5 minutes, Pro 15 minutes, Premium 30 minutes.
- Kept YOUPI PG source in the sibling `YouPI-PG/` directory, but Interviewly no longer calls its hosted checkout or webhook to activate subscriptions.

## Validation performed here
- Backend JavaScript syntax checks passed for the edited server, route, middleware and model files.
- TypeScript compiler parser check reported no syntax errors in frontend `.js`/`.jsx` files.
- A full frontend production build and live end-to-end test were not completed because package installation could not fetch Vite from the npm registry in this environment.
- MongoDB, email delivery, Groq API, real UPI transfer, admin bank reconciliation and session revocation still need testing with your own local configuration.

## Important limitations
- Coding Practice includes a starter problem set. `Run Code` runs sample tests in a temporary browser Worker only. `Submit` does not claim an Accepted verdict; a secure server-side isolated judge and hidden test suite must be configured before production use.
- Resume upload supports plain `.txt`/`.md`; paste extracted text from PDF/DOCX for now.
- The daily challenge and roadmap have starter content. The roadmap uses recent interview history as context but is not yet a fully AI-generated per-topic curriculum.
- Manual UPI QR can prefill the amount, but the receiving bank/UPI app and actual statement are the source of truth. Admin must verify each transaction independently before approving. A screenshot is not proof of payment.
- Set `UPI_ID`, `UPI_NAME` and `ADMIN_EMAIL` in `backend/.env`. The configured admin email must belong to a verified Interviewly account.
- This archive contains templates, not private `.env` files or credentials. Do not commit or share real secrets.
