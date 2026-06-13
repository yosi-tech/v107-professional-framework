import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const items = await base44.entities.SiteSettings.list('-created_date', 50);
    const clean = items.map(a => ({
      setting_key: a.setting_key || '',
      setting_value: a.setting_value || '',
      description: a.description || '',
      active: a.active !== false
    }));

    return new Response(JSON.stringify(clean, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename=site-settings-export.json'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});