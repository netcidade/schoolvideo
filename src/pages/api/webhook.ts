// API: /api/webhook — processa eventos Stripe
import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createAdminClient, DB_ID, COLLECTIONS } from '../../lib/appwrite';
import { ID } from 'node-appwrite';

export const POST: APIRoute = async ({ request }) => {
  const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY ?? '');
  const sig    = request.headers.get('stripe-signature') ?? '';
  const body   = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, import.meta.env.STRIPE_WEBHOOK_SECRET ?? '');
  } catch {
    return new Response('Webhook signature inválida', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session;
    const userId   = session.metadata?.usuario_id ?? '';
    const videoIds = (session.metadata?.video_ids ?? '').split(',').filter(Boolean);
    const stripeId = session.id;

    const { databases } = createAdminClient();
    for (const videoId of videoIds) {
      await databases.createDocument(DB_ID, COLLECTIONS.COMPRAS, ID.unique(), {
        usuario_id:        userId,
        video_id:          videoId,
        stripe_session_id: stripeId,
        status:            'pago',
      });
    }
  }

  return new Response('ok', { status: 200 });
};
