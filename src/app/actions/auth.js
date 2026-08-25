"use server";

import { query } from "@/lib/db";
import { setSession, destroySession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Register a new user
 * @param {object} prevState 
 * @param {FormData} formData 
 */
export async function registerUser(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const validation = registerSchema.safeParse({ name, email, password, confirmPassword });
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      },
    };
  }

  try {
    // Check if duplicate user exists
    const existing = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return {
        success: false,
        errors: {
          email: "Email is already registered",
        },
      };
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Insert user
    const userId = crypto.randomUUID();
    await query(
      "INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)",
      [userId, name, email.toLowerCase(), passwordHash, "USER"]
    );

    // Fetch new user to set session
    const newUser = { id: userId, name, email: email.toLowerCase(), role: "USER" };
    await setSession(newUser);
  } catch (error) {
    console.error("Register Error:", error);
    return {
      success: false,
      error: "A database error occurred. Please try again.",
    };
  }

  // Redirect to dashboard on success
  redirect("/dashboard");
}

/**
 * Log in an existing user
 * @param {object} prevState 
 * @param {FormData} formData 
 */
export async function loginUser(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  try {
    const res = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const user = res.rows[0];

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    await setSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return {
      success: false,
      error: "A database error occurred. Please try again.",
    };
  }

  redirect("/dashboard");
}

/**
 * Log out current user
 */
export async function logoutUser() {
  await destroySession();
  redirect("/login");
}
