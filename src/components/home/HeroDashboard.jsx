import React from "react";
import { BarChart3, TrendingUp, Sparkles, Zap } from "lucide-react";

const RadialScore = ({ score, label, size = 68, strokeWidth = 4.5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">{score}</span>
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground font-medium text-center leading-tight">{label}</span>
    </div>
  );
};

export default function HeroDashboard() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0">
      {/* Main dashboard card */}
      <div className="relative bg-white/80 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl shadow-primary/[0.06] border border-white/70 overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">פרופיל יכולות V107</div>
              <div className="text-[11px] text-muted-foreground">107 נקודות ניתוח · 11 ממדים</div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-border/60" />
          </div>
        </div>

        {/* Radial scores row */}
        <div className="px-6 pt-7 pb-5">
          <div className="grid grid-cols-4 gap-4">
            <RadialScore score={87} label="מיקוד וחוסן" />
            <RadialScore score={74} label="גמישות" />
            <RadialScore score={92} label="מנהיגות" />
            <RadialScore score={68} label="תקשורת" />
          </div>
        </div>

        {/* Skill bars */}
        <div className="px-6 pb-5 space-y-3.5">
          {[
            { label: "תכנון אסטרטגי", score: 85, accent: false },
            { label: "חדשנות וטכנולוגיה", score: 78, accent: true },
            { label: "איזון חיים-עבודה", score: 62, accent: false },
          ].map(({ label, score, accent }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-foreground">{label}</span>
                <span className="text-xs font-bold text-primary">{score}%</span>
              </div>
              <div className="h-[5px] bg-[#E5E7EB]/40 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${accent ? 'bg-gradient-to-l from-accent to-primary' : 'bg-gradient-to-l from-primary to-primary/70'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight card */}
        <div className="mx-6 mb-6 p-4 bg-gradient-to-l from-[#EEF2FF] to-[#F5F3FF] rounded-2xl border border-primary/[0.06]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-accent mb-1">AI Insight</div>
              <p className="text-xs text-foreground/60 leading-relaxed">
                הפרופיל שלך מצביע על יכולת מנהיגות גבוהה עם פוטנציאל משמעותי בהובלת שינויים ארגוניים...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/[0.04] border border-white/80 px-5 py-3.5 flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-xl bg-green-500/8 flex items-center justify-center">
          <TrendingUp className="w-4.5 h-4.5 text-green-600" />
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground font-medium">מוכנות קריירה</div>
          <div className="text-sm font-bold text-foreground">גבוהה</div>
        </div>
      </div>

      <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/[0.04] border border-white/80 px-4 py-3 flex items-center gap-2.5 z-10">
        <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-accent" />
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground font-medium">Booster</div>
          <div className="text-xs font-bold text-accent">30 יום</div>
        </div>
      </div>
    </div>
  );
}