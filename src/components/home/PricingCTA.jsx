import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, ArrowLeft, Shield, Sparkles } from "lucide-react";

const features = [
  "מבדק אחד מותאם אישית",
  "דוח ניתוח יכולות אישי",
  "שירות בוסטר לשיפור התוצאות והכוונה חכמה",
  "אנליזה ניתוח קורות חיים אל מול דוח V107",
];

export default function PricingCTA() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-background" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-white rounded-[1.75rem] border border-border/30 shadow-xl shadow-primary/[0.03] overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tl from-[#F5F3FF] to-transparent rounded-full blur-[60px] translate-x-1/4 translate-y-1/4 pointer-events-none opacity-60" />

          <div className="relative z-10 p-10 lg:p-16 flex flex-col lg:flex-row gap-14 items-center">
            {/* Content */}
            <div className="flex-1 text-right">
              <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/8 text-accent font-semibold px-5 py-2 rounded-full text-sm mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>חבילה מלאה</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl lg:text-6xl font-black text-foreground tracking-tight">99 ₪</span>
                <span className="text-muted-foreground font-medium line-through text-lg">199 ₪</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-extrabold mb-2 text-foreground leading-tight">
                מוכנים לגלות מה באמת מתאים לכם?
              </h2>
              <p className="text-lg text-primary/70 font-bold mb-8">מוכנים לקחת את הצעד הראשון?</p>

              <ul className="space-y-4 mb-12">
                {features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-green-500/8 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl("Questionnaire")}>
                <button className="bg-accent text-white text-lg font-bold px-10 py-4.5 rounded-2xl hover:shadow-xl hover:shadow-accent/20 hover:scale-[1.01] transition-all duration-300 w-full md:w-max flex items-center justify-center gap-2">
                  <span>התחל מיפוי אישי</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>

              <p className="text-muted-foreground text-sm mt-5 flex items-center gap-2 justify-end">
                <Shield className="w-3.5 h-3.5" />
                <span>התחילו לגלות את עצמכם בלי להתחייב!</span>
              </p>
            </div>

            {/* Visual side */}
            <div className="hidden lg:flex flex-col items-center gap-7 flex-shrink-0 w-64">
              <div className="w-52 h-52 rounded-[1.5rem] bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] flex items-center justify-center border border-primary/[0.06]">
                <div className="text-center">
                  <div className="text-6xl font-black bg-gradient-to-b from-primary to-accent bg-clip-text text-transparent mb-1">107</div>
                  <div className="text-sm text-muted-foreground font-medium">נקודות ניתוח</div>
                </div>
              </div>
              <div className="flex gap-3">
                {[
                  { value: "11", label: "ממדים" },
                  { value: "24h", label: "דוח תוך" },
                  { value: "30", label: "ימי בוסטר" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#EEF2FF] rounded-2xl px-4 py-3.5 text-center">
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}