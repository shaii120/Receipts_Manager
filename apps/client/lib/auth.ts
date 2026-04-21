import { apiFetch } from './api';
import { UserPublic } from '@receipts/shared-schemas/auth';

export async function login(email: string, password: string) {
  return apiFetch<UserPublic>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiFetch<string>("/api/auth/logout", {
    method: "POST",
  });
}

export async function registerUser(email: string, password: string) {
  return apiFetch<UserPublic>("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe() {
  return apiFetch<UserPublic>("/api/auth/me");
}
