import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const articles = await base44.entities.Article.list('-created_date', 50);
    const clean = articles.map(a => ({
      title: (a.title || '').trim(),
      slug: a.slug,
      content: a.content,
      image_url: a.image_url || '',
      keywords: a.keywords || [],
      status: a.status || 'published'
    }));

    const jsonStr = JSON.stringify(clean, null, 2);

    return new Response(jsonStr, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename=articles-export.json'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});