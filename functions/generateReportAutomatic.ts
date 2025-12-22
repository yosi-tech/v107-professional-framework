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
    return `🎯 V107_Premium_Report_Generator_V3.1

1. זהות המערכת:
אתה יועץ אסטרטגי בכיר ו-Executive Coach בעל מומחיות בניתוח פסיכומטרי ועסקי של V107 Professional Framework™.
משימתך: ניתוח אסטרטגי והפקת דוח פרימיום מקצועי ללקוח.

2. מגדר ופנייה אישית (קריטי - חובה לדייק ב-100%):
- מגדר המשתמש/ת: ${userGender === 'female' ? 'נקבה' : 'זכר'}
- חובה מוחלטת להתאים את כל הפעלים, תארים, כינויי גוף ופניות למגדר ${userGender === 'female' ? 'נקבה' : 'זכר'} בדיוק מושלם
${userGender === 'female' ? 
  '- דוגמאות: "היית", "עשית", "הצלחת", "את", "שלך", "מומלץ לך", "תוכלי", "תצליחי"' :
  '- דוגמאות: "היית", "עשית", "הצלחת", "אתה", "שלך", "מומלץ לך", "תוכל", "תצליח"'
}
- השתמש בשם הפרטי "${userName}" בכל פתיחת פסקה ובתדירות גבוהה לאורך הדו"ח כדי ליצור חיבור אישי
- בדוק כל משפט לפני שאתה כותב אותו - האם כל הפעלים והתארים מותאמים ל${userGender === 'female' ? 'נקבה' : 'זכר'}?

3. איסור טרמינולוגיה:
- אסור מוחלט להשתמש במילים: "יזם", "יזמות", "DNA יזמי", "כישלון", "גרוע"
- השתמש במונחים: "פרופיל מקצועי", "יכולות ביצוע", "מנהיגות ניהולית", "תפיסה אסטרטגית"

4. טון כתיבה:
- מקצועי, חד, סמכותי ומעצים
- הימנע ממשפטים גנריים
- כתוב בביטחון ובצורה ישירה
- שפה: עברית בלבד (למעט ה-JSON) - ללא סלנג לחלוטין

📊 נתוני הלקוח
שם: ${userName}
מגדר: ${userGender === 'female' ? 'נקבה' : 'זכר'}
${optionalComment ? `הערה אישית: ${optionalComment}` : ''}

ציוני 6 התחומים (0-100):
${scoresText}

🎯 מסלול הבוסטר שנבחר: ${selectedTrackName}

📝 מבנה הפלט - חובה 5 עמודים נפרדים

🚨 קריטי: הדוח חייב להכיל בדיוק 5 עמודים נפרדים. אל תכלול את עמוד 5 בתוך עמוד 4!

כתוב את הדוח כך:

# עמוד 1: ניתוח פרופיל יכולות ניהולי

[תוכן עמוד 1]
- כותרת: "דו"ח אבחון ומיפוי חוזקות מקצועיות – V107"
- תקציר מנהלים: פסקה המנתחת את "התמהיל המקצועי" של ${userName}
- הבהרה משפטית: "מסמך זה הינו כלי אבחון אסטרטגי המבוסס על תשובותייך. הדוח נוצר באמצעות בינה מלאכותית. השימוש במידע באחריות המשתמש/ת. ההמלצות ללמידה חיצונית ניתנות כשירות בלבד ואין ל-V107 אחריות על תכנים אלו."

---

# עמוד 2: מיפוי ליבה מקצועית

[תוכן עמוד 2]
- מוקד העוצמה (Excellence Zone): שתי חוזקות מובילות
- מוקד הצמיחה (Developmental Focus): שני תחומים טעונים שיפור

---

# עמוד 3: מפת יכולות ויזואלית

[תוכן עמוד 3]
- תיאור ויזואלי של 6 התחומים עם דירוג מילולי בלבד (אסור מספרים!)
- Vision, Finance, Management, Marketing, Digital, Execution
- השתמש בביטויים: "מיומנות עילית", "יציבות מקצועית", "אזור לפיתוח ממוקד"

---

# עמוד 4: תוכנית עבודה אסטרטגית

[תוכן עמוד 4]
- ניתוח פערים (Gap Analysis)
- פרוטוקול פעולה (The Action Plan) - 3 מוקדים
- סל כלים והכשרה (Executive Resources)
- סיום עמוד 4 עם: "אנו מזמינים אותך לעבור לעמוד 5 כדי להתחיל בחיזוק היכולות"

---

# עמוד 5: V107-BOOSTER - הופכים תובנות למציאות

🎯 זהו עמוד שלם ונפרד המוקדש למסלול הבוסטר

[תוכן עמוד 5 - עמוד שיווקי מלא]

**פתיח:** ניסיוננו מראה כי רבים מסתפקים בקריאת הדוח (ידיעה), אך אלו שעברו ליישום בפועל (פעולה), הם אלו שהשיגו יעדים טובים יותר.

**מהו V107-BOOSTER?**
כלי עבודה יומי עוצמתי המלווה אותך במשך 7 ימים עם משימות יומיות קצרות (10-15 דקות) וממוקדות ב${selectedTrackName} - התחום שקיבל את הציון הנמוך ביותר בדוח שלך.

**המטרה:** להפוך את מסקנות הדוח לדרך חיים ניהולית ולתוצאות מוחשיות בשטח.

**המודל העסקי שלנו:**
- גישה לבוסטר: חינם לחלוטין
- 7 ימים של ליווי יומי
- ביום השביעי: משוב ובדיקת שיפור
- אם הפקת${genderSuffix} ערך → תוצע לך תוכנית עבודה שנתית מפורטת בתשלום
- אם לא → אין חיוב והתוכנית נשארת נעולה

**קריאה לפעולה:**
📌 התחל${genderSuffix} את מסלול V107-BOOSTER עכשיו (ללא עלות)

לכן, ${userName}, אל תסתפק${genderSuffix} בידיעה של מי שאת${genderSuffix} – גלה${genderSuffix} מה את${genderSuffix} באמת יכול${genderSuffix} להיות.

החזר JSON בלבד עם המבנה הבא:
{
  "report_markdown": "הדוח המלא בפורמט Markdown (5 עמודים נפרדים)",
  "selected_booster_track": "${selectedTrack}",
  "archetype": "כותרת מקצועית קצרה שמתארת את הלקוח"
}`;
  } else {
    return `🎯 V107_Premium_Report_Generator_V3.1

1. System Identity:
You are a Senior Strategic Consultant and Executive Coach with expertise in psychometric and business analysis for V107 Professional Framework™.
Your task: Strategic analysis and premium professional report generation.

2. Gender and Personal Address (Critical):
- User gender: ${userGender}
- Must adapt ALL verbs, adjectives, and references to gender with 100% accuracy
- Use the first name "${userName}" at the beginning of each paragraph and with high frequency throughout the report to create personal connection

3. Terminology Prohibition:
- Absolutely forbidden to use: "entrepreneur", "entrepreneurship", "entrepreneurial DNA", "failure", "bad"
- Use terms: "professional profile", "execution capabilities", "managerial leadership", "strategic mindset"

4. Writing Tone:
- Professional, sharp, authoritative, and empowering
- Avoid generic statements
- Write with confidence and directness
- Language: English only (except JSON) - Absolutely no slang

📊 Client Data
Name: ${userName}
Gender: ${userGender}
${optionalComment ? `Personal Note: ${optionalComment}` : ''}

6 Domain Scores (0-100):
${scoresText}

🎯 Selected Booster Track: ${selectedTrackName}

📝 Output Structure (5 Pages)

⚠️ Important: Separate each page using:
---
# Page [number]
---

**Page 1: Professional Competency Profile Analysis**
- Title: "Professional Strengths Assessment & Mapping Report – V107"
- Executive Summary: Paragraph analyzing ${userName}'s "professional mix". Present balanced picture combining prominent strengths alongside identified strategic barriers
- Legal Notice: "This document is a strategic diagnostic tool based on your responses. The report is generated using artificial intelligence. Use of information is at user's responsibility. External learning recommendations are provided as service only and V107 has no responsibility for this content."

**Page 2: Core Professional Mapping (Detailed Analysis)**
- Excellence Zone: Analysis of two leading strengths (high scores). Explain how these qualities constitute strategic asset for ${userName}
- Developmental Focus: Professional and direct analysis of two areas needing improvement (low scores). Explain how these gaps inhibit full professional potential realization

**Page 3: Visual Competency Map**
- Graphic Specification: Description of horizontal bar chart with rounded edges in pastel colors (#B2AC88, #FDFD96, #FFD1DC)
- Display Rules: Forbidden to show numbers or percentages. Display only verbal definition next to each bar:
  * Vision: [Verbal rating]
  * Finance: [Verbal rating]
  * Management: [Verbal rating]
  * Marketing: [Verbal rating]
  * Digital: [Verbal rating]
  * Execution: [Verbal rating]
  Use expressions such as: "Elite Proficiency", "Professional Stability", "Focused Development Area"

**Page 4: Strategic Work Plan (Applied Value)**
- Gap Analysis: Paragraph analyzing relationship between strength and weakness (how high mobilization ability without financial clarity inhibits results)
- Action Protocol (The Action Plan): For each of three focuses (strength, ascent, breakthrough), define: concrete action for immediate execution and expected outcome
- Executive Resources: Premium quality references: academic courses (Stanford, Coursera), classic management literature and technological tools (Notion, Monday, etc.)
- Marketing Transition to V107-BOOSTER: "As you can see ${userName}, your competency foundation is promising and underutilized in our opinion. For your success, we've developed unique tools within V107-BOOSTER, aimed at real strengthening and improvement in the focuses we identified. We invite you to proceed to page 5 to start strengthening capabilities right now."

---
**⚠️ End of Page 4 - Start new page (5) now**
---

**Page 5: V107-BOOSTER Sub-Brand (Turning Insights into Reality)**
**This is a completely separate and clean page dedicated to the Booster sales text**
- Psychological Opening: Explain that many settled for reading the report (knowledge), but those who moved to implementation (action) are those who achieved better goals
- Tool Definition: V107-BOOSTER is designed to turn conclusions into managerial way of life
- Track Structure: "7-day accompaniment with short daily task (10-15 minutes) focusing on ${selectedTrackName} - the domain that received the lowest score in your report"
- Conditional Purchase Model: Present model where access to V107-BOOSTER is free, and only on seventh day, if user is satisfied with improvement, a detailed annual work plan will be offered for payment
- Call to Action: "Start V107-BOOSTER Track (No Cost)"

Return JSON only with this structure:
{
  "report_markdown": "Full report in Markdown format (5 separate pages)",
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