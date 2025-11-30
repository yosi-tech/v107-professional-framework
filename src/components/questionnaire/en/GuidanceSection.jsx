
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, MessageCircle, Star, Users, Target, Lightbulb, TrendingUp, Briefcase } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function GuidanceSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleCheckboxChange = (field, item, isChecked, maxItems) => {
    const currentArray = data[field] || [];
    let newArray;
    if (isChecked) {
      if (!maxItems || currentArray.length < maxItems) { newArray = [...currentArray, item]; } else { return; }
    } else {
      newArray = currentArray.filter((i) => i !== item);
    }
    onChange({ [field]: newArray });
  };

  const mentoringAreas = ["Finance", "Marketing", "Sales", "Operations", "HR", "Product/UX", "Legal", "Other"];
  const workModes = ["In-person", "Zoom", "Hybrid", "Email-only"];
  const successOptions = ["Profitability", "Revenue growth", "Stable cash flow", "Building a team", "Other"];
  const engagementHelpers = ["Fixed schedule", "Weekly goals", "Accountability", "Peer group", "Other"];
  const stopReasons = ["Lack of time", "Budget", "Change of direction", "Mismatch", "Other"];
  const firstMeetingWants = ["Financial assessment", "Value proposition focus", "Pricing", "Basic marketing plan", "Other"];
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCheck className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">I. Expectations from mentoring (81–90)</h2>
      </div>

      <Card>
        <CardHeader><CardTitle>81. Areas you want mentoring in (select up to 3)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mentoringAreas.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`mentor_${o}`} checked={(data.helpful_guidance_areas||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('helpful_guidance_areas', o, c, 3)} /><Label htmlFor={`mentor_${o}`}>{o}</Label></div>)}
            {(data.helpful_guidance_areas || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.helpful_guidance_areas_other || ""} onChange={e => handleInputChange('helpful_guidance_areas_other', e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card><CardHeader><CardTitle>82. What value you expect to get</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.guidance_expectations || ""} onChange={e => handleInputChange('guidance_expectations', e.target.value)} maxLength={200} /></CardContent></Card>
      
      <Card>
        <CardHeader><CardTitle>83. Preferred work mode</CardTitle></CardHeader>
        <CardContent>
          <RadioGroup value={data.preferred_guidance_format} onValueChange={v => handleInputChange('preferred_guidance_format', v)} className="flex flex-wrap gap-4">
            {workModes.map(o => <div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`mode_${o}`} /><Label htmlFor={`mode_${o}`}>{o}</Label></div>)}
          </RadioGroup>
        </CardContent>
      </Card>

      {[
        {key: 'consistent_vs_network_importance', title: '84. Importance of a dedicated personal mentor'},
        {key: 'external_experts_importance', title: '85. Importance of involving external experts'},
      ].map(field => (
          <Card key={field.key}>
              <CardHeader><CardTitle>{field.title}</CardTitle></CardHeader>
              <CardContent>
                  <Label>Rate:</Label>
                  <div className="flex items-center gap-4 justify-start mt-2">
                      {[1,2,3,4,5].map(v => <button key={v} type="button" onClick={()=>handleInputChange(field.key, String(v))} className={`w-12 h-12 rounded-full border-2 transition-colors ${data[field.key] === String(v) ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300 hover:border-amber-400'}`}>{v}</button>)}
                  </div>
              </CardContent>
          </Card>
      ))}
      
      <Card>
        <CardHeader><CardTitle>86. What will count as success</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <RadioGroup value={data.success_definition_1y} onValueChange={v => handleInputChange('success_definition_1y', v)} className="grid grid-cols-2 gap-4">
            {successOptions.map(o => <div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`success_${o}`} /><Label htmlFor={`success_${o}`}>{o}</Label></div>)}
          </RadioGroup>
          <Input placeholder="Note:" value={data.success_definition_1y_note || ""} onChange={e => handleInputChange('success_definition_1y_note', e.target.value)} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>87. What will help you stay engaged for five months</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {engagementHelpers.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`engage_${o}`} checked={(data.stay_engaged_reasons||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('stay_engaged_reasons', o, c)} /><Label htmlFor={`engage_${o}`}>{o}</Label></div>)}
            {(data.stay_engaged_reasons || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.stay_engaged_reasons_other || ""} onChange={e => handleInputChange('stay_engaged_reasons_other', e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>88. What could cause you to stop midway</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stopReasons.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`stop_${o}`} checked={(data.stop_midway_reasons||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('stop_midway_reasons', o, c)} /><Label htmlFor={`stop_${o}`}>{o}</Label></div>)}
            {(data.stop_midway_reasons || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.stop_midway_reasons_other || ""} onChange={e => handleInputChange('stop_midway_reasons_other', e.target.value)} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>89. What you would like to receive in the first meeting</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {firstMeetingWants.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`meet_${o}`} checked={(data.first_meeting_wants||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('first_meeting_wants', o, c)} /><Label htmlFor={`meet_${o}`}>{o}</Label></div>)}
            {(data.first_meeting_wants || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.first_meeting_wants_other || ""} onChange={e => handleInputChange('first_meeting_wants_other', e.target.value)} />}
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>90. Questions for us</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.questions_for_us || ""} onChange={e => handleInputChange('questions_for_us', e.target.value)} maxLength={200} /></CardContent></Card>
    </div>
  );
}
