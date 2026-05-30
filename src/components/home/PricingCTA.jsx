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
    <section className="py-28 px-6 lg:px-8 bg-background" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-white rounded-[2rem] border border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-2xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

          <div className="relative z-10 p-8 lg:p-14 flex flex-col lg:flex-row gap-12 items-center">
            {/* Content */}
            <div className="flex-1 text-right">
              <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/10 text-accent font-semibold px-4 py-1.5 rounded-full text-sm mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>חבילה מלאה</span>
              </div>

              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-5xl lg:text-6xl font-black text-foreground">99 ₪</span>
                <span className="text-muted-foreground font-medium line-through text-lg">199 ₪</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-extrabold mb-2 text-foreground leading-tight">
                מוכנים לגלות מה באמת מתאים לכם?
              </h2>
              <p className="text-lg text-primary/80 font-bold mb-6">מוכנים לקחת את הצעד הראשון?</p>

              <ul className="space-y-3.5 mb-10">
                {features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl("Questionnaire")}>
                <button className="bg-accent text-white text-lg font-bold px-10 py-4 rounded-2xl hover:shadow-xl hover:shadow-accent/25 hover:scale-[1.02] transition-all w-full md:w-max flex items-center justify-center gap-2">
                  <span>התחל מיפוי אישי</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>

              <p className="text-muted-foreground text-sm mt-4 flex items-center gap-2 justify-end">
                <Shield className="w-3.5 h-3.5" />
                <span>התחילו לגלות את עצמכם בלי להתחייב!</span>
              </p>
            </div>

            {/* Visual side */}
            <div className="hidden lg:flex flex-col items-center gap-6 flex-shrink-0 w-64">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/10">
                <div className="text-center">
                  <div className="text-6xl font-black text-primary mb-1">107</div>
                  <div className="text-sm text-muted-foreground font-medium">נקודות ניתוח</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-secondary rounded-2xl px-4 py-3 text-center">
                  <div className="text-xl font-bold text-foreground">11</div>
                  <div className="text-[10px] text-muted-foreground">ממדים</div>
                </div>
                <div className="bg-secondary rounded-2xl px-4 py-3 text-center">
                  <div className="text-xl font-bold text-foreground">24h</div>
                  <div className="text-[10px] text-muted-foreground">דוח תוך</div>
                </div>
                <div className="bg-secondary rounded-2xl px-4 py-3 text-center">
                  <div className="text-xl font-bold text-foreground">30</div>
                  <div className="text-[10px] text-muted-foreground">ימי בוסטר</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}