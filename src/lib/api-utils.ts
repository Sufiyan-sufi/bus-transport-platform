import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400, errors: any = null) {
  return NextResponse.json(
    { success: false, message, errors },
    { status }
  );
}

export function handleApiError(error: any) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return errorResponse("Validation failed", 400, error.issues);
  }

  return errorResponse(
    process.env.NODE_ENV === "development" ? error.message : "Internal Server Error",
    500
  );
}
