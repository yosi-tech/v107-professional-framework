
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Target, Users, TrendingUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ProfessionalExperienceSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };
  
  const handleCheckboxChange = (field, item, isChecked, maxItems) => {
    const currentArray = data[field] || [];
    let newArray;
    if (isChecked) {
      if (currentArray.length < maxItems) {
        newArray = [...currentArray, item];
      } else {
        // Optionally notify the user they can only select up to maxItems
        return; 
      }
    } else {
      newArray = currentArray.filter((i) => i !== item);
    }
    onChange({ [field]: newArray });
  };

  const domainOptions = ["Operations", "B2B Sales", "B2C Sales", "Digital Marketing", "Finance/Pricing", "Product/UX", "Procurement/Logistics", "Customer Service", "Project Management", "Training/Implementation", "Legal/Contracts", "HR/Recruiting", "IT/Technology", "Strategy", "Data/BI"];
  const skillOptions = ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"]; // Placeholder skills
  const techOptions = ["Excel/Sheets", "CRM (HubSpot/Salesforce)", "Meta/Google Ads", "WordPress/Wix", "ERP", "BI tools", "Drive/Slack/Teams", "Bookkeeping", "Other"];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">B. Experience & skills (11–20)</h2>
        <p className="text-gray-600">Describe your professional experience and skills.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>11. Top three domains of experience (select up to 3)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {domainOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`domain_${option}`}
                checked={(data.main_experience_areas || []).includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange("main_experience_areas", option, checked, 3)}
              />
              <Label htmlFor={`domain_${option}`}>{option}</Label>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>12. Key professional skills (select up to 5)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skillOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`skill_${option}`}
                checked={(data.professional_skills || []).includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange("professional_skills", option, checked, 5)}
              />
              <Label htmlFor={`skill_${option}`}>{option}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>13. Tools/technologies you use (select all that apply)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {techOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`tech_${option}`}
                checked={(data.tools_technologies || []).includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange("tools_technologies", option, checked, techOptions.length)}
              />
              <Label htmlFor={`tech_${option}`}>{option}</Label>
            </div>
          ))}
           {(data.tools_technologies || []).includes("Other") && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
                  value={data.tools_technologies_other || ""}
                  onChange={(e) => handleInputChange("tools_technologies_other", e.target.value)}
                  maxLength={200}
                />
            )}
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader><CardTitle>14. Two relevant achievements</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              value={data.achievements || ""}
              onChange={(e) => handleInputChange("achievements", e.target.value)}
              placeholder="Describe two relevant achievements..."
              className="mt-2 min-h-[100px]"
              rows={4}
              maxLength={400}
            />
          </CardContent>
      </Card>

      {[
        {key: 'team_work_experience', title: '15. Teamwork and people management'},
        {key: 'financial_management', title: '17. Financial management basics'},
        {key: 'marketing_sales', title: '18. Marketing and sales capability'},
        {key: 'operations_service', title: '19. Operations and service processes'},
        {key: 'product_development', title: '20. Product or service development'},
      ].map(field => (
        <Card key={field.key}>
          <CardHeader><CardTitle>{field.title}</CardTitle></CardHeader>
          <CardContent>
            <Label>Rate:</Label>
            <div className="flex items-center gap-4 justify-start mt-2">
              {[1, 2, 3, 4, 5, "N/A"].map((value) =>
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange(field.key, String(value))}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  data[field.key] === String(value) ?
                  'bg-accent border-accent text-white scale-110 shadow-lg' :
                  'border-slate-300 hover:border-accent'}`
                  }>
                      {value}
                </button>
            )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader><CardTitle>16. Prior entrepreneurial experience</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <RadioGroup
              value={String(data.entrepreneurship_experience?.has_experience)}
              onValueChange={(value) => onChange({ entrepreneurship_experience: { has_experience: value === 'true' }})}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="exp_yes" />
                  <Label htmlFor="exp_yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="exp_no" />
                  <Label htmlFor="exp_no">No</Label>
              </div>
          </RadioGroup>
          {data.entrepreneurship_experience?.has_experience && (
            <Input
              placeholder="If yes — venture & role"
              value={data.entrepreneurship_experience?.details || ""}
              onChange={(e) => onChange({ entrepreneurship_experience: { ...data.entrepreneurship_experience, details: e.target.value }})}
              maxLength={200}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
