import { useEffect, useState } from "react";
import InterviewSetupModal from "../components/InterviewSetupModal";
import Signup from "../components/Signup";
import Signin from "../components/Signin";
import ForgotPassword from "../components/ForgotPassword";
import { apiRequest } from "../lib/api.js";
import demoVideo from "../assets/demo.mp4";

import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BarChart3,
  CheckCircle2,
  Lightbulb,
  MessageCircle,
  Mic,
  PhoneOff,
  Rocket,
  Sparkles,
  Target,
  Video,
} from "lucide-react";

const C = {
  page: "#F1F5F8",
  text: "#152B4F",
  muted: "#7183A3",
  green: "#079B79",
  greenDark: "#057A64",
  blue: "#438CFF",
  blueLight: "#E2EDFF",
};

const raised = {
  boxShadow: "5px 5px 13px #DDE3EA, -5px -5px 13px #FFFFFF",
};

const types = [
  {
    title: "Technical Interview",
    desc: "Practise DSA, programming, JavaScript and core computer science concepts.",
    tag: "TECHNICAL",
  },
  {
    title: "HR Interview",
    desc: "Prepare for introduction, strengths, weaknesses and behavioral questions.",
    tag: "COMMUNICATION",
  },
  {
    title: "Mixed Interview",
    desc: "Combine technical questions and HR rounds in one practice session.",
    tag: "FULL PRACTICE",
  },
];

const features = [
  {
    title: "Realistic Interview Practice",
    desc: "Prepare for real interview situations with structured practice sessions.",
    tag: "01",
  },
  {
    title: "Role-Based Questions",
    desc: "Practise questions related to your target job role and technical skills.",
    tag: "02",
  },
  {
    title: "Performance Insights",
    desc: "Review your answers and identify areas that need more preparation.",
    tag: "03",
  },
  {
    title: "Communication Skills",
    desc: "Build clarity, confidence and a better way of explaining your answers.",
    tag: "04",
  },
];

/* =========================
   LEFT HERO CARD
========================= */

