import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ExternalLink } from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";

export default function Accessibility() {
  const { language } = useTranslation();
  const isHebrew = language === 'he';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-50" dir={isHebrew ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
            <Users className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            הסדרי נגישות
          </h1>
          <p className="text-md text-slate-500 mt-2">
            עדכון אחרון: ינואר 2026
          </p>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mb-8">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">מבוא</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-right">
              <div className="text-slate-700 leading-relaxed space-y-4">
                <p>האינטרנט מהווה כיום את המאגר הגדול ביותר לחופש המידע עבור כלל המשתמשים, ומשתמשים בעלי מוגבלויות בפרט. ככזה, אנו שמים חשיבות רבה במתן אפשרות שווה לאנשים עם מוגבלות לשימוש במידע המוצג באתר, ולאפשר חווית גלישה טובה יותר.</p>
                <p>אנו שואפים להבטיח כי השירותים הדיגיטליים יהיו נגישים לאנשים עם מוגבלויות, ועל כן הושקעו משאבים רבים להקל את השימוש באתר עבור אנשים עם מוגבלויות, ככל האפשר, מתוך אמונה כי לכל אדם מגיעה הזכות לחיות בשוויון, כבוד, נוחות ועצמאות.</p>
                <p>כדי לממש הבטחה זו, אנו שואפים לדבוק ככל האפשר בהמלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA ומסמך WCAG2.1 הבינלאומי.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">כיצד עובדת ההנגשה באתר?</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-right">
              <div className="text-slate-700 leading-relaxed space-y-4">
                <p>באתר מוצב תפריט הנגשה של חברת הנגשת אתרים - נגיש בקליק. לחיצה על כפתור הנגישות מאפשרת את פתיחת התפריט המכיל כפתורי ההנגשה. לאחר בחירת נושא בתפריט יש להמתין לטעינת הדף.</p>
                <p>התוכנה פועלת בדפדפנים הפופולריים: Chrome, Firefox, Safari, Opera. אחריות השימוש והיישום באתר חלה על בעלי האתר ו/או מי מטעמו לרבות התוכן המוצג באתר בכפוף למגבלות ולתנאי השימוש בתוכנה ו-מדיניות הפרטיות של היצרן.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">אפשרויות הנגישות בתפריט</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-right">
              <ul className="text-slate-700 leading-relaxed space-y-2 list-disc mr-6">
                <li>התאמה לניווט מקלדת - מתן אפשרות לניווט על ידי מקלדת.</li>
                <li>התאמה לקורא מסך - התאמר האתר עבור טכנולוגיות מסייעות כגון NVDA, JAWS</li>
                <li>חסימת הבהובים - עצירת אלמנטים נעים וחסימת הבהובים</li>
                <li>זיהוי תווים אופטי</li>
                <li>הגדלת פונט האתר ל־5 גדלים שונים</li>
                <li>פקודות קוליות</li>
                <li>התאמת ניגודיות - שינוי ניגודיות צבעים על בסיס רקע כהה</li>
                <li>התאמת ניגודיות - שינוי ניגודיות צבעים על בסיס רקע בהיר</li>
                <li>שינוי צבעי האתר - רקע האתר, כותרות ותוכן</li>
                <li>התאמת אתר לעיוורי צבעים</li>
                <li>שינוי פונטים לפונט קריא</li>
                <li>הגדלת הסמן ושינוי צבעו לשחור או לבן</li>
                <li>הגדלת התצוגה לכ־200%</li>
                <li>הדגשת קישורים באתר</li>
                <li>הדגשת כותרות באתר</li>
                <li>הצגת תיאור אלטרנטיבי לתמונות</li>
                <li>הגדלת התוכן שנבחר על ידי הסמן, מוצג בחלונית הסברה</li>
                <li>מציג את תוכן האתר בחלון חדש בצורה ברורה וקריאה</li>
                <li>מאפשר למשתמשים להקליט תוכן באמצעות העכבר</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">שימוש ברכיבים ואתרי צד שלישי</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-right">
              <div className="text-slate-700 leading-relaxed space-y-4">
                <p>כאשר נעשה שימוש ברכיבים או אתרי אינטרנט של צד שלישי באתר כגון פייסבוק, אינסטגרם, יוטיוב, טוויטר, צ`אטים חיצוניים ואחרים שאינם בשליטתנו, ייתכן והדבר יציב אתגרים בשימוש באתר בידי אנשים בעלי מוגבלויות שאין ביכולתנו לתקן.</p>
                <p className="font-semibold">להלן מספר דוגמאות למדיניות הנגישות באתרי צד שלישי:</p>
                <ul className="space-y-2">
                  <li>
                    <a href="https://www.facebook.com/help/accessibility" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2 justify-end">
                      <ExternalLink className="w-4 h-4" />
                      מדיניות הנגישות של פייסבוק
                    </a>
                  </li>
                  <li>
                    <a href="https://support.google.com/youtube/topic/9257107" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2 justify-end">
                      <ExternalLink className="w-4 h-4" />
                      מדיניות הנגישות של יוטיוב
                    </a>
                  </li>
                  <li>
                    <a href="https://help.instagram.com/354483065096842" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2 justify-end">
                      <ExternalLink className="w-4 h-4" />
                      מדיניות הנגישות של אינסטגרם
                    </a>
                  </li>
                  <li>
                    <a href="https://help.twitter.com/en/using-twitter/accessibility" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2 justify-end">
                      <ExternalLink className="w-4 h-4" />
                      מדיניות הנגישות של טוויטר
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/accessibility" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2 justify-end">
                      <ExternalLink className="w-4 h-4" />
                      מדיניות הנגישות של לינקדאין
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">פניה לרכז הנגישות</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-right">
              <div className="text-slate-700 leading-relaxed space-y-4">
                <p>אם במהלך הגלישה באתר נתקלתם בקושי בנושא נגישות, צוות הנגישות של החברה עומד לרשותכם במגוון ערוצים לפנייה בנושאי נגישות, נשמח לקבל מכם משוב.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="font-semibold mb-2">פרטי התקשרות:</p>
                  <p><strong>שם החברה:</strong> V107</p>
                  <p><strong>אימייל:</strong> <a href="mailto:support@v107.co.il" className="text-blue-600 hover:text-blue-800 underline">support@v107.co.il</a></p>
                  <p><strong>טלפון:</strong> <a href="tel:0552134848" className="text-blue-600 hover:text-blue-800 underline">055-2134848</a></p>
                  <p><strong>כתובת:</strong> הברזל 34, תל אביב יפו</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">הבהרה</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-right">
              <div className="text-slate-700 leading-relaxed space-y-4">
                <p>חרף מאמצנו לאפשר גלישה באתר נגיש עבור כל דפי האתר, יתכן ויתגלו דפים באתר שטרם הונגשו, או שטרם נמצא הפתרון הטכנולוגי המתאים.</p>
                <p>אנו ממשיכים במאמצים לשפר את נגישות האתר, ככל האפשר, וזאת מתוך אמונה ומחויבות מוסרית לאפשר שימוש באתר לכלל האוכלוסייה לרבות אנשים עם מוגבלויות.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}