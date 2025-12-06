import React, { useState, useEffect, useCallback } from "react";
import { QuestionnaireResponse } from "@/entities/QuestionnaireResponse";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, LogIn, Shield, Info, PlayCircle, User as UserIcon, FileText, Undo2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/components/i18n/useTranslation";

const questionsHe = [
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

const questionsEn = [
  "To what extent do you feel your formal education provides a strong foundation for entrepreneurship?",
  "To what extent are the courses or training you've completed relevant to entrepreneurship and business?",
  "To what extent does your language proficiency support your ability to operate in international markets?",
  "To what extent has your accumulated professional experience prepared you to run an independent business?",
  "To what extent do you receive family or environmental support for an entrepreneurial step?",
  "To what extent does your overall health condition allow you to run a business?",
  "To what extent do you feel you have basic financial stability that enables taking an entrepreneurial step?",
  "To what extent do you receive encouragement and support from those close to you (family/friends)?",
  "To what extent can you explain what drives you to be independent?",
  "To what extent does your experience in your current role prepare you for entrepreneurship?",
  
  "To what extent do you have significant experience in various professional fields?",
  "To what extent do you possess professional skills that can serve you as an entrepreneur?",
  "To what extent are you skilled in operating current tools and technologies?",
  "To what extent do your professional achievements indicate an ability to succeed in entrepreneurship?",
  "To what extent do you feel comfortable managing or working in a team?",
  "To what extent is your experience in entrepreneurship or previous business management significant?",
  "To what extent are you experienced in budget and financial management?",
  "To what extent are you experienced in marketing and sales?",
  "To what extent are you experienced in operations and customer service?",
  "To what extent are you experienced in developing new products or services?",
  "To what extent do you experience decision-making under uncertainty?",
  "To what extent do you have experience in business negotiations?",
  "To what extent are you experienced in building business partnerships?",
  "To what extent do you have experience working with international parties?",
  "To what extent are you experienced in managing employees and leading teams?",
  "To what extent have you gained experience in managing complex projects?",
  "To what extent are you experienced in raising capital from investors/financial institutions?",
  "To what extent are you experienced in implementing new technologies in business?",
  "To what extent do you have experience leading organizational/business change processes?",
  "To what extent do your past achievements demonstrate perseverance in the face of challenges?",
  
  "To what extent is it clear to you in which business areas you would like to operate?",
  "To what extent is it important to you that the field you operate in has social value/mission?",
  "To what extent is it important to you that the business field ensures high income potential?",
  "To what extent is it important to you to operate in a stable and secure business field?",
  "To what extent do you identify growing markets or sectors in which you would like to operate?",
  "To what extent are your hobbies or interests related to entrepreneurship or business development?",
  "To what extent have you already examined ideas/possibilities for a potential venture?",
  "To what extent do you have regular free time to invest in new entrepreneurship?",
  "To what extent do you have liquid equity for investment?",
  "To what extent are you open to recruiting external investor(s)?",
  "To what extent do you have relevant business connections that can help the venture?",
  "To what extent do you enjoy environmental/social support in establishing a business?",
  "To what extent do you have suitable potential partners for the venture?",
  "To what extent are you willing to take bank financing for establishment/growth?",
  "To what extent are you available for travel/meetings outside your residential area?",
  "To what extent do you have relevant equipment/assets (office, vehicle, computing) that assist?",
  "To what extent are you skilled in using digital tools for management and marketing?",
  "To what extent do you have clear business goals for the coming year?",
  "To what extent do you have clear personal goals for the coming year?",
  "To what extent is your monthly income target clear and defined?",
  "To what extent is it important to you to maintain work-life balance?",
  "To what extent is your vision for the 3-5 year range clear to you?",
  "To what extent is it clear to you what would be considered a 'big success' for you in a year?",
  "To what extent do your concerns about starting a business hold you back currently?",
  "To what extent is it clear to you what are the 2-3 essential conditions for entering a new business?",
  "To what extent do you identify personal traits that help you succeed?",
  "To what extent do professional weaknesses you have hinder your progress?",
  "To what extent do time limitations affect your ability to progress?",
  "To what extent do financial limitations affect your ability to progress?",
  "To what extent do family/personal limitations affect your ability to progress?",
  
  "To what extent do you prefer to work alone (versus in a team)?",
  "To what extent do you prefer to lead a new venture from scratch (versus joining an existing one)?",
  "To what extent are you organized and orderly in daily work?",
  "To what extent are you willing to take calculated risks?",
  "To what extent do you cope well with stressful situations?",
  "To what extent do you make decisions quickly when required?",
  "To what extent are you creative in creating new solutions?",
  "To what extent are you analytical in data analysis and decisions?",
  "To what extent are you a visionary (forward thinking, strategic perception)?",
  "To what extent are you an executor (implementation, execution)?",
  "To what extent is it important to you to manage employees directly?",
  "To what extent is it important to you to work directly with clients?",
  "To what extent do you have basic knowledge in financial management (budget, reports)?",
  "To what extent do you have knowledge in digital marketing (websites, networks, paid promotion)?",
  "To what extent do you have knowledge and skill in sales (phone/field/online)?",
  "To what extent do you have basic knowledge in legal matters/business contracts?",
  "To what extent do you have technological/computing knowledge that assists in managing the business?",
  "To what extent do you have knowledge in operations and logistics?",
  "To what extent do you have experience in training/coaching others?",
  "To what extent do you have knowledge in project management (planning, scheduling, control)?",
  "To what extent do you have knowledge in human resources management/recruitment?",
  "To what extent do you have knowledge in design/UX/product development?",
  "To what extent do you estimate that professional guidance could benefit you in the coming year?",
  "To what extent do you believe you could manage without guidance in key areas?",
  "To what extent is it important to you that guidance be regular with a single individual (versus a network of experts)?",
  "To what extent would you like to serve as a mentor/guide to others in your field?",
  "To what extent is your business vision for the coming years clear to you?",
  "To what extent is it clear to you what type of customers you wish to serve?",
  "To what extent is it clear to you who your main competitors are?",
  "To what extent is it clear to you what your main competitive advantage is?",
  
  "To what extent is it clear to you what drives you to get up and work every day?",
  "To what extent are you determined to realize your professional dream?",
  "To what extent are you proud of your achievements to date (professional/personal)?",
  "To what extent are you open to changing habits to succeed?",
  "To what extent are you open to receiving professional feedback from others?",
  "To what extent does feedback from others actually influence your decision-making?",
  "To what extent is it clear to you the main area in which you wish to improve in the coming years?",
  "To what extent is your thinking long-term (beyond the coming year)?",
  "To what extent do you aspire to break existing boundaries in your market?",
  "To what extent are you open to innovation and trying new solutions?",
  "To what extent are you open to international collaborations?",
  "To what extent are you open to adopting new technologies in business?",
  "To what extent are you open to listening and integrating new ideas from team/consultants?",
  "To what extent are you able to accurately define success metrics (KPIs) for the venture?",
  "To what extent do you tend to postpone tasks? (In this item: 1=always postpones, 7=almost never)",
  "To what extent do you persevere in completing tasks to full completion?",
  "To what extent do you feel the profile obtained from the questionnaire will faithfully reflect your image as an entrepreneur?"
];

const sectionTitlesHe = [
  { start: 1, end: 10, title: "חלק א – רקע והכשרה" },
  { start: 11, end: 30, title: "חלק ב – ניסיון מקצועי וכישורים" },
  { start: 31, end: 60, title: "חלק ג – תחומי עניין, משאבים ומוטיבציה" },
  { start: 61, end: 90, title: "חלק ד – סגנון עבודה, נטיות יזמיות וכשירויות ליבה" },
  { start: 91, end: 107, title: "חלק ה – סיכום אישי, חזון ומדדי הצלחה" }
];

const sectionTitlesEn = [
  { start: 1, end: 10, title: "Part A – Background & Training" },
  { start: 11, end: 30, title: "Part B – Professional Experience & Skills" },
  { start: 31, end: 60, title: "Part C – Interests, Resources & Motivation" },
  { start: 61, end: 90, title: "Part D – Work Style, Entrepreneurial Tendencies & Core Competencies" },
  { start: 91, end: 107, title: "Part E – Personal Summary, Vision & Success Metrics" }
];

const QuestionnaireIntro = ({ onStart, language }) => {
  return (
    <Card className="shadow-xl border-t-4 border-accent" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-6">
        <div className="bg-slate-600 mb-6 mx-auto w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-200">
          <FileText className="w-10 h-10 text-accent" />
        </div>
        <CardTitle className="text-3xl font-bold text-text-primary mb-2">
          {language === 'he' ? 'שאלון V107 ליזמים' : 'V107 Entrepreneurial Questionnaire'}
        </CardTitle>
        <CardDescription className="text-lg text-text-secondary">
          {language === 'he' ? 'גרסה B6 · v1.0-LTS' : 'Version B6 · v1.0-LTS'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`${language === 'he' ? 'text-right' : 'text-left'} text-text-secondary space-y-4 bg-slate-50 p-4 rounded-lg border`}>
          <p className="whitespace-pre-wrap leading-relaxed">
            {language === 'he' ?
            'שאלון V107 הוא כלי אבחון מתקדם, שנבנה כדי להפיק עבורך דו״ח אישי ומעמיק ברמה הגבוהה ביותר.\n\nהמערכת פותחה על ידי צוות עלית לפני כחמש שנים, ומאז מולאה בהצלחה על ידי אלפי יזמים ובעלי עסקים ברחבי העולם.\n\nמטרת השאלון היא לספק תמונת מצב מלאה ומדויקת ככל האפשר לגבי יכולותיך, חוזקותיך, מגבלותיך ושאיפותיך — ולתרגם זאת לדו״ח מקצועי, ברור ויישומי שתקבל/י לאחר השלמת השאלון ובתוך עד 7 ימי עבודה.' :
            'The V107 questionnaire is an advanced assessment tool, designed to deliver a highly professional and in-depth personal report.\n\nDeveloped by the Elit team five years ago, it has since been completed by thousands of entrepreneurs and business owners worldwide.\n\nIts purpose is to provide the most accurate possible picture of your abilities, strengths, limitations, and aspirations — translated into a clear, professional, and actionable report delivered within 7 business days.'
            }
          </p>
        </div>
        <div className={`${language === 'he' ? 'text-right' : 'text-left'} text-xs text-text-muted space-y-2 bg-slate-50 p-4 rounded-lg border`}>
          <p>
            {language === 'he' ?
            'השאלון כולל 107 שאלות סגורות בסולם 1–7 (1=כלל לא, 7=במידה רבה מאוד) ושאלה מסכמת אחת אופציונלית.' :
            'The questionnaire includes 107 closed questions rated on a 1–7 scale (1 = Not at all, 7 = Very much so), plus one optional open question at the end.'
            }
          </p>
          <p>
            {language === 'he' ?
            'הדו״ח האישי שלך יעבור ניתוח כמותי ומעמיק, ובקרת איכות אנושית של צוות מומחים בינלאומי, כדי להבטיח תוצאה עדכנית, אמינה ומדויקת.' :
            'Your personal report undergoes quantitative and qualitative analysis, followed by international expert review, ensuring accuracy, reliability, and relevance.'
            }
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

const PersonalInfoForm = ({ data, onChange, language }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-accent" />
          {language === 'he' ? 'פרטים אישיים' : 'Personal Information'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
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
          <div>
            <Label htmlFor="age">{language === 'he' ? 'גיל' : 'Age'}</Label>
            <Input
              id="age"
              type="number"
              value={data.age || ""}
              onChange={(e) => handleInputChange("age", parseInt(e.target.value, 10) || "")}
              placeholder={language === 'he' ? 'לדוגמה: 35' : 'e.g., 35'}
              min={16}
              max={90}
            />
          </div>
        </div>
        
        <div>
          <Label>{language === 'he' ? 'מין' : 'Gender'}</Label>
          <RadioGroup
            value={data.gender || ''}
            onValueChange={(value) => handleInputChange("gender", value)}
            className="flex gap-4 mt-2"
          >
            <div className={`flex items-center ${language === 'he' ? 'space-x-reverse' : ''} space-x-2`}>
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">{language === 'he' ? 'זכר' : 'Male'}</Label>
            </div>
            <div className={`flex items-center ${language === 'he' ? 'space-x-reverse' : ''} space-x-2`}>
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">{language === 'he' ? 'נקבה' : 'Female'}</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="marital_status">{language === 'he' ? 'מצב משפחתי' : 'Marital Status'}</Label>
          <Input
            id="marital_status"
            value={data.marital_status || ""}
            onChange={(e) => handleInputChange("marital_status", e.target.value)}
            placeholder={language === 'he' ? 'רווק/ה, נשוי/ה, אחר' : 'Single, Married, Other'}
          />
        </div>

        <div>
          <Label htmlFor="address">{language === 'he' ? 'כתובת (עיר/אזור מגורים)' : 'Address (City/Region)'}</Label>
          <Input
            id="address"
            value={data.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder={language === 'he' ? 'תל אביב, ישראל' : 'New York, USA'}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">{language === 'he' ? 'טלפון' : 'Phone'}</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder={language === 'he' ? '050-1234567' : '+1-555-1234'}
            />
          </div>
          <div>
            <Label htmlFor="email">{language === 'he' ? 'דוא"ל' : 'Email'} <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={language === 'he' ? 'example@domain.com' : 'example@domain.com'}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuestionCard = ({ questionNumber, questionText, value, onChange, language }) => {
  const isHebrew = language === 'he';
  
  return (
    <div className="mb-6 pb-6 border-b last:border-b-0">
      <h3 className="text-lg font-semibold mb-4">
        {questionNumber}. {questionText}
      </h3>
      <div className="flex items-center justify-between mb-4">
        {isHebrew ? (
          <>
            <span className="text-sm text-gray-500">7 (במידה רבה מאוד)</span>
            <span className="text-sm text-gray-500">1 (כלל לא)</span>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-500">1 (Not at all)</span>
            <span className="text-sm text-gray-500">7 (Very much so)</span>
          </>
        )}
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
        version: 'B6_v1.0-LTS'
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
      const currentUser = await User.me();
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

  // Set navigation blocking status
  useEffect(() => {
    setShouldBlockNavigation(currentStep >= 0);
  }, [currentStep]);

  // Warning before leaving questionnaire page (browser close/refresh)
  useEffect(() => {
    if (shouldBlockNavigation) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = language === 'he' ? 
          'האם אתה בטוח שברצונך לעזוב? התקדמותך נשמרה אוטומטית ותוכל לחזור ולהמשיך מאוחר יותר.' :
          'Are you sure you want to leave? Your progress has been saved automatically and you can return to continue later.';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [shouldBlockNavigation, language]);

  // Intercept all Link clicks and navigation attempts
  useEffect(() => {
    if (!shouldBlockNavigation) return;

    const handleClick = async (e) => {
      // Check if clicked element or its parent is a link
      const link = e.target.closest('a');
      if (link && link.href) {
        const targetUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // If navigating to a different page within the app
        if (targetUrl.origin === currentUrl.origin && targetUrl.pathname !== currentUrl.pathname) {
          e.preventDefault();
          e.stopPropagation();
          
          const confirmMessage = language === 'he' ?
            'האם אתה בטוח שברצונך לעזוב? התקדמותך נשמרה אוטומטית ותוכל לחזור ולהמשיך מאוחר יותר.' :
            'Are you sure you want to leave? Your progress has been saved automatically and you can return to continue later.';
          
          if (window.confirm(confirmMessage)) {
            // Mark questionnaire as abandoned and send email
            if (currentResponseId && user) {
              try {
                await base44.entities.QuestionnaireResponse.update(currentResponseId, {
                  status: 'abandoned'
                });

                // Send abandonment email
                const { getAbandonmentEmailTemplate } = await import('@/components/email/AbandonmentEmailTemplate');
                const surveyUrl = `${window.location.origin}${createPageUrl('Survey')}`;
                const userName = personalInfo.full_name || user.full_name || 'משתמש';
                const userEmail = personalInfo.email || user.email;
                
                const emailTemplate = getAbandonmentEmailTemplate(userName, surveyUrl, language);

                await base44.integrations.Core.SendEmail({
                  to: userEmail,
                  subject: emailTemplate.subject,
                  body: emailTemplate.html
                });

                // Log the email
                await base44.entities.EmailLog.create({
                  to_email: userEmail,
                  email_type: 'abandonment_survey',
                  subject: emailTemplate.subject,
                  related_user_email: userEmail,
                  related_questionnaire_response_id: currentResponseId,
                  sent_manually: false,
                  language: language
                });
              } catch (error) {
                console.error("Failed to mark as abandoned or send email:", error);
              }
            }
            
            window.location.href = link.href;
          }
        }
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [shouldBlockNavigation, language, currentResponseId, user, personalInfo]);

  const autoSaveProgress = useCallback(async () => {
    if (!user) return;

    try {
      const hasPersonalInfo = personalInfo.full_name || personalInfo.email;
      const hasResponses = Object.keys(responses).length > 0;

      if (!hasPersonalInfo && !hasResponses) return;

      const data = {
        personal_info: personalInfo,
        responses: responses,
        optional_comment: optionalComment,
        language: language,
        version: 'B6_v1.0-LTS',
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

  const handleLogin = async () => {
    try {
      await User.loginWithRedirect(window.location.href);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const updateResponse = (questionNumber, value) => {
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
    if (!personalInfo.email?.trim()) {
      alert(language === 'he' ? 'יש להזין כתובת דוא"ל' : 'Please enter your email address');
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
      alert(language === 'he' ?
      `יש לענות על כל השאלות. שאלות חסרות: ${unansweredQuestions.join(', ')}` :
      `Please answer all questions. Missing questions: ${unansweredQuestions.join(', ')}`
      );
      return false;
    }

    return true;
  };

  const submitQuestionnaire = async () => {
    if (!user || !validateForSubmission()) return;

    setIsSubmitting(true);
    try {
      const finalData = {
        personal_info: personalInfo,
        responses: responses,
        optional_comment: optionalComment,
        language: language,
        version: 'B6_v1.0-LTS',
        status: 'completed'
      };

      let finalResponseId = savedResponseId;

      if (savedResponseId) {
        await QuestionnaireResponse.update(savedResponseId, finalData);
      } else {
        const newResponse = await QuestionnaireResponse.create(finalData);
        finalResponseId = newResponse.id;
      }

      navigate(createPageUrl(`Completion?responseId=${finalResponseId}`));
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert(language === 'he' ? 'שגיאה בשליחת השאלון' : 'Error submitting questionnaire');
    }
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep === 0 && !validatePersonalInfo()) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6)); // 6 for optional comment
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
    // 8 total steps: 1 personal info + 5 sections + 1 optional + 1 (imaginary complete)
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
              {language === 'he' ? 
                `שאלות ${sectionInfo.start} - ${sectionInfo.end} מתוך 107` :
                `Questions ${sectionInfo.start} - ${sectionInfo.end} out of 107`
              }
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
              {language === 'he' ? 'שאלה מסכמת (אופציונלית)' : 'Final Question (Optional)'}
            </CardTitle>
            <CardDescription>
              {language === 'he' ?
              'האם יש משהו נוסף שחשוב לך שנדע עליך או על העסק שלך, שלא הופיע בשאלון?' :
              'Is there anything else you would like us to know about you or your business that was not covered in this questionnaire?'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={optionalComment}
              onChange={(e) => setOptionalComment(e.target.value)}
              placeholder={language === 'he' ? 'הכנס הערה אופציונלית...' : 'Enter optional comment...'}
              rows={4}
            />
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">{language === 'he' ? 'טוען שאלון...' : 'Loading questionnaire...'}</p>
        </div>
      </div>
    );
  }

  if (isLoginRequired) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl border-t-4 border-accent">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-200">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <CardTitle className="text-3xl font-bold text-text-primary mb-2">
                {language === 'he' ? 'נדרשת התחברות למערכת' : 'Login Required'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-text-secondary">
                {language === 'he' ? 'כדי לשמור את התשובות שלכם בבטחה ולאפשר לכם לחזור ולהמשיך מאוחר יותר, יש להתחבר לחשבון.' : 'To save your answers securely and allow you to return and continue later, please log in.'}
              </p>
              
              <Button
                size="lg"
                onClick={handleLogin}
                className="w-full gradient-accent text-white text-lg py-6"
              >
                <LogIn className={`w-5 h-5 ${language === 'he' ? 'mr-2' : 'ml-2'}`} />
                {language === 'he' ? 'התחבר עם Google והתחל' : 'Login with Google and Start'}
              </Button>
              
              <p className="text-sm text-text-muted mt-4">
                {language === 'he' ? 'ההתחברות מאובטחת. אנחנו מכבדים את הפרטיות שלך.' : 'Secure login. We respect your privacy.'}
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
        <div className="max-w-2xl mx-auto">
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
            {language === 'he' ? 'שאלון V107 ליזמים' : 'V107 Entrepreneurial Questionnaire'}
          </h1>
          
          {currentStep === 0 ? (
            <p className="text-text-secondary mb-6">
              {language === 'he' ? 'פרטים אישיים' : 'Personal Information'}
            </p>
          ) : currentStep >= 1 && currentStep <= 5 ? (
            <p className="text-text-secondary mb-6">
              {getCurrentSectionInfo()?.title}
            </p>
          ) : currentStep === 6 ? (
            <p className="text-text-secondary mb-6">
              {language === 'he' ? 'הערה אופציונלית' : 'Optional Comment'}
            </p>
          ) : null}
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>{language === 'he' ? 'התקדמות' : 'Progress'}</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-3 [&>div]:bg-accent" />
            <p className="text-xs text-text-muted mt-2">{language === 'he' ? 'השאלון נשמר אוטומטית' : 'Questionnaire is auto-saved'}</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          {renderCurrentSection()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep <= -1}
            variant="outline"
            size="lg"
          >
            {language === 'he' ? <ArrowRight className="w-5 h-5 ml-2" /> : <ArrowLeft className="w-5 h-5 mr-2" />}
            {language === 'he' ? 'קודם' : 'Previous'}
          </Button>

          {currentStep < 6 ? (
            <Button onClick={nextStep} size="lg" className="bg-slate-600 hover:bg-slate-700 text-white">
              {language === 'he' ? 'הבא' : 'Next'}
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
              {isSubmitting ?
                (language === 'he' ? 'שולח...' : 'Submitting...') :
                (language === 'he' ? 'שלח שאלון' : 'Submit Questionnaire')
              }
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}