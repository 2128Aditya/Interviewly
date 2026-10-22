Interviewly bug fixes in this update

1) Interview duration access now reads the signed-in user's current plan from the authenticated /api/platform/dashboard endpoint. Free = 5 minutes, Pro = 15 minutes, Premium = 30 minutes. The backend already enforces 5/15/30 minutes based on the user's plan.
2) The /admin route now checks the server-provided isAdmin flag before rendering the dashboard. A normal signed-in account sees an access-denied page. Admin APIs remain protected by backend requireAdmin middleware.

Setup notes:
- Keep ADMIN_EMAIL set to the exact email address that should be the administrator.
- Restart frontend and backend after replacing the project files.
- Sign in again, refresh the page, and test plan duration.
- Verify UPI payment through the bank/UPI transaction record before approving it.

Validation note: ZIP archive integrity was checked. A full frontend build and end-to-end browser/payment test could not be run in this environment because project dependencies were not installed.
