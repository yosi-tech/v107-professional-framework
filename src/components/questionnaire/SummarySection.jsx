
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Sunrise, Star, TrendingUp, MessageCircle, Award, Target } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function SummarySection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };
  
  const handleCheckboxChange = (field, item, isChecked) => {
    const currentArray = data[field] || [];
    let newArray = isChecked ? [...currentArray, item] : currentArray.filter((i) => i !== item);
    onChange({ [field]: newArray });
  };
  
  const motivations = ["הכנסה", "יצירה/חדשנות", "אוטונומיה", "השפעה/משימה", "למידה/אתגר", "אחר"];
  const achievements = ["יציבות תזרימית", "צמיחה (Scale)", "צוות", "מיתוג", "יצוא", "אחר"];
  const strategyEmbed = ["תכנון שבועי", "יעדי OKR רבעוניים", "ספרינט דו-שבועי", "אחר"];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#FFD700]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">י. סיכום אישי (91–100)</h2>
      </div>

      <Card><CardHeader><CardTitle>91. ספר/י בקצרה על עצמך</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.self_description || ""} onChange={e=>handleInputChange('self_description', e.target.value)} rows={3} /></CardContent></Card>
      
      <Card>
          <CardHeader><CardTitle>92. מה מניע אותך (ניתן לבחור יותר מאפשרות אחת)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {motivations.map(o => <div key={o} className="flex items-center space-x-2 space-x-reverse"><Checkbox id={`motive_${o}`} checked={(data.motivations||[]).includes(o)} onCheckedChange={c=>handleCheckboxChange('motivations',o,c)} /><Label htmlFor={`motive_${o}`}>{o}</Label></div>)}
              {(data.motivations||[]).includes("אחר") && <Input className="mt-2" placeholder="פרט/י" value={data.motivations_other||""} onChange={e=>handleInputChange('motivations_other',e.target.value)} />}
          </CardContent>
      </Card>
      
      <Card><CardHeader><CardTitle>93. החלום הגדול</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.biggest_dream || ""} onChange={e=>handleInputChange('biggest_dream', e.target.value)} rows={3} /></CardContent></Card>
      
      <Card>
          <CardHeader><CardTitle>94. שלוש תכונות חוזקה בולטות</CardTitle></CardHeader>
          <CardContent className="space-y-2">
              <Input placeholder="(1)" value={data.main_strengths_1||""} onChange={e=>handleInputChange('main_strengths_1', e.target.value)} />
              <Input placeholder="(2)" value={data.main_strengths_2||""} onChange={e=>handleInputChange('main_strengths_2', e.target.value)} />
              <Input placeholder="(3)" value={data.main_strengths_3||""} onChange={e=>handleInputChange('main_strengths_3', e.target.value)} />
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader><CardTitle>95. שלושה תחומים לשיפור</CardTitle></CardHeader>
          <CardContent className="space-y-2">
              <Input placeholder="(1)" value={data.improvement_areas_1||""} onChange={e=>handleInputChange('improvement_areas_1', e.target.value)} />
              <Input placeholder="(2)" value={data.improvement_areas_2||""} onChange={e=>handleInputChange('improvement_areas_2', e.target.value)} />
              <Input placeholder="(3)" value={data.improvement_areas_3||""} onChange={e=>handleInputChange('improvement_areas_3', e.target.value)} />
          </CardContent>
      </Card>
      
      <Card><CardHeader><CardTitle>96. משוב שאת/ה מקבל/ת לעיתים קרובות</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.common_feedback || ""} onChange={e=>handleInputChange('common_feedback', e.target.value)} rows={3} /></CardContent></Card>
      <Card><CardHeader><CardTitle>97. הדבר שאת/ה הכי גאה בו עד כה</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.proudest_achievement || ""} onChange={e=>handleInputChange('proudest_achievement', e.target.value)} rows={3} /></CardContent></Card>
      
      <Card>
          <CardHeader><CardTitle>98. מה תרצה/י להשיג בשנים הקרובות (ניתן לבחור יותר מאפשרות אחת)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map(o => <div key={o} className="flex items-center space-x-2 space-x-reverse"><Checkbox id={`achieve_${o}`} checked={(data.achievements_coming_years||[]).includes(o)} onCheckedChange={c=>handleCheckboxChange('achievements_coming_years',o,c)} /><Label htmlFor={`achieve_${o}`}>{o}</Label></div>)}
              {(data.achievements_coming_years||[]).includes("אחר") && <Input className="mt-2" placeholder="פרט/י" value={data.achievements_coming_years_other||""} onChange={e=>handleInputChange('achievements_coming_years_other',e.target.value)} />}
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader><CardTitle>99. איך תטמיע/י אסטרטגיה בעבודה היומיומית</CardTitle></CardHeader>
          <CardContent>
              <RadioGroup value={data.strategy_embed} onValueChange={v=>handleInputChange('strategy_embed',v)} className="grid grid-cols-2 gap-4">
                  {strategyEmbed.map(o => <div key={o} className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value={o} id={`strat_${o}`} /><Label htmlFor={`strat_${o}`}>{o}</Label></div>)}
              </RadioGroup>
              {data.strategy_embed === 'אחר' && <Input className="mt-2" placeholder="פרט/י" value={data.strategy_embed_other||""} onChange={e=>handleInputChange('strategy_embed_other',e.target.value)} />}
          </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>100. העצה הטובה ביותר שקיבלת</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.best_advice || ""} onChange={e=>handleInputChange('best_advice', e.target.value)} rows={3} /></CardContent></Card>
      
      <Card>
          <CardHeader><CardTitle>יא. סגירה (101–107)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              <div><Label>101. מוכנות להשקיע לפחות 10 שעות שבועיות:<span className="text-red-500 mr-1">*</span></Label><RadioGroup value={String(data.invest_hours)} onValueChange={v => handleInputChange('invest_hours', v === 'true')} className="flex gap-4 mt-1"><div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="true" id="h_yes" /><Label htmlFor="h_yes">כן</Label></div><div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="false" id="h_no" /><Label htmlFor="h_no">לא</Label></div></RadioGroup></div>
              <div><Label>102. מוכנות להשקיע לפחות 20,000 ₪ בשנה הקרובה:<span className="text-red-500 mr-1">*</span></Label><RadioGroup value={String(data.invest_capital)} onValueChange={v => handleInputChange('invest_capital', v === 'true')} className="flex gap-4 mt-1"><div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="true" id="c_yes" /><Label htmlFor="c_yes">כן</Label></div><div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="false" id="c_no" /><Label htmlFor="c_no">לא</Label></div></RadioGroup></div>
              <div><Label>103. אישור קריאה והסכמה לתנאים ולמדיניות הפרטיות:<span className="text-red-500 mr-1">*</span></Label><RadioGroup value={String(data.confirm_terms)} onValueChange={v => handleInputChange('confirm_terms', v === 'true')} className="flex gap-4 mt-1"><div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="true" id="t_yes" /><Label htmlFor="t_yes">כן</Label></div><div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="false" id="t_no" /><Label htmlFor="t_no">לא</Label></div></RadioGroup></div>
              <div>
                  <Label>104. האם יש תחומים שבהם לא תעבוד/י מסיבות אתיות:</Label>
                  <RadioGroup value={String(data.ethical_reasons?.exists || false)} onValueChange={v => onChange({ethical_reasons: {exists: v === 'true'}})} className="flex gap-4 mt-1">
                      <div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="true" id="e_yes" /><Label htmlFor="e_yes">כן</Label></div>
                      <div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="false" id="e_no" /><Label htmlFor="e_no">לא</Label></div>
                  </RadioGroup>
                  {(data.ethical_reasons?.exists === true) && <Input className="mt-2" placeholder="אם כן — פרט/י" value={data.ethical_reasons?.details||""} onChange={e=>onChange({ethical_reasons: {...data.ethical_reasons, details: e.target.value}})} />}
              </div>
              <div>
                  <Label>105. "ליווי מומחה מוקדם משפר את הישרדות העסק הקטן בהשוואה להסתמכות על כישורי המייסד בלבד":</Label>
                  <RadioGroup value={data.mentoring_opinion} onValueChange={v => handleInputChange('mentoring_opinion', v)} className="flex gap-4 mt-1">
                      <div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="Agree" id="o_agree" /><Label htmlFor="o_agree">מסכים/ה</Label></div>
                      <div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="Disagree" id="o_disagree" /><Label htmlFor="o_disagree">לא מסכים/ה</Label></div>
                      <div className="flex items-center space-x-2 space-x-reverse"><RadioGroupItem value="Not sure" id="o_notsure" /><Label htmlFor="o_notsure">לא בטוח/ה</Label></div>
                  </RadioGroup>
              </div>
              <div>
                  <Label>106. אם תתחייב/י למיזם, באיזו מידה תעמוד/י בלוחות זמנים אישיים:</Label>
                  <div className="flex items-center gap-4 justify-start mt-2">
                      {[1,2,3,4,5].map(v => <button key={v} type="button" onClick={()=>handleInputChange('deadline_commitment', String(v))} className={`w-12 h-12 rounded-full border-2 ${data.deadline_commitment === String(v) ? 'bg-accent text-accent-foreground' : 'border-gray-300 bg-white text-gray-700'}`}>{v}</button>)}
                  </div>
              </div>
              <div><Label>107. מיד לאחר קבלת דוח Aventura-107 שלך — מה הצעד הבא שלך?</Label><Textarea placeholder="..." value={data.next_step || ""} onChange={e=>handleInputChange('next_step', e.target.value)} rows={3} /></div>
          </CardContent>
      </Card>
      
      <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 text-center space-y-4">
        <h3 className="text-xl font-bold text-text-primary">סיום השאלון</h3>
        <p className="text-text-secondary">תודה רבה על מילוי שאלון Aventura-107. תשובותיך התקבלו. דוח מקצועי ותמציתי יופק ויישלח אליך.</p>
      </div>
    </div>
  );
}
