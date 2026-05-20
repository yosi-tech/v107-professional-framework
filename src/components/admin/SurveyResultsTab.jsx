import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSearch, AlertCircle, DollarSign } from "lucide-react";
import UnifiedSurveyChart from "@/components/admin/UnifiedSurveyChart";

export default function SurveyResultsTab({ surveyResponses }) {
  const abandonmentSurveys = surveyResponses.filter(s => s.survey_type === 'abandonment');
  const boosterFeedbacks = surveyResponses.filter(s => s.survey_type === 'booster_feedback');

  return (
    <Tabs defaultValue="abandonment" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="abandonment">סקר נטישת שאלון ({abandonmentSurveys.length})</TabsTrigger>
        <TabsTrigger value="booster_feedback">משוב בוסטר ({boosterFeedbacks.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="abandonment">
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 text-right">סה"כ סקרי נטישה</CardTitle>
                <FileSearch className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right text-purple-600">{abandonmentSurveys.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 text-right">סיבת נטישה מובילה</CardTitle>
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold text-right">
                  {(() => {
                    const q1 = abandonmentSurveys.map(s => s.responses?.q1).filter(Boolean);
                    if (!q1.length) return 'אין נתונים';
                    const c = {}; q1.forEach(r => { c[r] = (c[r]||0)+1; });
                    const top = Object.entries(c).sort((a,b) => b[1]-a[1])[0];
                    return top ? `${top[0]} (${top[1]})` : 'אין נתונים';
                  })()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 text-right">טווח מחיר מועדף</CardTitle>
                <DollarSign className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold text-right">
                  {(() => {
                    const q2 = abandonmentSurveys.map(s => s.responses?.q2).filter(Boolean);
                    if (!q2.length) return 'אין נתונים';
                    const c = {}; q2.forEach(r => { c[r] = (c[r]||0)+1; });
                    const top = Object.entries(c).sort((a,b) => b[1]-a[1])[0];
                    return top ? `${top[0]} (${top[1]})` : 'אין נתונים';
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>

          <UnifiedSurveyChart surveyResponses={abandonmentSurveys} />

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-right">הערות והצעות לשיפור</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {abandonmentSurveys.filter(s => s.responses?.q4).map(survey => (
                  <div key={survey.id} className="bg-white p-4 rounded-lg border-r-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-900 mb-2 text-right">{survey.responses.q4}</p>
                    <p className="text-xs text-gray-500 text-right">{survey.user_email || survey.created_by} • {new Date(survey.created_date).toLocaleDateString('he-IL')}</p>
                  </div>
                ))}
                {abandonmentSurveys.filter(s => s.responses?.q4).length === 0 && <div className="text-center py-8"><p className="text-gray-500 text-sm">אין הערות נוספות</p></div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-right">תשובות בודדות ({abandonmentSurveys.length})</CardTitle></CardHeader>
            <CardContent>
              {abandonmentSurveys.length === 0 ? (
                <div className="text-center py-12"><FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 text-lg">אין עדיין תוצאות סקר נטישה</p></div>
              ) : (
                <div className="space-y-4">
                  {abandonmentSurveys.map(survey => (
                    <Card key={survey.id} className="border-r-4 border-r-purple-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4 flex-row-reverse">
                          <div className="text-right flex-1">
                            <p className="font-semibold text-gray-900">{survey.user_email || survey.created_by || 'משתמש'}</p>
                            <p className="text-sm text-gray-500">{new Date(survey.created_date).toLocaleDateString('he-IL', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
                            {survey.coupon_code && <div className="mt-2 inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">קופון: {survey.coupon_code}</div>}
                          </div>
                        </div>
                        <div className="space-y-4 text-right" dir="rtl">
                          {survey.responses.q1 && <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-gray-700 mb-2">מה הסיבה העיקרית שבחרת שלא לרכוש את הדו"ח עכשיו?</p><p className="text-gray-900">{survey.responses.q1}</p></div>}
                          {survey.responses.q2 && <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-gray-700 mb-2">באיזה מחיר היית שוקל/ת לרכוש את הדו"ח המלא?</p><p className="text-gray-900">{survey.responses.q2}</p></div>}
                          {survey.responses.q3 && <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm font-semibold text-gray-700 mb-2">מה היה יכול לשכנע אותך לרכוש את הדו"ח?</p><p className="text-gray-900">{survey.responses.q3}</p></div>}
                          {survey.responses.q4 && <div className="bg-blue-50 p-4 rounded-lg border border-blue-200"><p className="text-sm font-semibold text-blue-900 mb-2">הערות והצעות לשיפור:</p><p className="text-blue-900">{survey.responses.q4}</p></div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="booster_feedback">
        <div className="space-y-4">
          {boosterFeedbacks.length === 0 ? (
            <Card><CardContent className="p-12 text-center"><p className="text-gray-500">אין משובי בוסטר להצגה</p></CardContent></Card>
          ) : (
            <div className="grid gap-4">
              {boosterFeedbacks.map(survey => (
                <Card key={survey.id} className="border-r-4 border-r-pink-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{survey.responses?.user_name}</h3>
                        <p className="text-sm text-gray-600">{survey.responses?.user_email}</p>
                      </div>
                      <Badge variant={survey.responses?.experienced_improvement ? 'default' : 'destructive'} className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                        {survey.responses?.experienced_improvement ? '✓ חש שיפור' : '✗ לא חש שיפור'}
                      </Badge>
                    </div>
                    {survey.responses?.booster_track && <div className="mb-3"><span className="text-sm text-gray-600">מסלול: </span><Badge variant="outline" className="bg-purple-50 text-purple-700">{({'execution':'ביצוע','digital':'דיגיטל','finance':'פיננסים','marketing':'שיווק','management':'ניהול','vision':'חזון'})[survey.responses.booster_track]}</Badge></div>}
                    {survey.responses?.feedback_text && <div className="bg-gray-50 rounded-lg p-4 mt-3"><p className="text-sm font-semibold text-gray-700 mb-2">משוב:</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{survey.responses.feedback_text}</p></div>}
                    <div className="text-xs text-gray-400 mt-3 text-right">{new Date(survey.created_date).toLocaleDateString('he-IL', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}