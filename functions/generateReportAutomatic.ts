import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// 11 Core Dimensions (V9)
const CORE_DIMENSIONS = {
  resilience: { nameHe: 'חוסן', nameEn: 'Resilience', questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  flexibility: { nameHe: 'גמישות', nameEn: 'Flexibility', questions: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28] },
  leadership: { nameHe: 'מנהיגות', nameEn: 'Leadership', questions: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41] },
  communication: { nameHe: 'תקשורת', nameEn: 'Communication', questions: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57] },
  planning: { nameHe: 'תכנון', nameEn: 'Planning', questions: [58, 59, 60, 61, 62, 63, 64, 76, 77] },
  learning: { nameHe: 'למידה', nameEn: 'Learning', questions: [65, 66, 67, 68, 69, 78, 85, 86, 87, 103] },
  vision: { nameHe: 'חזון', nameEn: 'Vision', questions: [72, 73, 74, 75, 80, 84, 101] },
  technology: { nameHe: 'טכנולוגיה', nameEn: 'Technology', questions: [82, 83, 94, 95] },
  networking: { nameHe: 'נטוורקינג', nameEn: 'Networking', questions: [81] },
  balance: { nameHe: 'איזון', nameEn: 'Balance', questions: [70, 71, 88, 89, 90, 91] },
  change: { nameHe: 'שינוי', nameEn: 'Change', questions: [96, 97, 98, 99, 100, 104] }
};

// Reversed questions (8-x) - V9
const REVERSED_QUESTIONS = [4, 8, 14, 22, 25, 27, 34, 37, 39, 41, 45, 48, 54, 57, 60, 89, 90, 93, 98];

function applyReversedLogic(questionNumber, value) {
  if (REVERSED_QUESTIONS.includes(questionNumber)) {
    return 8 - value;
  }
  return value;
}

function calculateDimensionScore(responses, dimensionConfig) {
  const questionNumbers = dimensionConfig.questions;
  const scores = questionNumbers
    .map(q => {
      const rawValue = responses[`q${q}`];
      if (rawValue === undefined || rawValue === null) return null;
      return applyReversedLogic(q, rawValue);
    })
    .filter(val => val !== null);

  if (scores.length === 0) return null;

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // V9 Formula: avg × 14.2857
  const normalizedScore = avg * 14.2857;
  
  return { score: normalizedScore, avg };
}

function calculateAllDimensions(responses) {
  const result = {};
  for (const [key, config] of Object.entries(CORE_DIMENSIONS)) {
    const scoreData = calculateDimensionScore(responses, config);
    if (!scoreData) continue;

    result[key] = {
      nameHe: config.nameHe,
      nameEn: config.nameEn,
      score: scoreData.score
    };
  }
  return result;
}

function selectBoosterTrack(dimensionScores) {
  // Find the lowest dimension for booster recommendation
  const sortedDimensions = Object.entries(dimensionScores)
    .filter(([_, data]) => data && data.score !== undefined)
    .sort((a, b) => a[1].score - b[1].score);
  
  if (sortedDimensions.length === 0) return 'execution';
  
  return sortedDimensions[0][0];
}

function detectGender(personalInfo) {
  // First check if gender is provided in personal_info
  if (personalInfo && personalInfo.gender) {
    if (personalInfo.gender === 'female') return 'female';
    if (personalInfo.gender === 'male') return 'male';
  }
  
  // Fallback to name detection
  const fullName = personalInfo?.full_name || '';
  const maleNames = ['יוסי', 'דוד', 'משה', 'אברהם', 'יצחק', 'יעקב', 'דניאל', 'מיכאל', 'רון', 'עומר', 'תומר', 'נועם', 'איתי', 'אלון', 'גיא'];
  const femaleNames = ['שרה', 'רחל', 'לאה', 'מרים', 'דבורה', 'רות', 'שירה', 'נועה', 'מיכל', 'תמר', 'יעל', 'דנה', 'מאיה', 'עדי', 'רוני', 'אפרת'];
  
  const firstName = fullName.split(' ')[0];
  if (femaleNames.some(name => firstName.includes(name))) return 'female';
  if (maleNames.some(name => firstName.includes(name))) return 'male';
  return 'male';
}

