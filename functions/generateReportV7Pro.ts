import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0';

// ============================================================================
// V107 REPORT V7 PRO - Powered by Claude claude-haiku-4-5
// ============================================================================

const REVERSE_QUESTIONS = [4, 8, 14, 22, 25, 27, 34, 37, 39, 41, 45, 48, 54, 57, 60, 89, 90, 93, 98];

const DIMENSIONS = {
  resilience: { nameHe: 'חוסן והחלטיות', nameEn: 'Resilience', questions: [1,2,3,4,5,6,7,8,9,10,11] },
  flexibility: { nameHe: 'גמישות וחדשנות', nameEn: 'Flexibility', questions: [12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28] },
  leadership: { nameHe: 'מנהיגות ואחריות', nameEn: 'Leadership', questions: [29,30,31,32,33,34,35,36,37,38,39,40,41] },
  communication: { nameHe: 'תקשורת ושיתוף פעולה', nameEn: 'Communication', questions: [42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57] },
  planning: { nameHe: 'תכנון', nameEn: 'Planning', questions: [58,59,60,61,62,63,64,76,77] },
  learning: { nameHe: 'למידה וצמיחה', nameEn: 'Learning', questions: [65,66,67,68,69,78,85,86,87,103] },
  vision: { nameHe: 'חזון אסטרטגי', nameEn: 'Vision', questions: [72,73,74,75,80,84,101,102] },
  tech: { nameHe: 'מיומנות טכנולוגית', nameEn: 'Tech', questions: [82,83,94,95,106] },
  networking: { nameHe: 'נטוורקינג', nameEn: 'Networking', questions: [81,105,107] },
  balance: { nameHe: 'איזון ורווחה', nameEn: 'Balance', questions: [70,71,88,89,90,91,92] },
  change: { nameHe: 'ניהול שינוי', nameEn: 'Change', questions: [96,97,98,99,100,104] }
};

function getPercentileContext(score) {
  if (score >= 85) return { range: 'Top 10%', label: 'מצטיין', severity: 'outstanding' };
  if (score >= 70) return { range: 'Top 30%', label: 'חזק', severity: 'strong' };
  if (score >= 60) return { range: 'Average 50%', label: 'ממוצע', severity: 'moderate' };
  if (score >= 40) return { range: 'Bottom 30%', label: 'מוגבל', severity: 'limited' };
  return { range: 'Bottom 10%', label: 'פער קריטי', severity: 'critical' };
}

function getAgeCategory(age) {
  if (age >= 20 && age <= 27) return { category: 'junior', label: 'מקצוען/ית בתחילת קריירה', timeline: '2-3 שנים', roi: 'הזדמנויות קריירה', tone: 'פוטנציאל ולמידה' };
  if (age >= 28 && age <= 35) return { category: 'mid', label: 'מקצוען/ית באמצע הדרך', timeline: '1-2 שנים', roi: 'קידום ונראות', tone: 'יתרון תחרותי' };
  if (age >= 36 && age <= 45) return { category: 'senior', label: 'מנהל/ת ומקצוען/ית בכיר/ה', timeline: '6-18 חודשים', roi: 'הכנסה ועמדה', tone: 'מיצוב אסטרטגי' };
  if (age >= 46 && age <= 60) return { category: 'executive', label: 'מנהל/ת בכיר/ה ומומחה/ית', timeline: '3-6 חודשים', roi: 'עסקאות ודירקטוריונים', tone: 'השפעה והובלה' };
  return { category: 'postcareer', label: 'מקצוען/ית ומנטור/ית בכיר/ה', timeline: '5-10 שנים', roi: 'רלוונטיות ומורשת', tone: 'העברת חוכמה' };
}

const ARCHETYPES = {
  continuousLearner: { name: 'הלומד המתמיד', nameEn: 'The Continuous Learner', conditions: (dims) => dims.learning.score >= 70 && dims.networking.score < 60, strength: 'שליטה במומחיות', gap: 'בידוד מקצועי', message: 'אתה מומחה בודד - יודע הרבה, אבל מעט מכירים אותך' },
  strategicNetworker: { name: 'הרשתות האסטרטגי', nameEn: 'The Strategic Networker', conditions: (dims) => dims.networking.score >= 70 && dims.planning.score < 60, strength: 'בניית קשרים', gap: 'טקטי לא אסטרטגי', message: 'אתה מכיר כולם, אבל לא יודע לאן ללכת עם זה' },
  executionMachine: { name: 'מכונת הביצוע', nameEn: 'The Execution Machine', conditions: (dims) => dims.planning.score >= 70 && dims.flexibility.score < 60, strength: 'מצוינות תהליכית', gap: 'קשיחות בשינוי', message: 'אתה מצוין בביצוע, אבל שובר כשהתוכנית משתנה' },
  adaptiveInnovator: { name: 'החדשן הגמיש', nameEn: 'The Adaptive Innovator', conditions: (dims) => dims.flexibility.score >= 70 && dims.resilience.score < 60, strength: 'ניווט בשינוי', gap: 'שחיקה מהירה', message: 'אתה מסתגל מהר, אבל לא מחזיק לטווח ארוך' },
  resilientLeader: { name: 'המנהיג העמיד', nameEn: 'The Resilient Leader', conditions: (dims) => dims.resilience.score >= 70 && dims.vision.score < 60, strength: 'ניהול משברים', gap: 'חוסר כיוון ארוך טווח', message: 'אתה מצטיין במשברים, אבל חסר כיוון אסטרטגי' },
  visionaryCommunicator: { name: 'המתקשר החזונאי', nameEn: 'The Visionary Communicator', conditions: (dims) => dims.vision.score >= 70 && dims.planning.score < 60, strength: 'השראת כיוון', gap: 'חוסר תוכנית ביצוע', message: 'אתה רואה את העתיד, אבל לא יודע איך להגיע לשם' }
};

