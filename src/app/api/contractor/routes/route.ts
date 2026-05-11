import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RouteService } from "@/services/route.service";
import { createRouteSchema } from "@/validators";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get contractor profile ID
    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });

    if (!contractorProfile) {
      return NextResponse.json({ error: "Contractor profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = createRouteSchema.parse(body);

    const route = await RouteService.createRoute(contractorProfile.id, validatedData);

    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    console.error("Route creation error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "CONTRACTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });

    if (!contractorProfile) {
      return NextResponse.json({ error: "Contractor profile not found" }, { status: 404 });
    }

    const routes = await RouteService.getContractorRoutes(contractorProfile.id);

    return NextResponse.json(routes);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
