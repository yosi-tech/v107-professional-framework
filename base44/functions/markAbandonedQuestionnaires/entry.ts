import { createClientFromRequest } from '@base44/sdk';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Calculate cutoff time - 10 minutes ago
    const cutoffTime = new Date(Date.now() - 10 * 60 * 1000);
    
    // Get all in_progress questionnaires that haven't been updated in the last 10 minutes
    const inProgressResponses = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
      status: 'in_progress'
    }, '-updated_date');
    
    const abandonedResponses = inProgressResponses.filter(response => {
      const updatedDate = new Date(response.updated_date);
      return updatedDate < cutoffTime;
    });
    
    if (abandonedResponses.length === 0) {
      return Response.json({
        success: true,
        message: 'No questionnaires to mark as abandoned',
        count: 0
      });
    }
    
    // Mark questionnaires as abandoned
    const updatePromises = abandonedResponses.map(response =>
      base44.asServiceRole.entities.QuestionnaireResponse.update(response.id, {
        status: 'abandoned'
      })
    );
    
    await Promise.all(updatePromises);
    
    return Response.json({
      success: true,
      message: `Marked ${abandonedResponses.length} questionnaires as abandoned`,
      count: abandonedResponses.length,
      abandoned_ids: abandonedResponses.map(r => r.id)
    });
    
  } catch (error) {
    console.error('Error marking abandoned questionnaires:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});