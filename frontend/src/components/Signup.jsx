
import { useState } from "react";

const PURPLE = "#8B4DFF";

const insetShadow =
  "inset 4px 4px 8px rgba(180,165,150,0.30), inset -4px -4px 8px rgba(255,252,248,0.95)";

const raisedShadow =
  "5px 5px 10px rgba(180,165,150,0.28), -5px -5px 10px rgba(255,252,248,0.95)";

export default function Signup({
  onSignup,
  onGoogleSignup,
  onLoginClick,
  loading = false,
  error = "",
  successMessage = "",
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");

  const update = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setLocalError("");
    setLocalSuccess("");
  };

  const togglePassword = (field) => {
    if (field === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

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

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-[#e5ded5] bg-[#eeeae6] px-4 text-sm font-normal text-[#38332f] outline-none transition focus:border-[#b9a0ff] focus:ring-2 focus:ring-[#8B4DFF]/10";

  const submit = async (event) => {
    event.preventDefault();

    setLocalError("");
    setLocalSuccess("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setLocalError("Please enter your first and last name.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    if (form.password.length > 128) {
      setLocalError("Password must be 128 characters or fewer.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (!onSignup) {
      setLocalError("Signup is not connected to authentication yet.");
      return;
    }

    try {
      const result = await onSignup({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setLocalSuccess(
        result?.message ||
          "Verification email sent. Please check your inbox."
      );

      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setLocalError(
        err?.message || "Unable to create your account. Please try again."
      );
    }
  };

  const displayedError = localError || error;
  const displayedSuccess = localSuccess || successMessage;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eeeae6] px-4 py-8 font-sans text-[#38332f]">
      <section
        className="my-4 w-full max-w-[560px] rounded-[28px] border border-[#f7f3ef] bg-[#eeeae6] px-6 py-7 sm:px-9 sm:py-8"
        style={{ boxShadow: raisedShadow }}
      >
        {/* Header */}
        <header className="mb-6 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eeeae6] text-[#8B4DFF]"
            style={{ boxShadow: insetShadow }}
          >
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="8" r="3.5" />
              <path d="M3 20v-1.5A5.5 5.5 0 018.5 13h1A5.5 5.5 0 0115 18.5V20" />
              <path d="M16 5.5a3.5 3.5 0 010 6.8" />
              <path d="M17 14a5 5 0 014 4.9V20" />
            </svg>
          </div>

          <h1 className="text-[27px] font-bold leading-tight tracking-[-0.8px] text-[#38332f]">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#81786f]">
            Join Interviewly and start preparing for your next interview.
          </p>
        </header>

        {onGoogleSignup && (
          <>
          {/* Google Signup */}
          <button
            type="button"
            onClick={onGoogleSignup}
            disabled={loading || !onGoogleSignup}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#f7f3ef] bg-[#eeeae6] text-sm font-semibold text-[#38332f] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ boxShadow: raisedShadow }}
          >
            <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true">
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
          <div className="my-5 flex items-center gap-3 text-[11px] font-semibold tracking-wider text-[#a39a90]">
            <span className="h-px flex-1 bg-[#dcd4ca]" />
            OR SIGN UP WITH EMAIL
            <span className="h-px flex-1 bg-[#dcd4ca]" />
          </div>

          </>
        )}

        <form onSubmit={submit} className="space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#625a52]">
              First Name
              <input
                className={inputClass}
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={update}
                autoComplete="given-name"
                maxLength={50}
                required
                style={{ boxShadow: insetShadow }}
              />
            </label>

            <label className="block text-sm font-semibold text-[#625a52]">
              Last Name
              <input
                className={inputClass}
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={update}
                autoComplete="family-name"
                maxLength={50}
                required
                style={{ boxShadow: insetShadow }}
              />
            </label>
          </div>

          {/* Email */}
          <label className="block text-sm font-semibold text-[#625a52]">
            Email Address
            <input
              className={inputClass}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update}
              autoComplete="email"
              maxLength={254}
              required
              style={{ boxShadow: insetShadow }}
            />
          </label>

          {/* Password fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#625a52]">
              Password
              <span className="relative block">
                <input
                  className={`${inputClass} pr-11`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={update}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  style={{ boxShadow: insetShadow }}
                />

                <button
                  type="button"
                  onClick={() => togglePassword("password")}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81786f] transition hover:text-[#8B4DFF]"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </span>
            </label>

            <label className="block text-sm font-semibold text-[#625a52]">
              Confirm Password
              <span className="relative block">
                <input
                  className={`${inputClass} pr-11`}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={update}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  style={{ boxShadow: insetShadow }}
                />

                <button
                  type="button"
                  onClick={() => togglePassword("confirmPassword")}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81786f] transition hover:text-[#8B4DFF]"
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </span>
            </label>
          </div>

          {/* Error */}
          {displayedError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"
            >
              {displayedError}
            </p>
          )}

          {/* Success */}
          {displayedSuccess && (
            <p
              role="status"
              className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm leading-5 text-green-800"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-green-700 font-bold">
                ✓
              </span>
              <span>{displayedSuccess}</span>
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold tracking-wide text-white transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: PURPLE,
              boxShadow: "4px 4px 9px rgba(180,165,150,0.25)",
            }}
          >
            {loading ? "SENDING VERIFICATION EMAIL..." : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* Signin Link */}
        <p className="mt-5 text-center text-sm text-[#81786f]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLoginClick}
            className="font-bold text-[#8B4DFF] transition hover:text-[#6840c9]"
          >
            Sign In
          </button>
        </p>
      </section>
    </main>
  );
}
