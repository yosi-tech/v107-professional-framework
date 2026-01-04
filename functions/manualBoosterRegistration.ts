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

// תבנית מייל ברוכים הבאים
function getBoosterWelcomeTemplate(userName, userGender, track, language = 'he') {
  const trackNames = {
    execution: { he: 'ביצוע', en: 'Execution' },
    digital: { he: 'דיגיטל', en: 'Digital' },
    finance: { he: 'פיננסים', en: 'Finance' },
    marketing: { he: 'שיווק', en: 'Marketing' },
    management: { he: 'ניהול', en: 'Management' },
    vision: { he: 'חזון', en: 'Vision' }
  };

  const trackName = trackNames[track]?.[language] || track;
  const genderSuffix = language === 'he' && userGender === 'female' ? 'ה' : '';
  const youAre = language === 'he' ? (userGender === 'female' ? 'את' : 'אתה') : 'you';

  if (language === 'he') {
    const subject = `ברוכ${genderSuffix} הבא${genderSuffix} ל-V107 BOOSTER | המסע שלך מתחיל`;
    
    const html = `
      <div dir="rtl" style="font-family: 'Assistant', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, #667eea 100%); padding: 40px 30px; text-align: right; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; font-size: 28px; margin: 0; font-weight: bold;">🚀 V107 BOOSTER</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 10px;">ברוכ${genderSuffix} הבא${genderSuffix} למסע שינוי של 30 יום</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: right;">
          <h2 style="font-size: 22px; color: #1a202c; margin: 0 0 20px 0;">${userName}, ההצלחה שלך מתחילה כאן</h2>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.8; margin-bottom: 20px;">
            דו"ח V107 שלך זיהה את הממד המרכזי לשיפור: <strong style="color: #667eea;">${trackName}</strong>.
          </p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.8; margin-bottom: 25px;">
            בשבועיים הקרובים, ${youAre} תקבל${genderSuffix} <strong>7 משימות יומיות</strong> ממוקדות בתחום זה - משימות קצרות, פרקטיות ומותאמות באופן אישי עבורך.
          </p>
          
          <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-right: 4px solid #667eea;">
            <h3 style="color: #1e3a8a; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">📋 מבנה התוכנית (7 ימים חינמיים)</h3>
            <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; line-height: 1.8;">
              <li style="margin-bottom: 8px;"><strong>ימים 1-7:</strong> שלב הפריצה - Quick Wins ללא עלות</li>
              <li style="margin-bottom: 8px;"><strong>יום 7:</strong> הזדמנות להרחבה ל-30 יום מלאים (199 ₪)</li>
              <li><strong>ימים 8-30:</strong> בניית תשתית, העמקה ואינטגרציה מלאה</li>
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f59e0b;">
            <h3 style="color: #92400e; font-size: 18px; margin: 0 0 12px 0; font-weight: bold;">⏰ מה יקרה עכשיו?</h3>
            <p style="color: #78350f; font-size: 15px; line-height: 1.7; margin: 0;">
              <strong>מחר בבוקר</strong> תקבל${genderSuffix} את המשימה הראשונה שלך.<br/>
              כל יום, בשעה 09:00, נשלח לך משימה חדשה - קצרה, פרקטית וממוקדת בשיפור ה${trackName} שלך.
            </p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-right: 3px solid #10b981;">
            <h3 style="color: #065f46; font-size: 18px; margin: 0 0 12px 0; font-weight: bold;">💡 הטיפ החשוב ביותר</h3>
            <p style="color: #047857; font-size: 15px; line-height: 1.7; margin: 0;">
              המשימות קצרות (10-15 דקות) אבל העוצמה היא בעקביות. ${youAre} לא צריכ${genderSuffix} להיות מושלמ${genderSuffix} - רק עקבי${genderSuffix}.
            </p>
          </div>
          
          <div style="text-align: center; padding: 25px 0; border-top: 2px solid #E5E7EB; margin-top: 30px;">
            <p style="font-size: 17px; color: #1a202c; font-weight: bold; margin: 0 0 10px 0;">
              ${userName}, ${youAre} עשית${genderSuffix} את הצעד הראשון
            </p>
            <p style="font-size: 14px; color: #6B7280; margin: 0;">
              התוכנית שלך מתחילה מחר. בהצלחה במסע! 🎯
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 25px; border: 1px dashed #d97706;">
            <p style="font-size: 11px; color: #92400e; line-height: 1.6; margin: 0; text-align: right;">
              <strong>הצהרה משפטית:</strong> תוכנית V107-BOOSTER מהווה כלי ליווי אסטרטגי ותמיכה בקבלת החלטות. המידע המוצג והמשימות המוצעות נועדו לשיפור מיומנויות מקצועיות ואישיות ואינם מהווים תחליף לייעוץ משפטי, פיננסי או פסיכולוגי פרטני. האחריות על יישום המשימות והשלכותיהן מוטלת על המשתמש/ת בלבד.
            </p>
          </div>
        </div>
      </div>
    `;
    
    return { subject, html };
  } else {
    const subject = `Welcome to V107 BOOSTER | Your Journey Begins`;
    
    const html = `
      <div style="font-family: 'Arial', sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, #667eea 100%); padding: 40px 30px; text-align: left; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; font-size: 28px; margin: 0; font-weight: bold;">🚀 V107 BOOSTER</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 10px;">Welcome to your 30-day transformation journey</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <h2 style="font-size: 22px; color: #1a202c; margin: 0 0 20px 0;">${userName}, your success starts here</h2>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.8; margin-bottom: 20px;">
            Your V107 report identified your key area for improvement: <strong style="color: #667eea;">${trackName}</strong>.
          </p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.8; margin-bottom: 25px;">
            Over the next week, you'll receive <strong>7 daily tasks</strong> focused on this area - short, practical, and personally tailored for you.
          </p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f59e0b;">
            <h3 style="color: #92400e; font-size: 18px; margin: 0 0 12px 0; font-weight: bold;">⏰ What Happens Now?</h3>
            <p style="color: #78350f; font-size: 15px; line-height: 1.7; margin: 0;">
              <strong>Tomorrow morning</strong> you'll receive your first task.<br/>
              Every day at 09:00, we'll send you a new task - short, practical, and focused on improving your ${trackName}.
            </p>
          </div>
          
          <div style="text-align: center; padding: 25px 0; margin-top: 30px;">
            <p style="font-size: 17px; color: #1a202c; font-weight: bold; margin: 0 0 10px 0;">
              ${userName}, you've taken the first step
            </p>
            <p style="font-size: 14px; color: #6B7280; margin: 0;">
              Your program starts tomorrow. Good luck! 🎯
            </p>
          </div>
        </div>
      </div>
    `;
    
    return { subject, html };
  }
}

