"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "@/validators";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Bus, ArrowRight, Shield, Zap, Users, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
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
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (result?.error) throw new Error("Invalid email or password");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-blue-600/10 to-violet-500/10 border-r border-white/5 flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 max-w-md space-y-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-2xl shadow-lg shadow-sky-500/30">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="font-black text-2xl gradient-text">BusTransport</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">Corporate Mobility</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black leading-tight">
              Welcome back to<br /><span className="gradient-text">smarter commuting</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Access your dashboard, manage bookings, and keep your team moving.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: <Shield className="w-5 h-5 text-sky-400" />, text: "Enterprise-grade security" },
              { icon: <Zap className="w-5 h-5 text-violet-400" />, text: "Real-time booking updates" },
              { icon: <Users className="w-5 h-5 text-emerald-400" />, text: "Manage your entire fleet" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 glass border border-white/5 rounded-xl px-4 py-3">
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2.5 rounded-xl">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl gradient-text">BusTransport</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black">Sign in</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          {registered && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 text-sm">
              <Shield className="w-4 h-4 shrink-0" />
              Registration successful! Please sign in.
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@company.com"
                        className="h-12 bg-white/5 border-white/10 focus:border-sky-500/50 focus:bg-white/8 rounded-xl transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-12 bg-white/5 border-white/10 focus:border-sky-500/50 rounded-xl transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0 rounded-xl font-bold text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all hover:scale-[1.02] gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="space-y-2 text-center text-sm text-muted-foreground">
            <p>
              New employee?{" "}
              <Link href="/auth/signup/employee" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                Create account →
              </Link>
            </p>
            <p>
              Transport company?{" "}
              <Link href="/auth/signup/contractor" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Partner with us →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
