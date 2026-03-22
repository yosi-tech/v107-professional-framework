import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - (96 * 60 * 60 * 1000)); // 96 שעות אחורה

    // מצא דוחות שנוצרו לפני יותר מ-96 שעות — סינון ישיר בשאילתה
    const eligibleReports = await base44.asServiceRole.entities.GeneratedReport.filter({
      purchased: true,
      created_date: { $lte: cutoffTime.toISOString() }
    }, '-created_date');

    let emailsSent = 0;
    const errors = [];

    for (const report of eligibleReports) {
      try {
        const userEmail = report.user_email;
        if (!userEmail) continue;
        if (userEmail.includes('anonymized@') || userEmail.includes('@deleted.') || !userEmail.includes('@')) continue;

        // בדיקה אם כבר נשלח מייל מסוג זה
        const existingEmail = await base44.asServiceRole.entities.EmailLog.filter({
          email_type: 'booster_encouragement',
          related_user_email: userEmail
        }, '', 1);

        if (existingEmail && existingEmail.length > 0) continue;

        // בדיקה אם יש מנוי בוסטר פעיל
        const boosterSubscription = await base44.asServiceRole.entities.OnlineCoachingSubscription.filter({
          user_email: userEmail
        }, '', 1);

        if (boosterSubscription && boosterSubscription.length > 0) continue;

        const language = report.language || 'he';
        const userName = report.user_name || userEmail.split('@')[0];
        const boosterUrl = `${Deno.env.get('BASE44_APP_URL') || 'https://v107.co.il'}/BoosterRegistration?reportId=${report.id}`;
        const recommendedTrack = report.recommended_booster_track || 'execution';

        const trackNames = {
          he: { resilience: 'חוסן', flexibility: 'גמישות', leadership: 'מנהיגות', communication: 'תקשורת', planning: 'תכנון', learning: 'למידה', vision: 'חזון', technology: 'טכנולוגיה', networking: 'רשת קשרים', balance: 'איזון', change: 'שינוי' },
          en: { resilience: 'Resilience', flexibility: 'Flexibility', leadership: 'Leadership', communication: 'Communication', planning: 'Planning', learning: 'Learning', vision: 'Vision', technology: 'Technology', networking: 'Networking', balance: 'Balance', change: 'Change' }
        };

        const trackName = trackNames[language][recommendedTrack] || recommendedTrack;

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
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">קראת את הדו"ח שלך. קיבלת תובנות. אבל האם <strong>פעלת</strong> לפיהן?</p>
              <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin: 25px 0;">
                <h3 style="color: #4C1D95; font-size: 20px; margin: 0 0 15px 0;">🎯 V107 BOOSTER - ${trackName}</h3>
                <ul style="color: #5B21B6; font-size: 14px; line-height: 1.8; margin-top: 15px; text-align: right;">
                  <li>משימה יומית קצרה (10-15 דקות)</li>
                  <li>התאמה אישית מלאה לפרופיל שלך</li>
                  <li>7 ימים ראשונים <strong>חינם לחלוטין</strong></li>
                </ul>
              </div>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${boosterUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px;">
                  התחל V107 BOOSTER עכשיו (חינם) 🎁
                </a>
              </div>
              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                יש שאלות? <a href="mailto:support@v107.co.il" style="color: #8B5CF6;">support@v107.co.il</a>
              </p>
            </div>
          </div>
        ` : `
          <div dir="ltr" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">From Knowledge to Action 🚀</h1>
            </div>
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px;">
              <p style="font-size: 18px; color: #1f2937;">Hello ${userName},</p>
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">You read your report. You gained insights. But have you <strong>acted</strong> on them?</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${boosterUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px;">
                  Start V107 BOOSTER Now (Free) 🎁
                </a>
              </div>
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
          email_type: 'booster_encouragement',
          subject: subject,
          related_user_email: userEmail,
          related_report_id: report.id,
          language: language
        });

        emailsSent++;

      } catch (error) {
        console.error(`Error processing ${report.user_email}:`, error);
        errors.push({ email: report.user_email, error: error.message });
      }
    }

    return Response.json({
      success: true,
      message: `Booster encouragement emails sent successfully`,
      emailsSent,
      totalChecked: eligibleReports.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in sendBoosterEncouragement:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});