import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { 
  FileText, 
  User as UserIcon, 
  Calendar,
  Edit2,
  Download,
  Loader2,
  AlertCircle,
  ArrowRight,
  Rocket,
  BarChart3,
  Shield,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { format } from "date-fns";

import DomainScoresSection from "@/components/report/DomainScoresSection";
import TrafficLightsSection from "@/components/report/TrafficLightsSection";
import BoosterOfferSection from "@/components/report/BoosterOfferSection";
import FullReportSection from "@/components/report/FullReportSection";
import FullReportEditor from "@/components/report/FullReportEditor";
import TrafficLightsEditor from "@/components/report/TrafficLightsEditor";
import ReadinessTableSection from "@/components/report/ReadinessTableSection";
import ReadinessTableEditor from "@/components/report/ReadinessTableEditor";

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
    reportNotFoundCardTitle: "דו\"ח לא נמצא",
    reportNotFoundCardMessage: "לא ניתן למצוא את הדו\"ח המבוקש",
    errorSavingChanges: "שגיאה בשמירת השינויים",
    page: "עמוד",
    of: "מתוך",
    previousPage: "עמוד קודם",
    nextPage: "עמוד הבא"
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
    reportNotFoundCardTitle: "Report Not Found",
    reportNotFoundCardMessage: "The requested report could not be found",
    errorSavingChanges: "Error saving changes",
    page: "Page",
    of: "of",
    previousPage: "Previous Page",
    nextPage: "Next Page"
  }
};


