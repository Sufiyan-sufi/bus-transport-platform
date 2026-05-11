import { prisma } from "@/lib/prisma";

export class StopRepository {
  static async getAllUniqueStops() {
    // Get unique stop names to avoid duplicates in search dropdown
    const stops = await prisma.stop.findMany({
      select: {
        name: true,
      },
      distinct: ['name'],
      orderBy: {
        name: 'asc'
      }
    });
    return stops;
  }

  static async findByName(name: string) {
    return await prisma.stop.findMany({
      where: { name }
    });
  }
}
