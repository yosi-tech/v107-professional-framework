import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0';

const V9_WRITER_SYSTEM_PROMPT = `V107 REPORT — SYSTEM PROMPT V9 WRITER
© 2026 V107 Professional Framework

════════════════════════════════════════════════════════════
🚨 תפקידך: כותב בלבד. כל הנתונים מוכנים ב-JSON.
════════════════════════════════════════════════════════════

אתה יועץ קריירה בכיר שכותב דוח אישי עמוק בעברית.
כל הנתונים — ציונים, ארכיטייפ, תוויות, benchmark, גרף — מגיעים ב-JSON.
תפקידך: לנסח אותם בשפה אנושית, חמה, ישירה ומדויקת.

🚫 חוקי ברזל — הפרה אחת = דוח פסול:
1. אל תמציא שום מספר. לא ציון, לא אחוז, לא benchmark. רק מה שב-JSON.
2. אל תשנה ארכיטייפ. השתמש בדיוק ב-archetype.hebrew_name מה-JSON.
3. אל תזכיר "5,200 משתמשים" / "בסיס נתוני V107" / "X% מהמשתמשים". לא קיים.
4. כל benchmark — רק מ-approved_benchmarks שב-JSON, עם תג (מקינזי B#).
5. שפה עברית בלבד. מונחים באנגלית — בסוגריים בלבד.
6. תוויות רמה — בדיוק כפי שמופיעות ב-band של כל ממד ב-JSON.
7. ציונים — בדיוק כפי שמופיעים ב-score של כל ממד ב-JSON.

════════════════════════════════════════════════════════════
מגדר — כלל קריטי
════════════════════════════════════════════════════════════

קרא את שדה gender מה-JSON:
- זכר → אתה, שלך, עשית, חזק
- נקבה → את, שלך, עשית, חזקה
- אחר → ניסוח ניטרלי, ברירת מחדל זכר
אי-התאמה מגדרית אחת = דוח פסול.

════════════════════════════════════════════════════════════
מבנה הדוח — 5 עמודים
════════════════════════════════════════════════════════════

עמוד 1 — תקציר מנהלים

פתח בתיבה ממוסגרת:
╔══════════════════════════════════════════════════════════════╗
║         תקציר מנהלים — [name] | V107 REPORT                 ║
╠══════════════════════════════════════════════════════════════╣
║  🏆 הפרופיל שלך: [archetype.hebrew_name]                    ║
║  ⚡ שני הכוחות: [top3[0].name_he] ([top3[0].score]) +       ║
║     [top3[1].name_he] ([top3[1].score])                      ║
║  ⚠️ מה עולה לך ביוקר: [bottom2[0].name_he] ([bottom2[0].score]) ║
║  🎯 4 מסלולים: [4 תפקידים אמיתיים לפי occupation+interests]  ║
║  📋 3 משימות תוך 30 יום — עמוד 5                            ║
╚══════════════════════════════════════════════════════════════╝

מיד אחריה — תיבת מקינזי:
╔══════════════════════════════════════════════════════════════╗
║  📊 על הבסיס המחקרי של הדוח                                 ║
╠══════════════════════════════════════════════════════════════╣
║  הדוח מתבסס על מחקרי מקינזי (McKinsey & Company) —         ║
║  חברת הייעוץ הניהולי הגדולה בעולם, שנוסדה ב-1926.          ║
║  מחקריה משמשים ממשלות ותאגידים בינלאומיים ומהווים          ║
║  סטנדרט גלובלי מוכר בתחום פיתוח הון אנושי ומנהלים.        ║
╚══════════════════════════════════════════════════════════════╝

Header: [name] | [report_date] | גיל [age] | [occupation]

משפט פתיחה: "[name], יש אנשים ש[ביטוי יומיומי לכוח top3[0]].
יש אנשים ש[ביטוי יומיומי לכוח top3[1]].
ויש אנשים שיודעים לעשות את שניהם — אתה אחד מהם."

לכל ממד ב-top3 וב-bottom2 — פורמט זה בלבד:
[name_he] — [score] | [band]
⚠️ למה זה ככה: [סיבה פסיכולוגית — משפט אחד]
💰 מה זה שווה / עולה לך: [השלכה + benchmark מ-approved_benchmarks]
✅ הצעד הבא: [פעולה אחת קונקרטית השבוע]

סיום עמוד 1:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 V107 כרטיס פרופיל
[name] | גיל [age] | [report_date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━
הפרופיל: [archetype.hebrew_name]
חוזק מרכזי: [top3[0].name_he] — [top3[0].score] ([top3[0].band])
אזור פיתוח: [bottom2[0].name_he] — [bottom2[0].score] ([bottom2[0].band])
━━━━━━━━━━━━━━━━━━━━━━━━━━━
"[5 מילים עבריות שמגדירות את הפרופיל]"
━━━━━━━━━━━━━━━━━━━━━━━━━━━

────────────────────────────────────────────────────────────

עמוד 2 — ניתוח מעמיק

פתח במשפט הפתיחה של הארכיטייפ לפי archetype.opening_version מה-JSON.

לכל ממד ב-top3: פורמט הבולטים + דוגמה התנהגותית יומיומית אחת.
שני דפוסי שילוב:
- [top3[0].name_he] + [top3[1].name_he] = [שם דפוס]: [משמעות]
- [top3[0].name_he] + [bottom2[0].name_he] = [שם דפוס]: [משמעות]

לכל ממד ב-bottom2: פורמט הבולטים + אזהרת סיכון:
⚠️ אזהרת סיכון (מקינזי [B#]): כשהתחום הזה נמוך — אנשים לרוב
מרגישים שהם עובדים קשה אבל לא מתקדמים.
[השתמש רק במספרים מ-approved_benchmarks: 21%, 27%, 31%, 40%]

3 משפטים — הפרדוקס המקצועי. גיל ומגדר.

────────────────────────────────────────────────────────────

עמוד 3 — המפה המלאה

גרף — העתק בדיוק מ-chart_data שב-JSON:
╔══════════════════════════════════════════════════════╗
║     מפת יכולות — [name] | V107                       ║
╠══════════════════════════════════════════════════════╣
║  [name_he]   [color_emoji × circles]   [score]       ║
║  ...                                                  ║
╠══════════════════════════════════════════════════════╣
║  🟢 80-100 חזק    🟡 60-79 ממוצע                     ║
║  🟠 40-59 טעון שיפור   🔴 0-39 דורש טיפול            ║
╚══════════════════════════════════════════════════════╝

טבלת יכולות — 11 שורות:
| ממד | הסבר יומיומי | ציון | רמה | פרשנות |

────────────────────────────────────────────────────────────

עמוד 4 — נתיבי קריירה

"[name], בגיל [age] עם פרופיל [archetype.hebrew_name] — 4 מסלולים לפי הממדים שלך."

לכל תפקיד — 4 שורות בלבד:
תפקיד [#]: [שם] | [ענף]
למה מתאים: [משפט אחד + ציון ספציפי מ-top3]
ROI: [benchmark אחד מ-approved_benchmarks + משפט אחד]
מה לשפר: [פעולה אחת קשורה ל-bottom2]

כללים: לפחות 2 ענפים שונים. תפקידים קיימים בשוק בלבד.

────────────────────────────────────────────────────────────

עמוד 5 — המלצות וסיום

2-3 משפטים — המצב. גיל ומגדר.

3 משימות:
משימה [#]: [פעולה ספציפית]
זמן: [X ימים]
מדד הצלחה: [מדיד]

משפט סיום אישי אחד.

"רוצה להמשיך? תוכנית הבוסטר של V107 היא 30 יום של הנחיה יומית
ממוקדת — בנויה בדיוק על הפרופיל שלך."

הצהרה משפטית — מילה במילה:
"הניתוח מתבסס על מתודולוגיות ובנצ'מרק גלובלי של מקינזי (McKinsey & Company)
בנושאי הון אנושי. הדוח מהווה כלי אבחוני בלבד ואינו מחליף ייעוץ מקצועי,
עסקי או פסיכולוגי מחייב. כל הנתונים האישיים מטופלים בסודיות מלאה."

════════════════════════════════════════════════════════════
END OF SYSTEM PROMPT — V107 REPORT V9 WRITER
© 2026 V107 Professional Framework — Confidential & Proprietary
════════════════════════════════════════════════════════════`;

