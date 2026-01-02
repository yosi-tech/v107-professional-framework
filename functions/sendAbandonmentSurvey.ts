import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { getAbandonmentEmailTemplate } from '../components/email/AbandonmentEmailTemplate.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // חישוב זמן - 96 שעות אחורה
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - (96 * 60 * 60 * 1000));
    
    // מצא שאלונים שנטשו או in_progress לפני 96 שעות
    const allResponses = await base44.asServiceRole.entities.QuestionnaireResponse.list('-created_date');
    
    const abandonedResponses = allResponses.filter(response => 
      (response.status === 'in_progress' || response.status === 'abandoned') &&
      new Date(response.updated_date) < cutoffTime
    );
    
    let emailsSent = 0;
    const errors = [];
    
    for (const response of abandonedResponses) {
      try {
        const userEmail = response.personal_info?.email || response.created_by;
        if (!userEmail) continue;
        
        // בדיקה אם כבר נשלח מייל נטישה למשתמש
        const existingEmail = await base44.asServiceRole.entities.EmailLog.filter({
          email_type: 'abandonment_survey',
          related_user_email: userEmail
        }, '', 1);
        
        if (existingEmail && existingEmail.length > 0) {
          continue; // כבר נשלח
        }
        
        // בדיקה אם המשתמש השלים שאלון אחר כך
        const completedResponse = await base44.asServiceRole.entities.QuestionnaireResponse.filter({
          created_by: userEmail,
          status: 'completed'
        }, '', 1);
        
        if (completedResponse && completedResponse.length > 0) {
          continue; // השלים שאלון - לא צריך מייל נטישה
        }
        
        const language = response.language || 'he';
        const userName = response.personal_info?.full_name || userEmail.split('@')[0];
        const surveyUrl = `${Deno.env.get('BASE44_APP_URL') || 'https://v107.base44.app'}/Survey`;
        
        const emailTemplate = getAbandonmentEmailTemplate(userName, surveyUrl, language);
        
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: userEmail,
          subject: emailTemplate.subject,
          body: emailTemplate.html
        });
        
        await base44.asServiceRole.entities.EmailLog.create({
          to_email: userEmail,
          email_type: 'abandonment_survey',
          subject: emailTemplate.subject,
          related_user_email: userEmail,
          related_questionnaire_response_id: response.id,
          language: language
        });
        
        emailsSent++;
        
      } catch (error) {
        console.error(`Error processing ${response.personal_info?.email}:`, error);
        errors.push({
          email: response.personal_info?.email,
          error: error.message
        });
      }
    }
    
    return Response.json({
      success: true,
      message: `Abandonment emails sent successfully`,
      emailsSent,
      totalChecked: abandonedResponses.length,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in sendAbandonmentSurvey:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});