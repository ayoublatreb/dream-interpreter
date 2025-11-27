import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [dream, setDream] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [lang, setLang] = useState("ar-MA");

  // ================================
  // 🔊 تحميل الأصوات
  // ================================
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
        const darija = v.find((x) => x.lang === "ar-MA");
        setLang(darija ? "ar-MA" : "ar-SA");
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // ================================
  // 📲 PWA Install
  // ================================
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);

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

  // ================================
  // 🎤 تسجيل الصوت
  // ================================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("المتصفح ديالك ما كيدعمش التعرف على الصوت.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setDream(transcript);
      askDream(transcript);
    };

    recognition.start();
  };

  // ================================
  // 🔗 إرسال الحلم للباك
  // ================================
  const askDream = async (text) => {
    setLoading(true);
    setReply("");
    try {
      const res = await axios.post("http://localhost:3001/dream", {
        question: text,
      });
      setReply(res.data.reply);
      speak(res.data.reply);
    } catch (err) {
      console.error(err);
      setReply("❌ وقعات شي مشكل، حاول مرة أخرى.");
    }
    setLoading(false);
  };

  // ================================
  // 🔊 Text-to-Speech مع تشكيل مغربي
  // ================================
  const speak = (text) => {
    if (!text) return;
    const tashkil = (txt) =>
      txt
        .replace(/\bهاد\b/g, "هَادْ")
        .replace(/\bالحلم\b/g, "لْحَلْمْ")
        .replace(/\bراه\b/g, "رَاهْ")
        .replace(/\bكيبّان\b/g, "كِيبَّانْ")
        .replace(/\bكنت\b/g, "كُنتْ")
        .replace(/\bكت\b/g, "كِتْ")
        .replace(/\bمع\b/g, "مَعَ")
        .replace(/\bفوق\b/g, "فُوقْ")
        .replace(/\bالصحراء\b/g, "لصَّحْرَاءْ")
        .replace(/\bالجمل\b/g, "لْجَمَلْ")
        .replace(/\bممكن\b/g, "مُمكِنْ")
        .replace(/\bشوي\b/g, "شْوَيَّةْ")
        .replace(/\bحاجة\b/g, "حَاجَةْ")
        .replace(/\bكتحس\b/g, "كِتْحِسْ")
        .replace(/\bتحاول\b/g, "تْحَاوْلْ")
        .replace(/\bتبحث\b/g, "تْبْحَثْ");
    const utter = new SpeechSynthesisUtterance(tashkil(text));
    const voice =
      voices.find((v) => v.lang === lang) ||
      voices.find((v) => v.lang.startsWith("ar")) ||
      voices[0];
    if (voice) utter.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const testVoice = () => speak("سلام! هادا اختبار الصوت.");

  // ================================
  // UI
  // ================================
  return (
    <div className="app-container">
      <div className="app-box">
        <h1>🔮 تفسير الأحلام بالدارجة</h1>

        {/* زر التثبيت */}
        {installable && (
          <button onClick={handleInstall} className="install-button">
            📲 تثبيت التطبيق
          </button>
        )}

        {/* 🎤 زر الميكروفون */}
        <button
          onClick={startListening}
          disabled={listening}
          className={`mic-button ${listening ? "recording" : ""}`}
        >
          🎤 {listening ? "كنسجّل..." : "سجّل حلمك"}
        </button>

        {/* مربع النص */}
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="اكتب حلمك هنا أو سجّل بالصوت..."
          rows={5}
        />

        {/* زر إرسال */}
        <button
          onClick={() => askDream(dream)}
          disabled={loading || !dream}
          className="submit-button"
        >
          {loading ? "كنفسّر..." : "فسّر ليا الحلم"}
        </button>

        {/* اختيار الصوت */}
        <div className="controls-container">
          <label>🔊 صوت القراءة:</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="ar-MA">الدارجة المغربية</option>
            <option value="ar-SA">العربية</option>
          </select>
          <button onClick={testVoice} className="test-voice-button">
            🧪 اختبار
          </button>
        </div>

        {/* التفسير */}
        {reply && (
          <div className="reply-container">
            <h3>📖 التفسير:</h3>
            <p>{reply}</p>
            <button onClick={() => speak(reply)} className="replay-button">
              🔊 إعادة الاستماع
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
