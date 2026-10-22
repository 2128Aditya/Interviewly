import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PURPLE = "#8B4DFF";
const insetShadow = "inset 4px 4px 8px rgba(180,165,150,0.30), inset -4px -4px 8px rgba(255,252,248,0.95)";
const raisedShadow = "5px 5px 10px rgba(180,165,150,0.28), -5px -5px 10px rgba(255,252,248,0.95)";

export default function ForgotPassword({ onResetPassword, onCompleteReset, onBackToSignin, loading = false }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const isResetMode = Boolean(token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLocalError("");
    setLocalSuccess("");

    try {
      setIsLoading(true);
      if (isResetMode) {
        if (password.length < 8 || password.length > 128) {
          setLocalError("Password must be between 8 and 128 characters.");
          return;
        }
        if (password !== confirmPassword) {
          setLocalError("Passwords do not match.");
          return;
        }
        if (!onCompleteReset) {
          setLocalError("Password reset is not connected yet. Please refresh and try again.");
          return;
        }
        const result = await onCompleteReset(token, password, confirmPassword);
        setLocalSuccess(result?.message || "Password reset successfully. You can now sign in.");
        setPassword("");
        setConfirmPassword("");
      } else {
        const normalizedEmail = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
          setLocalError("Please enter a valid email address.");
          return;
        }
        if (!onResetPassword) {
          setLocalError("Password reset is not connected to authentication yet.");
          return;
        }
        const result = await onResetPassword(normalizedEmail);
        setLocalSuccess(result?.message || "If an account exists for this email, a password reset link has been sent.");
      }
    } catch (err) {
      setLocalError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "mt-2 h-12 w-full rounded-xl border border-[#e5ded5] bg-[#eeeae6] px-4 text-sm font-normal text-[#38332f] outline-none transition placeholder:text-[#a39a90] focus:border-[#b9a0ff] focus:ring-2 focus:ring-[#8B4DFF]/10";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eeeae6] px-4 py-8 font-sans text-[#38332f]">
      <section className="w-full max-w-[480px] rounded-[28px] border border-[#f7f3ef] bg-[#eeeae6] px-6 py-8 sm:px-9 sm:py-10" style={{ boxShadow: raisedShadow }}>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eeeae6] text-[#8B4DFF]" style={{ boxShadow: insetShadow }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isResetMode ? <><rect x="4" y="10" width="16" height="11" rx="3" /><path d="M8 10V7a4 4 0 018 0v3" /><circle cx="12" cy="15" r="1" /><path d="M12 16v2" /></> : <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>}
          </svg>
        </div>

        <header className="mb-7 text-center">
          <h1 className="text-[27px] font-bold tracking-[-0.8px] text-[#38332f]">{isResetMode ? "Create New Password" : "Forgot Password?"}</h1>
          <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-[#81786f]">{isResetMode ? "Choose a strong new password for your Interviewly account." : "Enter your registered email address and we’ll send you a secure password reset link."}</p>
        </header>

        <form onSubmit={submit} className="space-y-5">
          {!isResetMode ? (
            <label className="block text-sm font-semibold text-[#625a52]">Email Address
              <input type="email" name="email" value={email} onChange={(event) => { setEmail(event.target.value); setLocalError(""); setLocalSuccess(""); }} placeholder="you@example.com" autoComplete="email" maxLength={254} required className={inputClass} style={{ boxShadow: insetShadow }} />
            </label>
          ) : (
            <>
              <label className="block text-sm font-semibold text-[#625a52]">New Password
                <span className="relative block"><input type={showPassword ? "text" : "password"} name="password" value={password} onChange={(event) => { setPassword(event.target.value); setLocalError(""); setLocalSuccess(""); }} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} maxLength={128} required className={`${inputClass} pr-16`} style={{ boxShadow: insetShadow }} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#81786f] hover:text-[#8B4DFF]">{showPassword ? "HIDE" : "SHOW"}</button></span>
              </label>
              <label className="block text-sm font-semibold text-[#625a52]">Confirm New Password
                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setLocalError(""); setLocalSuccess(""); }} placeholder="Re-enter new password" autoComplete="new-password" minLength={8} maxLength={128} required className={inputClass} style={{ boxShadow: insetShadow }} />
              </label>
            </>
          )}

          {localError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">{localError}</p>}
          {localSuccess && <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm leading-5 text-green-800">{localSuccess}</p>}

          <button type="submit" disabled={loading || isLoading} className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60" style={{ background: PURPLE, boxShadow: "4px 4px 9px rgba(180,165,150,0.25)" }}>
            {(loading || isLoading) ? "PLEASE WAIT..." : isResetMode ? "RESET PASSWORD" : "SEND RESET LINK"}
          </button>
        </form>

        {isResetMode && localSuccess ? (
          <button type="button" onClick={() => navigate("/signin")} className="mx-auto mt-6 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-[#8B4DFF] hover:underline">Continue to Sign In</button>
        ) : onBackToSignin && (
          <button type="button" onClick={onBackToSignin} className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#81786f] transition hover:text-[#8B4DFF]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>Back to Sign In
          </button>
        )}
      </section>
    </main>
  );
}
