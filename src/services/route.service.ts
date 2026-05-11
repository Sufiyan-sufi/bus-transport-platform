import { prisma } from "@/lib/prisma";
import { RouteRepository } from "@/repositories/route.repository";
import { createRouteSchema } from "@/validators";
import { z } from "zod";

export class RouteService {
  static async createRoute(
    contractorId: string,
    data: z.infer<typeof createRouteSchema>
  ) {
    // Validate data
    const validatedData = createRouteSchema.parse(data);

    // Map stops with orderIndex
    const stopsWithOrder = validatedData.stops.map((stop, index) => ({
      ...stop,
      orderIndex: index,
    }));

    return await RouteRepository.create({
      name: validatedData.name,
      capacity: validatedData.capacity,
      contractorId,
      stops: stopsWithOrder,
    });
  }

  static async getContractorRoutes(contractorId: string) {
    return await RouteRepository.findByContractorId(contractorId);
  }

  static async getRouteById(id: string) {
    return await RouteRepository.findById(id);
  }

  static async searchRoutes(from: string, to: string) {
    // Search for routes that contain both stops where 'from' comes before 'to'
    const routes = await prisma.route.findMany({
      where: {
        status: "ACTIVE",
        AND: [
          { stops: { some: { name: from } } },
          { stops: { some: { name: to } } },
        ],
      },
      include: {
        stops: {
          orderBy: { orderIndex: "asc" },
        },
        pricing: true,
        contractor: true,
      },
    });

    // Filter routes where 'from' stop has a lower orderIndex than 'to' stop
    return routes.filter((route: any) => {
      const fromStop = route.stops.find((s: any) => s.name === from);
      const toStop = route.stops.find((s: any) => s.name === to);
      return fromStop && toStop && fromStop.orderIndex < toStop.orderIndex;
    });
  }
}
