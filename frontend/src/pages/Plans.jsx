
import { useState } from "react";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  ShieldCheck,
  Clock3,
  MessageSquare,
  FileText,
  Headphones,
  LockKeyhole,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const COLORS = {
  page: "#eeeae6",
  button: "#f7f5f2",
  text: "#38332f",
  accent: "#7c5ce7",
  muted: "#827970",
  border: "#e2dcd5",
};

const insetShadow =
  "inset 4px 4px 8px rgba(180,165,150,0.30), inset -4px -4px 8px rgba(255,252,248,0.95)";

const raisedShadow =
  "7px 7px 16px rgba(180,165,150,0.24), -7px -7px 16px rgba(255,252,248,0.90)";

const hoverShadow =
  "inset 2px 2px 5px rgba(180,165,150,0.25), inset -2px -2px 5px rgba(255,252,248,0.9)";

const plans = [
  {
    id: "free",
    name: "Free",
    subtitle: "Start your interview journey",
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: "forever",
    icon: Zap,
    popular: false,
    features: [
      { text: "5-minute mock interviews", included: true },
      { text: "Basic interview questions", included: true },
      { text: "AI interviewer", included: true },
      { text: "Audio interview", included: true },
      { text: "Basic interview practice", included: true },
      { text: "15-minute interviews", included: false },
      { text: "30-minute interviews", included: false },
    ],
    buttonText: "Continue with Free",
  },
  {
    id: "pro",
    name: "Pro",
    subtitle: "Prepare with more confidence",
    monthlyPrice: 199,
    yearlyPrice: 1500,
    period: "month",
    icon: Sparkles,
    popular: true,
    features: [
      { text: "15-minute mock interviews", included: true },
      { text: "All interview round types", included: true },
      { text: "AI interviewer options", included: true },
      { text: "Audio interview", included: true },
      { text: "Resume-based practice", included: true },
      { text: "Detailed AI feedback", included: true },
      { text: "30-minute interviews", included: false },
    ],
    buttonText: "Choose Pro",
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Go deeper with every practice",
    monthlyPrice: 499,
    yearlyPrice: 3999,
    period: "month",
    icon: Crown,
    popular: false,
    features: [
      { text: "30-minute mock interviews", included: true },
      { text: "All interview round types", included: true },
      { text: "AI interviewer options", included: true },
      { text: "Audio and video interviews", included: true },
      { text: "Resume-based practice", included: true },
      { text: "Detailed AI feedback", included: true },
      { text: "Extended practice sessions", included: true },
    ],
    buttonText: "Choose Premium",
  },
];

function SoftButton({
  children,
  onClick,
  variant = "default",
  disabled = false,
  type = "button",
}) {
  const [hovered, setHovered] = useState(false);

  const primary = variant === "primary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        background: primary ? COLORS.accent : COLORS.button,
        color: primary ? "#ffffff" : COLORS.text,
        boxShadow: primary
          ? hovered
            ? "0 5px 14px rgba(124,92,231,0.24)"
            : "0 3px 8px rgba(124,92,231,0.16)"
          : hovered
            ? hoverShadow
            : insetShadow,
        transform: hovered && !disabled ? "translateY(-1px)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function Feature({ text, included }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{
          color: included ? COLORS.accent : "#aaa198",
          background: COLORS.page,
          boxShadow: insetShadow,
        }}
      >
        {included ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
      </span>

      <span
        style={{
          color: included ? COLORS.text : "#a49b92",
          textDecoration: included ? "none" : "none",
        }}
      >
        {text}
      </span>
    </li>
  );
}

function PlanCard({ plan, onChoose, currentPlan, billing }) {
  const Icon = plan.icon;
  const isCurrent = currentPlan === plan.id;
  const price = plan.id === "free"
    ? 0
    : billing === "yearly"
      ? plan.yearlyPrice
      : plan.monthlyPrice;
  const period = plan.id === "free" ? "forever" : billing === "yearly" ? "year" : "month";

  return (
    <article
      className="relative flex h-full flex-col rounded-[28px] p-5 sm:p-6"
      style={{
        background: COLORS.button,
        boxShadow: plan.popular
          ? "9px 9px 20px rgba(180,165,150,0.22), -9px -9px 20px rgba(255,252,248,0.95)"
          : raisedShadow,
        border: plan.popular
          ? `1px solid rgba(124,92,231,0.32)`
          : "1px solid rgba(255,255,255,0.65)",
      }}
    >
      {plan.popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{
            background: COLORS.accent,
            color: "#ffffff",
            boxShadow: "0 4px 10px rgba(124,92,231,0.20)",
          }}
        >
          Most Popular
        </div>
      )}

      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          background: COLORS.page,
          color: COLORS.accent,
          boxShadow: insetShadow,
        }}
      >
        <Icon size={22} strokeWidth={1.8} />
      </div>

      <h2
        className="text-xl font-bold tracking-tight"
        style={{ color: COLORS.text }}
      >
        {plan.name}
      </h2>

      <p className="mt-1 min-h-10 text-sm leading-5" style={{ color: COLORS.muted }}>
        {plan.subtitle}
      </p>

      <div className="my-5 flex items-baseline gap-1">
        <span
          className="text-4xl font-bold tracking-tight"
          style={{ color: COLORS.text }}
        >
          ₹{price}
        </span>
        <span className="text-sm" style={{ color: COLORS.muted }}>
          / {period}
        </span>
      </div>
      {plan.id !== "free" && billing === "yearly" && (
        <p className="-mt-3 mb-5 text-xs" style={{ color: COLORS.muted }}>
          Billed annually · 12-month access
        </p>
      )}

      <div className="mb-5">
        <SoftButton
          variant={plan.popular ? "primary" : "default"}
          onClick={() => onChoose(plan)}
          disabled={isCurrent}
        >
          {isCurrent ? "Current Plan" : plan.buttonText}
          {!isCurrent && <ArrowRight size={16} />}
        </SoftButton>
      </div>

      <div
        className="mb-5 h-px w-full"
        style={{ background: COLORS.border }}
      />

      <p
        className="mb-4 text-xs font-bold uppercase tracking-[0.12em]"
        style={{ color: COLORS.muted }}
      >
        What's included
      </p>

      <ul className="flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <Feature
            key={feature.text}
            text={feature.text}
            included={feature.included}
          />
        ))}
      </ul>
    </article>
  );
}

