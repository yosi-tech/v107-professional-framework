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

📝 מבנה הפלט (5 עמודים)

**עמוד 1: ניתוח פרופיל יכולות ניהולי**
- כותרת: "דו"ח אבחון ומיפוי חוזקות מקצועיות – V107"
- תקציר מנהלים: פסקה המנתחת את "התמהיל המקצועי" של ${userName}. הצג תמונה מאוזנת המשלבת חוזקות בולטות לצד חסמים אסטרטגיים שזוהו
- הבהרה משפטית: "מסמך זה הינו כלי אבחון אסטרטגי המבוסס על תשובותייך. הדוח נוצר באמצעות בינה מלאכותית. השימוש במידע באחריות המשתמש/ת. ההמלצות ללמידה חיצונית ניתנות כשירות בלבד ואין ל-V107 אחריות על תכנים אלו."

**עמוד 2: מיפוי ליבה מקצועית (ניתוח מפורט)**
- מוקד העוצמה (Excellence Zone): ניתוח שתי החוזקות המובילות (ציונים גבוהים). הסבר כיצד תכונות אלו מהוות נכס אסטרטגי עבור ${userName}
- מוקד הצמיחה (Developmental Focus): ניתוח מקצועי וישיר של שני התחומים הטעונים שיפור (ציונים נמוכים). הסבר כיצד פערים אלו מעכבים את מימוש הפוטנציאל המקצועי המלא

**עמוד 3: מפת יכולות ויזואלית (Competency Map)**
- מפרט גרפי: תיאור גרף עמודות אופקי עם קצוות מעוגלים בצבעי פסטל (#B2AC88, #FDFD96, #FFD1DC)
- חוקיות תצוגה: אסור להציג מספרים או אחוזים. הצג הגדרה מילולית בלבד ליד כל עמודה:
  * Vision: [דירוג מילולי]
  * Finance: [דירוג מילולי]
  * Management: [דירוג מילולי]
  * Marketing: [דירוג מילולי]
  * Digital: [דירוג מילולי]
  * Execution: [דירוג מילולי]
  השתמש בביטויים כגון: "מיומנות עילית", "יציבות מקצועית", "אזור לפיתוח ממוקד"

**עמוד 4: תוכנית עבודה אסטרטגית (הערך היישומי)**
- ניתוח פערים (Gap Analysis): פסקה המנתחת את הקשר בין החוזקה לחולשה (איך יכולת רתימה גבוהה ללא בהירות פיננסית מעכבת תוצאות)
- פרוטוקול פעולה (The Action Plan): עבור כל אחד משלושת המוקדים (עוצמה, נסיקה, פריצה), הגדר: פעולה קונקרטית לביצוע מיידי ותוצאה מצופה
- סל כלים והכשרה (Executive Resources): הפניות פרימיום איכותיות: קורסים אקדמיים (Stanford, Coursera), ספרות ניהול קלאסית וכלים טכנולוגיים (Notion, Monday וכו')
- מעבר שיווקי ל-V107-BOOSTER: "כפי שאת${genderSuffix} רואה ${userName}, בסיס היכולות שלך מבטיח ואינו מנוצל דיו לדעתנו. למען הצלחתך, פיתחנו עבורך כלים ייחודיים בתוך ה-V107-BOOSTER, שמטרתם חיזוק ושיפור יכולות אמיתי במוקדים שזיהינו. אנו מזמינים אותך לעבור לעמוד מספר 5 כדי להתחיל בחיזוק היכולות כבר עכשיו."

**עמוד 5: תת מותג V107-BOOSTER (הופכים תובנות למציאות)**
- פתיח פסיכולוגי: הסבר כי רבים הסתפקו בקריאת הדוח (ידיעה), אך אלו שעברו ליישום (פעולה) הם אלו שהשיגו יעדים טובים יותר
- הגדרת הכלי: ה-V107-BOOSTER נועד להפוך מסקנות לדרך חיים ניהולית
- מבנה המסלול: "ליווי של 7 ימים עם משימה יומית קצרה (10-15 דקות) המתמקדת ב${selectedTrackName} - התחום שקיבל את הציון הנמוך ביותר בדוח שלך"
- מודל רכישה מותנה: הצגת המודל שבו הגישה ל-V107-BOOSTER היא ללא עלות, ורק ביום השביעי, במידה והמשתמש/ת מרוצה מהשיפור, תוצע לו/ה תוכנית עבודה שנתית מפורטת בתשלום
- קריאה לפעולה: "התחלת מסלול V107-BOOSTER (ללא עלות)"

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

📝 Output Structure (5 Pages)

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

**Page 5: V107-BOOSTER Sub-Brand (Turning Insights into Reality)**
- Psychological Opening: Explain that many settled for reading the report (knowledge), but those who moved to implementation (action) are those who achieved better goals
- Tool Definition: V107-BOOSTER is designed to turn conclusions into managerial way of life
- Track Structure: "7-day accompaniment with short daily task (10-15 minutes) focusing on ${selectedTrackName} - the domain that received the lowest score in your report"
- Conditional Purchase Model: Present model where access to V107-BOOSTER is free, and only on seventh day, if user is satisfied with improvement, a detailed annual work plan will be offered for payment
- Call to Action: "Start V107-BOOSTER Track (No Cost)"

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