import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, Mail, Calendar } from "lucide-react";

export default function BoosterThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(createPageUrl('MyAccount'));
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4" dir="rtl">
      <Card className="max-w-2xl w-full border-none shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-12">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <CardTitle className="text-4xl font-black">
            🎉 ברוכים הבאים לתוכנית המורחבת!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            התשלום עבר בהצלחה!
          </h2>
          
          <p className="text-lg text-gray-700 mb-8">
            ברכות! הצטרפת לתוכנית V107 Booster Extended ל-3 חודשים
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg text-gray-900 mb-4">מה קורה עכשיו?</h3>
            <div className="space-y-4 text-right">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">תקבל מייל אישור</p>
                  <p className="text-sm text-gray-600">עם כל הפרטים והקישורים החשובים</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">התוכן השבועי יתחיל מחר</p>
                  <p className="text-sm text-gray-600">כל שבוע תקבל תוכן חדש ומשימות</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Rocket className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">הצטרפות לקבוצת ווטסאפ</p>
                  <p className="text-sm text-gray-600">קישור יגיע במייל האישור</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate(createPageUrl('MyAccount'))}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-4 rounded-xl font-bold"
          >
            עבור לאזור האישי
          </Button>

          <p className="text-sm text-gray-500 mt-6">
            מועבר אוטומטית תוך 8 שניות...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}