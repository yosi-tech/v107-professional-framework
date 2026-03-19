import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const targetEmail = body.email || 'roeialb@gmail.com';
    
    // מציאת השאלון האחרון של המשתמש (לא משנה מתי הושלם)
    const responses = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
      'personal_info.email': targetEmail
    }, '-updated_date', 1);
    
    // אם לא נמצא, נשתמש בנתוני דמה
    const response = (responses && responses.length > 0) ? responses[0] : {
      id: 'test-response-id',
      language: 'he',
      personal_info: { full_name: 'רועי (בדיקה)', email: targetEmail }
    };
    
    const userEmail = targetEmail;
    
    // יצירת קוד קופון
    const couponCode = `TEST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    
    await base44.asServiceRole.entities.Coupon.create({
      code: couponCode,
      discount_amount: 100,
      valid_until: validUntil.toISOString(),
      user_email: userEmail,
      source: 'test_email'
    });
    
    const language = response.language || 'he';
    const userName = response.personal_info?.full_name || 'בודק מערכת';
    const purchaseUrl = `${Deno.env.get('BASE44_APP_URL') || 'https://v107.base44.app'}/Completion?responseId=${response.id}&discount=10`;
    
    const subject = language === 'he'
      ? '🎁 מתנה מיוחדת להמשך המסע המקצועי שלך ב-V107'
      : '🎁 A Special Gift for Your Professional Journey at V107';
    
    const emailBody = language === 'he' ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: #1e3a8a; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">ממשיכים במסע המקצועי שלך!</h1>
          <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">${userName}, בוא/י נגשים את הפוטנציאל שלך</p>
        </div>
        
        <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            שלום ${userName},<br><br>
            ב-V107, אנו פועלים מתוך חזון ושליחות לסייע לכמה שיותר אנשים ליצור את המקצוע שלהם ולדייק את הייעוד שלהם בחיים.
          </p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            אנו רוצים להוקיר אותך על ההשקעה במילוי השאלון ולעודד אותך להמשיך בתהליך האישי המשמעותי הזה. לכן, החלטנו להעניק לך הטבה מיוחדת לרכישת הדוח המלא.
          </p>
          
          <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
            <p style="color: white; font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">הנחה של 100 ₪!</p>
            <p style="color: #451a03; font-size: 16px; margin: 0;">קוד קופון: <strong style="font-size: 20px; background: white; padding: 5px 15px; border-radius: 6px; display: inline-block; margin-top: 10px;">${couponCode}</strong></p>
            <p style="color: white; font-size: 12px; margin-top: 10px;">תקף ל-30 יום</p>
          </div>
          
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
            הדו"ח המלא יספק לך את הכלים, התובנות ותוכנית הפעולה הדרושים לך כדי לפרוץ דרך.
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${purchaseUrl}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(30, 58, 138, 0.3);">
              למימוש ההטבה ורכישת הדוח 🎁
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            אנחנו כאן לכל שאלה, <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a>
          </p>
        </div>
      </div>
    ` : `
      <div dir="ltr" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: #1e3a8a; padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Continuing Your Professional Journey</h1>
          <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">${userName}, Let's realize your potential</p>
        </div>
        
        <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Hello ${userName},<br><br>
            At V107, we operate from a vision and mission to help as many people as possible create their profession and refine their destiny in life.
          </p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            We want to appreciate your investment in completing the questionnaire and encourage you to continue this significant personal process. Therefore, we decided to grant you a special benefit for purchasing the full report.
          </p>
          
          <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);">
            <p style="color: white; font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">100 ₪ Discount!</p>
            <p style="color: #451a03; font-size: 16px; margin: 0;">Coupon code: <strong style="font-size: 20px; background: white; padding: 5px 15px; border-radius: 6px; display: inline-block; margin-top: 10px;">${couponCode}</strong></p>
            <p style="color: white; font-size: 12px; margin-top: 10px;">Valid for 30 days</p>
          </div>
          
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
            The full report will provide you with the tools, insights, and action plan needed to break through.
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${purchaseUrl}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(30, 58, 138, 0.3);">
              Redeem Offer & Purchase Report 🎁
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            We are here for any question, <a href="mailto:support@v107.co.il" style="color: #3b82f6;">support@v107.co.il</a>
          </p>
        </div>
      </div>
    `;
    
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: userEmail,
      subject: subject,
      body: emailBody
    });
    
    return Response.json({ success: true, message: `Test email sent to ${userEmail}` });
    
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});