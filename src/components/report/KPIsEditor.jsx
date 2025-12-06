import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function KPIsEditor({ data, onSave, onCancel }) {
  const [kpis, setKpis] = useState(data || []);

  const addKPI = () => {
    setKpis([...kpis, { metric: '', target: '' }]);
  };

  const removeKPI = (index) => {
    setKpis(kpis.filter((_, i) => i !== index));
  };

  const updateKPI = (index, field, value) => {
    const newKPIs = [...kpis];
    newKPIs[index] = { ...newKPIs[index], [field]: value };
    setKpis(newKPIs);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={addKPI} size="sm" className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          הוסף מדד
        </Button>
      </div>

      <div className="space-y-3">
        {kpis.map((kpi, index) => (
          <Card key={index} className="p-4 bg-blue-50 border-blue-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">מדד #{index + 1}</span>
                <Button
                  onClick={() => removeKPI(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label className="text-sm">שם המדד</Label>
                <Input
                  value={kpi.metric}
                  onChange={(e) => updateKPI(index, 'metric', e.target.value)}
                  placeholder='למשל: "שיעור המרה משיחת מכירה לעסקה"'
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label className="text-sm">יעד</Label>
                <Input
                  value={kpi.target}
                  onChange={(e) => updateKPI(index, 'target', e.target.value)}
                  placeholder='למשל: "20%"'
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={() => onSave(kpis)} className="flex items-center gap-2">
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