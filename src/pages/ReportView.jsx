import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  User as UserIcon, 
  Calendar,
  Edit2,
  Save,
  X,
  Download,
  Loader2,
  AlertCircle,
  ArrowRight,
  Rocket,
  BarChart3,
  Target,
  TrendingUp,
  CheckCircle,
  Eye,
  Code
} from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';
import ExecutiveSummarySection from "@/components/report/ExecutiveSummarySection";
import DomainScoresSection from "@/components/report/DomainScoresSection";
import DomainAnalysisSection from "@/components/report/DomainAnalysisSection";
import TrafficLightsSection from "@/components/report/TrafficLightsSection";
import KPIsSection from "@/components/report/KPIsSection";
import ActionPlanSection from "@/components/report/ActionPlanSection";
import RecommendationsSection from "@/components/report/RecommendationsSection";

const TEXTS = {
  he: {
    reportTitle: "דו\"ח V107",
    reportIdPrefix: "מזהה:",
    exportPdf: "ייצוא PDF",
    participant: "משתתף/ת",
    generationDate: "תאריך הפקה",
    status: "סטטוס",
    completed: "הושלם",
    edit: "ערוך",
    save: "שמור",
    cancel: "ביטול",
    reportNotFoundCardTitle: "דו\"ח לא נמצא",
    reportNotFoundCardMessage: "לא ניתן למצוא את הדו\"ח המבוקש",
    errorSavingChanges: "שגיאה בשמירת השינויים"
  },
  en: {
    reportTitle: "V107 Report",
    reportIdPrefix: "ID:",
    exportPdf: "Export PDF",
    participant: "Participant",
    generationDate: "Generation Date",
    status: "Status",
    completed: "Completed",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    reportNotFoundCardTitle: "Report Not Found",
    reportNotFoundCardMessage: "The requested report could not be found",
    errorSavingChanges: "Error saving changes"
  }
};


