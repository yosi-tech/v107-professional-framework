import { createClientFromRequest } from '@base44/sdk';

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

        if (userReports.length === 0) {
            return Response.json({ 
                success: false, 
                message: language === 'he' 
                    ? 'לא נמצא דוח עבורך. יש להשלים את השאלון תחילה.'
                    : 'No report found for you. Please complete the questionnaire first.' 
            }, { status: 400 });
        }

        const report = userReports[0];

        // אם יש דוח עם המלצה, השתמש בה; אחרת השתמש במה שנשלח בבקשה
        let trackToUse = report.recommended_booster_track || recommended_booster_track;

        if (!trackToUse) {
            return Response.json({ 
                success: false, 
                message: 'Missing required field: recommended_booster_track' 
            }, { status: 400 });
        }

        // Create new subscription
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        const subscription = await base44.asServiceRole.entities.OnlineCoachingSubscription.create({
            user_email: user.email,
            user_name: user.full_name,
            questionnaire_response_id: report.questionnaire_response_id,
            generated_report_id: report.id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            current_day: 1,
            last_email_sent_date: null,
            status: 'active',
            language: language,
            recommended_booster_track: trackToUse
        });

        // שלח מייל ברוכים הבאים
        try {
            const trackNames = {
                resilience: language === 'he' ? 'חוסן' : 'Resilience',
                flexibility: language === 'he' ? 'גמישות' : 'Flexibility',
                leadership: language === 'he' ? 'מנהיגות' : 'Leadership',
                communication: language === 'he' ? 'תקשורת' : 'Communication',
                planning: language === 'he' ? 'תכנון' : 'Planning',
                learning: language === 'he' ? 'למידה' : 'Learning',
                vision: language === 'he' ? 'חזון' : 'Vision',
                technology: language === 'he' ? 'טכנולוגיה' : 'Technology',
                networking: language === 'he' ? 'נטוורקינג' : 'Networking',
                balance: language === 'he' ? 'איזון' : 'Balance',
                change: language === 'he' ? 'שינוי' : 'Change'
            };

            const trackName = trackNames[trackToUse] || trackToUse;
            
            const welcomeEmailResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
                prompt: `צור מייל HTML מעוצב ויפה לברוכים הבאים ל-${user.full_name} שנרשם לתוכנית V107 BOOSTER.

התוכנית: 30 ימים של משימות יומיות מותאמות אישית לשיפור ${trackName}.

דרישות עיצוב:
- HTML מלא עם inline CSS (כל הסטיילים בתוך style attributes)
- רקע לבן נקי עם גבולות מעוגלים
- צבעים מקצועיים: כחול כהה (#1a365d), זהב (#d4af37)
- כותרת גדולה ומרשימה עם אייקון 🎯
- פסקאות קצרות וברורות
- עיצוב responsive למובייל
- ${language === 'he' ? 'dir="rtl" ומיושר לימין' : 'left-to-right layout'}

תוכן המייל:
1. כותרת חגיגית "ברוכים הבאים ל-V107 BOOSTER!"
2. פיסקת פתיחה מעודדת ואישית
3. הסבר קצר על התוכנית (30 ימים, משימות יומיות, מתמקד ב-${trackName})
4. מה יקרה מחר (מייל ראשון עם המשימה)
5. עידוד אישי לסיום
6. חתימה: "בהצלחה, צוות V107"

השפה: ${language === 'he' ? 'עברית' : 'אנגלית'}

החזר JSON עם subject ו-html מעוצבים לחלוטין.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        subject: { type: "string" },
                        html: { type: "string" }
                    }
                }
            });

            await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: 'V107 Booster',
                to: user.email,
                subject: welcomeEmailResponse.subject,
                body: welcomeEmailResponse.html
            });

            // Log the email
            await base44.asServiceRole.entities.EmailLog.create({
                to_email: user.email,
                email_type: 'booster_email',
                subject: welcomeEmailResponse.subject,
                related_user_email: user.email,
                language: language
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
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