"use client";

import { useState, useTransition } from "react";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await registerUser(null, formData);
      if (response && !response.success) {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setGlobalError(response.error || "Registration failed");
        }
      }
    });
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="text-sm text-muted-foreground">
          Join ScamShield to analyze link and message security risks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Jane Doe"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
          )}
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
          {errors.password && (
            <p className="text-xs text-rose-400 mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {globalError && (
          <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-md">
            {globalError}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 text-sm transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          {isPending ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
