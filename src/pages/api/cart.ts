// API: /api/cart — GET retorna itens, POST add/remove
import type { APIRoute } from 'astro';
import { getCart, addToCart, removeFromCart } from '../../lib/cart';

export const GET: APIRoute = ({ cookies }) => {
  const items = getCart(cookies);
  return new Response(JSON.stringify({ items, count: items.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const form   = await request.formData();
  const action = form.get('action')?.toString();

  if (action === 'add') {
    const item = {
      id:     form.get('video_id')?.toString()  ?? '',
      titulo: form.get('titulo')?.toString()    ?? '',
      prof:   form.get('prof')?.toString()      ?? '',
      preco:  parseFloat(form.get('preco')?.toString() ?? '0'),
    };
    addToCart(cookies, item);
    const cart = getCart(cookies);
    return new Response(JSON.stringify({ success: true, count: cart.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (action === 'remove') {
    const id = form.get('video_id')?.toString() ?? '';
    removeFromCart(cookies, id);
    const cart = getCart(cookies);
    return new Response(JSON.stringify({ success: true, count: cart.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Ação inválida' }), { status: 400 });
};
