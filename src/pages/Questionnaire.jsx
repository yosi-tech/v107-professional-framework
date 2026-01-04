import React, { useState, useEffect, useCallback } from "react";
import { QuestionnaireResponse } from "@/entities/QuestionnaireResponse";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, LogIn, Shield, Info, PlayCircle, User as UserIcon, FileText, Undo2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
  
  "אני לא מפחד/ת להביע דעה השונה מהרוב או מההנהלה.",
  "אני מציע/ה שיפורים גם כשיוזמה לא נדרשת במפורש.",
  "אני מקבל/ת ביקורת באופן פתוח ומנסה ללמוד ממנה.",
  "אני לוקח/ת אחריות על נושאים שאינם באחריותי הרשמית.",
  "כשמתעוררת בעיה, אני בין הראשונים לפעול ולמצוא פתרון.",
  "אני מהסס/ת ליזום פעולות חדשות ללא אישור מפורש מגורם בכיר.",
  "אני יודע/ת לרתום אחרים סביב רעיון או מטרה שאני מאמין/ה בה.",
  "אני נהנה/ת להוביל צוות או פרויקט ולנהל ביצוע.",
  "אני מעדיף/ה לעבוד לבד ולא להסתמך על תרומות של אחרים.",
  "אני רואה את עצמי כאדם שמניע ומדרבן אחרים לפעולה.",
  "אני מעדיף/ה שאחרים יקבלו את ההחלטות העיקריות בצוות.",
  "כשאני טועה, אני מודה בטעות ולומד מהחוויה ללא הסתייגות.",
  "אני נוטה להאשים גורמים חיצוניים כשדברים לא מצליחים.",
  
  "אני משקיע/ה אנרגיה בשמירה על שיתוף פעולה טוב בצוות.",
  "אני נהנה/ת לשתף רעיונות עם אחרים ולשמוע דעות מגוונות.",
  "אני מאמין/ה בעבודת צוות יותר מהישגים אישיים לבד.",
  "קשה לי לוותר על שליטה ולהאציל סמכויות לאחרים.",
  "אני יודע/ת לנהל קונפליקטים מורכבים בין חברי צוות.",
  "אני דואג/ת שכולם מבינים את התפקיד שלהם ואת המטרות המשותפות.",
  "אני מעדיף/ה שהדברים ייעשו בדרך שלי גם אם יש דעות שונות בצוות.",
  "אני מסוגל/ת לזהות חוזקות של אחרים ולהקצות משימות בהתאם.",
  "אני עומד/ת בהתחייבויות שלי באופן עקבי גם כשזה דורש מאמץ אישי נוסף.",
  "אני נחשב/ת לאדם שאפשר לסמוך על יושרתו ואמינותו.",
  "אני דואג/ת להעביר מסרים בצורה ברורה וישירה כדי להימנע מאי הבנות.",
  "אני מרגיש/ה נוח לדבר מול קבוצות גדולות או מנהלים בכירים.",
  "אני נמנע/ת מעימותים מילוליים גם כשיש לי ביקורת חשובה.",
  "אני באמת מקשיב/ה לאחרים, גם כשדעתם שונה באופן מהותי משלי.",
  "אני יודע/ת לשכנע אנשים בעזרת לוגיקה ועובדות ללא הפעלת לחץ.",
  "אני לפעמים קוטע/ת אחרים כשיש לי רעיון דחוף.",
  
  "אני מתכנן/ת את הזמן שלי מראש כדי לעמוד בכל המטרות שהצבתי.",
  "אני מסוגל/ת להבחין בין משימות חשובות (ארוכות טווח) לדחופות (מיידיות).",
  "אני נוטה לדחות עניינים משמעותיים עד הרגע האחרון.",
  "אני שם/ה לב קפדני לפרטים קטנים בעבודה שלי.",
  "אני יודע/ת לשמור על איזון יעיל בין משימות מרובות במקביל.",
  "כשאני עמוס/ה, אני נשאר/ת ממוקד/ת ומתקדם/ת לפי סדרי עדיפויות ברורים.",
  "אני מנצל/ת את זמני ביעילות רבה ביום עבודה רגיל.",
  "אני מקדיש/ה זמן ללמידה עצמית מעבר לדרישות התפקיד הישיר.",
  "אני נשאר/ת מעודכן/ת בהתפתחויות האחרונות בתחומי המומחיות שלי.",
  "אני שואף/ת להבין את הלוגיקה העמוקה מאחורי החלטות, ולא רק לבצע אותן.",
  "אני פתוח/ה לקבל משוב מקצועי גם כשזה לא נעים לשמוע.",
  "אני שואף/ת לשיפור עצמי מתמיד בכל תחום שאני מעורב/ת בו.",
  "אני מצליח/ה לשמור על איזון טוב בין עבודה לחיים אישיים.",
  "אני יודע/ת להפחית עומס כשאני מרגיש/ה עייפות או שחיקה נפשית.",
  "אני מרגיש/ה מוטיבציה פנימית חזקה להצליח ולהשיג הישגים.",
  "יש לי חזון ברור לגבי הכיוון המקצועי שלי בשנים הקרובות.",
  "אני מרגיש/ה תחושת משמעות בעבודה שאני עושה כל יום.",
  "אני מרגיש/ה שהעתיד המקצועי שלי תלוי בעיקר בי ובבחירות שאני עושה.",
  "אני שם/ה לב קפדני לפרטים קטנים בתוכניות עבודה.",
  "אני מבצע/ת באופן קבוע תהליכי מעקב ומשוב על הביצועים שלי.",
  "אני מרגיש/ה מוטיבציה גבוהה להתמודד עם אתגרים הדורשים למידה חדשה.",
  "אני מסוגל/ת לייצר פתרונות יצירתיים לבעיות מורכבות תחת לחץ זמן.",
  "אני מעריך/ה זמן איכות עם עצמי לחשיבה אסטרטגית ולצמיחה אישית.",
  "אני מנצל/ת את הרשת המקצועית שלי כדי לקבל תובנות חדשות ולפרוץ קדימה.",
  "אני משתמש/ת באופן יזום בטכנולוגיות חדשות כדי לשפר את הפרודוקטיביות שלי.",
  "אני רואה את עצמי כמוביל/ה טכנולוגי בתחום המקצועי שלי.",
  "אני נוטה לשקול את ההשלכות של פעולותיי על פני אופק של 3 שנים ומעלה.",
  "אני יוזם/ת שיחות עם מומחים או מנטורים כדי להרחיב את הידע שלי.",
  "אני משקיע/ה זמן בלמידה של כלים דיגיטליים חדשים שיכולים לשפר את עבודתי.",
  "אני מרגיש/ה בנוח לשאול שאלות כדי להבין דברים לעומק.",
  "אני מצליח/ה לשמור על איזון בין עבודה לחיים פרטיים גם בתקופות עמוסות.",
  "אני נוטה להקריב זמן אישי כדי לעמוד בדרישות מקצועיות.",
  "אני מרגיש/ה שחיקה או עייפות נפשית בתקופות של עומס עבודה ממושך.",
  "אני יודע/ת להגיד \"לא\" למשימות נוספות כשאני כבר עמוס/ה.",
  "אני שואף/ת להוביל שינויים ארגוניים או מקצועיים משמעותיים.",
  "אני נוטה להמתין עד שמישהו אחר ייזום שינוי לפני שאצטרף.",
  "אני משתמש/ת בכלים דיגיטליים כדי לייעל תהליכים בעבודה.",
  "אני רואה בטכנולוגיה כלי מרכזי להגברת פרודוקטיביות.",
  "אני יוזם/ת פרויקטים חדשים גם ללא תמיכה ראשונית מההנהלה.",
  "אני מרגיש/ה נוח להציע רעיונות חדשניים שיכולים לשנות את הסטטוס קוו.",
  "אני מעדיף/ה להישאר באזור הנוחות שלי ולא לנסות דברים חדשים.",
  "אני רואה את עצמי כמי שמוביל/ה שינויים במקום העבודה שלי.",
  "אני מוכן/ה לקחת סיכונים מחושבים כדי לקדם שינוי משמעותי.",
  "יש לי חזון ברור לעתיד המקצועי שלי.",
  "אני מצליח/ה להישאר ממוקד/ת ביעדים ארוכי טווח גם כשיש הסחות.",
  "אני לומד/ת בקלות מיומנויות חדשות הנדרשות לעבודה.",
  "אני יוזם/ת שינויים בתהליכי עבודה כדי לשפר תוצאות.",
  "אני פתוח/ה לקבל הכוונה מקצועית או ייעוץ ממומחה חיצוני.",
  "אני מאמין/ה שהשאלון הזה יסייע לי לחשוף דפוסים חשובים עליי.",
  "אני מלא מוטיבציה ליישם את המלצות הדו\"ח, מתוך הבנה שהן מהוות כלי משמעותי להצלחתי המקצועית."
];

