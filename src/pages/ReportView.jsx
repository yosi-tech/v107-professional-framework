import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User as UserIcon, 
  Calendar,
  Edit2,
  Save,
  X,
  Download,
  Loader2,
  BarChart3,
  Target,
  TrendingUp,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DOMAIN_MAPPING } from "@/components/utils/reportCalculations";

// Localized text mapping
const TEXTS = {
  he: {
    reportTitle: "דו\"ח V107",
    reportIdPrefix: "מזהה:",
    exportPdf: "ייצוא PDF",
    participant: "משתתף/ת",
    generationDate: "תאריך הפקה",
    status: "סטטוס",
    completed: "הושלם",
    executiveSummary: "תקציר מנהלים",
    edit: "ערוך",
    save: "שמור",
    cancel: "ביטול",
    topStrengths: "חוזקות מרכזיות:",
    improvementAreas: "מוקדי שיפור דחופים:",
    conclusion: "מסקנה:",
    radarChartTitle: "פרופיל כשירויות — רדאר",
    barChartTitle: "חוזקות מול לשיפור",
    top5Strengths: "5 החזקות ביותר:",
    bottom5Weaknesses: "5 החלשות ביותר:",
    noData: "אין נתונים להצגה",
    domainScoresTitle: "צילום מצב — ציונים לפי ממד",
    domainColumn: "ממד",
    scoreColumn: "ציון",
    interpretationColumn: "פרשנות",
    flagColumn: "דגל",
    high: "גבוה",
    mid: "בינוני",
    low: "נמוך",
    domainAnalysis: "ניתוח תחומי תפקוד",
    trafficLightsTableTitle: "טבלת רמזורים — אבחון ממוקד",
    trafficLightsDomainColumn: "תחום",
    trafficLightsItemColumn: "פריט/יכולת",
    trafficLightsStatusColumn: "מצב",
    trafficLightsNoteColumn: "הערת אבחון",
    kpisTitle: "KPI מוצעים (0–90 יום)",
    kpiMetricColumn: "מדד",
    kpiTargetColumn: "יעד",
    actionPlanTitle: "תכנית פעולה",
    quickWins: "0–30 יום (Quick Wins):",
    months1_3: "1–3 חודשים:",
    months4_6: "4–6 חודשים:",
    focusedRecommendationsTitle: "המלצות ממוקדות ליישום",
    disclaimerStrong: "הסתייגות ותנאי שימוש:",
    disclaimerText: "הדו\"ח הוא כלי עזר לקבלת החלטות ואינו מהווה ייעוץ פיננסי/משפטי מחייב. זכויות יוצרים: \"עלית – יזום עסקים\". כל שימוש, העברה או שכפול — באישור כתוב בלבד.",
    reportIdMissing: "מזהה דו\"ח חסר",
    reportNotFound: "דו\"ח לא נמצא",
    errorLoadingReport: "שגיאה בטעינת הדו\"ח",
    errorSavingChanges: "שגיאה בשמירת השינויים",
    jsonPlaceholderExecutiveSummary: "JSON של תקציר מנהלים",
    jsonPlaceholderTrafficLights: "JSON של טבלת רמזורים",
    jsonPlaceholderKPIs: "JSON של מדדי ביצוע (KPIs)",
    jsonPlaceholderActionPlan: "JSON של תכנית פעולה",
    jsonPlaceholderRecommendations: "JSON של המלצות ממוקדות",
    reportNotFoundCardTitle: "דו\"ח לא נמצא",
    reportNotFoundCardMessage: "לא ניתן למצוא את הדו\"ח המבוקש"
  },
  en: {
    reportTitle: "V107 Report",
    reportIdPrefix: "ID:",
    exportPdf: "Export PDF",
    participant: "Participant",
    generationDate: "Generation Date",
    status: "Status",
    completed: "Completed",
    executiveSummary: "Executive Summary",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    topStrengths: "Key Strengths:",
    improvementAreas: "Urgent Improvement Areas:",
    conclusion: "Conclusion:",
    radarChartTitle: "Competency Profile — Radar",
    barChartTitle: "Strengths vs. Areas for Improvement",
    top5Strengths: "Top 5 Strengths:",
    bottom5Weaknesses: "Bottom 5 Weaknesses:",
    noData: "No data to display",
    domainScoresTitle: "Snapshot — Scores by Dimension",
    domainColumn: "Dimension",
    scoreColumn: "Score",
    interpretationColumn: "Interpretation",
    flagColumn: "Flag",
    high: "High",
    mid: "Medium",
    low: "Low",
    domainAnalysis: "Domain Analysis",
    trafficLightsTableTitle: "Traffic Light Table — Focused Diagnosis",
    trafficLightsDomainColumn: "Domain",
    trafficLightsItemColumn: "Item/Capability",
    trafficLightsStatusColumn: "Status",
    trafficLightsNoteColumn: "Diagnostic Note",
    kpisTitle: "Proposed KPIs (0–90 Days)",
    kpiMetricColumn: "Metric",
    kpiTargetColumn: "Target",
    actionPlanTitle: "Action Plan",
    quickWins: "0–30 Days (Quick Wins):",
    months1_3: "1–3 Months:",
    months4_6: "4–6 Months:",
    focusedRecommendationsTitle: "Focused Recommendations for Implementation",
    disclaimerStrong: "Disclaimer and Terms of Use:",
    disclaimerText: "This report is a decision-making tool and does not constitute binding financial/legal advice. Copyright: \"Elite – Business Initiative\". Any use, transfer or reproduction — only with written permission.",
    reportIdMissing: "Report ID missing",
    reportNotFound: "Report not found",
    errorLoadingReport: "Error loading report",
    errorSavingChanges: "Error saving changes",
    jsonPlaceholderExecutiveSummary: "JSON of Executive Summary",
    jsonPlaceholderTrafficLights: "JSON of Traffic Lights Table",
    jsonPlaceholderKPIs: "JSON of KPIs",
    jsonPlaceholderActionPlan: "JSON of Action Plan",
    jsonPlaceholderRecommendations: "JSON of Focused Recommendations",
    reportNotFoundCardTitle: "Report Not Found",
    reportNotFoundCardMessage: "The requested report could not be found"
  }
};


