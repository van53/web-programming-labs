const fs = require('fs');

const md = fs.readFileSync('report.md', 'utf8');

// A very basic markdown to HTML conversion for the report
let html = md
  .replace(/### (.*?)\n/g, '<h3>$1</h3>')
  .replace(/## (.*?)\n/g, '<h2>$1</h2>')
  .replace(/# (.*?)\n/g, '<h1>$1</h1>')
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.*?)\*/g, '<em>$1</em>')
  .replace(/`([^`\n]+)`/g, '<code>$1</code>')
  .replace(/```json\n([\s\S]*?)```/g, '<pre style="background:#f4f4f4;padding:10px;"><code>$1</code></pre>')
  .replace(/> \[!NOTE\]\n> (.*?)\n/g, '<div style="border-left:4px solid #007bff; padding-left:10px; margin:10px 0;"><em>$1</em></div>\n')
  .replace(/\n\n/g, '<br><br>');

const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Звіт</title></head>
<body style="font-family: Arial, sans-serif;">
${html}
</body>
</html>
`;

fs.writeFileSync('report.doc', docHtml, 'utf8');
console.log('report.doc generated');
