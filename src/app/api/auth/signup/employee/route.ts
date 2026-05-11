import { NextRequest } from "next/server";
import { signupSchema } from "@/validators";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = signupSchema.parse({ ...body, role: "EMPLOYEE" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, role: "EMPLOYEE" },
    });

    return successResponse({ userId: user.id }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
