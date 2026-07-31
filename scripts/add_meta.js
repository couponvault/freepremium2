const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const tag = '<meta name="referrer" content="no-referrer">';
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes(tag) && content.includes('</head>')) {
    content = content.replace('</head>', '  ' + tag + '\n</head>');
    fs.writeFileSync(file, content);
    console.log('Added to ' + file);
  }
});
