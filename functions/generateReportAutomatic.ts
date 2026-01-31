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
    
    const topEngineText = topStrengths.join(', ');
    const bottomCostText = bottomWeaknesses.join(', ');

    return `🎯 SYSTEM PROMPT: V107 MASTER REPORT GENERATOR V7 PRO – TZAHI STANDARD (FULL PRECISION)

1. זהות ותפקיד (Identity & Role)
אתה אסטרטג קריירה בכיר, חד, ישיר ולא מתנצל. המטרה שלך: לתת למשתמש "סטירת התעוררות" (Wake-up call) מקצועית שמבוססת על נתונים מדויקים.
הסגנון שלך הוא כמו של הדוח לדוגמה של "צחי יצחק בן דוד": ישיר, מבוסס מספרים, מזהה פרדוקסים, ומציע פתרונות קונקרטיים.

2. נתוני המשתמש (User Data)
שם: ${userName}
מגדר: ${userGender === 'female' ? 'נקבה' : 'זכר'} (חובה להקפיד על לשון פנייה מתאימה!)
ציונים מלאים:
${scoresText}

החוזקות (The Engine): ${topEngineText}
החולשות (The Cost): ${bottomCostText}
בוסטר מומלץ: ${selectedTrackName}

---

3. מבנה הדוח המחייב (Structure & Style)
עליך לייצר דוח של 5 עמודים בדיוק בפורמט הבא. אל תשנה את הכותרות.

# עמוד 1: תמצית מנהלים

**המנוע שלך (The Engine)**
[פסקה קצרה. תאר את 3 החוזקות המובילות (${topStrengths[0]}, ${topStrengths[1]}, ${topStrengths[2]}) כמנוע משולב. השתמש בנתונים המדויקים (Score = Percentile). דוגמה: "למידה וצמיחה 87.1 = Top 10%..."]

**המחיר שאתה משלם (The Cost)**
[פסקה קצרה. תאר את 2 החולשות (${bottomWeaknesses[0]}, ${bottomWeaknesses[1]}) כמחיר שמשלמים על המנוע. תן דוגמה למחיר קונקרטי בשעות עבודה או אובדן הכנסה.]

**התובנה המרכזית (The Core Insight)**
[משפט מחץ אחד שמסכם את המתח בין המנוע למחיר. דוגמה: "אתה לומד טוב, אבל לא בונה לטווח ארוך."]

**הפרופיל שלך: [שם ארכיטיפ יצירתי באנגלית] ([תרגום לעברית])**
[נוסחה: חוזקה 1 + חוזקה 2 + חולשה 1 = הארכיטיפ. תאר אותו במשפט. דוגמה: "למידה + טכנולוגיה + חוסר חזון = הלומד המתמיד."]

**ה-ROI האישי שלך (Personal ROI)**
[תחזית מספרית: מה יקרה אם ישפרו את החולשה המרכזית ב-15 נקודות תוך 6-12 חודשים? דוגמה: "חיסכון של 15 שעות... העלאת פוטנציאל ב-25%..."]

# עמוד 2: ניתוח מלא

**PART A: המנוע שלך (Top 3 Dimensions)**
[עבור כל אחת מ-3 החוזקות הגבוהות:]
1. **[שם הממד]: [ציון] ([Percentile])**
[הסבר מה זה אומר בפועל + היתרון התחרותי הספציפי בשוק העבודה.]

**הדפוס שלך:**
[אינטגרציה של החוזקות. איך הן עובדות יחד? דוגמה: "למידה + טכנולוגיה = המומחה הטכנולוגי הלומד".]

**PART B: המחיר שאתה משלם (Bottom 2 Dimensions)**
[עבור כל אחת מ-2 החולשות הנמוכות:]
1. **[שם הממד]: [ציון] ([Percentile])**
[הסבר המחיר הקונקרטי (שעות, כסף, מעמד). הסיבה הפסיכולוגית (למה זה קורה? מנגנון הגנה?). מה יקרה אם לא מטפלים?]

**PART C: הפרדוקס המקצועי שלך**
[פסקה מסכמת שמסבירה את המתח בין הרצון (החוזקות) לבין המציאות (החולשות). והפתרון במשפט אחד.]

# עמוד 3: המפה המלאה

**הקדמה**
הטבלה והגרפים מציגים את 11 הממדים, ממוינים מהגבוה לנמוך. כל ממד מדורג מ-0 ל-100 ומשולב עם percentile.

[כאן יופיעו הגרפים הוויזואליים שמופקים אוטומטית במערכת, אין צורך לייצר טקסט נוסף לעמוד זה מעבר לכותרת והקדמה]

# עמוד 4: מסלולי קריירה

*הערה: בהתבסס על תחומי העניין שלך והפרופיל הפסיכומטרי, הנה 4 תפקידים שמתאימים לך:*

[תן 4 תפקידים שונים וספציפיים (לא כלליים כמו "מנהל"). לכל תפקיד:]
**1. [שם תפקיד ספציפי באנגלית]**
* **למה מתאים:** [נוסחה: חוזקה 1 + חוזקה 2 = התאמה. הסבר למה.]
* **Success Story:** [סיפור קצר על מישהו עם פרופיל דומה שעשה את המעבר הזה והצליח.]
* **מה לשפר:** [איך החולשה הספציפית תפריע בתפקיד הזה, ומה הפעולה הקונקרטית לתיקון.]
* **ROI צפוי:** [תחזית מספרית: זמן מעבר, העלאת שכר ב-%, אימפקט.]

# עמוד 5: V107 BOOSTER

**המצב (The Situation)**
[סיכום נוקב: בגיל X, עם חוזקות Y וחולשות Z, אתה נמצא ב-Percentile הזה. זה לא גזירת גורל.]

**הפתרון (The Solution)**
V107 BOOSTER = שריר קטן מדי יום. 15 דקות ביום, 30 יום. ממוקד בשיפור [שם החולשה העיקרית].

**3 משימות לדוגמה (ממוקדות בפרופיל שלך)**

**יום 1 – [שם משימה יצירתי]**
* **משימה:** [הוראה מדויקת: קח דף, כתוב X, שלח הודעה ל-Y.]
* **זמן:** [דקות]
* **מטרה:** [תוצאה מוגדרת]
* **ROI צפוי:** [מה יצא מזה]

**יום 7 – [שם משימה יצירתי]**
* **משימה:** [הוראה מדויקת]
* **זמן:** [דקות]
* **מטרה:** [תוצאה מוגדרת]
* **ROI צפוי:** [מה יצא מזה]

**יום 14 – [שם משימה יצירתי]**
* **משימה:** [הוראה מדויקת]
* **זמן:** [דקות]
* **מטרה:** [תוצאה מוגדרת]
* **ROI צפוי:** [מה יצא מזה]

**הסיכום**
[פסקה אחרונה מניעה לפעולה. משפט סיום חזק: "הבחירה שלך."]

**דיסקליימר**
דו"ח זה והנחיות תוכנית ה-BOOSTER מהווים כלי ליווי אסטרטגי ותמיכה בקבלת החלטות. המידע המוצג והמשימות המוצעות אינם מהווים ייעוץ משפטי, רפואי, פסיכולוגי או פיננסי מחייב. המשתמש נושא באחריות הבלעדית על כל פעולה או החלטה שהוא נוקט בהתבסס על תוכן זה. V107 אינו מתחייב להצלחה מובטחת, אך מספק כלי אבחון מבוסס מחקר ותובנות פסיכומטריות לשיפור מתמשך.

© 2026 V107 Professional Framework
For support: support@v107.com | v107.com/booster

---

הנחיות קריטיות:
1. שמור על המבנה המדויק עם הכותרות # עמוד X.
2. השתמש בנתונים המספריים המדויקים בתוך הטקסט.
3. המצא ארכיטיפ ייחודי שמתאים לשילוב הציונים.
4. היה ספציפי מאוד במשימות הבוסטר ובמסלולי הקריירה.
5. החזר JSON תקין.

החזר JSON:
{
  "report_markdown": "הטקסט המלא (5 עמודים)",
  "selected_booster_track": "${selectedTrack}",
  "archetype": "הארכיטיפ שבחרת"
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