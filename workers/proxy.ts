/**
 * Simple Proxy Worker for Paragu-AI
 * Proxies all requests to the Hostinger VPS
 */

const ORIGIN = "http://72.61.44.159:8080";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Build proxy URL
    const proxyUrl = `${ORIGIN}${url.pathname}${url.search}`;

    try {
      const response = await fetch(proxyUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });

      return new Response(response.body, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          // Remove problematic headers
          "cf-cache-status": undefined,
        }
      });
    } catch (e: any) {
      return new Response(`Proxy error: ${e.message}`, { status: 502 });
    }
  }
} satisfies ExportedHandler;