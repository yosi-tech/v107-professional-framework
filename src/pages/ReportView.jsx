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
  AlertCircle,
  ArrowRight,
  Rocket,
  BarChart3,
  Target,
  TrendingUp,
  CheckCircle,
  Shield
} from "lucide-react";
import { format } from "date-fns";

import ExecutiveSummarySection from "@/components/report/ExecutiveSummarySection";
import DomainScoresSection from "@/components/report/DomainScoresSection";
import DomainAnalysisSection from "@/components/report/DomainAnalysisSection";
import TrafficLightsSection from "@/components/report/TrafficLightsSection";
import KPIsSection from "@/components/report/KPIsSection";
import ActionPlanSection from "@/components/report/ActionPlanSection";
import RecommendationsSection from "@/components/report/RecommendationsSection";
import BoosterOfferSection from "@/components/report/BoosterOfferSection";
import ExecutiveSummaryEditor from "@/components/report/ExecutiveSummaryEditor";
import DomainAnalysisEditor from "@/components/report/DomainAnalysisEditor";
import TrafficLightsEditor from "@/components/report/TrafficLightsEditor";
import KPIsEditor from "@/components/report/KPIsEditor";
import ActionPlanEditor from "@/components/report/ActionPlanEditor";
import RecommendationsEditor from "@/components/report/RecommendationsEditor";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('he');
  const [editingSection, setEditingSection] = useState(null);

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

  const startEditSection = (sectionName) => {
    if (!isAdmin) return;
    setEditingSection(sectionName);
  };

  const saveSection = async (sectionName, data) => {
    if (!isAdmin) return;
    try {
      await base44.entities.GeneratedReport.update(report.id, {
        [sectionName]: data
      });
      setReport({ ...report, [sectionName]: data });
      setEditingSection(null);
    } catch (error) {
      console.error(getText("errorSavingChanges"), error);
      alert(getText("errorSavingChanges"));
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
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

            <div className="mt-6" dir={currentLanguage === 'he' ? 'rtl' : 'ltr'}>
              {/* Executive Summary */}
              <div className="mb-8">
                {editingSection === 'executive_summary' && isAdmin ? (
                  <Card className="p-6">
                    <ExecutiveSummaryEditor
                      data={report.executive_summary}
                      onSave={(data) => saveSection('executive_summary', data)}
                      onCancel={cancelEdit}
                    />
                  </Card>
                ) : (
                  <div className="relative">
                    {isAdmin && (
                      <Button
                        onClick={() => startEditSection('executive_summary')}
                        size="sm"
                        variant="outline"
                        className="absolute top-4 left-4 z-10 no-print"
                      >
                        <Edit2 className="w-4 h-4 ml-2" />
                        {currentLanguage === 'he' ? 'ערוך' : 'Edit'}
                      </Button>
                    )}
                    <ExecutiveSummarySection 
                      executiveSummary={report.executive_summary} 
                      language={currentLanguage}
                    />
                  </div>
                )}
              </div>

              {/* Domain Scores */}
              <DomainScoresSection 
                domainScores={report.domain_scores} 
                language={currentLanguage}
              />

              {/* Domain Analysis */}
              <div className="mb-8">
                {editingSection === 'domain_analysis' && isAdmin ? (
                  <Card className="p-6">
                    <DomainAnalysisEditor
                      data={report.domain_analysis}
                      domainScores={report.domain_scores}
                      onSave={(data) => saveSection('domain_analysis', data)}
                      onCancel={cancelEdit}
                    />
                  </Card>
                ) : (
                  <div className="relative">
                    {isAdmin && (
                      <Button
                        onClick={() => startEditSection('domain_analysis')}
                        size="sm"
                        variant="outline"
                        className="absolute top-4 left-4 z-10 no-print"
                      >
                        <Edit2 className="w-4 h-4 ml-2" />
                        {currentLanguage === 'he' ? 'ערוך' : 'Edit'}
                      </Button>
                    )}
                    <DomainAnalysisSection 
                      domainAnalysis={report.domain_analysis}
                      domainScores={report.domain_scores}
                      language={currentLanguage}
                    />
                  </div>
                )}
              </div>

              {/* Traffic Lights */}
              <div className="mb-8">
                {editingSection === 'traffic_lights_table' && isAdmin ? (
                  <Card className="p-6">
                    <TrafficLightsEditor
                      data={report.traffic_lights_table}
                      onSave={(data) => saveSection('traffic_lights_table', data)}
                      onCancel={cancelEdit}
                    />
                  </Card>
                ) : (
                  <div className="relative">
                    {isAdmin && (
                      <Button
                        onClick={() => startEditSection('traffic_lights_table')}
                        size="sm"
                        variant="outline"
                        className="absolute top-4 left-4 z-10 no-print"
                      >
                        <Edit2 className="w-4 h-4 ml-2" />
                        {currentLanguage === 'he' ? 'ערוך' : 'Edit'}
                      </Button>
                    )}
                    <TrafficLightsSection 
                      trafficLights={report.traffic_lights_table} 
                      language={currentLanguage}
                    />
                  </div>
                )}
              </div>

              {/* KPIs */}
              <div className="mb-8">
                {editingSection === 'kpis' && isAdmin ? (
                  <Card className="p-6">
                    <KPIsEditor
                      data={report.kpis}
                      onSave={(data) => saveSection('kpis', data)}
                      onCancel={cancelEdit}
                    />
                  </Card>
                ) : (
                  <div className="relative">
                    {isAdmin && (
                      <Button
                        onClick={() => startEditSection('kpis')}
                        size="sm"
                        variant="outline"
                        className="absolute top-4 left-4 z-10 no-print"
                      >
                        <Edit2 className="w-4 h-4 ml-2" />
                        {currentLanguage === 'he' ? 'ערוך' : 'Edit'}
                      </Button>
                    )}
                    <KPIsSection 
                      kpis={report.kpis} 
                      language={currentLanguage}
                    />
                  </div>
                )}
              </div>

              {/* Action Plan */}
              <div className="mb-8">
                {editingSection === 'action_plan' && isAdmin ? (
                  <Card className="p-6">
                    <ActionPlanEditor
                      data={report.action_plan}
                      onSave={(data) => saveSection('action_plan', data)}
                      onCancel={cancelEdit}
                    />
                  </Card>
                ) : (
                  <div className="relative">
                    {isAdmin && (
                      <Button
                        onClick={() => startEditSection('action_plan')}
                        size="sm"
                        variant="outline"
                        className="absolute top-4 left-4 z-10 no-print"
                      >
                        <Edit2 className="w-4 h-4 ml-2" />
                        {currentLanguage === 'he' ? 'ערוך' : 'Edit'}
                      </Button>
                    )}
                    <ActionPlanSection 
                      actionPlan={report.action_plan} 
                      language={currentLanguage}
                    />
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                {editingSection === 'focused_recommendations' && isAdmin ? (
                  <Card className="p-6">
                    <RecommendationsEditor
                      data={report.focused_recommendations}
                      onSave={(data) => saveSection('focused_recommendations', data)}
                      onCancel={cancelEdit}
                    />
                  </Card>
                ) : (
                  <div className="relative">
                    {isAdmin && (
                      <Button
                        onClick={() => startEditSection('focused_recommendations')}
                        size="sm"
                        variant="outline"
                        className="absolute top-4 left-4 z-10 no-print"
                      >
                        <Edit2 className="w-4 h-4 ml-2" />
                        {currentLanguage === 'he' ? 'ערוך' : 'Edit'}
                      </Button>
                    )}
                    <RecommendationsSection 
                      recommendations={report.focused_recommendations} 
                      language={currentLanguage}
                    />
                  </div>
                )}
              </div>
            </div>
                        <style>{`
                          .report-text-view h1 {
                            background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
                            color: white;
                            padding: 2rem 2.5rem;
                            border-radius: 1rem;
                            font-size: 2.5rem;
                            font-weight: 900;
                            margin-bottom: 2rem;
                            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
                            position: relative;
                            overflow: hidden;
                          }
                          .report-text-view h1::before {
                            content: '';
                            position: absolute;
                            top: -50%;
                            right: -20%;
                            width: 200px;
                            height: 200px;
                            background: rgba(255, 255, 255, 0.1);
                            border-radius: 50%;
                            filter: blur(40px);
                          }

                          .report-text-view h2 {
                            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
                            color: white;
                            padding: 1.5rem 2rem;
                            border-radius: 1rem;
                            font-size: 2rem;
                            font-weight: 900;
                            margin: 2rem 0 1.5rem 0;
                            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                            display: flex;
                            align-items: center;
                            gap: 1rem;
                          }
                          .report-text-view h2::before {
                            content: '';
                            width: 8px;
                            height: 3rem;
                            background: white;
                            border-radius: 999px;
                          }

                          .report-text-view h3 {
                            background: linear-gradient(90deg, #f1f5f9 0%, transparent 100%);
                            padding: 1rem 1.5rem;
                            border-right: 5px solid #3b82f6;
                            border-radius: 0.5rem;
                            font-size: 1.75rem;
                            font-weight: 700;
                            color: #334155;
                            margin: 2rem 0 1rem 0;
                          }

                          .report-text-view p {
                            background: white;
                            padding: 1.5rem 2rem;
                            border-radius: 1rem;
                            font-size: 1.25rem;
                            line-height: 1.8;
                            color: #374151;
                            margin-bottom: 1rem;
                            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
                            border: 1px solid #f3f4f6;
                          }

                          .report-text-view ul, .report-text-view ol {
                            margin: 1.5rem 0;
                            display: flex;
                            flex-direction: column;
                            gap: 1rem;
                          }

                          .report-text-view li {
                            background: linear-gradient(135deg, white 0%, #eff6ff 100%);
                            padding: 1.25rem 1.5rem;
                            padding-right: 4rem;
                            border-radius: 1rem;
                            font-size: 1.125rem;
                            line-height: 1.7;
                            color: #374151;
                            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
                            position: relative;
                            border: 1px solid #dbeafe;
                            transition: all 0.2s;
                          }
                          .report-text-view li:hover {
                            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                            transform: translateY(-2px);
                          }
                          .report-text-view li::before {
                            content: '✓';
                            position: absolute;
                            right: 1rem;
                            top: 50%;
                            transform: translateY(-50%);
                            width: 2rem;
                            height: 2rem;
                            background: linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%);
                            color: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 900;
                            font-size: 1rem;
                            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
                          }

                          .report-text-view strong {
                            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                            color: #1e3a8a;
                            padding: 0.25rem 0.5rem;
                            border-radius: 0.375rem;
                            font-weight: 900;
                            border: 1px solid #93c5fd;
                          }

                          .report-text-view em {
                            background: linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%);
                            color: #581c87;
                            padding: 0.25rem 0.5rem;
                            border-radius: 0.375rem;
                            font-weight: 700;
                            font-style: normal;
                            border: 1px solid #c4b5fd;
                          }

                          .report-text-view blockquote {
                            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                            border-right: 6px solid #f59e0b;
                            padding: 2rem;
                            border-radius: 1rem;
                            margin: 2rem 0;
                            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                            position: relative;
                          }
                          .report-text-view blockquote::before {
                            content: '💡';
                            position: absolute;
                            top: 1rem;
                            right: 1rem;
                            font-size: 3rem;
                          }
                          .report-text-view blockquote p {
                            background: transparent;
                            padding: 0;
                            box-shadow: none;
                            border: none;
                            font-size: 1.125rem;
                            margin: 0;
                            padding-right: 4rem;
                            color: #78350f;
                          }

                          .report-text-view table {
                            width: 100%;
                            border-radius: 1rem;
                            overflow: hidden;
                            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                            margin: 2rem 0;
                            background: white;
                          }
                          .report-text-view thead {
                            background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
                          }
                          .report-text-view th {
                            padding: 1rem 1.5rem;
                            color: white;
                            font-weight: 900;
                            font-size: 1.125rem;
                            text-align: right;
                            border-bottom: 2px solid #475569;
                          }
                          .report-text-view td {
                            padding: 1rem 1.5rem;
                            color: #374151;
                            font-size: 1rem;
                            text-align: right;
                            border-bottom: 1px solid #e5e7eb;
                          }
                          .report-text-view tr:hover {
                            background: #f9fafb;
                          }

                          .report-text-view hr {
                            height: 3px;
                            background: linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%);
                            border: none;
                            border-radius: 999px;
                            margin: 3rem 0;
                          }
                        `}</style>
                        <ReactMarkdown>
                          {report.report_markdown}
                        </ReactMarkdown>
            </div>}

          {/* הצעת הבוסטר - סקשן נפרד */}
          {report.recommended_booster_track && (
            <div className="mt-12 print-break">
              <BoosterOfferSection 
                recommendedTrack={report.recommended_booster_track}
                language={currentLanguage}
              />
            </div>
          )}

          {/* דיסקליימרים משפטיים וטכנולוגיים */}
          <div className="mt-12 space-y-6">
              <Card className="border-2 border-slate-300 bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="w-6 h-6 text-slate-600" />
                    {currentLanguage === 'he' ? 'הצהרה משפטית' : 'Legal Disclaimer'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-700 leading-relaxed space-y-3">
                  <p>
                    {currentLanguage === 'he' 
                      ? 'דו"ח זה נוצר באמצעות מערכת V107 Professional Framework והוא מבוסס על תשובותיך לשאלון המקצועי. הדו"ח מספק הערכה כללית של פרופיל היזמי שלך ואינו מהווה ייעוץ משפטי, פיננסי או עסקי מקצועי.'
                      : 'This report was generated using the V107 Professional Framework system and is based on your responses to the professional questionnaire. The report provides a general assessment of your entrepreneurial profile and does not constitute professional legal, financial, or business advice.'}
                  </p>
                  <p>
                    {currentLanguage === 'he'
                      ? 'המלצות המופיעות בדו"ח הן כלליות במטרתן ועשויות שלא להתאים לכל מצב או נסיבות ספציפיות. אנו ממליצים להיוועץ עם מומחים מקצועיים מתאימים (עורכי דין, רואי חשבון, יועצים עסקיים) לפני קבלת החלטות עסקיות משמעותיות.'
                      : 'The recommendations in this report are general in nature and may not be suitable for every specific situation or circumstance. We recommend consulting with appropriate professional experts (lawyers, accountants, business consultants) before making significant business decisions.'}
                  </p>
                  <p>
                    {currentLanguage === 'he'
                      ? 'V107 ו/או מפעיליה אינם אחראים לכל נזק ישיר או עקיף הנובע משימוש בדו"ח זה או מהסתמכות על תוכנו. השימוש בדו"ח ובמידע המופיע בו נעשה על אחריותך הבלעדית.'
                      : 'V107 and/or its operators are not responsible for any direct or indirect damage resulting from the use of this report or reliance on its content. Use of the report and the information contained therein is at your sole risk.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-300 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                    {currentLanguage === 'he' ? 'גילוי טכנולוגי - שימוש בבינה מלאכותית' : 'Technology Disclosure - AI Usage'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-900 leading-relaxed space-y-3">
                  <p>
                    {currentLanguage === 'he'
                      ? 'דו"ח זה הופק בשילוב של טכנולוגיות בינה מלאכותית (AI) מתקדמות ובקרת איכות אנושית מקצועית. המערכת משתמשת במודלי שפה גדולים (LLMs) לניתוח התשובות שלך ולהפקת תובנות מותאמות אישית.'
                      : 'This report was generated using a combination of advanced artificial intelligence (AI) technologies and professional human quality control. The system uses Large Language Models (LLMs) to analyze your responses and generate personalized insights.'}
                  </p>
                  <p>
                    {currentLanguage === 'he'
                      ? 'תהליך הפקת הדו"ח כולל: (1) ניתוח כמותי אוטומטי של תשובותיך, (2) יצירת תובנות והמלצות באמצעות AI, (3) בדיקה ואימות על ידי צוות מומחים אנושי מנוסה. גישה היברידית זו מאפשרת לנו לספק ניתוח מעמיק ומדויק תוך שמירה על אמינות וסטנדרטים מקצועיים גבוהים.'
                      : 'The report generation process includes: (1) Automatic quantitative analysis of your responses, (2) Generation of insights and recommendations using AI, (3) Review and verification by an experienced human expert team. This hybrid approach allows us to provide in-depth and accurate analysis while maintaining reliability and high professional standards.'}
                  </p>
                  <p>
                    {currentLanguage === 'he'
                      ? 'חשוב לציין: למרות השימוש בטכנולוגיה מתקדמת, הדו"ח עדיין עשוי לכלול אי-דיוקים או פרשנויות שאינן מתאימות באופן מושלם למצבך הספציפי. אנו ממליצים להשתמש בדו"ח כנקודת התחלה לחשיבה ולתכנון, ולא כתחליף לשיקול דעת אישי או ייעוץ מקצועי מותאם.'
                      : 'Important note: Despite the use of advanced technology, the report may still contain inaccuracies or interpretations that may not perfectly fit your specific situation. We recommend using the report as a starting point for thinking and planning, not as a substitute for personal judgment or tailored professional advice.'}
                  </p>
                </CardContent>
            </Card>
          </div>
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