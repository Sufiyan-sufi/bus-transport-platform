import { StopRepository } from "@/repositories/stop.repository";

export class StopService {
  static async getUniqueStops() {
    return await StopRepository.getAllUniqueStops();
  }
}
