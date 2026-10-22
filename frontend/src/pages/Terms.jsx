import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Camera, FileText, LockKeyhole, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";

const sections = [
  {
    icon: BadgeCheck,
    title: "Using Interviewly",
    body: "Interviewly provides interview-practice tools and AI-generated learning feedback. You must provide accurate account details, keep your credentials secure, and use the service lawfully.",
  },
  {
    icon: Sparkles,
    title: "Practice feedback",
    body: "Questions, suggested answers, scores, and improvement plans are generated for practice. They may contain errors and are not guarantees of hiring outcomes, professional advice, or a substitute for independent review.",
  },
  {
    icon: FileText,
    title: "Your content",
    body: "You remain responsible for any resume, job description, transcript, or other material you submit. Do not upload material you do not have permission to use or content that contains another person's confidential information.",
  },
  {
    icon: Camera,
    title: "Camera, microphone and speech input",
    body: "Camera and microphone access requires your browser permission. Browser speech recognition and text-to-speech availability varies by device and browser. You can type answers when voice recognition is unavailable. Review the permission prompt before allowing access.",
  },
  {
    icon: LockKeyhole,
    title: "AI processing and saved reports",
    body: "Interview answers and the context you provide are sent to the configured AI service to generate questions and feedback. Completed reports and transcripts may be stored in your account so you can view history. Do not include passwords, payment details, or unnecessary sensitive information in your answers.",
  },
  {
    icon: ShieldCheck,
    title: "Account security and deletion",
    body: "You are responsible for activity under your account. You can delete saved interview reports from your history. Account deletion requests or questions about personal data should be directed to the service owner.",
  },
  {
    icon: MessageSquareText,
    title: "Availability and acceptable use",
    body: "We may change, suspend, or limit features to maintain security and reliability. Do not attempt to disrupt the service, bypass access controls, or misuse the AI service.",
  },
  {
    icon: ShieldCheck,
    title: "Limitation",
    body: "The service is provided as an interview-preparation aid. To the extent permitted by applicable law, Interviewly makes no promise that using the service will result in an interview invitation, job offer, or particular score.",
  },
  {
    icon: FileText,
    title: "Updates",
    body: "These terms may be updated as the product changes. Continued use after updated terms are posted means you accept the revised terms, subject to applicable law.",
  },
];

export default function Terms() {
  return (
    <main className="interview-page terms-page">
      <div className="terms-shell">
        <Link to="/" className="terms-back"><ArrowLeft size={15} /> Back to home</Link>
        <header className="terms-hero">
          <div className="terms-hero-orb terms-hero-orb-one" />
          <div className="terms-hero-orb terms-hero-orb-two" />
          <div className="terms-hero-content">
            <span className="terms-kicker"><ShieldCheck size={14} /> INTERVIEWLY POLICIES</span>
            <h1>Terms &amp; Conditions</h1>
            <p>Clear expectations help make Interviewly a safer, more useful place to practise and grow.</p>
            <div className="terms-updated"><span className="terms-updated-dot" /> Last updated: 20 October 2026</div>
          </div>
          <div className="terms-hero-mark"><FileText size={32} /><span>Read<br/>with confidence</span></div>
        </header>

        <div className="terms-intro">
          <div className="terms-intro-icon"><LockKeyhole size={19}/></div>
          <div><strong>Please take a moment to read these terms.</strong><p>By using Interviewly, you agree to use the service responsibly and understand how its practice tools work.</p></div>
        </div>

        <div className="terms-layout">
          <aside className="terms-side-note">
            <span className="terms-side-icon"><ShieldCheck size={19}/></span>
            <strong>Your practice, your responsibility.</strong>
            <p>Use the platform thoughtfully, protect your account, and review AI-generated feedback with your own judgement.</p>
            <Link to="/about">Learn about Interviewly <ArrowUpRight size={14}/></Link>
          </aside>
          <article className="terms-sections">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <section className="terms-section" key={section.title}>
                  <div className="terms-section-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="terms-section-icon"><Icon size={18}/></div>
                  <div className="terms-section-copy"><h2>{section.title}</h2><p>{section.body}</p></div>
                </section>
              );
            })}
          </article>
        </div>

        <div className="terms-bottom-cta">
          <div><span>Need a little more context?</span><strong>Get to know Interviewly.</strong></div>
          <Link to="/about">About us <ArrowUpRight size={15}/></Link>
        </div>
      </div>
    </main>
  );
}
