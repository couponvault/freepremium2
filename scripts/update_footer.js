const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const eeatLinks = `
        <div class="footer-links" style="margin-top: 15px; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
          <a href="about.html" class="footer-link">About Us</a>
          <a href="contact.html" class="footer-link">Contact</a>
          <a href="dmca.html" class="footer-link">DMCA</a>
          <a href="privacy.html" class="footer-link">Privacy Policy</a>
          <a href="terms.html" class="footer-link">Terms of Service</a>
        </div>
`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('<div class="footer-copy">') && !content.includes('about.html')) {
    content = content.replace('<div class="footer-copy">', eeatLinks + '        <div class="footer-copy">');
    fs.writeFileSync(file, content);
    console.log('Updated footer in ' + file);
  }
});
