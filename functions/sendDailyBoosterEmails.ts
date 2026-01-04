import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// זיהוי מגדר - קודם מהשאלון/דוח, אחר כך לפי שם
function detectGender(fullName, personalInfo = null) {
  // קודם בדוק אם יש מידע מגדר בפרטים האישיים
  if (personalInfo && personalInfo.gender) {
    if (personalInfo.gender === 'female') return 'female';
    if (personalInfo.gender === 'male') return 'male';
  }
  
  // אם אין, נסה לזהות לפי שם
  const maleNames = ['יוסי', 'דוד', 'משה', 'אברהם', 'יצחק', 'יעקב', 'דניאל', 'מיכאל', 'רון', 'עומר', 'תומר', 'נועם', 'איתי', 'אלון', 'גיא'];
  const femaleNames = ['שרה', 'רחל', 'לאה', 'מרים', 'דבורה', 'רות', 'שירה', 'נועה', 'מיכל', 'תמר', 'יעל', 'דנה', 'מאיה', 'עדי', 'רוני', 'אפרת'];
  
  const firstName = fullName.split(' ')[0];
  if (femaleNames.some(name => firstName.includes(name))) return 'female';
  if (maleNames.some(name => firstName.includes(name))) return 'male';
  return 'male'; // ברירת מחדל
}

