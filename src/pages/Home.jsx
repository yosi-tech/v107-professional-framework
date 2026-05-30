import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, ArrowLeft, Shield, Clock, Lock } from "lucide-react";

import HeroDashboard from "@/components/home/HeroDashboard";
import InsightOrb from "@/components/home/InsightOrb";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ValueCardsSection from "@/components/home/ValueCardsSection";
import PricingCTA from "@/components/home/PricingCTA";
import FAQSection from "@/components/home/FAQSection";
import CommunitySection from "@/components/home/CommunitySection";

export default function Home() {
  const userCount = 693;

  return (
    <main className="font-heebo" dir="rtl">

      {/* ===== HERO ===== */}
      <section className="relative px-6 lg:px-10 pt-24 pb-32 lg:pt-36 lg:pb-44 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-bl from-secondary via-background to-background pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
          {/* Text side */}
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary font-semibold px-4 py-1.5 rounded-full text-sm mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span>פלטפורמת מיפוי קריירה מבוססת מחקר</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-6">
              גלו את הפוטנציאל <br />
              <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">המקצועי</span> האמיתי שלכם
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
              קבלו מפת יכולות אישית מדויקת, המלצות מותאמות ותוכנית פעולה מעשית — הכל על בסיס 107 נקודות ניתוח מקצועיות.
            </p>

            <div className="flex flex-row-reverse gap-4 mb-10">
              <Link to={createPageUrl("Questionnaire")}>
                <button className="bg-accent text-white text-base font-bold px-8 py-4 rounded-2xl flex items-center gap-2 hover:shadow-xl hover:shadow-accent/25 hover:scale-[1.02] transition-all">
                  <span>התחל מיפוי אישי</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
              <Link to={createPageUrl("About")}>
                <button className="bg-white/80 backdrop-blur-sm text-foreground px-7 py-4 rounded-2xl font-semibold border border-border/50 hover:bg-white transition-colors">
                  איך זה עובד?
                </button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {[
                { icon: Shield, text: "מתודולוגיה מבוססת מחקר" },
                { icon: Lock, text: "תהליך מאובטח ופרטי" },
                { icon: Clock, text: "כ-20 דקות למילוי" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary/60" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview side with Insight Orb */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-16 z-0">
              <InsightOrb className="w-full h-full" />
            </div>
            <div className="relative z-10">
              <HeroDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="py-5 bg-white border-y border-border/30">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap items-center justify-center gap-10 text-center">
          {[
            { value: `${userCount.toLocaleString()}+`, label: "משתמשים עברו את המבדק" },
            { value: "107", label: "נקודות ניתוח" },
            { value: "11", label: "ממדים מקצועיים" },
            { value: "24h", label: "דוח תוך עד" },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <div className="hidden sm:block w-px h-10 bg-border/50" />}
              <div>
                <div className="text-2xl font-extrabold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <HowItWorksSection />

      {/* ===== VALUE CARDS ===== */}
      <ValueCardsSection />

      {/* ===== PRICING CTA ===== */}
      <PricingCTA />

      {/* ===== FAQ ===== */}
      <FAQSection />

      {/* ===== COMMUNITY ===== */}
      <CommunitySection />

    </main>
  );
}