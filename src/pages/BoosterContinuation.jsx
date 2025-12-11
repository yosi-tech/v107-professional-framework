import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Rocket, CheckCircle, TrendingUp, Target, Sparkles, Heart, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function BoosterContinuation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [step, setStep] = useState('question'); // 'question', 'feedback', 'offer', 'no-improvement'
  const [answer, setAnswer] = useState(null); // true/false
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // מצא מנוי פעיל
        const subscriptions = await base44.entities.OnlineCoachingSubscription.filter(
          { user_email: currentUser.email, status: 'active' },
          '-created_date'
        );

        if (subscriptions.length === 0) {
          navigate(createPageUrl('Home'));
          return;
        }

        setSubscription(subscriptions[0]);
      } catch (error) {
        console.error('Error loading data:', error);
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleAnswer = (experienced) => {
    setAnswer(experienced);
    if (experienced) {
      setStep('offer');
    } else {
      setStep('no-improvement');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!subscription) return;

    setIsSubmitting(true);
    try {
      await base44.entities.OnlineCoachingSubscription.update(subscription.id, {
        experienced_improvement: answer,
        feedback_text: feedbackText,
        status: answer ? 'completed' : 'completed'
      });

      if (!answer) {
        alert('תודה רבה על המשוב! נשמח לראות אותך שוב בעתיד.');
        navigate(createPageUrl('Home'));
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('אירעה שגיאה בשמירת המשוב');
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackInfo = {
    execution: { name: 'מסלול ביצוע', icon: '⚡', color: 'from-blue-600 to-blue-800' },
    digital: { name: 'מסלול דיגיטל', icon: '💻', color: 'from-purple-600 to-purple-800' },
    finance: { name: 'מסלול פיננסים', icon: '💰', color: 'from-green-600 to-green-800' },
    marketing: { name: 'מסלול שיווק', icon: '📢', color: 'from-orange-600 to-orange-800' },
    management: { name: 'מסלול ניהול', icon: '👥', color: 'from-indigo-600 to-indigo-800' },
    vision: { name: 'מסלול חזון', icon: '🎯', color: 'from-pink-600 to-pink-800' }
  };

  const track = trackInfo[subscription?.recommended_booster_track] || trackInfo.execution;

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* שאלה ראשית */}
        {step === 'question' && (
          <Card className={`border-none shadow-2xl bg-gradient-to-br ${track.color} text-white overflow-hidden relative`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <CardHeader className="relative z-10 text-center py-12">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl mx-auto mb-4">
                {track.icon}
              </div>
              <CardTitle className="text-4xl font-black mb-2">
                סיימת את 7 הימים! 🎉
              </CardTitle>
              <p className="text-white/90 text-xl">
                {track.name}
              </p>
            </CardHeader>
            
            <CardContent className="relative z-10 pb-12">
              <Card className="bg-white/95 backdrop-blur-md border-none shadow-2xl">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    חוויתם שיפור או שינוי חיובי במהלך 7 הימים?
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    התשובה שלכם תעזור לנו להמליץ לכם על המסלול הנכון להמשך
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => handleAnswer(true)}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl px-12 py-6 rounded-xl font-black shadow-xl hover:scale-105 transition-all"
                    >
                      <ThumbsUp className="w-6 h-6 ml-2" />
                      כן, בהחלט חשתי שיפור!
                    </Button>
                    
                    <Button
                      onClick={() => handleAnswer(false)}
                      variant="outline"
                      className="text-xl px-12 py-6 rounded-xl font-bold border-2 hover:bg-gray-100"
                    >
                      <ThumbsDown className="w-6 h-6 ml-2" />
                      לא ממש...
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* אם לא חש שיפור */}
        {step === 'no-improvement' && (
          <Card className="border-none shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white text-center py-8">
              <CardTitle className="text-3xl font-black">
                נשמח לשמוע את המשוב שלך
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 mb-6 text-center">
                מצטערים לשמוע שלא חשת שיפור. המשוב שלך חשוב לנו מאוד ויעזור לנו לשפר את המסלול.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  מה היה יכול להיות טוב יותר?
                </label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="שתף אותנו במחשבות שלך..."
                  className="min-h-[120px] text-right"
                  dir="rtl"
                />
              </div>

              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white text-lg py-4 rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                    שולח...
                  </>
                ) : (
                  'שלח משוב'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* הצעת המשך */}
        {step === 'offer' && (
          <div className="space-y-6">
            <Card className={`border-none shadow-2xl bg-gradient-to-br ${track.color} text-white overflow-hidden relative`}>
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <CardHeader className="relative z-10 text-center py-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                  🎯
                </div>
                <CardTitle className="text-4xl font-black mb-2">
                  מעולה! בואו נמשיך את המסע 🚀
                </CardTitle>
                <p className="text-white/90 text-lg">
                  תוכנית המשך מקיפה ל-3 חודשים
                </p>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-2xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
                  תוכנית V107 BOOSTER EXTENDED
                </h2>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl mb-8">
                  <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    מה כלול בתוכנית?
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">12 שבועות של ליווי מקצועי</p>
                        <p className="text-gray-600">תוכן שבועי ממוקד במסלול שלך + תרגילים מעשיים</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">4 שיחות ייעוץ אישיות (1:1)</p>
                        <p className="text-gray-600">שיחות וידאו של 45 דקות עם מומחה בתחום</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">גישה לקבוצת ווטסאפ אקסקלוסיבית</p>
                        <p className="text-gray-600">תמיכה שוטפת + שיתוף ידע עם יזמים נוספים</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">כלים ותבניות מקצועיות</p>
                        <p className="text-gray-600">Excel templates, checklists, ומשאבים נוספים</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">מעקב והתאמות אישיות</p>
                        <p className="text-gray-600">ניתוח התקדמות חודשי + התאמת התוכנית</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 line-through">מחיר רגיל: 399 ₪</p>
                      <p className="text-4xl font-black text-gray-900">199 ₪</p>
                      <p className="text-sm text-gray-600">לכל התוכנית (3 חודשים)</p>
                    </div>
                    <Badge className="bg-red-600 text-white text-lg px-4 py-2">
                      חסכון של 200 ₪!
                    </Badge>
                  </div>
                  <p className="text-sm text-amber-800 text-center font-semibold">
                    💎 מחיר מיוחד למשתתפי הבוסטר החינמי
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => navigate(createPageUrl(`BoosterPayment?subscriptionId=${subscription.id}`))}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-6 rounded-xl font-black shadow-2xl hover:scale-105 transition-all"
                  >
                    <Rocket className="w-6 h-6 ml-2" />
                    אני רוצה להמשיך! שדרג אותי עכשיו
                  </Button>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setStep('feedback')}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      אולי מאוחר יותר
                    </button>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 text-center">
                    ⭐ ערבות להחזר כספי מלא תוך 14 יום ללא שאלות
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* משוב */}
        {step === 'feedback' && (
          <Card className="border-none shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-8">
              <CardTitle className="text-3xl font-black">
                נשמח לשמוע את המשוב שלך
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 mb-6 text-center">
                מה הכי עזר לך ב-7 הימים? מה היה יכול להיות טוב יותר?
              </p>
              
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="שתף אותנו במחשבות שלך..."
                className="min-h-[150px] text-right mb-6"
                dir="rtl"
              />

              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-4 rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                    שולח...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 ml-2" />
                    שלח משוב
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center mt-4">
                תודה שהשתתפת במסלול הבוסטר! נשמח לראות אותך שוב בעתיד 💜
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}