export default function Plans({ onSelectPlan, currentPlan = "free" }) {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");

  const handleChoosePlan = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
      return;
    }

    if (plan.id === "free") {
      navigate("/signup?plan=free");
      return;
    }

    const checkoutPath = `/checkout?plan=${encodeURIComponent(plan.id)}&billing=${encodeURIComponent(billing)}`;
    if (!localStorage.getItem("interviewly_token")) {
      navigate(`/signin?next=${encodeURIComponent(checkoutPath)}`);
      return;
    }
    navigate(checkoutPath);
  };

  return (
    <main
      className="min-h-screen px-4 pb-16 pt-8 sm:px-6 lg:px-8"
      style={{ background: COLORS.page, color: COLORS.text }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <div
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            style={{
              background: COLORS.button,
              color: COLORS.accent,
              boxShadow: insetShadow,
            }}
          >
            <Sparkles size={14} />
            Interviewly Plans
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose your practice plan
          </h1>

          <p
            className="mx-auto mt-3 max-w-xl text-sm leading-6 sm:text-base"
            style={{ color: COLORS.muted }}
          >
            Start for free, build confidence, and prepare for your next
            interview at your own pace.
          </p>

          {/* Billing selector */}
          <div
            className="mx-auto mt-6 inline-flex rounded-2xl p-1.5"
            style={{
              background: COLORS.page,
              boxShadow: insetShadow,
            }}
          >
            <button
              onClick={() => setBilling("monthly")}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition"
              style={{
                background:
                  billing === "monthly" ? COLORS.button : "transparent",
                color: billing === "monthly" ? COLORS.text : COLORS.muted,
                boxShadow: billing === "monthly" ? raisedShadow : "none",
              }}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition"
              style={{
                background:
                  billing === "yearly" ? COLORS.button : "transparent",
                color: billing === "yearly" ? COLORS.text : COLORS.muted,
                boxShadow: billing === "yearly" ? raisedShadow : "none",
              }}
            >
              Yearly
              <span
                className="ml-2 rounded-full px-2 py-1 text-[10px]"
                style={{ background: "#e7defe", color: COLORS.accent }}
              >
                Save more
              </span>
            </button>
          </div>

          {billing === "yearly" && (
            <p className="mt-3 text-xs" style={{ color: COLORS.muted }}>
              Annual access for 12 months · Pro ₹1,500/year · Premium ₹3,999/year
            </p>
          )}
        </div>

        {/* Plan cards */}
        <section
          className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3"
          aria-label="Available subscription plans"
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onChoose={handleChoosePlan}
              currentPlan={currentPlan}
              billing={billing}
            />
          ))}
        </section>

        {/* Benefits */}
        <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: Clock3,
              title: "Practice your way",
              description: "Choose a session length that fits your plan.",
            },
            {
              icon: ShieldCheck,
              title: "Secure subscriptions",
              description: "Premium access should be verified securely.",
            },
            {
              icon: MessageSquare,
              title: "Interview focused",
              description: "Practice role-related and behavioral questions.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl p-5"
                style={{
                  background: COLORS.button,
                  boxShadow: insetShadow,
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: COLORS.page,
                    color: COLORS.accent,
                    boxShadow: insetShadow,
                  }}
                >
                  <Icon size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p
                    className="mt-1 text-xs leading-5"
                    style={{ color: COLORS.muted }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* FAQ / footer note */}
        <div className="mt-10 text-center">
          <p
            className="inline-flex items-center justify-center gap-2 text-xs"
            style={{ color: COLORS.muted }}
          >
            <LockKeyhole size={14} />
            Paid features activate only after successful subscription
            verification.
          </p>

          <div className="mt-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-75"
              style={{ color: COLORS.accent }}
            >
              <ArrowRight size={15} className="rotate-180" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
