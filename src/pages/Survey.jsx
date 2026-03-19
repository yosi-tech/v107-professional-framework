import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Gift, CheckCircle, LogIn, Shield } from 'lucide-react';

const FEEDBACK_QUESTIONS = [
  {
    id: 'q1',
    question: 'מילוי השאלון — איך הרגשת?',
    options: ['זרמתי בקלות מהתחלה לסוף', 'זרמתי, אבל לקח יותר ממה שציפיתי', 'היה ארוך מדי עבורי']
  },
  {
    id: 'q2',
    question: 'האם גילית על עצמך משהו חדש?',
    options: ['כן — משהו שממש הפתיע אותי', 'כן — אישר תחושות שלא ניסחתי', 'לא ממש, הכל היה מוכר', 'לא הסכמתי עם חלק מהתוצאות']
  },
  { id: 'q3', question: 'מה הדבר שהכי אהבת בדו"ח?', type: 'textarea' },
  {
    id: 'q4',
    question: 'מה בכוונתך לעשות עם הדו"ח?',
    options: ['לשתף עם מגייס / מעסיק', 'לתכנון קריירה אישי', 'לשתף עם מישהו קרוב', 'עוד לא בטוח/ה']
  },
  {
    id: 'q5',
    question: 'מחיר 99₪ לחבילה המלאה — איך נשמע?',
    options: ['זול — הייתי משלם/ת יותר', 'סביר לגמרי', 'על הגבול', 'יקר מדי', 'זול מדי — מעורר ספק לגבי האיכות']
  },
  { id: 'q6', question: 'משהו שחיסר לך בשאלון או בדו"ח?', type: 'textarea' }
];

const ABANDONMENT_QUESTIONS = [
  {
    id: 'q1',
    question: 'מה הסיבה העיקרית שבחרת שלא לרכוש את הדו"ח עכשיו?',
    options: ['המחיר גבוה מדי', 'אני רוצה לחשוב על זה עוד קצת', 'אני לא בטוח/ה בערך של הדו"ח', 'אין לי זמן כרגע', 'סיבה אחרת']
  },
  {
    id: 'q2',
    question: 'באיזה מחיר היית שוקל/ת לרכוש את הדו"ח המלא?',
    options: ['עד 150 ₪', '150-200 ₪', '200-250 ₪', 'המחיר הנוכחי (299 ₪) הוגן', 'אפילו לא במחיר מוזל']
  },
  {
    id: 'q3',
    question: 'מה היה יכול לשכנע אותך לרכוש את הדו"ח?',
    options: ['הנחה משמעותית', 'דוגמה של דו"ח אמיתי', 'המלצות ממשתמשים אחרים', 'שיחת ייעוץ קצרה לפני הרכישה', 'תוכן נוסף או בונוסים']
  },
  { id: 'q4', question: 'יש לך הערות או הצעות לשיפור?', type: 'textarea' }
];

