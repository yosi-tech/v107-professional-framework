import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, Gift, TrendingUp, Award, Target, ShoppingCart } from "lucide-react";

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
    <Card className={`border-none shadow-2xl bg-gradient-to-br ${track.color} text-white overflow-hidden relative`}>
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl border-2 border-white/30 shadow-xl">
            {track.icon}
          </div>
          <div>
            <Badge className="bg-white/20 text-white border-white/30 mb-3 text-base px-4 py-1">
              {isHebrew ? '⭐ המלצה אישית עבורך' : '⭐ Personal Recommendation'}
            </Badge>
            <CardTitle className="text-4xl font-black">
              V107 BOOSTER
            </CardTitle>
            <p className="text-white/90 text-lg mt-1">
              {isHebrew ? track.name_he : track.name_en}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        <Card className="bg-white/95 backdrop-blur-md border-none shadow-2xl">
          <CardContent className="p-8">
            <p className="text-2xl text-gray-800 mb-6 font-bold leading-relaxed">
              {isHebrew ? track.desc_he : track.desc_en}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300 text-center shadow-lg">
                <div className="text-5xl font-black mb-2 text-blue-900">7</div>
                <div className="text-sm text-blue-700 font-semibold">
                  {isHebrew ? 'ימי ליווי אינטנסיבי' : 'Days of Intensive Coaching'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-2 border-amber-300 text-center shadow-lg">
                <div className="text-5xl font-black mb-2 text-amber-900">199₪</div>
                <div className="text-sm text-amber-700 font-semibold">
                  {isHebrew ? 'רק אם הפקת ערך' : 'Only if you gained value'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-300 text-center shadow-lg">
                <div className="text-5xl mb-2">🎁</div>
                <div className="text-sm text-green-700 font-semibold">
                  {isHebrew ? 'ערכת הטמעה מתנה' : 'Implementation Kit Gift'}
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-amber-400 to-orange-500 border-none shadow-2xl mb-6">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Gift className="w-12 h-12 text-white flex-shrink-0" />
                  <div>
                    <h4 className="text-2xl font-black mb-3 text-white">
                      {isHebrew ? '🎁 ערכת ההטמעה - בונוס מיוחד!' : '🎁 Implementation Kit - Special Bonus!'}
                    </h4>
                    <p className="text-white text-lg leading-relaxed mb-4 font-medium">
                      {isHebrew 
                        ? 'כל מי שמדווח על שינוי משמעותי ומשלם את ה-199₪ - מקבל במתנה ערכת הטמעה שווה 497₪!'
                        : 'Everyone who reports meaningful change and pays 199₪ - receives an implementation kit worth 497₪ as a gift!'
                      }
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <ul className="space-y-3 text-white">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 flex-shrink-0" />
                          <span className="font-semibold text-lg">{isHebrew ? 'תבניות וכלים מוכנים לשימוש' : 'Ready-to-use templates and tools'}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 flex-shrink-0" />
                          <span className="font-semibold text-lg">{isHebrew ? 'מדריכים צעד אחר צעד' : 'Step-by-step guides'}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 flex-shrink-0" />
                          <span className="font-semibold text-lg">{isHebrew ? 'גישה לקהילת יזמים' : 'Access to entrepreneur community'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-md border-none shadow-2xl">
              <CardContent className="p-8">
                <h4 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-900">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  {isHebrew ? '💎 ההצעה המיוחדת שלנו: "לא שיפרת - לא שילמת"' : '💎 Our Special Offer: "No Improvement - No Payment"'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0">
                          1
                        </div>
                        <p className="text-gray-800 font-bold text-lg leading-relaxed">
                          {isHebrew ? 'תקבל 7 ימים של ליווי מקצועי אינטנסיבי' : 'Receive 7 days of intensive professional coaching'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0">
                          2
                        </div>
                        <p className="text-gray-800 font-bold text-lg leading-relaxed">
                          {isHebrew ? 'בסוף התהליך - אתה מחליט אם הפקת ערך אמיתי' : 'At the end - you decide if you gained real value'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-amber-400 to-orange-500 border-none shadow-2xl hover:shadow-2xl transition-all hover:scale-[1.02] md:col-span-2">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0">
                          3
                        </div>
                        <p className="text-white font-black text-xl leading-relaxed">
                          {isHebrew 
                            ? '⭐ רק אם תצהיר שהשתפרת ושהפקת ערך → תשלם 199₪ ותקבל ערכת הטמעה שווה 497₪ במתנה! ⭐'
                            : '⭐ Only if you declare improvement and gained value → Pay 199₪ and get implementation kit worth 497₪ as a gift! ⭐'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] md:col-span-2">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0">
                          4
                        </div>
                        <p className="text-gray-800 font-bold text-lg leading-relaxed">
                          {isHebrew ? '💚 לא שיפרת? לא משלם! ללא שאלות, ללא התחייבות.' : '💚 No improvement? No payment! No questions, no commitment.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button 
            onClick={() => {
              // Redirect to purchase page or open payment dialog
              window.location.href = '/payment?product=online_coaching_7days';
            }}
            className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-xl font-black shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
          >
            {isHebrew ? '🚀 אני רוצה להצטרף למסלול הבוסטר!' : '🚀 I want to join the Booster Track!'}
          </Button>
          <p className="text-white/90 text-sm font-medium mt-4">
            {isHebrew 
              ? '✨ פרטים נוספים יישלחו אליך במייל לאחר ההרשמה ✨'
              : '✨ More details will be sent to you by email after registration ✨'}
          </p>
        </div>
        </CardContent>
        </Card>
        );
        }