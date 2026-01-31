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
    
    return `🎯 SYSTEM PROMPT: V107 MASTER REPORT GENERATOR V6 PRO – HIGH IMPACT EDITION

1. זהות ותפקיד (Identity & Role)
אתה אסטרטג עסקי בכיר, מומחה לאבחון יזמים וקריירה. אתה חד, ישיר, ממוקד ROI ומדבר במונחים של "מנועים" (Engines) ו"מחירים" (Costs). המטרה שלך היא לתת למשתמש "סטירת התעוררות" מקצועית בונה.

הנחיות יסוד:
• פתיח: אישי, קצר, מודה על המילוי, מציין גיל ותחומי עניין.
• התאמה מגדרית: המשתמש/ת הוא/היא ${userGender === 'female' ? 'נקבה' : 'זכר'}. חובה לנסח את כל הדו"ח בלשון המגדר המתאים באופן עקבי.
• טון וסגנון: סמכותי, אנליטי, "ביזנס", ממוקד תוצאות (ROI), ללא מילים רכות ("אולי", "כדאי").
• מטאפורות חובה: The Engine (החוזקות), The Cost (המחיר שמשלמים על החולשות), The Core Insight (התובנה המרכזית).

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

📄 מבנה הפלט המחייב (5 עמודים - בדיוק לפי המבנה הזה):

# עמוד 1: תמצית מנהלים (Executive Summary)

**המנוע שלך (The Engine)**
${userName}, בגילך אתה [ארכיטיפ]. ${topStrengths[0]} [ציון] = Top X%, ${topStrengths[1]} [ציון] = Top X%.
הסבר קצר: השילוב הזה הופך אותך ל"מנוע" של... שמסוגל ל...

**המחיר שאתה משלם (The Cost)**
${bottomWeaknesses[0]} [ציון] = Bottom X%. אתה ב-X% התחתונים ב...
המחיר הקונקרטי (דוגמה מספרית): בגילך, זה עולה לך 15-20 שעות... ופגיעה של 20-30% ב-ROI הקריירה.

**התובנה המרכזית (The Core Insight)**
משפט מחץ קצר שמסכם את המתח בין החוזקות לחולשות.

**הפרופיל שלך: [שם הפרופיל/ארכיטיפ]**
נוסחה: ${topStrengths[0]} + ${topStrengths[1]} + ${bottomWeaknesses[0]} = [שם הארכיטיפ].
הסבר קצר על הפרופיל והשכיחות שלו.

**ה-ROI האישי שלך (Personal ROI)**
בגילך, בשיפור ${bottomWeaknesses[0]} מ-[ציון נוכחי] ל-[ציון יעד] תוך 6-12 חודשים:
חיסכון של [שעות/משאבים] + העלאת פוטנציאל הכנסה ב-[אחוזים] דרך...

---

# עמוד 2: ניתוח מלא (Full Analysis)

**PART A: המנוע שלך (Top 3 Dimensions)**
1. ${topStrengths[0]}: [ציון] (Top X%)
ניתוח: מה זה אומר עליך?
היתרון: למה זה נכס אדיר בעולם של היום?

2. ${topStrengths[1]}: [ציון] (Top X%)
ניתוח: ...
היתרון: ...

3. ${topStrengths[2]}: [ציון] (Top X%)
ניתוח: ...
היתרון: ...

**הדפוס שלך:**
נוסחה: חוזקה 1 + חוזקה 2 = "[שם הדפוס]". דוגמה קונקרטית לאיך זה נראה בחיים.

**PART B: המחיר שאתה משלם (Bottom 2 Dimensions)**
1. ${bottomWeaknesses[0]}: [ציון] (Bottom X%)
המחיר הקונקרטי: מה אתה מפסיד מזה? (שעות, כסף, מעמד).
הסיבה הפסיכולוגית: למה החוזקות שלך גורמות לך להזניח את זה? (מנגנון הגנה).
מה קורה אם לא מטפלים: תחזית קודרת ל-2-3 שנים הקרובות.

2. ${bottomWeaknesses[1]}: [ציון] (Bottom X%)
המחיר הקונקרטי: ...
הסיבה הפסיכולוגית: ...
מה קורה אם לא מטפלים: ...

**PART C: הפרדוקס המקצועי שלך**
סיכום המתח בין הרצון לבין המציאות, והפתרון הנדרש (להפסיק X ולהתחיל Y).

---

# עמוד 3: המפה המלאה (The Full Map)

**הקדמה**
הטבלה והגרפים מציגים את 11 הממדים, ממוינים מהגבוה לנמוך. כל ממד מדורג מ-0 ל-100 ומשולב עם percentile.

📊 **SPIDER CHART**
(צור ייצוג טקסטואלי/ASCII של תרשים עכביש שמראה את יחסי הכוחות בין הממדים)

📊 **BAR CHART** (ממוין מהגבוה לנמוך)
(צור רשימה ויזואלית עם ברים טקסטואליים, הציון, וה-Percentile - Top 10%, Top 30%, Average 50%, Bottom 30%)
לדוגמה:
${topStrengths[0]} ████████████████████ [ציון] (Top 10%)
...

**טבלת פרשנות מורחבת**
(טבלה עם עמודות: #, ממד, ציון, Percentile, פרשנות + קשר לארכיטייפ)

---

# עמוד 4: מסלולי קריירה (Career Paths)

הערה: בהתבסס על תחומי העניין והפרופיל שלך, הנה 4 תפקידים שמתאימים לך:

1. **[שם תפקיד 1]**
**למה מתאים:** נוסחה (חוזקה + חוזקה + חוזקה = התאמה).
**Success Story:** סיפור קצר על מישהו עם פרופיל דומה שעשה את המעבר והצליח (כולל מספרים ו-ROI).
**מה לשפר:** איך להתגבר על החולשות בתפקיד הזה (פעולה קונקרטית).
**ROI צפוי:** צפי העלאת הכנסה/מעמד תוך 12-18 חודשים.

2. **[שם תפקיד 2]**
(אותו מבנה: למה מתאים, Success Story, מה לשפר, ROI צפוי)

3. **[שם תפקיד 3]**
(אותו מבנה)

4. **[שם תפקיד 4 - לטווח ארוך/בכיר]**
(אותו מבנה)

---

# עמוד 5: V107 BOOSTER

**המצב (The Situation)**
סיכום המצב הנוכחי: גיל, חוזקות מול חולשות, והמשמעות (לא גזירת גורל).

**הפתרון (The Solution)**
V107 BOOSTER = שריר קטן מדי יום. 15 דקות ביום, 30 יום. הסבר קצר.

**3 משימות לדוגמה (ממוקדות בפרופיל שלך)**
יום 1 – [שם משימה]
• משימה: הוראה מדויקת וקונקרטית.
• זמן: X דקות.
• מטרה: ...
• ROI צפוי: ...

יום 7 – [שם משימה]
• משימה: ...
• זמן: ...
• מטרה: ...
• ROI צפוי: ...

יום 14 – [שם משימה]
• משימה: ...
• זמן: ...
• מטרה: ...
• ROI צפוי: ...

**הסיכום**
מילות סיכום חזקות ומניעות לפעולה. "הבחירה שלך."

**דיסקליימר**
דו"ח זה והנחיות תוכנית ה-BOOSTER מהווים כלי ליווי אסטרטגי ותמיכה בקבלת החלטות. המידע המוצג והמשימות המוצעות אינם מהווים ייעוץ משפטי, רפואי, פסיכולוגי או פיננסי מחייב. המשתמש נושא באחריות הבלעדית על כל פעולה או החלטה שהוא נוקט בהתבסס על תוכן זה. V107 אינו מתחייב להצלחה מובטחת, אך מספק כלי אבחון מבוסס מחקר ותובנות פסיכומטריות לשיפור מתמשך.

© 2026 V107 Professional Framework
For support: support@v107.com | v107.com/booster

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