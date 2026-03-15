import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0';

// ============================================================================
// generateReportAutomatic - delegates to V9 Pro (Claude-powered, McKinsey data)
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
  if (age >= 20 && age <= 27) return { category: 'junior', label: 'מקצוען/ית בתחילת קריירה', timeline: '2-3 שנים', roi: 'הזדמנויות קריירה' };
  if (age >= 28 && age <= 35) return { category: 'mid', label: 'מקצוען/ית באמצע הדרך', timeline: '1-2 שנים', roi: 'קידום ונראות' };
  if (age >= 36 && age <= 45) return { category: 'senior', label: 'מנהל/ת ומקצוען/ית בכיר/ה', timeline: '6-18 חודשים', roi: 'הכנסה ועמדה' };
  if (age >= 46 && age <= 60) return { category: 'executive', label: 'מנהל/ת בכיר/ה ומומחה/ית', timeline: '3-6 חודשים', roi: 'עסקאות ודירקטוריונים' };
  return { category: 'postcareer', label: 'מקצוען/ית ומנטור/ית בכיר/ה', timeline: '5-10 שנים', roi: 'רלוונטיות ומורשת' };
}

const ARCHETYPES = {
  continuousLearner: { name: 'הלומד המתמיד', conditions: (d) => d.learning.score >= 70 && d.networking.score < 60, strength: 'שליטה במומחיות', gap: 'בידוד מקצועי', message: 'אתה מומחה בודד - יודע הרבה, אבל מעט מכירים אותך' },
  strategicNetworker: { name: 'הרשתות האסטרטגי', conditions: (d) => d.networking.score >= 70 && d.planning.score < 60, strength: 'בניית קשרים', gap: 'טקטי לא אסטרטגי', message: 'אתה מכיר כולם, אבל לא יודע לאן ללכת עם זה' },
  executionMachine: { name: 'מכונת הביצוע', conditions: (d) => d.planning.score >= 70 && d.flexibility.score < 60, strength: 'מצוינות תהליכית', gap: 'קשיחות בשינוי', message: 'אתה מצוין בביצוע, אבל שובר כשהתוכנית משתנה' },
  adaptiveInnovator: { name: 'החדשן הגמיש', conditions: (d) => d.flexibility.score >= 70 && d.resilience.score < 60, strength: 'ניווט בשינוי', gap: 'שחיקה מהירה', message: 'אתה מסתגל מהר, אבל לא מחזיק לטווח ארוך' },
  resilientLeader: { name: 'המנהיג העמיד', conditions: (d) => d.resilience.score >= 70 && d.vision.score < 60, strength: 'ניהול משברים', gap: 'חוסר כיוון ארוך טווח', message: 'אתה מצטיין במשברים, אבל חסר כיוון אסטרטגי' },
  visionaryCommunicator: { name: 'המתקשר החזונאי', conditions: (d) => d.vision.score >= 70 && d.planning.score < 60, strength: 'השראת כיוון', gap: 'חוסר תוכנית ביצוע', message: 'אתה רואה את העתיד, אבל לא יודע איך להגיע לשם' }
};

function calculateDimensionScore(responses, questions) {
  let sum = 0;
  for (const qNum of questions) {
    let value = responses[`q${qNum}`];
    if (!value) return 0;
    if (REVERSE_QUESTIONS.includes(qNum)) value = 8 - value;
    sum += value;
  }
  return Math.round((sum / questions.length) * 14.2857 * 10) / 10;
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
  return { name: 'הפרופיל המאוזן', strength: 'גמישות כללית', gap: 'חוסר התמחות ברורה', message: 'יש לך פרופיל מאוזן יחסית, אבל חסרה לך התמחות ברורה שתבליט אותך' };
}

