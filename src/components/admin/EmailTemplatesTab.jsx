import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Mail, FileText, Trash2, Loader2, DollarSign } from "lucide-react";

function EmailTemplateCard({ template, onEdit, onDelete, isDeleting }) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewLang, setPreviewLang] = useState('he');

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 text-right">
            <div className="flex items-center gap-3 mb-3 flex-row-reverse">
              <Badge variant={template.active ? "default" : "outline"}>{template.active ? 'פעיל' : 'לא פעיל'}</Badge>
              <h3 className="text-lg font-semibold">{template.name_he}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{template.description_he}</p>
            <div className="flex gap-2 flex-wrap justify-end mt-3">
              <Badge variant="outline" className="text-xs">
                {({'abandonment_incomplete':'נטישה לפני סיום','abandonment_reminder_96h':'תזכורת 96 שעות','abandonment_after_completion':'נטישה אחרי סיום','full_report_purchase':'רכישת דוח מלא','answers_download_purchase':'רכישת תשובות','online_coaching_purchase':'רכישת ליווי','report_ready':'דוח מוכן','consultation_request':'בקשת ייעוץ','questionnaire_completion':'השלמת שאלון'})[template.template_type] || template.template_type}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                {({'manual':'⚙️ ידני','on_navigation_away':'🚪 ניווט החוצה','after_96_hours':'⏰ 96 שעות','after_completion_no_purchase':'✅ סיום ללא רכישה','on_purchase':'💳 רכישה','on_report_generation':'📊 יצירת דוח','on_consultation_request':'💬 בקשת ייעוץ','on_questionnaire_submit':'📝 הגשת שאלון'})[template.trigger_event] || template.trigger_event}
              </Badge>
              {template.include_coupon && <Badge variant="outline" className="bg-green-50 text-green-700 text-xs"><DollarSign className="w-3 h-3 ml-1" />קופון {template.coupon_amount} ₪</Badge>}
            </div>
            {showPreview && (
              <div className="mt-4 space-y-3">
                <div className="flex justify-center gap-2">
                  <Button type="button" size="sm" variant={previewLang === 'he' ? 'default' : 'outline'} onClick={() => setPreviewLang('he')}>🇮🇱 עברית</Button>
                  <Button type="button" size="sm" variant={previewLang === 'en' ? 'default' : 'outline'} onClick={() => setPreviewLang('en')}>🇬🇧 English</Button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-2 text-right">{previewLang === 'he' ? 'נושא: ' : 'Subject: '}{previewLang === 'he' ? template.subject_he : template.subject_en}</p>
                  <div className="border rounded-lg bg-white overflow-hidden shadow">
                    <iframe srcDoc={(previewLang === 'he' ? template.content_he : template.content_en).replace(/{userName}/g, previewLang === 'he' ? 'ישראל ישראלי' : 'John Doe').replace(/{questionnaireUrl}/g, '#').replace(/{reportUrl}/g, '#').replace(/{surveyUrl}/g, '#').replace(/{couponCode}/g, 'DEMO50').replace(/{purchaseUrl}/g, '#')} className="w-full h-[400px] border-0" title="Email Preview" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 flex-row-reverse"><span>{showPreview ? 'סגור תצוגה' : 'תצוגה מקדימה'}</span><Eye className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-2 flex-row-reverse"><span>ערוך</span><FileText className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={onDelete} disabled={isDeleting} className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2 flex-row-reverse"><span>מחק</span>{isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const BOOSTER_TRACKS = ['execution', 'digital', 'finance', 'marketing', 'management', 'vision'];
const TRACK_NAMES = { execution: 'ביצוע', digital: 'דיגיטל', finance: 'פיננסים', marketing: 'שיווק', management: 'ניהול', vision: 'חזון' };

export default function EmailTemplatesTab({ emailTemplates, onEdit, onDelete, onCreateNew, deletingTemplateId }) {
  const renderTrack = (track) => {
    const templates = track ? emailTemplates.filter(t => t.booster_track === track).sort((a,b) => (a.booster_day||0)-(b.booster_day||0)) : emailTemplates.filter(t => !t.booster_track);
    return (
      <div className="grid gap-4">
        {templates.map(template => <EmailTemplateCard key={template.id} template={template} onEdit={() => onEdit(template)} onDelete={() => onDelete(template.id)} isDeleting={deletingTemplateId === template.id} />)}
        {templates.length === 0 && (
          <Card><CardContent className="p-12 text-center"><Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">אין תבניות {track ? `במסלול ${TRACK_NAMES[track]}` : 'כלליות'}</h3><p className="text-gray-600">תבניות מייל {track ? `למסלול ה${TRACK_NAMES[track]} (7 ימים)` : 'כלליות (לא בוסטר)'} יופיעו כאן</p></CardContent></Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center mb-6">
        <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 flex-row-reverse"><span>תבנית מייל חדשה</span><Mail className="w-4 h-4" /></Button>
      </div>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="vision" className="text-xs sm:text-sm">חזון</TabsTrigger>
          <TabsTrigger value="management" className="text-xs sm:text-sm">ניהול</TabsTrigger>
          <TabsTrigger value="marketing" className="text-xs sm:text-sm">שיווק</TabsTrigger>
          <TabsTrigger value="finance" className="text-xs sm:text-sm">פיננסים</TabsTrigger>
          <TabsTrigger value="digital" className="text-xs sm:text-sm">דיגיטל</TabsTrigger>
          <TabsTrigger value="execution" className="text-xs sm:text-sm">ביצוע</TabsTrigger>
          <TabsTrigger value="general" className="text-xs sm:text-sm">כללי</TabsTrigger>
        </TabsList>
        <TabsContent value="general">{renderTrack(null)}</TabsContent>
        {BOOSTER_TRACKS.map(track => <TabsContent key={track} value={track}>{renderTrack(track)}</TabsContent>)}
      </Tabs>
    </div>
  );
}