'use client'

import React, { useEffect, useRef, useState, useCallback, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import soundEffects from '../utils/soundEffects';


function MainContent() {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState("record"); // record | explain | text
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Data
    const [dreamText, setDreamText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [audioSrc, setAudioSrc] = useState(null);
    const [manualText, setManualText] = useState("");

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);
    const loadingIntervalRef = useRef(null);

    // API base URL from environment variable
    //const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const API_BASE_URL = '/api';

    // Handle shared dream parameters
    useEffect(() => {
        const d = searchParams.get('d');
        const i = searchParams.get('i');

        if (d && i) {
            setDreamText(d);
            setReplyText(i);
            setMode("explain");
        }
    }, [searchParams]);


    /* ================= PWA Install ================= */
    useEffect(() => {
        const checkInstalled = () => {
            const standalone = window.matchMedia('(display-mode: standalone)').matches;
            setIsInstalled(standalone);
        };

        checkInstalled();

        const handleBeforeInstallPrompt = (e) => {
            console.log('✅ beforeinstallprompt fired!');
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleDisplayModeChange = () => {
            checkInstalled();
        };

        const handleAppInstalled = () => {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'app_installed', {
                    'event_category': 'PWA',
                    'event_label': 'App Successfully Installed'
                });
            }
            console.log('App was installed');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        window.matchMedia('(display-mode: standalone)').addListener(handleDisplayModeChange);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.matchMedia('(display-mode: standalone)').removeListener(handleDisplayModeChange);
        };
    }, []);

    /* ================= Service Worker ================= */
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
            soundEffects.playRecordStart();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const rec = new MediaRecorder(stream);
            mediaRecorderRef.current = rec;
            audioChunksRef.current = [];
            rec.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            rec.start();
            setRecording(true);
            setRecordingTime(0);

            // Start recording timer
            recordingTimerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 60) {
                        stopRecording();
                        return 60;
                    }
                    return prev + 1;
                });
            }, 1000);
        } catch {
            soundEffects.playError();
            alert("الميكروفون غير متاح");
        }
    };

    const stopRecording = () => {
        if (!mediaRecorderRef.current) return;
        soundEffects.playRecordStop();
        mediaRecorderRef.current.stop();
        setRecording(false);

        // Clear recording timer
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }

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
        setLoadingProgress(0);

        // Simulate loading progress
        loadingIntervalRef.current = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 90) return 90;
                return prev + Math.random() * 15;
            });
        }, 500);

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
            const res = await axios.post(`${API_BASE_URL}/dream-audio`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const { inputText, replyText, audioBase64 } = res.data;
            setLoadingProgress(100);

            setTimeout(() => {
                setDreamText(inputText);
                setReplyText(replyText);
                if (audioBase64) setAudioSrc(`data:audio/mp3;base64,${audioBase64}`);
            }, 300);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                setReplyText(error.response.data.error);
            } else {
                setReplyText("حدث خطأ في الاتصال.");
            }
            setLoadingProgress(100);
        } finally {
            if (loadingIntervalRef.current) {
                clearInterval(loadingIntervalRef.current);
                loadingIntervalRef.current = null;
            }
            setTimeout(() => setLoading(false), 500);
        }
    };

    const handleSubmitText = async () => {
        if (!manualText.trim()) {
            soundEffects.playError();
            alert("يرجى كتابة الحلم أولاً.");
            return;
        }
        soundEffects.playClick();
        setLoading(true);
        setMode("explain");
        setReplyText("");
        setDreamText("");
        setLoadingProgress(0);

        // Simulate loading progress
        loadingIntervalRef.current = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 90) return 90;
                return prev + Math.random() * 15;
            });
        }, 500);

        try {
            const res = await axios.post(`${API_BASE_URL}/dream-text`, { text: manualText });
            const { inputText, replyText, audioBase64 } = res.data;
            setLoadingProgress(100);

            setTimeout(() => {
                setDreamText(inputText);
                setReplyText(replyText);
                if (audioBase64) setAudioSrc(`data:audio/mp3;base64,${audioBase64}`);
                soundEffects.playSuccess();
            }, 300);
        } catch (error) {
            soundEffects.playError();
            if (error.response && error.response.status === 429) {
                setReplyText(error.response.data.error);
            } else {
                setReplyText("حدث خطأ في الاتصال.");
            }
            setLoadingProgress(100);
        } finally {
            if (loadingIntervalRef.current) {
                clearInterval(loadingIntervalRef.current);
                loadingIntervalRef.current = null;
            }
            setTimeout(() => setLoading(false), 500);
        }
    };

    const handleInstall = () => {
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'install_button_click', {
                'event_category': 'PWA',
                'event_label': 'User clicked install button'
            });
        }
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    if (typeof window.gtag === 'function') {
                        window.gtag('event', 'install_accepted', {
                            'event_category': 'PWA'
                        });
                    }
                } else {
                    console.log('User dismissed the install prompt');
                    if (typeof window.gtag === 'function') {
                        window.gtag('event', 'install_dismissed', {
                            'event_category': 'PWA'
                        });
                    }
                }
                setDeferredPrompt(null);
            });
        } else {
            alert('التطبيق غير متاح للتثبيت حالياً. يرجى المحاولة لاحقاً.');
        }
    };

    // Ripple effect for buttons - memoized
    const createRipple = useCallback((event) => {
        soundEffects.playClick();
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }, []);

    // Share functions - memoized
    const shareOnFacebook = useCallback(async () => {
        // Construct the backend share URL that serves the dynamic OG tags
        const dreamParam = dreamText ? encodeURIComponent(dreamText.substring(0, 300)) : '';
        const interpParam = replyText ? encodeURIComponent(replyText.substring(0, 1000)) : '';

        // Handle URL construction for absolute paths
        // Facebook MUST have an absolute URL to crawl
        const base = window.location.origin;
        const urlToShare = `${base}${API_BASE_URL}/share?d=${dreamParam}&i=${interpParam}`;

        const shareText = dreamText
            ? `💭 حلمي: "${dreamText}"\n\n📖 التفسير: ${replyText}\n\n✨ جرب تفسير أحلامك على: ${window.location.origin}`
            : `📖 تفسير حلمي: ${replyText}\n\n✨ جرب تفسير أحلامك على: ${window.location.origin}`;

        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=600,height=400');
    }, [dreamText, replyText, API_BASE_URL]);


    const shareOnWhatsApp = useCallback(() => {
        const shareText = dreamText
            ? `💭 حلمي: "${dreamText}"\n\n📖 التفسير: ${replyText}\n\n✨ جرب تفسير أحلامك على: ${window.location.origin}`
            : `📖 تفسير حلمي: ${replyText}\n\n✨ جرب تفسير أحلامك على: ${window.location.origin}`;

        const encodedText = encodeURIComponent(shareText);
        const url = `https://wa.me/?text=${encodedText}`;
        window.open(url, '_blank');
    }, [dreamText, replyText]);

    return (
        <div className="container" style={{ paddingTop: '90px' }}>
            <div className="card fade-in">
                {/* Header */}
                <div className="header-section">
                    <div className="title">✨ تفسير الأحلام ✨</div>
                    <div className="subtitle">استكشف معاني أحلامك</div>
                </div>

                {/* Mode Tabs */}
                {mode === "record" && (
                    <div className="mode-tabs">
                        <button className="tab-btn active">🎙️ تسجيل صوتي</button>
                        <button
                            className="tab-btn"
                            onClick={() => {
                                soundEffects.playTabSwitch();
                                setMode("text");
                            }}
                        >
                            ✏️ كتابة الحلم
                        </button>
                    </div>
                )}

                {mode === "text" && (
                    <div className="mode-tabs">
                        <button
                            className="tab-btn"
                            onClick={() => {
                                soundEffects.playTabSwitch();
                                setMode("record");
                            }}
                        >
                            🎙️ تسجيل صوتي
                        </button>
                        <button className="tab-btn active">✏️ كتابة الحلم</button>
                    </div>
                )}

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
                                <div className="bar" style={{ animationDelay: "0.2s" }}></div>
                                <div className="bar" style={{ animationDelay: "0.4s" }}></div>
                            </div>
                        )}

                        {recording && (
                            <div className="recording-timer bounce-in">
                                <svg className="timer-circle" width="100" height="100">
                                    <circle className="timer-circle-bg" cx="50" cy="50" r="45"></circle>
                                    <circle
                                        className="timer-circle-progress"
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        style={{
                                            strokeDashoffset: 283 - (283 * recordingTime / 60)
                                        }}
                                    ></circle>
                                </svg>
                                <div className="timer-text">{recordingTime}s</div>
                            </div>
                        )}

                        <div className="mic-wrap" style={{ marginBottom: "20px" }}>
                            {recording && <div className="pulse-ring"></div>}
                            {recording && <div className="pulse-ring" style={{ animationDelay: "0.5s" }}></div>}
                            <div
                                className={`mic-circle ${recording ? "recording" : ""}`}
                                onClick={() => (recording ? stopRecording() : startRecording())}
                            >
                                {recording ? "⏹️" : "🎤"}
                            </div>
                        </div>

                        <div style={{
                            color: recording ? "#ff6b6b" : "var(--accent-gold)",
                            marginTop: "20px",
                            fontSize: "18px",
                            fontWeight: "600",
                            letterSpacing: "0.5px"
                        }}>
                            {recording ? "🔴 جارٍ التسجيل..." : "اضغط للبدء بالتسجيل بالعربية الفصحى"}
                        </div>

                        <div style={{
                            marginTop: "30px",
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            flexDirection: "column"
                        }}>
                            <button
                                className="btn btn-secondary"
                                onClick={(e) => {
                                    createRipple(e);
                                    soundEffects.playTabSwitch();
                                    setMode("text");
                                }}
                            >
                                ✏️ كتابة الحلم يدوياً
                            </button>

                            {!isInstalled && (
                                <button
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                        createRipple(e);
                                        handleInstall();
                                    }}
                                >
                                    📱 تثبيت التطبيق
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* === Text Mode === */}
                {mode === "text" && (
                    <div className="fade-in" style={{ marginTop: "20px" }}>
                        <div style={{ marginBottom: "20px", textAlign: "center" }}>
                            <label className="dream-label">اكتب حلمك بالتفصيل بالعربية الفصحى</label>
                            <textarea
                                value={manualText}
                                onChange={(e) => setManualText(e.target.value)}
                                placeholder="صف حلمك هنا... لا تتردد في إضافة جميع التفاصيل والمشاعر..."
                                className="dream-input"
                            />
                        </div>

                        <div style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                            flexWrap: "wrap"
                        }}>
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    createRipple(e);
                                    handleSubmitText();
                                }}
                            >
                                ✨ تفسير الحلم
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={(e) => {
                                    createRipple(e);
                                    soundEffects.playTabSwitch();
                                    setManualText("");
                                    setMode("record");
                                }}
                            >
                                ← العودة
                            </button>
                        </div>
                    </div>
                )}

                {/* === Explain Mode === */}
                {mode === "explain" && (
                    <div className="fade-in">
                        {loading ? (
                            <div className="loading-container bounce-in">
                                <div className="loading-orbs">
                                    <div className="loading-orb"></div>
                                    <div className="loading-orb"></div>
                                    <div className="loading-orb"></div>
                                    <div className="loading-orb"></div>
                                </div>
                                <div style={{ fontSize: "20px", color: "var(--accent-gold)", fontWeight: "600", marginBottom: "20px" }}>
                                    🌙 جارٍ استكشاف معاني حلمك...
                                </div>
                                <div className="loading-progress">
                                    <div className="loading-progress-bar" style={{ width: `${loadingProgress}%` }}></div>
                                </div>
                                <div className="loading-messages">
                                    {loadingProgress < 30 && "🔮 نحلل رموز حلمك..."}
                                    {loadingProgress >= 30 && loadingProgress < 60 && "✨ نستكشف المعاني الخفية..."}
                                    {loadingProgress >= 60 && loadingProgress < 90 && "🌟 نجمع التفسيرات..."}
                                    {loadingProgress >= 90 && "📖 نجهز التفسير النهائي..."}
                                </div>
                            </div>
                        ) : (
                            <>
                                <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .mic-circle {
          animation: float 3s ease-in-out infinite;
        }

        .mic-circle.recording {
          animation: float 3s ease-in-out infinite, shake 0.5s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(-2deg); }
          75% { transform: translateY(-20px) rotate(2deg); }
        }
      `}</style>
                                {audioSrc && (
                                    <div style={{
                                        margin: "25px 0",
                                        padding: "20px",
                                        background: "rgba(212, 175, 55, 0.1)",
                                        borderRadius: "15px",
                                        border: "1px solid rgba(212, 175, 55, 0.2)"
                                    }}>
                                        <div className="dream-label">🔊 الرد الصوتي</div>
                                        <audio
                                            controls
                                            autoPlay
                                            src={audioSrc}
                                            style={{
                                                width: "100%",
                                                height: "45px",
                                                borderRadius: "10px",
                                                marginTop: "10px"
                                            }}
                                        />
                                    </div>
                                )}

                                {dreamText && (
                                    <div style={{
                                        margin: "25px 0",
                                        padding: "20px",
                                        background: "rgba(96, 165, 250, 0.1)",
                                        borderRadius: "15px",
                                        border: "1px solid rgba(96, 165, 250, 0.2)"
                                    }}>
                                        <div className="dream-label">💭 الحلم</div>
                                        <div className="dream-quote" style={{ fontSize: "16px", fontStyle: "normal", color: "var(--text-sub)" }}>
                                            "{dreamText}"
                                        </div>
                                    </div>
                                )}

                                <div className="reply-box">
                                    <div className="dream-label">📖 التفسير</div>
                                    <div style={{ marginTop: "12px" }}>
                                        {replyText}
                                    </div>
                                </div>

                                {/* Share Buttons */}
                                {replyText && (
                                    <div style={{
                                        marginTop: "25px",
                                        padding: "20px",
                                        background: "rgba(167, 139, 250, 0.05)",
                                        borderRadius: "15px",
                                        border: "1px solid rgba(212, 175, 55, 0.2)",
                                        textAlign: "center"
                                    }}>
                                        <div className="dream-label" style={{ marginBottom: "15px" }}>
                                            📤 شارك التفسير
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            gap: "15px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexWrap: "wrap"
                                        }}>
                                            <button
                                                onClick={(e) => {
                                                    createRipple(e);
                                                    shareOnFacebook();
                                                }}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                    border: "none",
                                                    background: "linear-gradient(135deg, #1877f2, #42a5f5)",
                                                    boxShadow: "0 4px 15px rgba(24, 119, 242, 0.4)",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    transition: "all 0.3s ease",
                                                    padding: 0
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "scale(1.1)";
                                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(24, 119, 242, 0.6)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "scale(1)";
                                                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(24, 119, 242, 0.4)";
                                                }}
                                                title="مشاركة على فيسبوك"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    createRipple(e);
                                                    soundEffects.playMagic();
                                                    shareOnWhatsApp();
                                                }}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                    border: "none",
                                                    background: "linear-gradient(135deg, #25d366, #128c7e)",
                                                    boxShadow: "0 4px 15px rgba(37, 211, 102, 0.4)",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    transition: "all 0.3s ease",
                                                    padding: 0
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "scale(1.1)";
                                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 211, 102, 0.6)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "scale(1)";
                                                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(37, 211, 102, 0.4)";
                                                }}
                                                title="مشاركة على واتساب"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div style={{
                                    display: "flex",
                                    gap: "12px",
                                    justifyContent: "center",
                                    marginTop: "30px",
                                    flexWrap: "wrap"
                                }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={(e) => {
                                            createRipple(e);
                                            soundEffects.playTabSwitch();
                                            setMode("record");
                                            setReplyText("");
                                            setDreamText("");
                                            setAudioSrc(null);
                                            setManualText("");
                                        }}
                                    >
                                        🎙️ تسجيل حلم جديد
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={(e) => {
                                            createRipple(e);
                                            soundEffects.playTabSwitch();
                                            setMode("text");
                                            setReplyText("");
                                            setDreamText("");
                                            setAudioSrc(null);
                                            setManualText("");
                                        }}
                                    >
                                        ✏️ كتابة حلم جديد
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default function MainDreamInterpreter() {
    return (
        <Suspense fallback={<div className="container" style={{ paddingTop: '90px', color: 'white', textAlign: 'center' }}>جاري التحميل...</div>}>
            <MainContent />
        </Suspense>
    );
}
