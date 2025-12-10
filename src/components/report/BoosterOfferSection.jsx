import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, Gift, TrendingUp, Award, Target } from "lucide-react";

export default function BoosterOfferSection({ recommendedTrack, language }) {
  if (!recommendedTrack) return null;

  const isHebrew = language === 'he';

  const trackInfo = {
    execution: {
      name_he: 'מסלול ביצוע',
      name_en: 'Execution Track',
      desc_he: 'הפוך רעיונות לתוצאות מדידות תוך 7 ימים',
      desc_en: 'Turn ideas into measurable results in 7 days',
      color: 'from-blue-600 to-blue-800',
      icon: '⚡'
    },
    digital: {
      name_he: 'מסלול דיגיטל',
      name_en: 'Digital Track',
      desc_he: 'בנה נוכחות דיגיטלית מנצחת תוך 7 ימים',
      desc_en: 'Build winning digital presence in 7 days',
      color: 'from-purple-600 to-purple-800',
      icon: '💻'
    },
    finance: {
      name_he: 'מסלול פיננסים',
      name_en: 'Finance Track',
      desc_he: 'שלוט בפיננסים והגדל רווחיות תוך 7 ימים',
      desc_en: 'Master finances and increase profitability in 7 days',
      color: 'from-green-600 to-green-800',
      icon: '💰'
    },
    marketing: {
      name_he: 'מסלול שיווק',
      name_en: 'Marketing Track',
      desc_he: 'צור מערך שיווקי מנצח תוך 7 ימים',
      desc_en: 'Create winning marketing system in 7 days',
      color: 'from-orange-600 to-orange-800',
      icon: '📢'
    },
    management: {
      name_he: 'מסלול ניהול',
      name_en: 'Management Track',
      desc_he: 'הפוך למנהל מצוין תוך 7 ימים',
      desc_en: 'Become excellent manager in 7 days',
      color: 'from-indigo-600 to-indigo-800',
      icon: '👥'
    },
    vision: {
      name_he: 'מסלול חזון',
      name_en: 'Vision Track',
      desc_he: 'גבש חזון אסטרטגי ברור תוך 7 ימים',
      desc_en: 'Formulate clear strategic vision in 7 days',
      color: 'from-pink-600 to-pink-800',
      icon: '🎯'
    }
  };

  const track = trackInfo[recommendedTrack] || trackInfo.execution;

  return (
    <Card className={`mb-8 border-none bg-gradient-to-br ${track.color} text-white overflow-hidden relative`}>
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border-2 border-white/30">
            {track.icon}
          </div>
          <div>
            <Badge className="bg-white/20 text-white border-white/30 mb-2">
              {isHebrew ? 'המלצה אישית עבורך' : 'Personal Recommendation'}
            </Badge>
            <CardTitle className="text-3xl font-black">
              V107 BOOSTER
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6">
          <h3 className="text-2xl font-black mb-3">
            {isHebrew ? track.name_he : track.name_en}
          </h3>
          <p className="text-xl text-white/90 mb-6">
            {isHebrew ? track.desc_he : track.desc_en}
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-black mb-1">7</div>
              <div className="text-sm text-white/80">
                {isHebrew ? 'ימי ליווי אינטנסיבי' : 'Days of Intensive Coaching'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-black mb-1">199₪</div>
              <div className="text-sm text-white/80">
                {isHebrew ? 'רק אם הפקת ערך' : 'Only if you gained value'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-black mb-1">🎁</div>
              <div className="text-sm text-white/80">
                {isHebrew ? 'ערכת הטמעה מתנה' : 'Implementation Kit Gift'}
              </div>
            </div>
          </div>

          <div className="bg-amber-500/20 backdrop-blur-sm border-2 border-amber-400/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <Gift className="w-8 h-8 text-amber-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold mb-2 text-amber-100">
                  {isHebrew ? '🎁 ערכת ההטמעה - בונוס מיוחד!' : '🎁 Implementation Kit - Special Bonus!'}
                </h4>
                <p className="text-white/90 leading-relaxed mb-3">
                  {isHebrew 
                    ? 'כל מי שמדווח על שינוי משמעותי ומשלם את ה-199₪ - מקבל במתנה ערכת הטמעה שווה 497₪!'
                    : 'Everyone who reports meaningful change and pays 199₪ - receives an implementation kit worth 497₪ as a gift!'
                  }
                </p>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-300" />
                    {isHebrew ? 'תבניות וכלים מוכנים לשימוש' : 'Ready-to-use templates and tools'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-300" />
                    {isHebrew ? 'מדריכים צעד אחר צעד' : 'Step-by-step guides'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-300" />
                    {isHebrew ? 'גישה לקהילת יזמים' : 'Access to entrepreneur community'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
            <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              {isHebrew ? '💎 ההצעה המיוחדת שלנו: "לא שיפרת - לא שילמת"' : '💎 Our Special Offer: "No Improvement - No Payment"'}
            </h4>
            <div className="space-y-2 text-white/90">
              <p className="flex items-start gap-2">
                <span className="text-2xl">1️⃣</span>
                <span>{isHebrew ? 'תקבל 7 ימים של ליווי מקצועי אינטנסיבי' : 'Receive 7 days of intensive professional coaching'}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">2️⃣</span>
                <span>{isHebrew ? 'בסוף התהליך - אתה מחליט אם הפקת ערך אמיתי' : 'At the end - you decide if you gained real value'}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">3️⃣</span>
                <span className="font-bold text-amber-300">
                  {isHebrew 
                    ? 'רק אם תצהיר שהשתפרת ושהפקת ערך → תשלם 199₪ ותקבל ערכת הטמעה שווה 497₪ במתנה!'
                    : 'Only if you declare improvement and gained value → Pay 199₪ and get implementation kit worth 497₪ as a gift!'}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-2xl">4️⃣</span>
                <span>{isHebrew ? 'לא שיפרת? לא משלם! ללא שאלות, ללא התחייבות.' : 'No improvement? No payment! No questions, no commitment.'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/80 text-sm mb-4">
            {isHebrew 
              ? 'פרטים נוספים יישלחו אליך במייל נפרד'
              : 'More details will be sent to you in a separate email'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}