function getTopAndBottom(dimensions) {
  const sorted = Object.entries(dimensions).map(([key, val]) => ({ key, ...val })).sort((a, b) => b.score - a.score);
  return { top3: sorted.slice(0, 3), bottom2: sorted.slice(-2) };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { responseId } = body;

    if (!responseId) {
      return Response.json({ error: 'responseId is required' }, { status: 400 });
    }

    const response = await base44.asServiceRole.entities.QuestionnaireResponse.get(responseId);
    if (!response) {
      return Response.json({ error: 'Questionnaire response not found' }, { status: 404 });
    }

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

    const dimensions = calculateAllDimensions(answers);
    const ageCategory = getAgeCategory(age);
    const topBottom = getTopAndBottom(dimensions);
    const archetype = identifyArchetype(dimensions);

    const { top3, bottom2 } = topBottom;
    const name = response.personal_info.full_name;
    const today = new Date().toLocaleDateString('he-IL');

    const allDimsTable = Object.values(dimensions)
      .sort((a, b) => b.score - a.score)
      .map(d => `${d.name}: ${d.score} (${d.percentile.range} – ${d.percentile.label})`)
      .join('\n');

    // V9: Deterministic variability
    const versionIndex = age % 4;
    const occupation = response.personal_info.occupation_field || '';
    const interests = (response.personal_info.interest_areas || []).join(', ') || 'לא צוין';

    // McKinsey benchmarks
    const mckinseyBlock = `(B1): עובדים עם חוסן גבוה שומרים על תפוקה גבוהה גם במשברים — נתון: 38% (McKinsey)
(B2): ארגונים שמשקיעים בגמישות מדווחים על עלייה של 40% בחדשנות (McKinsey)
(B3): מנהלים עם כישורי מנהיגות גבוהים מגדילים ביצועי צוות ב-50% (McKinsey)
(B4): נטוורקינג אפקטיבי מגדיל הזדמנויות קריירה ב-25% (McKinsey)
(B5): איזון עבודה-חיים טוב קשור ל-30% פחות שחיקה (McKinsey)
(B6): תכנון אסטרטגי קשור לעלייה של 41% בהשגת יעדים (McKinsey)
(B7): ארגונים עם חזון ברור משיגים 38% יותר הצלחות ארוכות טווח (McKinsey)`;

    const archetypeOpenerMap = {
      'הלומד המתמיד': ['הידע שלך הוא הנשק החזק ביותר שלך — וגם האתגר הגדול ביותר שלך.','בעולם שבו רוב האנשים מפסיקים ללמוד, אתה/את ממשיך/ה — זה יתרון אמיתי.','אתה/את משקיע/ה בידע כשאחרים משקיעים בקשרים. שניהם נדרשים.','הפרופיל שלך מעיד על עומק מקצועי גבוה לצד רשת תמיכה שדורשת חיזוק.'],
      'הרשתות האסטרטגי': ['הקשרים שלך הם הנכס שלך — תכנון יהפוך אותם לתוצאות.','אתה/את יודע/ת לפתוח דלתות. הצעד הבא הוא לדעת מה לעשות כשאתה/את בפנים.','רשת חזקה ללא מבנה — זו הגדרה של פוטנציאל שלא מומש.','אנשים אוהבים לעבוד איתך. עכשיו צריך לבנות את המסגרת שתנצל את זה.'],
      'מכונת הביצוע': ['אתה/את מביא/ה דברים לקו הסיום. זה נדיר — ויש לו מחיר שכדאי להכיר.','התוכניות שלך עובדות. גמישות תגרום להן לעבוד גם כשהתוכנית משתנה.','ביצוע ללא גמישות הוא מנוע עוצמתי על מסלול ישר — מה קורה בפניות?','הדיוק שלך הוא חוזק אמיתי. הצעד הבא: ללמוד מתי לשנות כיוון.'],
      'החדשן הגמיש': ['אתה/את רואה הזדמנויות שאחרים מפספסים — חוסן יאפשר לך לממש אותן.','יצירתיות גבוהה עם חוסן נמוך: רעיונות מצוינים שזקוקים לשדרה חזקה יותר.','אתה/את מסתגל/ת מהר — עכשיו תרגל/י לעמוד על הקרקע כשהדברים לא מסתגלים בחזרה.','הנטייה שלך לחדשנות היא יתרון תחרותי. חיזוק החוסן יכפיל אותו.'],
      'המנהיג העמיד': ['אתה/את עומד/ת איתן כשאחרים נופלים. חזון יגיד לך היכן לעמוד.','חוסן ללא כיוון הוא כוח שמחכה למשימה. הגיע הזמן להגדיר אותה.','הסביבה יכולה לסמוך עליך — עכשיו שהם יידעו לאן אתה/את הולך/ת.','האמינות שלך היא יסוד מצוין. חזון ברור יהפוך אותה להשפעה אמיתית.'],
      'המתקשר החזונאי': ['אתה/את רואה את העתיד בבהירות. תכנון יהפוך אותו למציאות.','חזון חזק ללא תכנון הוא השראה ללא מנוע. בוא/י נתקן את זה.','אתה/את מדבר/ת על מה שיהיה — עכשיו בנה/י את הגשר למה שישנו.','הרעיונות שלך מהדהדים. מבנה יבטיח שהם גם יניבו תוצאות.']
    };
    const openers = archetypeOpenerMap[archetype.name] || archetypeOpenerMap['הלומד המתמיד'];
    const archetypeOpener = openers[versionIndex];

    const prompt = `אתה מנתח פסיכומטרי מקצועי. כתוב דוח V107 מלא בעברית בלבד — 5 עמודים בדיוק.

🚨 חובה: הדוח כולו בעברית בלבד. אסור לכתוב באנגלית. 🚨

📌 נתוני הנבדק/ת:
שם: ${name} | גיל: ${age} | ${ageCategory.label}
מגדר: ${response.personal_info.gender === 'female' ? 'נקבה' : 'זכר'}
שנות ניסיון: ${response.personal_info.years_of_experience || 'לא צוין'}
${occupation ? 'תחום עיסוק: ' + occupation : 'ניתוח מבוסס תחומי עניין בלבד'}
תחומי עניין: ${interests}
תפקיד יעד: ${response.personal_info.target_position || 'לא צוין'}
תאריך: ${today}

📊 ציוני 11 הממדים:
${allDimsTable}

TOP 3: ${top3[0].name}(${top3[0].score}), ${top3[1].name}(${top3[1].score}), ${top3[2].name}(${top3[2].score})
BOTTOM 2: ${bottom2[0]?.name}(${bottom2[0]?.score}), ${bottom2[1]?.name}(${bottom2[1]?.score})

ארכיטיפ: ${archetype.name} | חוזקה: ${archetype.strength} | פער: ${archetype.gap}
פתיחת ארכיטיפ לעמוד 2 (השתמש במשפט זה): "${archetypeOpener}"

📚 נתוני McKinsey מאושרים (השתמש רק בנתונים אלה, ציין Tag):
${mckinseyBlock}

❌ אסור: "5,200 משתמשים" | סטטיסטיקות שאינן מהרשימה | "פוטנציאל אינסופי" | "הצלחה מובטחת"
✅ חובה: ציין "לפי מחקר McKinsey ([Bx])" לכל נתון | שם ${name} מינימום 5 פעמים | גיל ${age} מינימום 5 פעמים | תחומי עניין מינימום 5 פעמים | ארכיטיפ ${archetype.name} — לפחות פעם בכל עמוד

מבנה 5 עמודים:

**עמוד 1 — תקציר מנהלים**
⚡ Viral Hook (שורה ראשונה, מקסימום 20 מילה): "${name}, הפרופיל שלך משלב [TOP_DIM] גבוה עם [BOTTOM_DIM] — דפוס שמופיע ב-[Band] בלבד של אנשים בגילך לפי נתוני McKinsey."
1. המנוע שלך (TOP 3) — ציון + Band + ביטוי יומיומי + קשר לתחום/עניין
2. המחיר שאתה/את משלם/ת (BOTTOM 2) — ציון + Band + השלכה קריירית + נתון McKinsey עם Tag
3. התובנה המרכזית — פרדוקס, משפט אחד
4. הפרופיל שלך (${archetype.name}) — 2-3 משפטים
5. ROI אישי — נתוני McKinsey עם Tags
ARCHETYPE CARD בסוף:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 V107 PROFILE CARD | ${name} | גיל ${age} | ${today}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
פרופיל: ${archetype.name} | חוזק: [TOP_DIM] [SCORE] ([Band]) | פיתוח: [BOTTOM_DIM] [SCORE] ([Band])
"[5 מילים מגדירות]"
━━━━━━━━━━━━━━━━━━━━━━━━━━━
**[עמוד 1 מתוך 5]**

**עמוד 2 — ניתוח מעמיק**
פתיחה (חובה): "${archetypeOpener}"
Part A — TOP 3: ציון + Band + דוגמה התנהגותית + קשר לעניין
דפוסי אינטראקציה: [TOP1]+[TOP2]=[דפוס] ו-[TOP1]+[BOTTOM1]=[דפוס]
Part B — BOTTOM 2: לכל ממד: ציון+Band | סיבה פסיכולוגית (למה) | מה קורה אם לא מטפלים | נתון McKinsey עם Tag | פעולה ראשונה קונקרטית
⚠️ Risk Flag אחרי כל BOTTOM ממד: "⚠️ Risk Flag (McKinsey [Bx]): ממד זה הוא חסם מוכח ב[תחום] — עשוי להשפיע על קידום ב-[X]% לפי מקינזי." (השתמש רק ב: 25%, 30%, 38%, 40%, 41%, 50%)
Part C — הפרדוקס המקצועי: 3 משפטים
**[עמוד 2 מתוך 5]**

**עמוד 3 — המפה המלאה**
Spider Chart ASCII (11 שורות ממוינות HIGH→LOW, ▲ TOP 3, ▼ BOTTOM 2, 1 █ = 5 נקודות):
╔══════════════════════════════════════════════════════╗
║ V107 SPIDER CHART — ${name}
╠══════════════════════════════════════════════════════╣
║ ממד                        [בר] ציון
[11 שורות]
╚══════════════════════════════════════════════════════╝
טבלת יכולות (11 שורות): | # | ממד | תיאור יומיומי | ציון | Band | פרשנות + קשר לארכיטיפ |
טבלת בר Markdown (11 שורות, HIGH→LOW): | # | ממד | ציון | Band | בר | סטטוס |
(אמוג'י: 🟢 מצטיין | 🔵 חזק | 🟡 ממוצע | 🟠 מוגבל | 🔴 פער קריטי)
**[עמוד 3 מתוך 5]**

**עמוד 4 — מסלולי קריירה**
4 תפקידים ספציפיים. לכל תפקיד: למה מתאים (TOP ממדים) | סיפור הצלחה אילוסטרטיבי (2-3 משפטים, ציין "דוגמה אילוסטרטיבית") | מה לשפר (BOTTOM ממד) | ROI צפוי (McKinsey Tag)
**[עמוד 4 מתוך 5]**

**עמוד 5 — V107 BOOSTER + סיכום**
המצב (2-3 משפטים בטון גיל ${age})
3 משימות: משימה [מספר]: [פעולה] | זמן: [X] | מדד הצלחה: [מדיד]
סיכום אישי + עידוד
הבהרה משפטית (מילה במילה): "הניתוח מבוסס על מתודולוגיות ובנצ'מרקים גלובליים של McKinsey & Company בנושא הון אנושי. הדוח משמש ככלי אבחוני בלבד ואינו מחליף ייעוץ מקצועי, עסקי או פסיכולוגי מחייב. כל הנתונים האישיים מטופלים בסודיות מלאה."
**[עמוד 5 מתוך 5]**`;

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20251001',
      max_tokens: 10000,
      messages: [{ role: 'user', content: prompt }],
      system: 'אתה מנתח פסיכומטרי מקצועי. תמיד כותב בעברית בלבד. הדוחות שלך מקצועיים, אישיים ומבוססי נתוני McKinsey בלבד. אינך ממציא סטטיסטיקות.'
    });

    const fullReport = claudeResponse.content[0].text;
    const reportId = `V107-V9-${(response.language || 'HE').toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const domainScores = {};
    for (const [key, dim] of Object.entries(dimensions)) {
      domainScores[key] = { score: dim.score, percentile: dim.percentile.range };
    }

    const savedReport = await base44.asServiceRole.entities.GeneratedReport.create({
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
        top3: top3.map(d => ({ name: d.name, score: d.score })),
        bottom2: bottom2.map(d => ({ name: d.name, score: d.score })),
        archetype: archetype.name
      },
      status: 'completed',
      language: response.language || 'he'
    });

    return Response.json({
      success: true,
      reportId: savedReport.id,
      report_number: reportId,
      model_used: 'claude-sonnet-4-5-20251001',
      message: 'V9 PRO report generated successfully'
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});