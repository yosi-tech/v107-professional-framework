import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// פונקציה לייצור תבנית מייל לרכישת דו"ח מלא
function getFullReportPurchaseEmailTemplate(userName, transactionId, date, hasCompletedQuestionnaire, questionnaireUrl, isExpress, language = 'he') {
  const isHebrew = language === 'he';
  
  const content = {
    he: {
      subject: "אישור רכישה — V107 (מסלול מלא)",
      greeting: `שלום ${userName},`,
      paymentReceived: `התשלום עבור המסלול המלא של V107 התקבל בהצלחה (סכום: 299 ₪, מזהה עסקה: ${transactionId}, תאריך: ${date}).`,
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
      team: "V107"
    },
    en: {
      subject: "Purchase Confirmation — V107 (Full Package)",
      greeting: `Dear ${userName},`,
      paymentReceived: `Payment for the V107 full package has been successfully received (Amount: $79, Transaction ID: ${transactionId}, Date: ${date}).`,
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
      team: "V107"
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
            <h1>V107</h1>
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

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const adminUser = await base44.auth.me();

        if (!adminUser || adminUser.role !== 'admin') {
            return Response.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
        }

        const { userEmail, productType, price, expressDelivery, language } = await req.json();

        if (!userEmail || !productType || !price) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // עדכון נתוני המשתמש כמו ברכישה אמיתית
        const userDataUpdate = {
            purchase_date: new Date().toISOString(),
            payment_amount: price,
        };

        if (productType === 'full_report') {
            userDataUpdate.has_purchased_full_report = true;
            userDataUpdate.express_delivery = expressDelivery || false;
        } else if (productType === 'answers_download') {
            userDataUpdate.has_purchased_answers_download = true;
        } else if (productType === 'online_coaching_7days') {
            userDataUpdate.has_purchased_online_coaching = true;
        }

        // קבלת פרטי המשתמש
        const allUsers = await base44.asServiceRole.entities.User.list();
        const targetUser = allUsers.find(u => u.email === userEmail);

        if (!targetUser) {
            return Response.json({ error: `User with email ${userEmail} not found` }, { status: 404 });
        }

        // עדכון המשתמש
        await base44.asServiceRole.entities.User.update(targetUser.id, userDataUpdate);

        // שליחת מייל אישור
        if (productType === 'full_report') {
            // בדיקה אם המשתמש השלים את השאלון
            const responses = await base44.asServiceRole.entities.QuestionnaireResponse.filter(
                { created_by: userEmail },
                '-created_date',
                1
            );
            const hasCompletedQuestionnaire = responses.length > 0 && responses[0].status === 'completed';
            
            // קריאה לפונקציה שמייצרת את תבנית המייל
            const questionnaireUrl = `${new URL(req.url).origin}/questionnaire`;
            const transactionId = `SIM-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
            const date = new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US');
            
            // ייצור תבנית המייל באותו אופן כמו בעמוד התשלום
            const emailTemplate = getFullReportPurchaseEmailTemplate(
                targetUser.full_name || targetUser.email,
                transactionId,
                date,
                hasCompletedQuestionnaire,
                questionnaireUrl,
                expressDelivery || false,
                language || 'he'
            );

            await base44.integrations.Core.SendEmail({
                to: userEmail,
                subject: emailTemplate.subject,
                body: emailTemplate.html
            });

            // רישום המייל בלוג
            await base44.asServiceRole.entities.EmailLog.create({
                to_email: userEmail,
                email_type: 'full_report_purchase',
                subject: emailTemplate.subject,
                related_user_email: userEmail,
                language: language || 'he',
                sent_manually: true
            });

        } else if (productType === 'answers_download') {
            const transactionId = `SIM-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
            const subject = language === 'he' ? 'אישור רכישה - תשובות השאלון' : 'Purchase Confirmation - Questionnaire Answers';
            const body = language === 'he'
                ? `שלום ${targetUser.full_name || targetUser.email},<br><br>תודה על רכישת תשובות השאלון. מזהה עסקה: ${transactionId}.<br><br>בברכה,<br>צוות V107`
                : `Dear ${targetUser.full_name || targetUser.email},<br><br>Thank you for purchasing the questionnaire answers. Transaction ID: ${transactionId}.<br><br>Best regards,<br>V107 Team`;
            
            await base44.integrations.Core.SendEmail({
                to: userEmail,
                subject: subject,
                body: body
            });

            // רישום המייל בלוג
            await base44.asServiceRole.entities.EmailLog.create({
                to_email: userEmail,
                email_type: 'answers_download_purchase',
                subject: subject,
                related_user_email: userEmail,
                language: language || 'he',
                sent_manually: true
            });

        } else if (productType === 'online_coaching_7days') {
            // יצירת מנוי ליווי און ליין
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 7);

            await base44.asServiceRole.entities.OnlineCoachingSubscription.create({
                user_email: userEmail,
                user_name: targetUser.full_name || targetUser.email,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                current_day: 1,
                status: 'active',
                language: language || 'he'
            });

            // שליחת מייל התחלתי (יום 1)
            const coachingEmailSubject = language === 'he' ? 
                'יום 1 - ליווי V107: ברוכים הבאים!' : 
                'Day 1 - V107 Coaching: Welcome!';
            const coachingEmailBody = language === 'he' ?
                `<h2>שלום ${targetUser.full_name || 'יזם/ית יקר/ה'},</h2>
                <p>ברוכים הבאים לליווי V107 למשך 7 ימים!</p>
                <p>זהו המייל הראשון מתוך 7 מיילים יומיים שיגיעו אליך במהלך השבוע הקרוב.</p>
                <p><strong>יום 1 - התחלה:</strong></p>
                <p>היום נתחיל עם קביעת המטרות שלך...</p>
                <p>בהצלחה!<br>צוות V107</p>` :
                `<h2>Hello ${targetUser.full_name || 'Dear Entrepreneur'},</h2>
                <p>Welcome to V107 7-day coaching program!</p>
                <p>This is the first of 7 daily emails you'll receive over the coming week.</p>
                <p><strong>Day 1 - Getting Started:</strong></p>
                <p>Today we'll begin by setting your goals...</p>
                <p>Best of luck!<br>V107 Team</p>`;

            await base44.integrations.Core.SendEmail({
                to: userEmail,
                subject: coachingEmailSubject,
                body: coachingEmailBody
            });
        }

        // תיעוד הרכישה המדומה
        await base44.asServiceRole.entities.SimulatedPurchase.create({
            user_email: userEmail,
            product_type: productType,
            price: price,
            express_delivery: expressDelivery || false,
            admin_who_simulated: adminUser.email
        });

        return Response.json({
            success: true,
            message: `Purchase simulated successfully for ${userEmail}`,
            productType,
            price
        });

    } catch (error) {
        console.error('Error in simulatePurchase:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});