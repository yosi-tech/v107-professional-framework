import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const now = new Date();
    const minTime = new Date(now.getTime() - (30 * 60 * 1000)); // 30 דקות אחורה
    const maxTime = new Date(now.getTime() - (10 * 60 * 1000)); // 10 דקות אחורה
    
    // סינון ישיר בשאילתה לפי תאריך ולפי סטטוס — חוסך טעינת כל הנתונים
    const recentlyAbandoned = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
      status: 'abandoned',
      updated_date: { $gte: maxTime.toISOString(), $lte: minTime.toISOString() }
    }, '-updated_date');
    
    let emailsSent = 0;
    const errors = [];
    
    for (const response of recentlyAbandoned) {
      try {
        const userEmail = response.personal_info?.email || response.created_by;
        if (!userEmail) continue;
        if (userEmail.includes('anonymized@') || userEmail.includes('@deleted.') || !userEmail.includes('@')) continue;
        
        // בדיקה אם כבר נשלח מייל עידוד למשתמש על שאלון זה
        const existingEmail = await base44.asServiceRole.entities.EmailLog.filter({
          email_type: 'abandonment_incomplete',
          related_questionnaire_response_id: response.id
        }, '', 1);
        
        if (existingEmail && existingEmail.length > 0) {
          continue; // כבר נשלח
        }
        
        const language = response.language || 'he';
        const userName = response.personal_info?.full_name || userEmail.split('@')[0];
        const baseUrl = Deno.env.get('BASE44_APP_URL');
        const questionnaireUrl = baseUrl ? `${baseUrl}/Questionnaire` : `${new URL(req.url).origin}/Questionnaire`;
        
        const subject = language === 'he'
          ? '🎯 המשך את השאלון - נשאר לך רק צעד קטן'
          : '🎯 Continue Your Questionnaire - Just One Small Step Left';
        
        const emailBody = language === 'he' ? `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">שלום ${userName}</h1>
              <p style="color: #c7d2fe; margin-top: 10px; font-size: 16px;">שמנו לב שהתחלת למלא את שאלון V107</p>
            </div>
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                ראינו שהתחלת למלא את השאלון אבל עדיין לא סיימת. התקדמותך נשמרה!
              </p>
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border-right: 4px solid #f59e0b;">
                <h3 style="color: #92400e; font-size: 18px; margin: 0 0 12px 0;">💡 למה כדאי להשלים?</h3>
                <ul style="color: #92400e; line-height: 1.8; margin: 0; padding-right: 20px;">
                  <li>הדו"ח המלא יעזור לך להבין את הפרופיל המקצועי שלך</li>
                  <li>תקבל המלצות מותאמות אישית לפיתוח קריירה</li>
                  <li>תוכנית פעולה ממוקדת ל-6 חודשים</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${questionnaireUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px;">
                  המשך את השאלון עכשיו 🚀
                </a>
              </div>
              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                יש שאלות? <a href="mailto:support@v107.co.il" style="color: #4f46e5;">support@v107.co.il</a> | 055-2134848
              </p>
            </div>
          </div>
        ` : `
          <div dir="ltr" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Hello ${userName}</h1>
              <p style="color: #c7d2fe; margin-top: 10px; font-size: 16px;">We noticed you started the V107 questionnaire</p>
            </div>
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                We saw you started filling out the questionnaire but haven't finished yet. Your progress has been saved!
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${questionnaireUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px;">
                  Continue Questionnaire Now 🚀
                </a>
              </div>
              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                Questions? <a href="mailto:support@v107.co.il" style="color: #4f46e5;">support@v107.co.il</a>
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
          email_type: 'abandonment_incomplete',
          subject: subject,
          related_user_email: userEmail,
          related_questionnaire_response_id: response.id,
          language: language
        });
        
        emailsSent++;
        
      } catch (error) {
        console.error(`Error processing ${response.personal_info?.email}:`, error);
        errors.push({ email: response.personal_info?.email, error: error.message });
      }
    }
    
    return Response.json({
      success: true,
      message: `Abandonment reminder emails sent successfully`,
      emailsSent,
      totalChecked: recentlyAbandoned.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in sendAbandonmentReminder:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});