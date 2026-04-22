"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@receipts/shared-schemas/auth";
import styles from "@/components/Auth/auth.module.css";
import { registerUser } from "@/lib/auth";

const extendedSchema = RegisterSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(extendedSchema),
  });

  async function onSubmit(data: any) {
    try {
      await registerUser(data.email, data.password);
      await login(data.email, data.password);
      router.push("/");
    } catch {
      setError("Registration failed");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} {...register("email")} />
          <span className={styles.helper}>
            Must be a valid email address (used for login)
          </span>
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input className={styles.input} type="password" {...register("password")} />
          <span className={styles.helper}>
            Choose a strong password (at least 6 characters)
          </span>
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Confirm Password</label>
          <input
            className={styles.input}
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p className={styles.link}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
