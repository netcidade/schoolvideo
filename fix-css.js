const fs = require('fs');

try {
  const mainCssObj = fs.readFileSync('c:/projetos/meu-app/src/escola-em-video/assets/css/main.css', 'utf-8');
  const tailwindHeader = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n";
  const newGlobal = tailwindHeader + mainCssObj;
  
  fs.writeFileSync('c:/projetos/meu-app/src/escola-git/src/styles/global.css', newGlobal);
  console.log('Global CSS successfully replaced!');
} catch(err) {
  console.error('Error applying CSS:', err);
}
