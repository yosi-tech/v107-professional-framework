import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    
    // Parse Tranzila form-data (application/x-www-form-urlencoded)
    const formData = await req.formData();
    const notify = {};
    for (const [key, value] of formData.entries()) {
      notify[key] = value;
    }

    console.log('Received Tranzila notification:', notify);

    // Extract fields from notification
    const responseCode = notify["Response"]; // "000" or "0" = success
    const amount = parseFloat(notify["sum"] || 0);
    const roundedAmount = Math.round(amount);
    const isSuccess = responseCode === "000" || responseCode === "0";

    console.log('Payment result:', { responseCode, amount: roundedAmount, isSuccess });

    // Match by amount + pending status + recent timestamp (last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const orders = await base44.asServiceRole.entities.PaymentOrder.filter({
      status: 'pending',
      amount: roundedAmount
    }, '-created_date', 10);

    // Filter by timestamp manually (created in last 30 minutes)
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.created_date);
      return orderDate >= new Date(thirtyMinutesAgo);
    });

    if (recentOrders.length > 0) {
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

      // Only process post-payment actions if payment succeeded
      if (isSuccess) {
        // Update user data
        const userUpdateData = {
          purchase_date: new Date().toISOString(),
          payment_amount: order.amount
        };

        if (order.product_type === 'full_report') {
          userUpdateData.has_purchased_full_report = true;
          userUpdateData.express_delivery = order.is_express || false;
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

        // Mark coupon as used if applicable
        if (order.coupon_id) {
          try {
            await base44.asServiceRole.entities.Coupon.update(order.coupon_id, { used: true });
            console.log('Coupon marked as used:', order.coupon_id);
          } catch (error) {
            console.log('Could not mark coupon as used:', error.message);
          }
        }
      }
    } else {
      console.log('No matching order found for amount:', roundedAmount);
    }

    // Always return OK to Tranzila (prevents retries)
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Tranzila Notify Error:', error);
    // Still return OK to prevent Tranzila retries
    return new Response('OK', { status: 200 });
  }
});