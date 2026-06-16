import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function fetchAll(base44, entityName) {
  const records = [];
  let skip = 0;
  while (true) {
    const batch = await base44.asServiceRole.entities[entityName].filter({}, '-created_date', 50, skip);
    records.push(...batch);
    if (batch.length < 50) break;
    skip += 50;
    if (skip > 2000) break; // safety cap
  }
  return records;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { entity } = await req.json();

    if (entity) {
      // Export single entity
      const records = await fetchAll(base44, entity);
      return Response.json({ entity, count: records.length, records });
    }

    // Export all schemas + small entities data
    const allEntities = [
      'Article', 'Testimonial', 'Product', 'Coupon', 'SiteSettings',
      'ContentItem', 'EmailTemplate', 'SimulatedPurchase', 'ContactInquiry',
      'SurveyResponse', 'PaymentOrder', 'QuestionnaireResponse',
      'GeneratedReport', 'OnlineCoachingSubscription', 'BoosterTask', 'EmailLog'
    ];

    const summary = {};
    for (const name of allEntities) {
      const records = await fetchAll(base44, name);
      summary[name] = { count: records.length };
    }

    return Response.json({ summary });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});