import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail } from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";

export default function PrivacyPolicy() {
  const { t, language } = useTranslation();

  const privacyHe = [
    {
      title: "מה אנחנו אוספים",
      content: "שם מלא, דוא״ל, גיל, עיר/מדינה, תשובות לשאלון (Q001–Q107), פרטי רכישה (למשל מזהה עסקה), בחירות רכישה וזרימות: איזו אפשרות נבחרה (₪299, ₪59, שדרוג ₪240, שחזור/נטישה ₪269), מספר תשלומים (אם ישנם), אימיילים למילוי: אימייל הנשאל (שאלון), אימייל המשלם (תשלום)—יכול להיות זהה או שונה, אירועי משפך: צעדי שאלון שהתחילו/ננטשו (להצעות שחזור תפעוליות), נתוני שימוש באתר (כולל עוגיות/פיקסל לצורכי מדידה ושיפור)."
    },
    {
      title: "למה אנחנו משתמשים במידע",
      content: "(1) מילוי לפי סוג מוצר: אספקה מיידית של תשובות בלבד (₪59) לעומת אספקת D+5 לדוחות מלאים.\n(2) תקשורת שדרוג ושחזור: אם קנית תשובות ₪59 בלבד, אנו עשויים לשלוח לך דוא״ל שדרוג מוגבל בזמן (למשל ₪240); אם התחלת ונטשת, אנו עשויים לשלוח דוא״ל הצעת שחזור (₪269) היכן שמותר על פי חוק.\n(3) שיפור מודל: אנו עשויים להשתמש בנתוני תגובה מצטברים/מזוהים כדי לשפר את המסגרת; איננו מוכרים נתונים אישיים.\n(4) שירות ותמיכה.\n(5) עמידה בדרישות חוק."
    },
    {
      title: "בסיס חוקי",
      content: "קיום חוזה (אספקת שירות), הסכמה (למדידה/שיווק), אינטרס לגיטימי (אבטחה, שיפור)."
    },
    {
      title: "שיתוף ומעבדים",
      content: "עיבוד תשלומים (למשל Tranzila/HYP), אחסון/גיליונות ענן (למשל Google Workspace/Sheets/Drive), כלי אנליטיקה/מודעות (Meta Pixel, GA4), וכלי מסירת דוא״ל. המעבדים מועסקים תחת חובות הגנת נתונים ומשתמשים בנתונים אך ורק כדי לספק את השירות. מידע משותף רק לצורך תפעול השירות."
    },
    {
      title: "שמירה",
      content: "רישומים עסקיים נשמרים כנדרש על פי חוק. נתוני שאלון ודוחות נשמרים עבור היסטוריית שירות ואבטחת איכות, ולאחר מכן נמחקים או מאנונימיים. ניתן לבקש מחיקה בכפוף לדרישות משפטיות וחשבונאיות."
    },
    {
      title: "אבטחה",
      content: "נוקטים באמצעי אבטחה סבירים."
    },
    {
      title: "זכויות משתמשים",
      content: "זכות לעיון/תיקון/מחיקה (כפוף לדין ולחובת שמירה). בקשות ל־support@aventura107.com."
    },
    {
      title: "שיווק ודיוור",
      content: "אתה יכול לבטל את הסכמתך לדוא״ל קידומי בכל עת (הצעות שדרוג/שחזור), תוך המשך קבלת הודעות תפעוליות (קבלות, אספקה). העדפות עוגיה/פיקסל ניתנות לשליטה דרך הבאנר והדפדפן שלך."
    },
    {
      title: "שינויים במדיניות",
      content: "עדכונים יפורסמו בדף זה."
    }
  ];

  const privacyEn = [
    {
      title: "1. Data We Collect",
      content: "Full name, email, age, city/country, questionnaire responses (Q001–Q107), purchase details (e.g., transaction ID), purchase choices & flows: which option was selected (₪299, ₪59, upgrade ₪240, recovery/abandonment ₪269), number of installments (if any), emails for fulfillment: respondent email (questionnaire), payer email (payment)—may be the same or different, funnel events: started/abandoned questionnaire steps (for operational recovery offers), site usage data (including cookies/pixels for measurement and improvement)."
    },
    {
      title: "2. How We Use Personal Data",
      content: "(1) Fulfillment by product type: immediate delivery of answers-only (₪59) vs. D+5 delivery for full reports.\n(2) Upgrade & recovery communications: if you bought ₪59 answers-only, we may email you a limited-time upgrade (e.g., ₪240); if you started and abandoned, we may email a recovery offer (₪269) where permitted by law.\n(3) Model improvement: we may use aggregated/de-identified response data to improve the framework; we do not sell personal data.\n(4) Service and support.\n(5) Legal compliance."
    },
    {
      title: "3. Legal Basis",
      content: "Contract fulfillment (service delivery), consent (for measurement/marketing), legitimate interest (security, improvement)."
    },
    {
      title: "4. Sharing & Processors",
      content: "Payment processing (e.g., Tranzila/HYP), hosting/storage and productivity (e.g., Google Workspace/Sheets/Drive), analytics/ads (Meta Pixel, GA4), and email delivery tools. Processors are engaged under data-protection obligations and use the data solely to provide the Service."
    },
    {
      title: "5. Retention",
      content: "Transactional records are retained as required by law. Questionnaire data and reports are retained for service history and quality assurance, and then deleted or anonymized. You may request deletion subject to legal and accounting requirements."
    },
    {
      title: "6. Security",
      content: "We employ reasonable security measures."
    },
    {
      title: "7. Your Rights",
      content: "Right to access/correction/deletion (subject to law and retention obligations). Requests to support@aventura107.com."
    },
    {
      title: "8. Marketing & Preferences",
      content: "You can opt out of promotional emails at any time (upgrade/recovery offers), while continuing to receive operational messages (receipts, delivery). Cookie/pixel preferences can be controlled via the banner and your browser."
    },
    {
      title: "9. Policy Changes",
      content: "Updates will be published on this page."
    }
  ];

  const privacy = language === 'he' ? privacyHe : privacyEn;
  const pageTitle = language === 'he' ? 'מדיניות פרטיות (גרסת B5)' : 'Privacy Policy (Version B5)';
  const lastUpdated = language === 'he' ? 'עדכון אחרון: B5' : 'Last updated: B5';
  const contactText = language === 'he' ? 'יצירת קשר:' : 'Contact:';

  return (
    <div className="min-h-screen bg-slate-50" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
            <Shield className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">{pageTitle}</h1>
          <p className="text-md text-slate-500 mt-2">{lastUpdated}</p>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {privacy.map((section, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <Shield className="w-5 h-5 text-amber-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{section.content}</p>
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