import React, { useState, useEffect, useCallback, useRef } from "react";
import { QuestionnaireResponse } from "@/entities/QuestionnaireResponse";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, LogIn, Shield, Info, PlayCircle, User as UserIcon, FileText, Undo2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/components/i18n/useTranslation";

const questionsHe = [
  // מקטע 1: מיקוד, החלטה וחוסן (1-11)
  "אני יכול/ה לקבל החלטות במהירות גם כשאין לי את כל המידע.",
  "תחת לחץ אני נשאר/ת רגוע/ה ומקבל/ת החלטות מאוזנות.",
  "לפני קבלת החלטה, אני בוחן/ת כמה אופציות שונות.",
  "אני נוטה להתחרט על החלטות שקיבלתי בעבר.",
  "אני מתמיד/ה בעקביות גם כשפרויקטים מאבדים מהקסם הראשוני שלהם.",
  "כשאני מציב/ה מטרה, אני עושה כל מה שצריך כדי להשיג אותה.",
  "אני מצליח/ה לשמור על מיקוד גם בפרויקטים ארוכי טווח.",
  "אני נוטה לדחות משימות שמעוררות אי ודאות.",
  "אני שומר/ת על משמעת עצמית מלאה גם ללא פיקוח חיצוני.",
  "אני מצליח/ה להישאר יעיל/ה גם בסביבת עבודה כאוטית.",
  "אני יכול/ה להתמודד ביעילות עם מצבים לא מוגדרים או אמביוולנטיים.",

  // מקטע 2: גמישות, יצירתיות וחדשנות (12-28)
  "אני פתוח/ה לרעיונות חדשים גם אם הם שונים מאוד מהנורמה.",
  "אני נהנה/ת לנסות גישות חדשות לפתרון בעיות במקום להיצמד לשיטות קונבנציונליות.",
  "קשה לי לשנות את הגישה שלי אחרי שהחלטתי על כיוון.",
  "אני מתאים/ה בקלות לשינויים בלתי צפויים בסביבת העבודה.",
  "כשמתרחש שינוי, אני רואה בו הזדמנות ללמידה ולשיפור.",
  "אני מעדיף/ה פתרונות יצירתיים על פני \"בטוחים\" או מוכרים.",
  "אני יוזם/ת באופן יזום דרכים חדשות לשיפור תהליכים קיימים.",
  "אני מסוגל/ת לחשוב \"מחוץ לקופסה\" מול בעיה.",
  "אני מוכן/ה לקחת סיכונים מחושבים בעבודה כדי לקדם מטרה.",
  "אני מתלהב/ת מניסיון כלים או שיטות חדשים, גם ללא הוכחת הצלחה מראש.",
  "אני נוטה להיצמד להליכים קיימים ולא לחפש לשנות אותם.",
  "אני מזהה הזדמנויות עסקיות או מקצועיות מוקדם יותר מאחרים.",
  "בהחלטה אני לוקח/ת בחשבון את ההשלכות האסטרטגיות ארוכות הטווח שלה.",
  "אני נוטה להתמקד בפרטים קטנים יותר מאשר בתמונה הגדולה.",
  "אני נהנה/ת לבנות תוכניות עבודה אסטרטגיות ארוכות טווח.",
  "שינויים פתאומיים גורמים לי אי נוחות ברורה.",
  "אני מגיב/ה במהירות למצבים חדשים ובלתי צפויים.",

  // מקטע 3: מנהיגות, יוזמה ואחריות (29-41)
  "אני לא מפחד/ת להביע דעה השונה מהרוב או מההנהלה.",
  "אני מציע/ה שיפורים גם כשיוזמה לא נדרשת במפורש.",
  "אני מקבל/ת ביקורת באופן פתוח ומנסה ללמוד ממנה.",
  "אני לוקח/ת אחריות על נושאים שאינם באחריותי הרשמית.",
  "כשמתעוררת בעיה, אני בין הראשונים לפעול ולמצוא פתרון.",
  "אני מהסס/ת ליזום פעולות חדשות ללא אישור מפורש מגורם בכיר.",
  "אני יודע/ת לרתום אחרים סביב רעיון או מטרה שאני מאמין/ה בה.",
  "אני נהנה/ת להוביל צוות או פרויקט ולנהל ביצוע.",
  "אני נוטה להמתין להוראות ברורות במקום ליטול יוזמה.",
  "אני מסוגל/ת לקחת על עצמי פרויקטים מורכבים ולנהל אותם עד להשלמה.",
  "אני נוטה להימנע מאחריות במצבים בהם יש סיכון לכישלון.",
  "אני מצליח/ה לגייס תמיכה מגורמים שונים עבור רעיון או פרויקט.",
  "קשה לי להחליט החלטות קשות שעלולות לפגוע במישהו.",

  // מקטע 4: תקשורת, שיתוף פעולה ורשתות (42-57)
  "אני מסביר/ה רעיונות מורכבים בצורה ברורה ופשוטה.",
  "אני מקשיב/ה באופן אקטיבי ומנסה להבין את נקודות המבט של אחרים.",
  "אני מרגיש/ה בנוח בעת מצגות או דיבור מול קהל.",
  "קשה לי לבטא את עצמי בצורה ברורה כשאני תחת לחץ.",
  "אני מסוגל/ת לשכנע אחרים לאמץ דעות או רעיונות שלי.",
  "אני יוזם/ת שיחות ופגישות כדי לפתור בעיות או לקדם פרויקט.",
  "אני נוטה להימנע מעימותים ולהעדיף לשמור על שקט.",
  "אני עובד/ת בצורה יעילה עם אנשים ממגוון רקעים ואישיויות.",
  "אני מצליח/ה להעביר פידבק בונה בצורה שאינה פוגענית.",
  "אני מרגיש/ה בנוח לבקש עזרה מאחרים כשאני זקוק/ה לה.",
  "אני שומר/ת על קשר רציף עם אנשי מקצוע ברשת המקצועית שלי.",
  "קשה לי לפנות לאנשים שאני לא מכיר/ה היטב.",
  "אני נוטה להעדיף עבודה עצמאית על פני עבודה בצוות.",
  "אני פעיל/ה ברשתות חברתיות מקצועיות ומשתתף/ת באירועי ענף.",
  "אני מצליח/ה לבנות אמון עם אנשים חדשים במהירות.",
  "קשה לי לקרוא רגשות ותגובות של אנשים אחרים.",

  // מקטע 5: תכנון, למידה ואיזון (58-107)
  "אני מסוגל/ת לפרק מטרות גדולות למשימות קטנות וניתנות לביצוע.",
  "אני קובע/ת יעדים ברורים ומודדים לפרויקטים.",
  "אני נוטה להתחיל פרויקטים מבלי לתכנן אותם לעומק.",
  "אני עוקב/ת באופן שיטתי אחר התקדמות ביעדים שהצבתי.",
  "אני מנצל/ת כלים דיגיטליים לניהול משימות ותכנון זמן.",
  "אני מקפיד/ה על עמידה בלוחות זמנים גם במצבי לחץ.",
  "אני מתכנן/נת מראש תרחישים אלטרנטיביים למקרה של שינויים.",
  "אני מוצא/ת הזדמנויות ללמוד ולהתפתח גם מחוץ לעבודה.",
  "אני מחפש/ת משוב באופן יזום כדי לשפר את הביצועים שלי.",
  "אני נהנה/ת מאתגרים שדורשים רכישת ידע חדש.",
  "אני משקיע/ה זמן בקריאה וצפייה בתכנים מקצועיים רלוונטיים.",
  "אני מעדכן/ת את המיומנויות שלי כדי להישאר רלוונטי/ת בתחום שלי.",
  "אני מקפיד/ה על איזון בין עבודה לחיים אישיים.",
  "אני מצליח/ה לנהל לחץ ומתח בצורה אפקטיבית.",
  "אני חושב/ת בטווח ארוך לגבי הקריירה שלי.",
  "אני מזהה מגמות וטרנדים בתחום שלי לפני שהם הופכים לנחלת הכלל.",
  "יש לי חזון ברור לאן אני רוצה להגיע מקצועית בעוד 3-5 שנים.",
  "אני מסוגל/ת לראות את התמונה הגדולה גם בפרטים היומיומיים.",
  "אני מעדיף/ה לעבוד לפי תוכנית מוגדרת מראש.",
  "אני מסוגל/ת לבצע משימות מרובות במקביל ללא טעויות.",
  "אני לומד/ת בקלות ממשוב שלילי ומשתמש/ת בו לשיפור.",
  "אני נוטה לחזור על אותן טעויות גם אחרי שקיבלתי פידבק.",
  "אני מתאר/ת לעצמי בבהירות איך הצלחה תיראה בעתיד.",
  "אני מצליח/ה לבנות קשרים משמעותיים ברשת המקצועית שלי.",
  "אני מאמץ/ת טכנולוגיות חדשות במהירות.",
  "אני מצליח/ה לפתור בעיות טכניות באופן עצמאי.",
  "אני בונה אסטרטגיות שמסתכלות 2-3 צעדים קדימה.",
  "אני משתתף/ת בקורסים, סדנאות או הדרכות להרחבת הידע שלי.",
  "אני פתוח/ה ללמוד מאנשים צעירים ממני או מחוסרי ניסיון.",
  "אני נהנה/ת מתהליך הלמידה עצמו, ולא רק מהתוצאה.",
  "אני דואג/ת לבריאות הפיזית והנפשית שלי.",
  "אני מצליח/ה לנתק מהעבודה בזמן החופש.",
  "אני מרגיש/ה שהעבודה שלי לא משאירה לי מספיק זמן לחיים האישיים.",
  "אני מקפיד/ה על שגרת שינה בריאה גם בתקופות עמוסות.",
  "אני מסוגל/ת לזהות מתי אני מתקרב/ת לשחיקה ולקחת צעדים למניעתה.",
  "אני מתקשה להתאושש ממשברים או כישלונות.",
  "אני משתמש/ת באופן שוטף בכלים דיגיטליים לשיפור היעילות.",
  "אני מעדכן/ת את עצמי בטכנולוגיות החדשות בתחום שלי.",
  "אני מוביל/ה שינויים בצורה מובנית ומתוכננת.",
  "אני מסביר/ה לאחרים את הצורך בשינוי ומקבל/ת את תמיכתם.",
  "אני מעדיף/ה להישאר באזור הנוחות שלי ולא לנסות דברים חדשים.",
  "אני רואה את עצמי כמי שמוביל/ה שינויים במקום העבודה שלי.",
  "אני מוכן/ה לקחת סיכונים מחושבים כדי לקדם שינוי משמעותי.",
  "אני מרגיש/ה שיש לי חזון ברור לעתיד המקצועי שלי.",
  "אני מצליח/ה להישאר ממוקד/ת ביעדים ארוכי טווח גם כשיש הסחות דעת.",
  "אני לומד/ת בקלות מיומנויות חדשות הנדרשות לעבודה.",
  "אני יוזם/ת שינויים בתהליכי עבודה כדי לשפר תוצאות.",
  "אני מקפיד/ה לעדכן באופן קבוע את הרשת המקצועית שלי על התקדמות ופרויקטים.",
  "אני מרגיש/ה בנוח ללמוד ולהשתמש בכלים דיגיטליים חדשים שמוטמעים בעבודה.",
  "אני משקיע/ה מאמץ מודע בבניית קשרים משמעותיים עם אנשים בתחום שלי.",
];

