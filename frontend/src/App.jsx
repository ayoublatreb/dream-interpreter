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
        if (darija) setLang("ar-MA");
        else setLang("ar-SA");
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

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
  // 🔊 Text-to-Speech
  // ================================
  const speak = (text) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    let voice =
      voices.find((v) => v.lang === lang) ||
      voices.find((v) => v.lang === "ar-SA") ||
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
