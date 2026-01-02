import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// מיפוי בין אקשנים לשמות פונקציות
const ACTION_TO_FUNCTION = {
  'send_daily_booster_emails': 'sendDailyBoosterEmails',
  'mark_abandoned_questionnaires': 'markAbandonedQuestionnaires',
  'send_abandonment_survey': 'sendAbandonmentSurvey',
  'send_survey_reminders': 'sendSurveyReminders',
  'send_completion_no_purchase': 'sendCompletionNoPurchase',
  'send_booster_encouragement': 'sendBoosterEncouragement'
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action, payload } = await req.json();

    switch (action) {
      case 'list': {
        const tasks = await base44.asServiceRole.scheduledTasks.list();
        return Response.json({ success: true, tasks });
      }

      case 'create': {
        const functionName = ACTION_TO_FUNCTION[payload.action_type];
        if (!functionName) {
          return Response.json({ error: 'Invalid action type' }, { status: 400 });
        }

        const task = await base44.asServiceRole.scheduledTasks.create({
          name: payload.name,
          function_name: functionName,
          description: payload.description,
          schedule_type: payload.schedule_type || 'simple',
          repeat_interval: payload.repeat_interval,
          repeat_unit: payload.repeat_unit,
          start_time: payload.start_time,
          is_active: payload.is_active !== false
        });

        return Response.json({ success: true, task });
      }

      case 'update': {
        const updateData = {
          name: payload.name,
          description: payload.description,
          repeat_interval: payload.repeat_interval,
          repeat_unit: payload.repeat_unit,
          start_time: payload.start_time
        };

        const task = await base44.asServiceRole.scheduledTasks.update(payload.task_id, updateData);
        return Response.json({ success: true, task });
      }

      case 'toggle': {
        await base44.asServiceRole.scheduledTasks.toggle(payload.task_id);
        return Response.json({ success: true });
      }

      case 'delete': {
        await base44.asServiceRole.scheduledTasks.delete(payload.task_id);
        return Response.json({ success: true });
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in manageScheduledTasks:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});