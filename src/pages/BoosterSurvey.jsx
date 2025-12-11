import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, Send, Loader2 } from "lucide-react";

export default function BoosterSurvey() {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [language, setLanguage] = useState('he');
  const [responses, setResponses] = useState({
    q1: '', // למה לא עזר
    q2: '', // מה היה יכול להיות טוב יותר
    q3: ''  // הערות נוספות
  });

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const subscriptionId = params.get('subscriptionId');

      if (!subscriptionId) {
        alert('Missing subscription ID');
        window.location.href = createPageUrl('Home');
        return;
      }

      const subscriptions = await base44.entities.OnlineCoachingSubscription.filter({ id: subscriptionId });
      if (subscriptions.length === 0) {
        alert('Subscription not found');
        window.location.href = createPageUrl('Home');
        return;
      }

      const sub = subscriptions[0];
      setSubscription(sub);
      setLanguage(sub.language || 'he');
    } catch (error) {
      console.error('Error loading subscription:', error);
      alert('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!responses.q1) {
      alert(language === 'he' 
        ? 'נא לענות על השאלה הראשונה לפחות'
        : 'Please answer at least the first question');
      return;
    }

    setIsSubmitting(true);
    try {
      await base44.entities.SurveyResponse.create({
        survey_type: 'booster_feedback',
        responses: responses
      });

      // עדכן את המנוי לסטטוס completed
      await base44.entities.OnlineCoachingSubscription.update(subscription.id, {
        status: 'completed'
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert(language === 'he' 
        ? 'שגיאה בשליחת הסקר'
        : 'Error submitting survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const isHebrew = language === 'he';

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4" dir={isHebrew ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-2xl border-none">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">
                {isHebrew ? 'תודה רבה!' : 'Thank you!'}
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {isHebrew 
                  ? 'תודה שהקדשת מזמנך לענות על הסקר. המשוב שלך חשוב לנו מאוד ויעזור לנו להשתפר.'
                  : 'Thank you for taking the time to answer the survey. Your feedback is very important to us and will help us improve.'}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {isHebrew 
                  ? 'אנחנו מאחלים לך המון הצלחה במסע היזמי שלך! 🚀'
                  : 'We wish you great success on your entrepreneurial journey! 🚀'}
              </p>
              <Button 
                onClick={() => window.location.href = createPageUrl('Home')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 text-lg font-bold"
              >
                {isHebrew ? 'חזור לדף הבית' : 'Back to Home'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12 px-4" dir={isHebrew ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl border-none">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-purple-700 text-white text-center py-8">
            <CardTitle className="text-3xl font-black">
              {isHebrew ? '📋 סקר משוב - תוכנית הבוסטר' : '📋 Feedback Survey - Booster Program'}
            </CardTitle>
            <p className="text-white/90 mt-2">
              {isHebrew 
                ? 'המשוב שלך חשוב לנו ויעזור לנו להשתפר'
                : 'Your feedback is important to us and will help us improve'}
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <Label className="text-lg font-bold text-gray-900 mb-4 block text-right">
                  {isHebrew 
                    ? '1. למה לדעתך תוכנית הבוסטר לא עזרה לך?'
                    : "1. Why do you think the Booster program didn't help you?"}
                </Label>
                <RadioGroup
                  value={responses.q1}
                  onValueChange={(value) => setResponses({...responses, q1: value})}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Label htmlFor="r1" className="cursor-pointer">
                      {isHebrew ? 'התוכן לא היה רלוונטי לצרכים שלי' : "Content wasn't relevant to my needs"}
                    </Label>
                    <RadioGroupItem value={isHebrew ? 'התוכן לא היה רלוונטי לצרכים שלי' : "Content wasn't relevant to my needs"} id="r1" />
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Label htmlFor="r2" className="cursor-pointer">
                      {isHebrew ? 'לא הספקתי ליישם את המידע' : "Did not have time to implement the information"}
                    </Label>
                    <RadioGroupItem value={isHebrew ? 'לא הספקתי ליישם את המידע' : "Didn't have time to implement the information"} id="r2" />
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Label htmlFor="r3" className="cursor-pointer">
                      {isHebrew ? 'התוכן היה כללי מדי' : 'Content was too general'}
                    </Label>
                    <RadioGroupItem value={isHebrew ? 'התוכן היה כללי מדי' : 'Content was too general'} id="r3" />
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Label htmlFor="r4" className="cursor-pointer">
                      {isHebrew ? 'ציפיתי לליווי אישי יותר' : 'Expected more personal guidance'}
                    </Label>
                    <RadioGroupItem value={isHebrew ? 'ציפיתי לליווי אישי יותר' : 'Expected more personal guidance'} id="r4" />
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Label htmlFor="r5" className="cursor-pointer">
                      {isHebrew ? 'סיבה אחרת' : 'Other reason'}
                    </Label>
                    <RadioGroupItem value={isHebrew ? 'סיבה אחרת' : 'Other reason'} id="r5" />
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-lg font-bold text-gray-900 mb-4 block text-right">
                  {isHebrew 
                    ? '2. מה היה יכול להיות טוב יותר?'
                    : '2. What could have been better?'}
                </Label>
                <Textarea
                  value={responses.q2}
                  onChange={(e) => setResponses({...responses, q2: e.target.value})}
                  placeholder={isHebrew 
                    ? 'שתף אותנו במחשבות שלך...'
                    : 'Share your thoughts...'}
                  className="min-h-[120px] text-right"
                  dir={isHebrew ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <Label className="text-lg font-bold text-gray-900 mb-4 block text-right">
                  {isHebrew 
                    ? '3. הערות נוספות (אופציונלי)'
                    : '3. Additional comments (optional)'}
                </Label>
                <Textarea
                  value={responses.q3}
                  onChange={(e) => setResponses({...responses, q3: e.target.value})}
                  placeholder={isHebrew 
                    ? 'יש לך משהו נוסף לשתף?'
                    : 'Anything else to share?'}
                  className="min-h-[100px] text-right"
                  dir={isHebrew ? 'rtl' : 'ltr'}
                />
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 text-xl font-black rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 ml-3 animate-spin" />
                    {isHebrew ? 'שולח...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 ml-3" />
                    {isHebrew ? 'שלח סקר' : 'Submit Survey'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}