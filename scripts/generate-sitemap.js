const fs = require('fs');

async function generateSitemap() {
  try {
    // Decoding base64 Supabase credentials
    const SUPABASE_URL = Buffer.from('aHR0cHM6Ly9ia291eWRoa3NraXpxY3Z4dXJleS5zdXBhYmFzZS5jbw==', 'base64').toString('ascii');
    const SUPABASE_KEY = Buffer.from('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1KcmIzVjVaR2hyYzJ0cGVuRmpkbmgxY21WNUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT0RRMU16TXlPRGtzSW1WNGNDSTZNakV3TURFd09USTRPWDAuMVd1RDM4WU5qcUtWajhqdGxuVEJIQ0x4RjNnNmJYYy04d1VReklIQW0ybw==', 'base64').toString('ascii');

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

    fs.writeFileSync('sitemap.xml', xml);
    console.log(`Successfully generated sitemap.xml with ${videos.length + 3} URLs.`);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  }
}

generateSitemap();
