export default async function handler(req, res) {
  try {
    const SUPABASE_URL = atob('aHR0cHM6Ly9ia291eWRoa3NraXpxY3Z4dXJleS5zdXBhYmFzZS5jbw==');
    const SUPABASE_KEY = atob('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1KcmIzVjVaR2hyYzJ0cGVuRmpkbmgxY21WNUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT0RRMU16TXlPRGtzSW1WNGNDSTZNakV3TURFd09USTRPWDAuMVd1RDM4WU5qcUtWajhqdGxuVEJIQ0x4RjNnNmJYYy04d1VReklIQW0ybw==');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/videos?select=id,created_at`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const videos = await response.json();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://freepremium.online/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://freepremium.online/category.html</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://freepremium.online/premium-stuff.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    if (videos && videos.length > 0) {
      videos.forEach(video => {
        // Fallback to today if created_at is missing
        const date = video.created_at ? video.created_at.split('T')[0] : new Date().toISOString().split('T')[0];
        xml += `
  <url>
    <loc>https://freepremium.online/watch.html?v=${video.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      });
    }

    xml += `\n</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache on Edge for 1 hour
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).send(`Error generating sitemap: ${err.message}`);
  }
}
