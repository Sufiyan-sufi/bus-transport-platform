import { RouteForm } from "@/components/features/routes/RouteForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewRoutePage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "CONTRACTOR") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Route</h1>
        <p className="text-muted-foreground">Set up a new transport route and its stops.</p>
      </div>
      <RouteForm />
    </div>
  );
}
