import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // חישוב זמן - 24 שעות אחורה (יממה)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const twoDaysAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));
    
    // מצא שאלונים שהושלמו לפני 24-48 שעות (חלון של יממה)
    const allResponses = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
      status: 'completed'
    }, '-updated_date');
    
    const eligibleResponses = allResponses.filter(response => {
      const completionDate = new Date(response.updated_date);
      return completionDate >= twoDaysAgo && completionDate <= oneDayAgo;
    });
    
    let emailsSent = 0;
    const errors = [];
    
    for (const response of eligibleResponses) {
      try {
        const userEmail = response.personal_info?.email || response.created_by;
        if (!userEmail) continue;
        
        // בדיקה אם כבר נשלח מייל מסוג זה למשתמש
        const existingEmail = await base44.asServiceRole.entities.EmailLog.filter({
          email_type: 'completion_no_purchase',
          related_user_email: userEmail
        }, '', 1);
        
        if (existingEmail && existingEmail.length > 0) {
          continue; // כבר נשלח
        }
        
        // בדיקה אם המשתמש רכש משהו (בדיקת PaymentOrder)
        const paidOrders = await base44.asServiceRole.entities.PaymentOrder.filter({
          user_email: userEmail,
          questionnaire_response_id: response.id,
          status: 'paid'
        }, '', 1);
        
        if (paidOrders && paidOrders.length > 0) {
          continue; // רכש - לא צריך את המייל הזה
        }
        
        // יצירת קוד קופון
        const couponCode = `COMPLETE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30);
        
        await base44.asServiceRole.entities.Coupon.create({
          code: couponCode,
          discount_amount: 50,
          valid_until: validUntil.toISOString(),
          user_email: userEmail,
          source: 'abandonment_survey'
        });
        
        const language = response.language || 'he';
        const userName = response.personal_info?.full_name || userEmail.split('@')[0];
        const purchaseUrl = `${Deno.env.get('BASE44_APP_URL') || 'https://v107.base44.app'}/Completion?responseId=${response.id}&discount=10`;
        
        const subject = language === 'he'
          ? '🎁 סיימת את השאלון! הנה 50 ₪ הנחה על הדו"ח המלא'
          : '🎁 You Completed the Questionnaire! Here\'s 50 ₪ Off the Full Report';
        
        const emailBody = language === 'he' ? `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">כל הכבוד ${userName}!</h1>
              <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">סיימת את השאלון המקצועי</p>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                שמחים שהשלמת את השאלון! כהוקרה על ההשקעה שלך, אנחנו רוצים להציע לך הנחה מיוחדת.
              </p>
              
              <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
                <p style="color: white; font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">הנחה של 50 ₪!</p>
                <p style="color: #451a03; font-size: 16px; margin: 0;">קוד קופון: <strong style="font-size: 20px; background: white; padding: 5px 15px; border-radius: 6px; display: inline-block; margin-top: 10px;">${couponCode}</strong></p>
                <p style="color: white; font-size: 12px; margin-top: 10px;">תקף ל-30 יום</p>
              </div>
              
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                הדו"ח המלא של V107 כולל ניתוח מעמיק, תובנות אישיות, ותכנית פעולה מותאמת אישית שתעזור לך לקדם את המיזם שלך.
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${purchaseUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  רכוש דו"ח עם ההנחה 🎁
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                יש שאלות? <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a>
              </p>
            </div>
          </div>
        ` : `
          <div dir="ltr" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Well Done ${userName}!</h1>
              <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">You completed the professional questionnaire</p>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Congratulations on completing the questionnaire! As appreciation for your investment, we'd like to offer you a special discount.
              </p>
              
              <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
                <p style="color: white; font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">50 ₪ Discount!</p>
                <p style="color: #451a03; font-size: 16px; margin: 0;">Coupon code: <strong style="font-size: 20px; background: white; padding: 5px 15px; border-radius: 6px; display: inline-block; margin-top: 10px;">${couponCode}</strong></p>
                <p style="color: white; font-size: 12px; margin-top: 10px;">Valid for 30 days</p>
              </div>
              
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                The V107 full report includes in-depth analysis, personal insights, and a customized action plan to help advance your venture.
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${purchaseUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  Purchase Report with Discount 🎁
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                Questions? <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a>
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
          email_type: 'completion_no_purchase',
          subject: subject,
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
      message: `Completion emails sent successfully`,
      emailsSent,
      totalChecked: eligibleResponses.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in sendCompletionNoPurchase:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});