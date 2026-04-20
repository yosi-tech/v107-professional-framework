import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0';

const DIMENSIONS = {
  resilience:    { nameHe: 'חוסן והחלטיות' },
  flexibility:   { nameHe: 'גמישות וחדשנות' },
  leadership:    { nameHe: 'מנהיגות ואחריות' },
  communication: { nameHe: 'תקשורת ושיתוף פעולה' },
  planning:      { nameHe: 'תכנון' },
  learning:      { nameHe: 'למידה וצמיחה' },
  vision:        { nameHe: 'חזון אסטרטגי' },
  tech:          { nameHe: 'מיומנות טכנולוגית' },
  networking:    { nameHe: 'נטוורקינג' },
  balance:       { nameHe: 'איזון ורווחה' },
  change:        { nameHe: 'ניהול שינוי' }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { reportId } = body;

    if (!reportId) {
      return Response.json({ error: 'reportId is required' }, { status: 400 });
    }

    const report = await base44.asServiceRole.entities.GeneratedReport.get(reportId);
    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 });
    }

    // Get questionnaire response for user details
    const qResponse = await base44.asServiceRole.entities.QuestionnaireResponse.get(report.questionnaire_response_id);
    
    const domainScores = report.domain_scores || {};
    const sorted = Object.entries(domainScores)
      .map(([k, v]) => ({ key: k, score: typeof v === 'object' ? v.score : v }))
      .sort((a, b) => b.score - a.score);
    
    const top3 = sorted.slice(0, 3);
    const bottom2 = sorted.slice(-2);
    const top3Names = top3.map(d => DIMENSIONS[d.key]?.nameHe || d.key).join(', ');
    const bottom2Names = bottom2.map(d => DIMENSIONS[d.key]?.nameHe || d.key).join(', ');

    const occupation = qResponse?.personal_info?.occupation_field || 'לא צוין';
    const interests = (qResponse?.personal_info?.interest_areas || []).join(', ') || 'לא צוינו';
    const targetPosition = qResponse?.personal_info?.target_position || '';
    const age = qResponse?.personal_info?.age || 30;
    const userName = report.user_name;

    console.log('Generating career paths for:', userName, 'occupation:', occupation, 'interests:', interests);

    const careerPrompt = `אתה יועץ קריירה מומחה בשוק העבודה הישראלי. בהתבסס על הפרופיל המקצועי הבא, צור בדיוק 4 המלצות נתיבי קריירה מותאמים אישית בעברית.

פרטי המשתמש:
- שם: ${userName}
- גיל: ${age}
- תחום עיסוק: ${occupation}
- תחומי עניין: ${interests}
- תפקיד יעד: ${targetPosition}
- ארכיטיפ: ${report.archetype}
- 3 חוזקות מובילות: ${top3Names}
- 2 אזורי פיתוח: ${bottom2Names}
- ציוני ממדים: ${JSON.stringify(domainScores)}

כללים חשובים:
- לפחות 2 תפקידים קרובים לעולם העיסוק/עניין של המשתמש
- לפחות 2 ענפים שונים
- תפקידים אמיתיים בלבד שקיימים בשוק העבודה הישראלי
- שכר ממוצע ריאלי בשוק הישראלי בשנת 2025-2026

עבור כל נתיב קריירה, ספק:
1. title - כותרת התפקיד (בעברית, שם תפקיד אמיתי)
2. category - קטגוריה (אחת מ: ניהול, טכנולוגיה, יזמות, ייעוץ, חינוך, שיווק, מכירות, תקשורת, פיננסים, אחר)
3. description - תיאור של 2-3 משפטים למה הנתיב מתאים לפרופיל הספציפי הזה
4. required_skills - רשימה של 3-5 מיומנויות נדרשות (בעברית)
5. match_percentage - אחוז התאמה (מספר בין 60 ל-95)
6. growth_potential - פוטנציאל צמיחה ("גבוה" / "בינוני" / "נמוך")
7. average_salary - שכר ממוצע חודשי בשקלים (מספר, לדוגמה: 18000)
8. salary_range - טווח שכר חודשי (לדוגמה: "15,000-22,000 ₪")
9. industry - ענף (בעברית)

החזר אך ורק JSON בפורמט הבא, בלי שום טקסט נוסף לפני או אחרי:
[{"title":"...","category":"...","description":"...","required_skills":["..."],"match_percentage":85,"growth_potential":"גבוה","average_salary":18000,"salary_range":"15,000-22,000 ₪","industry":"..."}]`;

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });
    
    const careerResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: careerPrompt }]
    });

    const careerText = careerResponse.content[0].text;
    console.log('Raw career response:', careerText.substring(0, 500));

    let parsedRecs = [];
    const mdMatch = careerText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (mdMatch) {
      parsedRecs = JSON.parse(mdMatch[1].trim());
    } else {
      const jsonMatch = careerText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedRecs = JSON.parse(jsonMatch[0]);
      } else {
        console.error('Could not extract JSON. Full text:', careerText);
        return Response.json({ error: 'Failed to parse career recommendations from AI' }, { status: 500 });
      }
    }

    console.log('Parsed recommendations count:', parsedRecs.length);

    const focusedRecommendations = parsedRecs.map(r => JSON.stringify(r));

    // Update the report with the career paths
    await base44.asServiceRole.entities.GeneratedReport.update(reportId, {
      focused_recommendations: focusedRecommendations
    });

    return Response.json({
      success: true,
      reportId: reportId,
      recommendations_count: focusedRecommendations.length,
      recommendations: parsedRecs
    });

  } catch (error) {
    console.error('Error generating career paths:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});