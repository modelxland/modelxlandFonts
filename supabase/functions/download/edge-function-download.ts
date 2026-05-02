// Supabase Edge Function: download
// ─────────────────────────────────────────────────────────
// Validates the download_token, confirms the order is paid,
// then streams the font ZIP directly to the browser.
// The GitHub URL is never exposed to the client.
//
// ── Deploy ───────────────────────────────────────────────
// supabase functions deploy download --no-verify-jwt
//
// ── Required secret (set once in Supabase Dashboard) ─────
// Settings → Edge Functions → download → Secrets:
//   GITHUB_FILE_URL = https://github.com/modelxland/modelxlandFonts/releases/download/v1.0/modelxland-bundle.zip

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DOWNLOAD_FILENAME = 'ModelxLand-Font-Bundle.zip';

Deno.serve(async (req: Request) => {

  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ── 1. Get token from URL ─────────────────────────
    const url   = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'رابط التحميل غير صالح' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── 2. Validate UUID format ───────────────────────
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(token)) {
      return new Response(
        JSON.stringify({ error: 'رابط التحميل غير صالح' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── 3. Check token in database ────────────────────
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('download_token', token)
      .eq('status', 'paid')
      .maybeSingle();

    if (orderError) throw orderError;

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'لم يتم تأكيد الدفع لهذا الطلب' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── 4. Fetch ZIP from GitHub (URL stays server-side)
    const githubUrl = Deno.env.get('GITHUB_FILE_URL');
    if (!githubUrl) throw new Error('GITHUB_FILE_URL secret not set');

    const fileResponse = await fetch(githubUrl, {
      headers: { 'User-Agent': 'ModelxLand-Server' },
    });

    if (!fileResponse.ok) {
      throw new Error(`GitHub fetch failed: ${fileResponse.status}`);
    }

    // ── 5. Stream file directly to the browser ────────
    return new Response(fileResponse.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type':        'application/zip',
        'Content-Disposition': `attachment; filename="${DOWNLOAD_FILENAME}"`,
        'Cache-Control':       'no-store',
      },
    });

  } catch (err) {
    console.error('Download function error:', err);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ في الخادم، حاول مرة أخرى' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
