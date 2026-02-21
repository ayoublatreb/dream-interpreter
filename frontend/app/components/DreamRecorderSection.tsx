'use client';

import { useState, useEffect, useRef } from 'react';

export default function DreamRecorderSection() {
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [dreamText, setDreamText] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretationResult, setInterpretationResult] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const deferredPromptRef = useRef<any>(null);
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      deferredPromptRef.current = e;
      console.log('deferredPrompt set:', deferredPromptRef.current);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    console.log('Event listener added');
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const playAudio = (base64Audio: string) => {
    try {
      const audioByteArray = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
      const blob = new Blob([audioByteArray], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      const audio = new Audio(url);
      audio.play().catch(err => console.error('Error playing audio:', err));
    } catch (error) {
      console.error('Error decoding audio:', error);
    }
  };

  const handleInterpret = async () => {
    if (mode === 'text' && !dreamText.trim()) return;
    
    setIsInterpreting(true);
    setInterpretationResult(null);
    setAudioUrl(null);
    
    try {
      const response = await fetch('/api/dream-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: dreamText }),
      });

      const data = await response.json();
      
      setIsInterpreting(false);
      if (data.replyText) {
        setInterpretationResult(data.replyText);
        if (data.audioBase64) {
          playAudio(data.audioBase64);
        }
      } else if (data.error) {
        setInterpretationResult("عذراً، حدث خطأ في تفسير حلمك. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      setIsInterpreting(false);
      setInterpretationResult("عذراً، تعذر الاتصال بالخادم. يرجى التحقق من اتصالك وحاول مرة أخرى.");
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks: Blob[] = [];
            
            mediaRecorder.ondataavailable = (event) => {
              audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              const audioUrl = URL.createObjectURL(audioBlob);
              setAudioUrl(audioUrl);
              
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64Audio = reader.result?.toString().split(',')[1];
                if (base64Audio) {
                  handleAudioInterpretation(base64Audio);
                }
              };
              reader.readAsDataURL(audioBlob);
              
              stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            
            setTimeout(() => {
              mediaRecorder.stop();
              setIsRecording(false);
            }, 4000);
          })
          .catch(error => {
            console.error('Error accessing microphone:', error);
            setIsRecording(false);
            setInterpretationResult('عذراً، لا يمكن الوصول إلى الميكروفون. يرجى التحقق من إعدادات المتصفح.');
          });
      } else {
        setIsRecording(false);
        setInterpretationResult('عذراً، المتصفح لا يدعم تسجيل الصوت.');
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleAudioInterpretation = async (base64Audio: string) => {
    setIsInterpreting(true);
    setInterpretationResult(null);
    
    try {
      const formData = new FormData();
      formData.append('audio', base64Audio);
      
      const response = await fetch('/api/dream-audio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      setIsInterpreting(false);
      if (data.replyText) {
        setInterpretationResult(data.replyText);
        if (data.audioBase64) {
          playAudio(data.audioBase64);
        }
      } else if (data.error) {
        setInterpretationResult("عذراً، حدث خطأ في تفسير حلمك. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      setIsInterpreting(false);
      setInterpretationResult("عذراً، تعذر الاتصال بالخادم. يرجى التحقق من اتصالك وحاول مرة أخرى.");
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        <div className="w-full max-w-md bg-[#1a1c3d] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-indigo-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 blur-3xl -ml-16 -mb-16"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-indigo-400 text-3xl drop-shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-pulse">🧩</span>
              <h2 className="text-3xl font-extrabold text-white tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                تفسير الأحلام
              </h2>
              <span className="text-indigo-400 text-3xl drop-shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-pulse">🧩</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">استكشف معاني أحلامك</p>

            <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
              <button 
                onClick={() => { setMode('voice'); setInterpretationResult(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  mode === 'voice' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🎙️</span>
                تسجيل صوتي
              </button>
              <button 
                onClick={() => { setMode('text'); setInterpretationResult(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  mode === 'text' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>✏️</span>
                كتابة الحلم
              </button>
            </div>

            {interpretationResult ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 text-right border border-white/10">
                <h4 className="text-yellow-400 font-bold mb-3">تفسير حلمك:</h4>
                <p className="text-gray-200 leading-relaxed text-sm">
                  {interpretationResult}
                </p>
                {audioUrl && (
                  <button 
                    onClick={() => {
                      const audio = new Audio(audioUrl);
                      audio.play();
                    }}
                    className="mt-4 mr-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>🔊</span>
                    <span>تشغيل الصوت</span>
                  </button>
                )}
                <button 
                  onClick={() => setInterpretationResult(null)}
                  className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  تفسير حلم آخر
                </button>
              </div>
            ) : isInterpreting ? (
              <div className="py-12 flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-indigo-300 animate-pulse">جاري تحليل رموز الحلم...</p>
              </div>
            ) : mode === 'voice' ? (
              <>
                <div className="flex justify-center mb-8">
                  <button 
                    onClick={toggleRecording}
                    className="relative group cursor-pointer outline-none"
                  >
                    <div className={`absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl transition-all duration-500 ${isRecording ? 'animate-ping scale-150 bg-red-500/30' : 'group-hover:bg-indigo-500/30'}`}></div>
                    <div className={`relative w-32 h-32 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${isRecording ? 'border-red-500 bg-red-950/50 scale-110' : 'border-indigo-400/30 bg-indigo-950/50 group-hover:scale-105'}`}>
                      <div className={`w-24 h-24 rounded-full border flex items-center justify-center transition-all ${isRecording ? 'border-red-400/50 animate-pulse' : 'border-indigo-400/50'}`}>
                        <span className={`text-5xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] ${isRecording ? 'text-red-400' : ''}`}>
                          {isRecording ? '🛑' : '🎤'}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
                <p className={`${isRecording ? 'text-red-400 animate-pulse' : 'text-yellow-400'} font-medium mb-10 text-sm`}>
                  {isRecording ? 'جاري التسجيل... تحدث الآن' : 'اضغط للبدء بالتسجيل بالعربية الفصحى'}
                </p>
              </>
            ) : (
              <div className="mb-8">
                <textarea 
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  placeholder="اكتب تفاصيل حلمك هنا بكل دقة..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-right focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none mb-4"
                ></textarea>
                <button 
                  onClick={handleInterpret}
                  disabled={!dreamText.trim()}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all cursor-pointer"
                >
                  تفسير الحلم الآن
                </button>
              </div>
            )}

            <div className="space-y-4">
              {mode === 'voice' && !interpretationResult && !isInterpreting && (
                <button 
                  onClick={() => setMode('text')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-purple-400 to-purple-500 text-white font-bold text-lg shadow-xl hover:shadow-purple-500/20 transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>✏️</span>
                  كتابة الحلم يدوياً
                </button>
              )}
              
              <button 
                onClick={() => {
                  console.log('Install button clicked, deferredPrompt:', deferredPromptRef.current);
                  if (deferredPromptRef.current) {
                    deferredPromptRef.current.prompt();
                    deferredPromptRef.current.userChoice.then((choiceResult: any) => {
                      if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                      } else {
                        console.log('User dismissed the A2HS prompt');
                      }
                      deferredPromptRef.current = null;
                    });
                  } else {
                    console.log('No deferredPrompt available - PWA may already be installed or not supported');
                  }
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold text-lg shadow-xl hover:shadow-blue-500/20 transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📱</span>
                تثبيت التطبيق
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
