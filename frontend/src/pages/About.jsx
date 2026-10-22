
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Heart,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Target,
    number: "01",
    title: "Focused practice",
    description:
      "Prepare for your target role with relevant questions, structured practice sessions, and a clearer direction for your preparation.",
    color: "bg-sky-100 text-sky-700",
    border: "hover:border-sky-300",
  },
  {
    icon: MessageSquareText,
    number: "02",
    title: "Meaningful feedback",
    description:
      "Understand where your answers can improve, organize your thoughts better, and learn to communicate with confidence.",
    color: "bg-pink-100 text-pink-700",
    border: "hover:border-pink-300",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Track your progress",
    description:
      "Keep your completed practice sessions and reports organized so you can reflect on your journey and keep improving.",
    color: "bg-violet-100 text-violet-700",
    border: "hover:border-violet-300",
  },
];

const steps = [
  {
    icon: Target,
    title: "Choose your goal",
    description:
      "Start with the role or interview type you want to prepare for, and make every practice session purposeful.",
    color: "bg-sky-100 text-sky-700",
  },
  {
    icon: Video,
    title: "Practice your answers",
    description:
      "Work through interview questions, express your ideas, and become more comfortable answering under pressure.",
    color: "bg-pink-100 text-pink-700",
  },
  {
    icon: TrendingUp,
    title: "Review and improve",
    description:
      "Use available feedback and your practice history to identify improvement areas and plan what to work on next.",
    color: "bg-violet-100 text-violet-700",
  },
];

