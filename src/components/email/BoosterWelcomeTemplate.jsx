// תבנית מייל ברוכים הבאים לתוכנית הבוסטר
export function getBoosterWelcomeTemplate(userName, userGender, track, language = 'he') {
  const trackNames = {
    resilience: { he: 'חוסן', en: 'Resilience' },
    flexibility: { he: 'גמישות', en: 'Flexibility' },
    leadership: { he: 'מנהיגות', en: 'Leadership' },
    communication: { he: 'תקשורת', en: 'Communication' },
    planning: { he: 'תכנון', en: 'Planning' },
    learning: { he: 'למידה', en: 'Learning' },
    vision: { he: 'חזון', en: 'Vision' },
    technology: { he: 'טכנולוגיה', en: 'Technology' },
    networking: { he: 'נטוורקינג', en: 'Networking' },
    balance: { he: 'איזון', en: 'Balance' },
    change: { he: 'שינוי', en: 'Change' }
  };

  const trackName = trackNames[track]?.[language] || track;
  const genderSuffix = language === 'he' && userGender === 'female' ? 'ה' : '';
  const youAre = language === 'he' ? (userGender === 'female' ? 'את' : 'אתה') : 'you';

  if (language === 'he') {
    const subject = `ברוכ${genderSuffix} הבא${genderSuffix} ל-V107 BOOSTER | התחלת המסע שלך`;
    
    const html = `
      <div dir="rtl" style="font-family: 'Assistant', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, #667eea 100%); padding: 40px 30px; text-align: right; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; font-size: 28px; margin: 0; font-weight: bold;">🚀 V107 BOOSTER</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 10px;">ברוכ${genderSuffix} הבא${genderSuffix} למסע שינוי של 30 יום</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: right;">
          <h2 style="font-size: 22px; color: #1a202c; margin: 0 0 20px 0;">${userName}, ההצלחה שלך מתחילה כאן</h2>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.8; margin-bottom: 20px;">
            דו"ח V107 שלך זיהה את הממד המרכזי לשיפור: <strong style="color: #667eea;">${trackName}</strong>.
          </p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.8; margin-bottom: 25px;">
            בשבועיים הקרובים, ${youAre} תקבל${genderSuffix} <strong>7 משימות יומיות</strong> ממוקדות בתחום זה - משימות קצרות, פרקטיות ומותאמות באופן אישי עבורך.
          </p>
          
          <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-right: 4px solid #667eea;">
            <h3 style="color: #1e3a8a; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">📋 מבנה התוכנית (7 ימים חינמיים)</h3>
            <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; line-height: 1.8;">
              <li style="margin-bottom: 8px;"><strong>ימים 1-7:</strong> שלב הפריצה - Quick Wins ללא עלות</li>
              <li style="margin-bottom: 8px;"><strong>יום 7:</strong> הזדמנות להרחבה ל-30 יום מלאים (199 ₪)</li>
              <li><strong>יום 8-30:</strong> בניית תשתית, העמקה ואינטגרציה מלאה</li>
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f59e0b;">
            <h3 style="color: #92400e; font-size: 18px; margin: 0 0 12px 0; font-weight: bold;">⏰ מה יקרה עכשיו?</h3>
            <p style="color: #78350f; font-size: 15px; line-height: 1.7; margin: 0;">
              <strong>מחר בבוקר</strong> תקבל${genderSuffix} את המשימה הראשונה שלך.<br/>
              כל יום, בשעה 09:00, נשלח לך משימה חדשה - קצרה, פרקטית וממוקדת בשיפור ה${trackName} שלך.
            </p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-right: 3px solid #10b981;">
            <h3 style="color: #065f46; font-size: 18px; margin: 0 0 12px 0; font-weight: bold;">💡 הטיפ החשוב ביותר</h3>
            <p style="color: #047857; font-size: 15px; line-height: 1.7; margin: 0;">
              המשימות קצרות (10-15 דקות) אבל העוצמה היא בעקביות. ${youAre} לא צריכ${genderSuffix} להיות מושלמ${genderSuffix} - רק עקבי${genderSuffix}.
            </p>
          </div>
          
          <div style="text-align: center; padding: 25px 0; border-top: 2px solid #E5E7EB; margin-top: 30px;">
            <p style="font-size: 17px; color: #1a202c; font-weight: bold; margin: 0 0 10px 0;">
              ${userName}, ${youAre} עשית${genderSuffix} את הצעד הראשון
            </p>
            <p style="font-size: 14px; color: #6B7280; margin: 0;">
              התוכנית שלך מתחילה מחר. בהצלחה במסע! 🎯
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 25px; border: 1px dashed #d97706;">
            <p style="font-size: 11px; color: #92400e; line-height: 1.6; margin: 0; text-align: right;">
              <strong>הצהרה משפטית:</strong> תוכנית V107-BOOSTER מהווה כלי ליווי אסטרטגי ותמיכה בקבלת החלטות. המידע המוצג והמשימות המוצעות נועדו לשיפור מיומנויות מקצועיות ואישיות ואינם מהווים תחליף לייעוץ משפטי, פיננסי או פסיכולוגי פרטני. האחריות על יישום המשימות והשלכותיהן מוטלת על המשתמש/ת בלבד.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px 0;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
              V107 Professional Framework | המסגרת המקצועית המובילה
            </p>
          </div>
        </div>
      </div>
    `;
    
    return { subject, html };
  } else {
    // English version
    const subject = `Welcome to V107 BOOSTER | Your Journey Begins`;
    
    const html = `
      <div style="font-family: 'Arial', sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #1a202c 0%, #667eea 100%); padding: 40px 30px; text-align: left; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; font-size: 28px; margin: 0; font-weight: bold;">🚀 V107 BOOSTER</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 10px;">Welcome to your 30-day transformation journey</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: left;">
          <h2 style="font-size: 22px; color: #1a202c; margin: 0 0 20px 0;">${userName}, your success starts here</h2>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.8; margin-bottom: 20px;">
            Your V107 report identified your key area for improvement: <strong style="color: #667eea;">${trackName}</strong>.
          </p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.8; margin-bottom: 25px;">
            Over the next two weeks, you'll receive <strong>7 daily tasks</strong> focused on this area - short, practical, and personally tailored for you.
          </p>
          
          <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #667eea;">
            <h3 style="color: #1e3a8a; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">📋 Program Structure (7 Days Free)</h3>
            <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; line-height: 1.8;">
              <li style="margin-bottom: 8px;"><strong>Days 1-7:</strong> Breakthrough Phase - Quick Wins at no cost</li>
              <li style="margin-bottom: 8px;"><strong>Day 7:</strong> Option to extend to full 30 days (199 ILS)</li>
              <li><strong>Days 8-30:</strong> Infrastructure building, deepening, and full integration</li>
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #f59e0b;">
            <h3 style="color: #92400e; font-size: 18px; margin: 0 0 12px 0; font-weight: bold;">⏰ What Happens Now?</h3>
            <p style="color: #78350f; font-size: 15px; line-height: 1.7; margin: 0;">
              <strong>Tomorrow morning</strong> you'll receive your first task.<br/>
              Every day at 09:00, we'll send you a new task - short, practical, and focused on improving your ${trackName}.
            </p>
          </div>
          
          <div style="text-align: center; padding: 25px 0; border-top: 2px solid #E5E7EB; margin-top: 30px;">
            <p style="font-size: 17px; color: #1a202c; font-weight: bold; margin: 0 0 10px 0;">
              ${userName}, you've taken the first step
            </p>
            <p style="font-size: 14px; color: #6B7280; margin: 0;">
              Your program starts tomorrow. Good luck on your journey! 🎯
            </p>
          </div>
        </div>
      </div>
    `;
    
    return { subject, html };
  }
}