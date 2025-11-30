import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText } from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";

export default function CancellationPolicy() {
  const { t, language } = useTranslation();

  const policyPointsHe = [
    {
      title: "לפני תחילת עיבוד הדו״ח",
      content: "ניתן לבטל את ההזמנה עד לתחילת עיבוד התשובות לדו״ח. במקרה כזה יינתן החזר מלא לאמצעי התשלום המקורי. בהתאם לחוק עסקת מכר מרחוק, ניתן למסור הודעת ביטול בתוך 14 ימים ממועד העסקה."
    },
    {
      title: "לאחר תחילת העיבוד ולפני מסירה",
      content: "אם התחיל עיבוד מקצועי של התשובות אך הדו״ח טרם נמסר, ניתן לבטל ולקבל החזר יחסי המשקף את חלק העבודה שבוצע עד למועד הביטול."
    },
    {
      title: "לאחר מסירת הדו״ח (קובץ דיגיטלי מותאם אישית)",
      content: "עם מסירת הדו״ח הדיגיטלי ללקוח—לא יתאפשר ביטול או החזר, מאחר שמדובר בתוכן/מידע דיגיטלי שסופק אלקטרונית."
    },
    {
      title: "הורדת השאלון המלא (59 שקלים)",
      content: "לאחר יצירת/מסירת קובץ ההורדה הדיגיטלי עם תשובות המשתמש—לא יתאפשר ביטול או החזר."
    },
    {
      title: "אוכלוסיות זכאיות להארכה",
      content: "אדם עם מוגבלות, אזרח ותיק (65+) או עולה חדש—כאשר ההתקשרות כללה שיחה (לרבות שיחה אלקטרונית)—רשאי לבטל עד 4 חודשים ממועד העסקה, בהתאם לחוק. הטיפול יתבצע לפי עקרונות סעיפים 1–3 לעיל."
    },
    {
      title: "אופן הבקשה לביטול",
      content: "יש לשלוח הודעת ביטול בכתב ל-support@aventura107.com עם: שם מלא, אימייל/טלפון, תאריך רכישה ומספר הזמנה/אסמכתא. החזר יבוצע לאמצעי התשלום המקורי בתוך 14 ימים ממועד קבלת ההודעה."
    },
    {
      title: "הבהרות",
      content: "האמור לעיל מסכם את עקרונות המדיניות בהתאם לדין החל. ייתכנו עדכונים מעת לעת; הגרסה באתר היא הקובעת."
    }
  ];

  const policyPointsEn = [
    {
      title: "1) Scope",
      content: "This policy applies to purchases of the AVENTURA 107 questionnaire and the personalized report (Hebrew or English). The service includes completing a 1–7 closed questionnaire and receiving a professional report (typically delivered on day 5 (D+5); operational window up to 7 business days)."
    },
    {
      title: "2) Operational definitions",
      content: "• Purchase timestamp: the time the transaction is approved.\n• Processing start: when your submission moves into In Review (professional work has begun) or when a 'production started' notice is sent—the earlier of the two.\n• Earliest send time: D+5 at 17:00 from the purchase timestamp (internal scheduling)."
    },
    {
      title: "3) Questionnaire + answer output (Product A) — digital content",
      content: "Access to the questionnaire and the user's answers constitutes supply of digital information. Once the questionnaire is opened/started or the answers are generated, the transaction cannot be cancelled (exception for digital information)."
    },
    {
      title: "4) Personalized full report (Product B) — custom content",
      content: "The report is produced personally based on the submitted questionnaire. You may cancel up to two business days before processing begins. Once processing has started, cancellation is no longer possible (custom/personalized content exception). Operational target for delivery is D+5 (window up to 7 business days)."
    },
    {
      title: "5) Cancellation fee (where cancellation is permitted)",
      content: "A cancellation fee of the lower of 5% of the transaction amount or 100 ILS may be charged, unless cancellation is due to a breach on our side (e.g., non-delivery)."
    },
    {
      title: "6) Eligible populations (extended right)",
      content: "Customers who are a person with a disability, a senior citizen, or a new immigrant may cancel a remote-sale transaction within four months of the purchase date, provided a phone/electronic conversation with our representative occurred when contracting. Applicable statutory rules and the cancellation fee section above apply."
    },
    {
      title: "7) How to submit a cancellation request",
      content: "Send a written request including full name, email/phone, purchase date, and order/transaction number:\n• Email: support@aventura107.com\n• Via the site's dedicated 'Cancel Transaction' form (link in footer).\nYour request is deemed received on the date we receive it. Refunds are processed to the original payment method within 14 business days from receipt of the request, per applicable law."
    },
    {
      title: "8) Non-refundable charges",
      content: "• Payment-processor fees that are non-refundable by the processor.\n• Coupons/discounts/promotions are not redeemable for cash; where relevant, a store credit may be issued.\n• Multiple/enterprise orders: according to the specific agreement."
    },
    {
      title: "9) Disputes or erroneous charges",
      content: "If you encounter a duplicate/erroneous charge, please contact support@aventura107.com first with the transaction details. Filing a chargeback without prior contact may delay resolution."
    },
    {
      title: "10) Privacy & security",
      content: "Cancellation/refund requests are handled per our Privacy Policy. Information is used solely to verify identity and prevent fraud."
    },
    {
      title: "11) Policy updates",
      content: "The professional framework and procedures are updated quarterly (current: B5). The version published on the site is the binding version."
    }
  ];

  const policyPoints = language === 'he' ? policyPointsHe : policyPointsEn;
  const pageTitle = language === 'he' ? 'מדיניות ביטולים – Ventura-107' : 'Cancellation & Refund Policy — AVENTURA 107 (B5)';
  const version = language === 'he' ? 'גרסה: v5.7-LTS' : 'Version: B5';
  const contactInfo = language === 'he' ? 'ליצירת קשר בנושא ביטולים: support@aventura107.com' : 'Contact for cancellations/refunds: support@aventura107.com';

  return (
    <div className="min-h-screen bg-slate-50" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
            <Shield className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">{pageTitle}</h1>
          <p className="text-md text-slate-500 mt-2">{version}</p>
          <p className="text-sm text-slate-600 mt-3">{contactInfo}</p>
        </div>
      </header>
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {policyPoints.map((point, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-600" />
                    {point.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{point.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}