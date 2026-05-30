import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";

const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBvIPRdGoMGKW5xqxsZZVh28jCRTy-IekYhJAATNBGPoU_Cn1-9i4iwFJ3S0LnD9T8_nBIIE09MZSICoDlp7Ove4NZmUjAh6dktPoS2-aNElhpIW72XIU1I0kJOxk4kaY-ohFUuEHncJlezXJWHq6Bb6MBijBcYgPPS63Xtw4gwD30-A4AAk57DVFhzZZtEzY0r76hmTW269UZ4dWa7slquSgkVmV13kpJJdhzlL3PhbjqGNfQPeATKJZRoRdUCFKCl7-J6QL_QPMd8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpdRqQOjHjJaSaQDqwyJZ8QOWDafmsmWV4DXst049rT3WJS7oXqYbBOV8ittbVu06wDUN-A4bXCaSkqF8GsbVu8YmrsMxJ3pLgvrb7dK5PjZB-Vss8wxAExy3-yA4Dc7wAfqeFOR61axzKZtDEc1M1W9OlK4TS5yn1hxtatUqFJA9BP7D6r_PcdQFMhgANGoBvj92ViLRxN2HJPK7SPpfKr-z7nLDsWDg5wt2Ybl2m017OYs2XivO59dxvgV7LGplN7Uk2JfNznDs7",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBn4Lgb4ZwIyYhooe__pDFgFIKhnIVNWQA-ebrwt91Z_TNe4DrtxrAlsXCPZbepnv-87SpH0Ae9lZkhsA-JfmpgtKF47baPZCVjAbiNQ15GKIvf4vMiQrAdiGI4_rqey3JJjmaU6eLlwjn3aBzU566nLhieCcMOOEprS1Qie_X6nhGG-k4mEpMN4Q6TuWUxn_undyZWzcBz5lgNCZyf0ytEPrabIb00e8sxlZx0J3qRNtQKlpMsZtISyYRJ7oTooI4Iia7m-6XlOqj6",
];

export default function CommunitySection() {
  return (
    <section className="py-24 bg-foreground" dir="rtl">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Content */}
          <div className="flex-1 text-right">
            <span className="text-primary font-semibold text-sm mb-4 block">הקהילה שלנו</span>
            <h3 className="text-4xl font-extrabold mb-5 text-white">קהילת ה-New Gen</h3>
            <p className="text-white/50 text-lg max-w-lg leading-relaxed mb-8">
              אלפי צעירים כבר מצאו את הדרך שלהם דרך v107. הצטרפו לרשת המקצועית שמשנה את כללי המשחק.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-3 space-x-reverse">
                {avatars.map((src, i) => (
                  <img key={i} className="w-11 h-11 rounded-full border-3 border-foreground object-cover" alt="Profile" src={src} />
                ))}
                <div className="w-11 h-11 rounded-full border-3 border-foreground bg-accent flex items-center justify-center text-xs font-bold text-white">
                  +2k
                </div>
              </div>
              <span className="text-white/40 text-sm">משתמשים פעילים</span>
            </div>
            <Link to={createPageUrl("Questionnaire")}>
              <button className="bg-white text-foreground px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/90 transition-colors flex items-center gap-2">
                <span>הצטרף עכשיו</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            {[
              { value: "693+", label: "משתמשים" },
              { value: "11", label: "ממדים" },
              { value: "107", label: "נקודות ניתוח" },
              { value: "30", label: "ימי בוסטר" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center w-36">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/40 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}