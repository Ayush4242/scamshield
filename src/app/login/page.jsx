"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/app/actions/auth";
import Link from "next/link";

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
    <div className="max-w-md mx-auto my-12 p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="text-sm text-muted-foreground">
          Log in to your secure ScamShield account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 text-sm transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          {isPending ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-400 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
