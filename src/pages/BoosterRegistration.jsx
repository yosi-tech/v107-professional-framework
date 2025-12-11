import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, CheckCircle, Loader2, Mail, User } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/components/i18n/useTranslation";

export default function BoosterRegistration() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const track = searchParams.get('track') || 'execution';
  const language = searchParams.get('lang') || 'he';
  
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  const trackInfo = {
    execution: {
      name_he: 'מסלול ביצוע',
      name_en: 'Execution Track',
      icon: '⚡',
      color: 'from-blue-600 to-blue-800'
    },
    digital: {
      name_he: 'מסלול דיגיטל',
      name_en: 'Digital Track',
      icon: '💻',
      color: 'from-purple-600 to-purple-800'
    },
    finance: {
      name_he: 'מסלול פיננסים',
      name_en: 'Finance Track',
      icon: '💰',
      color: 'from-green-600 to-green-800'
    },
    marketing: {
      name_he: 'מסלול שיווק',
      name_en: 'Marketing Track',
      icon: '📢',
      color: 'from-orange-600 to-orange-800'
    },
    management: {
      name_he: 'מסלול ניהול',
      name_en: 'Management Track',
      icon: '👥',
      color: 'from-indigo-600 to-indigo-800'
    },
    vision: {
      name_he: 'מסלול חזון',
      name_en: 'Vision Track',
      icon: '🎯',
      color: 'from-pink-600 to-pink-800'
    }
  };

  const currentTrack = trackInfo[track] || trackInfo.execution;
  const isHebrew = language === 'he';

  const handleSubscribe = async () => {
    if (!user) {
      setError(isHebrew ? 'יש להתחבר למערכת' : 'Please login first');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const { data } = await base44.functions.invoke('subscribeToBooster', {
        recommended_booster_track: track,
        language: language
      });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(data.message || (isHebrew ? 'אירעה שגיאה בהרשמה' : 'Registration error'));
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(isHebrew ? 'אירעה שגיאה בהרשמה. אנא נסה שוב.' : 'An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4" dir={isHebrew ? 'rtl' : 'ltr'}>
        <Card className="max-w-2xl w-full border-none shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              {isHebrew ? '🎉 ההרשמה הושלמה בהצלחה!' : '🎉 Registration Completed Successfully!'}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {isHebrew 
                ? 'תוך מספר דקות תקבל מייל ראשון עם ההנחיות לתחילת המסלול.'
                : 'Within a few minutes, you will receive the first email with instructions to start the track.'}
            </p>
            <p className="text-sm text-gray-500">
              {isHebrew ? 'מועבר לדף הבית...' : 'Redirecting to homepage...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4" dir={isHebrew ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <Card className={`border-none shadow-2xl bg-gradient-to-br ${currentTrack.color} text-white overflow-hidden relative mb-8`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                {currentTrack.icon}
              </div>
              <div>
                <CardTitle className="text-3xl font-black">
                  {isHebrew ? 'הרשמה למסלול הבוסטר' : 'Booster Track Registration'}
                </CardTitle>
                <p className="text-white/90 text-lg mt-1">
                  {isHebrew ? currentTrack.name_he : currentTrack.name_en}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {isHebrew ? '📋 מה כולל המסלול?' : '📋 What does the track include?'}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    {isHebrew 
                      ? '7 ימי ליווי אינטנסיבי עם תוכן יומי ממוקד'
                      : '7 days of intensive coaching with daily focused content'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    {isHebrew 
                      ? 'תרגילים מעשיים ליישום מיידי'
                      : 'Practical exercises for immediate implementation'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    {isHebrew 
                      ? 'כלים ומשאבים להמשך הדרך'
                      : 'Tools and resources for continued progress'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    {isHebrew 
                      ? 'תמיכה ומעקב לאורך כל המסלול'
                      : 'Support and tracking throughout the entire track'}
                  </span>
                </li>
              </ul>
            </div>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg mb-6">
                <p className="text-center">
                  {isHebrew 
                    ? 'יש להתחבר למערכת על מנת להירשם למסלול'
                    : 'Please login to register for the track'}
                </p>
              </div>
            )}

            {user && (
              <div className="bg-blue-50 border border-blue-200 px-6 py-4 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">{user.full_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubscribe}
              disabled={isSubmitting || !user}
              className={`w-full bg-gradient-to-r ${currentTrack.color} text-white text-xl py-6 rounded-xl font-black shadow-xl hover:shadow-2xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin ml-2" />
                  {isHebrew ? 'מבצע הרשמה...' : 'Registering...'}
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6 ml-2" />
                  {isHebrew ? 'הרשם למסלול הבוסטר - חינם!' : 'Register for Booster Track - Free!'}
                </>
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center mt-4">
              {isHebrew 
                ? '* המסלול הראשוני ל-7 ימים ניתן ללא עלות. בסוף המסלול תוכל לבחור להמשיך בתשלום.'
                : '* The initial 7-day track is provided at no cost. At the end, you can choose to continue with payment.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}