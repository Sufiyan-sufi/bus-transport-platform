import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, MapPin, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function RoutesPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "CONTRACTOR") {
    redirect("/login");
  }

  const contractorProfile = await prisma.contractorProfile.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      routes: {
        include: {
          stops: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  if (!contractorProfile) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Routes</h1>
          <p className="text-muted-foreground">View and manage your transport routes.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/routes/new">
            <Plus className="w-4 h-4 mr-2" />
            New Route
          </Link>
        </Button>
      </div>

      {contractorProfile.routes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No routes found</h2>
          <p className="text-muted-foreground mb-6">Start by creating your first bus route.</p>
          <Button asChild>
            <Link href="/dashboard/routes/new">Create Route</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {contractorProfile.routes.map((route) => (
            <div key={route.id} className="p-6 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{route.name}</h2>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  route.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {route.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Capacity: {route.capacity} seats</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Stops: {route.stops.length}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/dashboard/routes/${route.id}`}>Edit Details</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/dashboard/routes/${route.id}/pricing`}>Manage Pricing</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
