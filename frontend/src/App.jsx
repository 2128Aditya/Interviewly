
import { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Plans from "./pages/Plans.jsx";
import Signup from "./components/Signup.jsx";
import Signin from "./components/Signin.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import DeviceCheck from "./pages/DeviceCheck.jsx";
import InterviewRoom from "./pages/InterviewRoom.jsx";
import Report from "./pages/Report.jsx";
import History from "./pages/History.jsx";
import About from "./pages/About.jsx";
import Terms from "./pages/Terms.jsx";
import Checkout from "./pages/Checkout.jsx";
import PaymentComplete from "./pages/PaymentComplete.jsx";
import CodingPractice from "./pages/CodingPractice.jsx";
import DailyChallenge from "./pages/DailyChallenge.jsx";
import LearningRoadmap from "./pages/LearningRoadmap.jsx";
import ResumeInterview from "./pages/ResumeInterview.jsx";
import UsageDashboard from "./pages/UsageDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import { apiRequest } from "./lib/api.js";

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5100").replace(/\/+$/, "")}/api/auth`;

// Signup API
async function signupUser(payload) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed. Please try again.");
  }

  return data;
}

// Request a password reset email.
async function requestPasswordReset(email) {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Could not request a password reset.");
  return data;
}

// Save a new password using the one-time reset token.
async function completePasswordReset(token, password, confirmPassword) {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password, confirmPassword }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Could not reset the password.");
  return data;
}

// Signin API
async function signinUser(payload) {
  const response = await fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Sign in failed. Please try again.");
  }

  if (!data.token) {
    throw new Error("Login response did not contain an authentication token.");
  }

  localStorage.setItem("interviewly_token", data.token);

  if (data.user) {
    localStorage.setItem("interviewly_user", JSON.stringify(data.user));
  }

  return data;
}

