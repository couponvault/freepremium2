const fs = require('fs');

const template = fs.readFileSync('interstitial.html', 'utf8');

// Strip out the main content area of interstitial.html to use as a base layout
let baseLayout = template.replace(/<main>[\s\S]*?<\/main>/, '<main class="eeat-main"><div class="eeat-content" style="max-width: 800px; margin: 40px auto; padding: 20px; color: hsl(var(--text-secondary)); font-family: sans-serif; line-height: 1.6;">{{CONTENT}}</div></main>');

// Update the script tag to remove interstitial.js, we just need app.js
baseLayout = baseLayout.replace('<script src="/interstitial.js"></script>', '');

const pages = {
  'about.html': {
    title: 'About Us - FreePremium',
    content: `
      <h1 style="color: hsl(var(--text-primary)); margin-bottom: 20px;">About FreePremium</h1>
      <p>Welcome to FreePremium, your premier destination for high-quality, free adult entertainment. Our mission is to provide a seamless, premium viewing experience without the intrusive advertisements and hidden fees commonly found across the web.</p>
      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">Our Vision</h2>
      <p>We believe that high-definition adult content should be accessible to everyone in a safe, secure, and user-friendly environment. Our platform is meticulously curated to ensure we host only the best videos across a wide variety of popular categories.</p>
      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">Why Choose Us?</h2>
      <ul>
        <li style="margin-bottom: 10px;"><strong>Premium HD Quality:</strong> We prioritize high-resolution streaming.</li>
        <li style="margin-bottom: 10px;"><strong>No Hidden Fees:</strong> 100% free streaming with no credit cards required.</li>
        <li style="margin-bottom: 10px;"><strong>Privacy First:</strong> We respect your privacy and employ modern security standards to protect your browsing experience.</li>
      </ul>
      <p style="margin-top: 30px;">Thank you for choosing FreePremium. Enjoy the ultimate streaming experience.</p>
    `
  },
  'contact.html': {
    title: 'Contact Us - FreePremium',
    content: `
      <h1 style="color: hsl(var(--text-primary)); margin-bottom: 20px;">Contact Us</h1>
      <p>We value your feedback and are here to assist you with any inquiries, suggestions, or issues you may encounter while using our platform.</p>
      <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-top: 30px;">
        <h3 style="color: hsl(var(--text-primary)); margin-bottom: 15px;">Get in Touch</h3>
        <p><strong>Email Support:</strong> support@freepremium.online</p>
        <p><strong>Business Inquiries:</strong> business@freepremium.online</p>
        <p><strong>Content Removal:</strong> Please see our <a href="dmca.html" style="color: hsl(var(--primary)); text-decoration: underline;">DMCA Policy</a> page.</p>
      </div>
      <p style="margin-top: 30px;">Our support team operates Monday through Friday, 9:00 AM to 6:00 PM (EST). We aim to respond to all legitimate inquiries within 48-72 business hours.</p>
    `
  },
  'dmca.html': {
    title: 'DMCA Policy - FreePremium',
    content: `
      <h1 style="color: hsl(var(--text-primary)); margin-bottom: 20px;">Digital Millennium Copyright Act (DMCA) Policy</h1>
      <p>FreePremium operates as an indexing and search platform. We do not host any video files on our own servers. All content is indexed automatically from third-party hosting services. However, we take intellectual property rights very seriously and strictly comply with the DMCA.</p>
      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">Takedown Procedure</h2>
      <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible via this site, please notify our copyright agent by providing the following information:</p>
      <ul style="margin-top: 15px;">
        <li style="margin-bottom: 10px;">A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
        <li style="margin-bottom: 10px;">Identification of the copyrighted work claimed to have been infringed.</li>
        <li style="margin-bottom: 10px;">Identification of the material that is claimed to be infringing and a specific URL link to where it is located on our site.</li>
        <li style="margin-bottom: 10px;">Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email address.</li>
        <li style="margin-bottom: 10px;">A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
      </ul>
      <p style="margin-top: 30px;"><strong>Send DMCA Notices to:</strong> dmca@freepremium.online</p>
      <p>Please allow 3-5 business days for your request to be processed and for the links to be removed from our index.</p>
    `
  },
  'privacy.html': {
    title: 'Privacy Policy - FreePremium',
    content: `
      <h1 style="color: hsl(var(--text-primary)); margin-bottom: 20px;">Privacy Policy</h1>
      <p>Last Updated: August 2026</p>
      <p>Your privacy is important to us. This Privacy Policy explains how FreePremium collects, uses, and safeguards your information when you visit our website.</p>
      
      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">1. Information We Collect</h2>
      <p>We do not require users to create accounts to view free content. We may collect non-personally identifiable information such as browser type, device type, referring URLs, and generalized geographic location for analytics purposes.</p>
      
      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">2. Cookies and Tracking</h2>
      <p>We use cookies to improve your user experience and save your preferences (like volume levels or theme settings). Third-party advertising partners may also use cookies to serve relevant ads.</p>

      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">3. Third-Party Links</h2>
      <p>Our site contains links to third-party websites and embedded video players. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">4. Contact Us</h2>
      <p>If you have questions regarding this Privacy Policy, please contact us at privacy@freepremium.online.</p>
    `
  },
  'terms.html': {
    title: 'Terms of Service - FreePremium',
    content: `
      <h1 style="color: hsl(var(--text-primary)); margin-bottom: 20px;">Terms of Service</h1>
      <p>By accessing or using FreePremium, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
      
      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">1. Age Restriction</h2>
      <p><strong>WARNING:</strong> This website contains adult material. You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to access this site. By entering, you represent that you are of legal age.</p>

      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">2. Nature of Service</h2>
      <p>FreePremium acts as an automated search engine and directory. We aggregate embedded videos provided by third-party hosting platforms. We do not produce or host the content shown.</p>

      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">3. User Conduct</h2>
      <p>Users agree not to use automated scripts, bots, or scrapers to access or index our site without explicit permission. Any attempt to disrupt our servers or bypass security measures will result in an immediate block.</p>

      <h2 style="color: hsl(var(--text-primary)); margin-top: 30px; margin-bottom: 15px;">4. Limitation of Liability</h2>
      <p>FreePremium is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding the accuracy, reliability, or uninterrupted availability of the site or its content.</p>
    `
  }
};

for (const [filename, data] of Object.entries(pages)) {
  let pageContent = baseLayout.replace('<title>Redirecting... - FreePremium</title>', `<title>${data.title}</title>`);
  pageContent = pageContent.replace('{{CONTENT}}', data.content);
  fs.writeFileSync(filename, pageContent);
  console.log('Created ' + filename);
}
