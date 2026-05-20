import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  AlertTriangle,
  LogOut,
  BarChart3,
  Settings,
  TrendingUp,
  Rocket,
  MessageSquare,
  Edit3,
  Link2,
  GitCompare,
  ShoppingCart,
  Download } from
"lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ContentManager from "@/components/admin/ContentManager"; import ScheduledTasksManager from "@/components/admin/ScheduledTasksManager"; import { EmailTemplateDialog } from "@/components/admin/EmailTemplateDialog"; import AbandonedTab from "@/components/admin/AbandonedTab"; import SurveyResultsTab from "@/components/admin/SurveyResultsTab"; import EmailTemplatesTab from "@/components/admin/EmailTemplatesTab"; import AdvancedAnalyticsTab from "@/components/admin/AdvancedAnalyticsTab";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle } from
"@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import { getAbandonmentEmailTemplate } from "@/components/email/AbandonmentEmailTemplate";
import { simulatePurchase } from "@/functions/simulatePurchase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";




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
  const [simulationForm, setSimulationForm] = useState({
    userEmail: '',
    productType: 'full_report',
    expressDelivery: false,
    language: 'he'
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [boosterRegistrationDialog, setBoosterRegistrationDialog] = useState(false);
  const [boosterRegForm, setBoosterRegForm] = useState({ reportId: '', userEmail: '' });
  const [isRegisteringBooster, setIsRegisteringBooster] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState(null);
  const [activeTab, setActiveTab] = useState('reports');
  const [filters, setFilters] = useState({
    hasPurchased: 'all', // 'all', 'purchased', 'not_purchased'
    hasReport: 'all', // 'all', 'has_report', 'no_report'
    questionnaireStatus: 'all' // 'all', 'completed', 'in_progress', 'abandoned'
  });
  const [userDateFilter, setUserDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'year', 'custom'
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [sortBy, setSortBy] = useState('date'); // 'name', 'date', 'urgency', 'hours'
  const [selectedReportsForAnalytics, setSelectedReportsForAnalytics] = useState([]);
  const [analyticsViewMode, setAnalyticsViewMode] = useState('comparison');
  const [reportGenerationMode, setReportGenerationMode] = useState('claude'); // 'claude', 'v6_pro_ultimate', 'original'

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
      base44.entities.PaymentOrder.list('-created_date').catch(() => [])]
      );
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
          try {
            await base44.entities.GeneratedReport.delete(existingReport.id);
            console.log("Deleted existing report:", existingReport.id);
          } catch (deleteError) {
            console.error("Error deleting existing report:", deleteError);
          }
        }
      }

      // Call the backend function to generate the report
      const functionName = reportGenerationMode === 'claude' ? 'generateReportV7Pro' : reportGenerationMode === 'v6_pro_ultimate' ? 'generateReportV6ProUltimate' : 'generateReportAutomatic';
      
      const result = await base44.functions.invoke(functionName, {
        responseId: response.id
      });

      await loadData();

      if (isRegenerate) {
        alert(reportLanguage === 'en' ? 'Report successfully regenerated!' : 'הדו"ח נוצר מחדש בהצלחה!');
      } else {
        if (result.data?.reportId) {
          window.location.href = createPageUrl(`ReportView?reportId=${result.data.reportId}`);
        } else {
          alert('הדוח נוצר בהצלחה!');
          await loadData();
        }
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
      const relatedReport = reports.find((r) => r.questionnaire_response_id === responseId);
      if (relatedReport) {
        await base44.entities.GeneratedReport.delete(relatedReport.id);
      }

      const relatedEmailLogs = emailLogs.filter((log) => log.related_questionnaire_response_id === responseId);
      await Promise.all(relatedEmailLogs.map((log) => base44.entities.EmailLog.delete(log.id)));

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
    return reports.find((r) => r.questionnaire_response_id === responseId);
  };

  const getUserForResponse = (response) => {
    return users.find((u) => u.email === response.created_by || u.email === response.personal_info?.email);
  };

  const getEmailsForResponse = (response) => {
    return emailLogs.filter((log) =>
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
              <a href="${reportUrl}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: #ffffff !important; text-decoration: none !important; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); cursor: pointer; mso-hide: all;">
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
              <a href="${reportUrl}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: #ffffff !important; text-decoration: none !important; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); cursor: pointer; mso-hide: all;">
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

      const userExists = users.some((u) => u.email === clientEmail);

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

  const sendManualEmailFromTemplate = async (template, response) => {
    if (!response) {
      alert('אין נתוני משתמש');
      return;
    }

    setSendingEmailType(`template_${template.id}_${response.id}`);
    const emailLanguage = response.language || 'he';

    try {
      const userEmail = response.personal_info?.email || response.created_by;
      const userName = response.personal_info?.full_name || 'משתמש';

      if (!userEmail) {
        alert('לא נמצאה כתובת מייל למשתמש');
        setSendingEmailType(null);
        return;
      }

      console.log('Sending email to:', userEmail, 'with template:', template.name_he);

      // יצירת קוד קופון אם התבנית כוללת קופון
      let couponCode = null;
      if (template.include_coupon) {
        couponCode = `TEMPLATE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);

        await base44.entities.Coupon.create({
          code: couponCode,
          discount_amount: template.coupon_amount || 50,
          valid_until: validUntil.toISOString(),
          user_email: userEmail,
          source: 'abandonment_survey'
        });
      }

      // קבלת התוכן לפי שפה
      const emailSubject = emailLanguage === 'he' ? template.subject_he : template.subject_en;
      let emailHtml = emailLanguage === 'he' ? template.content_he : template.content_en;

      // החלפת משתנים בתוכן המייל
      const surveyUrl = `${window.location.origin}${createPageUrl('Survey')}`;
      const questionnaireUrl = `${window.location.origin}${createPageUrl('Questionnaire')}`;
      const reportUrl = `${window.location.origin}${createPageUrl('MyAccount')}`;
      const purchaseUrl = `${window.location.origin}${createPageUrl(`Completion?responseId=${response.id}`)}`;

      emailHtml = emailHtml.
      replace(/{userName}/g, userName).
      replace(/{surveyUrl}/g, surveyUrl).
      replace(/{questionnaireUrl}/g, questionnaireUrl).
      replace(/{reportUrl}/g, reportUrl).
      replace(/{purchaseUrl}/g, purchaseUrl).
      replace(/{couponCode}/g, couponCode || '');

      console.log('Attempting to send email...');

      await base44.integrations.Core.SendEmail({
        to: userEmail,
        subject: emailSubject,
        body: emailHtml
      });

      console.log('Email sent successfully');

      await base44.entities.EmailLog.create({
        to_email: userEmail,
        email_type: template.template_type,
        subject: emailSubject,
        related_user_email: userEmail,
        related_questionnaire_response_id: response.id,
        sent_manually: true,
        language: emailLanguage
      });

      // סגירת הדיאלוג
      setTemplateSelectionDialog({ open: false, response: null });

      // טעינה מחדש של כל הנתונים
      await loadData();

      alert(emailLanguage === 'en' ? `Email sent successfully to ${userEmail}` : `מייל נשלח בהצלחה ל-${userEmail}`);
    } catch (error) {
      console.error("Error sending manual email:", error);
      alert(`שגיאה בשליחת המייל ל-${response.personal_info?.email || response.created_by}: ${error.message || 'שגיאה לא ידועה'}`);
    } finally {
      setSendingEmailType(null);
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

      const userExists = users.some((u) => u.email === userEmail);
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

  const deleteTemplate = async (templateId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את התבנית? פעולה זו אינה הפיכה.')) {
      return;
    }

    setDeletingTemplateId(templateId);
    try {
      await base44.entities.EmailTemplate.delete(templateId);
      await loadData();
      alert('התבנית נמחקה בהצלחה');
    } catch (error) {
      console.error("Error deleting template:", error);
      alert('שגיאה במחיקת התבנית');
    } finally {
      setDeletingTemplateId(null);
    }
  };

  const filteredAndSortedResponses = responses.filter((r) => {
    const fullName = r.personal_info?.full_name || '';
    const email = r.personal_info?.email || '';
    const searchMatch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!searchMatch) return false;

    // סינון לפי רכישה
    if (filters.hasPurchased !== 'all') {
      const userEmail = r.personal_info?.email || r.created_by;
      const userInfo = users.find(u => u.email === userEmail);
      const hasPurchased = reports.some((report) => report.user_email === userEmail && report.purchased === true) ||
                          userInfo?.has_purchased_full_report === true ||
                          userInfo?.has_purchased_answers_download === true;
      if (filters.hasPurchased === 'purchased' && !hasPurchased) return false;
      if (filters.hasPurchased === 'not_purchased' && hasPurchased) return false;
    }

    // סינון לפי דוח
    if (filters.hasReport !== 'all') {
      const hasReport = !!getReportForResponse(r.id);
      if (filters.hasReport === 'has_report' && !hasReport) return false;
      if (filters.hasReport === 'no_report' && hasReport) return false;
    }

    // סינון לפי סטטוס שאלון
    if (filters.questionnaireStatus !== 'all') {
      if (filters.questionnaireStatus === 'abandoned') {
        // נטש שאלון = in_progress או abandoned
        if (r.status !== 'in_progress' && r.status !== 'abandoned') return false;
      } else if (r.status !== filters.questionnaireStatus) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // מיון לפי הבחירה
    if (sortBy === 'name') {
      const nameA = (a.personal_info?.full_name || '').toLowerCase();
      const nameB = (b.personal_info?.full_name || '').toLowerCase();
      return nameA.localeCompare(nameB, 'he');
    } else if (sortBy === 'date') {
      return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
    } else if (sortBy === 'hours') {
      const hoursA = Math.floor((Date.now() - new Date(a.created_date).getTime()) / (1000 * 60 * 60));
      const hoursB = Math.floor((Date.now() - new Date(b.created_date).getTime()) / (1000 * 60 * 60));
      return hoursB - hoursA;
    } else if (sortBy === 'urgency') {
      // דחיפות: אלו שיש להם דוח אבל לא נשלח + זמן ארוך
      const getUrgencyScore = (r) => {
        const emails = getEmailsForResponse(r);
        const reportSent = emails.find(e => e.email_type === 'report_ready');
        const existingReport = getReportForResponse(r.id);
        const hoursAgo = Math.floor((Date.now() - new Date(r.created_date).getTime()) / (1000 * 60 * 60));
        
        // דירוג דחיפות גבוה יותר = דחוף יותר
        if (existingReport && !reportSent && hoursAgo >= 96) return 1000;
        if (existingReport && !reportSent && hoursAgo >= 72) return 500;
        if (existingReport && !reportSent) return 100;
        if (!existingReport && r.status === 'completed') return 50;
        return 0;
      };
      return getUrgencyScore(b) - getUrgencyScore(a);
    }
    return 0;
  });

  const getAbandonedUsers = () => {
    return users.filter((u) => {
      const hasCompletedResponse = responses.some((r) =>
      (r.created_by === u.email || r.personal_info?.email === u.email) &&
      r.status === 'completed'
      );
      const hasPurchased = reports.some((r) => r.user_email === u.email && r.purchased === true) ||
                          u.has_purchased_full_report === true ||
                          u.has_purchased_answers_download === true;

      return hasCompletedResponse && !hasPurchased;
    });
  };

  const getInProgressUsers = () => {
    return users.filter((u) => {
      const hasInProgressResponse = responses.some((r) =>
      (r.created_by === u.email || r.personal_info?.email === u.email) &&
      r.status === 'in_progress'
      );
      const hasCompletedResponse = responses.some((r) =>
      (r.created_by === u.email || r.personal_info?.email === u.email) &&
      r.status === 'completed'
      );

      // רק אם יש in_progress ואין completed
      return hasInProgressResponse && !hasCompletedResponse;
    });
  };

  const abandonedUsers = getAbandonedUsers();
  const inProgressUsers = getInProgressUsers();

  const handleReportSelectForAnalytics = (reportId) => {
    setSelectedReportsForAnalytics(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), reportId];
      }
      return [...prev, reportId];
    });
  };

  const handleUserPurchaseStatusChange = async (userEmail, status) => {
    try {
      let updateData = {
        has_purchased_full_report: false,
        has_purchased_answers_download: false
      };

      if (status === 'full_report') {
        updateData.has_purchased_full_report = true;
      } else if (status === 'answers_download') {
        updateData.has_purchased_answers_download = true;
      }

      const userToUpdate = users.find((u) => u.email === userEmail);
      if (!userToUpdate) {
        alert('משתמש לא נמצא');
        return;
      }

      await base44.entities.User.update(userToUpdate.id, updateData);

      // עדכן גם את כל הדוחות הרלוונטיים
      const userReports = reports.filter((r) => r.user_email === userEmail);
      for (const report of userReports) {
        await base44.entities.GeneratedReport.update(report.id, {
          purchased: status !== 'none'
        });
      }

      await loadData();
      alert('סטטוס רכישה עודכן בהצלחה!');
    } catch (error) {
      console.error("Error updating user purchase status:", error);
      alert('שגיאה בעדכון סטטוס הרכישה');
    }
  };

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

  const handleManualBoosterRegistration = async () => {
    if (!boosterRegForm.reportId) {
      alert('יש לבחור דוח');
      return;
    }

    setIsRegisteringBooster(true);
    try {
      const report = reports.find(r => r.id === boosterRegForm.reportId);
      if (!report) {
        alert('דוח לא נמצא');
        return;
      }

      const result = await base44.functions.invoke('manualBoosterRegistration', {
        userEmail: report.user_email,
        reportId: boosterRegForm.reportId
      });

      if (result.data.success) {
        alert(`הרישום בוצע בהצלחה! משימה ראשונה נשלחה ל-${report.user_email}`);
        setBoosterRegistrationDialog(false);
        setBoosterRegForm({ reportId: '', userEmail: '' });
        await loadData();
      } else {
        alert('שגיאה: ' + (result.data.error || 'לא ידוע'));
      }
    } catch (error) {
      console.error('Error registering to booster:', error);
      alert(`שגיאה ברישום: ${error.message}`);
    } finally {
      setIsRegisteringBooster(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>);

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
              <select
                value={reportGenerationMode}
                onChange={(e) => setReportGenerationMode(e.target.value)}
                className="border-0 bg-transparent text-xs font-semibold text-blue-600 focus:outline-none cursor-pointer"
                dir="rtl"
              >
                <option value="claude">V7 PRO Claude 🤖</option><option value="v6_pro_ultimate">V8 PRO Ultimate ⚡</option><option value="original">Original (ישן)</option>
              </select>
            </div>
            <Button
              onClick={() => setSimulationDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 flex-1 sm:flex-initial text-sm flex items-center gap-2 flex-row-reverse">

              <span>דמה רכישת מוצר</span>
              <DollarSign className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigate(createPageUrl('BoosterContinuation'))}
              className="bg-pink-600 hover:bg-pink-700 flex-1 sm:flex-initial text-sm flex items-center gap-2 flex-row-reverse">

              <span>עמוד מוצר בוסטר</span>
              <Rocket className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="reports" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap w-full justify-center mb-8 gap-1 h-auto p-2">
            <TabsTrigger value="advanced-analytics" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>ניתוח מתקדם</span>
              <BarChart3 className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="survey-results" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>סקר ({surveyResponses.length})</span>
              <FileSearch className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="boosters" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>בוסטרים ({boosterSubscriptions.length})</span>
              <Rocket className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="abandoned" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>נטשו ({inProgressUsers.length + abandonedUsers.length})</span>
              <AlertTriangle className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>שאלונים</span>
              <FileText className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>משתמשים ({users.length})</span>
              <Users className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="email-templates" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>תבניות</span>
              <Mail className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="content-management" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>ניהול תוכן</span>
              <Edit3 className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="scheduled-tasks" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>תזמונים</span>
              <Clock className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-1 flex-row-reverse text-xs px-3 py-2">
              <span>תשלומים ({paymentOrders.length})</span>
              <ShoppingCart className="w-3 h-3" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="flex justify-end mb-4">
              <Link to={createPageUrl("AdminQuestionnaireExport")}>
                <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2 flex-row-reverse">
                  <span>ייצוא כל השאלונים לקובץ</span>
                  <Download className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-right">שאלונים שהושלמו</CardTitle>
                  <FileText className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-right">{responses.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-right">דו"חות שנוצרו</CardTitle>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-green-600 text-right">{reports.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-right">ממתינים לדו"ח</CardTitle>
                  <Clock className="w-4 h-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-orange-600 text-right">
                    {responses.length - reports.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="חיפוש לפי שם או אימייל..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right" />

              </div>

              <div className="flex gap-3 flex-wrap justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">סדר לפי:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                    dir="rtl">

                    <option value="date">תאריך</option>
                    <option value="name">שם</option>
                    <option value="urgency">דחיפות</option>
                    <option value="hours">מספר שעות</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">רכישה:</label>
                  <select
                    value={filters.hasPurchased}
                    onChange={(e) => setFilters({ ...filters, hasPurchased: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                    dir="rtl">

                    <option value="all">הכל</option>
                    <option value="purchased">רכש</option>
                    <option value="not_purchased">לא רכש</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">דוח:</label>
                  <select
                    value={filters.hasReport}
                    onChange={(e) => setFilters({ ...filters, hasReport: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                    dir="rtl">

                    <option value="all">הכל</option>
                    <option value="has_report">יש דוח</option>
                    <option value="no_report">אין דוח</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">סטטוס שאלון:</label>
                  <select
                    value={filters.questionnaireStatus}
                    onChange={(e) => setFilters({ ...filters, questionnaireStatus: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                    dir="rtl">

                    <option value="all">הכל</option>
                    <option value="completed">שאלון מלא</option>
                    <option value="abandoned">נטש שאלון</option>
                  </select>
                </div>

                {(filters.hasPurchased !== 'all' || filters.hasReport !== 'all' || filters.questionnaireStatus !== 'all') &&
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ hasPurchased: 'all', hasReport: 'all', questionnaireStatus: 'all' })}
                  className="text-xs">

                    נקה סינונים
                  </Button>
                }
              </div>
            </div>

            <div className="space-y-4">
              {filteredAndSortedResponses.map((response) => {
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

                // מציאת כל השאלונים של אותו משתמש
                const userEmail = response.personal_info?.email || response.created_by;
                const userAllResponses = responses.filter((r) =>
                r.personal_info?.email === userEmail || r.created_by === userEmail
                ).sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
                const responseIndex = userAllResponses.findIndex((r) => r.id === response.id) + 1;
                const hasMultipleResponses = userAllResponses.length > 1;

                const purchasedReport = reports.find((r) => r.user_email === userEmail && r.purchased === true);
                const hasPurchasedFullReport = userInfo?.has_purchased_full_report === true;
                const hasPurchasedAnswersDownload = userInfo?.has_purchased_answers_download === true;
                const expressDelivery = userInfo?.express_delivery === true;
                const paymentAmount = userInfo?.payment_amount ?? 0;

                const purchaseStatus = (purchasedReport || hasPurchasedFullReport || hasPurchasedAnswersDownload) ? 
                (hasPurchasedFullReport ? `דו"ח מלא${expressDelivery ? ' + מואץ' : ''}` : 'תשובות בלבד') :
                'לא רכש';

                // חישוב כמה שעות עברו
                const hoursAgo = Math.floor((Date.now() - new Date(response.created_date).getTime()) / (1000 * 60 * 60));

                // בדיקה אם נשלח דוח ללקוח
                const reportSentEmail = emails.find((e) => e.email_type === 'report_ready');
                const isReportSent = !!reportSentEmail;

                // קביעת צבע רקע לפי זמן ושליחת דוח
                let cardBgClass = '';
                let timeWarningClass = '';

                // ירוק עדין אם שאלון מלא ודוח נשלח ללקוח
                if (response.status === 'completed' && isReportSent) {
                  cardBgClass = 'bg-green-50 border-green-300';
                } else if (existingReport && !isReportSent) {
                  // אדום/צהוב אם יש דוח אבל לא נשלח
                  if (hoursAgo >= 96) {
                    cardBgClass = 'bg-red-50 border-red-300';
                    timeWarningClass = 'text-red-700 font-bold';
                  } else if (hoursAgo >= 72) {
                    cardBgClass = 'bg-yellow-50 border-yellow-300';
                    timeWarningClass = 'text-yellow-700 font-semibold';
                  }
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
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                  {fullName}
                                </h3>
                                {hasMultipleResponses &&
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 text-xs">
                                    שאלון #{responseIndex} מתוך {userAllResponses.length}
                                  </Badge>
                                }
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5 flex-row-reverse">
                                  <Mail className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate">{email}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-row-reverse">
                                  <Calendar className="w-4 h-4 flex-shrink-0" />
                                  <span>{format(new Date(response.created_date), 'dd/MM/yy HH:mm')}</span>
                                </div>
                                <div className={`flex items-center gap-1.5 flex-row-reverse ${timeWarningClass}`}>
                                  <Clock className="w-4 h-4 flex-shrink-0" />
                                  <span dir="rtl">
                                    {(() => {
                                      const days = Math.floor(hoursAgo / 24);
                                      const hours = hoursAgo % 24;
                                      if (days > 0) {
                                        return hours > 0 
                                          ? `${days} ימים ו-${hours} שעות`
                                          : `${days} ימים`;
                                      }
                                      return `${hours} שעות`;
                                    })()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-1 sm:gap-2 mb-3 flex-wrap justify-end">
                            {response.status === 'completed' ?
                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1 flex-row-reverse text-xs">
                                שאלון מלא
                                <CheckCircle className="w-3 h-3" />
                              </Badge> :

                            <Badge className="bg-red-100 text-red-800 flex items-center gap-1 flex-row-reverse text-xs">
                                נטש שאלון
                                <AlertCircle className="w-3 h-3" />
                              </Badge>
                            }

                            <Badge variant="outline" className="flex items-center gap-1 flex-row-reverse text-xs">
                              {purchaseStatus}
                              {paymentAmount > 0 && ` (${paymentAmount} ₪)`}
                              <DollarSign className="w-3 h-3" />
                            </Badge>

                            {emails.length > 0 &&
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingEmails(emails)}
                              className="h-6 text-xs flex items-center gap-1 flex-row-reverse px-2">

                                {emails.length} מיילים
                                <Mail className="w-3 h-3" />
                              </Button>
                            }

                            {existingReport &&
                            <Badge className={`flex items-center gap-1 flex-row-reverse text-xs ${isReportSent ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                {isReportSent ? 'דוח נשלח ללקוח' : 'דוח לא נשלח'}
                                <CheckCircle className="w-3 h-3" />
                              </Badge>
                            }
                          </div>

                          {(age || occupation) &&
                          <div className="text-xs sm:text-sm text-gray-600 text-right">
                              {age && `גיל: ${age}`}
                              {age && occupation && ' · '}
                              {occupation && `תחום: ${occupation}`}
                            </div>
                          }
                        </div>

                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" disabled={isDeleting || isGenerating} className="flex-1 sm:flex-none text-xs sm:text-sm">
                                פעולות ▼
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48" dir="rtl">
                              <DropdownMenuItem onClick={() => setViewingResponse(response)} className="flex flex-row-reverse justify-between">
                                <FileSearch className="w-4 h-4" />
                                <span>צפה בשאלון</span>
                              </DropdownMenuItem>

                              {existingReport ?
                              <>
                                  <DropdownMenuItem asChild>
                                    <Link to={createPageUrl(`ReportView?reportId=${existingReport.id}`)} className="flex flex-row-reverse justify-between">
                                      <Eye className="w-4 h-4" />
                                      <span>צפייה בדו"ח</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      const reportUrl = `${window.location.origin}${createPageUrl(`ReportView?reportId=${existingReport.id}`)}`;
                                      navigator.clipboard.writeText(reportUrl);
                                      alert('הלינק לדוח הועתק ללוח');
                                    }}
                                    className="flex flex-row-reverse justify-between">
                                    <Link2 className="w-4 h-4" />
                                    <span>לינק לדוח</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => navigate(createPageUrl("QuestionnaireExport") + `?responseId=${response.id}`)}
                                    className="flex flex-row-reverse justify-between">
                                    <FileText className="w-4 h-4" />
                                    <span>שאלון מלא</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                  onClick={() => generateReport(response, true)}
                                  disabled={isGenerating}
                                  className="flex flex-row-reverse justify-between">

                                    <RefreshCw className="w-4 h-4" />
                                    <span>צור דו"ח מחדש</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                  onClick={() => openLanguageDialog(existingReport, response)}
                                  disabled={sendingReportId === existingReport.id || isSendingManualReportReady}
                                  className="flex flex-row-reverse justify-between">

                                    <Send className="w-4 h-4" />
                                    <span>שלח דו"ח ללקוח</span>
                                  </DropdownMenuItem>
                                </> :

                              <DropdownMenuItem
                                onClick={() => generateReport(response, false)}
                                disabled={isGenerating}
                                className="flex flex-row-reverse justify-between">

                                  <FileText className="w-4 h-4" />
                                  <span>{isGenerating ? 'יוצר דו"ח...' : 'צור דו"ח'}</span>
                                </DropdownMenuItem>
                              }

                              <DropdownMenuItem
                                onClick={() => setTemplateSelectionDialog({ open: true, response })}
                                disabled={isGenerating || isDeleting || isSendingManualReportReady}
                                className="flex flex-row-reverse justify-between">

                                <Mail className="w-4 h-4" />
                                <span>שלח מייל מתבנית</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => deleteResponse(response.id)}
                                disabled={isDeleting || isGenerating || isSendingManualAbandonment || isSendingManualReportReady}
                                className="text-red-600 flex flex-row-reverse justify-between">

                                <Trash2 className="w-4 h-4" />
                                <span>מחק</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>);

              })}

              {filteredAndSortedResponses.length === 0 &&
              <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm ? 'לא נמצאו תוצאות' : 'אין שאלונים שהושלמו'}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm ?
                    'נסה לשנות את מילות החיפוש' :
                    'כאשר משתמשים ישלימו את השאלון, הם יופיעו כאן'}
                    </p>
                  </CardContent>
                </Card>
              }
            </div>
          </TabsContent>

          <TabsContent value="abandoned">
            <AbandonedTab
              inProgressUsers={inProgressUsers}
              abandonedUsers={abandonedUsers}
              responses={responses}
              emailLogs={emailLogs}
              sendingEmailType={sendingEmailType}
              onSendEmail={(userResponse) => setTemplateSelectionDialog({ open: true, response: userResponse })}
              onViewEmails={(emails) => setViewingEmails(emails)}
            />
          </TabsContent>

          <TabsContent value="survey-results">
            <SurveyResultsTab surveyResponses={surveyResponses} />
          </TabsContent>

          <TabsContent value="content-management">
            <ContentManager
              contentItems={contentItems}
              onUpdate={loadData} />

          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">כל המשתמשים במערכת</CardTitle>
                <p className="text-gray-600 text-sm mt-1 text-right" dir="rtl">
                  רשימה מלאה של כל המשתמשים הרשומים באפליקציה
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-6 space-y-4">
                  <div className="flex gap-3 flex-wrap justify-end items-end">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">סנן לפי תאריך:</label>
                      <select
                        value={userDateFilter}
                        onChange={(e) => setUserDateFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                        dir="rtl"
                      >
                        <option value="all">כל הזמן</option>
                        <option value="today">היום</option>
                        <option value="week">7 ימים אחרונים</option>
                        <option value="month">חודש אחרון</option>
                        <option value="year">שנה אחרונה</option>
                        <option value="custom">מותאם אישית</option>
                      </select>
                    </div>

                    {userDateFilter === 'custom' && (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="date"
                          value={customDateRange.to}
                          onChange={(e) => setCustomDateRange({ ...customDateRange, to: e.target.value })}
                          className="w-40 text-sm"
                          placeholder="עד"
                        />
                        <span className="text-sm text-gray-600">עד</span>
                        <Input
                          type="date"
                          value={customDateRange.from}
                          onChange={(e) => setCustomDateRange({ ...customDateRange, from: e.target.value })}
                          className="w-40 text-sm"
                          placeholder="מ"
                        />
                        <span className="text-sm text-gray-600">מ</span>
                      </div>
                    )}

                    {userDateFilter !== 'all' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUserDateFilter('all');
                          setCustomDateRange({ from: '', to: '' });
                        }}
                        className="text-xs"
                      >
                        נקה סינון תאריך
                      </Button>
                    )}
                  </div>
                </div>

                {(() => {
                  const filteredUsers = users.filter((user) => {
                    if (userDateFilter === 'all') return true;
                    
                    const userDate = new Date(user.created_date);
                    const now = new Date();
                    
                    if (userDateFilter === 'today') {
                      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      return userDate >= today;
                    } else if (userDateFilter === 'week') {
                      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                      return userDate >= weekAgo;
                    } else if (userDateFilter === 'month') {
                      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                      return userDate >= monthAgo;
                    } else if (userDateFilter === 'year') {
                      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                      return userDate >= yearAgo;
                    } else if (userDateFilter === 'custom') {
                      if (customDateRange.from && customDateRange.to) {
                        const fromDate = new Date(customDateRange.from);
                        const toDate = new Date(customDateRange.to);
                        toDate.setHours(23, 59, 59, 999);
                        return userDate >= fromDate && userDate <= toDate;
                      } else if (customDateRange.from) {
                        const fromDate = new Date(customDateRange.from);
                        return userDate >= fromDate;
                      } else if (customDateRange.to) {
                        const toDate = new Date(customDateRange.to);
                        toDate.setHours(23, 59, 59, 999);
                        return userDate <= toDate;
                      }
                    }
                    
                    return true;
                  });

                  return filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">אין משתמשים בטווח התאריכים שנבחר</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredUsers.map((user) => {
                    const userResponses = responses.filter((r) =>
                    r.created_by === user.email || r.personal_info?.email === user.email
                    );
                    const userReports = reports.filter((r) => r.user_email === user.email);
                    const hasPurchasedFullReport = user.has_purchased_full_report ?? false;
                    const hasPurchasedAnswersDownload = user.has_purchased_answers_download ?? false;
                    const activeBoosterSubscription = boosterSubscriptions.find((s) =>
                    s.user_email === user.email && s.status === 'active'
                    );
                    
                    // בדיקה אם יש שאלון נטוש
                    const hasAbandonedQuestionnaire = userResponses.some((r) =>
                      r.status === 'in_progress' || r.status === 'abandoned'
                    );
                    
                    // איסוף מיילים של המשתמש
                    const userEmails = emailLogs.filter((log) => 
                      log.to_email === user.email || 
                      log.related_user_email === user.email
                    );
                    
                    // סיווג מיילים לפי סוג
                    const emailsByType = {
                      abandonment: userEmails.filter(e => e.email_type === 'abandonment_survey' || e.email_type === 'abandonment_reminder_96h' || e.email_type === 'abandonment_after_completion').length,
                      report_ready: userEmails.filter(e => e.email_type === 'report_ready').length,
                      purchase: userEmails.filter(e => e.email_type === 'full_report_purchase' || e.email_type === 'answers_download_purchase').length,
                      booster: userEmails.filter(e => e.email_type === 'booster_email').length,
                      other: userEmails.filter(e => !['abandonment_survey', 'abandonment_reminder_96h', 'abandonment_after_completion', 'report_ready', 'full_report_purchase', 'answers_download_purchase', 'booster_email'].includes(e.email_type)).length
                    };
                    const totalEmails = userEmails.length;
                    
                    // מציאת תבניות שנשלחו למשתמש
                    const userTemplates = emailTemplates.filter(template => 
                      userEmails.some(email => email.email_type === template.template_type)
                    );
                    const templatesSummary = userTemplates.map(t => t.name_he).join(', ') || 'אין';

                    return (
                      <Card key={user.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4 flex-row-reverse">
                              <div className="flex-1 text-right">
                                <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                                  <h4 className="font-semibold text-base">{user.full_name || 'שם לא זמין'}</h4>
                                  {user.role === 'admin' &&
                                <Badge className="bg-purple-600 text-white text-xs">
                                      Admin
                                    </Badge>
                                }
                                  {activeBoosterSubscription &&
                                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs flex items-center gap-1">
                                      <Rocket className="w-3 h-3" />
                                      בוסטר יום {activeBoosterSubscription.current_day}/7
                                    </Badge>
                                }
                                  {hasAbandonedQuestionnaire &&
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      נטש שאלון
                                    </Badge>
                                }
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                                <p className="text-xs text-gray-500">
                                  נרשם: {format(new Date(user.created_date), 'dd/MM/yyyy HH:mm')}
                                </p>
                                
                                <div className="flex gap-2 flex-wrap justify-end mt-3">
                                  <Badge variant="outline" className="text-xs">
                                    {userResponses.length} שאלונים
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {userReports.length} דוחות
                                  </Badge>
                                  
                                  {totalEmails > 0 ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setViewingEmails(userEmails)}
                                      className="h-6 text-xs flex items-center gap-1 flex-row-reverse px-2 bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100"
                                      title={`תבניות שנשלחו: ${templatesSummary}`}
                                    >
                                      <Mail className="w-3 h-3" />
                                      {totalEmails} מיילים
                                      {emailsByType.abandonment > 0 && ` (${emailsByType.abandonment} נטישה`}
                                      {emailsByType.report_ready > 0 && `${emailsByType.abandonment > 0 ? ', ' : ' ('}${emailsByType.report_ready} דוח`}
                                      {emailsByType.purchase > 0 && `${emailsByType.abandonment > 0 || emailsByType.report_ready > 0 ? ', ' : ' ('}${emailsByType.purchase} רכישה`}
                                      {emailsByType.booster > 0 && `${emailsByType.abandonment > 0 || emailsByType.report_ready > 0 || emailsByType.purchase > 0 ? ', ' : ' ('}${emailsByType.booster} בוסטר`}
                                      {(emailsByType.abandonment > 0 || emailsByType.report_ready > 0 || emailsByType.purchase > 0 || emailsByType.booster > 0) && ')'}
                                    </Button>
                                  ) : (
                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                                      <Mail className="w-3 h-3 ml-1" />
                                      אין מיילים
                                    </Badge>
                                  )}
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const userResponse = userResponses[0];
                                      if (userResponse) {
                                        setTemplateSelectionDialog({ open: true, response: userResponse });
                                      } else {
                                        alert('לא נמצא שאלון למשתמש זה');
                                      }
                                    }}
                                    className="h-6 text-xs flex items-center gap-1 flex-row-reverse px-2"
                                  >
                                    <Send className="w-3 h-3" />
                                    שלח תבנית
                                  </Button>
                                </div>
                                <div className="mt-3">
                                  <Label className="text-xs mb-2 block">סטטוס תשלום:</Label>
                                  <Select
                                  value={hasPurchasedFullReport ? 'full_report' : hasPurchasedAnswersDownload ? 'answers_download' : 'none'}
                                  onValueChange={(value) => handleUserPurchaseStatusChange(user.email, value)}>

                                    <SelectTrigger className="w-full text-right">
                                      <SelectValue placeholder="בחר סטטוס" />
                                    </SelectTrigger>
                                    <SelectContent dir="rtl">
                                      <SelectItem value="full_report">רכש דוח מלא ✅</SelectItem>
                                      <SelectItem value="answers_download">רכש תשובות בלבד 📄</SelectItem>
                                      <SelectItem value="none">לא רכש ❌</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email-templates">
            <EmailTemplatesTab
              emailTemplates={emailTemplates}
              onEdit={(template) => { setEditingTemplate(template); setTemplateDialog(true); }}
              onDelete={deleteTemplate}
              onCreateNew={() => { setEditingTemplate(null); setTemplateDialog(true); }}
              deletingTemplateId={deletingTemplateId}
            />
          </TabsContent>

          <TabsContent value="advanced-analytics">
            <AdvancedAnalyticsTab reports={reports} />
          </TabsContent>



          <TabsContent value="boosters">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="text-right">
                  <CardTitle className="text-right">מנויי בוסטר</CardTitle>
                  <p className="text-gray-600 text-sm mt-1 text-right">
                    ניהול הרשמות לתוכניות הבוסטר ל-30 ימים
                  </p>
                </div>
                <Button
                  onClick={() => setBoosterRegistrationDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 flex-row-reverse"
                >
                  <span>רישום ידני לבוסטר</span>
                  <Rocket className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {boosterSubscriptions.length === 0 ?
                <div className="text-center py-12">
                    <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">אין מנויי בוסטר עדיין</p>
                  </div> :

                <div className="space-y-3">
                    {boosterSubscriptions.
                  sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()).
                  map((subscription) => {
                    const trackInfo = {
                      execution: { name: 'ביצוע', icon: '⚡', color: 'blue' },
                      digital: { name: 'דיגיטל', icon: '💻', color: 'purple' },
                      finance: { name: 'פיננסים', icon: '💰', color: 'green' },
                      marketing: { name: 'שיווק', icon: '📢', color: 'orange' },
                      management: { name: 'ניהול', icon: '👥', color: 'indigo' },
                      vision: { name: 'חזון', icon: '🎯', color: 'pink' }
                    };
                    const track = trackInfo[subscription.recommended_booster_track] || trackInfo.execution;

                    const daysLeft = Math.max(0, 7 - subscription.current_day + 1);

                    return (
                      <Card key={subscription.id} className={`border-2 ${
                      subscription.status === 'active' ? `border-${track.color}-300 bg-${track.color}-50` :
                      subscription.status === 'completed' ? 'border-green-300 bg-green-50' :
                      subscription.status === 'cancelled' ? 'border-red-300 bg-red-50' :
                      'border-gray-300 bg-gray-50'}`
                      }>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4 flex-row-reverse">
                                <div className="flex-1 text-right">
                                  <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                                    <h4 className="font-bold text-base">{subscription.user_name}</h4>
                                    <span className="text-2xl">{track.icon}</span>
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-2">{subscription.user_email}</p>
                                  
                                  <div className="flex gap-2 flex-wrap justify-end mb-3">
                                    <Badge className={`bg-${track.color}-100 text-${track.color}-800 text-xs`}>
                                      מסלול {track.name}
                                    </Badge>
                                    
                                    {subscription.status === 'active' &&
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                        יום {subscription.current_day}/7
                                      </Badge>
                                }
                                    
                                    <Badge variant="outline" className={`text-xs ${
                                subscription.status === 'active' ? 'bg-green-50 text-green-700 border-green-300' :
                                subscription.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                subscription.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-300' :
                                subscription.status === 'upgraded' ? 'bg-purple-50 text-purple-700 border-purple-300' :
                                'bg-gray-50 text-gray-700 border-gray-300'}`
                                }>
                                      {subscription.status === 'active' && '✓ פעיל'}
                                      {subscription.status === 'completed' && '✓ הושלם'}
                                      {subscription.status === 'cancelled' && '✗ בוטל'}
                                      {subscription.status === 'upgraded' && '⬆ שודרג'}
                                    </Badge>
                                    
                                    <Badge variant="outline" className="text-xs">
                                      {subscription.language === 'he' ? '🇮🇱 עברית' : '🇬🇧 English'}
                                    </Badge>
                                  </div>
                                  
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <div>התחלה: {format(new Date(subscription.start_date), 'dd/MM/yyyy')}</div>
                                    <div>סיום: {format(new Date(subscription.end_date), 'dd/MM/yyyy')}</div>
                                    {subscription.last_email_sent_date &&
                                <div>מייל אחרון: {format(new Date(subscription.last_email_sent_date), 'dd/MM/yyyy HH:mm')}</div>
                                }
                                    {subscription.status === 'active' &&
                                <div className="font-semibold text-orange-600">
                                        נותרו {daysLeft} ימים
                                      </div>
                                }
                                    {subscription.experienced_improvement !== undefined &&
                                <div className={subscription.experienced_improvement ? 'text-green-700 font-semibold' : 'text-red-700'}>
                                        {subscription.experienced_improvement ? '✓ חש שיפור' : '✗ לא חש שיפור'}
                                      </div>
                                }
                                    {subscription.feedback_text &&
                                <div className="bg-white p-2 rounded mt-2 border">
                                        <span className="font-semibold">משוב: </span>
                                        {subscription.feedback_text}
                                      </div>
                                }
                                    
                                    {(() => {
                                  const boosterEmails = emailLogs.filter((log) =>
                                  log.email_type === 'booster_email' &&
                                  log.to_email === subscription.user_email
                                  );
                                  return boosterEmails.length > 0 &&
                                  <div className="mt-2">
                                          <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setViewingEmails(boosterEmails)}
                                      className="bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200 flex items-center gap-1 flex-row-reverse text-xs h-6 px-2">

                                            <Mail className="w-3 h-3" />
                                            {boosterEmails.length} מיילי בוסטר נשלחו
                                          </Button>
                                        </div>;

                                })()}
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                  <Link to={createPageUrl(`AdminBoosterTasks?subscriptionId=${subscription.id}`)}>
                                    <Button
                                      size="sm"
                                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 flex-row-reverse justify-center"
                                    >
                                      <span>צפה ב-30 המשימות</span>
                                      <Edit3 className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  
                                  {subscription.status === 'active' &&
                              <>
                                      <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    if (window.confirm('האם לבטל את המנוי?')) {
                                      try {
                                        await base44.entities.OnlineCoachingSubscription.update(subscription.id, {
                                          status: 'cancelled'
                                        });
                                        await loadData();
                                        alert('המנוי בוטל בהצלחה');
                                      } catch (error) {
                                        console.error('Error cancelling subscription:', error);
                                        alert('שגיאה בביטול המנוי');
                                      }
                                    }
                                  }}
                                  className="text-orange-600 hover:text-orange-700">

                                        ביטול
                                      </Button>
                                      
                                      <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    if (window.confirm('האם לסמן כהושלם?')) {
                                      try {
                                        await base44.entities.OnlineCoachingSubscription.update(subscription.id, {
                                          status: 'completed'
                                        });
                                        await loadData();
                                        alert('המנוי סומן כהושלם');
                                      } catch (error) {
                                        console.error('Error completing subscription:', error);
                                        alert('שגיאה בעדכון המנוי');
                                      }
                                    }
                                  }}
                                  className="text-green-600 hover:text-green-700">

                                        סמן הושלם
                                      </Button>
                                    </>
                              }
                                  
                                  <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  if (window.confirm('האם למחוק את המנוי? פעולה זו בלתי הפיכה.')) {
                                    try {
                                      await base44.entities.OnlineCoachingSubscription.delete(subscription.id);
                                      await loadData();
                                      alert('המנוי נמחק בהצלחה');
                                    } catch (error) {
                                      console.error('Error deleting subscription:', error);
                                      alert('שגיאה במחיקת המנוי');
                                    }
                                  }
                                }}
                                className="text-red-600 hover:text-red-700">

                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>);

                  })}
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled-tasks">
            <ScheduledTasksManager />
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              {/* סטטיסטיקות כלליות */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 text-right">סה"כ רכישות</CardTitle>
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-right text-green-600">
                      {paymentOrders.filter(o => o.status === 'paid').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 text-right">דוחות מלאים</CardTitle>
                    <FileText className="w-4 h-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-right text-blue-600">
                      {paymentOrders.filter(o => o.status === 'paid' && o.product_type === 'full_report').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 text-right">הורדות תשובות</CardTitle>
                    <FileText className="w-4 h-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-right text-purple-600">
                      {paymentOrders.filter(o => o.status === 'paid' && o.product_type === 'answers_download').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 text-right">שיעור המרה</CardTitle>
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-right text-orange-600">
                      {responses.filter((r) => r.status === 'completed').length > 0 ?
                      `${Math.round(paymentOrders.filter(o => o.status === 'paid').length / responses.filter((r) => r.status === 'completed').length * 100)}%` :
                      '0%'
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* פילוח רכישות לפי סוג */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">פילוח רכישות לפי סוג מוצר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4 font-semibold">סוג מוצר</th>
                          <th className="text-center py-3 px-4 font-semibold">כמות רכישות</th>
                          <th className="text-left py-3 px-4 font-semibold">סה"כ הכנסות</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-blue-50">
                          <td className="py-4 px-4 text-right">
                            <div className="font-semibold text-blue-900">דו"ח מלא</div>
                            <div className="text-sm text-gray-600">299 ₪ למוצר</div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <Badge className="bg-blue-100 text-blue-800">
                              {paymentOrders.filter(o => o.status === 'paid' && o.product_type === 'full_report' && !o.is_express).length}
                            </Badge>
                          </td>
                          <td className="text-left py-4 px-4">
                            <div className="text-xl font-bold text-blue-600">
                              ₪ {paymentOrders.filter(o => o.status === 'paid' && o.product_type === 'full_report' && !o.is_express).reduce((sum, o) => sum + o.amount, 0)}
                            </div>
                          </td>
                        </tr>

                        <tr className="border-b hover:bg-purple-50">
                          <td className="py-4 px-4 text-right">
                            <div className="font-semibold text-purple-900">דו"ח מלא + מואץ</div>
                            <div className="text-sm text-gray-600">378 ₪ למוצר</div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <Badge className="bg-purple-100 text-purple-800">
                              {paymentOrders.filter(o => o.status === 'paid' && o.product_type === 'full_report' && o.is_express).length}
                            </Badge>
                          </td>
                          <td className="text-left py-4 px-4">
                            <div className="text-xl font-bold text-purple-600">
                              ₪ {paymentOrders.filter(o => o.status === 'paid' && o.product_type === 'full_report' && o.is_express).reduce((sum, o) => sum + o.amount, 0)}
                            </div>
                          </td>
                        </tr>

                        <tr className="border-b hover:bg-green-50">
                          <td className="py-4 px-4 text-right">
                            <div className="font-semibold text-green-900">הורדת תשובות</div>
                            <div className="text-sm text-gray-600">59 ₪ למוצר</div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <Badge className="bg-green-100 text-green-800">
                              {paymentOrders.filter(o => o.status === 'paid' && o.product_type === 'answers_download').length}
                            </Badge>
                          </td>
                          <td className="text-left py-4 px-4">
                            <div className="text-xl font-bold text-green-600">
                              ₪ {paymentOrders.filter(o => o.status === 'paid' && o.product_type === 'answers_download').reduce((sum, o) => sum + o.amount, 0)}
                            </div>
                          </td>
                        </tr>

                        <tr className="bg-gradient-to-l from-green-100 to-blue-100 border-t-2 border-green-500">
                          <td className="py-4 px-4 text-right">
                            <div className="text-xl font-bold text-gray-900">סה"כ הכנסות</div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <Badge className="bg-gray-800 text-white">
                              {paymentOrders.filter(o => o.status === 'paid').length}
                            </Badge>
                          </td>
                          <td className="text-left py-4 px-4">
                            <div className="text-3xl font-bold text-green-700">
                              ₪ {paymentOrders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">היסטוריית תשלומים</CardTitle>
                  <CardDescription className="text-right">
                    כל ההזמנות והתשלומים במערכת
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {paymentOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">אין הזמנות תשלום במערכת</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentOrders.map((order) => (
                      <Card key={order.id} className={`${
                        order.status === 'paid' ? 'border-green-300 bg-green-50' : 
                        order.status === 'failed' ? 'border-red-300 bg-red-50' : 
                        'border-yellow-300 bg-yellow-50'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between flex-row-reverse">
                            <div className="flex-1 text-right">
                              <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                                <h4 className="font-semibold">{order.user_name}</h4>
                                <Badge className={
                                  order.status === 'paid' ? 'bg-green-600' : 
                                  order.status === 'failed' ? 'bg-red-600' : 
                                  'bg-yellow-600'
                                }>
                                  {order.status === 'paid' && 'שולם'}
                                  {order.status === 'pending' && 'ממתין'}
                                  {order.status === 'failed' && 'נכשל'}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{order.user_email}</p>
                              
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">מוצר:</span>{' '}
                                  {order.product_type === 'full_report' && 'דו"ח מלא'}
                                  {order.product_type === 'answers_download' && 'הורדת תשובות'}
                                  {order.product_type === 'online_coaching_7days' && 'ליווי 7 ימים'}
                                  {order.is_express && ' + מואץ'}
                                </p>
                                <p><span className="font-medium">סכום:</span> {order.amount}₪</p>
                                {order.coupon_code && (
                                  <p><span className="font-medium">קופון:</span> {order.coupon_code}</p>
                                )}
                                {order.tranzila_reference && (
                                  <p><span className="font-medium">מזהה טרנזילה:</span> {order.tranzila_reference}</p>
                                )}
                                {order.confirmation_code && (
                                  <p><span className="font-medium">קוד אישור:</span> {order.confirmation_code}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                  {format(new Date(order.created_date), 'dd/MM/yyyy HH:mm')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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

          {viewingResponse &&
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
                  {Object.entries(viewingResponse.responses || {}).
                sort((a, b) => {
                  const numA = parseInt(a[0].replace('q', ''));
                  const numB = parseInt(b[0].replace('q', ''));
                  return numA - numB;
                }).
                map(([key, value]) =>
                <div key={key} className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-medium text-gray-600">{key.replace('q', 'שאלה ')}</div>
                        <div className="text-xl font-bold text-blue-600">{value}</div>
                      </div>
                )}
                </div>
              </div>

              {viewingResponse.optional_comment &&
            <div className="bg-amber-50 p-4 rounded-lg text-right">
                  <h3 className="font-semibold text-lg mb-2">הערה אופציונלית</h3>
                  <p className="text-sm whitespace-pre-wrap">{viewingResponse.optional_comment}</p>
                </div>
            }

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 text-right">
                <div className="grid md:grid-cols-3 gap-2">
                  <div><span className="font-medium">נוצר בתאריך:</span> {format(new Date(viewingResponse.created_date), 'dd/MM/yyyy HH:mm')}</div>
                  <div><span className="font-medium">עודכן לאחרונה:</span> {format(new Date(viewingResponse.updated_date), 'dd/MM/yyyy HH:mm')}</div>
                  <div><span className="font-medium">שפה:</span> {viewingResponse.language === 'he' ? 'עברית' : 'English'}</div>
                </div>
              </div>
            </div>
          }
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingEmails} onOpenChange={() => setViewingEmails(null)}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-right tracking-tight leading-none">היסטוריית מיילים</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm text-right">מיילים שנשלחו למשתמש זה

            </DialogDescription>
          </DialogHeader>

          {viewingEmails &&
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {viewingEmails.length === 0 ?
            <p className="text-center text-gray-500 py-4">אין מיילים שנשלחו למשתמש זה.</p> :

            viewingEmails.map((log) => {
              const matchingTemplate = emailTemplates.find(t => t.template_type === log.email_type);
              return (
                <Card key={log.id} className="border">
                    <CardContent className="p-4 text-right">
                      <div className="flex items-start justify-between flex-row-reverse">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-row-reverse flex-wrap">
                            <Badge variant={log.sent_manually ? "outline" : "default"} className={log.sent_manually ? 'border-purple-300 text-purple-700' : 'bg-gray-200 text-gray-700'}>
                              {log.sent_manually ? 'ידני' : 'אוטומטי'}
                            </Badge>
                            {matchingTemplate && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                תבנית: {matchingTemplate.name_he}
                              </Badge>
                            )}
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
              );
            })
            }
            </div>
          }
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
              variant="outline">

              🇮🇱 עברית
            </Button>
            <Button
              onClick={() => sendReportToClient('en')}
              className="w-full text-lg py-6"
              variant="outline">

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
                onChange={(e) => setSimulationForm({ ...simulationForm, userEmail: e.target.value })}
                placeholder="user@example.com"
                className="text-right"
                dir="rtl" />

              <p className="text-xs text-gray-500 mt-1 text-right">
                המשתמש חייב להיות רשום במערכת
              </p>
            </div>

            <div>
              <Label htmlFor="productType" className="text-right block mb-2">סוג מוצר</Label>
              <select
                id="productType"
                value={simulationForm.productType}
                onChange={(e) => setSimulationForm({ ...simulationForm, productType: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 text-right"
                dir="rtl">

                <option value="full_report">דו"ח מלא (299 ₪)</option>
                <option value="answers_download">הורדת תשובות (59 ₪)</option>
                <option value="online_coaching_7days">ליווי און ליין 7 ימים (497 ₪)</option>
              </select>
            </div>

            {simulationForm.productType === 'full_report' &&
            <div className="flex items-center gap-2 flex-row-reverse">
                <Label htmlFor="expressDelivery" className="cursor-pointer">אספקה מואצת (+79 ₪)</Label>
                <input
                id="expressDelivery"
                type="checkbox"
                checked={simulationForm.expressDelivery}
                onChange={(e) => setSimulationForm({ ...simulationForm, expressDelivery: e.target.checked })}
                className="w-4 h-4" />

              </div>
            }

            <div>
              <Label htmlFor="language" className="text-right block mb-2">שפת המיילים</Label>
              <select
                id="language"
                value={simulationForm.language}
                onChange={(e) => setSimulationForm({ ...simulationForm, language: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 text-right"
                dir="rtl">

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
                {simulationForm.productType === 'online_coaching_7days' &&
                <li className="text-orange-700 font-semibold">יצירת מנוי ליווי 7 ימים (דורש תזמון חיצוני למיילים יומיים)</li>
                }
              </ul>
            </div>

            <div className="flex gap-3 pt-4 flex-row-reverse">
              <Button
                onClick={handleSimulatePurchase}
                className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center gap-2 justify-center"
                disabled={isSimulating}>

                {isSimulating ?
                <>
                    <span>מדמה...</span>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </> :

                'דמה רכישה'
                }
              </Button>
              <Button
                onClick={() => setSimulationDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={isSimulating}>

                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={templateSelectionDialog.open} onOpenChange={(open) => {
        if (!sendingEmailType) {
          setTemplateSelectionDialog({ open, response: open ? templateSelectionDialog.response : null });
        }
      }}>
        <DialogContent className="sm:max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>בחר תבנית מייל לשליחה</DialogTitle>
            <DialogDescription>
              {templateSelectionDialog.response?.personal_info?.full_name &&
              `שליחת מייל אל: ${templateSelectionDialog.response.personal_info.full_name} (${templateSelectionDialog.response.personal_info?.email || templateSelectionDialog.response.created_by})`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto p-2">
            {emailTemplates.filter((t) => t.active).length === 0 ?
            <div className="text-center py-8">
                <p className="text-gray-500 mb-4">אין תבניות מייל פעילות במערכת</p>
                <Button
                onClick={() => {
                  setTemplateSelectionDialog({ open: false, response: null });
                  setTemplateDialog(true);
                }}
                variant="outline">

                  צור תבנית חדשה
                </Button>
              </div> :

            emailTemplates.
            filter((t) => t.active).
            map((template) => {
              const isSending = sendingEmailType === `template_${template.id}_${templateSelectionDialog.response?.id}`;
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4 flex-row-reverse">
                          <div className="flex-1 text-right">
                            <h4 className="font-semibold text-base mb-1">{template.name_he}</h4>
                            <p className="text-xs text-gray-600 mb-2">{template.description_he}</p>
                            <div className="flex gap-2 flex-wrap justify-end">
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
                              {template.include_coupon &&
                          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                  <DollarSign className="w-3 h-3 ml-1" />
                                  קופון {template.coupon_amount} ₪
                                </Badge>
                          }
                            </div>
                          </div>
                          <Button
                        onClick={() => templateSelectionDialog.response && sendManualEmailFromTemplate(template, templateSelectionDialog.response)}
                        disabled={isSending || !templateSelectionDialog.response}
                        className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 flex items-center gap-2 flex-row-reverse"
                        size="sm">

                            {isSending ?
                        <>
                                <span>שולח...</span>
                                <Loader2 className="w-4 h-4 animate-spin" />
                              </> :

                        <>
                                <span>שלח</span>
                                <Send className="w-4 h-4" />
                              </>
                        }
                          </Button>
                        </div>
                      </CardContent>
                    </Card>);

            })
            }
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
        }} />

      <Dialog open={boosterRegistrationDialog} onOpenChange={setBoosterRegistrationDialog}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>רישום ידני לתוכנית בוסטר</DialogTitle>
            <DialogDescription>
              בחר דוח כדי לרשום את המשתמש לתוכנית הבוסטר. המייל הראשון יישלח מיד!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-right block mb-2">בחר דוח</Label>
              <select
                value={boosterRegForm.reportId}
                onChange={(e) => {
                  const report = reports.find(r => r.id === e.target.value);
                  setBoosterRegForm({ 
                    reportId: e.target.value, 
                    userEmail: report?.user_email || '' 
                  });
                }}
                className="w-full border border-gray-300 rounded-md p-2 text-right"
                dir="rtl"
              >
                <option value="">-- בחר דוח --</option>
                {reports.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.user_name} ({report.user_email}) - {report.report_id}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1 text-right">
                רק דוחות עם מסלול מומלץ יכולים להירשם
              </p>
            </div>

            {boosterRegForm.reportId && (() => {
              const selectedReport = reports.find(r => r.id === boosterRegForm.reportId);
              return selectedReport && (
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-right space-y-2">
                  <p><span className="font-semibold">שם:</span> {selectedReport.user_name}</p>
                  <p><span className="font-semibold">אימייל:</span> {selectedReport.user_email}</p>
                  <p><span className="font-semibold">מסלול מומלץ:</span> {selectedReport.recommended_booster_track || 'לא הוגדר'}</p>
                  <p><span className="font-semibold">שפה:</span> {selectedReport.language === 'he' ? 'עברית' : 'English'}</p>
                </div>
              );
            })()}

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm text-amber-900 text-right">
              <p className="font-semibold mb-2">⚡ מה יקרה:</p>
              <ul className="list-disc pr-5 space-y-1">
                <li>יווצר מנוי בוסטר חדש למשתמש</li>
                <li>משימה יומית ראשונה תישלח <strong>מיד</strong> למייל</li>
                <li>מחר ובימים הבאים ישלחו משימות נוספות אוטומטית</li>
                <li>ביום 7 יישלח שאלון והצעה להמשך</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4 flex-row-reverse">
              <Button
                onClick={handleManualBoosterRegistration}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 justify-center"
                disabled={isRegisteringBooster || !boosterRegForm.reportId}
              >
                {isRegisteringBooster ? (
                  <>
                    <span>רושם...</span>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>רשום לבוסטר ושלח מייל ראשון</span>
                    <Rocket className="w-4 h-4" />
                  </>
                )}
              </Button>
              <Button
                onClick={() => setBoosterRegistrationDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={isRegisteringBooster}
              >
                ביטול
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      </div>);

}