import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, FileText, Award, ShoppingCart, Gift,
  CheckCircle, Clock, LogOut, User as UserIcon, AlertCircle,
  Lock, Rocket, Trash2, LayoutDashboard, Settings, TrendingUp, Brain, Zap, Upload, Compass
} from 'lucide-react';
import { useTranslation } from '@/components/i18n/useTranslation';
import { Link as RouterLink } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { key: 'career', label: 'נתיבי קריירה', icon: Compass, href: 'CareerPaths' },
  { key: 'questionnaires', label: 'שאלונים', icon: FileText },
  { key: 'reports', label: 'דוחות', icon: Award },
  { key: 'coupons', label: 'קופונים', icon: Gift },
  { key: 'orders', label: 'רכישות', icon: ShoppingCart },
];

export default function MyAccount() {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questionnaireResponses, setQuestionnaireResponses] = useState([]);
  const [reports, setReports] = useState([]);
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [boosterSubscription, setBoosterSubscription] = useState(null);
  const [paymentOrders, setPaymentOrders] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const responses = await base44.entities.QuestionnaireResponse.filter(
          { created_by: currentUser.email }, '-updated_date'
        );
        setQuestionnaireResponses(responses);

        try {
          const allReports = await base44.entities.GeneratedReport.list('-created_date');
          const myReports = allReports.filter(report =>
            report.user_email === currentUser.email &&
            (report.purchased === true || currentUser.has_purchased_full_report || currentUser.has_purchased_answers_download)
          );
          setReports(myReports);
        } catch (e) {}

        try {
          const surveys = await base44.entities.SurveyResponse.filter({ created_by: currentUser.email }, '-created_date');
          setSurveyResponses(surveys);
        } catch (e) {}

        try {
          const userCoupons = await base44.entities.Coupon.filter({ user_email: currentUser.email }, '-created_date');
          setCoupons(userCoupons);
        } catch (e) {}

        try {
          const subscriptions = await base44.entities.OnlineCoachingSubscription.filter(
            { user_email: currentUser.email, status: 'active' }, '-created_date'
          );
          if (subscriptions.length > 0) setBoosterSubscription(subscriptions[0]);
        } catch (e) {}

        try {
          const orders = await base44.entities.PaymentOrder.filter({ user_email: currentUser.email }, '-created_date');
          setPaymentOrders(orders);
        } catch (e) {}

      } catch (error) {
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = () => base44.auth.logout(createPageUrl('Home'));

  const handleDeleteQuestionnaire = async (questionnaireId) => {
    if (!window.confirm(language === 'he' ? 'האם אתה בטוח שברצונך למחוק את השאלון?' : 'Are you sure?')) return;
    try {
      await base44.entities.QuestionnaireResponse.delete(questionnaireId);
      setQuestionnaireResponses(prev => prev.filter(q => q.id !== questionnaireId));
    } catch (error) {
      alert(language === 'he' ? 'שגיאה במחיקת השאלון' : 'Error deleting questionnaire');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'abandoned': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    const map = { completed: 'הושלם', in_progress: 'בתהליך', abandoned: 'נזנח' };
    return map[status] || status;
  };

  // Get latest completed questionnaire for domain scores
  const latestCompleted = questionnaireResponses.find(r => r.status === 'completed');
  const latestReport = reports[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center" dir="rtl">
        <Loader2 className="animate-spin h-12 w-12 text-[#FF8F00]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 xl:flex" dir="rtl">

      {/* Desktop Sidebar */}
      <aside className="bg-white w-64 hidden xl:flex flex-col flex-shrink-0 sticky top-[73px] self-start h-[calc(100vh-73px)] pt-6 pb-6 border-l border-slate-100 shadow-sm overflow-y-auto">
        {/* User Info */}
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

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => (
            href ? (
              <Link
                key={key}
                to={createPageUrl(href)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right text-slate-500 hover:bg-slate-100"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            ) : (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right ${
                activeTab === key
                  ? 'text-[#FF8F00] bg-orange-50 font-bold border-r-4 border-[#FF8F00]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </button>
            )
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 space-y-2 mt-4">
          <Link to={createPageUrl('Questionnaire')} className="block">
            <button className="w-full text-white py-3 rounded-xl font-bold shadow-md hover:scale-105 transition-transform text-sm" style={{ backgroundColor: '#FF8F00' }}>
              התחל מיפוי חדש
            </button>
          </Link>
          <button
            onClick={handleLogout}
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
          {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => (
            href ? (
              <Link key={key} to={createPageUrl(href)} className="flex flex-col items-center gap-0.5 min-w-0 px-1 py-1 rounded-lg transition-colors text-slate-400">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-medium truncate max-w-[56px] text-center">{label}</span>
              </Link>
            ) : (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-col items-center gap-0.5 min-w-0 px-1 py-1 rounded-lg transition-colors ${
                activeTab === key ? 'text-[#FF8F00]' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-medium truncate max-w-[56px] text-center">{label}</span>
            </button>
            )
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-8 pb-28 xl:pb-16 px-4 md:px-12 max-w-7xl mx-auto w-full">

        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            {latestCompleted && (
              <div className="flex items-center gap-2 text-[#FF8F00] mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-bold tracking-widest uppercase">המיפוי הושלם</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3 leading-tight">
              האזור האישי שלי
            </h1>
            <p className="text-lg text-slate-500 font-light">
              שלום, {user?.full_name || user?.email}
            </p>
          </div>
          <div className="flex gap-3">
            {latestCompleted && (
              <Link to={createPageUrl(`Completion?responseId=${latestCompleted.id}`)}>
                <button className="flex items-center gap-2 bg-white text-slate-800 px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-sm border border-slate-200">
                  <Upload className="w-4 h-4" />
                  אפשרויות רכישה
                </button>
              </Link>
            )}
            {boosterSubscription && (
              <button className="flex items-center gap-2 text-white px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-all font-bold text-sm" style={{ backgroundColor: '#FF8F00' }}>
                <Zap className="w-4 h-4" />
                Booster פעיל
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

              {/* Strengths Map Card */}
              <section className="md:col-span-8 bg-white rounded-3xl p-8 shadow-[0_20px_40px_rgba(15,23,42,0.06)] overflow-hidden relative border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">מפת עוצמות</h2>
                  <div className="flex gap-2">
                    <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-bold">דאטה מעודכן</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* SVG Radar / Pie */}
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[400px] aspect-square">
                      <svg className="w-full h-full -rotate-[18deg]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="10" stroke="#e2e8f0" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" fill="none" r="20" stroke="#e2e8f0" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" fill="none" r="30" stroke="#e2e8f0" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" fill="none" r="40" stroke="#e2e8f0" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" fill="none" r="50" stroke="#e2e8f0" strokeWidth="0.5" />

                        <path d="M 50 50 L 50 10 A 40 40 0 0 1 85 27 Z" fill="#22c55e" opacity="0.6" stroke="#16a34a" strokeWidth="1" />
                        <path d="M 50 50 L 85 27 A 40 40 0 0 1 89 65 Z" fill="#22c55e" opacity="0.6" stroke="#16a34a" strokeWidth="1" />
                        <path d="M 50 50 L 89 65 A 40 40 0 0 1 60 88 Z" fill="#3b82f6" opacity="0.6" stroke="#2563eb" strokeWidth="1" />
                        <path d="M 50 50 L 60 88 A 40 40 0 0 1 25 80 Z" fill="#ef4444" opacity="0.6" stroke="#dc2626" strokeWidth="1" />
                        <path d="M 50 50 L 25 80 A 40 40 0 0 1 12 35 Z" fill="#3b82f6" opacity="0.6" stroke="#2563eb" strokeWidth="1" />

                        <line x1="50" x2="50" y1="50" y2="0" stroke="#e2e8f0" opacity="0.5" />
                        <line x1="50" x2="100" y1="50" y2="50" stroke="#e2e8f0" opacity="0.5" />
                        <line x1="50" x2="50" y1="50" y2="100" stroke="#e2e8f0" opacity="0.5" />
                        <line x1="50" x2="0" y1="50" y2="50" stroke="#e2e8f0" opacity="0.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Metrics list */}
                  <div className="space-y-4 pr-2" dir="rtl">
                    {latestReport?.domain_scores ? (() => {
                      const domainColorMap = {
                        resilience: { he: 'חוסן', color: '#FF8F00' },
                        flexibility: { he: 'גמישות', color: '#0BC5EA' },
                        leadership: { he: 'מנהיגות', color: '#FF0000' },
                        communication: { he: 'תקשורת', color: '#FFFC00' },
                        planning: { he: 'תכנון', color: '#25D366' },
                        learning: { he: 'למידה', color: '#9146FF' },
                        vision: { he: 'חזון', color: '#FA1BE4' },
                        tech: { he: 'טכנולוגיה', color: '#6af8f4' },
                        technology: { he: 'טכנולוגיה', color: '#6af8f4' },
                        balance: { he: 'איזון', color: '#25D366' },
                        change: { he: 'ניהול שינוי', color: '#9146FF' },
                        networking: { he: 'נטוורקינג', color: '#0BC5EA' },
                      };
                      const entries = Object.entries(latestReport.domain_scores).slice(0, 8).map(([domain, score]) => {
                        const raw = typeof score === 'object' && score !== null ? (score.score ?? score.percentile ?? 0) : score;
                        const pct = typeof raw === 'number' ? Math.min(100, parseFloat((raw <= 7 ? raw * 100 / 7 : raw).toFixed(1))) : 0;
                        const mapped = domainColorMap[domain.toLowerCase()] || { he: domain, color: '#94a3b8' };
                        return { domain, heLabel: mapped.he, pct, barColor: mapped.color };
                      });
                      return entries.map(({ domain, heLabel, pct, barColor }) => (
                        <div key={domain} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                          <span className="font-medium text-sm flex items-center gap-2 text-slate-800">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: barColor }} />
                            {heLabel}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-500">{pct}%</span>
                            <div className="w-24 h-2 rounded-full overflow-hidden bg-slate-100">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                            </div>
                          </div>
                        </div>
                      ));
                      })() : (
                      <div className="text-center py-8 text-slate-400">
                        <p className="text-sm">השלם שאלון ורכוש דוח כדי לראות את מפת העוצמות</p>
                        <Link to={createPageUrl('Questionnaire')}>
                          <button className="mt-4 text-white px-6 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: '#FF8F00' }}>התחל עכשיו</button>
                        </Link>
                      </div>
                      )}
                      </div>
                </div>
              </section>

              {/* Right Column */}
              <aside className="md:col-span-4 space-y-6">
                {/* Career Paths */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">נתיבי קריירה מומלצים</h2>
                  {latestReport?.archetype ? (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-50 border-r-4 border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer">
                        <h3 className="font-bold text-slate-900 mb-1">{latestReport.archetype}</h3>
                        <p className="text-sm text-slate-500">ארכיטיפ מקצועי מותאם אישית</p>
                      </div>
                      {latestReport.recommended_booster_track && (
                        <div className="p-4 rounded-2xl bg-slate-50 border-r-4 border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
                          <h3 className="font-bold text-slate-900 mb-1">מסלול: {latestReport.recommended_booster_track}</h3>
                          <p className="text-sm text-slate-500">מסלול הבוסטר המומלץ עבורך</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[
                        { title: 'מנהל מוצר טכנולוגי', desc: 'התאמה גבוהה על בסיס מיומנויות תכנון', color: 'border-purple-500 hover:bg-purple-50' },
                        { title: 'יועץ אסטרטגי בכיר', desc: 'התאמה גבוהה על בסיס חזון וניהול שינוי', color: 'border-green-500 hover:bg-green-50' },
                        { title: 'מוביל צוות פיתוח', desc: 'התאמה על בסיס מנהיגות', color: 'border-yellow-500 hover:bg-yellow-50' },
                      ].map((item) => (
                        <div key={item.title} className={`p-4 rounded-2xl bg-slate-50 border-r-4 ${item.color} transition-colors cursor-pointer`}>
                          <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {latestReport && (
                    <Link to={createPageUrl(`ReportView?reportid=${latestReport.id}`)}>
                      <button className="w-full mt-6 text-[#FF8F00] font-bold flex items-center justify-center gap-2 hover:underline text-sm">
                        צפה בדוח המלא ←
                      </button>
                    </Link>
                  )}
                </div>

                {/* Recent Questionnaires */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">פעילויות אחרונות</h2>
                  <div className="space-y-3">
                    {questionnaireResponses.slice(0, 3).length > 0 ? questionnaireResponses.slice(0, 3).map((r) => (
                      <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border-r-4 border-slate-300 hover:bg-slate-100 transition-colors">
                        <h3 className="font-bold text-slate-900 mb-1 text-sm">{getStatusText(r.status)}</h3>
                        <p className="text-xs text-slate-500">{new Date(r.created_date).toLocaleDateString('he-IL')}</p>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-400 text-center py-4">אין פעילויות עדיין</p>
                    )}
                  </div>
                </div>

                {/* Booster if active */}
                {boosterSubscription && (
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FF8F00' }}>
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Booster פעיל</h3>
                        <p className="text-xs text-slate-500">{boosterSubscription.recommended_booster_track}</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                      <div className="h-2 rounded-full" style={{ width: `${(boosterSubscription.current_day / 30) * 100}%`, backgroundColor: '#FF8F00' }} />
                    </div>
                    <p className="text-xs text-slate-400">יום {boosterSubscription.current_day} מתוך 30</p>
                  </div>
                )}
              </aside>
            </div>

            {/* Personal Insights */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">תובנות אישיות</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: TrendingUp, color: 'bg-blue-50 text-blue-600', title: 'מגמת צמיחה', desc: 'היכולת שלך ללמוד ולצמוח מבוססת על נתוני השאלון שלך. מומלץ להתמקד בתחומים שזוהו כחוזקות.' },
                  { icon: UserIcon, color: 'bg-purple-50 text-purple-600', title: 'נטוורקינג פעיל', desc: 'כישורים בין-אישיים חזקים הם נכס מקצועי. כלי הבוסטר יכול לעזור לך למנף זאת לקידום.' },
                  { icon: Zap, color: 'bg-orange-50 text-[#FF8F00]', title: 'איזון חיים-עבודה', desc: 'חיזוק האיזון בין עבודה לחיים אישיים תורם לביצועים ארוכי טווח ולמניעת שחיקה.' },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Promotional Banner */}
            <section className="mt-12 bg-slate-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
              <div className="flex-1 relative z-10">
                <h2 className="text-2xl font-black mb-3">משהו אצלך זז? העבר לחבר וקבל שדרוג מיידי!</h2>
                <p className="text-slate-300 text-base mb-6 leading-relaxed">הרגשת שינוי קטן? הבנת כיוון חדש? עכשיו זה הזמן לקחת את זה צעד קדימה ולעזור גם לחבר להתקדם.</p>
                <div className="flex gap-4 flex-wrap">
                  <Link to={createPageUrl('Questionnaire')}>
                    <button className="text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform text-sm" style={{ backgroundColor: '#FF8F00' }}>שדרג עכשיו</button>
                  </Link>
                  <Link to={createPageUrl('About')}>
                    <button className="border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors text-sm">למד עוד</button>
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-56">
                <div className="aspect-video rounded-2xl bg-slate-800 flex items-center justify-center shadow-xl">
                  <Zap className="w-12 h-12 text-[#FF8F00]" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Questionnaires Tab */}
        {activeTab === 'questionnaires' && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">השאלונים שלי <span className="text-slate-400 font-normal text-lg">({questionnaireResponses.length})</span></h2>
            {questionnaireResponses.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 mb-6">לא מצאנו שאלונים</p>
                <Link to={createPageUrl('Questionnaire')}>
                  <button className="text-white px-8 py-3 rounded-xl font-bold" style={{ backgroundColor: '#FF8F00' }}>התחל שאלון</button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {questionnaireResponses.map((response) => (
                  <div key={response.id} className="p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(response.status)}
                        <span className="font-semibold text-slate-900">{getStatusText(response.status)}</span>
                        <span className="text-sm text-slate-400">—</span>
                        <span className="text-sm text-slate-500">{response.personal_info?.full_name || user?.full_name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">{new Date(response.created_date).toLocaleDateString('he-IL')}</span>
                        <button onClick={() => handleDeleteQuestionnaire(response.id)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {(response.status === 'in_progress' || response.status === 'abandoned') && (
                      <Link to={createPageUrl('Questionnaire')}>
                        <button className="w-full py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">המשך למלא</button>
                      </Link>
                    )}
                    {response.status === 'completed' && (
                      <Link to={createPageUrl(`Completion?responseId=${response.id}`)}>
                        <button className="w-full py-2 rounded-xl text-sm font-bold text-white transition-colors" style={{ backgroundColor: '#FF8F00' }}>צפה באפשרויות רכישה</button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">הדוחות שלי <span className="text-slate-400 font-normal text-lg">({reports.length})</span></h2>
            {/* Debug */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 text-sm">
              <p><strong>מייל מחובר:</strong> {user?.email}</p>
              <p><strong>סה"כ דוחות:</strong> {reports.length}</p>
              {reports.map((r, i) => (
                <p key={i} className="text-xs mt-1">{i + 1}. {r.report_id} | {r.user_email} | נרכש: {r.purchased ? 'כן' : 'לא'}</p>
              ))}
            </div>
            {reports.length === 0 ? (
              <div className="text-center py-16">
                <Award className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">לא מצאנו דוחות</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => {
                  const hasPurchased = report.purchased !== false || user?.has_purchased_full_report || user?.has_purchased_answers_download;
                  return (
                    <div key={report.id} className={`p-5 border rounded-2xl transition-colors ${hasPurchased ? 'border-slate-100 hover:bg-slate-50' : 'bg-orange-50 border-orange-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{report.report_id}</span>
                          {!hasPurchased && <Lock className="w-4 h-4 text-orange-600" />}
                        </div>
                        <span className="text-sm text-slate-400">{new Date(report.created_date).toLocaleDateString('he-IL')}</span>
                      </div>
                      {!hasPurchased ? (
                        <Link to={createPageUrl(`Completion?responseId=${report.questionnaire_response_id}`)}>
                          <button className="w-full py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: '#FF8F00' }}>רכוש דוח</button>
                        </Link>
                      ) : (
                        <Link to={createPageUrl(`ReportView?reportid=${report.id}`)}>
                          <button className="w-full py-2 rounded-xl text-sm font-bold text-white bg-slate-800">צפה בדוח</button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">הקופונים שלי <span className="text-slate-400 font-normal text-lg">({coupons.filter(c => !c.used).length} פעילים)</span></h2>
            {coupons.length === 0 ? (
              <div className="text-center py-16">
                <Gift className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 mb-6">אין לך קופונים</p>
                <Link to={createPageUrl('Survey')}>
                  <button className="border border-slate-200 px-8 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">מלא סקר וקבל קופון</button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className={`p-5 border rounded-2xl ${coupon.used ? 'border-slate-100 opacity-60' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-black text-xl text-slate-900">{coupon.code}</span>
                      <Badge className={coupon.used ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-green-700 border-0 font-bold'}>
                        {coupon.used ? 'נוצל' : 'פעיל'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">הנחה: <strong>{coupon.discount_amount}₪</strong></p>
                    {coupon.valid_until && (
                      <p className="text-xs text-slate-400 mt-1">תוקף עד: {new Date(coupon.valid_until).toLocaleDateString('he-IL')}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">הרכישות שלי <span className="text-slate-400 font-normal text-lg">({paymentOrders.length})</span></h2>
            {paymentOrders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">לא מצאנו הזמנות</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentOrders.map((order) => (
                  <div key={order.id} className={`p-5 border rounded-2xl ${
                    order.status === 'paid' ? 'bg-green-50 border-green-200' :
                    order.status === 'failed' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {order.status === 'paid' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {order.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                        {order.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}
                        <span className="font-semibold text-slate-900">
                          {order.product_type === 'full_report' && 'דו"ח מלא'}
                          {order.product_type === 'answers_download' && 'הורדת תשובות'}
                          {order.product_type === 'online_coaching_7days' && 'ליווי 7 ימים'}
                        </span>
                      </div>
                      <Badge className={
                        order.status === 'paid' ? 'bg-green-600 text-white border-0' :
                        order.status === 'failed' ? 'bg-red-600 text-white border-0' :
                        'bg-yellow-500 text-white border-0'
                      }>
                        {order.status === 'paid' ? 'שולם' : order.status === 'pending' ? 'ממתין' : 'נכשל'}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>סכום: <strong>{order.amount}₪</strong></p>
                      {order.is_express && <p>⚡ אספקה מואצת</p>}
                      {order.coupon_code && <p>קופון: {order.coupon_code}</p>}
                      {order.tranzila_reference && <p className="text-xs text-slate-400">מזהה עסקה: {order.tranzila_reference}</p>}
                      <p className="text-xs text-slate-400">{new Date(order.created_date).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}