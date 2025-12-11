import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { tranzilaCreateHandshake } from "@/functions/tranzilaCreateHandshake";
import { getFullReportPurchaseEmailTemplate } from '@/components/email/FullReportPurchaseTemplate';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ShieldCheck, CheckCircle, Loader2, FileText, Star, Clock, Zap, X } from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";

const ReportInfoModal = ({ isOpen, onClose }) => {
  const { language } = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-xl lg:max-w-2xl" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            {language === 'he' ? 'אודות הדו"ח המלא' : 'About the Full Report'}
          </DialogTitle>
          <DialogDescription className="text-gray-700 text-base leading-relaxed">
            {language === 'he' ? (
              <>
                <p className="mb-4">תהליך יצירת הדו"ח המלא כולל מספר שלבים מקצועיים ומעמיקים.</p>

                <h3 className="text-lg font-semibold mb-2">שלב 1: ניתוח קפדני של תשובותיך</h3>
                <p className="mb-4">
                  אנחנו בוחנים את כל התשובות לשאלון Ventura-107 באמצעות אלגוריתמים מתקדמים ומומחים בתחום.
                  שלב זה מסייע לנו לזהות את הפרופיל היזמי שלך, החוזקות שלך, התחומים בהם יש מקום לשיפור, ואת פוטנציאל ההצלחה שלך.
                </p>

                <h3 className="text-lg font-semibold mb-2">שלב 2: בניית דו"ח מותאם אישית</h3>
                <p className="mb-2">בהתבסס על הניתוח, אנו מרכיבים דו"ח מקיף הכולל:</p>
                <ul className="list-disc pr-5 mb-4 space-y-1">
                  <li>פרופיל יזמי מפורט</li>
                  <li>אזורי חוזקה ונקודות לשיפור</li>
                  <li>המלצות מעשיות לפיתוח וקידום</li>
                  <li>הערכה איכותנית וכמותית של הפוטנציאל היזמי שלך</li>
                  <li>גרפים ותצוגות חזותיות להמחשה ברורה</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2">שלב 3: איכות ובקרת אמינות</h3>
                <p className="mb-4">
                  כל דו"ח עובר בדיקה כפולה על ידי שני מומחים שונים על מנת להבטיח את הדיוק, המהימנות והאיכות הגבוהה ביותר.
                  אנו מתחייבים לספק לך כלי עזר משמעותי לקבלת החלטות מושכלות בדרכך היזמית.
                </p>

                <p className="font-medium">
                  אנו מאמינים כי השקעה בניתוח מעמיק תעניק לך יתרון משמעותי ותסייע לך לממש את מלוא הפוטנציאל היזמי שלך.
                </p>
              </>
            ) : (
              <>
                <p className="mb-4">The full report creation process includes several professional and in-depth stages.</p>

                <h3 className="text-lg font-semibold mb-2">Stage 1: Thorough Analysis of Your Responses</h3>
                <p className="mb-4">
                  We examine all responses to the Ventura-107 questionnaire using advanced algorithms and industry experts.
                  This stage helps us identify your entrepreneurial profile, strengths, areas for improvement, and success potential.
                </p>

                <h3 className="text-lg font-semibold mb-2">Stage 2: Building a Personalized Report</h3>
                <p className="mb-2">Based on the analysis, we compile a comprehensive report including:</p>
                <ul className="list-disc pl-5 mb-4 space-y-1">
                  <li>Detailed entrepreneurial profile</li>
                  <li>Strength areas and improvement points</li>
                  <li>Practical recommendations for development and advancement</li>
                  <li>Qualitative and quantitative assessment of your entrepreneurial potential</li>
                  <li>Charts and visual displays for clear illustration</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2">Stage 3: Quality and Reliability Control</h3>
                <p className="mb-4">
                  Each report undergoes double-checking by two different experts to ensure the highest accuracy, reliability, and quality.
                  We are committed to providing you with a meaningful tool for making informed decisions on your entrepreneurial journey.
                </p>

                <p className="font-medium">
                  We believe that investing in in-depth analysis will give you a significant advantage and help you realize your full entrepreneurial potential.
                </p>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <button
            className={`absolute ${language === 'he' ? 'left-4' : 'right-4'} top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground`}
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useTranslation();

  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(0);
  const [isExpress, setIsExpress] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false); // State for terms acceptance
  const [isReportInfoOpen, setIsReportInfoOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [handshakeData, setHandshakeData] = useState(null);
  const [isLoadingHandshake, setIsLoadingHandshake] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setProduct(params.get('product'));
    setPrice(Number(params.get('price')) || 0);
    setIsExpress(params.get('express') === 'true');
    setResponseId(params.get('responseId'));

    checkUserStatus();
  }, [location.search]);

  const checkUserStatus = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.log('User not logged in');
    }
  };

  const initializePayment = async () => {
    if (!termsAccepted) {
      alert(language === 'he' ? 'יש לאשר את תנאי השימוש' : 'Please accept the terms of service');
      return;
    }

    setIsLoadingHandshake(true);
    try {
      const { data } = await tranzilaCreateHandshake({ sum: price });
      setHandshakeData(data);
      
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 100);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
      alert(language === 'he' ? 'שגיאה ביצירת תשלום. נסה שוב.' : 'Error initializing payment. Try again.');
    }
    setIsLoadingHandshake(false);
  };

  const sendConfirmationEmail = async (userEmail, userName, productType, isExpress) => {
    try {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      const date = new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      if (productType === 'full_report') {
        // בדיקה אם המשתמש כבר השלים את השאלון
        let hasCompletedQuestionnaire = false;
        if (userEmail) { 
          const responses = await base44.entities.QuestionnaireResponse.filter({ created_by: userEmail }, '-created_date', 1);
          hasCompletedQuestionnaire = responses.length > 0 && responses[0].status === 'completed';
        }
        
        const questionnaireUrl = `${window.location.origin}${createPageUrl("Questionnaire")}`;
        
        const emailTemplate = getFullReportPurchaseEmailTemplate(
          userName,
          transactionId,
          date,
          hasCompletedQuestionnaire,
          questionnaireUrl,
          isExpress,
          language
        );

        await base44.integrations.Core.SendEmail({
          to: userEmail,
          subject: emailTemplate.subject,
          body: emailTemplate.html
        });
      } else if (productType === 'answers_download') {
        // כאן נשלח מייל פשוט יותר לרכישת התשובות (59 ש"ח)
        // נעדכן את זה בהמשך עם הטמפלייט המתאים
        const subject = language === 'he' ? 'אישור רכישה - תשובות השאלון' : 'Purchase Confirmation - Questionnaire Answers';
        const body = language === 'he'
          ? `שלום ${userName},<br><br>תודה על רכישת תשובות השאלון. מזהה עסקה: ${transactionId}.<br><br>בברכה,<br>צוות AVENTURA 107`
          : `Dear ${userName},<br><br>Thank you for purchasing the questionnaire answers. Transaction ID: ${transactionId}.<br><br>Best regards,<br>AVENTURA 107 Team`;
        
        await base44.integrations.Core.SendEmail({
          to: userEmail,
          subject: subject,
          body: body
        });
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data && event.data.iframe_message === 'success') {
        setIsProcessing(false);
        setPaymentSuccess(true);

        try {
          if (!user) {
            await base44.auth.redirectToLogin(window.location.href);
            return;
          }
          
          const userDataUpdate = {
            purchase_date: new Date().toISOString(),
            payment_amount: price,
          };

          if (product === 'full_report') {
            userDataUpdate.has_purchased_full_report = true;
            userDataUpdate.express_delivery = isExpress;
          } else if (product === 'answers_download') {
            userDataUpdate.has_purchased_answers_download = true;
          }

          await base44.auth.updateMe(userDataUpdate);
          
          if (responseId && product === 'full_report') {
            await base44.entities.GeneratedReport.update(responseId, { purchased: true });
          }
          
          await sendConfirmationEmail(user.email, user.full_name || '', product, isExpress);

          setTimeout(() => {
            navigate(createPageUrl("ThankYou"));
          }, 2000);

        } catch (error) {
          console.error('Post-payment error:', error);
        }
      } else if (event.data && event.data.iframe_message === 'error') {
        setIsProcessing(false);
        alert(language === 'he' ? 'התשלום נכשל. נסה שוב.' : 'Payment failed. Try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, price, product, isExpress, responseId, navigate, language]);

  if (!product) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold">{language === 'he' ? 'לא נבחר מוצר.' : 'No product selected.'}</h1>
            <Link to={createPageUrl("Home")} className="text-blue-600">{language === 'he' ? 'חזור לדף הבית' : 'Back to Home'}</Link>
        </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{language === 'he' ? 'התשלום בוצע בהצלחה!' : 'Payment Successful!'}</h1>
          <p className="text-lg text-gray-600 mb-4">
            {language === 'he' ? 'תודה על הרכישה. אתה מועבר לעמוד אישור והמשך.' : 'Thank you for your purchase. Redirecting...'}
          </p>
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  const productDetails = {
      full_report: {
          title: language === 'he' ? "דו״ח ונטורה-107 המלא" : "Full Ventura-107 Report",
          icon: Star,
          deliveryText: isExpress ? (language === 'he' ? "3 ימי עבודה" : "3 business days") : (language === 'he' ? "7 ימי עבודה" : "7 business days")
      },
      answers_download: {
          title: language === 'he' ? "הורדת תשובות השאלון" : "Download Questionnaire Answers",
          icon: FileText,
          deliveryText: language === 'he' ? "הורדה מיידית" : "Immediate download"
      }
  }
  const CurrentProductIcon = productDetails[product]?.icon || Star;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">{language === 'he' ? 'תשלום מאובטח' : 'Secure Payment'}</h1>
          <p className="mt-2 text-lg text-gray-600">{language === 'he' ? 'צעד אחד לפני קבלת התוצרים שלך' : 'One step before receiving your products'}</p>
        </div>

        {!user && (
          <Alert className="mb-8 bg-yellow-50 border-yellow-200 text-yellow-800">
            <ShieldCheck className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="font-bold">{language === 'he' ? 'נדרשת התחברות' : 'Login Required'}</AlertTitle>
            <AlertDescription>
              {language === 'he' ? 'כדי להשלים את הרכישה, תתבקש להתחבר לחשבון Google שלך.' : 'To complete the purchase, you will be asked to sign in with your Google account.'}
            </AlertDescription>
          </Alert>
        )}
        


        <div className="grid md:grid-cols-2 gap-12">
          {/* Payment Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">{language === 'he' ? 'תשלום מאובטח' : 'Secure Payment'}</CardTitle>
            </CardHeader>
            <CardContent>
              {!handshakeData ? (
                <div className="space-y-6">
                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => setIsReportInfoOpen(true)}
                      className="text-blue-600 hover:text-blue-800 underline text-sm mb-6"
                    >
                      {language === 'he' ? '📋 רוצה לדעת יותר על התהליך המקצועי?' : '📋 Want to know more about the professional process?'}
                    </button>
                  </div>

                  <div className="flex items-start space-x-2 space-x-reverse">
                    <Checkbox 
                      id="terms" 
                      checked={termsAccepted}
                      onCheckedChange={setTermsAccepted} 
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {language === 'he' ? (
                          <>קראתי ואני מאשר/ת את <Link to={createPageUrl("TermsOfService")} target="_blank" className="underline text-blue-600 hover:text-blue-800">תנאי השימוש</Link></>
                        ) : (
                          <>I have read and agree to the <Link to={createPageUrl("TermsOfService")} target="_blank" className="underline text-blue-600 hover:text-blue-800">Terms of Service</Link></>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={initializePayment}
                    size="lg" 
                    disabled={isLoadingHandshake || !termsAccepted}
                    className="w-full bg-gradient-to-l from-blue-600 to-purple-600 text-lg py-7 mt-6"
                  >
                    {isLoadingHandshake ? (
                      <>
                        <Loader2 className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'} animate-spin`} />
                        {language === 'he' ? 'מכין תשלום...' : 'Preparing payment...'}
                      </>
                    ) : (
                      <>
                        {language === 'he' ? `המשך לתשלום ${price}₪` : `Continue to Payment ${price}₪`}
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <form
                    ref={formRef}
                    action={`https://direct.tranzila.com/${handshakeData.supplier}/iframenew.php`}
                    target="tranzila-frame"
                    method="POST"
                    style={{ display: 'none' }}
                  >
                    <input type="hidden" name="sum" value={handshakeData.sum} />
                    <input type="hidden" name="currency" value="1" />
                    <input type="hidden" name="cred_type" value="1" />
                    <input type="hidden" name="tranmode" value="A" />
                    <input type="hidden" name="new_process" value="1" />
                    <input type="hidden" name="thtk" value={handshakeData.thtk} />
                    <input type="hidden" name="lang" value={language === 'he' ? 'il' : 'us'} />
                    <input type="hidden" name="buttonLabel" value={language === 'he' ? 'שלם עכשיו' : 'Pay Now'} />
                    <input type="hidden" name="trBgColor" value="f7fafc" />
                    <input type="hidden" name="trTextColor" value="1a202c" />
                    <input type="hidden" name="trButtonColor" value="2563eb" />
                    <input type="hidden" name="pdesc" value={productDetails[product]?.title || ''} />
                    {user && (
                      <>
                        <input type="hidden" name="contact" value={user.full_name || ''} />
                        <input type="hidden" name="email" value={user.email || ''} />
                      </>
                    )}
                  </form>

                  <iframe
                    name="tranzila-frame"
                    id="tranzila-frame"
                    title="Tranzila Payment"
                    allowpaymentrequest="true"
                    style={{
                      width: '100%',
                      height: '600px',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                  
                  <p className="text-sm text-gray-600 text-center">
                    {language === 'he' ? 'ממתין לתשלום...' : 'Waiting for payment...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-8">
            <Card className="shadow-xl bg-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl">{language === 'he' ? 'סיכום הזמנה' : 'Order Summary'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium flex items-center gap-2">
                    <CurrentProductIcon className="w-5 h-5" />
                    {productDetails[product]?.title}
                  </span>
                  <span>{product === 'full_report' ? (language === 'he' ? '299₪' : '$79') : (language === 'he' ? '59₪' : '$15')}</span>
                </div>
                
                {isExpress && (
                    <div className="flex justify-between items-center text-lg text-orange-600">
                    <span className="font-medium flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {language === 'he' ? 'אספקה מואצת (3 ימי עבודה)' : 'Express Delivery (3 business days)'}
                    </span>
                    <span>{language === 'he' ? '+79₪' : '+$21'}</span>
                    </div>
                )}
                
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between items-center text-3xl font-bold">
                  <span>{language === 'he' ? 'סה"כ לתשלום:' : 'Total:'}</span>
                  <span>{language === 'he' ? price + '₪' : '$' + Math.round(price / 3.8)}</span>
                </div>
                
                <div className="text-sm text-gray-600 mt-4">
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {productDetails[product]?.deliveryText}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-gray-600 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>{language === 'he' ? 'תשלום מאובטח בתקן PCI DSS' : 'Secure Payment PCI DSS Compliant'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <ReportInfoModal 
        isOpen={isReportInfoOpen} 
        onClose={() => setIsReportInfoOpen(false)} 
      />
    </div>
  );
}