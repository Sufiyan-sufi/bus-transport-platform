"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Stop {
  id: string;
  name: string;
  orderIndex: number;
}

interface PricingEntry {
  fromStopId: string;
  toStopId: string;
  amount: number;
}

interface PricingMatrixProps {
  routeId: string;
  stops: Stop[];
  initialPricing: PricingEntry[];
}

export function PricingMatrix({ routeId, stops, initialPricing }: PricingMatrixProps) {
  const router = useRouter();
  const [pricing, setPricing] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pricingMap: Record<string, number> = {};
    initialPricing.forEach((p) => {
      pricingMap[`${p.fromStopId}-${p.toStopId}`] = p.amount;
    });
    setPricing(pricingMap);
  }, [initialPricing]);

  const handlePriceChange = (fromId: string, toId: string, value: string) => {
    const amount = parseFloat(value);
    setPricing((prev) => ({
      ...prev,
      [`${fromId}-${toId}`]: isNaN(amount) ? 0 : amount,
    }));
  };

  const onSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const pricingArray = Object.entries(pricing)
        .filter(([_, amount]) => amount > 0)
        .map(([key, amount]) => {
          const [fromStopId, toStopId] = key.split("-");
          return { fromStopId, toStopId, amount };
        });

      const response = await fetch(`/api/contractor/routes/${routeId}/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricing: pricingArray }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pricing");
      }

      router.refresh();
      router.push("/dashboard/routes");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pricing Matrix</CardTitle>
        <CardDescription>
          Set ticket prices between stop pairs. Prices only apply from left stops to top stops.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/50 w-[150px]">From \ To</TableHead>
                {stops.slice(1).map((stop) => (
                  <TableHead key={stop.id} className="min-w-[100px] text-center">
                    {stop.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stops.slice(0, -1).map((fromStop, rowIndex) => (
                <TableRow key={fromStop.id}>
                  <TableCell className="font-medium bg-muted/50">
                    {fromStop.name}
                  </TableCell>
                  {stops.slice(1).map((toStop, colIndex) => {
                    const isAvailable = fromStop.orderIndex < toStop.orderIndex;
                    const key = `${fromStop.id}-${toStop.id}`;

                    return (
                      <TableCell key={toStop.id} className="p-2 text-center">
                        {isAvailable ? (
                          <div className="flex items-center justify-center">
                            <span className="mr-1 text-sm text-muted-foreground">AED</span>
                            <Input
                              type="number"
                              className="w-20 text-center h-8"
                              value={pricing[key] || ""}
                              onChange={(e) => handlePriceChange(fromStop.id, toStop.id, e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save Pricing"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
