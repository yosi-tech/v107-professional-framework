import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Edit2, CheckCircle, Clock, Send, Sparkles, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateTasksForSubscription } from "@/functions/generateTasksForSubscription";

export default function AdminBoosterTasks() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  useEffect(() => {
    loadSubscriptions();
    
    // בדיקה אם יש subscription ID ב-URL
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionId = urlParams.get('subscriptionId');
    if (subscriptionId) {
      // נטען את המנוי ספציפי מה-URL
      loadSpecificSubscription(subscriptionId);
    }
  }, []);

  const loadSubscriptions = async () => {
    try {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        navigate('/');
        return;
      }

      const subs = await base44.entities.OnlineCoachingSubscription.filter(
        { status: 'active' },
        '-created_date'
      );
      setSubscriptions(subs);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSpecificSubscription = async (subscriptionId) => {
    try {
      const subs = await base44.entities.OnlineCoachingSubscription.filter({ id: subscriptionId });
      if (subs.length > 0) {
        handleSelectSubscription(subs[0]);
      }
    } catch (error) {
      console.error('Error loading specific subscription:', error);
    }
  };

  const loadTasks = async (subscriptionId) => {
    try {
      setIsLoading(true);
      const allTasks = await base44.entities.BoosterTask.filter(
        { subscription_id: subscriptionId },
        'day'
      );
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSubscription = (sub) => {
    setSelectedSubscription(sub);
    setEditingTask(null);
    loadTasks(sub.id);
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveTask = async () => {
    if (!editingTask) return;
    
    try {
      setIsSaving(true);
      await base44.entities.BoosterTask.update(editingTask.id, {
        subject: editingTask.subject,
        task_title: editingTask.task_title,
        the_why: editingTask.the_why,
        the_task: editingTask.the_task,
        status: 'edited'
      });
      
      // Reload tasks
      await loadTasks(selectedSubscription.id);
      setEditingTask(null);
      alert('המשימה נשמרה בהצלחה!');
    } catch (error) {
      console.error('Error saving task:', error);
      alert('שגיאה בשמירת המשימה');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateTasks = async () => {
    if (!selectedSubscription) return;
    
    if (!window.confirm('האם ליצור 30 משימות חדשות למנוי זה? (פעולה זו תיקח כ-30 שניות)')) {
      return;
    }
    
    try {
      setIsGeneratingTasks(true);
      const result = await generateTasksForSubscription({
        subscriptionId: selectedSubscription.id
      });
      
      if (result.data.success) {
        alert(`נוצרו ${result.data.tasksCreated} משימות בהצלחה!`);
        await loadTasks(selectedSubscription.id);
      } else {
        alert('שגיאה: ' + (result.data.error || 'לא ידוע'));
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
      alert('שגיאה ביצירת המשימות: ' + error.message);
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'ממתין' },
      sent: { color: 'bg-green-100 text-green-800', icon: Send, label: 'נשלח' },
      edited: { color: 'bg-blue-100 text-blue-800', icon: Edit2, label: 'נערך' }
    };
    
    const { color, icon: Icon, label } = config[status] || config.pending;
    
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 ml-1" />
        {label}
      </Badge>
    );
  };

  if (isLoading && !selectedSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ניהול משימות בוסטר</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* רשימת מנויים */}
          <Card>
            <CardHeader>
              <CardTitle>מנויים פעילים ({subscriptions.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {subscriptions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubscription(sub)}
                  className={`w-full text-right p-3 rounded-lg border transition-all ${
                    selectedSubscription?.id === sub.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold">{sub.user_name}</div>
                  <div className="text-sm text-gray-600">{sub.user_email}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    יום {sub.current_day} | {sub.recommended_booster_track}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* רשימת משימות */}
          {selectedSubscription && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  משימות עבור {selectedSubscription.user_name}
                  <span className="text-sm text-gray-500 mr-2">
                    ({tasks.length} משימות)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">אין משימות למנוי זה</h3>
                    <p className="text-gray-600 mb-6">המשימות לא נוצרו אוטומטית. ניתן ליצור אותן עכשיו.</p>
                    <Button
                      onClick={handleGenerateTasks}
                      disabled={isGeneratingTasks}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isGeneratingTasks ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin ml-2" />
                          יוצר 30 משימות...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 ml-2" />
                          צור 30 משימות באמצעות AI
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border transition-all ${
                          editingTask?.id === task.id
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">יום {task.day}</Badge>
                            {getStatusBadge(task.status)}
                          </div>
                          {editingTask?.id !== task.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTask(task)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {editingTask?.id === task.id ? (
                          <div className="space-y-3 mt-3">
                            <div>
                              <label className="text-sm font-medium">נושא המייל</label>
                              <Input
                                value={editingTask.subject}
                                onChange={(e) =>
                                  setEditingTask({ ...editingTask, subject: e.target.value })
                                }
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">כותרת המשימה</label>
                              <Input
                                value={editingTask.task_title}
                                onChange={(e) =>
                                  setEditingTask({ ...editingTask, task_title: e.target.value })
                                }
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium">למה זה חשוב</label>
                              <Textarea
                                value={editingTask.the_why}
                                onChange={(e) =>
                                  setEditingTask({ ...editingTask, the_why: e.target.value })
                                }
                                rows={3}
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium">הפעולה</label>
                              <Textarea
                                value={editingTask.the_task}
                                onChange={(e) =>
                                  setEditingTask({ ...editingTask, the_task: e.target.value })
                                }
                                rows={3}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button onClick={handleSaveTask} disabled={isSaving}>
                                {isSaving ? (
                                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                ) : (
                                  <Save className="w-4 h-4 ml-2" />
                                )}
                                שמור
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setEditingTask(null)}
                              >
                                ביטול
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="font-semibold text-sm">{task.task_title}</div>
                            <div className="text-sm text-gray-600">{task.subject}</div>
                            
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                              <div className="text-xs font-semibold text-amber-900 mb-1">למה זה חשוב:</div>
                              <div className="text-sm text-amber-800">{task.the_why}</div>
                            </div>
                            
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="text-xs font-semibold text-blue-900 mb-1">הפעולה:</div>
                              <div className="text-sm text-blue-800">{task.the_task}</div>
                            </div>
                            
                            {task.sent_date && (
                              <div className="text-xs text-gray-500">
                                נשלח: {new Date(task.sent_date).toLocaleDateString('he-IL')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}