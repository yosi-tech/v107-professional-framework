import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function getAbandonmentEmailTemplate(userName, surveyUrl, language = 'he') {
  const isHebrew = language === 'he';
  
  const content = {
    he: {
      subject: 'תודה שמילאת את השאלון — V107',
      greeting: 'שלום ' + userName + ',',
      paragraph1: 'קיבלנו את השאלון שמילאת. ראינו שבחרת שלא להמשיך לרכישה כרגע - וזה בסדר גמור!',
      paragraph2: 'נשמח לשמוע ממך מדוע החלטת שלא לרכוש, כדי שנוכל לשפר את השירות.',
      cta: 'ענה על 4 שאלות קצרות וקבל קוד קופון ל-50 ₪ הנחה!',
      button: 'למילוי סקר קצר (2 דק\')',
      note: 'הקופון תקף ל-30 יום ויאפשר לך לרכוש את הדו"ח המלא במחיר מוזל.',
      reminder: 'אם תשנה/י את דעתך, תמיד תוכל/י לחזור ולבחור את האפשרות המתאימה לך:',
      options: [
        'דו"ח מלא — 299 ₪ (249 ₪ עם הקופון)',
        'אספקה מואצת — +79 ₪ (3 ימי עבודה)',
        'תשובות בלבד (PDF) — 59 ₪'
      ],
      questions: 'שאלות:',
      supportEmail: 'support@v107.co.il',
      regards: 'בברכה,',
      team: 'צוות V107',
      footer: '© כל הזכויות שמורות לעלית – יזום עסקים'
    },
    en: {
      subject: 'Thank you for completing the questionnaire — V107',
      greeting: 'Dear ' + userName + ',',
      paragraph1: 'We received your completed questionnaire. We noticed you chose not to proceed with the purchase right now - and that\'s perfectly fine!',
      paragraph2: 'We\'d love to hear why you decided not to purchase, so we can improve our service.',
      cta: 'Answer 4 quick questions and get a $13 discount coupon!',
      button: 'Take Quick Survey (2 min)',
      note: 'The coupon is valid for 30 days and will allow you to purchase the full report at a discounted price.',
      reminder: 'If you change your mind, you can always come back and choose the option that suits you:',
      options: [
        'Full report — $79 ($66 with coupon)',
        'Express delivery — +$21 (3 business days)',
        'Answers only (PDF) — $15'
      ],
      questions: 'Questions:',
      supportEmail: 'support@v107.co.il',
      regards: 'Best regards,',
      team: 'V107 Team',
      footer: '© All rights reserved to Elit – Business Initiatives'
    }
  };

  const c = isHebrew ? content.he : content.en;
  const dir = isHebrew ? 'rtl' : 'ltr';
  const textAlign = isHebrew ? 'right' : 'left';

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
          .header { padding: 30px 0; border-top: 5px solid #4f46e5; text-align: center; }
          .header h1 { color: #111827; font-size: 24px; margin: 0; }
          .header p { color: #6b7280; font-size: 14px; margin: 4px 0 0; }
          .content { padding: 20px 30px 40px 30px; text-align: ${textAlign}; direction: ${dir}; }
          .content p { color: #374151; line-height: 1.6; font-size: 16px; margin-bottom: 16px; }
          .highlight-box { background-color: #fef3c7; border-${isHebrew ? 'right' : 'left'}: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px; }
          .highlight-box p { color: #92400e; font-size: 17px; font-weight: bold; margin: 0; }
          .cta-button { display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 20px 0; font-size: 16px; }
          .cta-button:hover { background-color: #059669; }
          ul { padding-${isHebrew ? 'right' : 'left'}: 20px; color: #374151; font-size: 15px; line-height: 1.8; text-align: ${textAlign}; direction: ${dir}; }
          .footer { background-color: #e5e7eb; padding: 20px 30px; text-align: center; }
          .footer p { margin: 0; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>V107</h1>
            <p>${isHebrew ? 'שאלון אפיון יזמי' : 'Entrepreneurial Assessment'}</p>
          </div>
          <div class="content">
            <p>${c.greeting}</p>
            <p>${c.paragraph1}</p>
            <p>${c.paragraph2}</p>
            
            <div class="highlight-box">
              <p>🎁 ${c.cta}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${surveyUrl}" class="cta-button">${c.button}</a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">${c.note}</p>
            
            <p style="margin-top: 24px;">${c.reminder}</p>
            <ul>
              ${c.options.map(opt => `<li>${opt}</li>`).join('')}
            </ul>
            
            <p style="margin-top: 24px;">
              ${c.questions} <a href="mailto:${c.supportEmail}" style="color: #4f46e5; text-decoration: none;">${c.supportEmail}</a>
            </p>
            
            <p style="margin-top: 24px;">
              ${c.regards}<br>
              <strong>${c.team}</strong>
            </p>
          </div>
          <div class="footer">
            <p>${c.footer}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // חישוב זמן - 96 שעות אחורה
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - (96 * 60 * 60 * 1000));
    
    // מצא שאלונים שנטשו או in_progress לפני 96 שעות
    const allResponses = await base44.asServiceRole.entities.QuestionnaireResponse.list('-created_date');
    
    const abandonedResponses = allResponses.filter(response => 
      (response.status === 'in_progress' || response.status === 'abandoned') &&
      new Date(response.updated_date) < cutoffTime
    );
    
    let emailsSent = 0;
    const errors = [];
    
    for (const response of abandonedResponses) {
      try {
        const userEmail = response.personal_info?.email || response.created_by;
        if (!userEmail) continue;
        
        // בדיקה אם כבר נשלח מייל נטישה למשתמש
        const existingEmail = await base44.asServiceRole.entities.EmailLog.filter({
          email_type: 'abandonment_survey',
          related_user_email: userEmail
        }, '', 1);
        
        if (existingEmail && existingEmail.length > 0) {
          continue; // כבר נשלח
        }
        
        // בדיקה אם המשתמש השלים שאלון אחר כך
        const completedResponse = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
          created_by: userEmail,
          status: 'completed'
        }, '', 1);
        
        if (completedResponse && completedResponse.length > 0) {
          continue; // השלים שאלון - לא צריך מייל נטישה
        }
        
        const language = response.language || 'he';
        const userName = response.personal_info?.full_name || userEmail.split('@')[0];
        const surveyUrl = `${Deno.env.get('BASE44_APP_URL') || 'https://v107.base44.app'}/Survey`;
        
        const emailTemplate = getAbandonmentEmailTemplate(userName, surveyUrl, language);
        
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: userEmail,
          subject: emailTemplate.subject,
          body: emailTemplate.html
        });
        
        await base44.asServiceRole.entities.EmailLog.create({
          to_email: userEmail,
          email_type: 'abandonment_survey',
          subject: emailTemplate.subject,
          related_user_email: userEmail,
          related_questionnaire_response_id: response.id,
          language: language
        });
        
        emailsSent++;
        
      } catch (error) {
        console.error(`Error processing ${response.personal_info?.email}:`, error);
        errors.push({
          email: response.personal_info?.email,
          error: error.message
        });
      }
    }
    
    return Response.json({
      success: true,
      message: `Abandonment emails sent successfully`,
      emailsSent,
      totalChecked: abandonedResponses.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in sendAbandonmentSurvey:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});