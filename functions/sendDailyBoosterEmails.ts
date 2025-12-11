import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // מצא את כל המנויים הפעילים
    const activeSubscriptions = await base44.asServiceRole.entities.OnlineCoachingSubscription.filter(
      { status: 'active' }
    );

    console.log(`Found ${activeSubscriptions.length} active subscriptions`);

    const results = [];
    const now = new Date();

    for (const subscription of activeSubscriptions) {
      try {
        // בדוק אם כבר נשלח מייל היום - DISABLED FOR TESTING
        // if (subscription.last_email_sent_date) {
        //   const lastSent = new Date(subscription.last_email_sent_date);
        //   const hoursSinceLastEmail = (now - lastSent) / (1000 * 60 * 60);
        //   
        //   // אם נשלח מייל בפחות מ-20 שעות, דלג
        //   if (hoursSinceLastEmail < 20) {
        //     console.log(`Skipping ${subscription.user_email} - email sent recently`);
        //     continue;
        //   }
        // }

        const currentDay = subscription.current_day || 1;
        const track = subscription.recommended_booster_track;
        const language = subscription.language || 'he';

        // אם הגיע ליום 8 - סיים את המנוי והפנה לעמוד המשך
        if (currentDay > 7) {
          await base44.asServiceRole.entities.OnlineCoachingSubscription.update(
            subscription.id,
            { status: 'completed' }
          );
          
          // שלח מייל סיכום (יום 8 - הפניה ל-BoosterContinuation)
          const continuationUrl = `${req.headers.get('origin')}/boostercontinuation`;
          const subject = language === 'he' 
            ? '🎉 סיימת את 7 הימים! בואו נמשיך את המסע'
            : '🎉 You completed 7 days! Let\'s continue the journey';
          
          const body = language === 'he'
            ? `
              <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="color: white; font-size: 32px; margin: 0;">🎉 מזל טוב!</h1>
                  <p style="color: white; font-size: 18px; margin-top: 10px;">סיימת את 7 ימי הבוסטר</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">שלום ${subscription.user_name},</p>
                  
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    מעולה! סיימת את תוכנית הבוסטר ל-7 ימים. אנחנו רוצים לשמוע ממך ולהציע לך את המסלול הבא.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${continuationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 18px; font-weight: bold;">
                      לחץ כאן להמשך המסע 🚀
                    </a>
                  </div>
                  
                  <p style="font-size: 14px; color: #6b7280; text-align: center;">
                    נשמח לשמוע את המשוב שלך ולהראות לך מה מחכה לך בהמשך!
                  </p>
                </div>
              </div>
            `
            : `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="color: white; font-size: 32px; margin: 0;">🎉 Congratulations!</h1>
                  <p style="color: white; font-size: 18px; margin-top: 10px;">You completed the 7-day booster</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hello ${subscription.user_name},</p>
                  
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                    Great! You completed the 7-day booster program. We want to hear from you and offer you the next step.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${continuationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 18px; font-weight: bold;">
                      Click here to continue 🚀
                    </a>
                  </div>
                  
                  <p style="font-size: 14px; color: #6b7280; text-align: center;">
                    We'd love to hear your feedback and show you what's next!
                  </p>
                </div>
              </div>
            `;

          await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'V107 Booster',
            to: subscription.user_email,
            subject: subject,
            body: body
          });

          results.push({
            email: subscription.user_email,
            day: currentDay,
            status: 'completed_and_continuation_sent'
          });
          
          continue;
        }

        // מצא את תבנית המייל המתאימה
        const templates = await base44.asServiceRole.entities.EmailTemplate.filter({
          template_type: 'booster_email',
          booster_track: track,
          booster_day: currentDay,
          active: true
        });

        if (templates.length === 0) {
          console.log(`No template found for ${track} day ${currentDay}`);
          results.push({
            email: subscription.user_email,
            day: currentDay,
            track: track,
            status: 'no_template_found'
          });
          continue;
        }

        const template = templates[0];
        const subject = language === 'he' ? template.subject_he : template.subject_en;
        const content = language === 'he' ? template.content_he : template.content_en;

        // שלח את המייל
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'V107 Booster',
          to: subscription.user_email,
          subject: subject,
          body: content
        });

        // עדכן את המנוי
        await base44.asServiceRole.entities.OnlineCoachingSubscription.update(
          subscription.id,
          {
            current_day: currentDay + 1,
            last_email_sent_date: now.toISOString()
          }
        );

        // לוג המייל
        await base44.asServiceRole.entities.EmailLog.create({
          to_email: subscription.user_email,
          email_type: 'booster_email',
          subject: subject,
          related_user_email: subscription.user_email,
          language: language
        });

        results.push({
          email: subscription.user_email,
          day: currentDay,
          track: track,
          status: 'sent'
        });

        console.log(`Sent day ${currentDay} email to ${subscription.user_email} (${track})`);

      } catch (error) {
        console.error(`Error processing ${subscription.user_email}:`, error);
        results.push({
          email: subscription.user_email,
          status: 'error',
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      processed: activeSubscriptions.length,
      results: results,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Error in sendDailyBoosterEmails:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
});