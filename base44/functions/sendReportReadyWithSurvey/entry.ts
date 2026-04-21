import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const reportId = payload.event?.entity_id;
    const reportData = payload.data;

    if (!reportId || !reportData) {
      return Response.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    const userEmail = reportData.user_email;
    const userName = reportData.user_name;
    const language = reportData.language || 'he';

    if (!userEmail) {
      return Response.json({ success: false, error: 'No user email' }, { status: 400 });
    }

    // Avoid duplicate emails for this report
    const existing = await base44.asServiceRole.entities.EmailLog.filter({
      email_type: 'report_ready',
      related_report_id: reportId
    }, '', 1);

    if (existing.length > 0) {
      return Response.json({ success: true, message: 'Email already sent' });
    }

    const baseUrl = Deno.env.get('BASE44_APP_URL') || 'https://v107.co.il';
    const reportUrl = `${baseUrl}/ReportView?reportId=${reportId}`;
    const surveyUrl = `${baseUrl}/Survey?type=feedback&report_id=${reportId}`;

    const subject = language === 'he'
      ? `📊 ${userName}, הדוח שלך מוכן!`
      : `📊 ${userName}, Your V107 Report is Ready!`;

    const emailBody = language === 'he' ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; background: #f9fafb;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #f6d860; margin: 0; font-size: 28px; font-weight: bold;">📊 הדוח שלך מוכן!</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 8px; font-size: 15px;">V107 Professional Framework</p>
        </div>

        <!-- Body -->
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <p style="font-size: 17px; color: #374151; line-height: 1.7; margin-bottom: 8px;">${userName} שלום,</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.7; margin-bottom: 30px;">
            הדוח המקצועי שלך ב-V107 הופק ומחכה לך. לחץ/י על הכפתור כדי לצפות בו:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #1a202c 0%, #d69e2e 100%); color: white; padding: 16px 44px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
              צפה בדוח שלי ←
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;" />

          <!-- Survey Block -->
          <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid #f59e0b; border-radius: 14px; padding: 28px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 10px;">🎁</div>
            <h3 style="color: #92400e; font-size: 19px; margin: 0 0 12px 0; font-weight: bold;">דקה מזמנך שווה לנו הרבה</h3>
            <p style="color: #78350f; font-size: 15px; line-height: 1.7; margin-bottom: 12px;">
              מלא/י שאלון קצר של <strong>6 שאלות</strong> על הדוח שקיבלת<br/>
              ותקבל/י קוד קופון <strong style="font-size: 18px; letter-spacing: 2px;">MEKORAVIM</strong> — <strong>100% הנחה</strong> על החבילה המלאה!
            </p>
            <p style="font-size: 12px; color: #a16207; margin-bottom: 22px;">⏰ תקף עד 30.3.2026 | עד 250 ממלאים בלבד</p>
            <a href="${surveyUrl}" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 3px 6px rgba(0,0,0,0.15);">
              מלא שאלון קצר →
            </a>
          </div>

          <p style="font-size: 13px; color: #9ca3af; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            יש שאלות? <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a> | 055-2134848
          </p>
        </div>
      </div>
    ` : `
      <div dir="ltr" style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 20px; background: #f9fafb;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #f6d860; margin: 0; font-size: 28px; font-weight: bold;">📊 Your Report is Ready!</h1>
          <p style="color: rgba(255,255,255,0.8); margin-top: 8px; font-size: 15px;">V107 Professional Framework</p>
        </div>
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <p style="font-size: 17px; color: #374151; line-height: 1.7;">Hello ${userName},</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.7; margin-bottom: 30px;">Your V107 professional report is ready and waiting for you:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #1a202c 0%, #d69e2e 100%); color: white; padding: 16px 44px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px;">
              View My Report →
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;" />
          <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid #f59e0b; border-radius: 14px; padding: 28px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 10px;">🎁</div>
            <h3 style="color: #92400e; font-size: 19px; margin: 0 0 12px 0;">A minute of your time means a lot to us</h3>
            <p style="color: #78350f; font-size: 15px; line-height: 1.7; margin-bottom: 12px;">
              Fill a short <strong>6-question survey</strong> about your report<br/>
              and get coupon code <strong style="font-size: 18px; letter-spacing: 2px;">MEKORAVIM</strong> — <strong>100% discount</strong> on the full package!
            </p>
            <p style="font-size: 12px; color: #a16207; margin-bottom: 22px;">⏰ Valid until 30.3.2026 | First 250 only</p>
            <a href="${surveyUrl}" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Fill Short Survey →
            </a>
          </div>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Questions? <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a>
          </p>
        </div>
      </div>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'V107 Professional Framework',
      to: userEmail,
      subject,
      body: emailBody
    });

    await base44.asServiceRole.entities.EmailLog.create({
      to_email: userEmail,
      email_type: 'report_ready',
      subject,
      related_user_email: userEmail,
      related_report_id: reportId,
      language
    });

    return Response.json({ success: true, message: `Report ready email with survey sent to ${userEmail}` });

  } catch (error) {
    console.error('Error in sendReportReadyWithSurvey:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});