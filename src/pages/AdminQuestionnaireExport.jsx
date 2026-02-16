import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, AlertCircle, FileSpreadsheet, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function AdminQuestionnaireExport() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    checkAdminAndLoadStats();
  }, []);

  const checkAdminAndLoadStats = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (currentUser.role !== 'admin') {
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(currentUser);

      // Load statistics
      const allResponses = await base44.entities.QuestionnaireResponse.list();
      const completed = allResponses.filter(r => r.status === 'completed').length;
      const inProgress = allResponses.filter(r => r.status === 'in_progress').length;
      const abandoned = allResponses.filter(r => r.status === 'abandoned').length;

      // Check who purchased
      const reports = await base44.entities.GeneratedReport.list();
      const purchasedCount = reports.filter(r => r.purchased).length;

      setStats({
        total: allResponses.length,
        completed,
        inProgress,
        abandoned,
        purchased: purchasedCount,
        notPurchased: completed - purchasedCount
      });

    } catch (error) {
      console.error("Error loading stats:", error);
      alert("שגיאה בטעינת נתונים");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Fetch all questionnaire responses
      const allResponses = await base44.entities.QuestionnaireResponse.list();
      
      // Fetch all reports to know who purchased
      const allReports = await base44.entities.GeneratedReport.list();
      
      // Create CSV header
      const headers = [
        'ID',
        'שם מלא',
        'אימייל',
        'תאריך מילוי',
        'סטטוס שאלון',
        'גרסה',
        'שפה',
        'רכישה (כן/לא)',
        'גיל',
        'מין',
        'שנות ניסיון',
        'סטטוס מקצועי',
        'תחום עיסוق',
        'הערה אופציונלית'
      ];

      // Add question columns (Q1-Q107)
      for (let i = 1; i <= 107; i++) {
        headers.push(`שאלה ${i}`);
      }

      const rows = [headers];

      // Process each response
      for (const response of allResponses) {
        const report = allReports.find(r => r.questionnaire_response_id === response.id);
        const purchased = report?.purchased ? 'כן' : 'לא';

        const row = [
          response.id,
          response.personal_info?.full_name || '',
          response.personal_info?.email || '',
          format(new Date(response.created_date), 'dd/MM/yyyy HH:mm'),
          response.status || '',
          response.version || '',
          response.language || 'he',
          purchased,
          response.personal_info?.age || '',
          response.personal_info?.gender || '',
          response.personal_info?.years_of_experience || '',
          response.personal_info?.current_professional_status || '',
          response.personal_info?.occupation_field || '',
          response.optional_comment || ''
        ];

        // Add answers to questions
        for (let i = 1; i <= 107; i++) {
          row.push(response.responses?.[`q${i}`] || '');
        }

        rows.push(row);
      }

      // Convert to CSV format
      const csvContent = rows.map(row => 
        row.map(cell => {
          // Escape quotes and wrap in quotes if contains comma or newline
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      ).join('\n');

      // Add BOM for Hebrew support in Excel
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `שאלונים_V107_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('הקובץ הורד בהצלחה!');
    } catch (error) {
      console.error("Error exporting:", error);
      alert("שגיאה בייצוא הנתונים");
    } finally {
      setIsExporting(false);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-t-4 border-t-blue-600">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-3xl">ייצוא כל השאלונים</CardTitle>
                <CardDescription className="text-lg mt-1">
                  ייצוא מלא של כל התשובות לקובץ CSV/Excel
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>סטטיסטיקות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">סה"כ שאלונים</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">הושלמו</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">רכשו דוח</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.purchased}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">לא רכשו</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.notPurchased}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">בתהליך</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">נזנחו</p>
                  <p className="text-3xl font-bold text-red-600">{stats.abandoned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ייצוא נתונים</CardTitle>
            <CardDescription>
              הקובץ שיורד יכלול את כל הפרטים האישיים, תשובות לכל 107 השאלות, והערות אופציונליות
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">מידע חשוב:</p>
                  <ul className="list-disc pr-5 space-y-1">
                    <li>הקובץ יכלול את כל השאלונים (בכל הסטטוסים)</li>
                    <li>הקובץ יסומן אם המשתמש רכש דוח או לא</li>
                    <li>הקובץ יהיה בפורמט CSV הניתן לפתיחה ב-Excel</li>
                    <li>עברית נתמכת במלואה</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={exportToCSV}
              disabled={isExporting}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  מייצא...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 ml-2" />
                  ייצא את כל השאלונים לקובץ CSV
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>הוראות שימוש</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>לחץ על כפתור "ייצא את כל השאלונים" כדי להוריד את הקובץ</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>הקובץ יורד אוטומטית לתיקיית ההורדות שלך</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>פתח את הקובץ ב-Excel או Google Sheets</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>תוכל לסנן, למיין ולנתח את הנתונים כרצונך</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}