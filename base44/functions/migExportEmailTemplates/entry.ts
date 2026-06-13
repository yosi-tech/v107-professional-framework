import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const items = await base44.entities.EmailTemplate.list('-created_date', 50);
    const clean = items.map(a => ({
      template_type: a.template_type || '',
      trigger_event: a.trigger_event || '',
      booster_track: a.booster_track || '',
      booster_day: a.booster_day || null,
      name_he: a.name_he || '',
      name_en: a.name_en || '',
      subject_he: a.subject_he || '',
      subject_en: a.subject_en || '',
      content_he: a.content_he || '',
      content_en: a.content_en || '',
      description_he: a.description_he || '',
      description_en: a.description_en || '',
      active: a.active !== false,
      include_coupon: a.include_coupon || false,
      coupon_amount: a.coupon_amount || null
    }));

    return new Response(JSON.stringify(clean, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename=email-templates-export.json'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});