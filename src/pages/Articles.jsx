import React, { useState, useEffect } from 'react';
import { Article } from '@/entities/Article';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2, Newspaper, ArrowLeft, ChevronLeft } from 'lucide-react';
import { useTranslation } from "@/components/i18n/useTranslation";
import InsightOrb from "@/components/home/InsightOrb";

export default function ArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useTranslation();

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
                const filteredArticles = language === 'en'
                    ? fetchedArticles.filter(article => article.slug && article.slug.endsWith('-en'))
                    : fetchedArticles.filter(article => !article.slug || !article.slug.endsWith('-en'));

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

    const featuredArticle = articles[0];
    const secondArticle = articles[1];
    const remainingArticles = articles.slice(2);

    return (
        <div dir="rtl">
            {/* Header */}
            <header className="pt-32 pb-24 text-center bg-slate-50 text-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[450px] h-[450px] translate-x-1/3 -translate-y-1/4 opacity-50 pointer-events-none">
                    <InsightOrb className="w-full h-full" />
                </div>
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] -translate-x-1/3 translate-y-1/4 opacity-35 pointer-events-none">
                    <InsightOrb className="w-full h-full" />
                </div>
                <div className="saas-container flex flex-col items-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-[#FF8F00] flex items-center justify-center mb-8 shadow-lg">
                        <Newspaper className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
                        {t('articles.page_title')}
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed text-slate-600">
                        {t('articles.page_subtitle')}
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="pb-24 saas-container mt-16">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-[#FF8F00] animate-spin" />
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-800">{t('articles.no_articles')}</h2>
                        <p className="text-gray-500 mt-2">{t('articles.no_articles_desc')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                        {/* Featured Article - large card */}
                        {featuredArticle && (
                            <article className="md:col-span-8 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row border border-slate-100">
                                <div className="md:w-1/2 overflow-hidden h-72 md:h-auto">
                                    <img
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        src={featuredArticle.image_url}
                                        alt={featuredArticle.title}
                                    />
                                </div>
                                <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center space-y-6">
                                    {featuredArticle.keywords && featuredArticle.keywords.length > 0 && (
                                        <div className="text-[#FF8F00] font-black text-xs tracking-widest uppercase">
                                            {featuredArticle.keywords[0]}
                                        </div>
                                    )}
                                    <h2 className="text-3xl font-black leading-tight text-slate-900">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-slate-500 leading-relaxed text-base">
                                        {featuredArticle.content?.substring(0, 120)}...
                                    </p>
                                    <div className="pt-4">
                                        <Link
                                            to={createPageUrl(`ArticleDetails?slug=${featuredArticle.slug}`)}
                                            className="inline-flex items-center gap-3 text-[#FF8F00] font-black text-lg group"
                                        >
                                            <span>{t('articles.read_more')}</span>
                                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )}

                        {/* Second Article - side card */}
                        {secondArticle && (
                            <article className="md:col-span-4 bg-slate-50 rounded-3xl p-10 flex flex-col justify-between border border-slate-100 shadow-sm">
                                <div className="space-y-6">
                                    {secondArticle.image_url && (
                                        <div className="w-full h-40 rounded-2xl overflow-hidden">
                                            <img
                                                src={secondArticle.image_url}
                                                alt={secondArticle.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-extrabold leading-tight text-slate-900">
                                        {secondArticle.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed text-base">
                                        {secondArticle.content?.substring(0, 100)}...
                                    </p>
                                </div>
                                <div className="mt-8">
                                    <Link
                                        to={createPageUrl(`ArticleDetails?slug=${secondArticle.slug}`)}
                                        className="w-full py-4 bg-white text-center rounded-2xl font-bold text-slate-900 hover:bg-[#FF8F00] hover:text-white transition-all duration-300 inline-block border border-slate-200"
                                    >
                                        {t('articles.read_more')}
                                    </Link>
                                </div>
                            </article>
                        )}

                        {/* Remaining Articles - 3-column grid */}
                        {remainingArticles.length > 0 && (
                            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-10 pt-6">
                                {remainingArticles.map((article) => (
                                    <article key={article.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                                        <div className="h-56 overflow-hidden">
                                            <img
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                src={article.image_url}
                                                alt={article.title}
                                            />
                                        </div>
                                        <div className="p-10 space-y-5 flex-1 flex flex-col">
                                            <h3 className="text-2xl font-extrabold leading-tight text-slate-900">
                                                {article.title}
                                            </h3>
                                            <p className="text-slate-500 text-base leading-relaxed flex-1">
                                                {article.content?.substring(0, 100)}...
                                            </p>
                                            <Link
                                                to={createPageUrl(`ArticleDetails?slug=${article.slug}`)}
                                                className="inline-flex items-center gap-2 text-[#FF8F00] font-black pt-4 group"
                                            >
                                                {t('articles.read_more')}
                                                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                    </div>
                )}
            </main>
        </div>
    );
}