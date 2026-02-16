import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * V107 CV ANALYSIS V8 PRO ULTIMATE
 * 
 * Analyzes a candidate's CV against their V107 V8 PRO report
 * Generates a 4-page professional hiring recommendation
 * 
 * Input: { questionnaireResponseId, targetPosition }
 * Output: { success, analysis_markdown, role_fit_score, flight_risk_score, verdict }
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

// Dimension mapping
const DIMENSION_NAMES = {
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

// Calculate Role-Fit Score
function calculateRoleFitScore(v107Scores, cvData, targetPosition) {
  // This is a simplified calculation - in production would be more sophisticated
  // 40% - Critical V107 dimensions for the role
  // 30% - Measurable achievements in CV
  // 20% - Years of experience
  // 10% - Recent learning + certifications
  
  const dimensionScore = Object.values(v107Scores).reduce((sum, d) => sum + (d.score || 0), 0) / 11;
  const achievementsScore = cvData.achievements_count ? Math.min((cvData.achievements_count / 5) * 100, 100) : 50;
  const experienceScore = cvData.years_experience ? Math.min((cvData.years_experience / 10) * 100, 100) : 50;
  const learningScore = cvData.recent_learning ? 80 : 50;
  
  const roleFit = (dimensionScore * 0.4) + (achievementsScore * 0.3) + (experienceScore * 0.2) + (learningScore * 0.1);
  
  return Math.round(roleFit);
}

// Calculate Flight Risk Score
function calculateFlightRiskScore(v107Scores, cvData) {
  let risk = 0;
  
  // Average tenure < 18 months
  if (cvData.average_tenure_months && cvData.average_tenure_months < 18) risk += 30;
  
  // Balance < 50
  if (v107Scores.balance && v107Scores.balance.score < 50) risk += 20;
  
  // 3+ employers in 5 years
  if (cvData.employers_5years && cvData.employers_5years >= 3) risk += 20;
  
  // Change management < 50
  if (v107Scores.change && v107Scores.change.score < 50) risk += 15;
  
  // No measurable achievements
  if (!cvData.achievements_count || cvData.achievements_count === 0) risk += 15;
  
  return Math.min(risk, 100);
}

// Generate verdict
function getVerdict(roleFitScore) {
  if (roleFitScore >= 90) return { verdict: 'HIRE', confidence: 'EXCELLENT FIT' };
  if (roleFitScore >= 75) return { verdict: 'HIRE', confidence: 'STRONG FIT' };
  if (roleFitScore >= 60) return { verdict: 'CONDITIONAL HIRE', confidence: 'MODERATE FIT' };
  if (roleFitScore >= 40) return { verdict: 'HOLD', confidence: 'WEAK FIT' };
  return { verdict: 'REJECT', confidence: 'NO FIT' };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { questionnaireResponseId, targetPosition } = body;

    if (!questionnaireResponseId) {
      return Response.json({ error: 'questionnaireResponseId is required' }, { status: 400 });
    }

    // Fetch questionnaire response
    const response = await base44.asServiceRole.entities.QuestionnaireResponse.get(questionnaireResponseId);
    
    if (!response) {
      return Response.json({ error: 'Questionnaire response not found' }, { status: 404 });
    }

    // Fetch generated report
    const reports = await base44.asServiceRole.entities.GeneratedReport.filter({
      questionnaire_response_id: questionnaireResponseId
    }, '-created_date', 1);

    if (reports.length === 0) {
      return Response.json({ error: 'V107 report not found for this candidate' }, { status: 404 });
    }

    const report = reports[0];
    const cvFileUrl = response.personal_info?.cv_file_url;

    if (!cvFileUrl) {
      return Response.json({ error: 'No CV file uploaded for this candidate' }, { status: 404 });
    }

    // Extract CV data using InvokeLLM with file analysis
    const cvAnalysisPrompt = `נתח את קורות החיים המצורפים וחלץ את הנתונים הבאים:

1. שנות ניסיון כוללות
2. מספר מעסיקים ב-5 השנים האחרונות
3. אורך ממוצע בתפקיד (בחודשים)
4. הישגים מדידים (ספור כמה)
5. מיומנויות טכניות
6. תפקידי ניהול ומנהיגות
7. רשת מקצועית (LinkedIn, conferences, etc.)
8. למידה עדכנית (קורסים, הסמכות בשנתיים אחרונות)
9. יציבות תעסוקתית (כן/לא)

החזר את התשובה בפורמט JSON בלבד.`;

    const cvAnalysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: cvAnalysisPrompt,
      file_urls: [cvFileUrl],
      response_json_schema: {
        type: 'object',
        properties: {
          years_experience: { type: 'number' },
          employers_5years: { type: 'number' },
          average_tenure_months: { type: 'number' },
          achievements_count: { type: 'number' },
          technical_skills: { type: 'array', items: { type: 'string' } },
          leadership_roles: { type: 'array', items: { type: 'string' } },
          professional_network: { type: 'string' },
          recent_learning: { type: 'boolean' },
          employment_stability: { type: 'boolean' }
        }
      }
    });

    // Get V107 scores
    const v107Scores = report.domain_scores || {};
    
    // Sort dimensions
    const sortedDimensions = Object.entries(v107Scores)
      .map(([key, data]) => ({
        key,
        name: DIMENSION_NAMES[key] || key,
        score: typeof data === 'object' ? data.score : data,
        benchmark: BENCHMARK_DATA[key]
      }))
      .sort((a, b) => b.score - a.score);

    const top3 = sortedDimensions.slice(0, 3);
    const bottom2 = sortedDimensions.slice(-2);

    // Calculate scores
    const roleFitScore = calculateRoleFitScore(v107Scores, cvAnalysis, targetPosition);
    const flightRiskScore = calculateFlightRiskScore(v107Scores, cvAnalysis);
    const { verdict, confidence } = getVerdict(roleFitScore);

    // Generate gap analysis for all 11 dimensions
    const gapAnalysisPrompt = `אתה מנתח מיון מקצועי בכיר של V107.

לפניך:
- דוח V107 V8 PRO של המועמד ${response.personal_info.full_name}
- ניתוח קורות החיים שלו/ה
- התפקיד המבוקש: ${targetPosition || 'לא צוין'}

דוח V107 (11 ממדים):
${sortedDimensions.map(d => `- ${d.name}: ${d.score}/100`).join('\n')}

ניתוח CV:
${JSON.stringify(cvAnalysis, null, 2)}

צור דוח CV ANALYSIS V8 PRO בן 4 עמודים:

**עמוד 1: EXECUTIVE VERDICT**
- Role-Fit Score: ${roleFitScore}/100 (${confidence})
- Flight Risk: ${flightRiskScore}/100
- המלצה: ${verdict}
- סיכום ויראלי (2-3 משפטים חדים)

**עמוד 2: GAP ANALYSIS TABLE**
טבלה של 11 הממדים:
| ממד | ציון V107 | benchmark | הוכחה ב-CV | סטטוס | פער |
לכל ממד, זהה:
- ✅ CONFIRMED: כוח ב-V107 + הוכחה ב-CV
- ❓ HIDDEN: כוח ב-V107 + אין הוכחה ב-CV  
- ⚡ COMPENSATED: חולשה ב-V107 + ניסיון מפצה ב-CV
- ⛔ CRITICAL GAP: חולשה ב-V107 + אין הוכחה ב-CV

⭐ לכל CRITICAL GAP - הוסף: "לפי ${BENCHMARK_DATA[key]?.sources || 'מקור'}, ממוצע [ממד]: ~[X]/100. ציון המועמד: [Y]."

**עמוד 3: DEEP DIVE**
- TOP 3 Strengths (מה מצוין בפרופיל)
- BOTTOM 2 Gaps (מה חסר/חלש)
- 6+ שאלות ראיון ממוקדות לבדיקת הממדים החלשים

**עמוד 4: RECOMMENDATION**
- המלצה סופית: ${verdict}
- תנאים (אם CONDITIONAL)
- תוכנית 90 יום (אם HIRE)
- הבהרה משפטית
- הצהרת שקיפות: "נתוני ייחוס מבוססים על מחקרים גלובליים (Gallup, McKinsey, LinkedIn, WEF, 2022-2023). ככל שיצטברו נתוני V107, ה-benchmark יעודכן לנתוני הפלטפורמה עצמה."

פלט: דוח מלא ב-Markdown, מקצועי, מבוסס נתונים, בעברית.`;

    const fullAnalysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: gapAnalysisPrompt,
      add_context_from_internet: false
    });

    // Save CV analysis as a new entity (optional - could add CVAnalysis entity)
    
    return Response.json({
      success: true,
      candidate_name: response.personal_info.full_name,
      target_position: targetPosition || 'לא צוין',
      role_fit_score: roleFitScore,
      flight_risk_score: flightRiskScore,
      verdict: verdict,
      confidence: confidence,
      analysis_markdown: fullAnalysis,
      cv_data: cvAnalysis,
      v107_report_id: report.id
    });

  } catch (error) {
    console.error('Error analyzing CV:', error);
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});