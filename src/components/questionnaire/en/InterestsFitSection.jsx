
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, DollarSign, Shield, Lightbulb, TrendingUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function InterestsFitSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };
  
  const handleCheckboxChange = (field, item, isChecked, maxItems) => {
    const currentArray = data[field] || [];
    let newArray;
    if (isChecked) {
      if (!maxItems || currentArray.length < maxItems) {
        newArray = [...currentArray, item];
      } else {
        return; 
      }
    } else {
      newArray = currentArray.filter((i) => i !== item);
    }
    onChange({ [field]: newArray });
  };

  const domainOptions = ["Food/Retail", "Professional Services", "Trade/Import", "Digital/E-commerce", "Education/Training", "Health/Wellness", "B2B Services", "Real Estate", "Technology", "Other"];
  const hobbiesOptions = ["Technology/Gadgets", "Writing/Content", "Photo/Video", "Cooking/Culinary", "Fitness/Sports", "Music/Production", "Art/Design", "DIY/Gardening", "Learning/Teaching", "Volunteering/Community", "Gaming", "Travel/Tourism", "Finance/Investing", "Other"];
  const growingMarketsOptions = ["AI/Automation", "Cybersecurity", "Urban Logistics", "Digital Education", "Digital Health", "Sustainability/Circular Economy", "Experiences/Tourism", "E-commerce/D2C", "Creator Economy", "Home Services/Renovation", "Other"];
  const entrepreneurshipAttractions = ["Autonomy", "Earning potential", "Impact/Mission", "Flexibility", "Creation/Innovation", "Other"];

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="bg-amber-400 mb-4 mx-auto w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center">
          <Lightbulb className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">C. Interest & fit (21–30)</h2>
      </div>
      
      <Card>
        <CardHeader><CardTitle>21. Business domains of interest (select up to 3)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {domainOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`interest_${option}`}
                checked={(data.preferred_fields || []).includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange("preferred_fields", option, checked, 3)}
              />
              <Label htmlFor={`interest_${option}`}>{option}</Label>
            </div>
          ))}
          {(data.preferred_fields || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.preferred_fields_other || ""} onChange={(e) => handleInputChange("preferred_fields_other", e.target.value)} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>22. Domains you are less interested in (select up to 3)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {domainOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`less_interest_${option}`}
                checked={(data.less_interesting || []).includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange("less_interesting", option, checked, 3)}
              />
              <Label htmlFor={`less_interest_${option}`}>{option}</Label>
            </div>
          ))}
          {(data.less_interesting || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.less_interesting_other || ""} onChange={(e) => handleInputChange("less_interesting_other", e.target.value)} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>23. What attracts you most to entrepreneurship (choose one)</CardTitle></CardHeader>
        <CardContent>
          <RadioGroup value={data.entrepreneurship_appeal} onValueChange={(value) => handleInputChange("entrepreneurship_appeal", value)} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {entrepreneurshipAttractions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`appeal_${option}`} />
                <Label htmlFor={`appeal_${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {data.entrepreneurship_appeal === "Other" && <Input className="mt-2" placeholder="Please specify" value={data.entrepreneurship_appeal_other || ""} onChange={(e) => handleInputChange("entrepreneurship_appeal_other", e.target.value)} />}
        </CardContent>
      </Card>

      {[
        { key: "social_mission_importance", title: "24. Importance of mission/social value", icon: Heart },
        { key: "income_potential_importance", title: "25. Importance of earning potential", icon: DollarSign },
        { key: "stability_importance", title: "26. Importance of stability/security", icon: Shield }
      ].map(field => (
        <Card key={field.key}>
          <CardHeader><CardTitle className="flex items-center gap-2">{field.title}</CardTitle></CardHeader>
          <CardContent>
             <Label>Rate:</Label>
            <div className="flex items-center gap-4 justify-start mt-2">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange(field.key, String(value))}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  data[field.key] === String(value) ? 'bg-accent border-accent text-white scale-110 shadow-lg' : 'border-slate-300 hover:border-accent'}`
                  }>
                    {value}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader><CardTitle>27. Hobbies and interests (select all that apply)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {hobbiesOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`hobby_${option}`}
                checked={(data.hobbies || []).includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange("hobbies", option, checked)}
              />
              <Label htmlFor={`hobby_${option}`}>{option}</Label>
            </div>
          ))}
          {(data.hobbies || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.hobbies_other || ""} onChange={(e) => handleInputChange("hobbies_other", e.target.value)} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>28. Have you already explored or invested in any domain?</CardTitle></CardHeader>
        <CardContent className="space-y-2">
           <RadioGroup value={String(data.investigated_fields?.has_investigated)} onValueChange={(value) => onChange({ investigated_fields: { has_investigated: value === 'true' }})} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="true" id="investigated_yes" /><Label htmlFor="investigated_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="false" id="investigated_no" /><Label htmlFor="investigated_no">No</Label></div>
          </RadioGroup>
          {data.investigated_fields?.has_investigated && <Input placeholder="If yes — field & involvement" value={data.investigated_fields?.details || ""} onChange={(e) => onChange({ investigated_fields: { ...data.investigated_fields, details: e.target.value }})} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>29. Markets that look growing (select up to 3)</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
           {growingMarketsOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`market_${option}`}
                checked={(data.growing_markets || []).includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange("growing_markets", option, checked, 3)}
              />
              <Label htmlFor={`market_${option}`}>{option}</Label>
            </div>
          ))}
          {(data.growing_markets || []).includes("Other") && <Input className="mt-2" placeholder="Please specify" value={data.growing_markets_other || ""} onChange={(e) => handleInputChange("growing_markets_other", e.target.value)} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>30. Domains you would reject immediately</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={data.excluded_fields || ""} onChange={(e) => handleInputChange("excluded_fields", e.target.value)} placeholder="Describe domains..." rows={3} maxLength={200} />
        </CardContent>
      </Card>

    </div>
  );
}