function calculateDimensionScore(responses, questions) {
  let sum = 0;
  for (const qNum of questions) {
    let value = responses[`q${qNum}`];
    if (!value) return 0;
    if (REVERSE_QUESTIONS.includes(qNum)) value = 8 - value;
    sum += value;
  }
  const average = sum / questions.length;
  return Math.round(average * 14.2857 * 10) / 10;
}

function calculateAllDimensions(responses) {
  const result = {};
  for (const [key, dim] of Object.entries(DIMENSIONS)) {
    const score = calculateDimensionScore(responses, dim.questions);
    result[key] = { name: dim.nameHe, nameEn: dim.nameEn, score, percentile: getPercentileContext(score) };
  }
  return result;
}

function identifyArchetype(dimensions) {
  for (const [_, archetype] of Object.entries(ARCHETYPES)) {
    if (archetype.conditions(dimensions)) return archetype;
  }
  return { name: 'הפרופיל המאוזן', nameEn: 'The Balanced Profile', strength: 'גמישות כללית', gap: 'חוסר התמחות ברורה', message: 'יש לך פרופיל מאוזן יחסית, אבל חסרה לך התמחות ברורה שתבליט אותך' };
}

function getTopAndBottom(dimensions) {
  const sorted = Object.entries(dimensions).map(([key, val]) => ({ key, ...val })).sort((a, b) => b.score - a.score);
  return { top3: sorted.slice(0, 3), bottom2: sorted.slice(-2) };
}

