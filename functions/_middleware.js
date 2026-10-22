export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get('Content-Type') || '';
  if (!contentType.includes('text/html')) return response;

  const webhookUrl = context.env.N8N_WEBHOOK_KEY;
  if (!webhookUrl) {
    return new Response('N8N_WEBHOOK_KEY is not configured', { status: 500 });
  }

  const html = (await response.text()).replace(
    "'__N8N_WEBHOOK_URL__'",
    () => JSON.stringify(webhookUrl)
  );

  const headers = new Headers(response.headers);
  headers.delete('Content-Length');
  return new Response(html, { status: response.status, headers });
}
