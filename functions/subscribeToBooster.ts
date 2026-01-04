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

        // מצא את הדוח ותגובת השאלון למידע נוסף
        let reportData = null;
        let questionnaireResponse = null;
        
        if (userReports.length > 0) {
            reportData = userReports[0];
            
            if (reportData.questionnaire_response_id) {
                const qResponses = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
                    id: reportData.questionnaire_response_id
                });
                if (qResponses.length > 0) {
                    questionnaireResponse = qResponses[0];
                }
            }
        }

        const subscription = await base44.asServiceRole.entities.OnlineCoachingSubscription.create({
            user_email: user.email,
            user_name: user.full_name,
            questionnaire_response_id: reportData?.questionnaire_response_id || null,
            generated_report_id: reportData?.id || null,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            current_day: 1,
            status: 'active',
            language: language,
            recommended_booster_track: trackToUse
        });

        console.log(`Created subscription ${subscription.id} for ${user.email}`);

        // צור את 30 המשימות מיד
        try {
            await base44.asServiceRole.functions.invoke('generateTasksForSubscription', {
                subscriptionId: subscription.id
            });
            console.log(`Generated 30 tasks for subscription ${subscription.id}`);
        } catch (genError) {
            console.error('Error generating tasks:', genError);
            // לא נעצור את התהליך - המשימות יווצרו בשליחה הראשונה
        }

        // שלח את המייל הראשון מיד
        const tasks = await base44.asServiceRole.entities.BoosterTask.filter({
            subscription_id: subscription.id,
            day: 1
        });

        if (tasks.length > 0) {
            const task = tasks[0];
            
            const trackColors = {
                execution: '#3B82F6',
                digital: '#8B5CF6',
                finance: '#10B981',
                marketing: '#F59E0B',
                management: '#6366F1',
                vision: '#EC4899'
            };
            
            const color = trackColors[trackToUse] || '#667eea';
            
            const emailBody = language === 'he' ? `
              <div dir="rtl" style="font-family: 'Assistant', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #1a202c 0%, ${color} 100%); padding: 35px 30px; text-align: right; border-radius: 16px 16px 0 0;">
                  <h1 style="color: white; font-size: 26px; margin: 0; font-weight: bold;">V107 BOOSTER</h1>
                  <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 8px;">יום 1 מתוך 30 | שלב הפריצה (Quick Wins)</p>
                </div>
                
                <div style="background: white; padding: 35px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: right;">
                  <p style="font-size: 17px; color: #374151; margin-bottom: 25px;">שלום ${user.full_name},</p>
                  
                  <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-right: 5px solid ${color}; padding: 22px; margin-bottom: 28px; border-radius: 10px;">
                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 8px 0; font-weight: bold; line-height: 1.3;">${task.task_title}</h2>
                  </div>
                  
                  <div style="margin-bottom: 28px; padding: 20px; background: #f8fafc; border-radius: 10px;">
                    <h3 style="color: ${color}; font-size: 17px; margin: 0 0 12px 0; font-weight: bold;">🎯 הערך האסטרטגי</h3>
                    <p style="font-size: 15px; color: #374151; line-height: 1.8; margin: 0;">${task.the_why}</p>
                  </div>
                  
                  <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 28px; border-right: 4px solid ${color};">
                    <h3 style="color: #1e3a8a; font-size: 17px; margin: 0 0 15px 0; font-weight: bold;">⚡ הפרוטוקול שלך היום</h3>
                    <div style="font-size: 15px; color: #1F2937; line-height: 1.9;">${task.the_task}</div>
                  </div>
                  
                  ${task.closing_encouragement ? `
                  <div style="background: #f0fdf4; border-right: 3px solid #10b981; padding: 18px; border-radius: 8px; margin-bottom: 25px;">
                    <p style="font-size: 15px; color: #065f46; line-height: 1.7; margin: 0; font-weight: 500;">${task.closing_encouragement}</p>
                  </div>
                  ` : ''}
                  
                  <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 25px; border: 1px dashed #d97706;">
                    <p style="font-size: 11px; color: #92400e; line-height: 1.6; margin: 0; text-align: right;">
                      <strong>הצהרה משפטית:</strong> דו"ח זה והנחיות תוכנית ה-BOOSTER מהווים כלי ליווי אסטרטגי ותמיכה בקבלת החלטות. המידע המוצג והמשימות המוצעות נועדו לשיפור מיומנויות מקצועיות ואישיות ואינם מהווים תחליף לייעוץ משפטי, פיננסי או פסיכולוגי פרטני. האחריות על יישום המשימות והשלכותיהן מוטלת על המשתמש/ת בלבד, בהתאם לשיקול דעתם המקצועי.
                    </p>
                  </div>
                  
                  <div style="text-align: center; padding: 20px 0; margin-top: 25px;">
                    <p style="font-size: 13px; color: #6B7280; margin: 0;">
                      🎁 התוכנית חינמית לחלוטין ל-7 הימים הראשונים
                    </p>
                    <p style="font-size: 11px; color: #9CA3AF; margin-top: 8px;">
                      V107 Professional Framework | המסגרת המקצועית המובילה
                    </p>
                  </div>
                </div>
              </div>
            ` : `English version placeholder`;

            // שלח מייל
            await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: 'V107 Booster',
                to: user.email,
                subject: task.subject,
                body: emailBody
            });

            // סמן את המשימה כנשלחה
            await base44.asServiceRole.entities.BoosterTask.update(task.id, {
                status: 'sent',
                sent_date: new Date().toISOString()
            });

            // עדכן את המנוי
            await base44.asServiceRole.entities.OnlineCoachingSubscription.update(subscription.id, {
                last_email_sent_date: new Date().toISOString()
            });

            console.log(`Sent first booster email to ${user.email}`);
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