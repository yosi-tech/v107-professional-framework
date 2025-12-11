import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Get all active subscriptions
  const activeSubscriptions = await base44.asServiceRole.entities.OnlineCoachingSubscription.filter({
    status: 'active'
  });

  const results = [];
  const now = new Date();

  for (const subscription of activeSubscriptions) {
    try {
      const lastEmailDate = new Date(subscription.last_email_sent_date);
      const hoursSinceLastEmail = (now - lastEmailDate) / (1000 * 60 * 60);

      // בדוק אם עברו 24 שעות מאז המייל האחרון
      if (hoursSinceLastEmail < 24) {
        continue;
      }

      const nextDay = subscription.current_day + 1;

      // אם עבר יום 7, סמן את המנוי כ-completed
      if (nextDay > 7) {
        await base44.asServiceRole.entities.OnlineCoachingSubscription.update(subscription.id, {
          status: 'completed'
        });
        results.push({
          user_email: subscription.user_email,
          status: 'completed',
          message: 'Subscription completed'
        });
        continue;
      }

      // מצא את תבנית המייל המתאימה
      const templates = await base44.asServiceRole.entities.EmailTemplate.filter({
        template_type: 'booster_email',
        booster_track: subscription.recommended_booster_track,
        booster_day: nextDay,
        active: true
      });

      if (templates.length === 0) {
        results.push({
          user_email: subscription.user_email,
          status: 'error',
          message: `No template found for day ${nextDay}, track ${subscription.recommended_booster_track}`
        });
        continue;
      }

      const template = templates[0];
      const language = subscription.language || 'he';
      const emailSubject = language === 'he' ? template.subject_he : template.subject_en;
      let emailContent = language === 'he' ? template.content_he : template.content_en;

      // Replace variables
      const feedbackUrl = nextDay === 7 
        ? `${Deno.env.get('APP_URL') || 'https://your-app.com'}/booster-feedback?subscriptionId=${subscription.id}`
        : '';

      emailContent = emailContent
        .replace(/{userName}/g, subscription.user_name)
        .replace(/{feedbackUrl}/g, feedbackUrl)
        .replace(/{dayNumber}/g, nextDay.toString());

      // שלח מייל
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: subscription.user_email,
        subject: emailSubject,
        body: emailContent
      });

      // עדכן את המנוי
      await base44.asServiceRole.entities.OnlineCoachingSubscription.update(subscription.id, {
        current_day: nextDay,
        last_email_sent_date: now.toISOString()
      });

      // תעד את המייל
      await base44.asServiceRole.entities.EmailLog.create({
        to_email: subscription.user_email,
        email_type: 'booster_email',
        subject: emailSubject,
        related_user_email: subscription.user_email,
        sent_manually: false,
        language: language
      });

      results.push({
        user_email: subscription.user_email,
        status: 'success',
        day: nextDay,
        message: `Email ${nextDay} sent successfully`
      });

    } catch (error) {
      results.push({
        user_email: subscription.user_email,
        status: 'error',
        message: error.message
      });
    }
  }

  return Response.json({
    success: true,
    processed: activeSubscriptions.length,
    results: results
  });
});