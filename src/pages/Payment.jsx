import { useState, useEffect} from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { tranzilaCreateHandshake } from "@/functions/tranzilaCreateHandshake";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ShieldCheck, CheckCircle, Loader2, FileText, Star, Clock, Zap, X, Tag, Lock } from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";
import MemberCard from "@/components/payment/MemberCard";
import OrderSummary from "@/components/payment/OrderSummary";

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
  const [originalPrice, setOriginalPrice] = useState(0);
  const [isExpress, setIsExpress] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isReportInfoOpen, setIsReportInfoOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [handshakeData, setHandshakeData] = useState(null);
  const [isLoadingHandshake, setIsLoadingHandshake] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setProduct(params.get('product'));
    const priceFromUrl = Number(params.get('price')) || 0;
    setPrice(priceFromUrl);
    setOriginalPrice(priceFromUrl);
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

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError(language === 'he' ? 'יש להזין קוד קופון' : 'Please enter a coupon code');
      return;
    }

    setIsCheckingCoupon(true);
    setCouponError('');

    try {
      const coupons = await base44.entities.Coupon.filter({ code: couponCode.trim() });
      
      if (coupons.length === 0) {
        setCouponError(language === 'he' ? 'קוד קופון לא תקין' : 'Invalid coupon code');
        setIsCheckingCoupon(false);
        return;
      }

      const coupon = coupons[0];

      // בדיקות תקינות
      // בדוק אם הקופון נוצל רק אם הוא חד פעמי
      const isSingleUse = coupon.is_single_use !== false; // default is true
      if (isSingleUse && coupon.used) {
        setCouponError(language === 'he' ? 'קוד הקופון כבר נוצל' : 'Coupon code already used');
        setIsCheckingCoupon(false);
        return;
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
        setCouponError(language === 'he' ? 'קוד הקופון פג תוקף' : 'Coupon code expired');
        setIsCheckingCoupon(false);
        return;
      }

      // בדוק אם הקופון מוגבל למשתמש ספציפי
      if (coupon.is_user_specific && user && coupon.user_email && coupon.user_email !== user.email) {
        setCouponError(language === 'he' ? 'קוד הקופון לא תקף עבור המשתמש הזה' : 'Coupon not valid for this user');
        setIsCheckingCoupon(false);
        return;
      }

      // חישוב הנחה
      let discount = 0;
      if (coupon.discount_amount) {
        discount = coupon.discount_amount;
      } else if (coupon.discount_percentage) {
        discount = Math.round(originalPrice * (coupon.discount_percentage / 100));
      }

      const newPrice = Math.max(0, originalPrice - discount);
      setPrice(newPrice);
      setAppliedCoupon(coupon);
      setCouponError('');
      
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError(language === 'he' ? 'שגיאה בבדיקת הקופון' : 'Error checking coupon');
    }

    setIsCheckingCoupon(false);
  };

  const removeCoupon = () => {
    setPrice(originalPrice);
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const initializePayment = async () => {
    if (!termsAccepted) {
      alert(language === 'he' ? 'יש לאשר את תנאי השימוש' : 'Please accept the terms of service');
      return;
    }

    if (!user) {
      alert(language === 'he' ? 'יש להתחבר למערכת תחילה' : 'Please login first');
      return;
    }

    setIsLoadingHandshake(true);
    try {
      // Create PaymentOrder with pending status
      const orderData = {
        status: 'pending',
        amount: price,
        user_email: user.email,
        user_name: user.full_name || '',
        product_type: product,
        is_express: isExpress,
        questionnaire_response_id: responseId || null,
        coupon_code: appliedCoupon?.code || null,
        coupon_id: appliedCoupon?.id || null
      };

      const createdOrder = await base44.entities.PaymentOrder.create(orderData);
      setCurrentOrderId(createdOrder.id); 
      console.log('PaymentOrder created:', createdOrder.id);

      // Mark coupon as used immediately to prevent reuse (only if single-use)
      // Coupon is marked as used ONLY via tranzilaNotify webhook after payment confirmed.
      // Do NOT mark it here — user may open Tranzila and cancel without paying.
      
          // if (appliedCoupon) {
          //   const isSingleUse = appliedCoupon.is_single_use !== false; // default is true
          //   if (isSingleUse) {
          //     await base44.entities.Coupon.update(appliedCoupon.id, { used: true });
          //     console.log('Coupon marked as used:', appliedCoupon.code);
          //   }
          // }

      const { data } = await tranzilaCreateHandshake({ sum: price });
      setHandshakeData(data);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
      alert(language === 'he' ? 'שגיאה ביצירת תשלום. נסה שוב.' : 'Error initializing payment. Try again.');
    }
    setIsLoadingHandshake(false);
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data && event.data.iframe_message === 'success') {
        setIsProcessing(false);
        setPaymentSuccess(true);
        // Note: All processing happens via tranzilaNotify webhook
        // Just show success message to user
      } else if (event.data && event.data.iframe_message === 'error') {
        setIsProcessing(false);
        alert(language === 'he' ? 'התשלום נכשל. נסה שוב.' : 'Payment failed. Try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [language]);

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
            {language === 'he' ? 'תודה על הרכישה. הרכישה שלך עברה בהצלחה!' : 'Thank you for your purchase. Your purchase was successful!'}
          </p>
          <Button onClick={() => navigate(createPageUrl("ThankYou"))} className="mt-4">
            {language === 'he' ? 'המשך' : 'Continue'}
          </Button>
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
    <div className="min-h-screen bg-slate-50 pt-12 pb-20 px-4 md:px-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            {language === 'he' ? 'עמוד סליקה מאובטח' : 'Secure Checkout'}
          </h1>
          <p className="text-slate-500 max-w-md">
            {language === 'he'
              ? 'השלם את רכישת החבילה שלך ל-v107 AI והתחל לעצב את העתיד המקצועי שלך עוד היום.'
              : 'Complete your v107 AI package purchase and start shaping your professional future today.'}
          </p>
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

        {/* 12-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Payment section (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              {/* Section title */}
              <div className="mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#FF8F00]" />
                  {language === 'he' ? 'פרטי תשלום' : 'Payment Details'}
                </h2>
              </div>

              {/* Member Card */}
              <MemberCard
                userName={user?.full_name}
                planName={productDetails[product]?.title}
              />

              {/* Pre-handshake: coupon + terms + button */}
              {!handshakeData ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsReportInfoOpen(true)}
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      {language === 'he' ? '📋 רוצה לדעת יותר על התהליך המקצועי?' : '📋 Want to know more about the professional process?'}
                    </button>
                  </div>

                  {/* Coupon Section */}
                  {!appliedCoupon ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === 'he' ? 'קוד קופון' : 'Coupon Code'}
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder={language === 'he' ? 'הזן קוד קופון' : 'Enter coupon code'}
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={isCheckingCoupon}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={applyCoupon}
                          disabled={isCheckingCoupon || !couponCode.trim()}
                          variant="outline"
                        >
                          {isCheckingCoupon ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Tag className="w-4 h-4" />
                          )}
                          {!isCheckingCoupon && (language === 'he' ? 'החל' : 'Apply')}
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-sm text-red-600">{couponError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              {language === 'he' ? 'קופון הופעל בהצלחה' : 'Coupon applied successfully'}
                            </p>
                            <p className="text-xs text-green-700">
                              {appliedCoupon.code} • {language === 'he' ? 'הנחה:' : 'Discount:'} {appliedCoupon.discount_amount ? `${appliedCoupon.discount_amount}₪` : `${appliedCoupon.discount_percentage}%`}
                            </p>
                          </div>
                        </div>
                        <Button type="button" onClick={removeCoupon} variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-2 space-x-reverse">
                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} />
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
                    className="w-full bg-[#FF8F00] hover:bg-[#e07e00] text-white text-lg py-7 rounded-xl mt-4"
                  >
                    {isLoadingHandshake ? (
                      <>
                        <Loader2 className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'} animate-spin`} />
                        {language === 'he' ? 'מכין תשלום...' : 'Preparing payment...'}
                      </>
                    ) : (
                      language === 'he' ? `המשך לתשלום ${price}₪` : `Continue to Payment ${price}₪`
                    )}
                  </Button>
                </div>
              ) : (
                /* Post-handshake: Tranzila iframe */
                <div className="space-y-4">
                  <iframe
                    name="tranzila-frame"
                    id="tranzila-frame"
                    title="Tranzila Payment"
                    allowpaymentrequest="true"
                    src={`https://direct.tranzila.com/${handshakeData.supplier}/iframenew.php?sum=${handshakeData.sum}&currency=1&cred_type=1&tranmode=A&new_process=1&thtk=${handshakeData.thtk}&lang=${language === 'he' ? 'il' : 'us'}&buttonLabel=${encodeURIComponent(language === 'he' ? 'שלם עכשיו' : 'Pay Now')}&trBgColor=f7fafc&trTextColor=1a202c&trButtonColor=2563eb&pdesc=${encodeURIComponent(productDetails[product]?.title || '')}&contact=${encodeURIComponent(user?.full_name || '')}&email=${encodeURIComponent(user?.email || '')}&cfield1=${encodeURIComponent(currentOrderId)}`}
                    style={{
                      width: '100%',
                      height: '600px',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                  <p className="text-sm text-slate-500 text-center">
                    {language === 'he' ? 'ממתין לתשלום...' : 'Waiting for payment...'}
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: Order Summary sidebar (5 cols) */}
          <div className="lg:col-span-5">
            <OrderSummary
              language={language}
              productTitle={productDetails[product]?.title}
              originalPrice={originalPrice}
              price={price}
              appliedCoupon={appliedCoupon}
              isExpress={isExpress}
              deliveryText={productDetails[product]?.deliveryText}
            />
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