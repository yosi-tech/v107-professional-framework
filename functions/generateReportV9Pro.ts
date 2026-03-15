import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0';

// ============================================================================
// V107 REPORT V9 PRO - Based on V9 FINAL System Prompt
// ============================================================================

const REVERSE_QUESTIONS = [4, 8, 14, 22, 25, 27, 34, 37, 39, 41, 45, 48, 54, 57, 60, 89, 90, 93, 98];

const DIMENSIONS = {
  resilience:    { nameHe: 'חוסן והחלטיות',         nameEn: 'Resilience and Decisiveness',    questions: [1,2,3,4,5,6,7,8,9,10,11] },
  flexibility:   { nameHe: 'גמישות וחדשנות',         nameEn: 'Flexibility and Innovation',     questions: [12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28] },
  leadership:    { nameHe: 'מנהיגות ואחריות',        nameEn: 'Leadership and Responsibility',  questions: [29,30,31,32,33,34,35,36,37,38,39,40,41] },
  communication: { nameHe: 'תקשורת ושיתוף פעולה',   nameEn: 'Communication and Collaboration',questions: [42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57] },
  planning:      { nameHe: 'תכנון',                  nameEn: 'Planning',                       questions: [58,59,60,61,62,63,64,76,77] },
  learning:      { nameHe: 'למידה וצמיחה',           nameEn: 'Learning and Growth',            questions: [65,66,67,68,69,78,85,86,87,103] },
  vision:        { nameHe: 'חזון אסטרטגי',           nameEn: 'Strategic Vision',               questions: [72,73,74,75,80,84,101,102] },
  tech:          { nameHe: 'מיומנות טכנולוגית',      nameEn: 'Technological Proficiency',      questions: [82,83,94,95,106] },
  networking:    { nameHe: 'נטוורקינג',              nameEn: 'Networking',                     questions: [81,105,107] },
  balance:       { nameHe: 'איזון ורווחה',           nameEn: 'Balance and Wellbeing',          questions: [70,71,88,89,90,91,92] },
  change:        { nameHe: 'ניהול שינוי',            nameEn: 'Change Management',              questions: [96,97,98,99,100,104] }
};

// McKinsey Benchmark Tags — Section 3
const MCKINSEY_BENCHMARKS = {
  B1: { tag: 'B1', stat: '38%', desc: 'עובדים עם חוסן גבוה מצליחים לשמור על תפוקה גבוהה גם במשברים, לפי מקינזי.' },
  B2: { tag: 'B2', stat: '40%', desc: 'ארגונים שמשקיעים בגמישות ארגונית מדווחים על עלייה של 40% בחדשנות, לפי מקינזי.' },
  B3: { tag: 'B3', stat: '50%', desc: 'מנהלים עם כישורי מנהיגות גבוהים מגדילים את ביצועי הצוות ב-50%, לפי מקינזי.' },
  B4: { tag: 'B4', stat: '25%', desc: 'נטוורקינג אפקטיבי מגדיל הזדמנויות קריירה ב-25%, לפי מקינזי.' },
  B5: { tag: 'B5', stat: '30%', desc: 'עובדים עם איזון עבודה-חיים טוב מדווחים על 30% פחות שחיקה, לפי מקינזי.' },
  B6: { tag: 'B6', stat: '41%', desc: 'תכנון אסטרטגי אפקטיבי קשור לעלייה של 41% בהשגת יעדים, לפי מקינזי.' },
  B7: { tag: 'B7', stat: '38%', desc: 'ארגונים עם חזון ברור מגיעים ל-38% יותר הצלחות בהשגת יעדים ארוכי טווח, לפי מקינזי.' }
};

// McKinsey Tag mapping per dimension (Section 3A)
const DIMENSION_MCKINSEY_MAP = {
  resilience:    ['B1'],
  flexibility:   ['B2'],
  leadership:    ['B3'],
  communication: ['B3'],
  planning:      ['B6'],
  learning:      ['B2'],
  vision:        ['B7'],
  tech:          ['B2'],
  networking:    ['B4', 'B7'],
  balance:       ['B5'],
  change:        ['B2', 'B6']
};

