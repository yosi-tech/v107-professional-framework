import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// ============================================================================
// V107 REPORT V6 PRO ULTIMATE - IMPLEMENTATION
// ============================================================================

// Reverse questions (8-x transformation)
const REVERSE_QUESTIONS = [4, 8, 14, 22, 25, 27, 34, 37, 39, 41, 45, 48, 54, 57, 60, 89, 90, 93, 98];

// 11 Core Dimensions with their question mappings
const DIMENSIONS = {
  resilience: { 
    nameHe: 'חוסן והחלטיות', 
    nameEn: 'Resilience', 
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] 
  },
  flexibility: { 
    nameHe: 'גמישות וחדשנות', 
    nameEn: 'Flexibility', 
    questions: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28] 
  },
  leadership: { 
    nameHe: 'מנהיגות ואחריות', 
    nameEn: 'Leadership', 
    questions: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41] 
  },
  communication: { 
    nameHe: 'תקשורת ושיתוף פעולה', 
    nameEn: 'Communication', 
    questions: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57] 
  },
  planning: { 
    nameHe: 'תכנון', 
    nameEn: 'Planning', 
    questions: [58, 59, 60, 61, 62, 63, 64, 76, 77] 
  },
  learning: { 
    nameHe: 'למידה וצמיחה', 
    nameEn: 'Learning', 
    questions: [65, 66, 67, 68, 69, 78, 85, 86, 87, 103] 
  },
  vision: { 
    nameHe: 'חזון אסטרטגי', 
    nameEn: 'Vision', 
    questions: [72, 73, 74, 75, 80, 84, 101, 102] 
  },
  tech: { 
    nameHe: 'מיומנות טכנולוגית', 
    nameEn: 'Tech', 
    questions: [82, 83, 94, 95, 106] 
  },
  networking: { 
    nameHe: 'נטוורקינג', 
    nameEn: 'Networking', 
    questions: [81, 105, 107] 
  },
  balance: { 
    nameHe: 'איזון ורווחה', 
    nameEn: 'Balance', 
    questions: [70, 71, 88, 89, 90, 91, 92] 
  },
  change: { 
    nameHe: 'ניהול שינוי', 
    nameEn: 'Change', 
    questions: [96, 97, 98, 99, 100, 104] 
  }
};

// Percentile norms
function getPercentileContext(score) {
  if (score >= 85) return { range: 'Top 10%', label: 'מצטיין', severity: 'outstanding' };
  if (score >= 70) return { range: 'Top 30%', label: 'חזק', severity: 'strong' };
  if (score >= 60) return { range: 'Average 50%', label: 'ממוצע', severity: 'moderate' };
  if (score >= 40) return { range: 'Bottom 30%', label: 'מוגבל', severity: 'limited' };
  return { range: 'Bottom 10%', label: 'פער קריטי', severity: 'critical' };
}

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
    message: 'אתה מומחה בודד - יודע הרבה, אבל מעט מכירים אותך'
  },
  strategicNetworker: {
    name: 'הרשתות האסטרטגי',
    nameEn: 'The Strategic Networker',
    conditions: (dims) => dims.networking.score >= 70 && dims.planning.score < 60,
    strength: 'בניית קשרים',
    gap: 'טקטי לא אסטרטגי',
    message: 'אתה מכיר כולם, אבל לא יודע לאן ללכת עם זה'
  },
  executionMachine: {
    name: 'מכונת הביצוע',
    nameEn: 'The Execution Machine',
    conditions: (dims) => dims.planning.score >= 70 && dims.flexibility.score < 60,
    strength: 'מצוינות תהליכית',
    gap: 'קשיחות בשינוי',
    message: 'אתה מצוין בביצוע, אבל שובר כשהתוכנית משתנה'
  },
  adaptiveInnovator: {
    name: 'החדשן הגמיש',
    nameEn: 'The Adaptive Innovator',
    conditions: (dims) => dims.flexibility.score >= 70 && dims.resilience.score < 60,
    strength: 'ניווט בשינוי',
    gap: 'שחיקה מהירה',
    message: 'אתה מסתגל מהר, אבל לא מחזיק לטווח ארוך'
  },
  resilientLeader: {
    name: 'המנהיג העמיד',
    nameEn: 'The Resilient Leader',
    conditions: (dims) => dims.resilience.score >= 70 && dims.vision.score < 60,
    strength: 'ניהול משברים',
    gap: 'חוסר כיוון ארוך טווח',
    message: 'אתה מצטיין במשברים, אבל חסר כיוון אסטרטגי'
  },
  visionaryCommunicator: {
    name: 'המתקשר החזונאי',
    nameEn: 'The Visionary Communicator',
    conditions: (dims) => dims.vision.score >= 70 && dims.planning.score < 60,
    strength: 'השראת כיוון',
    gap: 'חוסר תוכנית ביצוע',
    message: 'אתה רואה את העתיד, אבל לא יודע איך להגיע לשם'
  }
};

