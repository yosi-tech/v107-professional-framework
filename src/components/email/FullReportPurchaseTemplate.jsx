// תבנית מייל אישור רכישה - דו"ח מלא (299 ש"ח)
export function getFullReportPurchaseEmailTemplate(userName, transactionId, date, hasCompletedQuestionnaire, questionnaireUrl, isExpress, language = 'he') {
  const isHebrew = language === 'he';
  
  const content = {
    he: {
      subject: "אישור רכישה — AVENTURA 107 (מסלול מלא)",
      greeting: `שלום ${userName},`,
      paymentReceived: `התשלום עבור המסלול המלא של AVENTURA 107 התקבל בהצלחה (סכום: 299 ₪, מזהה עסקה: ${transactionId}, תאריך: ${date}).`,
      whatsNext: "מה הלאה:",
      step1Completed: `אם השאלון כבר הושלם — הדו״ח האישי יישלח אליך ב־יום החמישי (D+5) לאחר ביקורת אנושית${isExpress ? ' (אספקה מואצת - 3 ימי עבודה)' : ''}.`,
      step2NotCompleted: "אם השאלון טרם הושלם — נשמח להשלים כעת:",
      startQuestionnaire: "להתחלת השאלון",
      noQuestionnaireWarning: "(ללא מילוי השאלון לא נוכל להפיק דו״ח.)",
      whatsIncluded: "מה כלול במסלול:",
      included1: "שאלון סגור (107 פריטים, 1–7)",
      included2: "דו״ח פרימיום אישי (HE/EN) עם בדיקת עקביות וסקירת מומחה לפני מסירה",
      included3: `מסירת דו״ח ב־D+5${isExpress ? ' (מואץ - 3 ימי עבודה)' : ''} לכתובת המייל שמסרת`,
      documents: "מסמכים: קבלה/חשבונית נשלחת בנפרד.",
      support: "שירות: לכל שאלה —",
      quickLinks: "קישורים שימושיים:",
      cancellation: "מדיניות ביטולים",
      privacy: "מדיניות פרטיות",
      terms: "תנאי שימוש",
      regards: "בברכה,",
      team: "AVENTURA 107"
    },
    en: {
      subject: "Purchase Confirmation — AVENTURA 107 (Full Package)",
      greeting: `Dear ${userName},`,
      paymentReceived: `Payment for the AVENTURA 107 full package has been successfully received (Amount: $79, Transaction ID: ${transactionId}, Date: ${date}).`,
      whatsNext: "What's next:",
      step1Completed: `If the questionnaire is already completed — Your personal report will be sent on Day 5 (D+5) after human review${isExpress ? ' (express delivery - 3 business days)' : ''}.`,
      step2NotCompleted: "If the questionnaire is not yet completed — We'd love for you to complete it now:",
      startQuestionnaire: "Start Questionnaire",
      noQuestionnaireWarning: "(Without completing the questionnaire, we cannot generate a report.)",
      whatsIncluded: "What's included:",
      included1: "Closed questionnaire (107 items, 1–7 scale)",
      included2: "Premium personal report (HE/EN) with consistency check and expert review before delivery",
      included3: `Report delivery on D+5${isExpress ? ' (express - 3 business days)' : ''} to the email address you provided`,
      documents: "Documents: Receipt/invoice sent separately.",
      support: "Support: For any questions —",
      quickLinks: "Useful links:",
      cancellation: "Cancellation Policy",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      regards: "Best regards,",
      team: "AVENTURA 107"
    }
  };

  const c = isHebrew ? content.he : content.en;
  const dir = isHebrew ? 'rtl' : 'ltr';
  const textAlign = isHebrew ? 'right' : 'left';

  const cancellationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/cancellation-policy`;
  const privacyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/privacy-policy`;
  const termsUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/terms-of-service`;

  return {
    subject: c.subject,
    html: `
      <!DOCTYPE html>
      <html lang="${language}" dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; background-color: #f4f5f7; font-family: Arial, sans-serif; direction: ${dir}; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
          .header { padding: 30px 0; border-top: 5px solid #10b981; text-align: center; }
          .header h1 { color: #111827; font-size: 24px; margin: 0; }
          .header p { color: #6b7280; font-size: 14px; margin: 4px 0 0; }
          .content { padding: 20px 30px 40px 30px; text-align: ${textAlign}; direction: ${dir}; }
          .content p { color: #374151; line-height: 1.6; font-size: 16px; margin-bottom: 16px; }
          .success-box { background-color: #d1fae5; border-${isHebrew ? 'right' : 'left'}: 4px solid #10b981; padding: 16px; margin: 16px 0; border-radius: 8px; }
          .success-box p { margin: 0; color: #065f46; font-size: 15px; line-height: 1.6; }
          .content h3 { color: #111827; font-size: 18px; margin: 24px 0 12px; }
          ol, ul { padding-${isHebrew ? 'right' : 'left'}: 20px; color: #374151; font-size: 15px; line-height: 1.8; text-align: ${textAlign}; direction: ${dir}; }
          .warning { color: #dc2626; font-size: 14px; margin-top: 8px; }
          .cta-button { display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin: 12px 0; }
          .cta-button:hover { background-color: #4338ca; }
          .footer { background-color: #e5e7eb; padding: 20px 30px; text-align: center; }
          .footer p { margin: 0; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AVENTURA 107</h1>
            <p>${c.subject}</p>
          </div>
          <div class="content">
            <p>${c.greeting}</p>
            <div class="success-box">
              <p>${c.paymentReceived}</p>
            </div>
            
            <h3>${c.whatsNext}</h3>
            <ol>
              <li>${c.step1Completed}</li>
              ${!hasCompletedQuestionnaire ? `
                <li>
                  ${c.step2NotCompleted}
                  <div style="margin-top: 12px; text-align: center;">
                    <a href="${questionnaireUrl}" class="cta-button">${c.startQuestionnaire}</a>
                  </div>
                  <p class="warning">${c.noQuestionnaireWarning}</p>
                </li>
              ` : ''}
            </ol>

            <h3>${c.whatsIncluded}</h3>
            <ul>
              <li>${c.included1}</li>
              <li>${c.included2}</li>
              <li>${c.included3}</li>
            </ul>

            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">${c.documents}</p>
            <p>${c.support} <a href="mailto:${c.supportEmail}" style="color: #4f46e5; text-decoration: none;">${c.supportEmail}</a></p>

            <p style="color: #6b7280; font-size: 14px; margin-top: 24px; margin-bottom: 8px;"><strong>${c.quickLinks}</strong></p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.8;">
              <a href="${cancellationUrl}" style="color: #4f46e5; text-decoration: none;">${c.cancellation}</a> · 
              <a href="${privacyUrl}" style="color: #4f46e5; text-decoration: none;">${c.privacy}</a> · 
              <a href="${termsUrl}" style="color: #4f46e5; text-decoration: none;">${c.terms}</a>
            </p>

            <p style="margin-top: 24px;">
              ${c.regards}<br>
              <strong>${c.team}</strong>
            </p>
          </div>
          <div class="footer">
            <p>${isHebrew ? '© כל הזכויות שמורות לעלית – יזום עסקים' : '© All rights reserved to Elit – Business Initiatives'}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}