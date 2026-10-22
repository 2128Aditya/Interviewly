
import { useState } from "react";

const PURPLE = "#8B4DFF";

const insetShadow =
  "inset 4px 4px 8px rgba(180,165,150,0.30), inset -4px -4px 8px rgba(255,252,248,0.95)";

const raisedShadow =
  "5px 5px 10px rgba(180,165,150,0.28), -5px -5px 10px rgba(255,252,248,0.95)";

export default function Signin({
  onSignin,
  onGoogleSignin,
  onSignupClick,
  onForgotPassword,
  loading = false,
  error = "",
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const isLoading = loading || localLoading;

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-[#e5ded5] bg-[#eeeae6] px-4 text-sm font-normal text-[#38332f] outline-none transition focus:border-[#b9a0ff] focus:ring-2 focus:ring-[#8B4DFF]/10";

  const EyeIcon = ({ visible }) => (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a16 16 0 01-3.1 3.8" />
          <path d="M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a9.7 9.7 0 003.1-.5" />
        </>
      ) : (
        <>
          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
          <circle cx="12" cy="12" r="2.7" />
        </>
      )}
    </svg>
  );

  const submit = async (event) => {
    event.preventDefault();
    setLocalError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (!onSignin) {
      setLocalError("Sign in is not connected to authentication yet.");
      return;
    }

    try {
      setLocalLoading(true);

      await onSignin({
        email: normalizedEmail,
        password,
      });
    } catch (err) {
      setLocalError(
        err?.message || "Could not sign in. Please check your details."
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setLocalError("");

    if (!onGoogleSignin) {
      setLocalError("Google sign in is not configured yet.");
      return;
    }

    try {
      setLocalLoading(true);
      await onGoogleSignin();
    } catch (err) {
      setLocalError(
        err?.message || "Google sign in failed. Please try again."
      );
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eeeae6] px-4 py-10 font-sans text-[#38332f]">
      <section
        className="w-full max-w-[440px] rounded-[28px] border border-[#f7f3ef] bg-[#eeeae6] px-6 py-8 sm:px-9"
        style={{ boxShadow: raisedShadow }}
      >
        {/* Header */}
        <header className="mb-7 text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eeeae6] text-[#8B4DFF]"
            style={{ boxShadow: insetShadow }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4" y="10" width="16" height="11" rx="3" />
              <path d="M8 10V7a4 4 0 018 0v3" />
              <circle cx="12" cy="15" r="1" />
              <path d="M12 16v2" />
            </svg>
          </div>

          <h1 className="text-[27px] font-bold tracking-[-0.8px] text-[#38332f]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#81786f]">
            Sign in to continue your Interviewly journey.
          </p>
        </header>

        {onGoogleSignin && (
          <>
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignin}
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#f7f3ef] bg-[#eeeae6] text-sm font-semibold text-[#38332f] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ boxShadow: raisedShadow }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#FFC107"
                d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 01-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z"
              />
              <path
                fill="#FF3D00"
                d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0024 44z"
              />
              <path
                fill="#4CAF50"
                d="M12.6 27.6a12 12 0 010-7.2v-5.3H5.8a20 20 0 000 17.8l6.8-5.3z"
              />
              <path
                fill="#1976D2"
                d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 005.8 15.1l6.8 5.3C14.2 15.7 18.7 12.1 24 12.1z"
              />
            </svg>

            CONTINUE WITH GOOGLE
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 text-xs font-semibold tracking-wider text-[#a39a90]">
            <span className="h-px flex-1 bg-[#dcd4ca]" />
            OR CONTINUE WITH EMAIL
            <span className="h-px flex-1 bg-[#dcd4ca]" />
          </div>

          </>
        )}

        <form onSubmit={submit} className="space-y-5">
          {/* Email */}
          <label className="block text-sm font-semibold text-[#625a52]">
            Email Address
            <input
              className={inputClass}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setLocalError("");
              }}
              autoComplete="email"
              maxLength={254}
              required
              style={{ boxShadow: insetShadow }}
            />
          </label>

          {/* Password */}
          <label className="block text-sm font-semibold text-[#625a52]">
            Password

            <span className="relative block">
              <input
                className={`${inputClass} pr-12`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setLocalError("");
                }}
                autoComplete="current-password"
                required
                style={{ boxShadow: insetShadow }}
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81786f] transition hover:text-[#8B4DFF]"
              >
                <EyeIcon visible={showPassword} />
              </button>
            </span>
          </label>

          {/* Error */}
          {(localError || error) && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"
            >
              {localError || error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: PURPLE,
              boxShadow: "4px 4px 9px rgba(180,165,150,0.25)",
            }}
          >
            {isLoading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-[#81786f] transition hover:text-[#8B4DFF]"
          >
            Forgot password?
          </button>
        </div>

        {/* Signup Link */}
        <p className="mt-5 text-center text-sm text-[#81786f]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSignupClick}
            className="font-bold text-[#8B4DFF] transition hover:text-[#6840c9]"
          >
            Sign up
          </button>
        </p>
      </section>
    </main>
  );
}
