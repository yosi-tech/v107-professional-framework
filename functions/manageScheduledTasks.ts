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
        // קריאה ישירה ל-API של Base44 לקבלת רשימת תזמונים
        const response = await fetch(`${Deno.env.get('BASE44_API_URL') || 'https://api.base44.com'}/scheduled-tasks`, {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('BASE44_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        return Response.json({ success: true, tasks: data.tasks || [] });
      }

      case 'create': {
        const functionName = ACTION_TO_FUNCTION[payload.action_type];
        if (!functionName) {
          return Response.json({ error: 'Invalid action type' }, { status: 400 });
        }

        const taskData = {
          name: payload.name,
          function_name: functionName,
          description: payload.description,
          schedule_type: payload.schedule_type || 'simple',
          repeat_interval: payload.repeat_interval,
          repeat_unit: payload.repeat_unit,
          start_time: payload.start_time,
          is_active: payload.is_active !== false
        };

        const response = await fetch(`${Deno.env.get('BASE44_API_URL') || 'https://api.base44.com'}/scheduled-tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('BASE44_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create task');
        }

        const task = await response.json();
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

        const response = await fetch(`${Deno.env.get('BASE44_API_URL') || 'https://api.base44.com'}/scheduled-tasks/${payload.task_id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('BASE44_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update task');
        }

        const task = await response.json();
        return Response.json({ success: true, task });
      }

      case 'toggle': {
        const response = await fetch(`${Deno.env.get('BASE44_API_URL') || 'https://api.base44.com'}/scheduled-tasks/${payload.task_id}/toggle`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('BASE44_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to toggle task');
        }

        return Response.json({ success: true });
      }

      case 'delete': {
        const response = await fetch(`${Deno.env.get('BASE44_API_URL') || 'https://api.base44.com'}/scheduled-tasks/${payload.task_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('BASE44_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete task');
        }

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