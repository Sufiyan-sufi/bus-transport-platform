"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signupSchema, contractorProfileSchema } from "@/validators";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Bus, ArrowRight, UserPlus } from "lucide-react";

const formSchema = signupSchema.merge(contractorProfileSchema);

export function ContractorSignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", role: "CONTRACTOR", companyName: "", phone: "", details: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/signup/contractor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-12 bg-white/5 border-white/10 focus:border-sky-500/50 rounded-xl transition-all";

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-3">
        <div className="bg-gradient-to-br from-violet-400 to-purple-600 p-2.5 rounded-xl">
          <Bus className="w-6 h-6 text-white" />
        </div>
        <span className="font-black text-xl gradient-text">BusTransport</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black">Create partner account</h1>
        <p className="text-muted-foreground">Register your transport company to start listing routes</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="border-red-500/20 bg-red-500/10">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <FormField control={form.control} name="companyName" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Name</FormLabel>
              <FormControl><Input placeholder="Al Reem Transport LLC" className={inputClass} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</FormLabel>
              <FormControl><Input placeholder="contact@company.com" className={inputClass} {...field} /></FormControl>
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

          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</FormLabel>
              <FormControl><Input placeholder="+971 50 123 4567" className={inputClass} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 border-0 rounded-xl font-bold text-base shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-[1.02] gap-2"
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

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
          Sign in →
        </Link>
      </p>
    </div>
  );
}
