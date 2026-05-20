import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Edit3, Trash2, Mail } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function BoostersTab({ boosterSubscriptions, emailLogs, onViewEmails, onOpenRegistration, onReload }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="text-right">
          <CardTitle className="text-right">מנויי בוסטר</CardTitle>
          <p className="text-gray-600 text-sm mt-1 text-right">ניהול הרשמות לתוכניות הבוסטר ל-30 ימים</p>
        </div>
        <Button onClick={onOpenRegistration} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 flex-row-reverse"><span>רישום ידני לבוסטר</span><Rocket className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent>
        {boosterSubscriptions.length === 0 ? (
          <div className="text-center py-12"><Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">אין מנויי בוסטר עדיין</p></div>
        ) : (
          <div className="space-y-3">
            {boosterSubscriptions.sort((a,b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()).map((subscription) => {
              const trackInfo = { execution:{name:'ביצוע',icon:'⚡',color:'blue'}, digital:{name:'דיגיטל',icon:'💻',color:'purple'}, finance:{name:'פיננסים',icon:'💰',color:'green'}, marketing:{name:'שיווק',icon:'📢',color:'orange'}, management:{name:'ניהול',icon:'👥',color:'indigo'}, vision:{name:'חזון',icon:'🎯',color:'pink'} };
              const track = trackInfo[subscription.recommended_booster_track] || trackInfo.execution;
              const daysLeft = Math.max(0, 7 - subscription.current_day + 1);
              return (
                <Card key={subscription.id} className={`border-2 ${subscription.status==='active'?'border-blue-300 bg-blue-50':subscription.status==='completed'?'border-green-300 bg-green-50':subscription.status==='cancelled'?'border-red-300 bg-red-50':'border-gray-300 bg-gray-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-row-reverse">
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-2 mb-2 flex-row-reverse"><h4 className="font-bold text-base">{subscription.user_name}</h4><span className="text-2xl">{track.icon}</span></div>
                        <p className="text-sm text-gray-600 mb-2">{subscription.user_email}</p>
                        <div className="flex gap-2 flex-wrap justify-end mb-3">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">מסלול {track.name}</Badge>
                          {subscription.status==='active' && <Badge className="bg-green-100 text-green-800 text-xs">יום {subscription.current_day}/7</Badge>}
                          <Badge variant="outline" className={`text-xs ${subscription.status==='active'?'bg-green-50 text-green-700 border-green-300':subscription.status==='completed'?'bg-blue-50 text-blue-700 border-blue-300':subscription.status==='cancelled'?'bg-red-50 text-red-700 border-red-300':subscription.status==='upgraded'?'bg-purple-50 text-purple-700 border-purple-300':'bg-gray-50 text-gray-700 border-gray-300'}`}>
                            {subscription.status==='active'&&'✓ פעיל'}{subscription.status==='completed'&&'✓ הושלם'}{subscription.status==='cancelled'&&'✗ בוטל'}{subscription.status==='upgraded'&&'⬆ שודרג'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{subscription.language==='he'?'🇮🇱 עברית':'🇬🇧 English'}</Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>התחלה: {format(new Date(subscription.start_date), 'dd/MM/yyyy')}</div>
                          <div>סיום: {format(new Date(subscription.end_date), 'dd/MM/yyyy')}</div>
                          {subscription.last_email_sent_date && <div>מייל אחרון: {format(new Date(subscription.last_email_sent_date), 'dd/MM/yyyy HH:mm')}</div>}
                          {subscription.status==='active' && <div className="font-semibold text-orange-600">נותרו {daysLeft} ימים</div>}
                          {subscription.experienced_improvement !== undefined && <div className={subscription.experienced_improvement?'text-green-700 font-semibold':'text-red-700'}>{subscription.experienced_improvement?'✓ חש שיפור':'✗ לא חש שיפור'}</div>}
                          {subscription.feedback_text && <div className="bg-white p-2 rounded mt-2 border"><span className="font-semibold">משוב: </span>{subscription.feedback_text}</div>}
                          {(() => { const be=emailLogs.filter(l=>l.email_type==='booster_email'&&l.to_email===subscription.user_email); return be.length>0 && <div className="mt-2"><Button variant="outline" size="sm" onClick={()=>onViewEmails(be)} className="bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200 flex items-center gap-1 flex-row-reverse text-xs h-6 px-2"><Mail className="w-3 h-3" />{be.length} מיילי בוסטר נשלחו</Button></div>; })()}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={createPageUrl(`AdminBoosterTasks?subscriptionId=${subscription.id}`)}><Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 flex-row-reverse justify-center"><span>צפה ב-30 המשימות</span><Edit3 className="w-4 h-4" /></Button></Link>
                        {subscription.status==='active' && <>
                          <Button size="sm" variant="outline" onClick={async()=>{if(window.confirm('האם לבטל את המנוי?')){await base44.entities.OnlineCoachingSubscription.update(subscription.id,{status:'cancelled'});onReload();alert('המנוי בוטל בהצלחה');}}} className="text-orange-600 hover:text-orange-700">ביטול</Button>
                          <Button size="sm" variant="outline" onClick={async()=>{if(window.confirm('האם לסמן כהושלם?')){await base44.entities.OnlineCoachingSubscription.update(subscription.id,{status:'completed'});onReload();alert('המנוי סומן כהושלם');}}} className="text-green-600 hover:text-green-700">סמן הושלם</Button>
                        </>}
                        <Button size="sm" variant="outline" onClick={async()=>{if(window.confirm('האם למחוק את המנוי? פעולה זו בלתי הפיכה.')){await base44.entities.OnlineCoachingSubscription.delete(subscription.id);onReload();alert('המנוי נמחק בהצלחה');}}} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}