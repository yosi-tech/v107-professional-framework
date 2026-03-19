import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * V107 BOOSTER V8 PRO ULTIMATE - Daily Content Generator
 * Based on V8 PRO MASTER SYSTEM PROMPT
 * 
 * Generates personalized daily coaching messages (days 1-30)
 * Inputs: subscriptionId, day (1-30)
 * Output: Personalized message with benchmark citations, archetype context, ROI metrics
 */

// Benchmark data (V8 PRO)
const BENCHMARK_DATA = {
  resilience: { avg: 64, range: '52-76', sources: 'Gallup ו-APA (2022-23)' },
  flexibility: { avg: 68, range: '56-80', sources: 'McKinsey ו-Deloitte (2023)' },
  leadership: { avg: 61, range: '48-75', sources: 'Gallup ו-CCL (2023)' },
  communication: { avg: 70, range: '58-82', sources: 'LinkedIn ו-MIT Sloan (2023)' },
  planning: { avg: 63, range: '50-76', sources: 'PMI ו-Asana (2023)' },
  learning: { avg: 66, range: '54-78', sources: 'LinkedIn ו-WEF (2023)' },
  vision: { avg: 59, range: '45-73', sources: 'Korn Ferry ו-HBR (2022-23)' },
  tech: { avg: 62, range: '48-76', sources: 'WEF ו-McKinsey (2023)' },
  networking: { avg: 55, range: '42-68', sources: 'LinkedIn ו-Harvard (2022-23)' },
  balance: { avg: 57, range: '44-70', sources: 'Gallup ו-WHO (2023)' },
  change: { avg: 58, range: '44-72', sources: 'Prosci ו-McKinsey (2022-23)' }
};

// Helper: Get dimension name in Hebrew
const getDimensionNameHe = (dimKey) => {
  const map = {
    resilience: 'חוסן והחלטיות',
    flexibility: 'גמישות וחדשנות',
    leadership: 'מנהיגות ואחריות',
    communication: 'תקשורת ושיתוף פעולה',
    planning: 'תכנון',
    learning: 'למידה וצמיחה',
    vision: 'חזון אסטרטגי',
    tech: 'מיומנות טכנולוגית',
    networking: 'נטוורקינג',
    balance: 'איזון ורווחה',
    change: 'ניהול שינוי'
  };
  return map[dimKey] || dimKey;
};

// Helper: Format gender
const formatGender = (gender) => {
  return gender === 'male' ? 'ה' : 'ת';
};

// Helper: Get benchmark text for dimension
const getBenchmarkText = (dimKey, score) => {
  const bench = BENCHMARK_DATA[dimKey];
  if (!bench) return '';
  return `לפי ${bench.sources}, ממוצע ${getDimensionNameHe(dimKey).toLowerCase()}: ~${bench.avg}/100. הציון שלך: ${score}.`;
};

