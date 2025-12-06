import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Domain mapping from reportCalculations
const DOMAIN_MAPPING = {
  domain1: { name: 'הערכה עצמית ויכולת קבלת החלטות', questions: [91, 92, 93, 94, 95, 96, 97], criticalQuestions: [91, 96, 97] },
  domain2: { name: 'התמודדות עם סיכונים ואי-ודאות', questions: [64, 65, 66, 25, 21], criticalQuestions: [64, 66] },
  domain3: { name: 'מוטיבציה והתמדה', questions: [86, 87, 88, 89, 105, 106], criticalQuestions: [88, 105, 106] },
  domain4: { name: 'חזון ותכנון אסטרטגי', questions: [98, 99, 100, 101, 48, 49, 52, 53], criticalQuestions: [98, 52, 53] },
  domain5: { name: 'נטוורקינג ומינוף משאבים', questions: [41, 42, 43, 45, 83], criticalQuestions: [41, 83] }
};

const HEBREW_TO_ENGLISH_DOMAIN_NAMES = {
  'הערכה עצמית ויכולת קבלת החלטות': 'Self-Assessment and Decision-Making Ability',
  'התמודדות עם סיכונים ואי-ודאות': 'Coping with Risks and Uncertainty',
  'מוטיבציה והתמדה': 'Motivation and Perseverance',
  'חזון ותכנון אסטרטגי': 'Vision and Strategic Planning',
  'נטוורקינג ומינוף משאבים': 'Networking and Resource Leveraging',
};

const BAND_DESCRIPTIONS_MAP = {
  'he': {
    'high': 'גבוה - חזק מאוד',
    'mid': 'בינוני - יש מקום משמעותי לשיפור',
    'low': 'נמוך - דורש תשומת לב ופעולה מיידית'
  },
  'en': {
    'high': 'High - Very Strong',
    'mid': 'Mid - Significant Room for Improvement',
    'low': 'Low - Requires Immediate Attention and Action'
  }
};

function calculateDomainScore(responses, domainConfig) {
  const questionNumbers = domainConfig.questions;
  const scores = questionNumbers
    .map(q => responses[`q${q}`])
    .filter(val => val !== undefined && val !== null);

  if (scores.length === 0) return null;

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  const normalizedScore = ((avg - 1) / 6) * 100;
  return { score: normalizedScore, stdDev };
}

function checkFlags(responses, domainConfig, domainScore) {
  const criticalQuestions = domainConfig.criticalQuestions || [];
  const criticalScores = criticalQuestions.map(q => responses[`q${q}`]).filter(val => val !== undefined && val !== null);

  let redFlag = false;
  let yellowFlag = false;

  if (criticalScores.some(score => score <= 3)) {
    redFlag = true;
  } else if (domainScore.score < 50 || domainScore.stdDev > 1.8) {
    yellowFlag = true;
  }

  return { red_flag: redFlag, yellow_flag: yellowFlag };
}

function determineBand(domainScore, redFlag) {
  if (redFlag) return 'low';
  if (domainScore.score >= 70) return 'high';
  if (domainScore.score >= 50) return 'mid';
  return 'low';
}

function calculateAllDomains(responses) {
  const result = {};
  for (const [key, config] of Object.entries(DOMAIN_MAPPING)) {
    const scoreData = calculateDomainScore(responses, config);
    if (!scoreData) continue;

    const flags = checkFlags(responses, config, scoreData);
    const band = determineBand(scoreData, flags.red_flag);

    result[key] = {
      name: config.name,
      score: scoreData.score,
      stdDev: scoreData.stdDev,
      band,
      ...flags
    };
  }
  return result;
}

function identifyStrengthsAndWeaknesses(domainScores) {
  const sortedByScore = Object.entries(domainScores)
    .filter(([_, data]) => data && data.score !== undefined)
    .sort((a, b) => b[1].score - a[1].score);

  const strengths = sortedByScore.slice(0, 3).map(([_, data]) => data.name);
  const weaknesses = sortedByScore.slice(-3).reverse().map(([_, data]) => data.name);

  return { strengths, weaknesses };
}

