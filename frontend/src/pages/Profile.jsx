import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api.js";
import { Award, BookOpen, CalendarDays, CheckCircle2, Clock3, Code2, CreditCard, Mail, RefreshCw, Video } from "lucide-react";

const prettyDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
const prettyPlan = (value) => ({ free: "Free", pro: "Pro", premium: "Premium" }[String(value || "free").toLowerCase()] || "Free");

function Stat({ icon: Icon, label, value, note }) {
  return <div className="rounded-2xl border border-white/70 bg-[#f7f5f2] p-5 shadow-[4px_4px_12px_rgba(180,165,150,.16),-4px_-4px_12px_rgba(255,252,248,.75)]"><div className="flex items-center justify-between gap-3"><span className="text-sm text-[#81786f]">{label}</span><span className="rounded-xl bg-[#e9e1ff] p-2 text-[#7c5ce7]"><Icon size={18}/></span></div><strong className="mt-3 block text-3xl font-bold text-[#38332f]">{value}</strong>{note && <p className="mt-1 text-xs text-[#81786f]">{note}</p>}</div>;
}

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    try { setData(await apiRequest("/api/platform/profile")); }
    catch (err) { setError(err.message || "Could not load your profile."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  if (loading) return <main className="interview-page min-h-[70vh] px-4 py-12"><div className="mx-auto max-w-5xl rounded-3xl bg-[#f7f5f2] p-8 text-center text-[#81786f]">Loading your profile…</div></main>;
  if (error) return <main className="interview-page min-h-[70vh] px-4 py-12"><div className="mx-auto max-w-xl rounded-3xl bg-[#f7f5f2] p-8 text-center"><p className="font-semibold text-red-700">{error}</p><button onClick={load} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#7c5ce7] px-4 py-2.5 font-semibold text-white"><RefreshCw size={16}/> Try again</button></div></main>;

  const user = data?.user || {};
  const stats = data?.stats || {};
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Interviewly User";
  const plan = prettyPlan(user.plan);
  const active = user.plan !== "free" && user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();

  return <main className="interview-page min-h-screen px-4 py-9 sm:px-6"><div className="mx-auto max-w-6xl">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">YOUR INTERVIEWLY SPACE</span><h1 className="mt-2 text-3xl font-bold text-[#38332f] sm:text-4xl">My Profile</h1><p className="mt-2 text-sm text-[#81786f]">Your account, plan and learning progress in one place.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl bg-[#f7f5f2] px-4 py-3 text-sm font-semibold text-[#38332f] shadow-sm"><RefreshCw size={16}/> Refresh</button></div>
    <section className="mb-6 rounded-3xl border border-white/70 bg-[#f7f5f2] p-6 shadow-[7px_7px_18px_rgba(180,165,150,.16),-7px_-7px_18px_rgba(255,252,248,.75)] sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#e9e1ff] text-3xl font-bold text-[#7c5ce7]">{(user.firstName || user.email || "U").charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><h2 className="text-2xl font-bold text-[#38332f]">{name}</h2><p className="mt-2 flex items-center gap-2 break-all text-sm text-[#81786f]"><Mail size={15}/>{user.email || "Email unavailable"}</p><p className="mt-2 flex items-center gap-2 text-xs text-[#81786f]"><CalendarDays size={14}/> Member since {prettyDate(user.createdAt)}</p></div><div className="rounded-2xl border border-[#e5dfd8] bg-[#eeeae6] p-4 sm:min-w-48"><div className="flex items-center gap-2"><Award size={19} className="text-[#7c5ce7]"/><span className="text-xs font-bold uppercase tracking-wider text-[#81786f]">Current plan</span></div><p className="mt-2 text-2xl font-bold text-[#38332f]">{plan}</p><p className="mt-1 text-xs text-[#81786f]">{active ? "Subscription active" : user.plan === "free" ? "Free plan" : "Subscription expired"}</p><Link to="/plans" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#7c5ce7]">Manage plan <CreditCard size={14}/></Link></div></div>
      <div className="mt-6 grid gap-3 border-t border-[#e5dfd8] pt-5 sm:grid-cols-3"><div><p className="text-xs text-[#81786f]">Subscription started</p><p className="mt-1 text-sm font-semibold text-[#38332f]">{prettyDate(user.subscriptionStartedAt)}</p></div><div><p className="text-xs text-[#81786f]">Subscription expires</p><p className="mt-1 text-sm font-semibold text-[#38332f]">{prettyDate(user.subscriptionExpiresAt)}</p></div><div><p className="text-xs text-[#81786f]">Email verification</p><p className="mt-1 text-sm font-semibold text-[#38332f]">{user.emailVerified ? "Verified" : "Not verified"}</p></div></div>
    </section>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat icon={Video} label="Completed interviews" value={stats.completedInterviews || 0} note="Finished interview sessions"/><Stat icon={Code2} label="Coding solved" value={stats.codingProblemsSolved || 0} note="Problems marked solved"/><Stat icon={Clock3} label="Interview practice" value={`${stats.totalInterviewMinutes || 0} min`} note="Total duration of completed sessions"/><Stat icon={BookOpen} label="Saved AI questions" value={stats.generatedQuestions || 0} note="Questions generated for your account"/></div>
    <section className="rounded-3xl border border-white/70 bg-[#f7f5f2] p-6 shadow-sm sm:p-7"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-[#38332f]">Recent interviews</h2><p className="mt-1 text-sm text-[#81786f]">Your latest completed sessions.</p></div><Link to="/history" className="text-sm font-bold text-[#7c5ce7]">View history</Link></div>{data.recentInterviews?.length ? <div className="divide-y divide-[#e5dfd8]">{data.recentInterviews.map(item=><div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold text-[#38332f]">{item.role}</p><p className="mt-1 text-xs text-[#81786f]">{item.round} · {item.difficulty} · {prettyDate(item.completedAt)}</p></div><div className="flex items-center gap-3"><span className="text-xs text-[#81786f]">{Math.max(0,Math.round((item.durationSeconds||0)/60))} min</span>{item.score !== null && <span className="rounded-full bg-[#e9e1ff] px-3 py-1 text-xs font-bold text-[#7c5ce7]">{item.score}/100</span>}<Link to={`/report/${item.id}`} aria-label={`View report for ${item.role}`} className="rounded-lg bg-[#eeeae6] p-2 text-[#7c5ce7]"><CheckCircle2 size={16}/></Link></div></div>)}</div> : <div className="rounded-2xl bg-[#eeeae6] p-6 text-center"><p className="text-sm text-[#81786f]">No completed interviews yet. Your sessions will appear here.</p><Link to="/" className="mt-3 inline-block text-sm font-bold text-[#7c5ce7]">Start your first interview</Link></div>}</section>
  </div></main>;
}
