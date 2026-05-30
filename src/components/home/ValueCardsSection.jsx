import React from "react";
import { TrendingUp, Brain, Target, ArrowUpRight } from "lucide-react";

const cards = [
  {
    icon: TrendingUp,
    title: "דוח יכולות אישי",
    desc: "ניתוח מעמיק של 11 ממדים מקצועיים עם המלצות מותאמות אישית לשיפור הביצועים.",
    tag: "כלול בחבילה",
  },
  {
    icon: Brain,
    title: "ניתוח מול קורות חיים",
    desc: "מסמך מקצועי המנתח את היכולות שלכם ביחס לקורות החיים — כלי רב עוצמה להבנת פערים.",
    tag: "כלול בחבילה",
    featured: true,
  },
  {
    icon: Target,
    title: "תוכנית Booster",
    desc: "30 יום של משימות יומיות מותאמות אישית לחיזוק התחומים שזוהו כקריטיים עבורכם.",
    tag: "כלול בחבילה",
  },
];

export default function ValueCardsSection() {
  return (
    <section className="py-32 bg-[#EEF2FF]/40" dir="rtl">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="text-primary font-semibold text-sm tracking-wide mb-4 block uppercase">מה תקבלו</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 text-foreground">
            כל הכלים לפריצה מקצועית
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            חבילה מלאה של תובנות, ניתוח וכלים מעשיים שיעזרו לכם להבין לאן לכוון —{" "}
            <span className="font-bold text-primary">רק ב-99 ש"ח</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`relative group p-9 lg:p-10 rounded-[1.25rem] flex flex-col justify-between text-right h-full transition-all duration-500 ${
                card.featured
                  ? "bg-gradient-to-br from-accent to-primary text-white shadow-xl shadow-accent/15 hover:shadow-2xl hover:shadow-accent/20 scale-[1.02]"
                  : "bg-white border border-border/30 hover:border-primary/10 hover:shadow-xl hover:shadow-primary/[0.04]"
              }`}
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                  card.featured
                    ? "bg-white/15 text-white"
                    : "bg-[#EEF2FF] text-primary group-hover:bg-primary group-hover:text-white shadow-sm"
                }`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                <p className={`leading-relaxed text-[15px] ${card.featured ? "text-white/80" : "text-muted-foreground"}`}>
                  {card.desc}
                </p>
              </div>
              <div className={`mt-10 flex justify-between items-center pt-6 border-t ${
                card.featured ? "border-white/15" : "border-border/30"
              }`}>
                <span className={`font-semibold text-sm ${card.featured ? "text-white" : "text-primary"}`}>
                  {card.tag}
                </span>
                {!card.featured && (
                  <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}