const getLocalizedDomainName = (hebrewName, language) => {
  if (language === 'en') {
    return HEBREW_TO_ENGLISH_DOMAIN_NAMES[hebrewName] || hebrewName;
  }
  return hebrewName;
};

const getLocalizedBandDescription = (band, language) => {
  const map = BAND_DESCRIPTIONS_MAP[language] || BAND_DESCRIPTIONS_MAP['he'];
  return map[band] || band;
};

const getLocalizedPromptContent = (language, userName, userAge, userOccupation, optionalComment, validDomainScores, strengths, weaknesses) => {
  const texts = {
    he: {
      intro: `אתה מומחה בניתוח פרופילים יזמיים. קיבלת את הנתונים הבאים מתוך שאלון V107 (גרסה B6):`,
      personalDetails: `פרטים אישיים:`,
      name: `שם`,
      age: `גיל`,
      field: `תחום`,
      importantScale: `**חשוב: סולם התשובות בשאלון**`,
      scaleUniform: `- השאלון משתמש בסולם אחיד: 1 = במידה מועטה מאוד (גרוע), 7 = במידה רבה מאוד (טוב)`,
      scalePositive: `- כל השאלות מנוסחות בצורה חיובית - אין שאלות "הפוכות"`,
      normalizedScores: `- הציונים שאתה רואה כבר עברו נרמול ל-0-100:`,
      highScore: `  * ציון גבוה (קרוב ל-100) = חיובי/חזק ביותר - המשתמש השיב 6-7`,
      midScore: `  * ציון בינוני (50-65) = בינוני - המשתמש השיב 4-5`,
      lowScore: `  * ציון נמוך (קרוב ל-0) = שלילי/חלש - המשתמש השיב 1-3`,
      domainScoresHeader: `ציוני דומיינים (0-100):`,
      identifiedStrengths: `חוזקות מזוהות (דומיינים חזקים):`,
      noStrengths: `לא זוהו חוזקות בולטות במיוחד`,
      identifiedWeaknesses: `חולשות מזוהות (דומיינים חלשים):`,
      noWeaknesses: `לא זוהו חולשות בולטות`,
      userComment: `הערת המשתמש:`,
      createReport: `צור דו"ח מקצועי, אמפתי ומעשי בעברית הכולל:`,
      execSummary: `תקציר מנהלים`,
      execSummaryIncludes: `- כולל:`,
      coreStrengths: `   - 3 חוזקות מרכזיות (היו ספציפיים ומעשיים)`,
      improvementAreas: `   - 3 מוקדי שיפור דחופים (עם הסבר למה זה חשוב)`,
      conclusion: `   - פסקת מסקנה מעודדת אך ריאליסטית (2-3 שורות)`,
      domainAnalysis: `ניתוח טקסטואלי לכל דומיין (2-3 משפטים לדומיין):`,
      highScoreAnalysis: `   - ציון גבוה (>70): חיזוק, הכרה בהצלחה, המלצה איך לנצל את החוזקה הזו`,
      midScoreAnalysis: `   - ציון בינוני (50-70): הכרה במאמץ, הסבר מדוע חשוב לשפר, כיוון ראשוני`,
      lowScoreAnalysis: `   - ציון נמוך (<50): הסבר מדוע זה קריטי, השפעה על העסק, קריאה לפעולה`,
      trafficLightsTable: `טבלת רמזורים - 7-10 פריטים ממוקדים עם:`,
      tableDomain: `   - domain: שם הדומיין`,
      tableItem: `   - item: פריט ספציפי (למשל: "ניהול תזרים מזומנים")`,
      tableStatus: `   - status: green/yellow/orange/red`,
      tableNote: `   - note: הערה קצרה (1-2 שורות) מדוע זה חשוב`,
      kpis: `KPIs מוצעים - 8-10 מדדים מדידים:`,
      kpiMetric: `   - metric: שם המדד (למשל: "שיעור המרה משיחת מכירה לעסקה")`,
      kpiTarget: `   - target: יעד ריאליסטי לשנה הקרובה`,
      actionPlan: `תכנית פעולה מפורטת:`,
      quickWins: `   - Quick Wins (0-30 יום): 4-5 פעולות קטנות, מיידיות, בעלות השפעה`,
      months1_3: `   - 1-3 חודשים: 4-5 פעולות אסטרטגיות וממוקדות`,
      months4_6: `   - 4-6 חודשים: 4-5 פעולות לטווח ארוך שמחזקות את התשתית`,
      focusedRecommendations: `המלצות ממוקדות - 5-7 המלצות פרקטיות שמתמקדות בפערים הקריטיים ביותר`,
      analysisPrinciples: `**עקרונות לניתוח:**`,
      principlesScores: `- התייחס לציונים כפי שהם: גבוה=חזק, נמוך=חלש`,
      redFlag: `- דגל אדום = בעיה קריטית שדורשת פעולה מיידית`,
      yellowFlag: `- דגל צהוב = נושא שדורש תשומת לב אך לא דחוף`,
      optimisticRealistic: `- היה אופטימי אך ריאליסטי`,
      practicalRecommendations: `- תן המלצות מעשיות ולא תיאורטיות`,
      businessImpact: `- התמקד בהשפעה על העסק, לא רק על המשתמש`,
      jsonFormat: `החזר תשובה במבנה JSON בלבד, ללא טקסט נוסף.`
    },
    en: {
      intro: `You are an expert in entrepreneurial profile analysis. You have received the following data from the V107 questionnaire (Version B6):`,
      personalDetails: `Personal Details:`,
      name: `Name`,
      age: `Age`,
      field: `Field`,
      importantScale: `**Important: Questionnaire Response Scale**`,
      scaleUniform: `- The questionnaire uses a uniform scale: 1 = Very slightly (Poor), 7 = Very largely (Good)`,
      scalePositive: `- All questions are phrased positively - there are no "reverse" questions.`,
      normalizedScores: `- The scores you see have already been normalized to 0-100:`,
      highScore: `  * High score (close to 100) = Very positive/strong - User responded 6-7`,
      midScore: `  * Medium score (50-65) = Medium - User responded 4-5`,
      lowScore: `  * Low score (close to 0) = Negative/weak - User responded 1-3`,
      domainScoresHeader: `Domain Scores (0-100):`,
      identifiedStrengths: `Identified Strengths (Strong Domains):`,
      noStrengths: `No particularly prominent strengths identified`,
      identifiedWeaknesses: `Identified Weaknesses (Weak Domains):`,
      noWeaknesses: `No prominent weaknesses identified`,
      userComment: `User Comment:`,
      createReport: `Create a professional, empathetic, and practical report in English, including:`,
      execSummary: `Executive Summary`,
      execSummaryIncludes: `- includes:`,
      coreStrengths: `   - 3 core strengths (be specific and practical)`,
      improvementAreas: `   - 3 urgent areas for improvement (with explanation why it's important)`,
      conclusion: `   - An encouraging but realistic concluding paragraph (2-3 lines)`,
      domainAnalysis: `Textual Analysis for each Domain (2-3 sentences per domain):`,
      highScoreAnalysis: `   - High score (>70): Reinforce, acknowledge success, recommend how to leverage this strength.`,
      midScoreAnalysis: `   - Medium score (50-70): Acknowledge effort, explain why improvement is important, initial direction.`,
      lowScoreAnalysis: `   - Low score (<50): Explain why it's critical, impact on the business, call to action.`,
      trafficLightsTable: `Traffic Light Table - 7-10 focused items with:`,
      tableDomain: `   - domain: Domain name`,
      tableItem: `   - item: Specific item (e.g., "Cash flow management")`,
      tableStatus: `   - status: green/yellow/orange/red`,
      tableNote: `   - note: Short note (1-2 lines) why it's important`,
      kpis: `Proposed KPIs - 8-10 measurable metrics:`,
      kpiMetric: `   - metric: Metric name (e.g., "Conversion rate from sales call to deal")`,
      kpiTarget: `   - target: Realistic target for the coming year`,
      actionPlan: `Detailed Action Plan:`,
      quickWins: `   - Quick Wins (0-30 days): 4-5 small, immediate actions with impact.`,
      months1_3: `   - 1-3 Months: 4-5 strategic and focused actions.`,
      months4_6: `   - 4-6 Months: 4-5 long-term actions that strengthen the infrastructure.`,
      focusedRecommendations: `Focused Recommendations - 5-7 practical recommendations focusing on the most critical gaps.`,
      analysisPrinciples: `**Analysis Principles:**`,
      principlesScores: `- Treat scores as they are: High=strong, Low=weak.`,
      redFlag: `- Red flag = Critical issue requiring immediate action.`,
      yellowFlag: `- Yellow flag = Issue requiring attention but not urgent.`,
      optimisticRealistic: `- Be optimistic but realistic.`,
      practicalRecommendations: `- Provide practical, not theoretical, recommendations.`,
      businessImpact: `- Focus on business impact, not just the user.`,
      jsonFormat: `Return the response in JSON format only, without additional text.`
    }
  };

  const t = texts[language] || texts['he'];

  return `${t.intro}

${t.personalDetails}
- ${t.name}: ${userName}
- ${t.age}: ${userAge}
- ${t.field}: ${userOccupation}

${t.importantScale}
${t.scaleUniform}
${t.scalePositive}
${t.normalizedScores}
${t.highScore}
${t.midScore}
${t.lowScore}

${t.domainScoresHeader}
${validDomainScores}

${t.identifiedStrengths} ${strengths.length > 0 ? strengths.join(', ') : t.noStrengths}
${t.identifiedWeaknesses} ${weaknesses.length > 0 ? weaknesses.join(', ') : t.noWeaknesses}

${optionalComment ? `${t.userComment} ${optionalComment}` : ''}

${t.createReport}

1. **${t.execSummary}** ${t.execSummaryIncludes}
${t.coreStrengths}
${t.improvementAreas}
${t.conclusion}

2. **${t.domainAnalysis}**:
${t.highScoreAnalysis}
${t.midScoreAnalysis}
${t.lowScoreAnalysis}

3. **${t.trafficLightsTable}**:
${t.tableDomain}
${t.tableItem}
${t.tableStatus}
${t.tableNote}

4. **${t.kpis}**:
${t.kpiMetric}
${t.kpiTarget}

5. **${t.actionPlan}**:
${t.quickWins}
${t.months1_3}
${t.months4_6}

6. **${t.focusedRecommendations}**

${t.analysisPrinciples}
${t.principlesScores}
${t.redFlag}
${t.yellowFlag}
${t.optimisticRealistic}
${t.practicalRecommendations}
${t.businessImpact}

${t.jsonFormat}`;
};

