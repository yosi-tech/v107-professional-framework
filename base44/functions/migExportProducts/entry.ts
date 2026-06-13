import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const items = await base44.entities.Product.list('-created_date', 50);
    const clean = items.map(a => ({
      name_he: a.name_he || '',
      name_en: a.name_en || '',
      description_he: a.description_he || '',
      description_en: a.description_en || '',
      price: a.price || 0,
      product_type: a.product_type || '',
      active: a.active !== false,
      featured: a.featured || false,
      discount_eligible: a.discount_eligible !== false,
      allowed_coupon_codes: a.allowed_coupon_codes || [],
      order: a.order || 0
    }));

    return new Response(JSON.stringify(clean, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename=products-export.json'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});