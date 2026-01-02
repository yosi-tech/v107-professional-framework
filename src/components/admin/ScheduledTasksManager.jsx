import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Edit2, 
  PlayCircle, 
  PauseCircle,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// אקשנים זמינים למשתמש
const AVAILABLE_ACTIONS = [
  { value: 'send_daily_booster_emails', label: 'שליחת מיילי בוסטר יומיים', description: 'שולח מייל יומי למשתתפים בתכנית הבוסטר' },
  { value: 'mark_abandoned_questionnaires', label: 'סימון שאלונים נטושים', description: 'מסמן שאלונים שלא הושלמו כנטושים' },
  { value: 'send_abandonment_survey', label: 'מיילי נטישה לאחר 96 שעות', description: 'שולח סקר נטישה למשתמשים שלא השלימו' },
  { value: 'send_survey_reminders', label: 'תזכורות סקר נטישה', description: 'שולח תזכורות למשתמשים שטרם מילאו את הסקר' },
  { value: 'send_completion_no_purchase', label: 'מיילים לאחר סיום ללא רכישה', description: 'שולח מיילים למשתמשים שסיימו אך לא רכשו' },
  { value: 'send_booster_encouragement', label: 'עידוד הרשמה לבוסטר', description: 'שולח מיילי עידוד להירשם לתכנית הבוסטר' }
];

