/**
 * Carrinho — armazenado em cookie JSON (sem banco)
 * Idêntico à lógica do cart_api.php original.
 */
import type { AstroCookies } from 'astro';

const CART_COOKIE = 'escola_cart';

export interface CartItem {
  id:    string;
  titulo: string;
  prof:  string;
  preco: number;
}

export function getCart(cookies: AstroCookies): CartItem[] {
  try {
    const raw = cookies.get(CART_COOKIE)?.value;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cookies: AstroCookies, items: CartItem[]) {
  cookies.set(CART_COOKIE, JSON.stringify(items), {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 3, // 3 dias
  });
}

export function addToCart(cookies: AstroCookies, item: CartItem) {
  const cart = getCart(cookies);
  if (!cart.find(i => i.id === item.id)) {
    cart.push(item);
    saveCart(cookies, cart);
  }
}

export function removeFromCart(cookies: AstroCookies, videoId: string) {
  const cart = getCart(cookies).filter(i => i.id !== videoId);
  saveCart(cookies, cart);
}

export function clearCart(cookies: AstroCookies) {
  cookies.delete(CART_COOKIE, { path: '/' });
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.preco, 0);
}
