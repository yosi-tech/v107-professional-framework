import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ============================================================================
// V107 REPORT V8 PRO ULTIMATE - IMPLEMENTATION
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
    conditions: (dims) => dims.learning.score >= 70 && dims.networking.score < 60,
    strength: 'שליטה במומחיות',
    gap: 'בידוד מקצועי',
    variants: [
      'הידע שלך הוא הנשק החזק ביותר שלך — וגם הכלא שלך.',
      'בעולם שבו רוב האנשים מפסיקים ללמוד ב-30, אתה יוצא דופן.',
      'יש אנשים שמשקיעים בקשרים. אתה משקיע בידע. זה הכוח שלך.',
      '107 שאלות חשפו דפוס שחוזר אצל 6% בלבד מהמשתמשים.'
    ]
  },
  strategicNetworker: {
    name: 'הרשתות האסטרטגי',
    nameEn: 'The Strategic Networker',
    conditions: (dims) => dims.networking.score >= 70 && dims.planning.score < 60,
    strength: 'בניית קשרים',
    gap: 'טקטי לא אסטרטגי',
    variants: [
      'אתה יודע משהו שרוב האנשים לוקחים שנים להבין — הקשרים הם ההון האמיתי.',
      '107 שאלות חשפו דפוס נדיר: אתה בונה גשרים בזמן שאחרים בונים קירות.',
      'ברשת שלך יש ערך שלא מופיע באף קורות חיים. הדוח הזה ממפה אותו.',
      '12% בלבד מהמשתמשים מגיעים לציון נטוורקינג כמו שלך — וזה לא מקרה.'
    ]
  },
  executionMachine: {
    name: 'מכונת הביצוע',
    nameEn: 'The Execution Machine',
    conditions: (dims) => dims.planning.score >= 70 && dims.flexibility.score < 60,
    strength: 'מצוינות תהליכית',
    gap: 'קשיחות בשינוי',
    variants: [
      'בעולם של דיבורים, אתה עושה. זה היתרון התחרותי הכי נדיר שקיים.',
      '107 שאלות, תשובה אחת ברורה: אתה מהסוג שמסיים מה שמתחיל — ב-8% העליונים.',
      'יש אנשים שמתכננים. יש אנשים שמבצעים. אתה מהסוג השני — והשוק משלם פרמיה על זה.',
      'הציון שלך בתכנון וביצוע חושף דפוס שחוזר אצל המנהלים הכי אפקטיביים שמדדנו.'
    ]
  },
  adaptiveInnovator: {
    name: 'החדשן הגמיש',
    nameEn: 'The Adaptive Innovator',
    conditions: (dims) => dims.flexibility.score >= 70 && dims.resilience.score < 60,
    strength: 'ניווט בשינוי',
    gap: 'שחיקה מהירה',
    variants: [
      'כשהמציאות משתנה, אתה לא מחפש את המפה הישנה — אתה מצייר אחת חדשה.',
      '107 שאלות חשפו את מה שאנשים סביבך כבר מרגישים: אתה רואה הזדמנויות לפני שכולם.',
      'גמישות בדרגה כמו שלך מופיעה אצל 9% בלבד — וזה בדיוק מה שארגונים מחפשים עכשיו.',
      'אתה לא מסתגל לשינוי — אתה מייצר אותו. הדוח הזה מסביר למה זה כוח, ואיפה הוא עולה לך.'
    ]
  },
  resilientLeader: {
    name: 'המנהיג העמיד',
    nameEn: 'The Resilient Leader',
    conditions: (dims) => dims.resilience.score >= 70 && dims.vision.score < 60,
    strength: 'ניהול משברים',
    gap: 'חוסר כיוון ארוך טווח',
    variants: [
      'כשדברים מתפרקים סביבך, אתה מתייצב. זה לא מובן מאליו — זה נדיר.',
      '107 שאלות, ממצא אחד בולט: החוסן שלך נמצא ב-11% העליונים של כל מי שמדדנו.',
      'אנשים באים אליך בזמן משבר — כי הם יודעים שלא תתפרק. הדוח הזה מסביר למה.',
      'יש מנהיגים שמובילים כשקל. אתה מהסוג שמוביל כשקשה — וזה ההבדל שקובע.'
    ]
  },
  visionaryCommunicator: {
    name: 'המתקשר החזונאי',
    nameEn: 'The Visionary Communicator',
    conditions: (dims) => dims.vision.score >= 70 && dims.planning.score < 60,
    strength: 'השראת כיוון',
    gap: 'חוסר תוכנית ביצוע',
    variants: [
      'אתה לא רק רואה לאן הולכים — אתה יודע לגרום לאחרים לרצות ללכת איתך.',
      '107 שאלות חשפו שילוב שמופיע אצל 7% בלבד: חזון גבוה + יכולת תקשורת שמניעה אנשים.',
      'הרעיונות שלך לא נשארים ברמת הרעיון — הם יוצאים לפועל כי אתה יודע לשכנע.',
      'בעולם עסקי שמלא חוזים טובים שמתים בגלל תקשורת גרועה — הפרופיל שלך הוא יתרון הישרדותי.'
    ]
  }
};

