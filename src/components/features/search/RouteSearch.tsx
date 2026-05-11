"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Search, Bus, ArrowRight, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Stop { name: string }
interface Route {
  id: string;
  name: string;
  capacity: number;
  stops: { name: string; orderIndex: number }[];
  pricing: { fromStopId: string; toStopId: string; amount: string }[];
  contractor: { companyName: string };
}

export function RouteSearch() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [results, setResults] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetch("/api/stops")
      .then((res) => res.json())
      .then((data) => setStops(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!fromStop || !toStop) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/routes/search?from=${fromStop}&to=${toStop}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Search Card */}
      <div className="gradient-border rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-br from-sky-500/10 via-card to-violet-500/5 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/30">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Find Your Route</h3>
              <p className="text-xs text-muted-foreground">Select pickup and drop-off to see available buses</p>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                From
              </label>
              <Select onValueChange={setFromStop} value={fromStop}>
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-sky-500/50 transition-all">
                  <SelectValue placeholder="Select pickup point" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  {stops.map((s) => (
                    <SelectItem key={s.name} value={s.name} className="focus:bg-white/5">
                      <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-400" />{s.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end pb-3 justify-center">
              <div className="p-2 glass rounded-full border border-white/10">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                To
              </label>
              <Select onValueChange={setToStop} value={toStop}>
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-sky-500/50 transition-all">
                  <SelectValue placeholder="Select drop-off point" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  {stops.map((s) => (
                    <SelectItem key={s.name} value={s.name} disabled={s.name === fromStop} className="focus:bg-white/5">
                      <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-red-400" />{s.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              disabled={loading || !fromStop || !toStop}
              className="h-12 px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0 rounded-xl font-bold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:scale-[1.02] gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {results.length > 0 ? (
                <><span className="gradient-text">{results.length}</span> route{results.length !== 1 ? "s" : ""} found</>
              ) : "No routes found"}
            </h2>
            <div className="text-sm text-muted-foreground glass border border-white/5 px-3 py-1.5 rounded-full">
              {fromStop} → {toStop}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 gradient-border rounded-3xl bg-card">
              <div className="p-5 glass rounded-2xl border border-white/10">
                <Bus className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">No routes available</p>
                <p className="text-muted-foreground text-sm mt-1">Try different pickup or drop-off points</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((route) => (
                <div key={route.id} className="gradient-border card-hover rounded-2xl bg-card border border-white/5 overflow-hidden group">
                  <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
                  <div className="p-6 space-y-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-500/10 rounded-lg">
                          <Bus className="w-4 h-4 text-sky-400" />
                        </div>
                        <span className="font-bold">{route.name}</span>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full font-medium">Active</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
                        <div className="w-px h-6 bg-gradient-to-b from-emerald-400/50 to-red-400/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400 ring-2 ring-red-400/20" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="glass border border-white/5 rounded-lg px-3 py-2 text-sm font-medium">{fromStop}</div>
                        <div className="glass border border-white/5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground">{toStop}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{route.capacity} seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[120px]">{route.contractor.companyName}</span>
                      </div>
                    </div>

                    <Button asChild className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0 rounded-xl gap-2 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/30 transition-all">
                      <Link href={`/routes/${route.id}?from=${fromStop}&to=${toStop}`}>
                        Book Now <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
