import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, FileText, Info, File, Loader2, Save, Plus, Trash2, Image, BookOpen } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ContentManager({ contentItems, onUpdate }) {
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newItem, setNewItem] = useState({
    page: 'home',
    section: '',
    content_key: '',
    content_type: 'text',
    content_he: '',
    content_en: '',
    description: '',
    order: 0
  });

  // Articles management state
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    slug: '',
    content: '',
    image_url: '',
    keywords: [],
    status: 'published'
  });

  const pages = [
    { value: 'home', label: 'דף הבית', icon: Home },
    { value: 'about', label: 'אודות', icon: Info },
    { value: 'articles', label: 'מאמרים', icon: FileText },
    { value: 'terms', label: 'תנאי שימוש', icon: File }
  ];

  // Fetch articles on component mount
  React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await base44.entities.Article.list('-created_date');
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoadingArticles(false);
      }
    };
    fetchArticles();
  }, []);

  const sectionOrder = {
    home: ['hero', 'stats', 'how_it_works', 'benefits', 'testimonials', 'final_cta', 'trust_badges'],
    about: ['hero', 'yossi', 'categories', 'portfolio'],
    terms: ['header', 'company_info', 'contact'],
    articles: ['header']
  };

  const groupedContent = contentItems.reduce((acc, item) => {
    if (!acc[item.page]) acc[item.page] = {};
    if (!acc[item.page][item.section]) acc[item.page][item.section] = [];
    acc[item.page][item.section].push(item);
    return acc;
  }, {});

  const sortSections = (sections, page) => {
    const order = sectionOrder[page] || [];
    return sections.sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const handleSave = async (item) => {
    setIsSaving(true);
    try {
      await base44.entities.ContentItem.update(item.id, {
        content_he: item.content_he,
        content_en: item.content_en,
        description: item.description,
        order: item.order
      });
      await onUpdate();
      setEditingItem(null);
      alert('התוכן עודכן בהצלחה!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('שגיאה בשמירת התוכן');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newItem.section || !newItem.content_key) {
      alert('יש למלא סקשן ומפתח תוכן');
      return;
    }

    setIsSaving(true);
    try {
      await base44.entities.ContentItem.create(newItem);
      await onUpdate();
      setIsCreating(false);
      setNewItem({
        page: 'home',
        section: '',
        content_key: '',
        content_type: 'text',
        content_he: '',
        content_en: '',
        description: '',
        order: 0
      });
      alert('התוכן נוצר בהצלחה!');
    } catch (error) {
      console.error('Error creating content:', error);
      alert('שגיאה ביצירת התוכן');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      return;
    }

    try {
      await base44.entities.ContentItem.delete(itemId);
      await onUpdate();
      alert('הפריט נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('שגיאה במחיקת הפריט');
    }
  };

  // Article handlers
  const handleCreateArticle = async () => {
    if (!newArticle.title || !newArticle.slug || !newArticle.content) {
      alert('יש למלא כותרת, slug ותוכן');
      return;
    }

    setIsSaving(true);
    try {
      await base44.entities.Article.create(newArticle);
      const data = await base44.entities.Article.list('-created_date');
      setArticles(data);
      setIsCreatingArticle(false);
      setNewArticle({
        title: '',
        slug: '',
        content: '',
        image_url: '',
        keywords: [],
        status: 'published'
      });
      alert('המאמר נוצר בהצלחה!');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('שגיאה ביצירת המאמר');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveArticle = async (article) => {
    setIsSaving(true);
    try {
      await base44.entities.Article.update(article.id, {
        title: article.title,
        slug: article.slug,
        content: article.content,
        image_url: article.image_url,
        keywords: article.keywords,
        status: article.status
      });
      const data = await base44.entities.Article.list('-created_date');
      setArticles(data);
      setEditingArticle(null);
      alert('המאמר עודכן בהצלחה!');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('שגיאה בשמירת המאמר');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק מאמר זה?')) {
      return;
    }

    try {
      await base44.entities.Article.delete(articleId);
      const data = await base44.entities.Article.list('-created_date');
      setArticles(data);
      alert('המאמר נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('שגיאה במחיקת המאמר');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-right">ניהול תוכן האתר</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף תוכן חדש</span>
        </Button>
      </div>

      {isCreating && (
        <Card className="border-green-300 bg-green-50">
          <CardHeader className="bg-green-100">
            <CardTitle className="text-right">הוספת תוכן חדש</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-right block mb-2">עמוד</Label>
                <select
                  value={newItem.page}
                  onChange={(e) => setNewItem({...newItem, page: e.target.value})}
                  className="w-full border rounded-md p-2 text-right"
                  dir="rtl"
                >
                  {pages.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-right block mb-2">סוג תוכן</Label>
                <select
                  value={newItem.content_type}
                  onChange={(e) => setNewItem({...newItem, content_type: e.target.value})}
                  className="w-full border rounded-md p-2 text-right"
                  dir="rtl"
                >
                  <option value="text">טקסט</option>
                  <option value="image">תמונה (URL)</option>
                  <option value="html">HTML</option>
                </select>
              </div>

              <div>
                <Label className="text-right block mb-2">סקשן</Label>
                <Input
                  value={newItem.section}
                  onChange={(e) => setNewItem({...newItem, section: e.target.value})}
                  placeholder="למשל: hero, benefits"
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label className="text-right block mb-2">מפתח תוכן</Label>
                <Input
                  value={newItem.content_key}
                  onChange={(e) => setNewItem({...newItem, content_key: e.target.value})}
                  placeholder="למשל: hero_title"
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <Label className="text-right block mb-2">תיאור (עזרה למנהל)</Label>
              <Input
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="למשל: כותרת ראשית בדף הבית"
                className="text-right"
                dir="rtl"
              />
            </div>

            <div>
              <Label className="text-right block mb-2">תוכן עברית</Label>
              <Textarea
                value={newItem.content_he}
                onChange={(e) => setNewItem({...newItem, content_he: e.target.value})}
                className="min-h-[100px] text-right"
                dir="rtl"
              />
            </div>

            <div>
              <Label className="text-right block mb-2">תוכן אנגלית</Label>
              <Textarea
                value={newItem.content_en}
                onChange={(e) => setNewItem({...newItem, content_en: e.target.value})}
                className="min-h-[100px] text-left"
                dir="ltr"
              />
            </div>

            <div className="flex gap-3 flex-row-reverse">
              <Button
                onClick={handleCreate}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    שומר...
                  </>
                ) : (
                  'שמור תוכן חדש'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                disabled={isSaving}
              >
                ביטול
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="flex flex-wrap w-full justify-center gap-2 h-auto p-2">
          {pages.map(page => (
            <TabsTrigger 
              key={page.value} 
              value={page.value}
              className="flex items-center gap-2 flex-row-reverse"
            >
              <span>{page.label}</span>
              <page.icon className="w-4 h-4" />
            </TabsTrigger>
          ))}
          <TabsTrigger 
            value="articles-content"
            className="flex items-center gap-2 flex-row-reverse"
          >
            <span>ניהול מאמרים</span>
            <BookOpen className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        {pages.map(page => (
          <TabsContent key={page.value} value={page.value}>
            <div className="space-y-4">
              {Object.keys(groupedContent[page.value] || {}).length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">אין תוכן עבור עמוד זה</p>
                  </CardContent>
                </Card>
              ) : (
                sortSections(Object.keys(groupedContent[page.value] || {}), page.value).map(section => {
                  const items = groupedContent[page.value][section];
                  return (
                  <Card key={section}>
                    <CardHeader className="bg-slate-50">
                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewItem({
                              page: page.value,
                              section: section,
                              content_key: '',
                              content_type: 'text',
                              content_he: '',
                              content_en: '',
                              description: '',
                              order: Math.max(...items.map(i => i.order || 0), 0) + 1
                            });
                            setIsCreating(true);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>הוסף פריט</span>
                        </Button>
                        <CardTitle className="text-right text-lg">
                          סקשן: {section}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {items
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map(item => (
                          <div 
                            key={item.id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            {editingItem?.id === item.id ? (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between mb-3">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    {item.content_type === 'text' && '📝 טקסט'}
                                    {item.content_type === 'image' && '🖼️ תמונה'}
                                    {item.content_type === 'html' && '💻 HTML'}
                                  </Badge>
                                  <h4 className="font-semibold text-right">{item.content_key}</h4>
                                </div>

                                {item.description && (
                                  <div>
                                    <Label className="text-right block mb-2">תיאור</Label>
                                    <Input
                                      value={editingItem.description}
                                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                                      className="text-right"
                                      dir="rtl"
                                    />
                                  </div>
                                )}

                                <div>
                                  <Label className="text-right block mb-2">תוכן עברית</Label>
                                  {item.content_type === 'html' ? (
                                    <Textarea
                                      value={editingItem.content_he}
                                      onChange={(e) => setEditingItem({...editingItem, content_he: e.target.value})}
                                      className="min-h-[150px] text-right font-mono text-sm"
                                      dir="rtl"
                                    />
                                  ) : (
                                    <Textarea
                                      value={editingItem.content_he}
                                      onChange={(e) => setEditingItem({...editingItem, content_he: e.target.value})}
                                      className="min-h-[100px] text-right"
                                      dir="rtl"
                                    />
                                  )}
                                </div>

                                <div>
                                  <Label className="text-right block mb-2">תוכן אנגלית</Label>
                                  {item.content_type === 'html' ? (
                                    <Textarea
                                      value={editingItem.content_en}
                                      onChange={(e) => setEditingItem({...editingItem, content_en: e.target.value})}
                                      className="min-h-[150px] text-left font-mono text-sm"
                                      dir="ltr"
                                    />
                                  ) : (
                                    <Textarea
                                      value={editingItem.content_en}
                                      onChange={(e) => setEditingItem({...editingItem, content_en: e.target.value})}
                                      className="min-h-[100px] text-left"
                                      dir="ltr"
                                    />
                                  )}
                                </div>

                                <div>
                                  <Label className="text-right block mb-2">סדר תצוגה</Label>
                                  <Input
                                    type="number"
                                    value={editingItem.order}
                                    onChange={(e) => setEditingItem({...editingItem, order: parseInt(e.target.value)})}
                                    className="w-24 text-right"
                                  />
                                </div>

                                <div className="flex gap-3 flex-row-reverse">
                                  <Button
                                    onClick={() => handleSave(editingItem)}
                                    disabled={isSaving}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    {isSaving ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                        שומר...
                                      </>
                                    ) : (
                                      <>
                                        <Save className="w-4 h-4 ml-2" />
                                        שמור שינויים
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingItem(null)}
                                    disabled={isSaving}
                                  >
                                    ביטול
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 text-right">
                                    <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                                      <h4 className="font-semibold">{item.content_key}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        {item.content_type === 'text' && '📝 טקסט'}
                                        {item.content_type === 'image' && '🖼️ תמונה'}
                                        {item.content_type === 'html' && '💻 HTML'}
                                      </Badge>
                                    </div>
                                    {item.description && (
                                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                    )}
                                    
                                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                      <p className="text-xs font-semibold text-gray-600 mb-1">עברית:</p>
                                      {item.content_type === 'image' ? (
                                        <div className="space-y-2">
                                          <img src={item.content_he} alt="preview" className="max-w-xs rounded border" />
                                          <p className="text-xs text-gray-500 break-all">{item.content_he}</p>
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                          {item.content_he?.substring(0, 200)}
                                          {item.content_he?.length > 200 && '...'}
                                        </p>
                                      )}
                                    </div>

                                    {item.content_en && (
                                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                                        <p className="text-xs font-semibold text-gray-600 mb-1">English:</p>
                                        {item.content_type === 'image' ? (
                                          <div className="space-y-2">
                                            <img src={item.content_en} alt="preview" className="max-w-xs rounded border" />
                                            <p className="text-xs text-gray-500 break-all">{item.content_en}</p>
                                          </div>
                                        ) : (
                                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {item.content_en?.substring(0, 200)}
                                            {item.content_en?.length > 200 && '...'}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex flex-col gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingItem({...item})}
                                    >
                                      ערוך
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDelete(item.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="articles-content">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-right">מאמרים</h3>
              <Button
                onClick={() => setIsCreatingArticle(true)}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>הוסף מאמר חדש</span>
              </Button>
            </div>

            {isLoadingArticles ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                </CardContent>
              </Card>
            ) : articles.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">אין מאמרים</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {articles.map(article => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      {editingArticle?.id === article.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-right block mb-2">כותרת *</Label>
                            <Input
                              value={editingArticle.title}
                              onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                              className="text-right"
                              dir="rtl"
                            />
                          </div>

                          <div>
                            <Label className="text-right block mb-2">Slug *</Label>
                            <Input
                              value={editingArticle.slug}
                              onChange={(e) => setEditingArticle({...editingArticle, slug: e.target.value})}
                              className="text-left"
                              dir="ltr"
                              placeholder="article-title-in-english"
                            />
                          </div>

                          <div>
                            <Label className="text-right block mb-2">תוכן (Markdown) *</Label>
                            <Textarea
                              value={editingArticle.content}
                              onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
                              className="min-h-[300px] text-right font-mono text-sm"
                              dir="rtl"
                            />
                          </div>

                          <div>
                            <Label className="text-right block mb-2">URL תמונה</Label>
                            <Input
                              value={editingArticle.image_url}
                              onChange={(e) => setEditingArticle({...editingArticle, image_url: e.target.value})}
                              className="text-left"
                              dir="ltr"
                              placeholder="https://..."
                            />
                          </div>

                          <div>
                            <Label className="text-right block mb-2">מילות מפתח (מופרדות בפסיקים)</Label>
                            <Input
                              value={editingArticle.keywords?.join(', ')}
                              onChange={(e) => setEditingArticle({
                                ...editingArticle, 
                                keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                              })}
                              className="text-right"
                              dir="rtl"
                              placeholder="יזמות, עסקים, הצלחה"
                            />
                          </div>

                          <div>
                            <Label className="text-right block mb-2">סטטוס</Label>
                            <select
                              value={editingArticle.status}
                              onChange={(e) => setEditingArticle({...editingArticle, status: e.target.value})}
                              className="w-full border rounded-md p-2 text-right"
                              dir="rtl"
                            >
                              <option value="draft">טיוטה</option>
                              <option value="published">פורסם</option>
                            </select>
                          </div>

                          <div className="flex gap-3 flex-row-reverse pt-4 border-t">
                            <Button
                              onClick={() => handleSaveArticle(editingArticle)}
                              disabled={isSaving}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                  שומר...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 ml-2" />
                                  שמור שינויים
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingArticle(null)}
                              disabled={isSaving}
                            >
                              ביטול
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 text-right">
                            <h4 className="text-lg font-bold mb-2">{article.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">Slug: {article.slug}</p>
                            {article.keywords?.length > 0 && (
                              <div className="flex gap-2 mb-3 flex-wrap flex-row-reverse">
                                {article.keywords.map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <Badge className={article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {article.status === 'published' ? 'פורסם' : 'טיוטה'}
                            </Badge>
                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {article.content?.substring(0, 200)}
                                {article.content?.length > 200 && '...'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingArticle({...article})}
                            >
                              ערוך
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {isCreatingArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-purple-100">
              <CardTitle className="text-right">הוספת מאמר חדש</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-right block mb-2">כותרת *</Label>
                <Input
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                  className="text-right"
                  dir="rtl"
                  placeholder="כותרת המאמר"
                />
              </div>

              <div>
                <Label className="text-right block mb-2">Slug * (באנגלית, ללא רווחים)</Label>
                <Input
                  value={newArticle.slug}
                  onChange={(e) => setNewArticle({...newArticle, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="text-left"
                  dir="ltr"
                  placeholder="article-title-in-english"
                />
              </div>

              <div>
                <Label className="text-right block mb-2">תוכן (Markdown) *</Label>
                <Textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                  className="min-h-[300px] text-right font-mono text-sm"
                  dir="rtl"
                  placeholder="תוכן המאמר בפורמט Markdown..."
                />
              </div>

              <div>
                <Label className="text-right block mb-2">URL תמונה</Label>
                <Input
                  value={newArticle.image_url}
                  onChange={(e) => setNewArticle({...newArticle, image_url: e.target.value})}
                  className="text-left"
                  dir="ltr"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label className="text-right block mb-2">מילות מפתח (מופרדות בפסיקים)</Label>
                <Input
                  value={newArticle.keywords?.join(', ')}
                  onChange={(e) => setNewArticle({
                    ...newArticle, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                  })}
                  className="text-right"
                  dir="rtl"
                  placeholder="יזמות, עסקים, הצלחה"
                />
              </div>

              <div>
                <Label className="text-right block mb-2">סטטוס</Label>
                <select
                  value={newArticle.status}
                  onChange={(e) => setNewArticle({...newArticle, status: e.target.value})}
                  className="w-full border rounded-md p-2 text-right"
                  dir="rtl"
                >
                  <option value="draft">טיוטה</option>
                  <option value="published">פורסם</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t flex-row-reverse">
                <Button
                  onClick={handleCreateArticle}
                  disabled={isSaving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      שומר...
                    </>
                  ) : (
                    'צור מאמר'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingArticle(false)}
                  disabled={isSaving}
                  className="flex-1"
                >
                  ביטול
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-green-100">
              <CardTitle className="text-right">הוספת תוכן חדש</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-right block mb-2">עמוד *</Label>
                  <select
                    value={newItem.page}
                    onChange={(e) => setNewItem({...newItem, page: e.target.value})}
                    className="w-full border rounded-md p-2 text-right"
                    dir="rtl"
                  >
                    {pages.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-right block mb-2">סוג תוכן *</Label>
                  <select
                    value={newItem.content_type}
                    onChange={(e) => setNewItem({...newItem, content_type: e.target.value})}
                    className="w-full border rounded-md p-2 text-right"
                    dir="rtl"
                  >
                    <option value="text">טקסט</option>
                    <option value="image">תמונה (URL)</option>
                    <option value="html">HTML</option>
                  </select>
                </div>

                <div>
                  <Label className="text-right block mb-2">סקשן *</Label>
                  <Input
                    value={newItem.section}
                    onChange={(e) => setNewItem({...newItem, section: e.target.value})}
                    placeholder="למשל: hero, benefits"
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label className="text-right block mb-2">מפתח תוכן *</Label>
                  <Input
                    value={newItem.content_key}
                    onChange={(e) => setNewItem({...newItem, content_key: e.target.value})}
                    placeholder="למשל: hero_title"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <Label className="text-right block mb-2">תיאור (עזרה למנהל)</Label>
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="למשל: כותרת ראשית בדף הבית"
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <Label className="text-right block mb-2">תוכן עברית</Label>
                <Textarea
                  value={newItem.content_he}
                  onChange={(e) => setNewItem({...newItem, content_he: e.target.value})}
                  className="min-h-[100px] text-right"
                  dir="rtl"
                  placeholder={newItem.content_type === 'image' ? 'URL של התמונה' : 'תוכן בעברית'}
                />
              </div>

              <div>
                <Label className="text-right block mb-2">תוכן אנגלית</Label>
                <Textarea
                  value={newItem.content_en}
                  onChange={(e) => setNewItem({...newItem, content_en: e.target.value})}
                  className="min-h-[100px] text-left"
                  dir="ltr"
                  placeholder={newItem.content_type === 'image' ? 'Image URL' : 'Content in English'}
                />
              </div>

              <div>
                <Label className="text-right block mb-2">סדר תצוגה</Label>
                <Input
                  type="number"
                  value={newItem.order}
                  onChange={(e) => setNewItem({...newItem, order: parseInt(e.target.value)})}
                  className="w-24 text-right"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t flex-row-reverse">
                <Button
                  onClick={handleCreate}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      שומר...
                    </>
                  ) : (
                    'צור תוכן'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  disabled={isSaving}
                  className="flex-1"
                >
                  ביטול
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}