const questionsEn = questionsHe; // For now, we'll keep the same for both languages

const sectionTitlesHe = [
  { start: 1, end: 11, title: "מקטע 1: מיקוד, החלטה וחוסן" },
  { start: 12, end: 28, title: "מקטע 2: גמישות, יצירתיות וחדשנות" },
  { start: 29, end: 41, title: "מקטע 3: מנהיגות, יוזמה ואחריות" },
  { start: 42, end: 57, title: "מקטע 4: תקשורת, שיתוף פעולה ורשתות" },
  { start: 58, end: 107, title: "מקטע 5: תכנון, למידה ואיזון" }
];

const sectionTitlesEn = sectionTitlesHe; // For now, we'll keep the same for both languages

const QuestionnaireIntro = ({ onStart, language }) => {
  return (
    <Card className="shadow-xl border-t-4 border-accent" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-6">
        <div className="bg-slate-600 mb-6 mx-auto w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-200">
          <FileText className="w-10 h-10 text-accent" />
        </div>
        <CardTitle className="text-3xl font-bold text-text-primary mb-2">
          {language === 'he' ? 'שאלון V107 Professional Framework' : 'V107 Professional Framework Questionnaire'}
        </CardTitle>
        <CardDescription className="text-lg text-text-secondary">
          {language === 'he' ? 'גרסה V6 PRO' : 'Version V6 PRO'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`${language === 'he' ? 'text-right' : 'text-left'} text-text-secondary space-y-4`}>
          <p className="font-semibold text-lg text-text-primary">
            {language === 'he' ? 'ברוך הבא ל-V107 QUESTIONNAIRE V6 PRO' : 'Welcome to V107 QUESTIONNAIRE V6 PRO'}
          </p>
          <ul className="space-y-2 list-disc pr-6">
            <li>{language === 'he' ? 'כלי אבחון מקצועי זה נועד למפות את היכולות, הדפוסים והנטיות האישיות והמקצועיות שלך בהתבסס על 11 ממדים פסיכומטריים ליבתיים.' : 'This professional diagnostic tool is designed to map your personal and professional abilities, patterns, and tendencies based on 11 core psychometric dimensions.'}</li>
            <li>{language === 'he' ? 'V107 QUESTIONNAIRE V6 PRO ובעקבותיו V107 REPORT V6 PRO פותחו בתהליך מקצועי רב-שלבי ונמצאים בתהליך ולידציה מתמשך מול קבוצות מיקוד של מומחי קריירה, פסיכולוגיה תעסוקתית ואסטרטגים של התפתחות אישית.' : 'V107 QUESTIONNAIRE V6 PRO and the subsequent V107 REPORT V6 PRO were developed through a multi-stage professional process and are undergoing continuous validation with focus groups of career experts, occupational psychologists, and personal development strategists.'}</li>
            <li className="font-semibold">{language === 'he' ? 'ככל שתשובותיך יהיו כנות וספונטניות, כך איכות הדו"ח שתקבל תהיה גבוהה ומדויקת יותר.' : 'The more honest and spontaneous your answers, the higher and more accurate the quality of the report you will receive.'}</li>
          </ul>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300 mt-6">
          <h3 className="font-semibold text-lg mb-2 text-amber-900">⚠️ {language === 'he' ? 'הבהרה משפטית' : 'Legal Disclaimer'}</h3>
          <p className="text-sm text-amber-800">
            {language === 'he' 
              ? 'הדו"ח המופק מהווה כלי אבחוני בלבד ואינו מהווה ייעוץ משפטי, עסקי או פסיכולוגי מחייב. אין במסקנות הדו"ח משום הבטחה להישגים או לתוצאות כלכליות, והשימוש במידע המוצג בו הוא על דעתו ובאחריותו הבלעדית של המשתמש.' 
              : 'The generated report is a diagnostic tool only and does not constitute binding legal, business, or psychological advice. The report\'s conclusions do not constitute a guarantee of achievements or financial results, and the use of the information presented is at the user\'s sole discretion and responsibility.'}
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-lg mb-2">{language === 'he' ? 'סודיות, פרטיות ומחיקת נתונים' : 'Confidentiality, Privacy, and Data Deletion'}</h3>
          <p className="text-sm text-gray-700">{language === 'he' ? 'אנו מתחייבים לסודיות מלאה:' : 'We commit to full confidentiality:'}</p>
          <ol className="list-decimal pr-6 text-sm text-gray-700 space-y-1 mt-2">
            <li>{language === 'he' ? 'פרטי הזיהוי (שם, מייל, גיל) נמחקים מהמערכת 30 יום לאחר הפקת הדו"ח האישי.' : 'Identification details (name, email, age) are deleted from the system 30 days after the personal report is generated.'}</li>
            <li>{language === 'he' ? 'תשובות השאלון עצמן נשמרות באופן אנונימי לחלוטין לצורך מחקר מתמשך ושיפור דיוק המערכת.' : 'The questionnaire answers themselves are kept completely anonymous for continuous research and system accuracy improvement.'}</li>
            <li>{language === 'he' ? 'הנתונים לא מועברים לשום גורם שלישי.' : 'Data is not transferred to any third party.'}</li>
          </ol>
          <p className="text-sm text-gray-700 mt-3">
            {language === 'he' 
              ? 'למידע נוסף, עיין ב' 
              : 'For more information, see our '}
            <Link to={createPageUrl("TermsOfService")} className="text-blue-600 hover:underline font-medium">
              {language === 'he' ? 'תנאי השימוש' : 'Terms of Use'}
            </Link>
            {language === 'he' ? ' ובמדיניות הפרטיות שלנו.' : ' and Privacy Policy.'}
          </p>
        </div>
        
        <Button
          size="lg"
          onClick={onStart}
          className="w-full gradient-accent text-white text-lg py-6">
          <PlayCircle className={`w-5 h-5 ${language === 'he' ? 'mr-2' : 'ml-2'}`} />
          {language === 'he' ? 'התחל שאלון' : 'Start Questionnaire'}
        </Button>
      </CardContent>
    </Card>
  );
};

