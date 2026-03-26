import { Client, Users, ID } from 'node-appwrite';

// Carrega o .env nativamente no Node 22+
if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

async function execute() {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    console.error('❌ Variáveis de ambiente faltando no .env');
    return;
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  const users = new Users(client);

  try {
    const user = await users.create(
      ID.unique(),
      'admin@escolaemvideo.com',
      undefined,
      'admin123456',
      'Administrador'
    );
    await users.updateLabels(user.$id, ['admin']);
    console.log('✅ Usuário admin criado e label adicionada!');
    console.log('--- CREDENCIAIS ---');
    console.log('Login: admin@escolaemvideo.com');
    console.log('Senha: admin123456');
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️ Usuário já existe, atualizando permissões...');
      const list = await users.list();
      const existing = list.users.find(u => u.email === 'admin@escolaemvideo.com');
      if (existing) {
        await users.updatePassword(existing.$id, 'admin123456');
        await users.updateLabels(existing.$id, ['admin']);
        console.log('✅ Usuário admin atualizado!');
        console.log('--- CREDENCIAIS ---');
        console.log('Login: admin@escolaemvideo.com');
        console.log('Senha: admin123456');
      }
    } else {
      console.error('❌ Erro:', error.message || error);
    }
  }
}

execute();
