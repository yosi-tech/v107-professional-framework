import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, DollarSign, Rocket, Mail } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export function ViewResponseDialog({ viewingResponse, onClose }) {
  return (
    <Dialog open={!!viewingResponse} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>צפייה בשאלון - {viewingResponse?.personal_info?.full_name}</DialogTitle>
          <DialogDescription>תשובות מלאות לשאלון V107</DialogDescription>
        </DialogHeader>
        {viewingResponse && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-right">
              <h3 className="font-semibold text-lg mb-3">פרטים אישיים</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">שם מלא:</span> {viewingResponse.personal_info?.full_name || '-'}</div>
                <div><span className="font-medium">אימייל:</span> {viewingResponse.personal_info?.email || '-'}</div>
                <div><span className="font-medium">גיל:</span> {viewingResponse.personal_info?.age || '-'}</div>
                <div><span className="font-medium">מין:</span> {viewingResponse.personal_info?.gender || '-'}</div>
                <div><span className="font-medium">מצב משפחתי:</span> {viewingResponse.personal_info?.marital_status || '-'}</div>
                <div><span className="font-medium">כתובת:</span> {viewingResponse.personal_info?.address || '-'}</div>
                <div><span className="font-medium">טלפון:</span> {viewingResponse.personal_info?.phone || '-'}</div>
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-lg mb-3">תשובות לשאלון (1-7)</h3>
              <div className="grid md:grid-cols-5 gap-2 text-sm">
                {Object.entries(viewingResponse.responses || {}).sort((a,b) => parseInt(a[0].replace('q','')) - parseInt(b[0].replace('q',''))).map(([key, value]) => (
                  <div key={key} className="bg-gray-100 p-2 rounded text-center"><div className="font-medium text-gray-600">{key.replace('q', 'שאלה ')}</div><div className="text-xl font-bold text-blue-600">{value}</div></div>
                ))}
              </div>
            </div>
            {viewingResponse.optional_comment && <div className="bg-amber-50 p-4 rounded-lg text-right"><h3 className="font-semibold text-lg mb-2">הערה אופציונלית</h3><p className="text-sm whitespace-pre-wrap">{viewingResponse.optional_comment}</p></div>}
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 text-right">
              <div className="grid md:grid-cols-3 gap-2">
                <div><span className="font-medium">נוצר בתאריך:</span> {format(new Date(viewingResponse.created_date), 'dd/MM/yyyy HH:mm')}</div>
                <div><span className="font-medium">עודכן לאחרונה:</span> {format(new Date(viewingResponse.updated_date), 'dd/MM/yyyy HH:mm')}</div>
                <div><span className="font-medium">שפה:</span> {viewingResponse.language === 'he' ? 'עברית' : 'English'}</div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ViewEmailsDialog({ viewingEmails, emailTemplates, onClose }) {
  return (
    <Dialog open={!!viewingEmails} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-right tracking-tight leading-none">היסטוריית מיילים</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm text-right">מיילים שנשלחו למשתמש זה</DialogDescription>
        </DialogHeader>
        {viewingEmails && (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {viewingEmails.length === 0 ? <p className="text-center text-gray-500 py-4">אין מיילים שנשלחו למשתמש זה.</p> :
              viewingEmails.map((log) => {
                const matchingTemplate = emailTemplates?.find(t => t.template_type === log.email_type);
                return (
                  <Card key={log.id} className="border">
                    <CardContent className="p-4 text-right">
                      <div className="flex items-start justify-between flex-row-reverse">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-row-reverse flex-wrap">
                            <Badge variant={log.sent_manually?"outline":"default"} className={log.sent_manually?'border-purple-300 text-purple-700':'bg-gray-200 text-gray-700'}>{log.sent_manually?'ידני':'אוטומטי'}</Badge>
                            {matchingTemplate && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">תבנית: {matchingTemplate.name_he}</Badge>}
                            <span className="text-sm font-medium">{log.subject}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div>סוג: {log.email_type}</div>
                            <div>נשלח ב: {format(new Date(log.created_date), 'dd/MM/yyyy HH:mm')}</div>
                            {log.related_report_id && <div className="mt-1"><Link to={createPageUrl(`ReportView?reportId=${log.related_report_id}`)} target="_blank" className="text-blue-600 hover:underline">צפה בדו"ח</Link></div>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            }
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function LanguageDialog({ languageDialog, onClose, onSend }) {
  return (
    <Dialog open={languageDialog.open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader><DialogTitle>בחר שפת המייל</DialogTitle><DialogDescription>באיזו שפה תרצה לשלוח את המייל ללקוח?</DialogDescription></DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={() => onSend('he')} className="w-full text-lg py-6" variant="outline">🇮🇱 עברית</Button>
          <Button onClick={() => onSend('en')} className="w-full text-lg py-6" variant="outline">🇬🇧 English</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SimulationDialog({ open, onOpenChange, simulationForm, setSimulationForm, isSimulating, onSimulate }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader><DialogTitle>דימוי רכישת מוצר</DialogTitle><DialogDescription>מערכת זו מדמה רכישה של מוצר עבור משתמש קיים - לצורך בדיקות</DialogDescription></DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="userEmail" className="text-right block mb-2">אימייל המשתמש</Label>
            <Input id="userEmail" type="email" value={simulationForm.userEmail} onChange={(e) => setSimulationForm({...simulationForm, userEmail: e.target.value})} placeholder="user@example.com" className="text-right" dir="rtl" />
            <p className="text-xs text-gray-500 mt-1 text-right">המשתמש חייב להיות רשום במערכת</p>
          </div>
          <div>
            <Label htmlFor="productType" className="text-right block mb-2">סוג מוצר</Label>
            <select id="productType" value={simulationForm.productType} onChange={(e) => setSimulationForm({...simulationForm, productType: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 text-right" dir="rtl">
              <option value="full_report">דו"ח מלא (299 ₪)</option><option value="answers_download">הורדת תשובות (59 ₪)</option><option value="online_coaching_7days">ליווי און ליין 7 ימים (497 ₪)</option>
            </select>
          </div>
          {simulationForm.productType === 'full_report' && <div className="flex items-center gap-2 flex-row-reverse"><Label htmlFor="expressDelivery" className="cursor-pointer">אספקה מואצת (+79 ₪)</Label><input id="expressDelivery" type="checkbox" checked={simulationForm.expressDelivery} onChange={(e) => setSimulationForm({...simulationForm, expressDelivery: e.target.checked})} className="w-4 h-4" /></div>}
          <div>
            <Label htmlFor="language" className="text-right block mb-2">שפת המיילים</Label>
            <select id="language" value={simulationForm.language} onChange={(e) => setSimulationForm({...simulationForm, language: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 text-right" dir="rtl"><option value="he">עברית</option><option value="en">English</option></select>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 text-right">
            <p className="font-semibold mb-1">מה יקרה:</p>
            <ul className="list-disc pr-5 space-y-1"><li>עדכון פרטי המשתמש כאילו רכש את המוצר</li><li>שליחת מייל אישור למשתמש</li><li>תיעוד הרכישה המדומה במערכת</li>{simulationForm.productType==='online_coaching_7days' && <li className="text-orange-700 font-semibold">יצירת מנוי ליווי 7 ימים</li>}</ul>
          </div>
          <div className="flex gap-3 pt-4 flex-row-reverse">
            <Button onClick={onSimulate} className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center gap-2 justify-center" disabled={isSimulating}>{isSimulating ? <><span>מדמה...</span><Loader2 className="w-4 h-4 animate-spin" /></> : 'דמה רכישה'}</Button>
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1" disabled={isSimulating}>ביטול</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TemplateSelectionDialog({ open, response, emailTemplates, sendingEmailType, onClose, onSendTemplate, onCreateNew }) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!sendingEmailType) onClose(isOpen); }}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>בחר תבנית מייל לשליחה</DialogTitle>
          <DialogDescription>{response?.personal_info?.full_name && `שליחת מייל אל: ${response.personal_info.full_name} (${response.personal_info?.email || response.created_by})`}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto p-2">
          {emailTemplates.filter(t=>t.active).length === 0 ? (
            <div className="text-center py-8"><p className="text-gray-500 mb-4">אין תבניות מייל פעילות במערכת</p><Button onClick={onCreateNew} variant="outline">צור תבנית חדשה</Button></div>
          ) : emailTemplates.filter(t=>t.active).map((template) => {
            const isSending = sendingEmailType === `template_${template.id}_${response?.id}`;
            return (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-row-reverse">
                    <div className="flex-1 text-right">
                      <h4 className="font-semibold text-base mb-1">{template.name_he}</h4>
                      <p className="text-xs text-gray-600 mb-2">{template.description_he}</p>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <Badge variant="outline" className="text-xs">
                          {template.template_type==='abandonment_incomplete'&&'נטישה לפני סיום'}{template.template_type==='abandonment_reminder_96h'&&'תזכורת 96 שעות'}{template.template_type==='abandonment_after_completion'&&'נטישה אחרי סיום'}{template.template_type==='full_report_purchase'&&'רכישת דוח מלא'}{template.template_type==='answers_download_purchase'&&'רכישת תשובות'}{template.template_type==='online_coaching_purchase'&&'רכישת ליווי'}{template.template_type==='report_ready'&&'דוח מוכן'}{template.template_type==='consultation_request'&&'בקשת ייעוץ'}{template.template_type==='questionnaire_completion'&&'השלמת שאלון'}
                        </Badge>
                        {template.include_coupon && <Badge variant="outline" className="bg-green-50 text-green-700 text-xs"><DollarSign className="w-3 h-3 ml-1" />קופון {template.coupon_amount} ₪</Badge>}
                      </div>
                    </div>
                    <Button onClick={()=>response&&onSendTemplate(template,response)} disabled={isSending||!response} className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 flex items-center gap-2 flex-row-reverse" size="sm">
                      {isSending ? <><span>שולח...</span><Loader2 className="w-4 h-4 animate-spin" /></> : <><span>שלח</span><Send className="w-4 h-4" /></>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BoosterRegistrationDialog({ open, onOpenChange, reports, boosterRegForm, setBoosterRegForm, isRegistering, onRegister }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader><DialogTitle>רישום ידני לתוכנית בוסטר</DialogTitle><DialogDescription>בחר דוח כדי לרשום את המשתמש לתוכנית הבוסטר. המייל הראשון יישלח מיד!</DialogDescription></DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-right block mb-2">בחר דוח</Label>
            <select value={boosterRegForm.reportId} onChange={(e) => { const r=reports.find(r=>r.id===e.target.value); setBoosterRegForm({reportId:e.target.value,userEmail:r?.user_email||''}); }} className="w-full border border-gray-300 rounded-md p-2 text-right" dir="rtl">
              <option value="">-- בחר דוח --</option>
              {reports.map(r => <option key={r.id} value={r.id}>{r.user_name} ({r.user_email}) - {r.report_id}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1 text-right">רק דוחות עם מסלול מומלץ יכולים להירשם</p>
          </div>
          {boosterRegForm.reportId && (()=>{ const s=reports.find(r=>r.id===boosterRegForm.reportId); return s && <div className="bg-blue-50 p-4 rounded-lg text-sm text-right space-y-2"><p><span className="font-semibold">שם:</span> {s.user_name}</p><p><span className="font-semibold">אימייל:</span> {s.user_email}</p><p><span className="font-semibold">מסלול מומלץ:</span> {s.recommended_booster_track||'לא הוגדר'}</p><p><span className="font-semibold">שפה:</span> {s.language==='he'?'עברית':'English'}</p></div>; })()}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm text-amber-900 text-right">
            <p className="font-semibold mb-2">⚡ מה יקרה:</p>
            <ul className="list-disc pr-5 space-y-1"><li>יווצר מנוי בוסטר חדש למשתמש</li><li>משימה יומית ראשונה תישלח <strong>מיד</strong> למייל</li><li>מחר ובימים הבאים ישלחו משימות נוספות אוטומטית</li><li>ביום 7 יישלח שאלון והצעה להמשך</li></ul>
          </div>
          <div className="flex gap-3 pt-4 flex-row-reverse">
            <Button onClick={onRegister} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 justify-center" disabled={isRegistering||!boosterRegForm.reportId}>
              {isRegistering ? <><span>רושם...</span><Loader2 className="w-4 h-4 animate-spin" /></> : <><span>רשום לבוסטר ושלח מייל ראשון</span><Rocket className="w-4 h-4" /></>}
            </Button>
            <Button onClick={()=>onOpenChange(false)} variant="outline" className="flex-1" disabled={isRegistering}>ביטול</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}