import React, { useState, useEffect } from 'react';
import { Article } from '@/entities/Article';
import { Loader2, Calendar, Tags } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function ArticleDetailsPage() {
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const slug = urlParams.get('slug');
                if (!slug) {
                    setError("Article not found.");
                    return;
                }
                
                const results = await Article.filter({ slug: slug }, '', 1);
                if (results.length > 0) {
                    setArticle(results[0]);
                } else {
                    setError("Article not found.");
                }
            } catch (err) {
                setError("Failed to fetch article.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-16 h-16 text-amber-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600">{error}</h2>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <article>
                    <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-8 shadow-lg"
                    />
                    
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{article.title}</h1>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>פורסם ב-{format(new Date(article.created_date), 'd LLLL, yyyy')}</span>
                            </div>
                            {article.keywords && article.keywords.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Tags className="w-4 h-4" />
                                    <div className="flex gap-2">
                                        {article.keywords.map(keyword => (
                                            <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>
                    
                    <div className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-strong:text-gray-800">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </div>
                </article>
            </div>
        </div>
    );
}