function getPercentileContext(score) {
  if (score >= 85) return { range: 'Top 10%', label: 'מצטיין', severity: 'outstanding', emoji: '🟢' };
  if (score >= 70) return { range: 'Top 30%', label: 'חזק', severity: 'strong', emoji: '🔵' };
  if (score >= 60) return { range: 'Moderate 50%', label: 'ממוצע', severity: 'moderate', emoji: '🟡' };
  if (score >= 40) return { range: 'Bottom 30%', label: 'מוגבל', severity: 'limited', emoji: '🟠' };
  return { range: 'Bottom 10%', label: 'פער קריטי', severity: 'critical', emoji: '🔴' };
}

function getAgeCategory(age) {
  if (age >= 18 && age <= 19) return { category: 'young_adult', label: 'צעיר/ה בתחילת הדרך', tone: 'פוטנציאל, סקרנות ולמידה' };
  if (age >= 20 && age <= 27) return { category: 'junior', label: 'מקצוען/ית בתחילת קריירה', tone: 'בניית בסיס ופוטנציאל' };
  if (age >= 28 && age <= 35) return { category: 'mid', label: 'מקצוען/ית באמצע הדרך', tone: 'יתרון תחרותי וקידום' };
  if (age >= 36 && age <= 45) return { category: 'senior', label: 'מנהל/ת ומקצוען/ית בכיר/ה', tone: 'מיצוב אסטרטגי והשפעה' };
  if (age >= 46 && age <= 60) return { category: 'executive', label: 'מנהל/ת בכיר/ה ומומחה/ית', tone: 'עסקאות, דירקטוריונים ומורשת' };
  return { category: 'postcareer', label: 'מקצוען/ית ומנטור/ית בכיר/ה', tone: 'העברת חוכמה ורלוונטיות' };
}

// Section 6A: Archetype openers — (age % 4)
const ARCHETYPE_OPENERS = {
  continuousLearner: [
    'הידע שלך הוא הנשק החזק ביותר שלך — וגם האתגר הגדול ביותר שלך.',
    'בעולם שבו רוב האנשים מפסיקים ללמוד, אתה/את ממשיך/ה — זה יתרון אמיתי.',
    'אתה/את משקיע/ה בידע כשאחרים משקיעים בקשרים. שניהם נדרשים.',
    'הפרופיל שלך מעיד על עומק מקצועי גבוה לצד רשת תמיכה שדורשת חיזוק.'
  ],
  strategicNetworker: [
    'הקשרים שלך הם הנכס שלך — תכנון יהפוך אותם לתוצאות.',
    'אתה/את יודע/ת לפתוח דלתות. הצעד הבא הוא לדעת מה לעשות כשאתה/את בפנים.',
    'רשת חזקה ללא מבנה — זו הגדרה של פוטנציאל שלא מומש.',
    'אנשים אוהבים לעבוד איתך. עכשיו צריך לבנות את המסגרת שתנצל את זה.'
  ],
  executionMachine: [
    'אתה/את מביא/ה דברים לקו הסיום. זה נדיר — ויש לו מחיר שכדאי להכיר.',
    'התוכניות שלך עובדות. גמישות תגרום להן לעבוד גם כשהתוכנית משתנה.',
    'ביצוע ללא גמישות הוא מנוע עוצמתי על מסלול ישר — מה קורה בפניות?',
    'הדיוק שלך הוא חוזק אמיתי. הצעד הבא: ללמוד מתי לשנות כיוון.'
  ],
  adaptiveInnovator: [
    'אתה/את רואה הזדמנויות שאחרים מפספסים — חוסן יאפשר לך לממש אותן.',
    'יצירתיות גבוהה עם חוסן נמוך: רעיונות מצוינים שזקוקים לשדרה חזקה יותר.',
    'אתה/את מסתגל/ת מהר — עכשיו תרגל/י לעמוד על הקרקע כשהדברים לא מסתגלים בחזרה.',
    'הנטייה שלך לחדשנות היא יתרון תחרותי. חיזוק החוסן יכפיל אותו.'
  ],
  resilientLeader: [
    'אתה/את עומד/ת איתן כשאחרים נופלים. חזון יגיד לך היכן לעמוד.',
    'חוסן ללא כיוון הוא כוח שמחכה למשימה. הגיע הזמן להגדיר אותה.',
    'הסביבה יכולה לסמוך עליך — עכשיו שהם יידעו לאן אתה/את הולך/ת.',
    'האמינות שלך היא יסוד מצוין. חזון ברור יהפוך אותה להשפעה אמיתית.'
  ],
  visionaryCommunicator: [
    'אתה/את רואה את העתיד בבהירות. תכנון יהפוך אותו למציאות.',
    'חזון חזק ללא תכנון הוא השראה ללא מנוע. בוא/י נתקן את זה.',
    'אתה/את מדבר/ת על מה שיהיה — עכשיו בנה/י את הגשר למה שישנו.',
    'הרעיונות שלך מהדהדים. מבנה יבטיח שהם גם יניבו תוצאות.'
  ]
};

