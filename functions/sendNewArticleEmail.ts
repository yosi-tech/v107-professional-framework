import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Get all articles created in the last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const allArticles = await base44.asServiceRole.entities.Article.list('-created_date');
        const newArticles = allArticles.filter(article => 
            new Date(article.created_date) >= yesterday && article.status === 'published'
        );
        
        if (newArticles.length === 0) {
            return Response.json({ 
                success: true, 
                message: 'No new articles to send',
                articlesSent: 0
            });
        }
        
        // Get all users
        const users = await base44.asServiceRole.entities.User.list();
        
        let emailsSent = 0;
        let errors = [];
        
        // Send email for each new article to all users
        for (const article of newArticles) {
            for (const user of users) {
                try {
                    const articleUrl = `${Deno.env.get('BASE44_APP_URL') || 'https://v107.co.il'}/ArticleDetails?slug=${article.slug}`;
                    
                    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Assistant', 'Segoe UI', Arial, sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #f6e05e;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .article-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .article-title {
            font-size: 24px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 15px;
        }
        .article-keywords {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        .keyword-badge {
            background-color: #e2e8f0;
            color: #4a5568;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(to right, #d69e2e, #f6e05e);
            color: #1a202c;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f7fafc;
            padding: 30px;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }
        .footer a {
            color: #d69e2e;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 מאמר חדש ב-V107</h1>
        </div>
        <div class="content">
            <p style="font-size: 18px; color: #4a5568; margin-bottom: 25px;">
                שלום ${user.full_name || 'לקורא היקר'},
            </p>
            <p style="font-size: 16px; color: #4a5568; margin-bottom: 25px;">
                פורסם מאמר חדש שיכול לעניין אותך!
            </p>
            ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}" class="article-image" />` : ''}
            <h2 class="article-title">${article.title}</h2>
            ${article.keywords && article.keywords.length > 0 ? `
            <div class="article-keywords">
                ${article.keywords.map(keyword => `<span class="keyword-badge">${keyword}</span>`).join('')}
            </div>
            ` : ''}
            <a href="${articleUrl}" class="cta-button">קרא את המאמר המלא ←</a>
            <p style="font-size: 14px; color: #718096; margin-top: 30px;">
                המאמר פורסם היום, ${new Date().toLocaleDateString('he-IL')}
            </p>
        </div>
        <div class="footer">
            <p>V107 Professional Framework</p>
            <p>
                <a href="mailto:support@v107.co.il">support@v107.co.il</a> | 
                <a href="tel:0552134848">055-2134848</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px;">
                לא רוצה לקבל עדכונים על מאמרים חדשים? 
                <a href="#">לחץ כאן להסרה מהרשימה</a>
            </p>
        </div>
    </div>
</body>
</html>
                    `;
                    
                    await base44.asServiceRole.integrations.Core.SendEmail({
                        to: user.email,
                        subject: `📚 מאמר חדש: ${article.title}`,
                        body: emailHtml
                    });
                    
                    emailsSent++;
                } catch (emailError) {
                    console.error(`Failed to send email to ${user.email}:`, emailError);
                    errors.push({
                        user: user.email,
                        article: article.title,
                        error: emailError.message
                    });
                }
            }
        }
        
        return Response.json({ 
            success: true, 
            message: `Sent ${emailsSent} emails for ${newArticles.length} new articles`,
            newArticles: newArticles.map(a => a.title),
            emailsSent,
            totalUsers: users.length,
            errors: errors.length > 0 ? errors : undefined
        });
        
    } catch (error) {
        console.error('Error in sendNewArticleEmail:', error);
        return Response.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
});