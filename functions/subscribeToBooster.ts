import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  const user = await base44.auth.me();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { reportId } = await req.json();

  if (!reportId) {
    return Response.json({ error: 'Missing reportId' }, { status: 400 });
  }

  // קבל את הדוח
  const reports = await base44.entities.GeneratedReport.filter({ id: reportId });
  if (reports.length === 0) {
    return Response.json({ error: 'Report not found' }, { status: 404 });
  }

  const report = reports[0];
  const userEmail = report.user_email;
  const userName = report.user_name;
  const recommendedTrack = report.recommended_booster_track;
  const language = report.language || 'he';

  if (!recommendedTrack) {
    return Response.json({ error: 'No recommended booster track in report' }, { status: 400 });
  }

  // בדוק אם המשתמש כבר רשום לבוסטר פעיל
  const existingSubscriptions = await base44.asServiceRole.entities.OnlineCoachingSubscription.filter({
    user_email: userEmail,
    status: 'active'
  });

  if (existingSubscriptions.length > 0) {
    return Response.json({ 
      error: language === 'he' 
        ? 'את/ה כבר רשום/ה לתוכנית בוסטר פעילה' 
        : 'You are already subscribed to an active booster program'
    }, { status: 400 });
  }

  // צור מנוי חדש
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  const subscription = await base44.asServiceRole.entities.OnlineCoachingSubscription.create({
    user_email: userEmail,
    user_name: userName,
    recommended_booster_track: recommendedTrack,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    current_day: 1,
    last_email_sent_date: new Date().toISOString(),
    status: 'active',
    language: language
  });

  // שלח מייל ראשון
  const templates = await base44.asServiceRole.entities.EmailTemplate.filter({
    template_type: 'booster_email',
    booster_track: recommendedTrack,
    booster_day: 1,
    active: true
  });

  if (templates.length > 0) {
    const template = templates[0];
    const emailSubject = language === 'he' ? template.subject_he : template.subject_en;
    let emailContent = language === 'he' ? template.content_he : template.content_en;

    // Replace variables
    emailContent = emailContent
      .replace(/{userName}/g, userName)
      .replace(/{boosterTrack}/g, language === 'he' 
        ? (trackInfo[recommendedTrack]?.name_he || recommendedTrack)
        : (trackInfo[recommendedTrack]?.name_en || recommendedTrack));

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: userEmail,
      subject: emailSubject,
      body: emailContent
    });

    await base44.asServiceRole.entities.EmailLog.create({
      to_email: userEmail,
      email_type: 'booster_email',
      subject: emailSubject,
      related_user_email: userEmail,
      sent_manually: false,
      language: language
    });
  }

  return Response.json({ 
    success: true, 
    subscription,
    message: language === 'he' 
      ? 'נרשמת בהצלחה לתוכנית הבוסטר! המייל הראשון נשלח אליך' 
      : 'Successfully subscribed to the booster program! First email has been sent'
  });

  const trackInfo = {
    execution: { name_he: 'מסלול ביצוע', name_en: 'Execution Track' },
    digital: { name_he: 'מסלול דיגיטל', name_en: 'Digital Track' },
    finance: { name_he: 'מסלול פיננסים', name_en: 'Finance Track' },
    marketing: { name_he: 'מסלול שיווק', name_en: 'Marketing Track' },
    management: { name_he: 'מסלול ניהול', name_en: 'Management Track' },
    vision: { name_he: 'מסלול חזון', name_en: 'Vision Track' }
  };
});