import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bus, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Building2, 
  Hash, 
  Globe, 
  Info,
  ArrowLeft,
  Download
} from "lucide-react";
import Link from "next/link";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id: bookingId } = await params;

  if (!session) {
    redirect("/login");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      route: {
        include: {
          contractor: true,
        },
      },
      fromStop: true,
      toStop: true,
    },
  });

  if (!booking || (booking.employeeId !== (session.user as any).id && (session.user as any).role !== "ADMIN")) {
    notFound();
  }

  // Fetch pricing for this specific pair
  const pricing = await prisma.pricing.findFirst({
    where: {
      routeId: booking.routeId,
      fromStopId: booking.fromStopId,
      toStopId: booking.toStopId,
    },
  });

  // Mock payment instructions (matching the API route created previously)
  const paymentInstructions = {
    bankName: "Emirates NBD",
    accountName: "Qoderx Transport Services",
    accountNumber: "1234567890",
    iban: "AE12 0000 0000 1234 5678 90",
    swiftCode: "ENBD AEAD",
    instructions: "Please mention your Booking ID in the transfer remarks. Send transfer proof to payments@qoderx.com",
  };

  const amount = pricing ? Number(pricing.amount) : 0;

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Confirmation</h1>
          <p className="text-muted-foreground">Booking ID: <code className="font-mono bg-muted px-1 rounded">{booking.id}</code></p>
        </div>
        <Badge variant={booking.status === "CONFIRMED" ? "default" : "outline"} className="px-4 py-1 text-sm">
          {booking.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-primary/5">
                <Bus className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-bold">{booking.route.name}</p>
                  <p className="text-xs text-muted-foreground">Operated by {booking.route.contractor.companyName}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="w-0.5 h-8 bg-muted" />
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Pickup</p>
                        <p className="font-medium text-sm">{booking.fromStop.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Drop-off</p>
                        <p className="font-medium text-sm">{booking.toStop.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Commencement</p>
                      <p className="font-medium text-sm">{new Date(booking.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <CreditCard className="w-5 h-5" />
                Payment Instructions
              </CardTitle>
              <CardDescription>
                Transfer the total amount to the bank account below to secure your seat.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 border rounded bg-background">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Bank Name
                  </p>
                  <p className="text-sm font-semibold">{paymentInstructions.bankName}</p>
                </div>
                <div className="p-3 border rounded bg-background">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Account Name
                  </p>
                  <p className="text-sm font-semibold">{paymentInstructions.accountName}</p>
                </div>
                <div className="p-3 border rounded bg-background">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Account Number
                  </p>
                  <p className="text-sm font-semibold font-mono">{paymentInstructions.accountNumber}</p>
                </div>
                <div className="p-3 border rounded bg-background">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Hash className="w-3 h-3" /> IBAN
                  </p>
                  <p className="text-sm font-semibold font-mono">{paymentInstructions.iban}</p>
                </div>
              </div>

              <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed italic">
                  {paymentInstructions.instructions}
                </p>
              </div>

              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-lg border-2 border-primary">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-center font-black tracking-tighter uppercase italic">Amount Due</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <span className="text-4xl font-black text-primary">AED {amount.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fare ({booking.fromStop.name} - {booking.toStop.name})</span>
                  <span>AED {amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">VAT (5%)</span>
                  <span className="text-green-600 font-medium">INCLUDED</span>
                </div>
                <div className="pt-2 border-t flex justify-between items-center font-bold">
                  <span>Grand Total</span>
                  <span className="text-lg text-primary">AED {amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-[10px] text-yellow-800">
                <p className="font-bold flex items-center gap-1">
                  <Info className="w-3 h-3" /> DEADLINE
                </p>
                <p className="mt-1">Payments must be cleared 24 hours before the commencement date.</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Need Help?</p>
            <Button variant="link" className="text-xs h-auto p-0 underline">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