// Email verification page
function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Please wait while we verify your email address."
  );

  const requestStarted = useRef(false);

  useEffect(() => {
    if (requestStarted.current) return;

    requestStarted.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("The verification link is invalid or missing its token.");
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(
          `${API_URL}/verify-email?token=${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Email verification failed. Please try again."
          );
        }

        setStatus("success");
        setMessage(
          data.message || "Your email has been verified successfully."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message || "Unable to verify your email. Please try again."
        );
      }
    }

    verifyEmail();
  }, [searchParams]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#eeeae6] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-[#f7f3ef] bg-[#eeeae6] p-8 text-center shadow-[8px_8px_18px_rgba(180,165,150,0.25),-8px_-8px_18px_rgba(255,252,248,0.9)]">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold ${
            status === "error"
              ? "bg-red-50 text-red-600"
              : status === "success"
                ? "bg-green-50 text-green-700"
                : "bg-[#e8ddff] text-[#8B4DFF]"
          }`}
        >
          {status === "loading" && (
            <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#8B4DFF]/25 border-t-[#8B4DFF]" />
          )}

          {status === "success" && "✓"}
          {status === "error" && "!"}
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#38332f]">
          {status === "loading"
            ? "Verifying your email"
            : status === "success"
              ? "Email verified!"
              : "Verification failed"}
        </h1>

        <p
          className={`mt-3 text-sm leading-6 ${
            status === "error" ? "text-red-700" : "text-[#81786f]"
          }`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>

        {status === "success" && (
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="mt-6 w-full rounded-xl bg-[#8B4DFF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7540df]"
          >
            CONTINUE TO SIGN IN
          </button>
        )}

        {status === "error" && (
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-full rounded-xl bg-[#8B4DFF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7540df]"
            >
              BACK TO SIGN UP
            </button>

            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-sm font-semibold text-[#8B4DFF] hover:underline"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function AdminGate() {
  const [status, setStatus] = useState("checking");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/platform/dashboard")
      .then(async (data) => {
        if (cancelled) return;
        if (!data?.isAdmin) { setStatus("denied"); return; }
        if (sessionStorage.getItem("interviewly_admin_token")) {
          try {
            await apiRequest("/api/platform/admin/analytics");
            if (!cancelled) setStatus("allowed");
            return;
          } catch {
            sessionStorage.removeItem("interviewly_admin_token");
          }
        }
        if (!cancelled) setStatus("password");
      })
      .catch(() => { if (!cancelled) setStatus("denied"); });
    return () => { cancelled = true; };
  }, []);

  const unlock = async (event) => {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true); setError("");
    try {
      const result = await apiRequest("/api/platform/admin/unlock", { method: "POST", body: JSON.stringify({ password }) });
      sessionStorage.setItem("interviewly_admin_token", result.token);
      await apiRequest("/api/platform/admin/analytics");
      setStatus("allowed"); setPassword("");
    } catch (err) {
      sessionStorage.removeItem("interviewly_admin_token");
      setError(err.message || "Could not unlock admin access.");
    } finally { setBusy(false); }
  };

  if (status === "checking") return <main className="flex min-h-[60vh] items-center justify-center bg-[#eeeae6] text-[#38332f]">Checking admin access…</main>;
  if (status === "denied") return <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-[#eeeae6] px-5 text-center text-[#38332f]"><h1 className="text-2xl font-bold">Admin access required</h1><p>This account is not authorized to open the Interviewly admin dashboard.</p><a className="rounded-xl bg-[#7c5ce7] px-5 py-3 font-semibold text-white" href="/">Return home</a></main>;
  if (status === "password") return <main className="flex min-h-[70vh] items-center justify-center bg-[#eeeae6] px-4 py-10 text-[#38332f]"><form onSubmit={unlock} className="w-full max-w-md rounded-3xl border border-white/70 bg-[#f7f5f2] p-7 shadow-xl"><div className="mb-5"><span className="eyebrow">PROTECTED AREA</span><h1 className="mt-2 text-2xl font-bold">Admin password</h1><p className="mt-2 text-sm text-[#81786f]">Enter the admin password to unlock the dashboard for 30 minutes.</p></div><label className="block text-sm font-semibold">Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#ded6ce] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#7c5ce7]/30" /></label>{error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy || !password} className="mt-4 w-full rounded-xl bg-[#7c5ce7] px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "Verifying…" : "Unlock admin dashboard"}</button><a href="/" className="mt-4 block text-center text-sm font-semibold text-[#7c5ce7]">Return home</a></form></main>;
  return <AdminDashboard />;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("interviewly_user") || "null"); } catch { return null; }
  });

  useEffect(() => {
    const sync = () => {
      try { setAuthUser(JSON.parse(localStorage.getItem("interviewly_user") || "null")); } catch { setAuthUser(null); }
    };
    window.addEventListener("interviewly-auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("interviewly-auth-changed", sync); window.removeEventListener("storage", sync); };
  }, []);

  const handleSignin = async (payload) => {
    const data = await signinUser(payload);
    setAuthUser(data.user || null);
    window.dispatchEvent(new Event("interviewly-auth-changed"));
    const next = new URLSearchParams(window.location.search).get("next");
    navigate(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
    return data;
  };

  const handleStartInterview = (round, config) => {
    navigate("/device-check", { state: { config: { ...config, round: round || config?.round || "Role Related" } } });
  };

  const logout = () => {
    const token = localStorage.getItem("interviewly_token");
    if (token) fetch(`${(import.meta.env.VITE_API_URL || "http://localhost:5100").replace(/\/+$/, "")}/api/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    localStorage.removeItem("interviewly_token");
    localStorage.removeItem("interviewly_user");
    sessionStorage.removeItem("interviewly_admin_token");
    setAuthUser(null);
    window.dispatchEvent(new Event("interviewly-auth-changed"));
    navigate("/");
  };

  const protectedPage = (element) => authUser ? element : <Navigate to="/signin" replace />;

  return (
    <>
      <Navbar user={authUser} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home onSignup={signupUser} onSignin={handleSignin} onStartInterview={handleStartInterview} isAuthenticated={Boolean(authUser)} />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/coding-practice" element={protectedPage(<CodingPractice />)} />
        <Route path="/daily-challenge" element={protectedPage(<DailyChallenge />)} />
        <Route path="/roadmap" element={protectedPage(<LearningRoadmap />)} />
        <Route path="/resume-interview" element={protectedPage(<ResumeInterview />)} />
        <Route path="/dashboard" element={protectedPage(<UsageDashboard />)} />
        <Route path="/profile" element={protectedPage(<Profile />)} />
        <Route path="/admin" element={protectedPage(<AdminGate />)} />
        <Route path="/checkout" element={protectedPage(<Checkout />)} />
        <Route path="/payment/complete" element={protectedPage(<PaymentComplete />)} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/history" element={protectedPage(<History />)} />
        <Route path="/device-check" element={protectedPage(<DeviceCheck />)} />
        <Route path="/interview/:id" element={protectedPage(<InterviewRoom />)} />
        <Route path="/report/:id" element={protectedPage(<Report />)} />
        <Route path="/signup" element={<Signup onSignup={signupUser} onLoginClick={() => navigate("/signin")} />} />
        <Route path="/signin" element={<Signin onSignin={handleSignin} onSignupClick={() => navigate("/signup")} onForgotPassword={() => navigate("/forgot-password")} />} />
        <Route path="/forgot-password" element={<ForgotPassword onResetPassword={requestPasswordReset} onBackToSignin={() => navigate("/signin")} />} />
        <Route path="/reset-password" element={<ForgotPassword onResetPassword={requestPasswordReset} onCompleteReset={completePasswordReset} onBackToSignin={() => navigate("/signin")} />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#eeeae6] px-4 text-center"><h1 className="text-3xl font-bold text-[#38332f]">Page not found</h1><button type="button" onClick={() => navigate("/")} className="mt-5 rounded-xl bg-[#8B4DFF] px-6 py-3 text-sm font-bold text-white">GO TO HOME</button></main>} />
      </Routes>
      {!location.pathname.startsWith("/interview/") && location.pathname !== "/admin" && <Footer />}
    </>
  );
}

export default App;
