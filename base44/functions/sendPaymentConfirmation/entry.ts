import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const orderId = body?.event?.entity_id;
    const orderData = body?.data;
    const oldData = body?.old_data;

    if (!orderId) {
      console.log('No entity_id in automation payload, skipping.');
      return Response.json({ skipped: true, reason: 'no entity_id' });
    }

    // Only send email when status changes to "paid"
    if (orderData?.status !== 'paid' || oldData?.status === 'paid') {
      console.log('Status not changed to paid, skipping. Current:', orderData?.status, 'Previous:', oldData?.status);
      return Response.json({ skipped: true, reason: 'status not changed to paid' });
    }

    console.log('Sending payment confirmation for order:', orderId);

    const userEmail = orderData.user_email;
    const userName = orderData.user_name || userEmail;
    const amount = orderData.amount || 0;
    const productType = orderData.product_type;

    if (!userEmail) {
      console.log('No user email found, skipping.');
      return Response.json({ skipped: true, reason: 'no user email' });
    }

    // Check if we already sent a confirmation for this order
    try {
      const existingLogs = await base44.asServiceRole.entities.EmailLog.filter({
        related_report_id: orderId,
        email_type: 'full_report_purchase'
      }, '-created_date', 1);
      if (existingLogs.length > 0) {
        console.log('Payment confirmation already sent for order:', orderId);
        return Response.json({ skipped: true, reason: 'already sent' });
      }
    } catch (e) {
      console.log('Could not check email log:', e.message);
    }

    // Determine language based on order data or default to Hebrew
    const language = 'he';
    const appUrl = Deno.env.get('BASE44_APP_URL') || 'https://app.base44.com';

    const productNames = {
      full_report: language === 'he' ? 'דוח ונטורה-107 המלא' : 'Full Ventura-107 Report',
      answers_download: language === 'he' ? 'הורדת תשובות השאלון' : 'Questionnaire Answers Download',
      online_coaching_7days: language === 'he' ? 'ליווי מקוון – 7 ימים' : 'Online Coaching – 7 Days'
    };

    const productName = productNames[productType] || productType;

    // Find the report link if it's a full_report purchase
    let reportLink = '';
    if (productType === 'full_report' && orderData.questionnaire_response_id) {
      try {
        const reports = await base44.asServiceRole.entities.GeneratedReport.filter({
          questionnaire_response_id: orderData.questionnaire_response_id
        }, '-created_date', 1);
        if (reports.length > 0) {
          reportLink = `${appUrl}/ReportView?id=${reports[0].id}`;
        }
      } catch (e) {
        console.log('Could not find report:', e.message);
      }
    }

    const subject = language === 'he' 
      ? `✅ אישור תשלום – ${productName}` 
      : `✅ Payment Confirmation – ${productName}`;

    const emailBody = language === 'he' ? `
      <div dir="rtl" style="font-family: 'Assistant', 'Noto Sans Hebrew', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: #FF8F00; font-size: 28px; margin: 0;">107V</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0;">אישור תשלום</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
          <h2 style="color: #1a202c; margin-top: 0;">שלום ${userName},</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.8;">
            התשלום שלך בוצע בהצלחה! 🎉
          </p>
          
          <div style="background: #f7fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 14px;">מוצר:</td>
                <td style="padding: 8px 0; color: #1a202c; font-weight: bold; text-align: left;">${productName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 14px;">סכום:</td>
                <td style="padding: 8px 0; color: #1a202c; font-weight: bold; text-align: left;">${amount} ₪</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #718096; font-size: 14px;">מזהה הזמנה:</td>
                <td style="padding: 8px 0; color: #1a202c; font-weight: bold; text-align: left;">${orderId}</td>
              </tr>
            </table>
          </div>

          ${reportLink ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reportLink}" style="display: inline-block; background: #FF8F00; color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 16px;">
              צפה בדוח שלך →
            </a>
          </div>
          ` : `
          <p style="color: #4a5568; font-size: 14px; text-align: center;">
            הדוח שלך יהיה מוכן תוך 24 שעות. נשלח לך מייל נוסף כשיהיה מוכן.
          </p>
          `}
          
          <p style="color: #718096; font-size: 13px; margin-top: 30px; text-align: center;">
            שאלות? <a href="${appUrl}/Contact" style="color: #FF8F00;">צרו קשר</a>
          </p>
        </div>
        
        <div style="background: #f7fafc; padding: 15px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e2e8f0; border-top: none;">
          <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2026 V107. כל הזכויות שמורות.</p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Payment Confirmation</h1>
        <p>Hi ${userName},</p>
        <p>Your payment was successful!</p>
        <p>Product: ${productName}</p>
        <p>Amount: ${amount} ₪</p>
        <p>Order ID: ${orderId}</p>
        ${reportLink ? `<p><a href="${reportLink}">View your report</a></p>` : ''}
      </div>
    `;

    // Send email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: userEmail,
      subject,
      body: emailBody,
      from_name: 'V107'
    });

    console.log('Payment confirmation email sent to:', userEmail);

    // Log the email
    await base44.asServiceRole.entities.EmailLog.create({
      to_email: userEmail,
      email_type: 'full_report_purchase',
      subject,
      related_user_email: userEmail,
      related_report_id: orderId,
      language
    });

    return Response.json({ success: true, email_sent_to: userEmail });

  } catch (error) {
    console.error('sendPaymentConfirmation error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});