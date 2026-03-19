import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        // חישוב זמן - 96 שעות אחורה
        const now = new Date();
        const cutoffTime = new Date(now.getTime() - (96 * 60 * 60 * 1000));

        // מציאת כל המיילים של abandonment_survey שנשלחו לפני יותר מ-96 שעות
        const allAbandonmentEmails = await base44.asServiceRole.entities.EmailLog.list('-created_date');
        const abandonmentEmails = allAbandonmentEmails.filter(email => 
            email.email_type === 'abandonment_survey' && 
            new Date(email.created_date) < cutoffTime
        );

        if (!abandonmentEmails || abandonmentEmails.length === 0) {
            return Response.json({
                success: true,
                message: 'No emails found that require reminders',
                count: 0
            });
        }

        let remindersSent = 0;
        const errors = [];

        for (const emailLog of abandonmentEmails) {
            try {
                const userEmail = emailLog.related_user_email || emailLog.to_email;
                
                if (!userEmail) {
                    continue;
                }

                // בדיקה אם כבר נשלח מייל תזכורת למשתמש זה
                const existingReminder = await base44.asServiceRole.entities.EmailLog.filter({
                    email_type: 'abandonment_survey_reminder',
                    related_user_email: userEmail
                }, '', 1);

                if (existingReminder && existingReminder.length > 0) {
                    // כבר נשלחה תזכורת
                    continue;
                }

                // בדיקה אם המשתמש מילא את הסקר
                const surveyResponse = await base44.asServiceRole.entities.SurveyResponse.filter({
                    created_by: userEmail,
                    survey_type: 'abandonment'
                }, '', 1);

                if (surveyResponse && surveyResponse.length > 0) {
                    // המשתמש מילא את הסקר - לא צריך תזכורת
                    continue;
                }

                // בדיקה אם המשתמש השלים שאלון חדש לאחר מייל הנטישה
                const newQuestionnaire = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
                    created_by: userEmail,
                    status: 'completed',
                    created_date: { $gt: emailLog.created_date }
                }, '', 1);

                if (newQuestionnaire && newQuestionnaire.length > 0) {
                    // המשתמש השלים שאלון לאחר מייל הנטישה - לא צריך תזכורת
                    continue;
                }

                // המשתמש לא מילא את הסקר - שולחים תזכורת
                
                // קבלת פרטי המשתמש
                const users = await base44.asServiceRole.entities.User.filter({
                    email: userEmail
                }, '', 1);

                const user = users && users.length > 0 ? users[0] : null;
                const userName = user ? user.full_name : userEmail.split('@')[0];

                // יצירת קוד קופון חדש או שימוש בקיים
                let couponCode = null;
                const existingCoupons = await base44.asServiceRole.entities.Coupon.filter({
                    user_email: userEmail,
                    source: 'abandonment_survey',
                    used: false
                }, '', 1);

                if (existingCoupons && existingCoupons.length > 0) {
                    couponCode = existingCoupons[0].code;
                } else {
                    // יצירת קופון חדש
                    couponCode = `SURVEY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                    const validUntil = new Date();
                    validUntil.setDate(validUntil.getDate() + 30);

                    await base44.asServiceRole.entities.Coupon.create({
                        code: couponCode,
                        discount_amount: 50,
                        valid_until: validUntil.toISOString(),
                        user_email: userEmail,
                        source: 'abandonment_survey'
                    });
                }

                // שליחת המייל
                const language = emailLog.language || 'he';
                const surveyUrl = `${Deno.env.get('BASE44_APP_URL') || 'https://v107.base44.app'}/Survey`;

                const subject = language === 'he' 
                    ? '⏰ תזכורה אחרונה - 50 ₪ הנחה מחכים לך!'
                    : '⏰ Last Reminder - 50 ₪ Discount Waiting for You!';

                const emailBody = language === 'he' ? `
                    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">תזכורה אחרונה!</h1>
                            <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">50 ₪ הנחה מחכים לך</p>
                        </div>
                        
                        <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">שלום ${userName},</p>
                            
                            <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                שמנו לב שעדיין לא מילאת את הסקר הקצר שלנו (4 שאלות בלבד!).
                            </p>
                            
                            <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
                                <p style="color: white; font-size: 20px; font-weight: bold; margin: 0;">⏰ זו ההזדמנות האחרונה</p>
                                <p style="color: white; font-size: 28px; font-weight: bold; margin: 10px 0;">50 ₪ הנחה על הדו"ח המלא!</p>
                                <p style="color: #451a03; font-size: 14px; margin: 0;">קוד הקופון שלך: <strong>${couponCode}</strong></p>
                            </div>
                            
                            <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                                מילוי הסקר יעזור לנו להבין טוב יותר את הצרכים שלך, ואתה תקבל קוד קופון מיידי להנחה של 50 ₪!
                            </p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="${surveyUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                                    מלא את הסקר עכשיו 🎁
                                </a>
                            </div>
                            
                            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                הקופון תקף ל-30 יום מהיום<br>
                                מעוניין לדבר איתנו? <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a>
                            </p>
                        </div>
                    </div>
                ` : `
                    <div dir="ltr" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Last Reminder!</h1>
                            <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">50 ₪ Discount Waiting for You</p>
                        </div>
                        
                        <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hello ${userName},</p>
                            
                            <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                We noticed you haven't completed our short survey yet (only 4 questions!).
                            </p>
                            
                            <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
                                <p style="color: white; font-size: 20px; font-weight: bold; margin: 0;">⏰ This is Your Last Chance</p>
                                <p style="color: white; font-size: 28px; font-weight: bold; margin: 10px 0;">50 ₪ Off the Full Report!</p>
                                <p style="color: #451a03; font-size: 14px; margin: 0;">Your coupon code: <strong>${couponCode}</strong></p>
                            </div>
                            
                            <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                                Completing the survey will help us better understand your needs, and you'll receive an instant 50 ₪ discount coupon!
                            </p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="${surveyUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                                    Complete Survey Now 🎁
                                </a>
                            </div>
                            
                            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                Coupon valid for 30 days from today<br>
                                Want to talk to us? <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a>
                            </p>
                        </div>
                    </div>
                `;

                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: userEmail,
                    subject: subject,
                    body: emailBody
                });

                // שמירת לוג המייל
                await base44.asServiceRole.entities.EmailLog.create({
                    to_email: userEmail,
                    email_type: 'abandonment_survey_reminder',
                    subject: subject,
                    related_user_email: userEmail,
                    language: language
                });

                remindersSent++;

            } catch (error) {
                console.error(`Error sending reminder to ${emailLog.to_email}:`, error);
                errors.push({
                    email: emailLog.to_email,
                    error: error.message
                });
            }
        }

        return Response.json({
            success: true,
            message: `Survey reminders sent successfully`,
            remindersSent,
            totalChecked: abandonmentEmails.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Error in sendSurveyReminders:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
});