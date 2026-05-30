import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, ArrowLeft, Star, FileText, Zap, Loader2, Info } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle } from
'@/components/ui/dialog';

import { getAbandonmentEmailTemplate } from '@/components/email/AbandonmentEmailTemplate';
import FAQSection from '@/components/home/FAQSection';

function ReportInfoModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[625px] rtl text-right">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-right tracking-tight">התהליך המקצועי מאחורי הדו"ח</DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2 text-sm text-right">השאלון שסיימתם למלא הוא רק הצעד הראשון. דו"ח V107 המלא עובר תהליך ניתוח מעמיק ורב-שלבי על מנת להבטיח שתקבלו את התובנות המדויקות והמעשיות ביותר.

          </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg mb-1">👨‍💻 ניתוח מומחים אנושי</h3>
                        <p className="text-gray-700">הדו"ח אינו מופק על ידי בינה מלאכותית, אלא על ידי צוות מומחי יזמות בעלי עשרות שנות ניסיון בהובלת חברות והקמת מיזמים טכנולוגיים ועסקיים בארץ ובעולם.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">🔍 תובנות אישיות ומותאמות</h3>
                        <p className="text-gray-700">כל תשובה שלכם נבחנת בקפידה ומשולבת עם ידע אקדמי ומעשי, כדי לספק לכם המלצות ואסטרטגיות המותאמות באופן ספציפי לפרופיל היזמי הייחודי שלכם ולפוטנציאל המיזם שלכם.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">🗺️ תוכנית פעולה מעשית</h3>
                        <p className="text-gray-700">הדו"ח מספק לא רק ניתוח, אלא גם מפת דרכים ברורה וקונקרטית לצעדים הבאים שעליכם לנקוט כדי לקדם את הרעיון היזמי שלכם לכדי מציאות.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">📊 גרפים, השוואות וניתוח שוק</h3>
                        <p className="text-gray-700">הדו"ח כולל גרפים ויזואליים, השוואות למגמות שוק וליזמים אחרים, וניתוח מעמיק של החוזקות והחולשות שלכם אל מול הסביבה העסקית הרחבה.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">✅ בקרת איכות קפדנית</h3>
                        <p className="text-gray-700">כל דו"ח עובר תהליך בקרת איכות על ידי מומחה נוסף, כדי לוודא דיוק, עקביות וכיסוי מקיף של כל ההיבטים הרלוונטיים.</p>
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <Button onClick={onClose}>הבנתי</Button>
                </div>
            </DialogContent>
        </Dialog>);

}

