import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Award, ShoppingCart, Gift, CheckCircle, Clock, LogOut, User as UserIcon, AlertCircle, Lock, Rocket, Trash2 } from 'lucide-react';
import { useTranslation } from '@/components/i18n/useTranslation';

export default function MyAccount() {
  const { language } = useTranslation();
  const navigate = useNavigate();
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

        // טען שאלונים
        const responses = await base44.entities.QuestionnaireResponse.filter(
          { created_by: currentUser.email },
          '-updated_date'
        );
        setQuestionnaireResponses(responses);

        // טען דוחות - סינון לפי user_email ורכישה
        try {
          const allReports = await base44.entities.GeneratedReport.list('-created_date');
          const myReports = allReports.filter(report => 
            report.user_email === currentUser.email && 
            (report.purchased === true || currentUser.has_purchased_full_report || currentUser.has_purchased_answers_download)
          );
          setReports(myReports);
        } catch (e) {
          // No reports found
        }

        // טען סקרים
        try {
          const surveys = await base44.entities.SurveyResponse.filter(
            { created_by: currentUser.email },
            '-created_date'
          );
          setSurveyResponses(surveys);
        } catch (e) {
          // No surveys found
        }

        // טען קופונים
        try {
          const userCoupons = await base44.entities.Coupon.filter(
            { user_email: currentUser.email },
            '-created_date'
          );
          setCoupons(userCoupons);
        } catch (e) {
          // No coupons found
        }

        // טען מנוי בוסטר
        try {
          const subscriptions = await base44.entities.OnlineCoachingSubscription.filter(
            { user_email: currentUser.email, status: 'active' },
            '-created_date'
          );
          if (subscriptions.length > 0) {
            setBoosterSubscription(subscriptions[0]);
          }
        } catch (e) {
          // No booster subscription found
        }

        // טען הזמנות תשלום
        try {
          const orders = await base44.entities.PaymentOrder.filter(
            { user_email: currentUser.email },
            '-created_date'
          );
          setPaymentOrders(orders);
        } catch (e) {
          // No payment orders found
        }

      } catch (error) {
        console.error('Error loading user data:', error);
        // הפנה להתחברות אם אין משתמש מחובר
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const handleDeleteQuestionnaire = async (questionnaireId) => {
    const confirmDelete = window.confirm(
      language === 'he' 
        ? 'האם אתה בטוח שברצונך למחוק את השאלון? לא ניתן לשחזר אותו.'
        : 'Are you sure you want to delete this questionnaire? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      await base44.entities.QuestionnaireResponse.delete(questionnaireId);
      setQuestionnaireResponses(prev => prev.filter(q => q.id !== questionnaireId));
    } catch (error) {
      alert(language === 'he' ? 'שגיאה במחיקת השאלון' : 'Error deleting questionnaire');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'abandoned':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    if (language === 'he') {
      switch (status) {
        case 'completed': return 'הושלם';
        case 'in_progress': return 'בתהליך';
        case 'abandoned': return 'נזנח';
        default: return status;
      }
    } else {
      switch (status) {
        case 'completed': return 'Completed';
        case 'in_progress': return 'In Progress';
        case 'abandoned': return 'Abandoned';
        default: return status;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4 flex justify-center items-center" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            {language === 'he' ? 'טוען נתונים...' : 'Loading data...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <UserIcon className="w-8 h-8 text-blue-600" />
              {language === 'he' ? 'האזור האישי שלי' : 'My Account'}
            </h1>
            <p className="text-gray-600 mt-2">
              {language === 'he' ? `שלום, ${user?.full_name || user?.email}` : `Hello, ${user?.full_name || user?.email}`}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className={`w-4 h-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
            {language === 'he' ? 'התנתק' : 'Logout'}
          </Button>
        </div>

        {/* מנוי בוסטר פעיל */}
        {boosterSubscription && (
          <Card className="shadow-lg mb-6 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-purple-600" />
                {language === 'he' ? '🚀 מסלול הבוסטר שלך פעיל!' : '🚀 Your Booster Track is Active!'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'he' ? 'מסלול:' : 'Track:'}
                  </span>
                  <Badge className="bg-purple-600 text-white">
                    {boosterSubscription.recommended_booster_track}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'he' ? 'יום נוכחי:' : 'Current Day:'}
                  </span>
                  <span className="font-bold text-lg text-purple-700">
                    {boosterSubscription.current_day} / 7
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                    style={{ width: `${(boosterSubscription.current_day / 7) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 text-center mt-2">
                  {language === 'he' 
                    ? 'המיילים היומיים נשלחים אוטומטית למייל שלך'
                    : 'Daily emails are sent automatically to your email'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* פעולות מהירות */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>
              {language === 'he' ? 'פעולות מהירות' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to={createPageUrl('Questionnaire')}>
                <Button className="w-full" variant="outline">
                  <FileText className={`w-4 h-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'he' ? 'מלא שאלון חדש' : 'New Questionnaire'}
                </Button>
              </Link>
              <Link to={createPageUrl('Survey')}>
                <Button className="w-full" variant="outline">
                  <Gift className={`w-4 h-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'he' ? 'מלא סקר לקופון' : 'Fill Survey for Coupon'}
                </Button>
              </Link>
              <Link to={createPageUrl('Home')}>
                <Button className="w-full" variant="outline">
                  {language === 'he' ? 'חזור לדף הבית' : 'Back to Home'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* שאלונים */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {language === 'he' ? 'השאלונים שלי' : 'My Questionnaires'}
              </CardTitle>
              <CardDescription>
                {language === 'he' 
                  ? `${questionnaireResponses.length} שאלונים` 
                  : `${questionnaireResponses.length} questionnaires`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questionnaireResponses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    {language === 'he' ? 'לא מצאנו שאלונים' : 'No questionnaires found'}
                  </p>
                  <Link to={createPageUrl('Questionnaire')}>
                    <Button>
                      {language === 'he' ? 'התחל שאלון חדש' : 'Start New Questionnaire'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {questionnaireResponses.map((response) => (
                    <div
                      key={response.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(response.status)}
                          <span className="font-medium">{getStatusText(response.status)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {new Date(response.created_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                          </span>
                          <button
                            onClick={() => handleDeleteQuestionnaire(response.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors text-red-600"
                            title={language === 'he' ? 'מחק שאלון' : 'Delete questionnaire'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {response.personal_info?.full_name || user?.full_name}
                      </p>
                      {(response.status === 'in_progress' || response.status === 'abandoned') && (
                        <Link to={createPageUrl('Questionnaire')}>
                          <Button size="sm" variant="outline" className="w-full">
                            {language === 'he' ? 'המשך למלא' : 'Continue'}
                          </Button>
                        </Link>
                      )}
                      {response.status === 'completed' && (
                        <Link to={createPageUrl(`Completion?responseId=${response.id}`)}>
                          <Button size="sm" variant="outline" className="w-full">
                            {language === 'he' ? 'צפה באפשרויות רכישה' : 'View Purchase Options'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* דוחות */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  {language === 'he' ? 'הדוחות שלי' : 'My Reports'}
                </CardTitle>
                <CardDescription>
                  {language === 'he' 
                    ? `${reports.length} דוחות` 
                    : `${reports.length} reports`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Debug Info */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                  <p className="text-sm"><strong>מייל מחובר:</strong> {user?.email}</p>
                  <p className="text-sm"><strong>סה"כ דוחות שנמצאו:</strong> {reports.length}</p>
                  {reports.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold">פרטי דוחות:</p>
                      {reports.map((r, idx) => (
                        <p key={idx} className="text-xs">
                          {idx + 1}. {r.report_id} - מייל: {r.user_email} - נרכש: {r.purchased ? 'כן' : 'לא'}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'he' ? 'לא מצאנו דוחות' : 'No reports found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => {
                    const hasPurchased = (report.purchased !== false) || user?.has_purchased_full_report || user?.has_purchased_answers_download;
                    
                    return (
                      <div
                        key={report.id}
                        className={`p-4 border rounded-lg transition-colors ${hasPurchased ? 'hover:bg-gray-50' : 'bg-orange-50 border-orange-200'}`}
                      >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{report.report_id}</span>
                          {!hasPurchased && (
                            <Lock className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(report.created_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                        </span>
                      </div>
                      {!hasPurchased ? (
                        <Link to={createPageUrl(`Completion?responseId=${report.questionnaire_response_id}`)}>
                          <Button size="sm" className="w-full mt-2 bg-orange-600 hover:bg-orange-700">
                            <ShoppingCart className={`w-4 h-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                            {language === 'he' ? 'רכוש דוח' : 'Purchase Report'}
                          </Button>
                        </Link>
                      ) : (
                        <Link to={createPageUrl(`ReportView?reportid=${report.id}`)}>
                          <Button size="sm" className="w-full mt-2">
                            {language === 'he' ? 'צפה בדוח' : 'View Report'}
                          </Button>
                        </Link>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* קופונים */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" />
                {language === 'he' ? 'הקופונים שלי' : 'My Coupons'}
              </CardTitle>
              <CardDescription>
                {language === 'he' 
                  ? `${coupons.filter(c => !c.used).length} קופונים פעילים` 
                  : `${coupons.filter(c => !c.used).length} active coupons`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coupons.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    {language === 'he' ? 'אין לך קופונים' : 'No coupons found'}
                  </p>
                  <Link to={createPageUrl('Survey')}>
                    <Button variant="outline">
                      {language === 'he' ? 'מלא סקר וקבל קופון' : 'Fill Survey for Coupon'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className={`p-4 border rounded-lg ${coupon.used ? 'bg-gray-50 opacity-60' : 'bg-green-50 border-green-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-lg">{coupon.code}</span>
                        {coupon.used ? (
                          <span className="text-sm text-gray-500">
                            {language === 'he' ? 'נוצל' : 'Used'}
                          </span>
                        ) : (
                          <span className="text-sm text-green-600 font-semibold">
                            {language === 'he' ? 'פעיל' : 'Active'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === 'he' ? 'הנחה:' : 'Discount:'} {coupon.discount_amount}₪
                      </p>
                      {coupon.valid_until && (
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'he' ? 'תוקף עד:' : 'Valid until:'} {new Date(coupon.valid_until).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* סקרים */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
                {language === 'he' ? 'הסקרים שלי' : 'My Surveys'}
              </CardTitle>
              <CardDescription>
                {language === 'he' 
                  ? `${surveyResponses.length} סקרים` 
                  : `${surveyResponses.length} surveys`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {surveyResponses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'he' ? 'לא מצאנו סקרים' : 'No surveys found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {surveyResponses.map((survey) => (
                    <div
                      key={survey.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {language === 'he' ? 'סקר נטישה' : 'Abandonment Survey'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(survey.created_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                        </span>
                      </div>
                      {survey.coupon_code && (
                        <p className="text-sm text-gray-600">
                          {language === 'he' ? 'קוד קופון:' : 'Coupon code:'} <span className="font-mono font-semibold">{survey.coupon_code}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* הזמנות תשלום */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                {language === 'he' ? 'הרכישות שלי' : 'My Purchases'}
              </CardTitle>
              <CardDescription>
                {language === 'he' 
                  ? `${paymentOrders.length} הזמנות` 
                  : `${paymentOrders.length} orders`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'he' ? 'לא מצאנו הזמנות' : 'No orders found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        order.status === 'paid' ? 'bg-green-50 border-green-200' : 
                        order.status === 'failed' ? 'bg-red-50 border-red-200' : 
                        'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {order.status === 'paid' && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {order.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                          {order.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}
                          <span className="font-medium">
                            {order.product_type === 'full_report' && (language === 'he' ? 'דו"ח מלא' : 'Full Report')}
                            {order.product_type === 'answers_download' && (language === 'he' ? 'הורדת תשובות' : 'Answers Download')}
                            {order.product_type === 'online_coaching_7days' && (language === 'he' ? 'ליווי 7 ימים' : '7-day Coaching')}
                          </span>
                        </div>
                        <Badge className={
                          order.status === 'paid' ? 'bg-green-600' : 
                          order.status === 'failed' ? 'bg-red-600' : 
                          'bg-yellow-600'
                        }>
                          {order.status === 'paid' && (language === 'he' ? 'שולם' : 'Paid')}
                          {order.status === 'pending' && (language === 'he' ? 'ממתין' : 'Pending')}
                          {order.status === 'failed' && (language === 'he' ? 'נכשל' : 'Failed')}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{language === 'he' ? 'סכום:' : 'Amount:'} {order.amount}₪</p>
                        {order.is_express && <p>{language === 'he' ? '⚡ אספקה מואצת' : '⚡ Express Delivery'}</p>}
                        {order.coupon_code && <p>{language === 'he' ? 'קופון:' : 'Coupon:'} {order.coupon_code}</p>}
                        {order.tranzila_reference && <p>{language === 'he' ? 'מזהה עסקה:' : 'Transaction ID:'} {order.tranzila_reference}</p>}
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}