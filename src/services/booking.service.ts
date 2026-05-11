import { BookingRepository } from "@/repositories/booking.repository";
import { RouteRepository } from "@/repositories/route.repository";
import { bookingSchema } from "@/validators";
import { z } from "zod";

export class BookingService {
  static async createBooking(
    employeeId: string,
    data: z.infer<typeof bookingSchema>
  ) {
    const validatedData = bookingSchema.parse(data);

    // 1. Get route capacity
    const route = await RouteRepository.findById(validatedData.routeId);
    if (!route) {
      throw new Error("Route not found");
    }

    // 2. Check current capacity for the date
    const currentBookings = await BookingRepository.countBookingsByRouteAndDate(
      validatedData.routeId,
      validatedData.startDate
    );

    if (currentBookings >= route.capacity) {
      throw new Error("This route is fully booked for the selected date.");
    }

    // 3. Create booking
    return await BookingRepository.create({
      employeeId,
      routeId: validatedData.routeId,
      fromStopId: validatedData.fromStopId,
      toStopId: validatedData.toStopId,
      startDate: validatedData.startDate,
    });
  }

  static async getEmployeeBookings(employeeId: string) {
    return await BookingRepository.findByEmployeeId(employeeId);
  }

  static async getContractorBookings(contractorId: string) {
    return await BookingRepository.findByContractorId(contractorId);
  }

  static async updateBookingStatus(
    id: string,
    contractorUserId: string,
    status: "CONFIRMED" | "CANCELLED"
  ) {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.route.contractor.userId !== contractorUserId) {
      throw new Error("Unauthorized");
    }

    return await BookingRepository.updateStatus(id, status);
  }
}
