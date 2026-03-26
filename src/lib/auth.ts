/**
 * Auth helpers — autenticação via Appwrite Auth
 * Usa sessão salva em cookie HTTP-only.
 */
import type { AstroCookies } from 'astro';
import { createAdminClient, createSessionClient } from './appwrite';

const SESSION_COOKIE = 'escola_session';

export interface SessionUser {
  id:    string;
  nome:  string;
  email: string;
  role:  'admin' | 'aluno';
}

/** Lê a sessão do cookie e retorna o usuário ou null */
export async function getSession(cookies: AstroCookies, cfEnv: any = {}): Promise<SessionUser | null> {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { account } = await createSessionClient(token, cfEnv);
    const user = await account.get();
    const role = (user.labels ?? []).includes('admin') ? 'admin' : 'aluno';
    return { id: user.$id, nome: user.name, email: user.email, role };
  } catch {
    return null;
  }
}

/** Faz login e salva o JWT no cookie */
export async function login(
  email: string,
  password: string,
  cookies: AstroCookies,
  cfEnv: any = {}
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { account } = await createAdminClient(cfEnv);
    const session = await account.createEmailPasswordSession(email, password);
    cookies.set(SESSION_COOKIE, session.secret, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
    return { ok: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao fazer login';
    return { ok: false, error: msg };
  }
}

/** Remove o cookie de sessão */
export function logout(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

/** Redireciona se não autenticado */
export async function requireLogin(cookies: AstroCookies, redirect?: string, cfEnv: any = {}): Promise<SessionUser> {
  const session = await getSession(cookies, cfEnv);
  if (!session) throw new Response(null, { status: 302, headers: { Location: `/login?redirect=${redirect ?? '/'}` } });
  return session;
}

/** Redireciona se não for admin */
export async function requireAdmin(cookies: AstroCookies, cfEnv: any = {}): Promise<SessionUser> {
  const session = await requireLogin(cookies, '/admin', cfEnv);
  if (session.role !== 'admin') throw new Response(null, { status: 302, headers: { Location: '/' } });
  return session;
}
