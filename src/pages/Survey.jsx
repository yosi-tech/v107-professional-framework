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

export default function Survey() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState(null);
  const [isLoginRequired, setIsLoginRequired] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  
  const [responses, setResponses] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: ''
  });

  const questions = [
    {
      id: 'q1',
      question: 'מה הסיבה העיקרית שבחרת שלא לרכוש את הדו"ח עכשיו?',
      options: [
        'המחיר גבוה מדי',
        'אני רוצה לחשוב על זה עוד קצת',
        'אני לא בטוח/ה בערך של הדו"ח',
        'אין לי זמן כרגע',
        'סיבה אחרת'
      ]
    },
    {
      id: 'q2',
      question: 'באיזה מחיר היית שוקל/ת לרכוש את הדו"ח המלא?',
      options: [
        'עד 150 ₪',
        '150-200 ₪',
        '200-250 ₪',
        'המחיר הנוכחי (299 ₪) הוגן',
        'אפילו לא במחיר מוזל'
      ]
    },
    {
      id: 'q3',
      question: 'מה היה יכול לשכנע אותך לרכוש את הדו"ח?',
      options: [
        'הנחה משמעותית',
        'דוגמה של דו"ח אמיתי',
        'המלצות ממשתמשים אחרים',
        'שיחת ייעוץ קצרה לפני הרכישה',
        'תוכן נוסף או בונוסים'
      ]
    },
    {
      id: 'q4',
      question: 'יש לך הערות או הצעות לשיפור?',
      type: 'textarea'
    }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsLoginRequired(false);
        
        // בדוק אם המשתמש כבר מילא סקר
        try {
          const existingSurveys = await base44.entities.SurveyResponse.filter(
            { created_by: currentUser.email },
            '-created_date',
            1
          );
          
          if (existingSurveys.length > 0) {
            setAlreadyCompleted(true);
          }
        } catch (e) {
          console.log('No previous surveys found');
        }
      } catch (e) {
        console.error("User not logged in");
        setIsLoginRequired(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    // בדוק שכל השאלות נענו
    if (!responses.q1 || !responses.q2 || !responses.q3) {
      alert('אנא ענה על כל השאלות (למעט הערות - אופציונלי)');
      return;
    }

    setIsSubmitting(true);

    try {
      // יצירת קוד קופון ייחודי
      const couponCode = `SURVEY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      // תאריך תוקף - 30 יום מהיום
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      // שמירת קופון
      await base44.entities.Coupon.create({
        code: couponCode,
        discount_amount: 50,
        valid_until: validUntil.toISOString(),
        user_email: user.email,
        source: 'abandonment_survey'
      });

      // שמירת תשובות הסקר
      await base44.entities.SurveyResponse.create({
        survey_type: 'abandonment',
        responses: responses,
        coupon_code: couponCode,
        user_email: user.email, // Added user email to survey response
      });

      setCouponCode(couponCode);

    } catch (error) {
      console.error("Failed to process survey:", error);
      alert('אירעה שגיאה. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isLoginRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl border-t-4 border-blue-600">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-200">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                נדרשת התחברות למערכת
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-600">
                כדי לענות על הסקר ולקבל קוד קופון, יש להתחבר לחשבון.
              </p>
              
              <Button
                size="lg"
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
              >
                <LogIn className="w-5 h-5 ml-2" />
                התחבר והמשך לסקר
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                ההתחברות מאובטחת. אנחנו מכבדים את הפרטיות שלך.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-20 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl border-t-4 border-blue-600">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-200">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                כבר מילאת את הסקר
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-600">
                תודה! כבר מילאת את הסקר וקיבלת קוד קופון. ניתן למלא את הסקר פעם אחת בלבד.
              </p>
              <p className="text-sm text-gray-500">
                את הקופון שלך ניתן למצוא באזור האישי תחת "הקופונים שלי"
              </p>
              <Button
                size="lg"
                onClick={() => navigate(createPageUrl('MyAccount'))}
                className="bg-blue-600 hover:bg-blue-700"
              >
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20 px-4" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Gift className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            תודה רבה!
          </h1>
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardTitle className="text-2xl">
                קוד הקופון שלך
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-gray-100 p-6 rounded-xl mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  קוד קופון:
                </p>
                <p className="text-3xl font-bold text-gray-900 tracking-wider">
                  {couponCode}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <p className="text-green-800 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  50 ₪ הנחה על הדו"ח המלא!
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                הקוד תקף ל-30 יום. השתמש בו בעמוד התשלום.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600"
                onClick={() => navigate(createPageUrl('Completion'))}
              >
                חזור לדף הרכישה
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            סקר קצר - קבל 50 ₪ הנחה!
          </h1>
          <p className="text-lg text-gray-600">
            ענה על 4 שאלות קצרות וקבל קוד קופון לדו"ח המלא
          </p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8" dir="rtl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((q, index) => (
                <div key={q.id} dir="rtl" className="text-right">
                  <Label className="text-lg font-semibold mb-4 block text-right" dir="rtl">
                    {index + 1}. {q.question}
                  </Label>
                  {q.type === 'textarea' ? (
                    <Textarea
                      value={responses[q.id]}
                      onChange={(e) => setResponses({...responses, [q.id]: e.target.value})}
                      placeholder="הערות (אופציונלי)"
                      className="min-h-[100px] text-right"
                      dir="rtl"
                    />
                  ) : (
                    <RadioGroup
                      value={responses[q.id]}
                      onValueChange={(value) => setResponses({...responses, [q.id]: value})}
                      className="space-y-3"
                      dir="rtl"
                    >
                      {q.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2 flex-row-reverse justify-end" dir="rtl">
                          <Label htmlFor={`${q.id}_${optIndex}`} className="cursor-pointer text-right flex-1" dir="rtl">
                            {option}
                          </Label>
                          <RadioGroupItem value={option} id={`${q.id}_${optIndex}`} />
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-lg py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 ml-2" />
                      שלח וקבל קופון!
                    </>
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