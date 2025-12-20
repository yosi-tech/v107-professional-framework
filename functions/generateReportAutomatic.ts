import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// 6 Booster Track Domains
const BOOSTER_DOMAINS = {
  vision: { nameHe: 'חזון', nameEn: 'Vision', questions: [98, 99, 100, 101, 48, 49, 52, 53, 81, 82, 83, 84], criticalQuestions: [98, 52, 53], priority: 6 },
  finance: { nameHe: 'פיננסים', nameEn: 'Finance', questions: [7, 38, 39, 44, 50, 68, 69, 70], criticalQuestions: [7, 50], priority: 3 },
  management: { nameHe: 'ניהול', nameEn: 'Management', questions: [25, 73, 74, 75, 76, 77, 85, 86, 87], criticalQuestions: [74, 85], priority: 5 },
  marketing: { nameHe: 'שיווק', nameEn: 'Marketing', questions: [18, 67, 80, 81, 90, 95], criticalQuestions: [18, 90], priority: 4 },
  digital: { nameHe: 'דיגיטל', nameEn: 'Digital', questions: [13, 47, 68, 69, 70, 71], criticalQuestions: [68, 70], priority: 2 },
  execution: { nameHe: 'ביצוע', nameEn: 'Execution', questions: [61, 62, 63, 65, 88, 89, 105, 106], criticalQuestions: [88, 105, 106], priority: 1 }
};

function selectBoosterTrack(boosterScores) {
  const sortedDomains = Object.entries(boosterScores)
    .filter(([_, data]) => data && data.score !== undefined)
    .sort((a, b) => {
      if (a[1].score !== b[1].score) {
        return a[1].score - b[1].score;
      }
      return BOOSTER_DOMAINS[a[0]].priority - BOOSTER_DOMAINS[b[0]].priority;
    });
  
  if (sortedDomains.length === 0) return 'execution';
  
  const lowestScore = sortedDomains[0][1].score;
  if (lowestScore > 75) {
    return sortedDomains[0][0];
  }
  
  return sortedDomains[0][0];
}

const BAND_DESCRIPTIONS_MAP = {
  'he': {
    'high': 'גבוה - חזק מאוד',
    'mid': 'בינוני - יש מקום משמעותי לשיפור',
    'low': 'נמוך - דורש תשומת לב ופעולה מיידית'
  },
  'en': {
    'high': 'High - Very Strong',
    'mid': 'Mid - Significant Room for Improvement',
    'low': 'Low - Requires Immediate Attention and Action'
  }
};

function calculateDomainScore(responses, domainConfig) {
  const questionNumbers = domainConfig.questions;
  const scores = questionNumbers
    .map(q => responses[`q${q}`])
    .filter(val => val !== undefined && val !== null);

  if (scores.length === 0) return null;

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  const normalizedScore = ((avg - 1) / 6) * 100;
  return { score: normalizedScore, stdDev };
}

function checkFlags(responses, domainConfig, domainScore) {
  const criticalQuestions = domainConfig.criticalQuestions || [];
  const criticalScores = criticalQuestions.map(q => responses[`q${q}`]).filter(val => val !== undefined && val !== null);

  let redFlag = false;
  let yellowFlag = false;

  if (criticalScores.some(score => score <= 3)) {
    redFlag = true;
  } else if (domainScore.score < 50 || domainScore.stdDev > 1.8) {
    yellowFlag = true;
  }

  return { red_flag: redFlag, yellow_flag: yellowFlag };
}

function determineBand(domainScore, redFlag) {
  if (redFlag) return 'low';
  if (domainScore.score >= 70) return 'high';
  if (domainScore.score >= 50) return 'mid';
  return 'low';
}

function calculateBoosterDomains(responses) {
  const result = {};
  for (const [key, config] of Object.entries(BOOSTER_DOMAINS)) {
    const scoreData = calculateDomainScore(responses, config);
    if (!scoreData) continue;

    const flags = checkFlags(responses, config, scoreData);
    const band = determineBand(scoreData, flags.red_flag);

    result[key] = {
      nameHe: config.nameHe,
      nameEn: config.nameEn,
      score: scoreData.score,
      stdDev: scoreData.stdDev,
      band,
      ...flags
    };
  }
  return result;
}

function identifyStrengthsAndWeaknesses(domainScores) {
  const sortedByScore = Object.entries(domainScores)
    .filter(([_, data]) => data && data.score !== undefined)
    .sort((a, b) => b[1].score - a[1].score);

  const strengths = sortedByScore.slice(0, 3).map(([_, data]) => data.name);
  const weaknesses = sortedByScore.slice(-3).reverse().map(([_, data]) => data.name);

  return { strengths, weaknesses };
}

const getLocalizedDomainName = (hebrewName, language) => {
  if (language === 'en') {
    return HEBREW_TO_ENGLISH_DOMAIN_NAMES[hebrewName] || hebrewName;
  }
  return hebrewName;
};

