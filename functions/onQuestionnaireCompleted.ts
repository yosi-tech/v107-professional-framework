import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    
    // האוטומציה שולחת את event.entity_id
    const responseId = payload.event?.entity_id;
    const responseData = payload.data;
    
    if (!responseId || !responseData) {
      return Response.json({
        success: false,
        error: 'Missing response data'
      }, { status: 400 });
    }
    
    // בדיקה שהסטטוס הוא completed
    if (responseData.status !== 'completed') {
      return Response.json({
        success: true,
        message: 'Questionnaire not completed yet, skipping'
      });
    }
    
    const userEmail = responseData.personal_info?.email || responseData.created_by;
    if (!userEmail) {
      return Response.json({
        success: false,
        error: 'No user email found'
      }, { status: 400 });
    }
    
    // בדיקה אם כבר נשלח מייל מסוג questionnaire_completion למשתמש זה
    const existingEmail = await base44.asServiceRole.entities.EmailLog.filter({
      email_type: 'questionnaire_completion',
      related_questionnaire_response_id: responseId
    }, '', 1);
    
    if (existingEmail && existingEmail.length > 0) {
      return Response.json({
        success: true,
        message: 'Email already sent for this questionnaire'
      });
    }
    
    const language = responseData.language || 'he';
    const userName = responseData.personal_info?.full_name || userEmail.split('@')[0];
    
    // בניית URL מלא
    const baseUrl = Deno.env.get('BASE44_APP_URL');
    let purchaseUrl;
    if (baseUrl) {
      purchaseUrl = `${baseUrl}/Completion?responseId=${responseId}`;
    } else {
      // אם אין BASE44_APP_URL, נשתמש ב-origin מה-request
      const url = new URL(req.url);
      purchaseUrl = `${url.origin}/Completion?responseId=${responseId}`;
    }
    
    const subject = language === 'he'
      ? '✅ השאלון הושלם בהצלחה! הצעד הבא - רכוש את הדו"ח המלא'
      : '✅ Questionnaire Completed Successfully! Next Step - Purchase Your Full Report';
    
    const emailBody = language === 'he' ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">✅ כל הכבוד ${userName}!</h1>
          <p style="color: #d1fae5; margin-top: 10px; font-size: 16px;">השאלון הושלם בהצלחה</p>
        </div>
        
        <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            תודה רבה על השלמת שאלון V107! עשית צעד משמעותי להבנת הפרופיל המקצועי שלך.
          </p>
          
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border-right: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 12px 0;">📊 מה הצעד הבא?</h3>
            <p style="color: #1e40af; line-height: 1.6; margin: 0;">
              הדו"ח המלא של V107 כולל ניתוח מעמיק של 11 ממדים מקצועיים, זיהוי חוזקות וחולשות, המלצות מותאמות אישית, ותוכנית פעולה ל-6 חודשים.
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${purchaseUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
              רכוש דו"ח מלא עכשיו 🎯
            </a>
          </div>
          
          <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              💡 הדו"ח מופק על ידי מומחי יזמות ועסקים עם עשרות שנות ניסיון
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            יש שאלות? <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a> | 055-2134848
          </p>
        </div>
      </div>
    ` : `
      <div dir="ltr" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">✅ Well Done ${userName}!</h1>
          <p style="color: #d1fae5; margin-top: 10px; font-size: 16px;">Questionnaire completed successfully</p>
        </div>
        
        <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for completing the V107 questionnaire! You've taken a significant step toward understanding your professional profile.
          </p>
          
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 12px 0;">📊 What's Next?</h3>
            <p style="color: #1e40af; line-height: 1.6; margin: 0;">
              The V107 full report includes in-depth analysis of 11 professional dimensions, identification of strengths and weaknesses, personalized recommendations, and a 6-month action plan.
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${purchaseUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
              Purchase Full Report Now 🎯
            </a>
          </div>
          
          <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              💡 The report is produced by business and entrepreneurship experts with decades of experience
            </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Questions? <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a> | 055-2134848
          </p>
        </div>
      </div>
    `;
    
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: userEmail,
      subject: subject,
      body: emailBody
    });
    
    await base44.asServiceRole.entities.EmailLog.create({
      to_email: userEmail,
      email_type: 'questionnaire_completion',
      subject: subject,
      related_user_email: userEmail,
      related_questionnaire_response_id: responseId,
      language: language
    });
    
    return Response.json({
      success: true,
      message: `Email sent to ${userEmail}`
    });
    
  } catch (error) {
    console.error('Error in onQuestionnaireCompleted:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});