import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookingList } from "@/components/features/dashboard/BookingList";
import { SubscriptionBanner } from "@/components/features/dashboard/SubscriptionBanner";
import { Bus, Calendar, Users, ArrowRight, MapPin, Plus, TrendingUp, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userRole = (session.user as any).role;
  const userId = (session.user as any).id;

  if (userRole === "CONTRACTOR") {
    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: { userId },
      include: {
        routes: {
          include: {
            bookings: {
              include: {
                employee: { select: { email: true } },
                route: true,
                fromStop: true,
                toStop: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!contractorProfile) redirect("/auth/signup/contractor");

    const allBookings = contractorProfile.routes.flatMap((r) => r.bookings as any[]);
    const pendingCount = allBookings.filter((b) => b.status === "PENDING").length;
    const confirmedCount = allBookings.filter((b) => b.status === "CONFIRMED").length;

    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-white/5 bg-gradient-to-r from-sky-500/5 to-violet-500/5">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sky-400 text-sm font-medium mb-2">
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                  Contractor Dashboard
                </div>
                <h1 className="text-3xl font-black">{contractorProfile.companyName}</h1>
                <p className="text-muted-foreground mt-1">Manage your fleet and bookings</p>
              </div>
              <Button asChild className="bg-gradient-to-r from-sky-500 to-blue-600 border-0 shadow-lg shadow-sky-500/25 gap-2 self-start md:self-auto">
                <Link href="/dashboard/routes/new"><Plus className="w-4 h-4" />Add New Route</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 gap-2 self-start md:self-auto">
                <Link href="/dashboard/fleet"><Bus className="w-4 h-4" />Fleet</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                label: "Active Routes",
                value: contractorProfile.routes.length,
                icon: <Bus className="w-5 h-5" />,
                color: "from-sky-500/20 to-blue-500/10",
                iconColor: "text-sky-400",
                border: "border-sky-500/20",
                link: "/dashboard/routes",
              },
              {
                label: "Pending Requests",
                value: pendingCount,
                icon: <Clock className="w-5 h-5" />,
                color: "from-amber-500/20 to-yellow-500/10",
                iconColor: "text-amber-400",
                border: "border-amber-500/20",
                link: null,
              },
              {
                label: "Confirmed Bookings",
                value: confirmedCount,
                icon: <TrendingUp className="w-5 h-5" />,
                color: "from-emerald-500/20 to-green-500/10",
                iconColor: "text-emerald-400",
                border: "border-emerald-500/20",
                link: null,
              },
              {
                label: "Total Bookings",
                value: allBookings.length,
                icon: <Users className="w-5 h-5" />,
                color: "from-violet-500/20 to-purple-500/10",
                iconColor: "text-violet-400",
                border: "border-violet-500/20",
                link: null,
              },
            ].map((stat) => (
              <div key={stat.label} className={`gradient-border card-hover rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} p-6`}>
                <div className={`${stat.iconColor} mb-4 p-2.5 glass rounded-xl w-fit`}>{stat.icon}</div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                {stat.link && (
                  <Link href={stat.link} className={`flex items-center gap-1 text-xs ${stat.iconColor} mt-3 hover:underline`}>
                    Manage <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Subscription Banner */}
          <SubscriptionBanner initialStatus={contractorProfile.subscriptionStatus} />

          {/* Bookings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Booking Requests</h2>
              <Button variant="outline" asChild size="sm" className="border-white/10 hover:bg-white/5 gap-2">
                <Link href="/dashboard/routes"><Bus className="w-4 h-4" />View All Routes</Link>
              </Button>
            </div>
            <BookingList initialBookings={allBookings} />
          </div>
        </div>
      </div>
    );
  }

  // Employee Dashboard
  const employeeBookings = await prisma.booking.findMany({
    where: { employeeId: userId },
    include: { route: true, fromStop: true, toStop: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-r from-sky-500/5 to-violet-500/5">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-sm font-medium mb-2">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                Employee Dashboard
              </div>
              <h1 className="text-3xl font-black">My Bookings</h1>
              <p className="text-muted-foreground mt-1">{session.user?.email}</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-sky-500 to-blue-600 border-0 shadow-lg shadow-sky-500/25 gap-2 self-start md:self-auto">
              <Link href="/"><Bus className="w-4 h-4" />Find New Route</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {employeeBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
            <div className="p-6 glass rounded-3xl border border-white/10">
              <Bus className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
              <p className="text-muted-foreground max-w-sm">Start your commute by searching for a bus route that fits your schedule.</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-sky-500 to-blue-600 border-0 gap-2">
              <Link href="/"><Bus className="w-4 h-4" />Search Routes</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employeeBookings.map((booking) => {
              const statusConfig = {
                PENDING: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
                CONFIRMED: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
                CANCELLED: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-400" },
              }[booking.status] ?? { color: "text-muted-foreground", bg: "bg-white/5 border-white/10", dot: "bg-muted-foreground" };

              return (
                <div key={booking.id} className="gradient-border card-hover rounded-2xl bg-card border border-white/5 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-lg">{booking.route.name}</h3>
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>Starts {new Date(booking.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <div className="w-px h-5 bg-white/10" />
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium leading-none">{booking.fromStop.name}</p>
                          <p className="font-medium leading-none text-muted-foreground">{booking.toStop.name}</p>
                        </div>
                      </div>
                    </div>

                    {booking.status === "PENDING" && (
                      <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400">
                        <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        Awaiting contractor confirmation and payment instructions.
                      </div>
                    )}

                    <Button asChild variant="outline" size="sm" className="w-full border-white/10 hover:bg-white/5 gap-2">
                      <Link href={`/bookings/${booking.id}/confirmation`}>
                        <MapPin className="w-4 h-4" />View Details & Pay
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