function calculateDimensionScore(responses, questions) {
  let sum = 0;
  let count = 0;
  for (const qNum of questions) {
    let value = responses[`q${qNum}`];
    if (!value) continue;
    if (REVERSE_QUESTIONS.includes(qNum)) value = 8 - value;
    sum += value;
    count++;
  }
  if (count === 0) return 0;
  const average = sum / count;
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
  const sorted = Object.entries(dimensions).sort((a, b) => b[1].score - a[1].score);
  const topKey = sorted[0][0];
  const bottomKey = sorted[sorted.length - 1][0];

  if (topKey === 'learning' && bottomKey === 'networking') return { key: 'continuousLearner', name: 'הלומד המתמיד', strength: 'עומק מקצועי', gap: 'בידוד מקצועי' };
  if (topKey === 'networking' && bottomKey === 'planning') return { key: 'strategicNetworker', name: 'הרשתות האסטרטגי', strength: 'בניית קשרים', gap: 'חוסר מבנה אסטרטגי' };
  if (topKey === 'planning' && bottomKey === 'flexibility') return { key: 'executionMachine', name: 'מכונת הביצוע', strength: 'מצוינות תהליכית', gap: 'קשיחות בשינוי' };
  if (topKey === 'flexibility' && bottomKey === 'resilience') return { key: 'adaptiveInnovator', name: 'החדשן הגמיש', strength: 'ניווט בשינוי', gap: 'שחיקה מהירה' };
  if (topKey === 'resilience' && bottomKey === 'vision') return { key: 'resilientLeader', name: 'המנהיג העמיד', strength: 'ניהול משברים', gap: 'חוסר כיוון ארוך טווח' };
  if (topKey === 'vision' && bottomKey === 'planning') return { key: 'visionaryCommunicator', name: 'המתקשר החזונאי', strength: 'השראת כיוון', gap: 'חוסר תוכנית ביצוע' };

  return { key: 'continuousLearner', name: 'הפרופיל המאוזן', strength: 'גמישות כללית', gap: 'חוסר התמחות ברורה' };
}

function getTopAndBottom(dimensions) {
  const sorted = Object.entries(dimensions).map(([key, val]) => ({ key, ...val })).sort((a, b) => b.score - a.score);
  return { top3: sorted.slice(0, 3), bottom2: sorted.slice(-2).reverse() };
}

function buildAsciiBar(score) {
  const filled = Math.round(score / 5);
  const empty = 20 - filled;
  return '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, empty));
}