export default function ReportView() {
  const [report, setReport] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingMarkdown, setIsEditingMarkdown] = useState(false);
  const [editedMarkdown, setEditedMarkdown] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('he');

  useEffect(() => {
    loadReport();
  }, []);

  const getText = (key) => {
    return TEXTS[currentLanguage][key] || TEXTS['he'][key]; // Fallback to Hebrew
  };

  const loadReport = async () => {
    let userIsAdmin = false;
    let currentUser = null;
    
    try {
      // Get current user - MUST be authenticated to view report
      try {
        currentUser = await base44.auth.me();
        setUser(currentUser);
        userIsAdmin = (currentUser?.role === 'admin');
        setIsAdmin(userIsAdmin);
      } catch (e) {
        console.log("User not authenticated - redirecting to login");
        // Redirect to login if not authenticated
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const reportId = urlParams.get('reportId') || urlParams.get('reportid');
      
      if (!reportId) {
        console.error("Missing reportId parameter");
        setIsLoading(false);
        return;
      }

      console.log("Fetching report with ID:", reportId);
      console.log("Current user email:", currentUser.email);
      
      // Fetch reports - RLS will automatically filter by user_email or admin role
      let loadedReport;
      try {
        const allReports = await base44.entities.GeneratedReport.list('-created_date');
        console.log(`User can access ${allReports.length} reports`);
        
        loadedReport = allReports.find(r => r.id === reportId);
        
        if (!loadedReport) {
          console.error(`Report not found or access denied. ID: ${reportId}`);
          console.log("User email:", currentUser.email);
          setReport(null);
          setIsLoading(false);
          return;
        }
        
        console.log("Report loaded successfully:", loadedReport.report_id);
        console.log("Report user_email:", loadedReport.user_email);
      } catch (e) {
        console.error("Error fetching reports:", e);
        setReport(null);
        setIsLoading(false);
        return;
      }
      
      setReport(loadedReport);
      setCurrentLanguage(loadedReport.language || 'he');

    } catch (error) {
      console.error("Unexpected error loading report:", error);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const startEditMarkdown = () => {
    if (!isAdmin) return;
    setEditedMarkdown(report.report_markdown || '');
    setIsEditingMarkdown(true);
  };

  const saveMarkdownEdit = async () => {
    if (!isAdmin) return;
    try {
      await base44.entities.GeneratedReport.update(report.id, {
        report_markdown: editedMarkdown
      });
      setReport({ ...report, report_markdown: editedMarkdown });
      setIsEditingMarkdown(false);
    } catch (error) {
      console.error(getText("errorSavingChanges"), error);
      alert(getText("errorSavingChanges"));
    }
  };

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

        {/* דוח מלא - תצוגה מותאמת */}
        {report.report_markdown ? (
          <div>
            {/* Archetype Header */}
            <Card className="mb-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none">
              <CardContent className="p-8 text-center">
                <Rocket className="w-16 h-16 mx-auto mb-4 text-white" />
                <h2 className="text-3xl font-black mb-3">
                  {report.archetype || (currentLanguage === 'he' ? 'דוח אישי' : 'Personal Report')}
                </h2>
                {report.recommended_booster_track && (
                  <Badge className="bg-white/20 text-white text-lg px-4 py-2 backdrop-blur-sm border border-white/30">
                    {currentLanguage === 'he' ? 'מסלול מומלץ:' : 'Recommended Track:'} {report.recommended_booster_track.toUpperCase()}
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="visual" className="mb-8 no-print">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {currentLanguage === 'he' ? 'תצוגה ויזואלית' : 'Visual View'}
                </TabsTrigger>
                <TabsTrigger value="markdown" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  {currentLanguage === 'he' ? 'תצוגת טקסט' : 'Text View'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visual" className="mt-6">
                <ExecutiveSummarySection 
                  executiveSummary={report.executive_summary} 
                  language={currentLanguage}
                />

                <DomainScoresSection 
                  domainScores={report.domain_scores} 
                  language={currentLanguage}
                />

                <DomainAnalysisSection 
                  domainAnalysis={report.domain_analysis}
                  domainScores={report.domain_scores}
                  language={currentLanguage}
                />

                <TrafficLightsSection 
                  trafficLights={report.traffic_lights_table} 
                  language={currentLanguage}
                />

                <KPIsSection 
                  kpis={report.kpis} 
                  language={currentLanguage}
                />

                <ActionPlanSection 
                  actionPlan={report.action_plan} 
                  language={currentLanguage}
                />

                <RecommendationsSection 
                  recommendations={report.focused_recommendations} 
                  language={currentLanguage}
                />
              </TabsContent>

              <TabsContent value="markdown" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {currentLanguage === 'he' ? 'דוח מלא - פורמט טקסט' : 'Full Report - Text Format'}
                      </CardTitle>
                      {isAdmin && !isEditingMarkdown && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={startEditMarkdown}
                        >
                          <Edit2 className="w-4 h-4 ml-2" />
                          {getText("edit")}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditingMarkdown && isAdmin ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editedMarkdown}
                          onChange={(e) => setEditedMarkdown(e.target.value)}
                          rows={30}
                          className="font-mono text-sm"
                        />
                        <div className="flex gap-2">
                          <Button onClick={saveMarkdownEdit}>
                            <Save className="w-4 h-4 ml-2" />
                            {getText("save")}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditingMarkdown(false)}
                          >
                            <X className="w-4 h-4 ml-2" />
                            {getText("cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="prose prose-xl max-w-none prose-headings:font-black prose-h1:text-4xl prose-h1:mb-6 prose-h1:text-blue-900 prose-h1:border-b-4 prose-h1:border-blue-600 prose-h1:pb-4 prose-h2:text-3xl prose-h2:mb-4 prose-h2:text-purple-900 prose-h2:mt-8 prose-h3:text-2xl prose-h3:mb-3 prose-h3:text-slate-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:my-4 prose-li:my-2 prose-li:text-gray-700 prose-strong:text-gray-900 prose-strong:font-bold prose-em:text-blue-700 prose-blockquote:border-r-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-lg prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-table:border-2 prose-table:border-gray-300 prose-th:bg-slate-100 prose-th:p-3 prose-th:font-bold prose-td:p-3 prose-td:border" 
                        dir={currentLanguage === 'he' ? 'rtl' : 'ltr'}
                      >
                        <ReactMarkdown
                          components={{
                            h1: ({children}) => (
                              <h1 className="text-4xl font-black mb-6 text-blue-900 border-b-4 border-blue-600 pb-4">
                                {children}
                              </h1>
                            ),
                            h2: ({children}) => (
                              <h2 className="text-3xl font-bold mb-4 text-purple-900 mt-8">
                                {children}
                              </h2>
                            ),
                            h3: ({children}) => (
                              <h3 className="text-2xl font-bold mb-3 text-slate-800">
                                {children}
                              </h3>
                            ),
                            p: ({children}) => (
                              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                                {children}
                              </p>
                            ),
                            ul: ({children}) => (
                              <ul className="my-4 space-y-2 list-disc pr-6">
                                {children}
                              </ul>
                            ),
                            ol: ({children}) => (
                              <ol className="my-4 space-y-2 list-decimal pr-6">
                                {children}
                              </ol>
                            ),
                            li: ({children}) => (
                              <li className="text-gray-700 leading-relaxed">
                                {children}
                              </li>
                            ),
                            strong: ({children}) => (
                              <strong className="text-gray-900 font-bold">
                                {children}
                              </strong>
                            ),
                            em: ({children}) => (
                              <em className="text-blue-700 font-semibold not-italic">
                                {children}
                              </em>
                            ),
                            blockquote: ({children}) => (
                              <blockquote className="border-r-4 border-blue-500 bg-blue-50 p-4 rounded-lg my-6">
                                {children}
                              </blockquote>
                            ),
                            table: ({children}) => (
                              <div className="overflow-x-auto my-6">
                                <table className="min-w-full border-2 border-gray-300 rounded-lg">
                                  {children}
                                </table>
                              </div>
                            ),
                            th: ({children}) => (
                              <th className="bg-slate-100 p-3 font-bold text-gray-900 border border-gray-300">
                                {children}
                              </th>
                            ),
                            td: ({children}) => (
                              <td className="p-3 border border-gray-300 text-gray-700">
                                {children}
                              </td>
                            ),
                            hr: () => (
                              <hr className="my-8 border-t-2 border-gray-200" />
                            )
                          }}
                        >
                          {report.report_markdown}
                        </ReactMarkdown>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card className="mb-8 bg-yellow-50 border-2 border-yellow-300">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-yellow-900">
                {currentLanguage === 'he' 
                  ? 'הדוח הזה נוצר בפורמט ישן ולא כולל את התוכן המעודכן'
                  : 'This report was created in the old format and does not include updated content'}
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                {currentLanguage === 'he'
                  ? 'אנא צור דוח חדש או פנה לצוות התמיכה'
                  : 'Please create a new report or contact support'}
              </p>
            </CardContent>
          </Card>
        )}
        </div>
        </div>
        );
}