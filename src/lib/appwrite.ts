/**
 * Clientes Appwrite (server-side) — usando node-appwrite
 * Chamado APENAS em arquivos .astro (server) e API routes.
 * NUNCA importar em componentes React client-side.
 */

function getEnvVar(key: string, cfEnv: any = {}) {
  return cfEnv[key] || import.meta.env[key] || (typeof process !== 'undefined' ? process.env[key] : undefined);
}

/** Cliente com API Key (acesso admin — server only) */
async function createAdminClient(cfEnv: any = {}) {
  const endpoint = getEnvVar('APPWRITE_ENDPOINT', cfEnv);
  const projectId = getEnvVar('APPWRITE_PROJECT_ID', cfEnv);
  const apiKey = getEnvVar('APPWRITE_API_KEY', cfEnv);

  if (!endpoint || !projectId || !apiKey) {
    throw new Error(`Vars missing. Endpoint: ${!!endpoint}, Project: ${!!projectId}, Key: ${!!apiKey}`);
  }

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
async function createSessionClient(sessionToken: string, cfEnv: any = {}) {
  const endpoint = getEnvVar('APPWRITE_ENDPOINT', cfEnv);
  const projectId = getEnvVar('APPWRITE_PROJECT_ID', cfEnv);

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
