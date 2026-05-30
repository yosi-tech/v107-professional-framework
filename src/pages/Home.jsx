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
      <section className="relative px-6 lg:px-10 pt-28 pb-36 lg:pt-40 lg:pb-52 overflow-hidden">
        {/* Background — soft mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#EEF2FF] via-background to-background pointer-events-none" />
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#EEF2FF]/60 to-transparent pointer-events-none" />
        <div className="absolute top-32 right-[15%] w-[600px] h-[600px] bg-primary/[0.025] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-[10%] w-[500px] h-[500px] bg-accent/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 lg:gap-24 items-center relative z-10">
          {/* Text side */}
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-primary/8 text-primary font-semibold px-5 py-2 rounded-full text-sm mb-10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>פלטפורמת מיפוי קריירה מבוססת מחקר</span>
            </div>

            <h1 className="text-5xl lg:text-[4.25rem] font-extrabold tracking-tight text-foreground leading-[1.08] mb-7">
              גלו את הפוטנציאל <br />
              <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">המקצועי</span> האמיתי שלכם
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed mb-12">
              קבלו מפת יכולות אישית מדויקת, המלצות מותאמות ותוכנית פעולה מעשית — הכל על בסיס 107 נקודות ניתוח מקצועיות.
            </p>

            <div className="flex flex-row-reverse gap-4 mb-12">
              <Link to={createPageUrl("Questionnaire")}>
                <button className="bg-gradient-to-r from-accent to-primary text-white text-base font-bold px-10 py-4 rounded-full flex items-center gap-2 hover:shadow-xl hover:shadow-accent/25 hover:scale-[1.01] transition-all duration-300 shadow-lg shadow-accent/20">
                  <span>התחל מיפוי אישי</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
              <Link to={createPageUrl("About")}>
                <button className="bg-white text-foreground px-8 py-4 rounded-full font-semibold border border-border/60 hover:border-primary/20 hover:shadow-md transition-all duration-300 shadow-sm">
                  איך זה עובד?
                </button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
              {[
                { icon: Shield, text: "מתודולוגיה מבוססת מחקר" },
                { icon: Lock, text: "תהליך מאובטח ופרטי" },
                { icon: Clock, text: "כ-20 דקות למילוי" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary/50" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview side with Insight Orb */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-20 z-0">
              <InsightOrb className="w-full h-full" />
            </div>
            <div className="relative z-10">
              <HeroDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="py-6 bg-white border-y border-border/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap items-center justify-center gap-12 lg:gap-16 text-center">
          {[
            { value: `${userCount.toLocaleString()}+`, label: "משתמשים עברו את המבדק" },
            { value: "107", label: "נקודות ניתוח" },
            { value: "11", label: "ממדים מקצועיים" },
            { value: "24h", label: "דוח תוך עד" },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <div className="hidden sm:block w-px h-10 bg-border/30" />}
              <div>
                <div className="text-2xl font-extrabold text-foreground tracking-tight">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
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