// ============================================================================
// Calculation Engine — runs BEFORE Claude, results sent as pre-calculated JSON
// ============================================================================

const REVERSE_QUESTIONS = [4, 8, 14, 22, 25, 27, 34, 37, 39, 41, 45, 48, 54, 57, 60, 89, 90, 93, 98];

const DIMENSIONS = {
  resilience:    { nameHe: 'חוסן והחלטיות',       questions: [1,2,3,4,5,6,7,8,9,10,11] },
  flexibility:   { nameHe: 'גמישות וחדשנות',       questions: [12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28] },
  leadership:    { nameHe: 'מנהיגות ואחריות',      questions: [29,30,31,32,33,34,35,36,37,38,39,40,41] },
  communication: { nameHe: 'תקשורת ושיתוף פעולה', questions: [42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57] },
  planning:      { nameHe: 'תכנון',                questions: [58,59,60,61,62,63,64,76,77] },
  learning:      { nameHe: 'למידה וצמיחה',         questions: [65,66,67,68,69,78,85,86,87,103] },
  vision:        { nameHe: 'חזון אסטרטגי',         questions: [72,73,74,75,80,84,101,102] },
  tech:          { nameHe: 'מיומנות טכנולוגית',    questions: [82,83,94,95,106] },
  networking:    { nameHe: 'נטוורקינג',            questions: [81,105,107] },
  balance:       { nameHe: 'איזון ורווחה',         questions: [70,71,88,89,90,91,92] },
  change:        { nameHe: 'ניהול שינוי',          questions: [96,97,98,99,100,104] }
};

