
import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [exiting, setExiting] = useState(false);
    const [showLogo, setShowLogo] = useState(false);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // Sequence animations
        setTimeout(() => setShowLogo(true), 300);
        setTimeout(() => setShowText(true), 1200);

        // Auto dismiss after 4.5 seconds
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onComplete, 800); // Wait for exit animation
        }, 4500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'opacity 0.8s ease-in-out',
            opacity: exiting ? 0 : 1,
            pointerEvents: exiting ? 'none' : 'all'
        }}>
            {/* Background Glow Effects */}
            <div className="splash-glow" style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                animation: 'pulse-glow 3s infinite ease-in-out',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }} />

            {/* Stars/Particles */}
            {[...Array(15)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: Math.random() * 4 + 2 + 'px',
                    height: Math.random() * 4 + 2 + 'px',
                    background: 'white',
                    borderRadius: '50%',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.7 + 0.3,
                    animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out ${Math.random() * 2}s`,
                    boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
                }} />
            ))}

            {/* Main Logo */}
            <div style={{
                position: 'relative',
                transform: `scale(${showLogo ? 1 : 0.8}) translateY(${showLogo ? 0 : 20}px)`,
                opacity: showLogo ? 1 : 0,
                transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 10
            }}>
                <img
                    src="/splash-logo.png"
                    alt="Ahlamok Logo"
                    style={{
                        width: '240px',
                        maxWidth: '80vw',
                        animation: showLogo ? 'float 6s ease-in-out infinite' : 'none',
                        filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'
                    }}
                />
            </div>

            {/* Text reveal */}
            <div style={{
                marginTop: '30px',
                color: '#D4AF37',
                fontFamily: "'Cairo', sans-serif",
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '2px',
                opacity: showText ? 1 : 0,
                transform: `translateY(${showText ? 0 : 20}px)`,
                transition: 'all 1s ease-out',
                zIndex: 10,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                تفسير الأحلام
            </div>

            <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
        </div>
    );
};

export default SplashScreen;
