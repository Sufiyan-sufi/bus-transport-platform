"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

const STATUS_CONFIG = {
  TRIAL: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    text: "You're on a free trial. Activate your subscription to keep your routes visible.",
    bg: "from-amber-500/10 to-yellow-500/5 border-amber-500/20",
    textColor: "text-amber-300",
    showButton: true,
  },
  INACTIVE: {
    icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
    text: "Your subscription is inactive. Your routes are hidden from search results.",
    bg: "from-red-500/10 to-red-500/5 border-red-500/20",
    textColor: "text-red-300",
    showButton: true,
  },
  ACTIVE: null,
};

export function SubscriptionBanner({ initialStatus }: { initialStatus: "TRIAL" | "ACTIVE" | "INACTIVE" }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const config = STATUS_CONFIG[status];
  if (!config) return null;

  async function activate() {
    setLoading(true);
    try {
      const res = await fetch("/api/contractor/subscription", { method: "PATCH" });
      if (res.ok) setStatus("ACTIVE");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl border bg-gradient-to-r ${config.bg} px-5 py-4`}>
      <div className={`flex items-center gap-2 text-sm ${config.textColor}`}>
        {config.icon}
        {status === "ACTIVE" ? (
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Subscription active</span>
        ) : config.text}
      </div>
      {config.showButton && (
        <Button size="sm" onClick={activate} disabled={loading} className="shrink-0 bg-gradient-to-r from-sky-500 to-blue-600 border-0 gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          {loading ? "Activating..." : "Activate Subscription"}
        </Button>
      )}
    </div>
  );
}