const getMasterPromptV9 = (language, userName, userGender, dimensionScores, selectedTrack, optionalComment) => {
  const scoresText = Object.entries(dimensionScores)
    .map(([key, data]) => `- ${language === 'he' ? data.nameHe : data.nameEn}: ${data.score.toFixed(1)}`)
    .join('\n');
  
  const selectedTrackName = language === 'he' ? CORE_DIMENSIONS[selectedTrack].nameHe : CORE_DIMENSIONS[selectedTrack].nameEn;
  
  // Find top 3 strengths and bottom 2 weaknesses
  const sortedDimensions = Object.entries(dimensionScores)
    .sort((a, b) => b[1].score - a[1].score);
  const topStrengths = sortedDimensions.slice(0, 3).map(([key, data]) => language === 'he' ? data.nameHe : data.nameEn);
  const bottomWeaknesses = sortedDimensions.slice(-2).map(([key, data]) => language === 'he' ? data.nameHe : data.nameEn);
  
  if (language === 'he') {
    const genderSuffix = userGender === 'female' ? 'ה' : '';
    const youAre = userGender === 'female' ? 'את' : 'אתה';
    const youNeed = userGender === 'female' ? 'את צריכה' : 'אתה צריך';
    const blocked = userGender === 'female' ? 'חוסמת' : 'חוסם';
    const youCan = userGender === 'female' ? 'את יכולה' : 'אתה יכול';
    
    return `🎯 SYSTEM PROMPT: V107 MASTER REPORT GENERATOR V9 – FINAL PRODUCTION READY

1. זהות ותפקיד (Identity & Role)
אתה אסטרטג בכיר ומאבחן תעסוקתי במערך V107. תפקידך לקבל קלט (JSON) הכולל נתוני משתמש ו-107 תשובות (סקאלה 1-7) ולהפיק MASTER REPORT ברמת פרימיום.

הנחיות יסוד:
• פתיח שיווקי חובה: "אנו שמחים להציג בפניך את דו"ח V107 האישי שלך, אשר מיועד לסייע לך במינוף יכולותיך המקצועיות ופריצת חסמי ההצלחה האישיים שלך."
• התאמה מגדרית: המשתמש/ת הוא/היא ${userGender === 'female' ? 'נקבה' : 'זכר'}. חובה להתאים את כל הדו"ח למגדר הנכון.
• טון אסטרטגי: סמכותי, אנליטי, חד ו"לעומתי" (מציב מראה).
• מטאפורות חובה: מנוע/שלדה, Engine, הון תפקודי, ROI אישי, צוואר בקבוק.

📊 פרטי המשתמש/ת:
שם: ${userName}
מגדר: ${userGender === 'female' ? 'נקבה' : 'זכר'}
${optionalComment ? `הערה אישית: ${optionalComment}` : ''}

ציוני 11 הממדים (V107-V9):
${scoresText}

🔥 Engine (שלושת החוזקות): ${topStrengths.join(', ')}
⚠️ Paradox (החסמים): ${bottomWeaknesses.join(', ')}
🎯 בוסטר מומלץ: ${selectedTrackName}

---

📄 מבנה הפלט המחייב (5 עמודים - בסגנון אפרת גאוי ויס):

# עמוד 1: תמצית מנהלים (The Wake-up Call)

אנו שמחים להציג בפניך את דו"ח V107 האישי שלך, אשר מיועד לסייע לך במינוף יכולותיך המקצועיות ופריצת חסמי ההצלחה האישיים שלך.

${userName}, ${youAre} לא סתם מנהל/ת עם יכולות ${topStrengths[0]} גבוהות – ${youAre} עוצמה אמיתית.

הניתוח חושף ש-Engine שלך מבוסס על: ${topStrengths.join(', ')}.
אבל הפרדוקס? ${bottomWeaknesses.join(' ו-')} ${blocked} אותך.

**תובנת עומק:**
המהות שלך כמשפיע/ה ב-${topStrengths[0]} היא כלי רב-עוצמה, אך היעדר ${bottomWeaknesses[0]} ברור מכשיל את הצעדים הקריטיים לצמיחה. למעשה, כש${youAre} מרוכז/ת בכישוריך, ${youAre} שוכח/ת שהתמונה הרחבה מחייבת להתייחס להיבטים ה-${bottomWeaknesses[0]} ולגיבוש חזון. החוזקה בדרכי פעולה מהירה יכולה להוליך אותך למסקנות לא מושכלות, המונעות ממך לקחת את הצעד הבא בהצלחה.

**ניתוח ROI:**
הפער בין ${topStrengths[0]} ל-${bottomWeaknesses[0]} עולה לך בהזדמנויות שלא מתממשות, שמזיקים לצמיחה הפוטנציאלית שלך. אם תיישר/י את ה-${bottomWeaknesses[0]} לחזון ברור, תוכל/י להעצים את תוצאות ה-${topStrengths[0]} להצלחה ארוכת טווח.

**סיכום:**
השלב הבא הוא לא בחירה בפעולה על פני פעילות מיידית, אלא בהגדרת חזון ברור ומדויק להפיכת פעולותיך האפקטיביות לנכסים ממשיים. הגיע הזמן לעבור מבעיות ניהוליות ליכולת לבצע עשייה מדויקת.

---

# עמוד 2: הפרדוקס הפנימי של ${userName}

${userName}, השאלון חושף ש-Engine שלך (${topStrengths.join(', ')}) בעצם ${blocked} אותך בגלל היעדר פתרונות ${bottomWeaknesses[0]} ברורים.

**שלוש תובנות מרכזיות:**

• **מלכודת ההצלחה:**
היכן ש${youAre} מצטיין/ת, ${youAre} משקיע/ה אנרגיה רבה, אך מתחיל/ה להתייחס ל-${topStrengths[0]} כאל מובן מאליו. זה מביא אותך לסטגנציה כאשר ${youAre} לא מעודכן/ת בהיבטים ${bottomWeaknesses[0]}, מה שעלול להוביל להשקעות חסרות תועלת או לכשלים אסטרטגיים.

• **דפוס ההתקדמות:**
ככל ה-${topStrengths[0]} מתמתח לקדמת הבמה, ${youAre} מפסיק/ה לקחת בחשבון את הפן ה-${bottomWeaknesses[0]}. משך הזמן ש${youAre} עובר/ת על צרכים פוטנציאליים ולא עונה עליהם מדגיש פערי השקעה משמעותיים.

• **הפרדוקס המקצועי:**
החוזקה הגדולה שלך ב-${topStrengths[0]} מספקת תחושת נאמנות לקהל הלקוחות שלך, אך היא גם מחסירה ממך את הצורך בבניית מערכת ${bottomWeaknesses[0]} אחראית, מה שמוביל לקשיים בהשגת יעדים רחבים בעוד גישה פרואקטיבית נדרשת לחזון.

---

# עמוד 3: השפעה אסטרטגית (The Mirror)

**ניתוח ROI אישי:**
הפער בין ${topStrengths[0]} (גבוה) ל-${bottomWeaknesses[0]} (נמוך) עולה לך בכספים שהם חסרים, הזדמנויות עסקיות שלא ממושות ועיכובים בהתרחבות.

**ציוני הליבה (11 ממדים, ממוינים גבוה-נמוך):**

${Object.entries(dimensionScores)
  .sort((a, b) => b[1].score - a[1].score)
  .map(([key, data]) => {
    const barLength = Math.round(data.score / 10);
    const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
    return `${data.nameHe}: ${data.score.toFixed(0)} ${bar}`;
  })
  .join('\n')}

---

# עמוד 4: ניווט קריירה והמלצות

${userName}, ${youNeed} לא "לשפר את ה-${topStrengths[0]}" – ${youNeed} לחזק את התחום ה-${bottomWeaknesses[0]} והחזון.

**ארבעה נתיבי מימוש בעבורך:**

1. **[תפקיד מותאם 1 - התאם לפי ממדים גבוהים]**
   למה זה מתאים: [הסבר מבוסס על חוזקות]
   מה צריך לשנות: [הסבר מבוסס על חולשות]

2. **[תפקיד מותאם 2]**
   [2-3 משפטים]

3. **[תפקיד מותאם 3]**
   [2-3 משפטים]

4. **[תפקיד מותאם 4]**
   [2-3 משפטים]

**ארגז כלים:**

• **ספר מומלץ**: [בחר מתוך: "Good to Great" (Jim Collins), "7 Habits" (Covey), "Getting Things Done" (Allen), "Influence" (Cialdini), "Profit First" (Michalowicz), "The Lean Startup" (Ries)]
  למה זה רלוונטי: [התאם לחסם המרכזי]

• **כלי עבודה**: [בחר מתוך: Miro, Monday.com, Trello, HubSpot]
  איך להשתמש: [הנחיה ספציפית]

• **פרוטוקול 24 שעות:**
  ${userName}, תעש${genderSuffix} [משימה קונקרטית אחת להתמודדות עם ${bottomWeaknesses[0]}] עד [מועד מחר]. [הנחיה ספציפית וניתנת לביצוע].

---

# עמוד 5: V107-BOOSTER

ניסיוננו מראה: רבים מסתפקים בקריאת הדוח (ידיעה), אך מי שעבר ליישום (פעולה) השיג יעדים טובים יותר.

**מהו V107-BOOSTER?**
כלי עבודה יומי: 30 יום, משימות 10-15 דקות, ממוקד ב-${selectedTrackName} - הממד הנמוך ביותר בדוח שלך.

**המטרה:**
להפוך מסקנות לדרך חיים ניהולית ותוצאות מוחשיות.

**המודל:**
- חינם לחלוטין ל-7 הימים הראשונים
- 30 ימים ליווי יומי מלא
- ביום 7: משוב ובדיקת שיפור
- הפקת${genderSuffix} ערך? → תוכנית שנתית בתשלום
- לא? → אין חיוב

**קריאה:**
📌 ${userName}, התחל${genderSuffix} V107-BOOSTER עכשיו (ללא עלות)

אל תסתפק${genderSuffix} בידיעה של מי ש${youAre} – גלה${genderSuffix} מה ${youCan} להיות באמת.

---

**הבהרה משפטית:**
"דו"ח V107 הופק באמצעות אלגוריתם בינה מלאכותית ייחודי שפותח על ידי צוות מומחי V107, זאת בהסתמך על ניתוח אלפי שאלונים ומחקר אנושי מעמיק. הדו"ח מהווה כלי אבחון אסטרטגי בלבד ואינו תחליף לייעוץ מקצועי מוסמך. כל שימוש בתובנותיו – על אחריות המשתמש."

---

החזר JSON בפורמט הבא בלבד:
{
  "report_markdown": "הדוח המלא (5 עמודים)",
  "selected_booster_track": "${selectedTrack}",
  "archetype": "כותרת מקצועית קצרה (2-4 מילים המתארות את המשתמש/ת)"
}`;
  } else {
    // English version placeholder - can be expanded similarly
    return `V107 REPORT GENERATOR V9 - ENGLISH

User: ${userName}
Gender: ${userGender}
${optionalComment ? `Note: ${optionalComment}` : ''}

Dimensions:
${scoresText}

Top Strengths: ${topStrengths.join(', ')}
Weaknesses: ${bottomWeaknesses.join(', ')}
Recommended Track: ${selectedTrackName}

Generate a professional 5-page report following the V9 structure.

Return JSON:
{
  "report_markdown": "Full report",
  "selected_booster_track": "${selectedTrack}",
  "archetype": "Short professional headline"
}`;
  }
};

