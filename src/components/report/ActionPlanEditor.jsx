import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function ActionPlanEditor({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    quick_wins: data?.quick_wins || [''],
    months_1_3: data?.months_1_3 || [''],
    months_4_6: data?.months_4_6 || ['']
  });

  const updateItem = (category, index, value) => {
    const newItems = [...formData[category]];
    newItems[index] = value;
    setFormData({ ...formData, [category]: newItems });
  };

  const addItem = (category) => {
    setFormData({ ...formData, [category]: [...formData[category], ''] });
  };

  const removeItem = (category, index) => {
    const newItems = formData[category].filter((_, i) => i !== index);
    setFormData({ ...formData, [category]: newItems });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-semibold text-green-900">Quick Wins (0-30 יום)</Label>
          <Button onClick={() => addItem('quick_wins')} size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="w-3 h-3" />
            הוסף
          </Button>
        </div>
        <div className="space-y-3">
          {formData.quick_wins.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-green-700 font-semibold mt-2">{index + 1}.</span>
              <Textarea
                value={item}
                onChange={(e) => updateItem('quick_wins', index, e.target.value)}
                placeholder="פעולה מיידית..."
                className="flex-1 min-h-[60px] text-right bg-white"
                dir="rtl"
              />
              {formData.quick_wins.length > 1 && (
                <Button
                  onClick={() => removeItem('quick_wins', index)}
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
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-semibold text-blue-900">1-3 חודשים</Label>
          <Button onClick={() => addItem('months_1_3')} size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="w-3 h-3" />
            הוסף
          </Button>
        </div>
        <div className="space-y-3">
          {formData.months_1_3.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-blue-700 font-semibold mt-2">{index + 1}.</span>
              <Textarea
                value={item}
                onChange={(e) => updateItem('months_1_3', index, e.target.value)}
                placeholder="פעולה אסטרטגית..."
                className="flex-1 min-h-[60px] text-right bg-white"
                dir="rtl"
              />
              {formData.months_1_3.length > 1 && (
                <Button
                  onClick={() => removeItem('months_1_3', index)}
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

      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-semibold text-purple-900">4-6 חודשים</Label>
          <Button onClick={() => addItem('months_4_6')} size="sm" variant="outline" className="flex items-center gap-1">
            <Plus className="w-3 h-3" />
            הוסף
          </Button>
        </div>
        <div className="space-y-3">
          {formData.months_4_6.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-purple-700 font-semibold mt-2">{index + 1}.</span>
              <Textarea
                value={item}
                onChange={(e) => updateItem('months_4_6', index, e.target.value)}
                placeholder="פעולה לטווח ארוך..."
                className="flex-1 min-h-[60px] text-right bg-white"
                dir="rtl"
              />
              {formData.months_4_6.length > 1 && (
                <Button
                  onClick={() => removeItem('months_4_6', index)}
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

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={() => onSave(formData)} className="flex items-center gap-2">
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