// Benchmark mapping per dimension
const BENCHMARK_MAP = {
  resilience:    { personal: ['B8'], organizational: ['B5'] },
  flexibility:   { personal: ['B8'], organizational: ['B1'] },
  leadership:    { personal: ['B10'], organizational: ['B2'] },
  communication: { personal: ['B10'], organizational: ['B4'] },
  planning:      { personal: ['B9'], organizational: ['B3'] },
  learning:      { personal: ['B9'], organizational: ['B7'] },
  vision:        { personal: ['B9'], organizational: ['B5'] },
  tech:          { personal: ['B9'], organizational: ['B6'] },
  networking:    { personal: ['B10'], organizational: ['B4'] },
  balance:       { personal: ['B11'], organizational: ['B7'] },
  change:        { personal: ['B8'], organizational: ['B3'] }
};

// Approved benchmark data
const APPROVED_BENCHMARKS = {
  B1:  { tag: 'B1',  topic: 'דיוק בגיוס',      data: 'כלי הערכה מבוססי נתונים משפרים את דיוק הגיוס ב-25% ומפחיתים נטישה בשנה הראשונה ב-30%', pages: [4] },
  B2:  { tag: 'B2',  topic: 'עלות גיוס שגוי',   data: 'גיוס שגוי עולה לארגון 150%–200% מהשכר השנתי של העובד', pages: [4] },
  B3:  { tag: 'B3',  topic: 'זמן גיוס',          data: 'ארגונים מובילים סוגרים משרות תוך 30–45 יום; חריגה מזה מגדילה סיכון לאובדן כישרונות ב-50%', pages: [4] },
  B4:  { tag: 'B4',  topic: 'חווית מועמד',        data: 'תהליך שמדורג כ"חיובי ומקצועי" מגדיל קבלת הצעות ב-38%, גם ללא שכר גבוה יותר', pages: [4] },
  B5:  { tag: 'B5',  topic: 'רווחיות',            data: 'חברות ברבעון העליון של ניהול הון אנושי מציגות רווחיות גבוהה ב-22% מהמתחרות', pages: [4] },
  B6:  { tag: 'B6',  topic: 'אוטומציה ב-HR',     data: 'שימוש ב-AI לסינון ודוחות מפחית עבודה אדמיניסטרטיבית ב-40%', pages: [4] },
  B7:  { tag: 'B7',  topic: 'סיבות לעזיבה',      data: '41% מהעובדים שעזבו ציינו היעדר מסלול פיתוח ברור או אי-התאמה תרבותית', pages: [4] },
  B8:  { tag: 'B8',  topic: 'חוסן ומנהיגות',     data: 'מנהלים עם חוסן גבוה מדווחים על מעורבות צוות גבוהה ב-31% בממוצע מעמיתיהם', pages: [1,2,5] },
  B9:  { tag: 'B9',  topic: 'למידה מתמדת',       data: 'עובדים שמשקיעים באופן פעיל בלמידה עצמית מגיעים לתפקידי ניהול בשליש מהזמן', pages: [1,2,5] },
  B10: { tag: 'B10', topic: 'מנהיגות אפקטיבית',  data: 'מנהלים שמפתחים כישורי תקשורת ומשוב מדווחים על שיפור של 40% בשביעות רצון הצוות', pages: [1,2,5] },
  B11: { tag: 'B11', topic: 'איזון ורווחה',       data: 'עובדים עם איזון עבודה-חיים גבוה מציגים פרודוקטיביות גבוהה ב-21% ושימור גבוה ב-27%', pages: [1,2,5] }
};

function calcScore(responses, questions) {
  let sum = 0, count = 0;
  for (const q of questions) {
    let v = responses[`q${q}`];
    if (!v) continue;
    if (REVERSE_QUESTIONS.includes(q)) v = 8 - v;
    sum += v; count++;
  }
  if (!count) return 0;
  return Math.round((sum / count) * 14.2857 * 10) / 10;
}

