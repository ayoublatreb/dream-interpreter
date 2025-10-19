import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("ar-SA");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false); // false par défaut

  // 🔹 Charger les voix disponibles
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        const darija = voices.find((v) => v.lang === "ar-MA");
        if (darija) setLang("ar-MA");
      } else {
        setTimeout(loadVoices, 200);
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  // 🔹 Gérer l'événement "beforeinstallprompt"
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true); // on peut afficher le bouton
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // 🔹 Fonction pour lancer l'installation PWA
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ Application installée !");
    } else {
      console.log("❌ Installation annulée.");
    }

    setDeferredPrompt(null);
    setInstallable(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Ton navigateur ne supporte pas la reconnaissance vocale 😢.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      askDream(transcript);
    };

    recognition.start();
  };

  const askDream = async (q) => {
    try {
      const res = await axios.post("http://localhost:3001/dream", { question: q });
      setAnswer(res.data.reply);
      speak(res.data.reply);
    } catch (err) {
      console.error(err);
      setAnswer("❌ Erreur : impossible d'obtenir l'interprétation.");
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let targetVoice = voices.find((v) => v.lang === lang);

    if (!targetVoice && lang === "ar-MA") {
      targetVoice = voices.find((v) => v.lang === "ar-SA");
      if (targetVoice) {
        alert("⚠️ Voix Darija non trouvée, lecture en Arabe classique.");
      }
    }

    if (!targetVoice && lang.includes("ar")) {
      targetVoice = voices.find((v) => v.lang === "fr-FR");
      alert("⚠️ Aucune voix arabe trouvée. Lecture en français.");
    }

    if (!targetVoice) {
      alert("❌ Aucune voix compatible trouvée.");
      return;
    }

    utterance.voice = targetVoice;
    utterance.lang = targetVoice.lang;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const testArabicVoice = () => {
    speak("مرحبا بك، هذا اختبار الصوت.");
  };

  return (
    <div className="app-container">
      <div className="app-box">
        <h1 className="app-title">🔮 تفسير الأحلام</h1>

        {/* ✅ Bouton d'installation PWA */}
        {installable && (
          <button onClick={handleInstall} className="button install">
            📲 Installer l'application
          </button>
        )}

        <button
          onClick={startListening}
          disabled={listening}
          className={`button ${listening ? "listening" : "listen"}`}
        >
          {listening ? "🎙️ En écoute..." : "🎤 إحكي لي عن حلمك"}
        </button>

        <textarea value={question} readOnly rows="3" className="question-box" />

        <div className="language-select">
          <label style={{ marginRight: "10px" }}>🔊 Langue de lecture :</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="language-dropdown"
          >
            <option value="ar-SA">Arabe classique</option>
            <option value="fr-FR">Français</option>
            <option value="en-US">English</option>
          </select>
        </div>

        <button onClick={testArabicVoice} className="button test">
          🧪 Tester la voix sélectionnée
        </button>

        {answer && (
          <div className="answer-box">
            <h2 className="answer-title">📖 التفسير :</h2>
            <p className="answer-text">{answer}</p>
            <button onClick={() => speak(answer)} className="button speak">
              🔊 إعادة قراءة الرد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
