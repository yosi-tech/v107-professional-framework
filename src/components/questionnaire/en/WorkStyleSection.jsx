
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function WorkStyleSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };
  
  const radioOptions = {
      '61': { key: 'alone_vs_team', options: ['Solo', 'Team', 'Hybrid']},
      '62': { key: 'lead_vs_join', options: ['Lead new', 'Join existing']},
      '66': { key: 'decision_making', options: ['Fast', 'After extended analysis']},
      '67': { key: 'creative_vs_analytical', options: ['Creative', 'Analytical', 'Combination']},
      '68': { key: 'vision_vs_execution', options: ['Vision', 'Execution', 'Combination']},
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">G. Work style & preferences (61–70)</h2>
      </div>
      
      {Object.entries(radioOptions).map(([qNum, qData]) => (
          <Card key={qData.key}>
              <CardHeader><CardTitle>{qNum}. {qNum === '61' ? 'Prefer' : qNum === '62' ? 'Lead a new venture or join an existing one' : qNum === '66' ? 'Decision-making style' : qNum === '67' ? 'You are more' : 'Orientation'}</CardTitle></CardHeader>
              <CardContent>
                  <RadioGroup value={data[qData.key]} onValueChange={v => handleInputChange(qData.key, v)} className="flex flex-wrap gap-4">
                      {qData.options.map(o => <div key={o} className="flex items-center space-x-2"><RadioGroupItem value={o} id={`${qData.key}_${o}`} /><Label htmlFor={`${qData.key}_${o}`}>{o}</Label></div>)}
                  </RadioGroup>
              </CardContent>
          </Card>
      ))}

      {[
        { key: "organization_level", title: "63. How structured and organized you are" },
        { key: "risk_taking", title: "64. Willingness to take risks" },
        { key: "managing_employees_importance", title: "69. Importance of managing employees" },
        { key: "customer_facing_importance", title: "70. Importance of direct work with customers" },
      ].map(field => (
        <Card key={field.key}>
          <CardHeader><CardTitle>{field.title}</CardTitle></CardHeader>
          <CardContent>
            <Label>Rate:</Label>
            <div className="flex items-center gap-4 justify-start mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange(field.key, String(value))}
                  className={`w-12 h-12 rounded-full border-2 transition-colors ${
                    data[field.key] === String(value)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card>
          <CardHeader><CardTitle>65. How you handle pressure</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              value={data.stress_handling || ""}
              onChange={(e) => handleInputChange('stress_handling', e.target.value)}
              placeholder="Describe how you handle pressure..."
              maxLength={200}
              rows={3}
            />
          </CardContent>
        </Card>
    </div>
  );
}
