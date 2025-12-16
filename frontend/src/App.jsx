import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function DreamInterpreterApp() {
  const [mode, setMode] = useState("record");
  const [listening, setListening] = useState(false);
  const [dream, setDream] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 PWA
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);

  const recognitionRef = useRef(null);

  /* ================= CSS (كما هو) ================= */
  useEffect(() => {
    const css = `
    :root{ --bg1:#0e0760; --bg2:#4a0f7a; --accent:#00c2ff; }
    *{box-sizing:border-box}
    html,body,#root{height:100%}
    body{margin:0;font-family:"Cairo";background:linear-gradient(135deg,var(--bg1),var(--bg2));display:flex;align-items:center;justify-content:center;direction:rtl}

    .container{width:100%;max-width:900px;padding:28px;position:relative}

    .card{background:rgba(255,255,255,0.04);padding:36px;border-radius:18px;color:#fff;box-shadow:0 18px 60px rgba(0,0,0,0.45);position:relative;margin-top:30px;}

    .title{text-align:center;font-size:32px;font-weight:800;margin-top:10px}
    .subtitle{text-align:center;color:#ddd;margin-top:6px}

    .mic-wrap{display:flex;flex-direction:column;align-items:center;margin-top:22px}
    .mic-circle{width:220px;height:220px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.03);border:6px solid rgba(255,255,255,0.12);cursor:pointer;transition:0.2s;position:relative}
    .mic-circle.recording{animation:pulse 1.4s infinite;border-color:red}
    @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.07)}100%{transform:scale(1)}}

    .mic-icon{position:relative;}
    .finger{position:absolute;bottom:-26px;left:50%;transform:translateX(-50%);font-size:24px;}
    .mic-label{position:absolute;bottom:16px;font-size:16px;color:#fff}

    textarea{width:100%;min-height:80px;margin-top:18px;background:#00000022;color:#fff;padding:12px;border-radius:12px;border:none;}

    .btn{padding:10px 14px;margin-top:12px;border-radius:10px;border:none;font-weight:700;cursor:pointer}
    .btn-primary{background:linear-gradient(90deg,var(--accent), #007bb5);color:#012}
    .btn-ghost{background:transparent;border:1px solid #fff3;color:#fff}

    .explain-circle{width:200px;height:200px;border-radius:50%;border:6px solid #00c2ff88;margin:20px auto;display:flex;align-items:center;justify-content:center;position:relative}
    .stop-square{width:60px;height:60px;background:#00c2ff;color:#012;border-radius:10px;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer}

    .reply-box{background:#0005;padding:16px;border-radius:12px;margin-top:16px;font-size:17px;line-height:1.7}
    `;
    if (!document.getElementById("styles")) {
      const s = document.createElement("style");
      s.id = "styles";
      s.innerHTML = css;
      document.head.appendChild(s);
    }
  }, []);

  /* ================= PWA ================= */
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setInstallable(false);
  };

  /* ================= Voice ================= */
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("المتصفح لا يدعم التعرف على الصوت");

    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "ar-SA";
    rec.interimResults = false;

    rec.onstart = () => setListening(true);
    rec.onresult = (e) => setDream(e.results[0][0].transcript);

    rec.start();
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
    setListening(false);
    if (!dream.trim()) return;
    setMode("explain");
    askDream(dream);
  };

  const speak = (text) => {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  const askDream = async (text) => {
    setLoading(true);
    setReply("");
    try {
      const res = await axios.post("http://localhost:3001/dream", { question: text });
      setReply(res.data.reply);
      speak(res.data.reply);
    } catch {
      const fallback = "تفسير عام: يبدو أن حلمك مرتبط بمشاعر داخلية.";
      setReply(fallback);
      speak(fallback);
    }
    setLoading(false);
  };

  return (
    <div className="container">

      {/* 🔹 زر تثبيت التطبيق (PWA فقط) */}
      {installable && (
        <button
          onClick={handleInstall}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            zIndex: 9999,
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            fontWeight: "700",
            cursor: "pointer",
            background: "#00c2ff",
            color: "#012",
            boxShadow: "0 6px 20px rgba(0,0,0,.35)"
          }}
        >
          📲 تثبيت التطبيق
        </button>
      )}

      <div className="card">

        {mode === "record" && (
          <>
            <div className="title">احكِ حلمك</div>
            <div className="subtitle">سجّل حلمك أو اكتبه ثم اضغط للتفسير</div>

            <div className="mic-wrap">
              <div
                className={`mic-circle ${listening ? "recording" : ""}`}
                onClick={() => (listening ? stopRecognition() : startListening())}
              >
                  <div className="mic-icon">
    <svg width="70" height="70" viewBox="0 0 24 24" fill="#FFD54F">
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z"/>
      <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.08A7 7 0 0 0 19 11z"/>
    </svg>
    <div className="finger">☝️</div>
  </div>
                <div className="mic-label">
                  {listening ? "اضغط للإنهاء" : "اضغط للتسجيل"}
                </div>
              </div>

              <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="اكتب حلمك هنا..."
              />

              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!dream.trim()) return alert("أدخل حلمك أولاً");
                  setMode("explain");
                  askDream(dream);
                }}
              >
                {loading ? "جارٍ التفسير..." : "فسّر الحلم"}
              </button>

              <button className="btn btn-ghost" onClick={() => setDream("")}>
                مسح
              </button>
            </div>
          </>
        )}

        {mode === "explain" && (
          <>
            <div className="title">التفسير الصوتي</div>

            <div className="explain-circle">
              <div className="stop-square" onClick={() => speechSynthesis.cancel()}>
                ⏹
              </div>
            </div>

            <div className="reply-box">{reply || "جارٍ تجهيز التفسير..."}</div>

            <button className="btn btn-primary" onClick={() => speak(reply)}>
              🔊 إعادة الاستماع
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => {
                speechSynthesis.cancel();
                setMode("record");
                setReply("");
              }}
            >
              رجوع
            </button>
          </>
        )}

      </div>
    </div>
  );
}
