import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText, Eye, Search, Loader2, Calendar, User as UserIcon, Mail,
  CheckCircle, Clock, AlertCircle, Trash2, FileSearch, RefreshCw, Send,
  DollarSign, Users, AlertTriangle, BarChart3, Edit3, Link2,
  ShoppingCart, Download, Rocket, TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getAbandonmentEmailTemplate } from "@/components/email/AbandonmentEmailTemplate";
import { simulatePurchase } from "@/functions/simulatePurchase";
import { EmailTemplateDialog } from "@/components/admin/EmailTemplateDialog";

import ContentManager from "@/components/admin/ContentManager";
import ScheduledTasksManager from "@/components/admin/ScheduledTasksManager";
import AbandonedTab from "@/components/admin/AbandonedTab";
import SurveyResultsTab from "@/components/admin/SurveyResultsTab";
import EmailTemplatesTab from "@/components/admin/EmailTemplatesTab";
import AdvancedAnalyticsTab from "@/components/admin/AdvancedAnalyticsTab";
import UsersTab from "@/components/admin/UsersTab";
import BoostersTab from "@/components/admin/BoostersTab";
import PaymentsTab from "@/components/admin/PaymentsTab";
import SiteAnalyticsTab from "@/components/admin/SiteAnalyticsTab";
import {
  ViewResponseDialog, ViewEmailsDialog, LanguageDialog,
  SimulationDialog, TemplateSelectionDialog, BoosterRegistrationDialog
} from "@/components/admin/AdminDialogs";

