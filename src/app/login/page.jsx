"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/app/actions/auth";
import Link from "next/link";
import { Lock, Mail, ShieldAlert, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await loginUser(null, formData);
      if (response && !response.success) {
        setError(response.error || "Invalid credentials");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 glass-card rounded-2xl shadow-2xl space-y-6 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

      <div className="space-y-2 text-center">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 mx-auto flex items-center justify-center text-blue-400 mb-3">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Welcome Back</h2>
        <p className="text-xs text-slate-400 font-medium">
          Sign in to your ScamShield account to evaluate threats.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-3 px-4 text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </button>
      </form>

      <p className="text-xs text-center text-slate-400 font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4">
          Register here
        </Link>
      </p>
    </div>
  );
}