function getBandLabel(score) {
  if (score >= 85) return 'עשירון עליון';
  if (score >= 70) return 'שלושים אחוז עליונים';
  if (score >= 60) return 'חמישים האחוז האמצעיים';
  if (score >= 40) return 'שלושים אחוז תחתונים';
  return 'עשירון תחתון';
}

function getChartColor(score) {
  if (score >= 80) return { emoji: '🟢', label: 'חזק' };
  if (score >= 60) return { emoji: '🟡', label: 'ממוצע' };
  if (score >= 40) return { emoji: '🟠', label: 'טעון שיפור' };
  return { emoji: '🔴', label: 'דורש טיפול' };
}

function getAgeCategory(age) {
  if (age <= 27) return { category: 'Junior', tone: 'מעודד ואופטימי' };
  if (age <= 35) return { category: 'Mid', tone: 'ממוקד ואסרטיבי' };
  if (age <= 45) return { category: 'Senior', tone: 'בוגר עם פרספקטיבה רחבה' };
  if (age <= 60) return { category: 'Executive', tone: 'סמכותי ומאוזן' };
  return { category: 'Post-career', tone: 'מכבד וצופה קדימה' };
}

function identifyArchetypeAdvanced(sortedDims) {
  const topKey = sortedDims[0].key;
  const bottomKey = sortedDims[sortedDims.length - 1].key;

  // Exact match archetypes
  const archetypes = [
    { top: 'learning',    bottom: 'networking', name: 'הלומד המתמיד',   english: 'The Continuous Learner' },
    { top: 'networking',  bottom: 'planning',   name: 'בונה הגשרים',    english: 'The Strategic Networker' },
    { top: 'planning',    bottom: 'flexibility', name: 'מבצע המשימות',  english: 'The Execution Machine' },
    { top: 'flexibility', bottom: 'resilience', name: 'החדשן הגמיש',    english: 'The Adaptive Innovator' },
    { top: 'resilience',  bottom: 'vision',     name: 'המוביל העמיד',   english: 'The Resilient Leader' },
    { top: 'vision',      bottom: 'planning',   name: 'החוזה המשכנע',   english: 'The Visionary Communicator' }
  ];

  // Check exact match first
  for (const a of archetypes) {
    if (topKey === a.top && bottomKey === a.bottom) {
      return { hebrew_name: a.name, english_name: a.english, match_type: 'exact' };
    }
  }

  // Fallback: choose by largest gap between top and bottom
  let bestMatch = null;
  let bestGap = -1;
  for (const a of archetypes) {
    const topDim = sortedDims.find(d => d.key === a.top);
    const bottomDim = sortedDims.find(d => d.key === a.bottom);
    if (topDim && bottomDim) {
      const gap = topDim.score - bottomDim.score;
      if (gap > bestGap) {
        bestGap = gap;
        bestMatch = a;
      }
    }
  }

  if (bestMatch) {
    return { hebrew_name: bestMatch.name, english_name: bestMatch.english, match_type: 'closest_gap' };
  }

  return { hebrew_name: 'הלומד המתמיד', english_name: 'The Continuous Learner', match_type: 'default' };
}

function buildExtendedJSON(personalInfo, effectiveAge, genderFormatted, translatedOccupation, translatedInterests, responses) {
  // 1. Calculate all dimension scores
  const dimensionsRaw = {};
  for (const [key, dim] of Object.entries(DIMENSIONS)) {
    const score = calcScore(responses, dim.questions);
    const band = getBandLabel(score);
    const color = getChartColor(score);
    const circles = Math.round(score / 10);
    dimensionsRaw[key] = {
      key,
      name_he: dim.nameHe,
      score,
      band,
      chart: { circles, color_emoji: color.emoji, color_label: color.label },
      benchmarks: BENCHMARK_MAP[key]
    };
  }

  // 2. Sort dimensions HIGH → LOW
  const dimensionsSorted = Object.values(dimensionsRaw).sort((a, b) => b.score - a.score);
  const top3 = dimensionsSorted.slice(0, 3);
  const bottom2 = dimensionsSorted.slice(-2);

  // 3. Identify archetype
  const archetype = identifyArchetypeAdvanced(dimensionsSorted);
  archetype.opening_version = effectiveAge % 4;

  // 4. Age category
  const ageInfo = getAgeCategory(effectiveAge);

  // 5. Build chart data
  const chartData = dimensionsSorted.map(d => ({
    name_he: d.name_he,
    score: d.score,
    circles: d.chart.circles,
    color_emoji: d.chart.color_emoji,
    color_label: d.chart.color_label
  }));

  // 6. Build the extended JSON
  const today = new Date();
  const reportDate = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;

  return {
    name: personalInfo.full_name,
    email: personalInfo.email,
    gender: genderFormatted,
    age: effectiveAge,
    report_date: reportDate,
    occupation: translatedOccupation,
    interests: translatedInterests,
    age_category: ageInfo,
    archetype,
    dimensions_sorted: dimensionsSorted.map(d => ({
      key: d.key,
      name_he: d.name_he,
      score: d.score,
      band: d.band,
      benchmarks: d.benchmarks
    })),
    top3: top3.map(d => ({ key: d.key, name_he: d.name_he, score: d.score, band: d.band })),
    bottom2: bottom2.map(d => ({ key: d.key, name_he: d.name_he, score: d.score, band: d.band })),
    chart_data: chartData,
    approved_benchmarks: APPROVED_BENCHMARKS
  };
}

