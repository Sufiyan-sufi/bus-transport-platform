import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export class ContractorRepository {
  static async create(data: {
    email: string;
    passwordHash: string;
    companyName: string;
    phone: string;
    details?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          role: Role.CONTRACTOR,
        },
      });

      const profile = await tx.contractorProfile.create({
        data: {
          userId: user.id,
          companyName: data.companyName,
          phone: data.phone,
          details: data.details,
        },
      });

      return { user, profile };
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { contractor: true },
    });
  }
}
