import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // חישוב זמן - 96 שעות אחורה
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - (96 * 60 * 60 * 1000));
    
    // מצא משתמשים שרכשו דוח מלא לפני 96 שעות
    const allUsers = await base44.asServiceRole.entities.User.list();
    
    let emailsSent = 0;
    const errors = [];
    
    for (const user of allUsers) {
      try {
        // רק אם רכש דוח מלא
        if (!user.has_purchased_full_report) continue;
        
        // בדיקה אם כבר נשלח מייל מסוג זה
        const existingEmail = await base44.asServiceRole.entities.EmailLog.filter({
          email_type: 'booster_encouragement',
          related_user_email: user.email
        }, '', 1);
        
        if (existingEmail && existingEmail.length > 0) {
          continue; // כבר נשלח
        }
        
        // בדיקה אם יש מנוי בוסטר פעיל או שהיה
        const boosterSubscription = await base44.asServiceRole.entities.OnlineCoachingSubscription.filter({
          user_email: user.email
        }, '', 1);
        
        if (boosterSubscription && boosterSubscription.length > 0) {
          continue; // כבר נרשם לבוסטר
        }
        
        // מצא את הדוח של המשתמש
        const reports = await base44.asServiceRole.entities.GeneratedReport.filter({
          user_email: user.email
        }, '-created_date', 1);
        
        if (!reports || reports.length === 0) continue;
        
        const report = reports[0];
        
        // בדיקה אם עברו 96 שעות מאז יצירת הדוח
        if (new Date(report.created_date) >= cutoffTime) {
          continue; // עדיין לא עברו 96 שעות
        }
        
        const language = report.language || 'he';
        const userName = report.user_name || user.full_name || user.email.split('@')[0];
        const boosterUrl = `${Deno.env.get('BASE44_APP_URL') || 'https://v107.base44.app'}/BoosterRegistration?reportId=${report.id}`;
        const recommendedTrack = report.recommended_booster_track || 'execution';
        
        const trackNames = {
          he: {
            execution: 'ביצוע',
            digital: 'דיגיטל',
            finance: 'פיננסים',
            marketing: 'שיווק',
            management: 'ניהול',
            vision: 'חזון'
          },
          en: {
            execution: 'Execution',
            digital: 'Digital',
            finance: 'Finance',
            marketing: 'Marketing',
            management: 'Management',
            vision: 'Vision'
          }
        };
        
        const trackName = trackNames[language][recommendedTrack];
        
        const subject = language === 'he'
          ? `${userName}, מוכן/ה להפוך את הדו"ח שלך לתוצאות? 🚀`
          : `${userName}, ready to turn your report into results? 🚀`;
        
        const emailBody = language === 'he' ? `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">מהידיעה לפעולה 🚀</h1>
              <p style="color: #fce7f3; margin-top: 10px; font-size: 16px;">הדו"ח שלך ממתין ליישום</p>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">שלום ${userName},</p>
              
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                קראת את הדו"ח שלך. קיבלת תובנות. אבל האם <strong>פעלת</strong> לפיהן?
              </p>
              
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                רוב האנשים מסתפקים בידיעה. מי שמגיעים לתוצאות - הם אלה שעוברים לפעולה.
              </p>
              
              <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
                <h3 style="color: #4C1D95; font-size: 20px; margin: 0 0 15px 0;">🎯 V107 BOOSTER - ${trackName}</h3>
                <p style="color: #5B21B6; font-size: 15px; line-height: 1.8;">
                  תוכנית ליווי יומית ל-30 יום, ממוקדת ב${trackName} - התחום שזוהה כחלש ביותר בדו"ח שלך.
                </p>
                <ul style="color: #5B21B6; font-size: 14px; line-height: 1.8; margin-top: 15px; text-align: right;">
                  <li>משימה יומית קצרה (10-15 דקות)</li>
                  <li>התאמה אישית מלאה לפרופיל שלך</li>
                  <li>7 ימים ראשונים <strong>חינם לחלוטין</strong></li>
                  <li>אחרי 7 ימים: אם חשת שיפור → תשלום. אם לא → סיום ללא עלות</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${boosterUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                  התחל V107 BOOSTER עכשיו (חינם) 🎁
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                ${userName}, הגיע הזמן להפוך את הפוטנציאל שלך לתוצאות מוחשיות
              </p>
            </div>
          </div>
        ` : `
          <div dir="ltr" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">From Knowledge to Action 🚀</h1>
              <p style="color: #fce7f3; margin-top: 10px; font-size: 16px;">Your report is waiting to be implemented</p>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hello ${userName},</p>
              
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                You read your report. You gained insights. But have you <strong>acted</strong> on them?
              </p>
              
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                Most people settle for knowledge. Those who achieve results - they take action.
              </p>
              
              <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
                <h3 style="color: #4C1D95; font-size: 20px; margin: 0 0 15px 0;">🎯 V107 BOOSTER - ${trackName}</h3>
                <p style="color: #5B21B6; font-size: 15px; line-height: 1.8;">
                  30-day daily coaching program, focused on ${trackName} - identified as your weakest domain.
                </p>
                <ul style="color: #5B21B6; font-size: 14px; line-height: 1.8; margin-top: 15px;">
                  <li>Short daily task (10-15 minutes)</li>
                  <li>Fully personalized to your profile</li>
                  <li>First 7 days <strong>completely free</strong></li>
                  <li>After 7 days: Experienced improvement → Payment. If not → End with no cost</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${boosterUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                  Start V107 BOOSTER Now (Free) 🎁
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                ${userName}, it's time to turn your potential into tangible results
              </p>
            </div>
          </div>
        `;
        
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: subject,
          body: emailBody
        });
        
        await base44.asServiceRole.entities.EmailLog.create({
          to_email: user.email,
          email_type: 'booster_encouragement',
          subject: subject,
          related_user_email: user.email,
          related_report_id: report.id,
          language: language
        });
        
        emailsSent++;
        
      } catch (error) {
        console.error(`Error processing ${user.email}:`, error);
        errors.push({
          email: user.email,
          error: error.message
        });
      }
    }
    
    return Response.json({
      success: true,
      message: `Booster encouragement emails sent successfully`,
      emailsSent,
      totalChecked: allUsers.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in sendBoosterEncouragement:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});