function buildClaudePrompt(userData, dimensions, archetype, ageCategory, topBottom) {
  const { top3, bottom2 } = topBottom;
  const name = userData.personal_info.full_name;
  const age = userData.personal_info.age;
  const genderRaw = userData.personal_info.gender;
  const gender = genderRaw === 'female' ? 'נקבה' : 'זכר';
  const experience = userData.personal_info.years_of_experience || 'לא צוין';
  const status = userData.personal_info.current_professional_status || 'לא צוין';
  const occupation = userData.personal_info.occupation_field || '';
  const interests = (userData.personal_info.interest_areas || []).join(', ') || 'לא צוין';
  const targetPosition = userData.personal_info.target_position || 'לא צוין';
  const today = new Date().toLocaleDateString('he-IL');

  // Deterministic variability: age % 4
  const versionIndex = age % 4;
  const archetypeOpener = (ARCHETYPE_OPENERS[archetype.key] || ARCHETYPE_OPENERS['continuousLearner'])[versionIndex];

  // All dimensions table
  const allDimsSorted = Object.values(dimensions).sort((a, b) => b.score - a.score);
  const allDimsTable = allDimsSorted
    .map(d => `${d.name}: ${d.score} (${d.percentile.range} – ${d.percentile.label}) ${d.percentile.emoji}`)
    .join('\n');

  // Spider chart ASCII
  const spiderChart = `╔══════════════════════════════════════════════════════╗
║         V107 SPIDER CHART — ${name}
╠══════════════════════════════════════════════════════╣
║ ממד                        0    20   40   60   80  100
║ ──────────────────────────────────────────────────────
${allDimsSorted.map((d, i) => {
  const bar = buildAsciiBar(d.score);
  const indicator = i < 3 ? ' ▲ TOP' : i >= allDimsSorted.length - 2 ? ' ▼ BOTTOM' : '';
  return `║ ${d.name.padEnd(22)} [${bar}] ${d.score}${indicator}`;
}).join('\n')}
║ ──────────────────────────────────────────────────────
║ ▲ = TOP 3 (חוזקות) │ ▼ = BOTTOM 2 (פיתוח)
╚══════════════════════════════════════════════════════╝`;

  // McKinsey tags for bottom dimensions
  const bottom2McKinseyTags = bottom2.map(d => {
    const tags = DIMENSION_MCKINSEY_MAP[d.key] || [];
    const mckinsey = tags.map(tag => MCKINSEY_BENCHMARKS[tag]).filter(Boolean);
    return { dim: d, mckinsey };
  });

  // McKinsey data block
  const mckinseyDataBlock = Object.entries(MCKINSEY_BENCHMARKS)
    .map(([tag, data]) => `(${tag}): ${data.desc} [נתון: ${data.stat}]`)
    .join('\n');

  const occupationLine = occupation ? `תחום עיסוק: ${occupation}` : `ניתוח מבוסס תחומי עניין בלבד (בהיעדר תפקיד מוגדר, הניתוח מבוסס על תחומי העניין שסיפקת).`;

  const genderInstruction = genderRaw === 'female'
    ? `⚠️ הוראת מגדר — חובה מוחלטת: הנבדקת היא אישה. כתוב את כל הדוח בלשון נקבה בלבד ללא יוצא מן הכלל.
- השתמש תמיד ב"את" ולא "אתה"
- ניסוחים לדוגמה: "את מביאה", "את עשית", "הצלחת", "חזקה", "מומחית", "מנהלת"
- אסור לכתוב "אתה/את" — בחר "את" בלבד
- בדוק כל משפט: האם כתוב בלשון נקבה?`
    : `⚠️ הוראת מגדר — חובה מוחלטת: הנבדק הוא גבר. כתוב את כל הדוח בלשון זכר בלבד ללא יוצא מן הכלל.
- השתמש תמיד ב"אתה" ולא "את"
- אסור לכתוב "אתה/את" — בחר "אתה" בלבד`;

  return `אתה מנתח פסיכומטרי מקצועי המפיק דוח פיתוח קריירה מובנה בן 5 עמודים.

🚨 דרישה קריטית: הדוח הסופי חייב להיות 100% בשפה העברית. כל הטקסטים, הכותרות, ה-Viral Hook, ה-Risk Flags, תיאורי הארכיטיפ, תיאורי הגרפים וה-Disclaimer חייבים להיות כתובים בעברית מקצועית וטבעית. אסור לכתוב את הדוח באנגלית. 🚨

${genderInstruction}

══════════════════════════════════════
📌 נתוני הנבדק/ת
══════════════════════════════════════
שם: ${name}
גיל: ${age} | ${ageCategory.label} | טון: ${ageCategory.tone}
מגדר: ${gender}
שנות ניסיון: ${experience}
סטטוס מקצועי: ${status}
${occupationLine}
תחומי עניין: ${interests}
תפקיד יעד: ${targetPosition}
תאריך: ${today}

══════════════════════════════════════
📊 ציוני 11 הממדים (מחושבים)
══════════════════════════════════════
${allDimsTable}

ממדים חזקים — TOP 3:
1. ${top3[0].name}: ${top3[0].score} (${top3[0].percentile.range})
2. ${top3[1].name}: ${top3[1].score} (${top3[1].percentile.range})
3. ${top3[2].name}: ${top3[2].score} (${top3[2].percentile.range})

ממדים לפיתוח — BOTTOM 2:
1. ${bottom2[0].name}: ${bottom2[0].score} (${bottom2[0].percentile.range})
2. ${bottom2[1] ? bottom2[1].name + ': ' + bottom2[1].score + ' (' + bottom2[1].percentile.range + ')' : ''}

══════════════════════════════════════
🧬 ארכיטיפ
══════════════════════════════════════
ארכיטיפ: ${archetype.name}
חוזקה: ${archetype.strength} | פער: ${archetype.gap}
פתיחת ארכיטיפ (גרסה ${versionIndex} לפי age % 4): "${archetypeOpener}"

══════════════════════════════════════
📚 נתוני McKinsey מאושרים — השתמש רק בנתונים אלה
══════════════════════════════════════
${mckinseyDataBlock}

כלל זהב: אם אין נתון McKinsey מתאים — כתוב תיאור טקסטואלי בלבד. אל תמציא סטטיסטיקה חלופית.
אחוזים מאושרים ל-Risk Flags: 25%, 30%, 38%, 40%, 41%, 50% בלבד.

══════════════════════════════════════
🗺️ Spider Chart מוכן להדסקה (הכנס כמות ב-עמוד 3)
══════════════════════════════════════
${spiderChart}

══════════════════════════════════════
📋 הוראות כתיבה — V9 FINAL
══════════════════════════════════════

❌ אסור לחלוטין:
- "פוטנציאל אינסופי" / "הצלחה מובטחת" / "שינוי מהפכני"
- כל סטטיסטיקה שאינה מנתוני McKinsey שלעיל
- "ממסד נתונים של V107 של X משתמשים" — לא קיים
- Risk Flag ללא Tag מאומת
- שפה זהה לשתי קטגוריות גיל שונות

✅ דפוסים חובה:
- "ציון [X] = [Band]" (תמיד)
- "לפי מחקר McKinsey ([Bx]): [נתון]."
- "[ממד_גבוה] + [ממד_נמוך] = [שם_דפוס]"
- "הסיבה הפסיכולוגית: [הסבר]"
- "⚠️ Risk Flag (McKinsey [Bx]): ..."
- שם ${name} — מינימום 5 פעמים
- גיל ${age} — מינימום 5 פעמים
- תחומי עניין — מינימום 5 פעמים
- שם הארכיטיפ — לפחות פעם אחת בכל עמוד

══════════════════════════════════════
📄 מבנה חובה — 5 עמודים בדיוק
══════════════════════════════════════

**עמוד 1 — תקציר מנהלים**

כותרת: ${name} | ${today} | גיל ${age} | ${occupation || interests}

⚡ Viral Hook (שורה ראשונה, לפני כל תוכן — מקסימום 20 מילה, עובדתי, בעברית):
פורמט: "${name}, הפרופיל שלך משלב [TOP_DIM] גבוה עם [BOTTOM_DIM] — דפוס שמופיע ב-[Band של TOP_DIM] בלבד של אנשים בגילך לפי נתוני McKinsey."
⚠️ אסור להשתמש ב"5,200 משתמשים" — אין מסד נתונים כזה. השתמש בBand בלבד.

לאחר מכן:
1. המנוע שלך (TOP 3) — ציון + Band + ביטוי יומיומי קונקרטי + קשר לתחום/עניין
2. המחיר שאתה/את משלם/ת (BOTTOM 2) — ציון + Band + השלכה קריירית + נתון McKinsey עם Tag אם קיים
3. התובנה המרכזית — פרדוקס/מתח, משפט אחד, בטון גיל ${age}
4. הפרופיל שלך (${archetype.name}) — 2-3 משפטים
5. ROI אישי — 1-2 נתוני McKinsey עם Tags, קשור לציונים וטון גיל

ARCHETYPE CARD בסוף עמוד 1:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 V107 PROFILE CARD
${name} | גיל ${age} | ${today}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
פרופיל: ${archetype.name}
חוזק מרכזי: [TOP_DIM] — [SCORE] ([Band])
אזור פיתוח: [BOTTOM_DIM] — [SCORE] ([Band])
━━━━━━━━━━━━━━━━━━━━━━━━━━━
"[5 מילים המגדירות את הפרופיל — ייחודיות ואישיות]"
━━━━━━━━━━━━━━━━━━━━━━━━━━━

**[עמוד 1 מתוך 5]**

---

**עמוד 2 — ניתוח מעמיק**

פתיחה (חובה): "${archetypeOpener}"

Part A — המנוע (TOP 3 ממדים):
לכל ממד: ציון + Band + דוגמה התנהגותית יומיומית קונקרטית + קשר לתחום/עניין

דפוסי אינטראקציה (שני דפוסים חובה):
1. [TOP_DIM_1] גבוה + [TOP_DIM_2] גבוה = [שם דפוס]: [משמעות קצרה]
2. [TOP_DIM_1] גבוה + [BOTTOM_DIM_1] נמוך = [שם דפוס]: [משמעות קצרה]

Part B — המחיר (BOTTOM 2 ממדים):
לכל ממד — חמישה אלמנטים חובה:
1. ציון + Band
2. הסיבה הפסיכולוגית (למה): למה הדפוס הזה נוצר — ללא שיפוטיות
3. מה קורה אם לא מטפלים: השלכה ספציפית בהמשך הקריירה
4. נתון McKinsey (Tag מ-Section 3A) אם קיים — אחרת טקסט בלבד
5. פעולה ראשונה קונקרטית — מה לעשות השבוע

⚠️ Risk Flag אחרי כל BOTTOM ממד (אם קיים Tag רלוונטי):
פורמט: "⚠️ Risk Flag (McKinsey [Bx]): ממד זה הוא חסם מוכח בתפקידי [תחום/עניין] — עשוי להשפיע על שימור/קידום ב-[X]% לפי נתוני McKinsey."
השתמש רק ב: 25%, 30%, 38%, 40%, 41%, 50%

Part C — הפרדוקס המקצועי: 3 משפטים. המתח בין חוזקות לחסמים.

**[עמוד 2 מתוך 5]**

---

**עמוד 3 — המפה המלאה**

Spider Chart (הכנס בדיוק את הגרף שלעיל — copy-paste ready):
${spiderChart}

טבלת יכולות (11 שורות):
| # | ממד | תיאור בשפת חיי יום-יום | ציון | Band | פרשנות + קשר לארכיטיפ |

טבלת בר (Markdown, ממוין HIGH→LOW, copy-paste ready):
| # | ממד | ציון | Band | בר | סטטוס |
|---|-----|------|------|----|-------|
[11 שורות עם █ characters — 1 █ = ~5 נקודות, ועם אמוג'י לפי הסקאלה]

**[עמוד 3 מתוך 5]**

---

**עמוד 4 — מסלולי קריירה**

4 תפקידים ספציפיים בהתאם ל${occupation ? 'תחום: ' + occupation : 'תחומי עניין: ' + interests} ותפקיד יעד: ${targetPosition}

לכל תפקיד — ארבעה אלמנטים חובה:
1. למה מתאים — קשר ספציפי ל-TOP ממדים
2. סיפור הצלחה — דוגמה אילוסטרטיבית (2-3 משפטים). ציין: "דוגמה אילוסטרטיבית."
3. מה לשפר — פעולה ספציפית אחת קשורה ל-BOTTOM ממד
4. ROI צפוי — נתון McKinsey עם Tag אם רלוונטי

**[עמוד 4 מתוך 5]**

---

**עמוד 5 — V107 BOOSTER + סיכום**

המצב (2-3 משפטים): סיכום מצב הפרופיל בשפה ישירה, בטון גיל ${age}.

הפתרון — 3 משימות מעשיות ממוקדות ב-BOTTOM 2 ממדים:
פורמט:
משימה [מספר]: [פעולה ספציפית]
זמן מומלץ: [X ימים/שבועות]
מדד הצלחה: [כיצד תדע/י שהצלחת — מדיד]

סיום: משפט סיכום אישי + עידוד. בטון גיל ${age}.

הבהרה משפטית (חובה, מילה במילה בעברית):
"הניתוח מבוסס על מתודולוגיות ובנצ'מרקים גלובליים של McKinsey & Company בנושא הון אנושי. הדוח משמש ככלי אבחוני בלבד ואינו מחליף ייעוץ מקצועי, עסקי או פסיכולוגי מחייב. כל הנתונים האישיים מטופלים בסודיות מלאה."

**[עמוד 5 מתוך 5]**

══════════════════════════════════════
✅ QA CHECKLIST V9 — 25 סעיפים (בצע לפני הגשה)
══════════════════════════════════════
א. ולידציה וחישוב: 107 תשובות | היפוכים נכונים | 11 ציונים | Bands | ארכיטיפ
ב. McKinsey: כל נתון עם Tag | אין סטטיסטיקה מחוץ ל-Section 3 | Risk Flag עם Tag | אחוזים מאושרים בלבד | Disclaimer מילה במילה
ג. התאמה אישית: שם 5 פעמים | גיל 5 פעמים | עניין 5 פעמים | טון גיל | גרסה age%4 | ארכיטיפ בנרטיב | ארכיטיפ בכל עמוד
ד. שלמות תוכן: Viral Hook | WHY לBOTTOM 2 | Interaction Patterns (TOP+TOP, TOP+BOTTOM) | Success Stories (אילוסטרטיבי) | 3 משימות Booster עם מדד
ה. מבנה: בדיוק 5 עמודים | Spider Chart ASCII | Bar Chart Markdown | טבלת 11 יכולות עם עמודת פרשנות+ארכיטיפ
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

    const prompt = buildClaudePrompt(response, dimensions, archetype, ageCategory, topBottom);

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20251001',
      max_tokens: 10000,
      messages: [{ role: 'user', content: prompt }],
      system: 'אתה מנתח פסיכומטרי מקצועי המפיק דוחות פיתוח קריירה. תמיד כותב בעברית בלבד. הדוחות שלך מקצועיים, אישיים, מעמיקים, ומבוססי נתונים אמיתיים בלבד. אינך מחדד או ממציא סטטיסטיקות.'
    });

    const fullReport = claudeResponse.content[0].text;

    const reportId = `V107-V9-${(response.language || 'HE').toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const domainScores = {};
    for (const [key, dim] of Object.entries(dimensions)) {
      domainScores[key] = { score: dim.score, percentile: dim.percentile.range };
    }

    const reportData = {
      questionnaire_response_id: responseId,
      user_name: response.personal_info.full_name,
      user_email: response.personal_info.email,
      report_id: reportId,
      purchased: false,
      report_markdown: fullReport,
      archetype: archetype.name,
      recommended_booster_track: topBottom.bottom2[0]?.key,
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
      model_used: 'claude-sonnet-4-5-20251001',
      message: 'V9 PRO report generated successfully'
    });

  } catch (error) {
    console.error('Error generating V9 report:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});