const PersonalInfoForm = ({ data, onChange, language, onImmediateSave }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleConsentChange = (checked) => {
    onChange({ ...data, data_usage_consent: checked });
  };

  const occupationFieldOptions = [
    { value: 'marketing', label: 'שיווק' },
    { value: 'sales', label: 'מכירות' },
    { value: 'hr', label: 'HR / משאבי אנוש' },
    { value: 'technology', label: 'טכנולוגיה' },
    { value: 'entrepreneurship', label: 'יזמות' },
    { value: 'education', label: 'חינוך' },
    { value: 'management', label: 'ניהול' },
    { value: 'other', label: 'אחר' }
  ];

  const interestAreaOptions = [
    { value: 'art', label: 'אמנות / יצירה' },
    { value: 'technology', label: 'טכנולוגיה' },
    { value: 'education', label: 'חינוך / הכשרה' },
    { value: 'finance', label: 'פיננסים / עסקים' },
    { value: 'health', label: 'ספורט / בריאות' },
    { value: 'science', label: 'מדע / מחקר' },
    { value: 'culture', label: 'תרבות / תקשורת' },
    { value: 'other', label: 'אחר' }
  ];

  const toggleInterestArea = (interest) => {
    const current = data.interest_areas || [];
    if (current.includes(interest)) {
      onChange({ ...data, interest_areas: current.filter(i => i !== interest) });
    } else if (current.length < 3) {
      onChange({ ...data, interest_areas: [...current, interest] });
    }
  };

  return (
    <Card className="shadow-lg" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-accent" />
          {language === 'he' ? 'פרטי ממלא/ת השאלון' : 'Respondent Information'}
        </CardTitle>
        <CardDescription>
          {language === 'he' ? 'חלק זה עוזר לנו להתאים את הדו"ח במדויק לפרופיל שלך' : 'This section helps us tailor the report precisely to your profile'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
        {/* פרטים אישיים */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">{language === 'he' ? 'פרטים אישיים' : 'Personal Information'}</h3>
          
          <div>
            <Label htmlFor="full_name">{language === 'he' ? 'שם מלא' : 'Full Name'} <span className="text-red-500">*</span></Label>
            <Input
              id="full_name"
              value={data.full_name || ""}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder={language === 'he' ? 'ישראל ישראלי' : 'John Doe'}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">{language === 'he' ? 'גיל' : 'Age'}</Label>
              <Input
                id="age"
                type="number"
                value={data.age || ""}
                onChange={(e) => handleInputChange("age", parseInt(e.target.value, 10) || "")}
                placeholder="35"
                min={16}
                max={90}
              />
            </div>
            <div>
              <Label>{language === 'he' ? 'מין' : 'Gender'}</Label>
              <RadioGroup
                value={data.gender || ''}
                onValueChange={(value) => handleInputChange("gender", value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-reverse space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">{language === 'he' ? 'זכר' : 'Male'}</Label>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">{language === 'he' ? 'נקבה' : 'Female'}</Label>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">{language === 'he' ? 'אחר' : 'Other'}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* רקע מקצועי */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">{language === 'he' ? 'רקע מקצועי' : 'Professional Background'}</h3>
          
          <div>
            <Label>{language === 'he' ? 'שנות ניסיון בעבודה' : 'Years of Experience'}</Label>
            <RadioGroup
              value={data.years_of_experience || ''}
              onValueChange={(value) => handleInputChange("years_of_experience", value)}
              className="flex flex-col gap-2 mt-2"
              dir={language === 'he' ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="0-3" id="exp_0_3" />
                <Label htmlFor="exp_0_3">{language === 'he' ? '0-3 שנים' : '0-3 years'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="4-10" id="exp_4_10" />
                <Label htmlFor="exp_4_10">{language === 'he' ? '4-10 שנים' : '4-10 years'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="11-20" id="exp_11_20" />
                <Label htmlFor="exp_11_20">{language === 'he' ? '11-20 שנים' : '11-20 years'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="21+" id="exp_21_plus" />
                <Label htmlFor="exp_21_plus">{language === 'he' ? '21+ שנים' : '21+ years'}</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>{language === 'he' ? 'סטטוס מקצועי נוכחי' : 'Current Professional Status'}</Label>
            <RadioGroup
              value={data.current_professional_status || ''}
              onValueChange={(value) => handleInputChange("current_professional_status", value)}
              className="flex flex-col gap-2 mt-2"
              dir={language === 'he' ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="employee" id="status_employee" />
                <Label htmlFor="status_employee">{language === 'he' ? 'שכיר/ה' : 'Employee'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="freelancer" id="status_freelancer" />
                <Label htmlFor="status_freelancer">{language === 'he' ? 'עצמאי/ת / פרילנסר/ית' : 'Freelancer'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="entrepreneur" id="status_entrepreneur" />
                <Label htmlFor="status_entrepreneur">{language === 'he' ? 'יזם/ית / בעל/ת עסק' : 'Entrepreneur / Business Owner'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="student" id="status_student" />
                <Label htmlFor="status_student">{language === 'he' ? 'סטודנט/ית' : 'Student'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="job_seeker" id="status_job_seeker" />
                <Label htmlFor="status_job_seeker">{language === 'he' ? 'מחפש/ת עבודה' : 'Job Seeker'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="active_retiree" id="status_retiree" />
                <Label htmlFor="status_retiree">{language === 'he' ? 'פנסיונר/ית פעיל/ה' : 'Active Retiree'}</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="occupation_field">{language === 'he' ? 'תחום עיסוק קיים' : 'Current Occupation Field'} ({language === 'he' ? 'בחר אחד' : 'choose one'})</Label>
            <Select value={data.occupation_field || ''} onValueChange={(value) => handleInputChange("occupation_field", value)} dir="rtl">
              <SelectTrigger>
                <SelectValue placeholder={language === 'he' ? 'בחר תחום עיסוק' : 'Choose occupation field'} />
              </SelectTrigger>
              <SelectContent>
                {occupationFieldOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {data.occupation_field === 'other' && (
              <Input
                className="mt-2"
                value={data.occupation_field_other || ""}
                onChange={(e) => handleInputChange("occupation_field_other", e.target.value)}
                placeholder={language === 'he' ? 'פרט בקצרה' : 'Please specify'}
                dir="rtl"
              />
            )}
          </div>

          <div>
            <Label>{language === 'he' ? 'תחומי עניין' : 'Areas of Interest'} ({language === 'he' ? 'בחר עד 3 תחומים שמעניינים אותך' : 'choose up to 3 areas'})</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {interestAreaOptions.map(opt => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={(data.interest_areas || []).includes(opt.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleInterestArea(opt.value)}
                  disabled={(data.interest_areas || []).length >= 3 && !(data.interest_areas || []).includes(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            {(data.interest_areas && data.interest_areas.includes('other')) && (
              <Input
                className="mt-2"
                value={data.interest_areas_other || ""}
                onChange={(e) => handleInputChange("interest_areas_other", e.target.value)}
                placeholder={language === 'he' ? 'פרט תחום עניין אחר' : 'Specify other interest'}
                dir="rtl"
              />
            )}
          </div>
        </div>

        {/* תפקיד מטרה והעלאת קורות חיים */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b pb-2">{language === 'he' ? 'התאמה ארגונית' : 'Organizational Fit'}</h3>
          
          <div>
            <Label htmlFor="target_position">{language === 'he' ? 'התפקיד אליו הוגשה המועמדות' : 'Target Position'}</Label>
            <Input
              id="target_position"
              value={data.target_position || ""}
              onChange={(e) => handleInputChange("target_position", e.target.value)}
              placeholder={language === 'he' ? 'לדוגמה: מנהל מוצר בכיר' : 'e.g. Senior Product Manager'}
              dir="rtl"
            />
          </div>

        <div>
  <Label htmlFor="cv_upload">
    {language === 'he' ? 'העלאת קורות חיים (אופציונלי)' : 'Upload CV (Optional)'}
  </Label>
  


{data.cv_file_url ? (
  <div className="flex items-center gap-3 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
    <span className="text-green-600">✓</span>
    <span className="text-sm text-green-800 flex-1">
      {(data.cv_file_name && data.cv_file_name.trim())
        ? data.cv_file_name
        : (language === 'he' ? 'קובץ הועלה בהצלחה' : 'File uploaded successfully')}
    </span>
    <button
      type="button"
      onClick={() => onChange({ ...data, cv_file_url: "", cv_file_name: "" })}
      className="text-xs text-red-500 hover:text-red-700 underline"
    >
      {language === 'he' ? 'הסר' : 'Remove'}
    </button>
  </div>
  ) : (
    <div style={{ userSelect: 'auto', WebkitUserSelect: 'auto' }}>
      <Input
        id="cv_upload"
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ userSelect: 'auto', WebkitUserSelect: 'auto', pointerEvents: 'auto' }}
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          const updatedData = { ...data, cv_file_url: file_url, cv_file_name: file.name };
          onChange(updatedData);
          if (onImmediateSave) await onImmediateSave(updatedData);
        } catch (error) {
          alert('Error: ' + error.message);
        }
      }}
        className="cursor-pointer mt-1"
      />
    </div>
  )}
</div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-bold text-sm mb-3">{language === 'he' ? 'סיום חלק הזיהוי' : 'End of Identification Section'}</h3>
        </div>

            <div className="border-t pt-4 mt-6">
            <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="data_consent"
              checked={data.data_usage_consent || false}
              onChange={(e) => handleConsentChange(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="data_consent" className="text-sm text-gray-700">
              {language === 'he' 
                ? 'אני מאשר/ת שימוש בנתונים שאספק לצורך אבחון והפקת דוח מקצועי. הנתונים ישמרו בהתאם למדיניות הפרטיות ולתנאי השימוש של V107.' 
                : 'I consent to the use of the data I provide for diagnostic purposes and professional report generation. Data will be stored in accordance with V107\'s Privacy Policy and Terms of Use.'}
              <span className="text-red-500"> *</span>
            </label>
            </div>
            </div>
            </CardContent>
            </Card>
            );
            };

const QuestionCard = ({ questionNumber, questionText, value, onChange, language }) => {
  return (
    <div className="mb-6 pb-6 border-b last:border-b-0" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-semibold mb-4">
        {questionNumber}. {questionText}
      </h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{language === 'he' ? '7 (מתאר אותי בצורה מושלמת)' : '7 (Perfectly)'}</span>
        <span className="text-sm text-gray-500">{language === 'he' ? '1 (לא מתאר אותי כלל)' : '1 (Not at all)'}</span>
      </div>
      <RadioGroup
        value={value ? value.toString() : ''}
        onValueChange={(val) => onChange(parseInt(val, 10))}
        className="flex justify-between"
        dir="ltr"
      >
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <RadioGroupItem value={num.toString()} id={`q${questionNumber}_${num}`} />
            <Label htmlFor={`q${questionNumber}_${num}`} className="mt-1 text-xs">{num}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default function Questionnaire() {
        const { language } = useTranslation();

        // הגנת IP: חסימת אינטראקציית טקסט
        useEffect(() => {
          const handleContextMenu = (e) => e.preventDefault();
          const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) e.preventDefault();
            if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) e.preventDefault();
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) e.preventDefault();
          };
          document.addEventListener('contextmenu', handleContextMenu);
          document.addEventListener('keydown', handleKeyDown);
          return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
          };
        }, []);
  const [currentStep, setCurrentStep] = useState(-1); // -1 for intro, 0 for personal info, 1-5 for sections, 6 for optional comment
  const [responses, setResponses] = useState({});
  const [personalInfo, setPersonalInfo] = useState({});
  const [optionalComment, setOptionalComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedResponseId, setSavedResponseId] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginRequired, setIsLoginRequired] = useState(false);
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const questions = language === 'he' ? questionsHe : questionsEn;
  const sectionTitles = language === 'he' ? sectionTitlesHe : sectionTitlesEn;

  // refs תמיד עדכניים למניעת stale closure בשמירה
  const responsesRef = useRef(responses);
  const personalInfoRef = useRef(personalInfo);
  const optionalCommentRef = useRef(optionalComment);
  const savedResponseIdRef = useRef(savedResponseId);
  const userRef = useRef(user);

  useEffect(() => { responsesRef.current = responses; }, [responses]);
  useEffect(() => { personalInfoRef.current = personalInfo; }, [personalInfo]);
  useEffect(() => { optionalCommentRef.current = optionalComment; }, [optionalComment]);
  useEffect(() => { savedResponseIdRef.current = savedResponseId; }, [savedResponseId]);
  useEffect(() => { userRef.current = user; }, [user]);

  const loadExistingResponses = useCallback(async (currentUser) => {
    try {
      const existingResponses = await QuestionnaireResponse.filter({
        created_by: currentUser.email,
        status: 'in_progress',
        version: 'V8_B2B'
      }, '-updated_date', 1);
//
      if (existingResponses.length > 0) {
        const savedResponse = existingResponses[0];
          console.log('LOADED:', {
          responsesCount: Object.keys(savedResponse.responses || {}).length,
          responses: savedResponse.responses
        });
        setPersonalInfo(savedResponse.personal_info || {});
        setResponses(savedResponse.responses || {});
        setOptionalComment(savedResponse.optional_comment || '');
        setSavedResponseId(savedResponse.id);
        const savedStep = savedResponse.current_step;
        if (savedStep !== undefined && savedStep !== null) {
          setCurrentStep(Math.max(0, savedStep));
        } else {
          setCurrentStep(0);
        }
      }
    } catch (error) {
      console.error('Error loading existing responses:', error);
    }
  }, []);

  const checkAuthAndLoadData = useCallback(async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      await loadExistingResponses(currentUser);
    } catch (error) {
      setIsLoginRequired(true);
    }
    setIsLoading(false);
  }, [loadExistingResponses]);

  useEffect(() => {
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentStep]);

  useEffect(() => {
    setShouldBlockNavigation(currentStep >= 0);
  }, [currentStep]);

  useEffect(() => {
    if (shouldBlockNavigation) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'האם אתה בטוח שברצונך לעזוב? התקדמותך נשמרה אוטומטית ותוכל לחזור ולהמשיך מאוחר יותר.';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [shouldBlockNavigation]);

  useEffect(() => {
    if (!shouldBlockNavigation) return;

    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        const targetUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        if (targetUrl.origin === currentUrl.origin && targetUrl.pathname !== currentUrl.pathname) {
          e.preventDefault();
          e.stopPropagation();

          const confirmMessage = 'האם אתה בטוח שברצונך לעזוב? התקדמותך נשמרה אוטומטית ותוכל לחזור ולהמשיך מאוחר יותר.';

          if (window.confirm(confirmMessage)) {
            // שמור את כל הנתונים האחרונים לפני היציאה
            (async () => {
              if (user && savedResponseId) {
                try {
                  await base44.entities.QuestionnaireResponse.update(savedResponseId, {
                    personal_info: { ...personalInfo, email: user.email },
                    responses: responses,
                    optional_comment: optionalComment,
                    language: language,
                    version: 'V8_B2B',
                    status: 'in_progress'
                  });
                } catch (error) {
                  // Silently fail on navigation to avoid console logging
                }
              }
              window.location.href = link.href;
            })();
          }
        }
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [shouldBlockNavigation, savedResponseId, user, personalInfo]);

  const autoSaveProgress = useCallback(async (stepToSave) => {
    const currentUser = userRef.current;
    if (!currentUser) return;

    const currentResponses = responsesRef.current;
    const currentPersonalInfo = personalInfoRef.current;
    const currentComment = optionalCommentRef.current;
    const currentSavedId = savedResponseIdRef.current;

    const hasPersonalInfo = Object.keys(currentPersonalInfo).length > 0;
    const hasResponses = Object.keys(currentResponses).length > 0;
    const hasComment = currentComment.trim().length > 0;

    if (!hasPersonalInfo && !hasResponses && !hasComment) return;

    const data = {
      personal_info: { ...currentPersonalInfo, email: currentUser.email },
      responses: currentResponses,
      optional_comment: currentComment,
      data_usage_consent: currentPersonalInfo.data_usage_consent || false,
      language: language,
      version: 'V8_B2B',
      status: 'in_progress',
      current_step: stepToSave ?? 0
    };

    try {
      if (currentSavedId) {
        await QuestionnaireResponse.update(currentSavedId, data);
      } else {
        const newResponse = await QuestionnaireResponse.create(data);
        setSavedResponseId(newResponse.id);
      }
    } catch (error) {
      // Silently fail
    }
  }, [language]);

  useEffect(() => {
    if (user && currentStep >= 0) {
      const hasData = Object.keys(responses).length > 0 || 
                     Object.keys(personalInfo).length > 0 || 
                     optionalComment.trim().length > 0;
      
      if (hasData) {
        const timeoutId = setTimeout(() => {
          autoSaveProgress(currentStep);
        }, 1500);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [user, responses, personalInfo, optionalComment, currentStep, autoSaveProgress]);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

const updateResponse = (questionNumber, value) => {
  console.log('updateResponse:', questionNumber, value);
  setResponses((prev) => ({
    ...prev,
    [`q${questionNumber}`]: value
  }));
};

  const validatePersonalInfo = () => {
    if (!personalInfo.full_name?.trim()) {
      alert(language === 'he' ? 'יש להזין שם מלא' : 'Please enter your full name');
      return false;
    }
    if (!personalInfo.data_usage_consent) {
      alert(language === 'he' ? 'יש לאשר את תנאי השימוש בנתונים' : 'Please consent to data usage terms');
      return false;
    }
    return true;
  };

  const validateForSubmission = () => {
    if (!validatePersonalInfo()) return false;

    const unansweredQuestions = [];
    for (let i = 1; i <= 107; i++) {
      if (!responses[`q${i}`]) {
        unansweredQuestions.push(i);
      }
    }

    if (unansweredQuestions.length > 0) {
      alert(`יש לענות על כל השאלות. שאלות חסרות: ${unansweredQuestions.join(', ')}`);
      return false;
    }

    return true;
  };

  const submitQuestionnaire = async () => {
    if (!user || !validateForSubmission()) return;

    setIsSubmitting(true);
    try {
      const finalData = {
        personal_info: { ...personalInfo, email: user.email },
        responses: responses,
        optional_comment: optionalComment,
        data_usage_consent: personalInfo.data_usage_consent || false,
        language: language,
        version: 'V8_B2B',
        status: 'completed',
        current_step: 0
      };

      let finalResponseId = savedResponseId;

      if (savedResponseId) {
        await QuestionnaireResponse.update(savedResponseId, finalData);
      } else {
        const newResponse = await QuestionnaireResponse.create(finalData);
        finalResponseId = newResponse.id;
      }

      base44.functions.invoke('generateReportAutomatic', { responseId: finalResponseId })
        .catch(err => console.error('Background report generation failed:', err));

      navigate(createPageUrl(`Completion?responseId=${finalResponseId}`));
    } catch (error) {
      alert('שגיאה בשליחת השאלון');
    }
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep === 0 && !validatePersonalInfo()) {
      return;
    }
    const newStep = Math.min(currentStep + 1, 6);
    setCurrentStep(newStep);
    autoSaveProgress(newStep);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, -1);
    setCurrentStep(newStep);
    if (newStep >= 0) autoSaveProgress(newStep);
    window.scrollTo(0, 0);
  };

  const getCurrentSectionInfo = () => {
    if (currentStep <= 0 || currentStep > 5) return null;
    return sectionTitles[currentStep - 1];
  };

  const getProgress = () => {
    if (currentStep <= 0) return 0;
    return (currentStep / 7) * 100;
  };

  const renderCurrentSection = () => {
    if (currentStep === 0) {
      return <PersonalInfoForm
  data={personalInfo}
  onChange={setPersonalInfo}
  language={language}
  onImmediateSave={async (updatedData) => {
    try {
      const saveData = {
      personal_info: { ...updatedData, email: user.email },
      cv_file_name: updatedData.cv_file_name || '',
      cv_file_url: updatedData.cv_file_url || '',
      responses,
      optional_comment: optionalComment,
      data_usage_consent: updatedData.data_usage_consent || false,
      language,
      version: 'V8_B2B',
      status: 'in_progress',
      current_step: currentStep
    };
      if (savedResponseId) {
        await QuestionnaireResponse.update(savedResponseId, saveData);
      } 
    } catch (e) {
      console.error('CV immediate save failed:', e);
    }
  }}
/>
    }
    
    if (currentStep >= 1 && currentStep <= 5) {
      const sectionInfo = getCurrentSectionInfo();
      if (!sectionInfo) return null;
      
      const questionsInSection = [];
      for (let i = sectionInfo.start; i <= sectionInfo.end; i++) {
        questionsInSection.push(i);
      }

      return (
        <div className="space-y-6">
          {currentStep === 1 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">📝 {language === 'he' ? 'הנחיות למילוי השאלון' : 'Questionnaire Instructions'}</h3>
                <p className="mb-3 font-medium">
                  {language === 'he' 
                    ? 'בכל שאלה, סמן/י את המספר שמתאר אותך בצורה הטובה ביותר על סקאלה של 1 עד 7:'
                    : 'For each question, select the number that best describes you on a scale of 1 to 7:'}
                </p>
                <ul className="text-sm space-y-1 pr-4">
                  <li>1 – {language === 'he' ? 'לא מתאר אותי כלל' : 'Does not describe me at all'}</li>
                  <li>2 – {language === 'he' ? 'מתאר אותי במעט' : 'Describes me slightly'}</li>
                  <li>3 – {language === 'he' ? 'מתאר אותי במידה מסוימת' : 'Describes me somewhat'}</li>
                  <li>4 – {language === 'he' ? 'מתאר אותי חלקית / ניטרלי' : 'Describes me partially / Neutral'}</li>
                  <li>5 – {language === 'he' ? 'מתאר אותי במידה רבה' : 'Describes me considerably'}</li>
                  <li>6 – {language === 'he' ? 'מתאר אותי מאוד' : 'Describes me very much'}</li>
                  <li>7 – {language === 'he' ? 'מתאר אותי בצורה מושלמת' : 'Describes me perfectly'}</li>
                </ul>
                <p className="mt-4 text-sm font-semibold text-blue-800">
                  💡 {language === 'he' 
                    ? 'טיפ: אין תשובות נכונות או שגויות - השב/י בספונטניות לפי האינטואיציה הראשונה שלך.'
                    : 'Tip: There are no right or wrong answers - respond spontaneously according to your first intuition.'}
                </p>
              </CardContent>
            </Card>
          )}
          
          <Card className="shadow-lg" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-xl">{sectionInfo.title}</CardTitle>
              <CardDescription>
                {language === 'he' ? 'שאלות' : 'Questions'} {sectionInfo.start} - {sectionInfo.end} {language === 'he' ? 'מתוך' : 'of'} 107
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
              {questionsInSection.map((questionNumber) => (
                <QuestionCard
                  key={questionNumber}
                  questionNumber={questionNumber}
                  questionText={questions[questionNumber - 1]}
                  value={responses[`q${questionNumber}`]}
                  onChange={(value) => updateResponse(questionNumber, value)}
                  language={language}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (currentStep === 6) {
      return (
        <Card className="shadow-lg" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <CardHeader>
            <CardTitle>
              {language === 'he' ? 'שאלה מסכמת (אופציונלית)' : 'Final Comment (Optional)'}
            </CardTitle>
            <CardDescription>
              {language === 'he' 
                ? 'האם יש משהו נוסף שחשוב לך שנדע עליך או על העסק שלך, שלא הופיע בשאלון?'
                : 'Is there anything else important for us to know about you or your business that wasn\'t covered in the questionnaire?'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={optionalComment}
              onChange={(e) => setOptionalComment(e.target.value)}
              placeholder={language === 'he' ? 'הכנס הערה אופציונלית...' : 'Enter optional comment...'}
              rows={4}
              dir={language === 'he' ? 'rtl' : 'ltr'}
            />
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">טוען שאלון...</p>
        </div>
      </div>
    );
  }

  if (isLoginRequired) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl border-t-4 border-accent">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-200">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <CardTitle className="text-3xl font-bold text-text-primary mb-2">
                נדרשת התחברות למערכת
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-text-secondary">
                כדי לשמור את התשובות שלכם בבטחה ולאפשר לכם לחזור ולהמשיך מאוחר יותר, יש להתחבר לחשבון.
              </p>
              
              <Button
                size="lg"
                onClick={handleLogin}
                className="w-full gradient-accent text-white text-lg py-6"
              >
                <LogIn className="w-5 h-5 mr-2" />
                התחבר עם Google והתחל
              </Button>
              
              <p className="text-sm text-text-muted mt-4">
                ההתחברות מאובטחת. אנחנו מכבדים את הפרטיות שלך.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === -1) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <div className="max-w-3xl mx-auto">
          <QuestionnaireIntro onStart={() => setCurrentStep(0)} language={language} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-100 select-none" dir={language === 'he' ? 'rtl' : 'ltr'} style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      <style>{`
        .questionnaire-container, .questionnaire-container * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        @media print {
          .questionnaire-container {
            display: none !important;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto questionnaire-container">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              {language === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {language === 'he' ? 'חזור' : 'Back'}
            </Button>
            <p className="text-sm text-text-secondary">
              {language === 'he' ? 'מחובר כ' : 'Logged in as'}: <span className="font-medium text-text-primary">{user?.full_name || user?.email}</span>
            </p>
            <div className="w-20"></div>
          </div>

          {/* Navigation buttons at top */}
          {currentStep > 0 && (
            <div className="flex justify-center items-center gap-4 mb-6">
              <Button
                onClick={prevStep}
                disabled={currentStep <= 0}
                variant="outline"
                size="sm"
              >
                {language === 'he' ? <ArrowRight className="w-4 h-4 ml-1" /> : <ArrowLeft className="w-4 h-4 mr-1" />}
                קודם
              </Button>

              {/* Page selector */}
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((step) => (
                  <button
                    key={step}
                    onClick={() => { setCurrentStep(step); autoSaveProgress(step); }}
                    disabled={step === currentStep}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                      step === currentStep
                        ? 'bg-slate-600 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    } ${step === currentStep ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {step === 0 ? 'פ' : step}
                  </button>
                ))}
              </div>

              <Button
                onClick={nextStep}
                disabled={currentStep >= 6}
                size="sm"
                className="bg-slate-600 hover:bg-slate-700 text-white"
              >
                הבא
                {language === 'he' ? <ArrowLeft className="w-4 h-4 mr-1" /> : <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-text-primary">
            {language === 'he' ? 'שאלון V107 Professional Framework' : 'V107 Professional Framework Questionnaire'}
          </h1>
          
          {currentStep === 0 ? (
            <p className="text-text-secondary mb-6">פרטים אישיים</p>
          ) : currentStep >= 1 && currentStep <= 5 ? (
            <p className="text-text-secondary mb-6">{getCurrentSectionInfo()?.title}</p>
          ) : currentStep === 6 ? (
            <p className="text-text-secondary mb-6">הערה אופציונלית</p>
          ) : null}
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>התקדמות</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-3 [&>div]:bg-accent" />
            <p className="text-xs text-text-muted mt-2">השאלון נשמר אוטומטית</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          {renderCurrentSection()}
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep <= -1}
            variant="outline"
            size="lg"
          >
            {language === 'he' ? <ArrowRight className="w-5 h-5 ml-2" /> : <ArrowLeft className="w-5 h-5 mr-2" />}
            קודם
          </Button>

          {currentStep < 6 ? (
            <Button onClick={nextStep} size="lg" className="bg-slate-600 hover:bg-slate-700 text-white">
              הבא
              {language === 'he' ? <ArrowLeft className="w-5 h-5 mr-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          ) : (
            <Button
              onClick={submitQuestionnaire}
              disabled={isSubmitting}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
              {isSubmitting ? 'שולח...' : 'שלח שאלון'}
            </Button>
          )}
        </div>
        
        {currentStep === 6 && (
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <h3 className="font-semibold text-lg mb-3">🩵 סיום השאלון: הדרך למפת היכולות האישית שלך</h3>
            <div className="text-sm text-gray-700 space-y-2 text-right">
              <p><strong>בדו"ח תקבל:</strong></p>
              <ul className="list-disc pr-6 space-y-1">
                <li>ניתוח ממוקד של 11 הממדים המרכזיים של הפרופיל המקצועי שלך.</li>
                <li>זיהוי חוזקות ליבה וצווארי בקבוק המעכבים את צמיחתך.</li>
                <li>מפת דרכים אסטרטגית הכוללת המלצות פעולה קונקרטיות לשיפור מידי.</li>
              </ul>
              <p className="mt-4"><strong>🚀 השלב הבא: V107-BOOSTER</strong></p>
              <p>עם קבלת הדו"ח, תוזמן/י להצטרף לתוכנית ה-BOOSTER הייחודית שלנו. זוהי תוכנית ליווי ממוקדת למשך 30 יום, המעניקה לך משימות יומיות קצרות לבניית "שרירים" בתחומים שהדו"ח זיהה כחשובים ביותר עבורך.</p>
              <p className="font-semibold mt-4">המעבר מתובנה לתוצאה מתחיל כאן.</p>
              <p className="font-semibold">המעבר מתובנה לתוצאה הוא מחויבות אישית שלך.</p>
              <p className="mt-2">בהצלחה רבה<br/>צוות V107</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}