import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PricingMatrix } from "@/components/features/routes/PricingMatrix";

export default async function RoutePricingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id: routeId } = await params;

  if (!session || (session.user as any).role !== "CONTRACTOR") {
    redirect("/login");
  }

  const route = await prisma.route.findUnique({
    where: { id: routeId },
    include: {
      contractor: true,
      stops: {
        orderBy: { orderIndex: "asc" },
      },
      pricing: true,
    },
  });

  if (!route) {
    notFound();
  }

  // Verify ownership
  if (route.contractor.userId !== (session.user as any).id) {
    redirect("/dashboard/routes");
  }

  // Map Decimal to number for the client component
  const initialPricing = route.pricing.map((p) => ({
    fromStopId: p.fromStopId,
    toStopId: p.toStopId,
    amount: Number(p.amount),
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Pricing: {route.name}</h1>
        <p className="text-muted-foreground">
          Configure the ticket prices between different stops for this route.
        </p>
      </div>

      <PricingMatrix
        routeId={route.id}
        stops={route.stops}
        initialPricing={initialPricing}
      />
    </div>
  );
}
