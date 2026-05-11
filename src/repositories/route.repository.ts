import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class RouteRepository {
  static async create(data: {
    name: string;
    capacity: number;
    contractorId: string;
    stops: { name: string; location?: string; orderIndex: number }[];
  }) {
    return await prisma.route.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        contractorId: data.contractorId,
        stops: {
          create: data.stops,
        },
      },
      include: {
        stops: true,
      },
    });
  }

  static async findByContractorId(contractorId: string) {
    return await prisma.route.findMany({
      where: { contractorId },
      include: {
        stops: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });
  }

  static async findById(id: string) {
    return await prisma.route.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { orderIndex: "asc" },
        },
        pricing: true,
        schedules: true,
      },
    });
  }
}
