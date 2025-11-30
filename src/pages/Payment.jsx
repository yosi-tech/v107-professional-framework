
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client"; // Updated import for base44
import { getFullReportPurchaseEmailTemplate } from '@/components/email/FullReportPurchaseTemplate';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { CreditCard, Lock, ArrowLeft, ShieldCheck, CheckCircle, Loader2, FileText, Star, Clock, Zap, X } from "lucide-react";
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
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

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
      const currentUser = await base44.entities.User.me(); // Updated from User.me()
      setUser(currentUser);
    } catch (error) {
      console.log('User not logged in');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // סימולציה של תהליך תשלום
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      if (!user) {
        // If user is not logged in, redirect for login. base44.entities.User.loginWithRedirect handles this.
        await base44.entities.User.loginWithRedirect(window.location.href); // Updated from User.loginWithRedirect
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

      await base44.entities.User.updateMyUserData(userDataUpdate); // Updated from User.updateMyUserData
      
      await sendConfirmationEmail(user.email, user.full_name || '', product, isExpress);

      setPaymentSuccess(true);
      
      setTimeout(() => {
        navigate(createPageUrl("ThankYou"));
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      alert(language === 'he' ? 'אירעה שגיאה בתהליך התשלום. אנא נסה שוב.' : 'An error occurred during payment. Please try again.');
    }
    
    setIsProcessing(false);
  };

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
        
        <Alert className="mb-8 bg-blue-50 border-blue-200 text-blue-800">
          <ShieldCheck className="h-5 h-5 text-blue-600" />
          <AlertTitle className="font-bold">{language === 'he' ? 'מצב סימולציה' : 'Simulation Mode'}</AlertTitle>
          <AlertDescription>
            {language === 'he' ? 'זוהי סימולציה של תהליך תשלום. לא יתבצע חיוב אמיתי.' : 'This is a payment simulation. No actual charge will occur.'}
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Payment Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span className="text-2xl">{language === 'he' ? 'פרטי תשלום' : 'Payment Details'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <Label htmlFor="name">{language === 'he' ? 'שם מלא (כפי שמופיע בכרטיס)' : 'Full Name (as it appears on card)'}</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={language === 'he' ? "ישראל ישראלי" : "John Doe"} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="card-number">{language === 'he' ? 'מספר כרטיס' : 'Card Number'}</Label>
                  <Input 
                    id="card-number"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="**** **** **** 1234" 
                    required 
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="expiry">{language === 'he' ? 'תוקף (MM/YY)' : 'Expiry (MM/YY)'}</Label>
                    <Input 
                      id="expiry"
                      value={formData.expiry}
                      onChange={(e) => handleInputChange('expiry', e.target.value)}
                      placeholder="12/28" 
                      required 
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc"
                      value={formData.cvc}
                      onChange={(e) => handleInputChange('cvc', e.target.value)}
                      placeholder="123" 
                      required 
                    />
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setIsReportInfoOpen(true)}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    {language === 'he' ? '📋 רוצה לדעת יותר על התהליך המקצועי?' : '📋 Want to know more about the professional process?'}
                  </button>
                </div>

                <div className="flex items-start space-x-2 space-x-reverse pt-4">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted} // Added checked prop for controlled component
                    onCheckedChange={setTermsAccepted} 
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {language === 'he' ? (
                        <>קראתי ואני מאשר/ת את <Link to={createPageUrl("TermsOfService")} target="_blank" className="underline text-blue-600 hover:text-blue-800">תנאי השימוש</Link>, <Link to={createPageUrl("PrivacyPolicy")} target="_blank" className="underline text-blue-600 hover:text-blue-800">מדיניות הפרטיות</Link> ו<Link to={createPageUrl("CancellationPolicy")} target="_blank" className="underline text-blue-600 hover:text-blue-800">מדיניות הביטולים</Link>.</>
                      ) : (
                        <>I have read and agree to the <Link to={createPageUrl("TermsOfService")} target="_blank" className="underline text-blue-600 hover:text-blue-800">Terms of Service</Link>, <Link to={createPageUrl("PrivacyPolicy")} target="_blank" className="underline text-blue-600 hover:text-blue-800">Privacy Policy</Link>, and <Link to={createPageUrl("CancellationPolicy")} target="_blank" className="underline text-blue-600 hover:text-blue-800">Cancellation & Refund Policy</Link>.</>
                      )}
                    </label>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isProcessing || !termsAccepted}
                  className="w-full bg-gradient-to-l from-blue-600 to-purple-600 text-lg py-7 mt-6"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'} animate-spin`} />
                      {language === 'he' ? 'מעבד תשלום...' : 'Processing payment...'}
                    </>
                  ) : (
                    <>
                      <Lock className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                      {language === 'he' ? `שלם ${price}₪ וקבל גישה` : `Pay ${language === 'he' ? price + '₪' : '$' + Math.round(price / 3.8)} and Get Access`}
                    </>
                  )}
                </Button>
              </form>
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
