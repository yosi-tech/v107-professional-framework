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
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { reportId } = body;

    if (!reportId) {
      return Response.json({ error: 'reportId is required' }, { status: 400 });
    }

    const report = await base44.asServiceRole.entities.GeneratedReport.get(reportId);
    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 });
    }

    const domainScores = report.domain_scores || {};
    const sorted = Object.entries(domainScores)
      .map(([k, v]) => ({ key: k, score: typeof v === 'object' ? v.score : v }))
      .sort((a, b) => b.score - a.score);

    const top3 = sorted.slice(0, 3);
    const bottom2 = sorted.slice(-2);
    const top3Names = top3.map(d => DIMENSIONS[d.key]?.nameHe || d.key).join(', ');
    const bottom2Names = bottom2.map(d => DIMENSIONS[d.key]?.nameHe || d.key).join(', ');

    // Fetch questionnaire to get occupation/interests
    let occupation = 'לא צוין';
    let interests = 'לא צוינו';
    let age = 30;
    try {
      if (report.questionnaire_response_id) {
        const qr = await base44.asServiceRole.entities.QuestionnaireResponse.get(report.questionnaire_response_id);
        occupation = qr?.personal_info?.occupation_field || 'לא צוין';
        interests = (qr?.personal_info?.interest_areas || []).join(', ') || 'לא צוינו';
        age = qr?.personal_info?.age || 30;
      }
    } catch (e) {
      console.log('Could not fetch questionnaire:', e.message);
    }

    const careerPrompt = `בהתבסס על הפרופיל המקצועי הבא, צור בדיוק 4 המלצות נתיבי קריירה מותאמים אישית בעברית.

פרטי המשתמש:
- שם: ${report.user_name}
- גיל: ${age}
- תחום עיסוק: ${occupation}
- תחומי עניין: ${interests}
- ארכיטיפ: ${report.archetype || 'לא צוין'}
- 3 חוזקות מובילות: ${top3Names}
- 2 אזורי פיתוח: ${bottom2Names}
- ציוני ממדים: ${JSON.stringify(domainScores)}

עבור כל נתיב קריירה, ספק:
1. title - כותרת התפקיד/הנתיב (בעברית)
2. category - קטגוריה (אחת מ: ניהול, טכנולוגיה, יזמות, ייעוץ, חינוך, שיווק, מכירות, תקשורת, פיננסים, אחר)
3. description - תיאור קצר של למה הנתיב מתאים לפרופיל (2-3 משפטים)
4. required_skills - רשימה של 3-5 מיומנויות נדרשות
5. match_percentage - אחוז התאמה (מספר בין 60 ל-95)
6. growth_potential - פוטנציאל צמיחה (גבוה/בינוני/נמוך)

החזר JSON בלבד בפורמט הבא (ללא טקסט נוסף, ללא markdown):
[{"title":"...","category":"...","description":"...","required_skills":["..."],"match_percentage":85,"growth_potential":"גבוה"}]`;

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

    const careerResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: careerPrompt }]
    });

    const careerText = careerResponse.content[0].text;
    console.log('Raw career response:', careerText);

    let focusedRecommendations = [];
    // Try markdown code block first
    const mdMatch = careerText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (mdMatch) {
      focusedRecommendations = JSON.parse(mdMatch[1].trim());
    } else {
      // Try raw JSON array
      const bracketMatch = careerText.match(/\[[\s\S]*\]/);
      if (bracketMatch) {
        focusedRecommendations = JSON.parse(bracketMatch[0]);
      }
    }

    console.log('Parsed recommendations:', JSON.stringify(focusedRecommendations));

    // Convert to array of JSON strings (entity schema expects string array)
    const recsAsStrings = focusedRecommendations.map(r => JSON.stringify(r));

    // Update the report
    await base44.asServiceRole.entities.GeneratedReport.update(reportId, {
      focused_recommendations: recsAsStrings
    });

    return Response.json({
      success: true,
      count: focusedRecommendations.length,
      recommendations: focusedRecommendations
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});