export default function ReportView() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('he');
  const [editingSection, setEditingSection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = 5;

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
      // Try to get current user (optional)
      try {
        currentUser = await base44.auth.me();
        setUser(currentUser);
        userIsAdmin = (currentUser?.role === 'admin');
        setIsAdmin(userIsAdmin);
      } catch (e) {
        // User not authenticated - continue anyway
        console.log("User not authenticated - viewing report without user context");
      }

      const urlParams = new URLSearchParams(window.location.search);
      const reportId = urlParams.get('reportId') || urlParams.get('reportid');
      
      if (!reportId) {
        console.error("Missing reportId parameter");
        setIsLoading(false);
        return;
      }

      console.log("Fetching report with ID:", reportId);
      
      // Fetch report by ID directly
      let loadedReport;
      try {
        const allReports = await base44.entities.GeneratedReport.list('-created_date');
        loadedReport = allReports.find(r => r.id === reportId);
        
        if (!loadedReport) {
          console.error(`Report not found. ID: ${reportId}`);
          setReport(null);
          setIsLoading(false);
          return;
        }
        
        console.log("Report loaded successfully:", loadedReport.report_id);
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

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintPDF = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 100);
    }, 100);
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

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to top of content after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to top of content after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll to top of content after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
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

  // Split markdown into 5 pages using string search
  let pageContents = ['', '', '', '', ''];
  if (report.report_markdown) {
    const fullText = report.report_markdown;
    
    // Find markers - look for the line containing the page marker
    const findLineStart = (text, searchText) => {
      const index = text.indexOf(searchText);
      if (index === -1) return -1;
      // Find the start of the line containing the search text
      const lineStart = text.lastIndexOf('\n', index);
      return lineStart === -1 ? 0 : lineStart;
    };
    
    const page3Marker = findLineStart(fullText, 'עמוד 3');
    const page4Marker = findLineStart(fullText, 'עמוד 4');
    
    // For page 5, try multiple markers
    let page5Marker = findLineStart(fullText, 'עמוד 5');
    if (page5Marker === -1) page5Marker = findLineStart(fullText, 'V107-BOOSTER');
    if (page5Marker === -1) page5Marker = findLineStart(fullText, 'V107 BOOSTER');
    
    // Split content based on markers
    if (page3Marker >= 0) {
      // Everything before page 3
      const beforePage3 = fullText.substring(0, page3Marker);
      const beforeSections = beforePage3.split(/(?=^# )/m).filter(s => s.trim());
      pageContents[0] = beforeSections[0] || '';
      pageContents[1] = beforeSections.slice(1).join('\n\n') || '';
      
      // Page 3 content
      if (page4Marker >= 0) {
        pageContents[2] = fullText.substring(page3Marker, page4Marker).trim();
      } else if (page5Marker >= 0) {
        pageContents[2] = fullText.substring(page3Marker, page5Marker).trim();
      } else {
        pageContents[2] = fullText.substring(page3Marker).trim();
      }
      
      // Page 4 content
      if (page4Marker >= 0) {
        if (page5Marker >= 0) {
          pageContents[3] = fullText.substring(page4Marker, page5Marker).trim();
        } else {
          pageContents[3] = fullText.substring(page4Marker).trim();
        }
      }
      
      // Page 5 content
      if (page5Marker >= 0) {
        pageContents[4] = fullText.substring(page5Marker).trim();
      }
    } else {
      // No page markers found, split into sections
      const sections = fullText.split(/(?=^# )/m).filter(s => s.trim());
      pageContents[0] = sections[0] || '';
      pageContents[1] = sections.slice(1).join('\n\n') || '';
    }
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
            break-after: always;
          }

          .print-avoid-break { 
            page-break-inside: avoid; 
            break-inside: avoid;
          }

          @page { 
            margin: 1.5cm;
            size: A4;
          }

          /* Show all pages when printing */
          .print-all-pages {
            display: block !important;
          }

          /* Each print page */
          .print-page {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 2rem;
          }

          /* Prevent cards from breaking */
          .card, [class*="Card"] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            margin-bottom: 1rem !important;
          }

          /* Gradients - reduce to solid colors for print */
          [class*="bg-gradient"] {
            background: #4f46e5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Ensure content doesn't overflow */
          * {
            max-width: 100% !important;
          }

          /* Keep colors */
          .bg-green-500, .bg-orange-500, .bg-blue-500, .bg-amber-500,
          .bg-red-500, .bg-yellow-500, .bg-purple-500,
          .bg-green-100, .bg-yellow-100, .bg-red-100, .bg-blue-100, 
          .bg-purple-50, .bg-green-50, .bg-amber-50,
          .bg-indigo-600, .bg-purple-700 {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Fix spacing for print */
          .space-y-8 > * + * {
            margin-top: 1.5rem !important;
          }

          /* Reduce padding for print */
          .p-8 {
            padding: 1.5rem !important;
          }

          .p-12 {
            padding: 2rem !important;
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
                <Button onClick={() => navigate(-1)} variant="outline">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  {currentLanguage === 'he' ? 'חזור' : 'Back'}
                </Button>
                {isAdmin && (
                  <Button onClick={handlePrintPDF} variant="outline">
                    <Download className="w-4 h-4 ml-2" />
                    {getText("exportPdf")}
                  </Button>
                )}
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

        {/* Main Report with Page Navigation */}
        <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="bg-white border-b no-print">
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="ghost"
                size="sm"
                className="disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </Button>
              
              <div className="flex items-center justify-center gap-2 flex-wrap min-w-0">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-full font-semibold text-sm transition-all ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                variant="ghost"
                size="sm"
                className="disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-8 min-h-[600px] overflow-x-hidden">
            {/* Page 1-2: Markdown Content */}
            {(!isPrinting && (currentPage === 1 || currentPage === 2)) && (
              <div className="relative">
                {isAdmin && (
                  <Button
                    onClick={() => startEditSection('report_markdown')}
                    size="sm"
                    variant="outline"
                    className="absolute top-4 left-4 z-10 no-print"
                  >
                    <Edit2 className="w-4 h-4 ml-2" />
                    {getText('edit')}
                  </Button>
                )}
                {editingSection === 'report_markdown' ? (
                  <Card className="p-6">
                    <FullReportEditor
                      data={report.report_markdown}
                      onSave={(data) => saveSection('report_markdown', data)}
                      onCancel={cancelEdit}
                    />
                  </Card>
                ) : (
                  <FullReportSection markdownContent={pageContents[currentPage - 1]} />
                )}
              </div>
            )}

            {/* Page 3: Page 3 Header + Readiness Table + Domain Scores */}
            {(!isPrinting && currentPage === 3) && (
              <div className="space-y-8">
                {pageContents[2] && (
                  <FullReportSection markdownContent={pageContents[2]} />
                )}
                <div className="relative">
                  {isAdmin && (
                    <Button
                      onClick={() => startEditSection('domain_scores')}
                      size="sm"
                      variant="outline"
                      className="absolute top-4 left-4 z-10 no-print"
                    >
                      <Edit2 className="w-4 h-4 ml-2" />
                      {getText('edit')}
                    </Button>
                  )}
                  {editingSection === 'domain_scores' ? (
                    <Card className="p-6">
                      <ReadinessTableEditor
                        data={report.domain_scores}
                        onSave={(data) => saveSection('domain_scores', data)}
                        onCancel={cancelEdit}
                      />
                    </Card>
                  ) : (
                    <>
                      <ReadinessTableSection
                        domainScores={report.domain_scores}
                        language={currentLanguage}
                      />
                      <DomainScoresSection
                        domainScores={report.domain_scores}
                        language={currentLanguage}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Page 4: Action Plan */}
            {(!isPrinting && currentPage === 4) && (
              <div className="relative w-full overflow-x-auto">
                {isAdmin && (
                  <Button
                    onClick={() => startEditSection('page4_content')}
                    size="sm"
                    variant="outline"
                    className="absolute top-4 left-4 z-10 no-print"
                  >
                    <Edit2 className="w-4 h-4 ml-2" />
                    {getText('edit')}
                  </Button>
                )}
                {editingSection === 'page4_content' ? (
                  <Card className="p-6">
                    <FullReportEditor
                      data={report.report_markdown}
                      onSave={(data) => saveSection('report_markdown', data)}
                      onCancel={cancelEdit}
                    />
                  </Card>
                ) : (
                  <>
                    {pageContents[3] && (
                      <FullReportSection markdownContent={pageContents[3]} />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Page 5: Booster Offer */}
            {(!isPrinting && currentPage === 5) && (
              <div className="relative space-y-8 w-full" id="page-5-top">
                {pageContents[4] && (
                  <FullReportSection markdownContent={pageContents[4]} />
                )}
                {report.recommended_booster_track && (
                  <BoosterOfferSection
                    recommendedTrack={report.recommended_booster_track}
                    language={currentLanguage}
                    userName={report.user_name}
                  />
                )}
              </div>
            )}

            {/* Print All Pages */}
            {isPrinting && (
              <div className="print-all-pages space-y-8">
                {/* Page 1 */}
                <div className="print-page print-break">
                  {pageContents[0] && <FullReportSection markdownContent={pageContents[0]} />}
                </div>

                {/* Page 2 */}
                <div className="print-page print-break">
                  {pageContents[1] && <FullReportSection markdownContent={pageContents[1]} />}
                </div>

                {/* Page 3 */}
                <div className="print-page print-break">
                  {pageContents[2] && <FullReportSection markdownContent={pageContents[2]} />}
                  <ReadinessTableSection domainScores={report.domain_scores} language={currentLanguage} />
                  <DomainScoresSection domainScores={report.domain_scores} language={currentLanguage} />
                </div>

                {/* Page 4 */}
                <div className="print-page print-break">
                  {pageContents[3] && <FullReportSection markdownContent={pageContents[3]} />}
                </div>

                {/* Page 5 */}
                <div className="print-page">
                  {pageContents[4] && <FullReportSection markdownContent={pageContents[4]} />}
                  {report.recommended_booster_track && (
                    <BoosterOfferSection
                      recommendedTrack={report.recommended_booster_track}
                      language={currentLanguage}
                      userName={report.user_name}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Page Navigation - Bottom */}
            <div className="flex items-center justify-between mt-8 no-print">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="outline"
                className="disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5 ml-2" />
                {getText('previousPage')}
              </Button>
              <div className="flex gap-2 flex-wrap justify-center">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-full font-bold transition-all ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                className="disabled:opacity-50"
              >
                {getText('nextPage')}
                <ChevronLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal Disclaimers */}
        {!report.report_markdown && (
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

        {report.report_markdown && (
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
        )}
      </div>
    </div>
  );
}