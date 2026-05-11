"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Bus, Menu, X, LayoutDashboard, Search, LogOut, UserPlus, LogIn } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = session?.user as any;

  const navLinks = [
    { label: "Search Routes", href: "/", icon: <Search className="w-4 h-4" />, show: true },
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, show: !!session },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-gradient-to-br from-sky-400 to-blue-600 p-2 rounded-xl">
                <Bus className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg gradient-text">BusTransport</span>
              <span className="block text-[10px] text-muted-foreground tracking-widest uppercase -mt-1">Corporate Mobility</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.filter(l => l.show).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-8 w-32 animate-pulse rounded-lg bg-white/5" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="glass px-3 py-1.5 rounded-lg border border-white/10">
                  <p className="text-xs font-semibold text-foreground">{user.email}</p>
                  <p className="text-[10px] text-sky-400 uppercase tracking-wider">{user.role}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="gap-2 border-white/10 hover:bg-white/5 hover:border-red-500/50 hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="gap-2 hover:bg-white/5">
                  <Link href="/login"><LogIn className="w-4 h-4" />Login</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="gap-2 border-white/10 hover:bg-white/5">
                  <Link href="/auth/signup/employee"><UserPlus className="w-4 h-4" />Sign Up</Link>
                </Button>
                <Button size="sm" asChild className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-0 shadow-lg shadow-sky-500/25">
                  <Link href="/auth/signup/contractor"><UserPlus className="w-4 h-4" />Partner with Us</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden border-t border-white/5 glass transition-all duration-300",
        isMenuOpen ? "block" : "hidden"
      )}>
        <div className="container mx-auto px-4 py-4 space-y-2">
          {navLinks.filter(l => l.show).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
            >
              {link.icon}{link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/5">
            {session ? (
              <div className="space-y-2">
                <div className="p-3 glass rounded-lg border border-white/10">
                  <p className="text-xs font-bold">{user.email}</p>
                  <p className="text-[10px] text-sky-400 uppercase">{user.role}</p>
                </div>
                <Button variant="outline" className="w-full gap-2 border-white/10" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="w-4 h-4" />Logout
                </Button>
              </div>
            ) : (
              <div className="grid gap-2">
                <Button variant="outline" className="w-full gap-2 border-white/10" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login"><LogIn className="w-4 h-4" />Login</Link>
                </Button>
                <Button className="w-full gap-2 bg-gradient-to-r from-sky-500 to-blue-600 border-0" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/auth/signup/contractor"><UserPlus className="w-4 h-4" />Partner with Us</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
