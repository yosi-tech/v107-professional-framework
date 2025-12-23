import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, FileText, Info, File, Loader2, Save, Plus, Trash2, Image, BookOpen, ShoppingCart, Rocket, Languages } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ContentManager({ contentItems, onUpdate }) {
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
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

  // Products management state
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name_he: '',
    name_en: '',
    description_he: '',
    description_en: '',
    price: 0,
    product_type: 'full_report',
    active: true,
    featured: false,
    discount_eligible: true,
    allowed_coupon_codes: [],
    order: 0
  });

  const pages = [
    { value: 'home', label: 'דף הבית', icon: Home },
    { value: 'about', label: 'אודות', icon: Info },
    { value: 'completion', label: 'עמוד רכישה', icon: ShoppingCart },
    { value: 'booster', label: 'עמוד בוסטר', icon: Rocket },
    { value: 'terms', label: 'תנאי שימוש', icon: File }
  ];

  // Fetch articles and products on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, productsData] = await Promise.all([
          base44.entities.Article.list('-created_date'),
          base44.entities.Product.list('order')
        ]);
        setArticles(articlesData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingArticles(false);
        setIsLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  const sectionOrder = {
    home: ['hero', 'stats', 'how_it_works', 'benefits', 'testimonials', 'final_cta', 'trust_badges'],
    about: ['hero', 'yossi', 'categories', 'portfolio'],
    completion: ['hero', 'products', 'cta'],
    booster: ['hero', 'benefits', 'tracks', 'cta'],
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

  const handleSave = async () => {
    if (!editingItem) return;
    
    setIsSaving(true);
    try {
      await base44.entities.ContentItem.update(editingItem.id, {
        content_he: editingItem.content_he,
        content_en: editingItem.content_en,
        description: editingItem.description,
        order: editingItem.order
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

  const handleAutoTranslate = async () => {
    if (!editingItem?.content_he) {
      alert('אין תוכן עברי לתרגום');
      return;
    }

    setIsTranslating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Translate the following Hebrew text to English. Provide ONLY the translation, nothing else:\n\n${editingItem.content_he}`,
        add_context_from_internet: false
      });
      
      setEditingItem({...editingItem, content_en: result});
    } catch (error) {
      console.error('Translation error:', error);
      alert('שגיאה בתרגום אוטומטי');
    } finally {
      setIsTranslating(false);
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

  // Product handlers
  const handleCreateProduct = async () => {
    if (!newProduct.name_he || !newProduct.name_en || !newProduct.price) {
      alert('יש למלא שם בעברית, שם באנגלית ומחיר');
      return;
    }

    setIsSaving(true);
    try {
      await base44.entities.Product.create(newProduct);
      const data = await base44.entities.Product.list('order');
      setProducts(data);
      setIsCreatingProduct(false);
      setNewProduct({
        name_he: '',
        name_en: '',
        description_he: '',
        description_en: '',
        price: 0,
        product_type: 'full_report',
        active: true,
        featured: false,
        discount_eligible: true,
        allowed_coupon_codes: [],
        order: 0
      });
      alert('המוצר נוצר בהצלחה!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('שגיאה ביצירת המוצר');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProduct = async (product) => {
    setIsSaving(true);
    try {
      await base44.entities.Product.update(product.id, {
        name_he: product.name_he,
        name_en: product.name_en,
        description_he: product.description_he,
        description_en: product.description_en,
        price: product.price,
        product_type: product.product_type,
        active: product.active,
        featured: product.featured,
        discount_eligible: product.discount_eligible,
        allowed_coupon_codes: product.allowed_coupon_codes,
        order: product.order
      });
      const data = await base44.entities.Product.list('order');
      setProducts(data);
      setEditingProduct(null);
      alert('המוצר עודכן בהצלחה!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('שגיאה בשמירת המוצר');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      return;
    }

    try {
      await base44.entities.Product.delete(productId);
      const data = await base44.entities.Product.list('order');
      setProducts(data);
      alert('המוצר נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('שגיאה במחיקת המוצר');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2 flex-row-reverse"
        >
          <span>הוסף תוכן חדש</span>
          <Plus className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold text-right">ניהול תוכן האתר</h2>
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
        <TabsTrigger 
          value="products-content"
          className="flex items-center gap-2 flex-row-reverse"
        >
          <span>ניהול מוצרים</span>
          <ShoppingCart className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger 
          value="articles-content"
          className="flex items-center gap-2 flex-row-reverse"
        >
          <span>ניהול מאמרים</span>
          <BookOpen className="w-4 h-4" />
        </TabsTrigger>
        {pages.slice().reverse().map(page => (
          <TabsTrigger 
            key={page.value} 
            value={page.value}
            className="flex items-center gap-2 flex-row-reverse"
          >
            <span>{page.label}</span>
            <page.icon className="w-4 h-4" />
          </TabsTrigger>
        ))}
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
                                  <div className="flex items-center justify-between mb-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={handleAutoTranslate}
                                      disabled={isTranslating || !editingItem.content_he}
                                      className="flex items-center gap-2"
                                    >
                                      {isTranslating ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          <span>מתרגם...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Languages className="w-4 h-4" />
                                          <span>תרגום אוטומטי</span>
                                        </>
                                      )}
                                    </Button>
                                    <Label className="text-right">תוכן אנגלית</Label>
                                  </div>
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
                                    onClick={handleSave}
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

        <TabsContent value="products-content">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-right">מוצרים</h3>
              <Button
                onClick={() => setIsCreatingProduct(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>הוסף מוצר חדש</span>
              </Button>
            </div>

            {isLoadingProducts ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                </CardContent>
              </Card>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">אין מוצרים</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <Card key={product.id}>
                    <CardContent className="p-6">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-right block mb-2">שם בעברית *</Label>
                              <Input
                                value={editingProduct.name_he}
                                onChange={(e) => setEditingProduct({...editingProduct, name_he: e.target.value})}
                                className="text-right"
                                dir="rtl"
                              />
                            </div>

                            <div>
                              <Label className="text-right block mb-2">שם באנגלית *</Label>
                              <Input
                                value={editingProduct.name_en}
                                onChange={(e) => setEditingProduct({...editingProduct, name_en: e.target.value})}
                                className="text-left"
                                dir="ltr"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-right block mb-2">תיאור בעברית</Label>
                            <Textarea
                              value={editingProduct.description_he}
                              onChange={(e) => setEditingProduct({...editingProduct, description_he: e.target.value})}
                              className="min-h-[100px] text-right"
                              dir="rtl"
                            />
                          </div>

                          <div>
                            <Label className="text-right block mb-2">תיאור באנגלית</Label>
                            <Textarea
                              value={editingProduct.description_en}
                              onChange={(e) => setEditingProduct({...editingProduct, description_en: e.target.value})}
                              className="min-h-[100px] text-left"
                              dir="ltr"
                            />
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-right block mb-2">מחיר (₪) *</Label>
                              <Input
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                className="text-right"
                              />
                            </div>

                            <div>
                              <Label className="text-right block mb-2">סוג מוצר</Label>
                              <select
                                value={editingProduct.product_type}
                                onChange={(e) => setEditingProduct({...editingProduct, product_type: e.target.value})}
                                className="w-full border rounded-md p-2 text-right"
                                dir="rtl"
                              >
                                <option value="full_report">דוח מלא</option>
                                <option value="answers_download">הורדת תשובות</option>
                                <option value="online_coaching_7days">ליווי אונליין 7 ימים</option>
                                <option value="booster_track">מסלול בוסטר</option>
                                <option value="other">אחר</option>
                              </select>
                            </div>

                            <div>
                              <Label className="text-right block mb-2">סדר תצוגה</Label>
                              <Input
                                type="number"
                                value={editingProduct.order}
                                onChange={(e) => setEditingProduct({...editingProduct, order: parseInt(e.target.value)})}
                                className="text-right"
                              />
                            </div>
                          </div>

                          <div className="flex gap-4 flex-row-reverse">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <span className="text-sm">פעיל</span>
                              <input
                                type="checkbox"
                                checked={editingProduct.active}
                                onChange={(e) => setEditingProduct({...editingProduct, active: e.target.checked})}
                                className="w-4 h-4"
                              />
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <span className="text-sm">מומלץ</span>
                              <input
                                type="checkbox"
                                checked={editingProduct.featured}
                                onChange={(e) => setEditingProduct({...editingProduct, featured: e.target.checked})}
                                className="w-4 h-4"
                              />
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <span className="text-sm">ניתן להשתמש בקופונים</span>
                              <input
                                type="checkbox"
                                checked={editingProduct.discount_eligible}
                                onChange={(e) => setEditingProduct({...editingProduct, discount_eligible: e.target.checked})}
                                className="w-4 h-4"
                              />
                            </label>
                          </div>

                          <div>
                            <Label className="text-right block mb-2">קודי קופון מותרים (מופרדים בפסיקים, ריק = כל הקופונים)</Label>
                            <Input
                              value={editingProduct.allowed_coupon_codes?.join(', ')}
                              onChange={(e) => setEditingProduct({
                                ...editingProduct, 
                                allowed_coupon_codes: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                              })}
                              className="text-right"
                              dir="rtl"
                              placeholder="SAVE20, WELCOME10"
                            />
                          </div>

                          <div className="flex gap-3 flex-row-reverse pt-4 border-t">
                            <Button
                              onClick={() => handleSaveProduct(editingProduct)}
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
                              onClick={() => setEditingProduct(null)}
                              disabled={isSaving}
                            >
                              ביטול
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 text-right">
                            <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                              <h4 className="text-lg font-bold">{product.name_he}</h4>
                              <Badge className={product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {product.active ? 'פעיל' : 'לא פעיל'}
                              </Badge>
                              {product.featured && (
                                <Badge className="bg-amber-100 text-amber-800">⭐ מומלץ</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{product.name_en}</p>
                            <p className="text-2xl font-bold text-blue-600 mb-3">₪{product.price}</p>
                            {product.description_he && (
                              <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                <p className="text-sm text-gray-700">{product.description_he}</p>
                              </div>
                            )}
                            <div className="flex gap-2 mt-3 flex-wrap flex-row-reverse">
                              <Badge variant="outline">{product.product_type}</Badge>
                              {product.discount_eligible && (
                                <Badge variant="outline" className="text-green-600">ניתן להשתמש בקופונים</Badge>
                              )}
                              {product.allowed_coupon_codes?.length > 0 && (
                                <Badge variant="outline">קופונים ספציפיים: {product.allowed_coupon_codes.join(', ')}</Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProduct({...product})}
                            >
                              ערוך
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
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

      {isCreatingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-right">הוספת מוצר חדש</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-right block mb-2">שם בעברית *</Label>
                  <Input
                    value={newProduct.name_he}
                    onChange={(e) => setNewProduct({...newProduct, name_he: e.target.value})}
                    className="text-right"
                    dir="rtl"
                    placeholder="שם המוצר"
                  />
                </div>

                <div>
                  <Label className="text-right block mb-2">שם באנגלית *</Label>
                  <Input
                    value={newProduct.name_en}
                    onChange={(e) => setNewProduct({...newProduct, name_en: e.target.value})}
                    className="text-left"
                    dir="ltr"
                    placeholder="Product Name"
                  />
                </div>
              </div>

              <div>
                <Label className="text-right block mb-2">תיאור בעברית</Label>
                <Textarea
                  value={newProduct.description_he}
                  onChange={(e) => setNewProduct({...newProduct, description_he: e.target.value})}
                  className="min-h-[100px] text-right"
                  dir="rtl"
                  placeholder="תיאור המוצר..."
                />
              </div>

              <div>
                <Label className="text-right block mb-2">תיאור באנגלית</Label>
                <Textarea
                  value={newProduct.description_en}
                  onChange={(e) => setNewProduct({...newProduct, description_en: e.target.value})}
                  className="min-h-[100px] text-left"
                  dir="ltr"
                  placeholder="Product description..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-right block mb-2">מחיר (₪) *</Label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="text-right"
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label className="text-right block mb-2">סוג מוצר</Label>
                  <select
                    value={newProduct.product_type}
                    onChange={(e) => setNewProduct({...newProduct, product_type: e.target.value})}
                    className="w-full border rounded-md p-2 text-right"
                    dir="rtl"
                  >
                    <option value="full_report">דוח מלא</option>
                    <option value="answers_download">הורדת תשובות</option>
                    <option value="online_coaching_7days">ליווי אונליין 7 ימים</option>
                    <option value="booster_track">מסלול בוסטר</option>
                    <option value="other">אחר</option>
                  </select>
                </div>

                <div>
                  <Label className="text-right block mb-2">סדר תצוגה</Label>
                  <Input
                    type="number"
                    value={newProduct.order}
                    onChange={(e) => setNewProduct({...newProduct, order: parseInt(e.target.value)})}
                    className="text-right"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm">פעיל</span>
                  <input
                    type="checkbox"
                    checked={newProduct.active}
                    onChange={(e) => setNewProduct({...newProduct, active: e.target.checked})}
                    className="w-4 h-4"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm">מומלץ</span>
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                    className="w-4 h-4"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm">ניתן להשתמש בקופונים</span>
                  <input
                    type="checkbox"
                    checked={newProduct.discount_eligible}
                    onChange={(e) => setNewProduct({...newProduct, discount_eligible: e.target.checked})}
                    className="w-4 h-4"
                  />
                </label>
              </div>

              <div>
                <Label className="text-right block mb-2">קודי קופון מותרים (מופרדים בפסיקים)</Label>
                <Input
                  value={newProduct.allowed_coupon_codes?.join(', ')}
                  onChange={(e) => setNewProduct({
                    ...newProduct, 
                    allowed_coupon_codes: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                  })}
                  className="text-right"
                  dir="rtl"
                  placeholder="SAVE20, WELCOME10"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t flex-row-reverse">
                <Button
                  onClick={handleCreateProduct}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      שומר...
                    </>
                  ) : (
                    'צור מוצר'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingProduct(false)}
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