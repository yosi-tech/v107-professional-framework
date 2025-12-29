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

    const { subscriptionId } = await req.json();
    
    if (!subscriptionId) {
      return Response.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    // מצא את המנוי
    const subscriptions = await base44.asServiceRole.entities.OnlineCoachingSubscription.filter({ 
      id: subscriptionId 
    });
    
    if (subscriptions.length === 0) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    const subscription = subscriptions[0];

    // בדוק אם כבר יש משימות למנוי זה
    const existingTasks = await base44.asServiceRole.entities.BoosterTask.filter({
      subscription_id: subscriptionId
    });

    if (existingTasks.length > 0) {
      return Response.json({ 
        error: 'Tasks already exist for this subscription',
        count: existingTasks.length 
      }, { status: 400 });
    }

    // מצא את הדוח
    let report = null;
    if (subscription.generated_report_id) {
      const reports = await base44.asServiceRole.entities.GeneratedReport.filter({
        id: subscription.generated_report_id
      });
      report = reports[0];
    }

    const userName = subscription.user_name;
    const language = subscription.language || 'he';
    const track = subscription.recommended_booster_track;

    // הכן נתונים ליצירת כל 30 המשימות
    const userGender = detectGender(userName);
    const domainScores = report?.domain_scores || {};
    const reportAnalysis = report?.report_markdown?.substring(0, 800) || '';

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
                task_title: { type: "string" }
              },
              required: ["day", "subject", "the_why", "the_task", "task_title"]
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
      user_email: subscription.user_email,
      user_name: userName,
      day: task.day,
      track: track,
      subject: task.subject,
      task_title: task.task_title,
      the_why: task.the_why,
      the_task: task.the_task,
      status: 'pending',
      language: language
    }));

    await base44.asServiceRole.entities.BoosterTask.bulkCreate(tasksToCreate);

    console.log('All 30 tasks created successfully');

    return Response.json({
      success: true,
      tasksCreated: tasksToCreate.length,
      message: `Created ${tasksToCreate.length} tasks for ${userName}`
    });

  } catch (error) {
    console.error('Error in generateTasksForSubscription:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
});