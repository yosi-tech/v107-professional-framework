import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    
    const formData = await req.formData();
    const notify = {};
    for (const [key, value] of formData.entries()) {
      notify[key] = value;
    }

    console.log('Received Tranzila notification:', notify);

    const responseCode = notify["Response"];
    const amount = parseFloat(notify["sum"] || 0);
    const roundedAmount = Math.round(amount);
    const isSuccess = responseCode === "000" || responseCode === "0";

    console.log('Payment result:', { responseCode, amount: roundedAmount, isSuccess });

    // Match order — by ID first, fallback to amount
    const orderId = notify["cfield1"] || null;
    let order = null;

    if (orderId) {
      try {
        const exactOrders = await base44.asServiceRole.entities.PaymentOrder.filter({
          id: orderId,
          status: 'pending'
        }, '-created_date', 1);
        if (exactOrders.length > 0) {
          order = exactOrders[0];
          console.log('Matched order by ID:', order.id);
        }
      } catch (e) {
        console.log('ID match failed, falling back:', e.message);
      }
    }

    if (!order) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const orders = await base44.asServiceRole.entities.PaymentOrder.filter({
        status: 'pending',
        amount: roundedAmount
      }, '-created_date', 10);
      const recentOrders = orders.filter(o =>
        new Date(o.created_date) >= new Date(thirtyMinutesAgo)
      );
      if (recentOrders.length > 0) {
        order = recentOrders[0];
        console.log('Matched order by amount (fallback):', order.id);
      }
    }

    if (order) {
      console.log('Matched order:', order.id);

      const updateData = {
        status: isSuccess ? "paid" : "failed",
        tranzila_reference: notify["TranzilaTK"] || null,
        confirmation_code: notify["ConfirmationCode"] || null,
        raw_data: JSON.stringify(notify)
      };

      await base44.asServiceRole.entities.PaymentOrder.update(order.id, updateData);
      console.log('Order status updated to:', updateData.status);

      if (isSuccess) {
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

        const users = await base44.asServiceRole.entities.User.filter({ email: order.user_email });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, userUpdateData);
          console.log('User data updated for:', order.user_email);
        }

        if (order.questionnaire_response_id && order.questionnaire_response_id !== 'null' && order.product_type === 'full_report') {
          try {
            const reports = await base44.asServiceRole.entities.GeneratedReport.filter({
              questionnaire_response_id: order.questionnaire_response_id
            }, '-created_date', 1);
            if (reports.length > 0) {
              await base44.asServiceRole.entities.GeneratedReport.update(reports[0].id, { 
                purchased: true 
              });
              console.log('GeneratedReport marked as purchased:', reports[0].id);
            } else {
              console.log('No GeneratedReport found for questionnaire_response_id:', order.questionnaire_response_id);
            }
          } catch (error) {
            console.log('Could not update GeneratedReport:', error.message);
          }
        }

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

    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Tranzila Notify Error:', error);
    return new Response('OK', { status: 200 });
  }
});