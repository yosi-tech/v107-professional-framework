import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, Gift, TrendingUp, Award, Target, ShoppingCart } from "lucide-react";

export default function BoosterOfferSection({ recommendedTrack, language, userName }) {
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


          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to={`${createPageUrl('BoosterRegistration')}?track=${recommendedTrack}&lang=${language}`}>
            <Button 
              className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-xl font-black shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
            >
              {isHebrew ? '🚀 אני רוצה להצטרף למסלול הבוסטר!' : '🚀 I want to join the Booster Track!'}
            </Button>
          </Link>
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