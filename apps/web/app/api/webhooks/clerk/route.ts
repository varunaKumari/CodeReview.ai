import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type { WebhookEvent } from '@clerk/nextjs/server';

/** API URL for the backend */
const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';

/**
 * Clerk webhook handler.
 *
 * Listens for Clerk events (user.created, user.updated, user.deleted)
 * and forwards them to the backend API for database synchronization.
 *
 * Security: Verifies Svix webhook signature before processing.
 */
export async function POST(req: Request): Promise<NextResponse> {
  const webhookSecret = process.env['CLERK_WEBHOOK_SECRET'];

  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 },
    );
  }

  // ── Verify Svix signature ────────────────────────────────
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 },
    );
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 },
    );
  }

  // ── Route event to backend API ───────────────────────────
  const eventType = event.type;

  try {
    switch (eventType) {
      case 'user.created': {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const primaryEmail = email_addresses?.[0]?.email_address ?? '';
        const name = [first_name, last_name].filter(Boolean).join(' ') || 'User';

        await fetch(`${API_URL}/api/webhooks/clerk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'user.created',
            data: {
              clerkId: id,
              email: primaryEmail,
              name,
              avatarUrl: image_url ?? null,
            },
          }),
        });
        break;
      }

      case 'user.updated': {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const primaryEmail = email_addresses?.[0]?.email_address ?? '';
        const name = [first_name, last_name].filter(Boolean).join(' ') || 'User';

        await fetch(`${API_URL}/api/webhooks/clerk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'user.updated',
            data: {
              clerkId: id,
              email: primaryEmail,
              name,
              avatarUrl: image_url ?? null,
            },
          }),
        });
        break;
      }

      case 'user.deleted': {
        const { id } = event.data;

        await fetch(`${API_URL}/api/webhooks/clerk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'user.deleted',
            data: { clerkId: id },
          }),
        });
        break;
      }

      default:
        // Unhandled event type — acknowledge but don't process
        break;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Failed to forward webhook event ${eventType}:`, message);
    // Still return 200 — Clerk requires successful responses to avoid retries
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
