const mammoth = require('mammoth');
mammoth.extractRawText({path: 'СЛР8_Іванов.docx'}).then(r => console.log(r.value)).catch(e => console.error(e));
