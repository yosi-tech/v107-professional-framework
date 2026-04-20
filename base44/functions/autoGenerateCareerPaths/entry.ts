import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Entity automation payload: { event: { type, entity_name, entity_id }, data: {...} }
    const reportId = body?.event?.entity_id;
    const reportData = body?.data;

    if (!reportId) {
      console.log('No entity_id in automation payload, skipping.');
      return Response.json({ skipped: true, reason: 'no entity_id' });
    }

    // Only process completed reports
    if (reportData?.status && reportData.status !== 'completed') {
      console.log('Report status is not completed, skipping:', reportData.status);
      return Response.json({ skipped: true, reason: 'not completed' });
    }

    console.log('Auto-generating career paths for report:', reportId);

    // Always call generateCareerPaths — it overwrites focused_recommendations each time
    const result = await base44.asServiceRole.functions.invoke('generateCareerPaths', { reportId });

    console.log('Career paths result:', JSON.stringify(result).substring(0, 300));

    return Response.json({
      success: true,
      reportId,
      career_paths_generated: result?.success || false,
      recommendations_count: result?.recommendations_count || 0
    });

  } catch (error) {
    console.error('autoGenerateCareerPaths error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});