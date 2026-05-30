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
    <section className="py-28 bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wide mb-3 block">איך זה עובד</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            שלושה צעדים לבהירות מקצועית
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -left-4 w-8 h-px bg-border" />
              )}
              <div className="bg-white p-8 rounded-3xl border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col text-right">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="text-5xl font-black text-border/60 group-hover:text-primary/10 transition-colors">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{step.desc}</p>
                <div className="mt-6 pt-4 border-t border-border/50">
                  <span className="text-sm text-primary font-medium">{step.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}