import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();

    const task = await base44.asServiceRole.scheduledTasks.create({
      name: payload.name,
      function_name: payload.function_name,
      description: payload.description,
      schedule_type: payload.schedule_type || 'simple',
      repeat_interval: payload.repeat_interval,
      repeat_unit: payload.repeat_unit,
      start_time: payload.start_time,
      is_active: payload.is_active !== false
    });

    return Response.json({ success: true, task });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});