function PracticeStudio({ onStart }) {
  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] p-4 sm:p-5 lg:p-6"
      style={{
        background:
          "linear-gradient(145deg, #FAFCF7 0%, #EAF8F2 55%, #DDF4E9 100%)",
        boxShadow:
          "inset 7px 7px 16px rgba(194, 214, 205, 0.72), inset -7px -7px 16px rgba(255, 255, 255, 0.96)",
      }}
    >
      {/* Compact header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold tracking-[0.16em] text-slate-500">
          INTERVIEWLY STUDIO
        </span>

        <button
          type="button"
          onClick={() => onStart("Mixed Interview")}
          className="rounded-full px-3 py-1.5 text-[10px] font-semibold text-emerald-800 transition hover:text-emerald-950"
          style={{
            background: "#EAF8F2",
            boxShadow:
              "inset 3px 3px 7px #D0E6DA, inset -3px -3px 7px #FFFFFF",
          }}
        >
          Start Preparation
        </button>
      </div>

      {/* Illustration area */}
      <div
        className="relative mt-4 min-h-[190px] flex-1 overflow-hidden rounded-[23px] sm:min-h-[230px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 85%, #BDEBD8 0%, #EDF8F1 55%, #F8FCF7 100%)",
        }}
      >
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[18px] border-emerald-100/80" />
        <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-emerald-100/70" />

        {/* Floating cards */}
        <div className="absolute left-[7%] top-[17%] rotate-[-7deg] rounded-2xl bg-white p-3 shadow-md">
          <MessageCircle size={23} className="text-emerald-500" />
        </div>

        <div className="absolute right-[8%] top-[13%] rotate-[6deg] rounded-2xl bg-white p-3 shadow-md">
          <Lightbulb size={25} className="text-amber-400" />
        </div>

        <div className="absolute bottom-[19%] left-[10%] rounded-xl bg-white p-2.5 shadow-md">
          <BarChart3 size={23} className="text-violet-500" />
        </div>

        <div className="absolute right-[8%] bottom-[23%] rounded-xl bg-white p-3 shadow-md">
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <div className="h-1 w-7 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Candidate illustration */}
        <div className="absolute inset-x-0 bottom-0 flex h-[88%] items-end justify-center">
          <div className="relative flex h-full w-[62%] max-w-[275px] items-end justify-center">
            <div
              className="absolute bottom-[43%] z-10 h-[34%] w-[39%] rounded-t-[48%] rounded-b-[35%]"
              style={{
                background: "linear-gradient(135deg, #5C3329, #241E29)",
              }}
            />

            <div className="absolute bottom-[41%] z-20 h-[29%] w-[30%] rounded-[43%] bg-[#DFA078]">
              <div className="absolute left-[20%] top-[44%] h-[3px] w-[3px] rounded-full bg-slate-800" />
              <div className="absolute right-[20%] top-[44%] h-[3px] w-[3px] rounded-full bg-slate-800" />
              <div className="absolute bottom-[22%] left-[39%] h-[2px] w-[22%] rounded-full bg-[#A85F49]" />
            </div>

            <div
              className="absolute bottom-[31%] z-10 h-[12%] w-[13%]"
              style={{ background: "#DFA078" }}
            />

            <div
              className="absolute bottom-[-5%] z-20 h-[43%] w-[79%] rounded-t-[46%] rounded-b-[12%]"
              style={{
                background: "linear-gradient(110deg, #08765B, #22B789)",
              }}
            />

            <div
              className="absolute bottom-[1%] z-30 h-[25%] w-[82%] rounded-t-xl"
              style={{
                background: "linear-gradient(145deg, #34404F, #121923)",
              }}
            >
              <div className="absolute inset-x-[4%] top-[5%] h-[88%] rounded-t-lg bg-gradient-to-br from-slate-600 to-slate-800" />
              <div className="absolute -bottom-[5%] -left-[6%] h-[8%] w-[112%] rounded-full bg-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Three compact highlights */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          {
            icon: Target,
            title: "Practice",
            desc: "Real questions",
            color: "#079B79",
            bg: "#DDF7ED",
          },
          {
            icon: BarChart3,
            title: "Improve",
            desc: "Better answers",
            color: "#7358E8",
            bg: "#ECE7FF",
          },
          {
            icon: Rocket,
            title: "Get Ready",
            desc: "Build confidence",
            color: "#F07145",
            bg: "#FFF0E8",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex min-w-0 items-center gap-2 rounded-2xl bg-white/75 p-2 sm:p-3"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                style={{ background: item.bg, color: item.color }}
              >
                <Icon size={16} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-slate-800 sm:text-xs">
                  {item.title}
                </p>
                <p className="mt-0.5 hidden truncate text-[9px] text-slate-500 sm:block">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main action */}
      <button
        type="button"
        onClick={() => onStart("Mixed Interview")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          background: "linear-gradient(100deg, #078A6D, #35C895)",
          boxShadow:
            "inset 2px 2px 5px rgba(0, 92, 69, 0.22), inset -2px -2px 5px rgba(255, 255, 255, 0.18), 4px 4px 9px rgba(191, 211, 202, 0.55)",
        }}
      >
        Start Interview
        <ArrowRight size={17} />
      </button>

      <p className="mt-3 text-center text-[10px] text-slate-500">
        Practise at your own pace · Get ready for your next opportunity
      </p>
    </section>
  );
}

/* =========================
   RIGHT HERO CARD
========================= */

function CandidatePreview() {
  return (
    <div
      className="relative flex min-h-[220px] flex-col overflow-hidden rounded-[21px] p-3 sm:min-h-0 sm:p-3.5"
      style={{
        background: "linear-gradient(145deg, #E4EDFB, #D8E7FC)",
        boxShadow:
          "inset 3px 3px 7px #CDD9EB, inset -3px -3px 7px #FFFFFF",
      }}
    >
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="rounded-full bg-white/90 px-2.5 py-1.5 text-[9px] font-bold text-slate-700">
          CANDIDATE
        </span>

        <span className="flex items-center gap-1 text-[9px] font-medium text-slate-700">
          <Video size={13} />
          Video preview
        </span>
      </div>

      {/* Real video from src/assets/demo.mp4 fills the candidate preview area. */}
      <div className="relative mt-2 min-h-[300px] flex-1 overflow-hidden rounded-xl bg-[#B9D1F2] sm:min-h-0">
        <video
          className="pointer-events-none block h-full min-h-[300px] w-full select-none rounded-xl object-cover sm:min-h-0"
          src={demoVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          draggable={false}
          aria-label="AI interviewer video preview"
          onContextMenu={(event) => event.preventDefault()}
          onError={(event) => console.error("Could not load src/assets/demo.mp4", event.currentTarget.error)}
        />
      </div>

      <div className="relative z-10 flex justify-center gap-2">
        {[Mic, Video].map((Icon, index) => (
          <div
            key={index}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80"
            style={{
              boxShadow: "0 3px 10px rgba(62, 98, 154, .1)",
              color: C.blue,
            }}
          >
            <Icon size={16} />
          </div>
        ))}

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "#FFE8ED", color: "#F04465" }}
        >
          <PhoneOff size={16} />
        </div>
      </div>
    </div>
  );
}

