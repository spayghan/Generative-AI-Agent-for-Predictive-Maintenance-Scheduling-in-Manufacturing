import { create } from "zustand";

export type UserRole = "admin" | "user";

export interface AuthUser {
  email: string;
  role: UserRole;
  name: string;
}

const USERS: Record<string, { password: string; role: UserRole; name: string }> = {
  "admin@factory.com": { password: "admin123", role: "admin", name: "Admin" },
  "user@factory.com": { password: "user123", role: "user", name: "Employee" },
};

interface AuthState {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  })(),

  login: (email, password) => {
    const entry = USERS[email.toLowerCase()];
    if (!entry || entry.password !== password) {
      return { success: false, error: "Invalid email or password" };
    }
    const user: AuthUser = { email: email.toLowerCase(), role: entry.role, name: entry.name };
    localStorage.setItem("auth_user", JSON.stringify(user));
    set({ user });
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem("auth_user");
    set({ user: null });
  },
}));
