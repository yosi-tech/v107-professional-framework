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
  
  const youAre = userGender === 'female' ? 'את' : 'אתה';
  const genderVerbs = {
    need: userGender === 'female' ? 'את צריכה' : 'אתה צריך',
    can: userGender === 'female' ? 'את יכולה' : 'אתה יכול',
    should: userGender === 'female' ? 'את אמורה' : 'אתה אמור',
    have: userGender === 'female' ? 'יש לך' : 'יש לך'
  };
  
  if (language === 'he') {
    return `🎯 SYSTEM PROMPT: V107 BOOSTER TASK GENERATOR (30 Days Production Model)

אתה מאמן אסטרטגי בכיר ב-V107 BOOSTER בסגנון אפרת גאוי ויס. תפקידך: ליצור 30 משימות יומיות מותאמות אישית ל${userName}.

📊 נתוני ${userName}:
- מגדר: ${userGender === 'female' ? 'נקבה' : 'זכר'}
- מסלול מומלץ (החלש ביותר): ${trackName}
- ציון ${trackName}: ${domainScores[track]?.score?.toFixed(1) || 'N/A'}

${reportAnalysis ? `📝 תובנות מהדו"ח V107:\n${reportAnalysis.substring(0, 600)}` : ''}

🏗️ מבנה המודל (30 ימים - 4 שבועות):

**שבוע 1 (ימים 1-7): שלב הפריצה (Quick Wins - ללא עלות)**
דוגמאות למשימות: ניקוי שולחן אסטרטגי, זיהוי זוללי אנרגיה, הגדרת "שעת גג", מינוף נטוורקינג, תכנון ויזואלי, רפלקציה אקטיבית
יום 7: נקודת החלטה ומכירה - הצעת שדרוג ל-23 ימים נוספים ב-199 ₪

**שבוע 2 (ימים 8-14): בניית תשתית אסטרטגית (הטמעה טכנית)**
דוגמאות: Time Boxing, חוסן מול הסחות, Brain Dump, Deep Work, האצלה תפעולית, שעות זהב, בקרת איכות

**שבוע 3 (ימים 15-21): העמקה וצמצום חסמים (Efficiency Optimization)**
דוגמאות: אוטומציה של החלטות, ניקוי רעשים דיגיטלי, תקשורת ממוקדת, שלדה ניהולית, הגנה על חשיבה אסטרטגית, תיעדוף אינטרסים

**שבוע 4 (ימים 22-30): אינטגרציה ומינוף (The New Standard)**
דוגמאות: חיבור חוזקות, פרוטוקול חזרה למסלול, שדרוג טכנולוגי, מנהיגות מעצימה, עיגון הרגלים, ניתוח ROI מסכם, תכנון עתידי, V107 MASTER SUMMARY

✍️ כללי כתיבה (Production Logic):

**מבנה כל הודעה יומית (4 חלקים):**
1. **כותרת עוצמתית** (task_title): משפט קצר, חד, סמכותי (5-8 מילים)
2. **פתיח אסטרטגי** (the_why): הסבר למה המשימה רלוונטית ל-${userName} - קישור ל-Engine/Paradox/ROI אישי (2-3 משפטים)
3. **פרוטוקול ביצוע** (the_task): פעולות ברורות ממוספרות או מפורטות - "צעד 1... צעד 2..." או "פרוטוקול:" (2-4 משפטים)
4. **סיומת תומכת** (closing_encouragement): משפט עידוד מקצועי ואישי שמזכיר את ${userName} ואת היכולת שלו/ה

**טון וסגנון:**
- סמכותי, אנליטי, חד, "לעומתי" (מציב מראה)
- שימוש במונחים: הון קשבי, ROI אישי, SOP, Engine, Paradox, צוואר בקבוק, שעות זהב, Deep Work
- פנייה ישירה ב-${youAre} / ${genderVerbs.need} / ${genderVerbs.can}
- התאמה מגדרית מושלמת בכל פועל ותואר

**דוגמה למשימה (יום 1):**
{
  "day": 1,
  "subject": "יום 1: ניקוי שולחן אסטרטגי",
  "task_title": "ניקוי שולחן אסטרטגי - שחרור הון קשבי",
  "the_why": "${userName}, Engine שלך מבוסס ${trackName}, אך זוללי האנרגיה היומיים ${userGender === 'female' ? 'חוסמת' : 'חוסם'} ${userGender === 'female' ? 'אותך' : 'אותך'}. משימות שמעיקות מנצלות ROI אישי וגורמות לעייפות החלטות. שחרור הון קשבי הוא הצעד הראשון לפריצה.",
  "the_task": "פרוטוקול:\n1. רשמ${genderSuffix} רשימה של 5 משימות שמעיקות עליך ברגע זה\n2. סמנ${genderSuffix} 2 מהן שניתן למחוק/לדחות/להאציל\n3. מחק${genderSuffix} אותן מיד - ללא היסוס\n4. תעד${genderSuffix} את התחושה שהשתחררה",
  "closing_encouragement": "${userName}, ${youAre} ${userGender === 'female' ? 'התחלת' : 'התחלת'} לקחת פיקוד על המשאבים שלך. זהו הצעד הראשון לשליטה אסטרטגית."
}

📋 דרישות חובה:
1. צור בדיוק 30 משימות ייחודיות (day: 1 עד day: 30)
2. כל משימה ממוקדת ב${trackName} - החולשה של ${userName}
3. התאמה מגדרית מושלמת ל-${userGender === 'female' ? 'נקבה' : 'זכר'} בכל פועל, שם תואר וכינוי
4. השתמש בשם "${userName}" 2-3 פעמים בכל משימה
5. פתיח ב"${userName}," תמיד
6. סיומת תמיד מזכירה את "${userName}" ומעודדת
7. פרוטוקול ברור: "צעד 1...", "פרוטוקול:", "הפעולה:"
8. אל תחזור על משימות - כל אחת ייחודית
9. יום 7: חייב לכלול הסבר על הצעת השדרוג ל-199 ₪

📤 פורמט התפוקה (JSON בלבד):
{
  "tasks": [
    {
      "day": 1,
      "subject": "יום 1: [כותרת קצרה]",
      "task_title": "[כותרת עוצמתית]",
      "the_why": "[פתיח אסטרטגי - ${userName}, ...]",
      "the_task": "[פרוטוקול ביצוע עם מספור או רשימה]",
      "closing_encouragement": "[סיומת תומכת - ${userName}, ${youAre}...]"
    },
    ... (30 משימות סה"כ)
  ]
}

צור עכשיו 30 משימות מותאמות אישית ל${userName} בהתאם למודל אפרת.`;
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

    // מצא את השאלון המקורי למידע מגדר
    let personalInfo = null;
    if (subscription.questionnaire_response_id) {
      const questionnaireResponses = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
        id: subscription.questionnaire_response_id
      });
      if (questionnaireResponses.length > 0) {
        personalInfo = questionnaireResponses[0].personal_info;
      }
    }

    // הכן נתונים ליצירת כל 30 המשימות
    const userGender = detectGender(userName, personalInfo);
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
      user_email: subscription.user_email,
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