export function GET() {
  return new Response(null, {
    status: 307,
    headers: { Location: '/podcast', 'Cache-Control': 'no-store' },
  });
}
