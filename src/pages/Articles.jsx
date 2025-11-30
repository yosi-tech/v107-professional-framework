
import React, { useState, useEffect } from 'react';
import { Article } from '@/entities/Article';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Newspaper } from 'lucide-react';
import { useTranslation } from "@/components/i18n/useTranslation";
import { format } from 'date-fns';

export default function ArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useTranslation();

    // רשימת תמונות מגוונות לשימוש אוטומטי אם אין תמונה
    const defaultImages = [
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
    ];

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const fetchedArticles = await Article.list('-created_date');
                
                // סינון מאמרים לפי שפה - באנגלית רק מאמרים שה-slug שלהם מסתיים ב-en
                const filteredArticles = language === 'en' 
                    ? fetchedArticles.filter(article => article.slug && article.slug.endsWith('-en'))
                    : fetchedArticles.filter(article => !article.slug || !article.slug.endsWith('-en'));
                
                // מוודאים שכל מאמר מקבל תמונה ייחודית
                const articlesWithImages = filteredArticles.map((article, index) => ({
                    ...article,
                    image_url: article.image_url || defaultImages[index % defaultImages.length]
                }));
                setArticles(articlesWithImages);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, [language]);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Newspaper className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('articles.page_title')}</h1>
                    <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                        {t('articles.page_subtitle')}
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <Link key={article.id} to={createPageUrl(`ArticleDetails?slug=${article.slug}`)}>
                                    <Card className="interactive-card h-full flex flex-col group overflow-hidden">
                                        <div className="overflow-hidden">
                                            <img 
                                                src={article.image_url} 
                                                alt={article.title} 
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <CardContent className="p-6 flex flex-col flex-grow">
                                            <p className="text-sm text-gray-500 mb-2">
                                                {format(new Date(article.created_date), 'MMMM d, yyyy')}
                                            </p>
                                            <h3 className="text-xl font-bold mb-3 text-gray-900 flex-grow">{article.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4">
                                                {article.content.substring(0, 100)}...
                                            </p>
                                            <div className="mt-auto text-amber-600 font-semibold group-hover:underline">
                                                {t('articles.read_more')} &rarr;
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h2 className="text-2xl font-semibold text-gray-800">{t('articles.no_articles')}</h2>
                            <p className="text-gray-500 mt-2">{t('articles.no_articles_desc')}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