export default function Completion() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const responseId = params.get('responseId');
  const discountParam = params.get('discount');

  const [user, setUser] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isReportInfoOpen, setIsReportInfoOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser(await base44.auth.me());
      } catch (e) {
        // User not logged in
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await base44.entities.Product.filter({ active: true });
        const completionProducts = data.filter(p => 
          p.product_type === 'full_report'
        );
        setProducts(completionProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleNoPurchase = async () => {
    if (!user || isSendingEmail) return;
    setIsSendingEmail(true);

    try {
      await base44.auth.updateMe({
        questionnaire_completed_no_purchase: true,
        questionnaire_completed_date: new Date().toISOString()
      });

      const surveyUrl = `${window.location.origin}${createPageUrl('Survey')}`;

      const emailTemplate = getAbandonmentEmailTemplate(
        user.full_name || user.email,
        surveyUrl,
        'he'
      );

      await base44.integrations.Core.SendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        body: emailTemplate.html
      });

      alert('תודה! שלחנו לך מייל עם קישור לסקר קצר. מלא אותו וקבל 25 ₪ הנחה!');
      navigate(createPageUrl("Home"));

    } catch (error) {
      console.error("Failed to send abandonment email:", error);
      alert("אירעה שגיאה. נסה שוב מאוחר יותר.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const discountMultiplier = discountParam === '10' ? 0.9 : 1;

  const productCards = products
    .map((product) => {
      const price = Math.round(product.price * discountMultiplier);
      
      let icon = FileText;
      let title = product.name_he;
      let description = product.description_he || "";
      let buttonText = `רכוש ${product.name_he}`;
      let recommended = false;
      let sortOrder = 2;
      
      if (product.product_type === 'full_report' && product.name_he.includes('מואץ')) {
        icon = Zap;
        description = `${description}${discountParam ? ' מחיר מיוחד!' : ''}`;
        buttonText = 'הפק דו"ח מואץ';
        sortOrder = 3; // שמאל
      } else if (product.product_type === 'full_report' && !product.name_he.includes('מואץ')) {
        icon = Star;
        description = `${description}${discountParam ? ' מחיר מיוחד!' : ''}`;
        buttonText = 'הפק דו"ח מלא';
        recommended = true; // המומלץ
        sortOrder = 2; // אמצע
      } else if (product.product_type === 'answers_download') {
        buttonText = 'רכוש תשובות בלבד';
        sortOrder = 1; // ימין
      }
      
      const productParam = product.product_type === 'answers_download' ? 'answers_download' : 'full_report';
      const isExpress = product.name_he.includes('מואץ');
      
      return {
        title,
        price: `${price}₪`,
        icon,
        description,
        url: createPageUrl(`Payment?product=${productParam}&price=${price}${isExpress ? '&express=true' : ''}${discountParam ? '&discount=10' : ''}&responseId=${responseId}`),
        buttonText,
        recommended,
        sortOrder
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);


  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Sticky Purchase Button for Mobile */}
                <div className="fixed top-0 left-0 right-0 sm:hidden z-40 bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-sm p-3 border-b border-blue-200 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">לרכישת הדוח</h2>
                  <button
                    onClick={() => productCards[1] && navigate(productCards[1].url)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    קנה עכשיו
                  </button>
                </div>
                
                <div className="pt-16 sm:pt-0 text-center">
                    <Award className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">כל הכבוד! סיימת את השאלון.</h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-6">
                        עשית צעד משמעותי במסע היזמי שלך. כעת, בחר את הדרך המתאימה לך להמשיך:
                    </p>
                
                <div className="mb-8">
                    <button
            onClick={() => setIsReportInfoOpen(true)}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline font-medium">

                      <Info className="w-4 h-4" />
                      רוצה לדעת יותר על התהליך המקצועי מאחורי הדו"ח?
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-8 mb-12">
                    {productCards.map((product) =>
          <Card
            key={product.title}
            className={`flex flex-col text-center transition-all duration-300 hover:shadow-2xl w-full sm:max-w-sm ${
            product.recommended ? 'border-2 border-blue-600 shadow-xl sm:scale-105' : 'shadow-lg'}`
            }>

                            {product.recommended &&
            <div className="bg-blue-600 text-white text-sm font-bold py-1">הכי מומלץ</div>
            }
                            <CardHeader className="pt-6 sm:pt-8">
                                <product.icon className={`w-12 h-12 mx-auto ${product.recommended ? 'text-blue-600' : 'text-gray-500'}`} />
                                <CardTitle className="text-3xl font-bold mt-4">
                                    {product.title}
                                    {product.recommended && discountParam &&
                <span className="block text-base font-normal text-green-600 mt-1"> (10% הנחה!)</span>
                }
                                </CardTitle>
                                <p className="text-5xl font-extrabold text-gray-900 my-4">{product.price}</p>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-between p-6">
                                <p className="text-gray-600 mb-6">{product.description}</p>
                                <Link to={product.url}>
                                    <Button
                  size="lg"
                  className={`w-full text-lg py-6 ${
                  product.recommended ? 'bg-gradient-to-l from-blue-600 to-purple-600' : ''}`
                  }
                  variant={product.recommended ? 'default' : 'outline'}>

                                        {product.buttonText}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
          )}
                </div>

                </div>

                <FAQSection />

                <div className="mt-12 p-6 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">לא בטוח/ה עדיין?</h3>
                    <p className="text-gray-600 mb-6">
                        אין בעיה! מלא סקר קצר (2 דק׳) וקבל קוד קופון ל-25 ₪ הנחה.
                    </p>
                    <Button
            variant="ghost"
            size="lg"
            onClick={handleNoPurchase}
            disabled={isSendingEmail}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mx-auto">

                        {isSendingEmail ?
            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                שולח קישור לסקר...
                            </> :

            <>
                                <ArrowLeft className="w-5 h-5" />
                                שלח לי קישור לסקר ואקבל קופון
                            </>
            }
                    </Button>
                </div>

                <div className="mt-16 text-sm text-gray-500">
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">תנאי שימוש ומדיניות פרטיות</h3>
                    <p className="mb-4">
                        ברכישת אחד מהמוצרים, אתם מסכימים ל
                        <Link to={createPageUrl("TermsOfService")} className="text-blue-600 hover:underline mx-1">תנאי השימוש</Link>
                        ול
                        <Link to={createPageUrl("PrivacyPolicy")} className="text-blue-600 hover:underline mx-1">מדיניות הפרטיות</Link> שלנו.
                    </p>
                    <p className="mb-2 text-gray-700 font-medium">פירוט תמחור:</p>
                    <ul className="list-disc list-inside mx-auto max-w-sm text-gray-600">
                        {productCards.map((product) =>
            <li key={product.title} className="mb-1 text-right">
                                {product.title}: <strong>{product.price}</strong>
                                {product.title.includes("מואץ") && " (כולל תוספת לאספקה מהירה)"}
                                {product.recommended && " (מומלץ)"}
                                {product.recommended && discountParam && " (מחיר לאחר הנחה)"}
                            </li>
            )}
                    </ul>
                    <p className="mt-4 text-gray-700">
                        כל המחירים כוללים מע"מ כחוק.
                    </p>
                </div>
            </div>
            
            <ReportInfoModal
        isOpen={isReportInfoOpen}
        onClose={() => setIsReportInfoOpen(false)} />

        </div>);

}