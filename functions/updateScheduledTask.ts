import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();

    const task = await base44.asServiceRole.scheduledTasks.update(payload.task_id, {
      name: payload.name,
      description: payload.description,
      repeat_interval: payload.repeat_interval,
      repeat_unit: payload.repeat_unit,
      start_time: payload.start_time
    });

    return Response.json({ success: true, task });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});