"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@receipts/shared-schemas/auth";
import styles from "@/components/Auth/auth.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  async function onSubmit(data: any) {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch {
      setError("Login failed");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} {...register("email")} />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input className={styles.input} type="password" {...register("password")} />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className={styles.link}>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
