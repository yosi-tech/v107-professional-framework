import React from 'react';

export default function PurchaseConfirmationTemplate({ user_name, user_email, purchase_date, amount, order_id }) {
  const emailHTML = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>אישור רכישת דו"ח - ונטורה-107</title>
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
            background: linear-gradient(135deg, #2d5a27 0%, #38a169 100%);
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
        .success-box {
            background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
            color: #2d5a27;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
        }
        .timeline-box {
            background: #f7fafc;
            border-right: 4px solid #d69e2e;
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
            background: linear-gradient(to left, transparent, #38a169, transparent);
            margin: 20px 0;
        }
        .amount {
            font-size: 24px;
            color: #2d5a27;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ רכישת הדו"ח אושרה!</h1>
            <p>ונטורה-107 - דו"ח מקצועי מותאם אישית</p>
        </div>
        
        <div class="content">
            <h2>שלום ${user_name},</h2>
            
            <p>תודה על רכישת הדו"ח המקצועי! התשלום עובד בהצלחה ואנו מתחילים בעבודה על הניתוח האישי שלך.</p>
            
            <div class="success-box">
                🎯 <strong>רכישה מאושרת</strong><br>
                דו"ח ונטורה-107 מקצועי מלא<br>
                <span class="amount">${amount} ₪</span>
            </div>
            
            <div class="timeline-box">
                <h3 style="margin-top: 0; color: #d69e2e;">📅 לוח הזמנים שלך:</h3>
                <ul style="margin-right: 20px;">
                    <li><strong>היום:</strong> המומחים שלנו מתחילים בניתוח התשובות שלך</li>
                    <li><strong>תוך 3-5 ימים:</strong> ניתוח ראשוני וגיבוש המלצות</li>
                    <li><strong>תוך 7-10 ימי עבודה:</strong> הדו"ח המלא יישלח אליך במייל</li>
                </ul>
            </div>
            
            <p><strong>מה יכלול הדו"ח שלך:</strong></p>
            <ul style="margin-right: 20px;">
                <li><strong>ציונים מפורטים:</strong> 11 קטגוריות יזמיות עם גרפים השוואתיים</li>
                <li><strong>ניתוח מקצועי:</strong> פרשנות מדוקדקת של המומחים שלנו</li>
                <li><strong>המלצה ברורה:</strong> GO / CAUTION / NO-GO מבוססת נתונים</li>
                <li><strong>מפת דרך:</strong> צעדים קונקרטיים ל-90 יום הראשונים</li>
                <li><strong>תחומים מומלצים:</strong> מיקוד בתחומי עסקים המתאימים לך</li>
            </ul>
            
            <div class="divider"></div>
            
            <p><strong>פרטי הזמנה:</strong></p>
            <ul style="list-style: none; margin-right: 0;">
                <li>📧 <strong>כתובת מייל:</strong> ${user_email}</li>
                <li>📅 <strong>תאריך רכישה:</strong> ${purchase_date}</li>
                <li>💳 <strong>סכום:</strong> ${amount} ₪ (כולל מע"מ)</li>
                <li>🆔 <strong>מספר הזמנה:</strong> #${order_id}</li>
            </ul>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
                <strong>יש שאלות?</strong> אל תהסס לפנות אלינו במייל או בטלפון. נהיה שמחים לעזור!
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
      <h3>תבנית מייל - אישור רכישה</h3>
      <p>השתמש בקוד HTML הזה לשליחת מייל אישור רכישה:</p>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
        {emailHTML}
      </pre>
    </div>
  );
}