import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PricingService } from "@/services/pricing.service";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: routeId } = await params;

    if (!session || (session.user as any).role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: { contractor: true },
    });

    if (!route || route.contractor.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pricing = await PricingService.getPricingByRouteId(routeId);
    return NextResponse.json(pricing);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: routeId } = await params;

    if (!session || (session.user as any).role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: { contractor: true },
    });

    if (!route || route.contractor.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await PricingService.updatePricing(routeId, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pricing update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
