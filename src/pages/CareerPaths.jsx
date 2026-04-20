import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Loader2, ArrowLeft, Zap, Compass, LayoutDashboard, FileText, Award, Gift, ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard, href: 'MyAccount' },
  { key: 'career', label: 'נתיבי קריירה', icon: Compass, href: 'CareerPaths', active: true },
  { key: 'questionnaires', label: 'שאלונים', icon: FileText, href: 'MyAccount' },
  { key: 'reports', label: 'דוחות', icon: Award, href: 'MyAccount' },
  { key: 'coupons', label: 'קופונים', icon: Gift, href: 'MyAccount' },
  { key: 'orders', label: 'רכישות', icon: ShoppingCart, href: 'MyAccount' },
];

const DEFAULT_CAREER_PATHS = [
  {
    id: 1,
    title: 'מנהל מוצר טכנולוגי',
    category: 'מסלול טכנולוגי',
    description: 'הובלת מוצרים טכנולוגיים משלב הרעיון ועד לשוק, תוך ניהול צוותים רב-תחומיים בסביבה דינאמית.',
    skills: ['ניהול שינוי', 'תכנון ואסטרטגיה'],
  },
  {
    id: 2,
    title: 'יועץ אסטרטגי בכיר',
    category: 'מסלול עסקי',
    description: 'ליווי חברות וארגונים בקבלת החלטות, גיבוש תוכניות ובניית תוכניות אסטרטגיות ארוכות טווח.',
    skills: ['חשיבה אסטרטגית', 'ניהול פרויקטים'],
  },
  {
    id: 3,
    title: 'מנהל אופרציה גלובלי',
    category: 'מסלול ניהולי',
    description: 'אופטימיזציה של תהליכים עסקיים בקנה-מידה גלובלי, שיפור ביצועים ופתרון בעיות מורכבות.',
    skills: ['תהליכים עסקיים', 'ניהול צוות'],
  },
  {
    id: 4,
    title: 'אנליסט השקעות בכיר',
    category: 'מסלול פיננסי',
    description: 'ניתוח מגמות שוק לקבלת החלטות השקעה מבוססות נתונים לחברות טכנולוגיה בצמיחה.',
    skills: ['ניתוח נתונים', 'הערכת אפשרויות'],
  },
  {
    id: 5,
    title: 'מוביל צוות R&D',
    category: 'מסלול טכנולוגי',
    description: 'הובלת קבוצות פיתוח טכנולוגי, מחקר ופתרון אתגרים מתקדמים לפני שהם מופיעים בשוק.',
    skills: ['מחקר', 'ניהול צוות'],
  },
  {
    id: 6,
    title: 'מומחה Cyber Security',
    category: 'מסלול אבטחה',
    description: 'הגנה על תשתיות חיוניות ופרישת אקוסיסטם מתקדמים לארגונים גלובליים.',
    skills: ['סייבר', 'ניהול סיכונים'],
  },
];

