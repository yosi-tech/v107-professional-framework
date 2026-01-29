import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

const questionsHe = [
  // חלק א – רקע והכשרה (1–10)
  "עד כמה את/ה מרגיש/ה שההשכלה הפורמלית שלך נותנת בסיס חזק ליזמות?",
  "עד כמה הקורסים או ההכשרות שעברת רלוונטיים ליזמות ולעסקים?",
  "עד כמה השליטה שלך בשפות תומכת ביכולת לפעול בשווקים בינלאומיים?",
  "עד כמה הניסיון המקצועי המצטבר שלך מכין אותך לניהול עסק עצמאי?",
  "עד כמה את/ה מקבל/ת תמיכה משפחתית או סביבתית לצעד יזמי?",
  "עד כמה מצבך הבריאותי הכללי מאפשר לך לנהל עסק?",
  "עד כמה את/ה מרגיש/ה שיש לך יציבות כלכלית בסיסית שמאפשרת לקחת צעד יזמי?",
  "עד כמה את/ה מקבל/ת עידוד ותמיכה מהסביבה הקרובה (משפחה/חברים)?",
  "עד כמה את/ה יודע/ת להסביר מה מניע אותך להיות עצמאי/ת?",
  "עד כמה הניסיון שלך מהתפקיד הנוכחי מכשיר אותך ליזמות?",
  
  // חלק ב – ניסיון מקצועי וכישורים (11–30)
  "עד כמה יש לך ניסיון משמעותי בתחומים מקצועיים מגוונים?",
  "עד כמה את/ה שולט/ת במיומנויות מקצועיות שיכולות לשמש אותך כיזם/ת?",
  "עד כמה את/ה מיומן/ת בהפעלת כלים וטכנולוגיות עדכניות?",
  "עד כמה ההישגים המקצועיים שלך מעידים על יכולת להצליח ביזמות?",
  "עד כמה את/ה מרגיש/ה בנוח לנהל או לעבוד בצוות?",
  "עד כמה הניסיון שלך ביזמות או בניהול עסק קודם משמעותי?",
  "עד כמה את/ה מנוסה בניהול תקציבים וכספים?",
  "עד כמה את/ה מנוסה בשיווק ומכירות?",
  "עד כמה את/ה מנוסה בתפעול ובשירות לקוחות?",
  "עד כמה את/ה מנוסה בפיתוח מוצרים או שירותים חדשים?",
  "עד כמה את/ה מתנסה בקבלת החלטות תחת אי־ודאות?",
  "עד כמה יש לך ניסיון במשא ומתן עסקי?",
  "עד כמה את/ה מנוסה בבניית שותפויות עסקיות?",
  "עד כמה יש לך ניסיון בעבודה עם גורמים בינלאומיים?",
  "עד כמה את/ה מנוסה בניהול עובדים ובהובלת צוותים?",
  "עד כמה צברת ניסיון בניהול פרויקטים מורכבים?",
  "עד כמה את/ה מנוסה בגיוס הון ממשקיעים/גופים פיננסיים?",
  "עד כמה את/ה מנוסה בהטמעת טכנולוגיות חדשות בעסק?",
  "עד כמה יש לך ניסיון בהובלת תהליכי שינוי בארגון/עסק?",
  "עד כמה הישגיך בעבר מעידים על התמדה מול קשיים?",
  
  // חלק ג – תחומי עניין, משאבים ומוטיבציה (31–60)
  "עד כמה ברור לך באילו תחומים עסקיים היית רוצה לפעול?",
  "עד כמה חשוב לך שהתחום שבו תפעל/י יהיה בעל ערך חברתי/שליחות?",
  "עד כמה חשוב לך שהתחום העסקי יבטיח פוטנציאל הכנסה גבוה?",
  "עד כמה חשוב לך לפעול בתחום עסקי יציב ובטוח?",
  "עד כמה את/ה מזהה שווקים או ענפים בצמיחה שבהם תרצה/י לפעול?",
  "עד כמה התחביבים או תחומי העניין שלך קשורים ליזמות או לפיתוח עסקי?",
  "עד כמה כבר בדקת רעיונות/אפשרויות למיזם פוטנציאלי?",
  "עד כמה יש לך זמן פנוי קבוע להשקיע ביזמות חדשה?",
  "עד כמה יש לך הון עצמי נזיל להשקעה?",
  "עד כמה את/ה פתוח/ה לגייס משקיע/ים חיצוניים?",
  "עד כמה יש לך קשרים עסקיים רלוונטיים שיכולים לעזור למיזם?",
  "עד כמה את/ה נהנה/ית מתמיכה סביבתית/חברתית בהקמת עסק?",
  "עד כמה יש לך שותפים פוטנציאליים מתאימים למיזם?",
  "עד כמה את/ה מוכן/ה לקחת מימון בנקאי לצורך הקמה/צמיחה?",
  "עד כמה את/ה זמין/ה לנסיעות/פגישות מחוץ לאזור מגוריך?",
  "עד כמה יש לך ציוד/נכסים רלוונטיים (משרד, רכב, מחשוב) שמסייעים?",
  "עד כמה את/ה מיומן/ת בשימוש בכלים דיגיטליים לניהול ושיווק?",
  "עד כמה יש לך מטרות עסקיות ברורות לשנה הקרובה?",
  "עד כמה יש לך מטרות אישיות ברורות לשנה הקרובה?",
  "עד כמה יעד ההכנסה החודשי שלך ברור ומוגדר?",
  "עד כמה חשוב לך לשמור על איזון בית–עבודה?",
  "עד כמה ברור לך החזון שלך לטווח 3–5 שנים?",
  "עד כמה ברור לך מה תיחשב עבורך \"הצלחה גדולה\" בעוד שנה?",
  "עד כמה החששות שלך מהקמת עסק מעכבים אותך כיום?",
  "עד כמה ברור לך מהם 2–3 התנאים ההכרחיים שלך לכניסה לעסק חדש?",
  "עד כמה את/ה מזהה תכונות אישיות שעוזרות לך להצליח?",
  "עד כמה חולשות מקצועיות שיש לך מעכבות את התקדמותך?",
  "עד כמה מגבלות זמן משפיעות על יכולתך להתקדם?",
  "עד כמה מגבלות כלכליות משפיעות על יכולתך להתקדם?",
  "עד כמה מגבלות משפחתיות/אישיות משפיעות על יכולתך להתקדם?",
  
  // חלק ד – סגנון עבודה, נטיות יזמיות וכשירויות ליבה (61–90)
  "עד כמה את/ה מעדיף/ה לעבוד לבד (לעומת בצוות)?",
  "עד כמה את/ה מעדיף/ה להוביל מיזם חדש מאפס (לעומת להצטרף קיים)?",
  "עד כמה את/ה מסודר/ת ומאורגן/ת בעבודה היומיומית?",
  "עד כמה את/ה מוכן/ה לקחת סיכונים מחושבים?",
  "עד כמה את/ה מתמודד/ת היטב עם מצבי לחץ?",
  "עד כמה את/ה מקבל/ת החלטות במהירות כשהדבר נדרש?",
  "עד כמה את/ה יצירתי/ת ביצירת פתרונות חדשים?",
  "עד כמה את/ה אנליטי/ת בניתוח נתונים והחלטות?",
  "עד כמה את/ה איש/ת חזון (ראייה קדימה, תפיסה אסטרטגית)?",
  "עד כמה את/ה איש/ת ביצוע (יישום, הוצאה לפועל)?",
  "עד כמה חשוב לך לנהל עובדים באופן ישיר?",
  "עד כמה חשוב לך לעבוד ישירות מול לקוחות?",
  "עד כמה יש לך ידע בסיסי בניהול פיננסי (תקציב, דוחות)?",
  "עד כמה יש לך ידע בשיווק דיגיטלי (אתרים, רשתות, קידום ממומן)?",
  "עד כמה יש לך ידע ומיומנות במכירות (טלפוניות/שטח/און־ליין)?",
  "עד כמה יש לך ידע בסיסי במשפטים/חוזים עסקיים?",
  "עד כמה יש לך ידע טכנולוגי/מחשובי המסייע לניהול העסק?",
  "עד כמה יש לך ידע בתפעול ולוגיסטיקה?",
  "עד כמה יש לך ניסיון בהדרכה/הנחיה של אחרים?",
  "עד כמה יש לך ידע בניהול פרויקטים (תכנון, לו״ז, בקרה)?",
  "עד כמה יש לך ידע בניהול משאבי אנוש/גיוס?",
  "עד כמה יש לך ידע בעיצוב/UX/פיתוח מוצר?",
  "עד כמה את/ה מעריך/ה שליווי מקצועי יכול לתרום לך בשנה הקרובה?",
  "עד כמה את/ה סבור/ה שתוכל/י להסתדר ללא ליווי בתחומים מרכזיים?",
  "עד כמה חשוב לך שהליווי יהיה קבוע מול אדם יחיד (לעומת רשת מומחים)?",
  "עד כמה היית רוצה לשמש כמדריך/מלווה לאחרים בתחומך?",
  "עד כמה ברור לך החזון העסקי שלך לשנים הקרובות?",
  "עד כמה ברור לך איזה סוג לקוחות תרצה/י לשרת?",
  "עד כמה ברור לך מי המתחרים העיקריים שלך?",
  "עד כמה ברור לך מהו היתרון התחרותי העיקרי שלך?",
  
  // חלק ה – סיכום אישי, חזון ומדדי הצלחה (91–107)
  "עד כמה ברור לך מה מניע אותך לקום ולעבוד בכל יום?",
  "עד כמה את/ה נחוש/ה בהגשמת החלום המקצועי שלך?",
  "עד כמה את/ה גאה בהישגיך עד היום (מקצועיים/אישיים)?",
  "עד כמה את/ה פתוח/ה לשנות הרגלים כדי להצליח?",
  "עד כמה את/ה פתוח/ה לקבל משוב מקצועי מאחרים?",
  "עד כמה משוב מאחרים משפיע בפועל על קבלת החלטותיך?",
  "עד כמה ברור לך התחום המרכזי שבו תרצה/י להשתפר בשנים הקרובות?",
  "עד כמה החשיבה שלך ארוכת־טווח (מעבר לשנה הקרובה)?",
  "עד כמה את/ה שואף/ת לפרוץ גבולות קיימים בשוק שלך?",
  "עד כמה את/ה פתוח/ה לחדשנות ולניסוי פתרונות חדשים?",
  "עד כמה את/ה פתוח/ה לשיתופי פעולה בינלאומיים?",
  "עד כמה את/ה פתוח/ה לאמץ טכנולוגיות חדשות בעסק?",
  "עד כמה את/ה פתוח/ה להקשיב ולשלב רעיונות חדשים מצוות/יועצים?",
  "עד כמה את/ה מסוגל/ת להגדיר במדויק מדדי הצלחה (KPIs) למיזם?",
  "עד כמה את/ה נוטה לדחות משימות? (בסעיף זה: 1=תמיד דוחה, 7=כמעט אף פעם)",
  "עד כמה את/ה מתמיד/ה בביצוע משימות עד סיום מלא?",
  "עד כמה את/ה מרגיש/ה שהפרופיל שיתקבל מהשאלון ישקף נאמנה את דמותך כיזם/ת?"
];

