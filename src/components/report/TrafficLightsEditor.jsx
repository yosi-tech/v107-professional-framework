import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function TrafficLightsEditor({ data, onSave, onCancel }) {
  const [items, setItems] = useState(data || []);

  const addItem = () => {
    setItems([...items, { domain: '', item: '', status: 'yellow', note: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const getStatusColor = (status) => {
    const colors = {
      green: 'bg-green-100 border-green-300',
      yellow: 'bg-yellow-100 border-yellow-300',
      orange: 'bg-orange-100 border-orange-300',
      red: 'bg-red-100 border-red-300'
    };
    return colors[status] || 'bg-gray-100 border-gray-300';
  };

  const getStatusEmoji = (status) => {
    const emojis = { green: '🟢', yellow: '🟡', orange: '🟠', red: '🔴' };
    return emojis[status] || '⚪';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={addItem} size="sm" className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          הוסף פריט
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className={`p-4 border-2 ${getStatusColor(item.status)}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{getStatusEmoji(item.status)}</span>
                <Button
                  onClick={() => removeItem(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">תחום</Label>
                  <Input
                    value={item.domain}
                    onChange={(e) => updateItem(index, 'domain', e.target.value)}
                    placeholder="שם התחום..."
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label className="text-sm">פריט/יכולת</Label>
                  <Input
                    value={item.item}
                    onChange={(e) => updateItem(index, 'item', e.target.value)}
                    placeholder="שם הפריט..."
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">מצב רמזור</Label>
                <RadioGroup
                  value={item.status}
                  onValueChange={(value) => updateItem(index, 'status', value)}
                  className="flex gap-4 flex-row-reverse"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <Label htmlFor={`${index}-green`} className="cursor-pointer">🟢 ירוק</Label>
                    <RadioGroupItem value="green" id={`${index}-green`} />
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <Label htmlFor={`${index}-yellow`} className="cursor-pointer">🟡 צהוב</Label>
                    <RadioGroupItem value="yellow" id={`${index}-yellow`} />
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <Label htmlFor={`${index}-orange`} className="cursor-pointer">🟠 כתום</Label>
                    <RadioGroupItem value="orange" id={`${index}-orange`} />
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <Label htmlFor={`${index}-red`} className="cursor-pointer">🔴 אדום</Label>
                    <RadioGroupItem value="red" id={`${index}-red`} />
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm">הערת אבחון</Label>
                <Textarea
                  value={item.note}
                  onChange={(e) => updateItem(index, 'note', e.target.value)}
                  placeholder="הסבר קצר מדוע זה חשוב..."
                  className="min-h-[60px] text-right"
                  dir="rtl"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={() => onSave(items)} className="flex items-center gap-2">
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