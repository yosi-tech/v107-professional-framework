import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// זיהוי מגדר על בסיס שם פרטי
function detectGender(fullName) {
  const maleNames = ['יוסי', 'דוד', 'משה', 'אברהם', 'יצחק', 'יעקב', 'דניאל', 'מיכאל', 'רון', 'עומר', 'תומר', 'נועם', 'איתי', 'אלון', 'גיא'];
  const femaleNames = ['שרה', 'רחל', 'לאה', 'מרים', 'דבורה', 'רות', 'שירה', 'נועה', 'מיכל', 'תמר', 'יעל', 'דנה', 'מאיה', 'עדי', 'רוני'];
  
  const firstName = fullName.split(' ')[0];
  if (femaleNames.some(name => firstName.includes(name))) return 'female';
  if (maleNames.some(name => firstName.includes(name))) return 'male';
  return 'male'; // ברירת מחדל
}

// יצירת פרומפט מותאם אישית ליצירת משימה
function createPersonalizedTaskPrompt(userData, language) {
  const { userName, userGender, track, currentDay, domainScores, sentTasks, reportAnalysis } = userData;
  
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
6. זהו שלב הבסיס - משימה פשוטה ומעשית

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
5. This is the foundation phase - simple, practical task

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

// יצירת תבנית HTML למייל
function createEmailHTML(taskData, userData, language) {
  const { userName, track, currentDay } = userData;
  const { subject, the_why, the_task, task_title } = taskData;
  
  const trackColors = {
    execution: '#3B82F6',
    digital: '#8B5CF6',
    finance: '#10B981',
    marketing: '#F59E0B',
    management: '#6366F1',
    vision: '#EC4899'
  };
  
  const color = trackColors[track] || '#667eea';
  
  if (language === 'he') {
    return `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, ${color} 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; font-size: 28px; margin: 0;">🚀 V107 BOOSTER</h1>
          <p style="color: white; font-size: 16px; margin-top: 10px; opacity: 0.9;">יום ${currentDay} מתוך 30</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; color: #374151; font-weight: bold; margin-bottom: 20px;">שלום ${userName},</p>
          
          <div style="background: #FEF3C7; border-right: 4px solid #F59E0B; padding: 20px; margin-bottom: 25px; border-radius: 8px;">
            <h2 style="color: #92400E; font-size: 20px; margin: 0 0 10px 0;">💡 המשימה שלך להיום:</h2>
            <p style="color: #78350F; font-size: 18px; font-weight: bold; margin: 0;">${task_title}</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: ${color}; font-size: 18px; margin-bottom: 10px;">🎯 למה זה חשוב ל${userName}?</h3>
            <p style="font-size: 16px; color: #374151; line-height: 1.8;">${the_why}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: ${color}; font-size: 18px; margin-bottom: 15px;">✅ הפעולה שלך היום:</h3>
            <p style="font-size: 16px; color: #1F2937; line-height: 1.8; font-weight: 500;">${the_task}</p>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 2px solid #E5E7EB; margin-top: 30px;">
            <p style="font-size: 14px; color: #6B7280; margin: 0;">
              ${currentDay <= 7 
                ? '🎁 התוכנית חינמית לחלוטין ל-7 הימים הראשונים'
                : '💎 את/ה בתוכנית המלאה - 30 יום של התפתחות'
              }
            </p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 10px;">
              V107 Professional Framework | המסגרת המקצועית המובילה בישראל
            </p>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, ${color} 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; font-size: 28px; margin: 0;">🚀 V107 BOOSTER</h1>
          <p style="color: white; font-size: 16px; margin-top: 10px; opacity: 0.9;">Day ${currentDay} of 30</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; color: #374151; font-weight: bold; margin-bottom: 20px;">Hello ${userName},</p>
          
          <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin-bottom: 25px; border-radius: 8px;">
            <h2 style="color: #92400E; font-size: 20px; margin: 0 0 10px 0;">💡 Your Task for Today:</h2>
            <p style="color: #78350F; font-size: 18px; font-weight: bold; margin: 0;">${task_title}</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: ${color}; font-size: 18px; margin-bottom: 10px;">🎯 Why This Matters for ${userName}?</h3>
            <p style="font-size: 16px; color: #374151; line-height: 1.8;">${the_why}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: ${color}; font-size: 18px; margin-bottom: 15px;">✅ Your Action Today:</h3>
            <p style="font-size: 16px; color: #1F2937; line-height: 1.8; font-weight: 500;">${the_task}</p>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 2px solid #E5E7EB; margin-top: 30px;">
            <p style="font-size: 14px; color: #6B7280; margin: 0;">
              ${currentDay <= 7 
                ? '🎁 The program is completely free for the first 7 days'
                : '💎 You are on the full program - 30 days of growth'
              }
            </p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 10px;">
              V107 Professional Framework | Leading Professional Framework
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
    
    // בדוק הרשאות אדמין
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // קבל את הנתונים מה-body
    const { userEmail, reportId } = await req.json();
    
    if (!userEmail || !reportId) {
      return Response.json({ error: 'Missing userEmail or reportId' }, { status: 400 });
    }

    // מצא את הדוח
    const reports = await base44.asServiceRole.entities.GeneratedReport.filter({ id: reportId });
    if (reports.length === 0) {
      return Response.json({ error: 'Report not found' }, { status: 404 });
    }
    
    const report = reports[0];
    const userName = report.user_name;
    const language = report.language || 'he';
    const track = report.recommended_booster_track;
    const questionnaireResponseId = report.questionnaire_response_id;

    // בדוק אם כבר קיים מנוי פעיל
    const existingSubscriptions = await base44.asServiceRole.entities.OnlineCoachingSubscription.filter({
      user_email: userEmail,
      status: 'active'
    });
    
    if (existingSubscriptions.length > 0) {
      return Response.json({ error: 'User already has an active subscription' }, { status: 400 });
    }

    // צור מנוי חדש
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30);

    const subscription = await base44.asServiceRole.entities.OnlineCoachingSubscription.create({
      user_email: userEmail,
      user_name: userName,
      questionnaire_response_id: questionnaireResponseId,
      generated_report_id: reportId,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      current_day: 1,
      status: 'active',
      language: language,
      recommended_booster_track: track,
      sent_tasks: []
    });

    // הכן נתונים למשימה הראשונה
    const userGender = detectGender(userName);
    const domainScores = report.domain_scores || {};
    const reportAnalysis = report.report_markdown?.substring(0, 800) || '';

    const userData = {
      userName,
      userGender,
      track,
      currentDay: 1,
      domainScores,
      sentTasks: [],
      reportAnalysis
    };

    // צור פרומפט ל-LLM
    const prompt = createPersonalizedTaskPrompt(userData, language);

    // קרא ל-LLM ליצירת המשימה
    const taskData = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          subject: { type: "string" },
          the_why: { type: "string" },
          the_task: { type: "string" },
          task_title: { type: "string" }
        },
        required: ["subject", "the_why", "the_task", "task_title"]
      }
    });

    // צור HTML למייל
    const emailBody = createEmailHTML(taskData, userData, language);

    // שלח את המייל הראשון מיד
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'V107 Booster',
      to: userEmail,
      subject: taskData.subject,
      body: emailBody
    });

    // עדכן את המנוי
    await base44.asServiceRole.entities.OnlineCoachingSubscription.update(
      subscription.id,
      {
        current_day: 2,
        last_email_sent_date: now.toISOString(),
        sent_tasks: [taskData.task_title]
      }
    );

    // לוג המייל
    await base44.asServiceRole.entities.EmailLog.create({
      to_email: userEmail,
      email_type: 'booster_email',
      subject: taskData.subject,
      related_user_email: userEmail,
      language: language
    });

    return Response.json({
      success: true,
      subscription: subscription,
      firstTaskSent: true,
      taskTitle: taskData.task_title
    });

  } catch (error) {
    console.error('Error in manualBoosterRegistration:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
});