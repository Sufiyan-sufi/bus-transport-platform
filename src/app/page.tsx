import { RouteSearch } from "@/components/features/search/RouteSearch";
import { Shield, Zap, BarChart3, ArrowRight, Bus, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass border border-sky-500/20 rounded-full px-4 py-2 text-sm text-sky-400">
              <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
              Next-Generation Corporate Mobility
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <span className="text-foreground">Corporate</span>
              <br />
              <span className="gradient-text animate-gradient">Transport</span>
              <br />
              <span className="text-foreground">Reimagined</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Search routes, book seats, and manage your entire corporate fleet — all in one beautifully designed platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#search"
                className="group flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/40 hover:scale-105"
              >
                <Bus className="w-5 h-5" />
                Find Your Route
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/signup/contractor"
                className="flex items-center gap-2 glass border border-white/10 hover:border-sky-500/30 text-foreground font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white/5"
              >
                <Users className="w-5 h-5" />
                Become a Partner
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto pt-8">
              {[
                { value: "500+", label: "Daily Routes" },
                { value: "10K+", label: "Happy Commuters" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="container mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">
            <span className="gradient-text">Search</span> Available Routes
          </h2>
          <p className="text-muted-foreground">Select your pickup and drop-off to find the perfect route</p>
        </div>
        <RouteSearch />
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">How It <span className="gradient-text">Works</span></h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Get moving in minutes — whether you're an employee or a transport provider</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Employee flow */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-sky-400" /> For Employees</h3>
            <div className="space-y-4">
              {[
                { step: "1", title: "Search Your Route", desc: "Pick your pickup and drop-off stop to see available buses and seat availability." },
                { step: "2", title: "Book a Seat", desc: "Choose a route, select your start date, and confirm your booking in one click." },
                { step: "3", title: "Ride & Track", desc: "Get confirmation, wait for contractor approval, and enjoy your daily commute." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 glass border border-white/5 rounded-2xl p-5">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-sky-500/25">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contractor CTA */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/15 via-card to-sky-500/10 border border-white/10 p-8 space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="p-3 glass rounded-2xl w-fit border border-white/10">
                <Bus className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black">List Your Buses</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  Are you a transport company? Join our platform, create routes, set your pricing, and start accepting bookings from corporate employees today.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Create routes with custom stops", "Set stop-to-stop pricing", "Manage bookings from your dashboard"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup/contractor"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-violet-500/25 transition-all hover:scale-105"
              >
                <Bus className="w-4 h-4" />
                List Your Buses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Why Choose <span className="gradient-text">BusTransport?</span></h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Everything you need for seamless corporate mobility management</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield className="w-7 h-7" />,
              title: "Safe & Reliable",
              desc: "Vetted contractors, modern buses, and real-time tracking for your daily commute.",
              color: "from-sky-500/20 to-blue-500/10",
              iconColor: "text-sky-400",
              glow: "hover:shadow-sky-500/10",
            },
            {
              icon: <Zap className="w-7 h-7" />,
              title: "Instant Booking",
              desc: "One-click booking with instant confirmation, seat allocation, and digital passes.",
              color: "from-violet-500/20 to-purple-500/10",
              iconColor: "text-violet-400",
              glow: "hover:shadow-violet-500/10",
            },
            {
              icon: <BarChart3 className="w-7 h-7" />,
              title: "Transparent Pricing",
              desc: "Stop-to-stop pricing matrix with zero hidden charges. Pay exactly what you see.",
              color: "from-emerald-500/20 to-green-500/10",
              iconColor: "text-emerald-400",
              glow: "hover:shadow-emerald-500/10",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`gradient-border card-hover p-8 rounded-2xl bg-gradient-to-br ${feature.color} hover:shadow-2xl ${feature.glow} transition-all duration-300`}
            >
              <div className={`${feature.iconColor} mb-5 p-3 glass rounded-xl w-fit`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500/20 via-blue-600/20 to-violet-500/20 border border-white/10 p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-violet-500/5 animate-gradient" />
          <div className="relative z-10 space-y-6">
            <div className="flex justify-center">
              <MapPin className="w-12 h-12 text-sky-400 animate-float" />
            </div>
            <h2 className="text-4xl font-black">Ready to Transform Your Commute?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Join thousands of employees already using BusTransport for their daily commute.
            </p>
            <Link
              href="/auth/signup/contractor"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 transition-all"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
