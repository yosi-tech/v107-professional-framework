import React from 'react';

export default function ReportReadyTemplate({ user_name, overall_score, recommendation, recommended_areas, report_download_link }) {
  const emailHTML = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>הדו"ח שלך מוכן! - V107</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2b5797 0%, #3182ce 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 8px;
            font-size: 24px;
            font-weight: bold;
        }
        .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
            line-height: 1.6;
        }
        .highlight-box {
            background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
            color: #2b5797;
            padding: 25px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3182ce 0%, #2b5797 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .summary-box {
            background: #f7fafc;
            border-right: 4px solid #3182ce;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to left, transparent, #3182ce, transparent);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 הדו"ח שלך מוכן!</h1>
            <p>V107 - ניתוח מקצועי מלא של הפוטנציאל היזמי שלך</p>
        </div>
        
        <div class="content">
            <h2>שלום ${user_name},</h2>
            
            <p>אנו שמחים להודיע שהדו"ח המקצועי שלך מוכן! המומחים שלנו השלימו את הניתוח המעמיק של התשובות שלך.</p>
            
            <div class="highlight-box">
                📊 <strong>הדו"ח המקצועי שלך מוכן להורדה!</strong><br>
                ניתוח מקיף של 11 קטגוריות יזמיות<br>
                + המלצות מותאמות אישית
            </div>
            
            <div class="summary-box">
                <h3 style="margin-top: 0; color: #3182ce;">📋 תקציר ראשוני:</h3>
                <p><strong>ציון מוכנות כולל:</strong> ${overall_score}/100</p>
                <p><strong>המלצה ראשונית:</strong> ${recommendation}</p>
                <p><strong>תחומים מומלצים:</strong> ${recommended_areas}</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${report_download_link}" class="cta-button">
                    📥 הורד את הדו"ח המלא
                </a>
            </div>
            
            <p><strong>מה תמצא בדו"ח המלא:</strong></p>
            <ul style="margin-right: 20px;">
                <li><strong>ניתוח גרפי:</strong> תוצאות מפורטות בכל 11 הקטגוריות</li>
                <li><strong>השוואות:</strong> המיקום שלך ביחס למדדי ייחוס</li>
                <li><strong>חוזקות ואתגרים:</strong> זיהוי נקודות כוח ותחומי שיפור</li>
                <li><strong>תוכנית פעולה:</strong> צעדים מעשיים ל-90 יום הראשונים</li>
                <li><strong>המלצות תחומיות:</strong> איזה סוג עסק הכי מתאים לך</li>
                <li><strong>מדדי הצלחה:</strong> איך למדוד התקדמות</li>
            </ul>
            
            <div class="divider"></div>
            
            <p><strong>הצעד הבא:</strong></p>
            <p>לאחר קריאת הדו"ח, אם תרצה להעמיק או לקבל הכוונה נוספת, אנו זמינים לשיחת ייעוץ קצרה ללא עלות נוספת.</p>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
                <strong>הערה:</strong> הדו"ח מיועד לשימושך האישי. אנא שמור עותק במקום בטוח וזכור - התוכן שלו רלוונטי לתקופה של 6-12 חודשים.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>צוות עלית – יזום עסקים</strong></p>
            <p>📧 info@elit-ventures.co.il | 📞 03-1234567</p>
            <p>🌐 www.elit-ventures.co.il</p>
            <div class="divider" style="margin: 15px 0;"></div>
            <p>בהצלחה במסע היזמי שלך! 🎯</p>
            <p>© כל הזכויות שמורות לעלית – יזום עסקים</p>
        </div>
    </div>
</body>
</html>
  `;

  return (
    <div>
      <h3>תבנית מייל - הדו"ח מוכן</h3>
      <p>השתמש בקוד HTML הזה לשליחת מייל כשהדו"ח מוכן:</p>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
        {emailHTML}
      </pre>
    </div>
  );
}