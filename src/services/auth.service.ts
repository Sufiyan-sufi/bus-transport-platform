import bcrypt from "bcrypt";
import { ContractorRepository } from "@/repositories/contractor.repository";

export class AuthService {
  static async registerContractor(data: {
    email: string;
    passwordPlain: string;
    companyName: string;
    phone: string;
    details?: string;
  }) {
    const existingUser = await ContractorRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);

    return ContractorRepository.create({
      email: data.email,
      passwordHash,
      companyName: data.companyName,
      phone: data.phone,
      details: data.details,
    });
  }
}
