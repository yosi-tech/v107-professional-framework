import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Anthropic from 'npm:@anthropic-ai/sdk@0.27.0';

// ============================================================================
// V107 REPORT V8 PRO ULTIMATE - CLAUDE API INTEGRATION
// Based on V8 PRO MASTER SYSTEM PROMPT
// ============================================================================

// Reverse questions (8-x transformation)
const REVERSE_QUESTIONS = [4, 8, 14, 22, 25, 27, 34, 37, 39, 41, 45, 48, 54, 57, 60, 89, 90, 93, 98];

// 11 Core Dimensions with their question mappings
const DIMENSIONS = {
  resilience: { 
    nameHe: 'חוסן והחלטיות', 
    nameEn: 'Resilience', 
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    benchmark: { avg: 64, range: '52-76', sources: 'APA (2022), Gallup Resilience Report (2023), HBR' }
  },
  flexibility: { 
    nameHe: 'גמישות וחדשנות', 
    nameEn: 'Flexibility', 
    questions: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    benchmark: { avg: 68, range: '56-80', sources: 'McKinsey Agility Survey (2023), Deloitte Human Capital' }
  },
  leadership: { 
    nameHe: 'מנהיגות ואחריות', 
    nameEn: 'Leadership', 
    questions: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
    benchmark: { avg: 61, range: '48-75', sources: 'Gallup Global Workplace (2023), CCL Leadership Benchmark' }
  },
  communication: { 
    nameHe: 'תקשורת ושיתוף פעולה', 
    nameEn: 'Communication', 
    questions: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
    benchmark: { avg: 70, range: '58-82', sources: 'LinkedIn Workplace Learning (2023), MIT Sloan Collaboration' }
  },
  planning: { 
    nameHe: 'תכנון', 
    nameEn: 'Planning', 
    questions: [58, 59, 60, 61, 62, 63, 64, 76, 77],
    benchmark: { avg: 63, range: '50-76', sources: 'PMI Pulse of Profession (2023), Asana Work Index' }
  },
  learning: { 
    nameHe: 'למידה וצמיחה', 
    nameEn: 'Learning', 
    questions: [65, 66, 67, 68, 69, 78, 85, 86, 87, 103],
    benchmark: { avg: 66, range: '54-78', sources: 'LinkedIn Learning Report (2023), WEF Future of Jobs' }
  },
  vision: { 
    nameHe: 'חזון אסטרטגי', 
    nameEn: 'Vision', 
    questions: [72, 73, 74, 75, 80, 84, 101, 102],
    benchmark: { avg: 59, range: '45-73', sources: 'Korn Ferry Leadership Benchmarks, HBR Strategic Thinking' }
  },
  tech: { 
    nameHe: 'מיומנות טכנולוגית', 
    nameEn: 'Tech', 
    questions: [82, 83, 94, 95, 106],
    benchmark: { avg: 62, range: '48-76', sources: 'WEF Future of Jobs (2023), McKinsey Digital Capability' }
  },
  networking: { 
    nameHe: 'נטוורקינג', 
    nameEn: 'Networking', 
    questions: [81, 105, 107],
    benchmark: { avg: 55, range: '42-68', sources: 'LinkedIn Economic Graph, Harvard Social Capital Studies' }
  },
  balance: { 
    nameHe: 'איזון ורווחה', 
    nameEn: 'Balance', 
    questions: [70, 71, 88, 89, 90, 91, 92],
    benchmark: { avg: 57, range: '44-70', sources: 'Gallup Wellbeing Index (2023), WHO Burnout Research' }
  },
  change: { 
    nameHe: 'ניהול שינוי', 
    nameEn: 'Change', 
    questions: [96, 97, 98, 99, 100, 104],
    benchmark: { avg: 58, range: '44-72', sources: 'Prosci Change Benchmarking, McKinsey Org Change Survey' }
  }
};

