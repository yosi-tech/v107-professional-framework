import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail } from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";

export default function TermsOfService() {
  const { language } = useTranslation();
  const isHebrew = language === 'he';
  
  return (
    <div className="min-h-screen bg-slate-50" dir={isHebrew ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
            <FileText className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            {isHebrew ? 'תקנון ותנאי שימוש' : 'Terms of Service'}
          </h1>
          <p className="text-md text-slate-500 mt-2">
            {isHebrew ? 'עדכון אחרון: דצמבר 2025' : 'Last updated: December 2025'}
          </p>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'}`}>
              {isHebrew 
                ? 'ברוכים הבאים לאתר V107. אנא קרא את התנאים הללו בעיון. השימוש באתר ובשירותים מהווה הסכמה מלאה לתנאים אלה.'
                : 'Welcome to the V107 website. Please read these terms carefully. Use of the site and services constitutes full agreement to these terms.'}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">{isHebrew ? 'פרטי החברה' : 'Company Details'}</CardTitle>
            </CardHeader>
            <CardContent className={`p-6 ${isHebrew ? 'text-right' : 'text-left'}`}>
              <div className="space-y-2 text-slate-700">
                <p><strong>{isHebrew ? 'שם החברה:' : 'Company Name:'}</strong> V107</p>
                <p><strong>{isHebrew ? 'עוסק מורשה:' : 'Licensed Business:'}</strong> 054095376</p>
                <p><strong>{isHebrew ? 'כתובת:' : 'Address:'}</strong> {isHebrew ? 'הברזל 34 תל אביב' : 'HaBarzel 34, Tel Aviv'}</p>
                <p><strong>{isHebrew ? 'אתר אינטרנט:' : 'Website:'}</strong> <a href="http://www.v107.co.il" className="text-blue-600 hover:underline">www.v107.co.il</a></p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-600" />
                  {isHebrew ? 'א. כללי' : 'A. General'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'} space-y-4`}>
                  {isHebrew ? (
                    <>
                      <p>אנא קרא את התנאים הללו בעיון. אם אינך מסכים להם במלואם – הפסק מיד את השימוש בשירות. תנאים אלה יוצרים הסכם משפטי מחייב בינך/כם (להלן: "אתה/אתם", "המשתמש/ים", "שלך/שלכם") לבין החברה.</p>
                      <p>החברה שומרת לעצמה את הזכות לשנות את התנאים, מעת לעת, על ידי פרסום עדכונים באתר. החברה תעשה מאמצים סבירים לוודא שכל שינוי בתנאים כאמור יובא לידיעתך זמן סביר לפני כניסתם לתוקף. המשך השימוש שלך בשירותים לאחר כניסתם לתוקף של התנאים המעודכנים ייחשב כהסכמה שלך לתנאים אלה. אם אינך מסכים לתנאים המעודכנים, עליך להפסיק מיד כל שימוש בשירותים.</p>
                      <p>לצורכי נוחות בלבד, תנאי השימוש ומדיניות פרטיות אלו מנוסחים בלשון זכר, אך מתייחסים לכל המגדרים באופן שווה.</p>
                      <p>תקנון זה מסדיר את תנאי השימוש באתר ואת תנאי רכישת הדו"ח האישי V107 והמוצר הנלווה V107 Booster (להלן: "השירותים והמוצרים"). כל רכישה באתר מהווה הסכמה מלאה לתנאי תקנון זה ולמדיניות הפרטיות.</p>
                    </>
                  ) : (
                    <>
                      <p>Please read these terms carefully. If you do not agree to them in full - immediately stop using the service. These terms create a binding legal agreement between you (hereinafter: "you", "the user", "your") and the company.</p>
                      <p>The company reserves the right to change the terms from time to time by posting updates on the site. The company will make reasonable efforts to ensure that any change in the terms is brought to your attention a reasonable time before they take effect. Your continued use of the services after the updated terms take effect will be considered your agreement to these terms. If you do not agree to the updated terms, you must immediately stop all use of the services.</p>
                      <p>For convenience only, these terms of use and privacy policy are written in masculine language, but refer to all genders equally.</p>
                      <p>This regulation governs the terms of use of the site and the terms of purchase of the V107 personal report and the V107 Booster accompanying product (hereinafter: "the services and products"). Any purchase on the site constitutes full agreement to the terms of this regulation and the privacy policy.</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-600" />
                  {isHebrew ? 'ב. הדו"ח האישי V107 ואחריות' : 'B. V107 Personal Report and Liability'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'} space-y-4`}>
                  {isHebrew ? (
                    <>
                      <p><strong>1.</strong> הדו"ח האישי V107 מופק על בסיס 107 התשובות שנמסרו על ידי המשתמש ונוצר באמצעות כלי בינה מלאכותית בשילוב פיקוח אנושי של מומחים. המוצרים מופקים בהתבסס על תשובות אלה, ואין בידי החברה כדי לאמת את נכונותן. לאור האמור, ידוע למשתמש כי הפקת המוצרים מתבססת על תשובותיו וכי אין לחברה כל אחריות על המידע שיימסר על ידו, על המידע אשר יופק בהתבסס על התשובות וכי המוצרים נועדו לספק הכוונה מקצועית כללית בלבד.</p>
                      <p><strong>2.</strong> תוכן המוצרים אינו מהווה בשום אופן ייעוץ משפטי, פיננסי, רפואי או מקצועי.</p>
                      <p><strong>3.</strong> השירותים שמציעה החברה אינם מהווים ייעוץ או תחליף לייעוץ משפטי, פיננסי, רפואי או מקצועי, ואינם מהווים המלצה או הצעה לייעוץ כלשהו מטעם החברה. עליך תמיד לפנות לקבלת ייעוץ מקצועי מגורם מוסמך אחר לפני תחילת כל פעולה בעניין המוצרים.</p>
                      <p><strong>4.</strong> בעוד שהשירות עשוי להציע לך מידע או להקל על קבלת ההחלטות שלך, הוא אינו מהווה תחליף לשיקול דעתו המקצועי של יועץ מטעמך, בכל אחד מהתחומים המנויים לעיל.</p>
                      <p><strong>5. הגבלת אחריות:</strong> החברה אינה אחראית לכל נזק, הפסד או שינוי עסקי/אישי שיגרם למשתמש כתוצאה מהשימוש או הסתמכות על התוכן שבמוצרים וכל צעד שייעשה בעקבות שימוש במוצרים הוא באחריותו הבלעדית של המשתמש.</p>
                    </>
                  ) : (
                    <>
                      <p><strong>1.</strong> The V107 personal report is generated based on 107 answers provided by the user and created using artificial intelligence tools in combination with expert human supervision. The products are generated based on these answers, and the company has no way to verify their accuracy. In light of this, the user is aware that the production of the products is based on his answers and that the company has no responsibility for the information provided by him, for the information generated based on the answers, and that the products are intended to provide general professional guidance only.</p>
                      <p><strong>2.</strong> The content of the products does not constitute legal, financial, medical or professional advice in any way.</p>
                      <p><strong>3.</strong> The services offered by the company do not constitute advice or a substitute for legal, financial, medical or professional advice, and do not constitute a recommendation or offer for any advice on behalf of the company. You should always seek professional advice from another qualified source before starting any action regarding the products.</p>
                      <p><strong>4.</strong> While the service may offer you information or facilitate your decision-making, it is not a substitute for the professional judgment of an advisor on your behalf, in any of the areas listed above.</p>
                      <p><strong>5. Limitation of Liability:</strong> The company is not responsible for any damage, loss or business/personal change that may be caused to the user as a result of using or relying on the content in the products and any step taken following the use of the products is the sole responsibility of the user.</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-600" />
                  {isHebrew ? 'ג. אספקה ומדיניות ביטול' : 'C. Delivery and Cancellation Policy'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className={`text-slate-700 leading-relaxed ${isHebrew ? 'text-right' : 'text-left'} space-y-4`}>
                  {isHebrew ? (
                    <>
                      <p><strong>1. התחייבות אספקה:</strong> החברה מתחייבת לאספקת הדו"ח האישי (V107) בתוך 5 ימי עסקים מרגע השלמת התשלום ומילוי שאלון 107 הנקודות.</p>
                      <p><strong>2. ביטול עסקה:</strong> מאחר שייצור הדו"ח הוא שירות דיגיטלי הניתן בהתאמה אישית, מרגע שהושלם התשלום והתשובות הועברו לניתוח AI וניתוח אנושי לא יינתן החזר כספי. מדיניות ביטול לפני תחילת עבודת הייצור תפעל בהתאם לחוק הגנת הצרכן.</p>
                      <p><strong>3. חריג למוצר הנלווה (V107 Booster):</strong> על אף האמור לעיל בדבר אי-החזר כספי בגין שירותי מידע, מובהר כי המודל העסקי של המוצר הנלווה 'V107 Booster' מבוסס על עקרון 'הצלחה מותנית' (מודל 'לא שיפרת – לא שילמת'). לפיכך, החיוב בפועל בגין מוצר זה ו/או זכאות המשתמש להחזר כספי מלא, יהיו כפופים לדיווח המשתמש אודות שביעות רצונו או השיפור שהושג, וזאת בהתאם למנגנון ולתנאים הספציפיים שיוצגו למשתמש במעמד הצעת הרכישה של הבוסטר. במקרה בו המשתמש יפעל בהתאם לתנאי המודל וידווח כי לא חל שיפור, לא יחולו עליו דמי ביטול והוא יהיה זכאי לפטור מתשלום או להחזר מלא, בהתאם למקרה.</p>
                    </>
                  ) : (
                    <>
                      <p><strong>1. Delivery Commitment:</strong> The company commits to delivering the personal report (V107) within 5 business days from the moment of payment completion and filling out the 107-point questionnaire.</p>
                      <p><strong>2. Transaction Cancellation:</strong> Since the production of the report is a digital service provided in a personalized manner, once payment is completed and the answers have been transferred for AI and human analysis, no refund will be given. The cancellation policy before the start of production work will operate in accordance with consumer protection law.</p>
                      <p><strong>3. Exception for the Accompanying Product (V107 Booster):</strong> Despite the above regarding non-refunds for information services, it is clarified that the business model of the 'V107 Booster' accompanying product is based on the principle of 'conditional success' (the 'no improvement - no payment' model). Therefore, the actual charge for this product and/or the user's eligibility for a full refund will be subject to the user's report on their satisfaction or the improvement achieved, according to the mechanism and specific conditions that will be presented to the user when purchasing the booster. In the event that the user acts in accordance with the terms of the model and reports that no improvement has occurred, no cancellation fees will apply and they will be entitled to a waiver of payment or a full refund, as appropriate.</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-600" />
                  ד. מנגנון הצעת המבצע – 60 דקות
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-slate-700 leading-relaxed text-right space-y-4">
                  <p><strong>1.</strong> בסמוך לשליחת הדו"ח הסופי, תוצג למשתמש הצעה לרכישת המוצר הנלווה (V107 Booster) במחיר מבצע.</p>
                  <p><strong>2. תוקף המבצע:</strong> הצעת המבצע תקפה למשך 60 דקות בלבד מרגע שליחת הדו"ח הסופי. לאחר פקיעת 60 הדקות, מחיר המבצע יבוטל אוטומטית והלקוח יוכל לרכוש את הדו"ח במחיר מלא של 249 ₪</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-600" />
                  ה. זכויות קניין רוחני; סודיות
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-slate-700 leading-relaxed text-right space-y-4">
                  <p>כל הזכויות, הבעלות והאינטרסים בשירותים, לרבות כל רכיב גרפי, עיצובי, טקסטואלי, ויזואלי או קולי, לרבות סידורם, בחירתם, עיבודם או הצגתם, וכן כל קוד, תכונה, פונקציונליות או טכנולוגיה הכלולים בהם (למעט תוכן משתמש), שייכים ויישארו בבעלות הבלעדית של החברה.</p>
                  <p>כל שימוש מסחרי, נגזר או אחר בשירותים או בתוכנם, מחייב קבלת אישור מראש ובכתב מהחברה.</p>
                  <p>מובהר כי החברה אינה רוכשת כל בעלות על תוכן המשתמש, והוא נותר בבעלותך המלאה. עם זאת, בעצם העלאת תוכן המשתמש לשירות, אתה מעניק לחברה רישיון לא בלעדי, עולמי, ללא תמלוגים, לגשת לתוכן זה, להשתמש בו, לאחסן אותו, לשכפל אותו, להציגו ולנתחו – אך ורק בהתאם לפונקציונליות של השירות, לתנאים אלה ולמדיניות הפרטיות של החברה.</p>
                  <p>הסימנים המסחריים, הלוגואים, שמות דומיין וכל סימן, סמליל או סמל דומה אחר המוצגים כחלק מהשירות הם סימנים רשומים ולא רשומים של החברה. שום דבר בתנאים אלה אינו מעניק לך זכות לעשות שימוש כלשהו בסימנים אלה.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-600" />
                  ו. פרטיות ומידע אישי
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-slate-700 leading-relaxed text-right space-y-4">
                  <p>במסגרת מתן השירותים, החברה עשויה לנטר, לאסוף, להשתמש ולאחסן נתונים אנונימיים וסטטיסטיים מצטברים הנוגעים לשימוש בשירותים ו/או כל אינטראקציה של יחידים או ישויות עם השירות (ביחד, "נתוני שימוש").</p>
                  <p>על ידי הסכמתך לתנאים אלה, אתה מעניק בזאת לחברה ולחברות הקשורות אליה, רישיון בינלאומי, בלתי מוגבל, בלתי הפיך וללא תמלוגים להשתמש בנתוני השימוש למטרות לגיטימיות כפי שמפורט מטה במדיניות הפרטיות שלנו.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-xl">מדיניות פרטיות</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-slate-700 leading-relaxed text-right space-y-6">
                  <p>להלן יפורט תהליך איסוף, שמירה ושימוש בנתונים אישיים שנאספים באמצעות שאלון 107 השאלות.</p>
                  <p>מטרתה של מדיניות פרטית זו ("מדיניות" ו/או "מדיניות הפרטיות") היא להסביר, ליידע ולהבהיר כיצד אנו אוספים, משתמשים, שומרים ומנהלים מידע אישי שאתה מוסר לנו או שנאסף במהלך השימוש שלך בשירותים שלנו דרך האתר של החברה.</p>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">א. איסוף נתונים והסכמה</h3>
                    <p className="mb-3">בעת השימוש באתר ובשירותים שלנו, אנו עשויים לאסוף עליך שני סוגי מידע בהקשר לשירותים הניתנים, סוגי המידע הם מידע אישי ומידע שאינו אישי. איסוף המידע כולל מידע שאתה מסרת על פי החלטתך ומרצונך החופשי.</p>
                    <p className="mb-3"><strong>"מידע שאינו אישי"</strong> – מתייחס לנתונים שאינם מזהים אותך באופן אישי ואינם מאפשרים ליצור עמך קשר. מדובר לרוב במידע טכני או סטטיסטי, כגון סוג המכשיר שבו השתמשת, מערכת ההפעלה, דפי האתר ו/או האפליקציה שבהם ביקרת, משך השהייה שלך בכל עמוד ועוד'.</p>
                    <p className="mb-3"><strong>"מידע אישי"</strong> – מתייחס לכל נתון הנוגע לאדם מזוהה או לאדם הניתן לזיהוי, מי שניתן לזהותו במאמץ סביר, במישרין או בעקיפין ובכלל זה באמצעות פרט מזהה, כגון שם, מספר זהות, מזהה ביומטרי, נתוני מיקום, מזהה מקוון, או נתון אחד או יותר הנוגע למצבו הפיזי, הבריאותי, הכלכלי, החברתי או התרבותי.</p>
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
                    <p className="mt-3">המידע ייאסף על בסיס מידע שמסרת מרצונך החופשי, וכן יתבצע איסוף מידע באמצעות "עוגיות" (cookies). אנו עושים שימוש בקובצי עוגיות ("Cookies") לצורך תפעולו השוטף והתקין של האתר ו/או האפליקציה, וכן על מנת לאפשר את אספקת השירותים עבורך.</p>
                    <p className="mt-3"><strong>הסכמה מפורשת:</strong> הלקוח חייב לסמן אישור מפורש שהוא מסכים למדיניות הפרטיות ולתנאי השימוש לפני מילוי השאלון. הלקוח רשאי בכל עת להודיע לנציג החברה האמון על הגנת הפרטיות, גב' דורית/אחר כותבת דוא"ל: support@v107.co.il כי הוא מעוניין שפרטיו יימחקו ממאגר החברה.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">ב. כיצד אנו משתמשים במידע?</h3>
                    <p className="mb-3">החברה עשויה להשתמש במידע שנאסף אודותיך כמפורט במסמך מדיניות פרטיות זה למטרה מוגבלת של אספקת השירותים ופונקציות קשורות, או כפי שמתואר באופן ספציפי במדיניות פרטיות זו וכפי שמותר על פי הדין החל. מטרות אלו כוללות מקרים שבהם החברה צריכה לספק או להשלים שירותים שהתבקשו על ידך או עבורך, או כאשר נתת לחברה את הסכמתך המפורשת לכך.</p>
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

                  <div>
                    <h3 className="font-bold text-lg mb-2">ג. שיתוף המידע שלך עם צדדים שלישיים</h3>
                    <p className="mb-3">החברה עשויה לשתף את המידע שנאסף אודותיך עם צדדים שלישיים למטרות מוגבלות הקשורות לאספקת השירותים או כפי שמתואר במסמך זה.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">ד. זכות עיון במידע</h3>
                    <p>בהתאם לחוק הגנת הפרטיות התשמ"א-1981, כל אדם זכאי לעיין במידע אודותיו, בין אם באופן אישי, באמצעות נציג משפטי מורשה כדין או באמצעות אפוטרופוס.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">ה. זכות תיקון המידע</h3>
                    <p>אם לאחר עיון במידע האישי שלך תמצא כי הוא שגוי, לא שלם, לא ברור או מיושן, תוכל לבקש מאיתנו לתקן את המידע השגוי, ולעדכנו במידע הנכון.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">ו. אבטחת מידע</h3>
                    <p>ידוע למשתמש כי לא ניתן להבטיח באופן מלא את הסודיות או לאבטח באופן מלא כל תקשורת המועברת אליך או על ידך דרך האינטרנט. עם זאת, במידה ונודע לנו על פרצת אבטחה, נודיע לכל משתמש שנפגע, כדי שיוכל לנקוט בצעדים מונעים מתאימים.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">ז. חוק וסמכות שיפוט</h3>
                    <p>כל עניין בעל אופי משפטי הנובע מתנאים אלו או הקשור בהם, יידון על פי דין ישראל, ולבתי המשפט בתל אביב יפו, תהא סמכות השיפוט הבלעדית לדון בכל סכסוך כאמור.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-xl">הצהרת גילוי נאות (AI ואחריות מקצועית)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-slate-700 leading-relaxed text-right space-y-4">
                  <h3 className="font-bold text-lg">גילוי נאות (AI)</h3>
                  <ol className="list-decimal mr-6 space-y-2">
                    <li>הדו"ח האישי V107 והמוצר הנלווה V107 Booster נוצרו, עובדו והונפקו באמצעות כלי בינה מלאכותית שונים בליווי ופיקוח צוות מומחים</li>
                    <li>השימוש בטכנולוגיית AI נועד לספק ניתוח נתונים מהיר ומעמיק.</li>
                    <li>תוקף מקצועי: הדו"ח אינו מהווה תחליף לייעוץ מקצועי ואישי</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-slate-100 rounded-lg p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 text-right">פרטי התקשרות</h3>
            <div className="text-slate-700 space-y-2 text-right">
              <p><strong>שם חברה מלא:</strong> V107</p>
              <p><strong>מספר עוסק:</strong> 054095377</p>
              <p><strong>כתובת פיזית:</strong> רחוב הברזל 34 תל אביב יפו</p>
              <div className="flex items-center justify-end gap-2">
                <a href="mailto:support@v107.co.il" className="text-blue-600 hover:text-blue-800 underline">
                  support@v107.co.il
                </a>
                <span>:</span>
                <span className="font-medium">מייל שירות</span>
                <Mail className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}