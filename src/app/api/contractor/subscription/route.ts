import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "CONTRACTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contractor = await prisma.contractorProfile.update({
    where: { userId: (session.user as any).id },
    data: { subscriptionStatus: "ACTIVE" },
    select: { subscriptionStatus: true },
  });

  return NextResponse.json(contractor);
}
