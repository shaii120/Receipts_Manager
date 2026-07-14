"use client";

import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu"

export default function UserHeader() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return null;

  return <UserMenu />;
}