// יצירת פרומפט מותאם אישית ליצירת משימה
function createPersonalizedTaskPrompt(userData, language) {
  const { userName, userGender, track, currentDay, domainScores, responses, sentTasks, reportAnalysis } = userData;
  
  const trackNames = {
    execution: { he: 'ביצוע', en: 'Execution' },
    digital: { he: 'דיגיטל', en: 'Digital' },
    finance: { he: 'פיננסים', en: 'Finance' },
    marketing: { he: 'שיווק', en: 'Marketing' },
    management: { he: 'ניהול', en: 'Management' },
    vision: { he: 'חזון', en: 'Vision' }
  };
  
  const trackName = trackNames[track][language];
  const genderSuffix = language === 'he' && userGender === 'female' ? 'ה' : '';
  const genderPronoun = language === 'he' ? (userGender === 'female' ? 'את' : 'אתה') : 'you';
  
  if (language === 'he') {
    return `אתה מאמן אסטרטגי בכיר ב-V107 BOOSTER. תפקידך: ליצור משימה יומית מותאמת אישית ל${userName}.

📊 נתוני ${userName}:
- מגדר: ${userGender === 'female' ? 'נקבה' : 'זכר'}
- יום בתוכנית: ${currentDay}/30
- מסלול מומלץ: ${trackName}
- ציון ${trackName}: ${domainScores[track]?.score?.toFixed(1) || 'N/A'}

${reportAnalysis ? `📝 תובנות מהדו"ח:\n${reportAnalysis.substring(0, 500)}` : ''}

🚫 משימות שכבר נשלחו (אל תחזור עליהן):
${sentTasks.length > 0 ? sentTasks.map((t, i) => `${i + 1}. ${t}`).join('\n') : 'אין'}

✅ כללי יצירת המשימה:
1. התמקד בתחום ${trackName} - זה התחום החלש ביותר של ${userName}
2. התאם את הניסוח לפרופיל האישי - אם ${genderPronoun} ביצועיסט${genderSuffix}, המשימה תהיה "עצירה לתכנון". אם ${genderPronoun} הססן${genderSuffix}, המשימה תהיה "קבלת החלטה מהירה"
3. התאם את כל הפעלים והתארים למגדר ${userGender === 'female' ? 'נקבה' : 'זכר'} באופן מושלם
4. השתמש בשם "${userName}" באופן תכוף במשימה
5. אל תחזור על משימות קודמות
6. ${currentDay <= 7 ? 'זהו שלב הבסיס - משימה פשוטה ומעשית' : 'זהו שלב מתקדם - משימה מעמיקה יותר'}

📤 פורמט התפוקה (JSON בלבד):
{
  "subject": "נושא המייל (קצר, מעורר סקרנות)",
  "the_why": "ההתובנה - מדוע המשימה הזו רלוונטית ל${userName} (2-3 משפטים)",
  "the_task": "הפעולה הקונקרטית - מה ${userName} ${userGender === 'female' ? 'צריכה לעשות' : 'צריך לעשות'} היום (1-2 משפטים ברורים)",
  "task_title": "כותרת המשימה (קצרה, 5-8 מילים)"
}

צור עכשיו משימה מותאמת אישית ל${userName} עבור יום ${currentDay}.`;
  } else {
    return `You are a senior strategic coach at V107 BOOSTER. Your role: create a personalized daily task for ${userName}.

📊 ${userName}'s Data:
- Gender: ${userGender}
- Program Day: ${currentDay}/30
- Recommended Track: ${trackName}
- ${trackName} Score: ${domainScores[track]?.score?.toFixed(1) || 'N/A'}

${reportAnalysis ? `📝 Report Insights:\n${reportAnalysis.substring(0, 500)}` : ''}

🚫 Previously Sent Tasks (do not repeat):
${sentTasks.length > 0 ? sentTasks.map((t, i) => `${i + 1}. ${t}`).join('\n') : 'None'}

✅ Task Creation Rules:
1. Focus on ${trackName} - this is ${userName}'s weakest domain
2. Adapt phrasing to personal profile - if ${genderPronoun} is an "executor", the task should be "pause for planning". If ${genderPronoun} is "hesitant", the task should be "make quick decision"
3. Use "${userName}" frequently in the task
4. Do not repeat previous tasks
5. ${currentDay <= 7 ? 'This is the foundation phase - simple, practical task' : 'This is advanced phase - more in-depth task'}

📤 Output Format (JSON only):
{
  "subject": "Email subject (short, curiosity-inducing)",
  "the_why": "The Insight - why this task is relevant to ${userName} (2-3 sentences)",
  "the_task": "The Concrete Action - what ${userName} needs to do today (1-2 clear sentences)",
  "task_title": "Task Title (short, 5-8 words)"
}

Create now a personalized task for ${userName} for day ${currentDay}.`;
  }
}

// קביעת שבוע וכותרת
function getWeekInfo(day, language) {
  const weekInfo = {
    he: [
      { start: 1, end: 7, title: 'שלב הפריצה (Quick Wins - ללא עלות)' },
      { start: 8, end: 14, title: 'בניית תשתית אסטרטגית (הטמעה טכנית)' },
      { start: 15, end: 21, title: 'העמקה וצמצום חסמים (Efficiency Optimization)' },
      { start: 22, end: 30, title: 'אינטגרציה ומינוף (The New Standard)' }
    ],
    en: [
      { start: 1, end: 7, title: 'Breakthrough Phase (Quick Wins - Free)' },
      { start: 8, end: 14, title: 'Strategic Infrastructure Building (Technical Integration)' },
      { start: 15, end: 21, title: 'Deepening & Bottleneck Reduction (Efficiency Optimization)' },
      { start: 22, end: 30, title: 'Integration & Leverage (The New Standard)' }
    ]
  };
  
  const weeks = weekInfo[language] || weekInfo.he;
  for (const week of weeks) {
    if (day >= week.start && day <= week.end) {
      return { weekNumber: Math.ceil(day / 7), weekTitle: week.title };
    }
  }
  return { weekNumber: 1, weekTitle: weeks[0].title };
}

// יצירת תבנית HTML למייל - מבנה חדש בסגנון אפרת
function createEmailHTML(taskData, userData, language) {
  const { userName, track, currentDay } = userData;
  const { subject, the_why, the_task, task_title, closing_encouragement } = taskData;
  
  const trackColors = {
    execution: '#3B82F6',
    digital: '#8B5CF6',
    finance: '#10B981',
    marketing: '#F59E0B',
    management: '#6366F1',
    vision: '#EC4899'
  };
  
  const color = trackColors[track] || '#667eea';
  const weekInfo = getWeekInfo(currentDay, language);
  
  if (language === 'he') {
    return `
      <div dir="rtl" style="font-family: 'Assistant', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, ${color} 100%); padding: 35px 30px; text-align: right; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; font-size: 26px; margin: 0; font-weight: bold;">V107 BOOSTER</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">יום ${currentDay} מתוך 30 | ${weekInfo.weekTitle}</p>
        </div>
        
        <div style="background: white; padding: 35px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: right;">
          <p style="font-size: 17px; color: #374151; margin-bottom: 25px;">שלום ${userName},</p>
          
          <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-right: 5px solid ${color}; padding: 22px; margin-bottom: 28px; border-radius: 10px;">
            <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 8px 0; font-weight: bold; line-height: 1.3;">${task_title}</h2>
          </div>
          
          <div style="margin-bottom: 28px; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: ${color}; font-size: 17px; margin: 0 0 12px 0; font-weight: bold;">🎯 הערך האסטרטגי</h3>
            <p style="font-size: 15px; color: #374151; line-height: 1.8; margin: 0;">${the_why}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 28px; border-right: 4px solid ${color};">
            <h3 style="color: #1e3a8a; font-size: 17px; margin: 0 0 15px 0; font-weight: bold;">⚡ הפרוטוקול שלך היום</h3>
            <div style="font-size: 15px; color: #1F2937; line-height: 1.9;">${the_task}</div>
          </div>
          
          ${closing_encouragement ? `
          <div style="background: #f0fdf4; border-right: 3px solid #10b981; padding: 18px; border-radius: 8px; margin-bottom: 25px;">
            <p style="font-size: 15px; color: #065f46; line-height: 1.7; margin: 0; font-weight: 500;">${closing_encouragement}</p>
          </div>
          ` : ''}
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 25px; border: 1px dashed #d97706;">
            <p style="font-size: 11px; color: #92400e; line-height: 1.6; margin: 0; text-align: right;">
              <strong>הצהרה משפטית:</strong> דו"ח זה והנחיות תוכנית ה-BOOSTER מהווים כלי ליווי אסטרטגי ותמיכה בקבלת החלטות. המידע המוצג והמשימות המוצעות נועדו לשיפור מיומנויות מקצועיות ואישיות ואינם מהווים תחליף לייעוץ משפטי, פיננסי או פסיכולוגי פרטני. האחריות על יישום המשימות והשלכותיהן מוטלת על המשתמש/ת בלבד, בהתאם לשיקול דעתם המקצועי.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px 0; margin-top: 25px;">
            <p style="font-size: 13px; color: #6B7280; margin: 0;">
              ${currentDay <= 7 
                ? '🎁 התוכנית חינמית לחלוטין ל-7 הימים הראשונים'
                : '💎 את/ה בתוכנית המלאה - 30 יום של התפתחות מקצועית'
              }
            </p>
            <p style="font-size: 11px; color: #9CA3AF; margin-top: 8px;">
              V107 Professional Framework | המסגרת המקצועית המובילה
            </p>
          </div>
        </div>
      </div>
    `;
  } else {
    const weekInfo = getWeekInfo(currentDay, language);
    return `
      <div style="font-family: 'Arial', sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, ${color} 100%); padding: 35px 30px; text-align: left; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; font-size: 26px; margin: 0; font-weight: bold;">V107 BOOSTER</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">Day ${currentDay} of 30 | ${weekInfo.weekTitle}</p>
        </div>
        
        <div style="background: white; padding: 35px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: left;">
          <p style="font-size: 17px; color: #374151; margin-bottom: 25px;">Hello ${userName},</p>
          
          <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 5px solid ${color}; padding: 22px; margin-bottom: 28px; border-radius: 10px;">
            <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 8px 0; font-weight: bold; line-height: 1.3;">${task_title}</h2>
          </div>
          
          <div style="margin-bottom: 28px; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <h3 style="color: ${color}; font-size: 17px; margin: 0 0 12px 0; font-weight: bold;">🎯 Strategic Value</h3>
            <p style="font-size: 15px; color: #374151; line-height: 1.8; margin: 0;">${the_why}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 28px; border-left: 4px solid ${color};">
            <h3 style="color: #1e3a8a; font-size: 17px; margin: 0 0 15px 0; font-weight: bold;">⚡ Your Protocol Today</h3>
            <div style="font-size: 15px; color: #1F2937; line-height: 1.9;">${the_task}</div>
          </div>
          
          ${closing_encouragement ? `
          <div style="background: #f0fdf4; border-left: 3px solid #10b981; padding: 18px; border-radius: 8px; margin-bottom: 25px;">
            <p style="font-size: 15px; color: #065f46; line-height: 1.7; margin: 0; font-weight: 500;">${closing_encouragement}</p>
          </div>
          ` : ''}
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 25px; border: 1px dashed #d97706;">
            <p style="font-size: 11px; color: #92400e; line-height: 1.6; margin: 0; text-align: left;">
              <strong>Legal Disclaimer:</strong> This report and BOOSTER program guidelines are strategic support tools for decision-making. The information and suggested tasks are intended for professional and personal skill improvement and do not replace personalized legal, financial, or psychological consultation. Responsibility for implementing tasks and their consequences rests solely with the user, according to their professional judgment.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px 0; margin-top: 25px;">
            <p style="font-size: 13px; color: #6B7280; margin: 0;">
              ${currentDay <= 7 
                ? '🎁 The program is completely free for the first 7 days'
                : '💎 You are on the full program - 30 days of professional development'
              }
            </p>
            <p style="font-size: 11px; color: #9CA3AF; margin-top: 8px;">
              V107 Professional Framework | Leading Professional Development Framework
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // מצא את כל המנויים הפעילים
    const activeSubscriptions = await base44.asServiceRole.entities.OnlineCoachingSubscription.filter(
      { status: 'active' }
    );

    console.log(`Found ${activeSubscriptions.length} active subscriptions`);

    const results = [];
    const now = new Date();

    for (const subscription of activeSubscriptions) {
      try {
        const currentDay = subscription.current_day || 1;
        const track = subscription.recommended_booster_track;
        const language = subscription.language || 'he';
        const userName = subscription.user_name;

        // בדיקה אם צריך לדלג (מייל כבר נשלח היום)
        if (subscription.last_email_sent_date) {
          const lastSent = new Date(subscription.last_email_sent_date);
          const hoursSinceLastEmail = (now - lastSent) / (1000 * 60 * 60);
          
          if (hoursSinceLastEmail < 20) {
            console.log(`Skipping ${subscription.user_email} - email sent recently`);
            continue;
          }
        }

        // בדיקה אם הגיע ליום 31 - סיים
        if (currentDay > 30) {
          await base44.asServiceRole.entities.OnlineCoachingSubscription.update(
            subscription.id,
            { status: 'completed' }
          );
          
          results.push({
            email: subscription.user_email,
            day: currentDay,
            status: 'completed_program'
          });
          
          continue;
        }

        // בדיקה אם ביום 7 - שלח שאלון שביעות רצון והצעת מכירה
        if (currentDay === 7) {
          const continuationUrl = `${req.headers.get('origin')}/boostercontinuation`;
          const subject = language === 'he' 
            ? '🎉 סיימת את 7 הימים! בואו נמשיך את המסע'
            : '🎉 You completed 7 days! Let\'s continue the journey';
          
          const body = language === 'he'
            ? `
              <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="color: white; font-size: 32px; margin: 0;">🎉 מזל טוב!</h1>
                  <p style="color: white; font-size: 18px; margin-top: 10px;">סיימת את 7 ימי הבוסטר</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">שלום ${userName},</p>
                  
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    מעולה! סיימת את תוכנית הבוסטר ל-7 ימים. האם חשת בשיפור? האם תרצה להמשיך עם 23 ימים נוספים של משימות מותאמות אישית?
                  </p>
                  
                  <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <h3 style="color: #92400E; font-size: 18px; margin: 0 0 10px 0;">📦 החבילה המלאה כוללת:</h3>
                    <ul style="color: #78350F; font-size: 15px; line-height: 1.8;">
                      <li>23 ימים נוספים של משימות יומיות מותאמות אישית</li>
                      <li>ספר הפעלה אישי מבוסס הדו"ח שלך</li>
                      <li>בנק תבניות לניהול ביצוע</li>
                      <li>דו"ח התקדמות מסכם</li>
                    </ul>
                    <p style="font-size: 20px; font-weight: bold; color: #92400E; margin: 15px 0 0 0;">רק ב-199 ש"ח</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${continuationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 18px; font-weight: bold;">
                      לחץ כאן להמשך המסע 🚀
                    </a>
                  </div>
                  
                  <p style="font-size: 14px; color: #6b7280; text-align: center;">
                    לא חשת בשיפור? אין בעיה - התהליך נעצר כאן ללא כל חיוב.
                  </p>
                </div>
              </div>
            `
            : `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="color: white; font-size: 32px; margin: 0;">🎉 Congratulations!</h1>
                  <p style="color: white; font-size: 18px; margin-top: 10px;">You completed the 7-day booster</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hello ${userName},</p>
                  
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    Great! You completed the 7-day booster program. Did you experience improvement? Would you like to continue with 23 more days of personalized tasks?
                  </p>
                  
                  <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <h3 style="color: #92400E; font-size: 18px; margin: 0 0 10px 0;">📦 Full Package Includes:</h3>
                    <ul style="color: #78350F; font-size: 15px; line-height: 1.8;">
                      <li>23 additional days of personalized daily tasks</li>
                      <li>Personal action guide based on your report</li>
                      <li>Templates library for execution management</li>
                      <li>Progress summary report</li>
                    </ul>
                    <p style="font-size: 20px; font-weight: bold; color: #92400E; margin: 15px 0 0 0;">Only 199 ILS</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${continuationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 18px; font-weight: bold;">
                      Click here to continue 🚀
                    </a>
                  </div>
                  
                  <p style="font-size: 14px; color: #6b7280; text-align: center;">
                    Didn't experience improvement? No problem - the process stops here with no charge.
                  </p>
                </div>
              </div>
            `;

          await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'V107 Booster',
            to: subscription.user_email,
            subject: subject,
            body: body
          });

          // עדכן את היום אבל השאר ב-active
          await base44.asServiceRole.entities.OnlineCoachingSubscription.update(
            subscription.id,
            {
              current_day: currentDay + 1,
              last_email_sent_date: now.toISOString()
            }
          );

          results.push({
            email: subscription.user_email,
            day: currentDay,
            status: 'continuation_offer_sent'
          });
          
          continue;
        }

        // בדיקה אם ביום 8+ ולא שילם - דלג
        if (currentDay > 7 && !subscription.upgraded_to_paid) {
          console.log(`Skipping ${subscription.user_email} - day ${currentDay} but not paid`);
          continue;
        }

        // שלוף את המשימה המוכנה מראש מה-DB
        const tasks = await base44.asServiceRole.entities.BoosterTask.filter({
          subscription_id: subscription.id,
          day: currentDay,
          status: 'pending'
        });

        if (tasks.length === 0) {
          console.log(`No task found for ${subscription.user_email} day ${currentDay}`);
          results.push({
            email: subscription.user_email,
            day: currentDay,
            status: 'no_task_found'
          });
          continue;
        }

        const task = tasks[0];
        const taskData = {
          subject: task.subject,
          the_why: task.the_why,
          the_task: task.the_task,
          task_title: task.task_title
        };

        const userData = {
          userName,
          track,
          currentDay
        };

        // צור HTML למייל
        const emailBody = createEmailHTML(taskData, userData, language);

        // שלח את המייל
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'V107 Booster',
          to: subscription.user_email,
          subject: taskData.subject,
          body: emailBody
        });

        // עדכן את המשימה לסטטוס "sent"
        await base44.asServiceRole.entities.BoosterTask.update(
          task.id,
          {
            status: 'sent',
            sent_date: now.toISOString()
          }
        );

        // עדכן את המנוי
        await base44.asServiceRole.entities.OnlineCoachingSubscription.update(
          subscription.id,
          {
            current_day: currentDay + 1,
            last_email_sent_date: now.toISOString()
          }
        );

        // לוג המייל
        await base44.asServiceRole.entities.EmailLog.create({
          to_email: subscription.user_email,
          email_type: 'booster_email',
          subject: taskData.subject,
          related_user_email: subscription.user_email,
          language: language
        });

        results.push({
          email: subscription.user_email,
          day: currentDay,
          track: track,
          status: 'personalized_task_sent',
          task_title: taskData.task_title
        });

        console.log(`Sent personalized day ${currentDay} task to ${subscription.user_email} (${track})`);

      } catch (error) {
        console.error(`Error processing ${subscription.user_email}:`, error);
        results.push({
          email: subscription.user_email,
          status: 'error',
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      processed: activeSubscriptions.length,
      results: results,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Error in sendDailyBoosterEmails:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
});