// Build a rich prompt for Claude
function buildClaudePrompt(userData, dimensions, archetype, ageCategory, topBottom) {
  const { top3, bottom2 } = topBottom;
  const name = userData.personal_info.full_name;
  const age = userData.personal_info.age;
  const gender = userData.personal_info.gender === 'female' ? 'נקבה' : 'זכר';
  const experience = userData.personal_info.years_of_experience || 'לא צוין';
  const status = userData.personal_info.current_professional_status || 'לא צוין';
  const occupation = userData.personal_info.occupation_field || 'לא צוין';
  const interests = (userData.personal_info.interest_areas || []).join(', ') || 'לא צוין';
  const targetPosition = userData.personal_info.target_position || 'לא צוין';
  const language = userData.language || 'he';
  const today = new Date().toLocaleDateString('he-IL');

  const allDimsTable = Object.values(dimensions)
    .sort((a, b) => b.score - a.score)
    .map(d => `${d.name}: ${d.score} (${d.percentile.range} – ${d.percentile.label})`)
    .join('\n');

  return `אתה מומחה בפסיכולוגיה ארגונית ופיתוח קריירה. עליך לכתוב דוח מקצועי מעמיק ואישי בעברית בלבד (${language === 'he' ? 'עברית' : 'English'}).

## פרטי הנבדק/ת
- שם: ${name}
- גיל: ${age} | ${ageCategory.label}
- מגדר: ${gender}
- שנות ניסיון: ${experience}
- סטטוס מקצועי: ${status}
- תחום עיסוק: ${occupation}
- תחומי עניין: ${interests}
- תפקיד יעד: ${targetPosition}
- תאריך: ${today}

## ציוני 11 הממדים (מחושבים)
${allDimsTable}

## ממדים חזקים (Top 3)
1. ${top3[0].name}: ${top3[0].score} (${top3[0].percentile.range})
2. ${top3[1].name}: ${top3[1].score} (${top3[1].percentile.range})
3. ${top3[2].name}: ${top3[2].score} (${top3[2].percentile.range})

## ממדים חלשים (Bottom 2)
1. ${bottom2[1] ? bottom2[1].name + ': ' + bottom2[1].score : ''} (${bottom2[1]?.percentile?.range || ''})
2. ${bottom2[0] ? bottom2[0].name + ': ' + bottom2[0].score : ''} (${bottom2[0]?.percentile?.range || ''})

## ארכיטיפ
${archetype.name} – ${archetype.message}
חוזקה: ${archetype.strength} | פער: ${archetype.gap}

---

## הוראות לדוח

כתוב דוח מלא ומקצועי ב-5 עמודים בפורמט Markdown. הדוח צריך להיות:
- אישי לחלוטין – השתמש בשם ${name} לאורך כל הדוח
- מעמיק ומנותח – לא תבניות כלליות
- מעורר מוטיבציה ומעשי – עם המלצות קונקרטיות
- בגוף נוכח ראשון רבים (אתה/את)
- מקצועי, ישיר, וחם

### מבנה חובה:

**עמוד 1 – תקציר מנהלים אישי**
- פתיחה אישית ל${name}
- המנוע (Top 3) עם פרשנות עומק
- המחיר (Bottom 2) עם השפעה קונקרטית
- התובנה המרכזית
- הפרופיל האישי (${archetype.name})
- ה-ROI האישי

**עמוד 2 – ניתוח ממדים מעמיק**
- ניתוח עומק לכל ממד Top 3 (ביטוי יומיומי, יתרון, דוגמאות)
- ניתוח Bottom 2 עם הסבר פסיכולוגי
- דפוס האינטראקציה בין הממדים
- הפרדוקס המקצועי

**עמוד 3 – המפה המלאה**
- טבלת כל 11 הממדים עם ציונים, percentile ופרשנות
- דירוג מהגבוה לנמוך
- תיאור גרפי (Spider Chart / Bar Chart בטקסט)
- זיהוי דפוסים

**עמוד 4 – מסלולי קריירה (4 מסלולים)**
בהתבסס על ${occupation !== 'לא צוין' ? 'תחום העיסוק: ' + occupation : 'תחומי עניין: ' + interests} ועל תפקיד היעד ${targetPosition}:
- 4 מסלולי קריירה ספציפיים עם כותרות תפקיד אמיתיות
- לכל מסלול: למה מתאים, סיפור הצלחה קצר, מה לשפר, ROI צפוי
- קשור ספציפית לפרופיל ${archetype.name}

**עמוד 5 – V107 BOOSTER**
- תיאור המצב הנוכחי של ${name}
- 3 משימות יומיות קונקרטיות (יום 3, 12, 21) מותאמות לפרופיל
- סיכום מעורר השראה אישי
- הבהרה משפטית

סיים כל עמוד עם: **[עמוד X מתוך 5]**
`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { responseId } = body;

    if (!responseId) {
      return Response.json({ error: 'responseId is required' }, { status: 400 });
    }

    // Fetch questionnaire response
    const response = await base44.asServiceRole.entities.QuestionnaireResponse.get(responseId);
    if (!response) {
      return Response.json({ error: 'Questionnaire response not found' }, { status: 404 });
    }

    // Validate answers
    const answers = response.responses;
    if (!answers || Object.keys(answers).length < 107) {
      return Response.json({ error: 'Invalid questionnaire - must have 107 answers' }, { status: 400 });
    }

    for (let i = 1; i <= 107; i++) {
      const val = answers[`q${i}`];
      if (!val || val < 1 || val > 7) {
        return Response.json({ error: `Invalid answer for question ${i}` }, { status: 400 });
      }
    }

    const age = response.personal_info?.age;
    if (!age || age < 16 || age > 100) {
      return Response.json({ error: 'Invalid age' }, { status: 400 });
    }

    // Calculate dimensions
    const dimensions = calculateAllDimensions(answers);
    const ageCategory = getAgeCategory(age);
    const topBottom = getTopAndBottom(dimensions);
    const archetype = identifyArchetype(dimensions);

    // Build Claude prompt
    const prompt = buildClaudePrompt(response, dimensions, archetype, ageCategory, topBottom);

    // Call Anthropic Claude
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
      system: 'אתה מומחה בפסיכולוגיה ארגונית ופיתוח קריירה. תמיד כותב בעברית. הדוחות שלך הם מקצועיים, אישיים ומעמיקים. אתה ישיר, חם, ומניע לפעולה.'
    });

    const fullReport = claudeResponse.content[0].text;

    // Generate report ID
    const reportId = `V107-V7-${(response.language || 'HE').toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // Prepare domain scores
    const domainScores = {};
    for (const [key, dim] of Object.entries(dimensions)) {
      domainScores[key] = { score: dim.score, percentile: dim.percentile.range };
    }

    // Save to GeneratedReport entity
    const reportData = {
      questionnaire_response_id: responseId,
      user_name: response.personal_info.full_name,
      user_email: response.personal_info.email,
      report_id: reportId,
      purchased: false,
      report_markdown: fullReport,
      archetype: archetype.name,
      recommended_booster_track: topBottom.bottom2[1]?.key || topBottom.bottom2[0]?.key,
      domain_scores: domainScores,
      executive_summary: {
        top3: topBottom.top3.map(d => ({ name: d.name, score: d.score })),
        bottom2: topBottom.bottom2.map(d => ({ name: d.name, score: d.score })),
        archetype: archetype.name
      },
      status: 'completed',
      language: response.language || 'he'
    };

    const savedReport = await base44.asServiceRole.entities.GeneratedReport.create(reportData);

    return Response.json({
      success: true,
      reportId: savedReport.id,
      report_number: reportId,
      model_used: 'claude-haiku-4-5-20251001',
      message: 'V7 PRO report generated successfully by Claude'
    });

  } catch (error) {
    console.error('Error generating V7 report:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});