import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowLeft, Mail, Calendar, FileText, Download, Loader2, Clock, Star, Zap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getConsultationRequestEmailTemplate } from "@/components/email/ConsultationRequestTemplate";
import { useTranslation } from "@/components/i18n/useTranslation";

export default function ThankYou() {
  const { t, language } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestingConsultation, setIsRequestingConsultation] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        console.error("User not logged in");
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const handleDownloadAnswers = async () => {
      alert(language === 'he' ? "פונקציונליות הורדת PDF בפיתוח. בעתיד, כאן תתבצע ההורדה." : "PDF download functionality under development. In the future, download will occur here.");
  }

  const handleRequestConsultation = async () => {
    if (!user || isRequestingConsultation) return;
    
    setIsRequestingConsultation(true);
    try {
      // נניח שיש לנו report_id שמור על המשתמש או שנוכל לשלוף אותו
      const reportId = user.report_id || "V107-PENDING";
      
      const emailTemplate = getConsultationRequestEmailTemplate(
        user.full_name || user.email,
        reportId,
        language
      );

      await base44.integrations.Core.SendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        body: emailTemplate.html
      });

      alert(language === 'he' 
        ? "בקשתך לשיחת ייעוץ נשלחה בהצלחה! נחזור אליך בקרוב." 
        : "Your consultation request has been sent successfully! We'll get back to you soon.");
    } catch (error) {
      console.error("Failed to send consultation request:", error);
      alert(language === 'he' 
        ? "אירעה שגיאה בשליחת הבקשה. אנא נסה שוב." 
        : "An error occurred while sending the request. Please try again.");
    } finally {
      setIsRequestingConsultation(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const purchasedFullReport = user?.has_purchased_full_report;
  const purchasedAnswersDownload = user?.has_purchased_answers_download;
  const hasExpressDelivery = user?.express_delivery;

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          {language === 'he' ? 'תודה רבה!' : 'Thank You!'}
        </h1>

        {purchasedFullReport && (
          <>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {language === 'he'
                ? `התשלום עבור דו"ח Aventura-107 התקבל. נתחיל בעיבוד ונשלח את הדו"ח עד ${hasExpressDelivery ? '3' : '7'} ימי עבודה${hasExpressDelivery ? ' (אספקה מואצת)' : ''}.`
                : `Payment for the Aventura-107 report has been received. We'll begin processing and send the report within ${hasExpressDelivery ? '3' : '7'} business days${hasExpressDelivery ? ' (express delivery)' : ''}.`
              }
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">
                    {language === 'he' ? 'ניתוח מקצועי' : 'Professional Analysis'}
                  </h3>
                  <p className={language === 'he' ? 'text-right' : 'text-left'}>
                    {language === 'he' 
                      ? 'צוות המומחים שלנו ינתח את תשובותיך.' 
                      : 'Our expert team will analyze your responses.'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  {hasExpressDelivery ? (
                    <Zap className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  ) : (
                    <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  )}
                  <h3 className="text-xl font-bold mb-3">
                    {hasExpressDelivery 
                      ? (language === 'he' ? '3 ימי עבודה' : '3 Business Days')
                      : (language === 'he' ? '7 ימי עבודה' : '7 Business Days')
                    }
                  </h3>
                  <p className={language === 'he' ? 'text-right' : 'text-left'}>
                    {language === 'he'
                      ? `הדו״ח המפורט והאישי שלך בדרך אליך${hasExpressDelivery ? ' במהירות!' : ''}.`
                      : `Your detailed personal report is on its way${hasExpressDelivery ? ' express!' : ''}.`
                    }
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">
                    {language === 'he' ? 'קבלת הדו"ח' : 'Report Delivery'}
                  </h3>
                  <p className={language === 'he' ? 'text-right' : 'text-left'}>
                    {language === 'he'
                      ? 'הדו"ח יישלח לאימייל שאיתו נרשמת. קיבלת מייל אישור.'
                      : 'The report will be sent to your registered email. You received a confirmation email.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* כפתור לבקשת שיחת ייעוץ */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 max-w-2xl mx-auto border border-blue-200">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'he' ? 'רוצה שיחת ייעוץ אישית?' : 'Want a Personal Consultation?'}
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                {language === 'he'
                  ? 'קבע/י שיחת ייעוץ ללא עלות (20-25 דקות) כדי להפוך את תובנות הדו"ח שלך לתוכנית פעולה ברורה.'
                  : 'Schedule a free consultation call (20-25 minutes) to turn your report insights into a clear action plan.'
                }
              </p>
              <Button 
                size="lg" 
                onClick={handleRequestConsultation}
                disabled={isRequestingConsultation}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRequestingConsultation ? (
                  <>
                    <Loader2 className={`w-5 h-5 animate-spin ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                    {language === 'he' ? 'שולח בקשה...' : 'Sending Request...'}
                  </>
                ) : (
                  <>
                    <Phone className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                    {language === 'he' ? 'בקש שיחת ייעוץ' : 'Request Consultation'}
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {purchasedAnswersDownload && !purchasedFullReport && (
             <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'he' ? 'התשובות שלך מוכנות להורדה' : 'Your Answers Are Ready for Download'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {language === 'he'
                    ? 'לחץ על הכפתור כדי להוריד קובץ PDF עם כל השאלות והתשובות שמילאת.'
                    : 'Click the button to download a PDF with all the questions and answers you filled out.'
                  }
                </p>
                <Button size="lg" onClick={handleDownloadAnswers} className="mb-6">
                    <Download className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                    {language === 'he' ? 'הורד את התשובות שלי (PDF)' : 'Download My Answers (PDF)'}
                </Button>
                
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'he'
                      ? 'רוצה דו"ח מלא בהמשך? נעניק קיזוז מלא של 59 ₪ במחיר הדו"ח.'
                      : 'Want a full report later? We\'ll give you a full $15 credit on the report price.'
                    }
                  </p>
                  <Link to={createPageUrl(`Payment?product=full_report&price=240&discount=59`)}>
                    <Button variant="outline" size="lg">
                      <Star className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                      {language === 'he' ? 'שדרג לדו"ח מלא (240₪ אחרי קיזוז)' : 'Upgrade to Full Report ($64 after credit)'}
                    </Button>
                  </Link>
                </div>
            </div>
        )}

        <div className="text-center">
          <Link to={createPageUrl("Home")}>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <ArrowLeft className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
              {language === 'he' ? 'חזור לעמוד הבית' : 'Back to Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}