import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Camera, Mic, MicOff, PhoneOff, Repeat2, Send, Clock3, CircleAlert } from "lucide-react";
import { apiRequest } from "../lib/api.js";
import { speakInterviewer, stopInterviewerVoice } from "../lib/voice.js";
import speakingVideo from "../assets/speaking.mp4";
import listeningVideo from "../assets/listening.mp4";

export default function InterviewRoom() {
  const { id } = useParams(); const navigate = useNavigate(); const { state } = useLocation();
  const videoRef = useRef(null); const streamRef = useRef(null); const recognitionRef = useRef(null); const finishLock = useRef(false);
  const [question, setQuestion] = useState(state?.firstQuestion || "Tell me about yourself and your experience relevant to this role.");
  const [answer, setAnswer] = useState(""); const [seconds, setSeconds] = useState(Number(state?.durationSeconds) || 300); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [listening, setListening] = useState(false); const [speaking, setSpeaking] = useState(false); const [count, setCount] = useState(0);
  const stopMedia = useCallback(() => { recognitionRef.current?.stop?.(); streamRef.current?.getTracks().forEach((track) => track.stop()); stopInterviewerVoice(); }, []);
  const finish = useCallback(async () => {
    if (finishLock.current) return; finishLock.current = true; setBusy(true); setError(""); stopMedia();
    try { await apiRequest(`/api/interviews/${id}/finish`, { method: "POST", body: JSON.stringify({}) }); navigate(`/report/${id}`, { replace: true }); }
    catch (err) { finishLock.current = false; setError(err.message); setBusy(false); }
  }, [id, navigate, stopMedia]);
  useEffect(() => {
    const handleVoiceState = (event) => setSpeaking(Boolean(event.detail?.speaking));
    window.addEventListener("interviewly:voice-state", handleVoiceState);
    return () => window.removeEventListener("interviewly:voice-state", handleVoiceState);
  }, []);
  useEffect(() => {
    let active = true;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true }).then((stream) => { if (!active) { stream.getTracks().forEach((track) => track.stop()); return; } streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; }).catch(() => setError("Camera or microphone is unavailable. You can still type an answer, but check permissions if you want live preview."));
    return () => { active = false; stopMedia(); };
  }, [stopMedia]);
  useEffect(() => { if (seconds <= 0) { finish(); return; } const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000); return () => window.clearTimeout(timer); }, [seconds, finish]);
  const speakQuestion = () => { void speakInterviewer(question); };

  // Speak each new interview question automatically; no "Listen to question" tap required.
  const autoSpokenQuestionRef = useRef("");
  useEffect(() => {
    const text = String(question || "").trim();
    if (!text || autoSpokenQuestionRef.current === text) return;
    autoSpokenQuestionRef.current = text;
    const timer = window.setTimeout(() => { void speakInterviewer(text); }, 350);
    return () => window.clearTimeout(timer);
  }, [question]);
  const startListening = () => {
    stopInterviewerVoice();
    setSpeaking(false);
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setError("Speech recognition is not supported in this browser. Please type your answer below."); return; }
    const recognition = new Recognition(); recognition.lang = "en-US"; recognition.interimResults = true; recognition.continuous = true;
    recognition.onresult = (event) => { let text = ""; for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript + " "; setAnswer(text.trim()); };
    recognition.onerror = (event) => setError(event.error === "not-allowed" ? "Microphone permission denied. Type your answer instead." : "Speech input stopped. You can continue typing.");
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition; setError(""); setListening(true); try { recognition.start(); } catch { setListening(false); setError("Could not start speech input. Please type your answer."); }
  };
  const stopListening = () => { recognitionRef.current?.stop?.(); setListening(false); };
  const submitAnswer = async () => {
    if (!answer.trim() || busy) return; stopListening(); setBusy(true); setError("");
    try { const data = await apiRequest(`/api/interviews/${id}/answer`, { method: "POST", body: JSON.stringify({ answer: answer.trim() }) }); setCount((value) => value + 1); setAnswer(""); if (data.nextQuestion) { setQuestion(data.nextQuestion); } else { await finish(); } }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const mmss = `${String(Math.floor(seconds / 60)).padStart(2,"0")}:${String(seconds % 60).padStart(2,"0")}`;
  return <main className="interview-page room-page"><div className="room-shell"><header className="room-topbar"><div><span className="eyebrow">INTERVIEWLY LIVE</span><h1>{state?.config?.role || "Practice Interview"}</h1></div><div className={`timer ${seconds <= 60 ? "urgent" : ""}`}><Clock3 size={17}/>{mmss} <span>remaining</span></div><button className="end-interview" onClick={finish} disabled={busy}><PhoneOff size={16}/> End interview</button></header>
    <div className="room-grid"><section className="interviewer-panel"><div className="panel-label"><span className="live-dot"/> AI INTERVIEWER</div><div className="ai-video-avatar">
      <video
        key={speaking ? "speaking" : "listening"}
        className="ai-state-video"
        src={speaking ? speakingVideo : listeningVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        aria-label={speaking ? "AI interviewer speaking" : "AI interviewer listening"}
      />
      <span className={`avatar-state-pill ${speaking ? "is-speaking" : listening ? "is-listening" : ""}`}>
        {speaking ? "Speaking" : listening ? "Listening" : "Ready"}
      </span>
    </div><div className="interviewer-name"><strong>Interviewly AI</strong><span>English · {state?.config?.round || "Role Related"}</span></div><div className="question-box"><span className="question-label">QUESTION {count + 1}</span><p>{question}</p></div></section>
    <section className="candidate-panel"><div className="panel-label"><Camera size={16}/> YOUR CAMERA</div><div className="candidate-video"><video ref={videoRef} autoPlay muted playsInline/><div className="candidate-caption">You</div></div><div className="answer-heading"><div><h2>Your answer</h2><p>Speak clearly or type your response below.</p></div><button className={`mic-action ${listening ? "recording" : ""}`} onClick={listening ? stopListening : startListening}>{listening ? <MicOff size={17}/> : <Mic size={17}/>} {listening ? "Stop" : "Speak"}</button></div><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Your spoken answer will appear here. You can also type your answer…" rows={5} maxLength={10000}/><div className="answer-footer"><span>{answer.length} characters</span><button className="primary-action" onClick={submitAnswer} disabled={!answer.trim() || busy}><Send size={16}/>{busy ? "Evaluating…" : "Submit answer"}</button></div>{error && <p className="form-error" role="alert"><CircleAlert size={16}/>{error}</p>}<button className="text-link repeat-link" onClick={speakQuestion}><Repeat2 size={15}/> Repeat question</button></section></div><p className="room-disclaimer">Your answers are used to generate interview feedback. Camera video is previewed locally and is not uploaded by this interview room.</p></div></main>;
}