const values = [
  {
    icon: Heart,
    title: "Learn at your pace",
    text: "Build a practice routine that fits your schedule, experience, and career goals.",
  },
  {
    icon: ShieldCheck,
    title: "Practice with purpose",
    text: "Focus on learning and preparation instead of treating every interview as a pass-or-fail moment.",
  },
  {
    icon: BrainCircuit,
    title: "Keep getting better",
    text: "Use every practice session as an opportunity to reflect, learn, and develop your skills.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAFF] text-slate-800">
      {/* HERO */}
      <section className="relative px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <Sparkles size={16} className="text-pink-500" />
              GET TO KNOW INTERVIEWLY
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your next opportunity
              <span className="mt-1 block bg-gradient-to-r from-pink-500 via-violet-500 to-sky-500 bg-clip-text pb-2 text-transparent">
                starts with practice.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Interviews can feel challenging. Knowing what to say, explaining
              your ideas clearly, and staying confident takes practice.
              Interviewly helps you prepare with purpose, practice your answers,
              and take the next step toward your career goals.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-interview-setup")
                  );
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Start preparing
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white/90 px-6 py-3 font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-sky-50"
              >
                Explore Interviewly
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Structured preparation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Practice at your pace
              </span>
            </div>
          </div>

          {/* Decorative illustration made with UI elements */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full bg-pink-200/70 blur-2xl" />
            <div className="absolute -bottom-5 -left-4 h-28 w-28 rounded-full bg-sky-200/70 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-sky-100 via-white to-pink-100 p-5 shadow-2xl shadow-sky-900/10 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Your preparation space
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    Ready for your next interview?
                  </h2>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                  <BrainCircuit size={25} />
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white bg-white/90 p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <Video size={23} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">
                      Mock interview
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Practice in a focused environment
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Practice
                  </span>
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                      <MessageSquareText size={20} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Your interview question
                    </p>
                  </div>
                  <p className="mt-4 text-base font-semibold leading-7 text-slate-800">
                    “Tell me about yourself and what makes you a good fit for
                    this role.”
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-1.5 flex-1 rounded-full bg-sky-500" />
                    <span className="h-1.5 flex-1 rounded-full bg-sky-200" />
                    <span className="h-1.5 flex-1 rounded-full bg-sky-200" />
                    <span className="h-1.5 flex-1 rounded-full bg-sky-200" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-pink-50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Every answer is a chance to grow
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Practice, reflect, and try again.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white bg-white/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <Target size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Small steps. Real progress.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Your journey, your pace.
                    </p>
                  </div>
                </div>
                <ArrowDownRight size={20} className="text-violet-500" />
              </div>
            </div>

            <div className="absolute -left-3 top-1/3 hidden items-center gap-2 rounded-2xl border border-white bg-white px-4 py-3 shadow-lg sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                <Heart size={18} />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Keep growing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
              WHO WE ARE
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Preparation should feel like progress, not pressure.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Interviewly is an interview preparation platform designed to
              support candidates as they build confidence and sharpen their
              communication. It brings practice and learning into one place,
              helping you approach interviews with more clarity and a better
              understanding of your strengths and improvement areas.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Whether you are preparing for your first job, exploring a new
              role, or refreshing your interview skills, the goal is simple:
              help you prepare thoughtfully, learn from each attempt, and move
              forward one step at a time.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gradient-to-b from-sky-50/80 to-pink-50/70 px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-pink-700">
              <Sparkles size={15} />
              WHAT MAKES IT USEFUL
            </span>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Everything starts with a better way to practice.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Build useful habits, understand your answers, and make your
              preparation more intentional.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className={`group relative overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 sm:p-8 ${feature.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}
                    >
                      <Icon size={25} />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-slate-300">
                      {feature.number}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-700 transition group-hover:gap-3">
                    A step toward better preparation
                    <ArrowRight size={16} />
                  </div>
                  <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-sky-100/60 blur-2xl transition group-hover:bg-pink-100/70" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-24">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                YOUR PREPARATION JOURNEY
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Three steps.
                <span className="block text-violet-600">
                  One stronger you.
                </span>
              </h2>
              <p className="mt-5 leading-8 text-slate-600">
                You do not have to master everything in a single day. A
                consistent practice routine can help you become more familiar
                with interview questions and more confident in how you answer.
              </p>
              <Link
                to="/"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-violet-700 transition hover:gap-3"
              >
                Begin your journey
                <ChevronRight size={19} />
              </Link>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.title}
                    className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md sm:gap-6 sm:p-7"
                  >
                    <div className="flex shrink-0 flex-col items-center gap-3">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}
                      >
                        <Icon size={24} />
                      </div>
                      {index !== steps.length - 1 && (
                        <div className="h-8 w-px bg-gradient-to-b from-sky-200 to-pink-200" />
                      )}
                    </div>
                    <div className="pb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        STEP 0{index + 1}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-3 leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-100 via-white to-pink-100 p-6 sm:p-10 lg:p-14">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-sky-800">
              WHAT WE BELIEVE
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Progress looks different for everyone.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Your experience, goals, and learning style are unique. Your
              preparation should leave room for that.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-3xl border border-white bg-white/85 p-6 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <Icon size={23} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {value.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-12 text-center sm:px-12 sm:py-16 lg:px-20">
          <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-pink-200">
              <Zap size={26} />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-sky-200">
              YOUR NEXT CHAPTER STARTS HERE
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              A little practice today can make tomorrow feel different.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-300">
              Take a moment to work on your answers, explore your strengths,
              and prepare for the opportunities ahead. Start where you are and
              improve one session at a time.
            </p>

            <Link
              to="/"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-interview-setup")
                );
              }}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-300 to-sky-300 px-7 py-4 font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-pink-300/20"
            >
              Start your preparation
              <ArrowRight size={19} />
            </Link>

            <p className="mt-6 text-sm text-slate-400">
              Practice. Reflect. Improve. Repeat.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-slate-500">
          Interviewly is a learning and interview-practice tool. AI-generated
          questions and feedback may not always be accurate or complete.
          Review suggestions thoughtfully and use your own judgment alongside
          other preparation resources.
        </p>

        <div className="mt-5 text-center text-sm text-slate-500">
          Read our{" "}
          <Link
            to="/terms"
            className="font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-pink-600"
          >
            Terms &amp; Conditions
          </Link>
          .
        </div>
      </section>
    </main>
  );
}
