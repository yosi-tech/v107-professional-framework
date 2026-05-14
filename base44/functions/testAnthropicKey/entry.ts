import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const allEnvKeys = Object.keys(Deno.env.toObject());

    return Response.json({
      has_key: !!apiKey,
      key_length: apiKey ? apiKey.length : 0,
      key_preview: apiKey ? apiKey.substring(0, 10) + '...' : null,
      all_env_keys: allEnvKeys
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});