export default function ReportView() {
  const [report, setReport] = useState(null);
  const [questionnaireResponse, setQuestionnaireResponse] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [editedContent, setEditedContent] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('he'); // Default to Hebrew

  useEffect(() => {
    loadReport();
  }, []);

  const getText = (key) => {
    return TEXTS[currentLanguage][key] || TEXTS['he'][key]; // Fallback to Hebrew
  };

  const loadReport = async () => {
    let userIsAdmin = false;
    try {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        userIsAdmin = (currentUser.role === 'admin');
        setIsAdmin(userIsAdmin);
      } catch (e) {
        setIsAdmin(false);
        userIsAdmin = false;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const reportId = urlParams.get('reportId');
      
      if (!reportId) {
        console.error("Missing reportId parameter");
        setIsLoading(false);
        return;
      }

      // Try to get report directly by ID
      let loadedReport;
      try {
        const allReports = await base44.entities.GeneratedReport.list();
        loadedReport = allReports.find(r => r.id === reportId);
        
        if (!loadedReport) {
          console.error("Report not found for ID:", reportId);
          setReport(null);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error("Error fetching reports:", e);
        setReport(null);
        setIsLoading(false);
        return;
      }
      
      // Validate report structure
      if (!loadedReport.domain_scores || Object.keys(loadedReport.domain_scores).length === 0) {
        console.error("Report missing domain_scores data");
      }
      
      setReport(loadedReport);
      setCurrentLanguage(loadedReport.language || 'he');

      if (userIsAdmin && loadedReport.questionnaire_response_id) {
        try {
          const responseData = await base44.entities.QuestionnaireResponse.filter(
            { id: loadedReport.questionnaire_response_id },
            '',
            1
          );
          if (responseData && responseData.length > 0) {
            setQuestionnaireResponse(responseData[0]);
          }
        } catch (e) {
          console.error("Error loading questionnaire response:", e);
        }
      }

    } catch (error) {
      console.error("Error loading report:", error);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const startEdit = (section) => {
    if (!isAdmin) return;
    setEditMode({ ...editMode, [section]: true });
    setEditedContent({ ...editedContent, [section]: getContentForSection(section) });
  };

  const cancelEdit = (section) => {
    setEditMode({ ...editMode, [section]: false });
    setEditedContent({ ...editedContent, [section]: undefined });
  };

  const saveEdit = async (section) => {
    if (!isAdmin) return;
    try {
      const updatedReport = { ...report };
      
      if (section === 'executive_summary') {
        updatedReport.executive_summary = JSON.parse(editedContent[section]);
      } else if (section.startsWith('domain_analysis_')) {
        const domainKey = section.replace('domain_analysis_', '');
        updatedReport.domain_analysis[domainKey] = editedContent[section];
      } else if (section === 'traffic_lights_table') {
        updatedReport.traffic_lights_table = JSON.parse(editedContent[section]);
      } else if (section === 'kpis') {
        updatedReport.kpis = JSON.parse(editedContent[section]);
      } else if (section === 'action_plan') {
        updatedReport.action_plan = JSON.parse(editedContent[section]);
      } else if (section === 'focused_recommendations') {
        updatedReport.focused_recommendations = JSON.parse(editedContent[section]);
      }

      await base44.entities.GeneratedReport.update(report.id, updatedReport);
      setReport(updatedReport);
      setEditMode({ ...editMode, [section]: false });
    } catch (error) {
      console.error(getText("errorSavingChanges"), error);
      alert(getText("errorSavingChanges"));
    }
  };

  const getContentForSection = (section) => {
    if (section === 'executive_summary') {
      return JSON.stringify(report.executive_summary, null, 2);
    } else if (section.startsWith('domain_analysis_')) {
      const domainKey = section.replace('domain_analysis_', '');
      return report.domain_analysis[domainKey] || '';
    } else if (section === 'traffic_lights_table') {
      return JSON.stringify(report.traffic_lights_table, null, 2);
    } else if (section === 'kpis') {
      return JSON.stringify(report.kpis, null, 2);
    } else if (section === 'action_plan') {
      return JSON.stringify(report.action_plan, null, 2);
    } else if (section === 'focused_recommendations') {
      return JSON.stringify(report.focused_recommendations, null, 2);
    }
    return '';
  };

  const getTrafficLightEmoji = (status) => {
    const emojis = {
      green: '🟢',
      yellow: '🟡',
      orange: '🟠',
      red: '🔴'
    };
    return emojis[status] || '⚪';
  };

  // פונקציה לקבלת שם דומיין בשפה הנבחרת
  const getDomainName = (domainKey) => {
    // If report or domain_scores is null, return domainKey directly to avoid errors
    if (!report || !report.domain_scores) {
      return domainKey;
    }

    // אם יש name שמור בדומיין עצמו (נתונים ספציפיים לדו"ח)
    if (report.domain_scores[domainKey]?.name) {
      return report.domain_scores[domainKey].name;
    }
    // אחרת, נחפש במיפוי הכללי לפי שפה
    if (DOMAIN_MAPPING[domainKey]) {
      const lang = report.language || 'he';
      return lang === 'he' ? DOMAIN_MAPPING[domainKey].nameHe : DOMAIN_MAPPING[domainKey].nameEn;
    }
    // ברירת מחדל - נחזיר את המפתח עצמו
    return domainKey;
  };

  // הכנת נתונים לגרף רדאר
  const radarData = report && report.domain_scores ? 
    Object.entries(report.domain_scores)
      .filter(([key, data]) => {
        if (!data) return false;
        const score = typeof data === 'object' ? data.score : data;
        return score !== null && score !== undefined && !isNaN(score);
      })
      .map(([key, data]) => {
        const score = typeof data === 'object' ? data.score : data;
        return {
          domain: getDomainName(key),
          score: Number(score)
        };
      }) : [];

  // הכנת נתונים לגרף עמודות
  const barData = report && report.domain_scores ? 
    Object.entries(report.domain_scores)
      .filter(([key, data]) => {
        if (!data) return false;
        const score = typeof data === 'object' ? data.score : data;
        return score !== null && score !== undefined && !isNaN(score);
      })
      .map(([key, data]) => {
        const score = typeof data === 'object' ? data.score : data;
        const red_flag = typeof data === 'object' ? data.red_flag : false;
        const yellow_flag = typeof data === 'object' ? data.yellow_flag : false;
        
        return {
          domain: getDomainName(key),
          score: Number(score),
          flag: red_flag ? 'red' : yellow_flag ? 'yellow' : 'green'
        };
      })
      .sort((a, b) => b.score - a.score) : [];

  const top5Strengths = barData.slice(0, 5);
  const bottom5Weaknesses = barData.slice(-5).reverse();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getText("reportNotFoundCardTitle")}</h2>
            <p className="text-gray-600">{getText("reportNotFoundCardMessage")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={report.language === 'en' ? 'ltr' : 'rtl'}>
      <style>{`
        @media print {
          body { 
            print-color-adjust: exact; 
            -webkit-print-color-adjust: exact;
          }
          
          header, footer, nav { 
            display: none !important; 
          }
          
          .no-print { 
            display: none !important; 
          }
          
          [class*="ChatBot"], [class*="chat"] {
            display: none !important;
          }
          
          body, html {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .report-container {
            margin: 0 !important;
            padding: 1cm !important;
            max-width: 100% !important;
          }
          
          .print-break { 
            page-break-after: always; 
          }
          
          .print-avoid-break { 
            page-break-inside: avoid; 
          }
          
          @page { 
            margin: 1.5cm;
            size: A4;
          }
          
          .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          
          .bg-green-500, .bg-orange-500, .bg-blue-500, .bg-amber-500,
          .bg-red-500, .bg-yellow-500, .bg-purple-500,
          .bg-green-100, .bg-yellow-100, .bg-red-100, .bg-blue-100, .bg-purple-50, .bg-green-50, .bg-amber-50 {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        
        .report-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
      
      <div className="report-container">
        {/* Header */}
        <Card className="mb-8 border-t-4 border-t-blue-600 print-avoid-break">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{getText("reportTitle")}</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    גרסה B5 / v5.7-LTS · {getText("reportIdPrefix")} {report.report_id}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 no-print">
                <Button onClick={() => window.history.back()} variant="outline">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  {currentLanguage === 'he' ? 'חזור' : 'Back'}
                </Button>
                <Button onClick={handlePrintPDF} variant="outline">
                  <Download className="w-4 h-4 ml-2" />
                  {getText("exportPdf")}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{getText("participant")}</p>
                  <p className="font-semibold">{report.user_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{getText("generationDate")}</p>
                  <p className="font-semibold">
                    {format(new Date(report.created_date), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{getText("status")}</p>
                  <Badge className="bg-green-100 text-green-800">{getText("completed")}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* תקציר מנהלים */}
        <Card className="mb-8 print-avoid-break">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{getText("executiveSummary")}</CardTitle>
              {!editMode.executive_summary && isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEdit('executive_summary')}
                  className="no-print"
                >
                  <Edit2 className="w-4 h-4 ml-2" />
                  {getText("edit")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editMode.executive_summary ? (
              <div className="space-y-4 no-print">
                <Textarea
                  value={editedContent.executive_summary || ''}
                  onChange={(e) => setEditedContent({...editedContent, executive_summary: e.target.value})}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder={getText("jsonPlaceholderExecutiveSummary")}
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveEdit('executive_summary')}>
                    <Save className="w-4 h-4 ml-2" />
                    {getText("save")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => cancelEdit('executive_summary')}
                  >
                    <X className="w-4 h-4 ml-2" />
                    {getText("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">
                    {getText("topStrengths")}
                  </h3>
                  <ul className="space-y-2">
                    {report.executive_summary?.top_strengths?.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-semibold text-green-600">{idx + 1}.</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-700">
                    {getText("improvementAreas")}
                  </h3>
                  <ul className="space-y-2">
                    {report.executive_summary?.improvement_areas?.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-semibold text-orange-600">{idx + 1}.</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold mb-2 text-blue-900">
                    {getText("conclusion")}
                  </h3>
                  <p className="leading-relaxed text-gray-800">
                    {report.executive_summary?.conclusion}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* גרפים */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* גרף רדאר */}
          <Card className="print-avoid-break">
            <CardHeader>
              <CardTitle>{getText("radarChartTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {radarData && radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="domain" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      name={getText("scoreColumn")} 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  {getText("noData")}
                </div>
              )}
            </CardContent>
          </Card>

          {/* גרף עמודות */}
          <Card className="print-avoid-break">
            <CardHeader>
              <CardTitle>{getText("barChartTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {barData && barData.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-3">{getText("top5Strengths")}</h4>
                    <div className="space-y-3">
                      {top5Strengths.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{item.domain}</span>
                            <span className="text-xs font-bold text-green-600">{item.score.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${item.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-orange-700 mb-3">{getText("bottom5Weaknesses")}</h4>
                    <div className="space-y-3">
                      {bottom5Weaknesses.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{item.domain}</span>
                            <span className="text-xs font-bold text-orange-600">{item.score.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${item.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  {getText("noData")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* טבלת ציונים */}
        <Card className="mb-8 print-avoid-break">
          <CardHeader>
            <CardTitle>{getText("domainScoresTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">{getText("domainColumn")}</th>
                    <th className="text-center py-3 px-4">{getText("scoreColumn")}</th>
                    <th className="text-center py-3 px-4">{getText("interpretationColumn")}</th>
                    <th className="text-center py-3 px-4">{getText("flagColumn")}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.domain_scores && Object.entries(report.domain_scores)
                    .filter(([key, data]) => {
                      if (!data) return false;
                      const score = typeof data === 'object' ? data.score : data;
                      return score !== null && score !== undefined && !isNaN(score);
                    })
                    .map(([key, data]) => {
                      const score = typeof data === 'object' ? data.score : data;
                      const band = typeof data === 'object' ? data.band : null;
                      const red_flag = typeof data === 'object' ? data.red_flag : false;
                      const yellow_flag = typeof data === 'object' ? data.yellow_flag : false;
                      
                      return (
                        <tr key={key} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">
                            {getDomainName(key)}
                          </td>
                          <td className="text-center py-3 px-4">
                            {Number(score).toFixed(1)}
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge className={
                              band === 'high' ? 'bg-green-100 text-green-800' :
                              band === 'mid' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {band === 'high' ? getText("high") : band === 'mid' ? getText("mid") : getText("low")}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4 text-2xl">
                            {red_flag ? '🔴' : yellow_flag ? '🟡' : '🟢'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ניתוח דומיינים */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{getText("domainAnalysis")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {report.domain_analysis && Object.entries(report.domain_analysis).map(([key, analysis]) => {
                const sectionKey = `domain_analysis_${key}`;
                return (
                  <div key={key} className="border-b pb-4 print-avoid-break">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">
                        {getDomainName(key)}
                      </h3>
                      {!editMode[sectionKey] && isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => startEdit(sectionKey)}
                          className="no-print"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    
                    {editMode[sectionKey] ? (
                      <div className="space-y-2 no-print">
                        <Textarea
                          value={editedContent[sectionKey] || ''}
                          onChange={(e) => setEditedContent({...editedContent, [sectionKey]: e.target.value})}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(sectionKey)}>
                            <Save className="w-3 h-3 ml-1" />
                            {getText("save")}
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline" 
                            onClick={() => cancelEdit(sectionKey)}
                          >
                            <X className="w-3 h-3 ml-1" />
                            {getText("cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{analysis}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* טבלת רמזורים */}
        <Card className="mb-8 print-avoid-break">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{getText("trafficLightsTableTitle")}</CardTitle>
              {!editMode.traffic_lights_table && isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEdit('traffic_lights_table')}
                  className="no-print"
                >
                  <Edit2 className="w-4 h-4 ml-2" />
                  {getText("edit")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editMode.traffic_lights_table ? (
              <div className="space-y-4 no-print">
                <Textarea
                  value={editedContent.traffic_lights_table || ''}
                  onChange={(e) => setEditedContent({...editedContent, traffic_lights_table: e.target.value})}
                  rows={12}
                  className="font-mono text-sm"
                  placeholder={getText("jsonPlaceholderTrafficLights")}
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveEdit('traffic_lights_table')}>
                    <Save className="w-4 h-4 ml-2" />
                    {getText("save")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => cancelEdit('traffic_lights_table')}
                  >
                    <X className="w-4 h-4 ml-2" />
                    {getText("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">{getText("trafficLightsDomainColumn")}</th>
                      <th className="text-right py-3 px-4">{getText("trafficLightsItemColumn")}</th>
                      <th className="text-center py-3 px-4">{getText("trafficLightsStatusColumn")}</th>
                      <th className="text-right py-3 px-4">{getText("trafficLightsNoteColumn")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.traffic_lights_table?.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{item.domain}</td>
                        <td className="py-3 px-4">{item.item}</td>
                        <td className="text-center py-3 px-4 text-2xl">
                          {getTrafficLightEmoji(item.status)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* KPIs */}
        <Card className="mb-8 print-avoid-break">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{getText("kpisTitle")}</CardTitle>
              {!editMode.kpis && isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEdit('kpis')}
                  className="no-print"
                >
                  <Edit2 className="w-4 h-4 ml-2" />
                  {getText("edit")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editMode.kpis ? (
              <div className="space-y-4 no-print">
                <Textarea
                  value={editedContent.kpis || ''}
                  onChange={(e) => setEditedContent({...editedContent, kpis: e.target.value})}
                  rows={10}
                  className="font-mono text-sm"
                  placeholder={getText("jsonPlaceholderKPIs")}
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveEdit('kpis')}>
                    <Save className="w-4 h-4 ml-2" />
                    {getText("save")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => cancelEdit('kpis')}
                  >
                    <X className="w-4 h-4 ml-2" />
                    {getText("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">{getText("kpiMetricColumn")}</th>
                      <th className="text-right py-3 px-4">{getText("kpiTargetColumn")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.kpis?.map((kpi, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{kpi.metric}</td>
                        <td className="py-3 px-4">{kpi.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* תכנית פעולה */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{getText("actionPlanTitle")}</CardTitle>
              {!editMode.action_plan && isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEdit('action_plan')}
                  className="no-print"
                >
                  <Edit2 className="w-4 h-4 ml-2" />
                  {getText("edit")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editMode.action_plan ? (
              <div className="space-y-4 no-print">
                <Textarea
                  value={editedContent.action_plan || ''}
                  onChange={(e) => setEditedContent({...editedContent, action_plan: e.target.value})}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder={getText("jsonPlaceholderActionPlan")}
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveEdit('action_plan')}>
                    <Save className="w-4 h-4 ml-2" />
                    {getText("save")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => cancelEdit('action_plan')}
                  >
                    <X className="w-4 h-4 ml-2" />
                    {getText("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 print-avoid-break">
                  <h3 className="text-lg font-semibold mb-3 text-green-900">
                    {getText("quickWins")}
                  </h3>
                  <ul className="space-y-2">
                    {report.action_plan?.quick_wins?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 print-avoid-break">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">
                    {getText("months1_3")}
                  </h3>
                  <ul className="space-y-2">
                    {report.action_plan?.months_1_3?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 print-avoid-break">
                  <h3 className="text-lg font-semibold mb-3 text-purple-900">
                    {getText("months4_6")}
                  </h3>
                  <ul className="space-y-2">
                    {report.action_plan?.months_4_6?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* המלצות ממוקדות */}
        <Card className="mb-8 print-avoid-break">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{getText("focusedRecommendationsTitle")}</CardTitle>
              {!editMode.focused_recommendations && isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEdit('focused_recommendations')}
                  className="no-print"
                >
                  <Edit2 className="w-4 h-4 ml-2" />
                  {getText("edit")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editMode.focused_recommendations ? (
              <div className="space-y-4 no-print">
                <Textarea
                  value={editedContent.focused_recommendations || ''}
                  onChange={(e) => setEditedContent({...editedContent, focused_recommendations: e.target.value})}
                  rows={8}
                  className="font-mono text-sm"
                  placeholder={getText("jsonPlaceholderRecommendations")}
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveEdit('focused_recommendations')}>
                    <Save className="w-4 h-4 ml-2" />
                    {getText("save")}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => cancelEdit('focused_recommendations')}
                  >
                    <X className="w-4 h-4 ml-2" />
                    {getText("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {report.focused_recommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-700 text-lg">{idx + 1}.</span>
                    <span className="text-gray-800 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-gray-50 print-avoid-break">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>{getText("disclaimerStrong")}</strong> {getText("disclaimerText")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}