export default function CareerPaths() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latestReport, setLatestReport] = useState(null);
  const [userCount, setUserCount] = useState(5737);
  const [careerPaths, setCareerPaths] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Fetch user count
        try {
          const allResponses = await base44.entities.QuestionnaireResponse.filter({ status: 'completed' }, '-created_date', 500);
          setUserCount(allResponses.length);
        } catch (e) {}

        // Fetch latest report
        try {
          const allReports = await base44.entities.GeneratedReport.list('-created_date');
          const myReport = allReports.find(r => r.user_email === currentUser.email && r.purchased === true);
          if (myReport) {
            setLatestReport(myReport);
            const paths = buildPathsFromReport(myReport);
            setCareerPaths(paths);
          } else {
            setCareerPaths([]);
          }
        } catch (e) {
          setCareerPaths([]);
        }
      } catch (e) {
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const buildPathsFromReport = (report) => {
    const paths = [];
    if (report.archetype) {
      paths.push({
        id: 'archetype',
        title: report.archetype,
        category: 'ארכיטיפ אישי',
        description: report.executive_summary?.summary || 'תפקיד מותאם אישית על בסיס פרופיל הכישורים שלך.',
        skills: report.executive_summary?.strengths?.slice(0, 3) || [],
      });
    }
    if (report.recommended_booster_track) {
      const trackMap = {
        resilience: 'חוסן', flexibility: 'גמישות', leadership: 'מנהיגות',
        communication: 'תקשורת', planning: 'תכנון', learning: 'למידה',
        vision: 'חזון', technology: 'טכנולוגיה', networking: 'נטוורקינג',
        balance: 'איזון', change: 'ניהול שינוי',
      };
      paths.push({
        id: 'booster',
        title: `מסלול ${trackMap[report.recommended_booster_track] || report.recommended_booster_track}`,
        category: 'מסלול מומלץ',
        description: 'מסלול הבוסטר המומלץ עבורך על בסיס תוצאות האבחון.',
        skills: [trackMap[report.recommended_booster_track] || report.recommended_booster_track],
      });
    }
    // Add from focused_recommendations
    if (Array.isArray(report.focused_recommendations)) {
      report.focused_recommendations.slice(0, 4).forEach((rec, i) => {
        let parsed = rec;
        if (typeof rec === 'string') {
          try { parsed = JSON.parse(rec); } catch (e) { parsed = { title: rec }; }
        }
        paths.push({
          id: `rec_${i}`,
          title: typeof parsed === 'object' ? (parsed.title || parsed.role || `המלצה ${i + 1}`) : parsed,
          category: typeof parsed === 'object' ? (parsed.category || 'המלצה מותאמת') : 'המלצה מותאמת',
          description: typeof parsed === 'object' ? (parsed.description || '') : '',
          skills: typeof parsed === 'object' && Array.isArray(parsed.required_skills || parsed.skills) ? (parsed.required_skills || parsed.skills).slice(0, 3) : [],
          matchPercentage: typeof parsed === 'object' ? parsed.match_percentage : null,
          growthPotential: typeof parsed === 'object' ? parsed.growth_potential : null,
        });
      });
    }
    return paths;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <Loader2 className="animate-spin h-12 w-12 text-[#FF8F00]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 xl:flex" dir="rtl">

      {/* Desktop Sidebar */}
      <aside className="bg-white w-64 hidden xl:flex flex-col flex-shrink-0 sticky top-[73px] self-start h-[calc(100vh-73px)] pt-6 pb-6 border-l border-slate-100 shadow-sm overflow-y-auto">
        <div className="px-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#FF8F00] flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{user?.full_name || 'שלום'}</h3>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {SIDEBAR_ITEMS.map(({ key, label, icon: Icon, href, active }) => (
            <Link
              key={key}
              to={createPageUrl(href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right ${
                active
                  ? 'text-[#FF8F00] bg-orange-50 font-bold border-r-4 border-[#FF8F00]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 space-y-2 mt-4">
          <Link to={createPageUrl('Questionnaire')} className="block">
            <button className="w-full text-white py-3 rounded-xl font-bold shadow-md hover:scale-105 transition-transform text-sm" style={{ backgroundColor: '#FF8F00' }}>
              התחל מיפוי חדש
            </button>
          </Link>
          <button
            onClick={() => base44.auth.logout(createPageUrl('Home'))}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            התנתק
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="xl:hidden fixed bottom-0 right-0 left-0 z-50 bg-white border-t border-slate-200 shadow-lg">
        <div className="flex items-center justify-evenly py-1.5">
          {SIDEBAR_ITEMS.map(({ key, label, icon: Icon, href, active }) => (
            <Link
              key={key}
              to={createPageUrl(href)}
              className={`flex flex-col items-center gap-0.5 min-w-0 px-1 py-1 rounded-lg transition-colors ${
                active ? 'text-[#FF8F00]' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-medium truncate max-w-[56px] text-center">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 min-w-0 px-6 md:px-12 pb-28 xl:pb-24 pt-8">

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 bg-orange-50 text-[#FF8F00] font-bold text-xs rounded-full mb-4">
            אלגוריתם הדיוק מופעל
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            נתיבי קריירה מומלצים עבורך
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            מבוסס על ניתוח המיפוי האישי שלך והחוזקות שזוהו בתהליך האבחון הדיגיטלי.
          </p>
        </section>

        {/* Career Cards Grid or Empty State */}
        {careerPaths.length > 0 ? (
          <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {careerPaths.map((path) => (
              <div
                key={path.id}
                className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-transparent hover:border-orange-200"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="h-12 w-12 bg-orange-50 text-[#FF8F00] flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{path.category}</p>
                    <h3 className="text-xl font-extrabold text-slate-900">{path.title}</h3>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{path.description}</p>
                <div className="mt-auto space-y-6">
                  {path.skills && path.skills.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-[#FF8F00]">מיומנויות ליבה:</span>
                      <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="pt-6 border-t border-slate-100 flex justify-start">
                    <button className="h-10 w-10 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:bg-[#FF8F00] transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="max-w-3xl mx-auto mb-16">
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
              <Compass className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">עדיין אין לך נתיבי קריירה מותאמים אישית</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
                השלם את השאלון ורכוש את הדוח המקצועי כדי לקבל המלצות קריירה מותאמות אישית המבוססות על הפרופיל הייחודי שלך.
              </p>
              <Link to={createPageUrl('Questionnaire')}>
                <button className="bg-[#FF8F00] text-white text-lg font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-transform shadow-md shadow-orange-200">
                  התחל שאלון עכשיו
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Booster Banner */}
        <section className="max-w-6xl mx-auto mt-16 bg-white rounded-[2rem] overflow-hidden flex flex-col lg:flex-row-reverse border border-slate-100 shadow-sm">
          <div className="lg:w-1/3 relative h-48 lg:h-auto bg-slate-900 flex items-center justify-center overflow-hidden">
            <div className="absolute w-32 h-32 bg-[#FF8F00]/20 rounded-full blur-3xl" />
            <div className="relative w-16 h-16 bg-[#FF8F00] rounded-full shadow-[0_0_40px_rgba(255,143,0,0.4)] flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="lg:w-2/3 p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-black text-slate-900 mb-3">ה-Booster: כך תגיע ליעד</h2>
            <p className="text-slate-500 text-sm mb-6">חסרים לך רק 2-3 צעדים קריטיים כדי להתברג בתפקידים הללו. תוכנית ההאצה שלך:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                'תרגילי חיזוק ושיפור המדדים',
                'מיקוד מקצועי',
                'מיקוד קו"ח בניהול שינוי',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#FF8F00] text-white text-[10px] flex items-center justify-center flex-shrink-0 font-bold">
                    {i + 1}
                  </div>
                  <p className="text-slate-800 text-xs font-medium">{step}</p>
                </div>
              ))}
            </div>
            <Link to={createPageUrl('BoosterRegistration')}>
              <button className="w-fit bg-[#FF8F00] text-white font-bold px-6 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-orange-200 text-sm">
                התחל את תוכנית ההאצה
              </button>
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="max-w-6xl mx-auto mt-20 py-12 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-[#FF8F00] mb-1">92%</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">דיוק אלגוריתמי</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[#FF8F00] mb-1">12k+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">השמות מוצלחות</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[#FF8F00] mb-1">{userCount.toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">עברו בהצלחה</p>
          </div>
        </section>

      </main>
    </div>
  );
}