const getLocalizedBandDescription = (band, language) => {
  const map = BAND_DESCRIPTIONS_MAP[language] || BAND_DESCRIPTIONS_MAP['he'];
  return map[band] || band;
};

function detectGender(fullName) {
  const maleNames = ['יוסי', 'דוד', 'משה', 'אברהם', 'יצחק', 'יעקב', 'דניאל', 'מיכאל', 'רון', 'עומר', 'תומר', 'נועם', 'איתי', 'אלון', 'גיא'];
  const femaleNames = ['שרה', 'רחל', 'לאה', 'מרים', 'דבורה', 'רות', 'שירה', 'נועה', 'מיכל', 'תמר', 'יעל', 'דנה', 'מאיה', 'עדי', 'רוני'];
  
  const firstName = fullName.split(' ')[0];
  if (femaleNames.some(name => firstName.includes(name))) return 'female';
  if (maleNames.some(name => firstName.includes(name))) return 'male';
  return 'male';
}

const getMasterPrompt = (language, userName, userGender, boosterScores, selectedTrack, optionalComment) => {
  const scoresText = Object.entries(boosterScores)
    .map(([key, data]) => `- ${language === 'he' ? data.nameHe : data.nameEn}: ${data.score.toFixed(1)}`)
    .join('\n');
  
  const selectedTrackName = language === 'he' ? BOOSTER_DOMAINS[selectedTrack].nameHe : BOOSTER_DOMAINS[selectedTrack].nameEn;
  
  if (language === 'he') {
    const genderSuffix = userGender === 'female' ? 'ה' : '';
    return `🎯 תפקיד ומטרה
אתה יועץ אסטרטגי בכיר ומאמן למנהיגות עסקית (Executive Coach) של V107 Professional Framework™.
משימתך: ניתוח אסטרטגי והפקת דוח פרימיום מקצועי ללקוח.

⚠️ הנחיות קריטיות
- שפה: עברית בלבד (למעט ה-JSON) - מקצועית, סמכותית, מעודדת וישירה. ללא סלנג לחלוטין
- מגדר: ${userGender === 'female' ? 'נקבה' : 'זכר'} - חובה להתאים את כל הפניות, פעלים ותארים למגדר ב-100% דיוק
- פנייה: תמיד בגוף שני (עליך, שלך) ובשם הפרטי ${userName}
- טרמינולוגיה אסורה: אסור מוחלט להשתמש במילים "יזם", "יזמות", "DNA יזמי", "כישלון", "גרוע"
- טרמינולוגיה מומלצת: השתמש במונחים "פרופיל מקצועי", "יכולות ביצוע", "מנהיגות ניהולית", "תפיסה אסטרטגית"
- צבעים: השתמש בלוח צבעי פסטל רגועים בלבד: ירוק מרווה (#B2AC88), צהוב בהיר (#FDFD96), ורוד רך (#FFD1DC)

📊 נתוני הלקוח
שם: ${userName}
מגדר: ${userGender === 'female' ? 'נקבה' : 'זכר'}
${optionalComment ? `הערה אישית: ${optionalComment}` : ''}

ציוני 6 התחומים (0-100):
${scoresText}

🎯 מסלול הבוסטר שנבחר: ${selectedTrackName}

📝 מבנה הפלט (4 עמודים)

**עמוד 1: תמונת על**
- דיסקליימר: "הבהרה משפטית: מסמך זה הינו כלי אבחון וייעוץ אסטרטגי המבוסס על תשובות שמילא${genderSuffix} המשתמש/ת בשאלון V107. הדוח נוצר באמצעות בינה מלאכותית בשילוב פיקוח מומחים. השימוש במידע באחריות המשתמש/ת בלבד. אין בדוח זה תחליף לייעוץ מקצועי אישי."
- פתיח: שם הלקוח + ארכיטיפ יזמי (כותרת מקצועית) + תקציר מנהלים (3-4 שורות)

**עמוד 2: ה-DNA היזמי**
- Excellence Zone: 3 חוזקות בולטות (פסקה לכל אחת)
- Growth Zone: 3 אתגרים מרכזיים (פסקה לכל אחד)

**עמוד 3: טבלת מוכנות**
רשימה של 6 התחומים עם דירוג מילולי:
- Vision: [מעולה/ממוצע/טעון שיפור]
- Finance: [מעולה/ממוצע/טעון שיפור]
- Management: [מעולה/ממוצע/טעון שיפור]
- Marketing: [מעולה/ממוצע/טעון שיפור]
- Digital: [מעולה/ממוצע/טעון שיפור]
- Execution: [מעולה/ממוצע/טעון שיפור]

**עמוד 4: תוכנית פעולה + הצעת V107 BOOSTER**

A. 3 המלצות אסטרטגיות (צעדים ליישום מיידי)

B. הצעת הבוסטר (חובה לכתוב טקסט מכירה מותאם):
   
   "💡 **הצעד הבא שלך: מסלול הבוסטר ב-${selectedTrackName}**
   
   מהניתוח עולה כי ${selectedTrackName} הוא התחום שדורש תשומת לב מיוחדת כרגע.
   
   כדי לפרוץ את החסם הזה, פתחנו עבורך את **מסלול הבוסטר ב-${selectedTrackName}**:
   
   📧 7 מיילים יומיים עם משימות ממוקדות
   🎯 תוכנית פעולה צעד-אחר-צעד
   🎁 בונוס למסיימים: ערכת ההטמעה המקצועית
   
   ⭐ **המודל שלנו: לא שיפרת – לא שילמת**
   - הגישה לבוסטר: חינם לחלוטין
   - ביום ה-7 נבדוק שיפור
   - רק אם תצהיר${genderSuffix} שהפקת${genderSuffix} ערך → חיוב של 199 ₪ + קבלת ערכת ההטמעה
   - אם לא → אין חיוב, אבל הגישה לערכה נשארת נעולה
   
   📌 התחל${genderSuffix} את המסלול מהאזור האישי שלך."

החזר JSON בלבד עם המבנה הבא:
{
  "report_markdown": "הדוח המלא בפורמט Markdown (4 עמודים)",
  "selected_booster_track": "${selectedTrack}",
  "archetype": "כותרת מקצועית קצרה שמתארת את הלקוח"
}`;
  } else {
    return `🎯 Role & Objective
You are a Senior Strategic Consultant and Executive Leadership Coach for V107 Professional Framework™.
Your task: Strategic analysis and premium professional report generation.

⚠️ Critical Guidelines
- Language: English only (except JSON) - Professional, authoritative, encouraging, direct. Absolutely no slang
- Gender: ${userGender} - Must adapt ALL verbs, adjectives, and references to gender with 100% accuracy
- Address: Always second person (you, your) and use first name ${userName}
- Forbidden terminology: Absolutely forbidden to use "entrepreneur", "entrepreneurship", "entrepreneurial DNA", "failure", "bad"
- Recommended terminology: Use "professional profile", "execution capabilities", "managerial leadership", "strategic mindset"
- Colors: Use only calm pastel color palette: Sage Green (#B2AC88), Light Yellow (#FDFD96), Soft Pink (#FFD1DC)

📊 Client Data
Name: ${userName}
Gender: ${userGender}
${optionalComment ? `Personal Note: ${optionalComment}` : ''}

6 Domain Scores (0-100):
${scoresText}

🎯 Selected Booster Track: ${selectedTrackName}

📝 Output Structure (4 Pages)

**Page 1: Overview**
- Disclaimer: "Legal Notice: This document is a diagnostic and strategic consulting tool based on answers provided by the user in the V107 questionnaire. The report is generated using artificial intelligence combined with expert oversight. Use of the information is at the user's sole responsibility. This report is not a substitute for personal professional advice."
- Opening: Client name + entrepreneurial archetype (professional headline) + executive summary (3-4 lines)

**Page 2: Entrepreneurial DNA**
- Excellence Zone: 3 prominent strengths (paragraph for each)
- Growth Zone: 3 main challenges (paragraph for each)

**Page 3: Readiness Table**
List of 6 domains with verbal rating:
- Vision: [Excellent/Average/Needs Improvement]
- Finance: [Excellent/Average/Needs Improvement]
- Management: [Excellent/Average/Needs Improvement]
- Marketing: [Excellent/Average/Needs Improvement]
- Digital: [Excellent/Average/Needs Improvement]
- Execution: [Excellent/Average/Needs Improvement]

**Page 4: Action Plan + V107 BOOSTER Offer**

A. 3 Strategic Recommendations (immediate implementation steps)

B. Booster Offer (must write tailored sales text):
   
   "💡 **Your Next Step: ${selectedTrackName} Booster Track**
   
   The analysis shows that ${selectedTrackName} is the domain requiring special attention right now.
   
   To break through this barrier, we've opened the **${selectedTrackName} Booster Track** for you:
   
   📧 7 daily emails with focused tasks
   🎯 Step-by-step action plan
   🎁 Bonus for completers: Professional Implementation Kit
   
   ⭐ **Our Model: No Improvement – No Payment**
   - Booster access: Completely free
   - On day 7 we'll check improvement
   - Only if you declare you gained value → charge of 199 NIS + receive Implementation Kit
   - If not → no charge, but access to kit remains locked
   
   📌 Start the track from your personal area."

Return JSON only with this structure:
{
  "report_markdown": "Full report in Markdown format (4 pages)",
  "selected_booster_track": "${selectedTrack}",
  "archetype": "Short professional headline describing the client"
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

    // Calculate Booster domain scores
    const boosterScores = calculateBoosterDomains(response.responses);
    const selectedTrack = selectBoosterTrack(boosterScores);

    const userName = response.personal_info?.full_name || (reportLanguage === 'en' ? 'User' : 'משתמש');
    const userGender = detectGender(userName);
    const optionalComment = response.optional_comment || '';

    const masterPrompt = getMasterPrompt(
      reportLanguage,
      userName,
      userGender,
      boosterScores,
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
      domain_scores: boosterScores,
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