// יצירת פרומפט מותאם אישית ליצירת כל 30 המשימות
function createBulkTasksPrompt(userData, language) {
  const { userName, userGender, track, domainScores, reportAnalysis } = userData;
  
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
    return `אתה מאמן אסטרטגי בכיר ב-V107 BOOSTER. תפקידך: ליצור 30 משימות יומיות מותאמות אישית ל${userName}.

📊 נתוני ${userName}:
- מגדר: ${userGender === 'female' ? 'נקבה' : 'זכר'}
- מסלול מומלץ: ${trackName}
- ציון ${trackName}: ${domainScores[track]?.score?.toFixed(1) || 'N/A'}

${reportAnalysis ? `📝 תובנות מהדו"ח:\n${reportAnalysis.substring(0, 500)}` : ''}

✅ כללי יצירת המשימות:
1. צור 30 משימות שונות לחלוטין - ימים 1-30
2. כל משימה מתמקדת בתחום ${trackName}
3. התאם את כל הפעלים והתארים למגדר ${userGender === 'female' ? 'נקבה' : 'זכר'}
4. השתמש בשם "${userName}" באופן תכוף
5. בנה התקדמות הדרגתית - ימים 1-7 פשוטים, ימים 8-21 מעמיקים יותר, ימים 22-30 מתקדמים
6. אל תחזור על משימות - כל אחת ייחודית

📤 פורמט התפוקה (JSON בלבד):
{
  "tasks": [
    {
      "day": 1,
      "subject": "נושא המייל",
      "the_why": "ההתובנה - למה זה רלוונטי",
      "the_task": "הפעולה הקונקרטית",
      "task_title": "כותרת המשימה"
    },
    ... (30 משימות סה"כ)
  ]
}

צור עכשיו 30 משימות מותאמות אישית ל${userName}.`;
  } else {
    return `You are a senior strategic coach at V107 BOOSTER. Your role: create 30 personalized daily tasks for ${userName}.

📊 ${userName}'s Data:
- Gender: ${userGender}
- Recommended Track: ${trackName}
- ${trackName} Score: ${domainScores[track]?.score?.toFixed(1) || 'N/A'}

${reportAnalysis ? `📝 Report Insights:\n${reportAnalysis.substring(0, 500)}` : ''}

✅ Task Creation Rules:
1. Create 30 completely different tasks - days 1-30
2. Each task focuses on ${trackName} domain
3. Adapt all verbs and adjectives to gender ${userGender}
4. Use "${userName}" name frequently
5. Build gradual progression - days 1-7 simple, days 8-21 deeper, days 22-30 advanced
6. Don't repeat tasks - each one is unique

📤 Output Format (JSON only):
{
  "tasks": [
    {
      "day": 1,
      "subject": "Email subject",
      "the_why": "The Insight - why relevant",
      "the_task": "The concrete action",
      "task_title": "Task title"
    },
    ... (30 tasks total)
  ]
}

Create now 30 personalized tasks for ${userName}.`;
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

    // מצא את השאלון המקורי למידע מגדר
    let personalInfo = null;
    if (questionnaireResponseId) {
      const questionnaireResponses = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
        id: questionnaireResponseId
      });
      if (questionnaireResponses.length > 0) {
        personalInfo = questionnaireResponses[0].personal_info;
      }
    }

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

    // הכן נתונים ליצירת כל 30 המשימות
    const userGender = detectGender(userName, personalInfo);
    const domainScores = report.domain_scores || {};
    const reportAnalysis = report.report_markdown?.substring(0, 800) || '';

    const userData = {
      userName,
      userGender,
      track,
      domainScores,
      reportAnalysis
    };

    // צור פרומפט ל-LLM ליצירת כל 30 המשימות
    const prompt = createBulkTasksPrompt(userData, language);

    console.log('Generating 30 tasks for', userName);

    // קרא ל-LLM ליצירת כל 30 המשימות
    const bulkTasksData = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "integer" },
                subject: { type: "string" },
                the_why: { type: "string" },
                the_task: { type: "string" },
                task_title: { type: "string" },
                closing_encouragement: { type: "string" }
              },
              required: ["day", "subject", "the_why", "the_task", "task_title", "closing_encouragement"]
            }
          }
        },
        required: ["tasks"]
      }
    });

    console.log('Generated tasks, creating records...');

    // צור את כל 30 המשימות ב-DB
    const tasksToCreate = bulkTasksData.tasks.map(task => ({
      subscription_id: subscription.id,
      user_email: userEmail,
      user_name: userName,
      day: task.day,
      track: track,
      subject: task.subject,
      task_title: task.task_title,
      the_why: task.the_why,
      the_task: task.the_task,
      closing_encouragement: task.closing_encouragement || '',
      status: 'pending',
      language: language
    }));

    await base44.asServiceRole.entities.BoosterTask.bulkCreate(tasksToCreate);

    console.log('All 30 tasks created successfully');

    // שלח מייל ברוכים הבאים
    try {
      const emailTemplate = getBoosterWelcomeTemplate(userName, userGender, track, language);
      
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'V107 Booster',
        to: userEmail,
        subject: emailTemplate.subject,
        body: emailTemplate.html
      });

      // לוג המייל
      await base44.asServiceRole.entities.EmailLog.create({
        to_email: userEmail,
        email_type: 'booster_welcome',
        subject: emailTemplate.subject,
        related_user_email: userEmail,
        language: language
      });

      console.log('Welcome email sent to', userEmail);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // לא נעצור את התהליך בגלל שגיאה במייל
    }

    return Response.json({
      success: true,
      subscription: subscription,
      tasksCreated: tasksToCreate.length,
      welcomeEmailSent: true,
      message: `Created ${tasksToCreate.length} tasks for ${userName} and sent welcome email`
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