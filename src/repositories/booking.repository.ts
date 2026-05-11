import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

export class BookingRepository {
  static async create(data: {
    employeeId: string;
    routeId: string;
    fromStopId: string;
    toStopId: string;
    startDate: Date;
  }) {
    return await prisma.booking.create({
      data: {
        employeeId: data.employeeId,
        routeId: data.routeId,
        fromStopId: data.fromStopId,
        toStopId: data.toStopId,
        startDate: data.startDate,
        status: "PENDING",
      },
      include: {
        route: true,
        fromStop: true,
        toStop: true,
      },
    });
  }

  static async countBookingsByRouteAndDate(routeId: string, date: Date) {
    // Check for the specific day (ignoring time for capacity purposes)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.booking.count({
      where: {
        routeId,
        startDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });
  }

  static async findByEmployeeId(employeeId: string) {
    return await prisma.booking.findMany({
      where: { employeeId },
      include: {
        route: true,
        fromStop: true,
        toStop: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findByContractorId(contractorId: string) {
    return await prisma.booking.findMany({
      where: {
        route: {
          contractorId,
        },
      },
      include: {
        employee: {
          select: {
            email: true,
          },
        },
        route: true,
        fromStop: true,
        toStop: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateStatus(id: string, status: BookingStatus) {
    return await prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  static async findById(id: string) {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        route: {
          include: {
            contractor: true,
          },
        },
      },
    });
  }
}
