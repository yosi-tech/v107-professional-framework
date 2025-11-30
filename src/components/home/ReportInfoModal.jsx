import React from "react";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";

export default function ReportInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
        <div className="sticky top-0 bg-gray-50 border-b p-4 sm:p-6 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">אודות דו"ח AVENTURA 107</h2>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 left-3 sm:relative sm:top-auto sm:left-auto">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">כיצד אנו מנתחים את השאלון?</h3>
            <p className="text-gray-700 leading-relaxed">
              שאלון AVENTURA 107 אינו מסתכם במענה לשאלות בלבד. מאחורי הקלעים פועל תהליך רב־שלבי, המשלב טכנולוגיה מתקדמת עם בקרה אנושית מקצועית.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">1. עיבוד אנליטי</h4>
              <p className="text-gray-700 mt-1 leading-relaxed">
                כל תשובה מנותחת במערכת ייעודית, המצליבה בין תחומי ההשכלה, הניסיון, הכישורים והמוטיבציה. בשלב זה נעשה שימוש בכלים אנליטיים חכמים, כולל AI תומך, המסייע בזיהוי דפוסים וקשרים – אך המסקנות עצמן נשענות על מתודולוגיה מחקרית ועל עיבוד אנושי.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">2. השוואה בינלאומית</h4>
              <p className="text-gray-700 mt-1 leading-relaxed">
                הנתונים מושווים למסד רחב של אלפי יזמים ובעלי עסקים, ומאפשרים להבין היכן את/ה ממוקם/ת ביחס לקבוצת ייחוס עולמית.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">3. בקרת מומחים</h4>
              <p className="text-gray-700 mt-1 leading-relaxed">
                כל דו"ח עובר בקרת איכות אנושית של צוות בינלאומי – בתחומי יזמות, פיננסים, שיווק ופסיכולוגיה ארגונית – המוסיף פרשנות והמלצות פרקטיות.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">4. דו"ח אישי ומעשי</h4>
              <p className="text-gray-700 mt-1 leading-relaxed">
                התוצר הסופי הוא דו"ח מקיף ומדויק, המשלב תובנות אמיתיות עם כיווני פעולה מותאמים.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-xl font-bold text-gray-800 mb-3">מקורות והסתמכויות</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li className="text-gray-700 leading-relaxed">
                המודל נשען על מחקרים ופרסומים בינלאומיים (Harvard Business Review, Journal of Business Venturing, Academy of Management Journal).
              </li>
              <li className="text-gray-700 leading-relaxed">
                עדכון רבעוני של המערכת מתבצע על סמך נתונים חדשים ומחקרים מארה"ב, בריטניה, גרמניה, הודו, ברזיל ומקסיקו.
              </li>
              <li className="text-gray-700 leading-relaxed">
                שילוב של AI תומך ניתוח לצד בקרה אנושית מבטיח דיוק ועדכניות.
              </li>
            </ul>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">לסיכום:</h3>
            <ul className="space-y-3 list-disc pl-5">
              <li className="text-gray-700 leading-relaxed">
                <strong>לממלאי השאלון:</strong> התהליך דיסקרטי, מקצועי ונועד לתת לך כלי אמיתי לצמיחה אישית ועסקית.
              </li>
              <li className="text-gray-700 leading-relaxed">
                <strong>למומחים ומבקרים:</strong> המודל של AVENTURA 107 נשען על מחקר בינלאומי, השוואות גלובליות, ניתוח נתונים חכם ובקרת איכות אנושית קפדנית.
              </li>
            </ul>
            <p className="text-gray-800 font-semibold mt-4 leading-relaxed">
              כך אנו מבטיחים שהדו"ח יהיה אישי, מקצועי – ובעיקר אמיתי ומדויק ככל האפשר.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">סגור</Button>
        </div>
      </div>
    </div>
  );
}