const questionsEn = questionsHe; // For now, we'll keep the same for both languages

const sectionTitlesHe = [
  { start: 1, end: 11, title: "מקטע 1: מיקוד, החלטה וחוסן" },
  { start: 12, end: 28, title: "מקטע 2: גמישות, יצירתיות וחדשנות" },
  { start: 29, end: 41, title: "מקטע 3: מנהיגות, יוזמה ואחריות" },
  { start: 42, end: 57, title: "מקטע 4: תקשורת, שיתוף פעולה ויושרה" },
  { start: 58, end: 107, title: "מקטע 5: תכנון, למידה וצמיחה" }
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
          {language === 'he' ? 'גרסה B7 PRO V4' : 'Version B7 PRO V4'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`${language === 'he' ? 'text-right' : 'text-left'} text-text-secondary space-y-4`}>
          <p className="font-semibold text-lg text-text-primary">
            {language === 'he' ? 'ברוך הבא לשאלון V107.' : 'Welcome to the V107 Questionnaire.'}
          </p>
          <ul className="space-y-2 list-disc pr-6">
            <li>{language === 'he' ? 'כלי אבחון מקצועי זה נועד למפות את היכולות, הדפוסים והנטיות האישיות והמקצועיות שלך בהתבסס על 11 ממדים פסיכומטריים ליבתיים.' : 'This professional diagnostic tool is designed to map your personal and professional abilities, patterns, and tendencies based on 11 core psychometric dimensions.'}</li>
            <li>{language === 'he' ? 'שאלון V107 ובעקבותיו דו"ח V107 פותחו בתהליך מקצועי רב־שלבי ונמצאים בתהליך ולידציה מתמשך מול קבוצות מיקוד של מומחי קריירה, פסיכולוגיה תעסוקתית ואסטרטגים של התפתחות אישית.' : 'The V107 questionnaire and its subsequent V107 report were developed through a multi-stage professional process and are undergoing continuous validation with focus groups of career experts, occupational psychologists, and personal development strategists.'}</li>
            <li>{language === 'he' ? 'הבהרה משפטית: הדו"ח המופק מהווה כלי אבחוני בלבד ואינו מהווה ייעוץ משפטי, עסקי או פסיכולוגי מחייב. אין במסקנות הדו"ח משום הבטחה להישגים או לתוצאות כלכליות, והשימוש במידע המוצג בו הוא על דעתו ובאחריותו הבלעדית של המשתמש.' : 'Legal clarification: The generated report is solely a diagnostic tool and does not constitute binding legal, business, or psychological advice. The conclusions of the report do not promise achievements or financial results, and the use of the information presented therein is at the sole discretion and responsibility of the user.'}</li>
            <li>{language === 'he' ? 'משך המילוי: כ־20 דקות. השאלון כולל 107 שאלות המחולקות ל־5 מקטעים ממוקדים.' : 'Completion time: Approximately 20 minutes. The questionnaire includes 107 questions divided into 5 focused sections.'}</li>
            <li className="font-semibold">{language === 'he' ? 'ככל שתשובותיך יהיו כנות כך איכות הדו"ח שתקבל תהיה גבוהה יותר.' : 'The more honest your answers, the higher the quality of the report you will receive.'}</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-lg mb-2">{language === 'he' ? 'סודיות, פרטיות ומחיקת נתונים' : 'Confidentiality, Privacy, and Data Deletion'}</h3>
          <p className="text-sm text-gray-700">{language === 'he' ? 'אנו מתחייבים לסודיות מלאה:' : 'We commit to full confidentiality:'}</p>
          <ol className="list-decimal pr-6 text-sm text-gray-700 space-y-1 mt-2">
            <li>{language === 'he' ? 'פרטי הזיהוי (שם, מייל, גיל) נמחקים מהמערכת 30 יום לאחר הפקת הדו"ח האישי.' : 'Identification details (name, email, age) are deleted from the system 30 days after the personal report is generated.'}</li>
            <li>{language === 'he' ? 'תשובות השאלון עצמן נשמרות באופן אנונימי לחלוטין לצורך מחקר מתמשך ושיפור דיוק המערכת.' : 'The questionnaire answers themselves are kept completely anonymous for continuous research and system accuracy improvement.'}</li>
            <li>{language === 'he' ? 'הנתונים לא מועברים לשום גורם שלישי.' : 'Data is not transferred to any third party.'}</li>
          </ol>
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

const PersonalInfoForm = ({ data, onChange, language }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const occupationOptions = [
    { value: 'marketing', label: 'שיווק' },
    { value: 'sales', label: 'מכירות' },
    { value: 'hr', label: 'משאבי אנוש / גיוס' },
    { value: 'tech', label: 'תכנות/טכנולוגיה' },
    { value: 'entrepreneurship', label: 'יזמות / ניהול עסק' },
    { value: 'education', label: 'חינוך והדרכה' },
    { value: 'finance', label: 'פיננסים / ייעוץ כלכלי' },
    { value: 'medical', label: 'רפואה / פרא-רפואה' },
    { value: 'law', label: 'משפטים' },
    { value: 'design', label: 'עיצוב / UX / UI' },
    { value: 'logistics', label: 'תפעול ולוגיסטיקה' },
    { value: 'customer_service', label: 'שירות לקוחות' },
    { value: 'other', label: 'אחר' }
  ];

  const interestOptions = [
    { value: 'art', label: 'אמנות/יצירה' },
    { value: 'technology', label: 'טכנולוגיה/גאדגטים' },
    { value: 'education', label: 'חינוך/פיתוח אישי' },
    { value: 'finance', label: 'פיננסים/השקעות' },
    { value: 'health', label: 'ספורט/בריאות/תזונה' },
    { value: 'travel', label: 'טיולים/תרבויות' },
    { value: 'food', label: 'בישול/קולינריה' },
    { value: 'social_activism', label: 'אקטיביזם/סביבה' },
    { value: 'business_dev', label: 'פיתוח עסקי/יזמות' },
    { value: 'psychology', label: 'פסיכולוגיה/התנהגות' },
    { value: 'other', label: 'אחר' }
  ];

  const toggleInterest = (interest) => {
    const current = data.interests || [];
    if (current.includes(interest)) {
      onChange({ ...data, interests: current.filter(i => i !== interest) });
    } else if (current.length < 3) { // Allow selecting up to 3 interests
      onChange({ ...data, interests: [...current, interest] });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-accent" />
          {language === 'he' ? 'פרטי ממלא/ת השאלון' : 'Respondent Information'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="full_name">שם מלא <span className="text-red-500">*</span></Label>
          <Input
            id="full_name"
            value={data.full_name || ""}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            placeholder="ישראל ישראלי"
            required
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">גיל</Label>
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
            <Label>מין</Label>
            <RadioGroup
              value={data.gender || ''}
              onValueChange={(value) => handleInputChange("gender", value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-reverse space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">זכר</Label>
              </div>
              <div className="flex items-center space-x-reverse space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">נקבה</Label>
              </div>
              <div className="flex items-center space-x-reverse space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">אחר</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label htmlFor="occupation">תחום עיסוק קיים</Label>
          <Select value={data.occupation || ''} onValueChange={(value) => handleInputChange("occupation", value)} dir="rtl">
            <SelectTrigger>
              <SelectValue placeholder="בחר תחום עיסוק" />
            </SelectTrigger>
            <SelectContent>
              {occupationOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data.occupation === 'other' && (
            <Input
              className="mt-2"
              value={data.occupation_other || ""}
              onChange={(e) => handleInputChange("occupation_other", e.target.value)}
              placeholder="פרט בקצרה"
              dir="rtl"
            />
          )}
        </div>

        <div>
          <Label>תחומי עניין (בחר עד 3)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {interestOptions.map(opt => (
              <Button
                key={opt.value}
                type="button"
                variant={(data.interests || []).includes(opt.value) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleInterest(opt.value)}
                disabled={(data.interests || []).length >= 3 && !(data.interests || []).includes(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          {(data.interests && data.interests.includes('other')) && (
            <Input
              className="mt-2"
              value={data.interests_other || ""}
              onChange={(e) => handleInputChange("interests_other", e.target.value)}
              placeholder="פרט תחום עניין אחר"
              dir="rtl"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const QuestionCard = ({ questionNumber, questionText, value, onChange, language }) => {
  return (
    <div className="mb-6 pb-6 border-b last:border-b-0">
      <h3 className="text-lg font-semibold mb-4">
        {questionNumber}. {questionText}
      </h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">1 (לא מתאר אותי כלל)</span>
        <span className="text-sm text-gray-500">7 (מתאר אותי מאוד)</span>
      </div>
      <RadioGroup
        value={value ? value.toString() : ''}
        onValueChange={(val) => onChange(parseInt(val, 10))}
        className="flex justify-between"
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

  const loadExistingResponses = useCallback(async (currentUser) => {
    try {
      const existingResponses = await QuestionnaireResponse.filter({
        created_by: currentUser.email,
        status: 'in_progress',
        version: 'B7_PRO_V4'
      }, '-updated_date', 1);

      if (existingResponses.length > 0) {
        const savedResponse = existingResponses[0];
        setPersonalInfo(savedResponse.personal_info || {});
        setResponses(savedResponse.responses || {});
        setOptionalComment(savedResponse.optional_comment || '');
        setSavedResponseId(savedResponse.id);
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
    window.scrollTo(0, 0);
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

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
            (async () => {
              if (savedResponseId && user) {
                try {
                  await base44.entities.QuestionnaireResponse.update(savedResponseId, {
                    status: 'abandoned'
                  });
                  // Optionally send abandonment email as in original
                  // For now, I'm just adapting the exact outline provided, which removed the email sending part
                  // If email sending is critical, it should be re-added here.
                } catch (error) {
                  console.error("Failed to mark as abandoned:", error);
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

  const autoSaveProgress = useCallback(async () => {
    if (!user) return;

    try {
      const hasPersonalInfo = personalInfo.full_name;
      const hasResponses = Object.keys(responses).length > 0;

      if (!hasPersonalInfo && !hasResponses) return;

      const data = {
        personal_info: { ...personalInfo, email: user.email },
        responses: responses,
        optional_comment: optionalComment,
        language: language,
        version: 'B7_PRO_V4',
        status: 'in_progress'
      };

      if (savedResponseId) {
        await QuestionnaireResponse.update(savedResponseId, data);
      } else {
        const newResponse = await QuestionnaireResponse.create(data);
        setSavedResponseId(newResponse.id);
      }
    } catch (error) {
      console.error('Error auto-saving progress:', error);
    }
  }, [user, personalInfo, responses, optionalComment, language, savedResponseId]);

  useEffect(() => {
    if (user && (Object.keys(responses).length > 0 || personalInfo.full_name)) {
      const timeoutId = setTimeout(() => {
        autoSaveProgress();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [user, responses, personalInfo, autoSaveProgress]);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  const updateResponse = (questionNumber, value) => {
    setResponses((prev) => ({
      ...prev,
      [`q${questionNumber}`]: value
    }));
  };

  const validatePersonalInfo = () => {
    if (!personalInfo.full_name?.trim()) {
      alert('יש להזין שם מלא');
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
        language: language,
        version: 'B7_PRO_V4',
        status: 'completed'
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
      console.error('Error submitting questionnaire:', error);
      alert('שגיאה בשליחת השאלון');
    }
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep === 0 && !validatePersonalInfo()) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, -1));
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
      return <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} language={language} />;
    }
    
    if (currentStep >= 1 && currentStep <= 5) {
      const sectionInfo = getCurrentSectionInfo();
      if (!sectionInfo) return null;
      
      const questionsInSection = [];
      for (let i = sectionInfo.start; i <= sectionInfo.end; i++) {
        questionsInSection.push(i);
      }

      return (
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-xl">{sectionInfo.title}</CardTitle>
            <CardDescription>
              שאלות {sectionInfo.start} - {sectionInfo.end} מתוך 107
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
      );
    }

    if (currentStep === 6) {
      return (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              שאלה מסכמת (אופציונלית)
            </CardTitle>
            <CardDescription>
              האם יש משהו נוסף שחשוב לך שנדע עליך או על העסק שלך, שלא הופיע בשאלון?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={optionalComment}
              onChange={(e) => setOptionalComment(e.target.value)}
              placeholder="הכנס הערה אופציונלית..."
              rows={4}
              dir="rtl"
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-100" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
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