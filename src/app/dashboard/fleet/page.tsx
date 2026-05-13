"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, Plus, Truck } from "lucide-react";

interface BusRecord {
  id: string;
  type: "MINI" | "STANDARD" | "COACH";
  capacity: number;
  plateNumber: string | null;
}

const BUS_TYPE_LABELS = { MINI: "Mini Bus", STANDARD: "Standard", COACH: "Coach" };
const BUS_TYPE_COLORS = { MINI: "text-sky-400 bg-sky-500/10", STANDARD: "text-emerald-400 bg-emerald-500/10", COACH: "text-violet-400 bg-violet-500/10" };

export default function FleetPage() {
  const [buses, setBuses] = useState<BusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ type: "STANDARD", capacity: "", plateNumber: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contractor/buses")
      .then((r) => r.json())
      .then((d) => setBuses(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contractor/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: form.type, capacity: Number(form.capacity), plateNumber: form.plateNumber || undefined }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      const bus = await res.json();
      setBuses((prev) => [bus, ...prev]);
      setForm({ type: "STANDARD", capacity: "", plateNumber: "" });
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Fleet Management</h1>
          <p className="text-muted-foreground mt-1">Manage your buses</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="bg-gradient-to-r from-sky-500 to-blue-600 border-0 gap-2">
          <Plus className="w-4 h-4" /> Add Bus
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-8 glass border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-lg">New Bus</h2>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MINI">Mini Bus</SelectItem>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="COACH">Coach</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capacity</label>
              <Input type="number" min={1} placeholder="e.g. 30" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} className="bg-white/5 border-white/10 rounded-xl" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plate Number</label>
              <Input placeholder="Optional" value={form.plateNumber} onChange={(e) => setForm((f) => ({ ...f, plateNumber: e.target.value }))} className="bg-white/5 border-white/10 rounded-xl" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-sky-500 to-blue-600 border-0">
              {submitting ? "Adding..." : "Add Bus"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : buses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 glass border border-white/10 rounded-3xl">
          <div className="p-5 glass rounded-2xl border border-white/10"><Truck className="w-10 h-10 text-muted-foreground" /></div>
          <div>
            <p className="font-semibold text-lg">No buses yet</p>
            <p className="text-muted-foreground text-sm mt-1">Add your first bus to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map((bus) => (
            <div key={bus.id} className="glass border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 rounded-lg"><Bus className="w-5 h-5 text-sky-400" /></div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${BUS_TYPE_COLORS[bus.type]}`}>{BUS_TYPE_LABELS[bus.type]}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Capacity</span><span className="font-semibold">{bus.capacity} seats</span></div>
                {bus.plateNumber && <div className="flex justify-between"><span className="text-muted-foreground">Plate</span><span className="font-semibold">{bus.plateNumber}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
