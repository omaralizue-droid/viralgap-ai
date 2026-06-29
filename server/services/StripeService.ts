import Stripe from 'stripe';
import { BaseService } from './BaseService';

export class StripeService extends BaseService {
  private stripe: Stripe | null = null;

  constructor() {
    super();
    if (!this.isMock) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (key) {
        this.stripe = new Stripe(key, {
          apiVersion: '2023-10-16' as any,
        });
      }
    }
  }

  isConfigured(): boolean {
    return !!this.stripe && !this.isMock;
  }

  async createCheckoutSession(
    customerId: string,
    email: string,
    plan: string,
    priceId: string,
    userId: string,
    origin: string
  ): Promise<{ success: boolean; url: string; isSimulator?: boolean }> {
    if (this.stripe && !this.isMock) {
      // Production Checkout Session
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${origin}/#billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${origin}/#billing?canceled=true`,
        metadata: {
          userId,
          plan,
        },
        subscription_data: {
          metadata: {
            userId,
            plan,
          },
        },
      });
      return { success: true, url: session.url || '' };
    } else {
      // Sandbox Checkout Simulator URL redirect
      const simUrl = `${origin}/#sim-checkout?plan=${plan}&userId=${userId}&email=${encodeURIComponent(email)}`;
      return { success: true, url: simUrl, isSimulator: true };
    }
  }

  async createPortalSession(
    customerId: string,
    userId: string,
    origin: string
  ): Promise<{ success: boolean; url: string; isSimulator?: boolean }> {
    if (this.stripe && customerId && !customerId.startsWith('cus_sim') && !this.isMock) {
      // Production Customer Portal Session
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${origin}/#billing`,
      });
      return { success: true, url: session.url };
    } else {
      // Sandbox Portal Simulator URL redirect
      const simUrl = `${origin}/#sim-portal?userId=${userId}`;
      return { success: true, url: simUrl, isSimulator: true };
    }
  }

  // Helper to create a customer in production Stripe registry
  async createCustomer(email: string, userId: string): Promise<string> {
    if (this.stripe && !this.isMock) {
      const customer = await this.stripe.customers.create({
        email,
        metadata: { userId }
      });
      return customer.id;
    }
    return `cus_sim_${Math.random().toString(36).substring(2, 10)}`;
  }
}