// Semantic watermark phrases
const SEMANTIC_WATERMARKS = [
  'התנועה הפנימית שלך',
  'המנגנון הסמוי',
  'הדפוס העמוק',
  'השורש הפונקציונלי'
];

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
function identifyArchetype(dimensions, name, age) {
  const hash = simpleHash(name + age.toString());
  const variantIndex = hash % 4;
  
  for (const [key, archetype] of Object.entries(ARCHETYPES)) {
    if (archetype.conditions(dimensions)) {
      return {
        ...archetype,
        message: archetype.variants[variantIndex]
      };
    }
  }
  
  return {
    name: 'הפרופיל המאוזן',
    nameEn: 'The Balanced Profile',
    strength: 'גמישות כללית',
    gap: 'חוסר התמחות ברורה',
    message: 'יש לך פרופיל מאוזן יחסית, אבל חסרה לך התמחות ברורה שתבליט אותך.'
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

// Get semantic watermark
function getSemanticWatermark(email) {
  const hash = simpleHash(email);
  return SEMANTIC_WATERMARKS[hash % 4];
}

// Calculate rarity percentage for viral hook
function calculateRarityPercentage(top3) {
  const avgTop3Score = (top3[0].score + top3[1].score + top3[2].score) / 3;
  if (avgTop3Score >= 85) return 2;
  if (avgTop3Score >= 80) return 5;
  if (avgTop3Score >= 75) return 10;
  if (avgTop3Score >= 70) return 15;
  return 25;
}

// Generate Page 1: Executive Summary with V8 enhancements
function generatePage1(userData, dimensions, archetype, ageCategory, topBottom) {
  const today = new Date().toLocaleDateString('he-IL');
  const { top3, bottom2 } = topBottom;
  const interests = userData.personal_info?.interest_areas?.join(', ') || 'לא צוין';
  const rarity = calculateRarityPercentage(top3);
  
  return `# דוח V107 REPORT V8 PRO – ${userData.personal_info.full_name}

**⚡ ${userData.personal_info.full_name}, מתוך 5,200 אנשים — הפרופיל שלך שייך ל-${rarity}% בלבד שמשלבים ${top3[0].name.toLowerCase()} עם ${top3[1].name.toLowerCase()}.**

**תאריך: ${today} | גיל: ${userData.personal_info.age} | ${ageCategory.label}**

---

## 1. המנוע שלך (The Engine)

שלושת הממדים החזקים ביותר שלך הם:

- **${top3[0].name}:** ${top3[0].score}/100  
  לפי ${top3[0].benchmark.sources}, ממוצע ${top3[0].name.toLowerCase()} בקרב מקצוענים: ~${top3[0].benchmark.avg}/100. **הציון שלך: ${top3[0].score}** — ${top3[0].score >= top3[0].benchmark.avg + 10 ? 'משמעותית מעל הממוצע' : top3[0].score >= top3[0].benchmark.avg ? 'מעל הממוצע' : 'קרוב לממוצע'}.

- **${top3[1].name}:** ${top3[1].score}/100  
  לפי ${top3[1].benchmark.sources}, ממוצע ${top3[1].name.toLowerCase()}: ~${top3[1].benchmark.avg}/100. **הציון שלך: ${top3[1].score}** — ${top3[1].score >= top3[1].benchmark.avg + 10 ? 'חזק משמעותית' : top3[1].score >= top3[1].benchmark.avg ? 'חזק' : 'ממוצע'}.

- **${top3[2].name}:** ${top3[2].score}/100  
  לפי ${top3[2].benchmark.sources}, ממוצע ${top3[2].name.toLowerCase()}: ~${top3[2].benchmark.avg}/100. **הציון שלך: ${top3[2].score}**.

בגיל ${userData.personal_info.age}, המיקס הזה של ${top3[0].name.toLowerCase()}, ${top3[1].name.toLowerCase()} ו${top3[2].name.toLowerCase()} יוצר יתרון תחרותי ייחודי בתחומים של ${interests}. זה מה שמאפשר לך להצטיין ולהוביל.

---

## 2. המחיר שאתה משלם (The Cost)

שני הממדים החלשים ביותר שלך:

- **${bottom2[1].name}:** ${bottom2[1].score}/100  
  לפי ${bottom2[1].benchmark.sources}, ממוצע ${bottom2[1].name.toLowerCase()}: ~${bottom2[1].benchmark.avg}/100. **הציון שלך: ${bottom2[1].score}** — ${bottom2[1].score < bottom2[1].benchmark.avg - 10 ? '**פער קריטי**' : bottom2[1].score < bottom2[1].benchmark.avg ? 'מתחת לממוצע' : 'קרוב לממוצע'}.

- **${bottom2[0].name}:** ${bottom2[0].score}/100  
  לפי ${bottom2[0].benchmark.sources}, ממוצע: ~${bottom2[0].benchmark.avg}/100. **הציון שלך: ${bottom2[0].score}**.

ב${ageCategory.category === 'junior' ? 'שלב הזה' : 'עמדה שלך'}, ${bottom2[1].name.toLowerCase()} נמוך עולה לך ב${ageCategory.roi.toLowerCase()} — אתה מפסיד ${ageCategory.timeline} של התקדמות פוטנציאלית.

---

## 3. התובנה המרכזית (The Core Insight)

החוזק שלך ב${top3[0].name.toLowerCase()} בא על חשבון ${bottom2[1].name.toLowerCase()} — וזה מה שמחזיק אותך בגבול הנוכחי שלך.

---

## 4. הפרופיל שלך (Your Archetype)

**${archetype.name}**

${archetype.message}

החוזקה שלך היא ${archetype.strength}, והפער הוא ${archetype.gap}. זיהוי הפרופיל הזה הוא המפתח להבנה איך להתפתח הלאה.

---

## 5. ה-ROI האישי שלך (Personal ROI)

אם תשפר את ${bottom2[1].name.toLowerCase()} ב-20 נקודות תוך ${ageCategory.timeline}, תוכל לצפות לשיפור ב${ageCategory.roi.toLowerCase()} עד 40%.

---

**[עמוד 1 מתוך 5]**
`;
}

// Generate Page 2: Complete Analysis with semantic watermark
function generatePage2(dimensions, topBottom, archetype, email) {
  const { top3, bottom2 } = topBottom;
  const watermark = getSemanticWatermark(email);
  
  return `# עמוד 2: ניתוח מלא

---

## חלק א: המנוע שלך (Top 3 Dimensions)

### ${top3[0].name}: ${top3[0].score}/100

1. **הציון שלך ביחס לתעשייה:**  
   לפי ${top3[0].benchmark.sources}, ממוצע ${top3[0].name.toLowerCase()}: ~${top3[0].benchmark.avg}/100 (טווח נורמלי: ${top3[0].benchmark.range}).  
   **הציון שלך: ${top3[0].score}** — ${top3[0].score >= top3[0].benchmark.avg + 15 ? 'יוצא דופן' : top3[0].score >= top3[0].benchmark.avg + 10 ? 'חזק משמעותית' : top3[0].score >= top3[0].benchmark.avg ? 'מעל הממוצע' : 'קרוב לממוצע'}.

2. **ביטוי יומיומי:** ${top3[0].name.toLowerCase()} גבוה מתבטא אצלך ביכולת להתמיד, להחליט במהירות, ולהישאר ממוקד גם בלחץ.

3. **היתרון:** זה נותן לך יכולת להתבלט ולהוביל בסיטואציות שדורשות ${top3[0].name.toLowerCase()}.

### ${top3[1].name}: ${top3[1].score}/100

1. **הציון שלך ביחס לתעשייה:**  
   לפי ${top3[1].benchmark.sources}, ממוצע: ~${top3[1].benchmark.avg}/100.  
   **הציון שלך: ${top3[1].score}**.

2. **ביטוי:** ${top3[1].name.toLowerCase()} מתבטא ביכולת להסתגל, לחדש ולחשוב מחוץ לקופסה.

### ${top3[2].name}: ${top3[2].score}/100

לפי ${top3[2].benchmark.sources}, ממוצע: ~${top3[2].benchmark.avg}/100. הציון שלך: ${top3[2].score}.

---

## חלק ב: המחיר שאתה משלם (Bottom 2)

### ${bottom2[1].name}: ${bottom2[1].score}/100

1. **הציון והחומרה:**  
   לפי ${bottom2[1].benchmark.sources}, ממוצע ${bottom2[1].name.toLowerCase()}: ~${bottom2[1].benchmark.avg}/100.  
   **הציון שלך: ${bottom2[1].score}** — ${bottom2[1].score < bottom2[1].benchmark.avg - 15 ? '**פער קריטי**' : bottom2[1].score < bottom2[1].benchmark.avg - 10 ? '**פער משמעותי**' : 'מתחת לממוצע'}.

2. **העלות הקונקרטית:** ${bottom2[1].name.toLowerCase()} נמוך עולה לך בהזדמנויות קריירה, קשרים מקצועיים, ופרויקטים שלא מגיעים אליך.

3. **הסיבה הפסיכולוגית (${watermark}):** ${top3[0].name} גבוה (${top3[0].score}) גורם לך להתמקד ב${top3[0].name.toLowerCase()}, מה שמונע השקעה ב${bottom2[1].name.toLowerCase()}. זה מנגנון הגנה — ${top3[0].name.toLowerCase()} נותן תחושת ביטחון, בעוד ${bottom2[1].name.toLowerCase()} דורש חשיפה וסיכון.

### ${bottom2[0].name}: ${bottom2[0].score}/100

לפי ${bottom2[0].benchmark.sources}, ממוצע: ~${bottom2[0].benchmark.avg}/100. הציון שלך: ${bottom2[0].score}.

---

## חלק ג: הפרדוקס המקצועי שלך

${top3[0].name} גבוה + ${bottom2[1].name} נמוך = אתה מצטיין במה שאתה עושה, אבל מוגבל במה שאתה יכול להשיג. השילוב הזה יוצר תקרת זכוכית שקשה לפרוץ בלי עבודה ממוקדת על ${bottom2[1].name.toLowerCase()}.

---

**[עמוד 2 מתוך 5]**
`;
}

// Generate Page 3: The Complete Map
function generatePage3(dimensions) {
  const sorted = Object.values(dimensions).sort((a, b) => b.score - a.score);
  
  let page = `# עמוד 3: המפה המלאה

---

## טבלת פרשנות משופרת

| # | ממד | ציון | ממוצע תעשייתי | הערה |
|---|-----|------|---------------|------|
`;

  sorted.forEach((dim, idx) => {
    const comparison = dim.score >= dim.benchmark.avg + 10 ? '↑↑ חזק משמעותית' : 
                      dim.score >= dim.benchmark.avg ? '↑ מעל ממוצע' :
                      dim.score >= dim.benchmark.avg - 10 ? '≈ ממוצע' :
                      '↓ מתחת לממוצע';
    page += `| ${idx + 1} | ${dim.name} | ${dim.score} | ${dim.benchmark.avg} | ${comparison} |\n`;
  });

  page += `

---

## לפני שתקרא את המפה — הנה מה שכל יכולת מודדת בחייך:

| # | יכולת | מה זה אומר בחייך |
|---|-------|-----------------|
| 1 | חוסן והחלטיות | עד כמה אתה עומד בלחץ, מתאושש ממשברים ומקבל החלטות גם כשאין ודאות. היכולת להמשיך קדימה כשדברים לא הולכים כמתוכנן. |
| 2 | גמישות וחדשנות | עד כמה אתה מסתגל לשינויים ומוצא פתרונות יצירתיים במקום להיתקע. האם אתה רואה שינוי כאיום או כהזדמנות. |
| 3 | מנהיגות ואחריות | עד כמה אתה לוקח אחריות אמיתית על תוצאות — לא רק על המאמץ — ומוביל אנשים לפעולה גם כשאין לך סמכות פורמלית. |
| 4 | תקשורת ושיתוף פעולה | עד כמה אתה מביע את עצמך בבהירות, מקשיב לאחרים ויוצר שיתוף פעולה אמיתי — לא רק עבודה במקביל. |
| 5 | תכנון | עד כמה אתה מתעדף נכון, מנהל את הזמן שלך ביעילות ועומד בהתחייבויות שלקחת על עצמך. היכולת להפוך כוונות למעשים בפועל. |
| 6 | למידה וצמיחה | עד כמה אתה משקיע בפיתוח עצמי ולא מסתפק בידע שכבר יש לך. הסקרנות המקצועית שמונעת ממך לעמוד במקום. |
| 7 | חזון אסטרטגי | עד כמה אתה חושב לטווח ארוך ומחבר בין מה שאתה עושה היום לבין לאן אתה רוצה להגיע. היכולת לראות את התמונה הגדולה כשכולם עסוקים בפרטים. |
| 8 | מיומנות טכנולוגית | עד כמה אתה מאמץ כלים דיגיטליים חדשים ומשלב אותם בעבודה כדי ליצור יתרון אמיתי — לא רק להסתדר עם הטכנולוגיה, אלא לרתום אותה. |
| 9 | נטוורקינג | עד כמה אתה בונה קשרים מקצועיים משמעותיים ושומר עליהם לאורך זמן — לא רק כשאתה זקוק למשהו, אלא כהשקעה מתמשכת באנשים. |
| 10 | איזון ורווחה | עד כמה אתה שומר על אנרגיה לאורך זמן ומונע שחיקה. לא מדובר בנוחות — אלא ביכולת להישאר אפקטיבי ורלוונטי לטווח ארוך. |
| 11 | ניהול שינוי | עד כמה אתה מתמודד עם חוסר יציבות ומוביל אנשים לזוז ממקום מוכר לעבר מצב חדש — גם כשיש התנגדות וגם כשהתמונה עדיין לא ברורה. |

> אין יכולת 'רעה' — כל פרופיל הוא ייחודי. הדוח מראה היכן הכוחות שלך והיכן ההזדמנויות לצמיחה.

---

## גרף עכביש (Spider Chart)

\`\`\`
[Spider chart visualization: 11 axes, 0-100 scale]
Top 3 highlighted in green, Bottom 2 highlighted in red
\`\`\`

---

## גרף עמודות (Bar Chart)

\`\`\`
[Bar chart sorted high to low]
Colors: 85-100 (Green), 70-84 (Blue), 60-69 (Yellow), 0-59 (Red)
\`\`\`

---

**הצהרת שקיפות:**  
נתוני ייחוס מבוססים על מחקרים גלובליים (Gallup, McKinsey, LinkedIn, WEF, APA, PMI — 2022-2023). ככל שיצטברו נתוני V107, ה-benchmark יעודכן לנתוני הפלטפורמה עצמה.

---

**[עמוד 3 מתוך 5]**
`;

  return page;
}

// Generate Page 4: Career Pathways
function generatePage4(userData, dimensions, topBottom, ageCategory) {
  const { top3, bottom2 } = topBottom;
  const interests = userData.personal_info?.interest_areas || [];
  const occupation = userData.personal_info?.occupation_field;
  
  const useInterests = !occupation || occupation === 'other' || occupation === '';
  
  let page = `# עמוד 4: מסלולי קריירה

---

${useInterests ? `**בהתבסס על תחומי העניין שלך:** ${interests.join(', ')}` : `**בהתבסס על תחום העיסוק שלך:** ${occupation}`}

---
`;

  const roles = [
    {
      title: useInterests ? `${interests[0] ? 'מנהל/ת פרויקטים ב' + interests[0] : 'מנהל/ת פרויקטים'}` : 'מנהל/ת בכיר/ה',
      why: `${top3[0].name} + ${top3[1].name} + ${useInterests ? 'העניין שלך ב' + (interests[0] || 'תחום') : 'הניסיון שלך'} = יכולת לנהל פרויקטים מורכבים`,
      story: 'פגשנו מישהו עם פרופיל דומה - עבר ממנהל צוות למנהל מחלקה תוך 14 חודשים',
      improve: `${bottom2[1].name}: תצטרך להשקיע בבניית ${bottom2[1].name.toLowerCase()} - מומלץ לפגוש 3 אנשים חדשים בתחום בכל שבוע`,
      roi: `${ageCategory.timeline}: עלייה של 30-40% בסמכות ואחריות`
    },
    {
      title: useInterests ? `יועץ/ת אסטרטגי/ת ב${interests[1] || interests[0] || 'תחום'}` : 'יועץ/ת ארגוני/ת',
      why: `${top3[1].name} גבוה מאפשר לך לזהות דפוסים ולתת המלצות אסטרטגיות`,
      story: `ראינו אנשים עם ${top3[1].name} דומה שעברו מעמדות פנימיות לייעוץ עצמאי בהכנסה גבוהה יותר`,
      improve: `${bottom2[0].name}: תצטרך לעבוד על ${bottom2[0].name.toLowerCase()} - התחל עם תוכנית עבודה שבועית מובנית`,
      roi: `${ageCategory.timeline}: פוטנציאל להכנסה עצמאית של 150-200% מהשכר הנוכחי`
    },
    {
      title: useInterests ? `מומחה/ית ${interests[2] || interests[0] || 'תחום'}` : 'ראש צוות טכני',
      why: `${top3[2].name} + ${top3[0].name} = שילוב ייחודי שמאפשר מומחיות עמוקה`,
      story: 'מישהו עם ציונים דומים הפך למומחה מוביל בתעשייה תוך 2 שנים',
      improve: `${bottom2[1].name}: צור לעצמך אתגר - פרסם תוכן מקצועי פעם בשבוע למשך 3 חודשים`,
      roi: `${ageCategory.timeline}: הכרה כמומחה מוביל + הזדמנויות הרצאה וייעוץ`
    },
    {
      title: useInterests ? `מוביל/ת חדשנות ב${interests[0] || 'ארגון'}` : 'מנהל/ת חדשנות',
      why: `${top3[0].name} + ${top3[1].name} + ${top3[2].name} = תמהיל מושלם לחדשנות`,
      story: 'אנשים עם פרופיל כזה הובילו פרויקטים משנים תעשיה',
      improve: `שיפור ב${bottom2[1].name} וב${bottom2[0].name} יאפשר לך להוביל לא רק לחדש`,
      roi: `${ageCategory.timeline}: מיצוב כחלוץ בתחום + הזדמנויות בכירות`
    }
  ];

  roles.forEach((role, idx) => {
    page += `
## ${idx + 1}. ${role.title}

**למה מתאים:**
- ${role.why}
- **סיפור הצלחה:** ${role.story}

**מה לשפר:**
- ${role.improve}

**ROI צפוי:**
- ${role.roi}

---
`;
  });

  page += `**[עמוד 4 מתוך 5]**`;
  
  return page;
}

// Generate Page 5: V107 Booster + Closing
function generatePage5(userData, dimensions, topBottom, ageCategory, archetype) {
  const { bottom2 } = topBottom;
  const interests = userData.personal_info?.interest_areas || [];
  
  let page = `# עמוד 5: V107 BOOSTER

---

## המצב

בגיל ${userData.personal_info.age}, עם ${bottom2[1].name} של ${bottom2[1].score}/100 (לעומת ממוצע תעשייתי של ~${bottom2[1].benchmark.avg}/100), ${ageCategory.timeline} הם קריטיים. אתה לא יכול להרשות לעצמך עוד שנה של "אעשה את זה מתישהו".

---

## הפתרון

**V107 BOOSTER** = שריר קטן מדי יום. 15 דקות, 30 יום, תוצאות מדידות.

זו לא תוכנית "שיפור עצמי" כללית - זו תוכנית ממוקדת בדיוק על ${bottom2[1].name.toLowerCase()} ו${bottom2[0].name.toLowerCase()}, המותאמת לפרופיל ${archetype.name} שלך.

---

## 3 משימות לדוגמה

### יום 3 – שיחת רשת ראשונה

**משימה:** שלח הודעה למישהו שעובד ב${interests[0] || 'תחום שמעניין אותך'} ושאל:
"מה הטרנד הכי מעניין שאתה רואה ב${interests[0] || 'תחום'} עכשיו?"

**זמן:** 20 דקות

**מטרה:** שיחה של 15 דקות עם אדם אחד

**ROI צפוי:** קשר אחד איכותי + תובנה חדשה = 2 in 1

---

### יום 12 – תכנון אסטרטגי

**משימה:** כתוב תוכנית עבודה לשבוע הבא עם 3 מטרות ברורות שקשורות ל${bottom2[1].name.toLowerCase()}.

**זמן:** 25 דקות

**מטרה:** תוכנית כתובה עם 3 מטרות + צעדי ביצוע

**ROI צפוי:** מעבר מריאקטיבי לפרואקטיבי - חיסכון של 5 שעות בשבוע

---

### יום 21 – מינוף רשת

**משימה:** פרסם תובנה מקצועית אחת ב-LinkedIn על ${interests[0] || 'תחום המומחיות שלך'}.

**זמן:** 30 דקות

**מטרה:** פוסט אחד מפורסם + 5 תגובות מאנשים בתחום

**ROI צפוי:** נראות מקצועית + 3-5 פניות חדשות בחודש הבא

---

## סיום

${userData.personal_info.full_name}, בגיל ${userData.personal_info.age}, עם הפרופיל של ${archetype.name}, יש לך חלון זמן של ${ageCategory.timeline} לעשות את השינוי. V107 BOOSTER הוא הכלי שייקח אותך מהתובנה לתוצאה.

**הבחירה שלך.**

צוות V107  
support@v107.co.il

---

## הבהרה משפטית

דוח זה מהווה כלי אבחון בלבד ואינו מהווה ייעוץ משפטי, עסקי או פסיכולוגי מחייב. אין במסקנות הדוח משום הבטחה להישגים או לתוצאות כלכליות. השימוש במידע המוצג הוא על דעתך ובאחריותך הבלעדית.

**הצהרת שקיפות:**  
נתוני ייחוס מבוססים על מחקרים גלובליים (Gallup, McKinsey, LinkedIn, WEF, APA, PMI — 2022-2023). ככל שיצטברו נתוני V107, ה-benchmark יעודכן לנתוני הפלטפורמה עצמה.

---

**[עמוד 5 מתוך 5]**

---

**END OF REPORT**

© 2026 V107 Professional Framework
`;
  
  return page;
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
    const archetype = identifyArchetype(dimensions, response.personal_info.full_name, age);
    
    // Generate 5-page report
    const page1 = generatePage1(response, dimensions, archetype, ageCategory, topBottom);
    const page2 = generatePage2(dimensions, topBottom, archetype, response.personal_info.email);
    const page3 = generatePage3(dimensions);
    const page4 = generatePage4(response, dimensions, topBottom, ageCategory);
    const page5 = generatePage5(response, dimensions, topBottom, ageCategory, archetype);
    
    const fullReport = `${page1}\n\n${page2}\n\n${page3}\n\n${page4}\n\n${page5}`;
    
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
      message: 'V8 PRO report generated successfully' 
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});