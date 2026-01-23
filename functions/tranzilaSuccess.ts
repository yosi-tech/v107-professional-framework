import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Parse URL parameters (Tranzila redirects with GET parameters)
    const url = new URL(req.url);
    const notify = {};
    for (const [key, value] of url.searchParams.entries()) {
      notify[key] = value;
    }

    console.log('Received Tranzila success redirect:', notify);

    // Extract fields from notification
    const responseCode = notify["Response"]; // "000" or "0" = success
    const amount = parseFloat(notify["sum"] || 0);
    const isSuccess = responseCode === "000" || responseCode === "0";

    if (isSuccess) {
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

      if (recentOrders.length > 0) {
        const order = recentOrders[0];
        console.log('Matched order:', order.id);

        // Update order status
        const updateData = {
          status: "paid",
          tranzila_reference: notify["TranzilaTK"] || null,
          confirmation_code: notify["ConfirmationCode"] || null,
          raw_data: JSON.stringify(notify)
        };

        await base44.asServiceRole.entities.PaymentOrder.update(order.id, updateData);
        console.log('Order status updated to: paid');

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

        // Send postMessage to iframe parent
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Payment Success</title>
          </head>
          <body>
            <script>
              if (window.parent) {
                window.parent.postMessage({ iframe_message: 'success' }, '*');
              }
              window.location.href = '${req.headers.get('origin')}/page/ThankYou';
            </script>
          </body>
          </html>
        `;

        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        });
      }
    }

    // If payment failed or no matching order, redirect to payment page
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Failed</title>
      </head>
      <body>
        <script>
          if (window.parent) {
            window.parent.postMessage({ iframe_message: 'error' }, '*');
          }
          alert('Payment failed. Please try again.');
          window.location.href = '${req.headers.get('origin')}/page/Payment';
        </script>
      </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });

  } catch (error) {
    console.error("Tranzila Success Handler Error:", error);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <script>
          if (window.parent) {
            window.parent.postMessage({ iframe_message: 'error' }, '*');
          }
          alert('An error occurred. Please contact support.');
          window.location.href = '${req.headers.get('origin')}/page/Home';
        </script>
      </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
});