export default function ScheduledTasksManager() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    action_type: '',
    description: '',
    schedule_type: 'simple',
    repeat_interval: 1,
    repeat_unit: 'days',
    start_time: '09:00',
    is_active: true
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      // הצג את התזמונים הקיימים במערכת
      const existingTasks = [
        { id: '1', name: 'סימון שאלונים נטושים', function_name: 'markAbandonedQuestionnaires', is_active: true, schedule_mode: 'recurring', repeat_interval: 30, repeat_unit: 'minutes', description: 'מסמן שאלונים שלא הושלמו כנטושים' },
        { id: '2', name: 'עידוד הרשמה לבוסטר', function_name: 'sendBoosterEncouragement', is_active: true, schedule_mode: 'recurring', repeat_interval: 1, repeat_unit: 'days', start_time: '09:00', description: 'שולח מיילי עידוד להירשם לתכנית הבוסטר' },
        { id: '3', name: 'תזכורות סקר נטישה', function_name: 'sendSurveyReminders', is_active: true, schedule_mode: 'recurring', repeat_interval: 1, repeat_unit: 'days', start_time: '09:00', description: 'שולח תזכורות למשתמשים שטרם מילאו את הסקר' },
        { id: '4', name: 'מיילים לאחר סיום ללא רכישה', function_name: 'sendCompletionNoPurchase', is_active: true, schedule_mode: 'recurring', repeat_interval: 1, repeat_unit: 'days', start_time: '09:00', description: 'שולח מיילים למשתמשים שסיימו אך לא רכשו' },
        { id: '5', name: 'מיילי נטישה לאחר 96 שעות', function_name: 'sendAbandonmentSurvey', is_active: true, schedule_mode: 'recurring', repeat_interval: 1, repeat_unit: 'days', start_time: '09:00', description: 'שולח סקר נטישה למשתמשים שלא השלימו' },
        { id: '6', name: 'שליחת מיילי בוסטר יומיים', function_name: 'sendDailyBoosterEmails', is_active: true, schedule_mode: 'recurring', repeat_interval: 1, repeat_unit: 'days', start_time: '09:00', description: 'שולח מייל יומי למשתתפים בתכנית הבוסטר' }
      ];
      setTasks(existingTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async () => {
    alert('יצירת תזמונים חדשים תתבצע דרך ה-Dashboard של Base44 (Settings -> Scheduled Tasks)');
    setIsDialogOpen(false);
  };

  const handleUpdateTask = async () => {
    alert('עריכת תזמונים תתבצע דרך ה-Dashboard של Base44 (Settings -> Scheduled Tasks)');
    setIsDialogOpen(false);
  };

  const handleToggleTask = async (taskId) => {
    alert('הפעלה/השהיה של תזמונים תתבצע דרך ה-Dashboard של Base44 (Settings -> Scheduled Tasks)');
  };

  const handleDeleteTask = async (taskId, taskName) => {
    alert('מחיקת תזמונים תתבצע דרך ה-Dashboard של Base44 (Settings -> Scheduled Tasks)');
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      action_type: '',
      description: task.description || '',
      schedule_type: task.schedule_type || 'simple',
      repeat_interval: task.repeat_interval || 1,
      repeat_unit: task.repeat_unit || 'days',
      start_time: task.start_time || '09:00',
      is_active: task.is_active !== false
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      action_type: '',
      description: '',
      schedule_type: 'simple',
      repeat_interval: 1,
      repeat_unit: 'days',
      start_time: '09:00',
      is_active: true
    });
  };

  const getScheduleDescription = (task) => {
    if (task.schedule_type === 'cron') {
      return `Cron: ${task.cron_expression}`;
    }
    
    const intervalMap = {
      minutes: 'דקות',
      hours: 'שעות',
      days: 'ימים',
      weeks: 'שבועות',
      months: 'חודשים'
    };
    
    return `כל ${task.repeat_interval} ${intervalMap[task.repeat_unit] || task.repeat_unit}${task.start_time ? ` בשעה ${task.start_time}` : ''}`;
  };

  const getStatusBadge = (task) => {
    if (!task.is_active) {
      return <Badge variant="outline" className="bg-gray-100"><PauseCircle className="w-3 h-3 mr-1" />מושהה</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800"><PlayCircle className="w-3 h-3 mr-1" />פעיל</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">ניהול תזמונים</h3>
          <p className="text-gray-600">נהל משימות מתוזמנות והפעלות אוטומטיות</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 ml-2" />
          תזמון חדש
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">אין תזמונים פעילים</p>
              <Button onClick={openCreateDialog} variant="outline" className="mt-4">
                צור תזמון ראשון
              </Button>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{task.name}</h4>
                      {getStatusBadge(task)}
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>פונקציה: <span className="font-mono font-semibold">{task.function_name}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{getScheduleDescription(task)}</span>
                      </div>
                    </div>

                    {task.last_run && (
                      <div className="mt-3 text-xs text-gray-500">
                        ריצה אחרונה: {new Date(task.last_run).toLocaleString('he-IL')}
                      </div>
                    )}
                    
                    {task.next_run && (
                      <div className="text-xs text-blue-600 font-semibold">
                        ריצה הבאה: {new Date(task.next_run).toLocaleString('he-IL')}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mr-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleTask(task.id)}
                      title={task.is_active ? 'השהה' : 'הפעל'}
                    >
                      {task.is_active ? (
                        <PauseCircle className="w-4 h-4" />
                      ) : (
                        <PlayCircle className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(task)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTask(task.id, task.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'עריכת תזמון' : 'תזמון חדש'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'ערוך את פרטי התזמון' : 'הגדר תזמון חדש להפעלת פונקציה אוטומטית'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">שם התזמון *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="לדוגמה: שליחת מיילים יומיים"
              />
            </div>

            {!editingTask && (
              <div>
                <Label htmlFor="action_type">סוג הפעולה *</Label>
                <Select
                  value={formData.action_type}
                  onValueChange={(value) => {
                    const selectedAction = AVAILABLE_ACTIONS.find(a => a.value === value);
                    setFormData({ 
                      ...formData, 
                      action_type: value,
                      description: selectedAction?.description || formData.description
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג פעולה" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ACTIONS.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.action_type && AVAILABLE_ACTIONS.find(a => a.value === formData.action_type)?.description}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="description">תיאור</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="תיאור קצר של מה התזמון עושה"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="repeat_interval">כל</Label>
                <Input
                  id="repeat_interval"
                  type="number"
                  min="1"
                  value={formData.repeat_interval}
                  onChange={(e) => setFormData({ ...formData, repeat_interval: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="repeat_unit">יחידת זמן</Label>
                <Select
                  value={formData.repeat_unit}
                  onValueChange={(value) => setFormData({ ...formData, repeat_unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">דקות</SelectItem>
                    <SelectItem value="hours">שעות</SelectItem>
                    <SelectItem value="days">ימים</SelectItem>
                    <SelectItem value="weeks">שבועות</SelectItem>
                    <SelectItem value="months">חודשים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="start_time">שעת התחלה (אופציונלי)</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">בשעון ישראל (UTC+2/+3)</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ביטול
            </Button>
            <Button
              onClick={editingTask ? handleUpdateTask : handleCreateTask}
              disabled={!formData.name || (!editingTask && !formData.action_type)}
            >
              {editingTask ? 'עדכן' : 'צור תזמון'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}