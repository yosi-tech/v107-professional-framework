
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
  
  const motivations = ["Income", "Creation/Innovation", "Autonomy", "Impact/Mission", "Learning/Challenge", "Other"];
  const achievements = ["Cash-flow stability", "Scale", "Team", "Branding", "Export", "Other"];
  const strategyEmbed = ["Weekly planning", "Quarterly OKR", "Bi-weekly sprint", "Other"];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#FFD700]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">J. Personal summary (91–100)</h2>
      </div>

      <Card><CardHeader><CardTitle>91. Tell us briefly about yourself</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.self_description || ""} onChange={e=>handleInputChange('self_description', e.target.value)} rows={3} /></CardContent></Card>
      
      <Card>
          <CardHeader><CardTitle>92. What motivates you (select all that apply)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {motivations.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`motive_${o}`} checked={(data.motivations||[]).includes(o)} onCheckedChange={c=>handleCheckboxChange('motivations',o,c)} /><Label htmlFor={`motive_${o}`}>{o}</Label></div>)}
              {(data.motivations||[]).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.motivations_other||""} onChange={e=>handleInputChange('motivations_other',e.target.value)} />}
          </CardContent>
      </Card>
      
      <Card><CardHeader><CardTitle>93. The big dream</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.biggest_dream || ""} onChange={e=>handleInputChange('biggest_dream', e.target.value)} rows={3} /></CardContent></Card>
      
      <Card>
          <CardHeader><CardTitle>94. Three top strengths</CardTitle></CardHeader>
          <CardContent className="space-y-2">
              <Input placeholder="(1)" value={data.main_strengths_1||""} onChange={e=>handleInputChange('main_strengths_1', e.target.value)} />
              <Input placeholder="(2)" value={data.main_strengths_2||""} onChange={e=>handleInputChange('main_strengths_2', e.target.value)} />
              <Input placeholder="(3)" value={data.main_strengths_3||""} onChange={e=>handleInputChange('main_strengths_3', e.target.value)} />
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader><CardTitle>95. Three areas to improve</CardTitle></CardHeader>
          <CardContent className="space-y-2">
              <Input placeholder="(1)" value={data.improvement_areas_1||""} onChange={e=>handleInputChange('improvement_areas_1', e.target.value)} />
              <Input placeholder="(2)" value={data.improvement_areas_2||""} onChange={e=>handleInputChange('improvement_areas_2', e.target.value)} />
              <Input placeholder="(3)" value={data.improvement_areas_3||""} onChange={e=>handleInputChange('improvement_areas_3', e.target.value)} />
          </CardContent>
      </Card>
      
      <Card><CardHeader><CardTitle>96. Feedback you often receive</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.common_feedback || ""} onChange={e=>handleInputChange('common_feedback', e.target.value)} rows={3} /></CardContent></Card>
      <Card><CardHeader><CardTitle>97. What you are most proud of so far</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.proudest_achievement || ""} onChange={e=>handleInputChange('proudest_achievement', e.target.value)} rows={3} /></CardContent></Card>
      
      <Card>
          <CardHeader><CardTitle>98. What you want to achieve in the coming years (select all that apply)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`achieve_${o}`} checked={(data.achievements_coming_years||[]).includes(o)} onCheckedChange={c=>handleCheckboxChange('achievements_coming_years',o,c)} /><Label htmlFor={`achieve_${o}`}>{o}</Label></div>)}
              {(data.achievements_coming_years||[]).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.achievements_coming_years_other||""} onChange={e=>handleInputChange('achievements_coming_years_other',e.target.value)} />}
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader><CardTitle>99. How you will embed strategy in daily work</CardTitle></CardHeader>
          <CardContent>
              <RadioGroup value={data.strategy_embed} onValueChange={v=>handleInputChange('strategy_embed',v)} className="grid grid-cols-2 gap-4">
                  {strategyEmbed.map(o => <div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`strat_${o}`} /><Label htmlFor={`strat_${o}`}>{o}</Label></div>)}
              </RadioGroup>
              {data.strategy_embed === 'Other' && <Input className="mt-2" placeholder="Please specify" value={data.strategy_embed_other||""} onChange={e=>handleInputChange('strategy_embed_other',e.target.value)} />}
          </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>100. The best advice you have received</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.best_advice || ""} onChange={e=>handleInputChange('best_advice', e.target.value)} rows={3} /></CardContent></Card>
      
      <Card>
          <CardHeader><CardTitle>K. Closing (101–107)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              <div><Label>101. Ready to invest at least 10 hours per week:<span className="text-red-500 ml-1">*</span></Label><RadioGroup value={String(data.invest_hours)} onValueChange={v => handleInputChange('invest_hours', v === 'true')} className="flex gap-4 mt-1"><div className="flex items-center space-x-2"><RadioGroupItem value="true" id="h_yes" /><Label htmlFor="h_yes">Yes</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="false" id="h_no" /><Label htmlFor="h_no">No</Label></div></RadioGroup></div>
              <div><Label>102. Ready to invest at least ₪20,000 in the coming year:<span className="text-red-500 ml-1">*</span></Label><RadioGroup value={String(data.invest_capital)} onValueChange={v => handleInputChange('invest_capital', v === 'true')} className="flex gap-4 mt-1"><div className="flex items-center space-x-2"><RadioGroupItem value="true" id="c_yes" /><Label htmlFor="c_yes">Yes</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="false" id="c_no" /><Label htmlFor="c_no">No</Label></div></RadioGroup></div>
              <div><Label>103. Confirm you have read and agree to the Terms and Privacy Policy:<span className="text-red-500 ml-1">*</span></Label><RadioGroup value={String(data.confirm_terms)} onValueChange={v => handleInputChange('confirm_terms', v === 'true')} className="flex gap-4 mt-1"><div className="flex items-center space-x-2"><RadioGroupItem value="true" id="t_yes" /><Label htmlFor="t_yes">Yes</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="false" id="t_no" /><Label htmlFor="t_no">No</Label></div></RadioGroup></div>
              <div>
                  <Label>104. Any domains you will not work in for ethical reasons:</Label>
                  <RadioGroup value={String(data.ethical_reasons?.exists || false)} onValueChange={v => onChange({ethical_reasons: {exists: v === 'true'}})} className="flex gap-4 mt-1">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="true" id="e_yes" /><Label htmlFor="e_yes">Yes</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="false" id="e_no" /><Label htmlFor="e_no">No</Label></div>
                  </RadioGroup>
                  {(data.ethical_reasons?.exists === true) && <Input className="mt-2" placeholder="If yes — specify" value={data.ethical_reasons?.details||""} onChange={e=>onChange({ethical_reasons: {...data.ethical_reasons, details: e.target.value}})} />}
              </div>
              <div>
                  <Label>105. “Early expert mentoring improves SME survival compared to relying only on founder skills”:</Label>
                  <RadioGroup value={data.mentoring_opinion} onValueChange={v => handleInputChange('mentoring_opinion', v)} className="flex gap-4 mt-1">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Agree" id="o_agree" /><Label htmlFor="o_agree">Agree</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Disagree" id="o_disagree" /><Label htmlFor="o_disagree">Disagree</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Not sure" id="o_notsure" /><Label htmlFor="o_notsure">Not sure</Label></div>
                  </RadioGroup>
              </div>
              <div>
                  <Label>106. If you commit to a venture, how well will you meet personal deadlines:</Label>
                  <div className="flex items-center gap-4 justify-start mt-2">
                      {[1,2,3,4,5].map(v => <button key={v} type="button" onClick={()=>handleInputChange('deadline_commitment', String(v))} className={`w-12 h-12 rounded-full border-2 ${data.deadline_commitment === String(v) ? 'bg-accent text-accent-foreground' : 'border-gray-300 bg-white text-gray-700'}`}>{v}</button>)}
                  </div>
              </div>
              <div><Label>107. Right after receiving your Ventura-107 report — what is your next step?</Label><Textarea placeholder="..." value={data.next_step || ""} onChange={e=>handleInputChange('next_step', e.target.value)} rows={3} /></div>
          </CardContent>
      </Card>
      
      <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 text-center space-y-4">
        <h3 className="text-xl font-bold text-text-primary">Questionnaire Complete</h3>
        <p className="text-text-secondary">Thank you for completing Ventura-107. Your responses have been received. A professional, concise report will be prepared and sent to you.</p>
      </div>
    </div>
  );
}
