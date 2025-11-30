import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail } from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";

export default function TermsOfService() {
  const { t, language } = useTranslation();

  const termsHe = [
    {
      title: "1. השירות",
      content: "השירות כולל: (א) מילוי שאלון סגור בן 107 פריטים (סולם 1–7), ו-(ב) קבלת דו״ח מקצועי אישי (עברית או אנגלית). הדוחות נעזרים בבינה מלאכותית במידת הצורך ונבדקים על ידי בני אדם לפני המסירה. יעד אספקה סטנדרטי הוא יום 5 (D+5) לאחר ההגשה; חלון תפעולי של עד 7 ימי עבודה עשוי לחול."
    },
    {
      title: "2. תמחור ותשלום",
      content: "אנו מציעים את האפשרויות בתשלום הבאות (המחירים מוצגים בקופה ועשויים להשתנות מעת לעת):\n• חבילה מלאה (דו״ח + שאלון) — בדרך כלל ₪299.\n• שאלון + תשובות בלבד — בדרך כלל ₪59; ניתן לשדרג מאוחר יותר לדו״ח מלא באמצעות תוספת מבצעית (למשל, שדרוג ₪240 למשך מוגבל).\n• הצעת שחזור נטישה — במידת האפשר, דו״ח מלא ב-₪269 אם התחלת אך לא השלמת את התהליך.\n• אספקה מואצת — תוספת ₪79 לדו״ח המלא (סה״כ ₪378) לאספקה תוך 3 ימי עבודה.\n\nאנו עשויים לאפשר עד 3 תשלומים חודשיים שווים (בכפוף למעבד התשלומים). תשלומים מעובדים על ידי ספקי צד שלישי (למשל Tranzila או HYP). מסים, עמלות מעבד ותיאום המרת מטבע עשויים לחול."
    },
    {
      title: "3. אספקה וסוגי מוצרים",
      content: "• שאלון + תשובות בלבד (₪59): תקבל את פלט התשובות שלך מיד לאחר תשלום והגשה מוצלחים.\n• דו״ח מלא מותאם אישית: נמסר בדוא״ל ב-D+5 (לאחר בדיקה ידנית קצרה).\n• אספקה מואצת: דו״ח מלא תוך 3 ימי עבודה (במקום 7).\n\nכאשר שניהם נרכשים, פלט התשובות בלבד עשוי להגיע מוקדם יותר, והדו״ח המלא יגיע אחריו ב-D+5 (או D+3 באספקה מואצת)."
    },
    {
      title: "4. שימוש הוגן",
      content: "השאלון והדו״ח נועדו לשימוש אישי/עסקי פנימי. אין להעתיק, לפרסם או למסחר תכנים, אלא באישור בכתב."
    },
    {
      title: "5. אחריות מקצועית",
      content: "הדו״ח מספק ניתוח והמלצות כלליות המבוססות על השאלון ומסגרת מקצועית; אינו מהווה ייעוץ פיננסי/משפטי/מיסויי פרטני. החלטות עסקיות הן באחריות המשתמש/ת בלבד."
    },
    {
      title: "6. ביטולים והחזרים",
      content: "מדיניות הביטולים מחייבת ומפורטת בדף: מדיניות ביטולים והחזרים. במקרה של סתירה—המדיניות הייעודית תגבר."
    },
    {
      title: "7. פרטיות וקובצי Cookie",
      content: "איסוף ושימוש במידע כפוף למדיניות הפרטיות. אנו עושים שימוש בעוגיות לצורכי תפעול, אבטחה ומדידה."
    },
    {
      title: "8. מבצעים והצעות",
      content: "מעת לעת אנו עשויים להציג שדרוגים מבצעיים או הצעות שחזור (למשל, שדרוג ₪240 לדו״ח מלא עבור קוני שאלון בלבד, או מחיר שחזור ₪269 למשתמשים שהתחילו אך לא השלימו). הצעות כאלה הן מוגבלות בזמן וכפופות לזכאות וזמינות. תנאי ההצעה הספציפיים המוצגים בקופה גוברים."
    },
    {
      title: "9. שינויים בשירות",
      content: "אנו רשאים לעדכן את האתר/התכנים/המחירים/התנאים מעת לעת. עדכונים ייכנסו לתוקף עם פרסומם."
    },
    {
      title: "10. דין וסמכות",
      content: "על התנאים יחול דין מדינת ישראל וסמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים בישראל."
    }
  ];

  const termsEn = [
    {
      title: "1. The Service",
      content: "The Service includes: (a) completing a closed 107-item questionnaire (1–7), and (b) receiving a personalized professional report (Hebrew or English). Reports are assisted by AI where useful and human-reviewed before delivery. Standard delivery target is day 5 (D+5) after submission; an operational window of up to 7 business days may apply."
    },
    {
      title: "2. Pricing & Payment",
      content: "We offer the following paid options (prices shown at checkout and may change from time to time):\n• Full bundle (Report + Questionnaire) — typically ₪299.\n• Questionnaire + answers only — typically ₪59; you may later upgrade to a full report via a promotional add-on (e.g., ₪240 limited-time upgrade).\n• Abandonment recovery offer — where applicable, a full report at ₪269 if you started but did not complete the process.\n• Express delivery — additional ₪79 to the full report (total ₪378) for delivery within 3 business days.\n\nWe may allow up to 3 equal monthly installments (subject to the payment processor). Payments are processed by third-party providers (e.g., Tranzila or HYP). Taxes, processor fees, and currency conversion may apply."
    },
    {
      title: "3. Delivery & Product Types",
      content: "• Questionnaire + answers only (₪59): you receive your answer output promptly after successful payment and submission.\n• Personalized full report: delivered by email on D+5 (after a brief manual review).\n• Express delivery: full report within 3 business days (instead of 7).\n\nWhere both are purchased, the answers-only output may arrive earlier, and the full report follows on D+5 (or D+3 for express)."
    },
    {
      title: "4. Fair Use",
      content: "The questionnaire and report are intended for personal/internal business use. Content may not be copied, published, or commercialized without written permission."
    },
    {
      title: "5. Professional Responsibility",
      content: "The report provides general analysis and recommendations based on the questionnaire and professional framework; it does not constitute personalized financial/legal/tax advice. Business decisions are solely the user's responsibility."
    },
    {
      title: "6. Cancellations and Refunds",
      content: "The cancellation policy is binding and detailed in the page: Cancellation and Refund Policy. In case of conflict—the dedicated policy prevails."
    },
    {
      title: "7. Privacy and Cookies",
      content: "Collection and use of information is subject to the Privacy Policy. We use cookies for operational, security, and measurement purposes."
    },
    {
      title: "8. Promotions & Offers",
      content: "From time to time we may display promotional upgrades or recovery offers (e.g., a ₪240 upgrade to a full report for questionnaire-only buyers, or a ₪269 recovery price for users who started but did not complete). Such offers are time-limited and subject to eligibility and availability. The specific offer terms shown at checkout prevail."
    },
    {
      title: "9. Service Changes",
      content: "We reserve the right to update the site/content/prices/terms from time to time. Updates take effect upon publication."
    },
    {
      title: "10. Law and Jurisdiction",
      content: "These terms are governed by the laws of the State of Israel, and exclusive jurisdiction is granted to the competent courts in Israel."
    }
  ];

  const terms = language === 'he' ? termsHe : termsEn;
  const pageTitle = language === 'he' ? 'תנאי שימוש (גרסת B5)' : 'Terms of Service (Version B5)';
  const lastUpdated = language === 'he' ? 'עדכון אחרון: B5' : 'Last updated: B5';
  const welcomeText = language === 'he' 
    ? 'ברוכים הבאים לאתר AVENTURA 107 ("האתר"). השימוש באתר ובשירותים מהווה הסכמה לתנאים אלה.'
    : 'Welcome to the AVENTURA 107 website ("the Site"). Use of the Site and Services constitutes agreement to these terms.';
  const contactText = language === 'he' ? 'יצירת קשר:' : 'Contact:';

  return (
    <div className="min-h-screen bg-slate-50" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
            <FileText className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">{pageTitle}</h1>
          <p className="text-md text-slate-500 mt-2">{lastUpdated}</p>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-slate-700 leading-relaxed">{welcomeText}</p>
          </div>

          <div className="space-y-6">
            {terms.map((term, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-600" />
                    {term.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{term.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 bg-slate-100 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <Mail className="w-5 h-5 text-amber-600" />
              <span className="font-medium">{contactText}</span>
              <a href="mailto:support@aventura107.com" className="text-blue-600 hover:text-blue-800 underline">
                support@aventura107.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}