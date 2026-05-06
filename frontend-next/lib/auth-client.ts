"use client";

import type { AuthResponse, User } from "@/lib/types";

const tokenKey = "vistamart_token";
const userKey = "vistamart_user";

export function saveSession(session: AuthResponse) {
  localStorage.setItem(tokenKey, session.accessToken);
  localStorage.setItem(userKey, JSON.stringify(session.user));
  window.dispatchEvent(new Event("vistamart-auth"));
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(userKey);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function clearSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  window.dispatchEvent(new Event("vistamart-auth"));
}
