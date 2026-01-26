'use client'

import React, { useEffect, useRef, useMemo } from 'react';

export default function BackgroundCanvas() {
    const canvasRef = useRef(null);

    // Optimize particle count based on device performance
    // Optimize particle count based on device performance
    const [particleCount, setParticleCount] = React.useState(50);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const isMobile = window.innerWidth < 768;
        const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        const baseCount = Math.floor((window.innerWidth * window.innerHeight) / 9000);

        if (isMobile || isLowEnd) {
            setParticleCount(Math.max(15, Math.min(50, baseCount)));
        } else {
            setParticleCount(Math.max(28, Math.min(100, baseCount)));
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const rand = (a, b) => Math.random() * (b - a) + a;

        const palette = ['167,139,250', '96,165,250', '212,175,55']; // rgb bases
        let particles = [];
        const count = particleCount;
        for (let i = 0; i < count; i++) {
            particles.push({ x: rand(0, width), y: rand(0, height), vx: rand(-0.5, 0.5), vy: rand(-0.5, 0.5), r: rand(0.7, 2.2), col: palette[i % palette.length] });
        }

        let bursts = [];
        const mouse = { x: null, y: null, active: false };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function onMove(e) {
            mouse.x = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX));
            mouse.y = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY));
            mouse.active = true;
        }

        function onLeave() { mouse.active = false; mouse.x = null; mouse.y = null; }

        function onClick(e) {
            const cx = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || rand(0, width));
            const cy = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || rand(0, height));
            for (let i = 0; i < 18; i++) {
                bursts.push({ x: cx, y: cy, vx: rand(-3, 3), vy: rand(-3, 3), r: rand(1, 3.2), life: 70, col: palette[Math.floor(rand(0, palette.length))] });
            }
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('mouseleave', onLeave);
        window.addEventListener('touchend', onLeave);
        window.addEventListener('mousedown', onClick);
        window.addEventListener('touchstart', onClick);

        let rafId;
        let lastTime = 0;
        const targetFPS = 30; // Reduce to 30 FPS for better performance
        const frameInterval = 1000 / targetFPS;

        function draw(currentTime) {
            // Throttle frame rate
            if (currentTime - lastTime < frameInterval) {
                rafId = requestAnimationFrame(draw);
                return;
            }
            lastTime = currentTime;

            ctx.clearRect(0, 0, width, height);

            // Optimize: Only draw lines for nearby particles (reduced distance check)
            const maxDistance = 6000;
            const maxDistanceSq = maxDistance * maxDistance;

            // Use spatial optimization: only check nearby particles
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                // Only check particles within reasonable range
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < maxDistanceSq) {
                        const alpha = 0.045 * (1 - d2 / maxDistanceSq);
                        ctx.strokeStyle = `rgba(167,139,250,${alpha.toFixed(3)})`;
                        ctx.lineWidth = 0.9;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // update + draw particles
            for (let p of particles) {
                // gentle attraction to mouse
                if (mouse.active && mouse.x != null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist2 = dx * dx + dy * dy;
                    const max = Math.min(width, height) / 3;
                    if (dist2 < max * max) {
                        const f = (1 - dist2 / (max * max)) * 0.025;
                        p.vx += (dx / width) * f;
                        p.vy += (dy / height) * f;
                    }
                }

                // apply damping and move
                p.vx *= 0.995; p.vy *= 0.995;
                p.x += p.vx; p.y += p.vy;

                // wrap around edges
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                // draw orb
                ctx.beginPath();
                ctx.fillStyle = `rgba(${p.col},0.65)`;
                ctx.globalCompositeOperation = 'lighter';
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }

            // draw bursts (click particles)
            for (let i = bursts.length - 1; i >= 0; i--) {
                const b = bursts[i];
                b.x += b.vx; b.y += b.vy; b.vx *= 0.98; b.vy *= 0.98; b.life -= 1;
                ctx.beginPath();
                ctx.fillStyle = `rgba(${b.col},${(b.life / 90).toFixed(3)})`;
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();
                if (b.life <= 0) bursts.splice(i, 1);
            }

            rafId = requestAnimationFrame(draw);
        }

        rafId = requestAnimationFrame(draw);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('touchend', onLeave);
            window.removeEventListener('mousedown', onClick);
            window.removeEventListener('touchstart', onClick);
        };
    }, [particleCount]);

    return <canvas ref={canvasRef} className="background-canvas" />;
}