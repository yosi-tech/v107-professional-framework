import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';


Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { responseId } = await req.json();

    if (!responseId) {
      return Response.json({ error: 'Missing responseId' }, { status: 400 });
    }

    // Fetch the questionnaire response
    const response = await base44.asServiceRole.entities.QuestionnaireResponse.get(responseId);
    if (!response) {
      return Response.json({ error: 'Response not found' }, { status: 404 });
    }

    // Check if report already exists
    const existingReports = await base44.asServiceRole.entities.GeneratedReport.filter({ 
      questionnaire_response_id: responseId 
    });

    if (existingReports && existingReports.length > 0) {
      return Response.json({ 
        message: 'Report already exists',
        reportId: existingReports[0].id 
      });
    }

    // Call generateReportV6ProUltimate function
    const generateResult = await base44.asServiceRole.functions.invoke('generateReportV6ProUltimate', { 
      responseId: responseId 
    });

    if (!generateResult.success) {
      return Response.json({ 
        error: generateResult.error || 'Failed to generate report' 
      }, { status: 500 });
    }

    return Response.json({ 
      success: true,
      reportId: generateResult.reportId,
      report_number: generateResult.report_number,
      message: generateResult.message
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return Response.json({ 
      error: error.message || 'Unknown error' 
    }, { status: 500 });
  }
});