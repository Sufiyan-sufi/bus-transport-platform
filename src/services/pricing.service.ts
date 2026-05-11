import { PricingRepository } from "@/repositories/pricing.repository";
import { updatePricingSchema } from "@/validators";
import { z } from "zod";

export class PricingService {
  static async updatePricing(
    routeId: string,
    data: z.infer<typeof updatePricingSchema>
  ) {
    const validatedData = updatePricingSchema.parse(data);
    return await PricingRepository.updateRoutePricing(routeId, validatedData.pricing);
  }

  static async getPricingByRouteId(routeId: string) {
    return await PricingRepository.getByRouteId(routeId);
  }
}
