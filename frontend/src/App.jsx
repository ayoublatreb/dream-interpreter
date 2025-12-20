import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function DreamInterpreterApp() {
  const [mode, setMode] = useState("record"); // record | explain | text
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Data
  const [dreamText, setDreamText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [manualText, setManualText] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  /* ================= CSS Styles ================= */
  useEffect(() => {
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;800&display=swap');

    :root {
      --bg-deep: #0f0c29;
      --bg-mid: #302b63;
      --bg-light: #24243e;
      --accent-gold: #ffd700;
      --accent-cyan: #00d2ff;
      --text-main: #ffffff;
      --text-sub: #e0e0e0;
      --glass-bg: rgba(255, 255, 255, 0.05);
      --glass-border: rgba(255, 255, 255, 0.1);
      --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: 'Cairo', sans-serif;
      background: linear-gradient(135deg, var(--bg-deep), var(--bg-mid), var(--bg-light));
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      direction: rtl;
      overflow-x: hidden;
      color: var(--text-main);
    }

    /* Particles / Stars Background */
    body::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(white 1px, transparent 1px);
      background-size: 50px 50px; opacity: 0.1; z-index: -2;
    }

    /* Ambient Glow */
    body::after {
      content: ''; position: absolute; bottom: -10%; right: -10%; width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.08), transparent 70%);
      border-radius: 50%;
      animation: float 15s ease-in-out infinite reverse;
      z-index: -1;
    }
    @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, 30px); } }

    .container { width: 100%; max-width: 600px; padding: 20px; position: relative; z-index: 1; }

    .card {
      background: var(--glass-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border); border-radius: 24px; padding: 40px 30px;
      box-shadow: var(--glass-shadow); text-align: center; transition: all 0.3s ease;
    }

    .title {
      font-size: 36px; font-weight: 800;
      background: linear-gradient(to bottom, #fff, #aaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    .subtitle { font-size: 16px; color: var(--accent-cyan); letter-spacing: 0.5px; margin-bottom: 20px; font-weight: 600; }

    /* Visualizer Bars */
    .visualizer { display: flex; align-items: center; justify-content: center; height: 40px; margin-top: 20px; gap: 4px; }
    .bar { width: 6px; background: var(--accent-cyan); border-radius: 4px; animation: wave 1s ease-in-out infinite; }
    .bar:nth-child(odd) { background: var(--accent-gold); }
    @keyframes wave { 0%, 100% { height: 10px; } 50% { height: 35px; } }
    
    /* Mic */
    .mic-wrap { position: relative; display: flex; justify-content: center; margin: 30px auto; }
    .mic-circle {
      width: 140px; height: 140px; border-radius: 50%;
      background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2));
      display: flex; align-items: center; justify-content: center; font-size: 50px;
      color: var(--text-main); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s; z-index: 2;
    }
    .mic-circle:hover { transform: scale(1.05); border-color: var(--accent-cyan); }
    .mic-circle.recording { color: #ff4d4d; border-color: #ff4d4d; }

    .pulse-ring {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 140px; height: 140px; border-radius: 50%; border: 2px solid var(--accent-cyan); opacity: 0; pointer-events: none;
    }
    .recording .pulse-ring { animation: pulse-ring-anim 2s infinite; }
    @keyframes pulse-ring-anim { 0% { width: 140px; height: 140px; opacity: 0.8; } 100% { width: 280px; height: 280px; opacity: 0; } }

    /* Response */
    .reply-box {
      margin-top: 30px; padding: 25px; background: rgba(0,0,0,0.2);
      border-radius: 20px; border-right: 4px solid var(--accent-gold);
      text-align: justify; line-height: 1.8; font-size: 17px;
    }
    .dream-quote { font-size: 14px; opacity: 0.6; font-style: italic; margin-top: 15px; }

    /* Buttons */
    .btn { padding: 14px 28px; border-radius: 50px; border: none; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 20px; }
    .btn-primary { background: linear-gradient(90deg, var(--accent-cyan), #3a7bd5); color: #fff; box-shadow: 0 4px 15px rgba(0, 210, 255, 0.4); }
    .btn-ghost { background: transparent; border: 1px solid var(--glass-border); color: var(--text-sub); }

    /* Animations */
    .fade-in { animation: fadeIn 0.8s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    `;
    if (!document.getElementById("styles")) {
      const s = document.createElement("style");
      s.id = "styles"; s.innerHTML = css; document.head.appendChild(s);
    }
  }, []);

  /* ================= PWA Install ================= */
  useEffect(() => {
    const checkInstalled = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(standalone);
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleDisplayModeChange = () => {
      checkInstalled();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.matchMedia('(display-mode: standalone)').addListener(handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.matchMedia('(display-mode: standalone)').removeListener(handleDisplayModeChange);
    };
  }, []);

  /* ================= Service Worker ================= */
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  /* ================= Logic ================= */

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRecorderRef.current = rec;
      audioChunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      rec.start();
      setRecording(true);
    } catch { alert("الميكروفون غير متاح"); }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      handleUpload(audioBlob);
    };
  };

  const handleUpload = async (audioBlob) => {
    setLoading(true);
    setMode("explain");
    setReplyText("");
    setDreamText("");
    setAudioSrc(null);

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const res = await axios.post("http://localhost:3001/dream-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { inputText, replyText, audioBase64 } = res.data;
      setDreamText(inputText);
      setReplyText(replyText);
      if (audioBase64) setAudioSrc(`data:audio/mp3;base64,${audioBase64}`);
    } catch {
      setReplyText("حدث خطأ في الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitText = async () => {
    if (!manualText.trim()) {
      alert("يرجى كتابة الحلم أولاً.");
      return;
    }
    setLoading(true);
    setMode("explain");
    setReplyText("");
    setDreamText("");

    try {
      const res = await axios.post("http://localhost:3001/dream-text", { text: manualText });
      const { inputText, replyText, audioBase64 } = res.data;
      setDreamText(inputText);
      setReplyText(replyText);
      if (audioBase64) setAudioSrc(`data:audio/mp3;base64,${audioBase64}`);
    } catch {
      setReplyText("حدث خطأ في الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert('التطبيق غير متاح للتثبيت حالياً. يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <div className="container">
      <div className="card fade-in">

        <div className="title">مفسر الأحلام</div>
        <div className="subtitle"></div>

        {/* === Record Mode === */}
        {mode === "record" && (
          <div className="mic-container fade-in">
            {recording && (
              <div className="visualizer">
                <div className="bar" style={{ animationDelay: "0s" }}></div>
                <div className="bar" style={{ animationDelay: "0.2s" }}></div>
                <div className="bar" style={{ animationDelay: "0.4s" }}></div>
                <div className="bar" style={{ animationDelay: "0.1s" }}></div>
                <div className="bar" style={{ animationDelay: "0.3s" }}></div>
              </div>
            )}

            <div className="mic-wrap">
              {recording && <div className="pulse-ring"></div>}
              {recording && <div className="pulse-ring" style={{ animationDelay: "1s" }}></div>}
              <div
                className={`mic-circle ${recording ? "recording" : ""}`}
                onClick={() => (recording ? stopRecording() : startRecording())}
              >
                {recording ? "⏹" : "🎙️"}
              </div>
            </div>

            <div style={{ color: "var(--text-sub)", marginTop: "20px" }}>
              {recording ? "جارٍ الاستماع..." : "اضغط وتحدث"}
            </div>

            {/* Optional Text Input Trigger */}
            <div style={{ marginTop: '40px' }}>
              <button
                className="btn btn-ghost" style={{ fontSize: "14px", padding: "8px 16px" }}
                onClick={() => setMode("text")}
              >
                📥 كتابة الحلم يدوياً
              </button>
            </div>

            {/* PWA Install Button */}
            {!isInstalled && (
              <button className="btn btn-primary" onClick={handleInstall} style={{ marginTop: '10px' }}>
                📱 تثبيت التطبيق
              </button>
            )}
          </div>
        )}

        {/* === Text Mode === */}
        {mode === "text" && (
          <div className="fade-in">
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="اكتب حلمك هنا..."
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "150px",
                  padding: "15px",
                  borderRadius: "20px",
                  border: "1px solid var(--glass-border)",
                  background: "var(--glass-bg)",
                  color: "var(--text-main)",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  direction: "rtl"
                }}
              />
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={handleSubmitText}>
                  تفسير الحلم
                </button>
                <button className="btn btn-ghost" onClick={() => setMode("record")}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === Explain Mode === */}
        {mode === "explain" && (
          <div className="fade-in">
            {loading ? (
              <div style={{ padding: "40px" }}>
                <div style={{ width: "50px", height: "50px", border: "4px solid #fff3", borderTopColor: "var(--accent-gold)", borderRadius: "50%", margin: "0 auto" }} className="spin"></div>
                <div style={{ marginTop: "20px", color: "var(--accent-gold)" }}>يتم الآن التفسير...</div>
              </div>
            ) : (
              <>
                {audioSrc && (
                  <div style={{ margin: "20px 0" }}>
                    <audio controls autoPlay src={audioSrc} style={{ width: "100%", height: "40px", borderRadius: "20px" }} />
                    {/* Playback Visualizer */}
                    <div className="visualizer" style={{ marginTop: "10px", height: "20px" }}>
                      <div className="bar"></div><div className="bar"></div><div className="bar"></div>
                    </div>
                  </div>
                )}

                <div className="reply-box">{replyText}</div>
                {dreamText && <div className="dream-quote">"{dreamText}"</div>}

                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "25px" }}>
                  <button className="btn btn-primary" onClick={() => setMode("record")}>تسجيل آخر</button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
