import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { getFullReportPurchaseEmailTemplate } from '../components/email/FullReportPurchaseTemplate.js';

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Parse Tranzila form-data
    const formData = await req.formData();
    const notify = {};
    for (const [key, value] of formData.entries()) {
      notify[key] = value;
    }

    console.log('Received Tranzila notification:', notify);

    // Extract fields from notification
    const responseCode = notify["Response"]; // "000" or "0" = success
    const amount = parseFloat(notify["sum"] || 0);
    const isSuccess = responseCode === "000" || responseCode === "0";

    // Initialize Base44 client with service role
    const base44 = createClientFromRequest(req);

    // Match by amount + pending status + recent timestamp (last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const orders = await base44.asServiceRole.entities.PaymentOrder.filter({
      status: 'pending',
      amount: Math.round(amount)
    }, '-created_date', 10);

    // Filter by timestamp manually (created in last 30 minutes)
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.created_date);
      return orderDate >= new Date(thirtyMinutesAgo);
    });

    if (recentOrders.length === 0) {
      console.log('No matching pending order found for amount:', amount);
      return new Response("OK", { status: 200 });
    }

    const order = recentOrders[0];
    console.log('Matched order:', order.id);

    // Update order status
    const updateData = {
      status: isSuccess ? "paid" : "failed",
      tranzila_reference: notify["TranzilaTK"] || null,
      confirmation_code: notify["ConfirmationCode"] || null,
      raw_data: JSON.stringify(notify)
    };

    await base44.asServiceRole.entities.PaymentOrder.update(order.id, updateData);
    console.log('Order status updated to:', updateData.status);

    // If payment successful, update user and related entities
    if (isSuccess) {
      // Update user data
      const userUpdateData = {
        purchase_date: new Date().toISOString(),
        payment_amount: order.amount
      };

      if (order.product_type === 'full_report') {
        userUpdateData.has_purchased_full_report = true;
        userUpdateData.express_delivery = order.is_express;
      } else if (order.product_type === 'answers_download') {
        userUpdateData.has_purchased_answers_download = true;
      } else if (order.product_type === 'online_coaching_7days') {
        userUpdateData.has_purchased_online_coaching = true;
      }

      // Find user by email and update
      const users = await base44.asServiceRole.entities.User.filter({ email: order.user_email });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, userUpdateData);
        console.log('User data updated for:', order.user_email);
      }

      // Update GeneratedReport if exists
      if (order.questionnaire_response_id && order.questionnaire_response_id !== 'null' && order.product_type === 'full_report') {
        try {
          await base44.asServiceRole.entities.GeneratedReport.update(order.questionnaire_response_id, { 
            purchased: true 
          });
          console.log('GeneratedReport marked as purchased');
        } catch (error) {
          console.log('Could not update GeneratedReport (might not exist yet):', error.message);
        }
      }

      // Mark coupon as used
      if (order.coupon_id) {
        try {
          await base44.asServiceRole.entities.Coupon.update(order.coupon_id, { used: true });
          console.log('Coupon marked as used');
        } catch (error) {
          console.log('Could not mark coupon as used:', error.message);
        }
      }

      // Send confirmation email
      try {
        const transactionId = notify["TranzilaTK"] || `TXN-${Date.now()}`;
        const date = new Date().toLocaleDateString('he-IL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        if (order.product_type === 'full_report') {
          // Check if user completed questionnaire
          const responses = await base44.asServiceRole.entities.QuestionnaireResponse.filter(
            { created_by: order.user_email },
            '-created_date',
            1
          );
          const hasCompletedQuestionnaire = responses.length > 0 && responses[0].status === 'completed';
          
          const questionnaireUrl = `https://${req.headers.get('host')}/page/Questionnaire`;
          
          const emailTemplate = getFullReportPurchaseEmailTemplate(
            order.user_name,
            transactionId,
            date,
            hasCompletedQuestionnaire,
            questionnaireUrl,
            order.is_express,
            'he' // Default to Hebrew
          );

          await base44.asServiceRole.integrations.Core.SendEmail({
            to: order.user_email,
            subject: emailTemplate.subject,
            body: emailTemplate.html
          });
          
          console.log('Confirmation email sent to:', order.user_email);
        }
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }

    // Always return OK to Tranzila
    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Tranzila Notify Error:", error);
    // Still return OK to prevent Tranzila from retrying
    return new Response("OK", { status: 200 });
  }
});