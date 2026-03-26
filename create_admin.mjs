import { Client, Users, ID } from 'node-appwrite';
import fs from 'fs';

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

async function execute() {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    fs.writeFileSync('admin_result.json', JSON.stringify({ error: 'Variáveis de ambiente faltando' }));
    return;
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  const users = new Users(client);

  try {
    const userEmail = 'admin@escolaemvideo.com';
    const userPass = 'admin123456';
    
    let user;
    try {
      user = await users.create(ID.unique(), userEmail, undefined, userPass, 'Administrador');
      await users.updateLabels(user.$id, ['admin']);
      fs.writeFileSync('admin_result.json', JSON.stringify({ 
        success: true, 
        message: 'Admin criado', 
        login: userEmail, 
        senha: userPass 
      }));
    } catch (e) {
      if (e.code === 409) {
        const list = await users.list();
        user = list.users.find(u => u.email === userEmail);
        if (user) {
          await users.updatePassword(user.$id, userPass);
          await users.updateLabels(user.$id, ['admin']);
          fs.writeFileSync('admin_result.json', JSON.stringify({ 
            success: true, 
            message: 'Admin atualizado', 
            login: userEmail, 
            senha: userPass 
          }));
        }
      } else {
        throw e;
      }
    }
  } catch (error) {
    fs.writeFileSync('admin_result.json', JSON.stringify({ error: error.message || String(error) }));
  }
}

execute();
