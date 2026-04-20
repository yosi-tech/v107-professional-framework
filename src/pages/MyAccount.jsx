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
          let myReports = await base44.entities.GeneratedReport.filter(
            { user_email: currentUser.email, purchased: true }, '-created_date'
          );
          if (myReports.length === 0 && (currentUser.has_purchased_full_report || currentUser.has_purchased_answers_download)) {
            myReports = await base44.entities.GeneratedReport.filter(
              { user_email: currentUser.email }, '-created_date'
            );
          }
          setReports(myReports);
        } catch (e) {
          console.error('Error fetching reports:', e);
        }

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
                  {/* SVG Pie Chart */}
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-[400px] aspect-square">
                      {latestReport?.domain_scores ? (() => {
                        const domainColorMap = {
                          resilience: '#FF8F00', flexibility: '#0BC5EA', leadership: '#FF0000',
                          communication: '#FFFC00', planning: '#25D366', learning: '#9146FF',
                          vision: '#FA1BE4', tech: '#6af8f4', technology: '#6af8f4',
                          balance: '#25D366', change: '#9146FF', networking: '#0BC5EA',
                        };
                        const entries = Object.entries(latestReport.domain_scores).slice(0, 8);
                        const total = entries.reduce((sum, [, s]) => {
                          const raw = typeof s === 'object' && s !== null ? (s.score ?? s.percentile ?? 0) : s;
                          return sum + (typeof raw === 'number' ? (raw <= 7 ? raw * 100 / 7 : raw) : 0);
                        }, 0);
                        let cumAngle = 0;
                        const slices = entries.map(([domain, s]) => {
                          const raw = typeof s === 'object' && s !== null ? (s.score ?? s.percentile ?? 0) : s;
                          const pct = typeof raw === 'number' ? (raw <= 7 ? raw * 100 / 7 : raw) : 0;
                          const angle = total > 0 ? (pct / total) * 360 : 45;
                          const startAngle = cumAngle;
                          cumAngle += angle;
                          const color = domainColorMap[domain.toLowerCase()] || '#94a3b8';
                          return { domain, startAngle, angle, color };
                        });
                        const toRad = (deg) => (deg - 90) * Math.PI / 180;
                        const cx = 50, cy = 50, r = 40;
                        return (
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="none" r="10" stroke="#e2e8f0" strokeDasharray="2 2" />
                            <circle cx="50" cy="50" fill="none" r="20" stroke="#e2e8f0" strokeDasharray="2 2" />
                            <circle cx="50" cy="50" fill="none" r="30" stroke="#e2e8f0" strokeDasharray="2 2" />
                            <circle cx="50" cy="50" fill="none" r="40" stroke="#e2e8f0" strokeDasharray="2 2" />
                            <circle cx="50" cy="50" fill="none" r="50" stroke="#e2e8f0" strokeWidth="0.5" />
                            {slices.map(({ domain, startAngle, angle, color }) => {
                              const largeArc = angle > 180 ? 1 : 0;
                              const x1 = cx + r * Math.cos(toRad(startAngle));
                              const y1 = cy + r * Math.sin(toRad(startAngle));
                              const x2 = cx + r * Math.cos(toRad(startAngle + angle));
                              const y2 = cy + r * Math.sin(toRad(startAngle + angle));
                              return (
                                <path
                                  key={domain}
                                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                  fill={color}
                                  opacity="0.7"
                                  stroke="white"
                                  strokeWidth="0.5"
                                />
                              );
                            })}
                            <line x1="50" x2="50" y1="50" y2="0" stroke="#e2e8f0" opacity="0.5" />
                            <line x1="50" x2="100" y1="50" y2="50" stroke="#e2e8f0" opacity="0.5" />
                            <line x1="50" x2="50" y1="50" y2="100" stroke="#e2e8f0" opacity="0.5" />
                            <line x1="50" x2="0" y1="50" y2="50" stroke="#e2e8f0" opacity="0.5" />
                          </svg>
                        );
                      })() : (
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" fill="none" r="40" stroke="#e2e8f0" strokeDasharray="2 2" />
                          <circle cx="50" cy="50" fill="none" r="50" stroke="#e2e8f0" strokeWidth="0.5" />
                          <text x="50" y="52" textAnchor="middle" fill="#94a3b8" fontSize="6">אין נתונים</text>
                        </svg>
                      )}
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
                  {(() => {
                    const recs = [];
                    if (Array.isArray(latestReport?.focused_recommendations) && latestReport.focused_recommendations.length > 0) {
                      latestReport.focused_recommendations.slice(0, 4).forEach(rec => {
                        let parsed = rec;
                        if (typeof rec === 'string') {
                          try { parsed = JSON.parse(rec); } catch (e) { return; }
                        }
                        if (typeof parsed === 'object' && parsed.title) {
                          recs.push(parsed);
                        }
                      });
                    }

                    if (recs.length === 0) {
                      return (
                        <div className="text-center py-8 text-slate-400">
                          <Compass className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                          <p className="text-sm">נתיבי הקריירה שלך יופיעו כאן לאחר הפקת הדוח</p>
                          <Link to={createPageUrl('Questionnaire')}>
                            <button className="mt-4 text-white px-6 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: '#FF8F00' }}>התחל עכשיו</button>
                          </Link>
                        </div>
                      );
                    }

                    const colors = ['border-purple-500 hover:bg-purple-50', 'border-green-500 hover:bg-green-50', 'border-yellow-500 hover:bg-yellow-50', 'border-blue-500 hover:bg-blue-50'];
                    return (
                      <>
                        <div className="space-y-3">
                          {recs.map((rec, i) => (
                            <Link key={i} to="/CareerPaths">
                              <div className={`p-4 rounded-2xl bg-slate-50 border-r-4 ${colors[i % colors.length]} transition-colors cursor-pointer`}>
                                <h3 className="font-bold text-slate-900 text-sm">{rec.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                  {rec.salary_range && <span className="text-xs text-slate-500">{rec.salary_range}</span>}
                                  {rec.match_percentage && <span className="text-xs text-[#FF8F00] font-bold">{rec.match_percentage}% התאמה</span>}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <Link to="/CareerPaths">
                          <button className="w-full mt-6 text-[#FF8F00] font-bold flex items-center justify-center gap-2 hover:underline text-sm">
                            לצפייה בנתיבי קריירה ←
                          </button>
                        </Link>
                      </>
                    );
                  })()}
                </div>

                {/* Recent Activities - unified feed */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">פעילויות אחרונות</h2>
                  <div className="space-y-3">
                    {(() => {
                      const activities = [
                        ...questionnaireResponses.map(r => ({
                          id: 'q-' + r.id,
                          type: 'questionnaire',
                          status: r.status,
                          date: r.created_date,
                          label: r.status === 'completed' ? 'שאלון הושלם' : r.status === 'in_progress' ? 'שאלון בתהליך' : 'שאלון נזנח',
                          icon: r.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-600" /> : r.status === 'in_progress' ? <Clock className="w-4 h-4 text-blue-600" /> : <AlertCircle className="w-4 h-4 text-orange-500" />,
                          borderColor: r.status === 'completed' ? 'border-green-400' : r.status === 'in_progress' ? 'border-blue-400' : 'border-orange-400',
                          link: r.status === 'completed'
                            ? createPageUrl(`Completion?responseId=${r.id}`)
                            : (r.status === 'in_progress' || r.status === 'abandoned') ? createPageUrl('Questionnaire') : null,
                          actionLabel: r.status === 'completed' ? 'צפה באפשרויות' : (r.status === 'in_progress' || r.status === 'abandoned') ? 'המשך למלא' : null,
                        })),
                        ...reports.map(r => ({
                          id: 'r-' + r.id,
                          type: 'report',
                          date: r.created_date,
                          label: `דוח ${r.report_id || 'מקצועי'}`,
                          icon: <Award className="w-4 h-4 text-purple-600" />,
                          borderColor: 'border-purple-400',
                          link: (r.purchased !== false || user?.has_purchased_full_report || user?.has_purchased_answers_download)
                            ? createPageUrl(`ReportView?reportid=${r.id}`)
                            : createPageUrl(`Completion?responseId=${r.questionnaire_response_id}`),
                          actionLabel: (r.purchased !== false || user?.has_purchased_full_report || user?.has_purchased_answers_download) ? 'צפה בדוח' : 'רכוש דוח',
                        })),
                        ...paymentOrders.filter(o => o.status === 'paid').map(o => ({
                          id: 'o-' + o.id,
                          type: 'order',
                          date: o.created_date,
                          label: o.product_type === 'full_report' ? 'רכישת דוח מלא' : o.product_type === 'answers_download' ? 'רכישת הורדת תשובות' : 'רכישת ליווי',
                          icon: <ShoppingCart className="w-4 h-4 text-green-600" />,
                          borderColor: 'border-green-400',
                          link: null,
                          actionLabel: null,
                        })),
                      ];
                      activities.sort((a, b) => new Date(b.date) - new Date(a.date));
                      const topActivities = activities.slice(0, 5);
                      if (topActivities.length === 0) return <p className="text-sm text-slate-400 text-center py-4">אין פעילויות עדיין</p>;
                      return topActivities.map(a => (
                        <div key={a.id} className={`p-4 rounded-2xl bg-slate-50 border-r-4 ${a.borderColor} hover:bg-slate-100 transition-colors`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {a.icon}
                              <h3 className="font-bold text-slate-900 text-sm">{a.label}</h3>
                            </div>
                            <p className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString('he-IL')}</p>
                          </div>
                          {a.link && a.actionLabel && (
                            <Link to={a.link}>
                              <button className="mt-2 w-full text-center text-xs font-bold text-[#FF8F00] hover:underline">{a.actionLabel} ←</button>
                            </Link>
                          )}
                        </div>
                      ));
                    })()}
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