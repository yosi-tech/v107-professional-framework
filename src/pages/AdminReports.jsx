import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Eye,
  Search,
  Loader2,
  Calendar,
  User as UserIcon,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  FileSearch,
  RefreshCw,
  Send,
  DollarSign,
  Users,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { calculateAllDomains, identifyStrengthsAndWeaknesses } from "@/components/utils/reportCalculations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAbandonmentEmailTemplate } from "@/components/email/AbandonmentEmailTemplate";
import { simulatePurchase } from "@/functions/simulatePurchase";

// Define the mapping for Hebrew to English domain names
const HEBREW_TO_ENGLISH_DOMAIN_NAMES = {
  'הערכה עצמית ויכולת קבלת החלטות': 'Self-Assessment and Decision-Making Ability',
  'התמודדות עם סיכונים ואי-ודאות': 'Coping with Risks and Uncertainty',
  'מוטיבציה והתמדה': 'Motivation and Perseverance',
  'חזון ותכנון אסטרטגי': 'Vision and Strategic Planning',
  'נטוורקינג ומינוף משאבים': 'Networking and Resource Leveraging',
};

// Define the mapping for band descriptions in Hebrew and English
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

// Helper function to get localized domain name
const getLocalizedDomainName = (hebrewName, language) => {
    if (language === 'en') {
        return HEBREW_TO_ENGLISH_DOMAIN_NAMES[hebrewName] || hebrewName;
    }
    return hebrewName;
};

// Helper function to get localized band description
const getLocalizedBandDescription = (band, language) => {
    const map = BAND_DESCRIPTIONS_MAP[language] || BAND_DESCRIPTIONS_MAP['he'];
    return map[band] || band;
};

// Helper function to generate the LLM prompt based on language
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


