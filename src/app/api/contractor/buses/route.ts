import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const addBusSchema = z.object({
  type: z.enum(["MINI", "STANDARD", "COACH"]),
  capacity: z.number().int().min(1),
  plateNumber: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "CONTRACTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const contractor = await prisma.contractorProfile.findUnique({
    where: { userId: (session.user as any).id },
  });
  if (!contractor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buses = await prisma.bus.findMany({ where: { contractorId: contractor.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(buses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "CONTRACTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const contractor = await prisma.contractorProfile.findUnique({
    where: { userId: (session.user as any).id },
  });
  if (!contractor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const data = addBusSchema.parse(body);
  const bus = await prisma.bus.create({ data: { ...data, contractorId: contractor.id } });
  return NextResponse.json(bus, { status: 201 });
}
