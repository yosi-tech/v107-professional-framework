import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, FileText, Award, ShoppingCart, Gift,
  CheckCircle, Clock, LogOut, User as UserIcon, AlertCircle,
  Lock, Rocket, Trash2, LayoutDashboard, Settings, TrendingUp, Brain, Zap, Upload
} from 'lucide-react';
import { useTranslation } from '@/components/i18n/useTranslation';
import { Link as RouterLink } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
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
    <div className="min-h-screen bg-slate-50" dir="rtl">

      {/* Sidebar */}
      <aside className="bg-white text-slate-700 font-medium h-screen w-64 fixed right-0 top-0 z-40 hidden lg:flex flex-col py-8 px-4 pt-24 border-l border-slate-100 shadow-sm">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#FF8F00] flex items-center justify-center text-white flex-shrink-0">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{user?.full_name || 'שלום'}</h3>
              <p className="text-xs text-slate-500 truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
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
          ))}
        </nav>

        <div className="px-2 space-y-2">
          <Link to={createPageUrl('Questionnaire')} className="block">
            <button className="w-full text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform text-sm" style={{ backgroundColor: '#FF8F00' }}>
              התחל מיפוי חדש
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            התנתק
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64 pt-8 pb-24 px-4 md:px-12 max-w-7xl mx-auto w-full">

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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Stats Overview */}
            <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'שאלונים', value: questionnaireResponses.length, icon: FileText, color: 'blue' },
                { label: 'דוחות', value: reports.length, icon: Award, color: 'green' },
                { label: 'קופונים פעילים', value: coupons.filter(c => !c.used).length, icon: Gift, color: 'purple' },
                { label: 'רכישות', value: paymentOrders.filter(o => o.status === 'paid').length, icon: ShoppingCart, color: 'orange' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    color === 'green' ? 'bg-green-50 text-green-600' :
                    color === 'purple' ? 'bg-purple-50 text-purple-600' :
                    'bg-orange-50 text-[#FF8F00]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
                  <div className="text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>

            {/* Domain Scores from latest report */}
            {latestReport?.domain_scores && (
              <section className="md:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">מפת עוצמות</h2>
                  <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-bold">דאטה מעודכן</span>
                </div>
                <div className="space-y-4">
                  {Object.entries(latestReport.domain_scores).slice(0, 8).map(([domain, score]) => {
                    const rawScore = typeof score === 'object' && score !== null ? (score.score ?? score.percentile ?? 0) : score;
                    const pct = typeof rawScore === 'number' ? Math.min(100, Math.round(rawScore <= 7 ? rawScore * 100 / 7 : rawScore)) : 0;
                    const isHigh = pct >= 75;
                    return (
                      <div key={domain} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                        <span className="text-slate-800 font-medium text-sm">{domain}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-400">{pct}%</span>
                          <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isHigh ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : 'bg-red-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Booster Subscription */}
            {boosterSubscription && (
              <section className="md:col-span-4 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FF8F00' }}>
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">מסלול Booster</h3>
                    <p className="text-xs text-slate-500">פעיל</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">מסלול</span>
                    <Badge className="bg-orange-100 text-[#FF8F00] border-0 font-bold">
                      {boosterSubscription.recommended_booster_track}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">יום נוכחי</span>
                    <span className="font-black text-2xl text-slate-900">{boosterSubscription.current_day} <span className="text-sm text-slate-400 font-normal">/ 30</span></span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{ width: `${(boosterSubscription.current_day / 30) * 100}%`, backgroundColor: '#FF8F00' }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 text-center">המיילים היומיים נשלחים אוטומטית</p>
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section className="md:col-span-12 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">פעולות מהירות</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to={createPageUrl('Questionnaire')}>
                  <div className="p-6 rounded-2xl border border-slate-200 hover:border-[#FF8F00] hover:bg-orange-50 transition-all cursor-pointer group">
                    <FileText className="w-8 h-8 text-[#FF8F00] mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">מיפוי חדש</h3>
                    <p className="text-sm text-slate-500">התחל שאלון חדש וקבל דוח מעודכן</p>
                  </div>
                </Link>
                <Link to={createPageUrl('Survey')}>
                  <div className="p-6 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group">
                    <Gift className="w-8 h-8 text-purple-500 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">קבל קופון</h3>
                    <p className="text-sm text-slate-500">מלא סקר קצר וקבל הנחה</p>
                  </div>
                </Link>
                {latestReport && (
                  <Link to={createPageUrl(`ReportView?reportid=${latestReport.id}`)}>
                    <div className="p-6 rounded-2xl border border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group">
                      <Award className="w-8 h-8 text-green-500 mb-3" />
                      <h3 className="font-bold text-slate-900 mb-1">הדוח שלי</h3>
                      <p className="text-sm text-slate-500">צפה בדוח המקצועי המלא</p>
                    </div>
                  </Link>
                )}
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