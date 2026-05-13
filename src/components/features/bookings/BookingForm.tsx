"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { bookingSchema } from "@/validators";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, CheckCircle2 } from "lucide-react";

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  routeId: string;
  routeName: string;
  fromStopId: string;
  fromStopName: string;
  toStopId: string;
  toStopName: string;
  price: number;
}

export function BookingForm({
  routeId,
  routeName,
  fromStopId,
  fromStopName,
  toStopId,
  toStopName,
  price,
}: BookingFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      routeId,
      fromStopId,
      toStopId,
      startDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<BookingFormValues> = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200 bg-green-50">
        <CardContent className="pt-12 pb-12 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-green-800">Booking Requested!</h2>
          <p className="text-green-700">
            Your booking for <strong>{routeName}</strong> has been submitted.
            Wait for contractor confirmation.
          </p>
          <p className="text-sm text-green-600 animate-pulse">Redirecting to dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle>Confirm Your Booking</CardTitle>
        <CardDescription>Review your trip details and select a start date.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8 p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Route</span>
            <span className="font-bold">{routeName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">From</span>
            <span className="font-bold">{fromStopName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">To</span>
            <span className="font-bold">{toStopName}</span>
          </div>
          <div className="pt-2 border-t flex justify-between items-center">
            <span className="font-bold">Total Price</span>
            <span className="text-xl font-black text-primary">AED {price.toFixed(2)}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Commencement Date
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      min={new Date().toISOString().split("T")[0]}
                      {...field}
                      value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4">
              <p className="text-xs text-muted-foreground text-center">
                By clicking confirm, you agree to the transport policy and platform terms.
              </p>
              <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => router.back()}
                disabled={loading}
              >
                Go Back
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
