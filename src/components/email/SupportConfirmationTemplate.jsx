// תבנית מייל אוטומטי לאישור פנייה לתמיכה
export function getSupportConfirmationEmailTemplate(userName, ticketId, date, language = 'he') {
  const isHebrew = language === 'he';
  
  const content = {
    he: {
      subject: "קיבלנו את הפנייה שלך — V107",
      greeting: `שלום ${userName},`,
      paragraph1: `קיבלנו את פנייתך ל-support@v107.com.`,
      ticketInfo: `מס' פנייה: ${ticketId} · תאריך: ${date}.`,
      paragraph2: "נחזור אליך במייל עם תשובה תוך עד 3 ימי עסקים.",
      paragraph3: "יש פרטים או קבצים משלימים? אפשר פשוט להשיב למייל זה ולצרף.",
      quickLinks: "קישורים מהירים:",
      faq: "שאלות נפוצות (FAQ)",
      cancellation: "מדיניות ביטולים",
      terms: "תנאי שימוש",
      thanks: "תודה,",
      team: "צוות V107"
    },
    en: {
      subject: "We've received your request — V107",
      greeting: `Hi ${userName},`,
      paragraph1: "We've received your message to support@v107.com.",
      ticketInfo: `Ticket ID: ${ticketId} · Date: ${date}.`,
      paragraph2: "We'll get back to you by email within up to 3 business days.",
      paragraph3: "If you have additional details or files, just reply to this email and attach them.",
      quickLinks: "Quick links:",
      faq: "FAQ",
      cancellation: "Cancellation Policy",
      terms: "Terms of Service",
      thanks: "Thank you,",
      team: "V107 Team"
    }
  };

  const c = isHebrew ? content.he : content.en;
  const dir = isHebrew ? 'rtl' : 'ltr';
  const align = isHebrew ? 'right' : 'left';

  // קישורים לדפי המדיניות (יש לעדכן את ה-URLs לכתובות האמיתיות)
  const faqUrl = `${window.location.origin}/#faq`;
  const cancellationUrl = `${window.location.origin}/cancellation-policy`;
  const termsUrl = `${window.location.origin}/terms-of-service`;

  return {
    subject: c.subject,
    html: `
      <!DOCTYPE html>
      <html lang="${language}" dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background-color:#f4f5f7; font-family:Arial, sans-serif; direction:${dir};">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse; margin-top:20px; margin-bottom:20px; background-color:#ffffff; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);">
          <tr>
            <td align="center" style="padding:30px 0; border-top:5px solid #10b981;">
              <h1 style="color:#111827; font-size:24px; margin:0;">V107</h1>
              <p style="color:#6b7280; font-size:14px; margin:4px 0 0;">${isHebrew ? 'תמיכה לקוחות' : 'Customer Support'}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 30px 40px 30px; text-align:${align};">
              <p style="color:#374151; line-height:1.6; font-size:16px; margin-bottom:16px;">
                ${c.greeting}
              </p>
              <p style="color:#374151; line-height:1.6; font-size:16px; margin-bottom:12px;">
                ${c.paragraph1}
              </p>
              <div style="background-color:#f0fdf4; border-${isHebrew ? 'right' : 'left'}:4px solid #10b981; padding:16px; margin:16px 0; border-radius:8px;">
                <p style="margin:0; color:#065f46; font-size:15px;">${c.ticketInfo}</p>
              </div>
              <p style="color:#374151; line-height:1.6; font-size:16px; margin-bottom:16px;">
                ${c.paragraph2}
              </p>
              <p style="color:#374151; line-height:1.6; font-size:16px; margin-bottom:24px;">
                ${c.paragraph3}
              </p>
              <p style="color:#6b7280; font-size:14px; margin-bottom:8px;">
                <strong>${c.quickLinks}</strong>
              </p>
              <p style="color:#6b7280; font-size:14px; line-height:1.8;">
                <a href="${faqUrl}" style="color:#4f46e5; text-decoration:none;">${c.faq}</a> | 
                <a href="${cancellationUrl}" style="color:#4f46e5; text-decoration:none;">${c.cancellation}</a> | 
                <a href="${termsUrl}" style="color:#4f46e5; text-decoration:none;">${c.terms}</a>
              </p>
              <p style="color:#374151; line-height:1.6; font-size:16px; margin-top:24px;">
                ${c.thanks}<br>
                <strong>${c.team}</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#e5e7eb" style="padding:20px 30px; text-align:center;">
              <p style="margin:0; color:#6b7280; font-size:12px;">
                ${isHebrew ? '© כל הזכויות שמורות לעלית – יזום עסקים' : '© All rights reserved to Elit – Business Initiatives'}
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
}