
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Calendar, TrendingUp, Star, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function GoalsSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleCheckboxChange = (field, item, isChecked, maxItems) => {
    const currentArray = data[field] || [];
    let newArray;
    if (isChecked) {
      if (!maxItems || currentArray.length < maxItems) {
        newArray = [...currentArray, item];
      } else { return; }
    } else {
      newArray = currentArray.filter((i) => i !== item);
    }
    onChange({ [field]: newArray });
  };
  
  const balancePriorities = ["Weekly hours", "Fixed vacations", "High flexibility", "Other"];
  const deliverables = ["Pricing", "Tax registrations", "Website/Landing page", "Basic lead funnel", "Key supplier contract", "Hire employee/contractor", "Other"];
  const successOptions = ["Target revenue", "Profitability", "Number of customers", "Build a team", "Other"];
  const fearOptions = ["Failure", "Debt", "Lack of time", "Lack of customers", "Regulation", "Other"];
  const traits = ["Persistence", "Discipline", "Creativity", "Analytical", "Fast learner", "Communication", "Leadership", "Other"];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">E. Goals & targets (12–60 months) (41–50)</h2>
      </div>

      <Card>
        <CardHeader><CardTitle>41. Three business goals for the next 12 months</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="(1)" value={data.business_goals_12m_1 || ""} onChange={e => handleInputChange('business_goals_12m_1', e.target.value)} maxLength={120} />
          <Input placeholder="(2)" value={data.business_goals_12m_2 || ""} onChange={e => handleInputChange('business_goals_12m_2', e.target.value)} maxLength={120} />
          <Input placeholder="(3)" value={data.business_goals_12m_3 || ""} onChange={e => handleInputChange('business_goals_12m_3', e.target.value)} maxLength={120} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>42. Three personal goals for the next 12 months</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="(1)" value={data.personal_goals_12m_1 || ""} onChange={e => handleInputChange('personal_goals_12m_1', e.target.value)} maxLength={120} />
          <Input placeholder="(2)" value={data.personal_goals_12m_2 || ""} onChange={e => handleInputChange('personal_goals_12m_2', e.target.value)} maxLength={120} />
          <Input placeholder="(3)" value={data.personal_goals_12m_3 || ""} onChange={e => handleInputChange('personal_goals_12m_3', e.target.value)} maxLength={120} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>43. Monthly income target</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input type="number" placeholder="Amount" value={data.monthly_income_target || ""} onChange={e => handleInputChange('monthly_income_target', e.target.value)} min="0" />
          <RadioGroup value={data.income_mark} onValueChange={v => handleInputChange('income_mark', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="Net" id="net" /><Label htmlFor="net">Net</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="Gross" id="gross" /><Label htmlFor="gross">Gross</Label></div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>44. Work–life balance priority</CardTitle></CardHeader>
        <CardContent>
           <RadioGroup value={data.work_life_balance_target} onValueChange={v => handleInputChange('work_life_balance_target', v)} className="grid grid-cols-2 gap-4">
            {balancePriorities.map(o => <div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`balance_${o}`} /><Label htmlFor={`balance_${o}`}>{o}</Label></div>)}
          </RadioGroup>
          {data.work_life_balance_target === 'Other' && <Input className="mt-2" placeholder="Please specify" value={data.work_life_balance_other || ""} onChange={e => handleInputChange('work_life_balance_other', e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>45. Three-to-five-year growth vision</CardTitle></CardHeader>
        <CardContent>
          <Textarea placeholder="Describe your vision..." value={data.growth_vision_3_5y || ""} onChange={e => handleInputChange('growth_vision_3_5y', e.target.value)} rows={3} maxLength={200} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>46. Desired deliverables in the first 30–90 days (select up to 3)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {deliverables.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`deliverable_${o}`} checked={(data.goals_90_days||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('goals_90_days', o, c, 3)} /><Label htmlFor={`deliverable_${o}`}>{o}</Label></div>)}
          {(data.goals_90_days || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.goals_90_days_other || ""} onChange={e => handleInputChange('goals_90_days_other', e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>47. “Success in one year” means</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <RadioGroup value={data.success_definition} onValueChange={v => handleInputChange('success_definition', v)} className="grid grid-cols-2 gap-4">
            {successOptions.map(o => <div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`success_${o}`} /><Label htmlFor={`success_${o}`}>{o}</Label></div>)}
          </RadioGroup>
          <Input placeholder="Note:" value={data.success_definition_note || ""} onChange={e => handleInputChange('success_definition_note', e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>48. Main fear when starting a business</CardTitle></CardHeader>
        <CardContent>
          <RadioGroup value={data.biggest_fear} onValueChange={v => handleInputChange('biggest_fear', v)} className="grid grid-cols-2 gap-4">
            {fearOptions.map(o => <div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`fear_${o}`} /><Label htmlFor={`fear_${o}`}>{o}</Label></div>)}
          </RadioGroup>
          {data.biggest_fear === 'Other' && <Input className="mt-2" placeholder="Please specify" value={data.biggest_fear_other || ""} onChange={e => handleInputChange('biggest_fear_other', e.target.value)} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>49. Two to three must-have conditions before entering a business</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="(1)" value={data.essential_conditions_1 || ""} onChange={e => handleInputChange('essential_conditions_1', e.target.value)} maxLength={120} />
          <Input placeholder="(2)" value={data.essential_conditions_2 || ""} onChange={e => handleInputChange('essential_conditions_2', e.target.value)} maxLength={120} />
          <Input placeholder="(3)" value={data.essential_conditions_3 || ""} onChange={e => handleInputChange('essential_conditions_3', e.target.value)} maxLength={120} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>50. Personal traits that will help you (select up to 3)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {traits.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`trait_${o}`} checked={(data.helpful_traits||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('helpful_traits', o, c, 3)} /><Label htmlFor={`trait_${o}`}>{o}</Label></div>)}
          {(data.helpful_traits || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.helpful_traits_other || ""} onChange={e => handleInputChange('helpful_traits_other', e.target.value)} />}
        </CardContent>
      </Card>
    </div>
  );
}
