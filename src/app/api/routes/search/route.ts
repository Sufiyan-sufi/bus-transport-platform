import { NextResponse } from "next/server";
import { RouteService } from "@/services/route.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json({ error: "From and To stops are required" }, { status: 400 });
    }

    const routes = await RouteService.searchRoutes(from, to);
    return NextResponse.json(routes);
  } catch (error) {
    console.error("Route search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