export default function Survey() {
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const surveyType = urlParams.get('type') || 'abandonment';
  const reportId = urlParams.get('report_id');
  const isFeedback = surveyType === 'feedback';

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState(null);
  const [isLoginRequired, setIsLoginRequired] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [campaignEnded, setCampaignEnded] = useState(false);

  const [responses, setResponses] = useState(
    isFeedback
      ? { q1: '', q2: '', q3: '', q4: '', q5: '', q6: '' }
      : { q1: '', q2: '', q3: '', q4: '' }
  );

  const questions = isFeedback ? FEEDBACK_QUESTIONS : ABANDONMENT_QUESTIONS;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Check if already completed this survey type
        const existingSurveys = await base44.entities.SurveyResponse.filter(
          { created_by: currentUser.email, survey_type: isFeedback ? 'feedback' : 'abandonment' },
          '-created_date', 1
        );
        if (existingSurveys.length > 0) {
          setAlreadyCompleted(true);
          setIsLoading(false);
          return;
        }

        // For feedback: check deadline and quota
        if (isFeedback) {
          const deadline = new Date('2026-03-30T23:59:00');
          if (new Date() > deadline) {
            setCampaignEnded(true);
            setIsLoading(false);
            return;
          }
          const allFeedback = await base44.entities.SurveyResponse.filter({ survey_type: 'feedback' });
          if (allFeedback.length >= 250) {
            setCampaignEnded(true);
          }
        }
      } catch (e) {
        setIsLoginRequired(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    if (isFeedback) {
      if (!responses.q1 || !responses.q2 || !responses.q4 || !responses.q5) {
        alert('אנא ענה על שאלות 1, 2, 4 ו-5 (חובה)');
        return;
      }
      setIsSubmitting(true);
      await base44.entities.SurveyResponse.create({
        survey_type: 'feedback',
        responses: { ...responses, report_id: reportId },
      });
      setCouponCode('MEKORAVIM');
    } else {
      if (!responses.q1 || !responses.q2 || !responses.q3) {
        alert('אנא ענה על כל השאלות (למעט הערות - אופציונלי)');
        return;
      }
      setIsSubmitting(true);
      const newCoupon = `SURVEY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      await base44.entities.Coupon.create({
        code: newCoupon,
        discount_amount: 50,
        valid_until: validUntil.toISOString(),
        user_email: user.email,
        source: 'abandonment_survey'
      });
      await base44.entities.SurveyResponse.create({
        survey_type: 'abandonment',
        responses: responses,
        coupon_code: newCoupon,
      });
      setCouponCode(newCoupon);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      </div>
    );
  }

  if (isLoginRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 py-20 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl border-t-4 border-amber-500">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-amber-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">נדרשת התחברות למערכת</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-600">כדי לענות על הסקר ולקבל את הקופון, יש להתחבר לחשבון.</p>
              <Button size="lg" onClick={() => base44.auth.redirectToLogin(window.location.href)} className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6">
                <LogIn className="w-5 h-5 ml-2" />
                התחבר והמשך לסקר
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (campaignEnded) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl border-t-4 border-gray-400">
            <CardContent className="p-12">
              <div className="text-5xl mb-4">🙏</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">המבצע הסתיים</h2>
              <p className="text-gray-500">הגענו למכסת 250 הממלאים או שהמועד האחרון (30.3.2026) עבר.</p>
              <p className="text-gray-400 mt-2">תודה על ההתעניינות!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 py-20 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl border-t-4 border-green-500">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">כבר מילאת את הסקר ✓</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-600">תודה! כבר מילאת את הסקר. ניתן למלא פעם אחת בלבד.</p>
              {isFeedback && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
                  <p className="text-amber-800 mb-2">קוד הקופון שלך:</p>
                  <p className="text-3xl font-black text-amber-700 tracking-widest">MEKORAVIM</p>
                  <p className="text-amber-600 text-sm mt-2">100% הנחה — השתמש בו בעמוד התשלום</p>
                </div>
              )}
              <Button size="lg" onClick={() => navigate(createPageUrl('MyAccount'))} className="bg-green-600 hover:bg-green-700">
                עבור לאזור האישי
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (couponCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 py-20 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Gift className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-gray-900">תודה רבה! 🙏</h1>
          {isFeedback && <p className="text-gray-600 mb-6 text-lg">המשוב שלך חשוב לנו מאוד. הנה הקופון שלך:</p>}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="bg-amber-50 border-2 border-amber-400 p-8 rounded-xl mb-6">
                <p className="text-sm text-gray-600 mb-2">קוד הקופון שלך</p>
                <p className="text-4xl font-black text-amber-700 tracking-widest">{couponCode}</p>
                {isFeedback
                  ? <p className="text-green-700 font-semibold mt-3">✅ 100% הנחה — החבילה המלאה חינם!</p>
                  : <p className="text-green-700 font-semibold mt-3">✅ 50 ₪ הנחה על הדו"ח המלא!</p>
                }
              </div>
              <p className="text-gray-500 text-sm mb-6">
                {isFeedback ? 'תקף עד 30.3.2026. השתמש בו בעמוד התשלום.' : 'הקוד תקף ל-30 יום. השתמש בו בעמוד התשלום.'}
              </p>
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={() => navigate(createPageUrl('Completion'))}>
                חזור לדף הרכישה ←
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          {isFeedback ? (
            <>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Gift className="w-4 h-4" />
                ממלאים לאחר קבלת הדו"ח בלבד
              </div>
              <h1 className="text-4xl font-bold mb-3 text-gray-900">שאלון משוב — מקורבים</h1>
              <p className="text-lg text-gray-600 mb-2">6 שאלות קצרות ← קוד קופון <strong className="text-amber-700">MEKORAVIM</strong> (100% הנחה)</p>
              <p className="text-sm text-amber-600">תקף עד 30.3.2026 | עד 250 ממלאים</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">סקר קצר - קבל 50 ₪ הנחה!</h1>
              <p className="text-lg text-gray-600">ענה על 4 שאלות קצרות וקבל קוד קופון לדו"ח המלא</p>
            </>
          )}
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8" dir="rtl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((q, index) => (
                <div key={q.id} className="text-right">
                  <Label className="text-lg font-semibold mb-4 block text-right">
                    {index + 1}. {q.question}
                    {(isFeedback && !q.type) && <span className="text-red-500 text-sm mr-1">*</span>}
                  </Label>
                  {q.type === 'textarea' ? (
                    <Textarea
                      value={responses[q.id]}
                      onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                      placeholder="תשובה חופשית (אופציונלי)"
                      className="min-h-[100px] text-right"
                      dir="rtl"
                    />
                  ) : (
                    <RadioGroup
                      value={responses[q.id]}
                      onValueChange={(value) => setResponses({ ...responses, [q.id]: value })}
                      className="space-y-3"
                    >
                      {q.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2 flex-row-reverse justify-end">
                          <Label htmlFor={`${q.id}_${optIndex}`} className="cursor-pointer text-right flex-1">
                            {option}
                          </Label>
                          <RadioGroupItem value={option} id={`${q.id}_${optIndex}`} />
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              ))}

              {isFeedback && <p className="text-xs text-gray-400 text-right">* שדות חובה</p>}

              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className={`w-full text-lg py-6 ${isFeedback ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-green-600 to-blue-600'}`}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 ml-2 animate-spin" />שולח...</>
                  ) : (
                    <><Gift className="w-5 h-5 ml-2" />{isFeedback ? 'שלח וקבל קוד MEKORAVIM!' : 'שלח וקבל קופון!'}</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}