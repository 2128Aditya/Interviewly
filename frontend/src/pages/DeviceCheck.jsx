import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera, CheckCircle2, CircleAlert, Mic, Wifi, MonitorCheck, ShieldCheck } from "lucide-react";
import { apiRequest } from "../lib/api.js";

const checks = [
  { id: "browser", title: "Browser compatibility", detail: "Use a recent version of Chrome, Edge, or Safari.", icon: MonitorCheck },
  { id: "camera", title: "Camera access", detail: "Allow access so you can preview your camera before starting.", icon: Camera },
  { id: "mic", title: "Microphone access", detail: "Speak a short sentence to confirm your microphone works.", icon: Mic },
  { id: "network", title: "Internet connection", detail: "A stable connection is needed for live AI questions and feedback.", icon: Wifi },
];

export default function DeviceCheck() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [results, setResults] = useState({ browser: false, camera: false, mic: false, network: navigator.onLine });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [micTested, setMicTested] = useState(false);

  useEffect(() => {
    setResults((old) => ({ ...old, browser: Boolean(navigator.mediaDevices?.getUserMedia), network: navigator.onLine }));
    const online = () => setResults((old) => ({ ...old, network: true }));
    const offline = () => setResults((old) => ({ ...old, network: false }));
    window.addEventListener("online", online); window.addEventListener("offline", offline);
    return () => { window.removeEventListener("online", online); window.removeEventListener("offline", offline); streamRef.current?.getTracks().forEach((track) => track.stop()); };
  }, []);

  const requestDevices = async () => {
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera and microphone access are not supported in this browser. Try a recent version of Chrome or Edge over HTTPS or localhost.");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setResults((old) => ({ ...old, camera: stream.getVideoTracks().some((track) => track.readyState === "live"), mic: stream.getAudioTracks().some((track) => track.readyState === "live") }));
      setMicTested(false);
    } catch (err) { setError(err.name === "NotAllowedError" ? "Camera or microphone permission was denied. Allow access in your browser settings, then try again." : err.message || "Could not access your camera and microphone."); }
  };

  const testMic = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setError("This browser does not support built-in speech recognition. You can still use the answer text box during the interview."); setMicTested(true); return; }
    const recognition = new Recognition(); recognition.lang = "en-US"; recognition.interimResults = false; recognition.maxAlternatives = 1;
    recognition.onresult = () => { setMicTested(true); setError(""); };
    recognition.onerror = (event) => { setMicTested(true); setError(event.error === "not-allowed" ? "Speech recognition permission was denied. You can still type answers." : "We could not detect speech. Check your microphone or continue with typed answers."); };
    recognition.onend = () => setMicTested(true);
    try { recognition.start(); } catch { setMicTested(true); }
  };

  const start = async () => {
    setBusy(true); setError("");
    try {
      const data = await apiRequest("/api/interviews/start", { method: "POST", body: JSON.stringify({ role: state?.config?.role, round: state?.config?.round, difficulty: state?.config?.difficulty || "Intermediate", jobDescription: state?.config?.jobDescription || "", resumeText: state?.config?.resumeText || "", durationMinutes: state?.config?.durationMinutes || 5 }) });
      navigate(`/interview/${data.interviewId}`, { state: { config: state?.config, firstQuestion: data.question, durationSeconds: data.durationSeconds } });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const canStart = results.browser && results.camera && results.mic && results.network;
  return <main className="interview-page"><div className="interview-shell">
    <button className="text-link" onClick={() => navigate(-1)}>← Back to setup</button>
    <div className="page-heading"><span className="eyebrow">BEFORE YOU BEGIN</span><h1>Let’s get your setup ready</h1><p>A quick check helps your selected interview duration run smoothly.</p></div>
    <div className="device-grid">
      <section className="device-card camera-card"><div className="section-title"><Camera size={19}/><div><h2>Camera preview</h2><p>Check framing and lighting before you begin.</p></div></div><div className="camera-preview"> <video ref={videoRef} autoPlay muted playsInline /> {!results.camera && <div className="camera-placeholder"><Camera size={34}/><span>Your camera preview will appear here</span></div>}</div><button className="secondary-action" onClick={requestDevices}>Enable camera & microphone</button><button className="secondary-action subtle" onClick={testMic} disabled={!results.mic}>Test microphone by speaking</button>{micTested && <p className="small-success">Microphone test attempted. You can also type answers if speech recognition is unavailable.</p>}</section>
      <section className="device-card"><div className="section-title"><ShieldCheck size={19}/><div><h2>Readiness checklist</h2><p>All required checks should be ready.</p></div></div><div className="check-list">{checks.map((item) => { const Icon = item.icon; const done = Boolean(results[item.id]); return <div className="check-row" key={item.id}><div className={`check-icon ${done ? "ready" : ""}`}>{done ? <CheckCircle2 size={19}/> : <Icon size={19}/>}</div><div className="check-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><span className={`status-pill ${done ? "ready" : "pending"}`}>{done ? "Ready" : "Pending"}</span></div>; })}</div><div className="privacy-note"><ShieldCheck size={17}/><span>Your camera and microphone are not saved as a video recording by this page. The app uses them for your live preview and answer input.</span></div>{error && <p className="form-error" role="alert"><CircleAlert size={17}/>{error}</p>}<button className="primary-action full" disabled={!canStart || busy} onClick={start}>{busy ? "Preparing interview…" : "All checks complete · Start interview"}</button><p className="muted-note">If speech recognition is unavailable, you can type your answers in the interview room.</p></section>
    </div>
  </div></main>;
}