export default function AdminReports() {
  const [user, setUser] = useState(null);
  const [responses, setResponses] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingReportId, setGeneratingReportId] = useState(null);
  const [viewingResponse, setViewingResponse] = useState(null);
  const [viewingEmails, setViewingEmails] = useState(null);
  const [deletingResponseId, setDeletingResponseId] = useState(null);
  const [sendingReportId, setSendingReportId] = useState(null);
  const [sendingEmailType, setSendingEmailType] = useState(null);
  const [languageDialog, setLanguageDialog] = useState({ open: false, report: null, response: null });
  const [simulationDialog, setSimulationDialog] = useState(false);
  const [simulationForm, setSimulationForm] = useState({
    userEmail: '',
    productType: 'full_report',
    expressDelivery: false,
    language: 'he'
  });
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (currentUser.role !== 'admin') {
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(currentUser);
      await loadData();
    } catch (error) {
      console.error("Error checking admin:", error);
      window.location.href = createPageUrl("Home");
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [completedResponses, inProgressResponses, allReports, allUsers, allEmailLogs, allEmailTemplates] = await Promise.all([
        base44.entities.QuestionnaireResponse.filter({ status: 'completed' }, '-created_date'),
        base44.entities.QuestionnaireResponse.filter({ status: 'in_progress' }, '-created_date'),
        base44.entities.GeneratedReport.list('-created_date'),
        base44.entities.User.list(),
        base44.entities.EmailLog.list('-created_date'),
        base44.entities.EmailTemplate.list('-created_date')
      ]);
      setResponses([...completedResponses, ...inProgressResponses]);
      setReports(allReports);
      setUsers(allUsers);
      setEmailLogs(allEmailLogs);
      setEmailTemplates(allEmailTemplates);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const generateReportId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `V107-HE-${randomNum}`;
  };

  const generateReport = async (response, isRegenerate = false) => {
    setGeneratingReportId(response.id);
    const reportLanguage = response.language || 'he';
    
    try {
      if (!response.responses || Object.keys(response.responses).length === 0) {
        alert(reportLanguage === 'en' ? "The questionnaire does not contain answers. A report cannot be created." : "השאלון לא מכיל תשובות. לא ניתן ליצור דו\"ח.");
        setGeneratingReportId(null);
        return;
      }

      if (isRegenerate) {
        const existingReport = getReportForResponse(response.id);
        if (existingReport) {
          await base44.entities.GeneratedReport.delete(existingReport.id);
        }
      }

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
        alert(reportLanguage === 'en' ? "Cannot calculate scores from responses. Please ensure the questionnaire is properly filled." : "לא ניתן לחשב ציונים מהתשובות. אנא בדוק שהשאלון מולא כראוי.");
        setGeneratingReportId(null);
        return;
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

      const llmResponse = await base44.integrations.Core.InvokeLLM({
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

      const newReport = await base44.entities.GeneratedReport.create({
        questionnaire_response_id: response.id,
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

      await loadData();

      if (isRegenerate) {
        alert(reportLanguage === 'en' ? 'Report successfully regenerated!' : 'הדו"ח נוצר מחדש בהצלחה!');
      } else {
        window.location.href = createPageUrl(`ReportView?reportId=${newReport.id}`);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert(`${reportLanguage === 'en' ? 'Error generating report:' : 'שגיאה ביצירת הדו"ח:'} ${error.message || (reportLanguage === 'en' ? 'Unknown error' : 'שגיאה לא ידועה')}`);
    } finally {
      setGeneratingReportId(null);
    }
  };

  const deleteResponse = async (responseId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את השאלון? פעולה זו אינה הפיכה.')) {
      return;
    }

    setDeletingResponseId(responseId);
    try {
      const relatedReport = reports.find(r => r.questionnaire_response_id === responseId);
      if (relatedReport) {
        await base44.entities.GeneratedReport.delete(relatedReport.id);
      }

      const relatedEmailLogs = emailLogs.filter(log => log.related_questionnaire_response_id === responseId);
      await Promise.all(relatedEmailLogs.map(log => base44.entities.EmailLog.delete(log.id)));

      await base44.entities.QuestionnaireResponse.delete(responseId);

      await loadData();
      alert('השאלון נמחק בהצלחה');
    } catch (error) {
      console.error("Error deleting response:", error);
      alert('שגיאה במחיקת השאלון');
    } finally {
      setDeletingResponseId(null);
    }
  };

  const getReportForResponse = (responseId) => {
    return reports.find(r => r.questionnaire_response_id === responseId);
  };

  const getUserForResponse = (response) => {
    return users.find(u => u.email === response.created_by || u.email === response.personal_info?.email);
  };

  const getEmailsForResponse = (response) => {
    return emailLogs.filter(log =>
      log.related_questionnaire_response_id === response.id ||
      log.related_user_email === response.created_by ||
      log.related_user_email === response.personal_info?.email
    );
  };

  const openLanguageDialog = (report, response) => {
    setLanguageDialog({ open: true, report, response });
  };

  const closeLanguageDialog = () => {
    setLanguageDialog({ open: false, report: null, response: null });
  };

  const getReportReadyEmailContent = (report, clientName, language = 'he') => {
    const reportUrl = `${window.location.origin}${createPageUrl(`ReportView?reportId=${report.id}`)}`;
    let emailSubject, emailHtml;

    if (language === 'he') {
      emailSubject = `דו"ח V107 שלך מוכן! 📊 [${report.report_id}]`;
      emailHtml = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { direction: rtl; text-align: right; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: Arial, sans-serif; direction: rtl;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); direction: rtl;">
    
    <tr>
      <td align="center" style="padding: 40px 0; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);">
        <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: bold;">V107</h1>
        <p style="color: #e0e7ff; font-size: 14px; margin: 8px 0 0;">דו"ח ניתוח יזמי מקצועי</p>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px 30px; direction: rtl; text-align: right;">
        <h2 style="color: #1f2937; font-size: 22px; margin: 0 0 20px;">שלום ${clientName},</h2>
        
        <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 0 0 20px;">
          שמחים להודיע לך שדו"ח V107 שלך מוכן! 🎉
        </p>

        <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 0 0 20px;">
          הדו"ח המקצועי שלך כולל ניתוח מעמיק של הפרופיל היזמי שלך, המבוסס על תשובותיך לשאלון המקיף.
        </p>

        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 12px;">מה תמצא/י בדו"ח:</h3>
          <ul style="color: #1e40af; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>ניתוח מקיף של 5 תחומי ליבה יזמיים</li>
            <li>זיהוי חוזקות וחולשות מרכזיות</li>
            <li>גרפים ותצוגות חזותיות להמחשה</li>
            <li>תכנית פעולה מפורטת ל-6 חודשים</li>
            <li>המלצות מותאמות אישית</li>
            <li>KPIs מוצעים למעקב והתקדמות</li>
          </ul>
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 30px 0;">
              <a href="${reportUrl}" target="_blank" style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                📊 צפה בדו"ח המלא
              </a>
            </td>
          </tr>
        </table>

        <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 25px 0;">
          <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
            <strong>💡 טיפ:</strong> לשמירת הדו"ח כ-PDF, פתח את הקישור למעלה ולחץ על כפתור "ייצוא PDF" בראש הדו"ח.
          </p>
        </div>

        <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 20px 0 0;">
          אנו ממליצים לקרוא את הדו"ח בריכוז, ולהשתמש בתובנות והמלצות לתכנון המסלול היזמי שלך.
        </p>

        <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 20px 0 0;">
          יש שאלות? נשמח לעזור! פשוט השב/י למייל זה ואנחנו נחזור אליך בהקדם.
        </p>

        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
          <p style="color: #4b5563; line-height: 1.6; font-size: 14px; margin: 0;">
            בהצלחה במסע היזמי שלך! 🚀
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0; font-weight: 600;">
            צוות V107<br>
            עלית – יזום עסקים
          </p>
        </div>
      </td>
    </tr>

    <tr>
      <td style="background-color: #f3f4f6; padding: 30px; text-align: center;">
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">
          מזהה דו"ח: <strong>${report.report_id}</strong>
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
          © ${new Date().getFullYear()} עלית – יזום עסקים. כל הזכויות שמורות.<br>
          הדו"ח מיועד לשימוש אישי בלבד ואינו מהווה ייעוץ פיננסי או משפטי.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
    } else {
      emailSubject = `Your V107 Report is Ready! 📊 [${report.report_id}]`;
      emailHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { direction: ltr; text-align: left; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: Arial, sans-serif; direction: ltr;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); direction: ltr;">
    
    <tr>
      <td align="center" style="padding: 40px 0; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);">
        <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: bold;">V107</h1>
        <p style="color: #e0e7ff; font-size: 14px; margin: 8px 0 0;">Professional Entrepreneurial Analysis Report</p>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px 30px; direction: ltr; text-align: left;">
        <h2 style="color: #1f2937; font-size: 22px; margin: 0 0 20px;">Hello ${clientName},</h2>
        
        <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 0 0 20px;">
          We're excited to let you know that your V107 report is ready! 🎉
        </p>

        <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 0 0 20px;">
          Your professional report includes an in-depth analysis of your entrepreneurial profile, based on your comprehensive questionnaire responses.
        </p>

        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 12px;">What you'll find in your report:</h3>
          <ul style="color: #1e40af; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Comprehensive analysis of 5 core entrepreneurial domains</li>
            <li>Identification of key strengths and weaknesses</li>
            <li>Visual charts and graphics for illustration</li>
            <li>Detailed 6-month action plan</li>
            <li>Personalized recommendations</li>
            <li>Suggested KPIs for tracking and progress</li>
          </ul>
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 30px 0;">
              <a href="${reportUrl}" target="_blank" style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                📊 View Full Report
              </a>
            </td>
          </tr>
        </table>

        <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 25px 0;">
          <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
            <strong>💡 Tip:</strong> To save the report as PDF, open the link above and click the "Export PDF" button at the top of the report.
          </p>
        </div>

        <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 20px 0 0;">
          We recommend reading the report carefully and using the insights and recommendations to plan your entrepreneurial journey.
        </p>

        <p style="color: #4b5563; line-height: 1.8; font-size: 16px; margin: 20px 0 0;">
          Have questions? We're here to help! Just reply to this email and we'll get back to you soon.
        </p>

        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
          <p style="color: #4b5563; line-height: 1.6; font-size: 14px; margin: 0;">
            Best of luck on your entrepreneurial journey! 🚀
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0; font-weight: 600;">
            V107 Team<br>
            Elit – Business Initiatives
          </p>
        </div>
      </td>
    </tr>

    <tr>
      <td style="background-color: #f3f4f6; padding: 30px; text-align: center;">
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">
          Report ID: <strong>${report.report_id}</strong>
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
          © ${new Date().getFullYear()} Elit – Business Initiatives. All rights reserved.<br>
          This report is intended for personal use only and does not constitute financial or legal advice.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
    return { emailSubject, emailHtml };
  };

  const sendReportToClient = async (language) => {
    const { report, response } = languageDialog;
    if (!report || !response) {
      console.error("No report or response data in languageDialog state.");
      return;
    }
    setSendingReportId(report.id);
    closeLanguageDialog();

    try {
      const clientEmail = response.personal_info?.email || report.user_email;
      const clientName = response.personal_info?.full_name || report.user_name;

      const userExists = users.some(u => u.email === clientEmail);

      if (!userExists) {
        alert(language === 'en' ? `Cannot send email - user ${clientEmail} is not registered in the application.\n\nTo send emails, the user must be registered in the system via Dashboard -> Users.` : `לא ניתן לשלוח מייל - המשתמש ${clientEmail} לא רשום באפליקציה.\n\nכדי לשלוח מיילים, המשתמש צריך להיות רשום במערכת דרך Dashboard -> Users.`);
        setSendingReportId(null);
        return;
      }

      const { emailSubject, emailHtml } = getReportReadyEmailContent(report, clientName, language);

      await base44.integrations.Core.SendEmail({
        to: clientEmail,
        subject: emailSubject,
        body: emailHtml
      });

      await base44.entities.EmailLog.create({
        to_email: clientEmail,
        email_type: 'report_ready',
        subject: emailSubject,
        related_user_email: clientEmail,
        related_questionnaire_response_id: response.id,
        related_report_id: report.id,
        sent_manually: true,
        language: language
      });

      await loadData();
      alert(language === 'en' ? `Report successfully sent to ${clientEmail}` : `הדו"ח נשלח בהצלחה ל-${clientEmail}`);
    } catch (error) {
      console.error("Error sending report:", error);
      alert(language === 'en' ? `Error sending report: ${error.message || 'Unknown error'}` : `שגיאה בשליחת הדו"ח: ${error.message || 'שגיאה לא ידועה'}`);
    } finally {
      setSendingReportId(null);
    }
  };

  const sendManualEmail = async (emailType, response, report = null) => {
    setSendingEmailType(`${emailType}_${response.id}`);
    const emailLanguage = response.language || 'he';

    try {
      const userEmail = response.personal_info?.email || response.created_by;
      const userName = response.personal_info?.full_name || 'משתמש';

      let emailSubject = '';
      let emailHtml = '';

      const userExists = users.some(u => u.email === userEmail);
      if (!userExists) {
        alert(emailLanguage === 'en' ? `Cannot send email - user ${userEmail} is not registered in the application.\n\nTo send emails, the user must be registered in the system via Dashboard -> Users.` : `לא ניתן לשלוח מייל - המשתמש ${userEmail} לא רשום באפליקציה.\n\nכדי לשלוח מיילים, המשתמש צריך להיות רשום במערכת דרך Dashboard -> Users.`);
        setSendingEmailType(null);
        return;
      }

      if (emailType === 'abandonment_survey') {
        const surveyUrl = `${window.location.origin}${createPageUrl('Survey')}`;
        const template = getAbandonmentEmailTemplate(userName, surveyUrl, emailLanguage);
        emailSubject = template.subject;
        emailHtml = template.html;
      } else if (emailType === 'report_ready' && report) {
        const { emailSubject: reportSubject, emailHtml: reportHtml } = getReportReadyEmailContent(report, userName, emailLanguage);
        emailSubject = reportSubject;
        emailHtml = reportHtml;
      } else {
        alert(emailLanguage === 'en' ? 'Unsupported email type or missing data.' : 'סוג מייל לא נתמך או חסרים נתונים.');
        setSendingEmailType(null);
        return;
      }

      await base44.integrations.Core.SendEmail({
        to: userEmail,
        subject: emailSubject,
        body: emailHtml
      });

      await base44.entities.EmailLog.create({
        to_email: userEmail,
        email_type: emailType,
        subject: emailSubject,
        related_user_email: userEmail,
        related_questionnaire_response_id: response.id,
        related_report_id: report?.id,
        sent_manually: true,
        language: emailLanguage
      });

      await loadData();
      alert(emailLanguage === 'en' ? `Email sent successfully to ${userEmail}` : `מייל נשלח בהצלחה ל-${userEmail}`);
    } catch (error) {
      console.error("Error sending manual email:", error);
      alert(emailLanguage === 'en' ? `Error sending email: ${error.message || 'Unknown error'}` : `שגיאה בשליחת המייל: ${error.message || 'שגיאה לא ידועה'}`);
    } finally {
      setSendingEmailType(null);
    }
  };

  const filteredResponses = responses.filter(r => {
    const fullName = r.personal_info?.full_name || '';
    const email = r.personal_info?.email || '';
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getAbandonedUsers = () => {
    return users.filter(u => {
      const hasCompletedResponse = responses.some(r =>
        (r.created_by === u.email || r.personal_info?.email === u.email) &&
        r.status === 'completed'
      );
      const hasPurchased = (u.has_purchased_full_report ?? false) || (u.has_purchased_answers_download ?? false);

      return hasCompletedResponse && !hasPurchased;
    });
  };

  const getInProgressUsers = () => {
    return users.filter(u => {
      const hasInProgressResponse = responses.some(r =>
        (r.created_by === u.email || r.personal_info?.email === u.email) &&
        r.status === 'in_progress'
      );
      const hasCompletedResponse = responses.some(r =>
        (r.created_by === u.email || r.personal_info?.email === u.email) &&
        r.status === 'completed'
      );
      
      // רק אם יש in_progress ואין completed
      return hasInProgressResponse && !hasCompletedResponse;
    });
  };

  const abandonedUsers = getAbandonedUsers();
  const inProgressUsers = getInProgressUsers();

  function EmailTemplateCard({ template, onEdit }) {
    const [showPreview, setShowPreview] = React.useState(false);
    const [previewLangLocal, setPreviewLangLocal] = React.useState('he');

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 text-right">
              <div className="flex items-center gap-3 mb-3 flex-row-reverse">
                <Badge variant={template.active ? "default" : "outline"}>
                  {template.active ? 'פעיל' : 'לא פעיל'}
                </Badge>
                <h3 className="text-lg font-semibold">{template.name_he}</h3>
              </div>

              <p className="text-sm text-gray-600 mb-2">{template.description_he}</p>

              <div className="flex gap-2 flex-wrap justify-end mt-3">
                <Badge variant="outline" className="text-xs">
                  {template.template_type === 'abandonment_incomplete' && 'נטישה לפני סיום'}
                  {template.template_type === 'abandonment_reminder_96h' && 'תזכורת 96 שעות'}
                  {template.template_type === 'abandonment_after_completion' && 'נטישה אחרי סיום'}
                  {template.template_type === 'full_report_purchase' && 'רכישת דוח מלא'}
                  {template.template_type === 'answers_download_purchase' && 'רכישת תשובות'}
                  {template.template_type === 'online_coaching_purchase' && 'רכישת ליווי'}
                  {template.template_type === 'report_ready' && 'דוח מוכן'}
                  {template.template_type === 'consultation_request' && 'בקשת ייעוץ'}
                  {template.template_type === 'questionnaire_completion' && 'השלמת שאלון'}
                </Badge>

                <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                  {template.trigger_event === 'manual' && '⚙️ ידני'}
                  {template.trigger_event === 'on_navigation_away' && '🚪 ניווט החוצה'}
                  {template.trigger_event === 'after_96_hours' && '⏰ 96 שעות'}
                  {template.trigger_event === 'after_completion_no_purchase' && '✅ סיום ללא רכישה'}
                  {template.trigger_event === 'on_purchase' && '💳 רכישה'}
                  {template.trigger_event === 'on_report_generation' && '📊 יצירת דוח'}
                  {template.trigger_event === 'on_consultation_request' && '💬 בקשת ייעוץ'}
                  {template.trigger_event === 'on_questionnaire_submit' && '📝 הגשת שאלון'}
                </Badge>

                {template.include_coupon && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    <DollarSign className="w-3 h-3 ml-1" />
                    קופון {template.coupon_amount} ₪
                  </Badge>
                )}
              </div>

              {showPreview && (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={previewLangLocal === 'he' ? 'default' : 'outline'}
                      onClick={() => setPreviewLangLocal('he')}
                    >
                      🇮🇱 עברית
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={previewLangLocal === 'en' ? 'default' : 'outline'}
                      onClick={() => setPreviewLangLocal('en')}
                    >
                      🇬🇧 English
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-2 text-right">
                      {previewLangLocal === 'he' ? 'נושא: ' : 'Subject: '}
                      {previewLangLocal === 'he' ? template.subject_he : template.subject_en}
                    </p>
                    <div className="border rounded-lg bg-white overflow-hidden shadow">
                      <iframe
                        srcDoc={(previewLangLocal === 'he' ? template.content_he : template.content_en)
                          .replace(/{userName}/g, previewLangLocal === 'he' ? 'ישראל ישראלי' : 'John Doe')
                          .replace(/{questionnaireUrl}/g, '#questionnaire')
                          .replace(/{reportUrl}/g, '#report')
                          .replace(/{surveyUrl}/g, '#survey')
                          .replace(/{couponCode}/g, 'DEMO50')
                          .replace(/{purchaseUrl}/g, '#purchase')
                        }
                        className="w-full h-[400px] border-0"
                        title="Email Preview"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 ml-2" />
                {showPreview ? 'סגור תצוגה' : 'תצוגה מקדימה'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <FileText className="w-4 h-4 ml-2" />
                ערוך
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSimulatePurchase = async () => {
    if (!simulationForm.userEmail) {
      alert('יש למלא כתובת אימייל');
      return;
    }

    setIsSimulating(true);
    try {
      let price = 0;
      if (simulationForm.productType === 'full_report') {
        price = simulationForm.expressDelivery ? 378 : 299;
      } else if (simulationForm.productType === 'answers_download') {
        price = 59;
      } else if (simulationForm.productType === 'online_coaching_7days') {
        price = 497;
      }

      await simulatePurchase({
        userEmail: simulationForm.userEmail,
        productType: simulationForm.productType,
        price: price,
        expressDelivery: simulationForm.expressDelivery,
        language: simulationForm.language
      });

      alert('הרכישה דומתה בהצלחה! המייל נשלח למשתמש.');
      setSimulationDialog(false);
      setSimulationForm({
        userEmail: '',
        productType: 'full_report',
        expressDelivery: false,
        language: 'he'
      });
      await loadData();
    } catch (error) {
      console.error('Error simulating purchase:', error);
      alert(`שגיאה בדימוי הרכישה: ${error.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Button
            onClick={() => setSimulationDialog(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <DollarSign className="w-4 h-4 ml-2" />
            דמה רכישת מוצר
          </Button>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ניהול V107</h1>
            <p className="text-gray-600">ניהול שאלונים, דו"חות ומשתמשים</p>
          </div>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="reports" className="flex items-center gap-2 flex-row-reverse">
              <span>שאלונים ודו"חות</span>
              <FileText className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="abandoned" className="flex items-center gap-2 flex-row-reverse">
              <span>משתמשים שנטשו ({inProgressUsers.length + abandonedUsers.length})</span>
              <AlertTriangle className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="email-templates" className="flex items-center gap-2 flex-row-reverse">
              <span>תבניות מיילים</span>
              <Mail className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row-reverse items-center justify-between pb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <CardTitle className="text-sm font-medium text-gray-600">שאלונים שהושלמו</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-right">{responses.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row-reverse items-center justify-between pb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <CardTitle className="text-sm font-medium text-gray-600">דו"חות שנוצרו</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 text-right">{reports.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row-reverse items-center justify-between pb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <CardTitle className="text-sm font-medium text-gray-600">ממתינים לדו"ח</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600 text-right">
                    {responses.length - reports.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="חיפוש לפי שם או אימייל..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredResponses.map((response) => {
                const existingReport = getReportForResponse(response.id);
                const userInfo = getUserForResponse(response);
                const emails = getEmailsForResponse(response);
                const isGenerating = generatingReportId === response.id;
                const isDeleting = deletingResponseId === response.id;
                const isSendingManualAbandonment = sendingEmailType === `abandonment_survey_${response.id}`;
                const isSendingManualReportReady = existingReport && sendingEmailType === `report_ready_${existingReport.id}`;
                const fullName = response.personal_info?.full_name || 'שם לא זמין';
                const email = response.personal_info?.email || 'אימייל לא זמין';
                const age = response.personal_info?.age;
                const occupation = response.personal_info?.occupation;

                const hasPurchasedFullReport = userInfo?.has_purchased_full_report ?? false;
                const hasPurchasedAnswersDownload = userInfo?.has_purchased_answers_download ?? false;
                const expressDelivery = userInfo?.express_delivery ?? false;
                const paymentAmount = userInfo?.payment_amount ?? 0;

                const purchaseStatus = hasPurchasedFullReport ?
                  `דו"ח מלא${expressDelivery ? ' + מואץ' : ''}` :
                  hasPurchasedAnswersDownload ?
                  'תשובות בלבד' :
                  'לא רכש';

                return (
                  <Card key={response.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3 flex-row-reverse">
                            <div className="flex-1 min-w-0 text-right">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {fullName}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-gray-600 flex-wrap justify-end">
                                <span className="flex items-center gap-1 flex-row-reverse">
                                  <span className="truncate">{email}</span>
                                  <Mail className="w-4 h-4" />
                                </span>
                                <span className="flex items-center gap-1 flex-row-reverse">
                                  {format(new Date(response.created_date), 'dd/MM/yyyy HH:mm')}
                                  <Calendar className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserIcon className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>

                          <div className="flex gap-2 mb-3 flex-wrap justify-end">
                            <Badge variant="outline" className="flex items-center gap-1 flex-row-reverse">
                              {purchaseStatus}
                              {paymentAmount > 0 && ` (${paymentAmount} ₪)`}
                              <DollarSign className="w-3 h-3" />
                            </Badge>

                            {emails.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingEmails(emails)}
                                className="h-6 text-xs flex items-center gap-1 flex-row-reverse"
                              >
                                {emails.length} מיילים
                                <Mail className="w-3 h-3" />
                              </Button>
                            )}

                            {existingReport && (
                              <Badge className="bg-green-100 text-green-800 flex items-center gap-1 flex-row-reverse">
                                יש דו"ח
                                <CheckCircle className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>

                          {(age || occupation) && (
                            <div className="text-sm text-gray-600 text-right">
                              {age && `גיל: ${age}`}
                              {age && occupation && ' · '}
                              {occupation && `תחום: ${occupation}`}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" disabled={isDeleting || isGenerating}>
                                ▼ פעולות
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                              <DropdownMenuItem onClick={() => setViewingResponse(response)}>
                                <span className="ml-auto">צפה בשאלון</span>
                                <FileSearch className="w-4 h-4 mr-2" />
                              </DropdownMenuItem>

                              {existingReport ? (
                                <>
                                  <DropdownMenuItem asChild>
                                    <Link to={createPageUrl(`ReportView?reportId=${existingReport.id}`)}>
                                      <span className="ml-auto">צפייה בדו"ח</span>
                                      <Eye className="w-4 h-4 mr-2" />
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={createPageUrl(`QuestionnaireExport?responseId=${response.id}`)}>
                                      <span className="ml-auto">שאלון מלא</span>
                                      <FileText className="w-4 h-4 mr-2" />
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => generateReport(response, true)}
                                    disabled={isGenerating}
                                  >
                                    <span className="ml-auto">צור דו"ח מחדש</span>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openLanguageDialog(existingReport, response)}
                                    disabled={sendingReportId === existingReport.id || isSendingManualReportReady}
                                  >
                                    <span className="ml-auto">שלח דו"ח ללקוח</span>
                                    <Send className="w-4 h-4 mr-2" />
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => generateReport(response, false)}
                                  disabled={isGenerating}
                                >
                                  <span className="ml-auto">{isGenerating ? 'יוצר דו"ח...' : 'צור דו"ח'}</span>
                                  <FileText className="w-4 h-4 mr-2" />
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                onClick={() => sendManualEmail('abandonment_survey', response)}
                                disabled={isSendingManualAbandonment || isGenerating || isDeleting || isSendingManualReportReady}
                              >
                                <span className="ml-auto">מייל נטישה</span>
                                <Mail className="w-4 h-4 mr-2" />
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => deleteResponse(response.id)}
                                disabled={isDeleting || isGenerating || isSendingManualAbandonment || isSendingManualReportReady}
                                className="text-red-600"
                              >
                                <span className="ml-auto">מחק</span>
                                <Trash2 className="w-4 h-4 mr-2" />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredResponses.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm ? 'לא נמצאו תוצאות' : 'אין שאלונים שהושלמו'}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? 'נסה לשנות את מילות החיפוש'
                        : 'כאשר משתמשים ישלימו את השאלון, הם יופיעו כאן'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="abandoned">
            <div className="space-y-6">
              {/* משתמשים שהתחילו ולא סיימו */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2 justify-end">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      {inProgressUsers.length}
                    </Badge>
                    <span>משתמשים שהתחילו שאלון ולא סיימו</span>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-1 text-right">משתמשים שהתחילו למלא את השאלון אך עדיין לא השלימו אותו.</p>
                </CardHeader>
                <CardContent>
                  {inProgressUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">אין משתמשים עם שאלון בתהליך</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inProgressUsers.map(user => {
                        const userResponse = responses.find(r =>
                          (r.created_by === user.email || r.personal_info?.email === user.email) &&
                          r.status === 'in_progress'
                        );
                        const isSending = sendingEmailType === `abandonment_survey_${userResponse?.id}`;
                        
                        // ספירת מיילי נטישה שנשלחו למשתמש
                        const abandonmentEmailsCount = emailLogs.filter(log =>
                          (log.email_type === 'abandonment_survey' || log.email_type === 'abandonment_survey_reminder') &&
                          (log.related_user_email === user.email || log.to_email === user.email)
                        ).length;

                        return (
                          <Card key={user.id} className="border-yellow-300 bg-yellow-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-row-reverse">
                                  <Button
                                    onClick={() => userResponse && sendManualEmail('abandonment_survey', userResponse)}
                                    disabled={!userResponse || isSending}
                                    className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2 flex-row-reverse"
                                  >
                                    <span>שלח מייל נטישה</span>
                                    {isSending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Mail className="w-4 h-4" />
                                    )}
                                  </Button>
                                  
                                  <Badge variant="outline" className="bg-yellow-100 border-yellow-400 text-yellow-800 flex items-center gap-1 flex-row-reverse">
                                    <Clock className="w-3 h-3" />
                                    שאלון בתהליך
                                  </Badge>
                                  
                                  {abandonmentEmailsCount > 0 ? (
                                    <Badge variant="outline" className="bg-purple-100 border-purple-300 text-purple-800 flex items-center gap-1 flex-row-reverse">
                                      <Mail className="w-3 h-3" />
                                      {abandonmentEmailsCount} מיילי נטישה נשלחו
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-600 flex items-center gap-1 flex-row-reverse">
                                      <Mail className="w-3 h-3" />
                                      לא נשלח מייל נטישה
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="text-right">
                                  <h4 className="font-semibold">{user.full_name || 'שם לא זמין'}</h4>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                  {userResponse?.created_date && (
                                    <>
                                      <p className="text-xs text-gray-500 mt-1">
                                        התחיל: {format(new Date(userResponse.created_date), 'dd/MM/yyyy HH:mm')}
                                      </p>
                                      <p className="text-xs font-semibold text-yellow-700 mt-1">
                                        {(() => {
                                          const hoursAgo = Math.floor((Date.now() - new Date(userResponse.created_date).getTime()) / (1000 * 60 * 60));
                                          return `עברו ${hoursAgo} שעות`;
                                        })()}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* משתמשים שסיימו ולא רכשו */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2 justify-end">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                      {abandonedUsers.length}
                    </Badge>
                    <span>משתמשים שסיימו שאלון אך לא רכשו דו"ח</span>
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-1 text-right">רשימת משתמשים שהשלימו שאלון V107 אך לא רכשו דו"ח מלא או הורדת תשובות.</p>
                </CardHeader>
                <CardContent>
                {abandonedUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">אין משתמשים שנטשו כרגע. כל הכבוד!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {abandonedUsers.map(user => {
                      const userResponse = responses.find(r =>
                        r.created_by === user.email || r.personal_info?.email === user.email
                      );
                      const isSending = sendingEmailType === `abandonment_survey_${userResponse?.id}`;

                      // בדיקה האם המשתמש השלים שאלון לאחר שנשלח לו מייל נטישה
                      const abandonmentEmail = emailLogs.find(log => 
                        log.email_type === 'abandonment_survey' && 
                        (log.related_user_email === user.email || log.to_email === user.email)
                      );
                      const completedAfterAbandonment = abandonmentEmail && userResponse && 
                        new Date(userResponse.created_date) > new Date(abandonmentEmail.created_date);

                      // ספירת מיילי נטישה שנשלחו למשתמש
                      const abandonmentEmailsCount = emailLogs.filter(log =>
                        (log.email_type === 'abandonment_survey' || log.email_type === 'abandonment_survey_reminder') &&
                        (log.related_user_email === user.email || log.to_email === user.email)
                      ).length;

                      return (
                        <Card key={user.id} className={completedAfterAbandonment ? "border-green-300 bg-green-50" : "border-orange-200"}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-row-reverse">
                                {completedAfterAbandonment ? (
                                  <Badge className="bg-green-600 text-white flex items-center gap-1 flex-row-reverse">
                                    <CheckCircle className="w-4 h-4" />
                                    השלים לאחר מייל נטישה
                                  </Badge>
                                ) : (
                                  <Button
                                    onClick={() => userResponse && sendManualEmail('abandonment_survey', userResponse)}
                                    disabled={!userResponse || isSending}
                                    className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2 flex-row-reverse"
                                  >
                                    <span>שלח מייל נטישה</span>
                                    {isSending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Mail className="w-4 h-4" />
                                    )}
                                  </Button>
                                )}

                                <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800 flex items-center gap-1 flex-row-reverse">
                                  <CheckCircle className="w-3 h-3" />
                                  השלים שאלון
                                </Badge>

                                {abandonmentEmailsCount > 0 ? (
                                  <Badge variant="outline" className="bg-purple-100 border-purple-300 text-purple-800 flex items-center gap-1 flex-row-reverse">
                                    <Mail className="w-3 h-3" />
                                    {abandonmentEmailsCount} מיילי נטישה נשלחו
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-600 flex items-center gap-1 flex-row-reverse">
                                    <Mail className="w-3 h-3" />
                                    לא נשלח מייל נטישה
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="text-right">
                                <h4 className="font-semibold">{user.full_name || 'שם לא זמין'}</h4>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                {userResponse?.created_date && (
                                  <>
                                    <p className="text-xs text-gray-500 mt-1">
                                      סיים שאלון: {format(new Date(userResponse.created_date), 'dd/MM/yyyy HH:mm')}
                                    </p>
                                    <p className="text-xs font-semibold text-orange-600 mt-1">
                                      {(() => {
                                        const hoursAgo = Math.floor((Date.now() - new Date(userResponse.created_date).getTime()) / (1000 * 60 * 60));
                                        return `עברו ${hoursAgo} שעות`;
                                      })()}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="email-templates">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => {
                    setEditingTemplate(null);
                    setTemplateDialog(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4 ml-2" />
                  תבנית מייל חדשה
                </Button>
              </div>

              <div className="grid gap-4">
                {emailTemplates.map(template => {
                  const [showPreview, setShowPreview] = React.useState(false);
                  const [previewLangLocal, setPreviewLangLocal] = React.useState('he');

                  return (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-3 mb-3 flex-row-reverse">
                            <Badge variant={template.active ? "default" : "outline"}>
                              {template.active ? 'פעיל' : 'לא פעיל'}
                            </Badge>
                            <h3 className="text-lg font-semibold">{template.name_he}</h3>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{template.description_he}</p>

                          <div className="flex gap-2 flex-wrap justify-end mt-3">
                            <Badge variant="outline" className="text-xs">
                              {template.template_type === 'abandonment_incomplete' && 'נטישה לפני סיום'}
                              {template.template_type === 'abandonment_reminder_96h' && 'תזכורת 96 שעות'}
                              {template.template_type === 'abandonment_after_completion' && 'נטישה אחרי סיום'}
                              {template.template_type === 'full_report_purchase' && 'רכישת דוח מלא'}
                              {template.template_type === 'answers_download_purchase' && 'רכישת תשובות'}
                              {template.template_type === 'online_coaching_purchase' && 'רכישת ליווי'}
                              {template.template_type === 'report_ready' && 'דוח מוכן'}
                              {template.template_type === 'consultation_request' && 'בקשת ייעוץ'}
                              {template.template_type === 'questionnaire_completion' && 'השלמת שאלון'}
                            </Badge>

                            <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                              {template.trigger_event === 'manual' && '⚙️ ידני'}
                              {template.trigger_event === 'on_navigation_away' && '🚪 ניווט החוצה'}
                              {template.trigger_event === 'after_96_hours' && '⏰ 96 שעות'}
                              {template.trigger_event === 'after_completion_no_purchase' && '✅ סיום ללא רכישה'}
                              {template.trigger_event === 'on_purchase' && '💳 רכישה'}
                              {template.trigger_event === 'on_report_generation' && '📊 יצירת דוח'}
                              {template.trigger_event === 'on_consultation_request' && '💬 בקשת ייעוץ'}
                              {template.trigger_event === 'on_questionnaire_submit' && '📝 הגשת שאלון'}
                            </Badge>

                            {template.include_coupon && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                <DollarSign className="w-3 h-3 ml-1" />
                                קופון {template.coupon_amount} ₪
                              </Badge>
                            )}
                          </div>

                          {showPreview && (
                            <div className="mt-4 space-y-3">
                              <div className="flex justify-center gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={previewLangLocal === 'he' ? 'default' : 'outline'}
                                  onClick={() => setPreviewLangLocal('he')}
                                >
                                  🇮🇱 עברית
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={previewLangLocal === 'en' ? 'default' : 'outline'}
                                  onClick={() => setPreviewLangLocal('en')}
                                >
                                  🇬🇧 English
                                </Button>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm font-medium mb-2 text-right">
                                  {previewLangLocal === 'he' ? 'נושא: ' : 'Subject: '}
                                  {previewLangLocal === 'he' ? template.subject_he : template.subject_en}
                                </p>
                                <div className="border rounded-lg bg-white overflow-hidden shadow">
                                  <iframe
                                    srcDoc={(previewLangLocal === 'he' ? template.content_he : template.content_en)
                                      .replace(/{userName}/g, previewLangLocal === 'he' ? 'ישראל ישראלי' : 'John Doe')
                                      .replace(/{questionnaireUrl}/g, '#questionnaire')
                                      .replace(/{reportUrl}/g, '#report')
                                      .replace(/{surveyUrl}/g, '#survey')
                                      .replace(/{couponCode}/g, 'DEMO50')
                                      .replace(/{purchaseUrl}/g, '#purchase')
                                    }
                                    className="w-full h-[400px] border-0"
                                    title="Email Preview"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            {showPreview ? 'סגור תצוגה' : 'תצוגה מקדימה'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTemplate(template);
                              setTemplateDialog(true);
                            }}
                          >
                            <FileText className="w-4 h-4 ml-2" />
                            ערוך
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
                })}

                {emailTemplates.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        אין תבניות מיילים
                      </h3>
                      <p className="text-gray-600 mb-4">
                        צור תבניות מיילים אוטומטיות למערכת
                      </p>
                      <Button
                        onClick={() => {
                          setEditingTemplate(null);
                          setTemplateDialog(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Mail className="w-4 h-4 ml-2" />
                        צור תבנית ראשונה
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          </Tabs>
          </div>

      <Dialog open={!!viewingResponse} onOpenChange={() => setViewingResponse(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>צפייה בשאלון - {viewingResponse?.personal_info?.full_name}</DialogTitle>
            <DialogDescription>
              תשובות מלאות לשאלון V107
            </DialogDescription>
          </DialogHeader>

          {viewingResponse && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg text-right">
                <h3 className="font-semibold text-lg mb-3">פרטים אישיים</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">שם מלא:</span> {viewingResponse.personal_info?.full_name || '-'}</div>
                  <div><span className="font-medium">אימייל:</span> {viewingResponse.personal_info?.email || '-'}</div>
                  <div><span className="font-medium">גיל:</span> {viewingResponse.personal_info?.age || '-'}</div>
                  <div><span className="font-medium">מין:</span> {viewingResponse.personal_info?.gender || '-'}</div>
                  <div><span className="font-medium">מצב משפחתי:</span> {viewingResponse.personal_info?.marital_status || '-'}</div>
                  <div><span className="font-medium">כתובת:</span> {viewingResponse.personal_info?.address || '-'}</div>
                  <div><span className="font-medium">טלפון:</span> {viewingResponse.personal_info?.phone || '-'}</div>
                </div>
              </div>

              <div className="text-right">
                <h3 className="font-semibold text-lg mb-3">תשובות לשאלון (1-7)</h3>
                <div className="grid md:grid-cols-5 gap-2 text-sm">
                  {Object.entries(viewingResponse.responses || {})
                    .sort((a, b) => {
                      const numA = parseInt(a[0].replace('q', ''));
                      const numB = parseInt(b[0].replace('q', ''));
                      return numA - numB;
                    })
                    .map(([key, value]) => (
                      <div key={key} className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-medium text-gray-600">{key.replace('q', 'שאלה ')}</div>
                        <div className="text-xl font-bold text-blue-600">{value}</div>
                      </div>
                    ))}
                </div>
              </div>

              {viewingResponse.optional_comment && (
                <div className="bg-amber-50 p-4 rounded-lg text-right">
                  <h3 className="font-semibold text-lg mb-2">הערה אופציונלית</h3>
                  <p className="text-sm whitespace-pre-wrap">{viewingResponse.optional_comment}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 text-right">
                <div className="grid md:grid-cols-3 gap-2">
                  <div><span className="font-medium">נוצר בתאריך:</span> {format(new Date(viewingResponse.created_date), 'dd/MM/yyyy HH:mm')}</div>
                  <div><span className="font-medium">עודכן לאחרונה:</span> {format(new Date(viewingResponse.updated_date), 'dd/MM/yyyy HH:mm')}</div>
                  <div><span className="font-medium">שפה:</span> {viewingResponse.language === 'he' ? 'עברית' : 'English'}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingEmails} onOpenChange={() => setViewingEmails(null)}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>היסטוריית מיילים</DialogTitle>
            <DialogDescription>
              מיילים שנשלחו למשתמש זה
            </DialogDescription>
          </DialogHeader>

          {viewingEmails && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {viewingEmails.length === 0 ? (
                <p className="text-center text-gray-500 py-4">אין מיילים שנשלחו למשתמש זה.</p>
              ) : (
                viewingEmails.map(log => (
                  <Card key={log.id} className="border">
                    <CardContent className="p-4 text-right">
                      <div className="flex items-start justify-between flex-row-reverse">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                            <Badge variant={log.sent_manually ? "outline" : "default"} className={log.sent_manually ? 'border-purple-300 text-purple-700' : 'bg-gray-200 text-gray-700'}>
                              {log.sent_manually ? 'ידני' : 'אוטומטי'}
                            </Badge>
                            <span className="text-sm font-medium">{log.subject}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div>סוג: {log.email_type}</div>
                            <div>נשלח ב: {format(new Date(log.created_date), 'dd/MM/yyyy HH:mm')}</div>
                            {log.related_report_id && <div className="mt-1"><Link to={createPageUrl(`ReportView?reportId=${log.related_report_id}`)} target="_blank" className="text-blue-600 hover:underline">צפה בדו"ח</Link></div>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={languageDialog.open} onOpenChange={closeLanguageDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>בחר שפת המייל</DialogTitle>
            <DialogDescription>
              באיזו שפה תרצה לשלוח את המייל ללקוח?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              onClick={() => sendReportToClient('he')}
              className="w-full text-lg py-6"
              variant="outline"
            >
              🇮🇱 עברית
            </Button>
            <Button
              onClick={() => sendReportToClient('en')}
              className="w-full text-lg py-6"
              variant="outline"
            >
              🇬🇧 English
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={simulationDialog} onOpenChange={setSimulationDialog}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>דימוי רכישת מוצר</DialogTitle>
            <DialogDescription>
              מערכת זו מדמה רכישה של מוצר עבור משתמש קיים - לצורך בדיקות
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="userEmail" className="text-right block mb-2">אימייל המשתמש</Label>
              <Input
                id="userEmail"
                type="email"
                value={simulationForm.userEmail}
                onChange={(e) => setSimulationForm({...simulationForm, userEmail: e.target.value})}
                placeholder="user@example.com"
                className="text-right"
                dir="rtl"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                המשתמש חייב להיות רשום במערכת
              </p>
            </div>

            <div>
              <Label htmlFor="productType" className="text-right block mb-2">סוג מוצר</Label>
              <select
                id="productType"
                value={simulationForm.productType}
                onChange={(e) => setSimulationForm({...simulationForm, productType: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2 text-right"
                dir="rtl"
              >
                <option value="full_report">דו"ח מלא (299 ₪)</option>
                <option value="answers_download">הורדת תשובות (59 ₪)</option>
                <option value="online_coaching_7days">ליווי און ליין 7 ימים (497 ₪)</option>
              </select>
            </div>

            {simulationForm.productType === 'full_report' && (
              <div className="flex items-center gap-2 flex-row-reverse">
                <Label htmlFor="expressDelivery" className="cursor-pointer">אספקה מואצת (+79 ₪)</Label>
                <input
                  id="expressDelivery"
                  type="checkbox"
                  checked={simulationForm.expressDelivery}
                  onChange={(e) => setSimulationForm({...simulationForm, expressDelivery: e.target.checked})}
                  className="w-4 h-4"
                />
              </div>
            )}

            <div>
              <Label htmlFor="language" className="text-right block mb-2">שפת המיילים</Label>
              <select
                id="language"
                value={simulationForm.language}
                onChange={(e) => setSimulationForm({...simulationForm, language: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2 text-right"
                dir="rtl"
              >
                <option value="he">עברית</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 text-right">
              <p className="font-semibold mb-1">מה יקרה:</p>
              <ul className="list-disc pr-5 space-y-1">
                <li>עדכון פרטי המשתמש כאילו רכש את המוצר</li>
                <li>שליחת מייל אישור למשתמש</li>
                <li>תיעוד הרכישה המדומה במערכת</li>
                {simulationForm.productType === 'online_coaching_7days' && (
                  <li className="text-orange-700 font-semibold">יצירת מנוי ליווי 7 ימים (דורש תזמון חיצוני למיילים יומיים)</li>
                )}
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setSimulationDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={isSimulating}
              >
                ביטול
              </Button>
              <Button
                onClick={handleSimulatePurchase}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={isSimulating}
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    מדמה...
                  </>
                ) : (
                  'דמה רכישה'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EmailTemplateDialog
        open={templateDialog}
        onOpenChange={setTemplateDialog}
        template={editingTemplate}
        onSave={async (templateData) => {
          try {
            if (editingTemplate) {
              await base44.entities.EmailTemplate.update(editingTemplate.id, templateData);
            } else {
              await base44.entities.EmailTemplate.create(templateData);
            }
            await loadData();
            setTemplateDialog(false);
            setEditingTemplate(null);
            alert('התבנית נשמרה בהצלחה!');
          } catch (error) {
            console.error('Error saving template:', error);
            alert('שגיאה בשמירת התבנית');
          }
        }}
      />
      </div>
      );
      }

      function EmailTemplateDialog({ open, onOpenChange, template, onSave }) {
      const [formData, setFormData] = React.useState({
        template_type: template?.template_type || 'abandonment_incomplete',
        trigger_event: template?.trigger_event || 'manual',
        name_he: template?.name_he || '',
        name_en: template?.name_en || '',
        subject_he: template?.subject_he || '',
        subject_en: template?.subject_en || '',
        content_he: template?.content_he || '',
        content_en: template?.content_en || '',
        description_he: template?.description_he || '',
        description_en: template?.description_en || '',
        active: template?.active ?? true,
        include_coupon: template?.include_coupon ?? false,
        coupon_amount: template?.coupon_amount || 50,
        aiPrompt: ''
      });
      const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
      const [previewLang, setPreviewLang] = React.useState('he');

      React.useEffect(() => {
      if (template) {
        setFormData({
          template_type: template.template_type,
          trigger_event: template.trigger_event || 'manual',
          name_he: template.name_he,
          name_en: template.name_en,
          subject_he: template.subject_he,
          subject_en: template.subject_en,
          content_he: template.content_he,
          content_en: template.content_en,
          description_he: template.description_he || '',
          description_en: template.description_en || '',
          active: template.active ?? true,
          include_coupon: template.include_coupon ?? false,
          coupon_amount: template.coupon_amount || 50
        });
      } else {
        setFormData({
          template_type: 'abandonment_incomplete',
          trigger_event: 'manual',
          name_he: '',
          name_en: '',
          subject_he: '',
          subject_en: '',
          content_he: '',
          content_en: '',
          description_he: '',
          description_en: '',
          active: true,
          include_coupon: false,
          coupon_amount: 50
        });
      }
      }, [template]);

      const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name_he || !formData.subject_he || !formData.content_he) {
      alert('יש למלא לפחות את השדות בעברית');
      return;
      }
      onSave(formData);
      };

      const handleGenerateWithAI = async () => {
        if (!formData.aiPrompt) return;

        setIsGeneratingAI(true);
        try {
          const prompt = `אתה מעצב מיילים מקצועי. צור תבנית מייל HTML עבור אפליקציית V107.

      תיאור: ${formData.aiPrompt}

      דרישות:
      1. צור HTML מעוצב יפה ומקצועי עם CSS מוטמע
      2. שמור על עיצוב responsive
      3. השתמש בצבעים מקצועיים (#3b82f6 כצבע ראשי, #1e3a8a כצבע משני)
      4. כלול כפתור call-to-action בולט
      5. צור גרסה בעברית (RTL) וגרסה באנגלית (LTR)
      6. השתמש במשתנים כמו {userName}, {questionnaireUrl}, {reportUrl}, {surveyUrl}, {couponCode}, {purchaseUrl}
      7. הוסף אייקוני אימוג'י מתאימים

      החזר בפורמט JSON בלבד:
      {
      "name_he": "שם התבנית בעברית",
      "name_en": "Template Name in English",
      "subject_he": "נושא המייל בעברית",
      "subject_en": "Email Subject in English",
      "content_he": "תוכן HTML מלא בעברית",
      "content_en": "Full HTML content in English",
      "description_he": "תיאור קצר של התבנית",
      "description_en": "Short description of template"
      }`;

          const result = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
              type: "object",
              properties: {
                name_he: { type: "string" },
                name_en: { type: "string" },
                subject_he: { type: "string" },
                subject_en: { type: "string" },
                content_he: { type: "string" },
                content_en: { type: "string" },
                description_he: { type: "string" },
                description_en: { type: "string" }
              }
            }
          });

          setFormData({
            ...formData,
            name_he: result.name_he,
            name_en: result.name_en,
            subject_he: result.subject_he,
            subject_en: result.subject_en,
            content_he: result.content_he,
            content_en: result.content_en,
            description_he: result.description_he,
            description_en: result.description_en,
            aiPrompt: ''
          });

          alert('התבנית נוצרה בהצלחה! בדוק את התוצאה ובצע התאמות במידת הצורך.');
        } catch (error) {
          console.error('Error generating template:', error);
          alert('שגיאה ביצירת התבנית: ' + error.message);
        } finally {
          setIsGeneratingAI(false);
        }
      };

      return (
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>{template ? 'עריכת תבנית מייל' : 'תבנית מייל חדשה'}</DialogTitle>
          <DialogDescription>
            הגדר את תוכן המייל האוטומטי בעברית ובאנגלית
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit">עריכת תבנית</TabsTrigger>
            <TabsTrigger value="preview">תצוגה מקדימה</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex justify-center gap-2 mb-4">
              <Button
                type="button"
                variant={previewLang === 'he' ? 'default' : 'outline'}
                onClick={() => setPreviewLang('he')}
              >
                🇮🇱 עברית
              </Button>
              <Button
                type="button"
                variant={previewLang === 'en' ? 'default' : 'outline'}
                onClick={() => setPreviewLang('en')}
              >
                🇬🇧 English
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-right">
                {previewLang === 'he' ? 'נושא: ' : 'Subject: '}
                {previewLang === 'he' ? formData.subject_he : formData.subject_en}
              </h3>
              <div className="border rounded-lg bg-white overflow-hidden shadow-lg">
                <iframe
                  srcDoc={(previewLang === 'he' ? formData.content_he : formData.content_en)
                    .replace('{userName}', previewLang === 'he' ? 'ישראל ישראלי' : 'John Doe')
                    .replace('{questionnaireUrl}', '#questionnaire')
                    .replace('{reportUrl}', '#report')
                    .replace('{surveyUrl}', '#survey')
                    .replace('{couponCode}', 'DEMO50')
                    .replace('{purchaseUrl}', '#purchase')
                  }
                  className="w-full h-[600px] border-0"
                  title="Email Preview"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>סוג תבנית</Label>
              <select
                value={formData.template_type}
                onChange={(e) => setFormData({...formData, template_type: e.target.value})}
                className="w-full border rounded-md p-2 text-right"
                dir="rtl"
              >
                <option value="abandonment_incomplete">נטישה לפני סיום השאלון</option>
                <option value="abandonment_reminder_96h">תזכורת 96 שעות</option>
                <option value="abandonment_after_completion">נטישה אחרי סיום השאלון</option>
                <option value="full_report_purchase">רכישת דוח מלא</option>
                <option value="answers_download_purchase">רכישת הורדת תשובות</option>
                <option value="online_coaching_purchase">רכישת ליווי אונליין</option>
                <option value="report_ready">דוח מוכן</option>
                <option value="consultation_request">בקשת ייעוץ</option>
                <option value="questionnaire_completion">השלמת שאלון</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>טריגר</Label>
              <select
                value={formData.trigger_event}
                onChange={(e) => setFormData({...formData, trigger_event: e.target.value})}
                className="w-full border rounded-md p-2 text-right"
                dir="rtl"
              >
                <option value="manual">ידני בלבד</option>
                <option value="on_navigation_away">בעת ניווט החוצה מהשאלון</option>
                <option value="after_96_hours">אחרי 96 שעות</option>
                <option value="after_completion_no_purchase">אחרי סיום ללא רכישה</option>
                <option value="on_purchase">ברכישת מוצר</option>
                <option value="on_report_generation">ביצירת דוח</option>
                <option value="on_consultation_request">בקשת ייעוץ</option>
                <option value="on_questionnaire_submit">בהגשת שאלון</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3 flex-row-reverse">
                <Label className="font-semibold">🤖 יצירת תבנית באמצעות AI</Label>
              </div>
              <Textarea
                placeholder="תאר במילים פשוטות מה המייל צריך לכלול... (לדוגמה: מייל המעודד משתמש לחזור ולהשלים את השאלון, עם טון חברי ומעודד)"
                value={formData.aiPrompt || ''}
                onChange={(e) => setFormData({...formData, aiPrompt: e.target.value})}
                className="min-h-[80px] text-right mb-2"
                dir="rtl"
              />
              <Button
                type="button"
                onClick={() => handleGenerateWithAI()}
                disabled={isGeneratingAI || !formData.aiPrompt}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    מייצר תבנית...
                  </>
                ) : (
                  <>
                    ✨ צור תבנית באמצעות AI
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="flex items-center gap-2 flex-row-reverse">
                <Label>פעיל</Label>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center gap-2 flex-row-reverse">
                <Label>כולל קופון</Label>
                <input
                  type="checkbox"
                  checked={formData.include_coupon}
                  onChange={(e) => setFormData({...formData, include_coupon: e.target.checked})}
                  className="w-4 h-4"
                />
              </div>

              {formData.include_coupon && (
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Label>סכום קופון (₪)</Label>
                  <Input
                    type="number"
                    value={formData.coupon_amount}
                    onChange={(e) => setFormData({...formData, coupon_amount: parseInt(e.target.value)})}
                    className="w-20 text-right"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 text-right">תוכן בעברית</h3>

            <div className="space-y-4">
              <div>
                <Label>שם התבנית</Label>
                <Input
                  value={formData.name_he}
                  onChange={(e) => setFormData({...formData, name_he: e.target.value})}
                  placeholder="למשל: מייל עידוד להשלמת שאלון"
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label>תיאור (אופציונלי)</Label>
                <Input
                  value={formData.description_he}
                  onChange={(e) => setFormData({...formData, description_he: e.target.value})}
                  placeholder="תיאור קצר של המייל"
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label>נושא המייל</Label>
                <Input
                  value={formData.subject_he}
                  onChange={(e) => setFormData({...formData, subject_he: e.target.value})}
                  placeholder="נושא המייל"
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label>תוכן המייל (HTML)</Label>
                <Textarea
                  value={formData.content_he}
                  onChange={(e) => setFormData({...formData, content_he: e.target.value})}
                  placeholder="תוכן HTML של המייל..."
                  className="min-h-[200px] font-mono text-sm text-right"
                  dir="rtl"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  ניתן להשתמש במשתנים: {'{userName}'}, {'{surveyUrl}'}, {'{questionnaireUrl}'}, {'{couponCode}'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 text-right">English Content</h3>

            <div className="space-y-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                  placeholder="e.g.: Questionnaire Completion Encouragement"
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <Label>Description (optional)</Label>
                <Input
                  value={formData.description_en}
                  onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                  placeholder="Brief description"
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <Label>Email Subject</Label>
                <Input
                  value={formData.subject_en}
                  onChange={(e) => setFormData({...formData, subject_en: e.target.value})}
                  placeholder="Email subject"
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <Label>Email Content (HTML)</Label>
                <Textarea
                  value={formData.content_en}
                  onChange={(e) => setFormData({...formData, content_en: e.target.value})}
                  placeholder="HTML email content..."
                  className="min-h-[200px] font-mono text-sm text-left"
                  dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-1 text-left">
                  Available variables: {'{userName}'}, {'{surveyUrl}'}, {'{questionnaireUrl}'}, {'{couponCode}'}
                </p>
              </div>
            </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              ביטול
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              שמור תבנית
            </Button>
            </div>
            </form>
            </TabsContent>
            </Tabs>
            </DialogContent>
            </Dialog>
      );
      }