import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Anonymize Old Questionnaire Data
 * 
 * This function removes PII (Personally Identifiable Information) from questionnaire responses
 * that are older than 30 days, in compliance with privacy requirements.
 * 
 * Removes: full_name, email, phone from personal_info
 * Preserves: All other data including responses, scores, and analysis
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Calculate cutoff date (30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();

    console.log(`Anonymizing questionnaire data older than: ${cutoffDate}`);

    // Fetch all questionnaire responses older than 30 days
    const oldResponses = await base44.asServiceRole.entities.QuestionnaireResponse.list('-created_date', 1000);
    
    let anonymizedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const response of oldResponses) {
      try {
        // Check if the response is older than 30 days
        const createdDate = new Date(response.created_date);
        
        if (createdDate >= thirtyDaysAgo) {
          skippedCount++;
          continue;
        }

        // Check if already anonymized
        if (!response.personal_info?.full_name && !response.personal_info?.email) {
          skippedCount++;
          continue;
        }

        // Anonymize the personal info
        const updatedPersonalInfo = {
          ...response.personal_info,
          full_name: null,
          email: null,
          phone: null
        };

        // Update the record
        await base44.asServiceRole.entities.QuestionnaireResponse.update(
          response.id,
          { personal_info: updatedPersonalInfo }
        );

        anonymizedCount++;
        console.log(`Anonymized questionnaire response: ${response.id}`);

      } catch (error) {
        console.error(`Error anonymizing response ${response.id}:`, error);
        errors.push({
          response_id: response.id,
          error: error.message
        });
      }
    }

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      cutoff_date: cutoffDate,
      total_checked: oldResponses.length,
      anonymized: anonymizedCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : null
    };

    console.log('Anonymization summary:', summary);

    return Response.json(summary);

  } catch (error) {
    console.error('Error in anonymizeOldQuestionnaireData:', error);
    return Response.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
});