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
  
  // Se ainda não injetamos cfEnv
  if (!d.includes('const cfEnv = Astro.locals.runtime?.env')) {
    
    // Injetar a definição do cfEnv logo antes do const user ou databases
    let inj = "const cfEnv = Astro.locals.runtime?.env || {};\nconst dynamicDbId = cfEnv.APPWRITE_DATABASE_ID || DB_ID;\n";
    
    // Auth replacements
    d = d.replace(/const user = await requireAdmin\(Astro\.cookies\);/g, inj + "const user = await requireAdmin(Astro.cookies, cfEnv);");
    d = d.replace(/const user = await getSession\(Astro\.cookies\);/g, inj + "const user = await getSession(Astro.cookies, cfEnv);");
    
    // Appwrite Client replacements
    d = d.replace(/const \{ databases(.*?) \} = (await )?createAdminClient\(\);/g, "const { databases$1 } = await createAdminClient(cfEnv);");
    d = d.replace(/const \{ users(.*?) \} = (await )?createAdminClient\(\);/g, "const { users$1 } = await createAdminClient(cfEnv);");
    
    // Webhook specific (não tem auth cookies ali)
    if (f === 'src/pages/api/webhook.ts') {
        d = d.replace(/if \(request\.method !== 'POST'\)/, inj + "if (request.method !== 'POST')");
    }

    // Dynamic DB replacements
    d = d.replace(/DB_ID,/g, 'dynamicDbId,');
    
    fs.writeFileSync(fp, d);
    console.log("Fixed " + f);
  }
});
