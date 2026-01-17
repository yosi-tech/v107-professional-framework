import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail } from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";

export default function PrivacyPolicy() {
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
            <Shield className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            {isHebrew ? 'מדיניות פרטיות' : 'Privacy Policy'}
          </h1>
          <p className="text-md text-slate-500 mt-2">
            {isHebrew ? 'עדכון אחרון: ינואר 2026' : 'Last updated: January 2026'}
          </p>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'}`}>
              {isHebrew 
                ? 'להלן יפורט תהליך איסוף, שמירה ושימוש בנתונים אישיים שנאספים באמצעות שאלון 107 השאלות.'
                : 'Below is the process of collecting, storing and using personal data collected through the 107-question questionnaire.'}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">{isHebrew ? 'מטרת המדיניות' : 'Purpose of the Policy'}</CardTitle>
            </CardHeader>
            <CardContent className={`p-6 ${isHebrew ? 'text-right' : 'text-left'}`}>
              <p className="text-slate-700 leading-relaxed">
                {isHebrew 
                  ? 'מטרתה של מדיניות פרטית זו ("מדיניות" ו/או "מדיניות הפרטיות") היא להסביר, ליידע ולהבהיר כיצד אנו אוספים, משתמשים, שומרים ומנהלים מידע אישי שאתה מוסר לנו או שנאסף במהלך השימוש שלך בשירותים שלנו דרך האתר של החברה.'
                  : 'The purpose of this privacy policy ("Policy" and/or "Privacy Policy") is to explain, inform and clarify how we collect, use, store and manage personal information you provide to us or that is collected during your use of our services through the company\'s website.'}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {isHebrew ? 'א. איסוף נתונים והסכמה' : 'A. Data Collection and Consent'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'} space-y-4`}>
                  <p>בעת השימוש באתר ובשירותים שלנו, אנו עשויים לאסוף עליך שני סוגי מידע בהקשר לשירותים הניתנים, סוגי המידע הם מידע אישי ומידע שאינו אישי. איסוף המידע כולל מידע שאתה מסרת על פי החלטתך ומרצונך החופשי.</p>
                  
                  <p><strong>"מידע שאינו אישי"</strong> – מתייחס לנתונים שאינם מזהים אותך באופן אישי ואינם מאפשרים ליצור עמך קשר. מדובר לרוב במידע טכני או סטטיסטי, כגון סוג המכשיר שבו השתמשת, מערכת ההפעלה, דפי האתר ו/או האפליקציה שבהם ביקרת, משך השהייה שלך בכל עמוד ועוד'.</p>
                  
                  <p><strong>"מידע אישי"</strong> – מתייחס לכל נתון הנוגע לאדם מזוהה או לאדם הניתן לזיהוי, מי שניתן לזהותו במאמץ סביר, במישרין או בעקיפין ובכלל זה באמצעות פרט מזהה, כגון שם, מספר זהות, מזהה ביומטרי, נתוני מיקום, מזהה מקוון, או נתון אחד או יותר הנוגע למצבו הפיזי, הבריאותי, הכלכלי, החברתי או התרבותי.</p>
                  
                  <div className="mr-6">
                    <p className="mb-2">מידע זה עשוי להתקבל בהסכמתך, ביודעין כשאתה מקבל את השירותים, וכן בהתאם להנחיותיו של ספק שירותי הבריאות שלך, כדוגמת:</p>
                    <ul className="list-disc mr-6 space-y-1">
                      <li>פרטי קשר - למשל, שמך המלא, כתובת פיזית, מספרי טלפון, כתובת דוא"ל.</li>
                      <li>מידע דמוגרפי - למשל, גיל, מגדר.</li>
                      <li>נתוני מיקום.</li>
                      <li>נתוני שימוש - למשל, סוג המכשיר שאתה משתמש בו, כתובת IP, זמני גישה, סוג הדפדפן, ספק שירותי האינטרנט (ISP), דפים שנצפו, כתובת ה-URL של הדף שצפית בו לפני השימוש בשירות.</li>
                      <li>התכתבויות או כל אינטראקציה שלך עם החברה.</li>
                    </ul>
                  </div>
                  
                  <p>המידע ייאסף על בסיס מידע שמסרת מרצונך החופשי, וכן יתבצע איסוף מידע באמצעות "עוגיות" (cookies). אנו עושים שימוש בקובצי עוגיות ("Cookies") לצורך תפעולו השוטף והתקין של האתר ו/או האפליקציה, וכן על מנת לאפשר את אספקת השירותים עבורך.</p>
                  
                  <p><strong>הסכמה מפורשת:</strong> הלקוח חייב לסמן אישור מפורש שהוא מסכים למדיניות הפרטיות ולתנאי השימוש לפני מילוי השאלון. הלקוח רשאי בכל עת להודיע לנציג החברה האמון על הגנת הפרטיות, כותבת דוא"ל: support@v107.co.il כי הוא מעוניין שפרטיו יימחקו ממאגר החברה.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {isHebrew ? 'ב. כיצד אנו משתמשים במידע?' : 'B. How Do We Use the Information?'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'} space-y-4`}>
                  <p>החברה עשויה להשתמש במידע שנאסף אודותיך כמפורט במסמך מדיניות פרטיות זה למטרה מוגבלת של אספקת השירותים ופונקציות קשורות, או כפי שמתואר באופן ספציפי במדיניות פרטיות זו וכפי שמותר על פי הדין החל. מטרות אלו כוללות מקרים שבהם החברה צריכה לספק או להשלים שירותים שהתבקשו על ידך או עבורך, או כאשר נתת לחברה את הסכמתך המפורשת לכך.</p>
                  
                  <p>המידע שלך עשוי לשמש למגוון מטרות, כולל:</p>
                  <ul className="list-disc mr-6 space-y-1">
                    <li>לספק, לתפעל ולשפר את המוצרים והשירותים.</li>
                    <li>לאפשר את הגישה והשימוש שלך בשירותים ולזהות אותך, כך שנוכל לספק ולמלא את בקשות השירותים שלך, לעבד ולהשלים עסקאות, ולשלוח לך מידע רלוונטי.</li>
                    <li>לשלוח לך התראות טכניות, עדכונים, התראות אבטחה, הודעות תמיכה ומנהליות, ולתקשר איתך באופן שוטף בהתאם לתנאים אלה, כולל מענה להערות, שאלות ובקשות שלך, וכן לספק שירותים ותמיכה ללקוחות בנוגע לשירותים, תכונות, סקרים ומידע נוסף.</li>
                    <li>לנטר ולנתח מגמות, שימוש ופעילויות בקשר לשירותים.</li>
                    <li>להמשיך לפתח, לשפר ולהתאים אישית את השירותים וחוויית המשתמש.</li>
                    <li>להתאים את השירותים עבורך באופן אישי ולשפר את חווית השירות שלך.</li>
                    <li>לקדם את בטיחות ואבטחת המידע והמערכות שלנו.</li>
                    <li>ניהול תביעות ביטוח ורישום ותיעוד בהתאם לנהלים פנימיים.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {isHebrew ? 'ג. שיתוף המידע שלך עם צדדים שלישיים' : 'C. Sharing Your Information with Third Parties'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'}`}>
                  החברה עשויה לשתף את המידע שנאסף אודותיך עם צדדים שלישיים למטרות מוגבלות הקשורות לאספקת השירותים או כפי שמתואר במסמך זה.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {isHebrew ? 'ד. זכות עיון במידע' : 'D. Right to Access Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'}`}>
                  בהתאם לחוק הגנת הפרטיות התשמ"א-1981, כל אדם זכאי לעיין במידע אודותיו, בין אם באופן אישי, באמצעות נציג משפטי מורשה כדין או באמצעות אפוטרופוס.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {isHebrew ? 'ה. זכות תיקון המידע' : 'E. Right to Correct Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'}`}>
                  אם לאחר עיון במידע האישי שלך תמצא כי הוא שגוי, לא שלם, לא ברור או מיושן, תוכל לבקש מאיתנו לתקן את המידע השגוי, ולעדכנו במידע הנכון.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {isHebrew ? 'ו. אבטחת מידע' : 'F. Information Security'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'}`}>
                  ידוע למשתמש כי לא ניתן להבטיח באופן מלא את הסודיות או לאבטח באופן מלא כל תקשורת המועברת אליך או על ידך דרך האינטרנט. עם זאת, במידה ונודע לנו על פרצת אבטחה, נודיע לכל משתמש שנפגע, כדי שיוכל לנקוט בצעדים מונעים מתאימים.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {isHebrew ? 'ז. חוק וסמכות שיפוט' : 'G. Law and Jurisdiction'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'}`}>
                  כל עניין בעל אופי משפטי הנובע מתנאים אלו או הקשור בהם, יידון על פי דין ישראל, ולבתי המשפט בתל אביב יפו, תהא סמכות השיפוט הבלעדית לדון בכל סכסוך כאמור.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-slate-100 rounded-lg p-6">
            <h3 className={`font-bold text-lg text-slate-800 mb-4 ${isHebrew ? 'text-right' : 'text-left'}`}>
              {isHebrew ? 'פרטי התקשרות' : 'Contact Details'}
            </h3>
            <div className={`text-slate-700 space-y-2 ${isHebrew ? 'text-right' : 'text-left'}`}>
              <p><strong>{isHebrew ? 'שם חברה מלא:' : 'Full Company Name:'}</strong> V107</p>
              <p><strong>{isHebrew ? 'מספר עוסק:' : 'Business Number:'}</strong> 054095377</p>
              <p><strong>{isHebrew ? 'כתובת פיזית:' : 'Physical Address:'}</strong> {isHebrew ? 'רחוב הברזל 34 תל אביב יפו' : 'HaBarzel Street 34, Tel Aviv-Yafo'}</p>
              <div className="space-y-2">
                <div className={`flex items-center ${isHebrew ? 'justify-end' : 'justify-start'} gap-2`}>
                  {isHebrew && (
                    <>
                      <a href="mailto:support@v107.co.il" className="text-blue-600 hover:text-blue-800 underline">
                        support@v107.co.il
                      </a>
                      <span>:</span>
                      <span className="font-medium">מייל שירות</span>
                      <Mail className="w-5 h-5 text-amber-600" />
                    </>
                  )}
                  {!isHebrew && (
                    <>
                      <Mail className="w-5 h-5 text-amber-600" />
                      <span className="font-medium">Service Email:</span>
                      <a href="mailto:support@v107.co.il" className="text-blue-600 hover:text-blue-800 underline">
                        support@v107.co.il
                      </a>
                    </>
                  )}
                </div>
                <p><strong>{isHebrew ? 'טלפון:' : 'Phone:'}</strong> <a href="tel:0552134848" className="text-blue-600 hover:text-blue-800 underline">055-2134848</a></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}