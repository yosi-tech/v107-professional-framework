import React from "react";
import { ClipboardList, BarChart3, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "מלאו את השאלון",
    desc: "107 שאלות מקצועיות, כ-20 דקות, בנוחות ובפרטיות מלאה.",
    meta: "כ-20 דקות",
  },
  {
    num: "02",
    icon: BarChart3,
    title: "קבלו דוח יכולות אישי",
    desc: "ניתוח מעמיק של 11 ממדים מקצועיים, חוזקות, אזורי שיפור והמלצות.",
    meta: "תוך עד 24 שעות",
  },
  {
    num: "03",
    icon: Rocket,
    title: "התחילו לצמוח",
    desc: "תוכנית Booster אישית ל-30 יום עם משימות יומיות מותאמות.",
    meta: "30 ימי ליווי",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-32 bg-background" dir="rtl">
      <div className="saas-container">
        <div className="text-center mb-20">
          <span className="text-primary font-semibold text-sm tracking-wide mb-4 block uppercase">איך זה עובד</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            שלושה צעדים לבהירות מקצועית
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((step) => (
            <div key={step.num} className="relative group">
              <div className="bg-white p-9 lg:p-10 rounded-[1.25rem] border border-border/30 hover:border-primary/10 hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-500 h-full flex flex-col text-right">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-black text-border/40 group-hover:text-primary/8 transition-colors duration-500 select-none">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{step.desc}</p>
                <div className="mt-8 pt-5 border-t border-border/30">
                  <span className="text-sm text-primary font-semibold">{step.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}