// Calculate dimension score
function calculateDimensionScore(responses, questions) {
  let sum = 0;
  for (const qNum of questions) {
    let value = responses[`q${qNum}`];
    if (!value) return 0;
    
    // Apply reverse transformation if needed
    if (REVERSE_QUESTIONS.includes(qNum)) {
      value = 8 - value;
    }
    sum += value;
  }
  
  const average = sum / questions.length;
  const score = average * 14.2857;
  return Math.round(score * 10) / 10; // Round to 1 decimal
}

// Calculate all dimensions
function calculateAllDimensions(responses) {
  const result = {};
  for (const [key, dim] of Object.entries(DIMENSIONS)) {
    const score = calculateDimensionScore(responses, dim.questions);
    const percentile = getPercentileContext(score);
    result[key] = {
      name: dim.nameHe,
      nameEn: dim.nameEn,
      score: score,
      percentile: percentile
    };
  }
  return result;
}

// Identify archetype
function identifyArchetype(dimensions) {
  for (const [key, archetype] of Object.entries(ARCHETYPES)) {
    if (archetype.conditions(dimensions)) {
      return archetype;
    }
  }
  // Default fallback
  return {
    name: 'הפרופיל המאוזן',
    nameEn: 'The Balanced Profile',
    strength: 'גמישות כללית',
    gap: 'חוסר התמחות ברורה',
    message: 'יש לך פרופיל מאוזן יחסית, אבל חסרה לך התמחות ברורה שתבליט אותך'
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

// Generate dimension interaction pattern
function generateDimensionPattern(top3, bottom2) {
  const high1 = top3[0];
  const high2 = top3[1];
  const low1 = bottom2[0];
  
  return `**הדפוס שלך:**
${high1.name} ${high1.score} + ${high2.name} ${high2.score} = דפוס המשלב ${high1.name.toLowerCase()} עם ${high2.name.toLowerCase()}.
למשל: ${high1.name} גבוה משפר את ${high2.name}, אבל גורם להזנחה של ${low1.name} (${low1.score}).`;
}

// Generate psychological explanation for bottom dimensions
function generatePsychologicalExplanation(bottomDim, topDim) {
  return `**הסיבה הפסיכולוגית:** ${topDim.name} גבוה (${topDim.score}) גורם לך להתמקד ב${topDim.name.toLowerCase()}, מה שמונע השקעה ב${bottomDim.name.toLowerCase()}. זה מנגנון הגנה - ${topDim.name.toLowerCase()} נותן תחושת ביטחון, בעוד ${bottomDim.name.toLowerCase()} דורש חשיפה וסיכון.`;
}

// Generate Page 1: Executive Summary
function generatePage1(userData, dimensions, archetype, ageCategory, topBottom) {
  const today = new Date().toLocaleDateString('he-IL');
  const { top3, bottom2 } = topBottom;
  const interests = userData.personal_info?.interest_areas?.join(', ') || 'לא צוין';
  
  return `# דוח V107 REPORT V6 PRO – ${userData.personal_info.full_name}

**תאריך: ${today} | גיל: ${userData.personal_info.age} | ${ageCategory.label}**

---

## פתיחה

${userData.personal_info.full_name}, תודה על מילוי שאלון V107. הדוח מבוסס על 107 שאלות ו-11 ממדים,
מותאם לגילך (${userData.personal_info.age}) ולתחומי העניין שלך (${interests}).

**צוות V107**

---

## 1. המנוע שלך (The Engine)

שלושת הממדים החזקים ביותר שלך הם:
- **${top3[0].name}:** ${top3[0].score} (${top3[0].percentile.range})
- **${top3[1].name}:** ${top3[1].score} (${top3[1].percentile.range})
- **${top3[2].name}:** ${top3[2].score} (${top3[2].percentile.range})

בגיל ${userData.personal_info.age}, המיקס הזה של ${top3[0].name.toLowerCase()}, ${top3[1].name.toLowerCase()} ו${top3[2].name.toLowerCase()} יוצר יתרון תחרותי ייחודי בתחומים של ${interests}. זה מה שמאפשר לך להצטיין ולהוביל.

---

## 2. המחיר שאתה משלם (The Cost)

שני הממדים החלשים ביותר שלך:
- **${bottom2[1].name}:** ${bottom2[1].score} (${bottom2[1].percentile.range} - **${bottom2[1].percentile.label}**)
- **${bottom2[0].name}:** ${bottom2[0].score} (${bottom2[0].percentile.range} - **${bottom2[0].percentile.label}**)

ב${ageCategory.category === 'junior' ? 'שלב הזה' : 'עמדה שלך'}, ${bottom2[1].name.toLowerCase()} נמוך עולה לך ב${ageCategory.roi.toLowerCase()} - אתה מפסיד ${ageCategory.timeline} של התקדמות פוטנציאלית.

---

## 3. התובנה המרכזית (The Core Insight)

החוזק שלך ב${top3[0].name.toLowerCase()} בא על חשבון ${bottom2[1].name.toLowerCase()} - וזה מה שמחזיק אותך בגבול הנוכחי שלך.

---

## 4. הפרופיל שלך (Your Archetype)

**${archetype.name}**

${archetype.message}. החוזקה שלך היא ${archetype.strength}, והפער הוא ${archetype.gap}. זיהוי הפרופיל הזה הוא המפתח להבנה איך להתפתח הלאה.

---

## 5. ה-ROI האישי שלך (Personal ROI)

אם תשפר את ${bottom2[1].name.toLowerCase()} ב-20 נקודות תוך ${ageCategory.timeline}, תוכל לצפות לשיפור ב${ageCategory.roi.toLowerCase()} עד 40%.

---

**[עמוד 1 מתוך 5]**
`;
}

// Generate Page 2: Complete Analysis
function generatePage2(dimensions, topBottom, archetype) {
  const { top3, bottom2 } = topBottom;
  
  let page = `# עמוד 2: ניתוח מלא

---

## חלק א: המנוע שלך (Top 3 Dimensions)

`;

  // Top 3 analysis
  for (const dim of top3) {
    page += `### ${dim.name}: ${dim.score} (${dim.percentile.range})

1. **הציון שלך:** ${dim.score} פירושו שאתה ב-${dim.percentile.range} ביחס לאנשים בגילך.
2. **ביטוי יומיומי:** ${dim.name.toLowerCase()} גבוה מתבטא אצלך בכך שאתה מצליח ${dim.name === 'למידה וצמיחה' ? 'ללמוד במהירות ולהתעדכן' : dim.name === 'תקשורת ושיתוף פעולה' ? 'לתקשר ביעילות ולבנות קשרים' : 'לבצע באופן עקבי'}.
3. **היתרון:** זה נותן לך יכולת להתבלט ולהוביל בסיטואציות שדורשות ${dim.name.toLowerCase()}.

`;
  }

  // Dimension interaction pattern
  page += generateDimensionPattern(top3, bottom2);
  page += `

---

## חלק ב: המחיר ש אתה משלם (Bottom 2 Dimensions)

`;

  // Bottom 2 analysis
  for (const dim of bottom2.reverse()) {
    const topDim = top3[0];
    page += `### ${dim.name}: ${dim.score} (${dim.percentile.range})

1. **הציון והחומרה:** ${dim.score} פירושו שאתה ב-${dim.percentile.range} - זהו **${dim.percentile.label}**.
2. **העלות הקונקרטית:** ${dim.name.toLowerCase()} נמוך עולה לך בהזדמנויות קריירה, קשרים מקצועיים, ופרויקטים שלא מגיעים אליך.
3. ${generatePsychologicalExplanation(dim, topDim)}
4. **מה קורה אם לא מטופל:** הפער הזה יגדל עם הזמן ויהפוך למחסום משמעותי בהתפתחות שלך.

`;
  }

  page += `
---

## חלק ג: הפרדוקס המקצועי שלך

${top3[0].name} גבוה + ${bottom2[1].name} נמוך = אתה מצטיין במה שאתה עושה, אבל מוגבל במה שאתה יכול להשיג. השילוב הזה יוצר תקרת זכוכית שקשה לפרוץ בלי עבודה ממוקדת על ${bottom2[1].name.toLowerCase()}.

---

**[עמוד 2 מתוך 5]**
`;

  return page;
}

// Generate Page 3: The Complete Map
function generatePage3(dimensions) {
  const sorted = Object.values(dimensions).sort((a, b) => b.score - a.score);
  
  let page = `# עמוד 3: המפה המלאה

---

## הקדמה

הטבלה והגרפים מציגים את 11 הממדים, ממוינים מהגבוה לנמוך.
כל ממד מדורג מ-0 ל-100 ומשולב עם percentile לעומת אנשים בגילך.

---

## טבלת פרשנות משופרת

| # | ממד | ציון | Percentile | פרשנות |
|---|-----|------|------------|---------|
`;

  sorted.forEach((dim, idx) => {
    page += `| ${idx + 1} | ${dim.name} | ${dim.score} | ${dim.percentile.range} | ${dim.percentile.label} |\n`;
  });

  page += `

---

## גרף עכביש (Spider Chart)

\`\`\`
[Spider chart visualization would be rendered here with 11 axes, 0-100 scale]
Top 3 highlighted in green, Bottom 2 highlighted in red
\`\`\`

---

## גרף עמודות (Bar Chart)

\`\`\`
[Bar chart visualization sorted high to low]
Colors: 85-100 (Green), 70-84 (Blue), 60-69 (Yellow), 0-59 (Red)
Each bar labeled with Score + Percentile
\`\`\`

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

  // Generate 4 career pathways
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
      story: 'ראינו אנשים עם ${top3[1].name} דומה שעברו מעמדות פנימיות לייעוץ עצמאי בהכנסה גבוהה יותר',
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

// Generate Page 5: V107 Booster
function generatePage5(userData, dimensions, topBottom, ageCategory, archetype) {
  const { bottom2 } = topBottom;
  const interests = userData.personal_info?.interest_areas || [];
  
  let page = `# עמוד 5: V107 BOOSTER

---

## המצב

בגיל ${userData.personal_info.age}, עם ${bottom2[1].name} של ${bottom2[1].score} (${bottom2[1].percentile.range}), ${ageCategory.timeline} הם קריטיים. אתה לא יכול להרשות לעצמך עוד שנה של "אעשה את זה מתישהו".

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
    const archetype = identifyArchetype(dimensions);
    
    // Generate 5-page report
    const page1 = generatePage1(response, dimensions, archetype, ageCategory, topBottom);
    const page2 = generatePage2(dimensions, topBottom, archetype);
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
        percentile: dim.percentile.range
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
      message: 'V6 PRO Ultimate report generated successfully' 
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});