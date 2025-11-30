
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, DollarSign, Home, X, BarChart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ChallengesSection({ data, onChange }) {
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
  
  const skillGaps = ["Pricing", "Marketing", "Sales", "Operations", "HR", "IT", "Contracts", "BI/Data", "Other"];
  const timeConstraints = ["Workload", "Family/Caregiving", "Studies", "Other"];
  const financialConstraints = ["Cash flow", "Own capital", "Credit access", "Existing commitments", "Other"];
  const habitsToChange = ["Procrastination", "Poor prioritization", "Time management", "Not delegating", "Other"];
  const slowsDown = ["Time", "Money", "Knowledge/Skills", "Customers", "Other"];
  const externalFactors = ["Regulation/Licensing", "Competition/Market", "Location/Transport", "Health", "Other"];
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">F. Challenges & constraints (51–60)</h2>
      </div>

      <Card>
        <CardHeader><CardTitle>51. Skill gaps (select up to 3)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skillGaps.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`gap_${o}`} checked={(data.skill_gaps||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('skill_gaps', o, c, 3)} /><Label htmlFor={`gap_${o}`}>{o}</Label></div>)}
          {(data.skill_gaps || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.skill_gaps_other || ""} onChange={e => handleInputChange('skill_gaps_other', e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>52. Time constraints (select all that apply)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {timeConstraints.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`time_${o}`} checked={(data.time_constraints||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('time_constraints', o, c)} /><Label htmlFor={`time_${o}`}>{o}</Label></div>)}
          {(data.time_constraints || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.time_constraints_other || ""} onChange={e => handleInputChange('time_constraints_other', e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>53. Financial constraints (select all that apply)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {financialConstraints.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`finance_${o}`} checked={(data.financial_constraints||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('financial_constraints', o, c)} /><Label htmlFor={`finance_${o}`}>{o}</Label></div>)}
          {(data.financial_constraints || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.financial_constraints_other || ""} onChange={e => handleInputChange('financial_constraints_other', e.target.value)} />}
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>54. Family or personal constraints</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.family_limitations || ""} onChange={e=>handleInputChange('family_limitations', e.target.value)} maxLength={200} /></CardContent></Card>
      <Card><CardHeader><CardTitle>55. A past attempt that didn’t work — what did you learn?</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.past_failures || ""} onChange={e=>handleInputChange('past_failures', e.target.value)} maxLength={200} /></CardContent></Card>
      <Card><CardHeader><CardTitle>56. A domain you failed or gave up</CardTitle></CardHeader><CardContent><Textarea placeholder="..." value={data.failed_fields || ""} onChange={e=>handleInputChange('failed_fields', e.target.value)} maxLength={200} /></CardContent></Card>

      <Card>
        <CardHeader><CardTitle>57. Habits to change (select all that apply)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {habitsToChange.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`habit_${o}`} checked={(data.habits_to_change||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('habits_to_change', o, c)} /><Label htmlFor={`habit_${o}`}>{o}</Label></div>)}
          {(data.habits_to_change || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.habits_to_change_other || ""} onChange={e => handleInputChange('habits_to_change_other', e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>58. What slows you down most today</CardTitle></CardHeader>
        <CardContent>
          <RadioGroup value={data.slows_down} onValueChange={v => handleInputChange('slows_down', v)} className="grid grid-cols-2 gap-4">
            {slowsDown.map(o => <div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`slow_${o}`} /><Label htmlFor={`slow_${o}`}>{o}</Label></div>)}
          </RadioGroup>
          {data.slows_down === 'Other' && <Input className="mt-2" placeholder="Please specify" value={data.slows_down_other || ""} onChange={e => handleInputChange('slows_down_other', e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>59. External factors that may slow you (select all that apply)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {externalFactors.map(o => <div key={o} className="flex items-center space-x-2"><Checkbox id={`external_${o}`} checked={(data.external_obstacles||[]).includes(o)} onCheckedChange={c => handleCheckboxChange('external_obstacles', o, c)} /><Label htmlFor={`external_${o}`}>{o}</Label></div>)}
          {(data.external_obstacles || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.external_obstacles_other || ""} onChange={e => handleInputChange('external_obstacles_other', e.target.value)} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>60. Tendency to procrastinate</CardTitle></CardHeader>
        <CardContent>
          <Label>Rate:</Label>
            <div className="flex items-center gap-4 justify-start mt-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange("procrastination_tendency", String(value))}
                className={`w-12 h-12 rounded-full border-2 transition-colors ${
                  data.procrastination_tendency === String(value)
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'border-gray-300 hover:border-amber-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
