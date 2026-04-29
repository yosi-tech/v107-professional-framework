import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { reportId, page: pageNum } = body;

    if (!reportId) {
      return Response.json({ error: 'reportId is required' }, { status: 400 });
    }

    const report = await base44.asServiceRole.entities.GeneratedReport.get(reportId);
    const markdown = report.report_markdown || '';
    
    // Extract specific page
    const targetPage = pageNum || 4;
    const pageRegex = new RegExp(`# עמוד ${targetPage}[\\s\\S]*?(?=# עמוד \\d|$)`);
    const match = markdown.match(pageRegex);
    const pageContent = match ? match[0].trim() : `Page ${targetPage} not found`;

    // Split into chunks of max 3000 chars
    const chunkSize = 3000;
    const chunks = [];
    for (let i = 0; i < pageContent.length; i += chunkSize) {
      chunks.push(pageContent.substring(i, i + chunkSize));
    }

    const part = body.part || 1;
    return Response.json({ 
      success: true,
      page: targetPage,
      part,
      total_parts: chunks.length,
      total_length: pageContent.length,
      content: chunks[part - 1] || 'No more parts'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});