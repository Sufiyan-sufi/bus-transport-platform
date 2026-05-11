import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { BookingService } from "@/services/booking.service";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const bookings = await BookingService.getContractorBookings(contractorProfile.id);
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
