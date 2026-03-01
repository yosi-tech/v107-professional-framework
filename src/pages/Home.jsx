import React, { useState, useEffect } from "react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const target = new Date("2026-03-15T23:59:59");

    const tick = () => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Assistant', 'Helvetica Neue', sans-serif",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "60px" }}>
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68beedf299352a857559c5a4/0f64b31da_Logo4-031.jpg"
          alt="V107 Professional Framework"
          style={{
            maxWidth: "520px",
            width: "90vw",
            height: "auto",
            filter: "brightness(1.05)",
          }}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          width: "80px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #b8a46e, transparent)",
          marginBottom: "50px",
        }}
      />

      {/* Message */}
      <div style={{ maxWidth: "680px", marginBottom: "60px" }}>
        <h1
          style={{
            color: "#b8a46e",
            fontSize: "clamp(20px, 3vw, 32px)",
            fontWeight: "700",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          Under Construction
        </h1>
        <p
          style={{
            color: "#d4d4d4",
            fontSize: "clamp(15px, 2vw, 19px)",
            lineHeight: "1.8",
            fontWeight: "400",
          }}
        >
          על רקע ההתקדמות המשמעותית בפעילותנו, אנו משדרגים את האתר
          ומכינים עבורכם חוויה מקצועית משופרת.
        </p>
        <p
          style={{
            color: "#a0a0a0",
            fontSize: "clamp(13px, 1.6vw, 16px)",
            marginTop: "16px",
            letterSpacing: "0.5px",
          }}
        >
          האתר החדש יעלה ב־15 במרץ 2026
        </p>
      </div>

      {/* Countdown */}
      <div
        style={{
          display: "flex",
          gap: "clamp(16px, 3vw, 40px)",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "60px",
        }}
      >
        {[
          { label: "ימים", value: timeLeft.days },
          { label: "שעות", value: timeLeft.hours },
          { label: "דקות", value: timeLeft.minutes },
          { label: "שניות", value: timeLeft.seconds },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(184, 164, 110, 0.08)",
              border: "1px solid rgba(184, 164, 110, 0.3)",
              borderRadius: "12px",
              padding: "20px 28px",
              minWidth: "90px",
            }}
          >
            <span
              style={{
                color: "#b8a46e",
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: "700",
                letterSpacing: "2px",
                lineHeight: "1",
              }}
            >
              {pad(value ?? 0)}
            </span>
            <span
              style={{
                color: "#888",
                fontSize: "12px",
                marginTop: "8px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Contact */}
      <p style={{ color: "#666", fontSize: "14px", letterSpacing: "0.5px" }}>
        לפרטים:{" "}
        <a
          href="mailto:support@v107.co.il"
          style={{
            color: "#b8a46e",
            textDecoration: "none",
            borderBottom: "1px solid rgba(184, 164, 110, 0.4)",
            paddingBottom: "1px",
          }}
        >
          support@v107.co.il
        </a>
      </p>
    </div>
  );
}