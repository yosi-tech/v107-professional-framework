// תבנית מייל לבקשת שיחת ייעוץ
export function getConsultationRequestEmailTemplate(userName, reportId, language = 'he') {
  const isHebrew = language === 'he';
  
  const content = {
    he: {
      subject: "שמחנו לראות שהתקדמת — תיאום שיחת ייעוץ ללא עלות | AVENTURA 107",
      title: "תיאום שיחת ייעוץ",
      greeting: `שלום ${userName},`,
      paragraph1: "שמחנו לראות שהשלמת את השאלון של AVENTURA 107, עיינת בדו״ח המקצועי שקיבלת, ואת/ה מעוניין/ת להתקדם. המטרה שלנו: להפוך את תובנות הדו״ח לתכנית פעולה קצרה, ברורה וישימה לעסק שלך.",
      whatsNext: "מה הלאה?",
      paragraph2: "נחזור אליך לתיאום מועד תוך עד 3 ימי עסקים. כדי לזרז, נא להשיב למייל זה עם:",
      requirements: [
        "שם מלא כפי שמופיע בדו״ח",
        `מספר הדו״ח (Report ID): ${reportId}`,
        "העדפה: Zoom או שיחת טלפון (כולל מספר טלפון אם שיחה)",
        "2–3 חלונות זמן נוחים ב־3 ימי העסקים הקרובים (כולל אזור זמן)"
      ],
      sessionDetails: "פרטי השיחה:",
      sessionInfo: "משך 20–25 דק׳ · דיוק המסקנות, סדר עדיפויות, ו־2–3 צעדים ראשונים לביצוע.",
      questions: "לשאלות:",
      supportEmail: "support@aventura107.com",
      regards: "בברכה,",
      team: "צוות AVENTURA 107"
    },
    en: {
      subject: "Great to see your progress — schedule your free consultation | AVENTURA 107",
      title: "Schedule Your Consultation",
      greeting: `Dear ${userName},`,
      paragraph1: "We're delighted to see you completed the AVENTURA 107 questionnaire, reviewed your professional report, and you're ready to move forward. Our goal is to turn your report insights into a clear, practical action plan for your business.",
      whatsNext: "What's next?",
      paragraph2: "We'll email you to schedule within up to 3 business days. To speed things up, please reply with:",
      requirements: [
        "Full name as it appears on your report",
        `Report ID: ${reportId}`,
        "Preferred meeting type: Zoom or Phone (include phone number if Phone)",
        "2–3 time windows in the next 3 business days (please include your time zone)"
      ],
      sessionDetails: "Session details:",
      sessionInfo: "20–25 minutes · sharpen key findings, set priorities, define 2–3 first steps.",
      questions: "Questions:",
      supportEmail: "support@aventura107.com",
      regards: "Best regards,",
      team: "AVENTURA 107 Team"
    }
  };

  const c = isHebrew ? content.he : content.en;
  const dir = isHebrew ? 'rtl' : 'ltr';
  const align = isHebrew ? 'right' : 'left';

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
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .header { padding: 30px 0; border-top: 5px solid #4f46e5; text-align: center; }
          .header h1 { color: #111827; font-size: 24px; margin: 0; }
          .header p { color: #6b7280; font-size: 14px; margin: 4px 0 0; }
          .content { padding: 20px 30px 40px 30px; text-align: ${align}; direction: ${dir}; }
          .content p { color: #374151; line-height: 1.6; font-size: 16px; margin-bottom: 16px; }
          .content h3 { color: #111827; font-size: 18px; margin: 24px 0 12px; }
          ul { padding-${isHebrew ? 'right' : 'left'}: 20px; color: #374151; font-size: 15px; line-height: 1.8; text-align: ${align}; direction: ${dir}; }
          .info-box { background-color: #f0f9ff; border-${isHebrew ? 'right' : 'left'}: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 8px; }
          .info-box p { margin: 0; color: #1e40af; }
          .footer { background-color: #e5e7eb; padding: 20px 30px; text-align: center; }
          .footer p { margin: 0; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AVENTURA 107</h1>
            <p>${c.title}</p>
          </div>
          <div class="content">
            <p>${c.greeting}</p>
            <p>${c.paragraph1}</p>
            <h3>${c.whatsNext}</h3>
            <p>${c.paragraph2}</p>
            <ul>
              ${c.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
            <div class="info-box">
              <p style="font-weight: bold; margin-bottom: 8px;">${c.sessionDetails}</p>
              <p>${c.sessionInfo}</p>
            </div>
            <p>${c.questions} <a href="mailto:${c.supportEmail}" style="color: #4f46e5; text-decoration: none;">${c.supportEmail}</a></p>
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