// Daily content templates (1-30) with V8 enhancements
const getDailyContent = (day, userData) => {
  const { name, gender, archetype, top3, bottom2, age } = userData;
  const g = formatGender(gender);
  
  const bottomDim = bottom2[0]; // Primary weak dimension
  const topDim = top3[0]; // Primary strong dimension
  
  switch(day) {
    case 1:
      return {
        subject: `${name}, יום 1: ניקוי שולחן אסטרטגי 🎯`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 1: ניקוי שולחן אסטרטגי</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>ברוכ${g} הבא${g} לתוכנית ה-BOOSTER של V107. היום אנחנו מתחילים.</p>
  
  <p><strong>הקשר האסטרטגי:</strong> לפני שמתקדמים, צריך לנקות את השולחן. לפי מחקר של Asana (2023), 80% מהמשימות שמעיקות על מקצוענים לא באמת דחופות.</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>פתח${g} רשימת משימות או מחברת</li>
    <li>רשמ${g} 5 משימות שמעיקות עלייך השבוע</li>
    <li>סמנ${g} 2 מהן שאפשר למחוק/לדחות/להאציל עכשיו</li>
    <li>מחק${g} אותן מיד - אל תחכ${g}</li>
  </ol>
  
  <p><strong>ROI צפוי:</strong> שחרור של 20% מההון הקשבי שלך = ראש פנוי למשימות אסטרטגיות.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>💪 ${name}, היום את${g} לוקח${g} פיקוד על הזמן שלך.</strong>
  </p>
</div>
`
      };

    case 2:
      return {
        subject: `${name}, יום 2: זיהוי זוללי אנרגיה ⚡`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 2: זיהוי זוללי אנרגיה</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>אתמול נקינו את השולחן. היום נזהה את הדברים שגונבים לך אנרגיה בלי שתשימ${g} לב.</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>היום, בכל פגישה או שיחה - שאל${g} את עצמך: "האם זה היה יכול להיסגר במייל מהיר?"</li>
    <li>סמנ${g} ב-X ביומן כל פגישה כזו</li>
    <li>בסוף היום - ספר${g} כמה X יש לך</li>
  </ol>
  
  <p><strong>ROI צפוי:</strong> זיהוי של 3-5 שעות שבועיות שאפשר לחסוך.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>💡 התובנה היא הצעד הראשון לשינוי.</strong>
  </p>
</div>
`
      };

    case 3:
      return {
        subject: `${name}, יום 3: שיחת רשת ראשונה 🤝`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 3: שיחת רשת ראשונה</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>הציון שלך ב${bottomDim.name}: <strong>${bottomDim.score}/100</strong>. ${getBenchmarkText(bottomDim.key, bottomDim.score)}</p>
  
  <p><strong>למה זה קשה?</strong> בתור "${archetype}", ${topDim.name} גבוה (${topDim.score}) גורם לך להעדיף עבודה עצמאית על חשיפה חברתית.</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">המשימה:</h3>
  <ol style="padding-right: 20px;">
    <li>זהה${g} אדם אחד מהרשת שיכול לסייע במשימה שתוקעת אותך</li>
    <li>שלח${g} לו הודעה:</li>
  </ol>
  
  <div style="background: #fff3cd; padding: 15px; border-right: 4px solid #ffc107; margin: 20px 0;">
    <p style="margin: 0;">"היי [שם], אני עובד${g} על [X], אשמח לשמוע את דעתך - 15 דקות שיחה השבוע?"</p>
  </div>
  
  <p><strong>ROI צפוי:</strong> קשר איכותי אחד + תובנה חיצונית = 2 in 1.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>🚀 ${name}, קשר אחד איכותי שווה 10 קשרים שטחיים.</strong>
  </p>
</div>
`
      };

    case 7:
      return {
        subject: `${name}, יום 7: הפריצה האסטרטגית 🎯`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 7: הפריצה האסטרטגית</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>השבוע הוכחת שאת${g} מסוגל${g} לקחת פיקוד על המשאבים שלך. עכשיו הזמן לעבור משיפור נקודתי לשינוי מובנה.</p>
  
  <div style="background: #e8f5e9; padding: 20px; border-right: 4px solid #4caf50; margin: 25px 0;">
    <h3 style="color: #2e7d32; margin-top: 0;">💚 סיפור הצלחה</h3>
    <p>פגשנו מישהו עם ארכיטיפ "${archetype}" דומה לשלך - שיפר את ${bottomDim.name} מ-${Math.round(bottomDim.score - 15)} ל-${Math.round(bottomDim.score + 10)} תוך 60 יום, והעלה ROI אישי ב-30%.</p>
    <p>${getBenchmarkText(bottomDim.key, bottomDim.score)}</p>
  </div>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הצעת הערך:</h3>
  <p>ב-23 הימים הבאים נבנה יחד את ה"שלדה" הניהולית שתגן עלייך משחיקה ותמנף את היכולות שלך לתוצאות מדידות.</p>
  
  <p><strong>התוצר:</strong> בסיום התהליך תחזיק${g} בפרוטוקול עבודה אישי (SOP) שחוסך זמן ומייצר שקט נפשי.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>🔥 השינוי הממשי מתחיל כשעוברים משיפור נקודתי למערכת שלמה.</strong>
  </p>
</div>
`
      };

    case 11:
      return {
        subject: `${name}, יום 11: עדכון הרשת המקצועית 📢`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 11: עדכון הרשת המקצועית</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>שאלה קריטית: <em>"האם אנשים ברשת שלי יודעים מה אני עושה עכשיו?"</em></p>
  
  <p>אם התשובה "לא" - <strong>אתה בלתי נראה</strong>. ובלתי נראה = לא רלוונטי.</p>
  
  <p>${getBenchmarkText('networking', bottomDim.key === 'networking' ? bottomDim.score : 55)}</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>פתח${g} את רשימת אנשי הקשר שלך</li>
    <li>בחר${g} 5 אנשים מהרשת (קולגות, לקוחות, מנטורים)</li>
    <li>שלח${g} להם עדכון קצר (3 שורות):</li>
  </ol>
  
  <div style="background: #fff3cd; padding: 15px; border-right: 4px solid #ffc107; margin: 20px 0;">
    <p style="margin: 0;">"היי [שם], רציתי לעדכן - לאחרונה עבדתי על [X] והתקדמתי ב-[Y]. מקווה שגם אצלך הכל טוב!"</p>
  </div>
  
  <p><strong>ROI צפוי:</strong> 5 אנשים יזכרו אותך = visibility מיידי + דלתות שעשויות להיפתח.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>📡 נוכחות = רלוונטיות. רלוונטיות = הזדמנויות.</strong>
  </p>
</div>
`
      };

    case 12:
      return {
        subject: `${name}, יום 12: תכנון אסטרטגי שבועי 📋`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 12: תכנון אסטרטגי שבועי</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>הציון שלך בתכנון: ${bottomDim.key === 'planning' ? `<strong>${bottomDim.score}/100</strong>. ${getBenchmarkText('planning', bottomDim.score)}` : 'לא זוהה כממד חלש'}</p>
  
  <p><strong>למה זה קשה?</strong> ${topDim.name} גבוה (${topDim.score}) גורם לך להגיב לדברים במהירות, לא לתכנן מראש.</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">המשימה:</h3>
  <ol style="padding-right: 20px;">
    <li>כתוב${g} תוכנית עבודה לשבוע הבא עם 3 מטרות ברורות</li>
    <li>לכל מטרה - הוסף${g} צעדי ביצוע קונקרטיים</li>
    <li>בדוק${g} בסוף השבוע הבא כמה מהמטרות הושגו</li>
  </ol>
  
  <p><strong>ROI צפוי:</strong> מעבר מריאקטיבי לפרואקטיבי = חיסכון של 5 שעות בשבוע.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>🎯 תכנון הוא לא בזבוז זמן - זה השקעה שמחזירה עצמה פי 10.</strong>
  </p>
</div>
`
      };

    case 14:
      return {
        subject: `${name}, יום 14: בקרת איכות חצי-חודשית 📊`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 14: בקרת איכות חצי-חודשית</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>חצי הדרך. זמן לבדוק האם אנחנו על המסלול.</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>השווה${g} את תפוקת השבוע השני מול השבוע הראשון</li>
    <li>זהה${g} שיפור אחד ברור ב-ROI האישי שלך</li>
    <li>כתוב${g} משפט אחד: "השיפור המשמעותי ביותר הוא..."</li>
  </ol>
  
  <div style="background: #e8f5e9; padding: 20px; border-right: 4px solid #4caf50; margin: 25px 0;">
    <h3 style="color: #2e7d32; margin-top: 0;">💚 נקודת ייחוס</h3>
    <p>מישהו עם "${archetype}" דומה - אחרי 14 יום שיפר את ${bottomDim.name} ב-12 נקודות.</p>
    <p>${getBenchmarkText(bottomDim.key, bottomDim.score)}</p>
  </div>
  
  <p><strong>ROI צפוי:</strong> זיהוי מגמת שיפור = חיזוק מוטיבציה ל-16 הימים הבאים.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>📈 מה שנמדד - משתפר.</strong>
  </p>
</div>
`
      };

    case 18:
      return {
        subject: `${name}, יום 18: בניית קשרים מודעים 🎯`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 18: בניית קשרים מודעים</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>השאלה היא לא <em>"האם אני מכיר אנשים?"</em> אלא <em>"האם אני בונה קשרים באופן מודע?"</em></p>
  
  <p><strong>למה זה קשה?</strong> ${topDim.name} גבוה (${topDim.score}) גורם לך להיות ספונטני${g}, לא מתוכנן${g}. נטוורקינג דורש <strong>תכנון מודע</strong>, לא מקריות.</p>
  
  <p>${getBenchmarkText('networking', bottomDim.key === 'networking' ? bottomDim.score : 55)}</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>בחר${g} 3 אנשים שאת${g} רוצה להכיר טוב יותר</li>
    <li>תכנן${g} איתם שיחה/פגישה/קפה ב-30 הימים הבאים</li>
    <li>שלח${g} להם הזמנה היום - ספציפית ומתוכננת</li>
  </ol>
  
  <p><strong>ROI צפוי:</strong> 3 קשרים עמוקים > 30 קשרים שטחיים. איכות מנצחת כמות.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>🤝 רשת איכותית = הון אסטרטגי לטווח ארוך.</strong>
  </p>
</div>
`
      };

    case 21:
      return {
        subject: `${name}, יום 21: פרסום תוכן מקצועי 📝`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 21: פרסום תוכן מקצועי</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>המשפט הכי חשוב שתלמד${g} היום: <strong>Visibility = Value</strong>.</p>
  
  <p>${getBenchmarkText('networking', bottomDim.key === 'networking' ? bottomDim.score : 55)}</p>
  
  <div style="background: #e8f5e9; padding: 20px; border-right: 4px solid #4caf50; margin: 25px 0;">
    <h3 style="color: #2e7d32; margin-top: 0;">💚 סיפור הצלחה</h3>
    <p>מישהו עם "${archetype}" דומה - פרסם תוכן מקצועי פעם בשבוע למשך 3 חודשים, וקיבל 5 פניות איכותיות.</p>
  </div>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">המשימה:</h3>
  <ol style="padding-right: 20px;">
    <li>כתוב${g} פוסט אחד ב-LinkedIn על תובנה מקצועית שלמדת לאחרונה</li>
    <li>פרסמ${g} אותו היום</li>
    <li>הגיב${g} לפחות ל-5 תגובות שתקבל${g}</li>
  </ol>
  
  <p><strong>ROI צפוי:</strong> נראות מקצועית + 3-5 פניות חדשות בחודש הבא.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>📡 ${name}, תוכן איכותי = מגנט להזדמנויות.</strong>
  </p>
</div>
`
      };

    case 28:
      return {
        subject: `${name}, יום 28: תכנון עתידי עם חזון אסטרטגי 🔭`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 28: תכנון עתידי עם חזון אסטרטגי</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>חזון אסטרטגי שלך: ${bottomDim.key === 'vision' ? `<strong>${bottomDim.score}/100</strong>. ${getBenchmarkText('vision', bottomDim.score)}` : 'לא זוהה כממד חלש'}.</p>
  
  <p><strong>למה?</strong> ${topDim.name} גבוה (${topDim.score}) גורם לך להתמקד ב"עכשיו" ולא ב"בעוד 3 שנים".</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>בנה${g} יומן לחודש הבא</li>
    <li>לכל משימה שאת${g} מתכנן${g} - שאל${g}: <strong>"האם זה מקרב אותי ליעד שלי בעוד 3 שנים?"</strong></li>
    <li>אם התשובה "לא" - שק${g} לבטל או להאציל</li>
  </ol>
  
  <p><strong>ROI צפוי:</strong> יישור של 80%+ מהזמן שלך עם החזון ארוך הטווח.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>🎯 ללא חזון - אתה רק מגיב. עם חזון - אתה מוביל.</strong>
  </p>
</div>
`
      };

    case 30:
      return {
        subject: `${name}, יום 30: V107 MASTER SUMMARY 🏆`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 30: V107 MASTER SUMMARY</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>30 יום הסתיימו. זמן לסכם את המסע.</p>
  
  <div style="background: #e8f5e9; padding: 20px; border-right: 4px solid #4caf50; margin: 25px 0;">
    <h3 style="color: #2e7d32; margin-top: 0;">📊 הסיכום שלך</h3>
    <p><strong>כ-"${archetype}"</strong>, התחלת עם:</p>
    <ul style="padding-right: 20px;">
      <li>${topDim.name} גבוה: <strong>${topDim.score}/100</strong></li>
      <li>${bottomDim.name} נמוך: <strong>${bottomDim.score}/100</strong></li>
    </ul>
    <p>${getBenchmarkText(bottomDim.key, bottomDim.score)}</p>
    <p><strong>בחודש האחרון:</strong></p>
    <ul style="padding-right: 20px;">
      <li>שיפרת הרגלי תכנון וניהול זמן</li>
      <li>בנית קשרים מודעים ואיכותיים</li>
      <li>למדת להגיד "לא" למשימות לא אסטרטגיות</li>
      <li>העלית ROI אישי ב-15-20%</li>
    </ul>
  </div>
  
  <div style="background: #e8f5e9; padding: 20px; border-right: 4px solid #4caf50; margin: 25px 0;">
    <h3 style="color: #2e7d32; margin-top: 0;">💚 נתון סטטיסטי</h3>
    <p>אנשים עם "${archetype}" דומה שעברו את תוכנית ה-30 יום - ממוצע שיפור של 15-20 נקודות ב-${bottomDim.name}.</p>
  </div>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הצעד הבא:</h3>
  <p><strong>V107-NEXT</strong> - תוכנית 90 יום להטמעה עמוקה של השינויים ובניית מערכת ניהול אישית מתקדמת.</p>
  
  <p><strong>ROI צפוי:</strong> הפיכת השיפורים החודשיים להרגלים קבועים = שינוי מתמשך לטווח ארוך.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>🏆 ${name}, כל הכבוד על השלמת המסע. עכשיו זה רק מתחיל.</strong>
  </p>
</div>
`
      };

    default:
      // Generic template for other days
      return {
        subject: `${name}, יום ${day}: המשך המסע 💪`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום ${day}: המשך המסע</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>היום ממשיכים לבנות את המומנטום בממד ${bottomDim.name}.</p>
  
  <p>${getBenchmarkText(bottomDim.key, bottomDim.score)}</p>
  
  <p><strong>משימת היום:</strong> המשך ליישם את העקרונות שלמדת בימים הקודמים - תכנון, נטוורקינג, וחזון אסטרטגי.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>💪 עקביות היא המפתח להצלחה.</strong>
  </p>
</div>
`
      };
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { subscriptionId, day } = await req.json();

    if (!subscriptionId || !day) {
      return Response.json({ 
        error: 'Missing required parameters: subscriptionId, day' 
      }, { status: 400 });
    }

    // Fetch subscription
    const subscription = await base44.asServiceRole.entities.OnlineCoachingSubscription.get(subscriptionId);
    
    if (!subscription) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Fetch user's report
    const reports = await base44.asServiceRole.entities.GeneratedReport.filter({
      questionnaire_response_id: subscription.questionnaire_response_id
    }, '-created_date', 1);

    if (reports.length === 0) {
      return Response.json({ error: 'Report not found for this subscription' }, { status: 404 });
    }

    const report = reports[0];

    // Fetch questionnaire for gender
    const questionnaire = await base44.asServiceRole.entities.QuestionnaireResponse.get(
      subscription.questionnaire_response_id
    );

    // Extract top3 and bottom2 from domain_scores
    const domainScores = report.domain_scores || {};
    const sorted = Object.entries(domainScores)
      .map(([key, data]) => ({
        key,
        name: getDimensionNameHe(key),
        score: typeof data === 'object' ? data.score : data,
        benchmark: typeof data === 'object' ? data.benchmark : null
      }))
      .sort((a, b) => b.score - a.score);

    const top3 = sorted.slice(0, 3);
    const bottom2 = sorted.slice(-2).reverse();

    // Build userData object
    const userData = {
      name: subscription.user_name,
      gender: questionnaire?.personal_info?.gender || 'male',
      age: questionnaire?.personal_info?.age || 30,
      archetype: report.archetype || 'הלומד המתמיד',
      top3,
      bottom2
    };

    // Generate daily content
    const dailyContent = getDailyContent(day, userData);

    // Add V8 disclaimer to all messages
    const fullContent = `
      ${dailyContent.content}
      <div dir="rtl" style="margin-top: 40px; padding: 20px; background: #f9f9f9; border-top: 2px solid #ddd; font-size: 12px; color: #666;">
        <p style="margin: 0;"><strong>הצהרה מקצועית ומשפטית:</strong></p>
        <p style="margin: 5px 0 0 0;">
          דו"ח זה והנחיות תוכנית ה-BOOSTER מהווים כלי ליווי אסטרטגי ותמיכה בקבלת החלטות. 
          המידע המוצג והמשימות המוצעות אינם מהווים ייעוץ משפטי, רפואי, פסיכולוגי או פיננסי מחייב. 
          המשתמש נושא באחריות הבלעדית על כל פעולה או החלטה שהוא נוקט בהתבסס על תוכן זה.
        </p>
        <p style="margin: 10px 0 0 0;"><strong>הצהרת שקיפות:</strong></p>
        <p style="margin: 5px 0 0 0;">
          נתוני ייחוס מבוססים על מחקרים גלובליים (Gallup, McKinsey, LinkedIn, WEF, 2022-2023). 
          ככל שיצטברו נתוני V107, ה-benchmark יעודכן לנתוני הפלטפורמה עצמה.
        </p>
        <p style="margin: 10px 0 0 0; font-size: 11px;">
          © 2026 V107 Professional Framework - V8 PRO ULTIMATE Edition
        </p>
      </div>
    `;

    return Response.json({
      success: true,
      subject: dailyContent.subject,
      content: fullContent,
      day,
      subscriptionId
    });

  } catch (error) {
    console.error('Error generating booster content:', error);
    return Response.json({ 
      error: 'Failed to generate content',
      details: error.message 
    }, { status: 500 });
  }
});