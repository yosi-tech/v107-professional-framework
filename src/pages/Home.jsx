import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Users, TrendingUp, ClipboardList, BarChart3, Brain, Target, Sparkles, ArrowLeft, Shield, Clock, Lock } from "lucide-react";
import TrustBadges from "@/components/home/TrustBadges";
import FAQSection from "@/components/home/FAQSection";

const ReportPreviewCard = () => (
  <div className="relative">
    {/* Main preview card */}
    <div className="bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-border/50 overflow-hidden">
      {/* Mock header */}
      <div className="bg-gradient-to-l from-primary/5 to-primary/10 px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">דוח V107 — פרופיל יכולות אישי</div>
            <div className="text-xs text-muted-foreground">107 נקודות דאטה · 11 ממדים</div>
          </div>
        </div>
      </div>
      {/* Mock content */}
      <div className="p-6 space-y-4">
        {/* Score bars */}
        {[
          { label: "מיקוד וחוסן", score: 82, color: "bg-primary" },
          { label: "גמישות ויצירתיות", score: 71, color: "bg-blue-500" },
          { label: "מנהיגות ויוזמה", score: 90, color: "bg-primary" },
          { label: "תקשורת ושיתוף פעולה", score: 65, color: "bg-blue-400" },
        ].map(({ label, score, color }) => (
          <div key={label} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">{label}</span>
              <span className="font-bold text-primary">{score}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
        {/* Mock insight */}
        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              הפרופיל שלך מצביע על יכולת מנהיגות גבוהה עם פוטנציאל משמעותי בהובלת שינויים ארגוניים...
            </p>
          </div>
        </div>
      </div>
    </div>
    {/* Floating badge */}
    <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border border-border/50 px-4 py-3 flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
        <TrendingUp className="w-4 h-4 text-green-600" />
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">מוכנות קריירה</div>
        <div className="text-sm font-bold text-foreground">גבוהה</div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const userCount = 693;

  return (
    <main className="font-heebo" dir="rtl">

      {/* ===== HERO ===== */}
      <section className="relative px-6 lg:px-10 pt-24 pb-32 lg:pt-36 lg:pb-44 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-bl from-secondary via-transparent to-background pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
          {/* Text side */}
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary font-semibold px-4 py-1.5 rounded-full text-sm mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span>פלטפורמת מיפוי קריירה מבוססת מחקר</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-6">
              גלו את הפוטנציאל <br />
              <span className="text-primary">המקצועי</span> האמיתי שלכם
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
              קבלו מפת יכולות אישית מדויקת, המלצות מותאמות ותוכנית פעולה מעשית — הכל על בסיס 107 נקודות ניתוח מקצועיות.
            </p>

            <div className="flex flex-row-reverse gap-4 mb-10">
              <Link to={createPageUrl("Questionnaire")}>
                <button className="bg-accent text-white text-base font-semibold px-8 py-4 rounded-2xl flex items-center gap-2 hover:opacity-90 hover:shadow-xl hover:shadow-accent/25 transition-all">
                  <span>התחל מיפוי אישי</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
              <Link to={createPageUrl("About")}>
                <button className="bg-white text-foreground px-7 py-4 rounded-2xl font-semibold border border-border hover:bg-secondary transition-colors">
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

          {/* Report preview side */}
          <div className="relative">
            <ReportPreviewCard />
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="py-6 bg-white border-y border-border/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap items-center justify-center gap-10 text-center">
          <div>
            <div className="text-2xl font-extrabold text-foreground">{userCount.toLocaleString()}+</div>
            <div className="text-sm text-muted-foreground">משתמשים עברו את המבדק</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-border" />
          <div>
            <div className="text-2xl font-extrabold text-foreground">107</div>
            <div className="text-sm text-muted-foreground">נקודות ניתוח</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-border" />
          <div>
            <div className="text-2xl font-extrabold text-foreground">11</div>
            <div className="text-sm text-muted-foreground">ממדים מקצועיים</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-border" />
          <div>
            <div className="text-2xl font-extrabold text-foreground">24h</div>
            <div className="text-sm text-muted-foreground">דוח תוך עד</div>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section className="py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm tracking-wide mb-3 block">מה תקבלו</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-foreground">כל הכלים לפריצה מקצועית</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">חבילה מלאה של תובנות, ניתוח וכלים מעשיים שיעזרו לכם להבין לאן לכוון — <span className="font-bold text-primary">רק ב-99 ש"ח</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl flex flex-col justify-between group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-border/50 text-right h-full">
              <div>
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-7 group-hover:bg-primary group-hover:text-white transition-colors">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">מתחילים עכשיו!</h3>
                <p className="text-muted-foreground leading-relaxed">מלאו את השאלון בנוחות, בפרטיות ובקצב שלכם. כ-20 דקות שישנו את הכיוון המקצועי שלכם.</p>
              </div>
              <div className="mt-10 flex justify-between items-center pt-6 border-t border-border/50">
                <span className="text-muted-foreground font-medium">כ-20 דקות</span>
                <span className="text-primary font-medium text-sm">כלול בחבילה</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 lg:p-10 rounded-3xl flex flex-col justify-between group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-border/50 text-right h-full">
              <div>
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-7 group-hover:bg-primary group-hover:text-white transition-colors">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">קבלו דוח יכולות אישי</h3>
                <p className="text-muted-foreground leading-relaxed">הדוח יאפשר לכם ללמוד את החוזקות ואת היכולות הטעונות שיפור שלכם. יחד עם הדוח תקבלו המלצות מותאמות אישית ואת ה-BOOSTER שלנו לשיפור היכולות.</p>
              </div>
              <div className="mt-10 flex justify-between items-center pt-6 border-t border-border/50">
                <span className="text-muted-foreground font-medium">תוך עד 24 שעות</span>
                <span className="text-primary font-medium text-sm">כלול בחבילה</span>
              </div>
            </div>

            {/* Card 3 — Featured */}
            <div className="bg-gradient-to-br from-accent to-primary p-8 lg:p-10 rounded-3xl text-white flex flex-col justify-between hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 text-right h-full">
              <div className="w-14 h-14 bg-white/15 text-white rounded-2xl flex items-center justify-center mb-7">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">ניתוח יכולות מול קורות החיים</h3>
                <p className="text-white/80 leading-relaxed">אם תעלו בשאלון את קורות החיים שלכם, תוכלו בנוסף לקבל מסמך מקצועי המנתח את היכולות שלכם ביחס לקורות החיים — כלי רב עוצמה להבנת תהליכים אישיים.</p>
              </div>
              <div className="mt-10 flex justify-end pt-6 border-t border-white/15">
                <span className="text-white font-medium">כלול בחבילה</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING CTA ===== */}
      <section className="py-28 px-8 bg-background">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-secondary to-secondary/50 p-8 lg:p-14 rounded-3xl border border-border/50 text-right relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-12 items-center md:flex-row">
            <div className="flex-1">
              <span className="text-primary font-bold text-sm mb-4 block">חבילה מלאה</span>
              <div className="text-4xl font-extrabold text-primary mb-2">רק 99 ש"ח בלבד</div>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-2 text-foreground">מוכנים לגלות מה באמת מתאים לכם?</h2>
              <h3 className="text-xl font-bold text-primary/80 mb-6">מוכנים לקחת את הצעד הראשון?</h3>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                מתאים למי שרוצה לבדוק כיוון אחד ולהתחיל להבין את הפוטנציאל שלו.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'מבדק אחד מותאם אישית',
                  'דוח ניתוח יכולות אישי',
                  'שירות בוסטר לשיפור התוצאות והכוונה חכמה',
                  'אנליזה ניתוח קורות חיים אל מול דוח V107',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 flex-row">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">✓</span>
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <Link to={createPageUrl("Questionnaire")}>
                  <button className="bg-accent text-white text-lg font-semibold px-10 py-4 rounded-2xl hover:opacity-90 hover:shadow-xl hover:shadow-accent/25 transition-all w-full md:w-max">
                    התחל מיפוי אישי
                  </button>
                </Link>
                <p className="text-muted-foreground text-sm flex items-center gap-2 justify-end">
                  <span>💡 התחילו לגלות את עצמכם בלי להתחייב!</span>
                </p>
              </div>
            </div>

            <div className="w-full md:w-64 aspect-square rounded-3xl flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                alt="AI Brain"
                className="w-full h-full object-cover rounded-3xl shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfQZvwwkpMpb3h8St9kZKBwmzenaynRFW1oZQkW56Pz-SbXZrCJzc-FwgfMWccZibUtfDia5hW2IwujNt0ThFO1q9GgmZqkw0VgoHmiwShShqw53qRkWgYrOaWra2mD0ps5nsN68w4aUE3oX8RpmsJRW7J-B5k-nQnDmJxozoAL4h_NyG-Xr_BVqvBDJDD87efkBh6GyBPTq5wVMaOHQK_tIv3e5oBuBs80C-wxsvGwFhN9XgtcMvW2_lCtN5RfU5M3u7UNNrBsYVY"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <FAQSection />

      {/* ===== COMMUNITY ===== */}
      <section className="py-24 bg-gradient-to-br from-primary to-accent">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-slate-950 text-white p-10 lg:p-14 rounded-3xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <h3 className="text-3xl font-bold mb-4">קהילת ה-New Gen</h3>
              <p className="text-white/60 text-lg max-w-lg leading-relaxed">
                אלפי צעירים כבר מצאו את הדרך שלהם דרך v107. הצטרפו לרשת המקצועית שמשנה את כללי המשחק.
              </p>
              <div className="flex -space-x-3 space-x-reverse mt-8">
                <img className="w-12 h-12 rounded-full border-4 border-slate-950 object-cover" alt="Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvIPRdGoMGKW5xqxsZZVh28jCRTy-IekYhJAATNBGPoU_Cn1-9i4iwFJ3S0LnD9T8_nBIIE09MZSICoDlp7Ove4NZmUjAh6dktPoS2-aNElhpIW72XIU1I0kJOxk4kaY-ohFUuEHncJlezXJWHq6Bb6MBijBcYgPPS63Xtw4gwD30-A4AAk57DVFhzZZtEzY0r76hmTW269UZ4dWa7slquSgkVmV13kpJJdhzlL3PhbjqGNfQPeATKJZRoRdUCFKCl7-J6QL_QPMd8" />
                <img className="w-12 h-12 rounded-full border-4 border-slate-950 object-cover" alt="Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpdRqQOjHjJaSaQDqwyJZ8QOWDafmsmWV4DXst049rT3WJS7oXqYbBOV8ittbVu06wDUN-A4bXCaSkqF8GsbVu8YmrsMxJ3pLgvrb7dK5PjZB-Vss8wxAExy3-yA4Dc7wAfqeFOR61axzKZtDEc1M1W9OlK4TS5yn1hxtatUqFJA9BP7D6r_PcdQFMhgANGoBvj92ViLRxN2HJPK7SPpfKr-z7nLDsWDg5wt2Ybl2m017OYs2XivO59dxvgV7LGplN7Uk2JfNznDs7" />
                <img className="w-12 h-12 rounded-full border-4 border-slate-950 object-cover" alt="Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn4Lgb4ZwIyYhooe__pDFgFIKhnIVNWQA-ebrwt91Z_TNe4DrtxrAlsXCPZbepnv-87SpH0Ae9lZkhsA-JfmpgtKF47baPZCVjAbiNQ15GKIvf4vMiQrAdiGI4_rqey3JJjmaU6eLlwjn3aBzU566nLhieCcMOOEprS1Qie_X6nhGG-k4mEpMN4Q6TuWUxn_undyZWzcBz5lgNCZyf0ytEPrabIb00e8sxlZx0J3qRNtQKlpMsZtISyYRJ7oTooI4Iia7m-6XlOqj6" />
                <div className="w-12 h-12 rounded-full border-4 border-slate-950 bg-primary flex items-center justify-center text-xs font-bold text-white">
                  +2k
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <img className="w-full h-full object-cover" alt="Group of diverse young professionals"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqQQYwrBwx2QZK-J_Pu88gNjwrfaGwYmVE6C0LOOn8iKk__2ItetNhnQ1KFjqVcs0NEpV6L9GoTxOCDhk21aGFCVp1cA6OO0tMLvy036ju1D_zJVblUdQkJ5udn230gvDSCxFL1-KFc0EerIen60F9183MlEGM2MZXIHBRoOBKfeq_mv6VbCNL5o2DetICgJ06e-UieGLNeWIzLqU9mUFQ07KzO34gKjoUTLZKbjceq6Aqv43HN-QrIQBoYlKscBubG6Lcc3q4F5_d" />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}