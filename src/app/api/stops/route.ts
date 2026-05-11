import { NextResponse } from "next/server";
import { StopService } from "@/services/stop.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stops = await StopService.getUniqueStops();
    return NextResponse.json(stops);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
