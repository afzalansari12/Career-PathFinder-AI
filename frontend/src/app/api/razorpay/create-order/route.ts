// frontend/src/app/api/razorpay/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    // Mock Razorpay Order Payload (Replace KEY_ID & SECRET in production)
    const order = {
      id: `order_${Date.now()}`,
      amount: plan === "pro" ? 99900 : 199900, // Amount in paise (₹999 or ₹1,999)
      currency: "INR",
      receipt: `rcpt_${userId.slice(0, 8)}`,
    };

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}