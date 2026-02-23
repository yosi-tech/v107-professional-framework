import React from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EmailTemplateDialog({ open, onOpenChange, template, onSave }) {
  const [formData, setFormData] = React.useState({
    template_type: template?.template_type || 'abandonment_incomplete',
    trigger_event: template?.trigger_event || 'manual',
    name_he: template?.name_he || '',
    name_en: template?.name_en || '',
    subject_he: template?.subject_he || '',
    subject_en: template?.subject_en || '',
    content_he: template?.content_he || '',
    content_en: template?.content_en || '',
    description_he: template?.description_he || '',
    description_en: template?.description_en || '',
    active: template?.active ?? true,
    include_coupon: template?.include_coupon ?? false,
    coupon_amount: template?.coupon_amount || 50,
    aiPrompt: ''
  });
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
  const [previewLang, setPreviewLang] = React.useState('he');
  const [contentMode, setContentMode] = React.useState('simple');
  const [simpleContent, setSimpleContent] = React.useState({ he: '', en: '' });
  const [isConvertingToHtml, setIsConvertingToHtml] = React.useState(false);

  React.useEffect(() => {
    if (template) {
      setFormData({
        template_type: template.template_type,
        trigger_event: template.trigger_event || 'manual',
        name_he: template.name_he,
        name_en: template.name_en,
        subject_he: template.subject_he,
        subject_en: template.subject_en,
        content_he: template.content_he,
        content_en: template.content_en,
        description_he: template.description_he || '',
        description_en: template.description_en || '',
        active: template.active ?? true,
        include_coupon: template.include_coupon ?? false,
        coupon_amount: template.coupon_amount || 50
      });
    } else {
      setFormData({
        template_type: 'abandonment_incomplete',
        trigger_event: 'manual',
        name_he: '', name_en: '',
        subject_he: '', subject_en: '',
        content_he: '', content_en: '',
        description_he: '', description_en: '',
        active: true, include_coupon: false, coupon_amount: 50
      });
    }
  }, [template]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_he || !formData.subject_he) {
      alert('יש למלא לפחות את השם והנושא בעברית');
      return;
    }
    if (contentMode === 'simple' && (simpleContent.he || simpleContent.en)) {
      setIsConvertingToHtml(true);
      try {
        const convertedHtml = await convertSimpleToHtml(simpleContent.he, simpleContent.en);
        onSave({ ...formData, content_he: convertedHtml.content_he, content_en: convertedHtml.content_en });
      } catch (error) {
        alert('שגיאה בהמרת התוכן ל-HTML: ' + error.message);
      } finally {
        setIsConvertingToHtml(false);
      }
      return;
    }
    if (!formData.content_he) {
      alert('יש למלא את תוכן המייל בעברית');
      return;
    }
    onSave(formData);
  };

  const convertSimpleToHtml = async (textHe, textEn) => {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `המר טקסט זה לתבניות HTML מקצועיות עבור מיילים. עברית: ${textHe || 'אין'} | אנגלית: ${textEn || 'אין'}. שמור משתנים כמו {userName}, {questionnaireUrl}, {reportUrl}, {surveyUrl}, {couponCode}, {purchaseUrl}. החזר JSON בלבד.`,
      response_json_schema: {
        type: "object",
        properties: { content_he: { type: "string" }, content_en: { type: "string" } }
      }
    });
    return result;
  };

  const handleGenerateWithAI = async () => {
    if (!formData.aiPrompt) return;
    setIsGeneratingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `אתה מעצב מיילים מקצועי. צור תבנית מייל HTML עבור V107. תיאור: ${formData.aiPrompt}. צור HTML מקצועי עם CSS מוטמע, גרסה עברית RTL וגרסה אנגלית LTR. שמור משתנים: {userName}, {questionnaireUrl}, {reportUrl}, {surveyUrl}, {couponCode}, {purchaseUrl}. החזר JSON בלבד.`,
        response_json_schema: {
          type: "object",
          properties: {
            name_he: { type: "string" }, name_en: { type: "string" },
            subject_he: { type: "string" }, subject_en: { type: "string" },
            content_he: { type: "string" }, content_en: { type: "string" },
            description_he: { type: "string" }, description_en: { type: "string" }
          }
        }
      });
      setFormData({ ...formData, ...result, aiPrompt: '' });
      alert('התבנית נוצרה בהצלחה!');
    } catch (error) {
      alert('שגיאה ביצירת התבנית: ' + error.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>{template ? 'עריכת תבנית מייל' : 'תבנית מייל חדשה'}</DialogTitle>
          <DialogDescription>הגדר את תוכן המייל האוטומטי בעברית ובאנגלית</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit">עריכת תבנית</TabsTrigger>
            <TabsTrigger value="preview">תצוגה מקדימה</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex justify-center gap-2 mb-4">
              <Button type="button" variant={previewLang === 'he' ? 'default' : 'outline'} onClick={() => setPreviewLang('he')}>🇮🇱 עברית</Button>
              <Button type="button" variant={previewLang === 'en' ? 'default' : 'outline'} onClick={() => setPreviewLang('en')}>🇬🇧 English</Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-right">
                {previewLang === 'he' ? 'נושא: ' : 'Subject: '}{previewLang === 'he' ? formData.subject_he : formData.subject_en}
              </h3>
              <div className="border rounded-lg bg-white overflow-hidden shadow-lg">
                <iframe
                  srcDoc={(previewLang === 'he' ? formData.content_he : formData.content_en)
                    .replace('{userName}', previewLang === 'he' ? 'ישראל ישראלי' : 'John Doe')
                    .replace('{questionnaireUrl}', '#questionnaire').replace('{reportUrl}', '#report')
                    .replace('{surveyUrl}', '#survey').replace('{couponCode}', 'DEMO50').replace('{purchaseUrl}', '#purchase')}
                  className="w-full h-[600px] border-0" title="Email Preview" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>סוג תבנית</Label>
                  <select value={formData.template_type} onChange={(e) => setFormData({ ...formData, template_type: e.target.value })} className="w-full border rounded-md p-2 text-right" dir="rtl">
                    <option value="abandonment_incomplete">נטישה לפני סיום השאלון</option>
                    <option value="abandonment_reminder_96h">תזכורת 96 שעות</option>
                    <option value="abandonment_after_completion">נטישה אחרי סיום השאלון</option>
                    <option value="full_report_purchase">רכישת דוח מלא</option>
                    <option value="answers_download_purchase">רכישת הורדת תשובות</option>
                    <option value="online_coaching_purchase">רכישת ליווי אונליין</option>
                    <option value="report_ready">דוח מוכן</option>
                    <option value="consultation_request">בקשת ייעוץ</option>
                    <option value="questionnaire_completion">השלמת שאלון</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>טריגר</Label>
                  <select value={formData.trigger_event} onChange={(e) => setFormData({ ...formData, trigger_event: e.target.value })} className="w-full border rounded-md p-2 text-right" dir="rtl">
                    <option value="manual">ידני בלבד</option>
                    <option value="on_navigation_away">בעת ניווט החוצה מהשאלון</option>
                    <option value="after_96_hours">אחרי 96 שעות</option>
                    <option value="after_completion_no_purchase">אחרי סיום ללא רכישה</option>
                    <option value="on_purchase">ברכישת מוצר</option>
                    <option value="on_report_generation">ביצירת דוח</option>
                    <option value="on_consultation_request">בקשת ייעוץ</option>
                    <option value="on_questionnaire_submit">בהגשת שאלון</option>
                  </select>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Label className="font-semibold mb-2 block">🤖 יצירת תבנית באמצעות AI</Label>
                  <Textarea
                    placeholder="תאר את המייל במילים פשוטות..."
                    value={formData.aiPrompt || ''}
                    onChange={(e) => setFormData({ ...formData, aiPrompt: e.target.value })}
                    className="min-h-[80px] text-right mb-2" dir="rtl" />
                  <Button type="button" onClick={handleGenerateWithAI} disabled={isGeneratingAI || !formData.aiPrompt} className="w-full bg-blue-600 hover:bg-blue-700">
                    {isGeneratingAI ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />מייצר...</> : '✨ צור תבנית באמצעות AI'}
                  </Button>
                </div>
                <div className="flex items-center gap-4 flex-row-reverse">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <Label>פעיל</Label>
                    <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <Label>כולל קופון</Label>
                    <input type="checkbox" checked={formData.include_coupon} onChange={(e) => setFormData({ ...formData, include_coupon: e.target.checked })} className="w-4 h-4" />
                  </div>
                  {formData.include_coupon && (
                    <div className="flex items-center gap-2 flex-row-reverse">
                      <Label>סכום קופון (₪)</Label>
                      <Input type="number" value={formData.coupon_amount} onChange={(e) => setFormData({ ...formData, coupon_amount: parseInt(e.target.value) })} className="w-20 text-right" />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-right">תוכן המייל</h3>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant={contentMode === 'simple' ? 'default' : 'outline'} onClick={() => setContentMode('simple')}>✍️ טקסט פשוט</Button>
                    <Button type="button" size="sm" variant={contentMode === 'html' ? 'default' : 'outline'} onClick={() => setContentMode('html')}>💻 HTML</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div><Label>שם התבנית</Label><Input value={formData.name_he} onChange={(e) => setFormData({ ...formData, name_he: e.target.value })} placeholder="שם התבנית" className="text-right" dir="rtl" /></div>
                  <div><Label>תיאור (אופציונלי)</Label><Input value={formData.description_he} onChange={(e) => setFormData({ ...formData, description_he: e.target.value })} placeholder="תיאור קצר" className="text-right" dir="rtl" /></div>
                  <div><Label>נושא המייל</Label><Input value={formData.subject_he} onChange={(e) => setFormData({ ...formData, subject_he: e.target.value })} placeholder="נושא המייל" className="text-right" dir="rtl" /></div>
                  {contentMode === 'simple' ? (
                    <div><Label>תוכן המייל בעברית (טקסט פשוט)</Label><Textarea value={simpleContent.he} onChange={(e) => setSimpleContent({ ...simpleContent, he: e.target.value })} placeholder="כתוב את תוכן המייל..." className="min-h-[200px] text-right" dir="rtl" /></div>
                  ) : (
                    <div><Label>תוכן המייל (HTML)</Label><Textarea value={formData.content_he} onChange={(e) => setFormData({ ...formData, content_he: e.target.value })} placeholder="HTML..." className="min-h-[200px] font-mono text-sm text-right" dir="rtl" /></div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-right">English Content</h3>
                <div className="space-y-4">
                  <div><Label>Template Name</Label><Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} placeholder="Template name" className="text-left" dir="ltr" /></div>
                  <div><Label>Description (optional)</Label><Input value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} placeholder="Brief description" className="text-left" dir="ltr" /></div>
                  <div><Label>Email Subject</Label><Input value={formData.subject_en} onChange={(e) => setFormData({ ...formData, subject_en: e.target.value })} placeholder="Email subject" className="text-left" dir="ltr" /></div>
                  {contentMode === 'simple' ? (
                    <div><Label>Email Content (Plain Text)</Label><Textarea value={simpleContent.en} onChange={(e) => setSimpleContent({ ...simpleContent, en: e.target.value })} placeholder="Write email content..." className="min-h-[200px] text-left" dir="ltr" /></div>
                  ) : (
                    <div><Label>Email Content (HTML)</Label><Textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} placeholder="HTML content..." className="min-h-[200px] font-mono text-sm text-left" dir="ltr" /></div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t flex-row-reverse">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isConvertingToHtml}>
                  {isConvertingToHtml ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" />ממיר ושומר...</> : 'שמור תבנית'}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isConvertingToHtml}>ביטול</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}