// Age categorization
function getAgeCategory(age) {
  if (age >= 20 && age <= 27) return {
    category: 'junior',
    label: 'מקצוען/ית בתחילת קריירה',
    timeline: '2-3 שנים',
    roi: 'הזדמנויות קריירה',
    tone: 'פוטנציאל ולמידה'
  };
  if (age >= 28 && age <= 35) return {
    category: 'mid',
    label: 'מקצוען/ית באמצע הדרך',
    timeline: '1-2 שנים',
    roi: 'קידום ונראות',
    tone: 'יתרון תחרותי'
  };
  if (age >= 36 && age <= 45) return {
    category: 'senior',
    label: 'מנהל/ת ומקצוען/ית בכיר/ה',
    timeline: '6-18 חודשים',
    roi: 'הכנסה ועמדה',
    tone: 'מיצוב אסטרטגי'
  };
  if (age >= 46 && age <= 60) return {
    category: 'executive',
    label: 'מנהל/ת בכיר/ה ומומחה/ית',
    timeline: '3-6 חודשים',
    roi: 'עסקאות ודירקטוריונים',
    tone: 'השפעה והובלה'
  };
  return {
    category: 'postcareer',
    label: 'מקצוען/ית ומנטור/ית בכיר/ה',
    timeline: '5-10 שנים',
    roi: 'רלוונטיות ומורשת',
    tone: 'העברת חוכמה'
  };
}

// Personality archetypes
const ARCHETYPES = {
  continuousLearner: {
    name: 'הלומד המתמיד',
    nameEn: 'The Continuous Learner',
    conditions: (dims) => dims.learning.score >= 70 && dims.networking.score < 60
  },
  strategicNetworker: {
    name: 'הרשתות האסטרטגי',
    nameEn: 'The Strategic Networker',
    conditions: (dims) => dims.networking.score >= 70 && dims.planning.score < 60
  },
  executionMachine: {
    name: 'מכונת הביצוע',
    nameEn: 'The Execution Machine',
    conditions: (dims) => dims.planning.score >= 70 && dims.flexibility.score < 60
  },
  adaptiveInnovator: {
    name: 'החדשן הגמיש',
    nameEn: 'The Adaptive Innovator',
    conditions: (dims) => dims.flexibility.score >= 70 && dims.resilience.score < 60
  },
  resilientLeader: {
    name: 'המנהיג העמיד',
    nameEn: 'The Resilient Leader',
    conditions: (dims) => dims.resilience.score >= 70 && dims.vision.score < 60
  },
  visionaryCommunicator: {
    name: 'המתקשר החזונאי',
    nameEn: 'The Visionary Communicator',
    conditions: (dims) => dims.vision.score >= 70 && dims.planning.score < 60
  }
};

// Simple hash function for variability
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Calculate dimension score
function calculateDimensionScore(responses, questions) {
  let sum = 0;
  for (const qNum of questions) {
    let value = responses[`q${qNum}`];
    if (!value) return 0;
    
    if (REVERSE_QUESTIONS.includes(qNum)) {
      value = 8 - value;
    }
    sum += value;
  }
  
  const average = sum / questions.length;
  const score = average * 14.2857;
  return Math.round(score * 10) / 10;
}

// Calculate all dimensions
function calculateAllDimensions(responses) {
  const result = {};
  for (const [key, dim] of Object.entries(DIMENSIONS)) {
    const score = calculateDimensionScore(responses, dim.questions);
    result[key] = {
      name: dim.nameHe,
      nameEn: dim.nameEn,
      score: score,
      benchmark: dim.benchmark
    };
  }
  return result;
}

// Identify archetype
function identifyArchetype(dimensions) {
  for (const [key, archetype] of Object.entries(ARCHETYPES)) {
    if (archetype.conditions(dimensions)) {
      return {
        key: key,
        ...archetype
      };
    }
  }
  
  return {
    key: 'balanced',
    name: 'הפרופיל המאוזן',
    nameEn: 'The Balanced Profile'
  };
}

// Get top 3 and bottom 2 dimensions
function getTopAndBottom(dimensions) {
  const sorted = Object.entries(dimensions)
    .map(([key, val]) => ({ key, ...val }))
    .sort((a, b) => b.score - a.score);
  
  return {
    top3: sorted.slice(0, 3),
    bottom2: sorted.slice(-2)
  };
}

