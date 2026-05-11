import { NextRequest } from "next/server";
import { signupSchema, contractorProfileSchema } from "@/validators";
import { AuthService } from "@/services/auth.service";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate both user and profile data
    const userData = signupSchema.parse({ ...body, role: "CONTRACTOR" });
    const profileData = contractorProfileSchema.parse(body);

    const result = await AuthService.registerContractor({
      email: userData.email,
      passwordPlain: userData.password,
      companyName: profileData.companyName,
      phone: profileData.phone,
      details: profileData.details,
    });

    return successResponse({ 
      userId: result.user.id, 
      companyName: result.profile.companyName 
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
