import React from 'react';
import QuestionnaireCompletionTemplate from '../components/email/QuestionnaireCompletionTemplate';
import PurchaseConfirmationTemplate from '../components/email/PurchaseConfirmationTemplate';
import ReportReadyTemplate from '../components/email/ReportReadyTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmailTemplates() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">תבניות מיילים RTL</h1>
          <p className="text-lg text-gray-600">תבניות מיילים מקצועיות בעברית עם תמיכה RTL</p>
        </div>

        <div className="space-y-12">
          <Card>
            <CardHeader>
              <CardTitle>1. מייל השלמת שאלון</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionnaireCompletionTemplate 
                user_name="דוגמה"
                upgrade_link="https://example.com/upgrade"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. מייל אישור רכישה</CardTitle>
            </CardHeader>
            <CardContent>
              <PurchaseConfirmationTemplate 
                user_name="דוגמה"
                user_email="user@example.com"
                purchase_date="2024-01-15"
                amount="299"
                order_id="12345"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. מייל הדו"ח מוכן</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportReadyTemplate 
                user_name="דוגמה"
                overall_score="76"
                recommendation="GO"
                recommended_areas="שירותי B2B, ייעוץ"
                report_download_link="https://example.com/download"
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">הוראות שימוש</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>העתק את קוד ה-HTML מתוך כל קומפוננטה</li>
            <li>החלף את המשתנים (${`{variable}`}) בערכים האמיתיים</li>
            <li>השתמש בקוד במערכת שליחת המיילים שלך</li>
            <li>כל התבניות מותאמות לכיוון RTL עברי</li>
          </ul>
        </div>
      </div>
    </div>
  );
}