const sectionTitles = [
  { start: 1, end: 10, title: "חלק א – רקע והכשרה" },
  { start: 11, end: 30, title: "חלק ב – ניסיון מקצועי וכישורים" },
  { start: 31, end: 60, title: "חלק ג – תחומי עניין, משאבים ומוטיבציה" },
  { start: 61, end: 90, title: "חלק ד – סגנון עבודה, נטיות יזמיות וכשירויות ליבה" },
  { start: 91, end: 107, title: "חלק ה – סיכום אישי, חזון ומדדי הצלחה" }
];

export default function QuestionnaireExport() {
  const [questionnaireResponse, setQuestionnaireResponse] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAndLoadQuestionnaire();
  }, []);

  const checkAdminAndLoadQuestionnaire = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (currentUser.role !== 'admin') {
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(currentUser);

      const urlParams = new URLSearchParams(window.location.search);
      const responseId = urlParams.get('responseId');
      
      if (!responseId) {
        alert("מזהה שאלון חסר");
        return;
      }

      const allResponses = await base44.entities.QuestionnaireResponse.list();
      const responseData = allResponses.find(r => r.id === responseId);
      
      if (!responseData) {
        alert("שאלון לא נמצא");
        return;
      }

      setQuestionnaireResponse(responseData);
    } catch (error) {
      console.error("Error loading questionnaire:", error);
      alert("שגיאה בטעינת השאלון");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const getScoreLabel = (score) => {
    const labels = {
      1: "כלל לא",
      2: "במעט",
      3: "במידה מסוימת",
      4: "במידה בינונית",
      5: "במידה רבה",
      6: "במידה רבה מאוד",
      7: "במידה מקסימלית"
    };
    return labels[score] || "";
  };

  const getScoreColor = (score) => {
    if (score >= 6) return "text-green-700 font-bold";
    if (score >= 4) return "text-blue-700 font-semibold";
    return "text-orange-700 font-semibold";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!questionnaireResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">שאלון לא נמצא</h2>
            <p className="text-gray-600">לא ניתן למצוא את השאלון המבוקש</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <style>{`
        @media print {
          body { 
            print-color-adjust: exact; 
            -webkit-print-color-adjust: exact;
          }
          
          header, footer, nav { 
            display: none !important; 
          }
          
          .no-print { 
            display: none !important; 
          }
          
          [class*="ChatBot"], [class*="chat"] {
            display: none !important;
          }
          
          body, html {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .questionnaire-container {
            margin: 0 !important;
            padding: 1cm !important;
            max-width: 100% !important;
          }
          
          .print-avoid-break { 
            page-break-inside: avoid; 
          }
          
          @page { 
            margin: 1.5cm;
            size: A4;
          }
          
          .text-green-700, .text-blue-700, .text-orange-700 {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        
        .questionnaire-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
      
      <div className="questionnaire-container">
        {/* Header */}
        <Card className="mb-8 border-t-4 border-t-blue-600 print-avoid-break">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">שאלון V107 - תשובות מלאות</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    גרסה B5 / v5.7-LTS
                  </p>
                </div>
              </div>
              <Button onClick={handlePrintPDF} variant="outline" className="no-print">
                <Download className="w-4 h-4 ml-2" />
                ייצוא PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">משתתף/ת</p>
                <p className="font-semibold">{questionnaireResponse.personal_info.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">אימייל</p>
                <p className="font-semibold">{questionnaireResponse.personal_info.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">תאריך מילוי</p>
                <p className="font-semibold">
                  {format(new Date(questionnaireResponse.created_date), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="mb-8 print-avoid-break">
          <CardHeader>
            <CardTitle>פרטים אישיים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">גיל</p>
                <p className="font-medium">{questionnaireResponse.personal_info.age || "לא צוין"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">מין</p>
                <p className="font-medium">{questionnaireResponse.personal_info.gender || "לא צוין"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">מצב משפחתי</p>
                <p className="font-medium">{questionnaireResponse.personal_info.marital_status || "לא צוין"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">כתובת</p>
                <p className="font-medium">{questionnaireResponse.personal_info.address || "לא צוין"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">טלפון</p>
                <p className="font-medium">{questionnaireResponse.personal_info.phone || "לא צוין"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">עיסוק</p>
                <p className="font-medium">{questionnaireResponse.personal_info.occupation || "לא צוין"}</p>
              </div>
              {questionnaireResponse.personal_info.occupation_other && (
                <div>
                  <p className="text-sm text-gray-600">עיסוק אחר</p>
                  <p className="font-medium">{questionnaireResponse.personal_info.occupation_other}</p>
                </div>
              )}
              {questionnaireResponse.personal_info.interests && questionnaireResponse.personal_info.interests.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">תחומי עניין</p>
                  <p className="font-medium">{questionnaireResponse.personal_info.interests.join(', ')}</p>
                </div>
              )}
              {questionnaireResponse.personal_info.interests_other && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">תחומי עניין אחרים</p>
                  <p className="font-medium">{questionnaireResponse.personal_info.interests_other}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions and Answers */}
        {sectionTitles.map((section, sectionIdx) => (
          <Card key={sectionIdx} className="mb-8">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {questionsHe.slice(section.start - 1, section.end).map((question, idx) => {
                  const questionNumber = section.start + idx;
                  const answer = questionnaireResponse.responses[`q${questionNumber}`];
                  return (
                    <div key={questionNumber} className="border-b pb-4 print-avoid-break">
                      <div className="flex gap-3">
                        <span className="font-bold text-blue-600 flex-shrink-0">
                          {questionNumber}.
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800 mb-2">{question}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">תשובה:</span>
                              <span className={`text-2xl font-bold ${getScoreColor(answer)}`}>
                                {answer}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              ({getScoreLabel(answer)})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Optional Comment */}
        {questionnaireResponse.optional_comment && (
          <Card className="mb-8 print-avoid-break">
            <CardHeader>
              <CardTitle>הערה אופציונלית</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {questionnaireResponse.optional_comment}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="bg-gray-50 print-avoid-break">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>הסתייגות:</strong> מסמך זה מכיל את התשובות המלאות לשאלון V107. 
              המידע מיועד לשימוש פנימי ולצורך ייצור הדו"ח המקצועי בלבד.
              זכויות יוצרים: "עלית – יזום עסקים".
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}