import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Users, Rocket, TrendingUp, ClipboardList } from "lucide-react";

export default function Home() {
  const userCount = 693;

  return (
    <main className="pt-24" dir="rtl">

      {/* ===== HERO ===== */}
      <section className="relative px-8 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Text side */}
          <div className="relative z-10 text-right">
            <span className="inline-block bg-[#FF8F00]/10 text-[#FF8F00] font-bold px-4 py-1 rounded-full text-sm mb-6 tracking-wide">
              עתיד הקריירה שלך מתחיל כאן
            </span>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
              תעצבו את <br /> <span className="text-[#FF8F00] italic">העתיד</span> שלכם
            </h1>
            <p className="text-xl text-slate-500 max-w-lg ml-auto leading-relaxed mb-10">
              הצטרפו לדור החדש של המקצוענים – הפלטפורמה החכמה שמבינה את הכיוון הקריירה שלכם במבדק אחד בלבד
            </p>
            <div className="flex flex-row-reverse gap-4">
              <Link to={createPageUrl("Questionnaire")}>
                <button className="bg-[#FF8F00] text-white text-lg font-bold px-10 py-5 rounded-3xl flex items-center gap-2 hover:scale-105 transition-transform">
                  <span>לחץ כאן למילוי השאלון</span>
                  <span>←</span>
                </button>
              </Link>
              <Link to={createPageUrl("About")}>
                <button className="bg-slate-100 text-slate-700 px-8 py-5 rounded-3xl font-bold border border-slate-200 hover:bg-slate-200 transition-colors shadow-sm">
                  איך זה עובד?
                </button>
              </Link>
            </div>
          </div>

          {/* Image side */}
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FF8F00]/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                className="w-full h-full object-cover"
                alt="Professional man and woman thinking about various career paths"
                src="https://media.base44.com/images/public/68beedf299352a857559c5a4/0d57f75de_Gemini_Generated_Image_kt4uf4kt4uf4kt4u.png"
              />
            </div>

            {/* Stats glass panel */}
            <div className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl max-w-xs border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#FF8F00] rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg leading-tight">
                    {userCount.toLocaleString()} משתמשים עברו את המבדק
                  </div>
                  <div className="text-sm text-slate-500">הצטרפו לקהילה הגדלה שלנו</div>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#FF8F00] w-3/4 h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">כל מה שצריך כדי לפרוץ</h2>
            <p className="text-slate-500 text-lg">הכלים הכי מתקדמים בשוק, במקום אחד. <span className="font-bold text-[#FF8F00]">— רק ב 99 ש"ח</span></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-white p-10 rounded-[2.5rem] flex flex-col justify-between group hover:shadow-xl transition-all border border-transparent hover:border-[#FF8F00]/10 text-right h-full">
              <div>
                <div className="w-16 h-16 bg-[#FF8F00]/10 text-[#FF8F00] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">מתחילים עכשיו!</h3>
                <p className="text-slate-500 text-lg leading-relaxed">מלאו את השאלון בנוחות, בפרטיות ובקצב שלכם. כ-20 דקות שישנו את הכיוון המקצועי שלכם.</p>
              </div>
              <div className="mt-12 flex justify-between items-center">
                <span className="text-slate-500 font-bold text-lg opacity-90">כ-20 דקות</span>
                <span className="text-[#FF8F00] font-medium text-sm">כלול בחבילה</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-[2.5rem] flex flex-col justify-between group hover:shadow-xl transition-all border border-transparent hover:border-[#FF8F00]/10 text-right h-full">
              <div>
                <div className="w-16 h-16 bg-[#FF8F00]/10 text-[#FF8F00] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">קבלו דוח יכולות אישי</h3>
                <p className="text-slate-500 text-lg leading-relaxed">הדוח יאפשר לכם ללמוד את החוזקות ואת היכולות הטעונות שיפור שלכם. יחד עם הדוח תקבלו המלצות מותאמות אישית ואת ה-BOOSTER שלנו לשיפור היכולות.</p>
              </div>
              <div className="mt-12 flex justify-between items-center">
                <span className="text-slate-500 font-bold text-lg opacity-90">תוך עד 24 שעות</span>
                <span className="text-[#FF8F00] font-medium text-sm">כלול בחבילה</span>
              </div>
            </div>

            {/* Card 3 - Orange highlight */}
            <div className="bg-[#FF8F00] p-10 rounded-[2.5rem] text-white flex flex-col justify-between hover:scale-[1.02] transition-transform text-right h-full">
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-8">
                <Rocket className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">ניתוח יכולות מול קורות החיים</h3>
                <p className="text-white/90 text-lg leading-relaxed">אם תעלו בשאלון את קורות החיים שלכם, תוכלו בנוסף לקבל מסמך מקצועי המנתח את היכולות שלכם ביחס לקורות החיים — כלי רב עוצמה להבנת תהליכים אישיים.</p>
              </div>
              <div className="mt-12 flex justify-end">
                <span className="text-white font-bold text-lg opacity-90">כלול בחבילה</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== PRICING CTA ===== */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-4xl mx-auto bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 text-right relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF8F00]/5 rounded-br-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-12 items-center md:flex-row">
            <div className="flex-1">
              <div className="text-4xl font-black text-[#FF8F00] mb-2">רק 99 ש"ח בלבד</div>
              <h2 className="text-3xl lg:text-4xl font-black mb-2">מוכנים לגלות מה באמת מתאים לכם?</h2>
              <h3 className="text-2xl font-bold text-[#FF8F00] mb-6">מוכנים לקחת את הצעד הראשון?</h3>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
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
                    <div className="w-6 h-6 rounded-full bg-[#FF8F00]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#FF8F00] text-sm font-bold">✓</span>
                    </div>
                    <span className="text-slate-800 font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <Link to={createPageUrl("Questionnaire")}>
                  <button className="bg-[#FF8F00] text-white text-xl font-bold px-12 py-5 rounded-2xl hover:shadow-lg hover:shadow-[#FF8F00]/20 active:scale-95 transition-all w-full md:w-max">
                   לחץ כאן למילוי השאלון
                  </button>
                </Link>
                <p className="text-slate-400 text-sm flex items-center gap-2 justify-end">
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

      {/* ===== COMMUNITY ===== */}
      <section className="py-24 bg-[#FF8F00]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <h3 className="text-3xl font-bold mb-4">קהילת ה-New Gen</h3>
              <p className="text-slate-300 text-lg max-w-lg">
                אלפי צעירים כבר מצאו את הדרך שלהם דרך v107. הצטרפו לרשת המקצועית שמשנה את כללי המשחק.
              </p>
              <div className="flex -space-x-3 space-x-reverse mt-8">
                <img
                  className="w-12 h-12 rounded-full border-4 border-slate-900 object-cover"
                  alt="Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvIPRdGoMGKW5xqxsZZVh28jCRTy-IekYhJAATNBGPoU_Cn1-9i4iwFJ3S0LnD9T8_nBIIE09MZSICoDlp7Ove4NZmUjAh6dktPoS2-aNElhpIW72XIU1I0kJOxk4kaY-ohFUuEHncJlezXJWHq6Bb6MBijBcYgPPS63Xtw4gwD30-A4AAk57DVFhzZZtEzY0r76hmTW269UZ4dWa7slquSgkVmV13kpJJdhzlL3PhbjqGNfQPeATKJZRoRdUCFKCl7-J6QL_QPMd8"
                />
                <img
                  className="w-12 h-12 rounded-full border-4 border-slate-900 object-cover"
                  alt="Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpdRqQOjHjJaSaQDqwyJZ8QOWDafmsmWV4DXst049rT3WJS7oXqYbBOV8ittbVu06wDUN-A4bXCaSkqF8GsbVu8YmrsMxJ3pLgvrb7dK5PjZB-Vss8wxAExy3-yA4Dc7wAfqeFOR61axzKZtDEc1M1W9OlK4TS5yn1hxtatUqFJA9BP7D6r_PcdQFMhgANGoBvj92ViLRxN2HJPK7SPpfKr-z7nLDsWDg5wt2Ybl2m017OYs2XivO59dxvgV7LGplN7Uk2JfNznDs7"
                />
                <img
                  className="w-12 h-12 rounded-full border-4 border-slate-900 object-cover"
                  alt="Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn4Lgb4ZwIyYhooe__pDFgFIKhnIVNWQA-ebrwt91Z_TNe4DrtxrAlsXCPZbepnv-87SpH0Ae9lZkhsA-JfmpgtKF47baPZCVjAbiNQ15GKIvf4vMiQrAdiGI4_rqey3JJjmaU6eLlwjn3aBzU566nLhieCcMOOEprS1Qie_X6nhGG-k4mEpMN4Q6TuWUxn_undyZWzcBz5lgNCZyf0ytEPrabIb00e8sxlZx0J3qRNtQKlpMsZtISyYRJ7oTooI4Iia7m-6XlOqj6"
                />
                <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-[#FF8F00] flex items-center justify-center text-xs font-bold text-white">
                  +2k
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity">
              <img
                className="w-full h-full object-cover"
                alt="Group of diverse young professionals"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqQQYwrBwx2QZK-J_Pu88gNjwrfaGwYmVE6C0LOOn8iKk__2ItetNhnQ1KFjqVcs0NEpV6L9GoTxOCDhk21aGFCVp1cA6OO0tMLvy036ju1D_zJVblUdQkJ5udn230gvDSCxFL1-KFc0EerIen60F9183MlEGM2MZXIHBRoOBKfeq_mv6VbCNL5o2DetICgJ06e-UieGLNeWIzLqU9mUFQ07KzO34gKjoUTLZKbjceq6Aqv43HN-QrIQBoYlKscBubG6Lcc3q4F5_d"
              />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}