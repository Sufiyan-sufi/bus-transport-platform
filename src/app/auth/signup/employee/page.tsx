"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/validators";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Bus, ArrowRight, UserPlus, Search, Calendar, Shield } from "lucide-react";

export default function EmployeeSignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-12 bg-white/5 border-white/10 focus:border-sky-500/50 rounded-xl transition-all";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-card to-emerald-500/5 border-r border-white/5 flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 max-w-md space-y-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-2xl shadow-lg shadow-sky-500/30">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="font-black text-2xl gradient-text">BusTransport</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">Employee Portal</div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black leading-tight">
              Your daily commute,<br /><span className="gradient-text">simplified</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Create a free account to search routes, book seats, and manage your corporate transport.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: <Search className="w-5 h-5 text-sky-400" />, title: "Search available routes", desc: "Find buses that match your commute" },
              { icon: <Calendar className="w-5 h-5 text-emerald-400" />, title: "Book in seconds", desc: "One-click booking with instant confirmation" },
              { icon: <Shield className="w-5 h-5 text-violet-400" />, title: "Track your bookings", desc: "View status and payment details anytime" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 glass border border-white/5 rounded-xl px-4 py-4">
                <div className="mt-0.5 shrink-0">{item.icon}</div>
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
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2.5 rounded-xl">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl gradient-text">BusTransport</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black">Create employee account</h1>
            <p className="text-muted-foreground">Sign up to start booking your corporate bus</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Work Email</FormLabel>
                  <FormControl><Input placeholder="you@company.com" className={inputClass} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" className={inputClass} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0 rounded-xl font-bold text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:scale-[1.02] gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <><UserPlus className="w-5 h-5" />Create Account<ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </form>
          </Form>

          <div className="space-y-3 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">Sign in →</Link>
            </p>
            <p>
              Are you a transport company?{" "}
              <Link href="/auth/signup/contractor" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Partner with us →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
