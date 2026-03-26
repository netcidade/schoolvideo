import type { APIRoute } from 'astro';
import { createAdminClient } from '../../lib/appwrite';
import { ID } from 'node-appwrite';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const cfEnv = locals.runtime?.env || {};
    const { users } = await createAdminClient(cfEnv);
    
    const userEmail = 'admin@escolaemvideo.com';
    const userPass  = 'admin123456';
    
    let user;
    try {
      user = await users.create(ID.unique(), userEmail, undefined, userPass, 'Administrador');
      await users.updateLabels(user.$id, ['admin']);
      return new Response(JSON.stringify({ success: true, message: 'Admin criado com sucesso!' }), { status: 200 });
    } catch (e: any) {
      if (e.code === 409) {
        const list = await users.list();
        user = list.users.find(u => u.email === userEmail);
        if (user) {
          await users.updatePassword(user.$id, userPass);
          await users.updateLabels(user.$id, ['admin']);
          return new Response(JSON.stringify({ success: true, message: 'Admin já existia e foi atualizado!' }), { status: 200 });
        }
      }
      throw e;
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};
