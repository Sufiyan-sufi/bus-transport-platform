import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class PricingRepository {
  static async updateRoutePricing(routeId: string, pricing: { fromStopId: string; toStopId: string; amount: number }[]) {
    return await prisma.$transaction(async (tx) => {
      // Delete existing pricing for this route
      await tx.pricing.deleteMany({
        where: { routeId },
      });

      // Create new pricing entries
      return await tx.pricing.createMany({
        data: pricing.map((p) => ({
          routeId,
          fromStopId: p.fromStopId,
          toStopId: p.toStopId,
          amount: new Prisma.Decimal(p.amount),
        })),
      });
    });
  }

  static async getByRouteId(routeId: string) {
    return await prisma.pricing.findMany({
      where: { routeId },
    });
  }
}
