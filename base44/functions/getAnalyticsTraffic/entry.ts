import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("google_analytics");

    // First, list available GA4 properties
    const accountsRes = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const accountsData = await accountsRes.json();
    console.log('Account summaries:', JSON.stringify(accountsData));

    if (!accountsData.accountSummaries || accountsData.accountSummaries.length === 0) {
      return Response.json({ error: 'No Google Analytics accounts found for this Google account' }, { status: 404 });
    }

    // Find the property - look for G-XT2PGXW21M or use the first one
    let propertyId = null;
    for (const account of accountsData.accountSummaries) {
      if (account.propertySummaries) {
        for (const prop of account.propertySummaries) {
          // Use first property found, or match specific one
          if (!propertyId) {
            propertyId = prop.property; // format: "properties/XXXXXXX"
          }
        }
      }
    }

    if (!propertyId) {
      return Response.json({ error: 'No GA4 properties found', accounts: accountsData }, { status: 404 });
    }

    console.log('Using property:', propertyId);

    // Query traffic data for last 3 months - organic vs paid
    const reportRes = await fetch(`https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [
          { startDate: '90daysAgo', endDate: 'today' }
        ],
        dimensions: [
          { name: 'sessionDefaultChannelGroup' },
          { name: 'month' }
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ],
        orderBys: [
          { dimension: { dimensionName: 'month' }, desc: true }
        ]
      })
    });

    const reportData = await reportRes.json();
    console.log('Report response status:', reportRes.status);

    if (!reportRes.ok) {
      return Response.json({ error: 'Failed to fetch analytics data', details: reportData }, { status: reportRes.status });
    }

    return Response.json({
      propertyId,
      accounts: accountsData.accountSummaries,
      report: reportData
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});