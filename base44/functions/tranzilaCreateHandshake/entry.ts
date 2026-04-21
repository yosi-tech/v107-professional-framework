import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    // A. Authentication and User Context
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // B. Extract Input Parameters from Request Body
    const { sum } = await req.json();
    
    if (!sum || sum <= 0) {
      return Response.json({ error: 'Invalid sum' }, { status: 400 });
    }

    // Round the sum to avoid decimal issues
    const roundedSum = Math.round(sum);

    // C. Access Secrets (Terminal Name and Password)
    const supplier = Deno.env.get('supplier');
    const TranzilaPW = Deno.env.get('TranzilaPW');

    if (!supplier || !TranzilaPW) {
      console.error('Missing Tranzila credentials in environment variables.');
      return Response.json({ 
        error: 'Server configuration error: Missing Tranzila credentials' 
      }, { status: 500 });
    }

    // D. Construct the Tranzila Handshake URL
    const handshakeUrl = `https://api.tranzila.com/v1/handshake/create?supplier=${supplier}&sum=${roundedSum}&TranzilaPW=${TranzilaPW}`;
    
    console.log('Creating handshake for sum:', roundedSum);

    // E. Make the API Call to Tranzila
    const response = await fetch(handshakeUrl);
    const data = await response.text();

    console.log('Tranzila handshake response:', data);

    // F. Extract the 'thtk' (Transaction Handshake Token)
    const thtkPrefix = 'thtk=';
    let thtk = data.trim();
    if (thtk.startsWith(thtkPrefix)) {
      thtk = thtk.substring(thtkPrefix.length);
    }

    // G. Return the Response to the Frontend
    return Response.json({
      thtk,
      supplier,
      sum: roundedSum
    });

  } catch (error) {
    // H. Error Handling
    console.error('Tranzila handshake error:', error);
    return Response.json({ 
      error: 'Failed to create handshake',
      details: error.message 
    }, { status: 500 });
  }
});