// ============================================================================
// Main handler
// ============================================================================

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
    if (age && (age < 18 || age > 100)) {
      return Response.json({ error: 'Invalid age - must be between 18 and 100' }, { status: 400 });
    }
    const effectiveAge = age || 35;

    const genderRaw = response.personal_info?.gender;
    const genderFormatted = genderRaw === 'female' ? 'נקבה' : genderRaw === 'male' ? 'זכר' : 'אחר';

    const fieldTranslations = {
      entrepreneurship: 'יזמות',
      technology: 'טכנולוגיה',
      finance: 'פיננסים',
      culture: 'תרבות',
      marketing: 'שיווק',
      sales: 'מכירות',
      hr: 'משאבי אנוש',
      education: 'חינוך',
      management: 'ניהול',
      other: 'אחר'
    };

    const rawOccupation = response.personal_info.occupation_field || '';
    const translatedOccupation = fieldTranslations[rawOccupation] || rawOccupation;
    const rawInterests = response.personal_info.interest_areas || [];
    const translatedInterests = rawInterests.map(i => fieldTranslations[i] || i);

    // ===== CHANGE 1 + 2: Build extended pre-calculated JSON =====
    const extendedJSON = buildExtendedJSON(
      response.personal_info,
      effectiveAge,
      genderFormatted,
      translatedOccupation,
      translatedInterests,
      answers
    );

    console.log('Extended JSON built. Archetype:', extendedJSON.archetype.hebrew_name,
                '| Top3:', extendedJSON.top3.map(d => `${d.name_he}(${d.score})`).join(', '),
                '| Bottom2:', extendedJSON.bottom2.map(d => `${d.name_he}(${d.score})`).join(', '));

    // ===== CHANGE 3: Send extended JSON to Claude =====
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 10000,
      system: V9_WRITER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(extendedJSON) }]
    });

    const fullReport = claudeResponse.content[0].text;

    // Build DB metadata from pre-calculated data
    const domainScores = {};
    for (const d of extendedJSON.dimensions_sorted) {
      domainScores[d.key] = { score: d.score, percentile: d.band };
    }

    const reportId = `V107-V9W-${(response.language || 'HE').toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const savedReport = await base44.asServiceRole.entities.GeneratedReport.create({
      questionnaire_response_id: responseId,
      user_name: response.personal_info.full_name,
      user_email: response.personal_info.email,
      report_id: reportId,
      purchased: true,
      report_markdown: fullReport,
      archetype: extendedJSON.archetype.hebrew_name,
      recommended_booster_track: extendedJSON.bottom2[0]?.key,
      domain_scores: domainScores,
      executive_summary: {
        top3: extendedJSON.top3.map(d => ({ name: d.name_he, score: d.score })),
        bottom2: extendedJSON.bottom2.map(d => ({ name: d.name_he, score: d.score })),
        archetype: extendedJSON.archetype.hebrew_name
      },
      focused_recommendations: [],
      status: 'completed',
      language: response.language || 'he'
    });

    // Generate career paths
    let careerPathsResult = null;
    try {
      console.log('Generating career paths for report:', savedReport.id);
      careerPathsResult = await base44.asServiceRole.functions.invoke('generateCareerPaths', { reportId: savedReport.id });
      console.log('Career paths generated successfully:', careerPathsResult?.recommendations_count || 0, 'recommendations');
    } catch (e) {
      console.error('Career paths generation failed:', e.message);
    }

    return Response.json({
      success: true,
      reportId: savedReport.id,
      report_number: reportId,
      model_used: 'claude-opus-4-5-20251101',
      career_paths_generated: careerPathsResult?.success || false,
      message: 'V9 WRITER report generated with pre-calculated data.'
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});