const generateReportId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `V107-HE-${randomNum}`;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { responseId } = await req.json();

    if (!responseId) {
      return Response.json({ error: 'Missing responseId' }, { status: 400 });
    }

    // Fetch the questionnaire response
    const responses = await base44.asServiceRole.entities.QuestionnaireResponse.filter({ id: responseId });
    if (!responses || responses.length === 0) {
      return Response.json({ error: 'Response not found' }, { status: 404 });
    }

    const response = responses[0];
    const reportLanguage = response.language || 'he';

    if (!response.responses || Object.keys(response.responses).length === 0) {
      return Response.json({ 
        error: reportLanguage === 'en' ? "The questionnaire does not contain answers." : "השאלון לא מכיל תשובות." 
      }, { status: 400 });
    }

    // Check if report already exists
    const existingReports = await base44.asServiceRole.entities.GeneratedReport.filter({ 
      questionnaire_response_id: responseId 
    });
    
    if (existingReports && existingReports.length > 0) {
      return Response.json({ 
        message: 'Report already exists',
        reportId: existingReports[0].id 
      });
    }

    // Calculate all 11 dimensions (V9)
    const dimensionScores = calculateAllDimensions(response.responses);
    const selectedTrack = selectBoosterTrack(dimensionScores);

    const userName = response.personal_info?.full_name || (reportLanguage === 'en' ? 'User' : 'משתמש');
    const userGender = detectGender(response.personal_info);
    const optionalComment = response.optional_comment || '';

    const masterPrompt = getMasterPromptV9(
      reportLanguage,
      userName,
      userGender,
      dimensionScores,
      selectedTrack,
      optionalComment
    );

    // Generate report with LLM
    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: masterPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          report_markdown: { type: "string" },
          selected_booster_track: { type: "string" },
          archetype: { type: "string" }
        },
        required: ["report_markdown", "selected_booster_track", "archetype"]
      }
    });

    // Create the report
    const newReport = await base44.asServiceRole.entities.GeneratedReport.create({
      questionnaire_response_id: responseId,
      user_name: userName,
      user_email: response.personal_info?.email || (reportLanguage === 'en' ? 'Not specified' : 'לא צוין'),
      report_id: generateReportId(),
      report_markdown: llmResponse.report_markdown,
      archetype: llmResponse.archetype,
      recommended_booster_track: llmResponse.selected_booster_track,
      domain_scores: dimensionScores,
      language: reportLanguage,
      status: 'completed'
    });

    return Response.json({ 
      success: true,
      reportId: newReport.id 
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ 
      error: error.message || 'Unknown error' 
    }, { status: 500 });
  }
});