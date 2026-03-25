const fs = require('fs');
const files = [
  'src/pages/registro.astro',
  'src/pages/professor/[id].astro',
  'src/pages/index.astro',
  'src/pages/api/webhook.ts',
  'src/pages/admin/videos.astro',
  'src/pages/admin/professores.astro',
  'src/pages/admin/pedidos.astro',
  'src/pages/admin/index.astro',
  'src/pages/admin/alunos.astro',
  'src/lib/auth.ts'
];
files.forEach(f => {
  let fp = 'c:/projetos/meu-app/src/escola-git/' + f;
  let d = fs.readFileSync(fp, 'utf8');
  d = d.replaceAll('createAdminClient()', 'await createAdminClient()');
  d = d.replaceAll('createSessionClient(token)', 'await createSessionClient(token)');
  d = d.replaceAll('await await', 'await');
  fs.writeFileSync(fp, d);
});
console.log('Done replacing!');
