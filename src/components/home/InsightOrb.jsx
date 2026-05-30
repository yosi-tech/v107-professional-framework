import React, { useRef, useEffect, useState, useCallback } from "react";

const COLORS = {
  primary: [67, 56, 202],
  primaryDark: [49, 46, 129],
  secondary: [37, 99, 235],
  accent: [124, 58, 237],
  light: [248, 250, 252],
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function InsightOrb({ className = "" }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const orbPosRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);

    setIsMobile(window.innerWidth < 768);
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isMobile) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, [isMobile]);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Particles
    const PARTICLE_COUNT = isMobile ? 18 : 35;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.001,
      vy: (Math.random() - 0.5) * 0.001,
      r: Math.random() * 2 + 1,
      color: [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.primaryDark][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      time += 0.008;

      // Smooth follow
      const speed = prefersReducedMotion ? 0 : 0.02;
      orbPosRef.current.x = lerp(orbPosRef.current.x, mouseRef.current.x, speed);
      orbPosRef.current.y = lerp(orbPosRef.current.y, mouseRef.current.y, speed);

      const cx = w / 2;
      const cy = h / 2;
      const orbRadius = Math.min(w, h) * 0.38;

      // Offset based on cursor (subtle)
      const offsetX = prefersReducedMotion ? 0 : (orbPosRef.current.x - 0.5) * 15;
      const offsetY = prefersReducedMotion ? 0 : (orbPosRef.current.y - 0.5) * 15;

      const orbCx = cx + offsetX;
      const orbCy = cy + offsetY;

      // Scroll-based glow
      const scrollGlow = Math.min(scrollRef.current / 600, 1) * 0.15;

      // Outer glow
      const glowAlpha = 0.08 + Math.sin(time * 0.5) * 0.03 + scrollGlow;
      const outerGlow = ctx.createRadialGradient(orbCx, orbCy, orbRadius * 0.6, orbCx, orbCy, orbRadius * 1.6);
      outerGlow.addColorStop(0, `rgba(${COLORS.accent.join(",")}, ${glowAlpha})`);
      outerGlow.addColorStop(0.5, `rgba(${COLORS.primary.join(",")}, ${glowAlpha * 0.4})`);
      outerGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, w, h);

      // Glass sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(orbCx, orbCy, orbRadius, 0, Math.PI * 2);
      ctx.clip();

      // Background fill
      const sphereBg = ctx.createRadialGradient(
        orbCx - orbRadius * 0.3, orbCy - orbRadius * 0.3, 0,
        orbCx, orbCy, orbRadius
      );
      sphereBg.addColorStop(0, `rgba(${COLORS.light.join(",")}, 0.15)`);
      sphereBg.addColorStop(0.5, `rgba(${COLORS.primary.join(",")}, 0.04)`);
      sphereBg.addColorStop(1, `rgba(${COLORS.primaryDark.join(",")}, 0.08)`);
      ctx.fillStyle = sphereBg;
      ctx.fill();

      // Update and draw particles
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx + Math.sin(time + p.phase) * 0.0003;
          p.y += p.vy + Math.cos(time + p.phase) * 0.0003;
          if (p.x < 0.1 || p.x > 0.9) p.vx *= -1;
          if (p.y < 0.1 || p.y > 0.9) p.vy *= -1;
          p.x = Math.max(0.05, Math.min(0.95, p.x));
          p.y = Math.max(0.05, Math.min(0.95, p.y));
        }

        const px = orbCx + (p.x - 0.5) * orbRadius * 1.6;
        const py = orbCy + (p.y - 0.5) * orbRadius * 1.6;
        const dist = Math.sqrt((px - orbCx) ** 2 + (py - orbCy) ** 2);
        if (dist > orbRadius * 0.9) return;

        const pulse = prefersReducedMotion ? 1 : 0.7 + Math.sin(time * 2 + p.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.join(",")}, ${p.alpha * pulse})`;
        ctx.fill();
      });

      // Neural connections
      const connectionAlpha = prefersReducedMotion ? 0.06 : 0.04 + Math.sin(time) * 0.02;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dx = (pi.x - pj.x) * orbRadius * 1.6;
          const dy = (pi.y - pj.y) * orbRadius * 1.6;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < orbRadius * 0.6) {
            const opacity = (1 - d / (orbRadius * 0.6)) * connectionAlpha;
            const pix = orbCx + (pi.x - 0.5) * orbRadius * 1.6;
            const piy = orbCy + (pi.y - 0.5) * orbRadius * 1.6;
            const pjx = orbCx + (pj.x - 0.5) * orbRadius * 1.6;
            const pjy = orbCy + (pj.y - 0.5) * orbRadius * 1.6;

            const di = Math.sqrt((pix - orbCx) ** 2 + (piy - orbCy) ** 2);
            const dj = Math.sqrt((pjx - orbCx) ** 2 + (pjy - orbCy) ** 2);
            if (di > orbRadius * 0.9 || dj > orbRadius * 0.9) continue;

            ctx.beginPath();
            ctx.moveTo(pix, piy);
            ctx.lineTo(pjx, pjy);
            ctx.strokeStyle = `rgba(${COLORS.primary.join(",")}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.restore();

      // Glass highlight
      const highlight = ctx.createRadialGradient(
        orbCx - orbRadius * 0.25, orbCy - orbRadius * 0.3, 0,
        orbCx - orbRadius * 0.1, orbCy - orbRadius * 0.1, orbRadius * 0.7
      );
      highlight.addColorStop(0, "rgba(255,255,255,0.18)");
      highlight.addColorStop(0.4, "rgba(255,255,255,0.04)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(orbCx, orbCy, orbRadius, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      // Sphere border
      const breathe = prefersReducedMotion ? 0.1 : 0.06 + Math.sin(time * 0.8) * 0.04;
      ctx.beginPath();
      ctx.arc(orbCx, orbCy, orbRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${COLORS.primary.join(",")}, ${breathe})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReducedMotion, isMobile]);

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: isMobile ? "none" : "auto" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}