function AIQuestionPanel() {
  return (
    <div
      className="flex min-h-[220px] flex-col rounded-[21px] p-3 sm:min-h-0 sm:p-3.5"
      style={{
        background: "linear-gradient(145deg, #F9FBFF, #EEF4FC)",
        boxShadow: "5px 5px 12px #DDE5EF, -4px -4px 10px #FFFFFF",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "#DCEAFF", color: C.blue }}
        >
          <Sparkles size={20} />
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
            AI Interviewer
          </h3>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Technical Interview
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/80 p-3">
        <p className="text-[9px] font-bold uppercase tracking-wide text-blue-500">
          YOUR QUESTION
        </p>

        <p className="mt-2 text-xs font-medium leading-[1.6] text-slate-800">
          Can you explain the difference between let, const and var in
          JavaScript?
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-bold text-slate-500 sm:text-[10px]">
            INTERVIEW PROGRESS
          </p>
          <span className="text-[10px] font-semibold text-blue-500">40%</span>
        </div>

        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: item <= 2 ? C.blue : "#D8E0EC" }}
            />
          ))}
        </div>

        <p className="mt-2 text-[10px] text-slate-500">
          Question 2 of 5
        </p>
      </div>

      <div
        className="mt-auto flex items-center gap-2 rounded-xl p-2.5"
        style={{ background: "#DFEBFF" }}
      >
        <AudioLines size={17} className="shrink-0 text-blue-500" />
        <span className="text-[10px] font-semibold text-slate-700">
          AI interview preview
        </span>
      </div>
    </div>
  );
}

function InterviewRoom({ onStart }) {
  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-blue-100/90 p-4 sm:p-5 lg:p-6"
      style={{
        background: "linear-gradient(145deg, #F8FAFF, #E8F0FD)",
        boxShadow:
          "inset 7px 7px 16px rgba(197, 211, 232, 0.78), inset -7px -7px 16px rgba(255, 255, 255, 0.96)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold tracking-[0.12em] text-slate-500 sm:text-[10px]">
            YOUR NEXT PRACTICE SESSION
          </p>

          <h2 className="mt-1.5 text-base font-bold tracking-tight text-[#152B4F] sm:text-xl">
            Meet your AI interviewer
          </h2>
        </div>

        <span
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-2 text-[9px] font-semibold text-slate-700 sm:text-[10px]"
          style={raised}
        >
          <Video size={14} />
          Video preview
        </span>
      </div>

      <div className="mt-4 grid flex-1 gap-3 sm:grid-cols-[1.08fr_0.92fr]">
        <CandidatePreview />
        <AIQuestionPanel />
      </div>

      <div
        className="mt-3 flex items-center gap-3 rounded-[20px] bg-white/75 p-3"
        style={{ boxShadow: "0 4px 14px rgba(62, 98, 154, .06)" }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "#DCEAFF", color: C.blue }}
        >
          <Lightbulb size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-800 sm:text-sm">
            Think. Answer. Improve.
          </p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
            Prepare for interviews with focused practice and feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onStart("Mixed Interview")}
          className="shrink-0 rounded-xl px-3 py-2 text-[10px] font-semibold text-blue-700 transition hover:text-blue-900 sm:text-xs"
          style={{
            background: "#C9D9F5",
            boxShadow:
              "inset 3px 3px 7px #AEBFDF, inset -3px -3px 7px #E7F0FF",
          }}
        >
          Start Preparation
        </button>
      </div>
    </section>
  );
}

/* =========================
   LOWER SECTIONS
========================= */

