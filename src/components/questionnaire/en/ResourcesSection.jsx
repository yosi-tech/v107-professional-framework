
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, Users, Briefcase, Home } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function ResourcesSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };
  
  const handleCheckboxChange = (field, item, isChecked) => {
    const currentArray = data[field] || [];
    const newArray = isChecked
      ? [...currentArray, item]
      : currentArray.filter((i) => i !== item);
    onChange({ [field]: newArray });
  };

  const timeOptions = ["<5 h", "5–10 h", "11–20 h", "21–30 h", ">30 h"];
  const capitalOptions = ["up to ₪70,000", "up to ₪150,000", "up to ₪500,000", "over ₪500,000"];
  const loanRangeOptions = ["₪0–50k", "₪50–150k", "₪150–500k", ">₪500k"];
  const travelOptions = ["Local only", "Up to 1-hour drive", "Nationwide", "International"];
  const assetOptions = ["Office", "Car", "Computing/IT", "Storage", "Other"];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">D. Available resources (31–40)</h2>
      </div>

      <Card>
        <CardHeader><CardTitle>31. Weekly time you can invest</CardTitle></CardHeader>
        <CardContent>
          <RadioGroup value={data.weekly_time} onValueChange={(value) => handleInputChange("weekly_time", value)} className="flex flex-wrap gap-4">
            {timeOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`time_${option}`} />
                <Label htmlFor={`time_${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>32. Liquid own capital available (ILS)</CardTitle></CardHeader>
        <CardContent>
          <RadioGroup value={data.available_capital} onValueChange={(value) => handleInputChange("available_capital", value)} className="flex flex-wrap gap-4">
            {capitalOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`capital_${option}`} />
                <Label htmlFor={`capital_${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      {[
          {key: 'external_investor_willingness', title: '33. Openness to a partner or investor'},
          {key: 'family_support', title: '35. Family or close support level'},
          {key: 'tech_capability', title: '40. Digital and tech proficiency'},
      ].map(field => (
          <Card key={field.key}>
              <CardHeader><CardTitle>{field.title}</CardTitle></CardHeader>
              <CardContent>
                  <Label>Rate:</Label>
                  <div className="flex items-center gap-4 justify-start mt-2">
                  {[1, 2, 3, 4, 5].map(value => (
                      <button key={value} type="button" onClick={() => handleInputChange(field.key, String(value))}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${data[field.key] === String(value) ? 'bg-accent border-accent text-white scale-110 shadow-lg' : 'border-slate-300 hover:border-accent'}`}>
                          {value}
                      </button>
                  ))}
                  </div>
              </CardContent>
          </Card>
      ))}

      <Card>
        <CardHeader><CardTitle>34. Relevant network or contacts</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={data.relevant_network || ""} onChange={(e) => handleInputChange("relevant_network", e.target.value)} placeholder="Describe relevant contacts..." rows={3} maxLength={200} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>36. Do you already have a potential partner?</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <RadioGroup value={String(data.potential_partner?.has_partner)} onValueChange={(value) => onChange({ potential_partner: { has_partner: value === 'true' }})} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="true" id="partner_yes" /><Label htmlFor="partner_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="false" id="partner_no" /><Label htmlFor="partner_no">No</Label></div>
          </RadioGroup>
          {data.potential_partner?.has_partner && <Input placeholder="If yes — role/name" value={data.potential_partner?.details || ""} onChange={(e) => onChange({ potential_partner: { ...data.potential_partner, details: e.target.value }})} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>37. Willing to use credit/loan?</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={String(data.loan_willingness)} onValueChange={(value) => handleInputChange("loan_willingness", value === 'true')} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="true" id="loan_yes" /><Label htmlFor="loan_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="false" id="loan_no" /><Label htmlFor="loan_no">No</Label></div>
          </RadioGroup>
          {data.loan_willingness && (
            <div>
              <Label>If yes — desired range:</Label>
              <RadioGroup value={data.loan_range} onValueChange={(value) => handleInputChange("loan_range", value)} className="flex flex-wrap gap-4 mt-2">
                {loanRangeOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`loan_range_${option}`} />
                    <Label htmlFor={`loan_range_${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>38. Availability for travel/meetings</CardTitle></CardHeader>
        <CardContent>
           <RadioGroup value={data.travel_availability} onValueChange={(value) => handleInputChange("travel_availability", value)} className="flex flex-wrap gap-4">
            {travelOptions.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`travel_${option}`} />
                <Label htmlFor={`travel_${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>39. Assets or equipment available</CardTitle></CardHeader>
        <CardContent>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {assetOptions.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`asset_${option}`}
                    checked={(data.relevant_assets || []).includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange("relevant_assets", option, checked)}
                  />
                  <Label htmlFor={`asset_${option}`}>{option}</Label>
                </div>
              ))}
           </div>
           {(data.relevant_assets || []).includes("Other") && (
              <Input className="mt-2" placeholder="Please specify" value={data.relevant_assets_other || ""} onChange={(e) => handleInputChange("relevant_assets_other", e.target.value)} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
