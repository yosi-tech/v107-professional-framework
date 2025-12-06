import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function ExecutiveSummaryEditor({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    top_strengths: data?.top_strengths || ['', '', ''],
    improvement_areas: data?.improvement_areas || ['', '', ''],
    conclusion: data?.conclusion || ''
  });

  const updateStrength = (index, value) => {
    const newStrengths = [...formData.top_strengths];
    newStrengths[index] = value;
    setFormData({ ...formData, top_strengths: newStrengths });
  };

  const updateImprovementArea = (index, value) => {
    const newAreas = [...formData.improvement_areas];
    newAreas[index] = value;
    setFormData({ ...formData, improvement_areas: newAreas });
  };

  const addStrength = () => {
    setFormData({ ...formData, top_strengths: [...formData.top_strengths, ''] });
  };

  const removeStrength = (index) => {
    const newStrengths = formData.top_strengths.filter((_, i) => i !== index);
    setFormData({ ...formData, top_strengths: newStrengths });
  };

  const addImprovementArea = () => {
    setFormData({ ...formData, improvement_areas: [...formData.improvement_areas, ''] });
  };

  const removeImprovementArea = (index) => {
    const newAreas = formData.improvement_areas.filter((_, i) => i !== index);
    setFormData({ ...formData, improvement_areas: newAreas });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-semibold text-green-900">חוזקות מרכזיות</Label>
          <Button onClick={addStrength} size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="w-3 h-3" />
            הוסף
          </Button>
        </div>
        <div className="space-y-3">
          {formData.top_strengths.map((strength, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-green-700 font-semibold mt-2">{index + 1}.</span>
              <Textarea
                value={strength}
                onChange={(e) => updateStrength(index, e.target.value)}
                placeholder="חוזקה מרכזית..."
                className="flex-1 min-h-[60px] text-right bg-white"
                dir="rtl"
              />
              {formData.top_strengths.length > 1 && (
                <Button
                  onClick={() => removeStrength(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-orange-50 border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-semibold text-orange-900">מוקדי שיפור דחופים</Label>
          <Button onClick={addImprovementArea} size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="w-3 h-3" />
            הוסף
          </Button>
        </div>
        <div className="space-y-3">
          {formData.improvement_areas.map((area, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-orange-700 font-semibold mt-2">{index + 1}.</span>
              <Textarea
                value={area}
                onChange={(e) => updateImprovementArea(index, e.target.value)}
                placeholder="תחום לשיפור..."
                className="flex-1 min-h-[60px] text-right bg-white"
                dir="rtl"
              />
              {formData.improvement_areas.length > 1 && (
                <Button
                  onClick={() => removeImprovementArea(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <Label className="text-lg font-semibold text-blue-900 mb-4 block">מסקנה</Label>
        <Textarea
          value={formData.conclusion}
          onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
          placeholder="פסקת מסקנה מעודדת אך ריאליסטית..."
          className="min-h-[100px] text-right bg-white"
          dir="rtl"
        />
      </Card>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4 ml-2" />
          שמור
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="w-4 h-4 ml-2" />
          ביטול
        </Button>
      </div>
    </div>
  );
}