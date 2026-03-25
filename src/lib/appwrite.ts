/**
 * Clientes Appwrite (server-side) — usando node-appwrite
 * Chamado APENAS em arquivos .astro (server) e API routes.
 * NUNCA importar em componentes React client-side.
 */

const endpoint  = import.meta.env.APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT;
const projectId = import.meta.env.APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
const apiKey    = import.meta.env.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;

let __initError = '';
if (!endpoint || !projectId || !apiKey) {
  console.error('❌ Variáveis de ambiente Appwrite não configuradas no Cloudflare ou .env local');
  __initError = `Missing Env. Endpoint: ${!!endpoint}, Project: ${!!projectId}, Key: ${!!apiKey}`;
}

/** Cliente com API Key (acesso admin — server only) */
async function createAdminClient() {
  const { Client, Databases, Users, Storage, Account } = await import('node-appwrite');
  const client = new Client()
    .setEndpoint(endpoint as string)
    .setProject(projectId as string)
    .setKey(apiKey as string);

  return {
    databases: new Databases(client),
    users:     new Users(client),
    storage:   new Storage(client),
    account:   new Account(client),
  };
}

/** Cliente sem API Key (acesso como usuário via sessão) */
async function createSessionClient(sessionToken: string) {
  const { Client, Databases, Account } = await import('node-appwrite');
  const client = new Client()
    .setEndpoint(endpoint as string)
    .setProject(projectId as string)
    .setJWT(sessionToken);

  return {
    account:   new Account(client),
    databases: new Databases(client),
  };
}

export { createAdminClient, createSessionClient };

// IDs das collections no Appwrite
export const DB_ID = import.meta.env.APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || '';

export const COLLECTIONS = {
  PROFESSORES: 'professores',
  VIDEOS:      'videos',
  COMPRAS:     'compras',
} as const;

export const BUCKET_ID = import.meta.env.APPWRITE_BUCKET_ID || process.env.APPWRITE_BUCKET_ID || 'professor-photos';
