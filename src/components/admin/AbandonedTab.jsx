import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Loader2, Clock, CheckCircle, AlertCircle, AlertTriangle, Users } from "lucide-react";
import { format } from "date-fns";

function AbandonedUserCard({ user, userResponse, isSending, abandonmentEmailsCount, userEmail, emailLogs, onSendEmail, onViewEmails, completedAfterAbandonment, variant = "in_progress" }) {
  const borderClass = completedAfterAbandonment ? "border-green-300 bg-green-50" : variant === "in_progress" ? "border-yellow-300 bg-yellow-50" : "border-orange-200";
  const buttonClass = variant === "in_progress" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-orange-600 hover:bg-orange-700";

  return (
    <Card className={borderClass}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="text-right">
            <h4 className="font-semibold text-sm sm:text-base">{user.full_name || 'שם לא זמין'}</h4>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
            {userResponse?.created_date && (
              <>
                <p className="text-xs text-gray-500 mt-1">
                  {variant === "in_progress" ? "התחיל" : "סיים שאלון"}: {format(new Date(userResponse.created_date), 'dd/MM/yy HH:mm')}
                </p>
                <p className={`text-xs font-semibold mt-1 ${variant === "in_progress" ? "text-yellow-700" : "text-orange-600"}`} dir="rtl">
                  {(() => {
                    const hoursAgo = Math.floor((Date.now() - new Date(userResponse.created_date).getTime()) / (1000 * 60 * 60));
                    const days = Math.floor(hoursAgo / 24);
                    const hours = hoursAgo % 24;
                    if (days > 0) return hours > 0 ? `עברו ${days} ימים ו-${hours} שעות` : `עברו ${days} ימים`;
                    return `עברו ${hours} שעות`;
                  })()}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-row-reverse">
            {completedAfterAbandonment ? (
              <Badge className="bg-green-600 text-white flex items-center gap-1 flex-row-reverse justify-center text-xs py-2">
                <CheckCircle className="w-4 h-4" /> השלים לאחר מייל נטישה
              </Badge>
            ) : (
              <Button onClick={() => userResponse && onSendEmail(userResponse)} disabled={!userResponse || isSending} className={`${buttonClass} flex items-center gap-2 flex-row-reverse justify-center text-xs sm:text-sm`}>
                <span>שלח מייל נטישה</span>
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              </Button>
            )}
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              <Badge variant="outline" className={`flex items-center gap-1 flex-row-reverse text-xs ${variant === "in_progress" ? "bg-yellow-100 border-yellow-400 text-yellow-800" : "bg-green-100 border-green-300 text-green-800"}`}>
                {variant === "in_progress" ? <><Clock className="w-3 h-3" /> שאלון בתהליך</> : <><CheckCircle className="w-3 h-3" /> <span className="hidden sm:inline">השלים שאלון</span><span className="sm:hidden">השלים</span></>}
              </Badge>
              {abandonmentEmailsCount > 0 ? (
                <Button variant="outline" size="sm" onClick={() => onViewEmails(userEmail)} className="bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200 flex items-center gap-1 flex-row-reverse text-xs h-6 px-2">
                  <Mail className="w-3 h-3" />
                  <span className="hidden sm:inline">{abandonmentEmailsCount} מיילי נטישה</span>
                  <span className="sm:hidden">{abandonmentEmailsCount}</span>
                </Button>
              ) : (
                <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-600 flex items-center gap-1 flex-row-reverse text-xs">
                  <Mail className="w-3 h-3" />
                  <span className="hidden sm:inline">לא נשלח מייל נטישה</span>
                  <span className="sm:hidden">לא נשלח</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserSection({ title, icon, badgeCount, description, users, responses, emailLogs, sendingEmailType, onSendEmail, onViewEmails, variant }) {
  const getEmailInfo = (user) => {
    const userResponse = responses.find(r => (r.created_by === user.email || r.personal_info?.email === user.email) && (variant === "in_progress" ? r.status === 'in_progress' : true));
    const userEmail = userResponse?.personal_info?.email || userResponse?.created_by || user.email;
    const count = emailLogs.filter(log => (log.email_type === 'abandonment_survey' || log.email_type === 'abandonment_reminder_96h' || log.email_type === 'abandonment_after_completion') && (log.related_user_email === userEmail || log.to_email === userEmail)).length;
    const hasSent = count > 0;
    const isSending = sendingEmailType === `abandonment_survey_${userResponse?.id}`;
    let completedAfterAbandonment = false;
    if (variant === "completed") {
      const abandonmentEmail = emailLogs.find(log => log.email_type === 'abandonment_survey' && (log.related_user_email === user.email || log.to_email === user.email));
      completedAfterAbandonment = abandonmentEmail && userResponse && new Date(userResponse.created_date) > new Date(abandonmentEmail.created_date);
    }
    return { userResponse, userEmail, count, hasSent, isSending, completedAfterAbandonment };
  };

  const sentUsers = users.filter(u => getEmailInfo(u).hasSent);
  const notSentUsers = users.filter(u => !getEmailInfo(u).hasSent);

  const handleViewEmails = (userEmail) => {
    const emails = emailLogs.filter(log => (log.email_type === 'abandonment_survey' || log.email_type === 'abandonment_reminder_96h' || log.email_type === 'abandonment_after_completion') && (log.related_user_email === userEmail || log.to_email === userEmail));
    onViewEmails(emails);
  };

  const renderUsers = (list) => list.map(user => {
    const info = getEmailInfo(user);
    return <AbandonedUserCard key={user.id} user={user} userResponse={info.userResponse} isSending={info.isSending} abandonmentEmailsCount={info.count} userEmail={info.userEmail} emailLogs={emailLogs} onSendEmail={onSendEmail} onViewEmails={handleViewEmails} completedAfterAbandonment={info.completedAfterAbandonment} variant={variant} />;
  });

  const Icon = icon;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center gap-2 justify-end">
          <Badge variant="outline" className={variant === "in_progress" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-orange-100 text-orange-800 border-orange-300"}>{badgeCount}</Badge>
          <span>{title}</span>
          <Icon className={`w-5 h-5 ${variant === "in_progress" ? "text-yellow-600" : "text-orange-600"}`} />
        </CardTitle>
        <p className="text-gray-600 text-sm mt-1 text-right" dir="rtl">{description}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="not-sent" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">הכל ({users.length})</TabsTrigger>
            <TabsTrigger value="sent">נשלחו מיילים ({sentUsers.length})</TabsTrigger>
            <TabsTrigger value="not-sent">לא נשלחו מיילים ({notSentUsers.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {users.length === 0 ? <div className="text-center py-8"><Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-600">{variant === "in_progress" ? "אין משתמשים עם שאלון בתהליך" : "אין משתמשים שנטשו כרגע. כל הכבוד!"}</p></div> : <div className="space-y-3">{renderUsers(users)}</div>}
          </TabsContent>
          <TabsContent value="sent">
            {sentUsers.length === 0 ? <div className="text-center py-8"><Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-600">אין משתמשים שנשלחו להם מיילים</p></div> : <div className="space-y-3">{renderUsers(sentUsers)}</div>}
          </TabsContent>
          <TabsContent value="not-sent">
            {notSentUsers.length === 0 ? <div className="text-center py-8"><CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-600">אין משתמשים ללא מיילים - הכל מטופל!</p></div> : <div className="space-y-3">{renderUsers(notSentUsers)}</div>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function AbandonedTab({ inProgressUsers, abandonedUsers, responses, emailLogs, sendingEmailType, onSendEmail, onViewEmails }) {
  return (
    <div className="space-y-6">
      <UserSection title="משתמשים שהתחילו שאלון ולא סיימו" icon={AlertCircle} badgeCount={inProgressUsers.length} description="משתמשים שהתחילו למלא את השאלון אך עדיין לא השלימו אותו." users={inProgressUsers} responses={responses} emailLogs={emailLogs} sendingEmailType={sendingEmailType} onSendEmail={onSendEmail} onViewEmails={onViewEmails} variant="in_progress" />
      <UserSection title='משתמשים שסיימו שאלון אך לא רכשו דו"ח' icon={AlertTriangle} badgeCount={abandonedUsers.length} description='רשימת משתמשים שהשלימו שאלון V107 אך לא רכשו דו"ח מלא או הורדת תשובות.' users={abandonedUsers} responses={responses} emailLogs={emailLogs} sendingEmailType={sendingEmailType} onSendEmail={onSendEmail} onViewEmails={onViewEmails} variant="completed" />
    </div>
  );
}