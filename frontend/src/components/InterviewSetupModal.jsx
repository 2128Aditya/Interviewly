import { useEffect, useMemo, useRef, useState } from "react";

import {
  Check,
  ChevronDown,
  FileText,
  Mic,
  Upload,
  Video,
  X,
} from "lucide-react";

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "Flutter Developer",
  "Mobile App Developer",
  "Data Analyst",
  "Data Scientist",
  "AI/ML Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "QA Engineer",
  "Automation Test Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Business Analyst",
  "HR Executive",
  "Other / Custom Role",
];

const ROUNDS = [
  { name: "Warm Up", caption: "NON TECHNICAL" },
  { name: "Coding", caption: "PROGRAMMING" },
  { name: "Role Related", caption: "TECHNICAL" },
  { name: "Behavioral", caption: "HR" },
];

const INTERVIEWERS = [
  {
    name: "Aditya",
    language: "Indian English",
    initials: "A",
    color: "#e8e0d8",
  },
  {
    name: "Emma Wilson",
    language: "US English",
    initials: "E",
    color: "#e8e0d8",
  },
];

const pageBackground = "#eeeae6";
const buttonBackground = "#f7f5f2";
const textColor = "#38332f";
const accentColor = "#7c5ce7";

const insetShadow =
  "inset 4px 4px 8px rgba(180,165,150,0.30), inset -4px -4px 8px rgba(255,252,248,0.95)";

const hoverShadow =
  "inset 2px 2px 5px rgba(180,165,150,0.25), inset -2px -2px 5px rgba(255,252,248,0.9)";

const individualButtonStyle = {
  backgroundColor: buttonBackground,
  color: textColor,
  boxShadow: insetShadow,
};

const fieldClass =
  "w-full rounded-2xl border-0 px-3.5 py-3 text-sm outline-none transition placeholder:text-[#8f8881] focus:ring-2 focus:ring-[#7c5ce7]/25";

function NeumorphicButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-2xl transition-all duration-200 ${className}`}
      style={{
        ...individualButtonStyle,
        ...props.style,
      }}
      onMouseEnter={(event) => {
        if (!event.currentTarget.disabled) {
          event.currentTarget.style.boxShadow = hoverShadow;
        }
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.boxShadow = insetShadow;
      }}
    >
      {children}
    </button>
  );
}

export default function InterviewSetupModal({
  open,
  onClose,
  onStart,
  onRequireSignup,
  isAuthenticated = false,
  maxDurationMinutes = 5,
  initialRound = "Role Related",
}) {
  const [role, setRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [round, setRound] = useState(initialRound);
  const [duration, setDuration] = useState(5);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [interviewer, setInterviewer] = useState("Aditya");
  const [video, setVideo] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");

  const searchRef = useRef(null);
  const fileRef = useRef(null);

  // Audio is mandatory and cannot be switched off.
  const audio = true;

  useEffect(() => {
    if (open) {
      setRound(initialRound || "Role Related");
      setRoleMenuOpen(false);
      setResumeError("");
    }
  }, [open, initialRound]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const filteredRoles = useMemo(() => {
    const query = roleSearch.trim().toLowerCase();

    return ROLES.filter((item) =>
      item.toLowerCase().includes(query)
    );
  }, [roleSearch]);

  if (!open) return null;

  const finalRole =
    role === "Other / Custom Role" ? customRole.trim() : role;

  const canStart = Boolean(finalRole) && accepted;

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!/\.(pdf|doc|docx|txt)$/i.test(file.name)) {
      setResumeError("Please select a PDF, DOC, DOCX or plain-text file.");
      setResume(null);
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeError("Resume must be 10 MB or smaller.");
      setResume(null);
      event.target.value = "";
      return;
    }

    setResumeError("");
    setResume(file);
    if (/\.txt$/i.test(file.name)) {
      file.text().then((text) => setResumeText(text.slice(0, 16000))).catch(() => setResumeError("Could not read this text file. Please paste the resume highlights manually."));
    } else {
      setResumeError("File selected. For AI analysis, paste the resume text or key highlights in the field below.");
    }
  };

  const submit = (event) => {
    event.preventDefault();

    if (!canStart) return;

    // Enforce the duration allowed by the current subscription tier in the UI.
    if (duration > maxDurationMinutes) {
      setDuration(maxDurationMinutes);
      return;
    }

    const interviewSetup = {
      role: finalRole,
      round,
      durationMinutes: duration,
      interviewer,
      language:
        INTERVIEWERS.find((item) => item.name === interviewer)
          ?.language || "Indian English",
      audioEnabled: audio,
      videoEnabled: video,
      resume,
      difficulty,
      jobDescription: jobDescription.trim(),
      resumeText: resumeText.trim(),
    };

    // If the user is not logged in, open signup instead.
    // Do not start the interview yet.
    if (!isAuthenticated) {
      onClose?.();
      onRequireSignup?.(interviewSetup);
      return;
    }

    onStart?.(interviewSetup);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 backdrop-blur-sm sm:p-5"
      style={{ backgroundColor: "rgba(56,51,47,0.35)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="interview-setup-title"
        className="flex max-h-[96dvh] w-full max-w-[900px] flex-col overflow-hidden rounded-[26px] border border-white/70 shadow-[0_24px_70px_rgba(56,51,47,0.22)]"
        style={{
          backgroundColor: pageBackground,
          color: textColor,
        }}
      >
        {/* Header: same palette and soft styling as the navbar */}
        <header className="flex shrink-0 items-center justify-between border-b border-[#d9d2cb] px-5 py-4 sm:px-7">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: accentColor }}
            >
              INTERVIEWLY · SETUP
            </p>

            <h2
              id="interview-setup-title"
              className="mt-1 text-lg font-bold sm:text-xl"
            >
              Interview Details
            </h2>

            <p className="mt-1 text-xs text-[#756d66]">
              Customize your AI interview session
            </p>
          </div>

          <NeumorphicButton
            type="button"
            onClick={onClose}
            aria-label="Close setup"
            className="flex h-10 w-10 items-center justify-center"
          >
            <X size={20} />
          </NeumorphicButton>
        </header>

        <form
          onSubmit={submit}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7"
        >
          <div className="grid gap-5">
            {/* Target role */}
            <div className="relative">
              <label className="mb-2 block text-sm font-semibold">
                Select your target role{" "}
                <span className="text-rose-500">*</span>
              </label>

              <NeumorphicButton
                type="button"
                onClick={() => {
                  setRoleMenuOpen((value) => !value);
                  setTimeout(() => searchRef.current?.focus(), 0);
                }}
                className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-semibold"
                aria-expanded={roleMenuOpen}
              >
                <span>{role}</span>

                <ChevronDown
                  size={18}
                  style={{
                    color: accentColor,
                    transform: roleMenuOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </NeumorphicButton>

              {roleMenuOpen && (
                <div
                  className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl p-2"
                  style={{
                    backgroundColor: pageBackground,
                    boxShadow: "0 12px 30px rgba(56,51,47,0.15)",
                  }}
                >
                  <input
                    ref={searchRef}
                    value={roleSearch}
                    onChange={(event) =>
                      setRoleSearch(event.target.value)
                    }
                    placeholder="Search job roles..."
                    className={fieldClass}
                    style={individualButtonStyle}
                  />

                  <div className="mt-2 max-h-48 overflow-y-auto">
                    {filteredRoles.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setRole(item);
                          setRoleMenuOpen(false);
                          setRoleSearch("");
                        }}
                        className="mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition"
                        style={{
                          backgroundColor:
                            role === item ? "#e4ded7" : "transparent",
                          color: role === item ? accentColor : textColor,
                        }}
                      >
                        {item}
                        {role === item && <Check size={16} />}
                      </button>
                    ))}

                    {filteredRoles.length === 0 && (
                      <p className="px-3 py-3 text-sm text-[#756d66]">
                        No matching role. Choose Other / Custom Role to
                        enter your own.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {role === "Other / Custom Role" && (
                <input
                  autoFocus
                  value={customRole}
                  onChange={(event) =>
                    setCustomRole(event.target.value)
                  }
                  placeholder="Enter your job role"
                  className={`${fieldClass} mt-2`}
                  style={individualButtonStyle}
                  required
                />
              )}
            </div>

            {/* Resume upload */}
            <div
              className="rounded-2xl p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"
              style={{
                backgroundColor: pageBackground,
                boxShadow: insetShadow,
              }}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: buttonBackground,
                    color: accentColor,
                    boxShadow: insetShadow,
                  }}
                >
                  <FileText size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    Resume Based Interview{" "}
                    <span className="font-normal text-[#756d66]">
                      (Optional)
                    </span>
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#756d66]">
                    Personalize questions around your skills and
                    experience by uploading your resume.
                  </p>

                  {resume && (
                    <p className="mt-2 truncate text-xs font-medium">
                      Selected: {resume.name}
                    </p>
                  )}

                  {resumeError && (
                    <p className="mt-2 text-xs text-rose-600">
                      {resumeError}
                    </p>
                  )}
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFile}
                className="hidden"
              />

              <NeumorphicButton
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-4 flex shrink-0 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold sm:mt-0"
              >
                <Upload size={16} />
                Upload Resume
              </NeumorphicButton>
            </div>

            {/* Targeted role context */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Difficulty level
                <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className={`${fieldClass} mt-2`} style={individualButtonStyle}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Job description <span className="font-normal text-[#8f8881]">(Optional)</span>
                <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} maxLength={12000} rows={3} placeholder="Paste the job description for targeted questions…" className={`${fieldClass} mt-2 resize-y`} style={individualButtonStyle} />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Resume highlights <span className="font-normal text-[#8f8881]">(Optional)</span>
              <textarea value={resumeText} onChange={(event) => setResumeText(event.target.value)} maxLength={16000} rows={3} placeholder="Paste your key skills, projects and experience so the AI can ask relevant questions…" className={`${fieldClass} mt-2 resize-y`} style={individualButtonStyle} />
              <span className="mt-1 block text-[11px] font-normal leading-5 text-[#8f8881]">For accurate resume-based questions, paste the relevant resume text here. The selected file name alone is not analysed.</span>
            </label>

            {/* Interview round */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold">
                Interview Type{" "}
                <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ROUNDS.map((item) => (
                  <NeumorphicButton
                    key={item.name}
                    type="button"
                    onClick={() => setRound(item.name)}
                    className="flex min-h-[76px] flex-col items-start justify-center gap-1.5 px-3 py-3 text-left"
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color:
                          round === item.name ? accentColor : textColor,
                      }}
                    >
                      {item.name}
                    </span>

                    <span className="text-[9px] font-bold tracking-[0.12em] text-[#8f8881]">
                      {item.caption}
                    </span>

                    {round === item.name && (
                      <Check
                        size={15}
                        style={{ color: accentColor }}
                      />
                    )}
                  </NeumorphicButton>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold">
                Interview Duration{" "}
                <span className="text-rose-500">*</span>
              </label>

              <div className="flex flex-wrap gap-3">
                {[5, 15, 30].map((mins) => {
                  const locked = mins > maxDurationMinutes;

                  return (
                    <NeumorphicButton
                      key={mins}
                      type="button"
                      disabled={locked}
                      onClick={() => {
                        if (!locked) setDuration(mins);
                      }}
                      className={`px-4 py-2.5 text-sm font-semibold ${
                        locked
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                      title={
                        locked
                          ? (mins === 15 ? "Upgrade to Pro or Premium to unlock 15 minutes" : "Upgrade to Premium to unlock 30 minutes")
                          : `${mins} minute interview`
                      }
                      aria-disabled={locked}
                    >
                      <span
                        style={{
                          color:
                            duration === mins ? accentColor : textColor,
                        }}
                      >
                        {mins} mins
                      </span>

                      {locked && (
                        <span className="ml-1 text-amber-500">
                          🔒
                        </span>
                      )}

                      {!locked && mins > 5 && (
                        <span className="ml-1 text-amber-500">
                          ♛
                        </span>
                      )}
                    </NeumorphicButton>
                  );
                })}
              </div>

              {maxDurationMinutes === 5 && (
                <p className="mt-2 text-xs text-[#756d66]">
                  5 minutes is free. Upgrade to Pro to unlock 15-minute interviews, or Premium for 30 minutes.
                </p>
              )}
              {maxDurationMinutes === 15 && (
                <p className="mt-2 text-xs text-[#756d66]">
                  Your Pro plan unlocks 15-minute interviews. Upgrade to Premium for 30 minutes.
                </p>
              )}
            </div>

            {/* Interviewer */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold">
                Select Your Interviewer{" "}
                <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {INTERVIEWERS.map((person) => (
                  <NeumorphicButton
                    key={person.name}
                    type="button"
                    onClick={() => setInterviewer(person.name)}
                    className="flex items-center gap-3 p-3 text-left"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: person.color,
                        color: textColor,
                      }}
                    >
                      {person.initials}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className="block text-sm font-semibold"
                        style={{
                          color:
                            interviewer === person.name
                              ? accentColor
                              : textColor,
                        }}
                      >
                        {person.name}
                      </span>

                      <span className="mt-0.5 block text-xs text-[#756d66]">
                        {person.language}
                      </span>
                    </span>

                    {interviewer === person.name && (
                      <Check
                        size={18}
                        style={{ color: accentColor }}
                      />
                    )}
                  </NeumorphicButton>
                ))}
              </div>
            </div>

            {/* Practice settings */}
            <div
              className="rounded-2xl p-4"
              style={{ boxShadow: insetShadow }}
            >
              <label className="mb-3 block text-sm font-semibold">
                Practice Settings
              </label>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="flex items-center gap-2.5 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={audio}
                    readOnly
                    disabled
                    className="h-4 w-4"
                    style={{ accentColor }}
                  />

                  <Mic size={16} style={{ color: accentColor }} />
                  Audio

                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: buttonBackground,
                      color: accentColor,
                      boxShadow: insetShadow,
                    }}
                  >
                    REQUIRED
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={video}
                    onChange={(event) =>
                      setVideo(event.target.checked)
                    }
                    className="h-4 w-4"
                    style={{ accentColor }}
                  />

                  <Video size={16} style={{ color: accentColor }} />
                  Video
                </label>
              </div>

              <p className="mt-2 text-xs text-[#756d66]">
                Audio is required and stays enabled.
              </p>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) =>
                  setAccepted(event.target.checked)
                }
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ accentColor }}
              />

              <span>
                I agree with the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline-offset-2 hover:underline"
                  style={{ color: accentColor }}
                >
                  terms and conditions
                </a>
                .
              </span>
            </label>
          </div>

          {/* Footer buttons */}
          <footer className="-mx-5 mt-5 flex items-center justify-end gap-3 border-t border-[#d9d2cb] px-5 pb-1 pt-4 sm:-mx-7 sm:px-7">
            <NeumorphicButton
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-sm font-semibold"
            >
              Cancel
            </NeumorphicButton>

            <button
              type="submit"
              disabled={!canStart}
              className="rounded-2xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45 sm:min-w-48"
              style={individualButtonStyle}
              onMouseEnter={(event) => {
                if (!event.currentTarget.disabled) {
                  event.currentTarget.style.boxShadow = hoverShadow;
                }
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.boxShadow = insetShadow;
              }}
            >
              Start Practice <span className="ml-1">→</span>
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}