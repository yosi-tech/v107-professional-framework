import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Verify user is authenticated
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ 
                success: false, 
                message: 'Unauthorized' 
            }, { status: 401 });
        }

        const body = await req.json();
        const { recommended_booster_track, language = 'he' } = body;

        // Check if user already has an active subscription
        const existingSubscriptions = await base44.entities.OnlineCoachingSubscription.filter({
            user_email: user.email,
            status: 'active'
        });

        if (existingSubscriptions.length > 0) {
            return Response.json({ 
                success: false, 
                message: language === 'he' 
                    ? 'כבר קיים מנוי פעיל עבורך'
                    : 'You already have an active subscription'
            }, { status: 400 });
        }

        // מצא את הדוח האחרון של המשתמש כדי לקבל את ה-recommended_booster_track
        const userReports = await base44.asServiceRole.entities.GeneratedReport.filter(
            { user_email: user.email },
            '-created_date',
            1
        );

        // אם יש דוח עם המלצה, השתמש בה; אחרת השתמש במה שנשלח בבקשה
        let trackToUse = recommended_booster_track;
        if (userReports.length > 0 && userReports[0].recommended_booster_track) {
            trackToUse = userReports[0].recommended_booster_track;
        }

        if (!trackToUse) {
            return Response.json({ 
                success: false, 
                message: 'Missing required field: recommended_booster_track' 
            }, { status: 400 });
        }

        // Create new subscription
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);

        const subscription = await base44.asServiceRole.entities.OnlineCoachingSubscription.create({
            user_email: user.email,
            user_name: user.full_name,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            current_day: 1,
            last_email_sent_date: startDate.toISOString(),
            status: 'active',
            language: language,
            recommended_booster_track: trackToUse
        });

        // Get the email template for day 1
        const emailTemplates = await base44.asServiceRole.entities.EmailTemplate.filter({
            template_type: 'booster_email',
            booster_track: recommended_booster_track,
            booster_day: 1,
            active: true
        });

        if (emailTemplates.length > 0) {
            const template = emailTemplates[0];
            const subject = language === 'he' ? template.subject_he : template.subject_en;
            const content = language === 'he' ? template.content_he : template.content_en;

            // Send the first email
            await base44.asServiceRole.integrations.Core.SendEmail({
                to: user.email,
                subject: subject,
                body: content
            });

            // Log the email
            await base44.asServiceRole.entities.EmailLog.create({
                to_email: user.email,
                email_type: 'booster_email',
                subject: subject,
                related_user_email: user.email,
                language: language
            });
        }

        return Response.json({
            success: true,
            message: language === 'he' 
                ? 'ההרשמה בוצעה בהצלחה! המייל הראשון נשלח אליך'
                : 'Registration successful! First email sent to you',
            subscription_id: subscription.id
        });

    } catch (error) {
        console.error('Subscribe to booster error:', error);
        return Response.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
});