const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5100").replace(/\/+$/, "");
let currentAudio = null;
let currentObjectUrl = null;

function announceVoice(speaking) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("interviewly:voice-state", { detail: { speaking } }));
  }
}

function browserSpeak(text) {
  if (!("speechSynthesis" in window)) { announceVoice(false); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.94;
  utterance.pitch = 1.02;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find((voice) => /^en-US$/i.test(voice.lang)) || voices.find((voice) => /^en/i.test(voice.lang)) || null;
  utterance.onstart = () => announceVoice(true);
  utterance.onend = () => announceVoice(false);
  utterance.onerror = () => announceVoice(false);
  window.speechSynthesis.speak(utterance);
}

export function stopInterviewerVoice() {
  announceVoice(false);
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
}

export async function speakInterviewer(text) {
  const transcript = String(text || "").trim();
  if (!transcript) return;
  stopInterviewerVoice();
  const token = localStorage.getItem("interviewly_token");
  if (!token) { browserSpeak(transcript); return; }
  try {
    const response = await fetch(`${API_BASE}/api/interviews/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text: transcript }),
    });
    if (!response.ok) throw new Error("Cartesia voice unavailable");
    const blob = await response.blob();
    currentObjectUrl = URL.createObjectURL(blob);
    currentAudio = new Audio(currentObjectUrl);
    currentAudio.onplay = () => announceVoice(true);
    currentAudio.onended = () => {
      announceVoice(false);
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
      currentAudio = null;
    };
    await currentAudio.play();
  } catch {
    browserSpeak(transcript);
  }
}
