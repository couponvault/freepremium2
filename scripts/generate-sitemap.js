const fs = require('fs');

async function generateSitemap() {
  try {
    // Decoding base64 Supabase credentials
    const SUPABASE_URL = Buffer.from('aHR0cHM6Ly9ia291eWRoa3NraXpxY3Z4dXJleS5zdXBhYmFzZS5jbw==', 'base64').toString('ascii');
    const SUPABASE_KEY = Buffer.from('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1KcmIzVjVaR2hyYzJ0cGVuRmpkbmgxY21WNUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT0RRMU16TXlPRGtzSW1WNGNDSTZNakV3TURFd09USTRPWDAuMVd1RDM4WU5qcUtWajhqdGxuVEJIQ0x4RjNnNmJYYy04d1VReklIQW0ybw==', 'base64').toString('ascii');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/videos?select=id,title,description,thumbnail,embedUrl,created_at`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const videos = await response.json();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
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

    const escapeXml = (unsafe) => (unsafe || '').replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });

    if (videos && videos.length > 0) {
      videos.forEach(video => {
        let date = new Date().toISOString().split('T')[0];
        try {
          if (video.created_at) {
            // Force replace any spaces or slashes with hyphens if user typed it manually
            let rawDate = video.created_at.split('T')[0].replace(/[\/\s]/g, '-');
            
            // Validate if it matches YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
              date = rawDate;
            } else {
              // Try parsing it as a real date object
              const parsed = new Date(video.created_at);
              if (!isNaN(parsed.getTime())) {
                date = parsed.toISOString().split('T')[0];
              }
            }
          }
        } catch (e) {
          // fallback to today's date if anything fails
        }

        const title = escapeXml(video.title);
        const description = escapeXml(video.description || video.title || 'Premium Video');
        let thumbnail = escapeXml(video.thumbnail);
        if (!thumbnail || !thumbnail.startsWith('http')) {
          thumbnail = 'https://freepremium.online/assets/hero_spotlight.png';
        }
        let playerLoc = escapeXml(video.embedUrl);
        if (!playerLoc || !playerLoc.startsWith('http')) {
          playerLoc = `https://freepremium.online/watch.html?v=${video.id}`;
        }

        xml += `
  <url>
    <loc>https://freepremium.online/watch.html?v=${video.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <video:video>
      <video:thumbnail_loc>${thumbnail}</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>${description}</video:description>
      <video:player_loc>${playerLoc}</video:player_loc>
    </video:video>
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
