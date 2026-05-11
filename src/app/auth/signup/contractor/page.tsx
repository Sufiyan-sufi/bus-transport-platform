import { ContractorSignupForm } from "@/components/features/auth/ContractorSignupForm";
import { Bus, MapPin, TrendingUp, Star } from "lucide-react";

export default function ContractorSignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-blue-600/10 to-sky-500/10 border-r border-white/5 flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-sky-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 max-w-md space-y-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-400 to-purple-600 p-3 rounded-2xl shadow-lg shadow-violet-500/30">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="font-black text-2xl gradient-text">BusTransport</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">Partner Program</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black leading-tight">
              Grow your fleet<br /><span className="gradient-text">with us</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join our network of trusted transport contractors and connect with thousands of corporate clients.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: <MapPin className="w-5 h-5 text-sky-400" />, title: "List unlimited routes", desc: "Add stops, schedules, and pricing" },
              { icon: <TrendingUp className="w-5 h-5 text-violet-400" />, title: "Grow your revenue", desc: "Access corporate clients instantly" },
              { icon: <Star className="w-5 h-5 text-amber-400" />, title: "Premium dashboard", desc: "Manage bookings in real-time" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 glass border border-white/5 rounded-xl px-4 py-4">
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <ContractorSignupForm />
      </div>
    </div>
  );
}
