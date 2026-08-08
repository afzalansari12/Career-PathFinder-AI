// frontend/src/app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("Missing STRIPE_SECRET_KEY environment variable.");
      return NextResponse.json(
        { error: "Stripe configuration is missing on the server." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-07-29.dahlia",
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "CareerPath AI Pro Subscription",
              description:
                "Unlimited Deterministic ATS Audits, Live Job Matches & Mock Interviews",
            },
            unit_amount: 1900, // $19.00 / month
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/dashboard?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment session" },
      { status: 500 }
    );
  }
}