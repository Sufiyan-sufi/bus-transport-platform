import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { BookingForm } from "@/components/features/bookings/BookingForm";

export default async function BookRoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id: routeId } = await params;
  const { from, to } = await searchParams;

  if (!session || (session.user as any).role !== "EMPLOYEE") {
    redirect(`/login?callbackUrl=/routes/${routeId}/book?from=${from}&to=${to}`);
  }

  const route = await prisma.route.findUnique({
    where: { id: routeId },
    include: {
      stops: true,
      pricing: {
        where: {
          AND: [
            { fromStop: { name: from || "" } },
            { toStop: { name: to || "" } },
          ],
        },
      },
    },
  });

  if (!route) {
    notFound();
  }

  const fromStop = route.stops.find((s) => s.name === from);
  const toStop = route.stops.find((s) => s.name === to);

  if (!fromStop || !toStop) {
    redirect(`/routes/${routeId}`);
  }

  const price = Number(route.pricing[0]?.amount || 0);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Complete Your Booking</h1>
        <p className="text-muted-foreground">Secure your seat for your daily commute.</p>
      </div>

      <BookingForm
        routeId={route.id}
        routeName={route.name}
        fromStopId={fromStop.id}
        fromStopName={fromStop.name}
        toStopId={toStop.id}
        toStopName={toStop.name}
        price={price}
      />
    </div>
  );
}
