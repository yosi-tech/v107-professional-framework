import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, User as UserIcon, Mail, Send, Rocket, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function UsersTab({
  users,
  responses,
  reports,
  emailLogs,
  emailTemplates,
  boosterSubscriptions,
  onViewEmails,
  onSendTemplate,
  onUpdatePurchaseStatus
}) {
  const [userDateFilter, setUserDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });

  const filteredUsers = users.filter((user) => {
    if (userDateFilter === 'all') return true;
    const userDate = new Date(user.created_date);
    const now = new Date();
    if (userDateFilter === 'today') {
      return userDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (userDateFilter === 'week') {
      return userDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (userDateFilter === 'month') {
      return userDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (userDateFilter === 'year') {
      return userDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    } else if (userDateFilter === 'custom') {
      if (customDateRange.from && customDateRange.to) {
        const fromDate = new Date(customDateRange.from);
        const toDate = new Date(customDateRange.to);
        toDate.setHours(23, 59, 59, 999);
        return userDate >= fromDate && userDate <= toDate;
      } else if (customDateRange.from) {
        return userDate >= new Date(customDateRange.from);
      } else if (customDateRange.to) {
        const toDate = new Date(customDateRange.to);
        toDate.setHours(23, 59, 59, 999);
        return userDate <= toDate;
      }
    }
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">כל המשתמשים במערכת</CardTitle>
        <p className="text-gray-600 text-sm mt-1 text-right" dir="rtl">
          רשימה מלאה של כל המשתמשים הרשומים באפליקציה
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex gap-3 flex-wrap justify-end items-end">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">סנן לפי תאריך:</label>
              <select
                value={userDateFilter}
                onChange={(e) => setUserDateFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                dir="rtl"
              >
                <option value="all">כל הזמן</option>
                <option value="today">היום</option>
                <option value="week">7 ימים אחרונים</option>
                <option value="month">חודש אחרון</option>
                <option value="year">שנה אחרונה</option>
                <option value="custom">מותאם אישית</option>
              </select>
            </div>

            {userDateFilter === 'custom' && (
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={customDateRange.to}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, to: e.target.value })}
                  className="w-40 text-sm"
                  placeholder="עד"
                />
                <span className="text-sm text-gray-600">עד</span>
                <Input
                  type="date"
                  value={customDateRange.from}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, from: e.target.value })}
                  className="w-40 text-sm"
                  placeholder="מ"
                />
                <span className="text-sm text-gray-600">מ</span>
              </div>
            )}

            {userDateFilter !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUserDateFilter('all');
                  setCustomDateRange({ from: '', to: '' });
                }}
                className="text-xs"
              >
                נקה סינון תאריך
              </Button>
            )}
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">אין משתמשים בטווח התאריכים שנבחר</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => {
              const userResponses = responses.filter((r) =>
                r.created_by === user.email || r.personal_info?.email === user.email
              );
              const userReports = reports.filter((r) => r.user_email === user.email);
              const hasPurchasedFullReport = user.has_purchased_full_report ?? false;
              const hasPurchasedAnswersDownload = user.has_purchased_answers_download ?? false;
              const activeBoosterSubscription = boosterSubscriptions.find((s) =>
                s.user_email === user.email && s.status === 'active'
              );
              const hasAbandonedQuestionnaire = userResponses.some((r) =>
                r.status === 'in_progress' || r.status === 'abandoned'
              );
              const userEmails = emailLogs.filter((log) =>
                log.to_email === user.email || log.related_user_email === user.email
              );
              const emailsByType = {
                abandonment: userEmails.filter(e => ['abandonment_survey', 'abandonment_reminder_96h', 'abandonment_after_completion'].includes(e.email_type)).length,
                report_ready: userEmails.filter(e => e.email_type === 'report_ready').length,
                purchase: userEmails.filter(e => ['full_report_purchase', 'answers_download_purchase'].includes(e.email_type)).length,
                booster: userEmails.filter(e => e.email_type === 'booster_email').length,
              };
              const totalEmails = userEmails.length;

              return (
                <Card key={user.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-row-reverse">
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                          <h4 className="font-semibold text-base">{user.full_name || 'שם לא זמין'}</h4>
                          {user.role === 'admin' && <Badge className="bg-purple-600 text-white text-xs">Admin</Badge>}
                          {activeBoosterSubscription && (
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs flex items-center gap-1">
                              <Rocket className="w-3 h-3" />
                              בוסטר יום {activeBoosterSubscription.current_day}/7
                            </Badge>
                          )}
                          {hasAbandonedQuestionnaire && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              נטש שאלון
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          נרשם: {format(new Date(user.created_date), 'dd/MM/yyyy HH:mm')}
                        </p>

                        <div className="flex gap-2 flex-wrap justify-end mt-3">
                          <Badge variant="outline" className="text-xs">{userResponses.length} שאלונים</Badge>
                          <Badge variant="outline" className="text-xs">{userReports.length} דוחות</Badge>

                          {totalEmails > 0 ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewEmails(userEmails)}
                              className="h-6 text-xs flex items-center gap-1 flex-row-reverse px-2 bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100"
                            >
                              <Mail className="w-3 h-3" />
                              {totalEmails} מיילים
                              {emailsByType.abandonment > 0 && ` (${emailsByType.abandonment} נטישה`}
                              {emailsByType.report_ready > 0 && `${emailsByType.abandonment > 0 ? ', ' : ' ('}${emailsByType.report_ready} דוח`}
                              {emailsByType.purchase > 0 && `${emailsByType.abandonment > 0 || emailsByType.report_ready > 0 ? ', ' : ' ('}${emailsByType.purchase} רכישה`}
                              {emailsByType.booster > 0 && `${emailsByType.abandonment > 0 || emailsByType.report_ready > 0 || emailsByType.purchase > 0 ? ', ' : ' ('}${emailsByType.booster} בוסטר`}
                              {(emailsByType.abandonment > 0 || emailsByType.report_ready > 0 || emailsByType.purchase > 0 || emailsByType.booster > 0) && ')'}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                              <Mail className="w-3 h-3 ml-1" />
                              אין מיילים
                            </Badge>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const userResponse = userResponses[0];
                              if (userResponse) {
                                onSendTemplate(userResponse);
                              } else {
                                alert('לא נמצא שאלון למשתמש זה');
                              }
                            }}
                            className="h-6 text-xs flex items-center gap-1 flex-row-reverse px-2"
                          >
                            <Send className="w-3 h-3" />
                            שלח תבנית
                          </Button>
                        </div>
                        <div className="mt-3">
                          <Label className="text-xs mb-2 block">סטטוס תשלום:</Label>
                          <Select
                            value={hasPurchasedFullReport ? 'full_report' : hasPurchasedAnswersDownload ? 'answers_download' : 'none'}
                            onValueChange={(value) => onUpdatePurchaseStatus(user.email, value)}
                          >
                            <SelectTrigger className="w-full text-right">
                              <SelectValue placeholder="בחר סטטוס" />
                            </SelectTrigger>
                            <SelectContent dir="rtl">
                              <SelectItem value="full_report">רכש דוח מלא ✅</SelectItem>
                              <SelectItem value="answers_download">רכש תשובות בלבד 📄</SelectItem>
                              <SelectItem value="none">לא רכש ❌</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-blue-600" />
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