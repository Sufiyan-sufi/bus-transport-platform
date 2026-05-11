import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MapPin, Users, Clock, Bus, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function RouteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id: routeId } = await params;
  const { from, to } = await searchParams;

  const route = await prisma.route.findUnique({
    where: { id: routeId },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
      },
      schedules: true,
      contractor: true,
      pricing: {
        where: {
          AND: [
            { fromStop: { name: from || "" } },
            { toStop: { name: to || "" } },
          ],
        },
      },
    },
  });

  if (!route) {
    notFound();
  }

  const price = route.pricing[0]?.amount;

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Route Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold mb-2">
              <Bus className="w-5 h-5" />
              <span>{route.contractor.companyName}</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">{route.name}</h1>
            <p className="text-muted-foreground mt-2">
              Daily transport service with {route.capacity} seats capacity.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Route Itinerary</CardTitle>
              <CardDescription>All stops in sequence for this route.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 relative">
                {route.stops.map((stop, index) => {
                  const isSelected = stop.name === from || stop.name === to;
                  const isOrigin = stop.name === from;
                  const isDestination = stop.name === to;

                  return (
                    <div key={stop.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          isOrigin ? "bg-green-500 border-green-500 ring-4 ring-green-100" :
                          isDestination ? "bg-red-500 border-red-500 ring-4 ring-red-100" :
                          "bg-background border-muted group-hover:border-primary"
                        }`} />
                        {index !== route.stops.length - 1 && (
                          <div className="w-0.5 h-12 bg-muted group-hover:bg-primary/20 transition-colors" />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={`font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                          {stop.name}
                          {isOrigin && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Your Pickup</span>}
                          {isDestination && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Your Drop-off</span>}
                        </p>
                        {stop.location && <p className="text-sm text-muted-foreground">{stop.location}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Standard operating hours for this route.</CardDescription>
            </CardHeader>
            <CardContent>
              {route.schedules.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">No specific schedules listed. Contact operator for timings.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {route.schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center gap-3 p-4 border rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-bold">{schedule.departureTime}</p>
                        <p className="text-xs text-muted-foreground">{schedule.frequency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Booking Summary Card */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-primary/20 shadow-xl overflow-hidden">
            <div className="bg-primary text-primary-foreground p-6">
              <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">One-way Booking</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold">AED</span>
                <span className="text-5xl font-black">{price ? Number(price).toFixed(2) : "--"}</span>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Origin</p>
                    <p className="font-semibold">{from || "Not Selected"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Destination</p>
                    <p className="font-semibold">{to || "Not Selected"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span className="font-medium">AED {price ? Number(price).toFixed(2) : "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="pt-2 border-t flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black text-primary">AED {price ? Number(price).toFixed(2) : "0.00"}</span>
                </div>
              </div>

              {!session ? (
                <Button asChild className="w-full py-6 text-lg">
                  <Link href={`/login?callbackUrl=/routes/${routeId}?from=${from}&to=${to}`}>
                    Login to Book
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full py-6 text-lg">
                  <Link href={`/routes/${routeId}/book?from=${from}&to=${to}`}>
                    Proceed to Booking
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              )}
              
              <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Secure Booking via Platform
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50 border-none">
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="w-10 h-10 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-semibold">{route.capacity} seats available</p>
                <p className="text-xs text-muted-foreground">Limited availability for peak hours.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
