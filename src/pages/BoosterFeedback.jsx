import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

export default function BoosterFeedback() {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('he');

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

  const handleYes = () => {
    window.location.href = createPageUrl('Payment?product=booster_upgrade&subscriptionId=' + subscription.id);
  };

  const handleNo = () => {
    window.location.href = createPageUrl('BoosterSurvey?subscriptionId=' + subscription.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const isHebrew = language === 'he';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20 px-4" dir={isHebrew ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl border-none">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-12">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
              <Rocket className="w-10 h-10" />
            </div>
            <CardTitle className="text-4xl font-black mb-2">
              {isHebrew ? '🎉 סיימת את תוכנית הבוסטר!' : '🎉 You completed the Booster program!'}
            </CardTitle>
            <p className="text-white/90 text-xl">
              {isHebrew 
                ? 'עברת שבוע מלא של צמיחה והתפתחות מקצועית'
                : 'You completed a full week of growth and professional development'}
            </p>
          </CardHeader>
          
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {isHebrew 
                ? 'האם אתה מרגיש שחל שיפור?'
                : 'Do you feel there has been improvement?'}
            </h2>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {isHebrew 
                ? 'נשמח לשמוע על החוויה שלך! האם ההדרכה והתוכן שקיבלת עזרו לך להתקדם ולהשתפר?'
                : 'We'd love to hear about your experience! Did the guidance and content you received help you progress and improve?'}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Button 
                onClick={handleYes}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-8 px-8 text-2xl font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <ThumbsUp className="w-8 h-8 ml-3" />
                {isHebrew ? 'כן! חל שיפור' : 'Yes! I improved'}
              </Button>

              <Button 
                onClick={handleNo}
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 py-8 px-8 text-2xl font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <ThumbsDown className="w-8 h-8 ml-3" />
                {isHebrew ? 'לא ממש' : 'Not really'}
              </Button>
            </div>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {isHebrew 
                    ? '💡 רוצה להמשיך להתפתח?'
                    : '💡 Want to continue developing?'}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {isHebrew 
                    ? 'אם חווית שיפור ורוצה להמשיך לצמוח, נשמח להמשיך ללוות אותך במסע היזמי שלך! הצטרף למסלול המתקדם שלנו בהשקעה סמלית של 199 ₪ בלבד.'
                    : 'If you experienced improvement and want to continue growing, we'd love to continue guiding you on your entrepreneurial journey! Join our advanced track for a symbolic investment of only 199 ₪.'}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}