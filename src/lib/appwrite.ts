/**
 * Clientes Appwrite (server-side) — usando node-appwrite
 * Chamado APENAS em arquivos .astro (server) e API routes.
 * NUNCA importar em componentes React client-side.
 */
import { Client, Databases, Users, Storage, Account } from 'node-appwrite';

const endpoint  = import.meta.env.APPWRITE_ENDPOINT;
const projectId = import.meta.env.APPWRITE_PROJECT_ID;
const apiKey    = import.meta.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  throw new Error('❌ Variáveis de ambiente Appwrite não configuradas. Verifique o .env');
}

/** Cliente com API Key (acesso admin — server only) */
function createAdminClient() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return {
    databases: new Databases(client),
    users:     new Users(client),
    storage:   new Storage(client),
    account:   new Account(client),
  };
}

/** Cliente sem API Key (acesso como usuário via sessão) */
function createSessionClient(sessionToken: string) {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setJWT(sessionToken);

  return {
    account:   new Account(client),
    databases: new Databases(client),
  };
}

export { createAdminClient, createSessionClient };

// IDs das collections no Appwrite
export const DB_ID = import.meta.env.APPWRITE_DATABASE_ID ?? '';

export const COLLECTIONS = {
  PROFESSORES: 'professores',
  VIDEOS:      'videos',
  COMPRAS:     'compras',
} as const;

export const BUCKET_ID = import.meta.env.APPWRITE_BUCKET_ID ?? 'professor-photos';
