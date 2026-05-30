import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import InsightOrb from "@/components/home/InsightOrb";

export default function About() {
  return (
    <main className="font-heebo" dir="rtl">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] -translate-x-1/3 -translate-y-1/4 opacity-60 pointer-events-none">
          <InsightOrb className="w-full h-full" />
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] translate-x-1/4 translate-y-1/4 opacity-40 pointer-events-none">
          <InsightOrb className="w-full h-full" />
        </div>
        <div className="relative z-10">
        <span className="text-primary font-semibold text-sm tracking-wide mb-3 block">הכירו את V107</span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground">
          איך זה עובד?
        </h1>

        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 bg-secondary">
          <iframe
            src="https://drive.google.com/file/d/1Dn073v9oL3M40--1lSdv03OnBXttTJin/preview"
            className="w-full h-full"
            allow="autoplay"
            allowFullScreen
          ></iframe>
        </div>
        </div>
      </section>

      {/* What is V107 */}
      <section className="bg-white py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="text-center mb-20">
            <span className="text-primary font-semibold tracking-wide text-sm mb-4 block">מה זה V107</span>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-foreground">
              זה לא שאלון.<br />
              <span className="text-primary">זו מערכת מיפוי.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              המערכת מנתחת את התשובות שלך דרך שכבות של לוגיקה ודאטה, ומייצרת פרופיל חד ומדויק של ארבעת הממדים הקריטיים להצלחה שלך.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🧠", title: "איך אתה חושב", desc: "ניתוח דפוסי חשיבה לוגיים, קוגניטיביים ויצירתיים בזמן אמת." },
              { icon: "⚡", title: "איך אתה פועל", desc: "מיפוי דרכי פעולה, מהירות תגובה ויעילות תחת תנאי אי-ודאות." },
              { icon: "📊", title: "איפה אתה חזק", desc: "זיהוי מוקדי הכוח האמיתיים שלך והיכן הפוטנציאל שלך מקסימלי." },
              { icon: "🔍", title: "מה מגביל אותך", desc: "מיפוי הנקודות העיוורות והחסמים שמונעים ממך לעלות לשלב הבא." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group bg-white p-8 rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors text-3xl">
                  {icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="bg-secondary p-5 rounded-2xl border border-border/50 flex flex-col md:flex-row items-center gap-5 max-w-2xl">
              <div className="flex -space-x-3 space-x-reverse shrink-0">
                <div className="w-9 h-9 rounded-full border-2 border-white bg-muted"></div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-muted-foreground/20"></div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">AI</div>
              </div>
              <p className="text-sm font-medium text-foreground/80">אלגוריתם ה-Data Architecture שלנו סורק 107 נקודות השקה ליצירת הפרופיל שלך.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm tracking-wide mb-3 block">התהליך</span>
            <h2 className="text-3xl font-extrabold text-foreground">תהליך העבודה</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { num: "01", title: "107 שאלות מדויקות", desc: "תהליך אינטראקטיבי שבוחן תגובות בזמן אמת וקבלת החלטות תחת לחץ." },
              { num: "02", title: "פירוק משתנים", desc: "אלגוריתם מורכב מחלץ מתוך התשובות את ה-DNA המקצועי שלך." },
              { num: "03", title: "פרופיל אישי מלא", desc: "התוצאה הסופית: תמונה מלאה ורב-ממדית של הפוטנציאל שלך." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="p-8 rounded-3xl bg-white border border-border/50 shadow-sm text-center group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 mx-auto group-hover:bg-primary transition-colors duration-300">
                  <span className="text-xl font-extrabold text-primary group-hover:text-white transition-colors duration-300">{num}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 py-5 px-10 rounded-2xl text-center max-w-fit mx-auto bg-primary">
            <p className="text-lg font-bold text-white">107 שאלות. החלטה אחת ברורה.</p>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm tracking-wide mb-3 block">הדוח שלך</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">פרופיל אישי מבוסס נתונים</h2>
            <p className="text-muted-foreground text-xl">זה כלי קבלת החלטות. לא תוכן לקריאה.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
            {/* Big card */}
            <div className="md:col-span-8 bg-white rounded-3xl p-10 shadow-sm border border-border/50 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">📈</div>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full tracking-wide">MAIN ANALYSIS</span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold mb-4 text-foreground">דירוג כישורים לפי רמות ביצוע</h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
                  מדידה אובייקטיבית של המיומנויות החזקות ביותר שלך בהשוואה לשוק. המערכת מחשבת אחוזוני התאמה למשרות מפתח ודירוג יחסי מדויק המבוסס על 107 נקודות דאטה.
                </p>
              </div>
              <div className="mt-10 space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground mb-1">
                  <span>דיוק מודל</span>
                  <span>85%</span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Purple/Primary card */}
            <div className="md:col-span-4 bg-gradient-to-br from-primary to-indigo-700 text-white rounded-3xl p-10 shadow-sm flex flex-col justify-between">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-8 text-2xl">🧬</div>
                <h3 className="text-2xl font-bold mb-4">דפוסי החלטה</h3>
                <p className="text-white/80 leading-relaxed">
                  זיהוי דפוסים חוזרים בקבלת החלטות מקצועיות והבנת 'הנקודות העיוורות' שלך תחת תנאי אי-ודאות.
                </p>
              </div>
            </div>

            {/* Small cards */}
            {[
              { icon: "🏗️", title: "מיפוי פערים", desc: "זיהוי המרחק המדויק בין הפוטנציאל הקיים לביצוע בפועל ומתן פתרונות גישור." },
              { icon: "🧭", title: "התאמה לקריירה", desc: "מסלולי צמיחה אופטימליים לפי ה-Profile הפסיכולוגי שלך ודרישות השוק העדכניות." },
              { icon: "📄", title: "ניתוח קורות חיים מול דוח V107", desc: "השוואה קריטית בין הניסיון המוצהר לבין היכולות והפוטנציאל שאובחנו במערכת." },
              { icon: "🚀", title: "שיפור ביצועים בעזרת בוסטר", desc: "הנחיות פרקטיות ומידיות להעלאת רמת הביצועים בנקודות הקריטיות ביותר." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="md:col-span-6 bg-white rounded-3xl p-8 shadow-sm border border-border/50 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0 text-3xl">{icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-foreground">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Booster */}
      <section className="py-32 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 order-2 lg:order-1">
              <span className="bg-primary text-white font-bold px-5 py-2 rounded-xl text-sm mb-8 inline-block tracking-wide shadow-lg shadow-primary/20">THE BOOSTER</span>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight text-foreground">
                תובנות בלי פעולה<br />
                <span className="text-primary">לא שוות כלום.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: "✨", title: "תוכנית שיפורים אישית", desc: "הבוסטר מציע תוכנית שיפורים עבור הנושא הרלוונטי בצורה ממוקדת ומעשית." },
                  { icon: "📊", title: "ניתוח קורות חיים מעמיק", desc: "הבוסטר גם מנתח את קורות החיים מול הדוח ונותן תמונה ברורה יותר על ההתאמה המקצועית." },
                  { icon: "💼", title: "התאמה לשוק העבודה", desc: "הצעות לעבודה בתחומים המתאימים לחוזקות והכישורים שלך על סמך נתוני אמת." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-5">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0 text-lg shadow-lg shadow-primary/20">
                      {icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-foreground">{title}</h4>
                      <p className="text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-12 text-2xl font-extrabold text-foreground">
                V107 לא רק מראה לך את הפער — <span className="text-primary">היא סוגרת אותו.</span>
              </p>
            </div>
            <div className="flex-1 order-1 lg:order-2 relative group">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/30 transition-transform duration-700 group-hover:scale-[1.02]">
                <img
                  alt="Professional discovering insights in front of dual monitors with futuristic interface"
                  className="w-full aspect-square object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs1OGKDcqGD8vdXWouSr0tFhmKAaYD4rPCyoo3-4Wldd2VawToJ7hnluFxtz8--DhBhtdX5yLcamVhf4BLONSpHRsydyQ9LN09fy7el7F6F49oPadeCuSOQA0LujHLwIcEkC0DRqc3Is2xkLEVMuMlI8s2hwJ1M0WBiSYVjfhEqz2sA5duxqrZSYWZPPCveRMMdn85AWJj8JIKVICkTc4ehcK4OkYROqWx9iQyJACSX7HFLbrpWkk9JaV4KjTo03WDSMFzBwMSvtCU"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
              </div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-primary/15 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img
            alt="abstract background"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGJhvzqsvjJ-w1z4z9Fkytwoo3IFe0-nDpChs9JxlXIxb6jpNHRt0MPfCRVrUxm2fAweLZNNZ6fsaLbGrFLSeZG3w7wHQC6hI_ufr0SdteUI4mGdRvy8cUEvdPulwsbCkRoQa95KDFk5_LLKZwSw3r3DiRJAxadn3gpE7ZojS-Zg2KKexceFxuTMGBmKM4P6s4Qg6rIrX3JJK6_24akrJRBnIKDF6W5nbSZv3DpSRnNuAYyv9mnro1n7sMki4Z9vdArPHvbAASt3H8"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8">מוכן לחשוף את הפוטנציאל האמיתי שלך?</h2>
          <div className="mb-10 inline-block">
            <span className="text-2xl md:text-3xl font-bold bg-white/5 px-8 py-4 rounded-2xl border border-white/10 backdrop-blur-sm inline-block">
              כל זה עבור <span className="text-5xl md:text-7xl block mt-4 text-primary">99 ש״ח</span> בלבד.
            </span>
          </div>
          <div className="block">
            <Link to={createPageUrl("Questionnaire")}>
              <button className="bg-primary text-white px-12 py-5 rounded-2xl text-xl font-bold hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 transition-all">
                התחל מיפוי אישי
              </button>
            </Link>
          </div>
          <p className="mt-8 text-white/40 font-medium">תהליך של 25 דקות. שינוי של קריירה שלמה.</p>
        </div>
      </section>

    </main>
  );
}