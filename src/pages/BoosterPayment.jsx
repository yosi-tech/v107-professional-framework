import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Rocket, CheckCircle, Lock, CreditCard, Loader2, Shield, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { tranzilaCreateHandshake } from "@/functions/tranzilaCreateHandshake";

export default function BoosterPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subscriptionId = searchParams.get('subscriptionId');
  
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        if (subscriptionId) {
          const sub = await base44.entities.OnlineCoachingSubscription.filter(
            { id: subscriptionId }
          );
          if (sub.length > 0 && sub[0].user_email === currentUser.email) {
            setSubscription(sub[0]);
          } else {
            navigate(createPageUrl('Home'));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadData();
  }, [subscriptionId, navigate]);

  const handlePayment = async () => {
    if (!user || !subscription) return;

    setIsProcessing(true);
    try {
      const response = await tranzilaCreateHandshake({
        sum: 1997,
        currency: 1,
        user_email: user.email,
        user_name: user.full_name,
        product_name: `V107 Booster Extended - ${subscription.recommended_booster_track}`,
        product_type: 'booster_extended',
        express_delivery: false,
        language: subscription.language || 'he',
        metadata: {
          subscription_id: subscription.id,
          track: subscription.recommended_booster_track
        }
      });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert('שגיאה ביצירת תשלום. אנא נסה שוב.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('אירעה שגיאה בתהליך התשלום. אנא נסה שוב.');
      setIsProcessing(false);
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
        <Card className={`border-none shadow-2xl bg-gradient-to-br ${track.color} text-white overflow-hidden relative mb-6`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <CardHeader className="relative z-10 text-center py-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
              {track.icon}
            </div>
            <CardTitle className="text-3xl font-black">
              תשלום מאובטח
            </CardTitle>
            <p className="text-white/90 text-lg">
              {track.name} - תוכנית מורחבת
            </p>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-2xl">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-2xl text-right">סיכום הזמנה</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* פרטי משתמש */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">פרטי לקוח</h3>
                <p className="text-sm text-gray-700">{user.full_name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {/* פרטי מוצר */}
              <div className="border-b pb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">V107 Booster Extended</h3>
                    <p className="text-sm text-gray-600 mt-1">{track.name} - תוכנית מלאה ל-3 חודשים</p>
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li>✓ 12 שבועות ליווי מקצועי</li>
                      <li>✓ 4 שיחות ייעוץ אישיות</li>
                      <li>✓ קבוצת תמיכה ייעודית</li>
                      <li>✓ כלים ותבניות מקצועיות</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-black text-gray-900">1,997 ₪</p>
                    <p className="text-sm text-gray-500 line-through">2,997 ₪</p>
                  </div>
                </div>
              </div>

              {/* סה"כ */}
              <div className="flex items-center justify-between py-4 border-t-2 border-gray-300">
                <span className="text-2xl font-black text-gray-900">סה"כ לתשלום</span>
                <span className="text-3xl font-black text-purple-600">1,997 ₪</span>
              </div>

              {/* כפתור תשלום */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-6 rounded-xl font-black shadow-2xl hover:scale-105 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin ml-2" />
                    מעבר לתשלום מאובטח...
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6 ml-2" />
                    המשך לתשלום מאובטח
                  </>
                )}
              </Button>

              {/* אבטחה */}
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-4">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>תשלום מאובטח</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Tranzila</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                * ערבות החזר כספי מלא תוך 14 יום ללא שאלות
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}