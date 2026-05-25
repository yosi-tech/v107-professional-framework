import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // שלב 1: מצא את כל השאלונים שהושלמו
    const allCompleted = await base44.asServiceRole.entities.QuestionnaireResponse.filter(
      { status: 'completed' },
      '-updated_date',
      100
    );

    // שלב 2: מצא את כל התשלומים המוצלחים
    const allPaid = await base44.asServiceRole.entities.PaymentOrder.filter(
      { status: 'paid' },
      '',
      200
    );

    const paidEmails = new Set(allPaid.map(p => p.user_email?.toLowerCase()));

    // שלב 3: סנן רק את מי שלא שילם
    const unpaidResponses = allCompleted.filter(r => {
      const email = (r.personal_info?.email || r.created_by || '').toLowerCase();
      if (!email || email.includes('anonymized@') || email.includes('@deleted.') || !email.includes('@')) return false;
      return !paidEmails.has(email);
    });

    // שלב 4: צור קופון אחד משותף לכולם - 49 ש"ח (הנחה של 50 ש"ח מ-99)
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 24);
    const couponCode = 'FLASH49';

    // בדוק אם הקופון כבר קיים
    const existingCoupons = await base44.asServiceRole.entities.Coupon.filter(
      { code: couponCode },
      '',
      1
    );

    if (existingCoupons.length === 0) {
      await base44.asServiceRole.entities.Coupon.create({
        code: couponCode,
        discount_amount: 50,
        valid_until: validUntil.toISOString(),
        is_single_use: false,
        is_user_specific: false,
        source: 'promotion'
      });
    } else {
      // עדכן את התוקף
      await base44.asServiceRole.entities.Coupon.update(existingCoupons[0].id, {
        valid_until: validUntil.toISOString(),
        discount_amount: 50,
        used: false
      });
    }

    let emailsSent = 0;
    const sentTo = [];
    const errors = [];
    const baseUrl = Deno.env.get('BASE44_APP_URL') || 'https://v107.base44.app';

    for (const response of unpaidResponses) {
      try {
        const userEmail = response.personal_info?.email || response.created_by;
        const userName = response.personal_info?.full_name || userEmail.split('@')[0];
        const purchaseUrl = `${baseUrl}/Completion?responseId=${response.id}&coupon=${couponCode}`;

        const subject = '⚡ הצעה מיוחדת ל-24 שעות בלבד: הדו"ח המלא שלך ב-49 ₪ בלבד!';

        const emailBody = `
          <div dir="rtl" style="font-family: 'Assistant', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <p style="color: #FF8F00; font-size: 14px; font-weight: bold; margin: 0 0 8px 0; letter-spacing: 2px;">⚡ הצעה מוגבלת בזמן ⚡</p>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">הדו"ח המלא שלך</h1>
              <h2 style="color: #FF8F00; margin: 10px 0 0 0; font-size: 42px; font-weight: 900;">49 ₪ בלבד!</h2>
              <p style="color: #a0aec0; margin-top: 10px; font-size: 14px;">במקום 99 ₪ | תקף ל-24 שעות בלבד</p>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 17px; color: #1a202c; line-height: 1.8; margin-bottom: 20px;">
                שלום ${userName},
              </p>
              
              <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin-bottom: 20px;">
                השקעת זמן ומחשבה במילוי שאלון V107 המקצועי — וזה אומר שאתה/את ברצינות לגבי הצמיחה המקצועית שלך. 💪
              </p>
              
              <p style="font-size: 16px; color: #4a5568; line-height: 1.8; margin-bottom: 20px;">
                התוצאות שלך מוכנות ומחכות לך. כדי לעזור לך לקבל את הדו"ח המלא עם כל התובנות, ניתוח 11 הממדים המקצועיים ותוכנית הפעולה האישית — החלטנו להציע לך <strong>הנחה חד-פעמית ומיוחדת</strong>.
              </p>

              <div style="background: linear-gradient(135deg, #FF8F00 0%, #F57C00 100%); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
                <p style="color: white; font-size: 16px; margin: 0 0 5px 0;">מחיר מיוחד לך:</p>
                <p style="color: white; font-size: 48px; font-weight: 900; margin: 0;">49 ₪</p>
                <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin: 5px 0 15px 0; text-decoration: line-through;">במקום 99 ₪</p>
                <p style="color: white; font-size: 13px; margin: 0; background: rgba(0,0,0,0.2); display: inline-block; padding: 5px 15px; border-radius: 20px;">
                  ⏰ ההצעה תקפה ל-24 שעות בלבד
                </p>
              </div>

              <p style="font-size: 15px; color: #4a5568; line-height: 1.7; margin-bottom: 15px;">
                <strong>מה כולל הדו"ח המלא?</strong>
              </p>
              <ul style="font-size: 15px; color: #4a5568; line-height: 2; padding-right: 20px; margin-bottom: 25px;">
                <li>ניתוח מעמיק של 11 ממדים מקצועיים</li>
                <li>זיהוי חוזקות ואזורי שיפור</li>
                <li>ארכיטיפ מקצועי אישי</li>
                <li>תוכנית פעולה מפורטת וממוקדת</li>
                <li>המלצות מותאמות אישית לקריירה שלך</li>
              </ul>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${purchaseUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF8F00 0%, #F57C00 100%); color: white; padding: 18px 50px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 20px; box-shadow: 0 4px 15px rgba(255, 143, 0, 0.4);">
                  לרכישת הדוח ב-49 ₪ ←
                </a>
              </div>

              <p style="font-size: 13px; color: #718096; text-align: center; margin-top: 10px;">
                השתמש/י בקוד קופון: <strong style="color: #FF8F00;">${couponCode}</strong> אם מתבקש/ת
              </p>
              
              <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                שאלות? אנחנו כאן — <a href="mailto:support@v107.co.il" style="color: #FF8F00;">support@v107.co.il</a>
              </p>
            </div>
          </div>
        `;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: userEmail,
          subject: subject,
          body: emailBody,
          from_name: 'V107 - מסע מקצועי'
        });

        await base44.asServiceRole.entities.EmailLog.create({
          to_email: userEmail,
          email_type: 'abandonment_survey',
          subject: subject,
          related_user_email: userEmail,
          related_questionnaire_response_id: response.id,
          language: 'he'
        });

        emailsSent++;
        sentTo.push({ name: userName, email: userEmail });
      } catch (error) {
        console.error(`Error sending to ${response.personal_info?.email}:`, error);
        errors.push({ email: response.personal_info?.email, error: error.message });
      }
    }

    return Response.json({
      success: true,
      totalCompleted: allCompleted.length,
      totalPaid: allPaid.length,
      unpaidFound: unpaidResponses.length,
      emailsSent,
      sentTo,
      couponCode,
      couponValidUntil: validUntil.toISOString(),
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in sendFlashSale49:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});