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
    return `יועץ אסטרטגי - צור דוח V107 עבור ${userName} (${userGender === 'female' ? 'נקבה' : 'זכר'}).

ציונים: ${scoresText}
בוסטר מומלץ: ${selectedTrackName}

כללים:
- התאם פעלים/תארים למגדר ${userGender === 'female' ? 'נקבה' : 'זכר'}
- אסור: יזם, יזמות, כישלון
- חובה: מנוע פנימי, מלכודת ה..., פרדוקס, The Wake-up Call
- טון: ישיר, חד, מקצועי

---

# עמוד 1: סינתזה ניהולית (The Wake-up Call)

פתיחה אישית:
${userName}, ${userGender === 'female' ? 'את' : 'אתה'} לא רק [תכונה בסיסית], ${userGender === 'female' ? 'את' : 'אתה'} [עוצמה אמיתית]. הניתוח חושף [המנוע הביצועי הייחודי שלך].

**תובנת עומק (3-4 משפטים):**
חשוף את הפרדוקס המרכזי - מה באמת מונע מ${userName} להתקדם. היה אמיץ וחד. הסבר את הקשר בין החוזקות לחסמים.

סיכום:
השלב הבא הוא לא [פעולה טריוויאלית], אלא [הפעולה האמיתית]. הגיע הזמן לעבור מ[מצב נוכחי] ל[מצב רצוי].

הבהרה משפטית: "מסמך אבחון אסטרטגי. נוצר ב-AI. השימוש באחריותך."

---

# עמוד 2: המנוע הפנימי – הפרדוקס של "${userName}"

פתיחה:
השאלון חושף שהמניע של ${userName} הוא לא רק [הסבר שטחי], אלא [המניע האמיתי העמוק].

**3-4 נקודות מרכזיות (כל נקודה 2-3 משפטים):**

• **מלכודת ה"[שם המלכודת]"**: 
הסבר מפורט איך הדפוס החיובי הופך להרסני. דוגמה ספציפית לפרופיל.

• **[דפוס נוסף]**: 
ניתוח סטטיסטי או התנהגותי. חשוף דפוס חוזר.

• **הפרדוקס המקצועי**: 
הסבר איך החוזקה הגדולה ביותר היא גם החסם הגדול ביותר. היה ספציפי.

---

# עמוד 3: השפעה אסטרטגית (The Mirror)

**ניתוח ROI אישי:**
חישוב עלות-תועלת של הדפוסים. "הפער בין [X] ל[Y] עולה לך ב[Z]".

**ציוני הליבה (מילולי בלבד - לא מספרים!):**
- ביצוע: [רמה עילית / יציבות מוצקה / דורש חיזוק]
- ניהול: [...]
- אסטרטגיה: [...]
- פיננסים: [...]
- דיגיטל: [...]
- יחסי אנוש: [...]

---

# עמוד 4: ניווט קריירה והמלצות "תכלס"

פתיחה חדה:
${userName}, ${userGender === 'female' ? 'את' : 'אתה'} לא ${userGender === 'female' ? 'צריכה' : 'צריך'} "[פתרון שגוי]". ${userGender === 'female' ? 'את צריכה' : 'אתה צריך'} [הפתרון האמיתי].

**נתיבי מימוש אפשריים בעבורך:**
1. **[תפקיד/מסלול 1]**: למה זה מתאים + מה צריך לשנות (2-3 משפטים)
2. **[תפקיד/מסלול 2]**: [...]
3. **[תפקיד/מסלול 3]**: [...]
4. **[תפקיד/מסלול 4]**: [...]

**ארגז כלים ופרוטוקול 24 שעות:**

• **ספר מומלץ**: [שם הספר] מאת [מחבר] - https://[קישור]
הסבר קצר למה זה רלוונטי.

• **כלי עבודה**: [שם הכלי] - https://[קישור]
הסבר קצר איך להשתמש.

• **פרוטוקול 24 שעות**:
${userName}, תעש${genderSuffix} [משימה קונקרטית אחת מיד]. [הנחיה ספציפית].

---

# עמוד 5: V107-BOOSTER

**פתיח:**
ניסיוננו מראה: רבים מסתפקים בקריאת הדוח (ידיעה), אך מי שעבר ליישום (פעולה) השיג יעדים טובים יותר.

**מהו V107-BOOSTER?**
כלי עבודה יומי: 7 ימים, משימות 10-15 דקות, ממוקד ב${selectedTrackName} - התחום הנמוך ביותר בדוח שלך.

המטרה: להפוך מסקנות לדרך חיים ניהולית ותוצאות מוחשיות.

**המודל:**
- חינם לחלוטין
- 7 ימים ליווי יומי
- ביום 7: משוב ובדיקת שיפור
- הפקת${genderSuffix} ערך? → תוכנית שנתית בתשלום
- לא? → אין חיוב

**קריאה:**
📌 ${userName}, התחל${genderSuffix} V107-BOOSTER עכשיו (ללא עלות)

אל תסתפק${genderSuffix} בידיעה של מי ש${userGender === 'female' ? 'את' : 'אתה'} – גלה${genderSuffix} מה ${userGender === 'female' ? 'את' : 'אתה'} באמת יכול${genderSuffix} להיות.

החזר JSON:
{
  "report_markdown": "הדוח המלא (5 עמודים)",
  "selected_booster_track": "${selectedTrack}",
  "archetype": "כותרת מקצועית קצרה"
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