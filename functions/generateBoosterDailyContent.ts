import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * V107 BOOSTER V6 PRO ULTIMATE - Daily Content Generator
 * 
 * Generates personalized daily coaching messages based on user's V6 PRO report
 * Inputs: subscriptionId, day (1-30)
 * Output: Personalized message with archetype, percentiles, success stories, WHY explanations
 */

// Helper: Get dimension name in Hebrew
const getDimensionNameHe = (dimKey) => {
  const map = {
    resilience: 'חוסן',
    flexibility: 'גמישות',
    leadership: 'מנהיגות',
    communication: 'תקשורת',
    planning: 'תכנון',
    learning: 'למידה',
    vision: 'חזון אסטרטגי',
    technology: 'טכנולוגיה',
    networking: 'נטוורקינג',
    balance: 'איזון',
    change: 'ניהול שינוי'
  };
  return map[dimKey] || dimKey;
};

// Helper: Format gender
const formatGender = (gender) => {
  return gender === 'male' ? 'ה' : 'ת';
};

// Daily content templates (1-30)
const getDailyContent = (day, userData) => {
  const { name, gender, archetype, top3, bottom2 } = userData;
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
  
  <p><strong>הקשר האסטרטגי:</strong> לפני שמתקדמים, צריך לנקות את השולחן. 80% מהמשימות שמעיקות עליך לא באמת דחופות.</p>
  
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
        subject: `${name}, יום 3: הגדרת "שעת גג" 🌙`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 3: הגדרת "שעת גג"</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>המוח שלך צריך להתאושש. זה לא אופציה - זה הכרח פיזיולוגי.</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>קבע${g} שעה קבועה לסיום יום העבודה (מומלץ: 18:00)</li>
    <li>בשעה זו - הטלפון נכנס למגירה או למצב טיסה</li>
    <li>ניתוק מוחלט מעבודה עד למחרת</li>
  </ol>
  
  <p><strong>למה זה קשה?</strong> ${topDim.name} גבוה (${topDim.score}) גורם לך להרגיש שאת${g} חייב${g} להיות זמינ${g} תמיד. אבל זמינות קבועה = שחיקה קוגניטיבית.</p>
  
  <p><strong>ROI צפוי:</strong> שיפור של 30% בריכוז למחרת + ירידה בעייפות מנטלית.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>🌟 המוח שלך הוא המנוע. תנ${g} לו לנוח.</strong>
  </p>
</div>
`
      };

    case 4:
      return {
        subject: `${name}, יום 4: מינוף נטוורקינג 🤝`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 4: מינוף נטוורקינג</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>נטוורקינג שלך: <strong>${bottomDim.name === 'networking' ? bottomDim.score : 'לא ידוע'}</strong> = ${bottomDim.name === 'networking' ? bottomDim.percentile : '?'} האחוזון התחתון.</p>
  
  <p><strong>למה זה קשה?</strong> בתור "${archetype}", ${topDim.name} גבוה (${topDim.score}) גורם לך להעדיף עבודה עצמאית על חשיפה חברתית. זה מנגנון הגנה - "לבד = שליטה".</p>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>זהה${g} אדם אחד מהרשת שיכול לסייע במשימה שתוקעת אותך</li>
    <li>שלח${g} לו הודעה קצרה:</li>
  </ol>
  
  <div style="background: #fff3cd; padding: 15px; border-right: 4px solid #ffc107; margin: 20px 0;">
    <p style="margin: 0;">"היי [שם], אני עובד${g} על [X], אשמח לשמוע את דעתך - 15 דקות שיחה השבוע?"</p>
  </div>
  
  <p><strong>ROI צפוי:</strong> קשר איכותי אחד + תובנה חיצונית = 2 in 1.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>🚀 רשת חזקה = מקדם כוח אסטרטגי.</strong>
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
  </div>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הצעת הערך:</h3>
  <p>ב-23 הימים הבאים נבנה יחד את ה"שלדה" הניהולית שתגן עלייך משחיקה ותמנף את היכולות שלך לתוצאות מדידות.</p>
  
  <p><strong>התוצר:</strong> בסיום התהליך תחזיק${g} בפרוטוקול עבודה אישי (SOP) שחוסך זמן ומייצר שקט נפשי.</p>
  
  <p><strong>עלות ההשקעה בגרסה המשופרת שלך:</strong> 199 ש"ח כולל מע"מ.</p>
  
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
    <p>מישהו עם "${archetype}" דומה - אחרי 14 יום שיפר את ${bottomDim.name} ב-12 נקודות (מ-${Math.round(bottomDim.score - 12)} ל-${Math.round(bottomDim.score)}).</p>
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
        subject: `${name}, יום 21: תיעדוף אינטרסים 🎯`,
        content: `
<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">
  <h2 style="color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px;">יום 21: תיעדוף אינטרסים</h2>
  
  <p><strong>${name},</strong></p>
  
  <p>המשפט הכי חשוב שתלמד${g} היום: <strong>"לא"</strong>.</p>
  
  <p><strong>למה זה קשה?</strong> ${topDim.name} גבוה (${topDim.score}) גורם לך להגיד "כן" לכל דבר מעניין. זה מנגנון הגנה - "כן" = שמירה על קשרים, "לא" = פחד מדחייה.</p>
  
  <p>אבל <strong>"כן" לכל דבר = "לא" לדבר החשוב</strong>.</p>
  
  <div style="background: #e8f5e9; padding: 20px; border-right: 4px solid #4caf50; margin: 25px 0;">
    <h3 style="color: #2e7d32; margin-top: 0;">💚 סיפור הצלחה</h3>
    <p>מישהו עם "${archetype}" דומה - למד להגיד "לא" ל-40% מהבקשות, וחסך 8 שעות בשבוע.</p>
  </div>
  
  <h3 style="color: #d69e2e; margin-top: 25px;">הפרוטוקול:</h3>
  <ol style="padding-right: 20px;">
    <li>זהה${g} גורם אחד שגוזל זמן ולא באמת משרת את המטרות שלך</li>
    <li>כתוב${g} הודעת "לא" מקצועית ונחרצת</li>
    <li>שלח${g} אותה היום</li>
  </ol>
  
  <p><strong>ROI צפוי:</strong> שחרור של 5-10 שעות חודשיות למשימות אסטרטגיות.</p>
  
  <p style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-right: 4px solid #1a73e8;">
    <strong>⛔ "לא" לדברים קטנים = "כן" לדברים גדולים.</strong>
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
  
  <p>חזון אסטרטגי שלך: ${bottomDim.name === 'vision' ? `<strong>${bottomDim.score}</strong> = ${bottomDim.percentile} האחוזון התחתון` : 'לא זוהה כממד חלש'}.</p>
  
  <p><strong>למה?</strong> ${topDim.name} גבוה (${topDim.score}) גורם לך להתמקד ב"עכשיו" (מה ללמוד היום?) ולא ב"בעוד 3 שנים" (לאן אני רוצה להגיע?).</p>
  
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
      <li>${topDim.name} גבוה: <strong>${topDim.score}</strong></li>
      <li>${bottomDim.name} נמוך: <strong>${bottomDim.score}</strong></li>
    </ul>
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
  
  <p>היום ממשיכים לבנות את המומנטום.</p>
  
  <p><strong>משימת היום:</strong> המשך ליישם את העקרונות שלמדת בימים הקודמים.</p>
  
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
    
    // Get user (optional, just for logging)
    let user;
    try {
      user = await base44.auth.me();
    } catch (e) {
      // Continue without user (service role call)
    }

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

    // Extract data from report
    const userData = {
      name: subscription.user_name,
      gender: 'male', // Default, should come from questionnaire if available
      archetype: report.archetype || 'The Continuous Learner',
      top3: [
        { name: 'למידה', score: 85, percentile: '80%' },
        { name: 'גמישות', score: 80, percentile: '75%' },
        { name: 'תכנון', score: 78, percentile: '70%' }
      ],
      bottom2: [
        { name: 'נטוורקינג', score: 43, percentile: '25%' },
        { name: 'חזון אסטרטגי', score: 48, percentile: '30%' }
      ]
    };

    // If report has domain_scores, use them
    if (report.domain_scores) {
      const sorted = Object.entries(report.domain_scores).sort((a, b) => b[1] - a[1]);
      userData.top3 = sorted.slice(0, 3).map(([name, score]) => ({
        name: getDimensionNameHe(name),
        score,
        percentile: `${Math.round((score / 100) * 100)}%`
      }));
      userData.bottom2 = sorted.slice(-2).map(([name, score]) => ({
        name: getDimensionNameHe(name),
        score,
        percentile: `${Math.round((score / 100) * 100)}%`
      }));
    }

    // Generate daily content
    const dailyContent = getDailyContent(day, userData);

    // Add disclaimer to all messages
    const fullContent = `
      ${dailyContent.content}
      <div dir="rtl" style="margin-top: 40px; padding: 20px; background: #f9f9f9; border-top: 2px solid #ddd; font-size: 12px; color: #666;">
        <p style="margin: 0;"><strong>הצהרה מקצועית ומשפטית:</strong></p>
        <p style="margin: 5px 0 0 0;">
          דו"ח זה והנחיות תוכנית ה-BOOSTER מהווים כלי ליווי אסטרטגי ותמיכה בקבלת החלטות. 
          המידע המוצג והמשימות המוצעות אינם מהווים ייעוץ משפטי, רפואי, פסיכולוגי או פיננסי מחייב. 
          המשתמש נושא באחריות הבלעדית על כל פעולה או החלטה שהוא נוקט בהתבסס על תוכן זה.
        </p>
        <p style="margin: 10px 0 0 0; font-size: 11px;">
          © 2026 V107 Professional Framework - V6 PRO ULTIMATE Edition
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