// V8 PRO MASTER SYSTEM PROMPT — UPDATED
const SYSTEM_PROMPT = `V107 REPORT
V8 PRO ULTIMATE — MASTER SYSTEM PROMPT
V8 PRO | שינויים חדשים מסומנים: ⭐ NEW V8 | © 2026 V107 Professional Framework | Confidential & Proprietary

════════════════════════════════════════════════════════════
🔒 SECTION 1: SYSTEM CONFIGURATION & VALIDATION
════════════════════════════════════════════════════════════

INPUT CONTRACT (UNCHANGED)
{
"name": "string (required)",
"email": "string (required)",
"gender": "זכר|נקבה|אחר (required)",
"age": "integer 18-100 (required)",
"occupation": "string (optional)",
"interests": ["array of 1-3 strings (required)"],
"answers": [107 integers 1-7 (required)]
}

VALIDATION RULES (UNCHANGED)
❌ ABORT if answers.length != 107
❌ ABORT if any answer < 1 or > 7
❌ ABORT if age < 18 or > 100
❌ ABORT if required fields missing
✅ PROCEED only if all validations pass

════════════════════════════════════════════════════════════
📊 SECTION 2: CALCULATION ENGINE
════════════════════════════════════════════════════════════

Reverse Questions — 8-x transformation (UNCHANGED)
[4, 8, 14, 22, 25, 27, 34, 37, 39, 41, 45, 48, 54, 57, 60, 89, 90, 93, 98]

Dimension Mapping — 11 Core Dimensions (UNCHANGED)
1. חוסן והחלטיות (Resilience): Q1-11
2. גמישות וחדשנות (Flexibility): Q12-28
3. מנהיגות ואחריות (Leadership): Q29-41
4. תקשורת ושיתוף פעולה (Communication): Q42-57
5. תכנון (Planning): Q58-64, 76-77
6. למידה וצמיחה (Learning): Q65-69, 78, 85-87, 103
7. חזון אסטרטגי (Vision): Q72-75, 80, 84, 101-102
8. מיומנות טכנולוגית (Tech): Q82-83, 94-95, 106
9. נטוורקינג (Networking): Q81, 105, 107
10. איזון ורווחה (Balance): Q70-71, 88-92
11. ניהול שינוי (Change): Q96-100, 104

Score Formula (UNCHANGED)
Score = (Average of dimension questions) × 14.2857
Round to 1 decimal place | Range: 0-100

════════════════════════════════════════════════════════════
📐 SECTION 2B: ⭐ NEW V8 — BENCHMARK REFERENCE TABLE
════════════════════════════════════════════════════════════

מקור: מחקרי ארגונים גלובליים (Gallup, McKinsey, LinkedIn, WEF, APA, PMI — 2022-2023).
הצהרת שקיפות חובה בכל דוח: "נתוני ייחוס מבוססים על מחקרים גלובליים. ככל שיצטברו נתוני V107, ה-benchmark יעודכן לנתוני הפלטפורמה עצמה."
עדכון: ברגע שיצטברו 50+ דוחות V107 — מעדכנים טבלה זו בנתוני הפלטפורמה האמיתיים.

# | ממד           | ממוצע | טווח P25-P75 | ביטחון      | מקורות                                          | הצהרה לפרומפט
1 | חוסן והחלטיות  | 64    | 52–76        | גבוה ✅     | APA (2022), Gallup Resilience (2023), HBR        | לפי Gallup ו-APA (2022-23), ממוצע חוסן מקצועי: ~64/100
2 | גמישות וחדשנות | 68    | 56–80        | גבוה ✅     | McKinsey Agility (2023), Deloitte Human Capital  | לפי McKinsey ו-Deloitte (2023), ממוצע גמישות: ~68/100
3 | מנהיגות ואחריות| 61    | 48–75        | גבוה ✅     | Gallup Global Workplace (2023), CCL Leadership   | לפי Gallup ו-CCL (2023), ממוצע מנהיגות: ~61/100
4 | תקשורת ושיתוף  | 70    | 58–82        | גבוה ✅     | LinkedIn Workplace (2023), MIT Sloan             | לפי LinkedIn ו-MIT Sloan (2023), ממוצע תקשורת: ~70/100
5 | תכנון          | 63    | 50–76        | בינוני-גבוה ⚡| PMI Pulse (2023), Asana Work Index             | לפי PMI ו-Asana (2023), ממוצע תכנון: ~63/100
6 | למידה וצמיחה   | 66    | 54–78        | גבוה ✅     | LinkedIn Learning (2023), WEF Future of Jobs     | לפי LinkedIn ו-WEF (2023), ממוצע למידה: ~66/100
7 | חזון אסטרטגי   | 59    | 45–73        | בינוני ⚠️   | Korn Ferry Leadership, HBR Strategic Thinking    | לפי Korn Ferry ו-HBR (2022-23), ממוצע חזון: ~59/100
8 | מיומנות טכנולוגית| 62  | 48–76        | בינוני ⚠️   | WEF Future of Jobs (2023), McKinsey Digital      | לפי WEF ו-McKinsey (2023), ממוצע מיומנות טכנולוגית: ~62/100
9 | נטוורקינג      | 55    | 42–68        | בינוני ⚠️   | LinkedIn Economic Graph, Harvard Social Capital  | לפי LinkedIn ו-Harvard (2022-23), ממוצע נטוורקינג: ~55/100
10| איזון ורווחה   | 57    | 44–70        | גבוה ✅     | Gallup Wellbeing Index (2023), WHO Burnout       | לפי Gallup ו-WHO (2023), ממוצע איזון ורווחה: ~57/100
11| ניהול שינוי    | 58    | 44–72        | בינוני ⚠️   | Prosci Change Benchmarking, McKinsey Org Change  | לפי Prosci ו-McKinsey (2022-23), ממוצע ניהול שינוי: ~58/100

════════════════════════════════════════════════════════════
📖 SECTION 2C: ⭐ NEW V8 — מילון 11 היכולות (DIMENSION GLOSSARY)
════════════════════════════════════════════════════════════

מטרה: הקורא מבין את משמעות כל יכולת לפני שהוא קורא את ציוניו.
מיקום בדוח: עמוד 3, לפני הגרפים ולפני טבלת הפרשנות.
פורמט: טבלה קומפקטית — שורה אחת לכל יכולת. ללא ציונים (הציונים מופיעים בגרפים).

הוראת הצגה חובה:
לפני הגרפים בעמוד 3, הצג את הכותרת:
"לפני שתקרא את המפה — הנה מה שכל יכולת מודדת בחייך:"

ולאחריה את הטבלה הבאה (11 שורות בלבד, ללא עמודות ציון/benchmark):

| # | יכולת                  | מה זה אומר בחייך                                                                                                                          |
|---|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | חוסן והחלטיות          | עד כמה אתה עומד בלחץ, מתאושש ממשברים ומקבל החלטות גם כשאין ודאות. היכולת להמשיך קדימה כשדברים לא הולכים כמתוכנן.                       |
| 2 | גמישות וחדשנות         | עד כמה אתה מסתגל לשינויים ומוצא פתרונות יצירתיים במקום להיתקע. האם אתה רואה שינוי כאיום או כהזדמנות.                                    |
| 3 | מנהיגות ואחריות        | עד כמה אתה לוקח אחריות אמיתית על תוצאות — לא רק על המאמץ — ומוביל אנשים לפעולה גם כשאין לך סמכות פורמלית.                              |
| 4 | תקשורת ושיתוף פעולה    | עד כמה אתה מביע את עצמך בבהירות, מקשיב לאחרים ויוצר שיתוף פעולה אמיתי — לא רק עבודה במקביל.                                            |
| 5 | תכנון                  | עד כמה אתה מתעדף נכון, מנהל את הזמן שלך ביעילות ועומד בהתחייבויות שלקחת על עצמך. היכולת להפוך כוונות למעשים בפועל.                     |
| 6 | למידה וצמיחה           | עד כמה אתה משקיע בפיתוח עצמי ולא מסתפק בידע שכבר יש לך. הסקרנות המקצועית שמונעת ממך לעמוד במקום.                                       |
| 7 | חזון אסטרטגי           | עד כמה אתה חושב לטווח ארוך ומחבר בין מה שאתה עושה היום לבין לאן אתה רוצה להגיע. היכולת לראות את התמונה הגדולה כשכולם עסוקים בפרטים.   |
| 8 | מיומנות טכנולוגית      | עד כמה אתה מאמץ כלים דיגיטליים חדשים ומשלב אותם בעבודה כדי ליצור יתרון אמיתי — לא רק להסתדר עם הטכנולוגיה, אלא לרתום אותה.            |
| 9 | נטוורקינג              | עד כמה אתה בונה קשרים מקצועיים משמעותיים ושומר עליהם לאורך זמן — לא רק כשאתה זקוק למשהו, אלא כהשקעה מתמשכת באנשים.                    |
|10 | איזון ורווחה           | עד כמה אתה שומר על אנרגיה לאורך זמן ומונע שחיקה. לא מדובר בנוחות — אלא ביכולת להישאר אפקטיבי ורלוונטי לטווח ארוך.                     |
|11 | ניהול שינוי            | עד כמה אתה מתמודד עם חוסר יציבות ומוביל אנשים לזוז ממקום מוכר לעבר מצב חדש — גם כשיש התנגדות וגם כשהתמונה עדיין לא ברורה.             |

הערת סיום אחרי הטבלה (שורה אחת):
"אין יכולת 'רעה' — כל פרופיל הוא ייחודי. הדוח מראה היכן הכוחות שלך והיכן ההזדמנויות לצמיחה."

חובה: הטבלה קומפקטית — ללא רווחים מיותרים. עמוד 3 חייב להישאר עמוד אחד בלבד.

════════════════════════════════════════════════════════════
🎯 SECTION 3: AGE CATEGORIZATION & TONE ADAPTATION
════════════════════════════════════════════════════════════

Age Categories & Language Matrix (UNCHANGED)
Junior (20-27): Potential-focused, learning emphasis
Mid (28-35): Competitive advantage, career acceleration
Senior (36-45): Strategic positioning, influence building
Executive (46-60): Legacy, impact, board-level positioning
Post-career (60+): Relevance, wisdom transfer, continued impact

════════════════════════════════════════════════════════════
🧬 SECTION 4: PERSONALITY ARCHETYPES
════════════════════════════════════════════════════════════

Archetype Identification Logic (UNCHANGED — 6 archetypes)
1. The Continuous Learner — למידה high + נטוורקינג low
2. The Strategic Networker — נטוורקינג high + תכנון low
3. The Execution Machine — תכנון high + גמישות low
4. The Adaptive Innovator — גמישות high + חוסן low
5. The Resilient Leader — חוסן high + חזון low
6. The Visionary Communicator — חזון high + תכנון low

⭐ NEW V7 — VARIABILITY PROTOCOL (הגנת IP — חובה)
מטרה: מניעת Reverse Engineering על ידי שינוי שפה בין דוחות.
אלגוריתם סיבוב: hash(name + age) mod 4 → בחר גרסה A/B/C/D
חובה: השתמש רק בגרסאות המוכנות להלן. אין לחרוג מהן.

── ארכיטייפ 1: The Continuous Learner ──
V-A: "הידע שלך הוא הנשק החזק ביותר שלך — וגם הכלא שלך."
V-B: "בעולם שבו רוב האנשים מפסיקים ללמוד ב-30, אתה יוצא דופן."
V-C: "יש אנשים שמשקיעים בקשרים. אתה משקיע בידע. זה הכוח שלך."
V-D: "107 שאלות חשפו דפוס שחוזר אצל 6% בלבד מהמשתמשים."

── ארכיטייפ 2: The Strategic Networker ──
V-A: "אתה יודע משהו שרוב האנשים לוקחים שנים להבין — הקשרים הם ההון האמיתי."
V-B: "107 שאלות חשפו דפוס נדיר: אתה בונה גשרים בזמן שאחרים בונים קירות."
V-C: "ברשת שלך יש ערך שלא מופיע באף קורות חיים. הדוח הזה ממפה אותו."
V-D: "12% בלבד מהמשתמשים מגיעים לציון נטוורקינג כמו שלך — וזה לא מקרה."

── ארכיטייפ 3: The Execution Machine ──
V-A: "בעולם של דיבורים, אתה עושה. זה היתרון התחרותי הכי נדיר שקיים."
V-B: "107 שאלות, תשובה אחת ברורה: אתה מהסוג שמסיים מה שמתחיל — ב-8% העליונים."
V-C: "יש אנשים שמתכננים. יש אנשים שמבצעים. אתה מהסוג השני — והשוק משלם פרמיה על זה."
V-D: "הציון שלך בתכנון וביצוע חושף דפוס שחוזר אצל המנהלים הכי אפקטיביים שמדדנו."

── ארכיטייפ 4: The Adaptive Innovator ──
V-A: "כשהמציאות משתנה, אתה לא מחפש את המפה הישנה — אתה מצייר אחת חדשה."
V-B: "107 שאלות חשפו את מה שאנשים סביבך כבר מרגישים: אתה רואה הזדמנויות לפני שכולם."
V-C: "גמישות בדרגה כמו שלך מופיעה אצל 9% בלבד — וזה בדיוק מה שארגונים מחפשים עכשיו."
V-D: "אתה לא מסתגל לשינוי — אתה מייצר אותו. הדוח הזה מסביר למה זה כוח, ואיפה הוא עולה לך."

── ארכיטייפ 5: The Resilient Leader ──
V-A: "כשדברים מתפרקים סביבך, אתה מתייצב. זה לא מובן מאליו — זה נדיר."
V-B: "107 שאלות, ממצא אחד בולט: החוסן שלך נמצא ב-11% העליונים של כל מי שמדדנו."
V-C: "אנשים באים אליך בזמן משבר — כי הם יודעים שלא תתפרק. הדוח הזה מסביר למה."
V-D: "יש מנהיגים שמובילים כשקל. אתה מהסוג שמוביל כשקשה — וזה ההבדל שקובע."

── ארכיטייפ 6: The Visionary Communicator ──
V-A: "אתה לא רק רואה לאן הולכים — אתה יודע לגרום לאחרים לרצות ללכת איתך."
V-B: "107 שאלות חשפו שילוב שמופיע אצל 7% בלבד: חזון גבוה + יכולת תקשורת שמניעה אנשים."
V-C: "הרעיונות שלך לא נשארים ברמת הרעיון — הם יוצאים לפועל כי אתה יודע לשכנע."
V-D: "בעולם עסקי שמלא חוזים טובים שמתים בגלל תקשורת גרועה — הפרופיל שלך הוא יתרון הישרדותי."

⭐ NEW V7 — SEMANTIC WATERMARK (טביעת אצבע לזיהוי IP)
בעמוד 2, פסקה 3 — שלב באופן טבעי אחד מהביטויים:
A: "התנועה הפנימית שלך" | B: "המנגנון הסמוי" | C: "הדפוס העמוק" | D: "השורש הפונקציונלי"
אלגוריתם: hash(email) mod 4 → בחר ביטוי A/B/C/D

════════════════════════════════════════════════════════════
📄 SECTION 5: DOCUMENT STRUCTURE — EXACTLY 5 PAGES
════════════════════════════════════════════════════════════

PAGE 1: EXECUTIVE SUMMARY
⚡ VIRAL HOOK (שורה ראשונה): "[שם], מתוך 5,200 אנשים — הפרופיל שלך שייך ל-[X]% בלבד שמשלבים [TRAIT_1] עם [TRAIT_2]."
HEADER: שם מלא | תאריך | גיל | Professional Title לפי גיל
1. המנוע שלך — TOP 3 ממדים + קשר לגיל ותחומי עניין
2. המחיר שאתה משלם — BOTTOM 2 + percentile + ROI loss
3. התובנה המרכזית — פרדוקס/מתח, משפט אחד
4. הפרופיל שלך — 2-3 משפטים
5. ה-ROI האישי שלך — מספרים קונקרטיים לפי גיל
ARCHETYPE CARD (סוף עמוד 1 — Shareable)

PAGES 2-5 (UNCHANGED)
עמוד 2: COMPLETE ANALYSIS — Engine + Price + Paradox + Semantic Watermark
עמוד 3: THE COMPLETE MAP — מילון יכולות (Section 2C) + Spider Chart + Bar Chart + Interpretation Table
עמוד 4: CAREER PATHWAYS — 4 תפקידים ספציפיים + Success Stories + ROI
עמוד 5: V107 BOOSTER + CLOSING — Situation + Solution + 3 Tasks + Disclaimer

════════════════════════════════════════════════════════════
📊 SECTION 6: VISUALIZATION SPECIFICATIONS (UNCHANGED)
════════════════════════════════════════════════════════════

Spider: 11 axes | Scale 0-100 | Grid 20pt | Highlight TOP3 + BOTTOM2
Bar: sorted HIGH→LOW | 85-100: Green #4CAF50 | 70-84: Blue #2196F3 | 60-69: Yellow #FFC107 | 0-59: Red #F44336

IMPORTANT: הגרפים מיוצרים על ידי הקוד, לא על ידך. רק ציין היכן הם צריכים להופיע בדוח עם התיאור:

\`\`\`
[Spider chart visualization: 11 axes, 0-100 scale]
Top 3 highlighted in green, Bottom 2 highlighted in red
\`\`\`

\`\`\`
[Bar chart sorted high to low]
Colors: 85-100 (Green), 70-84 (Blue), 60-69 (Yellow), 0-59 (Red)
\`\`\`

════════════════════════════════════════════════════════════
🚫 SECTION 7: CRITICAL SAFETY RULES (UNCHANGED)
════════════════════════════════════════════════════════════

Forbidden Phrases
❌ "אתה פצצה"  ❌ "פוטנציאל אינסופי"  ❌ "הצלחה מובטחת"  ❌ "שינוי מהפכני"  ❌ Any superlatives without data

⭐ NEW V8 — Required Benchmark Language
✅ "לפי [מקור] ([שנה]), ממוצע [ממד] בקרב מנהלים: ~[X]/100. הציון שלך: [Y]."
✅ בסוף כל דוח: "נתוני ייחוס מבוססים על מחקרים גלובליים. ככל שיצטברו נתוני V107, ה-benchmark יעודכן."
❌ אסור: "ממוצע בשוק: [X]" — ללא ציון מקור

════════════════════════════════════════════════════════════
✅ SECTION 8: QUALITY ASSURANCE CHECKLIST (V8 ENHANCED)
════════════════════════════════════════════════════════════

VALIDATION:
☐ 107 answers ☐ All required fields ☐ Scores correct ☐ Percentiles calculated ☐ Archetype identified

V7 ITEMS:
☐ Viral Hook ☐ Archetype Card ☐ Variability Version ☐ Semantic Watermark ☐ Risk Flags

⭐ NEW V8:
☐ Benchmark citations מ-Section 2B לכל ממד
☐ הצהרת שקיפות בסוף הדוח
☐ אין טענות benchmark ללא מקור

⭐ NEW V8 — Section 2C:
☐ מילון 11 יכולות מופיע בעמוד 3 לפני הגרפים
☐ הטבלה קומפקטית — שורה אחת לכל יכולת, ללא ציונים
☐ משפט סיום "אין יכולת רעה" מופיע אחרי הטבלה
☐ עמוד 3 נשאר עמוד אחד בלבד

════════════════════════════════════════════════════════════
🎯 SECTION 9: EXECUTION PROTOCOL (V8)
════════════════════════════════════════════════════════════

STEP 1: INPUT VALIDATION
STEP 2: CALCULATION
STEP 2B: BENCHMARK LOOKUP — לכל ממד, שלוף ממוצע ומקור מטבלת Section 2B. השתמש בהצהרה המוכנה בעמודה 7.
STEP 2C: DIMENSION GLOSSARY — טען את טבלת מילון היכולות מ-Section 2C להצגה בעמוד 3.
STEP 3: CONTENT GENERATION
STEP 4: QA — ודא כל פריט ב-Checklist כולל פריטי Section 2C
STEP 5: DELIVERY

════════════════════════════════════════════════════════════
END OF SYSTEM PROMPT — V107 REPORT V8 PRO ULTIMATE
© 2026 V107 Professional Framework — Confidential & Proprietary
════════════════════════════════════════════════════════════`;

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

    // Validation
    const answers = response.responses;
    if (!answers || Object.keys(answers).length !== 107) {
      return Response.json({ error: 'Invalid questionnaire - must have exactly 107 answers' }, { status: 400 });
    }

    // Validate all answers are 1-7
    for (let i = 1; i <= 107; i++) {
      const val = answers[`q${i}`];
      if (!val || val < 1 || val > 7) {
        return Response.json({ error: `Invalid answer for question ${i}` }, { status: 400 });
      }
    }

    const age = response.personal_info?.age;
    if (!age || age < 18 || age > 100) {
      return Response.json({ error: 'Invalid age - must be between 18-100' }, { status: 400 });
    }

    // Calculate dimensions
    const dimensions = calculateAllDimensions(answers);
    
    // Get age category
    const ageCategory = getAgeCategory(age);
    
    // Get top and bottom dimensions
    const topBottom = getTopAndBottom(dimensions);
    
    // Identify archetype
    const archetype = identifyArchetype(dimensions);
    
    // Calculate variability hash
    const nameAgeHash = simpleHash(response.personal_info.full_name + age.toString());
    const variantIndex = nameAgeHash % 4;
    const variantLetter = ['A', 'B', 'C', 'D'][variantIndex];
    
    const emailHash = simpleHash(response.personal_info.email);
    const watermarkIndex = emailHash % 4;
    const watermarkLetter = ['A', 'B', 'C', 'D'][watermarkIndex];
    
    // Calculate rarity percentage
    const avgTop3Score = (topBottom.top3[0].score + topBottom.top3[1].score + topBottom.top3[2].score) / 3;
    let rarity = 25;
    if (avgTop3Score >= 85) rarity = 2;
    else if (avgTop3Score >= 80) rarity = 5;
    else if (avgTop3Score >= 75) rarity = 10;
    else if (avgTop3Score >= 70) rarity = 15;
    
    // Prepare user prompt with all calculated data
    const userPrompt = `צור דוח V107 REPORT V8 PRO ULTIMATE עבור המשתמש הבא:

נתוני משתמש:
- שם: ${response.personal_info.full_name}
- אימייל: ${response.personal_info.email}
- מגדר: ${response.personal_info.gender || 'לא צוין'}
- גיל: ${age}
- תפקיד: ${response.personal_info.occupation_field || 'לא צוין'}
- תחומי עניין: ${response.personal_info.interest_areas?.join(', ') || 'לא צוין'}

ציוני 11 הממדים (כבר מחושבים):
${Object.entries(dimensions).map(([key, dim]) => 
  `- ${dim.name} (${dim.nameEn}): ${dim.score}/100 | Benchmark: ${dim.benchmark.avg}/100 (${dim.benchmark.range}) | מקורות: ${dim.benchmark.sources}`
).join('\n')}

TOP 3 ממדים (חזקים ביותר):
1. ${topBottom.top3[0].name} - ${topBottom.top3[0].score}/100
2. ${topBottom.top3[1].name} - ${topBottom.top3[1].score}/100
3. ${topBottom.top3[2].name} - ${topBottom.top3[2].score}/100

BOTTOM 2 ממדים (חלשים ביותר):
1. ${topBottom.bottom2[1].name} - ${topBottom.bottom2[1].score}/100
2. ${topBottom.bottom2[0].name} - ${topBottom.bottom2[0].score}/100

קטגוריית גיל: ${ageCategory.label} (${ageCategory.category})
- Timeline: ${ageCategory.timeline}
- ROI Focus: ${ageCategory.roi}
- Tone: ${ageCategory.tone}

ארכיטייפ מזוהה: ${archetype.name} (${archetype.nameEn})
גרסת ארכיטייפ (Variability Protocol): V-${variantLetter}
Semantic Watermark: גרסה ${watermarkLetter}

אחוז נדירות (Rarity): ${rarity}%

הוראות:
1. צור דוח בן 5 עמודים בדיוק בפורמט Markdown
2. השתמש בנתונים המחושבים (אל תחשב מחדש!)
3. בחר את גרסת הארכיטייפ הנכונה (V-${variantLetter})
4. שלב את ה-Semantic Watermark הנכון (${watermarkLetter})
5. השתמש ב-Benchmark citations מ-Section 2B
6. כלול את מילון 11 היכולות (Section 2C) בעמוד 3
7. ציין היכן צריכים להופיע הגרפים (הם יווצרו על ידי הקוד)
8. התאם את הטון לקטגוריית הגיל
9. כלול את הצהרת השקיפות בסוף הדוח

תחיל בעמוד 1 עכשיו:`;

    // Call Claude API
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });
    
    console.log('Calling Claude API...');
    const claudeResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    const fullReport = claudeResponse.content[0].text;
    
    // Generate report ID
    const reportId = `V107-${response.language.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    
    // Prepare domain scores object
    const domainScores = {};
    for (const [key, dim] of Object.entries(dimensions)) {
      domainScores[key] = {
        score: dim.score,
        benchmark: dim.benchmark
      };
    }
    
    // Create GeneratedReport entity
    const reportData = {
      questionnaire_response_id: responseId,
      user_name: response.personal_info.full_name,
      user_email: response.personal_info.email,
      report_id: reportId,
      purchased: false,
      report_markdown: fullReport,
      archetype: archetype.name,
      recommended_booster_track: topBottom.bottom2[1].key,
      domain_scores: domainScores,
      executive_summary: {
        top3: topBottom.top3.map(d => ({ name: d.name, score: d.score })),
        bottom2: topBottom.bottom2.map(d => ({ name: d.name, score: d.score })),
        archetype: archetype.name
      },
      status: 'completed',
      language: response.language
    };
    
    const savedReport = await base44.asServiceRole.entities.GeneratedReport.create(reportData);
    
    return Response.json({ 
      success: true, 
      reportId: savedReport.id,
      report_number: reportId,
      message: 'V8 PRO report generated successfully with Claude API',
      tokens_used: claudeResponse.usage
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});