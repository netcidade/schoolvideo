const fs = require('fs');
const path = require('path');

const src = 'c:/projetos/meu-app/src/escola-em-video/assets/img';
const dest = 'c:/projetos/meu-app/src/escola-git/public/assets/img';

try {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log('SUCCESS');
} catch(e) {
  console.error(e.message);
}
