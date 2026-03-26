const fs = require('fs');
const files = [
  'src/pages/registro.astro',
  'src/pages/api/webhook.ts',
  'src/pages/admin/videos.astro',
  'src/pages/admin/professores.astro',
  'src/pages/admin/pedidos.astro',
  'src/pages/admin/index.astro',
  'src/pages/admin/alunos.astro'
];
files.forEach(f => {
  let fp = 'c:/projetos/meu-app/src/escola-git/' + f;
  let d = fs.readFileSync(fp, 'utf8');
  
  // Inject env capture if not there
  if (!d.includes('Astro.locals.runtime?.env')) {
    d = d.replace(/const user = await getSession\(Astro\.cookies\);/, 'const cfEnv = Astro.locals.runtime?.env || {};\nconst user = await getSession(Astro.cookies, cfEnv);');
    d = d.replace(/const \{ databases(.*?) \} = (await )?createAdminClient\(\);/, 'const { databases$1 } = await createAdminClient(cfEnv);\nconst dynamicDbId = cfEnv.APPWRITE_DATABASE_ID || DB_ID;');
    d = d.replace(/const \{ users(.*?) \} = (await )?createAdminClient\(\);/, 'const { users$1 } = await createAdminClient(cfEnv);');
    
    // Replace DB_ID usages with dynamicDbId in getDocument / listDocuments / createDocument etc
    d = d.replace(/DB_ID,/g, 'dynamicDbId,');
    fs.writeFileSync(fp, d);
  }
});