export default function AdminReports() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [responses, setResponses] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [siteSettings, setSiteSettings] = useState([]);
  const [boosterSubscriptions, setBoosterSubscriptions] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [paymentOrders, setPaymentOrders] = useState([]);
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
  const [templateSelectionDialog, setTemplateSelectionDialog] = useState({ open: false, response: null });
  const [simulationDialog, setSimulationDialog] = useState(false);
  const [simulationForm, setSimulationForm] = useState({ userEmail: '', productType: 'full_report', expressDelivery: false, language: 'he' });
  const [isSimulating, setIsSimulating] = useState(false);
  const [boosterRegistrationDialog, setBoosterRegistrationDialog] = useState(false);
  const [boosterRegForm, setBoosterRegForm] = useState({ reportId: '', userEmail: '' });
  const [isRegisteringBooster, setIsRegisteringBooster] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState(null);
  const [activeTab, setActiveTab] = useState('reports');
  const [filters, setFilters] = useState({ hasPurchased: 'all', hasReport: 'all', questionnaireStatus: 'all' });
  const [sortBy, setSortBy] = useState('date');
  const [reportGenerationMode, setReportGenerationMode] = useState('claude');

  useEffect(() => { checkAdminAndLoadData(); }, []);

  const checkAdminAndLoadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (currentUser.role !== 'admin') { window.location.href = createPageUrl("Home"); return; }
      setUser(currentUser);
      await loadData();
    } catch (error) {
      console.error("Error checking admin:", error);
      window.location.href = createPageUrl("Home");
    } finally { setIsLoading(false); }
  };

  const loadData = async () => {
    try {
      const [completedResponses, inProgressResponses, allReports, allUsers, allEmailLogs, allEmailTemplates, allSurveyResponses, allSiteSettings, allBoosterSubscriptions, allContentItems, allPaymentOrders] = await Promise.all([
        base44.entities.QuestionnaireResponse.filter({ status: 'completed' }, '-created_date'),
        base44.entities.QuestionnaireResponse.filter({ status: 'in_progress' }, '-created_date'),
        base44.entities.GeneratedReport.list('-created_date'),
        base44.entities.User.list(),
        base44.entities.EmailLog.list('-created_date'),
        base44.entities.EmailTemplate.list('-created_date'),
        base44.entities.SurveyResponse.list('-created_date'),
        base44.entities.SiteSettings.list().catch(() => []),
        base44.entities.OnlineCoachingSubscription.list('-created_date').catch(() => []),
        base44.entities.ContentItem.list().catch(() => []),
        base44.entities.PaymentOrder.list('-created_date').catch(() => [])
      ]);
      setResponses([...completedResponses, ...inProgressResponses]);
      setReports(allReports);
      setUsers(allUsers);
      setEmailLogs(allEmailLogs);
      setEmailTemplates(allEmailTemplates);
      setSurveyResponses(allSurveyResponses);
      setSiteSettings(allSiteSettings);
      setBoosterSubscriptions(allBoosterSubscriptions);
      setContentItems(allContentItems);
      setPaymentOrders(allPaymentOrders);
    } catch (error) { console.error("Error loading data:", error); }
  };

  const getReportForResponse = (responseId) => reports.find((r) => r.questionnaire_response_id === responseId);
  const getUserForResponse = (response) => users.find((u) => u.email === response.created_by || u.email === response.personal_info?.email);
  const getEmailsForResponse = (response) => emailLogs.filter((log) => log.related_questionnaire_response_id === response.id || log.related_user_email === response.created_by || log.related_user_email === response.personal_info?.email);

  const generateReport = async (response, isRegenerate = false) => {
    setGeneratingReportId(response.id);
    const reportLanguage = response.language || 'he';
    try {
      if (!response.responses || Object.keys(response.responses).length === 0) {
        alert(reportLanguage === 'en' ? "The questionnaire does not contain answers." : "השאלון לא מכיל תשובות. לא ניתן ליצור דו\"ח.");
        setGeneratingReportId(null); return;
      }
      if (isRegenerate) {
        const existingReport = getReportForResponse(response.id);
        if (existingReport) { await base44.entities.GeneratedReport.delete(existingReport.id); }
      }
      const functionName = reportGenerationMode === 'claude' ? 'generateReportV7Pro' : reportGenerationMode === 'v6_pro_ultimate' ? 'generateReportV6ProUltimate' : 'generateReportAutomatic';
      const result = await base44.functions.invoke(functionName, { responseId: response.id });
      await loadData();
      if (isRegenerate) { alert(reportLanguage === 'en' ? 'Report successfully regenerated!' : 'הדו"ח נוצר מחדש בהצלחה!'); }
      else if (result.data?.reportId) { window.location.href = createPageUrl(`ReportView?reportId=${result.data.reportId}`); }
      else { alert('הדוח נוצר בהצלחה!'); }
    } catch (error) {
      console.error("Error generating report:", error);
      alert(`${reportLanguage === 'en' ? 'Error:' : 'שגיאה:'} ${error.message || 'שגיאה לא ידועה'}`);
    } finally { setGeneratingReportId(null); }
  };

  const deleteResponse = async (responseId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את השאלון?')) return;
    setDeletingResponseId(responseId);
    try {
      const relatedReport = reports.find((r) => r.questionnaire_response_id === responseId);
      if (relatedReport) await base44.entities.GeneratedReport.delete(relatedReport.id);
      const relatedEmailLogs = emailLogs.filter((log) => log.related_questionnaire_response_id === responseId);
      await Promise.all(relatedEmailLogs.map((log) => base44.entities.EmailLog.delete(log.id)));
      await base44.entities.QuestionnaireResponse.delete(responseId);
      await loadData();
      alert('השאלון נמחק בהצלחה');
    } catch (error) { console.error("Error:", error); alert('שגיאה במחיקת השאלון'); }
    finally { setDeletingResponseId(null); }
  };

  const getReportReadyEmailContent = (report, clientName, language = 'he') => {
    const reportUrl = `${window.location.origin}${createPageUrl(`ReportView?reportId=${report.id}`)}`;
    if (language === 'he') {
      return {
        emailSubject: `דו"ח V107 שלך מוכן! 📊 [${report.report_id}]`,
        emailHtml: `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{direction:rtl;text-align:right;}</style></head><body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,sans-serif;direction:rtl;"><table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;margin-top:20px;margin-bottom:20px;background-color:#ffffff;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);direction:rtl;"><tr><td align="center" style="padding:40px 0;background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%);"><h1 style="color:#ffffff;font-size:28px;margin:0;font-weight:bold;">V107</h1><p style="color:#e0e7ff;font-size:14px;margin:8px 0 0;">דו"ח ניתוח יזמי מקצועי</p></td></tr><tr><td style="padding:40px 30px;direction:rtl;text-align:right;"><h2 style="color:#1f2937;font-size:22px;margin:0 0 20px;">שלום ${clientName},</h2><p style="color:#4b5563;line-height:1.8;font-size:16px;margin:0 0 20px;">שמחים להודיע לך שדו"ח V107 שלך מוכן! 🎉</p><p style="color:#4b5563;line-height:1.8;font-size:16px;margin:0 0 20px;">הדו"ח המקצועי שלך כולל ניתוח מעמיק של הפרופיל היזמי שלך.</p><div style="background-color:#eff6ff;padding:20px;border-radius:8px;margin:25px 0;border-left:4px solid #3b82f6;"><h3 style="color:#1e40af;font-size:18px;margin:0 0 12px;">מה תמצא/י בדו"ח:</h3><ul style="color:#1e40af;line-height:1.8;margin:0;padding-left:20px;"><li>ניתוח מקיף של 5 תחומי ליבה יזמיים</li><li>זיהוי חוזקות וחולשות מרכזיות</li><li>גרפים ותצוגות חזותיות להמחשה</li><li>תכנית פעולה מפורטת ל-6 חודשים</li><li>המלצות מותאמות אישית</li><li>KPIs מוצעים למעקב והתקדמות</li></ul></div><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding:30px 0;"><a href="${reportUrl}" target="_blank" rel="noopener noreferrer" style="background:linear-gradient(135deg,#3b82f6 0%,#1e40af 100%);color:#ffffff !important;text-decoration:none !important;padding:16px 40px;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;">📊 צפה בדו"ח המלא</a></td></tr></table><div style="background-color:#fef3c7;padding:16px;border-radius:8px;margin:25px 0;"><p style="color:#92400e;margin:0;font-size:14px;line-height:1.6;"><strong>💡 טיפ:</strong> לשמירת הדו"ח כ-PDF, פתח את הקישור למעלה ולחץ על כפתור "ייצוא PDF".</p></div><p style="color:#4b5563;line-height:1.8;font-size:16px;margin:20px 0 0;">יש שאלות? פשוט השב/י למייל זה.</p><div style="margin-top:40px;padding-top:30px;border-top:1px solid #e5e7eb;"><p style="color:#4b5563;line-height:1.6;font-size:14px;margin:0;">בהצלחה במסע היזמי שלך! 🚀</p><p style="color:#6b7280;font-size:14px;margin:8px 0 0;font-weight:600;">צוות V107<br>עלית – יזום עסקים</p></div></td></tr><tr><td style="background-color:#f3f4f6;padding:30px;text-align:center;"><p style="color:#6b7280;font-size:13px;margin:0 0 8px;">מזהה דו"ח: <strong>${report.report_id}</strong></p><p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.6;">© ${new Date().getFullYear()} עלית – יזום עסקים. כל הזכויות שמורות.<br>הדו"ח מיועד לשימוש אישי בלבד.</p></td></tr></table></body></html>`
      };
    }
    return {
      emailSubject: `Your V107 Report is Ready! 📊 [${report.report_id}]`,
      emailHtml: `<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{direction:ltr;text-align:left;}</style></head><body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,sans-serif;direction:ltr;"><table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;margin-top:20px;margin-bottom:20px;background-color:#ffffff;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);direction:ltr;"><tr><td align="center" style="padding:40px 0;background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%);"><h1 style="color:#ffffff;font-size:28px;margin:0;font-weight:bold;">V107</h1><p style="color:#e0e7ff;font-size:14px;margin:8px 0 0;">Professional Entrepreneurial Analysis Report</p></td></tr><tr><td style="padding:40px 30px;direction:ltr;text-align:left;"><h2 style="color:#1f2937;font-size:22px;margin:0 0 20px;">Hello ${clientName},</h2><p style="color:#4b5563;line-height:1.8;font-size:16px;margin:0 0 20px;">We're excited to let you know that your V107 report is ready! 🎉</p><div style="background-color:#eff6ff;padding:20px;border-radius:8px;margin:25px 0;border-left:4px solid #3b82f6;"><h3 style="color:#1e40af;font-size:18px;margin:0 0 12px;">What you'll find in your report:</h3><ul style="color:#1e40af;line-height:1.8;margin:0;padding-left:20px;"><li>Comprehensive analysis of 5 core entrepreneurial domains</li><li>Identification of key strengths and weaknesses</li><li>Visual charts and graphics</li><li>Detailed 6-month action plan</li><li>Personalized recommendations</li><li>Suggested KPIs for tracking</li></ul></div><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding:30px 0;"><a href="${reportUrl}" target="_blank" rel="noopener noreferrer" style="background:linear-gradient(135deg,#3b82f6 0%,#1e40af 100%);color:#ffffff !important;text-decoration:none !important;padding:16px 40px;border-radius:8px;font-weight:bold;font-size:16px;display:inline-block;">📊 View Full Report</a></td></tr></table><div style="background-color:#fef3c7;padding:16px;border-radius:8px;margin:25px 0;"><p style="color:#92400e;margin:0;font-size:14px;line-height:1.6;"><strong>💡 Tip:</strong> To save as PDF, click "Export PDF" at the top of the report.</p></div><p style="color:#4b5563;line-height:1.8;font-size:16px;margin:20px 0 0;">Have questions? Reply to this email.</p><div style="margin-top:40px;padding-top:30px;border-top:1px solid #e5e7eb;"><p style="color:#4b5563;line-height:1.6;font-size:14px;margin:0;">Best of luck! 🚀</p><p style="color:#6b7280;font-size:14px;margin:8px 0 0;font-weight:600;">V107 Team<br>Elit – Business Initiatives</p></div></td></tr><tr><td style="background-color:#f3f4f6;padding:30px;text-align:center;"><p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Report ID: <strong>${report.report_id}</strong></p><p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.6;">© ${new Date().getFullYear()} Elit – Business Initiatives. All rights reserved.</p></td></tr></table></body></html>`
    };
  };

  const sendReportToClient = async (language) => {
    const { report, response } = languageDialog;
    if (!report || !response) return;
    setSendingReportId(report.id);
    setLanguageDialog({ open: false, report: null, response: null });
    try {
      const clientEmail = response.personal_info?.email || report.user_email;
      const clientName = response.personal_info?.full_name || report.user_name;
      if (!users.some((u) => u.email === clientEmail)) {
        alert(`לא ניתן לשלוח מייל - המשתמש ${clientEmail} לא רשום באפליקציה.`);
        setSendingReportId(null); return;
      }
      const { emailSubject, emailHtml } = getReportReadyEmailContent(report, clientName, language);
      await base44.integrations.Core.SendEmail({ to: clientEmail, subject: emailSubject, body: emailHtml });
      await base44.entities.EmailLog.create({ to_email: clientEmail, email_type: 'report_ready', subject: emailSubject, related_user_email: clientEmail, related_questionnaire_response_id: response.id, related_report_id: report.id, sent_manually: true, language });
      await loadData();
      alert(`הדו"ח נשלח בהצלחה ל-${clientEmail}`);
    } catch (error) { console.error("Error:", error); alert(`שגיאה בשליחת הדו"ח: ${error.message}`); }
    finally { setSendingReportId(null); }
  };

  // שליחה ישירה של דוח ללקוח - בשפת השאלון, ללא דיאלוג
  const sendReportDirectly = async (report, response) => {
    setSendingReportId(report.id);
    try {
      const clientEmail = response.personal_info?.email || report.user_email;
      const clientName = response.personal_info?.full_name || report.user_name;
      const language = response.language || 'he';
      if (!users.some((u) => u.email === clientEmail)) {
        alert(`לא ניתן לשלוח מייל - המשתמש ${clientEmail} לא רשום באפליקציה.`);
        setSendingReportId(null); return;
      }
      const { emailSubject, emailHtml } = getReportReadyEmailContent(report, clientName, language);
      await base44.integrations.Core.SendEmail({ to: clientEmail, subject: emailSubject, body: emailHtml });
      await base44.entities.EmailLog.create({ to_email: clientEmail, email_type: 'report_ready', subject: emailSubject, related_user_email: clientEmail, related_questionnaire_response_id: response.id, related_report_id: report.id, sent_manually: true, language });
      await loadData();
      alert(`הדו"ח נשלח בהצלחה ל-${clientEmail}`);
    } catch (error) { console.error("Error:", error); alert(`שגיאה בשליחת הדו"ח: ${error.message}`); }
    finally { setSendingReportId(null); }
  };

  const sendManualEmailFromTemplate = async (template, response) => {
    if (!response) { alert('אין נתוני משתמש'); return; }
    setSendingEmailType(`template_${template.id}_${response.id}`);
    const emailLanguage = response.language || 'he';
    try {
      const userEmail = response.personal_info?.email || response.created_by;
      const userName = response.personal_info?.full_name || 'משתמש';
      if (!userEmail) { alert('לא נמצאה כתובת מייל'); setSendingEmailType(null); return; }
      let couponCode = null;
      if (template.include_coupon) {
        couponCode = `TEMPLATE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const validUntil = new Date(); validUntil.setDate(validUntil.getDate() + 30);
        await base44.entities.Coupon.create({ code: couponCode, discount_amount: template.coupon_amount || 50, valid_until: validUntil.toISOString(), user_email: userEmail, source: 'abandonment_survey' });
      }
      const emailSubject = emailLanguage === 'he' ? template.subject_he : template.subject_en;
      let emailHtml = emailLanguage === 'he' ? template.content_he : template.content_en;
      const surveyUrl = `${window.location.origin}${createPageUrl('Survey')}`;
      const questionnaireUrl = `${window.location.origin}${createPageUrl('Questionnaire')}`;
      const reportUrl = `${window.location.origin}${createPageUrl('MyAccount')}`;
      const purchaseUrl = `${window.location.origin}${createPageUrl(`Completion?responseId=${response.id}`)}`;
      emailHtml = emailHtml.replace(/{userName}/g, userName).replace(/{surveyUrl}/g, surveyUrl).replace(/{questionnaireUrl}/g, questionnaireUrl).replace(/{reportUrl}/g, reportUrl).replace(/{purchaseUrl}/g, purchaseUrl).replace(/{couponCode}/g, couponCode || '');
      await base44.integrations.Core.SendEmail({ to: userEmail, subject: emailSubject, body: emailHtml });
      await base44.entities.EmailLog.create({ to_email: userEmail, email_type: template.template_type, subject: emailSubject, related_user_email: userEmail, related_questionnaire_response_id: response.id, sent_manually: true, language: emailLanguage });
      setTemplateSelectionDialog({ open: false, response: null });
      await loadData();
      alert(`מייל נשלח בהצלחה ל-${userEmail}`);
    } catch (error) { console.error("Error:", error); alert(`שגיאה: ${error.message}`); }
    finally { setSendingEmailType(null); }
  };

  const deleteTemplate = async (templateId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את התבנית?')) return;
    setDeletingTemplateId(templateId);
    try { await base44.entities.EmailTemplate.delete(templateId); await loadData(); alert('התבנית נמחקה בהצלחה'); }
    catch (error) { console.error("Error:", error); alert('שגיאה במחיקת התבנית'); }
    finally { setDeletingTemplateId(null); }
  };

  const handleUserPurchaseStatusChange = async (userEmail, status) => {
    try {
      let updateData = { has_purchased_full_report: false, has_purchased_answers_download: false };
      if (status === 'full_report') updateData.has_purchased_full_report = true;
      else if (status === 'answers_download') updateData.has_purchased_answers_download = true;
      const userToUpdate = users.find((u) => u.email === userEmail);
      if (!userToUpdate) { alert('משתמש לא נמצא'); return; }
      await base44.entities.User.update(userToUpdate.id, updateData);
      const userReports = reports.filter((r) => r.user_email === userEmail);
      for (const report of userReports) { await base44.entities.GeneratedReport.update(report.id, { purchased: status !== 'none' }); }
      await loadData();
      alert('סטטוס רכישה עודכן בהצלחה!');
    } catch (error) { console.error("Error:", error); alert('שגיאה בעדכון'); }
  };

  const handleSimulatePurchase = async () => {
    if (!simulationForm.userEmail) { alert('יש למלא כתובת אימייל'); return; }
    setIsSimulating(true);
    try {
      let price = 0;
      if (simulationForm.productType === 'full_report') price = simulationForm.expressDelivery ? 378 : 299;
      else if (simulationForm.productType === 'answers_download') price = 59;
      else if (simulationForm.productType === 'online_coaching_7days') price = 497;
      await simulatePurchase({ userEmail: simulationForm.userEmail, productType: simulationForm.productType, price, expressDelivery: simulationForm.expressDelivery, language: simulationForm.language });
      alert('הרכישה דומתה בהצלחה!');
      setSimulationDialog(false);
      setSimulationForm({ userEmail: '', productType: 'full_report', expressDelivery: false, language: 'he' });
      await loadData();
    } catch (error) { console.error("Error:", error); alert(`שגיאה: ${error.message}`); }
    finally { setIsSimulating(false); }
  };

  const handleManualBoosterRegistration = async () => {
    if (!boosterRegForm.reportId) { alert('יש לבחור דוח'); return; }
    setIsRegisteringBooster(true);
    try {
      const report = reports.find(r => r.id === boosterRegForm.reportId);
      if (!report) { alert('דוח לא נמצא'); return; }
      const result = await base44.functions.invoke('manualBoosterRegistration', { userEmail: report.user_email, reportId: boosterRegForm.reportId });
      if (result.data.success) {
        alert(`הרישום בוצע בהצלחה! משימה ראשונה נשלחה ל-${report.user_email}`);
        setBoosterRegistrationDialog(false);
        setBoosterRegForm({ reportId: '', userEmail: '' });
        await loadData();
      } else { alert('שגיאה: ' + (result.data.error || 'לא ידוע')); }
    } catch (error) { console.error("Error:", error); alert(`שגיאה: ${error.message}`); }
    finally { setIsRegisteringBooster(false); }
  };

  const getAbandonedUsers = () => users.filter((u) => {
    const hasCompleted = responses.some((r) => (r.created_by === u.email || r.personal_info?.email === u.email) && r.status === 'completed');
    const hasPurchased = reports.some((r) => r.user_email === u.email && r.purchased === true) || u.has_purchased_full_report === true || u.has_purchased_answers_download === true;
    return hasCompleted && !hasPurchased;
  });

  const getInProgressUsers = () => users.filter((u) => {
    const hasInProgress = responses.some((r) => (r.created_by === u.email || r.personal_info?.email === u.email) && r.status === 'in_progress');
    const hasCompleted = responses.some((r) => (r.created_by === u.email || r.personal_info?.email === u.email) && r.status === 'completed');
    return hasInProgress && !hasCompleted;
  });

  const abandonedUsers = getAbandonedUsers();
  const inProgressUsers = getInProgressUsers();

  const filteredAndSortedResponses = responses.filter((r) => {
    const fullName = r.personal_info?.full_name || '';
    const email = r.personal_info?.email || '';
    if (!fullName.toLowerCase().includes(searchTerm.toLowerCase()) && !email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filters.hasPurchased !== 'all') {
      const userEmail = r.personal_info?.email || r.created_by;
      const userInfo = users.find(u => u.email === userEmail);
      const hasPurchased = reports.some((report) => report.user_email === userEmail && report.purchased === true) || userInfo?.has_purchased_full_report === true || userInfo?.has_purchased_answers_download === true;
      if (filters.hasPurchased === 'purchased' && !hasPurchased) return false;
      if (filters.hasPurchased === 'not_purchased' && hasPurchased) return false;
    }
    if (filters.hasReport !== 'all') {
      const hasReport = !!getReportForResponse(r.id);
      if (filters.hasReport === 'has_report' && !hasReport) return false;
      if (filters.hasReport === 'no_report' && hasReport) return false;
    }
    if (filters.questionnaireStatus !== 'all') {
      if (filters.questionnaireStatus === 'abandoned') { if (r.status !== 'in_progress' && r.status !== 'abandoned') return false; }
      else if (r.status !== filters.questionnaireStatus) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') return (a.personal_info?.full_name || '').localeCompare(b.personal_info?.full_name || '', 'he');
    if (sortBy === 'date') return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
    if (sortBy === 'hours') return (Date.now() - new Date(b.created_date).getTime()) - (Date.now() - new Date(a.created_date).getTime());
    if (sortBy === 'urgency') {
      const score = (r) => {
        const emails = getEmailsForResponse(r);
        const reportSent = emails.find(e => e.email_type === 'report_ready');
        const existingReport = getReportForResponse(r.id);
        const hoursAgo = Math.floor((Date.now() - new Date(r.created_date).getTime()) / (1000 * 60 * 60));
        if (existingReport && !reportSent && hoursAgo >= 96) return 1000;
        if (existingReport && !reportSent && hoursAgo >= 72) return 500;
        if (existingReport && !reportSent) return 100;
        if (!existingReport && r.status === 'completed') return 50;
        return 0;
      };
      return score(b) - score(a);
    }
    return 0;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-right w-full sm:w-auto order-2 sm:order-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">ניהול V107</h1>
            <p className="text-sm sm:text-base text-gray-600">ניהול שאלונים, דו"חות ומשתמשים</p>
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto order-1 sm:order-2">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <label className="text-xs font-medium text-gray-700 whitespace-nowrap">מנוע דוחות:</label>
              <select value={reportGenerationMode} onChange={(e) => setReportGenerationMode(e.target.value)} className="border-0 bg-transparent text-xs font-semibold text-blue-600 focus:outline-none cursor-pointer" dir="rtl">
                <option value="claude">V7 PRO Claude 🤖</option><option value="v6_pro_ultimate">V8 PRO Ultimate ⚡</option><option value="original">Original (ישן)</option>
              </select>
            </div>
            <Button onClick={() => setSimulationDialog(true)} className="bg-purple-600 hover:bg-purple-700 flex-1 sm:flex-initial text-sm flex items-center gap-2 flex-row-reverse">
              <span>דמה רכישת מוצר</span><DollarSign className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigate(createPageUrl('BoosterContinuation'))} className="bg-pink-600 hover:bg-pink-700 flex-1 sm:flex-initial text-sm flex items-center gap-2 flex-row-reverse">
              <span>עמוד מוצר בוסטר</span><Rocket className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="reports" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap w-full justify-center mb-8 gap-1 h-auto p-2">
            <TabsTrigger value="advanced-analytics" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>ניתוח מתקדם</span><BarChart3 className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="survey-results" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>סקר ({surveyResponses.length})</span><FileSearch className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="boosters" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>בוסטרים ({boosterSubscriptions.length})</span><Rocket className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="abandoned" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>נטשו ({inProgressUsers.length + abandonedUsers.length})</span><AlertTriangle className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>שאלונים</span><FileText className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>משתמשים ({users.length})</span><Users className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="email-templates" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>תבניות</span><Mail className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="content-management" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>ניהול תוכן</span><Edit3 className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="scheduled-tasks" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>תזמונים</span><Clock className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>תשלומים ({paymentOrders.length})</span><ShoppingCart className="w-3 h-3" /></TabsTrigger>
            <TabsTrigger value="site-analytics" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2"><span>תנועת אתר</span><TrendingUp className="w-3 h-3" /></TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="flex justify-end mb-4">
              <Link to={createPageUrl("AdminQuestionnaireExport")}>
                <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2 flex-row-reverse">
                  <span>ייצוא כל השאלונים לקובץ</span><Download className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-right">שאלונים שהושלמו</CardTitle><FileText className="w-4 h-4 text-gray-500" /></CardHeader><CardContent><div className="text-xl sm:text-2xl font-bold text-right">{responses.length}</div></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-right">דו"חות שנוצרו</CardTitle><CheckCircle className="w-4 h-4 text-green-600" /></CardHeader><CardContent><div className="text-xl sm:text-2xl font-bold text-green-600 text-right">{reports.length}</div></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-right">ממתינים לדו"ח</CardTitle><Clock className="w-4 h-4 text-orange-600" /></CardHeader><CardContent><div className="text-xl sm:text-2xl font-bold text-orange-600 text-right">{responses.length - reports.length}</div></CardContent></Card>
            </div>

            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input type="text" placeholder="חיפוש לפי שם או אימייל..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10 text-right" />
              </div>
              <div className="flex gap-3 flex-wrap justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">סדר לפי:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right" dir="rtl">
                    <option value="date">תאריך</option><option value="name">שם</option><option value="urgency">דחיפות</option><option value="hours">מספר שעות</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">רכישה:</label>
                  <select value={filters.hasPurchased} onChange={(e) => setFilters({ ...filters, hasPurchased: e.target.value })} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right" dir="rtl">
                    <option value="all">הכל</option><option value="purchased">רכש</option><option value="not_purchased">לא רכש</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">דוח:</label>
                  <select value={filters.hasReport} onChange={(e) => setFilters({ ...filters, hasReport: e.target.value })} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right" dir="rtl">
                    <option value="all">הכל</option><option value="has_report">יש דוח</option><option value="no_report">אין דוח</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">סטטוס שאלון:</label>
                  <select value={filters.questionnaireStatus} onChange={(e) => setFilters({ ...filters, questionnaireStatus: e.target.value })} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right" dir="rtl">
                    <option value="all">הכל</option><option value="completed">שאלון מלא</option><option value="abandoned">נטש שאלון</option>
                  </select>
                </div>
                {(filters.hasPurchased !== 'all' || filters.hasReport !== 'all' || filters.questionnaireStatus !== 'all') && (
                  <Button variant="outline" size="sm" onClick={() => setFilters({ hasPurchased: 'all', hasReport: 'all', questionnaireStatus: 'all' })} className="text-xs">נקה סינונים</Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {filteredAndSortedResponses.map((response) => {
                const existingReport = getReportForResponse(response.id);
                const userInfo = getUserForResponse(response);
                const emails = getEmailsForResponse(response);
                const isGenerating = generatingReportId === response.id;
                const isDeleting = deletingResponseId === response.id;
                const fullName = response.personal_info?.full_name || 'שם לא זמין';
                const email = response.personal_info?.email || 'אימייל לא זמין';
                const age = response.personal_info?.age;
                const occupation = response.personal_info?.occupation;
                const userEmail = response.personal_info?.email || response.created_by;
                const userAllResponses = responses.filter((r) => r.personal_info?.email === userEmail || r.created_by === userEmail).sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
                const responseIndex = userAllResponses.findIndex((r) => r.id === response.id) + 1;
                const hasMultipleResponses = userAllResponses.length > 1;
                const purchasedReport = reports.find((r) => r.user_email === userEmail && r.purchased === true);
                const hasPurchasedFullReport = userInfo?.has_purchased_full_report === true;
                const hasPurchasedAnswersDownload = userInfo?.has_purchased_answers_download === true;
                const expressDelivery = userInfo?.express_delivery === true;
                const paymentAmount = userInfo?.payment_amount ?? 0;
                const purchaseStatus = (purchasedReport || hasPurchasedFullReport || hasPurchasedAnswersDownload) ? (hasPurchasedFullReport ? `דו"ח מלא${expressDelivery ? ' + מואץ' : ''}` : 'תשובות בלבד') : 'לא רכש';
                const hoursAgo = Math.floor((Date.now() - new Date(response.created_date).getTime()) / (1000 * 60 * 60));
                const reportSentEmail = emails.find((e) => e.email_type === 'report_ready');
                const isReportSent = !!reportSentEmail;
                let cardBgClass = '', timeWarningClass = '';
                if (response.status === 'completed' && isReportSent) { cardBgClass = 'bg-green-50 border-green-300'; }
                else if (existingReport && !isReportSent) {
                  if (hoursAgo >= 96) { cardBgClass = 'bg-red-50 border-red-300'; timeWarningClass = 'text-red-700 font-bold'; }
                  else if (hoursAgo >= 72) { cardBgClass = 'bg-yellow-50 border-yellow-300'; timeWarningClass = 'text-yellow-700 font-semibold'; }
                }

                return (
                  <Card key={response.id} className={`hover:shadow-lg transition-shadow ${cardBgClass}`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-start gap-3 mb-3 flex-row-reverse">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                              <div className="flex items-center gap-2 mb-2 flex-row-reverse flex-wrap">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{fullName}</h3>
                                {hasMultipleResponses && <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 text-xs">שאלון #{responseIndex} מתוך {userAllResponses.length}</Badge>}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5 flex-row-reverse"><Mail className="w-4 h-4 flex-shrink-0" /><span className="truncate">{email}</span></div>
                                <div className="flex items-center gap-1.5 flex-row-reverse"><Calendar className="w-4 h-4 flex-shrink-0" /><span>{format(new Date(response.created_date), 'dd/MM/yy HH:mm')}</span></div>
                                <div className={`flex items-center gap-1.5 flex-row-reverse ${timeWarningClass}`}><Clock className="w-4 h-4 flex-shrink-0" /><span dir="rtl">{(() => { const days = Math.floor(hoursAgo / 24); const hours = hoursAgo % 24; if (days > 0) return hours > 0 ? `${days} ימים ו-${hours} שעות` : `${days} ימים`; return `${hours} שעות`; })()}</span></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 sm:gap-2 mb-3 flex-wrap justify-end">
                            {response.status === 'completed' ? <Badge className="bg-green-100 text-green-800 flex items-center gap-1 flex-row-reverse text-xs">שאלון מלא<CheckCircle className="w-3 h-3" /></Badge> : <Badge className="bg-red-100 text-red-800 flex items-center gap-1 flex-row-reverse text-xs">נטש שאלון<AlertCircle className="w-3 h-3" /></Badge>}
                            <Badge variant="outline" className="flex items-center gap-1 flex-row-reverse text-xs">{purchaseStatus}{paymentAmount > 0 && ` (${paymentAmount} ₪)`}<DollarSign className="w-3 h-3" /></Badge>
                            {emails.length > 0 && <Button variant="outline" size="sm" onClick={() => setViewingEmails(emails)} className="h-6 text-xs flex items-center gap-1 flex-row-reverse px-2">{emails.length} מיילים<Mail className="w-3 h-3" /></Button>}
                            {existingReport && <Badge className={`flex items-center gap-1 flex-row-reverse text-xs ${isReportSent ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{isReportSent ? 'דוח נשלח ללקוח' : 'דוח לא נשלח'}<CheckCircle className="w-3 h-3" /></Badge>}
                          </div>
                          {(age || occupation) && <div className="text-xs sm:text-sm text-gray-600 text-right">{age && `גיל: ${age}`}{age && occupation && ' · '}{occupation && `תחום: ${occupation}`}</div>}
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" disabled={isDeleting || isGenerating} className="flex-1 sm:flex-none text-xs sm:text-sm">פעולות ▼</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52" dir="rtl">
                              <DropdownMenuItem onClick={() => setViewingResponse(response)} className="flex flex-row-reverse justify-between"><FileSearch className="w-4 h-4" /><span>צפה בשאלון</span></DropdownMenuItem>
                              {existingReport && existingReport.pdf_url && (
                                <>
                                  <DropdownMenuItem asChild><Link to={createPageUrl(`ReportView?reportId=${existingReport.id}`)} className="flex flex-row-reverse justify-between"><Eye className="w-4 h-4" /><span>צפייה בדו"ח PDF</span></Link></DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${createPageUrl(`ReportView?reportId=${existingReport.id}`)}`); alert('הלינק לדוח הועתק ללוח'); }} className="flex flex-row-reverse justify-between"><Link2 className="w-4 h-4" /><span>לינק לדוח PDF</span></DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(existingReport.pdf_url, '_blank')} className="flex flex-row-reverse justify-between"><Download className="w-4 h-4" /><span>הורד PDF</span></DropdownMenuItem>
                                </>
                              )}
                              {existingReport && existingReport.report_markdown && !existingReport.pdf_url && (
                                <>
                                  <DropdownMenuItem asChild><Link to={createPageUrl(`ReportView?reportId=${existingReport.id}`)} className="flex flex-row-reverse justify-between"><Eye className="w-4 h-4" /><span>צפייה בדו"ח</span></Link></DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${createPageUrl(`ReportView?reportId=${existingReport.id}`)}`); alert('הלינק לדוח הועתק ללוח'); }} className="flex flex-row-reverse justify-between"><Link2 className="w-4 h-4" /><span>לינק לדוח</span></DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(createPageUrl("QuestionnaireExport") + `?responseId=${response.id}`)} className="flex flex-row-reverse justify-between"><FileText className="w-4 h-4" /><span>שאלון מלא</span></DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => generateReport(response, true)} disabled={isGenerating} className="flex flex-row-reverse justify-between"><RefreshCw className="w-4 h-4" /><span>צור דו"ח מחדש</span></DropdownMenuItem>
                                </>
                              )}
                              {existingReport && (
                                <>
                                  <DropdownMenuItem onClick={() => setLanguageDialog({ open: true, report: existingReport, response })} disabled={sendingReportId === existingReport.id} className="flex flex-row-reverse justify-between"><Send className="w-4 h-4" /><span>שלח דו"ח ללקוח</span></DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => sendReportDirectly(existingReport, response)} disabled={sendingReportId === existingReport.id} className="flex flex-row-reverse justify-between text-blue-700 font-semibold"><Mail className="w-4 h-4" /><span>שלח דו"ח ישירות למייל</span></DropdownMenuItem>
                                </>
                              )}
                              {!existingReport && (
                                <DropdownMenuItem onClick={() => generateReport(response, false)} disabled={isGenerating} className="flex flex-row-reverse justify-between"><FileText className="w-4 h-4" /><span>{isGenerating ? 'יוצר דו"ח...' : 'צור דו"ח'}</span></DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => setTemplateSelectionDialog({ open: true, response })} disabled={isGenerating || isDeleting} className="flex flex-row-reverse justify-between"><Mail className="w-4 h-4" /><span>שלח מייל מתבנית</span></DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteResponse(response.id)} disabled={isDeleting || isGenerating} className="text-red-600 flex flex-row-reverse justify-between"><Trash2 className="w-4 h-4" /><span>מחק</span></DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredAndSortedResponses.length === 0 && (
                <Card><CardContent className="p-12 text-center"><FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">{searchTerm ? 'לא נמצאו תוצאות' : 'אין שאלונים שהושלמו'}</h3><p className="text-gray-600">{searchTerm ? 'נסה לשנות את מילות החיפוש' : 'כאשר משתמשים ישלימו את השאלון, הם יופיעו כאן'}</p></CardContent></Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="abandoned">
            <AbandonedTab inProgressUsers={inProgressUsers} abandonedUsers={abandonedUsers} responses={responses} emailLogs={emailLogs} sendingEmailType={sendingEmailType} onSendEmail={(r) => setTemplateSelectionDialog({ open: true, response: r })} onViewEmails={(e) => setViewingEmails(e)} />
          </TabsContent>
          <TabsContent value="survey-results"><SurveyResultsTab surveyResponses={surveyResponses} /></TabsContent>
          <TabsContent value="content-management"><ContentManager contentItems={contentItems} onUpdate={loadData} /></TabsContent>
          <TabsContent value="users">
            <UsersTab users={users} responses={responses} reports={reports} emailLogs={emailLogs} emailTemplates={emailTemplates} boosterSubscriptions={boosterSubscriptions} onViewEmails={(e) => setViewingEmails(e)} onSendTemplate={(r) => setTemplateSelectionDialog({ open: true, response: r })} onUpdatePurchaseStatus={handleUserPurchaseStatusChange} />
          </TabsContent>
          <TabsContent value="email-templates">
            <EmailTemplatesTab emailTemplates={emailTemplates} onEdit={(t) => { setEditingTemplate(t); setTemplateDialog(true); }} onDelete={deleteTemplate} onCreateNew={() => { setEditingTemplate(null); setTemplateDialog(true); }} deletingTemplateId={deletingTemplateId} />
          </TabsContent>
          <TabsContent value="advanced-analytics"><AdvancedAnalyticsTab reports={reports} /></TabsContent>
          <TabsContent value="boosters">
            <BoostersTab boosterSubscriptions={boosterSubscriptions} emailLogs={emailLogs} onViewEmails={(e) => setViewingEmails(e)} onOpenRegistration={() => setBoosterRegistrationDialog(true)} onReload={loadData} />
          </TabsContent>
          <TabsContent value="scheduled-tasks"><ScheduledTasksManager /></TabsContent>
          <TabsContent value="payments"><PaymentsTab paymentOrders={paymentOrders} responses={responses} /></TabsContent>
          <TabsContent value="site-analytics"><SiteAnalyticsTab /></TabsContent>
        </Tabs>
      </div>

      <ViewResponseDialog viewingResponse={viewingResponse} onClose={() => setViewingResponse(null)} />
      <ViewEmailsDialog viewingEmails={viewingEmails} emailTemplates={emailTemplates} onClose={() => setViewingEmails(null)} />
      <LanguageDialog languageDialog={languageDialog} onClose={() => setLanguageDialog({ open: false, report: null, response: null })} onSend={sendReportToClient} />
      <SimulationDialog open={simulationDialog} onOpenChange={setSimulationDialog} simulationForm={simulationForm} setSimulationForm={setSimulationForm} isSimulating={isSimulating} onSimulate={handleSimulatePurchase} />
      <TemplateSelectionDialog open={templateSelectionDialog.open} response={templateSelectionDialog.response} emailTemplates={emailTemplates} sendingEmailType={sendingEmailType} onClose={(open) => setTemplateSelectionDialog({ open, response: open ? templateSelectionDialog.response : null })} onSendTemplate={sendManualEmailFromTemplate} onCreateNew={() => { setTemplateSelectionDialog({ open: false, response: null }); setTemplateDialog(true); }} />
      <BoosterRegistrationDialog open={boosterRegistrationDialog} onOpenChange={setBoosterRegistrationDialog} reports={reports} boosterRegForm={boosterRegForm} setBoosterRegForm={setBoosterRegForm} isRegistering={isRegisteringBooster} onRegister={handleManualBoosterRegistration} />
      <EmailTemplateDialog open={templateDialog} onOpenChange={setTemplateDialog} template={editingTemplate} onSave={async (templateData) => {
        try {
          if (editingTemplate) await base44.entities.EmailTemplate.update(editingTemplate.id, templateData);
          else await base44.entities.EmailTemplate.create(templateData);
          await loadData(); setTemplateDialog(false); setEditingTemplate(null); alert('התבנית נשמרה בהצלחה!');
        } catch (error) { console.error("Error:", error); alert('שגיאה בשמירת התבנית'); }
      }} />
    </div>
  );
}