function InterviewSetup({ onStart }) {
  return (
    <section id="practice" className="mt-14 scroll-mt-24 sm:mt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
        FIND YOUR STARTING POINT
      </p>

      <h2 className="mt-3 text-2xl font-semibold text-slate-800 sm:text-3xl">
        Pick your next challenge
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Select the round you want to prepare for.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {types.map((item) => (
          <button
            type="button"
            key={item.title}
            onClick={() => onStart(item.title)}
            className="group rounded-[24px] p-6 text-left transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "#F0ECE7",
              boxShadow:
                "9px 9px 19px #D3CEC8, -9px -9px 19px #FFFFFF",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold tracking-[0.15em] text-emerald-700">
                {item.tag}
              </span>

              <span className="text-xs text-slate-400">Explore</span>
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              {item.title}
            </h3>

            <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
              {item.desc}
            </p>

            <div
              className="mt-5 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-emerald-800 transition-all group-hover:text-emerald-950"
              style={{
                background: "#F0ECE7",
                boxShadow:
                  "inset 4px 4px 8px #D3CEC8, inset -4px -4px 8px #FFFFFF",
              }}
            >
              Start preparation
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section id="features" className="mt-16 scroll-mt-24">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
        THE INTERVIEWLY EXPERIENCE
      </p>

      <h2 className="mt-3 text-2xl font-semibold text-slate-800 sm:text-3xl">
        A better way to get interview-ready
      </h2>

      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
        Build your preparation routine with focused practice and a clear path
        towards improvement.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((item) => (
          <div
            key={item.tag}
            className="group rounded-[24px] p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6"
            style={{
              background: "#F0ECE7",
              boxShadow:
                "9px 9px 19px #D3CEC8, -9px -9px 19px #FFFFFF",
            }}
          >
            <p className="text-xs font-semibold tracking-[0.15em] text-emerald-700">
              {item.tag}
            </p>

            <div className="mt-4 h-px w-full bg-slate-300/60" />

            <h3 className="mt-5 text-base font-semibold leading-6 text-slate-800">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {item.desc}
            </p>

            <p className="mt-5 text-xs font-medium text-emerald-800 transition-colors group-hover:text-emerald-950">
              Made for your progress
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA({ onStart }) {
  return (
    <section className="mt-16">
      <div
        className="flex flex-col items-start justify-between gap-6 rounded-[28px] p-6 transition-all sm:flex-row sm:items-center sm:p-8 lg:p-10"
        style={{
          background: "#F0ECE7",
          boxShadow:
            "10px 10px 22px #D3CEC8, -10px -10px 22px #FFFFFF",
        }}
      >
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            YOUR NEXT CHAPTER
          </p>

          <h2 className="mt-3 text-2xl font-semibold leading-tight text-slate-800 sm:text-3xl">
            Your preparation starts here.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Take the time to practise, strengthen your answers and feel more
            prepared for the opportunities ahead.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onStart("Mixed Interview")}
          className="flex shrink-0 items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5"
          style={{
            background: "#F0ECE7",
            boxShadow:
              "6px 6px 13px #D3CEC8, -6px -6px 13px #FFFFFF",
          }}
        >
          Begin your preparation
          <span className="text-lg">→</span>
        </button>
      </div>
    </section>
  );
}

/* =========================
   HOME PAGE
========================= */

export default function Home({
  onStartInterview,
  onSignup,
  onSignin,
  onGoogleSignup,
  onGoogleSignin,
  onResetPassword,
  isAuthenticated = false,
}) {
  const [setupOpen, setSetupOpen] = useState(false);
  const [initialRound, setInitialRound] = useState("Role Related");
  const [authPage, setAuthPage] = useState(null);
  const [pendingInterview, setPendingInterview] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [maxDurationMinutes, setMaxDurationMinutes] = useState(5);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated) {
      setMaxDurationMinutes(5);
      return () => { cancelled = true; };
    }
    apiRequest("/api/platform/dashboard")
      .then((data) => {
        if (cancelled) return;
        const plan = String(data?.user?.plan || "free").toLowerCase();
        setMaxDurationMinutes(plan === "premium" ? 30 : plan === "pro" ? 15 : 5);
      })
      .catch(() => { if (!cancelled) setMaxDurationMinutes(5); });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Allows the Navbar's Get Started button to open this same modal.
  useEffect(() => {
    const openSetup = (event) => {
      const requestedRound = event?.detail?.round;
      setInitialRound(requestedRound || "Role Related");
      setSetupOpen(true);
    };

    window.addEventListener("open-interview-setup", openSetup);
    return () => window.removeEventListener("open-interview-setup", openSetup);
  }, []);

  const handleStart = (type) => {
    // Keep the user's selected interview category as the closest matching round.
    const mappedRound =
      type === "HR Interview"
        ? "Behavioral"
        : type === "Technical Interview"
          ? "Role Related"
          : "Role Related";

    setInitialRound(mappedRound);
    setSetupOpen(true);
  };

  const handleSubmitSetup = (config) => {
    // Full configuration (including selected role and resume File) is passed
    // as the second argument to preserve compatibility with an existing callback.
    if (onStartInterview) {
      onStartInterview(config.round, config);
    } else {
      console.info("Interview setup ready. Connect onStartInterview to start the interview room.", config);
    }
  };

  const finishAuthentication = () => {
    setAuthPage(null);
    setAuthError("");
    setAuthLoading(false);

    const config = pendingInterview;
    setPendingInterview(null);

    // Continue with the interview configuration the user already filled in.
    if (config) handleSubmitSetup(config);
  };

  const handleSignup = async (payload) => {
    if (!onSignup) {
      throw new Error("Signup is not connected yet. Connect the onSignup handler to your backend or Firebase Auth.");
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const result = await onSignup(payload);
      // Signup only sends a verification email; it is not a logged-in session.
      // Keep the signup screen open so the user can verify and then sign in.
      return result ?? true;
    } catch (error) {
      setAuthError(error?.message || "Unable to create your account.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignin = async (payload) => {
    if (!onSignin) {
      throw new Error("Sign in is not connected yet. Connect the onSignin handler to your backend or Firebase Auth.");
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const result = await onSignin(payload);
      if (result === false) return false;
      finishAuthentication();
      return result ?? true;
    } catch (error) {
      setAuthError(error?.message || "Unable to sign in.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async (handler) => {
    if (!handler) {
      setAuthError("Google authentication is not connected yet.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const result = await handler();
      if (result !== false) finishAuthentication();
    } catch (error) {
      setAuthError(error?.message || "Google authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (email) => {
    if (!onResetPassword) {
      throw new Error("Password reset is not connected yet. Connect onResetPassword to your auth provider.");
    }
    setAuthLoading(true);
    setAuthError("");
    setResetSuccess("");
    try {
      const result = await onResetPassword(email);
      if (result === false) return false;
      setResetSuccess("If an account exists for this email, a password reset link has been sent.");
      return result ?? true;
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth screens cover the site while preserving the pending interview setup.
  if (authPage === "signup") {
    return (
      <Signup
        onSignup={handleSignup}
        onGoogleSignup={() => handleGoogleAuth(onGoogleSignup)}
        onLoginClick={() => { setAuthError(""); setAuthPage("signin"); }}
        loading={authLoading}
        error={authError}
      />
    );
  }

  if (authPage === "signin") {
    return (
      <Signin
        onSignin={handleSignin}
        onGoogleSignin={() => handleGoogleAuth(onGoogleSignin)}
        onSignupClick={() => { setAuthError(""); setAuthPage("signup"); }}
        onForgotPassword={() => { setAuthError(""); setResetSuccess(""); setAuthPage("forgot"); }}
        loading={authLoading}
        error={authError}
      />
    );
  }

  if (authPage === "forgot") {
    return (
      <ForgotPassword
        onResetPassword={handleResetPassword}
        onBackToSignin={() => { setAuthError(""); setResetSuccess(""); setAuthPage("signin"); }}
        loading={authLoading}
        error={authError}
        successMessage={resetSuccess}
      />
    );
  }

  return (
    <>
      <main
        className="w-full overflow-hidden"
        style={{
          background: C.page,
          color: C.text,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div className="mx-auto w-full max-w-[1800px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          {/* Keep the existing homepage design unchanged */}
          <div
            className="
              grid items-stretch gap-5
              lg:h-[calc(100svh-115px)]
              lg:min-h-[540px]
              lg:max-h-[720px]
              lg:grid-cols-2
              xl:gap-6
            "
          >
            <InterviewRoom onStart={handleStart} />
            <PracticeStudio onStart={handleStart} />
          </div>

          <InterviewSetup onStart={handleStart} />
          <FeatureSection />
          <FinalCTA onStart={handleStart} />
        </div>
      </main>

      <InterviewSetupModal
        open={setupOpen}
        isAuthenticated={isAuthenticated}
        maxDurationMinutes={maxDurationMinutes}
        onClose={() => setSetupOpen(false)}
        onStart={handleSubmitSetup}
        initialRound={initialRound}
        onRequireSignup={(config) => {
          setPendingInterview(config);
          setAuthError("");
          setAuthPage("signup");
        }}
      />
    </>
  );
}