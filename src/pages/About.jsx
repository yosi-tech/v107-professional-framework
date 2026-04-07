import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function About() {
  return (
    <main className="pt-24" dir="rtl">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-slate-900">איך זה עובד?</h1>
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl bg-slate-200 group cursor-pointer">
          <img
            alt="futuristic digital visualization of data streams and neural networks"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM6651Mg4AS-3--uSTDOJqbN0cmpXdP1bHrohx3dZJ8Jya8jDbpjrGJllxC5J3rOL3FJkEh6CAA7efGvnFVQXjixROaITKaJhkTQvW7Kv04EWcQoJ7V_4vynivJy5AZ2BAAPTeHwFSraZaSDybtDXxvjkJJNwzT3bjPRbLAV_buev3oc1HTH7nmzwTNF_uZmCymHA7_5EPy_ugVyb6i6LNs5AauDOMOcGuY0fNPq75BIbRHw7a879bafaEk79t06UCPrWh92KA9OIi"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-[#ff8f00]/90 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 text-right">
            <p className="text-white text-sm font-bold uppercase tracking-widest opacity-80">צפה בסרטון ההסבר</p>
          </div>
        </div>
      </section>

      {/* What is V107 */}
      <section className="bg-white py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="text-center mb-20">
            <span className="text-[#ff8f00] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">מה זה V107</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              זה לא שאלון.<br />
              <span className="text-[#ff8f00]">זו מערכת מיפוי.</span>
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
              המערכת מנתחת את התשובות שלך דרך שכבות של לוגיקה ודאטה, ומייצרת פרופיל חד ומדויק של ארבעת הממדים הקריטיים להצלחה שלך.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🧠", title: "איך אתה חושב", desc: "ניתוח דפוסי חשיבה לוגיים, קוגניטיביים ויצירתיים בזמן אמת." },
              { icon: "⚡", title: "איך אתה פועל", desc: "מיפוי דרכי פעולה, מהירות תגובה ויעילות תחת תנאי אי-ודאות." },
              { icon: "📊", title: "איפה אתה חזק", desc: "זיהוי מוקדי הכוח האמיתיים שלך והיכן הפוטנציאל שלך מקסימלי." },
              { icon: "🔍", title: "מה מגביל אותך", desc: "מיפוי הנקודות העיוורות והחסמים שמונעים ממך לעלות לשלב הבא." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-[#ff8f00]/50 transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-[#ff8f00]/10 transition-colors text-4xl">
                  {icon}
                </div>
                <h3 className="text-xl font-black mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-6 max-w-2xl">
              <div className="flex -space-x-4 space-x-reverse shrink-0">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#ff8f00] flex items-center justify-center text-[10px] font-bold text-white">AI</div>
              </div>
              <p className="text-sm font-semibold text-slate-700">אלגוריתם ה-Data Architecture שלנו סורק 107 נקודות השקה ליצירת הפרופיל שלך.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black mb-20 text-center">תהליך העבודה</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { num: "01", title: "107 שאלות מדויקות", desc: "תהליך אינטראקטיבי שבוחן תגובות בזמן אמת וקבלת החלטות תחת לחץ." },
              { num: "02", title: "פירוק משתנים", desc: "אלגוריתם מורכב מחלץ מתוך התשובות את ה-DNA המקצועי שלך." },
              { num: "03", title: "פרופיל אישי מלא", desc: "התוצאה הסופית: תמונה מלאה ורב-ממדית של הפוטנציאל שלך." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-center group hover:border-[#ff8f00]/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 mx-auto group-hover:bg-[#ff8f00] transition-colors duration-500">
                  <span className="text-2xl font-black text-[#ff8f00] group-hover:text-white transition-colors duration-500">{num}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{title}</h3>
                <p className="text-slate-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 py-6 px-12 rounded-full text-center max-w-fit mx-auto bg-[#ff8f00]">
            <p className="text-xl font-bold text-white">107 שאלות. החלטה אחת ברורה.</p>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">פרופיל אישי מבוסס נתונים</h2>
            <p className="text-slate-500 text-xl">זה כלי קבלת החלטות. לא תוכן לקריאה.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">

            {/* Big card */}
            <div className="md:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-2xl bg-[#ff8f00]/10 flex items-center justify-center text-3xl">📈</div>
                <span className="text-xs font-bold bg-[#ff8f00]/10 text-[#ff8f00] px-3 py-1 rounded-full uppercase tracking-widest">Main Analysis</span>
              </div>
              <div>
                <h3 className="text-3xl font-black mb-4">דירוג כישורים לפי רמות ביצוע</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                  מדידה אובייקטיבית של המיומנויות החזקות ביותר שלך בהשוואה לשוק. המערכת מחשבת אחוזוני התאמה למשרות מפתח ודירוג יחסי מדויק המבוסס על 107 נקודות דאטה.
                </p>
              </div>
              <div className="mt-12 space-y-4">
                <div className="flex items-center justify-between text-sm font-bold text-slate-500 mb-2">
                  <span>דיוק מודל</span>
                  <span>85%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff8f00] w-[85%] rounded-full" style={{ boxShadow: "0 0 10px rgba(255,140,0,0.3)" }}></div>
                </div>
              </div>
            </div>

            {/* Orange card */}
            <div className="md:col-span-4 bg-[#ff8f00] text-white rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-8 text-2xl">🧬</div>
                <h3 className="text-2xl font-black mb-4">דפוסי החלטה</h3>
                <p className="text-white/90 leading-relaxed">
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
              <div key={title} className="md:col-span-6 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center shrink-0 text-4xl">{icon}</div>
                <div>
                  <h3 className="text-2xl font-black mb-2">{title}</h3>
                  <p className="text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Booster */}
      <section className="py-32 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 order-2 lg:order-1">
              <span className="bg-[#ff8f00] text-white font-black px-6 py-2 rounded-lg text-lg mb-8 inline-block tracking-[0.15em] shadow-lg" style={{ boxShadow: "0 10px 30px rgba(255,143,0,0.2)" }}>THE BOOSTER</span>
              <h2 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
                תובנות בלי פעולה<br />
                <span className="text-[#ff8f00]">לא שוות כלום.</span>
              </h2>
              <div className="space-y-10">
                {[
                  { icon: "✨", title: "תוכנית שיפורים אישית", desc: "הבוסטר מציע תוכנית שיפורים עבור הנושא הרלוונטי בצורה ממוקדת ומעשית." },
                  { icon: "📊", title: "ניתוח קורות חיים מעמיק", desc: "הבוסטר גם מנתח את קורות החיים מול הדוח ונותן תמונה ברורה יותר על ההתאמה המקצועית." },
                  { icon: "💼", title: "התאמה לשוק העבודה", desc: "הצעות לעבודה בתחומים המתאימים לחוזקות והכישורים שלך על סמך נתוני אמת." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-[#ff8f00] flex items-center justify-center shrink-0 text-xl shadow-lg" style={{ boxShadow: "0 8px 20px rgba(255,143,0,0.3)" }}>
                      {icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">{title}</h4>
                      <p className="text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-14 text-2xl font-black text-slate-900">
                V107 לא רק מראה לך את הפער — <span className="text-[#ff8f00]">היא סוגרת אותו.</span>
              </p>
            </div>
            <div className="flex-1 order-1 lg:order-2 relative group">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-50 transition-transform duration-700 group-hover:scale-[1.02]">
                <img
                  alt="Professional discovering insights in front of dual monitors with futuristic interface"
                  className="w-full aspect-square object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs1OGKDcqGD8vdXWouSr0tFhmKAaYD4rPCyoo3-4Wldd2VawToJ7hnluFxtz8--DhBhtdX5yLcamVhf4BLONSpHRsydyQ9LN09fy7el7F6F49oPadeCuSOQA0LujHLwIcEkC0DRqc3Is2xkLEVMuMlI8s2hwJ1M0WBiSYVjfhEqz2sA5duxqrZSYWZPPCveRMMdn85AWJj8JIKVICkTc4ehcK4OkYROqWx9iQyJACSX7HFLbrpWkk9JaV4KjTo03WDSMFzBwMSvtCU"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff8f00]/20 to-transparent"></div>
              </div>
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#ff8f00]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#ff8f00]/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            alt="abstract background"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGJhvzqsvjJ-w1z4z9Fkytwoo3IFe0-nDpChs9JxlXIxb6jpNHRt0MPfCRVrUxm2fAweLZNNZ6fsaLbGrFLSeZG3w7wHQC6hI_ufr0SdteUI4mGdRvy8cUEvdPulwsbCkRoQa95KDFk5_LLKZwSw3r3DiRJAxadn3gpE7ZojS-Zg2KKexceFxuTMGBmKM4P6s4Qg6rIrX3JJK6_24akrJRBnIKDF6W5nbSZv3DpSRnNuAYyv9mnro1n7sMki4Z9vdArPHvbAASt3H8"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8">
          <h2 className="text-5xl md:text-7xl font-black mb-6">מוכן לחשוף את הפוטנציאל האמיתי שלך?</h2>
          <div className="mb-12 inline-block">
            <span className="text-2xl md:text-3xl font-bold bg-white/10 px-8 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
              כל זה עבור <span className="text-5xl md:text-7xl block mt-4 text-[#ff8f00]">99 ש״ח</span> בלבד.
            </span>
          </div>
          <div className="block">
            <Link to={createPageUrl("Questionnaire")}>
              <button className="bg-[#ff8f00] text-white px-12 py-6 rounded-full text-2xl font-black hover:scale-105 transition-transform duration-300 shadow-2xl">
                התחל מיפוי אישי
              </button>
            </Link>
          </div>
          <p className="mt-8 text-white/60 font-medium">תהליך של 25 דקות. שינוי של קריירה שלמה.</p>
        </div>
      </section>

    </main>
  );
}