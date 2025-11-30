import React from 'react';

export default function QuestionnaireCompletionTemplate({ user_name, upgrade_link }) {
  const emailHTML = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>השאלון הושלם בהצלחה - ונטורה-107</title>
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
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
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
            background: linear-gradient(135deg, #d69e2e 0%, #f6e05e 100%);
            color: #1a202c;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #d69e2e 0%, #b7791f 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
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
            background: linear-gradient(to left, transparent, #d69e2e, transparent);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 השאלון הושלם בהצלחה!</h1>
            <p>ונטורה-107 - מפת הדרכים האישית שלך להצלחה יזמית</p>
        </div>
        
        <div class="content">
            <h2>שלום ${user_name},</h2>
            
            <p>תודה שהשקעת מזמנך והשלמת את שאלון ונטורה-107! התשובות שלך נקלטו במערכת ואנו מתחילים לעבד אותן.</p>
            
            <div class="highlight-box">
                💎 <strong>שדרוג לדו"ח מומחים מלא:</strong><br>
                ניתוח מעמיק + תוכנית פעולה מותאמת אישית<br>
                <span style="font-size: 20px;">299 ₪</span> (כולל מע"מ)
            </div>
            
            <p><strong>מה כלול בדו"ח המקצועי:</strong></p>
            <ul style="margin-right: 20px;">
                <li>ניתוח גרפי מפורט של התוצאות שלך</li>
                <li>השוואה למדדי ייחוס מקצועיים</li>
                <li>המלצות GO/CAUTION/NO-GO ברורות</li>
                <li>מפת דרך מותאמת אישית ל-90 יום הראשונים</li>
                <li>זיהוי חוזקות ואזורי שיפור מפורטים</li>
            </ul>
            
            <div class="divider"></div>
            
            <p><strong>מה קורה עכשיו?</strong></p>
            <p>אם תחליט לרכוש את הדו"ח המקצועי, המומחים שלנו (35+ שנות ניסיון) יתחילו בניתוח מעמיק של התשובות שלך ויכינו עבורך דו"ח אישי תוך 7-10 ימי עבודה.</p>
            
            <div style="text-align: center;">
                <a href="${upgrade_link}" class="cta-button">
                    שדרג לדו"ח מקצועי מלא
                </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
                <strong>שמירה על פרטיות:</strong> כל הנתונים שלך מעובדים באופן אנונימי ומאובטח. אנו לא חושפים מידע אישי ומשתמשים בנתונים אך ורק לשיפור הכלי.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>צוות עלית – יזום עסקים</strong></p>
            <p>📧 info@elit-ventures.co.il | 📞 03-1234567</p>
            <p>🌐 www.elit-ventures.co.il</p>
            <div class="divider" style="margin: 15px 0;"></div>
            <p>© כל הזכויות שמורות לעלית – יזום עסקים</p>
        </div>
    </div>
</body>
</html>
  `;

  return (
    <div>
      <h3>תבנית מייל - השלמת שאלון</h3>
      <p>השתמש בקוד HTML הזה לשליחת מייל אחרי השלמת השאלון:</p>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
        {emailHTML}
      </pre>
    </div>
  );
}