const generateReportId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `V107-HE-${randomNum}`;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { responseId } = await req.json();

    if (!responseId) {
      return Response.json({ error: 'Missing responseId' }, { status: 400 });
    }

    // Fetch the questionnaire response
    const responses = await base44.asServiceRole.entities.QuestionnaireResponse.filter({ id: responseId });
    if (!responses || responses.length === 0) {
      return Response.json({ error: 'Response not found' }, { status: 404 });
    }

    const response = responses[0];
    const reportLanguage = response.language || 'he';

    if (!response.responses || Object.keys(response.responses).length === 0) {
      return Response.json({ 
        error: reportLanguage === 'en' ? "The questionnaire does not contain answers." : "השאלון לא מכיל תשובות." 
      }, { status: 400 });
    }

    // Check if report already exists
    const existingReports = await base44.asServiceRole.entities.GeneratedReport.filter({ 
      questionnaire_response_id: responseId 
    });
    
    if (existingReports && existingReports.length > 0) {
      return Response.json({ 
        message: 'Report already exists',
        reportId: existingReports[0].id 
      });
    }

    // Calculate scores
    const domainScores = calculateAllDomains(response.responses);
    const { strengths, weaknesses } = identifyStrengthsAndWeaknesses(domainScores);

    const userName = response.personal_info?.full_name || (reportLanguage === 'en' ? 'User' : 'משתמש');
    const userAge = response.personal_info?.age || (reportLanguage === 'en' ? 'Not specified' : 'לא צוין');
    const userOccupation = response.personal_info?.occupation || (reportLanguage === 'en' ? 'Not specified' : 'לא צוין');
    const optionalComment = response.optional_comment || '';

    const localizedValidDomainScores = Object.entries(domainScores)
      .filter(([key, data]) => data && data.score !== undefined && data.score !== null)
      .map(([key, data]) => {
        const localizedDomain = getLocalizedDomainName(data.name, reportLanguage);
        const localizedBand = getLocalizedBandDescription(data.band, reportLanguage);
        let flagText = '';
        if (data.red_flag) {
          flagText = reportLanguage === 'en' ? ' 🔴 Red Flag - Critical issue requiring urgent attention' : ' 🔴 דגל אדום - בעיה קריטית שדורשת טיפול דחוף';
        } else if (data.yellow_flag) {
          flagText = reportLanguage === 'en' ? ' 🟡 Yellow Flag - Issue requiring attention' : ' 🟡 דגל צהוב - נושא שדורש תשומת לב';
        } else {
          flagText = reportLanguage === 'en' ? ' 🟢 Normal status' : ' 🟢 מצב תקין';
        }
        return `- ${localizedDomain}: ${data.score.toFixed(1)} (${localizedBand})${flagText}`;
      })
      .join('\n');

    if (localizedValidDomainScores.length === 0) {
      return Response.json({ 
        error: reportLanguage === 'en' ? "Cannot calculate scores from responses." : "לא ניתן לחשב ציונים מהתשובות." 
      }, { status: 400 });
    }

    const localizedStrengths = strengths.map(s => getLocalizedDomainName(s, reportLanguage));
    const localizedWeaknesses = weaknesses.map(w => getLocalizedDomainName(w, reportLanguage));

    const prompt = getLocalizedPromptContent(
      reportLanguage,
      userName,
      userAge,
      userOccupation,
      optionalComment,
      localizedValidDomainScores,
      localizedStrengths,
      localizedWeaknesses
    );

    // Generate report with LLM
    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          executive_summary: {
            type: "object",
            properties: {
              top_strengths: { type: "array", items: { type: "string" } },
              improvement_areas: { type: "array", items: { type: "string" } },
              conclusion: { type: "string" }
            }
          },
          domain_analysis: {
            type: "object",
            additionalProperties: { type: "string" }
          },
          traffic_lights_table: {
            type: "array",
            items: {
              type: "object",
              properties: {
                domain: { type: "string" },
                item: { type: "string" },
                status: { type: "string" },
                note: { type: "string" }
              }
            }
          },
          kpis: {
            type: "array",
            items: {
              type: "object",
              properties: {
                metric: { type: "string" },
                target: { type: "string" }
              }
            }
          },
          action_plan: {
            type: "object",
            properties: {
              quick_wins: { type: "array", items: { type: "string" } },
              months_1_3: { type: "array", items: { type: "string" } },
              months_4_6: { type: "array", items: { type: "string" } }
            }
          },
          focused_recommendations: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });

    // Create the report
    const newReport = await base44.asServiceRole.entities.GeneratedReport.create({
      questionnaire_response_id: responseId,
      user_name: userName,
      user_email: response.personal_info?.email || (reportLanguage === 'en' ? 'Not specified' : 'לא צוין'),
      report_id: generateReportId(),
      executive_summary: llmResponse.executive_summary,
      domain_scores: domainScores,
      domain_analysis: llmResponse.domain_analysis,
      traffic_lights_table: llmResponse.traffic_lights_table,
      kpis: llmResponse.kpis,
      action_plan: llmResponse.action_plan,
      focused_recommendations: llmResponse.focused_recommendations,
      language: reportLanguage,
      status: 'completed'
    });

    return Response.json({ 
      success: true,
      reportId: newReport.id 
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ 
      error: error.message || 'Unknown error' 
    }, { status: 500 });
  }
});