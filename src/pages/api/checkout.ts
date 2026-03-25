// API: /api/checkout — cria sessão Stripe e redireciona
import type { APIRoute } from 'astro';
import { getSession } from '../../lib/auth';
import { getCart, clearCart } from '../../lib/cart';
import Stripe from 'stripe';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const user = await getSession(cookies);
  if (!user) return redirect('/login?redirect=/');

  const items = getCart(cookies);
  if (items.length === 0) return redirect('/');

  const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2025-03-31.basil',
  });

  const appUrl = import.meta.env.PUBLIC_APP_URL ?? 'http://localhost:4321';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.titulo, description: item.prof },
        unit_amount: Math.round(item.preco * 100),
      },
      quantity: 1,
    })),
    mode: 'payment',
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${appUrl}/cancel`,
    metadata: {
      usuario_id: user.id,
      video_ids:  items.map(i => i.id).join(','),
    },
  });

  return redirect(session.url ?? '/');
};
