import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const items = await base44.entities.Coupon.list('-created_date', 50);
    const clean = items.map(a => ({
      code: a.code || '',
      discount_amount: a.discount_amount || 0,
      discount_percentage: a.discount_percentage || 0,
      valid_until: a.valid_until || '',
      used: a.used || false,
      is_single_use: a.is_single_use !== false,
      is_user_specific: a.is_user_specific || false,
      user_email: a.user_email || '',
      source: a.source || ''
    }));

    return new Response(JSON.stringify(clean, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename=coupons-export.json'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});